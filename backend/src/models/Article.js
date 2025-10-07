const mongoose = require('mongoose');

/**
 * Article Schema - For user-generated blog posts and articles
 *
 * Features:
 * - User-generated content with moderation workflow
 * - Rich content support with media
 * - SEO optimization
 * - Category and tag management
 * - Publishing and scheduling
 * - Social sharing and engagement
 */

const articleSchema = new mongoose.Schema({
  // Author Information
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Article author is required'],
    index: true
  },

  // Content Information
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: 'text'
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  excerpt: {
    type: String,
    required: [true, 'Article excerpt is required'],
    trim: true,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },

  content: {
    type: String,
    required: [true, 'Article content is required'],
    trim: true,
    index: 'text'
  },

  // Article Type and Classification
  category: {
    type: String,
    required: [true, 'Article category is required'],
    enum: {
      values: [
        'travel-guide', 'destination-review', 'travel-tips', 'cultural-insights',
        'safari-stories', 'accommodation-review', 'food-and-dining', 'adventure',
        'photography', 'budget-travel', 'luxury-travel', 'family-travel',
        'solo-travel', 'eco-tourism', 'wildlife', 'events-and-festivals'
      ],
      message: 'Invalid article category'
    },
    index: true
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    index: true
  }],

  // Media Content
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Featured image is required']
    },
    publicId: String,
    caption: String,
    altText: String
  },

  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String,
    altText: String,
    position: Number // Position in article
  }],

  videos: [{
    url: String,
    thumbnail: String,
    title: String,
    description: String,
    duration: Number // in seconds
  }],

  // Location Reference (if article is location-specific)
  location: {
    country: {
      type: String,
      default: 'Uganda',
      index: true
    },
    region: String,
    city: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },

  // Related Content
  relatedTrips: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],

  relatedAccommodations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation'
  }],

  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],

  // Moderation Workflow
  moderationStatus: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'flagged'],
    default: 'draft',
    index: true
  },

  moderationHistory: [{
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'flagged'],
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewedAt: {
      type: Date,
      default: Date.now
    },
    feedback: String,
    reason: String
  }],

  submittedForReviewAt: Date,
  approvedAt: Date,
  rejectedAt: Date,

  rejectionReason: String,
  moderatorNotes: String,

  // Publishing Information
  publishStatus: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'archived'],
    default: 'draft',
    index: true
  },

  publishedAt: Date,
  scheduledPublishAt: Date,
  archivedAt: Date,

  // SEO Metadata
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [String],
    ogImage: {
      url: String,
      publicId: String
    }
  },

  // Engagement Metrics
  engagement: {
    views: {
      type: Number,
      default: 0,
      index: true
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    likes: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    shares: {
      count: { type: Number, default: 0 },
      platforms: {
        facebook: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        whatsapp: { type: Number, default: 0 },
        email: { type: Number, default: 0 }
      }
    },
    bookmarks: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    comments: {
      count: { type: Number, default: 0 }
    }
  },

  // Comments (simplified - can be separate collection)
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article.comments'
    },
    likes: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    isFlagged: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Reading Time Estimation
  readingTime: {
    type: Number, // in minutes
    default: 0
  },

  // Content Quality Score (calculated)
  qualityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Feature Flags
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },

  isTrending: {
    type: Boolean,
    default: false,
    index: true
  },

  isEditorsPick: {
    type: Boolean,
    default: false,
    index: true
  },

  // Visibility and Access
  visibility: {
    type: String,
    enum: ['public', 'private', 'unlisted'],
    default: 'public',
    index: true
  },

  // Version Control
  version: {
    type: Number,
    default: 1
  },

  editHistory: [{
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    },
    changes: String,
    version: Number
  }],

  // Administrative
  lastEditedAt: Date,
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimal query performance
articleSchema.index({ authorId: 1, moderationStatus: 1 });
articleSchema.index({ category: 1, publishStatus: 1 });
articleSchema.index({ moderationStatus: 1, submittedForReviewAt: 1 });
articleSchema.index({ publishStatus: 1, publishedAt: -1 });
articleSchema.index({ isFeatured: 1, publishedAt: -1 });
articleSchema.index({ isTrending: 1, 'engagement.views': -1 });
articleSchema.index({ 'engagement.views': -1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ tags: 1 });
articleSchema.index({ 'location.country': 1, 'location.region': 1 });

