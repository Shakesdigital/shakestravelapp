# Security, Mobile-Responsiveness & Performance Features

## Security Implementation

### Authentication & Authorization

#### JWT Token Security
```javascript
// JWT Configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET, // 256-bit secret
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: '15m', // Short-lived access tokens
  refreshTokenExpiry: '7d',
  algorithm: 'HS256',
  issuer: 'shakestravel.com',
  audience: 'shakestravel-users'
};

// Token rotation strategy
const tokenRotation = {
  rotateRefreshToken: true, // New refresh token on each use
  refreshTokenGracePeriod: '24h', // Grace period for old tokens
  maxRefreshTokens: 5, // Max active refresh tokens per user
  blacklistExpiredTokens: true
};
```

#### Role-Based Access Control (RBAC)
```javascript
const permissions = {
  guest: ['read:trips', 'read:accommodations', 'create:booking'],
  user: ['read:profile', 'update:profile', 'read:bookings', 'create:review'],
  host: ['create:trip', 'update:trip', 'read:bookings', 'manage:listings'],
  admin: ['*'] // All permissions
};

// Permission middleware
const requirePermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = getUserPermissions(req.user.role);
    if (!userPermissions.includes(permission) && !userPermissions.includes('*')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Input Validation & Sanitization

#### Request Validation
```javascript
// Using Joi for validation
const createTripSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().trim(),
  description: Joi.string().min(10).max(2000).required().trim(),
  price: Joi.number().positive().max(10000).required(),
  location: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required()
  }).required(),
  category: Joi.string().valid('safari', 'hiking', 'rafting', 'cultural').required()
});

// SQL Injection Prevention (MongoDB)
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Remove $ and . from user input
```

#### XSS Protection
```javascript
const helmet = require('helmet');
const xss = require('xss');

// Helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      scriptSrc: ["'self'", "https://maps.googleapis.com", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.shakestravel.com"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// XSS sanitization
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
};
```

#### CSRF Protection
```javascript
const csrf = require('csurf');

// CSRF protection for state-changing operations
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

// Apply CSRF protection to sensitive routes
app.use('/api/v1/bookings', csrfProtection);
app.use('/api/v1/payments', csrfProtection);
app.use('/api/v1/admin', csrfProtection);
```

### File Upload Security

#### Secure File Upload
```javascript
const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Max 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Virus scanning (using ClamAV)
const clamscan = require('clamscan');
const scanFile = async (buffer) => {
  const clamscanInstance = await new clamscan().init();
  const scanResult = await clamscanInstance.scanBuffer(buffer);
  return scanResult.isInfected === false;
};
```

### Rate Limiting

#### Advanced Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const RedisStore = require('rate-limit-redis');

// Global rate limiting
const globalLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:global:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: 'Too many requests from this IP'
});

// Authentication rate limiting
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: 'Too many login attempts'
});

// Progressive delays for repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50, // Allow 50 requests per window without delay
  delayMs: 500 // Add 500ms delay per request after delayAfter
});
```

### Data Protection

#### Encryption at Rest
```javascript
const crypto = require('crypto');

// Encrypt sensitive data before storing
const encryptSensitiveData = (data) => {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAAD(Buffer.from('shakestravel'));
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
};

// Encrypt PII fields in database
const userSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  phone: {
    type: String,
    set: function(value) {
      return value ? encryptSensitiveData(value) : value;
    }
  },
  passport: {
    type: String,
    set: function(value) {
      return value ? encryptSensitiveData(value) : value;
    }
  }
});
```

#### GDPR Compliance
```javascript
// Data anonymization
const anonymizeUser = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    firstName: 'Deleted',
    lastName: 'User',
    email: `deleted-${userId}@shakestravel.com`,
    phone: null,
    avatar: null,
    profile: null,
    deletedAt: new Date(),
    isDeleted: true
  });
  
  // Anonymize reviews but keep them for statistical purposes
  await Review.updateMany(
    { user: userId },
    { 
      userName: 'Anonymous User',
      userAvatar: null
    }
  );
};

// Data export
const exportUserData = async (userId) => {
  const user = await User.findById(userId).lean();
  const bookings = await Booking.find({ user: userId }).lean();
  const reviews = await Review.find({ user: userId }).lean();
  const wishlist = await Wishlist.findOne({ user: userId }).lean();
  
  return {
    personalData: user,
    bookingHistory: bookings,
    reviews: reviews,
    wishlist: wishlist,
    exportedAt: new Date()
  };
};
```

