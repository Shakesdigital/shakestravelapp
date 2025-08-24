const { body, param, query, validationResult } = require('express-validator');

/**
 * API Validation Schemas
 * 
 * Express-validator schemas for trips, accommodations, bookings, and reviews
 * Following TripAdvisor-like validation patterns
 */

// Common validation patterns
const commonValidators = {
  objectId: param('id').isMongoId().withMessage('Invalid ID format'),
  
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ],

  location: [
    body('location.address').notEmpty().withMessage('Address is required'),
    body('location.city').notEmpty().withMessage('City is required'),
    body('location.region').notEmpty().withMessage('Region is required'),
    body('location.country').optional().isIn(['Uganda']).withMessage('Only Uganda is supported'),
    body('location.coordinates.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('location.coordinates.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude')
  ],

  pricing: [
    body('pricing.basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('pricing.currency').optional().isIn(['UGX', 'USD', 'EUR']).withMessage('Invalid currency'),
    body('pricing.discounts').optional().isArray().withMessage('Discounts must be an array')
  ],

  media: [
    body('media.photos').optional().isArray().withMessage('Photos must be an array'),
    body('media.videos').optional().isArray().withMessage('Videos must be an array')
  ]
};

// Trip validation schemas
const tripValidators = {
  // Create trip
  createTrip: [
    body('title')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    
    body('category')
      .isIn(['safari', 'hiking', 'cultural', 'adventure', 'wildlife', 'nature', 'photography'])
      .withMessage('Invalid category'),
    
    body('duration.days')
      .isInt({ min: 1, max: 30 })
      .withMessage('Duration must be between 1 and 30 days'),
    
    body('difficulty')
      .isIn(['easy', 'moderate', 'challenging', 'extreme'])
      .withMessage('Invalid difficulty level'),
    
    body('groupSize.min')
      .isInt({ min: 1 })
      .withMessage('Minimum group size must be at least 1'),
    
    body('groupSize.max')
      .isInt({ min: 1 })
      .withMessage('Maximum group size must be at least 1')
      .custom((value, { req }) => {
        if (value < req.body.groupSize?.min) {
          throw new Error('Maximum group size must be greater than minimum');
        }
        return true;
      }),
    
    body('inclusions')
      .isArray({ min: 1 })
      .withMessage('At least one inclusion is required'),
    
    body('exclusions')
      .optional()
      .isArray()
      .withMessage('Exclusions must be an array'),
    
    body('itinerary')
      .isArray({ min: 1 })
      .withMessage('Itinerary is required'),
    
    body('itinerary.*.day')
      .isInt({ min: 1 })
      .withMessage('Day must be a positive integer'),
    
    body('itinerary.*.title')
      .trim()
      .notEmpty()
      .withMessage('Itinerary day title is required'),
    
    body('availability.dates')
      .isArray({ min: 1 })
      .withMessage('At least one availability date is required'),
    
    body('languages')
      .optional()
      .isArray()
      .withMessage('Languages must be an array'),
    
    ...commonValidators.location,
    ...commonValidators.pricing,
    ...commonValidators.media
  ],

  // Update trip
  updateTrip: [
    commonValidators.objectId,
    body('title')
      .optional()
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    
    body('category')
      .optional()
      .isIn(['safari', 'hiking', 'cultural', 'adventure', 'wildlife', 'nature', 'photography'])
      .withMessage('Invalid category'),
    
    body('difficulty')
      .optional()
      .isIn(['easy', 'moderate', 'challenging', 'extreme'])
      .withMessage('Invalid difficulty level')
  ],

  // Get trips
  getTrips: [
    ...commonValidators.pagination,
    query('search').optional().trim().isLength({ min: 2 }).withMessage('Search term must be at least 2 characters'),
    query('category').optional().isIn(['safari', 'hiking', 'cultural', 'adventure', 'wildlife', 'nature', 'photography']),
    query('difficulty').optional().isIn(['easy', 'moderate', 'challenging', 'extreme']),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be positive'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be positive'),
    query('minRating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    query('sortBy').optional().isIn(['createdAt', 'pricing.basePrice', 'reviews.averageRating', 'title']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ],

  // Get trip by ID
  getTripById: [
    param('identifier').notEmpty().withMessage('Trip identifier is required')
  ]
};

// Accommodation validation schemas
const accommodationValidators = {
  // Create accommodation
  createAccommodation: [
    body('title')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    
    body('type')
      .isIn(['hotel', 'guesthouse', 'lodge', 'camp', 'resort', 'hostel', 'apartment'])
      .withMessage('Invalid accommodation type'),
    
    body('category')
      .isIn(['budget', 'mid-range', 'luxury', 'backpacker'])
      .withMessage('Invalid category'),
    
    body('rooms.types')
      .isArray({ min: 1 })
      .withMessage('At least one room type is required'),
    
    body('rooms.types.*.name')
      .trim()
      .notEmpty()
      .withMessage('Room name is required'),
    
    body('rooms.types.*.capacity.maxGuests')
      .isInt({ min: 1, max: 20 })
      .withMessage('Room capacity must be between 1 and 20 guests'),
    
    body('rooms.types.*.pricing.basePrice')
      .isFloat({ min: 0 })
      .withMessage('Room price must be positive'),
    
    body('amenities.list')
      .isArray()
      .withMessage('Amenities list is required'),
    
    body('policies.checkIn')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-in time must be in HH:MM format'),
    
    body('policies.checkOut')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Check-out time must be in HH:MM format'),
    
    ...commonValidators.location,
    ...commonValidators.pricing,
    ...commonValidators.media
  ],

  // Update accommodation
  updateAccommodation: [
    commonValidators.objectId,
    body('title')
      .optional()
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Title must be between 10 and 200 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 50, max: 2000 })
      .withMessage('Description must be between 50 and 2000 characters'),
    
    body('type')
      .optional()
      .isIn(['hotel', 'guesthouse', 'lodge', 'camp', 'resort', 'hostel', 'apartment'])
      .withMessage('Invalid accommodation type')
  ],

  // Get accommodations
  getAccommodations: [
    ...commonValidators.pagination,
    query('search').optional().trim().isLength({ min: 2 }).withMessage('Search term must be at least 2 characters'),
    query('type').optional().isIn(['hotel', 'guesthouse', 'lodge', 'camp', 'resort', 'hostel', 'apartment']),
    query('category').optional().isIn(['budget', 'mid-range', 'luxury', 'backpacker']),
    query('minPrice').optional().isFloat({ min: 0 }).withMessage('Minimum price must be positive'),
    query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Maximum price must be positive'),
    query('guests').optional().isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
    query('checkIn').optional().isISO8601().withMessage('Check-in must be a valid date'),
    query('checkOut').optional().isISO8601().withMessage('Check-out must be a valid date'),
    query('minRating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
  ],

  // Check availability
  checkAvailability: [
    commonValidators.objectId,
    body('checkIn').isISO8601().withMessage('Check-in date is required and must be valid'),
    body('checkOut').isISO8601().withMessage('Check-out date is required and must be valid'),
    body('guests').optional().isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20'),
    body('roomType').optional().trim().notEmpty().withMessage('Room type cannot be empty')
  ]
};

// Booking validation schemas
const bookingValidators = {
  // Create booking
  createBooking: [
    body('itemId').isMongoId().withMessage('Invalid item ID'),
    body('itemType').isIn(['Trip', 'Accommodation']).withMessage('Item type must be Trip or Accommodation'),
    
    body('dates.startDate').optional().isISO8601().withMessage('Start date must be valid'),
    body('dates.endDate').optional().isISO8601().withMessage('End date must be valid'),
    body('dates.checkIn').optional().isISO8601().withMessage('Check-in date must be valid'),
    body('dates.checkOut').optional().isISO8601().withMessage('Check-out date must be valid'),
    
    body('guests.total').isInt({ min: 1, max: 20 }).withMessage('Total guests must be between 1 and 20'),
    body('guests.adults').isInt({ min: 1 }).withMessage('At least 1 adult is required'),
    body('guests.children').optional().isInt({ min: 0 }).withMessage('Children count must be non-negative'),
    
    body('contactInfo.firstName').trim().notEmpty().withMessage('First name is required'),
    body('contactInfo.lastName').trim().notEmpty().withMessage('Last name is required'),
    body('contactInfo.phone').trim().notEmpty().withMessage('Phone number is required'),
    
    body('specialRequests').optional().trim().isLength({ max: 500 }).withMessage('Special requests cannot exceed 500 characters'),
    
    body('additionalServices').optional().isArray().withMessage('Additional services must be an array')
  ],

  // Update booking status
  updateBookingStatus: [
    commonValidators.objectId,
    body('status').isIn(['confirmed', 'cancelled', 'completed', 'no_show']).withMessage('Invalid status'),
    body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
  ],

  // Cancel booking
  cancelBooking: [
    commonValidators.objectId,
    body('reason').optional().trim().isLength({ max: 500 }).withMessage('Reason cannot exceed 500 characters')
  ],

  // Get bookings
  getBookings: [
    ...commonValidators.pagination,
    query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']),
    query('itemType').optional().isIn(['Trip', 'Accommodation']),
    query('sortBy').optional().isIn(['createdAt', 'dates.startDate', 'pricing.total']),
    query('sortOrder').optional().isIn(['asc', 'desc'])
  ]
};

// Review validation schemas
const reviewValidators = {
  // Create review
  createReview: [
    body('itemId').isMongoId().withMessage('Invalid item ID'),
    body('itemType').isIn(['Trip', 'Accommodation']).withMessage('Item type must be Trip or Accommodation'),
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    
    body('rating').isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').trim().isLength({ min: 10, max: 100 }).withMessage('Title must be between 10 and 100 characters'),
    body('content').trim().isLength({ min: 50, max: 2000 }).withMessage('Review content must be between 50 and 2000 characters'),
    
    body('categories.cleanliness').optional().isFloat({ min: 1, max: 5 }).withMessage('Cleanliness rating must be between 1 and 5'),
    body('categories.service').optional().isFloat({ min: 1, max: 5 }).withMessage('Service rating must be between 1 and 5'),
    body('categories.value').optional().isFloat({ min: 1, max: 5 }).withMessage('Value rating must be between 1 and 5'),
    body('categories.location').optional().isFloat({ min: 1, max: 5 }).withMessage('Location rating must be between 1 and 5'),
    body('categories.amenities').optional().isFloat({ min: 1, max: 5 }).withMessage('Amenities rating must be between 1 and 5'),
    
    body('wouldRecommend').optional().isBoolean().withMessage('Would recommend must be true or false'),
    body('visitDate').optional().isISO8601().withMessage('Visit date must be valid'),
    body('photos').optional().isArray().withMessage('Photos must be an array'),
    body('recommendations').optional().trim().isLength({ max: 500 }).withMessage('Recommendations cannot exceed 500 characters')
  ],

  // Update review
  updateReview: [
    param('reviewId').isMongoId().withMessage('Invalid review ID'),
    query('itemId').isMongoId().withMessage('Invalid item ID'),
    query('itemType').isIn(['Trip', 'Accommodation']).withMessage('Invalid item type'),
    
    body('rating').optional().isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('title').optional().trim().isLength({ min: 10, max: 100 }).withMessage('Title must be between 10 and 100 characters'),
    body('content').optional().trim().isLength({ min: 50, max: 2000 }).withMessage('Content must be between 50 and 2000 characters')
  ],

  // Get reviews
  getItemReviews: [
    param('itemType').isIn(['Trip', 'Accommodation']).withMessage('Invalid item type'),
    param('itemId').isMongoId().withMessage('Invalid item ID'),
    
    ...commonValidators.pagination,
    query('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating filter must be between 1 and 5'),
    query('travelType').optional().isIn(['solo', 'couple', 'family', 'group']).withMessage('Invalid travel type'),
    query('verified').optional().isIn(['all', 'verified', 'unverified']).withMessage('Invalid verification filter'),
    query('sortBy').optional().isIn(['createdAt', 'rating', 'helpful']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order')
  ],

  // Mark review helpful
  markReviewHelpful: [
    param('reviewId').isMongoId().withMessage('Invalid review ID'),
    body('itemId').isMongoId().withMessage('Invalid item ID'),
    body('itemType').isIn(['Trip', 'Accommodation']).withMessage('Invalid item type'),
    body('helpful').isBoolean().withMessage('Helpful must be true or false')
  ],

  // Report review
  reportReview: [
    param('reviewId').isMongoId().withMessage('Invalid review ID'),
    body('itemId').isMongoId().withMessage('Invalid item ID'),
    body('itemType').isIn(['Trip', 'Accommodation']).withMessage('Invalid item type'),
    body('reason').isIn(['spam', 'inappropriate', 'fake', 'irrelevant', 'offensive']).withMessage('Invalid report reason'),
    body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters')
  ]
};

// Photo upload validation
const uploadValidators = {
  // Single photo upload
  uploadPhoto: [
    body('description').optional().trim().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
    body('category').optional().isIn(['accommodation', 'trip', 'profile', 'review']).withMessage('Invalid photo category')
  ],

  // Multiple photos upload
  uploadPhotos: [
    body('photos').isArray({ min: 1, max: 10 }).withMessage('Must upload between 1 and 10 photos'),
    body('photos.*.description').optional().trim().isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
  ]
};

// Payment validation schemas
const paymentValidators = {
  // Create checkout
  createCheckout: [
    body('bookingId').isMongoId().withMessage('Invalid booking ID'),
    body('paymentMethod').isIn(['stripe', 'mobile_money', 'bank_transfer']).withMessage('Invalid payment method'),
    body('currency').optional().isIn(['UGX', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
    body('returnUrl').optional().isURL().withMessage('Return URL must be valid')
  ],

  // Process refund
  processRefund: [
    param('paymentId').isMongoId().withMessage('Invalid payment ID'),
    body('amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
    body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Reason must be between 5 and 500 characters')
  ],

  // Get payments
  getPayments: [
    ...commonValidators.pagination,
    query('status').optional().isIn(['pending', 'completed', 'failed', 'cancelled', 'refunded']).withMessage('Invalid payment status'),
    query('paymentMethod').optional().isIn(['stripe', 'mobile_money', 'bank_transfer']).withMessage('Invalid payment method'),
    query('sortBy').optional().isIn(['createdAt', 'amount', 'status']).withMessage('Invalid sort field'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Invalid sort order')
  ],

  // Fee calculator
  feeCalculator: [
    query('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
    query('currency').optional().isIn(['UGX', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
    query('method').optional().isIn(['stripe', 'mobile_money', 'bank_transfer']).withMessage('Invalid payment method')
  ]
};

// External API validation schemas
const externalApiValidators = {
  // Maps place search
  mapsPlaceSearch: [
    query('query').trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
    query('type').optional().isIn(['tourist_attraction', 'lodging', 'restaurant', 'gas_station', 'hospital']).withMessage('Invalid place type')
  ],

  // Distance matrix
  distanceMatrix: [
    query('origins').notEmpty().withMessage('Origins are required'),
    query('destinations').notEmpty().withMessage('Destinations are required')
  ],

  // Weather forecast
  weatherForecast: [
    query('city').optional().trim().isLength({ min: 2, max: 50 }).withMessage('City name must be between 2 and 50 characters'),
    query('days').optional().isInt({ min: 1, max: 10 }).withMessage('Days must be between 1 and 10')
  ],

  // Exchange rates
  exchangeRates: [
    query('base').optional().isIn(['USD', 'EUR', 'GBP', 'UGX']).withMessage('Invalid base currency')
  ]
};

// Custom validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  tripValidators,
  accommodationValidators,
  bookingValidators,
  reviewValidators,
  uploadValidators,
  paymentValidators,
  externalApiValidators,
  commonValidators,
  validateRequest
};