const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { reviewValidators, validateRequest } = require('../validators/apiValidators');
const { rateLimiters } = require('../middleware/security');

/**
 * Reviews Routes
 * 
 * RESTful API routes for TripAdvisor-inspired review system
 * Includes creation, management, helpfulness voting, and reporting
 */

const router = express.Router();

// Apply rate limiting to all review routes
router.use(rateLimiters.api);

/**
 * @route   POST /api/reviews
 * @desc    Create a review for trip or accommodation
 * @access  Private (Must have completed booking)
 * @body    { itemId, itemType, bookingId, rating, title, content, categories?, photos?, visitDate?, recommendations?, wouldRecommend? }
 */
router.post('/',
  authenticate,
  reviewValidators.createReview,
  validateRequest,
  reviewsController.createReview
);

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get user's reviews
 * @access  Private
 * @query   { page?, limit?, itemType?, sortBy?, sortOrder? }
 */
router.get('/my-reviews',
  authenticate,
  reviewsController.getMyReviews
);

/**
 * @route   GET /api/reviews/:itemType/:itemId
 * @desc    Get reviews for a specific trip or accommodation
 * @access  Public
 * @params  { itemType, itemId } - Item type (Trip/Accommodation) and ID
 * @query   { page?, limit?, sortBy?, sortOrder?, rating?, language?, travelType?, verified? }
 */
router.get('/:itemType/:itemId',
  reviewValidators.getItemReviews,
  validateRequest,
  reviewsController.getItemReviews
);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review
 * @access  Private (Review owner only)
 * @params  { reviewId } - Review ID
 * @query   { itemId, itemType } - Required for context
 * @body    { rating?, title?, content?, categories?, wouldRecommend?, recommendations? }
 */
router.put('/:reviewId',
  authenticate,
  reviewValidators.updateReview,
  validateRequest,
  reviewsController.updateReview
);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private (Review owner or Admin)
 * @params  { reviewId } - Review ID
 * @query   { itemId, itemType } - Required for context
 */
router.delete('/:reviewId',
  authenticate,
  reviewsController.deleteReview
);

/**
 * @route   POST /api/reviews/:reviewId/helpful
 * @desc    Mark review as helpful or unhelpful
 * @access  Private
 * @params  { reviewId } - Review ID
 * @body    { itemId, itemType, helpful }
 */
router.post('/:reviewId/helpful',
  authenticate,
  reviewValidators.markReviewHelpful,
  validateRequest,
  reviewsController.markReviewHelpful
);

/**
 * @route   POST /api/reviews/:reviewId/report
 * @desc    Report a review for moderation
 * @access  Private
 * @params  { reviewId } - Review ID
 * @body    { itemId, itemType, reason, description? }
 */
router.post('/:reviewId/report',
  authenticate,
  reviewValidators.reportReview,
  validateRequest,
  reviewsController.reportReview
);

module.exports = router;