# Shakes Travel Backend API Documentation

## 🌍 Overview

A comprehensive Node.js/Express backend API for the Shakes Travel adventure tourism platform. This API provides secure, scalable endpoints for managing trips, accommodations, bookings, payments, and user authentication for Uganda travel experiences.

## 🚀 Features

- **RESTful API Design** - Clean, intuitive endpoints following REST principles
- **MongoDB Integration** - Scalable NoSQL database with Mongoose ODM
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **Advanced Security** - Rate limiting, CORS, input sanitization, and HTTPS
- **File Upload Support** - Cloudinary integration for image management
- **Payment Processing** - Stripe integration for secure transactions
- **Real-time Features** - WebSocket support for live updates
- **Comprehensive Logging** - Winston-based logging with multiple transports
- **Health Monitoring** - Built-in health checks and performance monitoring
- **Error Handling** - Global error handling with detailed responses

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/refresh` - Refresh access token

### Trips & Experiences
- `GET /api/trips` - Get all trips
- `POST /api/trips` - Create new trip (Admin)
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip (Admin)
- `DELETE /api/trips/:id` - Delete trip (Admin)
- `GET /api/trips/:id/recommendations` - Get recommended trips

### Accommodations
- `GET /api/accommodations` - Get all accommodations
- `POST /api/accommodations` - Create accommodation (Admin)
- `GET /api/accommodations/:id` - Get accommodation details
- `PUT /api/accommodations/:id` - Update accommodation (Admin)
- `DELETE /api/accommodations/:id` - Delete accommodation (Admin)

### Bookings
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews` - Get reviews by item
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/helpful` - Mark review as helpful

### Search
- `GET /api/search` - General search
- `GET /api/search/general` - Autocomplete suggestions
- `GET /api/search/trips` - Search trips
- `GET /api/search/accommodations` - Search accommodations
- `GET /api/search/suggestions` - Search suggestions

### Payments
- `POST /api/payments/process` - Process payment
- `GET /api/payments/methods` - Get payment methods
- `POST /api/payments/create-intent` - Create payment intent

### File Uploads
- `POST /api/uploads/trip-photos` - Upload trip photos
- `POST /api/uploads/accommodation-photos` - Upload accommodation photos
- `POST /api/uploads/profile-photo` - Upload profile photo

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/wishlist` - Add to wishlist
- `DELETE /api/users/wishlist/:id` - Remove from wishlist

### System
- `GET /api/health` - Health check endpoint
- `GET /api/status` - API status
- `GET /api` - API welcome message

## 🔒 Security Features

- **HTTPS Only** - All production traffic encrypted
- **CORS Protection** - Configurable cross-origin resource sharing
- **Rate Limiting** - Protect against abuse and DDoS
- **Input Sanitization** - Prevent XSS and injection attacks
- **JWT Authentication** - Secure token-based authentication
- **Helmet.js** - Security headers and protections
- **bcrypt** - Secure password hashing
- **Request Validation** - Input validation using Joi

## 🗄 Database Schema

### Core Entities

1. **Users** - Authentication and profile management
2. **Trips** - Adventure experiences and tours
3. **Accommodations** - Hotels, lodges, and stays
4. **Bookings** - Trip and accommodation reservations
5. **Reviews** - User feedback and ratings
6. **Payments** - Transaction records

## 🚀 Deployment URLs

- **Production API**: `https://shakes-travel-backend.onrender.com`
- **Health Check**: `https://shakes-travel-backend.onrender.com/api/health`
- **API Documentation**: `https://shakes-travel-backend.onrender.com/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request