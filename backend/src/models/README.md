# Shakes Travel - Database Models

This directory contains all Mongoose schemas and models for the Shakes Travel platform, designed following TripAdvisor-like data handling patterns.

## 📁 Models Overview

### 🧑‍💼 **User Model** (`User.js`)
Complete user management system with multi-role support:
- **Authentication**: Email/password, social login, JWT tokens
- **Roles**: Guest, Host, Admin, Super Admin
- **Profile**: Personal info, preferences, verification status
- **Host Features**: Business info, ratings, bank details
- **Security**: Login attempts tracking, account locking
- **UGC**: Wishlist, stats tracking, activity history

**Key Features:**
- Password hashing with bcrypt
- Email/phone verification
- Identity document verification
- Geolocation support (2dsphere indexing)
- Social login integration (Google, Facebook)
- GDPR compliance with soft delete

### 🗺️ **Trip Model** (`Trip.js`)
Comprehensive adventure trip management:
- **Provider**: Reference to host/provider user
- **Details**: Title, description, category, difficulty
- **Location**: Geospatial coordinates, start/end points
- **Pricing**: Base price, seasonal rates, discounts
- **Itinerary**: Day-by-day activity breakdown
- **Availability**: Date ranges with spot management
- **Reviews**: Embedded reviews with aspect ratings
- **Media**: Images, videos, virtual tours (UGC support)

**Key Features:**
- Geospatial indexing for location-based search
- Text search indexing for title/description
- Availability management with booking integration
- Advanced review system with helpful voting
- SEO-friendly slug generation
- Automatic provider rating updates

### 🏨 **Accommodation Model** (`Accommodation.js`)
Comprehensive accommodation management system:
- **Host**: Reference to host/provider user
- **Details**: Title, type, amenities, star rating
- **Location**: Geospatial coordinates and nearby attractions
- **Rooms**: Multiple room types with individual pricing
- **Policies**: Check-in/out times, cancellation policies
- **Pricing**: Seasonal rates, extra charges, discounts
- **Reviews**: Embedded reviews with aspect ratings
- **Media**: Property and room images (UGC support)

**Key Features:**
- Multi-room management system
- Availability calendar for each room
- Comprehensive amenities categorization
- Dynamic pricing with seasonal adjustments
- Policy management (cancellation, house rules)
- Geospatial search capabilities

### 📋 **Booking Model** (`Booking.js`)
Unified booking system for trips and accommodations:
- **Polymorphic**: Handles both trip and accommodation bookings
- **User Management**: Guest details and participant info
- **Pricing**: Detailed breakdown, payment schedule
- **Status**: Multi-stage workflow (pending → confirmed → completed)
- **Communication**: Message history between guest and host
- **Documents**: Vouchers, tickets, confirmations
- **Cancellation**: Refund calculations and processing

**Key Features:**
- Polymorphic references (itemType/itemId pattern)
- Automatic booking number generation
- Communication history tracking
- Document management system
- Cancellation and refund workflow
- Payment schedule management

### 💳 **Payment Model** (`Payment.js`)
Comprehensive payment tracking with Stripe integration:
- **Multi-Provider**: Stripe, PayPal, Flutterwave support
- **Payment Methods**: Cards, mobile money, bank transfers
- **Security**: Fraud detection, 3D Secure, risk scoring
- **Refunds**: Partial and full refund management
- **Disputes**: Chargeback and dispute handling
- **Webhooks**: Event tracking and processing

**Key Features:**
- Stripe Payment Intent integration
- Multi-currency support (USD, UGX, EUR, GBP)
- Comprehensive fraud prevention
- Refund and dispute management
- Webhook event tracking
- Receipt generation and management

## 🔍 **Indexing Strategy**

### Location-Based Queries
```javascript
// Geospatial indexes for location search
Trip: { 'location.startPoint.coordinates': '2dsphere' }
Accommodation: { 'location.coordinates': '2dsphere' }
User: { 'location.coordinates': '2dsphere' }
```

