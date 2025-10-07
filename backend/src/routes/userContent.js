const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const Trip = require('../models/Trip');
const Accommodation = require('../models/Accommodation');
const Article = require('../models/Article');
const { upload } = require('../middleware/upload');

/**
 * User Content Creation Routes
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
    const tripData = {
      ...req.body,
      providerId: req.user._id,
      status: 'draft' // All user-created content starts as draft
    };

    const trip = await Trip.create(tripData);

    res.status(201).json({
      success: true,
      message: 'Experience created successfully. Submit for review to publish.',
      data: trip
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

    const query = { providerId: req.user._id };
    if (status) query.status = status;

    const trips = await Trip.find(query)
      .sort({ createdAt: -1 })
      .populate('reviews.userId', 'firstName lastName profile.avatar');

    res.json({
      success: true,
      count: trips.length,
      data: trips
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
    const trip = await Trip.findOne({
      _id: req.params.id,
      providerId: req.user._id
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    // Only allow editing if status is draft or rejected
    if (!['draft', 'suspended'].includes(trip.status)) {
      return res.status(403).json({
        success: false,
        error: 'Cannot edit experience with current status. Please contact admin.'
      });
    }

    Object.assign(trip, req.body);
    trip.lastUpdatedBy = req.user._id;
    await trip.save();

    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: trip
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
    const trip = await Trip.findOne({
      _id: req.params.id,
      providerId: req.user._id,
      status: 'draft'
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found or cannot be submitted'
      });
    }

    // Change status to pending for admin review
    trip.status = 'active'; // Will be reviewed by admin before being truly active
    await trip.save();

    res.json({
      success: true,
      message: 'Experience submitted for review. You will be notified once it is approved.',
      data: trip
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
    const trip = await Trip.findOne({
      _id: req.params.id,
      providerId: req.user._id,
      status: 'draft'
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found or cannot be deleted'
      });
    }

    await trip.deleteOne();

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
    const accommodationData = {
      ...req.body,
      hostId: req.user._id,
      status: 'draft' // All user-created content starts as draft
    };

    const accommodation = await Accommodation.create(accommodationData);

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

    const query = { hostId: req.user._id };
    if (status) query.status = status;

    const accommodations = await Accommodation.find(query)
      .sort({ createdAt: -1 })
      .populate('reviews.userId', 'firstName lastName profile.avatar');

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
 * @route   PUT /api/user-content/accommodations/:id
 * @desc    Update an accommodation (only if draft or rejected)
 * @access  Private
 */
