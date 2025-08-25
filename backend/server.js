#!/usr/bin/env node

/**
 * Shakes Travel Backend Server
 * 
 * A scalable Node.js/Express backend for adventure tourism booking platform
 * Following TripAdvisor-like architecture patterns for performance and scalability
 * 
 * Features:
 * - MongoDB with Mongoose ODM
 * - JWT authentication with refresh tokens
 * - Comprehensive security middleware
 * - Request logging and error handling
 * - Health checks and monitoring
 * - UGC moderation and sanitization
 * - Rate limiting and CORS
 */

// Load environment variables first
require('dotenv').config();

const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

// Import custom modules
const database = require('./src/config/database');
const { setupSecurity, sanitizeInput } = require('./src/middleware/security');
const { globalErrorHandler, notFoundHandler, catchAsync } = require('./src/middleware/errorHandler');
const { logger, requestLogger, businessLogger, performanceLogger } = require('./src/utils/logger');

// Create Express application
const app = express();

// Set environment variables defaults
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

class ShakesTravelServer {
  constructor() {
    this.app = app;
    this.server = null;
    this.isShuttingDown = false;
  }

  async initialize() {
    try {
      logger.info('🚀 Starting Shakes Travel API Server...', {
        environment: NODE_ENV,
        port: PORT,
        nodeVersion: process.version
      });

      // Connect to database first
      await this.connectDatabase();
      
      // Setup middleware
      this.setupMiddleware();
      
      // Setup routes
      this.setupRoutes();
      
      // Setup error handling
      this.setupErrorHandling();
      
      // Start server
      await this.startServer();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      logger.info('✅ Shakes Travel API Server started successfully');
      
    } catch (error) {
      logger.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async connectDatabase() {
    try {
      logger.info('📊 Connecting to MongoDB...');
      await database.connect();
      logger.info('✅ MongoDB connected successfully');
    } catch (error) {
      logger.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }

  setupMiddleware() {
    logger.info('🔧 Setting up middleware...');

    // Trust proxy for accurate client IP (important for rate limiting)
    this.app.set('trust proxy', 1);

    // Setup security middleware (CORS, Helmet, Rate limiting, etc.)
    setupSecurity(this.app);

    // Compression middleware for response optimization
    this.app.use(compression({
      level: 6, // Compression level (1-9)
      threshold: 1024, // Only compress if response is larger than 1KB
      filter: (req, res) => {
        // Don't compress if the request includes a cache-control: no-transform directive
        if (req.headers['cache-control'] && req.headers['cache-control'].includes('no-transform')) {
          return false;
        }
        return compression.filter(req, res);
      }
    }));

    // Body parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      verify: (req, res, buf) => {
        // Store raw body for webhook verification
        req.rawBody = buf;
      }
    }));
    
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Cookie parser
    this.app.use(cookieParser());

