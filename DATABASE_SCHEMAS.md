# Database Schemas - Shakes Travel

## User Schema

```javascript
// users collection
{
  _id: ObjectId,
  email: String, // unique, required
  password: String, // hashed with bcrypt
  firstName: String,
  lastName: String,
  phone: String,
  avatar: String, // URL to profile image
  role: {
    type: String,
    enum: ['guest', 'host', 'admin'],
    default: 'guest'
  },
  profile: {
    dateOfBirth: Date,
    nationality: String,
    languages: [String],
    bio: String,
    interests: [String], // e.g., ['hiking', 'safari', 'photography']
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  preferences: {
    currency: { type: String, default: 'USD' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    accessibility: {
      mobilityAssistance: Boolean,
      dietaryRestrictions: [String],
      allergies: [String]
    }
  },
  verification: {
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isIdentityVerified: { type: Boolean, default: false },
    documents: [{
      type: String, // 'passport', 'nationalId', 'drivingLicense'
      url: String,
      status: String, // 'pending', 'approved', 'rejected'
      uploadedAt: Date
    }]
  },
  socialLogins: [{
    provider: String, // 'google', 'facebook'
    providerId: String,
    email: String
  }],
  hostProfile: {
    companyName: String,
    businessLicense: String,
    taxId: String,
    bankDetails: {
      accountNumber: String,
      bankName: String,
      routingNumber: String
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date,
  isActive: { type: Boolean, default: true }
}
```

## Trip Schema

