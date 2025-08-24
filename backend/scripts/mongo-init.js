// MongoDB Initialization Script for Shakes Travel
// Creates application database, user, and initial collections

// Switch to admin database
db = db.getSiblingDB('admin');

// Create application database
db = db.getSiblingDB('shakestravel');

// Create application user with appropriate permissions
db.createUser({
  user: 'shakestravel',
  pwd: 'password123',
  roles: [
    {
      role: 'dbOwner',
      db: 'shakestravel'
    },
    {
      role: 'readWrite',
      db: 'shakestravel'
    }
  ]
});

// Create collections with validation rules
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'profile'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        role: {
          enum: ['user', 'host', 'admin', 'superadmin']
        }
      }
    }
  }
});

db.createCollection('trips', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'hostId', 'location', 'pricing'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 10,
          maxLength: 200
        },
        description: {
          bsonType: 'string',
          minLength: 50,
          maxLength: 2000
        }
      }
    }
  }
});

db.createCollection('accommodations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['title', 'description', 'hostId', 'location', 'pricing'],
      properties: {
        title: {
          bsonType: 'string',
          minLength: 10,
          maxLength: 200
        },
        type: {
          enum: ['hotel', 'guesthouse', 'lodge', 'camp', 'resort', 'hostel', 'apartment']
        }
      }
    }
  }
});

db.createCollection('bookings');
db.createCollection('payments');
db.createCollection('reviews');

// Create indexes for performance
print('Creating indexes...');

// User indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ 'profile.isVerified': 1 });
db.users.createIndex({ createdAt: -1 });

// Trip indexes
db.trips.createIndex({ hostId: 1 });
db.trips.createIndex({ 'location.coordinates': '2dsphere' });
db.trips.createIndex({ 'location.city': 1, 'location.region': 1 });
db.trips.createIndex({ category: 1, difficulty: 1 });
db.trips.createIndex({ 'pricing.basePrice': 1 });
db.trips.createIndex({ 'reviews.averageRating': -1 });
db.trips.createIndex({ status: 1, 'availability.isActive': 1 });
db.trips.createIndex({ title: 'text', description: 'text' });

// Accommodation indexes
db.accommodations.createIndex({ hostId: 1 });
db.accommodations.createIndex({ 'location.coordinates': '2dsphere' });
db.accommodations.createIndex({ 'location.city': 1, 'location.region': 1 });
db.accommodations.createIndex({ type: 1, category: 1 });
db.accommodations.createIndex({ 'pricing.basePrice': 1 });
db.accommodations.createIndex({ 'reviews.averageRating': -1 });
db.accommodations.createIndex({ status: 1, 'availability.isActive': 1 });
db.accommodations.createIndex({ title: 'text', description: 'text' });

// Booking indexes
db.bookings.createIndex({ userId: 1, createdAt: -1 });
db.bookings.createIndex({ itemId: 1, itemType: 1 });
db.bookings.createIndex({ status: 1 });
db.bookings.createIndex({ 'dates.startDate': 1, 'dates.endDate': 1 });
db.bookings.createIndex({ 'pricing.total': -1 });

// Payment indexes
db.payments.createIndex({ userId: 1, createdAt: -1 });
db.payments.createIndex({ bookingId: 1 });
db.payments.createIndex({ status: 1 });
db.payments.createIndex({ paymentMethod: 1 });
db.payments.createIndex({ amount: -1 });

// Review indexes (with fraud detection support)
db.reviews.createIndex({ itemId: 1, itemType: 1 });
db.reviews.createIndex({ userId: 1, createdAt: -1 });
db.reviews.createIndex({ 'moderation.status': 1, 'visibility.isPublic': 1 });
db.reviews.createIndex({ 'fraudDetection.riskScore': -1 });
db.reviews.createIndex({ rating: -1, createdAt: -1 });
db.reviews.createIndex({ 'verification.isVerified': 1 });
db.reviews.createIndex({ 'moderation.flags.isPotentialFraud': 1 });
db.reviews.createIndex({ 'moderation.flags.isSpam': 1 });

// Compound indexes for common queries
db.reviews.createIndex({ 
  itemId: 1, 
  itemType: 1, 
  'moderation.status': 1, 
  'visibility.isPublic': 1,
  createdAt: -1 
});

db.reviews.createIndex({ 
  userId: 1, 
  'verification.isVerified': 1, 
  createdAt: -1 
});

// Text indexes for search
db.reviews.createIndex({ 
  title: 'text', 
  content: 'text',
  'response.content': 'text'
});

// Insert sample data for development
print('Inserting sample data...');

// Sample admin user
db.users.insertOne({
  email: 'admin@shakestravel.com',
  password: '$2b$12$placeholder_hashed_password',
  role: 'admin',
  profile: {
    firstName: 'Admin',
    lastName: 'User',
    isVerified: true,
    verificationDate: new Date()
  },
  settings: {
    notifications: {
      email: true,
      push: true
    },
    privacy: {
      profileVisible: true,
      showBookings: false
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

// Sample host user
db.users.insertOne({
  email: 'host@shakestravel.com',
  password: '$2b$12$placeholder_hashed_password',
  role: 'host',
  profile: {
    firstName: 'Sample',
    lastName: 'Host',
    isVerified: true,
    verificationDate: new Date()
  },
  hostProfile: {
    isVerified: true,
    businessName: 'Uganda Adventures',
    businessType: 'tour_operator',
    verificationStatus: 'verified',
    verificationDate: new Date()
  },
  settings: {
    notifications: {
      email: true,
      push: true
    },
    privacy: {
      profileVisible: true,
      showBookings: true
    }
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed successfully!');
print('Created database: shakestravel');
print('Created user: shakestravel');
print('Created collections with validation rules and indexes');
print('Inserted sample admin and host users');