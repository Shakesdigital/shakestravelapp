const mongoose = require('mongoose');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      // Detect if we're connecting to a sharded cluster
      const mongoUri = process.env.NODE_ENV === 'test' 
        ? process.env.MONGODB_TEST_URI 
        : process.env.MONGODB_URI;

      const isSharded = mongoUri && (mongoUri.includes('mongos') || process.env.MONGODB_SHARDED === 'true');
      
      // MongoDB connection options optimized for TripAdvisor-scale deployment
      const options = {
        // Connection pool settings for high-traffic applications
        maxPoolSize: process.env.NODE_ENV === 'production' ? 100 : 10,
        minPoolSize: isSharded ? 10 : 2,
        maxIdleTimeMS: 30000,
        serverSelectionTimeoutMS: 10000, // Increased for sharded clusters
        socketTimeoutMS: 45000,
        
        // Buffer settings
        bufferCommands: false,
        
        // Heartbeat frequency
        heartbeatFrequencyMS: 10000,
        
        // Read/Write settings optimized for sharding
        readPreference: isSharded ? 'secondaryPreferred' : 'primaryPreferred',
        readConcern: { level: 'majority' },
        writeConcern: { w: 'majority', j: true },
        retryWrites: true,
        retryReads: true,
        
        // Connection options for sharded clusters
        useUnifiedTopology: true,
        directConnection: false,
        
        // Authentication
        authSource: process.env.MONGODB_AUTH_SOURCE || 'admin',
        
        // Compression for network optimization
        compressors: ['snappy', 'zlib'],
        
        // Application name for monitoring
        appName: `shakes-travel-${process.env.NODE_ENV || 'development'}`
      };
      
      // Additional sharding-specific options
      if (isSharded) {
        logger.info('Detected sharded MongoDB cluster, applying sharding optimizations');
        
        // Optimize for sharded environment
        options.maxPoolSize = 200; // Higher pool size for mongos connections
        options.readPreference = 'secondaryPreferred'; // Distribute reads
        options.localThresholdMS = 15; // Lower threshold for mongos
        options.serverSelectionTimeoutMS = 30000; // More time for shard selection
        
        // Enable connection monitoring for sharded clusters
        options.monitorCommands = true;
      }

      if (!mongoUri) {
        throw new Error('MongoDB URI is not defined in environment variables');
      }

      logger.info('Connecting to MongoDB...', { 
        uri: mongoUri.replace(/\/\/.*@/, '//***:***@'), // Hide credentials in logs
        environment: process.env.NODE_ENV 
      });

      this.connection = await mongoose.connect(mongoUri, options);
      this.isConnected = true;

      logger.info('MongoDB connected successfully', {
        host: this.connection.connection.host,
        port: this.connection.connection.port,
        database: this.connection.connection.name,
        readyState: this.connection.connection.readyState
      });

      // Handle connection events
      this.setupEventHandlers();

      return this.connection;
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      this.isConnected = false;
      
      // Retry connection in development/production
      if (process.env.NODE_ENV !== 'test') {
        logger.info('Retrying MongoDB connection in 5 seconds...');
        setTimeout(() => this.connect(), 5000);
      }
      
      throw error;
    }
  }

  setupEventHandlers() {
    const db = mongoose.connection;

    db.on('connected', () => {
      logger.info('MongoDB connection established');
      this.isConnected = true;
    });

    db.on('disconnected', () => {
      logger.warn('MongoDB connection lost');
      this.isConnected = false;
    });

    db.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      this.isConnected = true;
    });

    db.on('error', (error) => {
      logger.error('MongoDB connection error:', error);
      this.isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async disconnect() {
    if (this.connection) {
      try {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed');
        this.isConnected = false;
      } catch (error) {
        logger.error('Error closing MongoDB connection:', error);
      }
    }
  }

  getConnection() {
    return this.connection;
  }

  isHealthy() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // Database health check with sharding awareness
  async healthCheck() {
    try {
      if (!this.isHealthy()) {
        throw new Error('Database connection is not healthy');
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      
      const healthInfo = {
        status: 'healthy',
        connected: this.isConnected,
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        database: mongoose.connection.name,
        timestamp: new Date().toISOString()
      };

      // Add sharding information if available
      try {
        const isSharded = await this.isShardedCluster();
        if (isSharded) {
          const shardInfo = await this.getShardingInfo();
          healthInfo.sharding = shardInfo;
        }
      } catch (shardError) {
        logger.warn('Could not retrieve sharding information:', shardError.message);
      }
      
      return healthInfo;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        connected: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check if connected to a sharded cluster
  async isShardedCluster() {
    try {
      const admin = mongoose.connection.db.admin();
      const result = await admin.command({ isMaster: 1 });
      return result.msg === 'isdbgrid'; // mongos responds with this
    } catch (error) {
      return false;
    }
  }

  // Get sharding information for monitoring
  async getShardingInfo() {
    try {
      const admin = mongoose.connection.db.admin();
      
      // Get shard list
      const shards = await admin.command({ listShards: 1 });
      
      // Get balancer status
      const balancerStatus = await admin.command({ balancerStatus: 1 });
      
      // Get database sharding status
      const dbStats = await mongoose.connection.db.stats();
      
      return {
        shards: shards.shards ? shards.shards.length : 0,
        shardsInfo: shards.shards || [],
        balancerEnabled: balancerStatus.mode === 'full',
        balancerState: balancerStatus.inBalancerRound || false,
        collections: dbStats.collections || 0,
        dataSize: dbStats.dataSize || 0,
        indexSize: dbStats.indexSize || 0
      };
    } catch (error) {
      logger.warn('Could not retrieve detailed sharding info:', error.message);
      return {
        shards: 'unknown',
        balancerEnabled: 'unknown',
        error: error.message
      };
    }
  }

  // Get shard distribution for a collection (for monitoring)
  async getShardDistribution(collectionName) {
    try {
      if (!(await this.isShardedCluster())) {
        return { error: 'Not connected to a sharded cluster' };
      }

      const admin = mongoose.connection.db.admin();
      const result = await admin.command({
        getShardDistribution: `${mongoose.connection.name}.${collectionName}`
      });

      return result;
    } catch (error) {
      logger.error(`Error getting shard distribution for ${collectionName}:`, error);
      return { error: error.message };
    }
  }

  // Performance monitoring for sharded clusters
  async getShardingMetrics() {
    try {
      if (!(await this.isShardedCluster())) {
        return { sharded: false };
      }

      const admin = mongoose.connection.db.admin();
      
      // Get current operations
      const currentOps = await admin.command({ currentOp: 1 });
      
      // Get connection pool stats
      const connPoolStats = await admin.command({ connPoolStats: 1 });
      
      // Get server status
      const serverStatus = await admin.command({ serverStatus: 1 });
      
      return {
        sharded: true,
        activeOperations: currentOps.inprog ? currentOps.inprog.length : 0,
        connectionPools: connPoolStats,
        opcounters: serverStatus.opcounters,
        network: serverStatus.network,
        metrics: serverStatus.metrics
      };
    } catch (error) {
      logger.error('Error getting sharding metrics:', error);
      return { error: error.message };
    }
  }

  // Chunk balancing utilities
  async enableBalancer() {
    try {
      const admin = mongoose.connection.db.admin();
      await admin.command({ balancerStart: 1 });
      logger.info('MongoDB balancer enabled');
      return { success: true };
    } catch (error) {
      logger.error('Error enabling balancer:', error);
      return { success: false, error: error.message };
    }
  }

  async disableBalancer() {
    try {
      const admin = mongoose.connection.db.admin();
      await admin.command({ balancerStop: 1 });
      logger.info('MongoDB balancer disabled');
      return { success: true };
    } catch (error) {
      logger.error('Error disabling balancer:', error);
      return { success: false, error: error.message };
    }
  }

  // Check if collection is sharded
  async isCollectionSharded(collectionName) {
    try {
      const admin = mongoose.connection.db.admin();
      const result = await admin.command({
        collStats: collectionName,
        verbose: true
      });
      
      return result.sharded === true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;