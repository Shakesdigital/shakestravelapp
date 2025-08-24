const { catchAsync, AppError, ValidationError, AuthorizationError } = require('../middleware/errorHandler');
const { Accommodation, User, Booking } = require('../models');
const { logger, businessLogger } = require('../utils/logger');
const { validationResult } = require('express-validator');

/**
 * Accommodations Controller
 * 
 * Handles CRUD operations for accommodations with TripAdvisor-inspired features
 * Includes search, filtering, room management, pricing, and availability
 */

/**
 * Create a new accommodation (Host only)
 * POST /api/accommodations
 */
const createAccommodation = catchAsync(async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const {
    title,
    description,
    type,
    category,
    location,
    amenities,
    rooms,
    pricing,
    policies,
    hostInfo,
    languages,
    tags
  } = req.body;

  // Ensure user is a verified host
  if (req.user.role !== 'host' && !['admin', 'superadmin'].includes(req.user.role)) {
    throw new AuthorizationError('Only verified hosts can create accommodations');
  }

  if (req.user.role === 'host' && !req.user.hostProfile?.isVerified) {
    throw new AuthorizationError('Host verification required to create accommodations');
  }

  try {
    // Create accommodation data
    const accommodationData = {
      hostId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      type,
      category,
      location: {
        ...location,
        country: 'Uganda' // Default country
      },
      amenities,
      rooms,
      pricing: {
        ...pricing,
        currency: pricing.currency || 'UGX'
      },
      policies,
      hostInfo,
      languages: languages || ['English'],
      tags,
      status: 'draft', // New accommodations start as draft
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
    
    while (await Accommodation.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    accommodationData.slug = slug;

    const accommodation = new Accommodation(accommodationData);
    await accommodation.save();

    // Populate host information for response
    await accommodation.populate('hostId', 'firstName lastName hostProfile.businessInfo.companyName hostProfile.rating');

    logger.info('Accommodation created successfully', {
      accommodationId: accommodation.id,
      hostId: req.user.id,
      title: accommodation.title,
      location: accommodation.location.city
    });

    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully',
      data: {
        accommodation: accommodation.toJSON()
      }
    });

  } catch (error) {
    logger.error('Failed to create accommodation', {
      hostId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get all accommodations with filtering and search
 * GET /api/accommodations
 */
const getAccommodations = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    type,
    category,
    location,
    minPrice,
    maxPrice,
    checkIn,
    checkOut,
    guests,
    amenities,
    minRating,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    featured
  } = req.query;

  // Build query
  const query = {
    status: 'active', // Only show active accommodations
    'verification.isVerified': true // Only verified accommodations
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

  // Type filter
  if (type) {
    query.type = type;
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

  // Guest capacity filter
  if (guests) {
    query['capacity.maxGuests'] = { $gte: parseInt(guests) };
  }

  // Amenities filter
  if (amenities) {
    const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
    query['amenities.list'] = { $all: amenitiesList };
  }

  // Rating filter
  if (minRating) {
    query['reviews.averageRating'] = { $gte: parseFloat(minRating) };
  }

  // Featured filter
  if (featured === 'true') {
    query.featured = true;
  }

  // Availability filter for check-in/check-out dates
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Find accommodations with available rooms for the date range
    query['rooms.availability'] = {
      $elemMatch: {
        date: {
          $gte: checkInDate,
          $lt: checkOutDate
        },
        isAvailable: true
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
    const accommodations = await Accommodation.find(query)
      .populate('hostId', 'firstName lastName hostProfile.businessInfo hostProfile.rating hostProfile.totalReviews')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Accommodation.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        accommodations,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalAccommodations: total,
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        },
        filters: {
          search,
          type,
          category,
          location,
          priceRange: { min: minPrice, max: maxPrice },
          guests,
          amenities,
          minRating,
          featured,
          dates: { checkIn, checkOut }
        }
      }
    });

  } catch (error) {
    logger.error('Failed to fetch accommodations', { error: error.message });
    throw error;
  }
});

