const { catchAsync, AppError, ValidationError } = require('../middleware/errorHandler');
const { Payment, Booking, User } = require('../models');
const { logger, businessLogger } = require('../utils/logger');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

/**
 * Payments Controller
 * 
 * Handles payment processing with TripAdvisor-inspired booking flow
 * Includes Stripe simulation, mobile money, and bank transfer options
 * Supports Uganda-specific payment methods
 */

/**
 * Create payment checkout session
 * POST /api/payments/checkout
 */
const createCheckout = catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const { bookingId, paymentMethod, returnUrl, currency = 'UGX' } = req.body;

  // Find the booking
  const booking = await Booking.findById(bookingId)
    .populate('userId', 'firstName lastName email')
    .populate('itemId', 'title pricing');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Verify user owns this booking
  if (booking.userId._id.toString() !== req.user.id) {
    throw new ValidationError('You can only pay for your own bookings');
  }

  // Check booking status
  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new ValidationError('This booking cannot be paid for in its current status');
  }

  // Check if payment already exists
  const existingPayment = await Payment.findOne({
    bookingId,
    status: { $in: ['pending', 'completed'] }
  });

  if (existingPayment) {
    if (existingPayment.status === 'completed') {
      throw new ValidationError('This booking has already been paid for');
    }
    
    // Return existing pending payment
    return res.status(200).json({
      success: true,
      message: 'Payment session already exists',
      data: {
        payment: existingPayment.toJSON(),
        checkoutUrl: existingPayment.provider.checkoutUrl
      }
    });
  }

  try {
    // Generate payment data
    const paymentNumber = generatePaymentNumber();
    const amount = booking.pricing.total;

    // Create payment record
    const paymentData = {
      userId: req.user.id,
      bookingId,
      paymentNumber,
      amount,
      currency,
      status: 'pending',
      paymentMethod,
      provider: {
        name: getProviderName(paymentMethod),
        transactionId: generateTransactionId(),
        checkoutUrl: null,
        metadata: {}
      },
      billing: {
        email: booking.userId.email,
        name: `${booking.userId.firstName} ${booking.userId.lastName}`,
        phone: booking.contactInfo?.phone
      }
    };

    // Process payment based on method
    let checkoutSession;
    switch (paymentMethod) {
      case 'stripe':
        checkoutSession = await processStripePayment(paymentData, booking, returnUrl);
        break;
      case 'mobile_money':
        checkoutSession = await processMobileMoneyPayment(paymentData, booking);
        break;
      case 'bank_transfer':
        checkoutSession = await processBankTransferPayment(paymentData, booking);
        break;
      default:
        throw new ValidationError('Unsupported payment method');
    }

    // Update payment with provider details
    paymentData.provider = { ...paymentData.provider, ...checkoutSession.provider };
    paymentData.expiresAt = checkoutSession.expiresAt;

    const payment = new Payment(paymentData);
    await payment.save();

    // Update booking payment status
    booking.paymentStatus = 'pending';
    booking.paymentId = payment._id;
    await booking.save();

    logger.info('Payment checkout created', {
      paymentId: payment._id,
      bookingId,
      userId: req.user.id,
      amount,
      paymentMethod,
      paymentNumber
    });

    res.status(201).json({
      success: true,
      message: 'Payment checkout created successfully',
      data: {
        payment: payment.toJSON(),
        checkoutUrl: checkoutSession.checkoutUrl,
        expiresAt: checkoutSession.expiresAt,
        instructions: checkoutSession.instructions
      }
    });

  } catch (error) {
    logger.error('Failed to create payment checkout', {
      bookingId,
      userId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Handle payment webhook (Stripe simulation)
 * POST /api/payments/webhook
 */
const handleWebhook = catchAsync(async (req, res) => {
  const { event, data } = req.body;
  const signature = req.headers['stripe-signature'] || req.headers['x-webhook-signature'];

  // In production, verify webhook signature
  if (!verifyWebhookSignature(req.rawBody, signature)) {
    throw new AppError('Invalid webhook signature', 400);
  }

  try {
    switch (event) {
      case 'payment.succeeded':
        await handlePaymentSuccess(data);
        break;
      case 'payment.failed':
        await handlePaymentFailure(data);
        break;
      case 'payment.cancelled':
        await handlePaymentCancellation(data);
        break;
      default:
        logger.warn('Unhandled webhook event', { event, data });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Webhook processing failed', { event, error: error.message });
    res.status(400).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Get payment status
 * GET /api/payments/:paymentId
 */
const getPaymentStatus = catchAsync(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId)
    .populate('bookingId', 'bookingNumber status')
    .populate('userId', 'firstName lastName email');

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Check if user can access this payment
  const canAccess = payment.userId._id.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);

  if (!canAccess) {
    throw new ValidationError('You can only access your own payments');
  }

  res.status(200).json({
    success: true,
    data: {
      payment: payment.toJSON()
    }
  });
});

/**
 * Get user's payments
 * GET /api/payments
 */
const getUserPayments = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentMethod,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { userId: req.user.id };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by payment method
  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const payments = await Payment.find(query)
    .populate('bookingId', 'bookingNumber itemType itemId status')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    }
  });
});

