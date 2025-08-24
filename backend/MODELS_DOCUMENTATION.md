# 🗄️ Mongoose Schemas - Complete Implementation

## ✅ **Task Completion Summary**

I have successfully created comprehensive Mongoose schemas inspired by TripAdvisor's data handling patterns. Here's what has been implemented:

### 🏗️ **All Required Schemas Created**

| Schema | Status | Features |
|--------|--------|----------|
| **User** | ✅ Complete | Multi-role auth, host profiles, verification, UGC support |
| **Trip** | ✅ Complete | Provider refs, geolocation, availability, reviews, media |
| **Accommodation** | ✅ Complete | Host refs, room management, amenities, pricing, reviews |
| **Booking** | ✅ Complete | Polymorphic refs, unified system, communication, documents |
| **Payment** | ✅ Complete | Stripe integration, multi-currency, refunds, security |

### 🎯 **All Requirements Met**

#### ✅ **Core Requirements**
- [x] **User schema** with name, email, password, role
- [x] **Trip schema** with providerId ref User, title, description, location, dates, price, images, reviews array
- [x] **Accommodation schema** with hostId ref User, title, type, amenities, location, availability, pricePerNight, images, reviews
- [x] **Booking schema** with userId ref User, itemId ref Trip/Accommodation, itemType, dates, totalPrice, status
- [x] **Payment schema** with bookingId ref Booking, amount, status, stripeId

#### ✅ **Advanced Features**
- [x] **Timestamps** on all models
- [x] **Indexing** for location/dates queries (2dsphere, compound indexes)
- [x] **UGC fields** for photos, reviews, ratings
- [x] **Models folder** with proper exports
- [x] **Validation** and middleware
- [x] **TripAdvisor-like data patterns**

## 📊 **Schema Architecture Overview**

### 🔗 **Relationship Structure**
```
User (Host/Guest) ──┐
                    ├── Trip ──┐
                    │          ├── Booking ──── Payment
                    └── Accommodation ──┘
                    
User (Guest) ──── Reviews (embedded in Trip/Accommodation)
```

### 🏷️ **Polymorphic References**
```javascript
// Booking can reference either Trip or Accommodation
itemType: { type: String, enum: ['trip', 'accommodation'] }
itemId: { type: ObjectId, refPath: 'itemType' }
```

## 🔍 **Indexing Strategy**

### **Geospatial Indexing** (Location Queries)
```javascript
// 2dsphere indexes for location-based search
Trip: { 'location.startPoint.coordinates': '2dsphere' }
Accommodation: { 'location.coordinates': '2dsphere' }
User: { 'location.coordinates': '2dsphere' }
```

### **Date-Based Indexing** (Availability/Booking Queries)
```javascript
// Optimized for date range queries
Trip: { 'availability.startDate': 1, 'availability.endDate': 1 }
Accommodation: { 'availability.date': 1, 'availability.available': 1 }
Booking: { 'tripDetails.startDate': 1, 'accommodationDetails.checkIn': 1 }
```

### **Search Optimization**
```javascript
// Text search with weighted fields
Trip: { 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
}
// Weights: title(10), tags(5), description(1)
```

### **Performance Indexes**
```javascript
// Compound indexes for common queries
User: { role: 1, isActive: 1, 'hostProfile.rating': -1 }
Trip: { category: 1, status: 1, 'rating.overall': -1 }
Booking: { userId: 1, status: 1, createdAt: -1 }
Payment: { bookingId: 1, status: 1 }
```

## 🛡️ **UGC (User-Generated Content) Support**

### **Photos & Media**
```javascript
// Comprehensive media support with Cloudinary
images: [{
  url: String,
  publicId: String,     // Cloudinary ID
  caption: String,
  isPrimary: Boolean,
  uploadedBy: ObjectId, // User who uploaded
  uploadedAt: Date,
  tags: [String]
}]
```

### **Reviews System**
```javascript
// Embedded reviews with aspect ratings
reviews: [{
  userId: { type: ObjectId, ref: 'User' },
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    aspects: {
      guide: Number,      // Trip-specific
      cleanliness: Number, // Accommodation-specific
      // ... more aspects
    }
  },
  text: String,
  photos: [String],
  helpful: {
    count: Number,
    users: [ObjectId]
  }
}]
```

### **Content Moderation**
```javascript
// Built-in moderation support
isVisible: { type: Boolean, default: true },
isVerified: { type: Boolean, default: false },
reported: { type: Boolean, default: false }
```

## 💡 **Advanced Features**

### **Multi-Role User System**
```javascript
role: {
  type: String,
  enum: ['guest', 'host', 'admin', 'superadmin'],
  default: 'guest'
}

// Host-specific profile with business info
hostProfile: {
  isHost: Boolean,
  businessInfo: { /* company details */ },
  rating: Number,
  totalReviews: Number,
  isVerified: Boolean
}
```

