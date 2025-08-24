const express = require('express');
const bookingsController = require('../controllers/bookingsController');
const { authenticate, authorize } = require('../middleware/auth');
const { bookingValidators, validateRequest } = require('../validators/apiValidators');
const { rateLimiters } = require('../middleware/security');

/**
 * Bookings Routes
 * 
 * RESTful API routes for booking management with TripAdvisor-inspired features
 * Includes creation, management, status updates, and cancellation
 */

const router = express.Router();

// Apply rate limiting to all booking routes
router.use(rateLimiters.api);

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings
 * @access  Private
 * @query   { page?, limit?, status?, itemType?, sortBy?, sortOrder? }
 */
router.get('/',
  authenticate,
  bookingValidators.getBookings,
  validateRequest,
  bookingsController.getUserBookings
);

/**
 * @route   POST /api/bookings
 * @desc    Create a new booking
 * @access  Private
 * @body    { itemId, itemType, dates, guests, roomType?, additionalServices?, specialRequests?, contactInfo, emergencyContact? }
 */
router.post('/',
  authenticate,
  bookingValidators.createBooking,
  validateRequest,
  bookingsController.createBooking
);

/**
 * @route   GET /api/bookings/manage
 * @desc    Get bookings for host/provider to manage
 * @access  Private (Host only)
 * @query   { page?, limit?, status?, itemType?, sortBy?, sortOrder? }
 */
router.get('/manage',
  authenticate,
  authorize('host', 'admin', 'superadmin'),
  bookingValidators.getBookings,
  validateRequest,
  bookingsController.getManageableBookings
);

/**
 * @route   GET /api/bookings/:id
 * @desc    Get single booking by ID
 * @access  Private (Booking owner, item owner, or Admin)
 * @params  { id } - Booking ID
 */
router.get('/:id',
  authenticate,
  bookingsController.getBookingById
);

/**
 * @route   PATCH /api/bookings/:id/status
 * @desc    Update booking status
 * @access  Private (Item owner or Admin)
 * @params  { id } - Booking ID
 * @body    { status, reason? }
 */
router.patch('/:id/status',
  authenticate,
  bookingValidators.updateBookingStatus,
  validateRequest,
  bookingsController.updateBookingStatus
);

/**
 * @route   POST /api/bookings/:id/cancel
 * @desc    Cancel booking
 * @access  Private (Booking owner)
 * @params  { id } - Booking ID
 * @body    { reason? }
 */
router.post('/:id/cancel',
  authenticate,
  bookingValidators.cancelBooking,
  validateRequest,
  bookingsController.cancelBooking
);

module.exports = router;