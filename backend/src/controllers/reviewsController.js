const { catchAsync, AppError, ValidationError, AuthorizationError } = require('../middleware/errorHandler');
const { Trip, Accommodation, Booking, User } = require('../models');
const { logger, businessLogger } = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * Reviews Controller
 * 
 * Handles TripAdvisor-inspired review system for trips and accommodations
 * Includes rating validation, review moderation, and analytics
 */

/**
 * Create a review for trip or accommodation
 * POST /api/reviews
 */
const createReview = catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const {
    itemId,
    itemType,
    bookingId,
    rating,
    title,
    content,
    categories,
    photos,
    visitDate,
    recommendations,
    wouldRecommend
  } = req.body;

  // Validate item type
  if (!['Trip', 'Accommodation'].includes(itemType)) {
    throw new ValidationError('Invalid item type. Must be Trip or Accommodation');
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new ValidationError('Rating must be between 1 and 5');
  }

  try {
    // Find the item
    const Model = itemType === 'Trip' ? Trip : Accommodation;
    const item = await Model.findById(itemId);

    if (!item) {
      throw new AppError(`${itemType} not found`, 404);
    }

    // Check if user has a completed booking for this item
    const booking = await Booking.findOne({
      _id: bookingId,
      userId: req.user.id,
      itemId,
      itemType,
      status: 'completed'
    });

    if (!booking) {
      throw new ValidationError('You can only review items you have booked and completed');
    }

    // Check if user has already reviewed this booking
    const existingReview = item.reviews.items.find(review => 
      review.userId.toString() === req.user.id && 
      review.bookingId.toString() === bookingId
    );

    if (existingReview) {
      throw new ValidationError('You have already reviewed this booking');
    }

    // Prevent reviewing too soon after completion
    const daysSinceCompletion = (new Date() - booking.completedAt) / (1000 * 60 * 60 * 24);
    if (daysSinceCompletion > 90) {
      throw new ValidationError('Reviews must be submitted within 90 days of completion');
    }

    // Create review data
    const reviewData = {
      userId: req.user.id,
      bookingId,
      rating,
      title: title.trim(),
      content: content.trim(),
      categories: categories || {},
      photos: photos || [],
      visitDate: visitDate || booking.dates.startDate,
      recommendations,
      wouldRecommend: wouldRecommend !== undefined ? wouldRecommend : rating >= 4,
      helpful: {
        upvotes: 0,
        downvotes: 0,
        voters: []
      },
      status: 'published', // Auto-publish for now, could add moderation
      metadata: {
        travelType: booking.guests.adults > 1 ? 'group' : 'solo',
        bookingValue: booking.pricing.total,
        stayDuration: booking.dates.duration
      }
    };

    // Add review to item
    item.reviews.items.push(reviewData);

    // Update review statistics
    await updateReviewStatistics(item);

    await item.save();

    // Update user's review count
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'profile.reviewsCount': 1 }
    });

    // Update host/provider statistics
    const ownerId = itemType === 'Trip' ? item.providerId : item.hostId;
    await User.findByIdAndUpdate(ownerId, {
      $inc: { 
        'hostProfile.totalReviews': 1,
        'hostProfile.totalRating': rating
      }
    });

    // Calculate and update host average rating
    const hostUser = await User.findById(ownerId);
    if (hostUser.hostProfile.totalReviews > 0) {
      hostUser.hostProfile.rating = hostUser.hostProfile.totalRating / hostUser.hostProfile.totalReviews;
      await hostUser.save();
    }

    // Get the created review for response
    const createdReview = item.reviews.items[item.reviews.items.length - 1];
    await item.populate('reviews.items.userId', 'firstName lastName profile.avatar');

    logger.info('Review created successfully', {
      reviewId: createdReview._id,
      userId: req.user.id,
      itemType,
      itemId,
      rating,
      bookingId
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review: {
          ...createdReview.toObject(),
          user: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            avatar: req.user.profile?.avatar
          }
        },
        itemStatistics: {
          averageRating: item.reviews.averageRating,
          totalReviews: item.reviews.totalReviews,
          ratingDistribution: item.reviews.ratingDistribution
        }
      }
    });

  } catch (error) {
    logger.error('Failed to create review', {
      userId: req.user.id,
      itemType,
      itemId,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get reviews for a trip or accommodation
 * GET /api/reviews/:itemType/:itemId
 */
const getItemReviews = catchAsync(async (req, res) => {
  const { itemType, itemId } = req.params;
  const {
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    rating,
    language,
    travelType,
    verified = 'all'
  } = req.query;

  // Validate item type
  if (!['Trip', 'Accommodation'].includes(itemType)) {
    throw new ValidationError('Invalid item type');
  }

  const Model = itemType === 'Trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);

  if (!item) {
    throw new AppError(`${itemType} not found`, 404);
  }

  // Build filter for reviews
  let reviewsQuery = item.reviews.items;

  // Filter by rating
  if (rating) {
    reviewsQuery = reviewsQuery.filter(review => review.rating === parseInt(rating));
  }

  // Filter by travel type
  if (travelType) {
    reviewsQuery = reviewsQuery.filter(review => 
      review.metadata?.travelType === travelType
    );
  }

  // Filter by verification status
  if (verified === 'verified') {
    reviewsQuery = reviewsQuery.filter(review => review.isVerified);
  }

  // Sort reviews
  const sortOptions = {
    'createdAt': (a, b) => sortOrder === 'asc' ? 
      new Date(a.createdAt) - new Date(b.createdAt) : 
      new Date(b.createdAt) - new Date(a.createdAt),
    'rating': (a, b) => sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating,
    'helpful': (a, b) => sortOrder === 'asc' ? 
      a.helpful.upvotes - b.helpful.upvotes : 
      b.helpful.upvotes - a.helpful.upvotes
  };

  if (sortOptions[sortBy]) {
    reviewsQuery.sort(sortOptions[sortBy]);
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedReviews = reviewsQuery.slice(startIndex, endIndex);

  // Populate user information
  await item.populate({
    path: 'reviews.items.userId',
    select: 'firstName lastName profile.avatar profile.reviewsCount'
  });

  const reviews = paginatedReviews.map(review => ({
    ...review.toObject(),
    user: review.userId
  }));

  res.status(200).json({
    success: true,
    data: {
      reviews,
      statistics: {
        averageRating: item.reviews.averageRating,
        totalReviews: item.reviews.totalReviews,
        ratingDistribution: item.reviews.ratingDistribution,
        categoryRatings: item.reviews.categoryRatings
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(reviewsQuery.length / limit),
        totalReviews: reviewsQuery.length,
        limit: parseInt(limit)
      },
      filters: {
        rating,
        travelType,
        verified,
        sortBy,
        sortOrder
      }
    }
  });
});

/**
 * Update a review
 * PUT /api/reviews/:reviewId
 */
const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { itemId, itemType } = req.query;

  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  if (!itemId || !itemType) {
    throw new ValidationError('itemId and itemType are required in query parameters');
  }

  const Model = itemType === 'Trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);

  if (!item) {
    throw new AppError(`${itemType} not found`, 404);
  }

  const reviewIndex = item.reviews.items.findIndex(review => 
    review._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    throw new AppError('Review not found', 404);
  }

  const review = item.reviews.items[reviewIndex];

  // Check if user owns this review
  if (review.userId.toString() !== req.user.id) {
    throw new AuthorizationError('You can only update your own reviews');
  }

  // Check if review can still be edited (within 24 hours)
  const hoursSinceCreation = (new Date() - review.createdAt) / (1000 * 60 * 60);
  if (hoursSinceCreation > 24) {
    throw new ValidationError('Reviews can only be edited within 24 hours of creation');
  }

  // Update allowed fields
  const allowedUpdates = ['rating', 'title', 'content', 'categories', 'wouldRecommend', 'recommendations'];
  const updates = {};
  
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Update the review
  Object.assign(review, updates);
  review.updatedAt = new Date();
  review.isEdited = true;

  // Recalculate statistics if rating changed
  if (updates.rating) {
    await updateReviewStatistics(item);
  }

  await item.save();

  logger.info('Review updated successfully', {
    reviewId,
    userId: req.user.id,
    itemType,
    itemId,
    updatedFields: Object.keys(updates)
  });

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: {
      review: review.toObject()
    }
  });
});

