const express = require('express');
const router = express.Router();
const { catchAsync } = require('../middleware/errorHandler');
const Trip = require('../models/Trip');
const Accommodation = require('../models/Accommodation');

// General search endpoint
router.get('/', catchAsync(async (req, res) => {
  const { 
    query, 
    destination, 
    category,
    minPrice, 
    maxPrice,
    startDate,
    endDate,
    duration,
    difficulty,
    rating,
    page = 1, 
    limit = 12,
    sortBy = 'relevance'
  } = req.query;

  // Build search filters
  const filters = {};
  
  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
      { categories: { $in: [new RegExp(query, 'i')] } }
    ];
  }

  if (destination) {
    filters.location = { $regex: destination, $options: 'i' };
  }

  if (category) {
    filters.categories = { $in: [category] };
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = parseFloat(minPrice);
    if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
  }

  if (duration) {
    const [minDuration, maxDuration] = duration.split('-').map(Number);
    filters.duration = {};
    if (minDuration) filters.duration.$gte = minDuration;
    if (maxDuration) filters.duration.$lte = maxDuration;
  }

  if (difficulty) {
    filters.difficulty = { $in: Array.isArray(difficulty) ? difficulty : [difficulty] };
  }

  if (rating) {
    filters.rating = { $gte: parseFloat(rating) };
  }

  // Add date availability filters if provided
  if (startDate || endDate) {
    filters.availability = { $elemMatch: {} };
    if (startDate) {
      filters.availability.$elemMatch.startDate = { $lte: new Date(startDate) };
    }
    if (endDate) {
      filters.availability.$elemMatch.endDate = { $gte: new Date(endDate) };
    }
  }

  // Build sort criteria
  let sort = {};
  switch (sortBy) {
    case 'price_low':
      sort.price = 1;
      break;
    case 'price_high':
      sort.price = -1;
      break;
    case 'rating':
      sort.rating = -1;
      break;
    case 'duration':
      sort.duration = 1;
      break;
    case 'newest':
      sort.createdAt = -1;
      break;
    case 'popular':
      sort.bookingCount = -1;
      break;
    default:
      // Relevance sorting - combine rating and booking count
      sort = { rating: -1, bookingCount: -1 };
  }

  // Search trips
  const [trips, accommodations, tripCount, accommodationCount] = await Promise.all([
    Trip.find({ ...filters, status: 'active' })
      .select('title description price duration difficulty images location rating reviewCount categories bookingCount featured')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit)),
      
    Accommodation.find({
      ...filters,
      status: 'active',
      // Adjust price field for accommodations
      ...(filters.price && { pricePerNight: filters.price })
    })
      .select('name description pricePerNight amenities images location rating reviewCount categories bookingCount featured')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit)),
      
    Trip.countDocuments({ ...filters, status: 'active' }),
    
    Accommodation.countDocuments({
      ...filters,
      status: 'active',
      ...(filters.price && { pricePerNight: filters.price })
    })
  ]);

  // Combine and sort results if needed
  const allResults = [
    ...trips.map(trip => ({ ...trip.toObject(), type: 'trip' })),
    ...accommodations.map(acc => ({ ...acc.toObject(), type: 'accommodation' }))
  ];

  const totalResults = tripCount + accommodationCount;

  res.json({
    success: true,
    data: {
      results: allResults,
      trips,
      accommodations,
      totalResults,
      tripCount,
      accommodationCount
    },
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalResults / parseInt(limit)),
      totalItems: totalResults,
      hasMore: parseInt(page) * parseInt(limit) < totalResults
    },
    filters: {
      appliedFilters: {
        query,
        destination,
        category,
        minPrice,
        maxPrice,
        duration,
        difficulty,
        rating,
        sortBy
      }
    }
  });
}));

