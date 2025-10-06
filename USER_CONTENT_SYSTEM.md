# User-Generated Content System - Shakes Travel

## Overview
This document describes the comprehensive user-generated content (UGC) system that allows authenticated users to create and share experiences, accommodations, and articles. All content goes through admin moderation before being published on the website.

## System Architecture

### Backend Components Created

#### 1. Database Models

##### UserExperience Model (`backend/src/models/UserExperience.js`)
- **Purpose**: Stores user-submitted experiences (trips, tours, activities)
- **Key Features**:
  - Complete experience data matching the existing experiences structure
  - Moderation workflow (pending ’ approved/rejected/revision_requested)
  - Public ID generation upon approval
  - Slug generation for SEO
  - Ratings and reviews tracking
  - Soft delete support

**Fields Include**:
- Basic info: title, location, region, category, duration, difficulty, price
- Rich content: description, overview, highlights, included items
- Itinerary: time-based schedule of activities
- Images: array of image URLs
- Additional info: cancellation policy, meeting point, accessibility
- Availability: times, days, seasonality
- Feature flags: ecoFriendly, instantBooking, freeCancel, pickupIncluded
- Moderation: status, reviewedBy, adminNotes, rejectionReason
- Contact info: phone, email, whatsapp

##### UserAccommodation Model (`backend/src/models/UserAccommodation.js`)
- **Purpose**: Stores user-submitted accommodations
- **Key Features**:
  - Comprehensive accommodation details
  - Same moderation workflow as experiences
  - Business information support
  - Availability calendar
  - Geo-coordinates support

**Fields Include**:
- Basic info: name, type, description, location, region
- Pricing: pricePerNight, currency
- Capacity: maxGuests, bedrooms, bathrooms, beds
- Amenities: WiFi, Pool, Parking, etc.
- Images: with captions and primary flag
- Policies: cancellationPolicy, checkIn/Out times, house rules
- Features: instantBook, freeCancel, ecoFriendly
- Contact & business info
- Moderation workflow fields

##### Article Model (Already existed - enhanced)
Located at `backend/src/models/Article.js`
- Full-featured blog/article system
- Rich moderation workflow
- SEO optimization
- Engagement metrics (views, likes, shares, comments)
- Publishing and scheduling capabilities

#### 2. API Routes

##### User Content Routes (`backend/src/routes/userContent.js`)
**Base URL**: `/api/user-content`

**Experiences Endpoints**:
- `GET /experiences` - Get all user's experiences (with status filter)
- `GET /experiences/:id` - Get specific experience
- `POST /experiences` - Create new experience
- `PUT /experiences/:id` - Update experience (only pending/rejected)
- `DELETE /experiences/:id` - Soft delete experience
- `POST /experiences/:id/submit-review` - Submit for admin review

**Accommodations Endpoints**:
- `GET /accommodations` - Get all user's accommodations
- `GET /accommodations/:id` - Get specific accommodation
- `POST /accommodations` - Create new accommodation
- `PUT /accommodations/:id` - Update accommodation
- `DELETE /accommodations/:id` - Soft delete accommodation
- `POST /accommodations/:id/submit-review` - Submit for review

**Articles Endpoints**:
- `GET /articles` - Get all user's articles
- `GET /articles/:id` - Get specific article
- `POST /articles` - Create new article (as draft)
- `PUT /articles/:id` - Update article
- `POST /articles/:id/submit-review` - Submit for review
- `DELETE /articles/:id` - Delete article (drafts only)
- `POST /articles/:id/schedule` - Schedule for publishing

**Utility Endpoints**:
- `POST /upload-images` - Upload images for content
- `GET /dashboard-stats` - Get user dashboard statistics

##### Admin Moderation Routes (`backend/src/routes/adminModeration.js`)
**Base URL**: `/api/admin/moderation` (Requires admin/superadmin role)

**Overview Endpoints**:
- `GET /pending-all` - Get all pending content across all types
- `GET /stats` - Get comprehensive moderation statistics

**Experience Moderation**:
- `GET /experiences` - Get all experiences (with pagination & filters)
- `PUT /experiences/:id/approve` - Approve experience
- `PUT /experiences/:id/reject` - Reject with reason
- `PUT /experiences/:id/suspend` - Suspend active experience