## Mobile Responsiveness

### Responsive Design Strategy

#### Breakpoint System
```scss
// Responsive breakpoints
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// Mixins for responsive design
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Mobile-first approach
.container {
  padding: 1rem;
  
  @include respond-to(sm) {
    padding: 1.5rem;
  }
  
  @include respond-to(lg) {
    padding: 2rem;
  }
}
```

#### Mobile Navigation
```tsx
// Mobile-friendly navigation component
const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 touch-target"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation menu"
      >
        <HamburgerIcon />
      </button>
      
      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="bg-white h-full overflow-y-auto">
              <nav className="p-4">
                <MobileNavItems />
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

#### Touch-Friendly Interface
```scss
// Touch-friendly button sizing
.touch-target {
  min-height: 44px; // Apple's recommended minimum
  min-width: 44px;
  padding: 12px;
  
  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-color);
    }
  }
  
  // Active state for touch devices
  &:active {
    transform: scale(0.98);
    background-color: var(--active-color);
  }
}

// Larger form inputs on mobile
.form-input {
  height: 48px;
  font-size: 16px; // Prevents zoom on iOS
  
  @include respond-to(md) {
    height: 40px;
    font-size: 14px;
  }
}
```

### Progressive Web App Features

#### Service Worker
```javascript
// service-worker.js
const CACHE_NAME = 'shakes-travel-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/media/logo.svg'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for offline bookings
self.addEventListener('sync', event => {
  if (event.tag === 'background-booking') {
    event.waitUntil(syncBookings());
  }
});
```

#### App Manifest
```json
{
  "name": "Shakes Travel",
  "short_name": "Shakes Travel",
  "description": "Book amazing adventure trips and accommodations in Uganda",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2563eb",
  "background_color": "#ffffff",
  "orientation": "portrait-primary",
  "categories": ["travel", "lifestyle"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "shortcuts": [
    {
      "name": "Search Trips",
      "url": "/search?type=trips",
      "icons": [{"src": "/icons/search.png", "sizes": "96x96"}]
    },
    {
      "name": "My Bookings",
      "url": "/dashboard/bookings",
      "icons": [{"src": "/icons/bookings.png", "sizes": "96x96"}]
    }
  ]
}
```

## Performance Optimization

### Frontend Performance

#### Code Splitting & Lazy Loading
```tsx
// Route-based code splitting
const HomePage = lazy(() => import('../pages/Home/HomePage'));
const SearchPage = lazy(() => import('../pages/Search/SearchPage'));
const TripDetails = lazy(() => import('../pages/TripDetails/TripDetailsPage'));

// Component lazy loading with error boundaries
const LazyComponent: React.FC<{ component: LazyExoticComponent<any> }> = ({ component: Component }) => (
  <Suspense fallback={<LoadingSkeleton />}>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

// Dynamic imports for heavy libraries
const loadStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  return loadStripe(process.env.REACT_APP_STRIPE_KEY);
};
```

#### Image Optimization
```tsx
// Responsive image component with lazy loading
const OptimizedImage: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  sizes = "100vw",
  priority = false 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Generate WebP and fallback URLs
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  const srcSet = generateSrcSet(src);
  
  useEffect(() => {
    if (!priority) {
      // Intersection Observer for lazy loading
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      if (imgRef.current) {
        observer.observe(imgRef.current);
      }
      
      return () => observer.disconnect();
    } else {
      loadImage();
    }
  }, [priority]);
  
  const loadImage = () => {
    if (imgRef.current) {
      imgRef.current.src = src;
    }
  };
  
  return (
    <picture>
      <source srcSet={srcSet.webp} type="image/webp" sizes={sizes} />
      <source srcSet={srcSet.original} sizes={sizes} />
      <img
        ref={imgRef}
        alt={alt}
        onLoad={() => setIsLoading(false)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </picture>
  );
};
```

#### Virtual Scrolling
```tsx
// Virtual scrolling for large lists
const VirtualizedList: React.FC<{ items: any[], renderItem: Function }> = ({ 
  items, 
  renderItem 
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 200; // Fixed item height
  
  useEffect(() => {
    const handleScroll = throttle(() => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const containerHeight = containerRef.current.clientHeight;
        
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(
          start + Math.ceil(containerHeight / itemHeight) + 5,
          items.length
        );
        
        setVisibleRange({ start, end });
      }
    }, 16);
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [items.length]);
  
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div
      ref={containerRef}
      className="overflow-auto h-full"
      style={{ height: '600px' }}
    >
      <div style={{ height: visibleRange.start * itemHeight }} />
      {visibleItems.map((item, index) => (
        <div key={visibleRange.start + index} style={{ height: itemHeight }}>
          {renderItem(item, visibleRange.start + index)}
        </div>
      ))}
      <div style={{ height: (items.length - visibleRange.end) * itemHeight }} />
    </div>
  );
};
```

### Backend Performance

#### Database Query Optimization
```javascript
// Optimized aggregation pipeline
const getTripsWithAggregation = async (filters) => {
  const pipeline = [
    // Match stage with indexes
    {
      $match: {
        status: 'active',
        'location.country': filters.country,
        'pricing.basePrice': { 
          $gte: filters.minPrice, 
          $lte: filters.maxPrice 
        }
      }
    },
    
    // Lookup reviews with limit
    {
      $lookup: {
        from: 'reviews',
        let: { tripId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$targetId', '$$tripId'] } } },
          { $group: {
            _id: null,
            avgRating: { $avg: '$rating.overall' },
            totalReviews: { $sum: 1 }
          }}
        ],
        as: 'reviewStats'
      }
    },
    
    // Add computed fields
    {
      $addFields: {
        rating: { $ifNull: [{ $arrayElemAt: ['$reviewStats.avgRating', 0] }, 0] },
        totalReviews: { $ifNull: [{ $arrayElemAt: ['$reviewStats.totalReviews', 0] }, 0] }
      }
    },
    
    // Project only needed fields
    {
      $project: {
        title: 1,
        shortDescription: 1,
        'pricing.basePrice': 1,
        'location.city': 1,
        'location.country': 1,
        'media.images': { $slice: ['$media.images', 3] }, // Only first 3 images
        rating: 1,
        totalReviews: 1,
        category: 1
      }
    },
    
    // Sort and paginate
    { $sort: { [filters.sortBy]: filters.sortOrder } },
    { $skip: (filters.page - 1) * filters.limit },
    { $limit: filters.limit }
  ];
  
  const trips = await Trip.aggregate(pipeline);
  return trips;
};

