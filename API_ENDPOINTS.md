# API Endpoints - Shakes Travel

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://api.shakestravel.com/v1
```

## Authentication Endpoints

### POST /auth/register
Register a new user
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+256700123456",
  "role": "guest" // optional, defaults to "guest"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { /* user object without password */ },
    "token": "jwt_token_here"
  }
}
```

### POST /auth/login
User login
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### POST /auth/refresh
Refresh access token
```json
Request:
{
  "refreshToken": "refresh_token_here"
}

Response:
{
  "success": true,
  "data": {
    "token": "new_jwt_token_here"
  }
}
```

### POST /auth/logout
Logout user (invalidate tokens)

### POST /auth/forgot-password
Request password reset
```json
Request:
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with token
```json
Request:
{
  "token": "reset_token",
  "password": "NewSecurePass123!"
}
```

### POST /auth/verify-email
Verify email address
```json
Request:
{
  "token": "verification_token"
}
```

## User Management Endpoints

### GET /users/profile
Get current user profile (requires authentication)

### PUT /users/profile
Update user profile
```json
Request:
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phone": "+256700123456",
  "profile": {
    "bio": "Adventure enthusiast",
    "interests": ["hiking", "photography"]
  }
}
```

### POST /users/upload-avatar
Upload profile picture (multipart/form-data)

### PUT /users/preferences
Update user preferences
```json
Request:
{
  "currency": "USD",
  "notifications": {
    "email": true,
    "sms": false
  }
}
```

### POST /users/verify-identity
Upload identity documents
```json
Request:
{
  "documentType": "passport",
  "documentUrl": "cloudinary_url"
}
```

## Trip Endpoints

### GET /trips
Get trips with filtering and pagination
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- category: string
- location: string
- minPrice: number
- maxPrice: number
- difficulty: string
- duration: number
- rating: number
- startDate: date
- endDate: date
- featured: boolean
- sort: string (price_asc, price_desc, rating_desc, newest)
```

### GET /trips/:id
Get single trip details

### POST /trips
Create new trip (host only)
```json
Request:
{
  "title": "Murchison Falls Safari",
  "description": "Amazing wildlife experience",
  "category": "safari",
  "difficulty": "moderate",
  "duration": { "days": 3, "nights": 2 },
  "pricing": {
    "basePrice": 500,
    "currency": "USD"
  },
  "location": {
    "country": "Uganda",
    "region": "Northern Region",
    "city": "Masindi"
  }
}
```

### PUT /trips/:id
Update trip (host/admin only)

### DELETE /trips/:id
Delete trip (host/admin only)

### POST /trips/:id/images
Upload trip images (multipart/form-data)

### GET /trips/:id/availability
Get trip availability for date range
```
Query Parameters:
- startDate: date
- endDate: date
```

### POST /trips/:id/reviews
Add trip review (requires completed booking)
```json
Request:
{
  "rating": 5,
  "title": "Amazing experience!",
  "comment": "The guide was excellent...",
  "photos": ["url1", "url2"]
}
```

### GET /trips/:id/reviews
Get trip reviews with pagination

## Accommodation Endpoints

### GET /accommodations
Get accommodations with filtering
```
Query Parameters:
- page: number
- limit: number
- type: string
- location: string
- minPrice: number
- maxPrice: number
- amenities: string[] (comma-separated)
- rating: number
- checkIn: date
- checkOut: date
- guests: number
```

### GET /accommodations/:id
Get single accommodation details

### POST /accommodations
Create new accommodation (host only)
```json
Request:
{
  "name": "Safari Lodge",
  "description": "Comfortable lodge near the park",
  "type": "lodge",
  "location": {
    "country": "Uganda",
    "region": "Central",
    "city": "Kampala"
  },
  "rooms": [{
    "name": "Deluxe Room",
    "type": "double",
    "capacity": 2,
    "pricePerNight": 150
  }]
}
```

### PUT /accommodations/:id
Update accommodation (host/admin only)

### DELETE /accommodations/:id
Delete accommodation (host/admin only)

### GET /accommodations/:id/availability
Check room availability
```
Query Parameters:
- checkIn: date
- checkOut: date
- rooms: number
- guests: number
```

### POST /accommodations/:id/reviews
Add accommodation review

### GET /accommodations/:id/reviews
Get accommodation reviews

## Booking Endpoints

### POST /bookings
Create new booking
```json
Request:
{
  "bookingType": "trip",
  "trip": "trip_id",
  "tripDetails": {
    "startDate": "2024-06-01",
    "endDate": "2024-06-03",
    "participants": [{
      "name": "John Doe",
      "age": 30,
      "nationality": "Ugandan"
    }]
  }
}
```

