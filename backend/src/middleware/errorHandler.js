const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

// Error handling for different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400, 'INVALID_ID');
};

const handleDuplicateFieldsDB = (err) => {
  const duplicateField = Object.keys(err.keyValue)[0];
  const duplicateValue = err.keyValue[duplicateField];
  const message = `${duplicateField} '${duplicateValue}' already exists`;
  return new ConflictError(message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));
  
  const message = 'Invalid input data';
  const validationError = new ValidationError(message, errors);
  return validationError;
};

const handleJWTError = () => 
  new AuthenticationError('Invalid token. Please log in again');

const handleJWTExpiredError = () => 
  new AuthenticationError('Your token has expired. Please log in again');

const handleMongooseError = (err) => {
  if (err.name === 'CastError') return handleCastErrorDB(err);
  if (err.code === 11000) return handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') return handleValidationErrorDB(err);
  return err;
};

// Send error response in development
const sendErrorDev = (err, req, res) => {
  logger.error('Error in development:', {
    error: err,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      errors: err.errors,
      stack: err.stack,
      requestId: req.requestId
    },
    timestamp: new Date().toISOString()
  });
};

// Send error response in production
const sendErrorProd = (err, req, res) => {
  // Log error details for monitoring
  logger.error('Production error:', {
    message: err.message,
    statusCode: err.statusCode,
    code: err.code,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.requestId,
    userId: req.user?.id,
    // Don't log full stack trace in production
    stack: err.isOperational ? undefined : err.stack
  });

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const response = {
      success: false,
      error: {
        message: err.message,
        code: err.code,
        requestId: req.requestId
      },
      timestamp: new Date().toISOString()
    };

    // Include validation errors if present
    if (err.errors && Array.isArray(err.errors)) {
      response.error.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
  } else {
    // Programming or other unknown error: don't leak error details
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong on our end. Please try again later.',
        code: 'INTERNAL_SERVER_ERROR',
        requestId: req.requestId
      },
      timestamp: new Date().toISOString()
    });
  }
};

// Main error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different types of errors
  let error = { ...err };
  error.message = err.message;

  // Handle Mongoose errors
  error = handleMongooseError(error);

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Handle Multer errors (file upload)
  if (error.code === 'LIMIT_FILE_SIZE') {
    error = new AppError('File too large', 413, 'FILE_TOO_LARGE');
  }
  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new AppError('Too many files uploaded', 400, 'TOO_MANY_FILES');
  }

  // Handle Stripe errors
  if (error.type && error.type.startsWith('Stripe')) {
    error = new AppError('Payment processing error', 400, 'PAYMENT_ERROR');
  }

  // Send appropriate error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

// 404 handler for undefined routes
const notFoundHandler = (req, res, next) => {
  const err = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(err);
};

// Async error wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Unhandled promise rejection handler
process.on('unhandledRejection', (err, promise) => {
  logger.error('Unhandled Promise Rejection:', err);
  
  // Close server gracefully
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = {
  globalErrorHandler,
  notFoundHandler,
  catchAsync,
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
};