### **Polymorphic Booking System**
```javascript
// Single booking model handles both trips and accommodations
itemType: { 
  type: String, 
  enum: ['trip', 'accommodation'] 
}
itemId: { 
  type: ObjectId, 
  refPath: 'itemType' 
}

// Type-specific details
tripDetails: { /* trip-specific fields */ }
accommodationDetails: { /* accommodation-specific fields */ }
```

### **Comprehensive Payment Tracking**
```javascript
// Stripe integration with full payment lifecycle
provider: {
  stripe: {
    paymentIntentId: String,
    chargeId: String,
    customerId: String
  }
}

// Refund and dispute handling
refunds: [{ /* refund details */ }]
disputes: [{ /* chargeback details */ }]
```

### **Communication System**
```javascript
// Built-in messaging between guests and hosts
communications: [{
  from: { userId: ObjectId, role: String },
  to: { userId: ObjectId, role: String },
  message: String,
  isRead: Boolean,
  attachments: [Object]
}]
```

## 🔧 **Middleware & Automation**

### **Pre-save Middleware**
```javascript
// Automatic slug generation
tripSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }
  next();
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
```

### **Post-save Middleware**
```javascript
// Automatic rating updates
tripSchema.post('save', async function(doc) {
  // Update provider's host rating
  const providerTrips = await Trip.find({ providerId: doc.providerId });
  const avgRating = calculateAverageRating(providerTrips);
  await User.findByIdAndUpdate(doc.providerId, {
    'hostProfile.rating': avgRating
  });
});
```

## 📈 **Performance Optimizations**

### **Virtual Fields**
```javascript
// Computed properties without storing in DB
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

bookingSchema.virtual('totalNights').get(function() {
  // Calculate nights between check-in/out
});
```

### **Aggregation Methods**
```javascript
// Complex search with aggregation pipelines
tripSchema.statics.searchTrips = function(searchParams) {
  return this.aggregate([
    { $match: { status: 'active' } },
    { $text: { $search: searchParams.query } },
    // ... more pipeline stages
  ]);
};
```

## 🚀 **Usage Examples**

### **Import Models**
```javascript
const { User, Trip, Accommodation, Booking, Payment } = require('./src/models');
```

### **Initialize in Server**
```javascript
const { initializeModels } = require('./src/models');

// After database connection
await initializeModels();
```

### **Create Trip with Provider**
```javascript
const trip = new Trip({
  providerId: hostUser._id,
  title: "Murchison Falls Safari",
  category: "safari",
  location: {
    country: "Uganda",
    coordinates: { type: "Point", coordinates: [31.7167, 2.2833] }
  },
  pricing: { basePrice: 500, currency: "USD" }
});
```

### **Create Polymorphic Booking**
```javascript
const booking = new Booking({
  userId: guest._id,
  itemType: "trip",
  itemId: trip._id,
  tripDetails: {
    startDate: new Date('2024-06-01'),
    participants: [{ name: "John Doe", age: 30 }]
  },
  pricing: { totalAmount: 500 }
});
```

### **Process Payment**
```javascript
const payment = new Payment({
  bookingId: booking._id,
  userId: booking.userId,
  amount: booking.pricing.totalAmount,
  provider: {
    name: 'stripe',
    stripe: { paymentIntentId: 'pi_123' }
  }
});
```

## 📋 **Files Created**

1. **`src/models/User.js`** - Complete user management with multi-role support
2. **`src/models/Trip.js`** - Adventure trip management with geolocation
3. **`src/models/Accommodation.js`** - Accommodation management with room system
4. **`src/models/Booking.js`** - Unified booking system with polymorphic refs
5. **`src/models/Payment.js`** - Comprehensive payment tracking with Stripe
6. **`src/models/index.js`** - Central export and utility functions
7. **`src/models/README.md`** - Complete documentation and usage guide

## 🎯 **TripAdvisor-Inspired Features**

### **Advanced Search Capabilities**
- Geospatial location search
- Text search with weighted fields
- Multi-faceted filtering (price, rating, amenities)
- Availability-based search

### **Review & Rating System**
- Overall and aspect-based ratings
- Photo reviews and helpful voting
- Host response system
- Review verification

### **Host/Provider Management**
- Business profile and verification
- Performance metrics and ratings
- Revenue tracking and analytics
- Communication tools

### **Booking Management**
- Multi-stage booking workflow
- Payment scheduling and tracking
- Cancellation and refund handling
- Document management

## ✅ **All Requirements Successfully Implemented**

This implementation provides a solid foundation for a scalable travel booking platform with all the requested features and more. The schemas are production-ready with proper validation, indexing, and security considerations.

---

**🎉 Task Complete: All Mongoose schemas successfully created with TripAdvisor-like data handling patterns!**