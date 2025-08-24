# Shakes Travel Backend API

A scalable Node.js/Express backend for the Shakes Travel adventure tourism booking platform, inspired by TripAdvisor's architecture patterns.

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 6.0
- **Redis** >= 7.0 (optional, for caching)

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   # Copy environment template
   cp .env .env.local
   
   # Edit environment variables
   nano .env.local
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   # Using MongoDB Community Server
   mongod --dbpath /data/db
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 🏗️ Architecture Overview

This backend follows TripAdvisor-like scalability patterns:

### **Core Technologies**
- **Express.js** - Web framework
- **MongoDB** - Document database with Mongoose ODM
- **JWT** - Authentication with refresh tokens
- **Redis** - Caching and session management
- **Winston** - Structured logging
- **Helmet** - Security middleware
- **Stripe** - Payment processing

### **Security Features**
- 🔒 **JWT Authentication** with refresh token rotation
- 🛡️ **Rate Limiting** (5 login attempts per 15 minutes)
- 🧹 **Input Sanitization** with express-mongo-sanitize
- 🔐 **XSS Protection** via Helmet CSP
- 🚫 **CORS** configured for frontend domains
- 📝 **Request Validation** using Joi schemas

### **Performance Features**
- ⚡ **Response Compression** (gzip)
- 📊 **Database Connection Pooling**
- 🚀 **Query Optimization** with indexes
- 📈 **Performance Monitoring** for slow queries
- 🔄 **Graceful Shutdown** handling

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Request handlers (coming soon)
│   ├── middleware/      # Custom middleware (security, auth, etc.)
│   ├── models/          # MongoDB models (coming soon)
│   ├── routes/          # API route definitions (coming soon)
│   ├── services/        # Business logic services (coming soon)
│   ├── utils/           # Utility functions and helpers
│   └── validators/      # Input validation schemas (coming soon)
├── scripts/             # Deployment and utility scripts
├── tests/               # Test suites
├── logs/                # Application logs (auto-generated)
├── server.js            # Main server entry point
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### **Environment Variables**

Create a `.env` file with the following variables:

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shakestravel

# Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Third-party Services
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### **Database Setup**

The application will automatically connect to MongoDB on startup. For local development:

```bash
# Start MongoDB locally
mongod --dbpath /data/db

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Available Scripts

```bash
# Development
npm run dev          # Start with nodemon (auto-reload)
npm start           # Start production server

# Testing
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues

# Database
npm run seed        # Seed database with sample data (coming soon)
```

## 📡 API Endpoints

### **Health & Status**

```bash
# Health check
GET /api/health
# Returns: Server health, database status, memory usage

# API status
GET /api/status
# Returns: Service information and available endpoints

# Welcome message
GET /api
# Returns: API welcome message and documentation links
```

### **Coming Soon**

```bash
# Authentication
POST /api/v1/auth/register    # User registration
POST /api/v1/auth/login       # User login
POST /api/v1/auth/refresh     # Refresh token
POST /api/v1/auth/logout      # User logout

# Users
GET  /api/v1/users/profile    # Get user profile
PUT  /api/v1/users/profile    # Update user profile

# Trips
GET  /api/v1/trips           # Search trips
GET  /api/v1/trips/:id       # Get trip details
POST /api/v1/trips           # Create trip (hosts only)

# Accommodations
GET  /api/v1/accommodations  # Search accommodations
GET  /api/v1/accommodations/:id # Get accommodation details

# Bookings
POST /api/v1/bookings        # Create booking
GET  /api/v1/bookings        # Get user bookings
PUT  /api/v1/bookings/:id    # Update booking
```

## 🛡️ Security Features

### **Rate Limiting**
- **Global**: 1000 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **Search**: 50 requests per minute
- **File Upload**: 20 uploads per hour

### **Input Validation**
- MongoDB injection prevention
- XSS protection with sanitization
- File type and size validation
- Request payload size limits

### **Headers Security**
- CORS configured for specific origins
- CSP (Content Security Policy) headers
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options, X-XSS-Protection

## 📊 Monitoring & Logging

### **Structured Logging**
- **Console**: Colored output for development
- **Files**: Rotating logs (app.log, error.log)
- **Request Logging**: All HTTP requests with timing
- **Business Events**: Bookings, payments, authentication

### **Health Monitoring**
- Database connection status
- Memory usage tracking
- Slow query detection (>1 second)
- Performance metrics collection

### **Log Files**
```bash
logs/
├── app.log          # General application logs
├── error.log        # Error logs only
├── exceptions.log   # Uncaught exceptions
└── rejections.log   # Unhandled promise rejections
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- auth.test.js
```

## 🚀 Deployment

### **Production Checklist**

1. **Environment Variables**:
   - Set `NODE_ENV=production`
   - Use strong JWT secrets (32+ characters)
   - Configure production database URI
   - Set up email service credentials

2. **Security**:
   - Enable HTTPS/TLS
   - Configure firewall rules
   - Set up reverse proxy (Nginx)
   - Enable rate limiting

3. **Monitoring**:
   - Set up log aggregation
   - Configure health checks
   - Enable performance monitoring
   - Set up alerting

### **Docker Deployment**

```bash
# Build Docker image
docker build -t shakes-travel-backend .

# Run container
docker run -p 5000:5000 --env-file .env shakes-travel-backend
```

### **Process Management**

```bash
# Using PM2 for production
npm install -g pm2
pm2 start server.js --name shakes-travel-api
pm2 monit
```

## 🤝 Development Guidelines

### **Code Style**
- Use ESLint and Prettier for consistent formatting
- Follow RESTful API conventions
- Write descriptive commit messages
- Add JSDoc comments for functions

### **Error Handling**
- Use custom error classes
- Provide meaningful error messages
- Log errors with context
- Return consistent error responses

### **Performance**
- Optimize database queries
- Use indexes appropriately
- Implement caching strategies
- Monitor performance metrics

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose ODM Guide](https://mongoosejs.com/)
- [JWT.io](https://jwt.io/)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/production-notes/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🆘 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Failed**:
   ```bash
   # Check if MongoDB is running
   mongosh
   
   # Verify connection string
   echo $MONGODB_URI
   ```

2. **Port Already in Use**:
   ```bash
   # Find process using port 5000
   lsof -i :5000
   
   # Kill process
   kill -9 <PID>
   ```

3. **Environment Variables Not Loading**:
   ```bash
   # Check .env file exists
   ls -la .env
   
   # Verify file format (no spaces around =)
   cat .env
   ```

### **Debugging**

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
tail -f logs/app.log

# Monitor database queries
DEBUG=mongoose:* npm run dev
```

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs in `logs/` directory
- Verify environment configuration

---

**Built with ❤️ for Uganda's adventure tourism industry**