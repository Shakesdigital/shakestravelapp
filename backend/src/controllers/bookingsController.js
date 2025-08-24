const { catchAsync, AppError, ValidationError, AuthorizationError } = require('../middleware/errorHandler');
const { Booking, Trip, Accommodation, User, Payment } = require('../models');
const { logger, businessLogger } = require('../utils/logger');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

/**
 * Bookings Controller
 * 
 * Handles booking creation, management, and status updates
 * Includes availability checking, price calculation, and payment processing
 */

/**
 * Create a new booking
 * POST /api/bookings
 */
const createBooking = catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const {
    itemId,
    itemType,
    dates,
    guests,
    roomType,
    additionalServices,
    specialRequests,
    contactInfo,
    emergencyContact
  } = req.body;

  // Validate item type
  if (!['Trip', 'Accommodation'].includes(itemType)) {
    throw new ValidationError('Invalid item type. Must be Trip or Accommodation');
  }

  try {
    // Find the item (trip or accommodation)
    const Model = itemType === 'Trip' ? Trip : Accommodation;
    const item = await Model.findById(itemId).populate(
      itemType === 'Trip' ? 'providerId' : 'hostId', 
      'firstName lastName hostProfile.businessInfo'
    );

    if (!item) {
      throw new AppError(`${itemType} not found`, 404);
    }

    if (item.status !== 'active' || !item.verification.isVerified) {
      throw new AppError(`${itemType} is not available for booking`, 400);
    }

    // Prevent hosts from booking their own items
    const ownerId = itemType === 'Trip' ? item.providerId._id : item.hostId._id;
    if (ownerId.toString() === req.user.id) {
      throw new ValidationError('You cannot book your own listing');
    }

    // Validate dates
    const startDate = new Date(dates.startDate || dates.checkIn);
    const endDate = new Date(dates.endDate || dates.checkOut);

    if (startDate >= endDate) {
      throw new ValidationError('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new ValidationError('Start date cannot be in the past');
    }

    // Check availability
    const availabilityCheck = await checkItemAvailability(item, itemType, {
      startDate,
      endDate,
      guests: guests.total,
      roomType
    });

    if (!availabilityCheck.isAvailable) {
      throw new ValidationError('Selected dates are not available', {
        reason: availabilityCheck.reason,
        availableDates: availabilityCheck.alternatives
      });
    }

    // Calculate pricing
    const pricingDetails = calculateBookingPrice(item, itemType, {
      startDate,
      endDate,
      guests: guests.total,
      roomType,
      additionalServices
    });

    // Generate booking number
    const bookingNumber = generateBookingNumber();
    const confirmationCode = generateConfirmationCode();

    // Create booking data
    const bookingData = {
      userId: req.user.id,
      itemId,
      itemType,
      bookingNumber,
      confirmationCode,
      status: 'pending',
      dates: {
        startDate,
        endDate,
        duration: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      },
      guests,
      pricing: pricingDetails,
      contactInfo: {
        ...contactInfo,
        email: req.user.email // Use authenticated user's email
      },
      emergencyContact,
      specialRequests,
      additionalServices: additionalServices || [],
      paymentStatus: 'pending'
    };

    // Add specific details based on item type
    if (itemType === 'Trip') {
      bookingData.tripDetails = {
        title: item.title,
        startDate,
        endDate,
        duration: item.duration,
        difficulty: item.difficulty,
        groupSize: item.groupSize,
        meetingPoint: item.location,
        providerId: item.providerId._id
      };
    } else {
      bookingData.accommodationDetails = {
        title: item.title,
        checkIn: startDate,
        checkOut: endDate,
        nights: Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
        roomType: roomType || 'standard',
        roomDetails: availabilityCheck.roomDetails,
        hostId: item.hostId._id
      };
    }

    const booking = new Booking(bookingData);
    await booking.save();

    // Update item availability (temporary hold)
    await updateItemAvailability(item, itemType, {
      startDate,
      endDate,
      roomType,
      action: 'hold',
      bookingId: booking._id
    });

    // Populate booking details for response
    await booking.populate([
      {
        path: 'userId',
        select: 'firstName lastName email profile.avatar'
      },
      {
        path: 'itemId',
        select: 'title location pricing media'
      }
    ]);

    logger.info('Booking created successfully', {
      bookingId: booking._id,
      userId: req.user.id,
      itemType,
      itemId,
      bookingNumber,
      totalPrice: pricingDetails.total
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: booking.toJSON(),
        paymentInstructions: {
          amount: pricingDetails.total,
          currency: pricingDetails.currency,
          deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours to complete payment
          methods: ['credit_card', 'mobile_money', 'bank_transfer']
        }
      }
    });

  } catch (error) {
    logger.error('Failed to create booking', {
      userId: req.user.id,
      itemType,
      itemId,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get user's bookings
 * GET /api/bookings
 */
const getUserBookings = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    itemType,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { userId: req.user.id };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by item type
  if (itemType) {
    query.itemType = itemType;
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const bookings = await Booking.find(query)
    .populate('itemId', 'title location media pricing reviews')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      bookings,
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
 * Get single booking by ID
 * GET /api/bookings/:id
 */
const getBookingById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id)
    .populate('userId', 'firstName lastName email profile.avatar')
    .populate('itemId', 'title description location media pricing')
    .populate('payments');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check if user can access this booking
  const canAccess = booking.userId._id.toString() === req.user.id ||
                   await canManageBooking(req.user.id, booking) ||
                   ['admin', 'superadmin'].includes(req.user.role);

  if (!canAccess) {
    throw new AuthorizationError('You can only access your own bookings');
  }

  res.status(200).json({
    success: true,
    data: {
      booking: booking.toJSON()
    }
  });
});

/**
 * Update booking status
 * PATCH /api/bookings/:id/status
 */
const updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const allowedStatuses = ['confirmed', 'cancelled', 'completed', 'no_show'];
  if (!allowedStatuses.includes(status)) {
    throw new ValidationError('Invalid status');
  }

  const booking = await Booking.findById(id)
    .populate('itemId')
    .populate('userId', 'firstName lastName email');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Check permissions
  const canUpdate = await canManageBooking(req.user.id, booking) ||
                   booking.userId._id.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);

  if (!canUpdate) {
    throw new AuthorizationError('You cannot update this booking');
  }

  // Validate status transitions
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['completed', 'cancelled', 'no_show'],
    'cancelled': [], // Cannot change from cancelled
    'completed': [], // Cannot change from completed
    'no_show': []   // Cannot change from no_show
  };

  if (!validTransitions[booking.status].includes(status)) {
    throw new ValidationError(`Cannot change status from ${booking.status} to ${status}`);
  }

  const oldStatus = booking.status;
  booking.status = status;
  booking.statusHistory.push({
    status,
    changedBy: req.user.id,
    changedAt: new Date(),
    reason
  });

  // Handle status-specific logic
  if (status === 'confirmed') {
    // Confirm availability and create payment requirement
    booking.confirmedAt = new Date();
    await updateItemAvailability(booking.itemId, booking.itemType, {
      startDate: booking.dates.startDate,
      endDate: booking.dates.endDate,
      roomType: booking.accommodationDetails?.roomType,
      action: 'confirm',
      bookingId: booking._id
    });
  }

  if (status === 'cancelled') {
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    
    // Release availability
    await updateItemAvailability(booking.itemId, booking.itemType, {
      startDate: booking.dates.startDate,
      endDate: booking.dates.endDate,
      roomType: booking.accommodationDetails?.roomType,
      action: 'release',
      bookingId: booking._id
    });

    // Handle refunds if payment was made
    if (booking.paymentStatus === 'completed') {
      // TODO: Process refund based on cancellation policy
    }
  }

  if (status === 'completed') {
    booking.completedAt = new Date();
  }

  await booking.save();

  logger.info('Booking status updated', {
    bookingId: booking._id,
    oldStatus,
    newStatus: status,
    updatedBy: req.user.id,
    reason
  });

  res.status(200).json({
    success: true,
    message: `Booking ${status} successfully`,
    data: {
      booking: booking.toJSON()
    }
  });
});

