const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const { cache } = require('../cache');

// Rate limiting store configuration
const createStore = () => {
  // Use MongoDB for persistent rate limiting in production
  if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
    return new MongoStore({
      uri: process.env.MONGODB_URI,
      collectionName: 'rateLimits',
      expireTimeMs: 15 * 60 * 1000, // 15 minutes
    });
  }
  
  // Use memory store for development
  return new Map();
};

// Custom key generator based on user authentication
const createKeyGenerator = (includeUser = false) => {
  return (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent') || 'unknown';
    const route = req.route?.path || req.path;
    
    if (includeUser && req.user?.id) {
      return `${req.user.id}:${route}`;
    }
    
    // Use IP + User-Agent hash for anonymous users
    const fingerprint = Buffer.from(`${ip}:${userAgent}`).toString('base64');
    return `${fingerprint}:${route}`;
  };
};

// Custom message generator
const createMessageGenerator = (type) => {
  return (req, res) => {
    const resetTime = new Date(Date.now() + res.getHeader('Retry-After') * 1000);
    
    return {
      success: false,
      error: {
        type: 'RATE_LIMIT_EXCEEDED',
        message: getRateLimitMessage(type),
        resetTime: resetTime.toISOString(),
        retryAfter: res.getHeader('Retry-After'),
        limit: res.getHeader('X-RateLimit-Limit'),
        remaining: res.getHeader('X-RateLimit-Remaining'),
        recommendation: getRateLimitRecommendation(type),
      }
    };
  };
};

function getRateLimitMessage(type) {
  const messages = {
    general: 'Too many requests from this IP, please try again later.',
    auth: 'Too many authentication attempts, please try again later.',
    booking: 'Too many booking requests, please try again later.',
    search: 'Too many search requests, please try again later.',
    upload: 'Too many file uploads, please try again later.',
    api: 'API rate limit exceeded, please try again later.',
    payment: 'Too many payment requests, please try again later.',
  };
  
  return messages[type] || messages.general;
}

function getRateLimitRecommendation(type) {
  const recommendations = {
    general: 'Consider implementing client-side request queuing or caching.',
    auth: 'Please check your credentials and try again after the cooldown period.',
    booking: 'Please complete your current booking before starting a new one.',
    search: 'Try using more specific search criteria to reduce requests.',
    upload: 'Please wait for your current upload to complete.',
    api: 'Consider implementing exponential backoff in your requests.',
    payment: 'Please wait for your current payment to process.',
  };
  
  return recommendations[type] || recommendations.general;
}

// Rate limiting configurations
const rateLimitConfigs = {
  // General API rate limiting
  general: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(false),
    message: createMessageGenerator('general'),
    skip: (req) => {
      // Skip rate limiting for health checks and static assets
      return req.path.startsWith('/health') || 
             req.path.startsWith('/static') ||
             req.path.startsWith('/_next');
    },
  }),

  // Authentication endpoints - stricter limits
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    skipSuccessfulRequests: true, // Don't count successful logins
    skipFailedRequests: false, // Count failed attempts
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(false),
    message: createMessageGenerator('auth'),
  }),

  // Booking endpoints
  booking: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 booking attempts per window
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(true), // Include user ID
    message: createMessageGenerator('booking'),
  }),

  // Search endpoints
  search: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // 60 searches per minute
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(false),
    message: createMessageGenerator('search'),
  }),

  // File upload endpoints
  upload: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 uploads per window
    skipSuccessfulRequests: false,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(true),
    message: createMessageGenerator('upload'),
  }),

  // Payment endpoints - very strict
  payment: rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // 5 payment attempts per window
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(true),
    message: createMessageGenerator('payment'),
  }),

  // API endpoints for authenticated users - more lenient
  apiAuthenticated: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2000, // 2000 requests per window for authenticated users
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(true),
    message: createMessageGenerator('api'),
    skip: (req) => !req.user?.id, // Only apply to authenticated users
  }),

  // API endpoints for unauthenticated users - stricter
  apiUnauthenticated: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window for unauthenticated users
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(false),
    message: createMessageGenerator('api'),
    skip: (req) => !!req.user?.id, // Only apply to unauthenticated users
  }),

  // Admin endpoints - moderate limits
  admin: rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    store: createStore(),
    keyGenerator: createKeyGenerator(true),
    message: createMessageGenerator('api'),
  }),
};

