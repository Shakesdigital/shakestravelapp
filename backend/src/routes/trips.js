const express = require('express');
const tripsController = require('../controllers/tripsController');
const { authenticate, authorize, requireHostVerification } = require('../middleware/auth');
const { tripValidators, validateRequest } = require('../validators/apiValidators');
const { rateLimiters } = require('../middleware/security');

/**
 * Trips Routes
 * 
 * RESTful API routes for trip management with TripAdvisor-inspired features
 * Includes search, filtering, CRUD operations, and host management
 */

const router = express.Router();

// Apply rate limiting to all trip routes
router.use(rateLimiters.api);

/**
 * @route   GET /api/trips
 * @desc    Get all trips with filtering and search
 * @access  Public
 * @query   { page?, limit?, search?, category?, location?, minPrice?, maxPrice?, startDate?, endDate?, difficulty?, minRating?, sortBy?, sortOrder?, featured? }
 */
router.get('/',
  tripValidators.getTrips,
  validateRequest,
  tripsController.getTrips
);

/**
 * @route   POST /api/trips
 * @desc    Create a new trip (Host only)
 * @access  Private (Verified hosts only)
 * @body    { title, description, category, location, itinerary, inclusions, exclusions, pricing, groupSize, duration, difficulty, languages?, tags?, availability, cancellationPolicy?, requirements? }
 */
router.post('/',
  authenticate,
  requireHostVerification,
  tripValidators.createTrip,
  validateRequest,
  tripsController.createTrip
);

/**
 * @route   GET /api/trips/my-trips
 * @desc    Get current host's trips
 * @access  Private (Host only)
 * @query   { page?, limit?, status?, sortBy?, sortOrder? }
 */
router.get('/my-trips',
  authenticate,
  authorize('host', 'admin', 'superadmin'),
  tripsController.getMyTrips
);

/**
 * @route   GET /api/trips/:identifier
 * @desc    Get single trip by ID or slug
 * @access  Public
 * @params  { identifier } - Trip ID or slug
 */
router.get('/:identifier',
  tripValidators.getTripById,
  validateRequest,
  tripsController.getTripById
);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip (Owner or Admin only)
 * @access  Private (Trip owner or Admin)
 * @params  { id } - Trip ID
 * @body    { title?, description?, category?, location?, itinerary?, inclusions?, exclusions?, pricing?, groupSize?, duration?, difficulty?, languages?, tags?, availability?, policies?, media?, featured? }
 */
router.put('/:id',
  authenticate,
  tripValidators.updateTrip,
  validateRequest,
  tripsController.updateTrip
);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip (Owner or Admin only)
 * @access  Private (Trip owner or Admin)
 * @params  { id } - Trip ID
 */
router.delete('/:id',
  authenticate,
  tripsController.deleteTrip
);

/**
 * @route   PATCH /api/trips/:id/featured
 * @desc    Toggle trip featured status (Admin only)
 * @access  Private (Admin only)
 * @params  { id } - Trip ID
 */
router.patch('/:id/featured',
  authenticate,
  authorize('admin', 'superadmin'),
  tripsController.toggleFeatured
);

module.exports = router;