/**
 * Cancel booking
 * POST /api/bookings/:id/cancel
 */
const cancelBooking = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const booking = await Booking.findById(id).populate('itemId');

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  // Only user who made the booking can cancel
  if (booking.userId.toString() !== req.user.id) {
    throw new AuthorizationError('You can only cancel your own bookings');
  }

  if (!['pending', 'confirmed'].includes(booking.status)) {
    throw new ValidationError('Booking cannot be cancelled in current status');
  }

  // Check cancellation policy
  const cancellationPolicy = booking.itemId.policies?.cancellation || {};
  const now = new Date();
  const timeDiff = booking.dates.startDate - now;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  let refundPercentage = 0;
  if (cancellationPolicy.freeCancellation && daysDiff >= cancellationPolicy.freeCancellation.daysBefore) {
    refundPercentage = 100;
  } else if (cancellationPolicy.refundPolicy) {
    // Apply tiered refund policy based on timing
    for (const tier of cancellationPolicy.refundPolicy) {
      if (daysDiff >= tier.daysBefore) {
        refundPercentage = tier.refundPercentage;
        break;
      }
    }
  }

  booking.status = 'cancelled';
  booking.cancelledAt = new Date();
  booking.cancellationReason = reason;
  booking.refund = {
    amount: (booking.pricing.total * refundPercentage) / 100,
    percentage: refundPercentage,
    status: 'pending'
  };

  await booking.save();

  // Release availability
  await updateItemAvailability(booking.itemId, booking.itemType, {
    startDate: booking.dates.startDate,
    endDate: booking.dates.endDate,
    roomType: booking.accommodationDetails?.roomType,
    action: 'release',
    bookingId: booking._id
  });

  logger.info('Booking cancelled', {
    bookingId: booking._id,
    userId: req.user.id,
    refundAmount: booking.refund.amount,
    reason
  });

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking: booking.toJSON(),
      refund: booking.refund
    }
  });
});

