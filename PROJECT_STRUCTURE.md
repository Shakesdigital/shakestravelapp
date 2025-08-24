# Project Structure - Shakes Travel

## Root Directory Structure

```
shakes-travel/
├── frontend/                 # React frontend application
├── backend/                  # Node.js/Express backend API
├── mobile/                   # React Native mobile app (future)
├── admin/                    # Admin dashboard (separate React app)
├── docs/                     # Project documentation
├── scripts/                  # Build and deployment scripts
├── docker/                   # Docker configuration files
├── k8s/                      # Kubernetes deployment files
├── terraform/                # Infrastructure as code
├── .github/                  # GitHub Actions workflows
├── .gitignore
├── README.md
├── docker-compose.yml        # Local development environment
├── docker-compose.prod.yml   # Production environment
└── CHANGELOG.md
```

## Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json         # PWA manifest
│   ├── favicon.ico
│   ├── icons/               # App icons for different sizes
│   └── robots.txt
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── Button.module.scss
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Loading/
│   │   │   └── index.ts    # Barrel exports
│   │   ├── layout/         # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   ├── Sidebar/
│   │   │   └── Layout.tsx
│   │   ├── auth/           # Authentication components
│   │   ├── search/         # Search-related components
│   │   ├── trips/          # Trip-related components
│   │   ├── accommodations/ # Accommodation components
│   │   ├── booking/        # Booking flow components
│   │   ├── reviews/        # Review components
│   │   ├── user/           # User profile components
│   │   ├── host/           # Host dashboard components
│   │   ├── admin/          # Admin components
│   │   └── maps/           # Map components
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   │   ├── HomePage.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedTrips.tsx
│   │   │   └── index.ts
│   │   ├── Search/
│   │   ├── TripDetails/
│   │   ├── AccommodationDetails/
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Host/
│   │   ├── Admin/
│   │   ├── Booking/
│   │   └── Error/
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useGeolocation.ts
│   │   └── index.ts
│   ├── store/              # Redux store configuration
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── tripsSlice.ts
│   │   │   ├── accommodationsSlice.ts
│   │   │   ├── bookingsSlice.ts
│   │   │   ├── searchSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── notificationsSlice.ts
│   │   └── middleware/
│   │       ├── api.ts
│   │       ├── auth.ts
│   │       └── logger.ts
│   ├── services/           # API services
│   │   ├── api.ts          # Axios configuration
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── tripService.ts
│   │   ├── accommodationService.ts
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   ├── searchService.ts
│   │   ├── uploadService.ts
│   │   └── notificationService.ts
│   ├── utils/              # Utility functions
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── dateUtils.ts
│   │   ├── priceUtils.ts
│   │   └── locationUtils.ts
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.tsx
│   │   ├── SocketContext.tsx
│   │   ├── MapContext.tsx
│   │   └── NotificationContext.tsx
│   ├── types/              # TypeScript type definitions
│   │   ├── api.ts
│   │   ├── user.ts
│   │   ├── trip.ts
│   │   ├── accommodation.ts
│   │   ├── booking.ts
│   │   ├── payment.ts
│   │   ├── review.ts
│   │   └── common.ts
│   ├── styles/             # Global styles and themes
│   │   ├── globals.scss
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── components.scss
│   │   ├── themes/
│   │   │   ├── light.scss
│   │   │   └── dark.scss
│   │   └── responsive.scss
│   ├── assets/             # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   ├── videos/
│   │   └── fonts/
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── index.tsx
│   ├── setupTests.ts
│   └── serviceWorker.ts    # PWA service worker
├── .env                    # Environment variables (template)
├── .env.local              # Local environment variables
├── .env.development        # Development environment
├── .env.production         # Production environment
├── package.json
├── package-lock.json
├── tsconfig.json
├── craco.config.js         # Create React App configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
└── README.md
```

## Backend Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── tripController.ts
│   │   ├── accommodationController.ts
│   │   ├── bookingController.ts
│   │   ├── paymentController.ts
│   │   ├── reviewController.ts
│   │   ├── searchController.ts
│   │   ├── uploadController.ts
│   │   ├── adminController.ts
│   │   └── index.ts
│   ├── models/             # Database models
│   │   ├── User.ts
│   │   ├── Trip.ts
│   │   ├── Accommodation.ts
│   │   ├── Booking.ts
│   │   ├── Payment.ts
│   │   ├── Review.ts
│   │   ├── Wishlist.ts
│   │   ├── SearchHistory.ts
│   │   └── index.ts
│   ├── routes/             # API routes
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── trips.ts
│   │   ├── accommodations.ts
│   │   ├── bookings.ts
│   │   ├── payments.ts
│   │   ├── reviews.ts
│   │   ├── search.ts
│   │   ├── upload.ts
│   │   ├── admin.ts
│   │   └── index.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts         # Authentication middleware
│   │   ├── validation.ts   # Request validation
│   │   ├── errorHandler.ts # Error handling
│   │   ├── rateLimit.ts    # Rate limiting
│   │   ├── cors.ts         # CORS configuration
│   │   ├── upload.ts       # File upload handling
│   │   ├── logging.ts      # Request logging
│   │   └── index.ts
│   ├── services/           # Business logic
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── tripService.ts
│   │   ├── accommodationService.ts
│   │   ├── bookingService.ts
│   │   ├── paymentService.ts
│   │   ├── reviewService.ts
│   │   ├── searchService.ts
│   │   ├── emailService.ts
│   │   ├── smsService.ts
│   │   ├── uploadService.ts
│   │   ├── notificationService.ts
│   │   └── analyticsService.ts
│   ├── utils/              # Utility functions
│   │   ├── database.ts     # Database connection
│   │   ├── cache.ts        # Cache utilities
│   │   ├── logger.ts       # Logging configuration
│   │   ├── validators.ts   # Data validation
│   │   ├── helpers.ts      # General helpers
│   │   ├── constants.ts    # Application constants
│   │   ├── encryption.ts   # Encryption utilities
│   │   └── errors.ts       # Custom error classes
│   ├── config/             # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   ├── cloudinary.ts
│   │   ├── stripe.ts
│   │   ├── email.ts
│   │   ├── sms.ts
│   │   ├── googleMaps.ts
│   │   └── index.ts
│   ├── types/              # TypeScript types
│   │   ├── express.d.ts    # Express type extensions
│   │   ├── api.ts
│   │   ├── database.ts
│   │   ├── payment.ts
│   │   └── common.ts
│   ├── validators/         # Input validation schemas
│   │   ├── authValidators.ts
│   │   ├── userValidators.ts
│   │   ├── tripValidators.ts
│   │   ├── accommodationValidators.ts
│   │   ├── bookingValidators.ts
│   │   └── common.ts
│   ├── jobs/               # Background jobs
│   │   ├── emailJobs.ts
│   │   ├── imageJobs.ts
│   │   ├── paymentJobs.ts
│   │   ├── analyticsJobs.ts
│   │   └── index.ts
│   ├── seeders/            # Database seeders
│   │   ├── userSeeder.ts
│   │   ├── tripSeeder.ts
│   │   ├── accommodationSeeder.ts
│   │   └── index.ts
│   ├── app.ts              # Express app configuration
│   └── server.ts           # Server entry point
├── tests/                  # Test files
│   ├── unit/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── trips.test.ts
│   │   ├── bookings.test.ts
│   │   └── payments.test.ts
│   ├── fixtures/           # Test data
│   ├── helpers/            # Test utilities
│   └── setup.ts            # Test setup
├── scripts/                # Utility scripts
│   ├── seed.ts            # Database seeding
│   ├── migrate.ts         # Database migrations
│   ├── backup.ts          # Database backup
│   └── deploy.ts          # Deployment script
├── .env                   # Environment template
├── .env.development
├── .env.production
├── .env.test
├── package.json
├── package-lock.json
├── tsconfig.json
├── nodemon.json
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── Dockerfile
└── README.md
```

