const { catchAsync, AuthenticationError, AuthorizationError } = require('./errorHandler');
const { User } = require('../models');
const authUtils = require('../utils/auth');
const { logger, businessLogger } = require('../utils/logger');

/**
 * Authentication Middleware
 * 
 * Comprehensive authentication and authorization middleware
 * following security best practices from travel platforms
 */

/**
 * Extract and verify JWT token from request
 * Attaches user to req.user if valid
 */
const authenticate = catchAsync(async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify token
    const decoded = await authUtils.verifyAccessToken(token);

    // Find user and ensure they still exist and are active
    const user = await User.findById(decoded.id).select('+passwordChangedAt');
    
    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    // Check if user is active
    if (!user.isActive) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, user.id);
      throw new AuthenticationError('Account is deactivated');
    }

    // Check if user is suspended
    if (user.isSuspended) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, user.id);
      throw new AuthenticationError('Account is suspended');
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const tokenIssuedAt = new Date(decoded.iat * 1000);
      if (user.passwordChangedAt > tokenIssuedAt) {
        throw new AuthenticationError('Password recently changed. Please log in again');
      }
    }

    // Check if account is locked
    if (user.isAccountLocked) {
      throw new AuthenticationError('Account is temporarily locked');
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    req.tokenPayload = decoded;

    // Log successful authentication
    logger.debug('User authenticated successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    next();
  } catch (error) {
    // Log authentication failure
    logger.warn('Authentication failed', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl
    });

    // Track suspicious activity
    if (error.message.includes('Invalid') || error.message.includes('expired')) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl);
    }

    next(error);
  }
});

/**
 * Optional authentication - doesn't fail if no token provided
 * Used for endpoints that work with or without authentication
 */
const optionalAuth = catchAsync(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = await authUtils.verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      
      if (user && user.isActive && !user.isSuspended) {
        req.user = user;
        req.token = token;
        req.tokenPayload = decoded;
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    logger.debug('Optional authentication failed:', error.message);
    next();
  }
});

/**
 * Role-based authorization middleware
 * @param {...String} roles - Allowed roles
 */
const authorize = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!authUtils.hasPermission(req.user.role, roles)) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
      throw new AuthorizationError(`Access denied. Required role: ${roles.join(' or ')}`);
    }

    next();
  });
};

/**
 * Hierarchical role authorization
 * @param {String} minimumRole - Minimum required role level
 */
const authorizeRole = (minimumRole) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!authUtils.hasRoleAccess(req.user.role, minimumRole)) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
      throw new AuthorizationError(`Access denied. Minimum role required: ${minimumRole}`);
    }

    next();
  });
};

/**
 * Check if user is the owner of a resource or has admin privileges
 * @param {String} resourceUserField - Field name containing user ID in resource
 */
const authorizeOwnerOrAdmin = (resourceUserField = 'userId') => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    // Admin and superadmin can access everything
    if (['admin', 'superadmin'].includes(req.user.role)) {
      return next();
    }

    // Check if user owns the resource
    const resourceUserId = req.params.userId || req.body[resourceUserField] || req[resourceUserField];
    
    if (resourceUserId && resourceUserId.toString() !== req.user.id.toString()) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
      throw new AuthorizationError('Access denied. You can only access your own resources');
    }

    next();
  });
};

/**
 * Ensure user email is verified
 */
const requireEmailVerification = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (!req.user.verification?.isEmailVerified) {
    throw new AuthorizationError('Email verification required. Please verify your email address');
  }

  next();
});

/**
 * Ensure user identity is verified (for sensitive operations)
 */
const requireIdentityVerification = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (!req.user.verification?.isIdentityVerified) {
    throw new AuthorizationError('Identity verification required for this operation');
  }

  next();
});

/**
 * Host-specific authorization
 * Ensures user is a verified host
 */
const requireHostVerification = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  if (req.user.role !== 'host' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
    throw new AuthorizationError('Host privileges required');
  }

  if (req.user.role === 'host' && !req.user.hostProfile?.isVerified) {
    throw new AuthorizationError('Host verification required. Please complete host verification process');
  }

  next();
});