/**
 * Get host/provider bookings
 * GET /api/bookings/manage
 */
const getManageableBookings = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    itemType,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Find items owned by this user
  const tripIds = await Trip.find({ providerId: req.user.id }).select('_id');
  const accommodationIds = await Accommodation.find({ hostId: req.user.id }).select('_id');

  const itemIds = [
    ...tripIds.map(trip => trip._id),
    ...accommodationIds.map(acc => acc._id)
  ];

  if (itemIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        bookings: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          total: 0,
          limit: parseInt(limit)
        }
      }
    });
  }

  const query = { itemId: { $in: itemIds } };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by item type
  if (itemType) {
    query.itemType = itemType;
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const bookings = await Booking.find(query)
    .populate('userId', 'firstName lastName email profile.avatar')
    .populate('itemId', 'title location media')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Booking.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    }
  });
});

// Helper functions

/**
 * Check if item is available for booking
 */
async function checkItemAvailability(item, itemType, options) {
  const { startDate, endDate, guests, roomType } = options;

  if (itemType === 'Trip') {
    // Check trip availability
    const availableSlot = item.availability.dates.find(slot => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);
      return slotStart <= startDate && slotEnd >= endDate && slot.availableSpots >= guests;
    });

    if (!availableSlot) {
      return {
        isAvailable: false,
        reason: 'No available slots for selected dates',
        alternatives: item.availability.dates.filter(slot => slot.availableSpots >= guests)
      };
    }

    return {
      isAvailable: true,
      slot: availableSlot
    };
  } else {
    // Check accommodation availability
    const targetRoom = item.rooms.types.find(room => 
      !roomType || room.name === roomType
    );

    if (!targetRoom) {
      return {
        isAvailable: false,
        reason: 'Requested room type not available'
      };
    }

    if (targetRoom.capacity.maxGuests < guests) {
      return {
        isAvailable: false,
        reason: 'Room capacity exceeded'
      };
    }

    // Check each day in the date range
    for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
      const availability = targetRoom.availability.find(avail => 
        avail.date.toDateString() === date.toDateString()
      );
      
      if (!availability || !availability.isAvailable || availability.availableRooms <= 0) {
        return {
          isAvailable: false,
          reason: `No rooms available on ${date.toDateString()}`
        };
      }
    }

    return {
      isAvailable: true,
      roomDetails: {
        name: targetRoom.name,
        capacity: targetRoom.capacity,
        amenities: targetRoom.amenities
      }
    };
  }
}

