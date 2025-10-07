const { catchAsync, AuthenticationError, AuthorizationError } = require('./errorHandler');
const UserModel = require('../models/DynamoDBUser');
const { logger, businessLogger } = require('../utils/logger');

/**
 * Authentication Middleware for DynamoDB
 *
 * Handles authentication and authorization using DynamoDB User model
 * Fully serverless without MongoDB dependency
 */

/**
 * Extract token from Authorization header
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Extract and verify JWT token from request
 * Attaches user to req.user if valid
 */
const authenticate = catchAsync(async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      throw new AuthenticationError('Access token required');
    }

    // Verify token
    const decoded = UserModel.verifyAccessToken(token);

    // Find user and ensure they still exist and are active
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    // Check if user is active
    if (!user.isActive) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, user.id);
      throw new AuthenticationError('Account is deactivated');
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
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided, continue without user
      return next();
    }

    // Verify token
    const decoded = UserModel.verifyAccessToken(token);

    // Find user
    const user = await UserModel.findById(decoded.id);

    if (user && user.isActive) {
      req.user = user;
      req.token = token;
      req.tokenPayload = decoded;
    }

    next();
  } catch (error) {
    // Token verification failed but it's optional, so continue
    logger.debug('Optional auth failed', { error: error.message });
    next();
  }
});

/**
 * Authorization middleware - check if user has required role(s)
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 */
const authorize = (...allowedRoles) => {
  return catchAsync(async (req, res, next) => {
    if (!req.user) {
      throw new AuthenticationError('Please authenticate to access this resource');
    }

    // Check if user has any of the allowed roles
    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      businessLogger.security.unauthorizedAccess(req.ip, req.originalUrl, req.user.id);
      logger.warn('Authorization failed', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        url: req.originalUrl
      });

      throw new AuthorizationError('You do not have permission to perform this action');
    }

    logger.debug('User authorized successfully', {
      userId: req.user.id,
      role: req.user.role,
      url: req.originalUrl
    });

    next();
  });
};

/**
 * Attach user permissions to request
 * Can be used to provide granular permission checking
 */
const attachPermissions = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  // Define role-based permissions
  const rolePermissions = {
    user: ['read:own', 'create:own', 'update:own', 'delete:own'],
    moderator: ['read:all', 'update:content', 'moderate:content'],
    admin: ['read:all', 'create:all', 'update:all', 'delete:all', 'manage:users']
  };

  req.permissions = rolePermissions[req.user.role] || [];

  next();
});

/**
 * Check if user has specific permission
 */
const requirePermission = (permission) => {
  return catchAsync(async (req, res, next) => {
    if (!req.permissions || !req.permissions.includes(permission)) {
      throw new AuthorizationError('Insufficient permissions');
    }
    next();
  });
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = catchAsync(async (req, res, next) => {
  // This is a placeholder - implement with Redis or in-memory cache
  // For now, just pass through
  next();
});

/**
 * Log user activity
 */
const logUserActivity = catchAsync(async (req, res, next) => {
  if (req.user) {
    logger.info('User activity', {
      userId: req.user.id,
      email: req.user.email,
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  next();
});

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  attachPermissions,
  requirePermission,
  authRateLimit,
  logUserActivity
};
