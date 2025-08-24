const express = require('express');
const authController = require('../controllers/authController');
const { 
  authenticate, 
  optionalAuth,
  authorize,
  authRateLimit,
  logUserActivity,
  attachPermissions
} = require('../middleware/auth');
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
      
      if (user.verification?.isEmailVerified) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email is already verified',
            code: 'EMAIL_ALREADY_VERIFIED'
          }
        });
      }

      // Generate new verification token
      const authUtils = require('../utils/auth');
      const verificationTokenData = authUtils.createEmailVerificationToken();
      
      user.verification.emailVerificationToken = verificationTokenData.hashedToken;
      user.verification.emailVerificationExpires = verificationTokenData.expiresAt;
      await user.save();

      // TODO: Send verification email
      // await emailService.sendVerificationEmail(user.email, verificationTokenData.token);

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
        isEmailVerified: user.verification?.isEmailVerified || false,
        isActive: user.isActive,
        avatar: user.profile?.avatar?.url
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
          isEmailVerified: req.user.verification?.isEmailVerified || false
        } : null
      }
    });
  }
);

/**
 * Host-specific routes
 */

/**
 * @route   POST /api/auth/apply-host
 * @desc    Apply to become a host
 * @access  Private (guest only)
 * @headers Authorization: Bearer <token>
 * @body    { businessInfo?, motivation? }
 */
router.post('/apply-host',
  authenticate,
  authorize('guest'), // Only guests can apply to become hosts
  async (req, res, next) => {
    try {
      const user = req.user;
      const { businessInfo, motivation } = req.body;

      // Check if user already has host profile
      if (user.hostProfile?.isHost) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'User is already a host',
            code: 'ALREADY_HOST'
          }
        });
      }

      // Initialize host profile
      user.hostProfile = {
        isHost: true,
        businessInfo: businessInfo || {},
        joinedAsHostAt: new Date(),
        isVerified: false
      };

      // Update role to host
      user.role = 'host';

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Host application submitted successfully. Verification process will begin shortly.',
        data: {
          user: user.toJSON(),
          nextSteps: [
            'Complete business profile',
            'Upload verification documents',
            'Wait for verification approval'
          ]
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/auth/host-status
 * @desc    Get host verification status
 * @access  Private (host only)
 * @headers Authorization: Bearer <token>
 */
router.get('/host-status',
  authenticate,
  authorize('host', 'admin'),
  (req, res) => {
    const user = req.user;
    const hostProfile = user.hostProfile;

    res.status(200).json({
      success: true,
      data: {
        isHost: hostProfile?.isHost || false,
        isVerified: hostProfile?.isVerified || false,
        joinedAsHostAt: hostProfile?.joinedAsHostAt,
        verifiedAt: hostProfile?.verifiedAt,
        rating: hostProfile?.rating || 0,
        totalReviews: hostProfile?.totalReviews || 0,
        totalBookings: hostProfile?.totalBookings || 0,
        businessInfo: hostProfile?.businessInfo || {},
        nextSteps: !hostProfile?.isVerified ? [
          'Complete business profile',
          'Upload verification documents',
          'Wait for verification approval'
        ] : [
          'Create your first listing',
          'Optimize your profile for better visibility'
        ]
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
 * @query   { page?, limit?, role?, search?, status? }
 */
router.get('/users',
  authenticate,
  authorize('admin', 'superadmin'),
  async (req, res, next) => {
    try {
      const {
        page = 1,
        limit = 20,
        role,
        search,
        status = 'active'
      } = req.query;

      const query = {};
      
      // Filter by role
      if (role) {
        query.role = role;
      }

      // Filter by status
      if (status === 'active') {
        query.isActive = true;
        query.isSuspended = false;
      } else if (status === 'suspended') {
        query.isSuspended = true;
      } else if (status === 'inactive') {
        query.isActive = false;
      }

      // Search functionality
      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex }
        ];
      }

      const users = await User.find(query)
        .select('-password -passwordResetToken -passwordResetExpires')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;