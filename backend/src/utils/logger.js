const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Enhanced log format with correlation IDs and structured metadata
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack, correlationId, traceId, ...meta }) => {
    // Build structured log entry
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      service: 'shakes-travel-api',
      environment: process.env.NODE_ENV || 'development',
      hostname: os.hostname(),
      pid: process.pid
    };
    
    // Add correlation and trace IDs for request tracking
    if (correlationId) logEntry.correlationId = correlationId;
    if (traceId) logEntry.traceId = traceId;
    
    // Add metadata
    if (Object.keys(meta).length > 0) {
      logEntry.metadata = meta;
    }
    
    // Add stack trace for errors
    if (stack) {
      logEntry.stack = stack;
    }
    
    return JSON.stringify(logEntry);
  })
);

// Console format for development (more readable)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ level, message, timestamp, correlationId, ...meta }) => {
    let log = `${timestamp} ${level}: ${message}`;
    
    if (correlationId) {
      log += ` [${correlationId.substring(0, 8)}]`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: 'shakes-travel-api',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Console transport with enhanced formatting
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production' ? logFormat : consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
      handleExceptions: false
    }),

    // Daily rotating file transport for all logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '100m', // 100MB per file
      maxFiles: '30d', // Keep logs for 30 days
      format: logFormat,
      auditFile: path.join(logsDir, 'audit.json'),
      zippedArchive: true
    }),

    // Daily rotating file transport for error logs
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '100m',
      maxFiles: '60d', // Keep error logs longer
      format: logFormat,
      auditFile: path.join(logsDir, 'error-audit.json'),
      zippedArchive: true
    }),

    // Daily rotating file for security events
    new DailyRotateFile({
      filename: path.join(logsDir, 'security-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxSize: '50m',
      maxFiles: '90d', // Keep security logs for 90 days
      format: logFormat,
      auditFile: path.join(logsDir, 'security-audit.json'),
      zippedArchive: true
    }),

    // Daily rotating file for business events
    new DailyRotateFile({
      filename: path.join(logsDir, 'business-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '50m',
      maxFiles: '365d', // Keep business logs for 1 year
      format: logFormat,
      auditFile: path.join(logsDir, 'business-audit.json'),
      zippedArchive: true
    }),

    // Daily rotating file for performance monitoring
    new DailyRotateFile({
      filename: path.join(logsDir, 'performance-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'warn',
      maxSize: '20m',
      maxFiles: '7d', // Keep performance logs for 7 days
      format: logFormat,
      auditFile: path.join(logsDir, 'performance-audit.json'),
      zippedArchive: true
    })
  ],

  // Handle uncaught exceptions with daily rotation
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
      format: logFormat,
      zippedArchive: true
    })
  ],

  // Handle unhandled promise rejections with daily rotation
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
      format: logFormat,
      zippedArchive: true
    })
  ]
});

// Enhanced request logging middleware with correlation tracking
const requestLogger = (req, res, next) => {
  const start = process.hrtime.bigint();
  
  // Generate correlation ID if not present
  if (!req.correlationId) {
    req.correlationId = crypto.randomBytes(16).toString('hex');
  }
  
  // Generate trace ID for distributed tracing
  req.traceId = crypto.randomBytes(8).toString('hex');
  
  // Add correlation ID to response headers
  res.set('X-Correlation-ID', req.correlationId);
  res.set('X-Trace-ID', req.traceId);
  
  // Enhanced request logging
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    acceptLanguage: req.get('Accept-Language'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    correlationId: req.correlationId,
    traceId: req.traceId,
    requestId: req.requestId,
    userId: req.user?.id,
    userRole: req.user?.role,
    sessionId: req.sessionId,
    queryParams: Object.keys(req.query).length > 0 ? req.query : undefined,
    timestamp: new Date().toISOString(),
    type: 'http_request_start'
  });

  // Enhanced response logging
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    const logLevel = res.statusCode >= 500 ? 'error' : 
                    res.statusCode >= 400 ? 'warn' : 
                    duration > 1000 ? 'warn' : 'info';
    
    logger.log(logLevel, 'Request completed', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: `${duration.toFixed(2)}ms`,
      contentLength: res.get('Content-Length'),
      ip: req.ip,
      correlationId: req.correlationId,
      traceId: req.traceId,
      requestId: req.requestId,
      userId: req.user?.id,
      userRole: req.user?.role,
      timestamp: new Date().toISOString(),
      type: 'http_request_complete',
      performanceCategory: duration > 5000 ? 'very_slow' :
                          duration > 2000 ? 'slow' :
                          duration > 1000 ? 'moderate' : 'fast'
    });
    
    // Log to performance logger if slow
    if (duration > 1000) {
      performanceLogger.slowEndpoint(req.method, req.originalUrl, duration, req.user?.id, req.correlationId);
    }
  });

  next();
};

