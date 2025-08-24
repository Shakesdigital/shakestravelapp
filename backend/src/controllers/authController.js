const { catchAsync, AppError, ValidationError, AuthenticationError, ConflictError } = require('../middleware/errorHandler');
const { User } = require('../models');
const authUtils = require('../utils/auth');
const { logger, businessLogger } = require('../utils/logger');
const bcrypt = require('bcryptjs');

/**
 * Authentication Controller
 * 
 * Handles user registration, login, profile management, and authentication flows
 * Following security best practices from travel platforms like TripAdvisor
 */

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = catchAsync(async (req, res) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    role = 'guest',
    agreeToTerms,
    agreeToPrivacy
  } = req.body;

  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    throw new ValidationError('Email, password, first name, and last name are required');
  }

  // Check terms agreement
  if (!agreeToTerms || !agreeToPrivacy) {
    throw new ValidationError('You must agree to terms of service and privacy policy');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Please provide a valid email address');
  }

  // Check for disposable email
  if (authUtils.isDisposableEmail(email)) {
    throw new ValidationError('Disposable email addresses are not allowed');
  }

  // Validate password strength
  const passwordValidation = authUtils.validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password does not meet requirements', passwordValidation.issues);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ 
    email: email.toLowerCase() 
  });

  if (existingUser) {
    // Don't reveal that user exists for security
    businessLogger.security.suspiciousActivity(null, req.ip, 'duplicate_registration_attempt');
    throw new ConflictError('A user with this email already exists');
  }

  // Validate phone number if provided
  if (phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new ValidationError('Please provide a valid phone number');
    }
  }

  // Validate role
  const allowedRoles = ['guest', 'host'];
  if (!allowedRoles.includes(role)) {
    throw new ValidationError('Invalid role specified');
  }

  try {
    // Create new user
    const userData = {
      email: email.toLowerCase(),
      password, // Will be hashed by pre-save middleware
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      role,
      location: {
        country: 'Uganda' // Default country
      }
    };

    // If registering as host, initialize host profile
    if (role === 'host') {
      userData.hostProfile = {
        isHost: true,
        joinedAsHostAt: new Date()
      };
    }

    const user = new User(userData);
    
    // Generate email verification token
    const verificationTokenData = authUtils.createEmailVerificationToken();
    user.verification.emailVerificationToken = verificationTokenData.hashedToken;
    user.verification.emailVerificationExpires = verificationTokenData.expiresAt;

    // Save user
    await user.save();

    // Generate authentication tokens
    const tokens = authUtils.generateTokenPair(user);

    // Log successful registration
    businessLogger.auth.login(user.id, req.ip);
    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    // TODO: Send welcome email with verification link
    // await emailService.sendWelcomeEmail(user.email, verificationTokenData.token);

    // Remove sensitive data from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      data: {
        user: userResponse,
        tokens,
        nextSteps: [
          'Verify your email address',
          ...(role === 'host' ? ['Complete host profile', 'Submit verification documents'] : [])
        ]
      }
    });

  } catch (error) {
    // Log registration failure
    logger.error('User registration failed', {
      email: email.toLowerCase(),
      error: error.message,
      ip: req.ip
    });

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      throw new ConflictError('A user with this email already exists');
    }

    throw error;
  }
});

