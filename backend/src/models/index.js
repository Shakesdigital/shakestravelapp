/**
 * Models Index - Central export for all Mongoose models
 * 
 * This file serves as the main entry point for all database models.
 * It ensures proper model registration and provides a clean interface
 * for importing models throughout the application.
 * 
 * Usage:
 * const { User, Trip, Accommodation, Booking, Payment } = require('./models');
 * 
 * Or individual imports:
 * const User = require('./models/User');
 */

const mongoose = require('mongoose');

// Import all models
const User = require('./User');
const Trip = require('./Trip');
const Accommodation = require('./Accommodation');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');

// Additional utility models (optional - can be added later)
// const Wishlist = require('./Wishlist');
// const SearchHistory = require('./SearchHistory');
// const Notification = require('./Notification');

/**
 * Model validation function
 * Ensures all models are properly registered with Mongoose
 */
const validateModels = () => {
  const requiredModels = ['User', 'Trip', 'Accommodation', 'Booking', 'Payment', 'Review'];
  const registeredModels = mongoose.modelNames();
  
  const missingModels = requiredModels.filter(model => !registeredModels.includes(model));
  
  if (missingModels.length > 0) {
    throw new Error(`Missing required models: ${missingModels.join(', ')}`);
  }
  
  console.log('✅ All required models registered successfully:', registeredModels.join(', '));
};

/**
 * Initialize models and create necessary indexes
 * Call this function after database connection is established
 */
const initializeModels = async () => {
  try {
    console.log('🔄 Initializing database models...');
    
    // Validate that all models are registered
    validateModels();
    
    // Create indexes for all models (in development/testing)
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Creating database indexes...');
      
      await Promise.all([
        User.createIndexes(),
        Trip.createIndexes(),
        Accommodation.createIndexes(),
        Booking.createIndexes(),
        Payment.createIndexes(),
        Review.createIndexes()
      ]);
      
      console.log('✅ Database indexes created successfully');
    }
    
    console.log('✅ Models initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing models:', error);
    throw error;
  }
};

/**
 * Get model statistics
 * Useful for monitoring and debugging
 */
const getModelStats = async () => {
  try {
    const stats = {};
    
    // Get collection stats for each model
    const models = [User, Trip, Accommodation, Booking, Payment, Review];
    
    for (const Model of models) {
      const collection = Model.collection;
      const collectionStats = await collection.stats();
      
      stats[Model.modelName] = {
        count: collectionStats.count || 0,
        size: collectionStats.size || 0,
        avgObjSize: collectionStats.avgObjSize || 0,
        indexes: collectionStats.nindexes || 0,
        indexSize: collectionStats.totalIndexSize || 0
      };
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting model stats:', error);
    return {};
  }
};

/**
 * Clean up function for graceful shutdown
 */
const cleanup = async () => {
  try {
    console.log('🧹 Cleaning up model resources...');
    
    // Close any open cursors or connections if needed
    // This is handled by mongoose.disconnect() but can be extended
    
    console.log('✅ Model cleanup completed');
  } catch (error) {
    console.error('❌ Error during model cleanup:', error);
  }
};

/**
 * Model health check
 * Verifies that all models can perform basic operations
 */
const healthCheck = async () => {
  try {
    const health = {
      status: 'healthy',
      models: {},
      timestamp: new Date().toISOString()
    };
    
    // Test basic operations for each model
    const models = [
      { name: 'User', model: User },
      { name: 'Trip', model: Trip },
      { name: 'Accommodation', model: Accommodation },
      { name: 'Booking', model: Booking },
      { name: 'Payment', model: Payment },
      { name: 'Review', model: Review }
    ];
    
    for (const { name, model } of models) {
      try {
        // Test if we can count documents (basic read operation)
        const count = await model.countDocuments();
        health.models[name] = {
          status: 'healthy',
          documentCount: count,
          canRead: true
        };
      } catch (error) {
        health.models[name] = {
          status: 'unhealthy',
          error: error.message,
          canRead: false
        };
        health.status = 'unhealthy';
      }
    }
    
    return health;
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Export all models and utility functions
module.exports = {
  // Core models
  User,
  Trip,
  Accommodation,
  Booking,
  Payment,
  Review,
  
  // Utility functions
  initializeModels,
  validateModels,
  getModelStats,
  healthCheck,
  cleanup,
  
  // Model collections (for advanced queries)
  models: {
    User,
    Trip,
    Accommodation,
    Booking,
    Payment,
    Review
  },
  
  // Model names (useful for dynamic model access)
  modelNames: ['User', 'Trip', 'Accommodation', 'Booking', 'Payment', 'Review']
};