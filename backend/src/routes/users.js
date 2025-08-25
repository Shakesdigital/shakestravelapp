const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Accommodation = require('../models/Accommodation');
const Booking = require('../models/Booking');

// All user routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -refreshToken')
    .populate('preferences.favoriteDestinations')
    .populate('preferences.interests');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

// Update user profile
router.put('/profile', catchAsync(async (req, res) => {
  const allowedUpdates = [
    'name', 'phone', 'dateOfBirth', 'nationality', 
    'emergencyContact', 'preferences', 'travelStyle',
    'profilePicture', 'bio'
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { ...updates, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  res.json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
}));

// Wishlist Management
router.get('/wishlist', catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'wishlist.trips',
      model: 'Trip',
      select: 'title description price duration difficulty images location rating reviewCount'
    })
    .populate({
      path: 'wishlist.accommodations', 
      model: 'Accommodation',
      select: 'name description pricePerNight amenities images location rating reviewCount'
    });

  const wishlist = {
    trips: user.wishlist?.trips || [],
    accommodations: user.wishlist?.accommodations || []
  };

  res.json({
    success: true,
    data: wishlist
  });
}));

router.post('/wishlist', catchAsync(async (req, res) => {
  const { itemId, itemType } = req.body;

  if (!['trip', 'accommodation'].includes(itemType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid item type'
    });
  }

  // Verify the item exists
  const Model = itemType === 'trip' ? Trip : Accommodation;
  const item = await Model.findById(itemId);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      message: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} not found`
    });
  }

  const user = await User.findById(req.user.id);
  const wishlistField = itemType === 'trip' ? 'wishlist.trips' : 'wishlist.accommodations';
  
  // Initialize wishlist if it doesn't exist
  if (!user.wishlist) {
    user.wishlist = { trips: [], accommodations: [] };
  }

  // Check if item is already in wishlist
  const wishlistArray = itemType === 'trip' ? user.wishlist.trips : user.wishlist.accommodations;
  if (wishlistArray.includes(itemId)) {
    return res.status(400).json({
      success: false,
      message: 'Item already in wishlist'
    });
  }

  // Add to wishlist
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { [wishlistField]: itemId } }
  );

  res.json({
    success: true,
    message: 'Item added to wishlist'
  });
}));

router.delete('/wishlist/:itemId', catchAsync(async (req, res) => {
  const { itemId } = req.params;

  await User.findByIdAndUpdate(
    req.user.id,
    { 
      $pull: { 
        'wishlist.trips': itemId,
        'wishlist.accommodations': itemId
      }
    }
  );

  res.json({
    success: true,
    message: 'Item removed from wishlist'
  });
}));

router.get('/wishlist/check', catchAsync(async (req, res) => {
  const { itemId, itemType } = req.query;

  const user = await User.findById(req.user.id);
  const wishlistArray = itemType === 'trip' ? user.wishlist?.trips || [] : user.wishlist?.accommodations || [];
  const isInWishlist = wishlistArray.includes(itemId);

  res.json({
    success: true,
    data: { isInWishlist }
  });
}));

// Trip Plans Management
router.get('/trip-plans', catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate({
      path: 'tripPlans',
      populate: [
        { path: 'trips', select: 'title duration price images location' },
        { path: 'accommodations', select: 'name pricePerNight images location' }
      ]
    });

  res.json({
    success: true,
    data: user.tripPlans || []
  });
}));

router.post('/trip-plans', catchAsync(async (req, res) => {
  const { name, description, startDate, endDate, trips, accommodations, budget, notes } = req.body;

  // Create trip plan object
  const tripPlan = {
    id: new Date().getTime().toString(), // Simple ID generation
    name,
    description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    trips: trips || [],
    accommodations: accommodations || [],
    budget,
    notes,
    createdAt: new Date(),
    isPublic: false
  };

  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { tripPlans: tripPlan } }
  );

  res.json({
    success: true,
    data: tripPlan,
    message: 'Trip plan created successfully'
  });
}));

router.put('/trip-plans/:planId', catchAsync(async (req, res) => {
  const { planId } = req.params;
  const updates = req.body;

  const user = await User.findOneAndUpdate(
    { _id: req.user.id, 'tripPlans.id': planId },
    { 
      $set: {
        'tripPlans.$.name': updates.name,
        'tripPlans.$.description': updates.description,
        'tripPlans.$.startDate': updates.startDate ? new Date(updates.startDate) : undefined,
        'tripPlans.$.endDate': updates.endDate ? new Date(updates.endDate) : undefined,
        'tripPlans.$.trips': updates.trips,
        'tripPlans.$.accommodations': updates.accommodations,
        'tripPlans.$.budget': updates.budget,
        'tripPlans.$.notes': updates.notes,
        'tripPlans.$.updatedAt': new Date()
      }
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Trip plan not found'
    });
  }

  const updatedPlan = user.tripPlans.find(plan => plan.id === planId);

  res.json({
    success: true,
    data: updatedPlan,
    message: 'Trip plan updated successfully'
  });
}));

router.delete('/trip-plans/:planId', catchAsync(async (req, res) => {
  const { planId } = req.params;

  await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { tripPlans: { id: planId } } }
  );

  res.json({
    success: true,
    message: 'Trip plan deleted successfully'
  });
}));

// Copy trip plan
router.post('/trip-plans/copy', catchAsync(async (req, res) => {
  const { sourceTripPlanId } = req.body;

  const sourceUser = await User.findOne({ 'tripPlans.id': sourceTripPlanId });
  
  if (!sourceUser) {
    return res.status(404).json({
      success: false,
      message: 'Source trip plan not found'
    });
  }

  const sourcePlan = sourceUser.tripPlans.find(plan => plan.id === sourceTripPlanId);
  
  if (!sourcePlan.isPublic && sourceUser._id.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Cannot copy private trip plan'
    });
  }

  // Create a copy with new ID
  const copiedPlan = {
    ...sourcePlan.toObject(),
    id: new Date().getTime().toString(),
    name: `Copy of ${sourcePlan.name}`,
    createdAt: new Date(),
    isPublic: false
  };

  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { tripPlans: copiedPlan } }
  );

  res.json({
    success: true,
    data: copiedPlan,
    message: 'Trip plan copied successfully'
  });
}));

// User booking history
router.get('/bookings', catchAsync(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  const query = { userId: req.user.id };
  if (status) query.status = status;

  const bookings = await Booking.find(query)
    .populate('tripId', 'title images duration location')
    .populate('accommodationId', 'name images location')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalBookings = await Booking.countDocuments(query);

  res.json({
    success: true,
    data: bookings,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBookings / parseInt(limit)),
      totalItems: totalBookings,
      hasMore: parseInt(page) * parseInt(limit) < totalBookings
    }
  });
}));

// Get personalized recommendations
router.get('/recommendations', catchAsync(async (req, res) => {
  const { type, limit = 10 } = req.query;

  const user = await User.findById(req.user.id);
  
  // Simple recommendation logic based on user preferences and booking history
  let recommendations = [];

  if (!type || type === 'trips') {
    const tripQuery = {};
    
    // Filter by user preferences if available
    if (user.preferences?.interests?.length > 0) {
      tripQuery.categories = { $in: user.preferences.interests };
    }

    const trips = await Trip.find(tripQuery)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit))
      .select('title description price duration images location rating reviewCount');

    recommendations.trips = trips;
  }

  if (!type || type === 'accommodations') {
    const accommodationQuery = {};
    
    const accommodations = await Accommodation.find(accommodationQuery)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit))
      .select('name description pricePerNight images location rating reviewCount amenities');

    recommendations.accommodations = accommodations;
  }

  res.json({
    success: true,
    data: recommendations
  });
}));

module.exports = router;