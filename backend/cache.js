const Redis = require('ioredis');

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  lazyConnect: true,
  // Connection pool settings
  maxloadingTimeout: 5000,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Initialize Redis client
let redisClient;

// Fallback in-memory cache for development/testing
const memoryCache = new Map();
const memoryTTL = new Map();

// Cache interface
class CacheManager {
  constructor() {
    this.isRedisAvailable = false;
    this.initializeRedis();
  }

  async initializeRedis() {
    try {
      // Only use Redis in production or if explicitly configured
      if (process.env.NODE_ENV === 'production' || process.env.REDIS_URL) {
        redisClient = new Redis(process.env.REDIS_URL || redisConfig);
        
        redisClient.on('connect', () => {
          console.log('✅ Connected to Redis cache');
          this.isRedisAvailable = true;
        });

        redisClient.on('error', (err) => {
          console.error('❌ Redis connection error:', err.message);
          this.isRedisAvailable = false;
        });

        redisClient.on('close', () => {
          console.log('⚠️ Redis connection closed, falling back to memory cache');
          this.isRedisAvailable = false;
        });

        // Test connection
        await redisClient.ping();
      } else {
        console.log('📋 Using in-memory cache (development mode)');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Redis:', error.message);
      this.isRedisAvailable = false;
    }
  }

  // Generic cache operations
  async get(key) {
    try {
      if (this.isRedisAvailable && redisClient) {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Fallback to memory cache
        const value = memoryCache.get(key);
        if (value && memoryTTL.get(key) > Date.now()) {
          return value;
        } else if (value) {
          // Expired, remove from cache
          memoryCache.delete(key);
          memoryTTL.delete(key);
        }
        return null;
      }
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error.message);
      return null;
    }
  }

  async set(key, value, ttlSeconds = 3600) {
    try {
      if (this.isRedisAvailable && redisClient) {
        await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
      } else {
        // Fallback to memory cache
        memoryCache.set(key, value);
        memoryTTL.set(key, Date.now() + ttlSeconds * 1000);
        
        // Clean up expired keys periodically
        this.cleanupMemoryCache();
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error.message);
    }
  }

