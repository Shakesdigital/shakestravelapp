const mongoose = require('mongoose');

/**
 * Accommodation Schema - Inspired by TripAdvisor's accommodation data model
 * 
 * Features:
 * - Host relationship management
 * - Multiple room types and availability management
 * - Comprehensive amenities and facilities
 * - Location-based search with geospatial indexing
 * - Dynamic pricing and seasonal rates
 * - UGC support (reviews, photos, ratings)
 * - Booking policies and restrictions
 * - SEO-friendly URLs and metadata
 */

const accommodationSchema = new mongoose.Schema({
  // Host Information
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Accommodation host is required'],
    index: true
  },

  // Basic Accommodation Information
  title: {
    type: String,
    required: [true, 'Accommodation title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters'],
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
    required: [true, 'Description is required'],
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

  // Accommodation Type and Classification
  type: {
    type: String,
    required: [true, 'Accommodation type is required'],
    enum: {
      values: [
        'hotel', 'lodge', 'guesthouse', 'hostel', 'resort', 
        'camping', 'cottage', 'apartment', 'villa', 'bed-breakfast',
        'safari-camp', 'eco-lodge', 'tree-house', 'glamping'
      ],
      message: 'Invalid accommodation type'
    },
    index: true
  },

  category: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'premium'],
    required: [true, 'Category is required'],
    index: true
  },

  starRating: {
    type: Number,
    min: [1, 'Star rating must be at least 1'],
    max: [5, 'Star rating cannot exceed 5'],
    index: true
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
      required: [true, 'City is required'],
      trim: true,
      index: true
    },
    address: {
      street: String,
      zipCode: String,
      landmark: String
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(coords) {
            return coords.length === 2 && 
                   coords[0] >= -180 && coords[0] <= 180 && 
                   coords[1] >= -90 && coords[1] <= 90;
          },
          message: 'Invalid coordinates format'
        }
      }
    },
    nearbyAttractions: [{
      name: String,
      distance: String, // e.g., "2 km", "15 minutes walk"
      type: {
        type: String,
        enum: ['national-park', 'restaurant', 'shopping', 'transportation', 'hospital', 'attraction']
      }
    }]
  },

  // Room Management
  rooms: [{
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: ['single', 'double', 'twin', 'triple', 'family', 'suite', 'dormitory', 'tent']
    },
    capacity: {
      adults: {
        type: Number,
        required: [true, 'Adult capacity is required'],
        min: [1, 'Adult capacity must be at least 1']
      },
      children: {
        type: Number,
        default: 0,
        min: [0, 'Children capacity cannot be negative']
      },
      total: {
        type: Number,
        required: [true, 'Total capacity is required'],
        validate: {
          validator: function() {
            return this.total >= this.adults;
          },
          message: 'Total capacity must be at least equal to adult capacity'
        }
      }
    },
    beds: [{
      type: {
        type: String,
        enum: ['single', 'double', 'queen', 'king', 'bunk', 'sofa-bed'],
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: [1, 'Bed count must be at least 1']
      }
    }],
    size: {
      value: Number, // in square meters
      unit: {
        type: String,
        enum: ['sqm', 'sqft'],
        default: 'sqm'
      }
    },
    amenities: [{
      type: String,
      enum: [
        'wifi', 'air-conditioning', 'heating', 'tv', 'minibar', 'safe',
        'balcony', 'terrace', 'city-view', 'nature-view', 'ensuite-bathroom',
        'shared-bathroom', 'kitchenette', 'work-desk', 'seating-area'
      ]
    }],
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      enum: ['USD', 'UGX', 'EUR', 'GBP'],
      default: 'USD'
    },
    images: [{
      url: String,
      publicId: String,
      caption: String,
      isPrimary: { type: Boolean, default: false }
    }],
    isActive: {
      type: Boolean,
      default: true
    },
    maxOccupancy: Number,
    smokingAllowed: { type: Boolean, default: false }
  }],

  // General Amenities and Facilities
  amenities: {
    general: [{
      type: String,
      enum: [
        'wifi', 'parking', 'restaurant', 'bar', 'pool', 'spa', 'gym',
        'conference-room', 'business-center', 'laundry', 'room-service',
        'concierge', '24-hour-front-desk', 'luggage-storage', 'currency-exchange',
        'tour-desk', 'library', 'garden', 'terrace', 'bbq-facilities'
      ]
    }],
    
    accessibility: [{
      type: String,
      enum: [
        'wheelchair-accessible', 'elevator', 'braille-signage', 
        'accessible-bathroom', 'hearing-loop', 'grab-rails',
        'accessible-parking', 'ramp-access'
      ]
    }],
    
    dining: [{
      name: String,
      type: {
        type: String,
        enum: ['restaurant', 'bar', 'cafe', 'room-service', 'buffet']
      },
      cuisine: [String],
      operatingHours: String,
      description: String
    }],
    
    recreation: [{
      type: String,
      enum: [
        'swimming-pool', 'spa', 'sauna', 'hot-tub', 'massage', 'yoga',
        'tennis-court', 'golf-course', 'bicycle-rental', 'game-room',
        'playground', 'water-sports', 'hiking-trails'
      ]
    }],
    
    services: [{
      type: String,
      enum: [
        'airport-shuttle', 'car-rental', 'guided-tours', 'ticket-booking',
        'babysitting', 'pet-care', 'medical-assistance', 'shopping-service',
        'wake-up-service', 'newspaper-delivery'
      ]
    }]
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
    
    seasonalRates: [{
      season: {
        type: String,
        enum: ['high', 'peak', 'low', 'shoulder'],
        required: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      priceMultiplier: {
        type: Number,
        min: [0.5, 'Price multiplier cannot be less than 0.5'],
        max: [5, 'Price multiplier cannot exceed 5'],
        default: 1
      }
    }],
    
    extraCharges: [{
      name: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: [0, 'Extra charge amount cannot be negative']
      },
      type: {
        type: String,
        enum: ['fixed', 'percentage', 'per-person', 'per-night'],
        required: true
      },
      isOptional: {
        type: Boolean,
        default: false
      },
      description: String
    }],
    
    discounts: [{
      type: {
        type: String,
        enum: ['early-bird', 'extended-stay', 'last-minute', 'group'],
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
    }]
  },

  // Availability Management
  availability: [{
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    date: {
      type: Date,
      required: true,
      index: true
    },
    available: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    minStay: {
      type: Number,
      min: [1, 'Minimum stay must be at least 1 night'],
      default: 1
    },
    maxStay: {
      type: Number,
      min: [1, 'Maximum stay must be at least 1 night']
    }
  }],

  // Policies and Rules
  policies: {
    checkIn: {
      startTime: {
        type: String,
        required: [true, 'Check-in start time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      },
      endTime: {
        type: String,
        required: [true, 'Check-in end time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      },
      lateCheckInFee: {
        amount: Number,
        afterTime: String
      }
    },
    
    checkOut: {
      time: {
        type: String,
        required: [true, 'Check-out time is required'],
        match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
      },
      lateCheckOutFee: {
        amount: Number,
        beforeTime: String
      }
    },
    
    cancellation: {
      type: {
        type: String,
        enum: ['flexible', 'moderate', 'strict', 'no-refund'],
        default: 'moderate'
      },
      details: String,
      freeUntil: Number, // hours before check-in
      penalties: [{
        timeFrame: String, // e.g., "24-48 hours before"
        penalty: Number // percentage of total amount
      }]
    },
    
    house: {
      smokingAllowed: {
        type: Boolean,
        default: false
      },
      petsAllowed: {
        type: Boolean,
        default: false
      },
      partiesAllowed: {
        type: Boolean,
        default: false
      },
      childrenAllowed: {
        type: Boolean,
        default: true
      },
      additionalRules: [String]
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
    category: {
      type: String,
      enum: ['exterior', 'interior', 'room', 'bathroom', 'dining', 'recreation', 'view'],
      default: 'interior'
    },
    roomType: String, // Which room this image belongs to
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
    }
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
        cleanliness: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        location: { type: Number, min: 1, max: 5 },
        value: { type: Number, min: 1, max: 5 },
        amenities: { type: Number, min: 1, max: 5 },
        comfort: { type: Number, min: 1, max: 5 }
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
    stayDate: {
      type: Date,
      required: [true, 'Stay date is required for review']
    },
    roomType: String,
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
      cleanliness: { type: Number, default: 0 },
      service: { type: Number, default: 0 },
      location: { type: Number, default: 0 },
      value: { type: Number, default: 0 },
      amenities: { type: Number, default: 0 },
      comfort: { type: Number, default: 0 }
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },

  // Status and Management
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

  // Booking Statistics
  stats: {
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageStayDuration: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 },
    repeatGuests: { type: Number, default: 0 },
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
accommodationSchema.index({ hostId: 1 });
accommodationSchema.index({ type: 1 });
accommodationSchema.index({ category: 1 });
accommodationSchema.index({ status: 1 });
accommodationSchema.index({ featured: 1 });
accommodationSchema.index({ 'rating.overall': -1 });
accommodationSchema.index({ starRating: -1 });
accommodationSchema.index({ createdAt: -1 });

// Location-based indexes
accommodationSchema.index({ 'location.country': 1, 'location.region': 1, 'location.city': 1 });
accommodationSchema.index({ 'location.coordinates': '2dsphere' });

// Date-based indexes for availability queries
accommodationSchema.index({ 'availability.date': 1, 'availability.available': 1 });

// Price-based indexes
accommodationSchema.index({ 'pricing.basePrice': 1 });
accommodationSchema.index({ 'pricing.currency': 1, 'pricing.basePrice': 1 });

// Search indexes
accommodationSchema.index({ 
  title: 'text', 
  description: 'text', 
  'location.city': 'text',
  'location.region': 'text',
  tags: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    'location.city': 3,
    'location.region': 3,
    description: 1
  }
});

// Compound indexes for complex queries
accommodationSchema.index({ 
  type: 1, 
  status: 1, 
  'location.country': 1, 
  'rating.overall': -1 
});

accommodationSchema.index({ 
  category: 1, 
  starRating: -1, 
  'pricing.basePrice': 1 
});

accommodationSchema.index({
  hostId: 1,
  status: 1,
  createdAt: -1
});

// Sparse indexes
accommodationSchema.index({ slug: 1 }, { unique: true, sparse: true });

// Virtual fields
accommodationSchema.virtual('averageRating').get(function() {
  return this.rating.overall;
});

accommodationSchema.virtual('reviewCount').get(function() {
  return this.rating.totalReviews;
});

accommodationSchema.virtual('priceRange').get(function() {
  if (!this.rooms.length) return { min: this.pricing.basePrice, max: this.pricing.basePrice };
  
  const prices = this.rooms.map(room => room.pricePerNight);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
});

accommodationSchema.virtual('totalRooms').get(function() {
  return this.rooms.length;
});

accommodationSchema.virtual('maxCapacity').get(function() {
  return this.rooms.reduce((total, room) => total + room.capacity.total, 0);
});

// Pre-save middleware
accommodationSchema.pre('save', function(next) {
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

accommodationSchema.pre('save', function(next) {
  // Ensure at least one primary image
  if (this.images.length > 0) {
    const hasPrimary = this.images.some(img => img.isPrimary);
    if (!hasPrimary) {
      this.images[0].isPrimary = true;
    }
  }
  
  // Ensure at least one primary room image for each room
  this.rooms.forEach(room => {
    if (room.images.length > 0) {
      const hasPrimary = room.images.some(img => img.isPrimary);
      if (!hasPrimary) {
        room.images[0].isPrimary = true;
      }
    }
  });
  
  next();
});

// Post-save middleware to update host stats
accommodationSchema.post('save', async function(doc) {
  if (this.isNew || this.isModified('rating.overall')) {
    const User = mongoose.model('User');
    
    // Update host's rating
    const hostAccommodations = await Accommodation.find({ 
      hostId: doc.hostId,
      status: 'active'
    });
    
    if (hostAccommodations.length > 0) {
      const avgRating = hostAccommodations.reduce((sum, acc) => sum + acc.rating.overall, 0) / hostAccommodations.length;
      const totalReviews = hostAccommodations.reduce((sum, acc) => sum + acc.rating.totalReviews, 0);
      
      await User.findByIdAndUpdate(doc.hostId, {
        'hostProfile.rating': avgRating,
        'hostProfile.totalReviews': totalReviews
      });
    }
  }
});

// Instance methods
accommodationSchema.methods.updateRating = async function() {
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
  const aspects = ['cleanliness', 'service', 'location', 'value', 'amenities', 'comfort'];
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

accommodationSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  return this.updateRating();
};

accommodationSchema.methods.checkAvailability = function(roomId, checkIn, checkOut) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Find availability records for the date range
  const relevantAvailability = this.availability.filter(avail => 
    avail.roomId.toString() === roomId.toString() &&
    avail.date >= checkInDate &&
    avail.date < checkOutDate
  );
  
  // Check if all dates are available
  const totalDays = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  return {
    isAvailable: relevantAvailability.length === totalDays && 
                 relevantAvailability.every(avail => avail.available),
    availabilityDetails: relevantAvailability
  };
};

accommodationSchema.methods.getAvailableRooms = function(checkIn, checkOut) {
  return this.rooms.filter(room => {
    if (!room.isActive) return false;
    
    const availability = this.checkAvailability(room._id, checkIn, checkOut);
    return availability.isAvailable;
  });
};

accommodationSchema.methods.calculatePrice = function(roomId, checkIn, checkOut, guests = 1) {
  const room = this.rooms.id(roomId);
  if (!room) throw new Error('Room not found');
  
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  
  let basePrice = room.pricePerNight * nights;
  
  // Apply seasonal rates
  // Apply extra charges
  // Apply discounts
  
  return {
    basePrice,
    nights,
    totalPrice: basePrice,
    breakdown: {
      roomPrice: basePrice,
      extraCharges: 0,
      discounts: 0,
      taxes: 0
    }
  };
};

// Static methods
accommodationSchema.statics.searchAccommodations = function(searchParams) {
  const {
    query,
    type,
    location,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    amenities,
    rating,
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
  
  // Type filter
  if (type) {
    pipeline.push({
      $match: { type }
    });
  }
  
  // Location filter
  if (location) {
    pipeline.push({
      $match: {
        $or: [
          { 'location.city': new RegExp(location, 'i') },
          { 'location.region': new RegExp(location, 'i') }
        ]
      }
    });
  }
  
  // Availability filter (if dates provided)
  if (checkIn && checkOut) {
    // Complex availability logic would go here
  }
  
  // Guest capacity filter
  if (guests) {
    pipeline.push({
      $match: {
        'rooms': {
          $elemMatch: {
            'capacity.total': { $gte: guests },
            isActive: true
          }
        }
      }
    });
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
  
  // Amenities filter
  if (amenities && amenities.length > 0) {
    pipeline.push({
      $match: {
        'amenities.general': { $in: amenities }
      }
    });
  }
  
  // Rating filter
  if (rating) {
    pipeline.push({
      $match: { 'rating.overall': { $gte: rating } }
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

accommodationSchema.statics.getFeaturedAccommodations = function(limit = 10) {
  return this.find({
    status: 'active',
    featured: true
  })
  .populate('hostId', 'firstName lastName hostProfile.rating')
  .sort({ 'rating.overall': -1, 'rating.totalReviews': -1 })
  .limit(limit);
};

accommodationSchema.statics.getAccommodationsByHost = function(hostId, status = 'active') {
  return this.find({ hostId, status })
    .sort({ createdAt: -1 });
};

const Accommodation = mongoose.model('Accommodation', accommodationSchema);

module.exports = Accommodation;