### GET /bookings
Get user's bookings
```
Query Parameters:
- status: string
- type: string (trip/accommodation)
- page: number
- limit: number
```

### GET /bookings/:id
Get single booking details

### PUT /bookings/:id/cancel
Cancel booking
```json
Request:
{
  "reason": "Personal emergency"
}
```

### POST /bookings/:id/payment
Process booking payment
```json
Request:
{
  "paymentMethod": "card",
  "amount": 500,
  "paymentMethodId": "stripe_payment_method_id"
}
```

### GET /bookings/:id/documents
Get booking documents (vouchers, tickets, etc.)

## Payment Endpoints

### POST /payments/create-intent
Create payment intent for Stripe
```json
Request:
{
  "booking": "booking_id",
  "amount": 500,
  "currency": "USD"
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "stripe_client_secret",
    "paymentIntentId": "pi_..."
  }
}
```

### POST /payments/confirm
Confirm payment
```json
Request:
{
  "paymentIntentId": "pi_...",
  "booking": "booking_id"
}
```

### GET /payments/:id
Get payment details

### POST /payments/:id/refund
Process refund (admin only)
```json
Request:
{
  "amount": 250,
  "reason": "Trip cancelled"
}
```

## Search Endpoints

### GET /search
Global search across trips and accommodations
```
Query Parameters:
- q: string (search query)
- type: string (trip/accommodation/both)
- location: string
- dates: string (ISO date range)
- guests: number
- filters: object (JSON encoded filters)
```

### GET /search/suggestions
Get search suggestions/autocomplete
```
Query Parameters:
- q: string (partial query)
- type: string (location/trip/accommodation)
```

### GET /search/popular
Get popular destinations and trips

## Wishlist Endpoints

### GET /wishlist
Get user's wishlist

### POST /wishlist
Add item to wishlist
```json
Request:
{
  "itemType": "trip",
  "itemId": "trip_id",
  "notes": "Want to book for honeymoon"
}
```

### DELETE /wishlist/:itemId
Remove item from wishlist

## Review Endpoints

### GET /reviews
Get reviews with filtering
```
Query Parameters:
- targetType: string (trip/accommodation/host)
- targetId: string
- rating: number
- page: number
- limit: number
```

### POST /reviews/:id/helpful
Mark review as helpful

### POST /reviews/:id/report
Report inappropriate review
```json
Request:
{
  "reason": "spam",
  "details": "This review seems fake"
}
```

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics

### GET /admin/users
Get all users with filtering and pagination
```
Query Parameters:
- role: string
- verified: boolean
- page: number
- limit: number
```

### PUT /admin/users/:id/verify
Verify user identity

### PUT /admin/users/:id/suspend
Suspend user account

### GET /admin/bookings
Get all bookings with filtering

### GET /admin/payments
Get payment analytics and details

### POST /admin/content/moderate
Moderate user-generated content
```json
Request:
{
  "contentType": "review",
  "contentId": "review_id",
  "action": "approve", // approve/reject/flag
  "reason": "Inappropriate language"
}
```

## File Upload Endpoints

### POST /upload/image
Upload single image
```
Content-Type: multipart/form-data
Body: { file: File }

Response:
{
  "success": true,
  "data": {
    "url": "cloudinary_url",
    "publicId": "cloudinary_public_id"
  }
}
```

### POST /upload/images
Upload multiple images (max 10)

### POST /upload/document
Upload document (PDF, DOC, etc.)

## Notification Endpoints

### GET /notifications
Get user notifications
```
Query Parameters:
- unread: boolean
- type: string
- page: number
- limit: number
```

### PUT /notifications/:id/read
Mark notification as read

### PUT /notifications/read-all
Mark all notifications as read

### POST /notifications/preferences
Update notification preferences

## Analytics Endpoints

### GET /analytics/popular-destinations
Get popular destinations

### GET /analytics/trending-trips
Get trending trips

### GET /analytics/user-behavior
Get user behavior analytics (admin only)

## Integration Endpoints

### GET /integrations/maps/places
Search places using Google Maps API
```
Query Parameters:
- query: string
- type: string (city/attraction/accommodation)
```

### GET /integrations/weather/:location
Get weather information for location

### POST /integrations/email/send
Send transactional email
```json
Request:
{
  "to": "user@example.com",
  "template": "booking_confirmation",
  "data": { /* template variables */ }
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per minute per user
- Search endpoints: 50 requests per minute per user
- Upload endpoints: 10 requests per minute per user

## Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## Common HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 429: Too Many Requests
- 500: Internal Server Error