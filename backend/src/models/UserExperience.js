/**
 * UserExperience Model - User-generated experiences awaiting moderation
 *
 * This model handles experiences submitted by registered users that need
 * admin approval before being featured on the public experiences page.
 *
 * Workflow:
 * 1. User creates experience -> status: 'pending'
 * 2. Admin reviews -> status: 'approved' or 'rejected'
 * 3. If approved -> Featured on public experiences page
 */

const mongoose = require('mongoose');

const userExperienceSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Basic Information (matching the Experience interface structure)
  title: {
    type: String,
    required: [true, 'Experience title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },

  region: {
    type: String,
    required: [true, 'Region is required'],
    enum: {
      values: ['Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'East Africa'],
      message: '{VALUE} is not a valid region'
    }
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Wildlife Safari',
        'Cultural Experience',
        'Adventure Sports',
        'Nature & Hiking',
        'City Tours',
        'Food & Dining',
        'Water Activities',
        'Photography Tours',
        'Eco-Tourism',
        'Historical Sites'
      ],
      message: '{VALUE} is not a valid category'
    }
  },

  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },

  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: {
      values: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
      message: '{VALUE} is not a valid difficulty level'
    }
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },

  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },

  // Rich Content
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  overview: {
    type: String,
    required: [true, 'Overview is required'],
    minlength: [100, 'Overview must be at least 100 characters'],
    maxlength: [2000, 'Overview cannot exceed 2000 characters']
  },

  highlights: [{
    type: String,
    trim: true
  }],

  included: [{
    type: String,
    trim: true
  }],

  // Image URLs (uploaded by user - can be to S3, Cloudinary, etc.)
  images: [{
    type: String,
    trim: true
  }],

  // Itinerary
  itinerary: [{
    time: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Itinerary item title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Itinerary item description is required'],
      trim: true
    }
  }],

  // Additional Information
  additionalInfo: {
    cancellationPolicy: {
      type: String,
      required: [true, 'Cancellation policy is required'],
      trim: true
    },
    whatToBring: [{
      type: String,
      trim: true
    }],
    meetingPoint: {
      type: String,
      required: [true, 'Meeting point is required'],
      trim: true
    },
    minAge: {
      type: Number,
      min: [0, 'Minimum age cannot be negative'],
      max: [100, 'Minimum age seems too high']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Maximum group size is required'],
      min: [1, 'Group size must be at least 1'],
      max: [100, 'Group size cannot exceed 100']
    },
    languages: [{
      type: String,
      trim: true
    }],
    accessibility: {
      type: String,
      trim: true
    }
  },

  // Availability
  availability: {
    times: [{
      type: String,
      trim: true
    }],
    daysAvailable: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily']
    }],
    seasonality: {
      type: String,
      trim: true
    }
  },

  // Feature Flags
  ecoFriendly: {
    type: Boolean,
    default: false
  },

  instantBooking: {
    type: Boolean,
    default: false
  },

  freeCancel: {
    type: Boolean,
    default: false
  },

  pickupIncluded: {
    type: Boolean,
    default: false
  },

  // Moderation Status
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'rejected', 'revision_requested'],
      message: '{VALUE} is not a valid status'
    },
    default: 'pending',
    index: true
  },

  // Admin Review Information
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  reviewedAt: {
    type: Date
  },

  adminNotes: {
    type: String,
    trim: true
  },

  rejectionReason: {
    type: String,
    trim: true
  },

  // For revision requests
  revisionNotes: {
    type: String,
    trim: true
  },

  // Public ID (generated after approval for public display)
  publicExperienceId: {
    type: Number,
    sparse: true,
    unique: true
  },

  // Ratings (only applies after approval and public display)
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  reviews: {
    type: Number,
    default: 0,
    min: 0
  },

  // Contact Information for Experience Host
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    whatsapp: {
      type: String,
      trim: true
    }
  },

  // SEO and Analytics
  slug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  views: {
    type: Number,
    default: 0,
    min: 0
  },

  bookings: {
    type: Number,
    default: 0,
    min: 0
  },

  // Soft delete
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for efficient queries
userExperienceSchema.index({ userId: 1, status: 1 });
userExperienceSchema.index({ status: 1, createdAt: -1 });
userExperienceSchema.index({ region: 1, category: 1 });
userExperienceSchema.index({ slug: 1 }, { sparse: true });
userExperienceSchema.index({ publicExperienceId: 1 }, { sparse: true });

// Virtual for user details
userExperienceSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for reviewer details
userExperienceSchema.virtual('reviewer', {
  ref: 'User',
  localField: 'reviewedBy',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to generate slug
userExperienceSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.UserExperience.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

// Instance method to approve experience
userExperienceSchema.methods.approve = async function(adminId, notes = '') {
  this.status = 'approved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;

  // Generate public ID if not already assigned
  if (!this.publicExperienceId) {
    const lastExperience = await mongoose.models.UserExperience
      .findOne({ publicExperienceId: { $exists: true } })
      .sort({ publicExperienceId: -1 });

    this.publicExperienceId = lastExperience ? lastExperience.publicExperienceId + 1 : 1000;
  }

  return this.save();
};

// Instance method to reject experience
userExperienceSchema.methods.reject = async function(adminId, reason) {
  this.status = 'rejected';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;

  return this.save();
};

// Instance method to request revision
userExperienceSchema.methods.requestRevision = async function(adminId, notes) {
  this.status = 'revision_requested';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.revisionNotes = notes;

  return this.save();
};

// Static method to get pending experiences
userExperienceSchema.statics.getPending = function(page = 1, limit = 20) {
  return this.find({ status: 'pending', isActive: true })
    .populate('userId', 'firstName lastName email profileImage')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Static method to get approved experiences
userExperienceSchema.statics.getApproved = function(filters = {}, page = 1, limit = 20) {
  const query = { status: 'approved', isActive: true, ...filters };

  return this.find(query)
    .populate('userId', 'firstName lastName email profileImage')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

// Static method to get user's experiences
userExperienceSchema.statics.getUserExperiences = function(userId, page = 1, limit = 20) {
  return this.find({ userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

const UserExperience = mongoose.model('UserExperience', userExperienceSchema);

module.exports = UserExperience;
