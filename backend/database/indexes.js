const mongoose = require('mongoose');

// Database indexing strategy for optimal query performance
const DatabaseIndexes = {
  // Trip collection indexes
  trips: [
    // Primary queries
    { location: '2dsphere' }, // Geospatial queries for location-based search
    { 'location.name': 1, price: 1 }, // Location and price filtering
    { difficulty: 1, price: 1 }, // Difficulty and price filtering
    { rating: -1, reviewCount: -1 }, // Sorting by popularity
    { createdAt: -1 }, // Recent trips
    { updatedAt: -1 }, // Recently updated
    { price: 1, duration: 1 }, // Price and duration filtering
    
    // Text search
    { 
      title: 'text', 
      description: 'text', 
      longDescription: 'text',
      'location.name': 'text' 
    },
    
    // Compound indexes for common query patterns
    { difficulty: 1, rating: -1, price: 1 }, // Filter by difficulty, sort by rating, filter by price
    { 'location.name': 1, difficulty: 1, price: 1 }, // Location + difficulty + price
    { duration: 1, maxGroupSize: 1, price: 1 }, // Duration + group size + price
    { availableDates: 1, price: 1 }, // Available dates + price
    
    // Recommendation queries
    { rating: -1, reviewCount: -1, difficulty: 1 }, // Popular trips by difficulty
    { tags: 1, rating: -1 }, // Similar trips by tags
    { 'guide.name': 1 }, // Trips by guide
    
    // Admin queries
    { status: 1, createdAt: -1 }, // Admin status filtering
    { featured: 1, rating: -1 }, // Featured trips
  ],

  // Accommodation collection indexes
  accommodations: [
    // Primary queries
    { location: '2dsphere' }, // Geospatial queries
    { 'location.name': 1, price: 1 }, // Location and price filtering
    { type: 1, price: 1 }, // Accommodation type and price
    { rating: -1, reviewCount: -1 }, // Popularity sorting
    { createdAt: -1 }, // Recent accommodations
    { updatedAt: -1 }, // Recently updated
    
    // Text search
    { 
      title: 'text', 
      description: 'text', 
      longDescription: 'text',
      'location.name': 'text',
      'location.address': 'text'
    },
    
    // Compound indexes
    { type: 1, rating: -1, price: 1 }, // Type + rating + price
    { 'location.name': 1, type: 1, price: 1 }, // Location + type + price
    { amenities: 1, rating: -1 }, // Amenities filtering with rating sort
    { 'rooms.capacity': 1, price: 1 }, // Room capacity + price
    { 'rooms.available': 1, 'location.name': 1 }, // Available rooms by location
    
    // Availability queries
    { 'availability.date': 1, 'availability.available': 1 }, // Date-based availability
    
    // Host queries
    { 'host.name': 1, rating: -1 }, // Accommodations by host
  ],

  // User collection indexes
  users: [
    // Authentication
    { email: 1 }, // Unique index for login
    { resetPasswordToken: 1 }, // Password reset
    { verificationToken: 1 }, // Email verification
    
    // Profile queries
    { role: 1, createdAt: -1 }, // User management
    { 'preferences.interests': 1 }, // Recommendation matching
    { 'location.country': 1, 'location.city': 1 }, // Location-based recommendations
    
    // Activity tracking
    { lastActive: -1 }, // Recent activity
    { createdAt: -1 }, // Registration date
    
    // Social features
    { 'social.provider': 1, 'social.id': 1 }, // Social login
  ],

  // Booking collection indexes
  bookings: [
    // User queries
    { user: 1, createdAt: -1 }, // User's bookings chronologically
    { user: 1, status: 1 }, // User's bookings by status
    
    // Item queries
    { itemId: 1, itemType: 1, createdAt: -1 }, // Bookings for specific items
    { itemType: 1, status: 1 }, // Bookings by type and status
    
    // Date-based queries
    { checkInDate: 1, checkOutDate: 1 }, // Date range queries
    { createdAt: -1 }, // Recent bookings
    { updatedAt: -1 }, // Recently modified bookings
    
    // Status and payment
    { status: 1, createdAt: -1 }, // Status-based admin queries
    { paymentStatus: 1, totalAmount: -1 }, // Payment tracking
    { paymentIntentId: 1 }, // Stripe payment lookup
    
    // Compound indexes
    { user: 1, itemType: 1, status: 1 }, // User's bookings by type and status
    { itemId: 1, checkInDate: 1, checkOutDate: 1 }, // Availability checking
    { status: 1, checkInDate: 1 }, // Upcoming bookings
  ],

  // Review collection indexes
  reviews: [
    // Item queries
    { itemId: 1, itemType: 1, createdAt: -1 }, // Reviews for specific items
    { itemType: 1, rating: -1 }, // Best reviews by type
    
    // User queries
    { user: 1, createdAt: -1 }, // User's reviews
    
    // Content queries
    { rating: -1, helpful: -1 }, // Best reviews
    { createdAt: -1 }, // Recent reviews
    { helpful: -1 }, // Most helpful reviews
    
    // Text search
    { title: 'text', comment: 'text' },
    
    // Moderation
    { reported: 1, createdAt: -1 }, // Reported reviews
    { verified: 1, rating: -1 }, // Verified reviews
    
    // Compound indexes
    { itemId: 1, itemType: 1, rating: -1, helpful: -1 }, // Best reviews for items
    { user: 1, itemType: 1, createdAt: -1 }, // User reviews by type
  ],

  // Wishlist collection indexes
  wishlists: [
    { user: 1, createdAt: -1 }, // User's wishlist items
    { user: 1, itemType: 1 }, // User's wishlist by type
    { itemId: 1, itemType: 1 }, // Wishlist stats for items
    { user: 1, itemId: 1, itemType: 1 }, // Unique constraint
  ],

  // Trip Plan collection indexes
  tripPlans: [
    { user: 1, createdAt: -1 }, // User's trip plans
    { isPublic: 1, createdAt: -1 }, // Public trip plans
    { isPublic: 1, rating: -1 }, // Popular public plans
    { 'items.itemType': 1, 'items.location': 1 }, // Plans by item type and location
    { totalEstimatedCost: 1, duration: 1 }, // Budget and duration filtering
    
    // Search
    { name: 'text', description: 'text' },
    
    // Sharing
    { shareId: 1 }, // Shared trip plan lookup
  ],

  // Analytics collection indexes
  analytics: [
    { eventType: 1, timestamp: -1 }, // Event-based analytics
    { userId: 1, timestamp: -1 }, // User activity tracking
    { itemId: 1, itemType: 1, eventType: 1, timestamp: -1 }, // Item analytics
    { sessionId: 1, timestamp: -1 }, // Session tracking
    
    // Time-based aggregations
    { timestamp: -1 }, // Time-series data
    { 
      year: 1, 
      month: 1, 
      day: 1, 
      eventType: 1 
    }, // Daily aggregations
    
    // Geographic analytics
    { 'location.country': 1, 'location.city': 1, timestamp: -1 },
  ],

  // Cache collection (for database-backed caching)
  cache: [
    { key: 1 }, // Unique cache key lookup
    { expiresAt: 1 }, // TTL index
    { category: 1, expiresAt: 1 }, // Category-based cache cleanup
  ],

  // Session collection (for user sessions)
  sessions: [
    { sessionId: 1 }, // Session lookup
    { userId: 1, expiresAt: -1 }, // User sessions
    { expiresAt: 1 }, // TTL index for automatic cleanup
  ],
};