## Shared Configuration Files

### Docker Configuration

```
docker/
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── entrypoint.sh
├── nginx/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── ssl/
│   └── sites/
└── database/
    ├── Dockerfile
    ├── init.js
    └── mongod.conf
```

### Kubernetes Configuration

```
k8s/
├── namespaces/
│   ├── development.yml
│   ├── staging.yml
│   └── production.yml
├── deployments/
│   ├── frontend.yml
│   ├── backend.yml
│   ├── mongodb.yml
│   ├── redis.yml
│   └── nginx.yml
├── services/
│   ├── frontend-service.yml
│   ├── backend-service.yml
│   ├── mongodb-service.yml
│   └── redis-service.yml
├── configmaps/
│   ├── app-config.yml
│   ├── nginx-config.yml
│   └── mongodb-config.yml
├── secrets/
│   ├── app-secrets.yml
│   ├── database-secrets.yml
│   └── ssl-secrets.yml
├── ingress/
│   ├── ingress.yml
│   └── ssl-ingress.yml
├── monitoring/
│   ├── prometheus.yml
│   ├── grafana.yml
│   └── alerts.yml
└── autoscaling/
    ├── hpa.yml
    └── vpa.yml
```

### CI/CD Configuration

```
.github/
├── workflows/
│   ├── frontend-ci.yml     # Frontend CI/CD pipeline
│   ├── backend-ci.yml      # Backend CI/CD pipeline
│   ├── deploy-staging.yml  # Staging deployment
│   ├── deploy-production.yml # Production deployment
│   ├── security-scan.yml   # Security scanning
│   └── dependency-update.yml # Dependency updates
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── question.md
└── PULL_REQUEST_TEMPLATE.md
```

