# Axios Interceptors & Personalization Integration Examples

## Overview

This document demonstrates how the new axios interceptors, global error handling with react-toastify, and personalized recommendations are integrated throughout the application.

## 1. Axios Interceptors Configuration

### File: `/src/lib/axios.ts`

```typescript
// JWT Authentication Interceptor
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    
    // Add auth header if token exists and this is a protected route
    if (token && shouldAddAuthHeader(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }
);

// Global Error Handling Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    switch (response?.status) {
      case 401:
        removeAuthToken();
        toast.error('Session expired. Please log in again.');
        window.location.href = `/auth/login?returnUrl=${window.location.pathname}`;
        break;
      case 403:
        toast.error('Access denied. You do not have permission.');
        break;
      case 422:
        // Validation errors with detailed messages
        if (response.data?.errors) {
          response.data.errors.forEach(err => toast.error(err.message));
        }
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
    }
    
    return Promise.reject(error);
  }
);
```

### Protected Routes Detection

```typescript
const shouldAddAuthHeader = (url: string): boolean => {
  const protectedPaths = [
    '/users',      // User profile, settings
    '/bookings',   // Booking management
    '/reviews',    // Review submission
    '/payments',   // Payment processing
    '/wishlist',   // Wishlist operations
    '/trip-plans', // Trip planning
    '/profile'     // User profile
  ];
  
  return protectedPaths.some(path => url.includes(path));
};
```

## 2. API Methods with Built-in Error Handling

### Authentication Examples

```typescript
// Login with automatic error handling and token management
const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.auth.login({ email, password });
    // Token is automatically stored by interceptor
    // Success toast is shown by AuthContext
    return response.data;
  } catch (error) {
    // Errors are automatically handled by interceptor
    // No need for manual error handling
    throw error;
  }
};

// Auto-logout on 401 responses
const getProfile = async () => {
  try {
    return await api.user.getProfile();
  } catch (error) {
    // If 401, user is automatically redirected to login
    // Error toast is automatically shown
    throw error;
  }
};
```

### Booking Flow Integration

```typescript
// BookingWidget.tsx - Enhanced booking with error handling
const handleBooking = async (bookingData: BookingFormData) => {
  const loadingToast = showToast.loading('Processing your booking...');
  
  try {
    const response = await api.bookings.create({
      itemId,
      itemType,
      ...bookingData
    });
    
    // Track interaction for recommendations
    await recommendationService.trackInteraction(itemId, itemType, 'book');
    
    showToast.updateLoading(loadingToast, 'Booking confirmed!', 'success');
    
    // Redirect to checkout
    window.location.href = `/checkout/${response.data._id}`;
    
  } catch (error) {
    showToast.updateLoading(loadingToast, 'Booking failed', 'error');
    // Detailed error already shown by interceptor
    throw error;
  }
};
```

### Wishlist Integration with Recommendations

```typescript
// SaveToWishlistButton.tsx - Enhanced with tracking
const handleToggleSave = async () => {
  try {
    if (isSaved) {
      await api.user.removeFromWishlist(itemId);
      setIsSaved(false);
      showToast.wishlistRemoved(itemTitle);
    } else {
      await api.user.addToWishlist(itemId, itemType);
      setIsSaved(true);
      showToast.wishlistAdded(itemTitle);
      
      // Track for personalization
      await recommendationService.trackInteraction(itemId, itemType, 'save');
    }
  } catch (error) {
    // Error handling done by interceptor
    console.error('Wishlist operation failed:', error);
  }
};
```

## 3. Personalized Recommendations System

### Recommendation Service Architecture

```typescript
// /src/lib/recommendations.ts
export const recommendationService = {
  // Get personalized recommendations based on user history
  getPersonalizedRecommendations: async (params) => {
    // Uses collaborative filtering for authenticated users
    // Falls back to popular items for unauthenticated users
  },
  
  // Get similar items for detail pages
  getItemBasedRecommendations: async (itemId, itemType) => {
    // Content-based filtering using item similarity
  },
  
  // Track user interactions for ML training
  trackInteraction: async (itemId, itemType, interactionType) => {
    // Stores interaction data for recommendation engine
    // 'view', 'like', 'book', 'share', 'save'
  }
};
```

### Usage in Detail Pages

```typescript
// TripDetailClient.tsx - Tracking and recommendations
export default function TripDetailClient({ trip, recommendations }) {
  // Track page view for personalization
  useEffect(() => {
    recommendationService.trackInteraction(trip._id, 'trip', 'view');
  }, [trip._id]);

  // Enhanced recommendations with personalization
  return (
    <div>
      {/* Trip content */}
      
      <RecommendationSection
        title="Similar Adventures You Might Love"
        itemId={trip._id}
        itemType="trip"
        recommendationType="item-based"
        limit={6}
        className="mt-12"
      />
    </div>
  );
}
```

### Collaborative Filtering Example (Backend Integration)