// Index creation function
async function createIndexes() {
  try {
    console.log('🔧 Creating database indexes...');
    
    const db = mongoose.connection.db;
    const collections = Object.keys(DatabaseIndexes);
    
    for (const collectionName of collections) {
      const indexes = DatabaseIndexes[collectionName];
      const collection = db.collection(collectionName);
      
      console.log(`Creating indexes for ${collectionName}...`);
      
      for (const indexSpec of indexes) {
        try {
          // Handle different index types
          if (typeof indexSpec === 'object' && !Array.isArray(indexSpec)) {
            const indexKeys = indexSpec;
            const indexOptions = {};
            
            // Add specific options for different index types
            if (indexKeys.email === 1) {
              indexOptions.unique = true;
            }
            
            if (indexKeys.expiresAt === 1) {
              indexOptions.expireAfterSeconds = 0; // TTL index
            }
            
            if (indexKeys.user === 1 && indexKeys.itemId === 1 && indexKeys.itemType === 1) {
              indexOptions.unique = true; // Unique wishlist entries
            }
            
            await collection.createIndex(indexKeys, indexOptions);
          }
        } catch (error) {
          // Log but don't fail if index already exists
          if (error.code !== 11000 && !error.message.includes('already exists')) {
            console.error(`Error creating index for ${collectionName}:`, error.message);
          }
        }
      }
    }
    
    console.log('✅ Database indexes created successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to create database indexes:', error);
    return false;
  }
}