### Infrastructure as Code

```
terraform/
├── environments/
│   ├── development/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars
│   ├── staging/
│   └── production/
├── modules/
│   ├── vpc/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── eks/
│   ├── rds/
│   ├── redis/
│   ├── s3/
│   └── cloudfront/
├── scripts/
│   ├── init.sh
│   ├── plan.sh
│   ├── apply.sh
│   └── destroy.sh
└── README.md
```

## Documentation Structure

```
docs/
├── api/                    # API documentation
│   ├── authentication.md
│   ├── endpoints/
│   │   ├── users.md
│   │   ├── trips.md
│   │   ├── bookings.md
│   │   └── payments.md
│   ├── rate-limiting.md
│   └── error-codes.md
├── architecture/           # System architecture docs
│   ├── overview.md
│   ├── database-design.md
│   ├── security.md
│   └── scalability.md
├── deployment/            # Deployment guides
│   ├── local-setup.md
│   ├── docker-setup.md
│   ├── kubernetes.md
│   └── aws-deployment.md
├── development/           # Development guides
│   ├── getting-started.md
│   ├── coding-standards.md
│   ├── testing.md
│   └── contributing.md
├── user-guides/           # End-user documentation
│   ├── booking-guide.md
│   ├── host-guide.md
│   └── admin-guide.md
├── images/               # Documentation images
├── diagrams/             # Architecture diagrams
└── README.md
```

## Scripts Directory

```
scripts/
├── development/
│   ├── setup.sh          # Initial setup script
│   ├── start-dev.sh      # Start development environment
│   ├── reset-db.sh       # Reset database
│   └── generate-ssl.sh   # Generate SSL certificates
├── deployment/
│   ├── build.sh          # Build application
│   ├── deploy.sh         # Deploy to production
│   ├── rollback.sh       # Rollback deployment
│   └── health-check.sh   # Health check script
├── database/
│   ├── backup.sh         # Database backup
│   ├── restore.sh        # Database restore
│   ├── migrate.sh        # Run migrations
│   └── seed.sh           # Seed database
├── monitoring/
│   ├── logs.sh           # View logs
│   ├── metrics.sh        # View metrics
│   └── alerts.sh         # Check alerts
└── utilities/
    ├── cleanup.sh        # Cleanup old files
    ├── update-deps.sh    # Update dependencies
    └── security-scan.sh  # Security scanning
```

## Environment Variables Structure

```
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_ENVIRONMENT=development

# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shakestravel
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
SMS_PROVIDER_API_KEY=your_sms_provider_api_key
```

This comprehensive project structure provides a solid foundation for building, scaling, and maintaining the Shakes Travel application while ensuring clear separation of concerns and maintainability.