    // Request logging
    if (NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    // Request logging is now handled by enhanced security middleware

    // Input sanitization middleware
    this.app.use(sanitizeInput);

    // Performance monitoring middleware
    this.app.use((req, res, next) => {
      const start = process.hrtime();
      
      res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
        
        // Log slow requests (>1 second)
        if (duration > 1000) {
          performanceLogger.slowEndpoint(req.method, req.originalUrl, duration, req.user?.id);
        }
      });
      
      next();
    });

    logger.info('✅ Middleware setup completed');
  }

  setupRoutes() {
    logger.info('🛣️  Setting up routes...');

    // Health check endpoint
    this.app.get('/api/health', catchAsync(async (req, res) => {
      const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
        version: process.env.npm_package_version || '1.0.0',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        },
        database: await database.healthCheck()
      };

      // Check if any critical systems are down
      if (!database.isHealthy()) {
        healthCheck.status = 'unhealthy';
        return res.status(503).json(healthCheck);
      }

      res.status(200).json(healthCheck);
    }));

    // API status endpoint
    this.app.get('/api/status', (req, res) => {
      res.status(200).json({
        service: 'Shakes Travel API',
        version: '1.0.0',
        status: 'operational',
        timestamp: new Date().toISOString(),
        endpoints: {
          health: '/api/health',
          docs: '/api/docs' // Future API documentation
        }
      });
    });

    // Welcome endpoint
    this.app.get('/api', (req, res) => {
      res.status(200).json({
        message: 'Welcome to Shakes Travel API',
        description: 'Adventure tourism booking platform for Uganda',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/api/health',
        status: '/api/status'
      });
    });

    // API versioning
    this.app.use('/api/v1', (req, res, next) => {
      // Future: Route to version-specific handlers
      res.status(200).json({
        message: 'API v1 endpoint - Coming Soon',
        version: '1.0.0',
        availableEndpoints: [
          'POST /api/auth/register',
          'POST /api/auth/login',
          'POST /api/auth/logout',
          'GET /api/auth/profile',
          'PUT /api/auth/profile',
          'POST /api/auth/refresh',
          'GET /api/trips',
          'POST /api/trips',
          'GET /api/accommodations',
          'POST /api/accommodations',
          'GET /api/bookings',
          'POST /api/bookings',
          'POST /api/reviews',
          'GET /api/reviews/:itemType/:itemId',
          'POST /api/uploads/trip-photos',
          'POST /api/uploads/accommodation-photos',
          'POST /api/payments/checkout',
          'GET /api/payments',
          'GET /api/payments/external/weather/current',
          'GET /api/payments/external/maps/places/search'
        ]
      });
    });

    // Authentication routes
    this.app.use('/api/auth', require('./src/routes/auth'));
    
    // API routes
    this.app.use('/api/trips', require('./src/routes/trips'));
    this.app.use('/api/accommodations', require('./src/routes/accommodations'));
    this.app.use('/api/bookings', require('./src/routes/bookings'));
    this.app.use('/api/reviews', require('./src/routes/reviews'));
    this.app.use('/api/uploads', require('./src/routes/uploads'));
    this.app.use('/api/payments', require('./src/routes/payments'));
    
    // User management routes
    this.app.use('/api/users', require('./src/routes/users'));
    
    // Admin routes
    this.app.use('/api/admin', require('./src/routes/admin'));
    
    // Search routes
    this.app.use('/api/search', require('./src/routes/search'));
    
    // Trip plans routes (public)
    this.app.use('/api/trip-plans', require('./src/routes/trip-plans'));

    logger.info('✅ Routes setup completed');
  }

  setupErrorHandling() {
    logger.info('🛡️  Setting up error handling...');

    // Handle 404 for undefined routes
    this.app.use('*', notFoundHandler);

    // Global error handling middleware
    this.app.use(globalErrorHandler);

    logger.info('✅ Error handling setup completed');
  }

  async startServer() {
    return new Promise((resolve, reject) => {
      this.server = this.app.listen(PORT, (err) => {
        if (err) {
          reject(err);
        } else {
          logger.info(`🌍 Server running on port ${PORT} in ${NODE_ENV} mode`);
          logger.info(`📡 Health check available at: http://localhost:${PORT}/api/health`);
          resolve();
        }
      });

      // Handle server errors
      this.server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`❌ Port ${PORT} is already in use`);
        } else {
          logger.error('❌ Server error:', error);
        }
        reject(error);
      });
    });
  }

  setupGracefulShutdown() {
    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      if (this.isShuttingDown) {
        logger.warn(`⚠️  Force shutdown initiated (${signal})`);
        process.exit(1);
      }

      this.isShuttingDown = true;
      logger.info(`🔄 Graceful shutdown initiated (${signal})`);

      try {
        // Stop accepting new connections
        if (this.server) {
          await new Promise((resolve) => {
            this.server.close(resolve);
          });
          logger.info('✅ HTTP server closed');
        }

        // Close database connection
        await database.disconnect();
        logger.info('✅ Database connection closed');

        // Log final shutdown message
        logger.info('🛑 Server shutdown completed gracefully');
        process.exit(0);

      } catch (error) {
        logger.error('❌ Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Handle different shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('💥 Uncaught Exception:', error);
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('UNHANDLED_REJECTION');
    });
  }

  // Method to get Express app (useful for testing)
  getApp() {
    return this.app;
  }

  // Method to get server instance
  getServer() {
    return this.server;
  }
}

// Initialize and start the server
const shakesServer = new ShakesTravelServer();

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  shakesServer.initialize().catch((error) => {
    logger.error('💥 Failed to initialize server:', error);
    process.exit(1);
  });
}

// Export for testing and external usage
module.exports = shakesServer;