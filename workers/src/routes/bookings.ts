import { Hono } from 'hono';
import { DatabaseService } from '../lib/database';
import { Env, Booking, ApiResponse } from '../types';

export const bookingsRoutes = new Hono<{ Bindings: Env }>();

// Get user's bookings
bookingsRoutes.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const url = new URL(c.req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const offset = (page - 1) * limit;
    const status = url.searchParams.get('status') || '';
    
    const db = new DatabaseService(c.env);
    
    let whereConditions = ['b.user_id = ?'];
    let queryParams = [userId];
    
    if (status) {
      whereConditions.push('b.status = ?');
      queryParams.push(status);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    const bookingsQuery = `
      SELECT b.*, 
             t.title as trip_title, t.destination as trip_destination, t.images as trip_images,
             a.name as accommodation_name, a.location as accommodation_location, a.images as accommodation_images
      FROM bookings b
      LEFT JOIN trips t ON b.trip_id = t.id
      LEFT JOIN accommodations a ON b.accommodation_id = a.id
      WHERE ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countQuery = `SELECT COUNT(*) as total FROM bookings b WHERE ${whereClause}`;
    
    const [bookingsResult, countResult] = await Promise.all([
      db.query(bookingsQuery, [...queryParams, limit, offset]),
      db.queryFirst(countQuery, queryParams)
    ]);
    
    const bookings = bookingsResult.results?.map((booking: any) => ({
      ...booking,
      trip: booking.trip_title ? {
        title: booking.trip_title,
        destination: booking.trip_destination,
        images: booking.trip_images ? JSON.parse(booking.trip_images) : []
      } : null,
      accommodation: booking.accommodation_name ? {
        name: booking.accommodation_name,
        location: booking.accommodation_location,
        images: booking.accommodation_images ? JSON.parse(booking.accommodation_images) : []
      } : null,
      // Remove redundant fields
      trip_title: undefined,
      trip_destination: undefined,
      trip_images: undefined,
      accommodation_name: undefined,
      accommodation_location: undefined,
      accommodation_images: undefined
    }));
    
    const totalCount = (countResult as any)?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);
    
    return c.json<ApiResponse>({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
    
  } catch (error) {
    console.error('Get bookings error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch bookings' 
    }, 500);
  }
});

// Get single booking by ID
bookingsRoutes.get('/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const bookingId = parseInt(c.req.param('id'));
    
    if (!bookingId || bookingId < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid booking ID' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    const booking = await db.queryFirst(
      `SELECT b.*, 
              t.title as trip_title, t.destination as trip_destination, t.images as trip_images, t.description as trip_description,
              a.name as accommodation_name, a.location as accommodation_location, a.images as accommodation_images,
              p.amount as payment_amount, p.status as payment_status, p.stripe_payment_intent_id
       FROM bookings b
       LEFT JOIN trips t ON b.trip_id = t.id
       LEFT JOIN accommodations a ON b.accommodation_id = a.id
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.id = ? AND b.user_id = ?`,
      [bookingId, userId]
    );
    
    if (!booking) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking not found' 
      }, 404);
    }
    
    const bookingData = {
      ...booking,
      trip: booking.trip_title ? {
        title: booking.trip_title,
        destination: booking.trip_destination,
        description: booking.trip_description,
        images: booking.trip_images ? JSON.parse(booking.trip_images) : []
      } : null,
      accommodation: booking.accommodation_name ? {
        name: booking.accommodation_name,
        location: booking.accommodation_location,
        images: booking.accommodation_images ? JSON.parse(booking.accommodation_images) : []
      } : null,
      payment: booking.payment_amount ? {
        amount: booking.payment_amount,
        status: booking.payment_status,
        stripePaymentIntentId: booking.stripe_payment_intent_id
      } : null
    };
    
    // Remove redundant fields
    const fieldsToRemove = [
      'trip_title', 'trip_destination', 'trip_images', 'trip_description',
      'accommodation_name', 'accommodation_location', 'accommodation_images',
      'payment_amount', 'payment_status', 'stripe_payment_intent_id'
    ];
    
    fieldsToRemove.forEach(field => {
      delete (bookingData as any)[field];
    });
    
    return c.json<ApiResponse>({
      success: true,
      data: { booking: bookingData }
    });
    
  } catch (error) {
    console.error('Get booking error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to fetch booking' 
    }, 500);
  }
});

// Create new booking
bookingsRoutes.post('/', async (c) => {
  try {
    const userId = c.get('userId');
    const body = await c.req.json();
    const { tripId, accommodationId, bookingDate, checkInDate, checkOutDate, groupSize, specialRequests } = body;
    
    // Validation
    if (!tripId && !accommodationId) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Either trip ID or accommodation ID is required' 
      }, 400);
    }
    
    if (!bookingDate) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Booking date is required' 
      }, 400);
    }
    
    if (!groupSize || groupSize < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Group size must be at least 1' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    let totalPrice = 0;
    let itemTitle = '';
    
    // Calculate price based on trip or accommodation
    if (tripId) {
      const trip = await db.queryFirst(
        'SELECT title, price_per_person, max_group_size, is_active FROM trips WHERE id = ?',
        [tripId]
      );
      
      if (!trip || !trip.is_active) {
        return c.json<ApiResponse>({ 
          success: false,
          error: 'Trip not found or inactive' 
        }, 404);
      }
      
      if (groupSize > trip.max_group_size) {
        return c.json<ApiResponse>({ 
          success: false,
          error: `Group size cannot exceed ${trip.max_group_size}` 
        }, 400);
      }
      
      totalPrice = trip.price_per_person * groupSize;
      itemTitle = trip.title;
    }
    
    if (accommodationId) {
      if (!checkInDate || !checkOutDate) {
        return c.json<ApiResponse>({ 
          success: false,
          error: 'Check-in and check-out dates are required for accommodations' 
        }, 400);
      }
      
      const accommodation = await db.queryFirst(
        'SELECT name, price_per_night, max_guests, is_active FROM accommodations WHERE id = ?',
        [accommodationId]
      );
      
      if (!accommodation || !accommodation.is_active) {
        return c.json<ApiResponse>({ 
          success: false,
          error: 'Accommodation not found or inactive' 
        }, 404);
      }
      
      if (groupSize > accommodation.max_guests) {
        return c.json<ApiResponse>({ 
          success: false,
          error: `Group size cannot exceed ${accommodation.max_guests}` 
        }, 400);
      }
      
      // Calculate nights
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nights < 1) {
        return c.json<ApiResponse>({ 
          success: false,
          error: 'Check-out date must be after check-in date' 
        }, 400);
      }
      
      totalPrice = accommodation.price_per_night * nights;
      itemTitle = accommodation.name;
    }
    
    // Create booking
    const result = await db.execute(
      `INSERT INTO bookings (
        user_id, trip_id, accommodation_id, booking_date, check_in_date, check_out_date,
        group_size, total_price, special_requests, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        tripId || null,
        accommodationId || null,
        bookingDate,
        checkInDate || null,
        checkOutDate || null,
        groupSize,
        totalPrice,
        specialRequests || null,
        new Date().toISOString(),
        new Date().toISOString()
      ]
    );
    
    if (!result.success) {
      throw new Error('Failed to create booking');
    }
    
    return c.json<ApiResponse>({
      success: true,
      data: {
        booking: {
          id: result.meta.last_row_id,
          itemTitle,
          totalPrice,
          status: 'pending',
          paymentStatus: 'pending'
        }
      },
      message: 'Booking created successfully'
    });
    
  } catch (error) {
    console.error('Create booking error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to create booking' 
    }, 500);
  }
});