// Text search index
articleSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    excerpt: 5,
    tags: 3,
    content: 1
  }
});

// Compound indexes
articleSchema.index({
  publishStatus: 1,
  moderationStatus: 1,
  publishedAt: -1
});

articleSchema.index({
  category: 1,
  publishStatus: 1,
  'engagement.views': -1
});

// Virtual fields
articleSchema.virtual('isPublished').get(function() {
  return this.publishStatus === 'published' && this.moderationStatus === 'approved';
});

articleSchema.virtual('isPendingReview').get(function() {
  return this.moderationStatus === 'pending';
});

articleSchema.virtual('canEdit').get(function() {
  return ['draft', 'rejected'].includes(this.moderationStatus);
});

// Pre-save middleware
articleSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Add timestamp to ensure uniqueness
    this.slug += '-' + Date.now();
  }

  // Calculate reading time (average 200 words per minute)
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / 200);
  }

  // Calculate quality score
  this.qualityScore = this.calculateQualityScore();

  // Set submission date when status changes to pending
  if (this.isModified('moderationStatus') && this.moderationStatus === 'pending' && !this.submittedForReviewAt) {
    this.submittedForReviewAt = new Date();
  }

  // Set approval/rejection dates
  if (this.isModified('moderationStatus')) {
    if (this.moderationStatus === 'approved') {
      this.approvedAt = new Date();
    } else if (this.moderationStatus === 'rejected') {
      this.rejectedAt = new Date();
    }
  }

  // Auto-publish if scheduled publish date is reached
  if (this.scheduledPublishAt && this.scheduledPublishAt <= new Date() && this.publishStatus === 'scheduled') {
    this.publishStatus = 'published';
    this.publishedAt = new Date();
  }

  next();
});

// Generate SEO metadata if not provided
articleSchema.pre('save', function(next) {
  if (!this.seo.metaTitle) {
    this.seo.metaTitle = this.title.substring(0, 60);
  }

  if (!this.seo.metaDescription) {
    this.seo.metaDescription = this.excerpt.substring(0, 160);
  }

  if (!this.seo.ogImage || !this.seo.ogImage.url) {
    this.seo.ogImage = {
      url: this.featuredImage.url,
      publicId: this.featuredImage.publicId
    };
  }

  next();
});

// Instance methods
articleSchema.methods.calculateQualityScore = function() {
  let score = 0;

  // Content length (max 20 points)
  const wordCount = this.content.split(/\s+/).length;
  if (wordCount >= 1000) score += 20;
  else if (wordCount >= 500) score += 15;
  else if (wordCount >= 300) score += 10;
  else score += 5;

  // Has featured image (10 points)
  if (this.featuredImage && this.featuredImage.url) score += 10;

  // Has additional images (max 10 points)
  score += Math.min(this.images.length * 2, 10);

  // Has SEO metadata (15 points)
  if (this.seo.metaTitle) score += 5;
  if (this.seo.metaDescription) score += 5;
  if (this.seo.keywords && this.seo.keywords.length > 0) score += 5;

  // Has tags (10 points)
  if (this.tags.length >= 3) score += 10;
  else if (this.tags.length > 0) score += 5;

  // Engagement metrics (max 20 points)
  if (this.engagement.views > 1000) score += 10;
  else if (this.engagement.views > 100) score += 5;

  if (this.engagement.likes.count > 50) score += 5;
  else if (this.engagement.likes.count > 10) score += 3;

  if (this.engagement.shares.count > 20) score += 5;
  else if (this.engagement.shares.count > 5) score += 3;

  // Related content (15 points)
  if (this.relatedTrips.length > 0) score += 5;
  if (this.relatedAccommodations.length > 0) score += 5;
  if (this.relatedArticles.length > 0) score += 5;

  return Math.min(score, 100);
};

articleSchema.methods.submitForReview = async function() {
  this.moderationStatus = 'pending';
  this.submittedForReviewAt = new Date();
  await this.save();
  return this;
};

articleSchema.methods.approve = async function(reviewerId, feedback = '') {
  this.moderationStatus = 'approved';
  this.approvedAt = new Date();

  this.moderationHistory.push({
    status: 'approved',
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    feedback
  });

  // Auto-publish if not scheduled
  if (this.publishStatus === 'draft' && !this.scheduledPublishAt) {
    this.publishStatus = 'published';
    this.publishedAt = new Date();
  }

  await this.save();
  return this;
};

