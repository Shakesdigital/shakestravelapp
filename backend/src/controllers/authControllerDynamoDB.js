const { catchAsync, AppError, ValidationError, AuthenticationError, ConflictError } = require('../middleware/errorHandler');
const UserModel = require('../models/DynamoDBUser');
const authUtils = require('../utils/auth');
const { logger, businessLogger } = require('../utils/logger');

/**
 * Authentication Controller for DynamoDB
 *
 * Handles user registration, login, profile management using DynamoDB
 * Fully serverless authentication without MongoDB dependency
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
    role = 'user',
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
  if (authUtils.isDisposableEmail && authUtils.isDisposableEmail(email)) {
    throw new ValidationError('Disposable email addresses are not allowed');
  }

  // Validate password strength
  const passwordValidation = authUtils.validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Password does not meet requirements', passwordValidation.issues);
  }

  // Validate role - always force 'user' for public registrations
  let userRole = 'user';

  try {
    // Create new user
    const user = await UserModel.create({
      email,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim(),
      role: userRole
    });

    // Generate authentication tokens
    const accessToken = UserModel.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = UserModel.generateRefreshToken(user.id);

    // Log successful registration
    businessLogger.auth.login(user.id, req.ip);
    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: req.ip
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Shakes Travel.',
      data: {
        user,
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: process.env.JWT_EXPIRE || '15m'
        },
        nextSteps: [
          'Complete your profile',
          'Explore experiences and accommodations'
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

    if (error.message.includes('already exists')) {
      businessLogger.security.suspiciousActivity(null, req.ip, 'duplicate_registration_attempt');
      throw new ConflictError('A user with this email already exists');
    }

    throw error;
  }
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = catchAsync(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ValidationError('Please provide email and password');
  }

  // Find user by email
  const user = await UserModel.findByEmail(email);

  if (!user) {
    businessLogger.security.suspiciousActivity(null, req.ip, 'login_failed_user_not_found');
    throw new AuthenticationError('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    businessLogger.security.suspiciousActivity(user.id, req.ip, 'login_attempt_inactive_account');
    throw new AuthenticationError('Your account has been deactivated. Please contact support.');
  }

  // Verify password
  const isPasswordValid = await UserModel.comparePassword(password, user.passwordHash);

  if (!isPasswordValid) {
    businessLogger.security.suspiciousActivity(user.id, req.ip, 'login_failed_invalid_password');
    throw new AuthenticationError('Invalid email or password');
  }

  // Update last login
  await UserModel.updateLastLogin(user.id);

  // Generate tokens
  const accessToken = UserModel.generateAccessToken(user.id, user.email, user.role);
  const refreshToken = UserModel.generateRefreshToken(user.id);

  // Log successful login
  businessLogger.auth.login(user.id, req.ip);
  logger.info('User logged in successfully', {
    userId: user.id,
    email: user.email,
    ip: req.ip
  });

  // Remove password hash from response
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRE || '15m'
      }
    }
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
    const decoded = UserModel.verifyRefreshToken(refreshToken);

    // Get user
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.isActive) {
      throw new AuthenticationError('Account is deactivated');
    }

    // Generate new access token
    const accessToken = UserModel.generateAccessToken(user.id, user.email, user.role);

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        expiresIn: process.env.JWT_EXPIRE || '15m'
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new AuthenticationError('Invalid or expired refresh token');
    }
    throw error;
  }
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = catchAsync(async (req, res) => {
  // Note: With JWT, logout is typically handled client-side by removing tokens
  // For enhanced security, implement token blacklisting with Redis

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
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  // Remove password hash
  const { passwordHash, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    data: {
      user: userWithoutPassword
    }
  });
});

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = catchAsync(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    profile,
    preferences
  } = req.body;

  const updates = {};

  if (firstName) updates.firstName = firstName.trim();
  if (lastName) updates.lastName = lastName.trim();
  if (phone) updates.phone = phone.trim();
  if (profile) updates.profile = { ...profile };
  if (preferences) {
    updates.profile = updates.profile || {};
    updates.profile.preferences = preferences;
  }

  const updatedUser = await UserModel.update(req.user.id, updates);

  logger.info('User profile updated', {
    userId: req.user.id,
    updates: Object.keys(updates)
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
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

  // Validate new password strength
  const passwordValidation = authUtils.validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError('New password does not meet requirements', passwordValidation.issues);
  }

  // Update password
  await UserModel.updatePassword(req.user.id, currentPassword, newPassword);

  businessLogger.security.securityEvent(req.user.id, req.ip, 'password_changed');
  logger.info('User password changed', {
    userId: req.user.id,
    ip: req.ip
  });

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

/**
 * Forgot password (placeholder)
 * POST /api/auth/forgot-password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ValidationError('Email is required');
  }

  // Find user
  const user = await UserModel.findByEmail(email);

  // Always return success for security (don't reveal if email exists)
  res.status(200).json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.'
  });

  if (!user) {
    return;
  }

  // TODO: Implement password reset token generation and email sending
  logger.info('Password reset requested', {
    userId: user.id,
    email: user.email,
    ip: req.ip
  });
});

/**
 * Verify email (placeholder)
 * POST /api/auth/verify-email
 */
const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new ValidationError('Verification token is required');
  }

  // TODO: Implement email verification logic

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  verifyEmail
};
