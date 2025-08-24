const mongoose = require('mongoose');

/**
 * Trip Schema - Inspired by TripAdvisor's adventure trip data model
 * 
 * Features:
 * - Provider/host relationship management
 * - Comprehensive trip details and itinerary
 * - Location-based search with geospatial indexing
 * - Date availability and pricing management
 * - UGC support (reviews, photos, ratings)
 * - Booking and capacity management
 * - SEO-friendly URLs and metadata
 */

const tripSchema = new mongoose.Schema({
  // Provider Information
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Trip provider is required'],
    index: true
  },

  // Basic Trip Information
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    maxlength: [100, 'Trip title cannot exceed 100 characters'],
    index: 'text'
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  description: {
    type: String,
    required: [true, 'Trip description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    index: 'text'
  },

  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },

  // Trip Classification
  category: {
    type: String,
    required: [true, 'Trip category is required'],
    enum: {
      values: [
        'safari', 'hiking', 'rafting', 'cultural', 'wildlife', 
        'photography', 'adventure', 'nature', 'historical', 
        'food-tour', 'city-tour', 'multi-day', 'day-trip'
      ],
      message: 'Invalid trip category'
    },
    index: true
  },

  subcategories: [{
    type: String,
    enum: [
      'luxury', 'budget', 'mid-range', 'family-friendly', 'couples', 
      'solo-travelers', 'groups', 'eco-friendly', 'community-based'
    ]
  }],

  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme'],
    default: 'moderate',
    index: true
  },

  // Duration and Timing
  duration: {
    days: {
      type: Number,
      required: [true, 'Trip duration in days is required'],
      min: [1, 'Trip must be at least 1 day'],
      max: [30, 'Trip cannot exceed 30 days']
    },
    nights: {
      type: Number,
      required: [true, 'Trip duration in nights is required'],
      min: [0, 'Nights cannot be negative'],
      validate: {
        validator: function(nights) {
          return nights === this.duration.days - 1 || nights === this.duration.days;
        },
        message: 'Nights should be days-1 or equal to days for multi-day trips'
      }
    }
  },

  // Group Size Management
  groupSize: {
    min: {
      type: Number,
      required: [true, 'Minimum group size is required'],
      min: [1, 'Minimum group size must be at least 1'],
      max: [50, 'Minimum group size cannot exceed 50']
    },
    max: {
      type: Number,
      required: [true, 'Maximum group size is required'],
      min: [1, 'Maximum group size must be at least 1'],
      max: [100, 'Maximum group size cannot exceed 100'],
      validate: {
        validator: function(max) {
          return max >= this.groupSize.min;
        },
        message: 'Maximum group size must be greater than or equal to minimum'
      }
    }
  },

  // Location Information with Geospatial Support
  location: {
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Uganda',
      index: true
    },
    region: {
      type: String,
      required: [true, 'Region is required'],
      trim: true,
      index: true
    },
    city: {
      type: String,
      trim: true,
      index: true
    },
    startPoint: {
      name: {
        type: String,
        required: [true, 'Start point name is required'],
        trim: true
      },
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: [true, 'Start point coordinates are required'],
          validate: {
            validator: function(coords) {
              return coords.length === 2 && 
                     coords[0] >= -180 && coords[0] <= 180 && 
                     coords[1] >= -90 && coords[1] <= 90;
            },
            message: 'Invalid coordinates format'
          }
        }
      }
    },
    endPoint: {
      name: String,
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude]
      }
    },
    nearbyLandmarks: [String]
  },

  // Pricing Structure
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'UGX', 'EUR', 'GBP'],
      default: 'USD'
    },
    priceIncludes: [{
      type: String,
      maxlength: [100, 'Price inclusion item cannot exceed 100 characters']
    }],
    priceExcludes: [{
      type: String,
      maxlength: [100, 'Price exclusion item cannot exceed 100 characters']
    }],
    discounts: [{
      type: {
        type: String,
        enum: ['early-bird', 'group', 'seasonal', 'last-minute'],
        required: true
      },
      percentage: {
        type: Number,
        min: [0, 'Discount percentage cannot be negative'],
        max: [50, 'Discount percentage cannot exceed 50%']
      },
      conditions: String,
      validFrom: Date,
      validUntil: Date,
      isActive: {
        type: Boolean,
        default: true
      }
    }],
    seasonalPricing: [{
      season: {
        type: String,
        enum: ['high', 'peak', 'low', 'shoulder'],
        required: true
      },
      startDate: Date,
      endDate: Date,
      priceMultiplier: {
        type: Number,
        min: [0.5, 'Price multiplier cannot be less than 0.5'],
        max: [3, 'Price multiplier cannot exceed 3'],
        default: 1
      }
    }]
  },

  // Detailed Itinerary
  itinerary: [{
    day: {
      type: Number,
      required: [true, 'Day number is required'],
      min: [1, 'Day must be at least 1']
    },
    title: {
      type: String,
      required: [true, 'Day title is required'],
      trim: true,
      maxlength: [100, 'Day title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Day description is required'],
      trim: true,
      maxlength: [1000, 'Day description cannot exceed 1000 characters']
    },
    activities: [{
      name: String,
      duration: String, // e.g., "2 hours", "half day"
      location: String,
      isOptional: { type: Boolean, default: false }
    }],
    meals: [{
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      location: String,
      description: String
    }],
    accommodation: {
      name: String,
      type: String,
      description: String
    },
    transportation: String
  }],

  // Availability Management
  availability: [{
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      index: true
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(endDate) {
          return endDate >= this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    availableSpots: {
      type: Number,
      required: [true, 'Available spots is required'],
      min: [0, 'Available spots cannot be negative']
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Requirements and Restrictions
  requirements: {
    minimumAge: {
      type: Number,
      min: [0, 'Minimum age cannot be negative'],
      max: [100, 'Minimum age cannot exceed 100']
    },
    maximumAge: {
      type: Number,
      min: [0, 'Maximum age cannot be negative'],
      max: [120, 'Maximum age cannot exceed 120'],
      validate: {
        validator: function(maxAge) {
          return !this.requirements.minimumAge || maxAge >= this.requirements.minimumAge;
        },
        message: 'Maximum age must be greater than minimum age'
      }
    },
    fitnessLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'very-high']
    },
    equipment: [{
      item: String,
      provided: { type: Boolean, default: false },
      required: { type: Boolean, default: true }
    }],
    documentation: [{
      type: String,
      enum: ['passport', 'visa', 'vaccination', 'travel-insurance', 'medical-certificate'],
      required: { type: Boolean, default: true }
    }],
    medicalRestrictions: [String],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  },

  // Media and UGC
  images: [{
    url: {
      type: String,
      required: [true, 'Image URL is required']
    },
    publicId: String, // Cloudinary public ID
    caption: {
      type: String,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    tags: [String]
  }],

  videos: [{
    url: String,
    thumbnail: String,
    title: String,
    duration: Number, // in seconds
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  virtualTour: {
    url: String,
    provider: String // e.g., "360-cities", "matterport"
  },

  // Reviews and Ratings System
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required for review']
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    rating: {
      overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
      },
      aspects: {
        guide: { type: Number, min: 1, max: 5 },
        organization: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 },
        safety: { type: Number, min: 1, max: 5 },
        accommodation: { type: Number, min: 1, max: 5 },
        transportation: { type: Number, min: 1, max: 5 }
      }
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    text: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters']
    },
    photos: [{
      url: String,
      publicId: String,
      caption: String
    }],
    tripDate: {
      type: Date,
      required: [true, 'Trip date is required for review']
    },
    helpful: {
      count: { type: Number, default: 0 },
      users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    response: {
      text: String,
      respondedAt: Date,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  }],

  // Aggregated Rating Information
  rating: {
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    aspects: {
      guide: { type: Number, default: 0 },
      organization: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      accommodation: { type: Number, default: 0 },
      transportation: { type: Number, default: 0 }
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },

  // Trip Status and Management
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'suspended', 'archived'],
    default: 'draft',
    index: true
  },

  // SEO and Discoverability
  featured: {
    type: Boolean,
    default: false,
    index: true
  },

  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    index: true
  }],

  // Policies
  cancellationPolicy: {
    type: {
      type: String,
      enum: ['flexible', 'moderate', 'strict', 'no-refund'],
      default: 'moderate'
    },
    details: String
  },

  // Safety and Guidelines
  safetyMeasures: [String],
  guidelines: [String],
  whatToBring: [String],
  weatherConsiderations: String,

  // Booking Statistics
  stats: {
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageGroupSize: { type: Number, default: 0 },
    repeatCustomers: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },

  // Administrative
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedUntil: Date,
  
  lastBookingAt: Date,
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for optimal query performance

