import { Hono } from 'hono';
import { DatabaseService } from '../lib/database';
import { Env, ApiResponse } from '../types';

export const paymentsRoutes = new Hono<{ Bindings: Env }>();

// Create payment intent
paymentsRoutes.post('/create-intent', async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { bookingId, amount, currency = 'USD' } = body;
    
    if (!bookingId || !amount) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking ID and amount are required' 
      }, 400);
    }
    
    if (amount <= 0) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Amount must be greater than 0' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    // Verify booking belongs to user and is payable
    const booking = await db.queryFirst(
      'SELECT status, payment_status, total_price FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    );
    
    if (!booking) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking not found' 
      }, 404);
    }
    
    if (booking.status === 'cancelled') {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Cannot pay for cancelled booking' 
      }, 400);
    }
    
    if (booking.payment_status === 'paid') {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking is already paid' 
      }, 400);
    }
    
    // Verify amount matches booking total
    const expectedAmount = Math.round(parseFloat(booking.total_price) * 100); // Convert to cents
    const requestedAmount = Math.round(parseFloat(amount) * 100);
    
    if (requestedAmount !== expectedAmount) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Amount does not match booking total' 
      }, 400);
    }
    
    // Create Stripe payment intent
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: requestedAmount.toString(),
        currency: currency.toLowerCase(),
        automatic_payment_methods: JSON.stringify({ enabled: true }),
        metadata: JSON.stringify({ 
          bookingId: bookingId.toString(),
          userId: userId.toString() 
        }),
        description: `ShakesTravel booking #${bookingId}`,
      }),
    });
    
    const paymentIntent = await stripeResponse.json();
    
    if (!stripeResponse.ok) {
      console.error('Stripe error:', paymentIntent);
      return c.json<ApiResponse>({ 
        success: false,
        error: paymentIntent.error?.message || 'Payment intent creation failed' 
      }, 500);
    }
    
    // Store payment record
    await db.execute(
      `INSERT INTO payments (booking_id, stripe_payment_intent_id, amount, currency, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        paymentIntent.id,
        amount,
        currency,
        paymentIntent.status,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    return c.json<ApiResponse>({ 
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: requestedAmount,
        currency
      }
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Payment creation failed' 
    }, 500);
  }
});

// Confirm payment (webhook handler)
paymentsRoutes.post('/webhook', async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');
    
    if (!signature) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Missing Stripe signature' 
      }, 400);
    }
    
    // Verify webhook signature (simplified - implement proper verification in production)
    // const expectedSignature = computeStripeSignature(body, c.env.STRIPE_WEBHOOK_SECRET);
    
    const event = JSON.parse(body);
    
    const db = new DatabaseService(c.env);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const metadata = paymentIntent.metadata;
        const bookingId = parseInt(metadata.bookingId);
        
        if (bookingId) {
          // Update payment record
          await db.execute(
            'UPDATE payments SET status = ?, updated_at = ? WHERE stripe_payment_intent_id = ?',
            ['succeeded', new Date().toISOString(), paymentIntent.id]
          );
          
          // Update booking status
          await db.execute(
            'UPDATE bookings SET payment_status = ?, status = ?, updated_at = ? WHERE id = ?',
            ['paid', 'confirmed', new Date().toISOString(), bookingId]
          );
          
          console.log(`Payment succeeded for booking ${bookingId}`);
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        const failedMetadata = failedIntent.metadata;
        const failedBookingId = parseInt(failedMetadata.bookingId);
        
        if (failedBookingId) {
          // Update payment record
          await db.execute(
            'UPDATE payments SET status = ?, updated_at = ? WHERE stripe_payment_intent_id = ?',
            ['failed', new Date().toISOString(), failedIntent.id]
          );
          
          // Update booking payment status
          await db.execute(
            'UPDATE bookings SET payment_status = ?, updated_at = ? WHERE id = ?',
            ['failed', new Date().toISOString(), failedBookingId]
          );
          
          console.log(`Payment failed for booking ${failedBookingId}`);
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return c.json<ApiResponse>({ 
      success: true,
      message: 'Webhook processed successfully' 
    });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Webhook processing failed' 
    }, 500);
  }
});

// Get payment status
paymentsRoutes.get('/status/:bookingId', async (c) => {
  try {
    const userId = c.get('userId');
    const bookingId = parseInt(c.req.param('bookingId'));
    
    if (!bookingId || bookingId < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid booking ID' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    // Verify booking belongs to user
    const booking = await db.queryFirst(
      'SELECT payment_status FROM bookings WHERE id = ? AND user_id = ?',
      [bookingId, userId]
    );
    
    if (!booking) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking not found' 
      }, 404);
    }
    
    // Get payment details
    const payment = await db.queryFirst(
      'SELECT amount, currency, status, stripe_payment_intent_id, created_at FROM payments WHERE booking_id = ?',
      [bookingId]
    );
    
    return c.json<ApiResponse>({
      success: true,
      data: {
        bookingPaymentStatus: booking.payment_status,
        payment: payment || null
      }
    });
    
  } catch (error) {
    console.error('Get payment status error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch payment status' 
    }, 500);
  }
});