/**
 * Delete a review
 * DELETE /api/reviews/:reviewId
 */
const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { itemId, itemType } = req.query;

  if (!itemId || !itemType) {
    throw new ValidationError('itemId and itemType are required in query parameters');
  }

  const Model = itemType === 'Trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);

  if (!item) {
    throw new AppError(`${itemType} not found`, 404);
  }

  const reviewIndex = item.reviews.items.findIndex(review => 
    review._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    throw new AppError('Review not found', 404);
  }

  const review = item.reviews.items[reviewIndex];

  // Check permissions (owner or admin)
  const canDelete = review.userId.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);

  if (!canDelete) {
    throw new AuthorizationError('You can only delete your own reviews');
  }

  // Remove the review
  item.reviews.items.splice(reviewIndex, 1);

  // Update statistics
  await updateReviewStatistics(item);
  await item.save();

  // Update user's review count
  await User.findByIdAndUpdate(review.userId, {
    $inc: { 'profile.reviewsCount': -1 }
  });

  // Update host/provider statistics
  const ownerId = itemType === 'Trip' ? item.providerId : item.hostId;
  await User.findByIdAndUpdate(ownerId, {
    $inc: { 
      'hostProfile.totalReviews': -1,
      'hostProfile.totalRating': -review.rating
    }
  });

  logger.info('Review deleted successfully', {
    reviewId,
    deletedBy: req.user.id,
    itemType,
    itemId
  });

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

/**
 * Mark review as helpful/unhelpful
 * POST /api/reviews/:reviewId/helpful
 */
