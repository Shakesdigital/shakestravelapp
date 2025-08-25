const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');
const mongoose = require('mongoose');

// Models
const Trip = require('../models/Trip');
const Accommodation = require('../models/Accommodation');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Admin authentication middleware - all admin routes require admin access
router.use(auth);
router.use(isAdmin);

// Dashboard Stats
router.get('/dashboard/stats', catchAsync(async (req, res) => {
  const stats = await Promise.all([
    Trip.countDocuments(),
    Accommodation.countDocuments(),
    User.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
    Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Booking.countDocuments({ status: 'pending' }),
    User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
  ]);

  res.json({
    success: true,
    data: {
      trips: stats[0],
      accommodations: stats[1],
      users: stats[2],
      bookings: stats[3],
      reviews: stats[4],
      totalRevenue: stats[5][0]?.total || 0,
      pendingBookings: stats[6],
      newUsersThisMonth: stats[7],
    }
  });
}));

// Content Management
router.get('/content', catchAsync(async (req, res) => {
  const { type, status, search, page = 1, limit = 20 } = req.query;
  
  // This would typically query a Content model, but for now return static data
  // In a full implementation, you'd have a Content model for pages/articles
  const mockContent = [
    {
      id: '1',
      title: 'Home Page',
      type: 'page',
      status: 'published',
      author: 'Admin User',
      lastModified: new Date(),
      views: 1250,
      seoScore: 85
    },
    {
      id: '2',
      title: 'Ultimate Gorilla Trekking Guide',
      type: 'article',
      status: 'published',
      author: 'Travel Writer',
      lastModified: new Date(),
      views: 856,
      featured: true,
      seoScore: 92
    }
  ];

  res.json({
    success: true,
    data: mockContent,
    pagination: {
      currentPage: parseInt(page),
      totalPages: 1,
      totalItems: mockContent.length,
      hasMore: false
    }
  });
}));

// User Management
router.get('/users', catchAsync(async (req, res) => {
  const { page = 1, limit = 20, role, status, search } = req.query;
  
  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalUsers = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      totalItems: totalUsers,
      hasMore: parseInt(page) * parseInt(limit) < totalUsers
    }
  });
}));

// Update user status/role
router.put('/users/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role, status, isActive } = req.body;

  const updateData = {};
  if (role) updateData.role = role;
  if (status) updateData.status = status;
  if (typeof isActive === 'boolean') updateData.isActive = isActive;

  const user = await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
}));

// Booking Management
router.get('/bookings', catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, type, search } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (type) query.type = type;

  const bookings = await Booking.find(query)
    .populate('userId', 'name email')
    .populate('tripId', 'title')
    .populate('accommodationId', 'name')
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

// Update booking status
router.put('/bookings/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const booking = await Booking.findByIdAndUpdate(
    id,
    { 
      status, 
      adminNotes: notes,
      updatedAt: new Date()
    },
    { new: true, runValidators: true }
  ).populate('userId', 'name email')
   .populate('tripId', 'title')
   .populate('accommodationId', 'name');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found'
    });
  }

  res.json({
    success: true,
    data: booking,
    message: 'Booking updated successfully'
  });
}));

// Trip Management
router.get('/trips', catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, featured, search } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const trips = await Trip.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalTrips = await Trip.countDocuments(query);

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

// Update trip
router.put('/trips/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const trip = await Trip.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!trip) {
    return res.status(404).json({
      success: false,
      message: 'Trip not found'
    });
  }

  res.json({
    success: true,
    data: trip,
    message: 'Trip updated successfully'
  });
}));

// Accommodation Management
router.get('/accommodations', catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, featured, search } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (featured !== undefined) query.featured = featured === 'true';
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const accommodations = await Accommodation.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalAccommodations = await Accommodation.countDocuments(query);

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

// Update accommodation
router.put('/accommodations/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const accommodation = await Accommodation.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  );

  if (!accommodation) {
    return res.status(404).json({
      success: false,
      message: 'Accommodation not found'
    });
  }

  res.json({
    success: true,
    data: accommodation,
    message: 'Accommodation updated successfully'
  });
}));

// Review Management
router.get('/reviews', catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status, type, search } = req.query;
  
  const query = {};
  if (status) query.status = status;
  if (type) query.itemType = type;

  const reviews = await Review.find(query)
    .populate('userId', 'name email')
    .populate('itemId', 'title name')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const totalReviews = await Review.countDocuments(query);

  res.json({
    success: true,
    data: reviews,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalReviews / parseInt(limit)),
      totalItems: totalReviews,
      hasMore: parseInt(page) * parseInt(limit) < totalReviews
    }
  });
}));

// Update review status
router.put('/reviews/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, moderatorNotes } = req.body;

  const review = await Review.findByIdAndUpdate(
    id,
    { 
      status,
      moderatorNotes,
      moderatedAt: new Date(),
      moderatedBy: req.user.id
    },
    { new: true, runValidators: true }
  ).populate('userId', 'name email')
   .populate('itemId', 'title name');

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found'
    });
  }

  res.json({
    success: true,
    data: review,
    message: 'Review updated successfully'
  });
}));

// Analytics endpoints
router.get('/analytics/overview', catchAsync(async (req, res) => {
  const { period = '30d' } = req.query;
  
  // Calculate date range
  let startDate = new Date();
  switch(period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  const analytics = await Promise.all([
    // Bookings over time
    Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }},
      { $sort: { _id: 1 } }
    ]),
    
    // User registrations over time
    User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]),

    // Popular trips
    Trip.aggregate([
      { $sort: { viewCount: -1 } },
      { $limit: 10 },
      { $project: { title: 1, viewCount: 1, bookingCount: 1 } }
    ])
  ]);

  res.json({
    success: true,
    data: {
      bookings: analytics[0],
      users: analytics[1],
      popularTrips: analytics[2]
    }
  });
}));

module.exports = router;