// Dynamic rate limiting based on user tier
const createTieredRateLimit = () => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      let limit = 100; // Default limit
      let windowMs = 15 * 60 * 1000; // 15 minutes
      
      if (user) {
        // Adjust limits based on user role/tier
        switch (user.role) {
          case 'premium':
            limit = 2000;
            break;
          case 'host':
            limit = 1500;
            break;
          case 'admin':
            limit = 5000;
            break;
          default:
            limit = 1000;
        }
        
        // Check user's API usage history
        const cacheKey = `api_usage:${user.id}:${Math.floor(Date.now() / windowMs)}`;
        const currentUsage = await cache.get(cacheKey) || 0;
        
        if (currentUsage >= limit) {
          return res.status(429).json({
            success: false,
            error: {
              type: 'RATE_LIMIT_EXCEEDED',
              message: `API limit exceeded for your account tier (${user.role})`,
              limit,
              current: currentUsage,
              resetTime: new Date(Math.ceil(Date.now() / windowMs) * windowMs).toISOString(),
            }
          });
        }
        
        // Increment usage counter
        await cache.set(cacheKey, currentUsage + 1, windowMs / 1000);
        
        // Add headers
        res.set('X-RateLimit-Limit', limit);
        res.set('X-RateLimit-Remaining', limit - currentUsage - 1);
        res.set('X-RateLimit-Reset', Math.ceil(Date.now() / windowMs) * windowMs);
      }
      
      next();
    } catch (error) {
      console.error('Tiered rate limiting error:', error);
      // Don't fail the request if rate limiting fails
      next();
    }
  };
};

// Adaptive rate limiting based on system load
const createAdaptiveRateLimit = () => {
  return async (req, res, next) => {
    try {
      // Get system metrics (simplified)
      const systemLoad = await getSystemLoad();
      
      let multiplier = 1.0;
      
      if (systemLoad.cpu > 80) {
        multiplier = 0.5; // Reduce limits by 50% under high CPU load
      } else if (systemLoad.cpu > 60) {
        multiplier = 0.7; // Reduce limits by 30% under moderate load
      } else if (systemLoad.memory > 80) {
        multiplier = 0.6; // Reduce limits under high memory usage
      }
      
      // Store multiplier for use in other rate limiters
      req.rateLimitMultiplier = multiplier;
      
      next();
    } catch (error) {
      console.error('Adaptive rate limiting error:', error);
      next();
    }
  };
};

// Simple system load monitoring
async function getSystemLoad() {
  const os = require('os');
  
  return {
    cpu: os.loadavg()[0] * 100 / os.cpus().length, // Approximate CPU usage
    memory: (os.totalmem() - os.freemem()) / os.totalmem() * 100,
    uptime: os.uptime(),
  };
}

// Rate limiting bypass for trusted sources
const createBypassMiddleware = () => {
  return (req, res, next) => {
    const trustedIPs = (process.env.TRUSTED_IPS || '').split(',').filter(Boolean);
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Check for trusted API keys
    const apiKey = req.get('X-API-Key');
    const trustedApiKeys = (process.env.TRUSTED_API_KEYS || '').split(',').filter(Boolean);
    
    if (trustedIPs.includes(clientIP) || trustedApiKeys.includes(apiKey)) {
      req.skipRateLimit = true;
    }
    
    next();
  };
};

// Rate limiting analytics
const createAnalyticsMiddleware = () => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log rate limiting events
      if (res.statusCode === 429) {
        logRateLimitEvent(req, res);
      }
      
      return originalSend.call(this, data);
    };
    
    next();
  };
};

async function logRateLimitEvent(req, res) {
  try {
    const eventData = {
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      route: req.route?.path || req.path,
      method: req.method,
      userId: req.user?.id,
      limit: res.getHeader('X-RateLimit-Limit'),
      remaining: res.getHeader('X-RateLimit-Remaining'),
      resetTime: res.getHeader('X-RateLimit-Reset'),
    };
    
    // Store in cache for analytics
    await cache.set(
      `rate_limit_event:${Date.now()}:${Math.random()}`,
      eventData,
      24 * 60 * 60 // Keep for 24 hours
    );
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Rate limit exceeded:', eventData);
    }
    
  } catch (error) {
    console.error('Failed to log rate limit event:', error);
  }
}

// Health check for rate limiting system
async function healthCheckRateLimit() {
  try {
    const testKey = `health_check:${Date.now()}`;
    
    // Test cache connectivity
    await cache.set(testKey, { test: true }, 10);
    const retrieved = await cache.get(testKey);
    await cache.del(testKey);
    
    return {
      status: 'healthy',
      cacheConnected: !!retrieved,
      storeType: process.env.NODE_ENV === 'production' ? 'mongodb' : 'memory',
      timestamp: new Date().toISOString(),
    };
    
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  rateLimitConfigs,
  createTieredRateLimit,
  createAdaptiveRateLimit,
  createBypassMiddleware,
  createAnalyticsMiddleware,
  healthCheckRateLimit,
};