const express = require('express');
const router = express.Router();
const { ExperienceModel, AccommodationModel, ArticleModel } = require('../models/DynamoDBUserContent');

/**
 * Public Content Routes - DynamoDB Version
 *
 * These routes provide approved user-generated content for public display
 * All content must have status='approved' to be returned
 */

// ============= PUBLIC EXPERIENCES =============

router.get('/experiences', async (req, res) => {
  try {
    const { category, region, featured, limit = 100 } = req.query;

    const filters = { limit: parseInt(limit) };
    if (category) filters.category = category;
    if (region) filters.region = region;
    if (featured === 'true') filters.featured = true;

    const experiences = await ExperienceModel.findApproved(filters);

    res.json({
      success: true,
      count: experiences.length,
      total: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching public experiences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch experiences'
    });
  }
});

router.get('/experiences/:id', async (req, res) => {
  try {
    const experience = await ExperienceModel.findById(req.params.id);

    if (!experience || experience.status !== 'approved' || !experience.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    res.json({
      success: true,
      data: experience
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

router.get('/accommodations', async (req, res) => {
  try {
    const { type, location, featured, limit = 100 } = req.query;

    const filters = { limit: parseInt(limit) };
    if (type) filters.type = type;
    if (location) filters.location = location;
    if (featured === 'true') filters.featured = true;

    const accommodations = await AccommodationModel.findApproved(filters);

    res.json({
      success: true,
      count: accommodations.length,
      total: accommodations.length,
      data: accommodations
    });
  } catch (error) {
    console.error('Error fetching public accommodations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch accommodations'
    });
  }
});

router.get('/accommodations/:id', async (req, res) => {
  try {
    const accommodation = await AccommodationModel.findById(req.params.id);

    if (!accommodation || accommodation.status !== 'approved' || !accommodation.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    res.json({
      success: true,
      data: accommodation
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

router.get('/articles', async (req, res) => {
  try {
    const { category, featured, limit = 20 } = req.query;

    const filters = { limit: parseInt(limit) };
    if (category) filters.category = category;
    if (featured === 'true') filters.featured = true;

    const articles = await ArticleModel.findPublished(filters);

    res.json({
      success: true,
      count: articles.length,
      total: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Error fetching public articles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch articles'
    });
  }
});

router.get('/articles/:slug', async (req, res) => {
  try {
    const article = await ArticleModel.findBySlug(req.params.slug);

    if (!article || article.moderationStatus !== 'approved' || article.publishStatus !== 'published' || !article.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Increment view count
    await ArticleModel.incrementViews(article.id);

    res.json({
      success: true,
      data: {
        ...article,
        engagement: {
          ...article.engagement,
          views: (article.engagement?.views || 0) + 1
        }
      }
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