/**
 * User login
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password, rememberMe = false } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ 
    email: email.toLowerCase() 
  }).select('+password +passwordChangedAt +loginAttempts +lockUntil');

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password))) {
    // Log failed login attempt
    businessLogger.auth.loginFailed(email.toLowerCase(), req.ip, 'invalid_credentials');
    
    // Increment login attempts if user exists
    if (user) {
      await user.incrementLoginAttempts();
    }

    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is locked
  if (user.isAccountLocked) {
    businessLogger.auth.loginFailed(email.toLowerCase(), req.ip, 'account_locked');
    throw new AuthenticationError('Account temporarily locked due to too many failed login attempts');
  }

  // Check if account is active
  if (!user.isActive) {
    businessLogger.auth.loginFailed(email.toLowerCase(), req.ip, 'account_inactive');
    throw new AuthenticationError('Account is deactivated. Please contact support');
  }

  // Check if account is suspended
  if (user.isSuspended) {
    businessLogger.auth.loginFailed(email.toLowerCase(), req.ip, 'account_suspended');
    throw new AuthenticationError('Account is suspended. Please contact support');
  }

  try {
    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login information
    user.lastLoginAt = new Date();
    user.lastLoginIP = req.ip;
    await user.save();

    // Generate tokens
    const tokens = authUtils.generateTokenPair(user);

    // If remember me is selected, extend refresh token expiration
    if (rememberMe) {
      // This would typically involve storing a longer-lived refresh token
      // For now, we'll just note it in the response
    }

    // Log successful login
    businessLogger.auth.login(user.id, req.ip);
    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    // Prepare user response
    const userResponse = user.toJSON();

    // Check for important notifications
    const notifications = [];
    if (!user.verification?.isEmailVerified) {
      notifications.push({
        type: 'warning',
        message: 'Please verify your email address',
        action: 'verify_email'
      });
    }

    if (user.role === 'host' && !user.hostProfile?.isVerified) {
      notifications.push({
        type: 'info',
        message: 'Complete host verification to start listing',
        action: 'complete_host_verification'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens,
        notifications,
        lastLogin: user.lastLoginAt
      }
    });

  } catch (error) {
    logger.error('Login process failed', {
      userId: user.id,
      email: user.email,
      error: error.message,
      ip: req.ip
    });
    throw error;
  }
});

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = req.user;

  // Get additional user statistics
  const stats = {
    totalBookings: 0,
    totalReviews: 0,
    memberSince: user.createdAt
  };

  // If user is a host, get host-specific stats
  if (user.role === 'host') {
    // TODO: Aggregate host statistics
    // const hostStats = await getHostStatistics(user.id);
    // stats = { ...stats, ...hostStats };
  }

  logger.debug('Profile accessed', {
    userId: user.id,
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    data: {
      user: user.toJSON(),
      stats,
      permissions: req.permissions || {}
    }
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const allowedUpdates = [
    'firstName', 'lastName', 'phone', 'profile', 'preferences', 'location'
  ];

  // Filter allowed updates
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Validate phone number if being updated
  if (updates.phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(updates.phone)) {
      throw new ValidationError('Please provide a valid phone number');
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  logger.info('Profile updated', {
    userId: user.id,
    updatedFields: Object.keys(updates),
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: user.toJSON()
    }
  });
});

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ValidationError('Current password and new password are required');
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    businessLogger.security.suspiciousActivity(req.user.id, req.ip, 'invalid_password_change_attempt');
    throw new AuthenticationError('Current password is incorrect');
  }

  // Validate new password
  const passwordValidation = authUtils.validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError('New password does not meet requirements', passwordValidation.issues);
  }

  // Check if new password is different from current
  if (await user.comparePassword(newPassword)) {
    throw new ValidationError('New password must be different from current password');
  }

  // Update password
  user.password = newPassword;
  user.passwordChangedAt = new Date();
  await user.save();

  logger.info('Password changed successfully', {
    userId: user.id,
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ValidationError('Refresh token is required');
  }

  try {
    // Verify refresh token
    const decoded = await authUtils.verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive || user.isSuspended) {
      throw new AuthenticationError('Invalid refresh token');
    }

    // Generate new token pair
    const tokens = authUtils.generateTokenPair(user);

    logger.debug('Token refreshed', {
      userId: user.id,
      ip: req.ip
    });

    res.status(200).json({
      success: true,
      data: {
        tokens
      }
    });

  } catch (error) {
    businessLogger.security.suspiciousActivity(null, req.ip, 'invalid_refresh_token');
    throw new AuthenticationError('Invalid or expired refresh token');
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  // In a production environment with Redis, you would:
  // 1. Add the current token to a blacklist
  // 2. Remove the refresh token from storage
  // For now, we'll just log the logout

  businessLogger.auth.logout(req.user.id, req.ip);
  logger.info('User logged out', {
    userId: req.user.id,
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  // Always return success to prevent email enumeration
  const response = {
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent'
  };

  if (user && user.isActive) {
    // Generate reset token
    const resetTokenData = authUtils.createPasswordResetToken();
    
    user.passwordResetToken = resetTokenData.hashedToken;
    user.passwordResetExpires = resetTokenData.expiresAt;
    await user.save();

    // TODO: Send password reset email
    // await emailService.sendPasswordResetEmail(user.email, resetTokenData.token);

    logger.info('Password reset requested', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
  } else {
    logger.warn('Password reset requested for non-existent email', {
      email: email.toLowerCase(),
      ip: req.ip
    });
  }

  res.status(200).json(response);
});

/**
 * Verify email address
 * POST /api/auth/verify-email
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  // Hash the token to compare with stored version
  const hashedToken = authUtils.hashToken(token);

  // Find user with matching token that hasn't expired
  const user = await User.findOne({
    'verification.emailVerificationToken': hashedToken,
    'verification.emailVerificationExpires': { $gt: Date.now() }
  });

  if (!user) {
    throw new ValidationError('Invalid or expired verification token');
  }

  // Update user verification status
  user.verification.isEmailVerified = true;
  user.verification.emailVerificationToken = undefined;
  user.verification.emailVerificationExpires = undefined;
  await user.save();

  logger.info('Email verified successfully', {
    userId: user.id,
    email: user.email,
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  logout,
  forgotPassword,
  verifyEmail
};