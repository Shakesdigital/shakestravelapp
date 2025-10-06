const express = require('express');
const router = express.Router();
const { ExperienceModel, AccommodationModel, ArticleModel } = require('../models/OracleUserContent');

/**
 * Public Content Routes - Oracle DB Version
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

    const filters = {
      limit: parseInt(limit)
    };

    if (category) filters.category = category;
    if (region) filters.region = region;
    if (featured === 'true') filters.featured = true;

    const experiences = await ExperienceModel.findApproved(filters);

    // Transform to match frontend interface
    const transformedExperiences = experiences.map(exp => ({
      id: exp.PUBLIC_EXPERIENCE_ID || exp.ID,
      _id: exp.ID,
      title: exp.TITLE,
      location: exp.LOCATION,
      region: exp.REGION,
      category: exp.CATEGORY,
      duration: exp.DURATION,
      difficulty: exp.DIFFICULTY,
      rating: exp.RATING_AVERAGE || 0,
      reviews: exp.RATING_COUNT || 0,
      price: exp.PRICE,
      originalPrice: exp.ORIGINAL_PRICE,
      image: exp.images && exp.images.length > 0 ? exp.images[0].URL : '🎯',
      images: exp.images ? exp.images.map(img => img.URL) : [],
      description: exp.DESCRIPTION,
      overview: exp.OVERVIEW,
      highlights: exp.HIGHLIGHTS,
      included: exp.INCLUDED,
      itinerary: exp.ITINERARY,
      additionalInfo: exp.ADDITIONAL_INFO,
      ecoFriendly: exp.ECO_FRIENDLY === 1,
      instantBooking: exp.INSTANT_BOOKING === 1,
      freeCancel: exp.FREE_CANCEL === 1,
      pickupIncluded: exp.PICKUP_INCLUDED === 1,
      userGenerated: true
    }));

    res.json({
      success: true,
      count: transformedExperiences.length,
      total: transformedExperiences.length,
      page: parseInt(page),
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
    const oracle = require('../config/oracle');

    // Try to find by public_experience_id or id
    const experience = await oracle.executeOne(`
      SELECT * FROM user_experiences
      WHERE (public_experience_id = :id OR id = :id)
      AND status = 'approved' AND is_active = 1
    `, { id });

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Fetch images
    const images = await oracle.executeMany(
      'SELECT * FROM experience_images WHERE experience_id = :id ORDER BY position, id',
      { id: experience.ID }
    );

    // Transform to match frontend interface
    const transformedExperience = {
      id: experience.PUBLIC_EXPERIENCE_ID || experience.ID,
      _id: experience.ID,
      title: experience.TITLE,
      location: experience.LOCATION,
      region: experience.REGION,
      category: experience.CATEGORY,
      duration: experience.DURATION,
      difficulty: experience.DIFFICULTY,
      rating: experience.RATING_AVERAGE || 0,
      reviews: experience.RATING_COUNT || 0,
      price: experience.PRICE,
      originalPrice: experience.ORIGINAL_PRICE,
      images: images.map(img => img.URL),
      description: experience.DESCRIPTION,
      overview: experience.OVERVIEW,
      highlights: experience.HIGHLIGHTS,
      included: experience.INCLUDED,
      itinerary: experience.ITINERARY,
      additionalInfo: experience.ADDITIONAL_INFO,
      ecoFriendly: experience.ECO_FRIENDLY === 1,
      instantBooking: experience.INSTANT_BOOKING === 1,
      freeCancel: experience.FREE_CANCEL === 1,
      pickupIncluded: experience.PICKUP_INCLUDED === 1,
      userGenerated: true
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
    const { type, location, minPrice, maxPrice, featured, limit = 100, page = 1 } = req.query;

    const filters = {
      limit: parseInt(limit)
    };

    if (type) filters.type = type;
    if (location) filters.location = location;
    if (featured === 'true') filters.featured = true;

    const accommodations = await AccommodationModel.findApproved(filters);

    // Transform to match frontend interface
    const transformedAccommodations = accommodations.map(acc => ({
      id: acc.PUBLIC_ACCOMMODATION_ID || acc.ID,
      _id: acc.ID,
      name: acc.NAME,
      type: acc.TYPE,
      location: acc.LOCATION,
      address: acc.ADDRESS,
      description: acc.DESCRIPTION,
      pricePerNight: acc.PRICE_PER_NIGHT,
      maxGuests: acc.MAX_GUESTS,
      bedrooms: acc.BEDROOMS,
      bathrooms: acc.BATHROOMS,
      amenities: acc.AMENITIES,
      images: acc.images ? acc.images.map(img => img.URL) : [],
      rating: acc.RATING_AVERAGE || 0,
      reviews: acc.RATING_COUNT || 0,
      cancellationPolicy: acc.CANCELLATION_POLICY,
      checkInTime: acc.CHECK_IN_TIME,
      checkOutTime: acc.CHECK_OUT_TIME,
      houseRules: acc.HOUSE_RULES,
      userGenerated: true
    }));

    res.json({
      success: true,
      count: transformedAccommodations.length,
      total: transformedAccommodations.length,
      page: parseInt(page),
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
    const oracle = require('../config/oracle');

    const accommodation = await oracle.executeOne(`
      SELECT * FROM user_accommodations
      WHERE (public_accommodation_id = :id OR id = :id)
      AND status = 'approved' AND is_active = 1
    `, { id });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    // Fetch images
    const images = await oracle.executeMany(
      'SELECT * FROM accommodation_images WHERE accommodation_id = :id ORDER BY position, id',
      { id: accommodation.ID }
    );

    // Transform to match frontend interface
    const transformedAccommodation = {
      id: accommodation.PUBLIC_ACCOMMODATION_ID || accommodation.ID,
      _id: accommodation.ID,
      name: accommodation.NAME,
      type: accommodation.TYPE,
      location: accommodation.LOCATION,
      address: accommodation.ADDRESS,
      description: accommodation.DESCRIPTION,
      pricePerNight: accommodation.PRICE_PER_NIGHT,
      maxGuests: accommodation.MAX_GUESTS,
      bedrooms: accommodation.BEDROOMS,
      bathrooms: accommodation.BATHROOMS,
      amenities: accommodation.AMENITIES,
      images: images.map(img => img.URL),
      rating: accommodation.RATING_AVERAGE || 0,
      reviews: accommodation.RATING_COUNT || 0,
      cancellationPolicy: accommodation.CANCELLATION_POLICY,
      checkInTime: accommodation.CHECK_IN_TIME,
      checkOutTime: accommodation.CHECK_OUT_TIME,
      houseRules: accommodation.HOUSE_RULES,
      userGenerated: true
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
    const { category, featured, limit = 20, page = 1 } = req.query;

    const filters = {
      limit: parseInt(limit)
    };

    if (category) filters.category = category;
    if (featured === 'true') filters.featured = true;

    const articles = await ArticleModel.findPublished(filters);

    // Transform to match frontend interface
    const transformedArticles = articles.map(article => ({
      id: article.ID,
      title: article.TITLE,
      slug: article.SLUG,
      excerpt: article.EXCERPT,
      content: article.CONTENT,
      category: article.CATEGORY,
      tags: article.TAGS,
      featuredImage: article.FEATURED_IMAGE_URL ? {
        url: article.FEATURED_IMAGE_URL,
        caption: article.FEATURED_IMAGE_CAPTION,
        altText: article.FEATURED_IMAGE_ALT
      } : null,
      publishedAt: article.PUBLISHED_AT,
      readingTime: article.READING_TIME,
      views: article.VIEWS_COUNT || 0,
      likes: article.LIKES_COUNT || 0,
      comments: article.COMMENTS_COUNT || 0,
      userGenerated: true
    }));

    res.json({
      success: true,
      count: transformedArticles.length,
      total: transformedArticles.length,
      page: parseInt(page),
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
    const oracle = require('../config/oracle');

    const article = await oracle.executeOne(`
      SELECT * FROM user_articles
      WHERE slug = :slug
      AND moderation_status = 'approved'
      AND publish_status = 'published'
      AND is_active = 1
    `, { slug });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Increment view count
    await ArticleModel.incrementViews(article.ID);

    // Transform to match frontend interface
    const transformedArticle = {
      id: article.ID,
      title: article.TITLE,
      slug: article.SLUG,
      excerpt: article.EXCERPT,
      content: article.CONTENT,
      category: article.CATEGORY,
      tags: article.TAGS,
      featuredImage: article.FEATURED_IMAGE_URL ? {
        url: article.FEATURED_IMAGE_URL,
        caption: article.FEATURED_IMAGE_CAPTION,
        altText: article.FEATURED_IMAGE_ALT
      } : null,
      publishedAt: article.PUBLISHED_AT,
      readingTime: article.READING_TIME,
      views: article.VIEWS_COUNT + 1 || 1,
      likes: article.LIKES_COUNT || 0,
      comments: article.COMMENTS_COUNT || 0,
      userGenerated: true
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
