const { catchAsync, AppError, ValidationError, AuthorizationError } = require('../middleware/errorHandler');
const { Trip, User, Booking } = require('../models');
const { logger, businessLogger } = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * Trips Controller
 * 
 * Handles CRUD operations for adventure trips with TripAdvisor-inspired features
 * Includes search, filtering, pricing, availability, and review management
 */

/**
 * Create a new trip (Host only)
 * POST /api/trips
 */
const createTrip = catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const {
    title,
    description,
    category,
    location,
    itinerary,
    inclusions,
    exclusions,
    pricing,
    groupSize,
    duration,
    difficulty,
    languages,
    tags,
    availability,
    cancellationPolicy,
    requirements
  } = req.body;

  // Ensure user is a verified host
  if (req.user.role !== 'host' && !['admin', 'superadmin'].includes(req.user.role)) {
    throw new AuthorizationError('Only verified hosts can create trips');
  }

  if (req.user.role === 'host' && !req.user.hostProfile?.isVerified) {
    throw new AuthorizationError('Host verification required to create trips');
  }

  try {
    // Create trip data
    const tripData = {
      providerId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      location: {
        ...location,
        country: 'Uganda' // Default country
      },
      itinerary,
      inclusions,
      exclusions,
      pricing: {
        ...pricing,
        currency: pricing.currency || 'UGX'
      },
      groupSize,
      duration,
      difficulty,
      languages: languages || ['English'],
      tags,
      availability,
      policies: {
        cancellation: cancellationPolicy,
        requirements
      },
      status: 'draft', // New trips start as draft
      verification: {
        isVerified: false,
        verifiedAt: null
      }
    };

    // Generate unique slug
    const baseSlug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await Trip.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    tripData.slug = slug;

    const trip = new Trip(tripData);
    await trip.save();

    // Populate provider information for response
    await trip.populate('providerId', 'firstName lastName hostProfile.businessInfo.companyName hostProfile.rating');

    logger.info('Trip created successfully', {
      tripId: trip.id,
      providerId: req.user.id,
      title: trip.title,
      location: trip.location.city
    });

    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: {
        trip: trip.toJSON()
      }
    });

  } catch (error) {
    logger.error('Failed to create trip', {
      providerId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get all trips with filtering and search
 * GET /api/trips
 */
const getTrips = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    category,
    location,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    difficulty,
    minRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured
  } = req.query;

  // Build query
  const query = {
    status: 'active', // Only show active trips
    'verification.isVerified': true // Only verified trips
  };

  // Search functionality
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { tags: { $in: [searchRegex] } },
      { 'location.city': searchRegex },
      { 'location.region': searchRegex }
    ];
  }

  // Category filter
  if (category) {
    query.category = category;
  }

  // Location filter (Uganda regions/cities)
  if (location) {
    const locationRegex = new RegExp(location, 'i');
    query.$or = query.$or || [];
    query.$or.push(
      { 'location.city': locationRegex },
      { 'location.region': locationRegex }
    );
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query['pricing.basePrice'] = {};
    if (minPrice) query['pricing.basePrice'].$gte = parseInt(minPrice);
    if (maxPrice) query['pricing.basePrice'].$lte = parseInt(maxPrice);
  }

  // Difficulty filter
  if (difficulty) {
    query.difficulty = difficulty;
  }

  // Rating filter
  if (minRating) {
    query['reviews.averageRating'] = { $gte: parseFloat(minRating) };
  }

  // Featured filter
  if (featured === 'true') {
    query.featured = true;
  }

  // Date availability filter
  if (startDate || endDate) {
    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);
    
    query['availability.dates'] = {
      $elemMatch: {
        startDate: dateQuery
      }
    };
  }

  // Build sort options
  const sortOptions = {};
  const allowedSortFields = ['createdAt', 'pricing.basePrice', 'reviews.averageRating', 'title'];
  
  if (allowedSortFields.includes(sortBy)) {
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortOptions.createdAt = -1; // Default sort
  }

  try {
    // Execute query with pagination
    const trips = await Trip.find(query)
      .populate('providerId', 'firstName lastName hostProfile.businessInfo hostProfile.rating hostProfile.totalReviews')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Trip.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        trips,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalTrips: total,
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        },
        filters: {
          search,
          category,
          location,
          priceRange: { min: minPrice, max: maxPrice },
          difficulty,
          minRating,
          featured
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch trips', { error: error.message });
    throw error;
  }
});

/**
 * Get single trip by ID or slug
 * GET /api/trips/:identifier
 */