/**
 * Get single accommodation by ID or slug
 * GET /api/accommodations/:identifier
 */
const getAccommodationById = catchAsync(async (req, res) => {
  const { identifier } = req.params;
  
  // Check if identifier is ObjectId or slug
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const accommodation = await Accommodation.findOne(query)
    .populate('hostId', 'firstName lastName hostProfile.businessInfo hostProfile.rating hostProfile.totalReviews profile.avatar')
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

  if (!accommodation) {
    throw new AppError('Accommodation not found', 404);
  }

  // Check if accommodation is accessible (active and verified, or owner/admin)
  const canAccess = accommodation.status === 'active' && accommodation.verification.isVerified ||
                   req.user && (
                     accommodation.hostId._id.toString() === req.user.id ||
                     ['admin', 'superadmin'].includes(req.user.role)
                   );

  if (!canAccess) {
    throw new AppError('Accommodation not found or not available', 404);
  }

  // Increment view count if not the owner
  if (!req.user || accommodation.hostId._id.toString() !== req.user.id) {
    await Accommodation.findByIdAndUpdate(accommodation._id, {
      $inc: { 'analytics.views': 1 }
    });
  }

  logger.debug('Accommodation viewed', {
    accommodationId: accommodation.id,
    userId: req.user?.id,
    viewerType: req.user ? 'authenticated' : 'anonymous'
  });

  res.status(200).json({
    success: true,
    data: {
      accommodation: accommodation.toJSON()
    }
  });
});

/**
 * Update accommodation (Owner or Admin only)
 * PUT /api/accommodations/:id
 */
