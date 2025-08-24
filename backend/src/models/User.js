const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * User Schema - Inspired by TripAdvisor's user management
 * 
 * Features:
 * - Multi-role authentication (guest, host, admin)
 * - Profile management with social features
 * - Security features (password hashing, verification)
 * - UGC preferences and settings
 * - Social login integration
 * - Host-specific business information
 */

const userSchema = new mongoose.Schema({
  // Basic Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ],
    index: true
  },
  
  password: {
    type: String,
    required: function() {
      // Password required only if no social logins
      return this.socialLogins.length === 0;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },

  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },

  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },

  // User Role System
  role: {
    type: String,
    enum: {
      values: ['guest', 'host', 'admin', 'superadmin'],
      message: 'Role must be either guest, host, admin, or superadmin'
    },
    default: 'guest',
    index: true
  },

  // Contact Information
  phone: {
    type: String,
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },

  // Profile Information
  profile: {
    avatar: {
      url: String,
      publicId: String // Cloudinary public ID
    },
    
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(date) {
          return date < new Date() && date > new Date('1900-01-01');
        },
        message: 'Please provide a valid date of birth'
      }
    },
    
    nationality: {
      type: String,
      trim: true,
      maxlength: [50, 'Nationality cannot exceed 50 characters']
    },
    
    languages: [{
      type: String,
      trim: true,
      maxlength: [30, 'Language cannot exceed 30 characters']
    }],
    
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    
    interests: [{
      type: String,
      enum: [
        'safari', 'hiking', 'rafting', 'cultural', 'wildlife', 
        'photography', 'adventure', 'nature', 'history', 'food',
        'beaches', 'mountains', 'cities', 'rural', 'luxury', 'budget'
      ]
    }],
    
    // Emergency contact for trips
    emergencyContact: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, 'Emergency contact name cannot exceed 100 characters']
      },
      phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please provide a valid phone number']
      },
      relationship: {
        type: String,
        trim: true,
        maxlength: [50, 'Relationship cannot exceed 50 characters']
      }
    }
  },

  // Location Information
  location: {
    country: {
      type: String,
      trim: true,
      default: 'Uganda',
      index: true
    },
    city: {
      type: String,
      trim: true,
      index: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function(coords) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && // longitude
                   coords[1] >= -90 && coords[1] <= 90;     // latitude
          },
          message: 'Coordinates must be [longitude, latitude] with valid ranges'
        }
      }
    }
  },

  // User Preferences
  preferences: {
    currency: {
      type: String,
      enum: ['USD', 'UGX', 'EUR', 'GBP'],
      default: 'USD'
    },
    
    language: {
      type: String,
      enum: ['en', 'sw', 'lg'], // English, Swahili, Luganda
      default: 'en'
    },
    
    notifications: {
      email: {
        bookingUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: true },
        newsletter: { type: Boolean, default: false },
        reviews: { type: Boolean, default: true }
      },
      sms: {
        bookingUpdates: { type: Boolean, default: false },
        emergencyAlerts: { type: Boolean, default: true }
      },
      push: {
        enabled: { type: Boolean, default: true },
        bookingUpdates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false }
      }
    },
    
    accessibility: {
      mobilityAssistance: { type: Boolean, default: false },
      dietaryRestrictions: [{
        type: String,
        enum: ['vegetarian', 'vegan', 'halal', 'kosher', 'gluten-free', 'dairy-free', 'nut-free']
      }],
      allergies: [String]
    },
    
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
      },
      showReviews: { type: Boolean, default: true },
      showTripHistory: { type: Boolean, default: false }
    }
  },

  // Verification Status
  verification: {
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    phoneVerificationCode: String,
    phoneVerificationExpires: Date,
    
    isIdentityVerified: {
      type: Boolean,
      default: false
    },
    identityDocuments: [{
      type: {
        type: String,
        enum: ['passport', 'nationalId', 'drivingLicense'],
        required: true
      },
      documentNumber: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      publicId: String, // Cloudinary public ID
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      },
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },

  // Social Login Integration
  socialLogins: [{
    provider: {
      type: String,
      enum: ['google', 'facebook', 'apple'],
      required: true
    },
    providerId: {
      type: String,
      required: true
    },
    email: String,
    connectedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Host-Specific Information
  hostProfile: {
    isHost: {
      type: Boolean,
      default: false,
      index: true
    },
    
    businessInfo: {
      companyName: {
        type: String,
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
      },
      businessLicense: {
        type: String,
        trim: true
      },
      taxId: {
        type: String,
        trim: true
      },
      businessType: {
        type: String,
        enum: ['individual', 'company', 'ngo', 'government'],
        default: 'individual'
      }
    },
    
    bankDetails: {
      accountNumber: {
        type: String,
        select: false // Sensitive information
      },
      bankName: {
        type: String,
        trim: true
      },
      accountName: {
        type: String,
        trim: true
      },
      routingNumber: {
        type: String,
        select: false
      },
      swiftCode: {
        type: String,
        trim: true
      }
    },
    
    // Host Performance Metrics
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true
    },
    totalReviews: {
      type: Number,
      min: 0,
      default: 0
    },
    totalBookings: {
      type: Number,
      min: 0,
      default: 0
    },
    responseTime: {
      type: Number, // Average response time in hours
      min: 0,
      default: 24
    },
    responseRate: {
      type: Number, // Percentage
      min: 0,
      max: 100,
      default: 100
    },
    
    joinedAsHostAt: {
      type: Date,
      default: Date.now
    },
    
    isVerified: {
      type: Boolean,
      default: false,
      index: true
    },
    verifiedAt: Date
  },

  // Security & Authentication
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  
  // Login tracking
  lastLoginAt: Date,
  lastLoginIP: String,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isSuspended: {
    type: Boolean,
    default: false,
    index: true
  },
  suspendedAt: Date,
  suspensionReason: String,
  
  // Soft delete
  deletedAt: Date,
  deletionReason: String,

  // UGC and Activity Tracking
  stats: {
    totalTripsBooked: { type: Number, default: 0 },
    totalAccommodationsBooked: { type: Number, default: 0 },
    totalReviewsWritten: { type: Number, default: 0 },
    totalPhotosUploaded: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 }
  },

  // Wishlist references
  wishlist: [{
    itemType: {
      type: String,
      enum: ['trip', 'accommodation'],
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'wishlist.itemType'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.phoneVerificationCode;
      delete ret.__v;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes for optimal query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ 'hostProfile.isHost': 1 });
userSchema.index({ 'hostProfile.rating': -1 });
userSchema.index({ 'location.country': 1, 'location.city': 1 });
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ isActive: 1, isSuspended: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLoginAt: -1 });

