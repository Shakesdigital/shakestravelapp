const express = require('express');
const accommodationsController = require('../controllers/accommodationsController');
const { authenticate, authorize, requireHostVerification } = require('../middleware/auth');
const { accommodationValidators, validateRequest } = require('../validators/apiValidators');
const { rateLimiters } = require('../middleware/security');

/**
 * Accommodations Routes
 * 
 * RESTful API routes for accommodation management with TripAdvisor-inspired features
 * Includes search, filtering, CRUD operations, availability checking, and host management
 */

const router = express.Router();

// Apply rate limiting to all accommodation routes
router.use(rateLimiters.api);

/**
 * @route   GET /api/accommodations
 * @desc    Get all accommodations with filtering and search
 * @access  Public
 * @query   { page?, limit?, search?, type?, category?, location?, minPrice?, maxPrice?, checkIn?, checkOut?, guests?, amenities?, minRating?, sortBy?, sortOrder?, featured? }
 */
router.get('/',
  accommodationValidators.getAccommodations,
  validateRequest,
  accommodationsController.getAccommodations
);

/**
 * @route   POST /api/accommodations
 * @desc    Create a new accommodation (Host only)
 * @access  Private (Verified hosts only)
 * @body    { title, description, type, category, location, amenities, rooms, pricing, policies, hostInfo?, languages?, tags? }
 */
router.post('/',
  authenticate,
  requireHostVerification,
  accommodationValidators.createAccommodation,
  validateRequest,
  accommodationsController.createAccommodation
);

/**
 * @route   GET /api/accommodations/my-accommodations
 * @desc    Get current host's accommodations
 * @access  Private (Host only)
 * @query   { page?, limit?, status?, sortBy?, sortOrder? }
 */
router.get('/my-accommodations',
  authenticate,
  authorize('host', 'admin', 'superadmin'),
  accommodationsController.getMyAccommodations
);

/**
 * @route   GET /api/accommodations/:identifier
 * @desc    Get single accommodation by ID or slug
 * @access  Public
 * @params  { identifier } - Accommodation ID or slug
 */
router.get('/:identifier',
  accommodationsController.getAccommodationById
);

/**
 * @route   PUT /api/accommodations/:id
 * @desc    Update accommodation (Owner or Admin only)
 * @access  Private (Accommodation owner or Admin)
 * @params  { id } - Accommodation ID
 * @body    { title?, description?, type?, category?, location?, amenities?, rooms?, pricing?, policies?, hostInfo?, languages?, tags?, media?, featured? }
 */
router.put('/:id',
  authenticate,
  accommodationValidators.updateAccommodation,
  validateRequest,
  accommodationsController.updateAccommodation
);

/**
 * @route   DELETE /api/accommodations/:id
 * @desc    Delete accommodation (Owner or Admin only)
 * @access  Private (Accommodation owner or Admin)
 * @params  { id } - Accommodation ID
 */
router.delete('/:id',
  authenticate,
  accommodationsController.deleteAccommodation
);

/**
 * @route   POST /api/accommodations/:id/check-availability
 * @desc    Check accommodation availability for specific dates
 * @access  Public
 * @params  { id } - Accommodation ID
 * @body    { checkIn, checkOut, roomType?, guests? }
 */
router.post('/:id/check-availability',
  accommodationValidators.checkAvailability,
  validateRequest,
  accommodationsController.checkAvailability
);

/**
 * @route   PATCH /api/accommodations/:id/featured
 * @desc    Toggle accommodation featured status (Admin only)
 * @access  Private (Admin only)
 * @params  { id } - Accommodation ID
 */
router.patch('/:id/featured',
  authenticate,
  authorize('admin', 'superadmin'),
  accommodationsController.toggleFeatured
);

module.exports = router;