const updateAccommodation = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError('Validation failed', errors.array());
  }

  const accommodation = await Accommodation.findById(id);
  if (!accommodation) {
    throw new AppError('Accommodation not found', 404);
  }

  // Check ownership or admin privileges
  const canUpdate = accommodation.hostId.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);
  
  if (!canUpdate) {
    throw new AuthorizationError('You can only update your own accommodations');
  }

  // Fields that can be updated
  const allowedUpdates = [
    'title', 'description', 'type', 'category', 'location', 'amenities',
    'rooms', 'pricing', 'policies', 'hostInfo', 'languages', 'tags',
    'media', 'featured'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // If title is updated, regenerate slug
  if (updates.title && updates.title !== accommodation.title) {
    const baseSlug = updates.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (await Accommodation.findOne({ slug, _id: { $ne: id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    updates.slug = slug;
  }

  // Update last modified timestamp
  updates.updatedAt = new Date();

  try {
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('hostId', 'firstName lastName hostProfile.businessInfo');

    logger.info('Accommodation updated successfully', {
      accommodationId: id,
      hostId: req.user.id,
      updatedFields: Object.keys(updates)
    });

    res.status(200).json({
      success: true,
      message: 'Accommodation updated successfully',
      data: {
        accommodation: updatedAccommodation.toJSON()
      }
    });

  } catch (error) {
    logger.error('Failed to update accommodation', {
      accommodationId: id,
      hostId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Delete accommodation (Owner or Admin only)
 * DELETE /api/accommodations/:id
 */
const deleteAccommodation = catchAsync(async (req, res) => {
  const { id } = req.params;

  const accommodation = await Accommodation.findById(id);
  if (!accommodation) {
    throw new AppError('Accommodation not found', 404);
  }

  // Check ownership or admin privileges
  const canDelete = accommodation.hostId.toString() === req.user.id ||
                   ['admin', 'superadmin'].includes(req.user.role);
  
  if (!canDelete) {
    throw new AuthorizationError('You can only delete your own accommodations');
  }

  // Check for active bookings
  const activeBookings = await Booking.countDocuments({
    itemId: id,
    itemType: 'Accommodation',
    status: { $in: ['pending', 'confirmed', 'in_progress'] }
  });

  if (activeBookings > 0) {
    throw new ValidationError('Cannot delete accommodation with active bookings. Please cancel or complete all bookings first.');
  }

  try {
    // Soft delete - mark as deleted instead of removing
    await Accommodation.findByIdAndUpdate(id, {
      status: 'deleted',
      deletedAt: new Date()
    });

    logger.info('Accommodation deleted successfully', {
      accommodationId: id,
      hostId: req.user.id
    });

    res.status(200).json({
      success: true,
      message: 'Accommodation deleted successfully'
    });

  } catch (error) {
    logger.error('Failed to delete accommodation', {
      accommodationId: id,
      hostId: req.user.id,
      error: error.message
    });
    throw error;
  }
});

/**
 * Get host's accommodations
 * GET /api/accommodations/my-accommodations
 */
const getMyAccommodations = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const query = { hostId: req.user.id };
  
  // Filter by status if provided
  if (status) {
    query.status = status;
  } else {
    // Exclude deleted accommodations by default
    query.status = { $ne: 'deleted' };
  }

  // Build sort options
  const sortOptions = {};
  sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const accommodations = await Accommodation.find(query)
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  const total = await Accommodation.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      accommodations,
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
 * Check accommodation availability
 * POST /api/accommodations/:id/check-availability
 */
const checkAvailability = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut, roomType, guests } = req.body;

  if (!checkIn || !checkOut) {
    throw new ValidationError('Check-in and check-out dates are required');
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    throw new ValidationError('Check-out date must be after check-in date');
  }

  const accommodation = await Accommodation.findById(id);
  if (!accommodation) {
    throw new AppError('Accommodation not found', 404);
  }

  // Check room availability for the date range
  const availableRooms = accommodation.rooms.types.filter(room => {
    // Check capacity if guests specified
    if (guests && room.capacity.maxGuests < guests) {
      return false;
    }

    // Check room type if specified
    if (roomType && room.name !== roomType) {
      return false;
    }

    // Check availability for each day in the range
    for (let date = new Date(checkInDate); date < checkOutDate; date.setDate(date.getDate() + 1)) {
      const availability = room.availability.find(avail => 
        avail.date.toDateString() === date.toDateString()
      );
      
      if (!availability || !availability.isAvailable || availability.availableRooms <= 0) {
        return false;
      }
    }

    return true;
  });

  const isAvailable = availableRooms.length > 0;
  const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  res.status(200).json({
    success: true,
    data: {
      isAvailable,
      availableRooms: availableRooms.map(room => ({
        name: room.name,
        capacity: room.capacity,
        pricePerNight: room.pricing.basePrice,
        totalPrice: room.pricing.basePrice * totalNights,
        amenities: room.amenities
      })),
      totalNights,
      dates: {
        checkIn: checkInDate,
        checkOut: checkOutDate
      }
    }
  });
});

/**
 * Toggle accommodation featured status (Admin only)
 * PATCH /api/accommodations/:id/featured
 */
const toggleFeatured = catchAsync(async (req, res) => {
  const { id } = req.params;

  if (!['admin', 'superadmin'].includes(req.user.role)) {
    throw new AuthorizationError('Admin privileges required');
  }

  const accommodation = await Accommodation.findById(id);
  if (!accommodation) {
    throw new AppError('Accommodation not found', 404);
  }

  accommodation.featured = !accommodation.featured;
  accommodation.featuredAt = accommodation.featured ? new Date() : null;
  await accommodation.save();

  logger.info(`Accommodation featured status toggled to ${accommodation.featured}`, {
    accommodationId: id,
    adminId: req.user.id
  });

  res.status(200).json({
    success: true,
    message: `Accommodation ${accommodation.featured ? 'featured' : 'unfeatured'} successfully`,
    data: {
      featured: accommodation.featured,
      featuredAt: accommodation.featuredAt
    }
  });
});

module.exports = {
  createAccommodation,
  getAccommodations,
  getAccommodationById,
  updateAccommodation,
  deleteAccommodation,
  getMyAccommodations,
  checkAvailability,
  toggleFeatured
};