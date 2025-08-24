const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const { logger } = require('./logger');

/**
 * Authentication Utilities
 * 
 * Comprehensive JWT and authentication utilities for Shakes Travel
 * Following security best practices from travel platforms like TripAdvisor
 */

class AuthUtils {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    this.jwtExpiration = process.env.JWT_EXPIRE || '15m';
    this.jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRE || '7d';
    
    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error('JWT secrets must be defined in environment variables');
    }
  }

  /**
   * Generate access token
   * @param {Object} payload - User data to include in token
   * @returns {String} JWT access token
   */
  generateAccessToken(payload) {
    try {
      const tokenPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
        isActive: payload.isActive,
        isVerified: payload.verification?.isEmailVerified || false,
        tokenType: 'access'
      };

      return jwt.sign(tokenPayload, this.jwtSecret, {
        expiresIn: this.jwtExpiration,
        issuer: 'shakestravel.com',
        audience: 'shakestravel-users',
        subject: payload.id.toString()
      });
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Generate refresh token
   * @param {Object} payload - User data to include in token
   * @returns {String} JWT refresh token
   */
  generateRefreshToken(payload) {
    try {
      const tokenPayload = {
        id: payload.id,
        email: payload.email,
        tokenType: 'refresh',
        tokenId: crypto.randomBytes(16).toString('hex') // Unique token ID for invalidation
      };

      return jwt.sign(tokenPayload, this.jwtRefreshSecret, {
        expiresIn: this.jwtRefreshExpiration,
        issuer: 'shakestravel.com',
        audience: 'shakestravel-users',
        subject: payload.id.toString()
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Refresh token generation failed');
    }
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} user - User object
   * @returns {Object} Token pair
   */
  generateTokenPair(user) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.jwtExpiration,
      tokenType: 'Bearer'
    };
  }

  /**
   * Verify access token
   * @param {String} token - JWT token to verify
   * @returns {Object} Decoded token payload
   */
  async verifyAccessToken(token) {
    try {
      const decoded = await promisify(jwt.verify)(token, this.jwtSecret, {
        issuer: 'shakestravel.com',
        audience: 'shakestravel-users'
      });

      if (decoded.tokenType !== 'access') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid access token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {String} token - Refresh token to verify
   * @returns {Object} Decoded token payload
   */
  async verifyRefreshToken(token) {
    try {
      const decoded = await promisify(jwt.verify)(token, this.jwtRefreshSecret, {
        issuer: 'shakestravel.com',
        audience: 'shakestravel-users'
      });

      if (decoded.tokenType !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Refresh token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Extract token from Authorization header
   * @param {String} authHeader - Authorization header value
   * @returns {String|null} Extracted token
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Generate secure random token for email verification, password reset, etc.
   * @param {Number} length - Token length in bytes (default: 32)
   * @returns {String} Random hex token
   */
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash token for storage (one-way)
   * @param {String} token - Token to hash
   * @returns {String} Hashed token
   */
  hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generate API key for external integrations
   * @param {String} prefix - API key prefix
   * @returns {String} API key
   */
  generateApiKey(prefix = 'sk_') {
    const timestamp = Date.now().toString(36);
    const randomPart = crypto.randomBytes(20).toString('hex');
    return `${prefix}${timestamp}_${randomPart}`;
  }

  /**
   * Check if user role has required permissions
   * @param {String} userRole - User's role
   * @param {String|Array} requiredRoles - Required role(s)
   * @returns {Boolean} Has permission
   */
  hasPermission(userRole, requiredRoles) {
    if (!requiredRoles) return true;
    
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(userRole);
  }

  /**
   * Check if user role hierarchy allows access
   * @param {String} userRole - User's role
   * @param {String} minimumRole - Minimum required role
   * @returns {Boolean} Has access
   */
  hasRoleAccess(userRole, minimumRole) {
    const roleHierarchy = {
      'guest': 1,
      'host': 2,
      'admin': 3,
      'superadmin': 4
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[minimumRole] || 0;

    return userLevel >= requiredLevel;
  }

  /**
   * Generate session ID for tracking
   * @returns {String} Session ID
   */
  generateSessionId() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create password reset token with expiration
   * @returns {Object} Reset token data
   */
  createPasswordResetToken() {
    const resetToken = this.generateSecureToken();
    const hashedToken = this.hashToken(resetToken);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    return {
      token: resetToken,
      hashedToken,
      expiresAt
    };
  }

  /**
   * Create email verification token
   * @returns {Object} Verification token data
   */
  createEmailVerificationToken() {
    const verificationToken = this.generateSecureToken();
    const hashedToken = this.hashToken(verificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    return {
      token: verificationToken,
      hashedToken,
      expiresAt
    };
  }

  /**
   * Validate password strength
   * @param {String} password - Password to validate
   * @returns {Object} Validation result
   */
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const issues = [];
    if (password.length < minLength) {
      issues.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      issues.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      issues.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      issues.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      issues.push('Password must contain at least one special character');
    }

    const score = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, password.length >= minLength]
      .filter(Boolean).length;

    return {
      isValid: issues.length === 0,
      score: score,
      strength: score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong',
      issues
    };
  }

  /**
   * Check if email is from a disposable email provider
   * @param {String} email - Email to check
   * @returns {Boolean} Is disposable email
   */
  isDisposableEmail(email) {
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
      'mailinator.com', 'yopmail.com', 'temp-mail.org'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain);
  }

  /**
   * Rate limiting check for authentication attempts
   * @param {String} identifier - IP or user identifier
   * @param {Number} maxAttempts - Maximum attempts allowed
   * @param {Number} windowMs - Time window in milliseconds
   * @returns {Object} Rate limit status
   */
  checkRateLimit(identifier, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    // This would typically use Redis in production
    // For now, returning a simple structure
    return {
      remaining: maxAttempts,
      resetTime: Date.now() + windowMs,
      blocked: false
    };
  }
}

// Create singleton instance
const authUtils = new AuthUtils();

module.exports = authUtils;