const serverless = require('serverless-http');
const app = require('../server').getApp(); // Get Express app from server.js

// Wrap Express app for Lambda
const handler = serverless(app, {
  // Request/response transformations for API Gateway
  request: (request, event, context) => {
    // Add correlation ID for logging
    request.correlationId = context.awsRequestId;
    
    // Handle base64 encoded body
    if (event.isBase64Encoded && event.body) {
      request.body = Buffer.from(event.body, 'base64').toString();
    }
  },
  response: (response, event, context) => {
    // Add CORS headers for API Gateway
    if (!response.headers) response.headers = {};
    
    response.headers['Access-Control-Allow-Origin'] = process.env.CORS_ORIGIN || 'https://shakestravelapp.netlify.app';
    response.headers['Access-Control-Allow-Credentials'] = 'true';
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';
    
    return response;
  }
});

module.exports.handler = handler;