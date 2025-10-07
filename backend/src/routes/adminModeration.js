const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authDynamoDB');
const { ExperienceModel, AccommodationModel, ArticleModel } = require('../models/DynamoDBUserContent');
const UserModel = require('../models/DynamoDBUser');

/**
 * Admin Content Moderation Routes
 *
 * These routes allow admins to:
 * - Review pending user-generated content
 * - Approve or reject content
 * - Manage published content
 * - View moderation statistics
 */

// All routes require admin role
router.use(authenticate);
router.use(authorize('admin', 'moderator'));

// ============= PENDING CONTENT OVERVIEW =============

/**
 * @route   GET /api/admin/moderation/pending-all
 * @desc    Get all pending content across all types
 * @access  Admin/SuperAdmin
 */
router.get('/pending-all', async (req, res) => {
  try {
    const [pendingTrips, pendingAccommodations, pendingArticles] = await Promise.all([
      Trip.find({ status: 'draft' })
        .populate('providerId', 'firstName lastName email profile.avatar')
        .sort({ createdAt: -1 })
        .limit(50),
      Accommodation.find({ status: 'draft' })
        .populate('hostId', 'firstName lastName email profile.avatar')
        .sort({ createdAt: -1 })
        .limit(50),
      Article.getPendingArticles(50)
    ]);

    const pendingContent = {
      experiences: pendingTrips,
      accommodations: pendingAccommodations,
      articles: pendingArticles,
      counts: {
        experiences: pendingTrips.length,
        accommodations: pendingAccommodations.length,
        articles: pendingArticles.length,
        total: pendingTrips.length + pendingAccommodations.length + pendingArticles.length
      }
    };

    res.json({
      success: true,
      data: pendingContent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/moderation/stats
 * @desc    Get moderation statistics
 * @access  Admin/SuperAdmin
 */
router.get('/stats', async (req, res) => {
  try {
    const [tripStats, accommodationStats, articleStats] = await Promise.all([
      Trip.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Accommodation.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]),
      Article.aggregate([
        {
          $group: {
            _id: '$moderationStatus',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Convert arrays to objects for easier access
    const tripStatsObj = tripStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const accommodationStatsObj = accommodationStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const articleStatsObj = articleStats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    const stats = {
      experiences: {
        draft: tripStatsObj.draft || 0,
        active: tripStatsObj.active || 0,
        paused: tripStatsObj.paused || 0,
        suspended: tripStatsObj.suspended || 0,
        archived: tripStatsObj.archived || 0,
        total: Object.values(tripStatsObj).reduce((sum, val) => sum + val, 0)
      },
      accommodations: {
        draft: accommodationStatsObj.draft || 0,
        active: accommodationStatsObj.active || 0,
        paused: accommodationStatsObj.paused || 0,
        suspended: accommodationStatsObj.suspended || 0,
        archived: accommodationStatsObj.archived || 0,
        total: Object.values(accommodationStatsObj).reduce((sum, val) => sum + val, 0)
      },
      articles: {
        draft: articleStatsObj.draft || 0,
        pending: articleStatsObj.pending || 0,
        approved: articleStatsObj.approved || 0,
        rejected: articleStatsObj.rejected || 0,
        flagged: articleStatsObj.flagged || 0,
        total: Object.values(articleStatsObj).reduce((sum, val) => sum + val, 0)
      },
      summary: {
        totalPending: (tripStatsObj.draft || 0) + (accommodationStatsObj.draft || 0) + (articleStatsObj.pending || 0),
        totalActive: (tripStatsObj.active || 0) + (accommodationStatsObj.active || 0) + (articleStatsObj.approved || 0),
        totalRejected: (articleStatsObj.rejected || 0),
        totalFlagged: (articleStatsObj.flagged || 0)
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

// ============= EXPERIENCE MODERATION =============

/**
 * @route   GET /api/admin/moderation/experiences
 * @desc    Get all experiences for moderation
 * @access  Admin/SuperAdmin
 */
router.get('/experiences', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const experiences = await Trip.find(query)
      .populate('providerId', 'firstName lastName email phone profile.avatar hostProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trip.countDocuments(query);

    res.json({
      success: true,
      data: experiences,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/moderation/experiences/:id/approve
 * @desc    Approve an experience
 * @access  Admin/SuperAdmin
 */
router.put('/experiences/:id/approve', async (req, res) => {
  try {
    const { feedback } = req.body;

    const experience = await Trip.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    experience.status = 'active';
    experience.lastUpdatedBy = req.user._id;
    await experience.save();

    // TODO: Send notification to provider

    res.json({
      success: true,
      message: 'Experience approved successfully',
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
 * @route   PUT /api/admin/moderation/experiences/:id/reject
 * @desc    Reject an experience
 * @access  Admin/SuperAdmin
 */
router.put('/experiences/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const experience = await Trip.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    experience.status = 'suspended';
    experience.lastUpdatedBy = req.user._id;
    await experience.save();

    // TODO: Send notification to provider with rejection reason

    res.json({
      success: true,
      message: 'Experience rejected',
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
 * @route   PUT /api/admin/moderation/experiences/:id/suspend
 * @desc    Suspend an active experience
 * @access  Admin/SuperAdmin
 */
router.put('/experiences/:id/suspend', async (req, res) => {
  try {
    const { reason } = req.body;

    const experience = await Trip.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        error: 'Experience not found'
      });
    }

    experience.status = 'suspended';
    experience.lastUpdatedBy = req.user._id;
    await experience.save();

    res.json({
      success: true,
      message: 'Experience suspended',
      data: experience
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= ACCOMMODATION MODERATION =============

/**
 * @route   GET /api/admin/moderation/accommodations
 * @desc    Get all accommodations for moderation
 * @access  Admin/SuperAdmin
 */
router.get('/accommodations', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = status ? { status } : {};
    const skip = (page - 1) * limit;

    const accommodations = await Accommodation.find(query)
      .populate('hostId', 'firstName lastName email phone profile.avatar hostProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Accommodation.countDocuments(query);

    res.json({
      success: true,
      data: accommodations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/moderation/accommodations/:id/approve
 * @desc    Approve an accommodation
 * @access  Admin/SuperAdmin
 */
router.put('/accommodations/:id/approve', async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    accommodation.status = 'active';
    accommodation.lastUpdatedBy = req.user._id;
    await accommodation.save();

    res.json({
      success: true,
      message: 'Accommodation approved successfully',
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
 * @route   PUT /api/admin/moderation/accommodations/:id/reject
 * @desc    Reject an accommodation
 * @access  Admin/SuperAdmin
 */
router.put('/accommodations/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        error: 'Accommodation not found'
      });
    }

    accommodation.status = 'suspended';
    accommodation.lastUpdatedBy = req.user._id;
    await accommodation.save();

    res.json({
      success: true,
      message: 'Accommodation rejected',
      data: accommodation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= ARTICLE MODERATION =============

/**
 * @route   GET /api/admin/moderation/articles
 * @desc    Get all articles for moderation
 * @access  Admin/SuperAdmin
 */
router.get('/articles', async (req, res) => {
  try {
    const { moderationStatus, page = 1, limit = 20 } = req.query;

    const query = moderationStatus ? { moderationStatus } : {};
    const skip = (page - 1) * limit;

    const articles = await Article.find(query)
      .populate('authorId', 'firstName lastName email profile.avatar')
      .sort({ submittedForReviewAt: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/moderation/articles/:id
 * @desc    Get a specific article for review
 * @access  Admin/SuperAdmin
 */
router.get('/articles/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('authorId', 'firstName lastName email profile.avatar stats')
      .populate('relatedTrips', 'title images pricing.basePrice')
      .populate('relatedAccommodations', 'title images pricing.basePrice')
      .populate('moderationHistory.reviewedBy', 'firstName lastName');

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
 * @route   PUT /api/admin/moderation/articles/:id/approve
 * @desc    Approve an article
 * @access  Admin/SuperAdmin
 */
router.put('/articles/:id/approve', async (req, res) => {
  try {
    const { feedback, autoPublish = true } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    await article.approve(req.user._id, feedback);

    if (autoPublish) {
      article.publishStatus = 'published';
      article.publishedAt = new Date();
      await article.save();
    }

    res.json({
      success: true,
      message: `Article approved${autoPublish ? ' and published' : ''} successfully`,
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
 * @route   PUT /api/admin/moderation/articles/:id/reject
 * @desc    Reject an article
 * @access  Admin/SuperAdmin
 */
router.put('/articles/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    await article.reject(req.user._id, reason);

    res.json({
      success: true,
      message: 'Article rejected',
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
 * @route   PUT /api/admin/moderation/articles/:id/flag
 * @desc    Flag an article for further review
 * @access  Admin/SuperAdmin
 */
router.put('/articles/:id/flag', async (req, res) => {
  try {
    const { reason } = req.body;

    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    await article.flag(req.user._id, reason);

    res.json({
      success: true,
      message: 'Article flagged for review',
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
 * @route   PUT /api/admin/moderation/articles/:id/feature
 * @desc    Feature/unfeature an article
 * @access  Admin/SuperAdmin
 */
router.put('/articles/:id/feature', async (req, res) => {
  try {
    const { isFeatured } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { isFeatured: isFeatured === true },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: `Article ${isFeatured ? 'featured' : 'unfeatured'} successfully`,
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
 * @route   PUT /api/admin/moderation/articles/:id/editors-pick
 * @desc    Mark/unmark article as editor's pick
 * @access  Admin/SuperAdmin
 */
router.put('/articles/:id/editors-pick', async (req, res) => {
  try {
    const { isEditorsPick } = req.body;

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { isEditorsPick: isEditorsPick === true },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: `Article ${isEditorsPick ? 'marked as' : 'removed from'} editor's pick`,
      data: article
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// ============= USER MANAGEMENT =============

/**
 * @route   GET /api/admin/moderation/content-creators
 * @desc    Get all content creators with their stats
 * @access  Admin/SuperAdmin
 */
router.get('/content-creators', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const creators = await User.find({
      $or: [
        { role: 'host' },
        { 'hostProfile.isHost': true }
      ]
    })
    .select('firstName lastName email profile.avatar role hostProfile stats')
    .sort({ 'stats.totalTripsBooked': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Get content counts for each creator
    const creatorsWithCounts = await Promise.all(
      creators.map(async (creator) => {
        const [experienceCount, accommodationCount, articleCount] = await Promise.all([
          Trip.countDocuments({ providerId: creator._id }),
          Accommodation.countDocuments({ hostId: creator._id }),
          Article.countDocuments({ authorId: creator._id })
        ]);

        return {
          ...creator.toObject(),
          contentCounts: {
            experiences: experienceCount,
            accommodations: accommodationCount,
            articles: articleCount,
            total: experienceCount + accommodationCount + articleCount
          }
        };
      })
    );

    const total = await User.countDocuments({
      $or: [
        { role: 'host' },
        { 'hostProfile.isHost': true }
      ]
    });

    res.json({
      success: true,
      data: creatorsWithCounts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/admin/moderation/user/:userId/content
 * @desc    Get all content by a specific user
 * @access  Admin/SuperAdmin
 */
router.get('/user/:userId/content', async (req, res) => {
  try {
    const [experiences, accommodations, articles] = await Promise.all([
      Trip.find({ providerId: req.params.userId }).sort({ createdAt: -1 }),
      Accommodation.find({ hostId: req.params.userId }).sort({ createdAt: -1 }),
      Article.find({ authorId: req.params.userId }).sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      data: {
        experiences,
        accommodations,
        articles,
        summary: {
          totalExperiences: experiences.length,
          totalAccommodations: accommodations.length,
          totalArticles: articles.length,
          total: experiences.length + accommodations.length + articles.length
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/admin/moderation/user/:userId/verify-host
 * @desc    Verify a user as a trusted host
 * @access  Admin/SuperAdmin
 */
router.put('/user/:userId/verify-host', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.hostProfile.isVerified = true;
    user.hostProfile.verifiedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'User verified as trusted host',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