// Connection pooling optimization
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 50, // Maintain up to 50 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0 // Disable mongoose buffering
});
```

#### Caching Strategy
```javascript
// Multi-layer caching
const cacheService = {
  // Memory cache for hot data
  memory: new Map(),
  
  // Redis for distributed cache
  redis: redisClient,
  
  async get(key) {
    // Try memory cache first
    if (this.memory.has(key)) {
      return this.memory.get(key);
    }
    
    // Try Redis cache
    const redisValue = await this.redis.get(key);
    if (redisValue) {
      const parsed = JSON.parse(redisValue);
      // Store in memory cache
      this.memory.set(key, parsed);
      return parsed;
    }
    
    return null;
  },
  
  async set(key, value, ttl = 3600) {
    // Store in memory cache
    this.memory.set(key, value);
    
    // Store in Redis with TTL
    await this.redis.setex(key, ttl, JSON.stringify(value));
    
    // Clean memory cache periodically
    if (this.memory.size > 1000) {
      this.clearOldestMemoryEntries();
    }
  },
  
  clearOldestMemoryEntries() {
    const entries = Array.from(this.memory.entries());
    const toDelete = entries.slice(0, 200); // Remove oldest 200 entries
    toDelete.forEach(([key]) => this.memory.delete(key));
  }
};

// Cache middleware for API responses
const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const cacheKey = `api:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      cacheService.set(cacheKey, data, ttl);
      return originalJson.call(this, data);
    };
    
    next();
  };
};
```

These security, mobile-responsiveness, and performance features ensure that Shakes Travel provides a secure, accessible, and high-performing experience across all devices and use cases.