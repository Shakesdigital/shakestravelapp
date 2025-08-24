const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const { logger } = require('../utils/logger');

/**
 * Advanced Security Middleware for TripAdvisor-scale Applications
 * 
 * Enhanced rate limiting, DDoS protection, and security headers
 * Designed for high-traffic travel booking platforms
 */

// Redis store for distributed rate limiting (in production)
let RedisStore;
try {
  // Try to load Redis store if available
  const { RedisStore: RedisStoreClass } = require('rate-limit-redis');
  const Redis = require('ioredis');
  
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  });
  
  RedisStore = new RedisStoreClass({
    sendCommand: (...args) => redis.call(...args),
  });
  
  logger.info('Redis rate limiting store initialized');
} catch (error) {
  logger.warn('Redis not available, using memory store for rate limiting');
  RedisStore = null;
}

/**
 * Advanced Rate Limiting Configuration
 */
const createAdvancedRateLimit = (options) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
      error: 'Too many requests',
      retryAfter: Math.ceil(options.windowMs / 1000),
      limit: options.max
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: RedisStore,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.id || req.ip;
    },
    handler: (req, res) => {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userId: req.user?.id,
        url: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil(options.windowMs / 1000)
      });
    },
    skip: (req) => {
      // Skip rate limiting for health checks and internal requests
      return req.originalUrl === '/api/health' || 
             req.get('X-Internal-Request') === 'true';
    }
  };

  return rateLimit({ ...defaultOptions, ...options });
};

/**
 * Tiered Rate Limiting for Different User Types
 */
const rateLimiters = {
  // Strict limits for anonymous users
  anonymous: createAdvancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per 15 minutes
    message: {
      error: 'Anonymous rate limit exceeded',
      suggestion: 'Consider creating an account for higher limits'
    }
  }),

  // Standard limits for authenticated users
  authenticated: createAdvancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // 200 requests per 15 minutes
    message: {
      error: 'User rate limit exceeded'
    }
  }),

  // Higher limits for verified hosts
  hosts: createAdvancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per 15 minutes
    message: {
      error: 'Host rate limit exceeded'
    }
  }),

  // Very strict limits for authentication endpoints
  auth: createAdvancedRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per 15 minutes
    skipSuccessfulRequests: true,
    skipFailedRequests: false,
    message: {
      error: 'Too many authentication attempts',
      action: 'Account may be temporarily locked'
    }
  }),

  // Strict limits for payment endpoints
  payments: createAdvancedRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 payment attempts per hour
    message: {
      error: 'Payment rate limit exceeded',
      action: 'Contact support if this is urgent'
    }
  }),

  // Limits for search endpoints
  search: createAdvancedRateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 searches per minute
    message: {
      error: 'Search rate limit exceeded'
    }
  }),

  // Limits for upload endpoints
  uploads: createAdvancedRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 uploads per hour
    message: {
      error: 'Upload rate limit exceeded'
    }
  }),

  // Limits for review creation (UGC moderation)
  reviews: createAdvancedRateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 10, // 10 reviews per day
    message: {
      error: 'Review rate limit exceeded',
      suggestion: 'You can submit up to 10 reviews per day'
    }
  }),

  // Limits for booking endpoints
  bookings: createAdvancedRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 booking attempts per hour
    message: {
      error: 'Booking rate limit exceeded'
    }
  })
};

/**
 * Progressive Delay for Suspected Abuse
 */
const progressiveDelay = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests at full speed
  delayMs: 100, // Add 100ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
  store: RedisStore,
  keyGenerator: (req) => req.user?.id || req.ip,
  skip: (req) => req.originalUrl === '/api/health'
});

/**
 * Enhanced Helmet Configuration for Travel Platforms
 */
const advancedHelmet = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'", // Required for some CSS frameworks
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'", 
        "data:", 
        "blob:",
        "https://res.cloudinary.com", // Image hosting
        "https://maps.googleapis.com", // Google Maps
        "https://maps.gstatic.com",
        "https://*.tripadvisor.com", // TripAdvisor assets
        "https://*.booking.com" // Booking.com assets
      ],
      scriptSrc: [
        "'self'",
        "https://maps.googleapis.com", // Google Maps
        "https://js.stripe.com", // Stripe payments
        "https://www.google-analytics.com", // Analytics
        "https://www.googletagmanager.com"
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com", // Stripe API
        "https://maps.googleapis.com", // Google Maps API
        "https://api.openweathermap.org", // Weather API
        "https://api.exchangerate-api.com" // Exchange rates
      ],
      frameSrc: [
        "'self'",
        "https://js.stripe.com", // Stripe checkout
        "https://www.google.com" // reCAPTCHA
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },

  // Prevent clickjacking
  frameguard: {
    action: 'deny'
  },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // Prevent MIME type sniffing
  noSniff: true,

  // Control referrer information
  referrerPolicy: {
    policy: ['same-origin', 'strict-origin-when-cross-origin']
  },

  // Cross-Origin Embedder Policy
  crossOriginEmbedderPolicy: false, // Disabled for compatibility

  // Cross-Origin Resource Policy
  crossOriginResourcePolicy: {
    policy: 'cross-origin'
  }
});

/**
 * Smart Rate Limiting Middleware
 * Applies different limits based on user authentication status
 */
const smartRateLimit = (req, res, next) => {
  // Determine appropriate rate limiter
  let limiter;
  
  if (!req.user) {
    limiter = rateLimiters.anonymous;
  } else if (req.user.role === 'host' && req.user.hostProfile?.isVerified) {
    limiter = rateLimiters.hosts;
  } else {
    limiter = rateLimiters.authenticated;
  }
  
  // Apply the appropriate rate limiter
  limiter(req, res, next);
};

/**
 * DDoS Protection Middleware
 */
const ddosProtection = (req, res, next) => {
  const userAgent = req.get('User-Agent') || '';
  const referer = req.get('Referer') || '';
  
  // Block suspicious user agents
  const suspiciousAgents = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /postman/i
  ];
  
  // Allow legitimate bots
  const legitimateBots = [
    /googlebot/i,
    /bingbot/i,
    /facebookexternalhit/i,
    /twitterbot/i
  ];
  
  const isSuspicious = suspiciousAgents.some(pattern => pattern.test(userAgent)) &&
                     !legitimateBots.some(pattern => pattern.test(userAgent));
  
  if (isSuspicious && !req.user) {
    logger.warn('Suspicious request blocked', {
      ip: req.ip,
      userAgent,
      url: req.originalUrl,
      referer
    });
    
    return res.status(429).json({
      success: false,
      error: 'Request blocked',
      message: 'Automated requests detected'
    });
  }
  
  next();
};

/**
 * Request Context Middleware
 */
const requestContext = (req, res, next) => {
  // Add request ID for tracing
  req.requestId = require('crypto').randomBytes(16).toString('hex');
  
  // Set security headers
  res.set({
    'X-Request-ID': req.requestId,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block'
  });
  
  next();
};

/**
 * Apply rate limiting based on endpoint type
 */
const applyEndpointRateLimit = (endpointType) => {
  return (req, res, next) => {
    const limiter = rateLimiters[endpointType];
    if (limiter) {
      limiter(req, res, next);
    } else {
      next();
    }
  };
};

module.exports = {
  rateLimiters,
  smartRateLimit,
  progressiveDelay,
  advancedHelmet,
  ddosProtection,
  requestContext,
  applyEndpointRateLimit,
  createAdvancedRateLimit
};