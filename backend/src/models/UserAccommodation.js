/**
 * UserAccommodation Model - User-generated accommodations awaiting moderation
 *
 * This model handles accommodations submitted by registered users that need
 * admin approval before being featured on the public accommodations page.
 *
 * Workflow:
 * 1. User creates accommodation -> status: 'pending'
 * 2. Admin reviews -> status: 'approved' or 'rejected'
 * 3. If approved -> Featured on public accommodations page
 */

const mongoose = require('mongoose');

const userAccommodationSchema = new mongoose.Schema({
  // User Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },

  // Basic Information
  name: {
    type: String,
    required: [true, 'Accommodation name is required'],
    trim: true,
    minlength: [5, 'Name must be at least 5 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },

  type: {
    type: String,
    required: [true, 'Accommodation type is required'],
    enum: {
      values: [
        'Hotel',
        'Resort',
        'Lodge',
        'Guesthouse',
        'Hostel',
        'Apartment',
        'Villa',
        'Cottage',
        'Tented Camp',
        'Eco-Lodge',
        'Boutique Hotel',
        'Bed & Breakfast'
      ],
      message: '{VALUE} is not a valid accommodation type'
    }
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [100, 'Description must be at least 100 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },

  // Location Information
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

  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: {
      type: String,
      required: [true, 'Country is required']
    }
  },

  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },

  // Pricing
  pricePerNight: {
    type: Number,
    required: [true, 'Price per night is required'],
    min: [0, 'Price cannot be negative']
  },

  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'UGX', 'KES', 'TZS', 'RWF']
  },

  // Capacity
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Must accommodate at least 1 guest'],
    max: [100, 'Maximum guests cannot exceed 100']
  },

  bedrooms: {
    type: Number,
    min: [0, 'Bedrooms cannot be negative']
  },

  bathrooms: {
    type: Number,
    min: [0, 'Bathrooms cannot be negative']
  },

  beds: {
    type: Number,
    min: [0, 'Beds cannot be negative']
  },

  // Amenities
  amenities: [{
    type: String,
    trim: true,
    enum: [
      'WiFi',
      'Parking',
      'Pool',
      'Air Conditioning',
      'Heating',
      'Kitchen',
      'Breakfast Included',
      'Pet Friendly',
      'Gym',
      'Spa',
      'Restaurant',
      'Bar',
      'Room Service',
      'Laundry',
      'Airport Shuttle',
      'Wheelchair Accessible',
      'Family Friendly',
      'Smoking Allowed',
      'Non-Smoking',
      'Beach Access',
      'Mountain View',
      'Lake View',
      'Garden',
      'Balcony',
      'Hot Tub',
      'Fireplace',
      'TV',
      'Workspace',
      '24-Hour Front Desk',
      'Security',
      'Conference Room',
      'Eco-Friendly'
    ]
  }],

  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Rules and Policies
  houseRules: [{
    type: String,
    trim: true
  }],

  cancellationPolicy: {
    type: String,
    required: [true, 'Cancellation policy is required'],
    enum: {
      values: ['Flexible', 'Moderate', 'Strict', 'Super Strict'],
      message: '{VALUE} is not a valid cancellation policy'
    }
  },

  checkInTime: {
    type: String,
    default: '14:00'
  },

  checkOutTime: {
    type: String,
    default: '11:00'
  },

  // Availability
  availability: {
    type: Map,
    of: {
      available: Boolean,
      price: Number,
      minStay: Number
    },
    default: new Map()
  },

  minNightStay: {
    type: Number,
    default: 1,
    min: [1, 'Minimum night stay must be at least 1']
  },

  // Features
  features: {
    instantBook: {
      type: Boolean,
      default: false
    },
    superhost: {
      type: Boolean,
      default: false
    },
    freeCancel: {
      type: Boolean,
      default: false
    },
    ecoFriendly: {
      type: Boolean,
      default: false
    }
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

  revisionNotes: {
    type: String,
    trim: true
  },

  // Public ID (generated after approval)
  publicAccommodationId: {
    type: Number,
    sparse: true,
    unique: true
  },

  // Ratings
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0,
    min: 0
  },

  // Contact Information
  contactInfo: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    website: {
      type: String,
      trim: true
    },
    whatsapp: {
      type: String,
      trim: true
    }
  },

  // Business Information (for hosts)
  businessInfo: {
    registrationNumber: String,
    taxId: String,
    businessType: {
      type: String,
      enum: ['Individual', 'Company', 'Partnership']
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

// Indexes
userAccommodationSchema.index({ userId: 1, status: 1 });
userAccommodationSchema.index({ status: 1, createdAt: -1 });
userAccommodationSchema.index({ region: 1, type: 1 });
userAccommodationSchema.index({ location: 1, pricePerNight: 1 });
userAccommodationSchema.index({ slug: 1 }, { sparse: true });
userAccommodationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Virtuals
userAccommodationSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

userAccommodationSchema.virtual('reviewer', {
  ref: 'User',
  localField: 'reviewedBy',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to generate slug
userAccommodationSchema.pre('save', async function(next) {
  if (this.isModified('name') && !this.slug) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;

    while (await mongoose.models.UserAccommodation.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }

  next();
});

// Instance methods
userAccommodationSchema.methods.approve = async function(adminId, notes = '') {
  this.status = 'approved';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.adminNotes = notes;

  if (!this.publicAccommodationId) {
    const lastAccommodation = await mongoose.models.UserAccommodation
      .findOne({ publicAccommodationId: { $exists: true } })
      .sort({ publicAccommodationId: -1 });

    this.publicAccommodationId = lastAccommodation ? lastAccommodation.publicAccommodationId + 1 : 2000;
  }

  return this.save();
};

userAccommodationSchema.methods.reject = async function(adminId, reason) {
  this.status = 'rejected';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.rejectionReason = reason;

  return this.save();
};

userAccommodationSchema.methods.requestRevision = async function(adminId, notes) {
  this.status = 'revision_requested';
  this.reviewedBy = adminId;
  this.reviewedAt = new Date();
  this.revisionNotes = notes;

  return this.save();
};

// Static methods
userAccommodationSchema.statics.getPending = function(page = 1, limit = 20) {
  return this.find({ status: 'pending', isActive: true })
    .populate('userId', 'firstName lastName email profileImage')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

userAccommodationSchema.statics.getApproved = function(filters = {}, page = 1, limit = 20) {
  const query = { status: 'approved', isActive: true, ...filters };

  return this.find(query)
    .populate('userId', 'firstName lastName email profileImage')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

userAccommodationSchema.statics.getUserAccommodations = function(userId, page = 1, limit = 20) {
  return this.find({ userId, isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip((page - 1) * limit);
};

const UserAccommodation = mongoose.model('UserAccommodation', userAccommodationSchema);

module.exports = UserAccommodation;
