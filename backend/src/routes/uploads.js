const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { 
  uploadSingle, 
  uploadMultiple, 
  uploadTripPhotos,
  uploadAccommodationPhotos,
  uploadProfilePhoto,
  uploadReviewPhotos
} = require('../middleware/upload');
const { uploadValidators, validateRequest } = require('../validators/apiValidators');
const { rateLimiters } = require('../middleware/security');
const { catchAsync, AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Upload Routes
 * 
 * Photo upload endpoints for different content types
 * Includes validation, processing, and file management
 */

const router = express.Router();

// Apply rate limiting to upload routes
router.use(rateLimiters.upload);

/**
 * @route   POST /api/uploads/trip-photos
 * @desc    Upload photos for a trip
 * @access  Private (Host only)
 * @form    photos (multiple files), description?, category?
 */
router.post('/trip-photos',
  authenticate,
  authorize('host', 'admin', 'superadmin'),
  ...uploadTripPhotos,
  uploadValidators.uploadPhotos,
  validateRequest,
  catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No photos uploaded', 400);
    }

    const uploadedPhotos = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/trips/${file.filename}`, // In production, this would be a CDN URL
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    }));

    logger.info('Trip photos uploaded successfully', {
      userId: req.user.id,
      photoCount: uploadedPhotos.length,
      totalSize: uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0)
    });

    res.status(200).json({
      success: true,
      message: `${uploadedPhotos.length} photos uploaded successfully`,
      data: {
        photos: uploadedPhotos
      }
    });
  })
);

/**
 * @route   POST /api/uploads/accommodation-photos
 * @desc    Upload photos for an accommodation
 * @access  Private (Host only)
 * @form    photos (multiple files), description?, category?
 */
router.post('/accommodation-photos',
  authenticate,
  authorize('host', 'admin', 'superadmin'),
  ...uploadAccommodationPhotos,
  uploadValidators.uploadPhotos,
  validateRequest,
  catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No photos uploaded', 400);
    }

    const uploadedPhotos = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/accommodations/${file.filename}`,
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    }));

    logger.info('Accommodation photos uploaded successfully', {
      userId: req.user.id,
      photoCount: uploadedPhotos.length,
      totalSize: uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0)
    });

    res.status(200).json({
      success: true,
      message: `${uploadedPhotos.length} photos uploaded successfully`,
      data: {
        photos: uploadedPhotos
      }
    });
  })
);

/**
 * @route   POST /api/uploads/profile-photo
 * @desc    Upload profile photo/avatar
 * @access  Private
 * @form    avatar (single file), description?
 */
router.post('/profile-photo',
  authenticate,
  ...uploadProfilePhoto,
  uploadValidators.uploadPhoto,
  validateRequest,
  catchAsync(async (req, res) => {
    if (!req.file) {
      throw new AppError('No photo uploaded', 400);
    }

    const uploadedPhoto = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/profiles/${req.file.filename}`,
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    };

    // In a real application, you would update the user's profile with the new photo URL
    // await User.findByIdAndUpdate(req.user.id, { 'profile.avatar.url': uploadedPhoto.url });

    logger.info('Profile photo uploaded successfully', {
      userId: req.user.id,
      filename: uploadedPhoto.filename,
      size: uploadedPhoto.size
    });

    res.status(200).json({
      success: true,
      message: 'Profile photo uploaded successfully',
      data: {
        photo: uploadedPhoto
      }
    });
  })
);

/**
 * @route   POST /api/uploads/review-photos
 * @desc    Upload photos for a review
 * @access  Private
 * @form    photos (multiple files), description?
 */
router.post('/review-photos',
  authenticate,
  ...uploadReviewPhotos,
  uploadValidators.uploadPhotos,
  validateRequest,
  catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new AppError('No photos uploaded', 400);
    }

    const uploadedPhotos = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `/uploads/reviews/${file.filename}`,
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    }));

    logger.info('Review photos uploaded successfully', {
      userId: req.user.id,
      photoCount: uploadedPhotos.length,
      totalSize: uploadedPhotos.reduce((sum, photo) => sum + photo.size, 0)
    });

    res.status(200).json({
      success: true,
      message: `${uploadedPhotos.length} photos uploaded successfully`,
      data: {
        photos: uploadedPhotos
      }
    });
  })
);

/**
 * @route   POST /api/uploads/general
 * @desc    General photo upload endpoint
 * @access  Private
 * @form    photo (single file), category?, description?
 */
router.post('/general',
  authenticate,
  uploadSingle('photo'),
  uploadValidators.uploadPhoto,
  validateRequest,
  catchAsync(async (req, res) => {
    if (!req.file) {
      throw new AppError('No photo uploaded', 400);
    }

    const uploadedPhoto = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      url: `/uploads/temp/${req.file.filename}`,
      category: req.body.category || 'general',
      description: req.body.description,
      uploadedAt: new Date(),
      uploadedBy: req.user.id
    };

    logger.info('General photo uploaded successfully', {
      userId: req.user.id,
      filename: uploadedPhoto.filename,
      category: uploadedPhoto.category,
      size: uploadedPhoto.size
    });

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        photo: uploadedPhoto
      }
    });
  })
);

/**
 * @route   DELETE /api/uploads/:filename
 * @desc    Delete uploaded photo
 * @access  Private (Photo owner or Admin)
 * @params  { filename } - Photo filename
 */
router.delete('/:filename',
  authenticate,
  catchAsync(async (req, res) => {
    const { filename } = req.params;
    const fs = require('fs').promises;
    const path = require('path');

    // In a real application, you would:
    // 1. Check if the user owns this file
    // 2. Remove file reference from database
    // 3. Delete the physical file

    // For now, just attempt to delete from temp directory
    const filePath = path.join(process.cwd(), 'uploads', 'temp', filename);

    try {
      await fs.unlink(filePath);
      
      logger.info('Photo deleted successfully', {
        userId: req.user.id,
        filename
      });

      res.status(200).json({
        success: true,
        message: 'Photo deleted successfully'
      });
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new AppError('Photo not found', 404);
      }
      throw new AppError('Failed to delete photo', 500);
    }
  })
);

module.exports = router;