/**
 * Process refund
 * POST /api/payments/:paymentId/refund
 */
const processRefund = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  const payment = await Payment.findById(paymentId)
    .populate('bookingId')
    .populate('userId', 'firstName lastName email');

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Check permissions
  const canRefund = payment.userId._id.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);

  if (!canRefund) {
    throw new ValidationError('You cannot refund this payment');
  }

  if (payment.status !== 'completed') {
    throw new ValidationError('Can only refund completed payments');
  }

  const refundAmount = amount || payment.amount;
  
  if (refundAmount > payment.amount) {
    throw new ValidationError('Refund amount cannot exceed payment amount');
  }

  try {
    // Process refund based on payment method
    let refundResult;
    switch (payment.paymentMethod) {
      case 'stripe':
        refundResult = await processStripeRefund(payment, refundAmount, reason);
        break;
      case 'mobile_money':
        refundResult = await processMobileMoneyRefund(payment, refundAmount, reason);
        break;
      case 'bank_transfer':
        refundResult = await processBankTransferRefund(payment, refundAmount, reason);
        break;
      default:
        throw new AppError('Refund not supported for this payment method', 400);
    }

    // Create refund record
    const refund = {
      amount: refundAmount,
      reason,
      status: refundResult.status,
      refundId: refundResult.refundId,
      processedAt: new Date(),
      estimatedArrival: refundResult.estimatedArrival
    };

    payment.refunds = payment.refunds || [];
    payment.refunds.push(refund);

    // Update payment status if fully refunded
    if (refundAmount === payment.amount) {
      payment.status = 'refunded';
    }

    await payment.save();

    logger.info('Payment refund processed', {
      paymentId: payment._id,
      refundAmount,
      reason,
      refundId: refundResult.refundId
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund,
        payment: payment.toJSON()
      }
    });

  } catch (error) {
    logger.error('Failed to process refund', {
      paymentId,
      error: error.message
    });
    throw error;
  }
});

// Helper functions for payment processing

/**
 * Process Stripe payment (simulation)
 */
async function processStripePayment(paymentData, booking, returnUrl) {
  // Simulate Stripe API call
  const sessionId = `cs_test_${crypto.randomBytes(16).toString('hex')}`;
  const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;

  return {
    checkoutUrl,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    provider: {
      name: 'stripe',
      sessionId,
      checkoutUrl,
      metadata: {
        priceId: process.env.STRIPE_PRICE_ID,
        mode: 'payment',
        successUrl: returnUrl || `${process.env.FRONTEND_URL}/booking/success`,
        cancelUrl: returnUrl || `${process.env.FRONTEND_URL}/booking/cancel`
      }
    },
    instructions: [
      'Click the checkout link to complete payment',
      'You will be redirected to Stripe\'s secure payment page',
      'Payment must be completed within 24 hours'
    ]
  };
}

/**
 * Process Mobile Money payment (Uganda - MTN, Airtel)
 */