  async del(key) {
    try {
      if (this.isRedisAvailable && redisClient) {
        await redisClient.del(key);
      } else {
        memoryCache.delete(key);
        memoryTTL.delete(key);
      }
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error.message);
    }
  }

  async invalidatePattern(pattern) {
    try {
      if (this.isRedisAvailable && redisClient) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } else {
        // Pattern matching for memory cache
        for (const key of memoryCache.keys()) {
          if (this.matchesPattern(key, pattern)) {
            memoryCache.delete(key);
            memoryTTL.delete(key);
          }
        }
      }
    } catch (error) {
      console.error(`Cache pattern invalidation error for pattern ${pattern}:`, error.message);
    }
  }

  // Helper method for pattern matching
  matchesPattern(key, pattern) {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  // Cleanup expired keys from memory cache
  cleanupMemoryCache() {
    const now = Date.now();
    for (const [key, expiry] of memoryTTL.entries()) {
      if (expiry <= now) {
        memoryCache.delete(key);
        memoryTTL.delete(key);
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      if (this.isRedisAvailable && redisClient) {
        await redisClient.ping();
        return { status: 'redis', healthy: true };
      } else {
        return { status: 'memory', healthy: true, size: memoryCache.size };
      }
    } catch (error) {
      return { status: 'error', healthy: false, error: error.message };
    }
  }
}

// Cache key generators
const CacheKeys = {
  // Trip cache keys
  trip: (id) => `trip:${id}`,
  tripsList: (params) => `trips:list:${JSON.stringify(params)}`,
  tripRecommendations: (id, limit) => `trip:${id}:recommendations:${limit}`,
  
  // Accommodation cache keys
  accommodation: (id) => `accommodation:${id}`,
  accommodationsList: (params) => `accommodations:list:${JSON.stringify(params)}`,
  accommodationRecommendations: (id, limit) => `accommodation:${id}:recommendations:${limit}`,
  
  // Search cache keys
  search: (params) => `search:${Buffer.from(JSON.stringify(params)).toString('base64')}`,
  searchSuggestions: (query) => `search:suggestions:${query.toLowerCase()}`,
  
  // User cache keys
  userProfile: (userId) => `user:${userId}:profile`,
  userWishlist: (userId) => `user:${userId}:wishlist`,
  userBookings: (userId) => `user:${userId}:bookings`,
  userRecommendations: (userId, type, limit) => `user:${userId}:recommendations:${type}:${limit}`,
  
  // Analytics cache keys
  popularItems: (type, period) => `popular:${type}:${period}`,
  trendingDestinations: (period) => `trending:destinations:${period}`,
  
  // System cache keys
  systemConfig: () => 'system:config',
  rates: (from, to) => `rates:${from}:${to}`,
};

// Cache TTL (Time To Live) settings in seconds
const CacheTTL = {
  // Short-lived cache (5 minutes)
  SHORT: 5 * 60,
  
  // Medium-lived cache (1 hour)
  MEDIUM: 60 * 60,
  
  // Long-lived cache (6 hours)
  LONG: 6 * 60 * 60,
  
  // Very long-lived cache (24 hours)
  VERY_LONG: 24 * 60 * 60,
  
  // Specific TTLs
  SEARCH_RESULTS: 10 * 60, // 10 minutes
  USER_PROFILE: 30 * 60,   // 30 minutes
  RECOMMENDATIONS: 60 * 60, // 1 hour
  POPULAR_ITEMS: 2 * 60 * 60, // 2 hours
  SYSTEM_CONFIG: 24 * 60 * 60, // 24 hours
};

// Cache middleware factory
const createCacheMiddleware = (keyGenerator, ttl = CacheTTL.MEDIUM, skipCache = false) => {
  return async (req, res, next) => {
    if (skipCache || req.method !== 'GET') {
      return next();
    }

    try {
      const cacheKey = keyGenerator(req);
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        // Add cache header
        res.set('X-Cache', 'HIT');
        return res.json(cachedData);
      }

      // Modify res.json to cache the response
      const originalJson = res.json;
      res.json = function(data) {
        // Only cache successful responses
        if (res.statusCode === 200) {
          cache.set(cacheKey, data, ttl).catch(err => 
            console.error('Cache set error:', err.message)
          );
        }
        res.set('X-Cache', 'MISS');
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      next();
    }
  };
};

// Specialized cache helpers
const CacheHelpers = {
  // Cache trip data with proper invalidation
  async cacheTrip(trip) {
    const key = CacheKeys.trip(trip._id);
    await cache.set(key, trip, CacheTTL.LONG);
    
    // Update related caches
    await cache.invalidatePattern(`trips:list:*`);
    await cache.invalidatePattern(`search:*`);
  },

  // Cache user recommendations with personalization
  async cacheUserRecommendations(userId, type, recommendations) {
    const key = CacheKeys.userRecommendations(userId, type, recommendations.length);
    await cache.set(key, recommendations, CacheTTL.RECOMMENDATIONS);
  },

  // Invalidate user-related caches
  async invalidateUserCache(userId) {
    await cache.invalidatePattern(`user:${userId}:*`);
  },

  // Cache popular items with analytics
  async cachePopularItems(type, period, items) {
    const key = CacheKeys.popularItems(type, period);
    await cache.set(key, items, CacheTTL.POPULAR_ITEMS);
  },

  // Warm up critical caches
  async warmUpCache() {
    try {
      console.log('🔥 Warming up cache...');
      
      // Cache popular destinations
      const popularDestinations = ['bwindi', 'murchison-falls', 'queen-elizabeth'];
      for (const destination of popularDestinations) {
        await cache.set(
          `popular:destination:${destination}`, 
          { name: destination, cached_at: new Date() },
          CacheTTL.VERY_LONG
        );
      }

      // Cache system configuration
      await cache.set(CacheKeys.systemConfig(), {
        features: {
          recommendations: true,
          search: true,
          booking: true,
        },
        cached_at: new Date()
      }, CacheTTL.VERY_LONG);

      console.log('✅ Cache warmed up successfully');
    } catch (error) {
      console.error('❌ Cache warm-up failed:', error.message);
    }
  },
};

// Cache statistics
const CacheStats = {
  async getStats() {
    try {
      if (cache.isRedisAvailable && redisClient) {
        const info = await redisClient.info('memory');
        const keyspace = await redisClient.info('keyspace');
        
        return {
          type: 'redis',
          connected: true,
          memory: info,
          keyspace: keyspace,
        };
      } else {
        return {
          type: 'memory',
          connected: true,
          size: memoryCache.size,
          keys: Array.from(memoryCache.keys()).slice(0, 10), // Sample keys
        };
      }
    } catch (error) {
      return {
        type: 'error',
        connected: false,
        error: error.message,
      };
    }
  },

  async clearAll() {
    try {
      if (cache.isRedisAvailable && redisClient) {
        await redisClient.flushdb();
      } else {
        memoryCache.clear();
        memoryTTL.clear();
      }
      console.log('🗑️ Cache cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error.message);
    }
  },
};

// Initialize cache manager
const cache = new CacheManager();

module.exports = {
  cache,
  CacheKeys,
  CacheTTL,
  createCacheMiddleware,
  CacheHelpers,
  CacheStats,
  redisClient, // For direct Redis operations if needed
};