```typescript
// Example backend recommendation logic
const generateCollaborativeRecommendations = async (userId: string) => {
  // 1. Get user's interaction history
  const userHistory = await getUserInteractionHistory(userId);
  
  // 2. Find similar users based on common preferences
  const similarUsers = await findSimilarUsers(userId, userHistory);
  
  // 3. Get items liked by similar users that current user hasn't seen
  const candidateItems = await getItemsLikedBySimilarUsers(similarUsers, userHistory);
  
  // 4. Score and rank recommendations
  const scoredRecommendations = candidateItems.map(item => ({
    ...item,
    recommendationScore: calculateScore(item, userHistory, similarUsers),
    recommendationReason: generateReason(item, similarUsers),
    matchFactors: identifyMatchFactors(item, userHistory)
  }));
  
  return scoredRecommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);
};
```

## 4. Global Error Handling Examples

### Toast Integration

```typescript
// /src/lib/toast.ts - Custom toast methods
export const showToast = {
  // Success messages
  bookingSuccess: (bookingId: string) => {
    toast.success(`Booking confirmed! ID: ${bookingId}`, { autoClose: 3000 });
  },
  
  // Wishlist operations
  wishlistAdded: (itemName: string) => {
    toast.success(`${itemName} added to wishlist! ❤️`, { autoClose: 3000 });
  },
  
  // Loading states
  loading: (message: string) => toast.loading(message),
  
  // Update loading toasts
  updateLoading: (toastId, message, type) => {
    toast.update(toastId, {
      render: message,
      type,
      isLoading: false,
      autoClose: 5000
    });
  }
};

// Validation error handler
export const handleValidationErrors = (errors: any) => {
  if (Array.isArray(errors)) {
    errors.forEach(error => showToast.error(error.message));
  } else {
    Object.values(errors).forEach(error => showToast.error(error));
  }
};
```

### Form Validation Integration

```typescript
// Example form with integrated error handling
const handleSubmit = async (formData: FormData) => {
  const loadingToast = showToast.loading('Saving changes...');
  
  try {
    await api.user.updateProfile(formData);
    showToast.updateLoading(loadingToast, 'Profile updated successfully!', 'success');
  } catch (error) {
    showToast.updateLoading(loadingToast, 'Failed to update profile', 'error');
    // Detailed validation errors already handled by interceptor
  }
};
```

## 5. Complete Integration Example

### PersonalizedDashboard Component

```typescript
// /src/components/PersonalizedDashboard.tsx
export default function PersonalizedDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // Multiple API calls with automatic error handling
      const [bookings, wishlist, recommendations] = await Promise.all([
        api.user.getBookingHistory(),
        api.user.getWishlist(),
        api.user.getRecommendations('trips', 10)
      ]);

      setStats({
        bookingsCount: bookings.data.length,
        wishlistCount: wishlist.data.length,
        // ... other stats
      });
    } catch (error) {
      // Errors automatically handled by interceptors
      console.error('Failed to load dashboard:', error);
    }
  };

  return (
    <div>
      {/* User stats */}
      
      {/* Personalized recommendations */}
      <RecommendationSection
        title="🎯 Recommended Just for You"
        recommendationType="personalized"
        limit={6}
      />
      
      {/* Trending recommendations */}
      <RecommendationSection
        title="Trending Adventures"
        recommendationType="fallback"
        limit={6}
      />
    </div>
  );
}
```

## 6. Error Scenarios Handled

### Authentication Errors
- **401 Unauthorized**: Automatic logout and redirect to login page
- **403 Forbidden**: Access denied toast with helpful message
- **Token Expiry**: Automatic token refresh or logout

### Validation Errors
- **422 Unprocessable Entity**: Display all validation errors as individual toasts
- **400 Bad Request**: Show specific error message from server

### Network Errors
- **Network timeout**: Retry suggestion with user-friendly message
- **Server unavailable**: Graceful degradation message

### Booking Flow Errors
- **Payment failures**: Clear error message with retry option
- **Availability issues**: Real-time availability check with alternatives

## 7. Performance Optimizations

### Caching Strategy
```typescript
// Recommendation caching to reduce API calls
const getCachedRecommendations = (cacheKey: string) => {
  const cached = localStorage.getItem(`rec_${cacheKey}`);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 minutes
      return data;
    }
  }
  return null;
};
```

### Interaction Batching
```typescript
// Batch interaction tracking to reduce server load
const batchTrackInteractions = debounce(async (interactions) => {
  try {
    await api.post('/analytics/interactions/batch', { interactions });
  } catch (error) {
    console.warn('Failed to track interactions:', error);
  }
}, 5000);
```

## 8. Analytics Integration

### User Behavior Tracking
```typescript
// Track user journey for recommendation improvement
const trackUserJourney = {
  pageView: (page: string) => {
    recommendationService.trackInteraction(page, 'page', 'view');
  },
  
  searchQuery: (query: string, results: number) => {
    // Track search patterns for personalization
  },
  
  bookingFunnel: (step: string, itemId: string) => {
    // Track booking conversion funnel
  }
};
```

This integration provides a seamless user experience with intelligent error handling, personalized recommendations, and comprehensive user behavior tracking for continuous improvement of the recommendation system.