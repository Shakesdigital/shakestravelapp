const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authDynamoDB');
const { ExperienceModel, AccommodationModel, ArticleModel } = require('../models/DynamoDBUserContent');
const { upload } = require('../middleware/upload');

/**
 * User Content Creation Routes - DynamoDB Version
 *
 * These routes allow authenticated users to create their own:
 * - Experiences (Trips)
 * - Accommodations
 * - Articles/Blog Posts
 *
 * All content goes through moderation before being published
 */

// ============= EXPERIENCES (TRIPS) =============

router.post('/experiences', authenticate, async (req, res) => {
  try {
    const experience = await ExperienceModel.create(req.user.id, req.body);

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

router.get('/experiences/my', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const experiences = await ExperienceModel.findByUserId(req.user.id, status);

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

router.get('/experiences/:id', authenticate, async (req, res) => {
  try {
    const experience = await ExperienceModel.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    if (experience.userId !== req.user.id.toString()) {
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

router.put('/experiences/:id', authenticate, async (req, res) => {
  try {
    const experience = await ExperienceModel.update(req.params.id, req.user.id, req.body);

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

router.post('/experiences/:id/submit-review', authenticate, async (req, res) => {
  try {
    const experience = await ExperienceModel.submitForReview(req.params.id, req.user.id);

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

router.delete('/experiences/:id', authenticate, async (req, res) => {
  try {
    const deleted = await ExperienceModel.delete(req.params.id, req.user.id);

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

router.post('/accommodations', authenticate, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.create(req.user.id, req.body);

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

router.get('/accommodations/my', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const accommodations = await AccommodationModel.findByUserId(req.user.id, status);

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

router.get('/accommodations/:id', authenticate, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    if (accommodation.userId !== req.user.id.toString()) {
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

router.put('/accommodations/:id', authenticate, async (req, res) => {
  try {
    const accommodation = await AccommodationModel.update(req.params.id, req.user.id, req.body);

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

router.delete('/accommodations/:id', authenticate, async (req, res) => {
  try {
    const deleted = await AccommodationModel.delete(req.params.id, req.user.id);

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

router.post('/articles', authenticate, async (req, res) => {
  try {
    const article = await ArticleModel.create(req.user.id, req.body);

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

router.get('/articles/my', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const articles = await ArticleModel.findByAuthorId(req.user.id, status);

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

router.get('/articles/:id', authenticate, async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    if (article.authorId !== req.user.id.toString()) {
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

router.put('/articles/:id', authenticate, async (req, res) => {
  try {
    const article = await ArticleModel.update(req.params.id, req.user.id, req.body);

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

router.post('/articles/:id/submit-review', authenticate, async (req, res) => {
  try {
    const article = await ArticleModel.submitForReview(req.params.id, req.user.id);

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

router.delete('/articles/:id', authenticate, async (req, res) => {
  try {
    const { deleteItem, TABLES } = require('../config/dynamodb');

    const article = await ArticleModel.findById(req.params.id);

    if (!article || article.authorId !== req.user.id.toString() || article.moderationStatus !== 'draft') {
      return res.status(404).json({
        success: false,
        error: 'Article not found or cannot be deleted'
      });
    }

    await deleteItem(TABLES.ARTICLES, { id: req.params.id });

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

// ============= UPLOAD IMAGES =============

router.post('/upload-images', authenticate, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedImages = req.files.map(file => ({
      url: file.path,
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

// ============= DASHBOARD STATS =============

router.get('/dashboard-stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const [experiences, accommodations, articles] = await Promise.all([
      ExperienceModel.findByUserId(userId),
      AccommodationModel.findByUserId(userId),
      ArticleModel.findByAuthorId(userId)
    ]);

    const stats = {
      experiences: {
        total: experiences.length,
        draft: experiences.filter(e => e.status === 'draft').length,
        pending: experiences.filter(e => e.status === 'pending').length,
        approved: experiences.filter(e => e.status === 'approved').length,
        rejected: experiences.filter(e => e.status === 'rejected').length,
        averageRating: experiences.length > 0
          ? experiences.reduce((sum, e) => sum + (e.rating?.average || 0), 0) / experiences.length
          : 0
      },
      accommodations: {
        total: accommodations.length,
        draft: accommodations.filter(a => a.status === 'draft').length,
        pending: accommodations.filter(a => a.status === 'pending').length,
        approved: accommodations.filter(a => a.status === 'approved').length,
        rejected: accommodations.filter(a => a.status === 'rejected').length,
        averageRating: accommodations.length > 0
          ? accommodations.reduce((sum, a) => sum + (a.rating?.average || 0), 0) / accommodations.length
          : 0
      },
      articles: {
        total: articles.length,
        draft: articles.filter(a => a.moderationStatus === 'draft').length,
        pending: articles.filter(a => a.moderationStatus === 'pending').length,
        approved: articles.filter(a => a.moderationStatus === 'approved').length,
        rejected: articles.filter(a => a.moderationStatus === 'rejected').length,
        published: articles.filter(a => a.publishStatus === 'published').length,
        totalViews: articles.reduce((sum, a) => sum + (a.engagement?.views || 0), 0),
        totalLikes: articles.reduce((sum, a) => sum + (a.engagement?.likes || 0), 0),
        totalComments: articles.reduce((sum, a) => sum + (a.engagement?.comments || 0), 0)
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