### Date-Based Queries
```javascript
// Availability and booking date indexes
Trip: { 'availability.startDate': 1, 'availability.endDate': 1 }
Accommodation: { 'availability.date': 1, 'availability.available': 1 }
Booking: { 'tripDetails.startDate': 1, 'accommodationDetails.checkIn': 1 }
```

### Search Optimization
```javascript
// Text search indexes with weighted fields
Trip: { title: 'text', description: 'text', tags: 'text' }
Accommodation: { title: 'text', description: 'text', tags: 'text' }
```

### Performance Indexes
```javascript
// Compound indexes for common queries
User: { role: 1, isActive: 1, 'hostProfile.rating': -1 }
Trip: { category: 1, status: 1, 'rating.overall': -1 }
Booking: { userId: 1, status: 1, createdAt: -1 }
Payment: { bookingId: 1, status: 1 }
```

## 🔗 **Model Relationships**

```
User (Host) ──┐
              ├── Trip ──┐
              │          ├── Booking ──── Payment
              └── Accommodation ──┘

User (Guest) ──── Booking ──── Payment
              └── Reviews (embedded in Trip/Accommodation)
```

## 🚀 **Usage Examples**

### Import Models
```javascript
// Import all models
const { User, Trip, Accommodation, Booking, Payment } = require('./models');

// Or import individually
const User = require('./models/User');
```

### Initialize Models (in server startup)
```javascript
const { initializeModels } = require('./models');

// After database connection
await initializeModels();
```

### Health Check
```javascript
const { healthCheck } = require('./models');

const health = await healthCheck();
console.log(health);
```

### Model Statistics
```javascript
const { getModelStats } = require('./models');

const stats = await getModelStats();
console.log(stats);
```

## 🛡️ **Security Features**

### Data Validation
- **Input sanitization** built into schemas
- **Type validation** with Mongoose
- **Custom validators** for complex business rules
- **Enum restrictions** for controlled values

### Password Security
```javascript
// Automatic password hashing (User model)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});
```

### UGC Moderation
- **Photo uploads** with Cloudinary integration
- **Review content** validation and filtering
- **User-generated content** tracking and moderation
- **Inappropriate content** flagging system

## 📊 **Performance Optimizations**

### Query Optimization
- **Lean queries** for large datasets
- **Population** only when necessary
- **Projection** to limit returned fields
- **Aggregation pipelines** for complex queries

### Caching Strategy
- **Virtual fields** for computed properties
- **Denormalized data** for frequently accessed info
- **Indexed fields** for fast lookups
- **Sparse indexes** for optional fields

## 🔄 **Middleware & Hooks**

### Pre-save Middleware
- **Slug generation** from titles
- **Automatic timestamps** for status changes
- **Data validation** and sanitization
- **Reference integrity** checks

### Post-save Middleware
- **Rating updates** for providers/hosts
- **Notification triggers** for status changes
- **Statistics updates** for performance metrics
- **Search index updates** for external services

## 🧪 **Testing Considerations**

### Model Testing
```javascript
// Example test structure
describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = new User({ email: 'test@example.com', password: 'plaintext' });
    await user.save();
    expect(user.password).not.toBe('plaintext');
  });
});
```

### Validation Testing
- **Required field** validation
- **Data type** validation
- **Custom validator** testing
- **Unique constraint** testing

## 📈 **Monitoring & Analytics**

### Performance Metrics
- **Query execution time** monitoring
- **Index usage** statistics
- **Document size** tracking
- **Collection growth** monitoring

### Business Metrics
- **User registration** trends
- **Booking conversion** rates
- **Revenue tracking** by provider
- **Review submission** rates

## 🔧 **Maintenance Tasks**

### Regular Maintenance
- **Index optimization** review
- **Query performance** analysis
- **Data cleanup** for soft-deleted records
- **Schema migration** planning

### Scaling Considerations
- **Sharding strategy** for large collections
- **Read replica** configuration
- **Connection pooling** optimization
- **Background job** processing

---

**Built with ❤️ for scalable adventure tourism platform**