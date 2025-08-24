const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { 
  logger, 
  businessLogger, 
  performanceLogger, 
  requestLogger, 
  correlationMiddleware 
} = require('../utils/logger');
const { 
  rateLimiters: advancedRateLimiters, 
  advancedHelmet, 
  smartRateLimit, 
  ddosProtection, 
  requestContext 
} = require('./advancedSecurity');

// CORS configuration following TripAdvisor security practices
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from frontend and admin URLs
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.ADMIN_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'X-Forwarded-For'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 hours
};

// Rate limiting configuration
const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes default
    max: options.max || 100, // requests per window
    message: {
      error: {
        message: 'Too many requests from this IP, please try again later',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: options.windowMs || 15 * 60 * 1000
      }
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip;
    },
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/api/health';
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          message: 'Too many requests from this IP, please try again later',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.round(options.windowMs / 1000) || 900
        }
      });
    },
    ...options
  });
};

// Different rate limits for different endpoints
const rateLimiters = {
  // Global rate limiter
  global: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per 15 minutes
    message: 'Too many requests, please try again later'
  }),

  // Authentication endpoints
  auth: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 login attempts per 15 minutes
    skipSuccessfulRequests: true,
    message: 'Too many authentication attempts, please try again later'
  }),

  // Search endpoints
  search: createRateLimiter({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // 50 search requests per minute
    message: 'Too many search requests, please slow down'
  }),

  // Upload endpoints
  upload: createRateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    skipFailedRequests: true,
    message: 'Too many file uploads, please try again later'
  }),

  // API endpoints (general)
  api: createRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: 'API rate limit exceeded, please try again later'
  })
};

// Helmet security configuration
const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", // Allow inline styles for dynamic content
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "https://res.cloudinary.com", // Cloudinary for images
        "https://maps.googleapis.com", // Google Maps
        "https://maps.gstatic.com"
      ],
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com", // Google Maps
        "https://js.stripe.com" // Stripe payments
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com", // Stripe API
        "https://maps.googleapis.com" // Google Maps API
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com" // Stripe iframe
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    },
    reportOnly: process.env.NODE_ENV !== 'production'
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // Prevent MIME type sniffing
  noSniff: true,

  // Prevent clickjacking
  frameguard: {
    action: 'deny'
  },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // Prevent XSS attacks
  xssFilter: true,

  // Referrer policy
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
};

// MongoDB injection prevention
const mongoSanitizeOptions = {
  replaceWith: '_', // Replace prohibited characters with underscore
  allowDots: false, // Don't allow dots in keys
  onSanitize: ({ req, key }) => {
    console.warn(`[SECURITY] Sanitized key "${key}" in request to ${req.path}`);
  }
};

// Enhanced security middleware setup function with TripAdvisor-scale features
const setupSecurity = (app) => {
  logger.info('Setting up enhanced security middleware...');

  // Trust proxy (important for rate limiting behind load balancers)
  app.set('trust proxy', 1);

  // Apply correlation ID middleware first
  app.use(correlationMiddleware);

  // Apply request context middleware
  app.use(requestContext);

  // Apply DDoS protection
  app.use(ddosProtection);

  // Apply CORS with enhanced logging
  app.use(cors(corsOptions));
  app.use((req, res, next) => {
    if (req.headers.origin && !corsOptions.origin(req.headers.origin, () => {})) {
      businessLogger.security.unauthorizedAccess(
        req.ip, 
        req.originalUrl, 
        req.get('User-Agent'),
        req.user?.id,
        req.correlationId
      );
    }
    next();
  });

  // Apply advanced Helmet security headers
  app.use(advancedHelmet);

  // Sanitize MongoDB queries with enhanced logging
  app.use(mongoSanitize({
    ...mongoSanitizeOptions,
    onSanitize: ({ req, key }) => {
      logger.warn('MongoDB injection attempt detected', {
        sanitizedKey: key,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        correlationId: req.correlationId,
        type: 'security_event'
      });
      
      businessLogger.security.suspiciousActivity(
        req.user?.id,
        req.ip,
        'mongodb_injection_attempt',
        { sanitizedKey: key, path: req.path },
        req.correlationId
      );
    }
  }));

  // Apply smart rate limiting (user-aware)
  app.use(smartRateLimit);

  // Apply request logging
  app.use(requestLogger);

  // Additional security headers and monitoring
  app.use((req, res, next) => {
    // Performance monitoring
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
      
      // Log slow requests
      if (duration > 1000) {
        performanceLogger.slowEndpoint(
          req.method, 
          req.originalUrl, 
          duration, 
          req.user?.id, 
          req.correlationId
        );
      }
      
      // Log security events
      if (res.statusCode === 401) {
        businessLogger.security.unauthorizedAccess(
          req.ip,
          req.originalUrl,
          req.get('User-Agent'),
          req.user?.id,
          req.correlationId
        );
      }
      
      if (res.statusCode === 403) {
        businessLogger.security.suspiciousActivity(
          req.user?.id,
          req.ip,
          'forbidden_access',
          { path: req.originalUrl, method: req.method },
          req.correlationId
        );
      }
    });
    
    next();
  });

  logger.info('Enhanced security middleware setup completed');
};

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    sanitizeObject(req.params);
  }

  next();
};

// Helper function to sanitize objects
const sanitizeObject = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        // Remove potential XSS and injection attempts
        obj[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .trim();
      } else if (typeof value === 'object' && value !== null) {
        sanitizeObject(value);
      }
    }
  }
};

module.exports = {
  setupSecurity,
  rateLimiters,
  corsOptions,
  sanitizeInput,
  helmetOptions,
  // Export advanced security features
  advancedRateLimiters,
  smartRateLimit,
  ddosProtection,
  requestContext
};