// Correlation ID middleware
const correlationMiddleware = (req, res, next) => {
  // Get correlation ID from headers or generate new one
  req.correlationId = req.get('X-Correlation-ID') || 
                     req.get('X-Request-ID') || 
                     crypto.randomBytes(16).toString('hex');
  
  // Add to all subsequent logs
  req.logger = logger.child({ 
    correlationId: req.correlationId,
    requestId: req.requestId
  });
  
  next();
};

// Enhanced database operation logger
const dbLogger = {
  query: (operation, collection, query = {}, duration = null, correlationId = null) => {
    const logData = {
      operation,
      collection,
      querySize: JSON.stringify(query).length,
      duration: duration ? `${duration}ms` : null,
      timestamp: new Date().toISOString(),
      type: 'database_operation',
      correlationId
    };
    
    // Only log query details in debug mode to avoid sensitive data exposure
    if (process.env.LOG_LEVEL === 'debug') {
      logData.query = JSON.stringify(query);
    }
    
    // Log slow queries as warnings
    if (duration && duration > 1000) {
      logger.warn('Slow database query', logData);
    } else {
      logger.debug('Database operation', logData);
    }
  },

  error: (operation, collection, error, correlationId = null) => {
    logger.error('Database error', {
      operation,
      collection,
      error: error.message,
      errorCode: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      type: 'database_error',
      correlationId
    });
  },

  connection: {
    established: (connectionString) => {
      logger.info('Database connection established', {
        connectionString: connectionString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Mask credentials
        timestamp: new Date().toISOString(),
        type: 'database_connection_established'
      });
    },
    
    lost: (error) => {
      logger.error('Database connection lost', {
        error: error.message,
        timestamp: new Date().toISOString(),
        type: 'database_connection_lost'
      });
    },
    
    restored: () => {
      logger.info('Database connection restored', {
        timestamp: new Date().toISOString(),
        type: 'database_connection_restored'
      });
    }
  }
};