/**
 * Check if user can manage a specific listing (trip/accommodation)
 * @param {String} Model - Mongoose model to check
 * @param {String} idParam - Parameter name containing resource ID
 */
const authorizeListingManager = (Model, idParam = 'id') => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    const resourceId = req.params[idParam];
    if (!resourceId) {
      throw new Error('Resource ID not provided');
    }

    // Admin can manage everything
    if (['admin', 'superadmin'].includes(req.user.role)) {
      return next();
    }

    // Find the resource and check ownership
    const resource = await Model.findById(resourceId);
    if (!resource) {
      throw new Error('Resource not found');
    }

    // Check if user owns the resource
    const ownerId = resource.providerId || resource.hostId;
    if (!ownerId || ownerId.toString() !== req.user.id.toString()) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
      throw new AuthorizationError('Access denied. You can only manage your own listings');
    }

    // Attach resource to request for further use
    req.resource = resource;
    next();
  });
};

/**
 * Rate limiting middleware for authentication endpoints
 */
const authRateLimit = catchAsync(async (req, res, next) => {
  const identifier = req.ip;
  const endpoint = req.route?.path || req.path;
  
  // Different limits for different endpoints
  const limits = {
    '/register': { max: 3, window: 60 * 60 * 1000 }, // 3 per hour
    '/login': { max: 5, window: 15 * 60 * 1000 },    // 5 per 15 minutes
    '/forgot-password': { max: 3, window: 60 * 60 * 1000 }, // 3 per hour
    '/verify-email': { max: 5, window: 60 * 60 * 1000 }     // 5 per hour
  };

  const limit = limits[endpoint];
  if (limit) {
    const rateLimitStatus = authUtils.checkRateLimit(identifier, limit.max, limit.window);
    
    if (rateLimitStatus.blocked) {
      businessLogger.security.rateLimitExceeded(req.ip, endpoint);
      throw new Error('Too many attempts. Please try again later');
    }
  }

  next();
});

/**
 * Middleware to log user activity
 */
const logUserActivity = catchAsync(async (req, res, next) => {
  if (req.user) {
    // Update last activity timestamp
    req.user.lastLoginAt = new Date();
    req.user.lastLoginIP = req.ip;
    
    // Save without triggering all middleware
    await req.user.updateOne({
      lastLoginAt: req.user.lastLoginAt,
      lastLoginIP: req.user.lastLoginIP
    });

    // Log business activity
    businessLogger.auth.login(req.user.id, req.ip);
  }

  next();
});

/**
 * Middleware to attach user's permissions to request
 */
const attachPermissions = catchAsync(async (req, res, next) => {
  if (req.user) {
    req.permissions = {
      canCreateTrips: ['host', 'admin', 'superadmin'].includes(req.user.role),
      canCreateAccommodations: ['host', 'admin', 'superadmin'].includes(req.user.role),
      canManageBookings: true, // All authenticated users can manage their bookings
      canAccessAdmin: ['admin', 'superadmin'].includes(req.user.role),
      canModerateContent: ['admin', 'superadmin'].includes(req.user.role),
      canViewAnalytics: ['host', 'admin', 'superadmin'].includes(req.user.role),
      isHost: req.user.role === 'host' && req.user.hostProfile?.isVerified,
      isAdmin: ['admin', 'superadmin'].includes(req.user.role),
      isVerified: req.user.verification?.isEmailVerified || false
    };
  }

  next();
});

/**
 * Admin role check middleware
 */
const isAdmin = catchAsync(async (req, res, next) => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }
  
  if (!['admin', 'superadmin'].includes(req.user.role)) {
    businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
    throw new AuthorizationError('Admin privileges required');
  }
  
  next();
});

module.exports = {
  authenticate,
  auth: authenticate, // alias for consistency with frontend
  optionalAuth,
  authorize,
  authorizeRole,
  authorizeOwnerOrAdmin,
  requireEmailVerification,
  requireIdentityVerification,
  requireHostVerification,
  authorizeListingManager,
  authRateLimit,
  logUserActivity,
  attachPermissions,
  isAdmin
};