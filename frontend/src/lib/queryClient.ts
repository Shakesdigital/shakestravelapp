import { QueryClient } from '@tanstack/react-query';
import { showToast } from './toast';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 5 minutes by default
      staleTime: 5 * 60 * 1000,
      // Keep in cache for 10 minutes after unused
      gcTime: 10 * 60 * 1000, // formerly cacheTime
      // Retry failed requests up to 3 times
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Background refetch settings
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      // Show error toasts for mutations
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'An error occurred';
        showToast.error(message);
      },
      // Retry mutations once
      retry: 1,
    },
  },
});

// Query key factory for consistent cache keys
export const queryKeys = {
  // Authentication
  auth: {
    profile: ['auth', 'profile'] as const,
  },
  
  // Trips
  trips: {
    all: ['trips'] as const,
    list: (params?: any) => ['trips', 'list', params] as const,
    detail: (id: string) => ['trips', 'detail', id] as const,
    recommendations: (id: string, limit?: number) => ['trips', 'recommendations', id, limit] as const,
  },
  
  // Accommodations
  accommodations: {
    all: ['accommodations'] as const,
    list: (params?: any) => ['accommodations', 'list', params] as const,
    detail: (id: string) => ['accommodations', 'detail', id] as const,
    recommendations: (id: string, limit?: number) => ['accommodations', 'recommendations', id, limit] as const,
  },
  
  // Search
  search: {
    all: ['search'] as const,
    results: (params: any) => ['search', 'results', params] as const,
    suggestions: (query: string) => ['search', 'suggestions', query] as const,
  },
  
  // User
  user: {
    all: ['user'] as const,
    profile: ['user', 'profile'] as const,
    wishlist: ['user', 'wishlist'] as const,
    tripPlans: ['user', 'tripPlans'] as const,
    bookings: ['user', 'bookings'] as const,
    recommendations: (type?: string, limit?: number) => ['user', 'recommendations', type, limit] as const,
  },
  
  // Bookings
  bookings: {
    all: ['bookings'] as const,
    detail: (id: string) => ['bookings', 'detail', id] as const,
  },
  
  // Reviews
  reviews: {
    all: ['reviews'] as const,
    byItem: (itemId: string, itemType: string) => ['reviews', 'byItem', itemId, itemType] as const,
  },
  
  // Trip Plans
  tripPlans: {
    all: ['tripPlans'] as const,
    detail: (id: string) => ['tripPlans', 'detail', id] as const,
    public: (params?: any) => ['tripPlans', 'public', params] as const,
  },
};

// Cache invalidation helpers
export const invalidateQueries = {
  // Invalidate user-related queries after authentication changes
  onAuthChange: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile });
  },
  
  // Invalidate after booking
  onBookingCreate: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.bookings });
    queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
  },
  
  // Invalidate after wishlist changes
  onWishlistChange: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist });
    queryClient.invalidateQueries({ queryKey: queryKeys.user.recommendations() });
  },
  
  // Invalidate after trip plan changes
  onTripPlanChange: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.tripPlans });
    queryClient.invalidateQueries({ queryKey: queryKeys.tripPlans.all });
  },
  
  // Invalidate after review submission
  onReviewSubmit: (itemId: string, itemType: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.reviews.byItem(itemId, itemType) });
    queryClient.invalidateQueries({ queryKey: queryKeys[itemType as 'trips' | 'accommodations'].detail(itemId) });
  },
};

// Prefetching helpers for performance
export const prefetchQueries = {
  // Prefetch user data on login
  userProfile: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.profile,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  },
  
  // Prefetch recommendations
  recommendations: (type?: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.recommendations(type, 6),
      staleTime: 15 * 60 * 1000, // 15 minutes
    });
  },
  
  // Prefetch popular items
  popularTrips: () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.trips.list({ sort: 'popularity', limit: 12 }),
      staleTime: 30 * 60 * 1000, // 30 minutes
    });
  },
};

// Background sync for offline support
export const backgroundSync = {
  // Sync user interactions when back online
  syncInteractions: async () => {
    try {
      const storedInteractions = localStorage.getItem('pendingInteractions');
      if (storedInteractions) {
        const interactions = JSON.parse(storedInteractions);
        // Send to backend
        // await api.post('/analytics/interactions/batch', interactions);
        localStorage.removeItem('pendingInteractions');
      }
    } catch (error) {
      console.warn('Failed to sync interactions:', error);
    }
  },
};

// Performance monitoring
export const queryMetrics = {
  // Track slow queries for optimization
  trackSlowQuery: (queryKey: any[], duration: number) => {
    if (duration > 3000) { // Queries taking more than 3 seconds
      console.warn(`Slow query detected:`, {
        queryKey,
        duration,
        timestamp: new Date().toISOString(),
      });
      
      // In production, send to analytics service
      // analytics.track('slow_query', { queryKey, duration });
    }
  },
};

export default queryClient;