/**
 * Calculate booking price
 */
function calculateBookingPrice(item, itemType, options) {
  const { startDate, endDate, guests, additionalServices = [] } = options;
  
  let basePrice = 0;
  let serviceFees = 0;
  let taxes = 0;

  if (itemType === 'Trip') {
    basePrice = item.pricing.basePrice * guests;
    
    // Apply group discounts
    if (item.pricing.groupDiscounts) {
      for (const discount of item.pricing.groupDiscounts) {
        if (guests >= discount.minGuests) {
          basePrice *= (1 - discount.discountPercentage / 100);
          break;
        }
      }
    }
  } else {
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    basePrice = item.pricing.basePrice * nights;
    
    // Apply seasonal pricing
    if (item.pricing.seasonalRates) {
      // TODO: Apply seasonal rates based on dates
    }
  }

  // Add additional services
  additionalServices.forEach(service => {
    serviceFees += service.price * (service.quantity || 1);
  });

  // Calculate service fees (platform fee)
  const platformFee = basePrice * 0.05; // 5% platform fee
  serviceFees += platformFee;

  // Calculate taxes
  taxes = (basePrice + serviceFees) * 0.18; // 18% VAT in Uganda

  const total = basePrice + serviceFees + taxes;

  return {
    basePrice,
    serviceFees,
    taxes,
    total,
    currency: item.pricing.currency || 'UGX',
    breakdown: {
      basePrice,
      platformFee,
      additionalServices: additionalServices.reduce((sum, service) => 
        sum + (service.price * (service.quantity || 1)), 0),
      taxes
    }
  };
}

/**
 * Update item availability
 */
async function updateItemAvailability(item, itemType, options) {
  const { startDate, endDate, roomType, action, bookingId } = options;

  if (itemType === 'Trip') {
    // Update trip availability
    const availabilitySlot = item.availability.dates.find(slot => {
      const slotStart = new Date(slot.startDate);
      const slotEnd = new Date(slot.endDate);
      return slotStart <= startDate && slotEnd >= endDate;
    });

    if (availabilitySlot) {
      if (action === 'hold' || action === 'confirm') {
        availabilitySlot.availableSpots -= 1;
      } else if (action === 'release') {
        availabilitySlot.availableSpots += 1;
      }
      await item.save();
    }
  } else {
    // Update accommodation availability
    const targetRoom = item.rooms.types.find(room => 
      !roomType || room.name === roomType
    );

    if (targetRoom) {
      for (let date = new Date(startDate); date < endDate; date.setDate(date.getDate() + 1)) {
        const availability = targetRoom.availability.find(avail => 
          avail.date.toDateString() === date.toDateString()
        );
        
        if (availability) {
          if (action === 'hold' || action === 'confirm') {
            availability.availableRooms -= 1;
            if (availability.availableRooms <= 0) {
              availability.isAvailable = false;
            }
          } else if (action === 'release') {
            availability.availableRooms += 1;
            availability.isAvailable = true;
          }
        }
      }
      await item.save();
    }
  }
}

/**
 * Check if user can manage booking
 */
async function canManageBooking(userId, booking) {
  if (booking.itemType === 'Trip') {
    const trip = await Trip.findById(booking.itemId);
    return trip && trip.providerId.toString() === userId;
  } else {
    const accommodation = await Accommodation.findById(booking.itemId);
    return accommodation && accommodation.hostId.toString() === userId;
  }
}

/**
 * Generate booking number
 */
function generateBookingNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `SHK${timestamp}${random}`;
}

/**
 * Generate confirmation code
 */
function generateConfirmationCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getManageableBookings
};