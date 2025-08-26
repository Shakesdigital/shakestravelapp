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
  const { q, query, limit = 10, type = 'all' } = req.query;
  const searchQuery = q || query;

  if (!searchQuery || searchQuery.length < 2) {
    // Return popular Uganda destinations when no query
    const popularDestinations = [
      { id: 'bwindi', title: 'Bwindi Impenetrable Forest', type: 'destination', description: 'Home to mountain gorillas' },
      { id: 'queen-elizabeth', title: 'Queen Elizabeth National Park', type: 'destination', description: 'Uganda\'s most popular game park' },
      { id: 'murchison-falls', title: 'Murchison Falls National Park', type: 'destination', description: 'Uganda\'s largest national park' },
      { id: 'jinja', title: 'Jinja', type: 'destination', description: 'Adventure capital of East Africa' },
      { id: 'kampala', title: 'Kampala', type: 'destination', description: 'Capital city of Uganda' },
      { id: 'lake-bunyonyi', title: 'Lake Bunyonyi', type: 'destination', description: 'Beautiful crater lake' }
    ];

    return res.json({
      success: true,
      data: popularDestinations.slice(0, parseInt(limit))
    });
  }

  const searchRegex = { $regex: searchQuery, $options: 'i' };
  const promises = [];

  // Get trip experiences
  if (type === 'all' || type === 'experience') {
    promises.push(
      Trip.find({
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { categories: { $in: [new RegExp(searchQuery, 'i')] } }
        ],
        status: 'active'
      })
      .select('title description location categories price duration images slug')
      .limit(5)
    );
  }

  // Get accommodations
  if (type === 'all' || type === 'accommodation') {
    promises.push(
      Accommodation.find({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { type: searchRegex }
        ],
        status: 'active'
      })
      .select('name description location type pricePerNight images slug')
      .limit(5)
    );
  }

  // Get unique destinations/locations
  if (type === 'all' || type === 'destination') {
    promises.push(
      Trip.aggregate([
        {
          $match: {
            location: searchRegex,
            status: 'active'
          }
        },
        {
          $group: {
            _id: '$location',
            count: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            categories: { $addToSet: '$categories' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    );
  }

  const results = await Promise.all(promises);
  let tripSuggestions = [], accommodationSuggestions = [], locationSuggestions = [];

  let resultIndex = 0;
  if (type === 'all' || type === 'experience') {
    tripSuggestions = results[resultIndex++] || [];
  }
  if (type === 'all' || type === 'accommodation') {
    accommodationSuggestions = results[resultIndex++] || [];
  }
  if (type === 'all' || type === 'destination') {
    locationSuggestions = results[resultIndex++] || [];
  }

  // Uganda destinations data
  const ugandaDestinations = [
    { name: 'Bwindi Impenetrable Forest', description: 'Mountain gorilla trekking destination' },
    { name: 'Queen Elizabeth National Park', description: 'Wildlife and boat safaris' },
    { name: 'Murchison Falls National Park', description: 'Uganda\'s largest national park' },
    { name: 'Kibale Forest National Park', description: 'Chimpanzee trekking' },
    { name: 'Lake Mburo National Park', description: 'Compact savanna park' },
    { name: 'Jinja', description: 'White water rafting and Nile activities' },
    { name: 'Kampala', description: 'Capital city and cultural hub' },
    { name: 'Lake Bunyonyi', description: 'Scenic crater lake' },
    { name: 'Sipi Falls', description: 'Beautiful waterfalls and hiking' },
    { name: 'Rwenzori Mountains', description: 'Mountain climbing and hiking' }
  ];

  // Add Uganda destinations that match search
  const matchingUgandaDestinations = ugandaDestinations
    .filter(dest => dest.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3)
    .map(dest => ({
      id: dest.name.toLowerCase().replace(/\s+/g, '-'),
      title: dest.name,
      type: 'destination',
      description: dest.description,
      url: `/search?destination=${encodeURIComponent(dest.name)}`
    }));

  const suggestions = [
    // Experiences/Trips
    ...tripSuggestions.map(trip => ({
      id: trip._id,
      title: trip.title,
      type: 'experience',
      description: trip.description,
      location: trip.location,
      price: trip.price,
      duration: trip.duration,
      categories: trip.categories,
      image: trip.images?.[0],
      url: `/trips/${trip.slug || trip._id}`,
      slug: trip.slug
    })),
    
    // Accommodations
    ...accommodationSuggestions.map(acc => ({
      id: acc._id,
      title: acc.name,
      type: 'accommodation',
      description: acc.description,
      location: acc.location,
      price: acc.pricePerNight,
      accommodationType: acc.type,
      image: acc.images?.[0],
      url: `/accommodations/${acc.slug || acc._id}`,
      slug: acc.slug
    })),
    
    // Destinations from database
    ...locationSuggestions.map(loc => ({
      id: loc._id.toLowerCase().replace(/\s+/g, '-'),
      title: loc._id,
      type: 'destination',
      count: loc.count,
      avgPrice: loc.avgPrice,
      categories: loc.categories?.flat(),
      url: `/search?destination=${encodeURIComponent(loc._id)}`
    })),

    // Uganda destinations
    ...matchingUgandaDestinations
  ];

  // Remove duplicates and limit results
  const uniqueSuggestions = suggestions
    .filter((item, index, self) => 
      index === self.findIndex(t => t.title === item.title && t.type === item.type)
    )
    .slice(0, parseInt(limit));

  res.json({
    success: true,
    data: {
      items: uniqueSuggestions,
      hasMore: suggestions.length > parseInt(limit)
    }
  });
}));

// General search endpoint for autocomplete (matches frontend api.search.general call)
router.get('/general', catchAsync(async (req, res) => {
  const { q, limit = 6 } = req.query;

  if (!q || q.length < 2) {
    return res.json({
      success: true,
      data: { items: [] }
    });
  }

  const searchRegex = { $regex: q, $options: 'i' };

  // Search across trips, accommodations, and include Uganda destinations
  const [tripSuggestions, accommodationSuggestions] = await Promise.all([
    Trip.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { categories: { $in: [new RegExp(q, 'i')] } }
      ],
      status: 'active'
    })
    .select('title description location categories price duration images slug')
    .limit(3),

    Accommodation.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ],
      status: 'active'
    })
    .select('name description location type pricePerNight images slug')
    .limit(3)
  ]);

  // Uganda destinations data
  const ugandaDestinations = [
    { name: 'Bwindi Impenetrable Forest', description: 'Mountain gorilla trekking destination' },
    { name: 'Queen Elizabeth National Park', description: 'Wildlife and boat safaris' },
    { name: 'Murchison Falls National Park', description: 'Uganda\'s largest national park' },
    { name: 'Kibale Forest National Park', description: 'Chimpanzee trekking' },
    { name: 'Lake Mburo National Park', description: 'Compact savanna park' },
    { name: 'Jinja', description: 'White water rafting and Nile activities' },
    { name: 'Kampala', description: 'Capital city and cultural hub' },
    { name: 'Lake Bunyonyi', description: 'Scenic crater lake' },
    { name: 'Sipi Falls', description: 'Beautiful waterfalls and hiking' },
    { name: 'Rwenzori Mountains', description: 'Mountain climbing and hiking' }
  ];

  // Filter Uganda destinations by search query
  const matchingDestinations = ugandaDestinations
    .filter(dest => dest.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 2)
    .map(dest => ({
      id: dest.name.toLowerCase().replace(/\s+/g, '-'),
      title: dest.name,
      type: 'destination',
      description: dest.description,
      url: `/search?destination=${encodeURIComponent(dest.name)}`
    }));

  const suggestions = [
    // Trips/Experiences
    ...tripSuggestions.map(trip => ({
      id: trip._id,
      title: trip.title,
      type: 'guide',
      description: trip.description,
      location: trip.location,
      url: `/trips/${trip.slug || trip._id}`,
      slug: trip.slug
    })),
    
    // Accommodations
    ...accommodationSuggestions.map(acc => ({
      id: acc._id,
      title: acc.name,
      type: 'guide',
      description: acc.description,
      location: acc.location,
      url: `/accommodations/${acc.slug || acc._id}`,
      slug: acc.slug
    })),

    // Destinations
    ...matchingDestinations
  ];

  res.json({
    success: true,
    data: {
      items: suggestions.slice(0, parseInt(limit))
    }
  });
}));

module.exports = router;