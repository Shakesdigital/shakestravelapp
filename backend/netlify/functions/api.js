const serverless = require('serverless-http');

// Load the main server with DynamoDB support
let app;
try {
  const server = require('../../server');
  app = server.getApp();
} catch (error) {
  console.error('Failed to load main server:', error);
  // Fallback to standalone if main server fails
  try {
    app = require('../../server-standalone').getApp();
  } catch (fallbackError) {
    console.error('Failed to load server-standalone:', fallbackError);
    // Final fallback - simple Express app
    const express = require('express');
    app = express();

    app.get('*', (req, res) => {
      res.json({
        error: 'Server initialization failed',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    });
  }
}

// Configure for Netlify Functions
const handler = serverless(app, {
  // Handle binary media types
  binary: ['image/*', 'application/pdf'],
  // Request/response transformations
  request: (request, event, context) => {
    // Add correlation ID for logging
    request.correlationId = context.awsRequestId || context.requestId;
    
    // Handle Netlify-specific headers
    if (event.headers && event.headers['x-forwarded-for']) {
      request.ip = event.headers['x-forwarded-for'].split(',')[0].trim();
    }
    
    return request;
  },
  response: (response, event, context) => {
    // Add CORS headers
    if (!response.headers) response.headers = {};
    
    response.headers['Access-Control-Allow-Origin'] = process.env.CORS_ORIGIN || '*';
    response.headers['Access-Control-Allow-Credentials'] = 'true';
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, Cache-Control';
    response.headers['Access-Control-Max-Age'] = '86400';
    
    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
      response.statusCode = 200;
      response.body = '';
    }
    
    return response;
  }
});

exports.handler = handler;