// Basic indexes
tripSchema.index({ providerId: 1 });
tripSchema.index({ category: 1 });
tripSchema.index({ status: 1 });
tripSchema.index({ featured: 1 });
tripSchema.index({ 'rating.overall': -1 });
tripSchema.index({ createdAt: -1 });

// Location-based indexes
tripSchema.index({ 'location.country': 1, 'location.region': 1 });
tripSchema.index({ 'location.startPoint.coordinates': '2dsphere' });

// Date-based indexes for availability queries
tripSchema.index({ 'availability.startDate': 1, 'availability.endDate': 1 });
tripSchema.index({ 'availability.startDate': 1, status: 1 });

// Price-based indexes
tripSchema.index({ 'pricing.basePrice': 1 });
tripSchema.index({ 'pricing.currency': 1, 'pricing.basePrice': 1 });

// Search indexes
tripSchema.index({ 
  title: 'text', 
  description: 'text', 
  'location.region': 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    'location.region': 3,
    description: 1
  }
});

// Compound indexes for complex queries
tripSchema.index({ 
  category: 1, 
  status: 1, 
  'location.country': 1, 
  'rating.overall': -1 
});

tripSchema.index({ 
  difficulty: 1, 
  'duration.days': 1, 
  'pricing.basePrice': 1 
});