// Trip-specific search
router.get('/trips', catchAsync(async (req, res) => {
  const { 
    query, 
    destination, 
    category,
    minPrice, 
    maxPrice,
    duration,
    difficulty,
    rating,
    page = 1, 
    limit = 12,
    sortBy = 'relevance'
  } = req.query;

  const filters = { status: 'active' };
  
  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
      { categories: { $in: [new RegExp(query, 'i')] } }
    ];
  }

  if (destination) {
    filters.location = { $regex: destination, $options: 'i' };
  }

  if (category) {
    filters.categories = { $in: [category] };
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = parseFloat(minPrice);
    if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
  }

  if (duration) {
    const [minDuration, maxDuration] = duration.split('-').map(Number);
    filters.duration = {};
    if (minDuration) filters.duration.$gte = minDuration;
    if (maxDuration) filters.duration.$lte = maxDuration;
  }

  if (difficulty) {
    filters.difficulty = { $in: Array.isArray(difficulty) ? difficulty : [difficulty] };
  }

  if (rating) {
    filters.rating = { $gte: parseFloat(rating) };
  }

  // Sort options
  let sort = {};
  switch (sortBy) {
    case 'price_low':
      sort.price = 1;
      break;
    case 'price_high':
      sort.price = -1;
      break;
    case 'rating':
      sort.rating = -1;
      break;
    case 'duration':
      sort.duration = 1;
      break;
    case 'newest':
      sort.createdAt = -1;
      break;
    case 'popular':
      sort.bookingCount = -1;
      break;
    default:
      sort = { rating: -1, bookingCount: -1 };
  }

  const [trips, totalTrips] = await Promise.all([
    Trip.find(filters)
      .select('title description price duration difficulty images location rating reviewCount categories bookingCount featured')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit)),
      
    Trip.countDocuments(filters)
  ]);

  res.json({
    success: true,
    data: trips,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrips / parseInt(limit)),
      totalItems: totalTrips,
      hasMore: parseInt(page) * parseInt(limit) < totalTrips
    }
  });
}));

// Accommodation-specific search
router.get('/accommodations', catchAsync(async (req, res) => {
  const { 
    query, 
    destination, 
    type,
    minPrice, 
    maxPrice,
    amenities,
    rating,
    page = 1, 
    limit = 12,
    sortBy = 'relevance'
  } = req.query;

  const filters = { status: 'active' };
  
  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } }
    ];
  }

  if (destination) {
    filters.location = { $regex: destination, $options: 'i' };
  }

  if (type) {
    filters.type = { $in: Array.isArray(type) ? type : [type] };
  }

  if (minPrice || maxPrice) {
    filters.pricePerNight = {};
    if (minPrice) filters.pricePerNight.$gte = parseFloat(minPrice);
    if (maxPrice) filters.pricePerNight.$lte = parseFloat(maxPrice);
  }

  if (amenities) {
    filters.amenities = { $in: Array.isArray(amenities) ? amenities : [amenities] };
  }

  if (rating) {
    filters.rating = { $gte: parseFloat(rating) };
  }

  // Sort options
  let sort = {};
  switch (sortBy) {
    case 'price_low':
      sort.pricePerNight = 1;
      break;
    case 'price_high':
      sort.pricePerNight = -1;
      break;
    case 'rating':
      sort.rating = -1;
      break;
    case 'newest':
      sort.createdAt = -1;
      break;
    case 'popular':
      sort.bookingCount = -1;
      break;
    default:
      sort = { rating: -1, bookingCount: -1 };
  }

  const [accommodations, totalAccommodations] = await Promise.all([
    Accommodation.find(filters)
      .select('name description pricePerNight amenities images location rating reviewCount type bookingCount featured')
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit)),
      
    Accommodation.countDocuments(filters)
  ]);

  res.json({
    success: true,
    data: accommodations,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAccommodations / parseInt(limit)),
      totalItems: totalAccommodations,
      hasMore: parseInt(page) * parseInt(limit) < totalAccommodations
    }
  });
}));

// Search suggestions/autocomplete
router.get('/suggestions', catchAsync(async (req, res) => {
  const { query, limit = 10 } = req.query;

  if (!query || query.length < 2) {
    return res.json({
      success: true,
      data: []
    });
  }

  const [tripSuggestions, accommodationSuggestions, locationSuggestions] = await Promise.all([
    Trip.find({
      title: { $regex: query, $options: 'i' },
      status: 'active'
    })
    .select('title location')
    .limit(5),

    Accommodation.find({
      name: { $regex: query, $options: 'i' },
      status: 'active'
    })
    .select('name location')
    .limit(5),

    Trip.aggregate([
      {
        $match: {
          location: { $regex: query, $options: 'i' },
          status: 'active'
        }
      },
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ])
  ]);

  const suggestions = [
    ...tripSuggestions.map(trip => ({
      type: 'trip',
      title: trip.title,
      location: trip.location
    })),
    ...accommodationSuggestions.map(acc => ({
      type: 'accommodation',
      title: acc.name,
      location: acc.location
    })),
    ...locationSuggestions.map(loc => ({
      type: 'location',
      title: loc._id,
      count: loc.count
    }))
  ];

  res.json({
    success: true,
    data: suggestions.slice(0, parseInt(limit))
  });
}));

module.exports = router;