**Accommodation Moderation**:
- `GET /accommodations` - Get all accommodations
- `PUT /accommodations/:id/approve` - Approve accommodation
- `PUT /accommodations/:id/reject` - Reject with reason

**Article Moderation**:
- `GET /articles` - Get all articles (with filters)
- `GET /articles/:id` - Get specific article for review
- `PUT /articles/:id/approve` - Approve (with auto-publish option)
- `PUT /articles/:id/reject` - Reject with reason
- `PUT /articles/:id/flag` - Flag for further review
- `PUT /articles/:id/feature` - Mark as featured
- `PUT /articles/:id/editors-pick` - Mark as editor's pick

**User Management**:
- `GET /content-creators` - Get all content creators with stats
- `GET /user/:userId/content` - Get all content by specific user
- `PUT /user/:userId/verify-host` - Verify user as trusted host

#### 3. Model Registration
Updated `backend/src/models/index.js` to include:
- UserExperience model export
- UserAccommodation model export
- Index creation for new models
- Health check integration
- Statistics tracking

### Workflow

#### Content Creation Flow
```
1. User registers/logs in
2. User creates content (experience/accommodation/article)
3. Content is saved with status: 'draft' or 'pending'
4. User submits for review
5. Admin receives notification
6. Admin reviews content
7. Admin approves/rejects/requests revision
8. User is notified of decision
9. If approved, content appears on public pages
```

#### Moderation States

**Experiences & Accommodations**:
- `pending` - Awaiting admin review
- `approved` - Approved and live
- `rejected` - Rejected by admin
- `revision_requested` - Needs changes

**Articles**:
- `draft` - Being written by author
- `pending` - Submitted for review
- `approved` - Approved by admin
- `rejected` - Rejected by admin
- `flagged` - Flagged for issues

### Security & Validation

#### Authentication Required
All user content routes require authentication via JWT token

#### Authorization Rules
- Users can only view/edit their own content
- Only pending/rejected content can be edited
- Approved content is locked (requires new submission)
- Admin/SuperAdmin roles required for moderation

#### Input Validation
- All required fields validated
- String length limits enforced
- Enum values validated
- Price/number ranges checked
- Email and URL format validation

### Database Indexes

**Performance Optimizations**:
```javascript
// UserExperience
- userId + status
- status + createdAt
- region + category
- slug (unique, sparse)
- publicExperienceId (unique, sparse)

// UserAccommodation
- userId + status
- status + createdAt
- region + type
- location + pricePerNight
- coordinates (geospatial)
```

## Frontend Integration (To Be Implemented)

### User Dashboard
Location: `frontend/src/app/dashboard/user/`

**Pages Needed**:
1. `/dashboard/user/overview` - Dashboard home with stats
2. `/dashboard/user/experiences` - Manage experiences
3. `/dashboard/user/experiences/new` - Create new experience
4. `/dashboard/user/experiences/[id]/edit` - Edit experience
5. `/dashboard/user/accommodations` - Manage accommodations
6. `/dashboard/user/accommodations/new` - Create accommodation
7. `/dashboard/user/accommodations/[id]/edit` - Edit accommodation
8. `/dashboard/user/articles` - Manage articles
9. `/dashboard/user/articles/new` - Create article
10. `/dashboard/user/articles/[id]/edit` - Edit article

**Components Needed**:
- `ExperienceForm.tsx` - Form for creating/editing experiences
- `AccommodationForm.tsx` - Form for creating/editing accommodations
- `ArticleEditor.tsx` - Rich text editor for articles
- `ImageUploader.tsx` - Multi-image upload component
- `ContentStatusBadge.tsx` - Display moderation status
- `DashboardStats.tsx` - Display user statistics

### Admin Dashboard
Location: `frontend/src/app/admin/moderation/`

**Pages Needed**:
1. `/admin/moderation/overview` - Moderation dashboard
2. `/admin/moderation/experiences` - Review experiences
3. `/admin/moderation/experiences/[id]` - Review specific experience
4. `/admin/moderation/accommodations` - Review accommodations
5. `/admin/moderation/accommodations/[id]` - Review specific accommodation
6. `/admin/moderation/articles` - Review articles
7. `/admin/moderation/articles/[id]` - Review specific article
8. `/admin/moderation/users` - Manage content creators

