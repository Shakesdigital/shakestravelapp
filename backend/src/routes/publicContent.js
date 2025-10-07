const express = require('express');
const router = express.Router();
const { UserExperience, UserAccommodation, Article } = require('../models');

/**
 * Public Content Routes
 *
 * These routes provide approved user-generated content for public display
 * All content must have status='approved' to be returned
 */

// ============= PUBLIC EXPERIENCES =============

/**
 * @route   GET /api/public/experiences
 * @desc    Get all approved user-generated experiences
 * @access  Public
 */
router.get('/experiences', async (req, res) => {
  try {
    const { category, region, difficulty, minPrice, maxPrice, ecoFriendly, featured, limit = 100, page = 1 } = req.query;

    // Build query for approved experiences only
    const query = { status: 'approved', isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (region) query.region = region;
    if (difficulty) query.difficulty = difficulty;
    if (ecoFriendly === 'true') query['features.ecoFriendly'] = true;
    if (featured === 'true') query['features.featured'] = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const experiences = await UserExperience.find(query)
      .populate('userId', 'firstName lastName profile.avatar')
      .select('-reviewNotes -adminNotes')
      .sort({ 'features.featured': -1, approvedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await UserExperience.countDocuments(query);

    // Transform to match frontend interface
    const transformedExperiences = experiences.map(exp => ({
      id: exp.publicExperienceId || exp._id,
      _id: exp._id,
      title: exp.title,
      location: exp.location,
      region: exp.region,
      category: exp.category,
      duration: exp.duration,
      difficulty: exp.difficulty,
      rating: exp.rating?.average || 0,
      reviews: exp.rating?.count || 0,
      price: exp.price,
      originalPrice: exp.originalPrice,
      image: exp.images?.[0]?.url || '🎯',
      images: exp.images?.map(img => img.url) || [],
      description: exp.description,
      overview: exp.overview,
      highlights: exp.highlights,
      included: exp.included,
      itinerary: exp.itinerary,
      additionalInfo: exp.additionalInfo,
      availability: exp.availability,
      ecoFriendly: exp.features?.ecoFriendly || false,
      instantBooking: exp.features?.instantBooking || false,
      freeCancel: exp.features?.freeCancel || false,
      pickupIncluded: exp.features?.pickupIncluded || false,
      userGenerated: true,
      creator: {
        id: exp.userId?._id,
        name: `${exp.userId?.firstName || ''} ${exp.userId?.lastName || ''}`.trim() || 'Community Member',
        avatar: exp.userId?.profile?.avatar
      }
    }));

    res.json({
      success: true,
      count: transformedExperiences.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transformedExperiences
    });
  } catch (error) {
    console.error('Error fetching public experiences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experiences'
    });
  }
});

/**
 * @route   GET /api/public/experiences/:id
 * @desc    Get a single approved experience by ID
 * @access  Public
 */
router.get('/experiences/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by publicExperienceId first, then by _id
    const experience = await UserExperience.findOne({
      $or: [
        { publicExperienceId: parseInt(id) },
        { _id: id }
      ],
      status: 'approved',
      isActive: true
    })
      .populate('userId', 'firstName lastName profile.avatar profile.bio')
      .select('-reviewNotes -adminNotes')
      .lean();

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Transform to match frontend interface
    const transformedExperience = {
      id: experience.publicExperienceId || experience._id,
      _id: experience._id,
      title: experience.title,
      location: experience.location,
      region: experience.region,
      category: experience.category,
      duration: experience.duration,
      difficulty: experience.difficulty,
      rating: experience.rating?.average || 0,
      reviews: experience.rating?.count || 0,
      price: experience.price,
      originalPrice: experience.originalPrice,
      images: experience.images?.map(img => img.url) || [],
      description: experience.description,
      overview: experience.overview,
      highlights: experience.highlights,
      included: experience.included,
      itinerary: experience.itinerary,
      additionalInfo: experience.additionalInfo,
      availability: experience.availability,
      ecoFriendly: experience.features?.ecoFriendly || false,
      instantBooking: experience.features?.instantBooking || false,
      freeCancel: experience.features?.freeCancel || false,
      pickupIncluded: experience.features?.pickupIncluded || false,
      userGenerated: true,
      creator: {
        id: experience.userId?._id,
        name: `${experience.userId?.firstName || ''} ${experience.userId?.lastName || ''}`.trim() || 'Community Member',
        avatar: experience.userId?.profile?.avatar,
        bio: experience.userId?.profile?.bio
      }
    };

    res.json({
      success: true,
      data: transformedExperience
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experience'
    });
  }
});

// ============= PUBLIC ACCOMMODATIONS =============

/**
 * @route   GET /api/public/accommodations
 * @desc    Get all approved user-generated accommodations
 * @access  Public
 */