tripSchema.index({
  providerId: 1,
  status: 1,
  createdAt: -1
});

// Sparse indexes
tripSchema.index({ slug: 1 }, { unique: true, sparse: true });

// Virtual fields
tripSchema.virtual('averageRating').get(function() {
  return this.rating.overall;
});

tripSchema.virtual('reviewCount').get(function() {
  return this.rating.totalReviews;
});

tripSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  return this.availability.some(slot => 
    slot.startDate > now && 
    slot.availableSpots > 0 && 
    slot.isActive
  );
});

tripSchema.virtual('nextAvailableDate').get(function() {
  const now = new Date();
  const upcomingSlots = this.availability
    .filter(slot => slot.startDate > now && slot.availableSpots > 0 && slot.isActive)
    .sort((a, b) => a.startDate - b.startDate);
  
  return upcomingSlots.length > 0 ? upcomingSlots[0].startDate : null;
});

tripSchema.virtual('priceRange').get(function() {
  if (!this.availability.length) return { min: this.pricing.basePrice, max: this.pricing.basePrice };
  
  const prices = this.availability.map(slot => slot.price || this.pricing.basePrice);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

// Pre-save middleware
tripSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }
  
  next();
});

tripSchema.pre('save', function(next) {
  // Ensure at least one primary image
  if (this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  
  next();
});

// Post-save middleware to update provider stats
tripSchema.post('save', async function(doc) {
  if (this.isNew || this.isModified('rating.overall')) {
    const User = mongoose.model('User');
    
    // Update provider's host rating
    const providerTrips = await Trip.find({ 
      providerId: doc.providerId,
      status: 'active'
    });
    
    if (providerTrips.length > 0) {
      const avgRating = providerTrips.reduce((sum, trip) => sum + trip.rating.overall, 0) / providerTrips.length;
      const totalReviews = providerTrips.reduce((sum, trip) => sum + trip.rating.totalReviews, 0);
      
      await User.findByIdAndUpdate(doc.providerId, {
        'hostProfile.rating': avgRating,
        'hostProfile.totalReviews': totalReviews
      });
    }
  }
});

// Instance methods
tripSchema.methods.updateRating = async function() {
  const reviews = this.reviews.filter(review => review.isVisible);
  
  if (reviews.length === 0) {
    this.rating.overall = 0;
    this.rating.totalReviews = 0;
    return;
  }
  
  // Calculate overall rating
  const totalRating = reviews.reduce((sum, review) => sum + review.rating.overall, 0);
  this.rating.overall = totalRating / reviews.length;
  this.rating.totalReviews = reviews.length;
  
  // Calculate aspect ratings
  const aspects = ['guide', 'organization', 'value', 'safety', 'accommodation', 'transportation'];
  aspects.forEach(aspect => {
    const aspectReviews = reviews.filter(review => review.rating.aspects[aspect]);
    if (aspectReviews.length > 0) {
      const aspectTotal = aspectReviews.reduce((sum, review) => sum + review.rating.aspects[aspect], 0);
      this.rating.aspects[aspect] = aspectTotal / aspectReviews.length;
    }
  });
  
  // Calculate rating distribution
  this.rating.distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    const rating = Math.round(review.rating.overall);
    this.rating.distribution[rating]++;
  });
  
  await this.save();
};

tripSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.updateRating();
};

tripSchema.methods.getAvailableSpots = function(startDate, endDate) {
  return this.availability.filter(slot => 
    slot.isActive &&
    slot.startDate >= startDate &&
    slot.endDate <= endDate &&
    slot.availableSpots > 0
  );
};

tripSchema.methods.bookSpots = async function(availabilityId, spotsToBook) {
  const availability = this.availability.id(availabilityId);
  if (!availability || availability.availableSpots < spotsToBook) {
    throw new Error('Insufficient available spots');
  }
  
  availability.availableSpots -= spotsToBook;
  await this.save();
  
  return availability;
};

// Static methods
tripSchema.statics.searchTrips = function(searchParams) {
  const {
    query,
    category,
    location,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    difficulty,
    duration,
    rating,
    groupSize,
    sort = 'rating'
  } = searchParams;
  
  let pipeline = [
    { $match: { status: 'active' } }
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
  
  // Date availability filter
  if (startDate || endDate) {
    const dateFilter = {
      'availability': {
        $elemMatch: {
          isActive: true,
          availableSpots: { $gt: 0 }
        }
      }
    };
    
    if (startDate) {
      dateFilter.availability.$elemMatch.startDate = { $gte: new Date(startDate) };
    }
    
    if (endDate) {
      dateFilter.availability.$elemMatch.endDate = { $lte: new Date(endDate) };
    }
    
    pipeline.push({ $match: dateFilter });
  }
  
  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};
    if (minPrice !== undefined) priceFilter.$gte = minPrice;
    if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
    pipeline.push({
      $match: { 'pricing.basePrice': priceFilter }
    });
  }
  
  // Other filters
  if (difficulty) {
    pipeline.push({ $match: { difficulty } });
  }
  
  if (duration) {
    pipeline.push({ $match: { 'duration.days': duration } });
  }
  
  if (rating) {
    pipeline.push({
      $match: { 'rating.overall': { $gte: rating } }
    });
  }
  
  if (groupSize) {
    pipeline.push({
      $match: {
        'groupSize.min': { $lte: groupSize },
        'groupSize.max': { $gte: groupSize }
      }
    });
  }
  
  // Sorting
  const sortOptions = {
    rating: { 'rating.overall': -1, 'rating.totalReviews': -1 },
    price_asc: { 'pricing.basePrice': 1 },
    price_desc: { 'pricing.basePrice': -1 },
    newest: { createdAt: -1 },
    popularity: { 'stats.totalBookings': -1 }
  };
  
  pipeline.push({ $sort: sortOptions[sort] || sortOptions.rating });
  
  return this.aggregate(pipeline);
};

tripSchema.statics.getFeaturedTrips = function(limit = 10) {
  return this.find({
    status: 'active',
    featured: true
  })
  .populate('providerId', 'firstName lastName hostProfile.rating')
  .sort({ 'rating.overall': -1, 'rating.totalReviews': -1 })
  .limit(limit);
};

tripSchema.statics.getTripsByProvider = function(providerId, status = 'active') {
  return this.find({ providerId, status })
    .sort({ createdAt: -1 });
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;