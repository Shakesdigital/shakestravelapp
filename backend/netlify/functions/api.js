const serverless = require('serverless-http');
require('dotenv').config();

// Initialize Express app with DynamoDB support
const express = require('express');
const compression = require('compression');
const cookieParser = require('cookie-parser');

const { initializeDynamoDB } = require('../../src/config/dynamodb');
const { setupSecurity, sanitizeInput } = require('../../src/middleware/security');
const { globalErrorHandler, notFoundHandler, catchAsync } = require('../../src/middleware/errorHandler');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'production';

// Track initialization
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return app;

  try {
    console.log('🚀 Initializing Shakes Travel API for Netlify...');

    // Connect to DynamoDB
    console.log('📊 Connecting to DynamoDB...');
    await initializeDynamoDB();
    console.log('✅ DynamoDB connected');

    // Setup security middleware
    setupSecurity(app);

    // Compression middleware
    app.use(compression({
      level: 6,
      threshold: 1024
    }));

    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Input sanitization
    app.use(sanitizeInput);

    // Health check endpoint
    app.get('/api/health', catchAsync(async (req, res) => {
      const { healthCheck: dynamoHealthCheck } = require('../../src/config/dynamodb');
      const dynamoHealth = await dynamoHealthCheck();

      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: '1.0.0',
        databases: {
          dynamodb: dynamoHealth.success ? 'connected' : 'disconnected',
          dynamodbError: dynamoHealth.success ? null : { message: dynamoHealth.error, code: dynamoHealth.code },
          mongodb: 'disabled'
        },
        envCheck: {
          hasDynamoRegion: !!process.env.DYNAMODB_REGION,
          hasAwsRegion: !!process.env.AWS_REGION,
          hasDynamoAccessKey: !!process.env.DYNAMODB_ACCESS_KEY_ID,
          hasAwsAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
          hasDynamoSecret: !!process.env.DYNAMODB_SECRET_ACCESS_KEY,
          hasAwsSecret: !!process.env.AWS_SECRET_ACCESS_KEY
        }
      });
    }));

    // API routes
    app.use('/api/auth', require('../../src/routes/auth'));
    app.use('/api/user-content', require('../../src/routes/userContentDynamoDB'));
    app.use('/api/admin/moderation', require('../../src/routes/adminModeration'));
    app.use('/api/public', require('../../src/routes/publicContentDynamoDB'));

    // 404 handler
    app.use('*', notFoundHandler);

    // Error handling
    app.use(globalErrorHandler);

    isInitialized = true;
    console.log('✅ App initialized successfully');

    return app;
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    throw error;
  }
}

// Initialize app (Netlify Functions handle async)
let appPromise = initializeApp();

// Configure for Netlify Functions
const handler = async (event, context) => {
  // Wait for app to be initialized
  const initializedApp = await appPromise;

  // Create serverless handler
  const serverlessHandler = serverless(initializedApp, {
    binary: ['image/*', 'application/pdf'],
    request: (request, ev, ctx) => {
      request.correlationId = ctx.awsRequestId || ctx.requestId;
      if (ev.headers && ev.headers['x-forwarded-for']) {
        request.ip = ev.headers['x-forwarded-for'].split(',')[0].trim();
      }
      return request;
    },
    response: (response, ev, ctx) => {
      if (!response.headers) response.headers = {};

      response.headers['Access-Control-Allow-Origin'] = process.env.CORS_ORIGIN || '*';
      response.headers['Access-Control-Allow-Credentials'] = 'true';
      response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
      response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, Cache-Control';
      response.headers['Access-Control-Max-Age'] = '86400';

      if (ev.httpMethod === 'OPTIONS') {
        response.statusCode = 200;
        response.body = '';
      }

      return response;
    }
  });

  return serverlessHandler(event, context);
};

exports.handler = handler;