// Enhanced business logic logger with detailed tracking
const businessLogger = {
  booking: {
    created: (bookingId, userId, amount, currency, itemType, itemId, correlationId = null) => {
      logger.info('Booking created', {
        bookingId,
        userId,
        amount,
        currency,
        itemType,
        itemId,
        timestamp: new Date().toISOString(),
        type: 'booking_created',
        category: 'business_event',
        correlationId
      });
    },
    
    cancelled: (bookingId, userId, reason, refundAmount = null, correlationId = null) => {
      logger.info('Booking cancelled', {
        bookingId,
        userId,
        reason,
        refundAmount,
        timestamp: new Date().toISOString(),
        type: 'booking_cancelled',
        category: 'business_event',
        correlationId
      });
    },
    
    confirmed: (bookingId, userId, amount, correlationId = null) => {
      logger.info('Booking confirmed', {
        bookingId,
        userId,
        amount,
        timestamp: new Date().toISOString(),
        type: 'booking_confirmed',
        category: 'business_event',
        correlationId
      });
    },
    
    modified: (bookingId, userId, changes, correlationId = null) => {
      logger.info('Booking modified', {
        bookingId,
        userId,
        changes,
        timestamp: new Date().toISOString(),
        type: 'booking_modified',
        category: 'business_event',
        correlationId
      });
    }
  },

  payment: {
    initiated: (paymentId, bookingId, amount, currency, method, correlationId = null) => {
      logger.info('Payment initiated', {
        paymentId,
        bookingId,
        amount,
        currency,
        method,
        timestamp: new Date().toISOString(),
        type: 'payment_initiated',
        category: 'business_event',
        correlationId
      });
    },
    
    succeeded: (paymentId, bookingId, amount, currency, method, correlationId = null) => {
      logger.info('Payment succeeded', {
        paymentId,
        bookingId,
        amount,
        currency,
        method,
        timestamp: new Date().toISOString(),
        type: 'payment_succeeded',
        category: 'business_event',
        correlationId
      });
    },
    
    failed: (paymentId, bookingId, reason, amount, method, correlationId = null) => {
      logger.warn('Payment failed', {
        paymentId,
        bookingId,
        reason,
        amount,
        method,
        timestamp: new Date().toISOString(),
        type: 'payment_failed',
        category: 'business_event',
        correlationId
      });
    },
    
    refunded: (paymentId, bookingId, refundAmount, reason, correlationId = null) => {
      logger.info('Payment refunded', {
        paymentId,
        bookingId,
        refundAmount,
        reason,
        timestamp: new Date().toISOString(),
        type: 'payment_refunded',
        category: 'business_event',
        correlationId
      });
    }
  },

  auth: {
    login: (userId, email, ip, userAgent, correlationId = null) => {
      logger.info('User login', {
        userId,
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Mask email
        ip,
        userAgent,
        timestamp: new Date().toISOString(),
        type: 'user_login',
        category: 'auth_event',
        correlationId
      });
    },
    
    loginFailed: (email, ip, reason, userAgent, correlationId = null) => {
      logger.warn('Login failed', {
        email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
        ip,
        reason,
        userAgent,
        timestamp: new Date().toISOString(),
        type: 'login_failed',
        category: 'auth_event',
        correlationId
      });
    },
    
    logout: (userId, ip, sessionDuration = null, correlationId = null) => {
      logger.info('User logout', {
        userId,
        ip,
        sessionDuration,
        timestamp: new Date().toISOString(),
        type: 'user_logout',
        category: 'auth_event',
        correlationId
      });
    },
    
    tokenRefresh: (userId, ip, correlationId = null) => {
      logger.info('Token refreshed', {
        userId,
        ip,
        timestamp: new Date().toISOString(),
        type: 'token_refresh',
        category: 'auth_event',
        correlationId
      });
    },
    
    passwordChanged: (userId, ip, correlationId = null) => {
      logger.info('Password changed', {
        userId,
        ip,
        timestamp: new Date().toISOString(),
        type: 'password_changed',
        category: 'auth_event',
        correlationId
      });
    }
  },

  security: {
    rateLimitExceeded: (ip, endpoint, userAgent, userId = null, correlationId = null) => {
      logger.warn('Rate limit exceeded', {
        ip,
        endpoint,
        userAgent,
        userId,
        timestamp: new Date().toISOString(),
        type: 'rate_limit_exceeded',
        category: 'security_event',
        correlationId
      });
    },
    
    suspiciousActivity: (userId, ip, activity, details, correlationId = null) => {
      logger.warn('Suspicious activity detected', {
        userId,
        ip,
        activity,
        details,
        timestamp: new Date().toISOString(),
        type: 'suspicious_activity',
        category: 'security_event',
        correlationId
      });
    },
    
    unauthorizedAccess: (ip, endpoint, userAgent, userId = null, correlationId = null) => {
      logger.warn('Unauthorized access attempt', {
        ip,
        endpoint,
        userAgent,
        userId,
        timestamp: new Date().toISOString(),
        type: 'unauthorized_access',
        category: 'security_event',
        correlationId
      });
    },
    
    dataExport: (userId, dataType, recordCount, correlationId = null) => {
      logger.info('Data export requested', {
        userId,
        dataType,
        recordCount,
        timestamp: new Date().toISOString(),
        type: 'data_export',
        category: 'security_event',
        correlationId
      });
    },
    
    adminAction: (adminUserId, action, targetUserId, details, correlationId = null) => {
      logger.info('Admin action performed', {
        adminUserId,
        action,
        targetUserId,
        details,
        timestamp: new Date().toISOString(),
        type: 'admin_action',
        category: 'security_event',
        correlationId
      });
    }
  },

  ugc: {
    reviewSubmitted: (reviewId, userId, itemType, itemId, rating, correlationId = null) => {
      logger.info('Review submitted', {
        reviewId,
        userId,
        itemType,
        itemId,
        rating,
        timestamp: new Date().toISOString(),
        type: 'review_submitted',
        category: 'ugc_event',
        correlationId
      });
    },
    
    reviewModerated: (reviewId, moderatorId, action, reason, correlationId = null) => {
      logger.info('Review moderated', {
        reviewId,
        moderatorId,
        action,
        reason,
        timestamp: new Date().toISOString(),
        type: 'review_moderated',
        category: 'ugc_event',
        correlationId
      });
    },
    
    contentFlagged: (contentType, contentId, userId, reason, correlationId = null) => {
      logger.warn('Content flagged', {
        contentType,
        contentId,
        userId,
        reason,
        timestamp: new Date().toISOString(),
        type: 'content_flagged',
        category: 'ugc_event',
        correlationId
      });
    }
  },

  system: {
    healthCheck: (status, responseTime, memoryUsage) => {
      logger.info('Health check', {
        status,
        responseTime,
        memoryUsage,
        timestamp: new Date().toISOString(),
        type: 'health_check',
        category: 'system_event'
      });
    },
    
    maintenance: (action, description, duration = null) => {
      logger.info('Maintenance event', {
        action,
        description,
        duration,
        timestamp: new Date().toISOString(),
        type: 'maintenance',
        category: 'system_event'
      });
    }
  }
};