// Cancel booking
bookingsRoutes.patch('/:id/cancel', async (c) => {
  try {
    const userId = c.get('userId');
    const bookingId = parseInt(c.req.param('id'));
    const body = await c.req.json();
    const { cancellationReason } = body;
    
    if (!bookingId || bookingId < 1) {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Invalid booking ID' 
      }, 400);
    }
    
    const db = new DatabaseService(c.env);
    
    // Check if booking exists and belongs to user
    const booking = await db.queryFirst(
      'SELECT status, payment_status FROM bookings WHERE id = ? AND user_id = ?',
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
        error: 'Booking is already cancelled' 
      }, 400);
    }
    
    if (booking.status === 'completed') {
      return c.json<ApiResponse>({ 
        success: false,
        error: 'Cannot cancel completed booking' 
      }, 400);
    }
    
    // Update booking status
    await db.execute(
      'UPDATE bookings SET status = ?, cancellation_reason = ?, updated_at = ? WHERE id = ?',
      ['cancelled', cancellationReason || 'Cancelled by user', new Date().toISOString(), bookingId]
    );
    
    return c.json<ApiResponse>({
      success: true,
      message: 'Booking cancelled successfully'
    });
    
  } catch (error) {
    console.error('Cancel booking error:', error);
    return c.json<ApiResponse>({ 
      success: false,
      error: 'Failed to cancel booking' 
    }, 500);
  }
});