**Components Needed**:
- `ModerationQueue.tsx` - List pending content
- `ContentReviewCard.tsx` - Display content for review
- `ApprovalButtons.tsx` - Approve/Reject/Request Revision
- `ModerationStats.tsx` - Statistics dashboard
- `FeedbackForm.tsx` - Provide feedback to users
- `UserContentList.tsx` - View user's all content

### Public Pages Integration

**Experiences Page** (`frontend/src/app/experiences/`)
- Fetch approved user experiences from API
- Mix with existing sample data
- Filter by user-generated flag
- Display "Community Created" badge

**Accommodations Page** (To be created)
- Display approved accommodations
- Filtering and sorting
- Map integration

**Articles/Blog Page** (To be created)
- Display published articles
- Category filtering
- Featured articles section
- Trending articles

## API Response Examples

### Create Experience
```http
POST /api/user-content/experiences
Authorization: Bearer <token>

{
  "title": "Mountain Hiking in Rwenzori",
  "location": "Rwenzori Mountains",
  "region": "Uganda",
  "category": "Nature & Hiking",
  "duration": "3 Days",
  "difficulty": "Challenging",
  "price": 450,
  "description": "...",
  "overview": "...",
  "highlights": [...],
  "itinerary": [...],
  "images": [...]
}

Response:
{
  "success": true,
  "message": "Experience submitted for review",
  "data": { ...experience object }
}
```

### Get User Dashboard Stats
```http
GET /api/user-content/dashboard-stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "experiences": {
      "total": 5,
      "draft": 1,
      "active": 3,
      "suspended": 1
    },
    "accommodations": {
      "total": 2,
      "draft": 0,
      "active": 2
    },
    "articles": {
      "total": 10,
      "draft": 3,
      "pending": 2,
      "approved": 5
    }
  }
}
```

### Admin Approve Experience
```http
PUT /api/admin/moderation/experiences/123/approve
Authorization: Bearer <admin-token>

{
  "feedback": "Great content! Approved."
}

Response:
{
  "success": true,
  "message": "Experience approved successfully",
  "data": { ...experience object with publicExperienceId }
}
```

## Next Steps

### Immediate Tasks
1.  Create database models
2.  Create API routes
3.  Register routes in server
4. = Build user dashboard frontend
5. ó Build admin moderation dashboard
6. ó Integrate approved content with public pages
7. ó Add email notifications
8. ó Test complete workflow
9. ó Deploy to production

### Future Enhancements
- [ ] Add image upload to cloud storage (Cloudinary/S3)
- [ ] Implement email notifications for moderation actions
- [ ] Add real-time notifications via WebSockets
- [ ] Create content analytics dashboard
- [ ] Add content versioning and history
- [ ] Implement automatic content quality scoring
- [ ] Add AI-powered content suggestions
- [ ] Create mobile app for content creation
- [ ] Add multi-language support
- [ ] Implement collaborative editing
- [ ] Add content scheduling calendar
- [ ] Create revenue sharing system for content creators

## Technical Notes

### Environment Variables
No additional environment variables required. Uses existing MongoDB connection.

### Dependencies
All dependencies already installed in the project.

### Middleware Used
- `protect` - JWT authentication middleware
- `restrictTo` - Role-based authorization
- `upload` - Multer file upload middleware (existing)

### Testing Checklist
- [ ] Create experience as user
- [ ] Edit draft experience
- [ ] Submit experience for review
- [ ] Admin login and view pending experiences
- [ ] Admin approve experience
- [ ] Verify experience appears on public page
- [ ] Test rejection flow
- [ ] Test revision request flow
- [ ] Create accommodation as user
- [ ] Test accommodation moderation
- [ ] Create article as user
- [ ] Test article publishing workflow
- [ ] Test dashboard statistics
- [ ] Test pagination in all listings
- [ ] Test search and filters
- [ ] Test image uploads
- [ ] Test permissions and authorization

## Support & Documentation

### API Documentation
Full API documentation available at `/api/docs` (to be implemented with Swagger/OpenAPI)

### Database Schema Diagram
See `docs/database-schema.md` for visual representation

### User Guide
See `docs/user-guide.md` for step-by-step instructions

### Admin Guide
See `docs/admin-guide.md` for moderation best practices

---

**Created**: December 2024
**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Backend Complete, Frontend In Progress