router.get('/accommodations', async (req, res) => {
  try {
    const { type, location, minPrice, maxPrice, amenities, featured, limit = 100, page = 1 } = req.query;

    // Build query for approved accommodations only
    const query = { status: 'approved', isActive: true };

    // Apply filters
    if (type) query.type = type;
    if (location) query.location = new RegExp(location, 'i');
    if (featured === 'true') query['features.featured'] = true;

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const accommodations = await UserAccommodation.find(query)
      .populate('userId', 'firstName lastName profile.avatar')
      .select('-reviewNotes -adminNotes')
      .sort({ 'features.featured': -1, approvedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await UserAccommodation.countDocuments(query);

    // Transform to match frontend interface
    const transformedAccommodations = accommodations.map(acc => ({
      id: acc.publicAccommodationId || acc._id,
      _id: acc._id,
      name: acc.name,
      type: acc.type,
      location: acc.location,
      address: acc.address,
      coordinates: acc.coordinates,
      description: acc.description,
      pricePerNight: acc.pricePerNight,
      maxGuests: acc.maxGuests,
      bedrooms: acc.bedrooms,
      bathrooms: acc.bathrooms,
      amenities: acc.amenities,
      images: acc.images?.map(img => img.url) || [],
      rating: acc.rating?.average || 0,
      reviews: acc.rating?.count || 0,
      cancellationPolicy: acc.cancellationPolicy,
      checkInTime: acc.checkInTime,
      checkOutTime: acc.checkOutTime,
      houseRules: acc.houseRules,
      features: acc.features,
      userGenerated: true,
      host: {
        id: acc.userId?._id,
        name: `${acc.userId?.firstName || ''} ${acc.userId?.lastName || ''}`.trim() || 'Community Host',
        avatar: acc.userId?.profile?.avatar
      }
    }));

    res.json({
      success: true,
      count: transformedAccommodations.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transformedAccommodations
    });
  } catch (error) {
    console.error('Error fetching public accommodations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accommodations'
    });
  }
});

/**
 * @route   GET /api/public/accommodations/:id
 * @desc    Get a single approved accommodation by ID
 * @access  Public
 */
router.get('/accommodations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await UserAccommodation.findOne({
      $or: [
        { publicAccommodationId: parseInt(id) },
        { _id: id }
      ],
      status: 'approved',
      isActive: true
    })
      .populate('userId', 'firstName lastName profile.avatar profile.bio')
      .select('-reviewNotes -adminNotes')
      .lean();

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    // Transform to match frontend interface
    const transformedAccommodation = {
      id: accommodation.publicAccommodationId || accommodation._id,
      _id: accommodation._id,
      name: accommodation.name,
      type: accommodation.type,
      location: accommodation.location,
      address: accommodation.address,
      coordinates: accommodation.coordinates,
      description: accommodation.description,
      pricePerNight: accommodation.pricePerNight,
      maxGuests: accommodation.maxGuests,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms,
      amenities: accommodation.amenities,
      images: accommodation.images?.map(img => img.url) || [],
      rating: accommodation.rating?.average || 0,
      reviews: accommodation.rating?.count || 0,
      cancellationPolicy: accommodation.cancellationPolicy,
      checkInTime: accommodation.checkInTime,
      checkOutTime: accommodation.checkOutTime,
      houseRules: accommodation.houseRules,
      features: accommodation.features,
      userGenerated: true,
      host: {
        id: accommodation.userId?._id,
        name: `${accommodation.userId?.firstName || ''} ${accommodation.userId?.lastName || ''}`.trim() || 'Community Host',
        avatar: accommodation.userId?.profile?.avatar,
        bio: accommodation.userId?.profile?.bio
      }
    };

    res.json({
      success: true,
      data: transformedAccommodation
    });
  } catch (error) {
    console.error('Error fetching accommodation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accommodation'
    });
  }
});

// ============= PUBLIC ARTICLES =============

/**
 * @route   GET /api/public/articles
 * @desc    Get all approved and published articles
 * @access  Public
 */
router.get('/articles', async (req, res) => {
  try {
    const { category, tags, featured, limit = 20, page = 1 } = req.query;

    // Build query for approved and published articles only
    const query = {
      moderationStatus: 'approved',
      publishStatus: 'published',
      isActive: true
    };

    // Apply filters
    if (category) query.category = category;
    if (tags) {
      const tagsList = tags.split(',');
      query.tags = { $in: tagsList };
    }
    if (featured === 'true') query.featured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const articles = await Article.find(query)
      .populate('authorId', 'firstName lastName profile.avatar')
      .select('-adminNotes -editHistory')
      .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .lean();

    const total = await Article.countDocuments(query);

    // Transform to match frontend interface
    const transformedArticles = articles.map(article => ({
      id: article._id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      featuredImage: article.featuredImage,
      images: article.images,
      seo: article.seo,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      views: article.engagement?.views || 0,
      likes: article.engagement?.likes?.count || 0,
      comments: article.engagement?.comments?.count || 0,
      userGenerated: true,
      author: {
        id: article.authorId?._id,
        name: `${article.authorId?.firstName || ''} ${article.authorId?.lastName || ''}`.trim() || 'Community Author',
        avatar: article.authorId?.profile?.avatar
      }
    }));

    res.json({
      success: true,
      count: transformedArticles.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: transformedArticles
    });
  } catch (error) {
    console.error('Error fetching public articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles'
    });
  }
});

/**
 * @route   GET /api/public/articles/:slug
 * @desc    Get a single approved article by slug
 * @access  Public
 */
router.get('/articles/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({
      slug,
      moderationStatus: 'approved',
      publishStatus: 'published',
      isActive: true
    })
      .populate('authorId', 'firstName lastName profile.avatar profile.bio')
      .select('-adminNotes -editHistory')
      .lean();

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Increment view count
    await Article.findByIdAndUpdate(article._id, {
      $inc: { 'engagement.views': 1 }
    });

    // Transform to match frontend interface
    const transformedArticle = {
      id: article._id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      tags: article.tags,
      featuredImage: article.featuredImage,
      images: article.images,
      seo: article.seo,
      publishedAt: article.publishedAt,
      readingTime: article.readingTime,
      views: article.engagement?.views || 0,
      likes: article.engagement?.likes?.count || 0,
      comments: article.engagement?.comments?.count || 0,
      userGenerated: true,
      author: {
        id: article.authorId?._id,
        name: `${article.authorId?.firstName || ''} ${article.authorId?.lastName || ''}`.trim() || 'Community Author',
        avatar: article.authorId?.profile?.avatar,
        bio: article.authorId?.profile?.bio
      }
    };

    res.json({
      success: true,
      data: transformedArticle
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch article'
    });
  }
});

module.exports = router;
