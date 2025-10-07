const express = require('express');
const authController = require('../controllers/authControllerDynamoDB');
const {
  authenticate,
  optionalAuth,
  authorize,
  authRateLimit,
  logUserActivity,
  attachPermissions
} = require('../middleware/authDynamoDB');
const { rateLimiters } = require('../middleware/security');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateRefreshToken,
  validateForgotPassword,
  validateVerifyEmail
} = require('../validators/authValidators');

/**
 * Authentication Routes
 * 
 * Comprehensive authentication routes following travel platform patterns
 * Includes rate limiting, validation, and security middleware
 */

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(rateLimiters.auth);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { email, password, firstName, lastName, phone?, role?, agreeToTerms, agreeToPrivacy }
 */
router.post('/register', 
  validateRegister,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT tokens
 * @access  Public
 * @body    { email, password, rememberMe? }
 */
router.post('/login',
  validateLogin,
  authController.login
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 * @body    { refreshToken }
 */
router.post('/refresh',
  validateRefreshToken,
  authController.refreshToken
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate tokens)
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.post('/logout',
  authenticate,
  logUserActivity,
  authController.logout
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/profile',
  authenticate,
  attachPermissions,
  authController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { firstName?, lastName?, phone?, profile?, preferences?, location? }
 */
router.put('/profile',
  authenticate,
  validateUpdateProfile,
  authController.updateProfile
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { currentPassword, newPassword }
 */
router.put('/change-password',
  authenticate,
  validateChangePassword,
  authController.changePassword
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 * @body    { email }
 */
router.post('/forgot-password',
  rateLimiters.auth, // Extra rate limiting for password reset
  validateForgotPassword,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address with token
 * @access  Public
 * @body    { token }
 */
router.post('/verify-email',
  validateVerifyEmail,
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.post('/resend-verification',
  authenticate,
  async (req, res, next) => {
    try {
      const user = req.user;

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email is already verified',
            code: 'EMAIL_ALREADY_VERIFIED'
          }
        });
      }

      // TODO: Generate verification token and send email

      res.status(200).json({
        success: true,
        message: 'Verification email sent successfully'
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get minimal user info (for authenticated requests)
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/me',
  authenticate,
  (req, res) => {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified || false,
        isActive: user.isActive,
        avatar: user.profile?.avatar
      }
    });
  }
);

/**
 * @route   GET /api/auth/check
 * @desc    Check authentication status (optional auth)
 * @access  Public/Private
 * @headers Authorization: Bearer <token> (optional)
 */
router.get('/check',
  optionalAuth,
  (req, res) => {
    res.status(200).json({
      success: true,
      data: {
        isAuthenticated: !!req.user,
        user: req.user ? {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          role: req.user.role,
          isVerified: req.user.isVerified || false
        } : null
      }
    });
  }
);

/**
 * Admin-only routes
 */

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (admin only)
 * @access  Private (admin only)
 * @headers Authorization: Bearer <token>
 * @query   { role?, search? }
 */
router.get('/users',
  authenticate,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const UserModel = require('../models/DynamoDBUser');
      const { role, search } = req.query;

      let users;

      if (search) {
        users = await UserModel.search(search);
      } else if (role) {
        users = await UserModel.findAll({ role });
      } else {
        users = await UserModel.findAll();
      }

      res.status(200).json({
        success: true,
        data: {
          users,
          total: users.length
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;