router.put('/accommodations/:id', protect, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      _id: req.params.id,
      hostId: req.user._id
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    // Only allow editing if status is draft or suspended
    if (!['draft', 'suspended'].includes(accommodation.status)) {
      return res.status(403).json({
        success: false,
        error: 'Cannot edit accommodation with current status. Please contact admin.'
      });
    }

    Object.assign(accommodation, req.body);
    accommodation.lastUpdatedBy = req.user._id;
    await accommodation.save();

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
 * @route   POST /api/user-content/accommodations/:id/submit-review
 * @desc    Submit accommodation for admin review
 * @access  Private
 */
router.post('/accommodations/:id/submit-review', protect, async (req, res) => {
  try {
    const accommodation = await Accommodation.findOne({
      _id: req.params.id,
      hostId: req.user._id,
      status: 'draft'
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found or cannot be submitted'
      });
    }

    // Change status to pending for admin review
    accommodation.status = 'active'; // Will be reviewed by admin before being truly active
    await accommodation.save();

    res.json({
      success: true,
      message: 'Accommodation submitted for review. You will be notified once it is approved.',
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
    const accommodation = await Accommodation.findOne({
      _id: req.params.id,
      hostId: req.user._id,
      status: 'draft'
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found or cannot be deleted'
      });
    }

    await accommodation.deleteOne();

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
    const articleData = {
      ...req.body,
      authorId: req.user._id,
      moderationStatus: 'draft',
      publishStatus: 'draft'
    };

    const article = await Article.create(articleData);

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

    const query = { authorId: req.user._id };
    if (status) query.moderationStatus = status;

    const articles = await Article.find(query)
      .sort({ createdAt: -1 });

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
    const article = await Article.findOne({
      _id: req.params.id,
      authorId: req.user._id
    })
    .populate('relatedTrips', 'title images pricing.basePrice')
    .populate('relatedAccommodations', 'title images pricing.basePrice')
    .populate('relatedArticles', 'title featuredImage excerpt');

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
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
    const article = await Article.findOne({
      _id: req.params.id,
      authorId: req.user._id
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Only allow editing if status is draft or rejected
    if (!article.canEdit) {
      return res.status(403).json({
        success: false,
        error: 'Cannot edit article with current status. Please contact admin.'
      });
    }

    // Track edit history
    article.editHistory.push({
      editedBy: req.user._id,
      editedAt: new Date(),
      changes: 'Content updated',
      version: article.version
    });

    article.version += 1;
    article.lastEditedAt = new Date();
    article.lastEditedBy = req.user._id;

    Object.assign(article, req.body);
    await article.save();

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
    const article = await Article.findOne({
      _id: req.params.id,
      authorId: req.user._id
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    if (!['draft', 'rejected'].includes(article.moderationStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Article cannot be submitted for review'
      });
    }

    await article.submitForReview();

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
    const article = await Article.findOne({
      _id: req.params.id,
      authorId: req.user._id,
      moderationStatus: 'draft'
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or cannot be deleted'
      });
    }

    await article.deleteOne();

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
 * @route   POST /api/user-content/articles/:id/schedule
 * @desc    Schedule an article for future publishing
 * @access  Private
 */
router.post('/articles/:id/schedule', protect, async (req, res) => {
  try {
    const { publishDate } = req.body;

    if (!publishDate) {
      return res.status(400).json({
        success: false,
        error: 'Publish date is required'
      });
    }

    const article = await Article.findOne({
      _id: req.params.id,
      authorId: req.user._id,
      moderationStatus: 'approved'
    });

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found or not approved'
      });
    }

    article.publishStatus = 'scheduled';
    article.scheduledPublishAt = new Date(publishDate);
    await article.save();

    res.json({
      success: true,
      message: `Article scheduled for publishing on ${new Date(publishDate).toLocaleDateString()}`,
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= UPLOAD IMAGES =============

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

// ============= DASHBOARD STATS =============

/**
 * @route   GET /api/user-content/dashboard-stats
 * @desc    Get user dashboard statistics
 * @access  Private
 */
router.get('/dashboard-stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const [trips, accommodations, articles] = await Promise.all([
      Trip.find({ providerId: userId }),
      Accommodation.find({ hostId: userId }),
      Article.find({ authorId: userId })
    ]);

    const stats = {
      experiences: {
        total: trips.length,
        draft: trips.filter(t => t.status === 'draft').length,
        active: trips.filter(t => t.status === 'active').length,
        paused: trips.filter(t => t.status === 'paused').length,
        suspended: trips.filter(t => t.status === 'suspended').length,
        totalBookings: trips.reduce((sum, t) => sum + t.stats.totalBookings, 0),
        totalRevenue: trips.reduce((sum, t) => sum + t.stats.totalRevenue, 0),
        averageRating: trips.length > 0
          ? trips.reduce((sum, t) => sum + t.rating.overall, 0) / trips.length
          : 0
      },
      accommodations: {
        total: accommodations.length,
        draft: accommodations.filter(a => a.status === 'draft').length,
        active: accommodations.filter(a => a.status === 'active').length,
        paused: accommodations.filter(a => a.status === 'paused').length,
        suspended: accommodations.filter(a => a.status === 'suspended').length,
        totalBookings: accommodations.reduce((sum, a) => sum + a.stats.totalBookings, 0),
        totalRevenue: accommodations.reduce((sum, a) => sum + a.stats.totalRevenue, 0),
        averageRating: accommodations.length > 0
          ? accommodations.reduce((sum, a) => sum + a.rating.overall, 0) / accommodations.length
          : 0
      },
      articles: {
        total: articles.length,
        draft: articles.filter(a => a.moderationStatus === 'draft').length,
        pending: articles.filter(a => a.moderationStatus === 'pending').length,
        approved: articles.filter(a => a.moderationStatus === 'approved').length,
        rejected: articles.filter(a => a.moderationStatus === 'rejected').length,
        published: articles.filter(a => a.publishStatus === 'published').length,
        totalViews: articles.reduce((sum, a) => sum + a.engagement.views, 0),
        totalLikes: articles.reduce((sum, a) => sum + a.engagement.likes.count, 0),
        totalComments: articles.reduce((sum, a) => sum + a.engagement.comments.count, 0)
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