const markReviewHelpful = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { itemId, itemType, helpful } = req.body;

  if (typeof helpful !== 'boolean') {
    throw new ValidationError('helpful must be a boolean value');
  }

  const Model = itemType === 'Trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);

  if (!item) {
    throw new AppError(`${itemType} not found`, 404);
  }

  const review = item.reviews.items.id(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Check if user has already voted
  const existingVote = review.helpful.voters.find(voter => 
    voter.userId.toString() === req.user.id
  );

  if (existingVote) {
    // Update existing vote
    if (existingVote.helpful !== helpful) {
      if (existingVote.helpful) {
        review.helpful.upvotes -= 1;
        review.helpful.downvotes += 1;
      } else {
        review.helpful.downvotes -= 1;
        review.helpful.upvotes += 1;
      }
      existingVote.helpful = helpful;
    }
  } else {
    // Add new vote
    review.helpful.voters.push({
      userId: req.user.id,
      helpful,
      votedAt: new Date()
    });

    if (helpful) {
      review.helpful.upvotes += 1;
    } else {
      review.helpful.downvotes += 1;
    }
  }

  await item.save();

  res.status(200).json({
    success: true,
    message: 'Vote recorded successfully',
    data: {
      helpful: {
        upvotes: review.helpful.upvotes,
        downvotes: review.helpful.downvotes,
        userVote: helpful
      }
    }
  });
});

/**
 * Get user's reviews
 * GET /api/reviews/my-reviews
 */
const getMyReviews = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    itemType,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const aggregationPipeline = [
    // Find trips and accommodations with user's reviews
    {
      $match: {
        'reviews.items.userId': req.user._id
      }
    },
    {
      $unwind: '$reviews.items'
    },
    {
      $match: {
        'reviews.items.userId': req.user._id
      }
    },
    {
      $lookup: {
        from: 'bookings',
        localField: 'reviews.items.bookingId',
        foreignField: '_id',
        as: 'booking'
      }
    },
    {
      $project: {
        itemType: { $literal: itemType || 'Trip' }, // Would need to determine dynamically
        title: 1,
        slug: 1,
        location: 1,
        media: 1,
        review: '$reviews.items',
        booking: { $arrayElemAt: ['$booking', 0] }
      }
    },
    {
      $sort: { [`review.${sortBy}`]: sortOrder === 'asc' ? 1 : -1 }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: parseInt(limit)
    }
  ];

  // This is a simplified version - in practice, you'd need separate queries for trips and accommodations
  const reviews = await Trip.aggregate(aggregationPipeline);
  const accommodationReviews = await Accommodation.aggregate(aggregationPipeline);
  
  const allReviews = [...reviews, ...accommodationReviews];

  res.status(200).json({
    success: true,
    data: {
      reviews: allReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(allReviews.length / limit),
        total: allReviews.length,
        limit: parseInt(limit)
      }
    }
  });
});

/**
 * Report a review
 * POST /api/reviews/:reviewId/report
 */
const reportReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { itemId, itemType, reason, description } = req.body;

  const Model = itemType === 'Trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);

  if (!item) {
    throw new AppError(`${itemType} not found`, 404);
  }

  const review = item.reviews.items.id(reviewId);
  if (!review) {
    throw new AppError('Review not found', 404);
  }

  // Add report to review
  review.reports = review.reports || [];
  review.reports.push({
    reportedBy: req.user.id,
    reason,
    description,
    reportedAt: new Date(),
    status: 'pending'
  });

  await item.save();

  logger.info('Review reported', {
    reviewId,
    reportedBy: req.user.id,
    reason,
    itemType,
    itemId
  });

  res.status(200).json({
    success: true,
    message: 'Review reported successfully. Our team will review it shortly.'
  });
});

// Helper function to update review statistics
async function updateReviewStatistics(item) {
  const reviews = item.reviews.items.filter(review => review.status === 'published');
  
  if (reviews.length === 0) {
    item.reviews.totalReviews = 0;
    item.reviews.averageRating = 0;
    item.reviews.ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    return;
  }

  // Calculate average rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  item.reviews.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
  item.reviews.totalReviews = reviews.length;

  // Calculate rating distribution
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    distribution[review.rating] += 1;
  });
  item.reviews.ratingDistribution = distribution;

  // Calculate category ratings if available
  const categories = ['cleanliness', 'service', 'value', 'location', 'amenities'];
  const categoryRatings = {};
  
  categories.forEach(category => {
    const categoryReviews = reviews.filter(review => 
      review.categories && review.categories[category]
    );
    
    if (categoryReviews.length > 0) {
      const categoryTotal = categoryReviews.reduce((sum, review) => 
        sum + review.categories[category], 0);
      categoryRatings[category] = Math.round((categoryTotal / categoryReviews.length) * 10) / 10;
    }
  });
  
  item.reviews.categoryRatings = categoryRatings;
}

module.exports = {
  createReview,
  getItemReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getMyReviews,
  reportReview
};