async function processMobileMoneyPayment(paymentData, booking) {
  // Simulate mobile money API integration
  const transactionRef = `MM${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return {
    checkoutUrl: null, // Mobile money doesn't use checkout URLs
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    provider: {
      name: 'mobile_money',
      transactionRef,
      metadata: {
        network: 'mtn', // Could be 'mtn' or 'airtel'
        shortCode: '*165*3#',
        merchantCode: 'SHKS001'
      }
    },
    instructions: [
      `Dial *165*3# on your MTN mobile phone`,
      `Select option 4 (Pay Bills)`,
      `Enter merchant code: SHKS001`,
      `Enter amount: ${paymentData.amount} UGX`,
      `Enter reference: ${transactionRef}`,
      `Complete with your PIN`,
      'Payment expires in 10 minutes'
    ]
  };
}

/**
 * Process Bank Transfer payment
 */
async function processBankTransferPayment(paymentData, booking) {
  const transferRef = `BT${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return {
    checkoutUrl: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    provider: {
      name: 'bank_transfer',
      transferRef,
      metadata: {
        bankName: 'Stanbic Bank Uganda',
        accountName: 'Shakes Travel Limited',
        accountNumber: '9030012345678',
        swiftCode: 'SBICUGKX'
      }
    },
    instructions: [
      'Transfer to: Stanbic Bank Uganda',
      'Account Name: Shakes Travel Limited',
      'Account Number: 9030012345678',
      'SWIFT Code: SBICUGKX',
      `Amount: ${paymentData.amount} UGX`,
      `Reference: ${transferRef}`,
      'Payment must be completed within 7 days',
      'Email transfer receipt to payments@shakestravel.com'
    ]
  };
}

/**
 * Handle successful payment
 */
async function handlePaymentSuccess(data) {
  const { paymentNumber, transactionId, amount } = data;
  
  const payment = await Payment.findOne({ paymentNumber });
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Update payment status
  payment.status = 'completed';
  payment.completedAt = new Date();
  payment.provider.transactionId = transactionId;
  await payment.save();

  // Update booking status
  const booking = await Booking.findById(payment.bookingId);
  if (booking) {
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    booking.confirmedAt = new Date();
    await booking.save();
  }

  logger.info('Payment completed successfully', {
    paymentId: payment._id,
    paymentNumber,
    transactionId,
    amount
  });
}

/**
 * Handle failed payment
 */
async function handlePaymentFailure(data) {
  const { paymentNumber, reason } = data;
  
  const payment = await Payment.findOne({ paymentNumber });
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  payment.status = 'failed';
  payment.failureReason = reason;
  payment.failedAt = new Date();
  await payment.save();

  logger.warn('Payment failed', {
    paymentId: payment._id,
    paymentNumber,
    reason
  });
}

/**
 * Generate unique payment number
 */
function generatePaymentNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `PAY${timestamp}${random}`;
}

/**
 * Generate transaction ID
 */
function generateTransactionId() {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
}

/**
 * Get provider name
 */
function getProviderName(paymentMethod) {
  const providers = {
    'stripe': 'stripe',
    'mobile_money': 'mobile_money',
    'bank_transfer': 'bank_transfer'
  };
  return providers[paymentMethod] || 'unknown';
}

/**
 * Verify webhook signature (placeholder)
 */
function verifyWebhookSignature(body, signature) {
  // In production, implement proper signature verification
  // For Stripe: stripe.webhooks.constructEvent(body, signature, endpointSecret)
  return true; // Simplified for demo
}

/**
 * Process Stripe refund (simulation)
 */
async function processStripeRefund(payment, amount, reason) {
  // Simulate Stripe refund API call
  const refundId = `re_${crypto.randomBytes(12).toString('hex')}`;
  
  return {
    status: 'pending',
    refundId,
    estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5-7 business days
  };
}

/**
 * Process mobile money refund (simulation)
 */
async function processMobileMoneyRefund(payment, amount, reason) {
  const refundId = `MMR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return {
    status: 'pending',
    refundId,
    estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
}

/**
 * Process bank transfer refund (simulation)
 */
async function processBankTransferRefund(payment, amount, reason) {
  const refundId = `BTR${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  return {
    status: 'pending',
    refundId,
    estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 business days
  };
}

module.exports = {
  createCheckout,
  handleWebhook,
  getPaymentStatus,
  getUserPayments,
  processRefund
};