// Enhanced performance monitoring with detailed metrics
const performanceLogger = {
  slowQuery: (operation, duration, collection, querySize = null, correlationId = null) => {
    logger.warn('Slow database query detected', {
      operation,
      collection,
      duration: `${duration}ms`,
      querySize,
      threshold: '1000ms',
      timestamp: new Date().toISOString(),
      type: 'slow_query',
      category: 'performance_event',
      correlationId
    });
  },
  
  slowEndpoint: (method, url, duration, userId = null, correlationId = null) => {
    logger.warn('Slow API endpoint detected', {
      method,
      url,
      duration: `${duration}ms`,
      userId,
      threshold: '1000ms',
      severity: duration > 5000 ? 'critical' : duration > 2000 ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
      type: 'slow_endpoint',
      category: 'performance_event',
      correlationId
    });
  },
  
  highMemoryUsage: (usage, threshold, processId = null) => {
    logger.warn('High memory usage detected', {
      usage: `${Math.round(usage / 1024 / 1024)}MB`,
      threshold: `${Math.round(threshold / 1024 / 1024)}MB`,
      processId: processId || process.pid,
      timestamp: new Date().toISOString(),
      type: 'high_memory_usage',
      category: 'performance_event'
    });
  },
  
  highCpuUsage: (usage, threshold) => {
    logger.warn('High CPU usage detected', {
      usage: `${usage}%`,
      threshold: `${threshold}%`,
      processId: process.pid,
      timestamp: new Date().toISOString(),
      type: 'high_cpu_usage',
      category: 'performance_event'
    });
  },
  
  requestQueue: (queueLength, threshold) => {
    logger.warn('High request queue detected', {
      queueLength,
      threshold,
      timestamp: new Date().toISOString(),
      type: 'high_request_queue',
      category: 'performance_event'
    });
  },
  
  dbConnectionPool: (activeConnections, maxConnections, waitingRequests = 0) => {
    const utilizationPercent = (activeConnections / maxConnections) * 100;
    
    if (utilizationPercent > 80) {
      logger.warn('High database connection pool utilization', {
        activeConnections,
        maxConnections,
        utilizationPercent: `${utilizationPercent.toFixed(2)}%`,
        waitingRequests,
        timestamp: new Date().toISOString(),
        type: 'high_db_pool_utilization',
        category: 'performance_event'
      });
    }
  }
};

// Error tracking logger
const errorLogger = {
  applicationError: (error, context = {}, correlationId = null) => {
    logger.error('Application error', {
      error: error.message,
      errorName: error.name,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      type: 'application_error',
      category: 'error_event',
      correlationId
    });
  },
  
  validationError: (field, value, message, correlationId = null) => {
    logger.warn('Validation error', {
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : value,
      message,
      timestamp: new Date().toISOString(),
      type: 'validation_error',
      category: 'error_event',
      correlationId
    });
  },
  
  externalApiError: (service, endpoint, statusCode, message, correlationId = null) => {
    logger.error('External API error', {
      service,
      endpoint,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      type: 'external_api_error',
      category: 'error_event',
      correlationId
    });
  }
};

// Log aggregation and monitoring setup
if (process.env.NODE_ENV === 'production') {
  // Setup log rotation monitoring
  const dailyRotateTransports = logger.transports.filter(t => t instanceof DailyRotateFile);
  
  dailyRotateTransports.forEach(transport => {
    transport.on('rotate', (oldFilename, newFilename) => {
      logger.info('Log file rotated', {
        oldFilename,
        newFilename,
        timestamp: new Date().toISOString(),
        type: 'log_rotation'
      });
    });
    
    transport.on('archive', (zipFilename) => {
      logger.info('Log file archived', {
        zipFilename,
        timestamp: new Date().toISOString(),
        type: 'log_archive'
      });
    });
  });
}

// Memory monitoring
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    const threshold = 500 * 1024 * 1024; // 500MB threshold
    
    if (memUsage.heapUsed > threshold) {
      performanceLogger.highMemoryUsage(memUsage.heapUsed, threshold);
    }
  }, 30000); // Check every 30 seconds
}

module.exports = {
  logger,
  requestLogger,
  correlationMiddleware,
  dbLogger,
  businessLogger,
  performanceLogger,
  errorLogger
};