// Index analysis and optimization
async function analyzeIndexUsage() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const analysis = {};
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const coll = db.collection(collectionName);
      
      // Get index stats
      const indexStats = await coll.aggregate([
        { $indexStats: {} }
      ]).toArray();
      
      // Get collection stats
      const stats = await coll.stats();
      
      analysis[collectionName] = {
        documentCount: stats.count,
        storageSize: stats.storageSize,
        indexes: indexStats.map(index => ({
          name: index.name,
          accesses: index.accesses,
          isUsed: index.accesses.ops > 0,
          spec: index.spec,
        })),
      };
    }
    
    return analysis;
    
  } catch (error) {
    console.error('Failed to analyze index usage:', error);
    return null;
  }
}

// Query optimization suggestions
function getOptimizationSuggestions(slowQueries = []) {
  const suggestions = [];
  
  slowQueries.forEach(query => {
    const { collection, filter, sort, duration } = query;
    
    if (duration > 1000) { // Queries taking more than 1 second
      suggestions.push({
        severity: 'high',
        collection,
        issue: `Slow query detected (${duration}ms)`,
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
        recommendation: generateIndexRecommendation(filter, sort),
      });
    } else if (duration > 500) { // Queries taking more than 500ms
      suggestions.push({
        severity: 'medium',
        collection,
        issue: `Moderately slow query (${duration}ms)`,
        recommendation: 'Consider adding compound index or optimizing query structure',
      });
    }
  });
  
  return suggestions;
}

function generateIndexRecommendation(filter, sort) {
  const filterFields = Object.keys(filter || {});
  const sortFields = Object.keys(sort || {});
  
  // ESR (Equality, Sort, Range) rule for compound indexes
  const indexFields = [];
  
  // Add equality fields first
  filterFields.forEach(field => {
    if (typeof filter[field] !== 'object' || filter[field].$eq !== undefined) {
      indexFields.push(`${field}: 1`);
    }
  });
  
  // Add sort fields
  sortFields.forEach(field => {
    if (!indexFields.find(f => f.startsWith(field))) {
      indexFields.push(`${field}: ${sort[field]}`);
    }
  });
  
  // Add range fields last
  filterFields.forEach(field => {
    if (typeof filter[field] === 'object' && 
        (filter[field].$gt !== undefined || 
         filter[field].$gte !== undefined || 
         filter[field].$lt !== undefined || 
         filter[field].$lte !== undefined)) {
      if (!indexFields.find(f => f.startsWith(field))) {
        indexFields.push(`${field}: 1`);
      }
    }
  });
  
  return `Consider creating compound index: { ${indexFields.join(', ')} }`;
}

// Database performance monitoring
async function monitorDatabasePerformance() {
  try {
    const db = mongoose.connection.db;
    
    // Get current operations
    const currentOps = await db.admin().command({ currentOp: true });
    
    // Get database stats
    const dbStats = await db.stats();
    
    // Get server status
    const serverStatus = await db.admin().command({ serverStatus: 1 });
    
    return {
      currentOperations: currentOps.inprog?.length || 0,
      slowQueries: currentOps.inprog?.filter(op => op.microsecs_running > 100000) || [],
      databaseStats: {
        collections: dbStats.collections,
        objects: dbStats.objects,
        avgObjSize: dbStats.avgObjSize,
        dataSize: dbStats.dataSize,
        storageSize: dbStats.storageSize,
        indexes: dbStats.indexes,
        indexSize: dbStats.indexSize,
      },
      connections: serverStatus.connections,
      memory: serverStatus.mem,
      uptime: serverStatus.uptime,
    };
    
  } catch (error) {
    console.error('Failed to monitor database performance:', error);
    return null;
  }
}

// Export functions
module.exports = {
  DatabaseIndexes,
  createIndexes,
  analyzeIndexUsage,
  getOptimizationSuggestions,
  monitorDatabasePerformance,
};