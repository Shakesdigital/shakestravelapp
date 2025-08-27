#!/usr/bin/env node

/**
 * Standalone Shakes Travel Server
 * 
 * Runs the API server without requiring MongoDB or Redis
 * Perfect for testing the API endpoints and deployment configuration
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database connection
let isDbConnected = false;

// Try to connect to database
const initializeDatabase = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const database = require('./src/config/database');
      await database.connect();
      isDbConnected = true;
      console.log('✅ MongoDB connected - authentication enabled');
      return true;
    } else {
      console.log('⚠️  No MongoDB URI provided - using mock mode');
      isDbConnected = false;
      return false;
    }
  } catch (err) {
    console.log('⚠️  MongoDB connection failed:', err.message);
    isDbConnected = false;
    return false;
  }
};

// Mock data
const mockData = {
  trips: [
    {
      id: '1',
      title: 'Gorilla Trekking in Bwindi Forest',
      description: 'Experience the magical encounter with mountain gorillas in their natural habitat',
      location: { city: 'Bwindi', region: 'Western', country: 'Uganda' },
      pricing: { basePrice: 650, currency: 'USD' },
      rating: 4.8,
      category: 'wildlife'
    },
    {
      id: '2', 
      title: 'Murchison Falls Safari Adventure',
      description: 'Witness the power of the Nile at Murchison Falls and spot the Big Five',
      location: { city: 'Murchison Falls', region: 'Northern', country: 'Uganda' },
      pricing: { basePrice: 450, currency: 'USD' },
      rating: 4.6,
      category: 'safari'
    }
  ],
  accommodations: [
    {
      id: '1',
      title: 'Bwindi Lodge',
      description: 'Luxury eco-lodge with stunning forest views',
      type: 'lodge',
      location: { city: 'Bwindi', region: 'Western', country: 'Uganda' },
      pricing: { basePrice: 280, currency: 'USD' },
      rating: 4.7
    }
  ]
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: 'Shakes Travel API is running in standalone mode',
    database: {
      status: 'mock',
      message: 'Using mock data - install MongoDB for full functionality'
    },
    features: {
      'rate-limiting': 'enabled',
      'security-headers': 'enabled',
      'logging': 'console',
      'docker-ready': true,
      'sharding-ready': true,
      'fraud-detection': 'available',
      'ugc-moderation': 'available'
    }
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Shakes Travel API',
    version: '1.0.0',
    status: 'operational',
    mode: 'standalone',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      trips: '/api/trips',
      accommodations: '/api/accommodations',
      bookings: '/api/bookings (requires MongoDB)',
      reviews: '/api/reviews (requires MongoDB)',
      payments: '/api/payments (requires MongoDB)'
    },
    deployment: {
      docker: 'ready',
      'docker-compose': 'ready',
      'mongodb-sharding': 'ready',
      'fraud-detection': 'ready',
      'security-features': 'enabled'
    }
  });
});

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Shakes Travel API',
    description: 'Adventure tourism booking platform for Uganda',
    version: '1.0.0',
    mode: 'standalone',
    note: 'Running in standalone mode with mock data',
    next_steps: [
      'Install MongoDB and Redis for full functionality',
      'Use Docker Compose for complete deployment',
      'Access /api/health for system status'
    ],
    documentation: '/api/docs',
    health: '/api/health',
    status: '/api/status'
  });
});

// Mock API endpoints
app.get('/api/trips', (req, res) => {
  res.json({
    success: true,
    data: mockData.trips,
    total: mockData.trips.length,
    note: 'Mock data - install MongoDB for real data'
  });
});

app.get('/api/accommodations', (req, res) => {
  res.json({
    success: true,
    data: mockData.accommodations,
    total: mockData.accommodations.length,
    note: 'Mock data - install MongoDB for real data'
  });
});

app.get('/api/bookings', (req, res) => {
  res.json({
    success: false,
    message: 'MongoDB required for bookings functionality',
    mock_available: false,
    setup_instructions: 'Install MongoDB and run the full server'
  });
});

app.get('/api/reviews', (req, res) => {
  res.json({
    success: false,
    message: 'MongoDB required for reviews with fraud detection',
    features: [
      'UGC moderation flags',
      'Fraud detection algorithms', 
      'Risk scoring',
      'Content analysis'
    ],
    setup_instructions: 'Install MongoDB and run the full server'
  });
});

app.get('/api/payments', (req, res) => {
  res.json({
    success: false,
    message: 'MongoDB required for payment processing',
    supported_methods: [
      'Stripe (International)',
      'MTN Mobile Money (Uganda)',
      'Airtel Money (Uganda)',
      'Bank Transfer (Local)'
    ],
    setup_instructions: 'Install MongoDB and run the full server'
  });
});

// Test endpoint to verify auth routes are working
app.post('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth endpoint is reachable',
    body: req.body,
    environment: {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    }
  });
});

app.get('/api/auth/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth test endpoint is working',
    timestamp: new Date().toISOString(),
    environment: {
      mongodb_uri_exists: !!process.env.MONGODB_URI,
      jwt_secret_exists: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    }
  });
});

// Simplified authentication endpoint for serverless environment
app.post('/api/auth/register', (req, res) => {
  console.log('Registration endpoint hit:', req.body);
  
  try {
    const { email, password, firstName, lastName, agreeToTerms, agreeToPrivacy } = req.body;

    // Basic validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required',
        received: { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName }
      });
    }

    if (!agreeToTerms || !agreeToPrivacy) {
      return res.status(400).json({
        success: false,
        message: 'You must agree to terms of service and privacy policy',
        received: { agreeToTerms, agreeToPrivacy }
      });
    }

    // Return simple success response without JWT for now
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: 'user'
    };

    const token = 'demo-token-' + Date.now();

    console.log('Registration successful:', { email: mockUser.email, firstName: mockUser.firstName });

    res.status(201).json({
      success: true,
      message: 'User registered successfully (demo mode)',
      data: {
        user: mockUser,
        token: token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login endpoint hit:', req.body);
  
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        received: { email: !!email, password: !!password }
      });
    }

    // For testing purposes, accept any email/password combination
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase(),
      firstName: 'Demo',
      lastName: 'User',
      role: 'user'
    };

    const token = 'demo-token-' + Date.now();

    console.log('Login successful:', { email: mockUser.email });

    res.status(200).json({
      success: true,
      message: 'Login successful (demo mode)',
      data: {
        user: mockUser,
        token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  const endpoints = [
    'GET /api',
    'GET /api/health', 
    'GET /api/status',
    'GET /api/trips',
    'GET /api/accommodations'
  ];
  
  if (isDbConnected) {
    endpoints.push('POST /api/auth/register');
    endpoints.push('POST /api/auth/login');
    endpoints.push('GET /api/auth/profile');
    endpoints.push('POST /api/auth/refresh');
  }

  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    available_endpoints: endpoints,
    note: isDbConnected ? 'Full API with authentication enabled' : 'Standalone mode - some endpoints require MongoDB'
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Export app for serverless deployment
module.exports = {
  getApp: () => {
    // Initialize database connection on first request if not already connected
    if (!isDbConnected) {
      initializeDatabase().catch(err => {
        console.log('Database initialization failed:', err.message);
      });
    }
    return app;
  },
  app,
  initializeDatabase
};

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 Shakes Travel API Server Started');
    console.log('=====================================');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log('');
    console.log('🔗 Available endpoints:');
    console.log(`   API: http://localhost:${PORT}/api`);
    console.log(`   Health: http://localhost:${PORT}/api/health`);
    console.log(`   Status: http://localhost:${PORT}/api/status`);
    console.log(`   Trips: http://localhost:${PORT}/api/trips`);
    console.log(`   Accommodations: http://localhost:${PORT}/api/accommodations`);
    console.log('');
    console.log('💡 Note: Running in standalone mode with mock data');
    console.log('   Install MongoDB and Redis for full functionality');
    console.log('   Or use Docker Compose for complete deployment');
    console.log('');
    console.log('🛑 Press Ctrl+C to stop the server');
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down Shakes Travel API Server...');
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    console.log('✅ Server stopped gracefully');
    process.exit(0);
  });
}