const getTripById = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  
  // Check if identifier is ObjectId or slug
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const trip = await Trip.findOne(query)
    .populate('providerId', 'firstName lastName hostProfile.businessInfo hostProfile.rating hostProfile.totalReviews profile.avatar')
    .populate({
      path: 'reviews.items',
      populate: {
        path: 'userId',
        select: 'firstName lastName profile.avatar'
      },
      options: {
        sort: { createdAt: -1 },
        limit: 10 // Latest 10 reviews
      }
    });

  if (!trip) {
    throw new AppError('Trip not found', 404);
  }

  // Check if trip is accessible (active and verified, or owner/admin)
  const canAccess = trip.status === 'active' && trip.verification.isVerified ||
                   req.user && (
                     trip.providerId._id.toString() === req.user.id ||
                     ['admin', 'superadmin'].includes(req.user.role)
                   );

  if (!canAccess) {
    throw new AppError('Trip not found or not available', 404);
  }

  // Increment view count if not the owner
  if (!req.user || trip.providerId._id.toString() !== req.user.id) {
    await Trip.findByIdAndUpdate(trip._id, {
      $inc: { 'analytics.views': 1 }
    });
  }

  logger.debug('Trip viewed', {
    tripId: trip.id,
    userId: req.user?.id,
    viewerType: req.user ? 'authenticated' : 'anonymous'
  });

  res.status(200).json({
    success: true,
    data: {
      trip: trip.toJSON()
    }
  });
});

/**
 * Update trip (Owner or Admin only)
 * PUT /api/trips/:id
 */
const updateTrip = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const trip = await Trip.findById(id);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }

  // Check ownership or admin privileges
  const canUpdate = trip.providerId.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);
  
  if (!canUpdate) {
    throw new AuthorizationError('You can only update your own trips');
  }

  // Fields that can be updated
  const allowedUpdates = [
    'title', 'description', 'category', 'location', 'itinerary',
    'inclusions', 'exclusions', 'pricing', 'groupSize', 'duration',
    'difficulty', 'languages', 'tags', 'availability', 'policies',
    'media', 'featured'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // If title is updated, regenerate slug
  if (updates.title && updates.title !== trip.title) {
    const baseSlug = updates.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await Trip.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    updates.slug = slug;
  }

  // Update last modified timestamp
  updates.updatedAt = new Date();

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('providerId', 'firstName lastName hostProfile.businessInfo');

    logger.info('Trip updated successfully', {
      tripId: id,
      providerId: req.user.id,
      updatedFields: Object.keys(updates)
    });

    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: {
        trip: updatedTrip.toJSON()
      }
    });

  } catch (error) {
    logger.error('Failed to update trip', {
      tripId: id,
      providerId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Delete trip (Owner or Admin only)
 * DELETE /api/trips/:id
 */
const deleteTrip = catchAsync(async (req, res) => {
  const { id } = req.params;

  const trip = await Trip.findById(id);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }

  // Check ownership or admin privileges
  const canDelete = trip.providerId.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);
  
  if (!canDelete) {
    throw new AuthorizationError('You can only delete your own trips');
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    itemId: id,
    itemType: 'Trip',
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  });

  if (activeBookings > 0) {
    throw new ValidationError('Cannot delete trip with active bookings. Please cancel or complete all bookings first.');
  }

  try {
    // Soft delete - mark as deleted instead of removing
    await Trip.findByIdAndUpdate(id, {
      status: 'deleted',
      deletedAt: new Date()
    });

    logger.info('Trip deleted successfully', {
      tripId: id,
      providerId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Trip deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete trip', {
      tripId: id,
      providerId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get host's trips
 * GET /api/trips/my-trips
 */
const getMyTrips = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { providerId: req.user.id };
  
  // Filter by status if provided
  if (status) {
    query.status = status;
  } else {
    // Exclude deleted trips by default
    query.status = { $ne: 'deleted' };
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const trips = await Trip.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Trip.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      trips,
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
 * Toggle trip featured status (Admin only)
 * PATCH /api/trips/:id/featured
 */
const toggleFeatured = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!['admin', 'superadmin'].includes(req.user.role)) {
    throw new AuthorizationError('Admin privileges required');
  }

  const trip = await Trip.findById(id);
  if (!trip) {
    throw new AppError('Trip not found', 404);
  }

  trip.featured = !trip.featured;
  trip.featuredAt = trip.featured ? new Date() : null;
  await trip.save();

  logger.info(`Trip featured status toggled to ${trip.featured}`, {
    tripId: id,
    adminId: req.user.id
  });

  res.status(200).json({
    success: true,
    message: `Trip ${trip.featured ? 'featured' : 'unfeatured'} successfully`,
    data: {
      featured: trip.featured,
      featuredAt: trip.featuredAt
    }
  });
});

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getMyTrips,
  toggleFeatured
};