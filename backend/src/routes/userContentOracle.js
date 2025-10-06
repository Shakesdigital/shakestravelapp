const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { ExperienceModel, AccommodationModel, ArticleModel } = require('../models/OracleUserContent');
const { upload } = require('../middleware/upload');

/**
 * User Content Creation Routes - Oracle DB Version
 *
 * These routes allow authenticated users to create their own:
 * - Experiences (Trips)
 * - Accommodations
 * - Articles/Blog Posts
 *
 * All content goes through moderation before being published
 */

// ============= EXPERIENCES (TRIPS) =============

/**
 * @route   POST /api/user-content/experiences
 * @desc    Create a new experience/trip
 * @access  Private (authenticated users)
 */
router.post('/experiences', protect, async (req, res) => {
  try {
    const experience = await ExperienceModel.create(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Experience created successfully. Submit for review to publish.',
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/experiences/my
 * @desc    Get all experiences created by the current user
 * @access  Private
 */
router.get('/experiences/my', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const experiences = await ExperienceModel.findByUserId(req.user._id, status);

    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/experiences/:id
 * @desc    Get a specific experience (must be owned by user)
 * @access  Private
 */
router.get('/experiences/:id', protect, async (req, res) => {
  try {
    const experience = await ExperienceModel.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Check ownership
    if (experience.USER_ID !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this experience'
      });
    }

    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/user-content/experiences/:id
 * @desc    Update an experience (only if draft or rejected)
 * @access  Private
 */
router.put('/experiences/:id', protect, async (req, res) => {
  try {
    const experience = await ExperienceModel.update(req.params.id, req.user._id, req.body);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found or cannot be updated'
      });
    }

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/user-content/experiences/:id/submit-review
 * @desc    Submit experience for admin review
 * @access  Private
 */
router.post('/experiences/:id/submit-review', protect, async (req, res) => {
  try {
    const experience = await ExperienceModel.submitForReview(req.params.id, req.user._id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found or cannot be submitted'
      });
    }

    res.json({
      success: true,
      message: 'Experience submitted for review. You will be notified once it is approved.',
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/user-content/experiences/:id
 * @desc    Delete an experience (only if draft)
 * @access  Private
 */
router.delete('/experiences/:id', protect, async (req, res) => {
  try {
    const deleted = await ExperienceModel.delete(req.params.id, req.user._id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= ACCOMMODATIONS =============

/**
 * @route   POST /api/user-content/accommodations
 * @desc    Create a new accommodation
 * @access  Private (authenticated users)
 */
router.post('/accommodations', protect, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.create(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully. Submit for review to publish.',
      data: accommodation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/accommodations/my
 * @desc    Get all accommodations created by the current user
 * @access  Private
 */
router.get('/accommodations/my', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const accommodations = await AccommodationModel.findByUserId(req.user._id, status);

    res.json({
      success: true,
      count: accommodations.length,
      data: accommodations
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/accommodations/:id
 * @desc    Get a specific accommodation (must be owned by user)
 * @access  Private
 */
router.get('/accommodations/:id', protect, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    // Check ownership
    if (accommodation.USER_ID !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this accommodation'
      });
    }

    res.json({
      success: true,
      data: accommodation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/user-content/accommodations/:id
 * @desc    Update an accommodation (only if draft or rejected)
 * @access  Private
 */
router.put('/accommodations/:id', protect, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.update(req.params.id, req.user._id, req.body);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found or cannot be updated'
      });
    }

    res.json({
      success: true,
      message: 'Accommodation updated successfully',
      data: accommodation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/user-content/accommodations/:id
 * @desc    Delete an accommodation (only if draft)
 * @access  Private
 */
router.delete('/accommodations/:id', protect, async (req, res) => {
  try {
    const deleted = await AccommodationModel.delete(req.params.id, req.user._id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= ARTICLES =============

/**
 * @route   POST /api/user-content/articles
 * @desc    Create a new article/blog post
 * @access  Private (authenticated users)
 */
router.post('/articles', protect, async (req, res) => {
  try {
    const article = await ArticleModel.create(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Article created successfully. Submit for review to publish.',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/articles/my
 * @desc    Get all articles created by the current user
 * @access  Private
 */
router.get('/articles/my', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const articles = await ArticleModel.findByAuthorId(req.user._id, status);

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/articles/:id
 * @desc    Get a specific article (must be owned by user)
 * @access  Private
 */
router.get('/articles/:id', protect, async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Check ownership
    if (article.AUTHOR_ID !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this article'
      });
    }

    res.json({
      success: true,
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/user-content/articles/:id
 * @desc    Update an article (only if draft or rejected)
 * @access  Private
 */
router.put('/articles/:id', protect, async (req, res) => {
  try {
    const article = await ArticleModel.update(req.params.id, req.user._id, req.body);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or cannot be updated'
      });
    }

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/user-content/articles/:id/submit-review
 * @desc    Submit article for admin review
 * @access  Private
 */
router.post('/articles/:id/submit-review', protect, async (req, res) => {
  try {
    const article = await ArticleModel.submitForReview(req.params.id, req.user._id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or cannot be submitted'
      });
    }

    res.json({
      success: true,
      message: 'Article submitted for review. You will be notified once it is approved.',
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/user-content/articles/:id
 * @desc    Delete an article (only if draft)
 * @access  Private
 */
router.delete('/articles/:id', protect, async (req, res) => {
  try {
    const sql = `
      DELETE FROM user_articles
      WHERE id = :id AND author_id = :authorId AND moderation_status = 'draft'
    `;

    const oracle = require('../config/oracle');
    const result = await oracle.execute(sql, {
      id: req.params.id,
      authorId: req.user._id
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or cannot be deleted'
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/user-content/upload-images
 * @desc    Upload images for content
 * @access  Private
 */
router.post('/upload-images', protect, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path, // Cloudinary URL
      publicId: file.filename,
      originalName: file.originalname
    }));

    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: uploadedImages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-content/dashboard-stats
 * @desc    Get user dashboard statistics
 * @access  Private
 */
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const oracle = require('../config/oracle');

    // Get experiences stats
    const expStats = await oracle.executeOne(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        AVG(rating_average) as avg_rating
      FROM user_experiences
      WHERE user_id = :userId
    `, { userId });

    // Get accommodations stats
    const accStats = await oracle.executeOne(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        AVG(rating_average) as avg_rating
      FROM user_accommodations
      WHERE user_id = :userId
    `, { userId });

    // Get articles stats
    const artStats = await oracle.executeOne(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN moderation_status = 'draft' THEN 1 ELSE 0 END) as draft,
        SUM(CASE WHEN moderation_status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN moderation_status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN moderation_status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN publish_status = 'published' THEN 1 ELSE 0 END) as published,
        SUM(views_count) as total_views,
        SUM(likes_count) as total_likes,
        SUM(comments_count) as total_comments
      FROM user_articles
      WHERE author_id = :userId
    `, { userId });

    const stats = {
      experiences: {
        total: Number(expStats?.TOTAL || 0),
        draft: Number(expStats?.DRAFT || 0),
        pending: Number(expStats?.PENDING || 0),
        approved: Number(expStats?.APPROVED || 0),
        rejected: Number(expStats?.REJECTED || 0),
        averageRating: Number(expStats?.AVG_RATING || 0)
      },
      accommodations: {
        total: Number(accStats?.TOTAL || 0),
        draft: Number(accStats?.DRAFT || 0),
        pending: Number(accStats?.PENDING || 0),
        approved: Number(accStats?.APPROVED || 0),
        rejected: Number(accStats?.REJECTED || 0),
        averageRating: Number(accStats?.AVG_RATING || 0)
      },
      articles: {
        total: Number(artStats?.TOTAL || 0),
        draft: Number(artStats?.DRAFT || 0),
        pending: Number(artStats?.PENDING || 0),
        approved: Number(artStats?.APPROVED || 0),
        rejected: Number(artStats?.REJECTED || 0),
        published: Number(artStats?.PUBLISHED || 0),
        totalViews: Number(artStats?.TOTAL_VIEWS || 0),
        totalLikes: Number(artStats?.TOTAL_LIKES || 0),
        totalComments: Number(artStats?.TOTAL_COMMENTS || 0)
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
