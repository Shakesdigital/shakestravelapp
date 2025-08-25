const express = require('express');
const router = express.Router();
const { catchAsync } = require('../middleware/errorHandler');
const User = require('../models/User');

// Get public trip plans
router.get('/public', catchAsync(async (req, res) => {
  const { page = 1, limit = 12, category, duration, budget } = req.query;

  // Find users with public trip plans
  const query = { 'tripPlans.isPublic': true };
  
  const users = await User.find(query)
    .populate('tripPlans.trips', 'title images price location duration')
    .populate('tripPlans.accommodations', 'name images pricePerNight location')
    .select('name tripPlans');

  // Extract and flatten public trip plans
  let publicPlans = [];
  users.forEach(user => {
    const userPublicPlans = user.tripPlans
      .filter(plan => plan.isPublic)
      .map(plan => ({
        ...plan.toObject(),
        author: {
          id: user._id,
          name: user.name
        }
      }));
    publicPlans = publicPlans.concat(userPublicPlans);
  });

  // Apply filters
  if (category) {
    publicPlans = publicPlans.filter(plan => 
      plan.trips.some(trip => trip.categories?.includes(category))
    );
  }

  if (duration) {
    const [minDays, maxDays] = duration.split('-').map(Number);
    publicPlans = publicPlans.filter(plan => {
      const planDuration = Math.ceil((new Date(plan.endDate) - new Date(plan.startDate)) / (1000 * 60 * 60 * 24));
      return planDuration >= minDays && planDuration <= maxDays;
    });
  }

  if (budget) {
    const [minBudget, maxBudget] = budget.split('-').map(Number);
    publicPlans = publicPlans.filter(plan => 
      plan.budget >= minBudget && plan.budget <= maxBudget
    );
  }

  // Sort by created date (newest first)
  publicPlans.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Implement pagination
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedPlans = publicPlans.slice(startIndex, endIndex);

  res.json({
    success: true,
    data: paginatedPlans,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(publicPlans.length / parseInt(limit)),
      totalItems: publicPlans.length,
      hasMore: endIndex < publicPlans.length
    }
  });
}));

// Get specific trip plan by ID
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ 'tripPlans.id': id })
    .populate('tripPlans.trips', 'title description price duration images location rating reviewCount')
    .populate('tripPlans.accommodations', 'name description pricePerNight images location rating reviewCount amenities')
    .select('name tripPlans');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Trip plan not found'
    });
  }

  const tripPlan = user.tripPlans.find(plan => plan.id === id);

  if (!tripPlan) {
    return res.status(404).json({
      success: false,
      message: 'Trip plan not found'
    });
  }

  // Check if trip plan is public or if user is the owner
  if (!tripPlan.isPublic) {
    return res.status(403).json({
      success: false,
      message: 'This trip plan is private'
    });
  }

  const response = {
    ...tripPlan.toObject(),
    author: {
      id: user._id,
      name: user.name
    }
  };

  res.json({
    success: true,
    data: response
  });
}));

module.exports = router;