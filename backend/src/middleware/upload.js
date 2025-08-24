const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { AppError } = require('./errorHandler');
const { logger } = require('../utils/logger');

/**
 * Photo Upload Middleware
 * 
 * Multer configuration for handling photo uploads with security and validation
 * Supports multiple upload types for different use cases
 */

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload directory based on file type/category
    let uploadDir = 'uploads/temp'; // Default temporary directory
    
    if (req.body.category || req.query.category) {
      const category = req.body.category || req.query.category;
      const allowedCategories = ['trips', 'accommodations', 'profiles', 'reviews'];
      
      if (allowedCategories.includes(category)) {
        uploadDir = `uploads/${category}`;
      }
    }
    
    // In production, you might want to create directories dynamically
    // For now, assume directories exist
    cb(null, uploadDir);
  },
  
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(file.originalname);
    const filename = `${Date.now()}-${uniqueSuffix}${fileExtension}`;
    cb(null, filename);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.', 400), false);
  }
  
  // Check file extension as additional security
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension)) {
    return cb(new AppError('Invalid file extension.', 400), false);
  }
  
  cb(null, true);
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 10 // Maximum 10 files per request
  }
});

// Different upload middleware for different use cases

/**
 * Single photo upload
 */
const uploadSingle = (fieldName = 'photo') => {
  return (req, res, next) => {
    const uploadSingleFile = upload.single(fieldName);
    
    uploadSingleFile(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              return next(new AppError('File too large. Maximum size is 10MB.', 400));
            case 'LIMIT_FILE_COUNT':
              return next(new AppError('Too many files. Maximum is 1 file.', 400));
            case 'LIMIT_UNEXPECTED_FILE':
              return next(new AppError('Unexpected field name.', 400));
            default:
              return next(new AppError('File upload error.', 400));
          }
        }
        return next(err);
      }
      
      // Log successful upload
      if (req.file) {
        logger.info('File uploaded successfully', {
          filename: req.file.filename,
          originalname: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
          userId: req.user?.id
        });
      }
      
      next();
    });
  };
};

/**
 * Multiple photos upload
 */
const uploadMultiple = (fieldName = 'photos', maxCount = 10) => {
  return (req, res, next) => {
    const uploadMultipleFiles = upload.array(fieldName, maxCount);
    
    uploadMultipleFiles(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              return next(new AppError('One or more files are too large. Maximum size is 10MB per file.', 400));
            case 'LIMIT_FILE_COUNT':
              return next(new AppError(`Too many files. Maximum is ${maxCount} files.`, 400));
            case 'LIMIT_UNEXPECTED_FILE':
              return next(new AppError('Unexpected field name.', 400));
            default:
              return next(new AppError('File upload error.', 400));
          }
        }
        return next(err);
      }
      
      // Log successful uploads
      if (req.files && req.files.length > 0) {
        logger.info('Multiple files uploaded successfully', {
          fileCount: req.files.length,
          files: req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            size: file.size
          })),
          userId: req.user?.id
        });
      }
      
      next();
    });
  };
};

/**
 * Mixed upload fields (for forms with different file types)
 */
const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadFieldsMulter = upload.fields(fields);
    
    uploadFieldsMulter(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case 'LIMIT_FILE_SIZE':
              return next(new AppError('One or more files are too large. Maximum size is 10MB per file.', 400));
            case 'LIMIT_FILE_COUNT':
              return next(new AppError('Too many files uploaded.', 400));
            case 'LIMIT_UNEXPECTED_FILE':
              return next(new AppError('Unexpected field name.', 400));
            default:
              return next(new AppError('File upload error.', 400));
          }
        }
        return next(err);
      }
      
      // Log successful uploads
      if (req.files) {
        const totalFiles = Object.values(req.files).flat().length;
        logger.info('Mixed files uploaded successfully', {
          totalFiles,
          fields: Object.keys(req.files),
          userId: req.user?.id
        });
      }
      
      next();
    });
  };
};

/**
 * Photo processing middleware (placeholder for future image processing)
 */
const processPhotos = (req, res, next) => {
  // This is where you would add image processing logic:
  // - Resize images for different use cases (thumbnails, medium, large)
  // - Optimize images for web
  // - Generate different formats
  // - Extract EXIF data
  // - Validate image content
  
  // For now, just add metadata to files
  if (req.file) {
    req.file.processed = {
      uploadedAt: new Date(),
      category: req.body.category || 'general',
      uploadedBy: req.user?.id
    };
  }
  
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach(file => {
        file.processed = {
          uploadedAt: new Date(),
          category: req.body.category || 'general',
          uploadedBy: req.user?.id
        };
      });
    } else {
      Object.values(req.files).flat().forEach(file => {
        file.processed = {
          uploadedAt: new Date(),
          category: req.body.category || 'general',
          uploadedBy: req.user?.id
        };
      });
    }
  }
  
  next();
};

/**
 * Clean up temporary files on error
 */
const cleanupFiles = (req, res, next) => {
  const fs = require('fs').promises;
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to cleanup files on error
  res.end = async function(...args) {
    // If response status indicates error, cleanup uploaded files
    if (res.statusCode >= 400) {
      try {
        if (req.file) {
          await fs.unlink(req.file.path);
          logger.info('Cleaned up uploaded file due to error', { 
            filename: req.file.filename 
          });
        }
        
        if (req.files) {
          const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
          for (const file of files) {
            await fs.unlink(file.path);
          }
          logger.info('Cleaned up uploaded files due to error', { 
            fileCount: files.length 
          });
        }
      } catch (cleanupError) {
        logger.error('Error cleaning up uploaded files', { error: cleanupError.message });
      }
    }
    
    // Call original end function
    originalEnd.apply(this, args);
  };
  
  next();
};

// Specific upload configurations for different endpoints

/**
 * Trip photo upload configuration
 */
const uploadTripPhotos = [
  uploadMultiple('photos', 10),
  processPhotos,
  cleanupFiles
];

/**
 * Accommodation photo upload configuration
 */
const uploadAccommodationPhotos = [
  uploadMultiple('photos', 15),
  processPhotos,
  cleanupFiles
];

/**
 * Profile photo upload configuration
 */
const uploadProfilePhoto = [
  uploadSingle('avatar'),
  processPhotos,
  cleanupFiles
];

/**
 * Review photo upload configuration
 */
const uploadReviewPhotos = [
  uploadMultiple('photos', 5),
  processPhotos,
  cleanupFiles
];

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  processPhotos,
  cleanupFiles,
  uploadTripPhotos,
  uploadAccommodationPhotos,
  uploadProfilePhoto,
  uploadReviewPhotos
};