articleSchema.methods.reject = async function(reviewerId, reason = '') {
  this.moderationStatus = 'rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;

  this.moderationHistory.push({
    status: 'rejected',
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    reason
  });

  await this.save();
  return this;
};

articleSchema.methods.flag = async function(reviewerId, reason = '') {
  this.moderationStatus = 'flagged';

  this.moderationHistory.push({
    status: 'flagged',
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    reason
  });

  await this.save();
  return this;
};

articleSchema.methods.incrementView = async function(isUnique = false) {
  this.engagement.views += 1;
  if (isUnique) {
    this.engagement.uniqueViews += 1;
  }
  await this.save();
};

articleSchema.methods.toggleLike = async function(userId) {
  const index = this.engagement.likes.users.indexOf(userId);

  if (index === -1) {
    this.engagement.likes.users.push(userId);
    this.engagement.likes.count += 1;
  } else {
    this.engagement.likes.users.splice(index, 1);
    this.engagement.likes.count -= 1;
  }

  await this.save();
  return index === -1; // return true if liked, false if unliked
};

articleSchema.methods.addComment = async function(commentData) {
  this.comments.push(commentData);
  this.engagement.comments.count += 1;
  await this.save();
  return this.comments[this.comments.length - 1];
};

// Static methods
articleSchema.statics.getPendingArticles = function(limit = 50) {
  return this.find({
    moderationStatus: 'pending'
  })
  .populate('authorId', 'firstName lastName email profile.avatar')
  .sort({ submittedForReviewAt: 1 })
  .limit(limit);
};

articleSchema.statics.getPublishedArticles = function(filters = {}) {
  return this.find({
    publishStatus: 'published',
    moderationStatus: 'approved',
    visibility: 'public',
    ...filters
  })
  .populate('authorId', 'firstName lastName profile.avatar')
  .sort({ publishedAt: -1 });
};

articleSchema.statics.getFeaturedArticles = function(limit = 10) {
  return this.find({
    publishStatus: 'published',
    moderationStatus: 'approved',
    isFeatured: true,
    visibility: 'public'
  })
  .populate('authorId', 'firstName lastName profile.avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

articleSchema.statics.getTrendingArticles = function(limit = 10) {
  return this.find({
    publishStatus: 'published',
    moderationStatus: 'approved',
    visibility: 'public'
  })
  .populate('authorId', 'firstName lastName profile.avatar')
  .sort({ 'engagement.views': -1, publishedAt: -1 })
  .limit(limit);
};

articleSchema.statics.getArticlesByAuthor = function(authorId, status = 'all') {
  const query = { authorId };

  if (status !== 'all') {
    query.moderationStatus = status;
  }

  return this.find(query)
    .sort({ createdAt: -1 });
};

articleSchema.statics.searchArticles = function(searchParams) {
  const {
    query,
    category,
    tags,
    location,
    authorId,
    sort = 'recent'
  } = searchParams;

  let pipeline = [
    {
      $match: {
        publishStatus: 'published',
        moderationStatus: 'approved',
        visibility: 'public'
      }
    }
  ];

  // Text search
  if (query) {
    pipeline.push({
      $match: { $text: { $search: query } }
    });
  }

  // Category filter
  if (category) {
    pipeline.push({
      $match: { category }
    });
  }

  // Tags filter
  if (tags && tags.length > 0) {
    pipeline.push({
      $match: { tags: { $in: tags } }
    });
  }

  // Location filter
  if (location) {
    pipeline.push({
      $match: {
        $or: [
          { 'location.region': new RegExp(location, 'i') },
          { 'location.city': new RegExp(location, 'i') }
        ]
      }
    });
  }

  // Author filter
  if (authorId) {
    pipeline.push({
      $match: { authorId: mongoose.Types.ObjectId(authorId) }
    });
  }

  // Sorting
  const sortOptions = {
    recent: { publishedAt: -1 },
    popular: { 'engagement.views': -1 },
    trending: { 'engagement.views': -1, publishedAt: -1 },
    liked: { 'engagement.likes.count': -1 }
  };

  pipeline.push({ $sort: sortOptions[sort] || sortOptions.recent });

  return this.aggregate(pipeline);
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