// Compound indexes for complex queries
userSchema.index({ role: 1, isActive: 1, isSuspended: 1 });
userSchema.index({ 'hostProfile.isHost': 1, 'hostProfile.isVerified': 1, 'hostProfile.rating': -1 });

// Virtual fields
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('age').get(function() {
  if (!this.profile.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.profile.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

userSchema.virtual('isAccountLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.virtual('isNewUser').get(function() {
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return daysSinceCreation <= 30;
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const saltRounds = process.env.BCRYPT_ROUNDS || 12;
    this.password = await bcrypt.hash(this.password, parseInt(saltRounds));
    this.passwordChangedAt = new Date();
  }
  
  next();
});

userSchema.pre('save', function(next) {
  // Update host status based on hostProfile
  if (this.hostProfile && this.hostProfile.isHost) {
    if (this.role === 'guest') {
      this.role = 'host';
    }
  }
  
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  this.verification.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  
  this.verification.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return verificationToken;
};

userSchema.methods.incrementLoginAttempts = function() {
  // Reset attempts if lock has expired
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

userSchema.methods.updateStats = function(statType, increment = 1) {
  const update = {};
  update[`stats.${statType}`] = increment;
  return this.updateOne({ $inc: update });
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveHosts = function(filters = {}) {
  return this.find({
    role: 'host',
    'hostProfile.isHost': true,
    isActive: true,
    isSuspended: false,
    ...filters
  }).sort({ 'hostProfile.rating': -1, 'hostProfile.totalReviews': -1 });
};

userSchema.statics.searchUsers = function(query, filters = {}) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { 'hostProfile.businessInfo.companyName': searchRegex }
    ],
    isActive: true,
    isSuspended: false,
    ...filters
  });
};

// Middleware to handle soft delete
userSchema.pre(/^find/, function(next) {
  // Exclude soft-deleted users by default
  this.find({ deletedAt: { $exists: false } });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;