```javascript
// trips collection
{
  _id: ObjectId,
  title: String, // required
  description: String,
  shortDescription: String,
  provider: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['safari', 'hiking', 'rafting', 'cultural', 'wildlife', 'adventure', 'photography'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'extreme']
  },
  duration: {
    days: Number,
    nights: Number
  },
  groupSize: {
    min: Number,
    max: Number
  },
  pricing: {
    basePrice: Number, // per person
    currency: { type: String, default: 'USD' },
    discounts: [{
      type: String, // 'earlyBird', 'groupDiscount', 'seasonal'
      percentage: Number,
      conditions: String,
      validUntil: Date
    }],
    inclusions: [String], // what's included in price
    exclusions: [String]  // what's not included
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String,
    nearbyLandmarks: [String]
  },
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String],
    accommodation: String
  }],
  availability: [{
    startDate: Date,
    endDate: Date,
    availableSpots: Number,
    price: Number // can vary by season
  }],
  requirements: {
    minimumAge: Number,
    maximumAge: Number,
    fitnessLevel: String,
    equipment: [String],
    documentation: [String] // e.g., 'passport', 'visa', 'vaccination'
  },
  media: {
    images: [{
      url: String,
      caption: String,
      isPrimary: Boolean
    }],
    videos: [{
      url: String,
      title: String,
      duration: Number
    }],
    virtualTour: String // 360° tour URL
  },
  reviews: [{
    user: { type: ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    title: String,
    comment: String,
    photos: [String],
    tripDate: Date,
    helpful: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  tags: [String], // for search and filtering
  status: {
    type: String,
    enum: ['draft', 'active', 'suspended', 'archived'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    details: String
  },
  safetyMeasures: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Accommodation Schema

```javascript
// accommodations collection
{
  _id: ObjectId,
  name: String, // required
  description: String,
  host: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['hotel', 'lodge', 'guesthouse', 'camping', 'resort', 'cottage', 'apartment'],
    required: true
  },
  location: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    address: String,
    nearbyAttractions: [String]
  },
  rooms: [{
    name: String,
    type: String, // 'single', 'double', 'suite', 'dormitory'
    capacity: Number,
    beds: [{
      type: String, // 'single', 'double', 'queen', 'king'
      count: Number
    }],
    amenities: [String],
    pricePerNight: Number,
    images: [String],
    availability: [{
      date: Date,
      available: Boolean,
      price: Number // can vary by season/demand
    }]
  }],
  amenities: {
    general: [String], // 'wifi', 'parking', 'restaurant', 'pool'
    accessibility: [String], // 'wheelchairAccess', 'elevators'
    services: [String] // 'laundry', 'concierge', 'roomService'
  },
  policies: {
    checkIn: String, // '14:00'
    checkOut: String, // '11:00'
    cancellation: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      details: String
    },
    smoking: Boolean,
    pets: Boolean,
    children: Boolean
  },
  media: {
    images: [{
      url: String,
      caption: String,
      roomType: String, // which room this image belongs to
      isPrimary: Boolean
    }],
    videos: [String],
    virtualTour: String
  },
  reviews: [{
    user: { type: ObjectId, ref: 'User' },
    booking: { type: ObjectId, ref: 'Booking' },
    rating: { type: Number, min: 1, max: 5 },
    aspects: {
      cleanliness: Number,
      service: Number,
      location: Number,
      value: Number
    },
    title: String,
    comment: String,
    photos: [String],
    stayDate: Date,
    helpful: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  pricing: {
    basePrice: Number,
    currency: { type: String, default: 'USD' },
    seasonalRates: [{
      name: String, // 'high', 'low', 'peak'
      startDate: Date,
      endDate: Date,
      multiplier: Number // 1.5 for 50% increase
    }],
    extraCharges: [{
      name: String, // 'cleaning', 'service', 'tax'
      amount: Number,
      type: String // 'fixed', 'percentage'
    }]
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'maintenance', 'archived'],
    default: 'active'
  },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Booking Schema

```javascript
// bookings collection
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  bookingType: {
    type: String,
    enum: ['trip', 'accommodation'],
    required: true
  },
  // For trip bookings
  trip: {
    type: ObjectId,
    ref: 'Trip'
  },
  tripDetails: {
    startDate: Date,
    endDate: Date,
    participants: [{
      name: String,
      age: Number,
      gender: String,
      nationality: String,
      passportNumber: String,
      emergencyContact: {
        name: String,
        phone: String
      }
    }]
  },
  // For accommodation bookings
  accommodation: {
    type: ObjectId,
    ref: 'Accommodation'
  },
  accommodationDetails: {
    checkIn: Date,
    checkOut: Date,
    rooms: [{
      roomId: String,
      roomType: String,
      guests: Number,
      guestDetails: [{
        name: String,
        age: Number
      }]
    }],
    specialRequests: String
  },
  pricing: {
    baseAmount: Number,
    discounts: [{
      type: String,
      amount: Number,
      description: String
    }],
    taxes: [{
      type: String,
      amount: Number,
      percentage: Number
    }],
    totalAmount: Number,
    currency: String,
    paymentSchedule: [{
      description: String, // 'deposit', 'final payment'
      amount: Number,
      dueDate: Date,
      paid: Boolean
    }]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  payment: {
    type: ObjectId,
    ref: 'Payment'
  },
  cancellation: {
    cancelledAt: Date,
    cancelledBy: String, // 'user', 'host', 'admin'
    reason: String,
    refundAmount: Number,
    refundStatus: String // 'pending', 'processed', 'denied'
  },
  communications: [{
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    message: String,
    timestamp: { type: Date, default: Date.now },
    type: String // 'message', 'update', 'reminder'
  }],
  documents: [{
    name: String,
    url: String,
    type: String, // 'voucher', 'ticket', 'invoice'
    uploadedAt: Date
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Payment Schema

```javascript
// payments collection
{
  _id: ObjectId,
  booking: {
    type: ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'mobile_money', 'paypal'],
    required: true
  },
  paymentProvider: {
    type: String,
    enum: ['stripe', 'paypal', 'flutterwave'], // placeholder for different providers
    required: true
  },
  stripePaymentData: {
    paymentIntentId: String,
    chargeId: String,
    customerId: String,
    paymentMethodId: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  transactionId: String, // external transaction ID
  failureReason: String,
  refund: {
    amount: Number,
    reason: String,
    refundId: String,
    processedAt: Date
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## Additional Schemas

### Reviews Schema (Separate collection for better querying)

```javascript
// reviews collection
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User', required: true },
  targetType: {
    type: String,
    enum: ['trip', 'accommodation', 'host'],
    required: true
  },
  targetId: { type: ObjectId, required: true }, // ID of trip, accommodation, or host
  booking: { type: ObjectId, ref: 'Booking' },
  rating: {
    overall: { type: Number, min: 1, max: 5, required: true },
    aspects: {
      // For trips
      guide: Number,
      organization: Number,
      value: Number,
      safety: Number,
      // For accommodations
      cleanliness: Number,
      service: Number,
      location: Number,
      amenities: Number
    }
  },
  title: String,
  comment: String,
  photos: [String],
  helpful: { type: Number, default: 0 },
  helpfulBy: [{ type: ObjectId, ref: 'User' }],
  reported: { type: Boolean, default: false },
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}
```

### Wishlist Schema

```javascript
// wishlists collection
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User', required: true },
  items: [{
    itemType: {
      type: String,
      enum: ['trip', 'accommodation'],
      required: true
    },
    itemId: { type: ObjectId, required: true },
    addedAt: { type: Date, default: Date.now },
    notes: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Search History Schema

```javascript
// searchHistory collection
{
  _id: ObjectId,
  user: { type: ObjectId, ref: 'User' }, // null for anonymous users
  sessionId: String, // for anonymous tracking
  query: String,
  filters: {
    location: String,
    dateRange: {
      start: Date,
      end: Date
    },
    priceRange: {
      min: Number,
      max: Number
    },
    category: String,
    rating: Number,
    amenities: [String]
  },
  results: {
    count: Number,
    topResults: [ObjectId] // IDs of top results
  },
  createdAt: { type: Date, default: Date.now }
}
```

## Database Indexes

```javascript
// Performance optimization indexes
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ "verification.isEmailVerified": 1 })

db.trips.createIndex({ provider: 1 })
db.trips.createIndex({ category: 1 })
db.trips.createIndex({ "location.coordinates": "2dsphere" })
db.trips.createIndex({ rating: -1 })
db.trips.createIndex({ "pricing.basePrice": 1 })
db.trips.createIndex({ status: 1 })
db.trips.createIndex({ featured: 1 })

db.accommodations.createIndex({ host: 1 })
db.accommodations.createIndex({ type: 1 })
db.accommodations.createIndex({ "location.coordinates": "2dsphere" })
db.accommodations.createIndex({ rating: -1 })
db.accommodations.createIndex({ "pricing.basePrice": 1 })

db.bookings.createIndex({ user: 1 })
db.bookings.createIndex({ trip: 1 })
db.bookings.createIndex({ accommodation: 1 })
db.bookings.createIndex({ status: 1 })
db.bookings.createIndex({ createdAt: -1 })

db.payments.createIndex({ booking: 1 })
db.payments.createIndex({ user: 1 })
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ createdAt: -1 })

db.reviews.createIndex({ targetType: 1, targetId: 1 })
db.reviews.createIndex({ user: 1 })
db.reviews.createIndex({ "rating.overall": -1 })
db.reviews.createIndex({ createdAt: -1 })
```