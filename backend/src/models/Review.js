const mongoose = require('mongoose');

/**
 * Review Model with Enhanced UGC Moderation and Fraud Detection
 * 
 * Comprehensive review system inspired by TripAdvisor's moderation standards
 * Includes automated moderation flags, fraud detection, and content quality metrics
 */

const reviewSchema = new mongoose.Schema({
  // Basic review information
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'itemType'
  },
  
  itemType: {
    type: String,
    required: true,
    enum: ['Trip', 'Accommodation'],
    index: true
  },
  
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Review content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: function(v) {
        return v >= 1 && v <= 5 && v % 0.5 === 0; // Allow half ratings
      },
      message: 'Rating must be between 1 and 5 in 0.5 increments'
    }
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 100,
    index: 'text'
  },
  
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 50,
    maxlength: 2000,
    index: 'text'
  },
  
  // Category-specific ratings (TripAdvisor style)
  categories: {
    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v) {
          return !v || (v >= 1 && v <= 5 && v % 0.5 === 0);
        }
      }
    },
    service: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v) {
          return !v || (v >= 1 && v <= 5 && v % 0.5 === 0);
        }
      }
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v) {
          return !v || (v >= 1 && v <= 5 && v % 0.5 === 0);
        }
      }
    },
    location: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v) {
          return !v || (v >= 1 && v <= 5 && v % 0.5 === 0);
        }
      }
    },
    amenities: {
      type: Number,
      min: 1,
      max: 5,
      validate: {
        validator: function(v) {
          return !v || (v >= 1 && v <= 5 && v % 0.5 === 0);
        }
      }
    }
  },
  
  // Additional review metadata
  wouldRecommend: {
    type: Boolean,
    default: null
  },
  
  visitDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Visit date cannot be in the future'
    }
  },
  
  travelType: {
    type: String,
    enum: ['solo', 'couple', 'family', 'group', 'business'],
    index: true
  },
  
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  recommendations: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // UGC MODERATION FLAGS - Enhanced for TripAdvisor-scale content moderation
  moderation: {
    // Review status
    status: {
      type: String,
      enum: [
        'pending',      // Awaiting moderation
        'approved',     // Approved and visible
        'rejected',     // Rejected by moderators
        'flagged',      // Flagged for review
        'hidden',       // Hidden from public view
        'deleted'       // Soft deleted
      ],
      default: 'pending',
      index: true
    },
    
    // Automated content analysis flags
    flags: {
      // Content quality flags
      isSpam: {
        type: Boolean,
        default: false,
        index: true
      },
      
      isInappropriate: {
        type: Boolean,
        default: false,
        index: true
      },
      
      isFake: {
        type: Boolean,
        default: false,
        index: true
      },
      
      isOffTopic: {
        type: Boolean,
        default: false
      },
      
      hasOffensiveLanguage: {
        type: Boolean,
        default: false
      },
      
      // Fraud detection flags
      isPotentialFraud: {
        type: Boolean,
        default: false,
        index: true
      },
      
      isCompetitorReview: {
        type: Boolean,
        default: false
      },
      
      isFakePositive: {
        type: Boolean,
        default: false
      },
      
      isFakeNegative: {
        type: Boolean,
        default: false
      },
      
      // Content analysis flags
      hasPersonalInfo: {
        type: Boolean,
        default: false
      },
      
      hasExternalLinks: {
        type: Boolean,
        default: false
      },
      
      hasProfanity: {
        type: Boolean,
        default: false
      },
      
      // Quality flags
      isLowQuality: {
        type: Boolean,
        default: false
      },
      
      isTooShort: {
        type: Boolean,
        default: false
      },
      
      isGeneric: {
        type: Boolean,
        default: false
      }
    },
    
    // Automated analysis scores (0-1)
    scores: {
      sentimentScore: {
        type: Number,
        min: -1,
        max: 1,
        default: 0
      },
      
      qualityScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      },
      
      authenticity: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      },
      
      relevanceScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      },
      
      readabilityScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      }
    },
    
    // Language detection
    detectedLanguage: {
      type: String,
      default: 'en'
    },
    
    // Moderation history
    moderationHistory: [{
      action: {
        type: String,
        enum: ['approved', 'rejected', 'flagged', 'hidden', 'edited', 'restored']
      },
      reason: String,
      moderatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }],
    
    // Automated moderation metadata
    autoModerationRun: {
      type: Boolean,
      default: false
    },
    
    lastModerationCheck: {
      type: Date,
      default: Date.now
    },
    
    moderationVersion: {
      type: String,
      default: '1.0'
    }
  },
  
  // FRAUD DETECTION METADATA
  fraudDetection: {
    // User behavior analysis
    userMetrics: {
      reviewCount: {
        type: Number,
        default: 0
      },
      
      averageRating: {
        type: Number,
        default: 0
      },
      
      reviewFrequency: {
        type: Number, // Reviews per day
        default: 0
      },
      
      accountAge: {
        type: Number, // Days since account creation
        default: 0
      },
      
      verifiedBookingsCount: {
        type: Number,
        default: 0
      }
    },
    
    // Content analysis
    contentAnalysis: {
      duplicateContentScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      
      templatedContentScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      },
      
      unusualPatterns: [{
        pattern: String,
        confidence: Number
      }],
      
      similarityToOtherReviews: {
        type: Number,
        min: 0,
        max: 1,
        default: 0
      }
    },
    
    // Timing analysis
    timingAnalysis: {
      timeToReview: {
        type: Number, // Hours between booking completion and review
        default: 0
      },
      
      reviewSubmissionTime: {
        hour: Number,
        dayOfWeek: Number,
        timezone: String
      },
      
      isRushReview: {
        type: Boolean, // Submitted very quickly after booking
        default: false
      }
    },
    
    // Risk assessment
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
      index: true
    },
    
    riskFactors: [{
      factor: String,
      weight: Number,
      description: String
    }],
    
    // IP and device tracking (for fraud prevention)
    submissionMetadata: {
      ipAddress: String, // Hashed for privacy
      userAgent: String,
      deviceFingerprint: String, // Hashed
      geoLocation: {
        country: String,
        region: String,
        city: String
      }
    }
  },
  
  // Community interaction
  helpfulness: {
    helpful: {
      type: Number,
      default: 0,
      min: 0
    },
    
    notHelpful: {
      type: Number,
      default: 0,
      min: 0
    },
    
    helpfulUsers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      helpful: Boolean,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  // Reporting system
  reports: [{
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    reason: {
      type: String,
      enum: [
        'spam',
        'inappropriate',
        'fake',
        'irrelevant',
        'offensive',
        'personal_attack',
        'commercial',
        'off_topic',
        'copyright'
      ],
      required: true
    },
    
    description: {
      type: String,
      maxlength: 500
    },
    
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending'
    },
    
    reportedAt: {
      type: Date,
      default: Date.now
    },
    
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    reviewedAt: Date,
    
    resolution: String
  }],
  
  // Response from business/host
  response: {
    content: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    
    respondedAt: Date,
    
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  
  // Verification
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    
    verificationMethod: {
      type: String,
      enum: ['booking_confirmed', 'manual_verification', 'photo_verification']
    },
    
    verifiedAt: Date,
    
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Visibility controls
  visibility: {
    isPublic: {
      type: Boolean,
      default: true,
      index: true
    },
    
    showOnFrontPage: {
      type: Boolean,
      default: true
    },
    
    hideFromOwner: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// INDEXES for performance and fraud detection
reviewSchema.index({ itemId: 1, itemType: 1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ 'moderation.status': 1, 'visibility.isPublic': 1 });
reviewSchema.index({ 'fraudDetection.riskScore': -1 });
reviewSchema.index({ rating: -1, createdAt: -1 });
reviewSchema.index({ 'verification.isVerified': 1 });
reviewSchema.index({ 'moderation.flags.isPotentialFraud': 1 });
reviewSchema.index({ 'moderation.flags.isSpam': 1 });

// Compound indexes for common queries
reviewSchema.index({ 
  itemId: 1, 
  itemType: 1, 
  'moderation.status': 1, 
  'visibility.isPublic': 1,
  createdAt: -1 
});

reviewSchema.index({ 
  userId: 1, 
  'verification.isVerified': 1, 
  createdAt: -1 
});

// Text index for search
reviewSchema.index({ 
  title: 'text', 
  content: 'text',
  'response.content': 'text'
});

// VIRTUALS
reviewSchema.virtual('helpfulnessScore').get(function() {
  const total = this.helpfulness.helpful + this.helpfulness.notHelpful;
  return total > 0 ? (this.helpfulness.helpful / total) * 100 : 0;
});

reviewSchema.virtual('averageCategoryRating').get(function() {
  const categories = ['cleanliness', 'service', 'value', 'location', 'amenities'];
  const validRatings = categories
    .map(cat => this.categories[cat])
    .filter(rating => rating !== null && rating !== undefined);
  
  return validRatings.length > 0 
    ? validRatings.reduce((sum, rating) => sum + rating, 0) / validRatings.length
    : this.rating;
});

reviewSchema.virtual('isRecentlySubmitted').get(function() {
  return Date.now() - this.createdAt < (24 * 60 * 60 * 1000); // Less than 24 hours
});

reviewSchema.virtual('needsModeration').get(function() {
  return this.moderation.status === 'pending' || 
         this.moderation.flags.isPotentialFraud ||
         this.fraudDetection.riskScore > 70;
});

// MIDDLEWARE for automated moderation
reviewSchema.pre('save', function(next) {
  // Auto-run basic moderation checks on new reviews
  if (this.isNew) {
    this.runBasicModerationChecks();
  }
  
  // Update fraud detection scores
  this.calculateFraudScore();
  
  next();
});

// METHODS
reviewSchema.methods.runBasicModerationChecks = function() {
  // Check content length
  if (this.content.length < 50) {
    this.moderation.flags.isTooShort = true;
    this.moderation.flags.isLowQuality = true;
  }
  
  // Check for obvious spam patterns
  const spamPatterns = [
    /(.)\1{4,}/g, // Repeated characters
    /click here/i,
    /visit my website/i,
    /buy now/i,
    /special offer/i
  ];
  
  const contentLower = this.content.toLowerCase();
  this.moderation.flags.isSpam = spamPatterns.some(pattern => pattern.test(contentLower));
  
  // Check for external links
  const linkPattern = /(https?:\/\/[^\s]+)/g;
  this.moderation.flags.hasExternalLinks = linkPattern.test(this.content);
  
  // Check for email/phone patterns
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phonePattern = /(\+?\d{1,4}[-.\s]?)?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/g;
  
  this.moderation.flags.hasPersonalInfo = emailPattern.test(this.content) || phonePattern.test(this.content);
  
  // Set quality score based on checks
  let qualityScore = 1.0;
  if (this.moderation.flags.isTooShort) qualityScore -= 0.3;
  if (this.moderation.flags.isSpam) qualityScore -= 0.5;
  if (this.moderation.flags.hasExternalLinks) qualityScore -= 0.2;
  if (this.moderation.flags.hasPersonalInfo) qualityScore -= 0.4;
  
  this.moderation.scores.qualityScore = Math.max(0, qualityScore);
  
  // Auto-approve high quality reviews, flag suspicious ones
  if (qualityScore >= 0.8 && !this.moderation.flags.isSpam) {
    this.moderation.status = 'approved';
  } else if (qualityScore <= 0.3) {
    this.moderation.status = 'flagged';
  }
  
  this.moderation.autoModerationRun = true;
  this.moderation.lastModerationCheck = new Date();
};

reviewSchema.methods.calculateFraudScore = function() {
  let riskScore = 0;
  const factors = [];
  
  // High review frequency risk
  if (this.fraudDetection.userMetrics.reviewFrequency > 5) {
    riskScore += 30;
    factors.push({
      factor: 'high_review_frequency',
      weight: 30,
      description: 'User submits reviews very frequently'
    });
  }
  
  // New account risk
  if (this.fraudDetection.userMetrics.accountAge < 7) {
    riskScore += 20;
    factors.push({
      factor: 'new_account',
      weight: 20,
      description: 'Review from newly created account'
    });
  }
  
  // No verified bookings risk
  if (this.fraudDetection.userMetrics.verifiedBookingsCount === 0) {
    riskScore += 25;
    factors.push({
      factor: 'no_verified_bookings',
      weight: 25,
      description: 'User has no verified bookings'
    });
  }
  
  // Extreme rating risk
  if (this.rating === 1 || this.rating === 5) {
    riskScore += 10;
    factors.push({
      factor: 'extreme_rating',
      weight: 10,
      description: 'Extremely positive or negative rating'
    });
  }
  
  // Rush review risk
  if (this.fraudDetection.timingAnalysis.isRushReview) {
    riskScore += 15;
    factors.push({
      factor: 'rush_review',
      weight: 15,
      description: 'Review submitted very quickly after booking'
    });
  }
  
  // Duplicate content risk
  if (this.fraudDetection.contentAnalysis.duplicateContentScore > 0.8) {
    riskScore += 35;
    factors.push({
      factor: 'duplicate_content',
      weight: 35,
      description: 'Content appears to be duplicated from other reviews'
    });
  }
  
  this.fraudDetection.riskScore = Math.min(100, riskScore);
  this.fraudDetection.riskFactors = factors;
  
  // Auto-flag high-risk reviews
  if (riskScore > 70) {
    this.moderation.flags.isPotentialFraud = true;
    this.moderation.status = 'flagged';
  }
};

reviewSchema.methods.markAsHelpful = function(userId, helpful = true) {
  // Remove existing vote from this user
  this.helpfulness.helpfulUsers = this.helpfulness.helpfulUsers.filter(
    vote => !vote.userId.equals(userId)
  );
  
  // Add new vote
  this.helpfulness.helpfulUsers.push({
    userId,
    helpful,
    timestamp: new Date()
  });
  
  // Update counters
  this.helpfulness.helpful = this.helpfulness.helpfulUsers.filter(vote => vote.helpful).length;
  this.helpfulness.notHelpful = this.helpfulness.helpfulUsers.filter(vote => !vote.helpful).length;
  
  return this.save();
};

reviewSchema.methods.addReport = function(reportData) {
  this.reports.push({
    ...reportData,
    reportedAt: new Date()
  });
  
  // Auto-flag if multiple reports
  if (this.reports.length >= 3) {
    this.moderation.status = 'flagged';
    this.moderation.flags.isFake = true;
  }
  
  return this.save();
};

reviewSchema.methods.addResponse = function(responseData) {
  this.response = {
    ...responseData,
    respondedAt: new Date()
  };
  
  return this.save();
};

// STATIC METHODS for fraud detection and moderation
reviewSchema.statics.findSuspiciousReviews = function() {
  return this.find({
    $or: [
      { 'moderation.flags.isPotentialFraud': true },
      { 'fraudDetection.riskScore': { $gte: 70 } },
      { 'moderation.status': 'flagged' }
    ]
  }).populate('userId', 'email role profile.firstName profile.lastName');
};

reviewSchema.statics.getReviewsNeedingModeration = function() {
  return this.find({
    'moderation.status': { $in: ['pending', 'flagged'] }
  }).sort({ 'fraudDetection.riskScore': -1, createdAt: 1 });
};

reviewSchema.statics.findDuplicateContent = function(content, threshold = 0.8) {
  // This would integrate with a text similarity service in production
  return this.find({
    content: { $regex: content.substring(0, 50), $options: 'i' }
  });
};

reviewSchema.statics.getPublicReviews = function(itemId, itemType, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = -1,
    rating = null,
    verified = null
  } = options;
  
  const query = {
    itemId,
    itemType,
    'moderation.status': 'approved',
    'visibility.isPublic': true
  };
  
  if (rating) query.rating = rating;
  if (verified !== null) query['verification.isVerified'] = verified;
  
  return this.find(query)
    .populate('userId', 'profile.firstName profile.lastName profile.avatar')
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;