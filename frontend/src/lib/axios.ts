import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Disable credentials for now to avoid CORS issues
});

// Token management
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Request interceptor - Add JWT token to protected requests
axiosInstance.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    
    // Add auth header if token exists and this is a protected route
    if (token && shouldAddAuthHeader(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp to prevent caching issues
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error: AxiosError) => {
    toast.error('Request failed to send');
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log API performance in development
    if (process.env.NODE_ENV === 'development' && response.config.metadata) {
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
      console.log(`API Call: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    return response;
  },
  (error: AxiosError) => {
    const { response, request, config } = error;
    
    // Handle different error scenarios
    if (response) {
      // Server responded with error status
      const status = response.status;
      const data = response.data as any;
      
      switch (status) {
        case 401:
          // Unauthorized - remove token and redirect to login
          removeAuthToken();
          toast.error('Session expired. Please log in again.');
          
          // Redirect to login only if not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/auth/login?returnUrl=${returnUrl}`;
          }
          break;
          
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
          
        case 404:
          if (!isAssetRequest(config?.url)) {
            toast.error(data?.message || 'Resource not found');
          }
          break;
          
        case 422:
          // Validation errors
          if (data?.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err: any) => {
              toast.error(err.message || err);
            });
          } else {
            toast.error(data?.message || 'Validation failed');
          }
          break;
          
        case 429:
          toast.error('Too many requests. Please wait a moment before trying again.');
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          if (status >= 400) {
            toast.error(data?.message || `Error ${status}: ${response.statusText}`);
          }
      }
    } else if (request) {
      // Request made but no response received
      console.error('Network error:', error);
      if (error.message?.includes('timeout')) {
        toast.error('Request timeout. Please try again.');
      } else if (error.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('Unable to connect to server. Please try again.');
      }
    } else {
      // Something else happened
      console.error('Axios configuration error:', error);
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
const shouldAddAuthHeader = (url: string): boolean => {
  const protectedPaths = [
    '/users',
    '/bookings',
    '/reviews',
    '/payments',
    '/wishlist',
    '/trip-plans',
    '/profile',
    '/admin'
  ];
  
  return protectedPaths.some(path => url.includes(path));
};

const isAssetRequest = (url?: string): boolean => {
  if (!url) return false;
  const assetExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return assetExtensions.some(ext => url.includes(ext));
};

// Export configured instance and utilities
export default axiosInstance;

export { setAuthToken, removeAuthToken, getAuthToken };

// Specific API methods with built-in error handling
export const api = {
  // Authentication
  auth: {
    login: (credentials: { email: string; password: string }) =>
      axiosInstance.post('/auth/login', credentials),
    register: (userData: { firstName: string; lastName: string; email: string; password: string; agreeToTerms?: boolean; agreeToPrivacy?: boolean }) =>
      axiosInstance.post('/auth/register', userData),
    logout: () => axiosInstance.post('/auth/logout'),
    refreshToken: () => axiosInstance.post('/auth/refresh'),
    forgotPassword: (email: string) => axiosInstance.post('/auth/forgot-password', { email }),
    resetPassword: (token: string, password: string) => 
      axiosInstance.post('/auth/reset-password', { token, password }),
  },

  // User operations
  user: {
    getProfile: () => axiosInstance.get('/users/profile'),
    updateProfile: (data: any) => axiosInstance.put('/users/profile', data),
    getWishlist: () => axiosInstance.get('/users/wishlist'),
    addToWishlist: (itemId: string, itemType: 'trip' | 'accommodation') =>
      axiosInstance.post('/users/wishlist', { itemId, itemType }),
    removeFromWishlist: (itemId: string) => axiosInstance.delete(`/users/wishlist/${itemId}`),
    checkWishlistItem: (itemId: string, itemType: string) =>
      axiosInstance.get('/users/wishlist/check', { params: { itemId, itemType } }),
    getTripPlans: () => axiosInstance.get('/users/trip-plans'),
    createTripPlan: (data: any) => axiosInstance.post('/users/trip-plans', data),
    updateTripPlan: (id: string, data: any) => axiosInstance.put(`/users/trip-plans/${id}`, data),
    deleteTripPlan: (id: string) => axiosInstance.delete(`/users/trip-plans/${id}`),
    copyTripPlan: (sourceTripPlanId: string) =>
      axiosInstance.post('/users/trip-plans/copy', { sourceTripPlanId }),
    getRecommendations: (type?: 'trips' | 'accommodations', limit = 10) =>
      axiosInstance.get('/users/recommendations', { params: { type, limit } }),
    getBookingHistory: () => axiosInstance.get('/users/bookings'),
  },

  // Trips
  trips: {
    getAll: (params?: any) => axiosInstance.get('/trips', { params }),
    getById: (id: string) => axiosInstance.get(`/trips/${id}`),
    getRecommendations: (id: string, limit = 6) =>
      axiosInstance.get(`/trips/${id}/recommendations`, { params: { limit } }),
    uploadPhoto: (id: string, formData: FormData) =>
      axiosInstance.post(`/trips/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
  },

  // Accommodations  
  accommodations: {
    getAll: (params?: any) => axiosInstance.get('/accommodations', { params }),
    getById: (id: string) => axiosInstance.get(`/accommodations/${id}`),
    getRecommendations: (id: string, limit = 6) =>
      axiosInstance.get(`/accommodations/${id}/recommendations`, { params: { limit } }),
    uploadPhoto: (id: string, formData: FormData) =>
      axiosInstance.post(`/accommodations/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
  },

  // Bookings
  bookings: {
    create: (data: any) => axiosInstance.post('/bookings', data),
    getById: (id: string) => axiosInstance.get(`/bookings/${id}`),
    update: (id: string, data: any) => axiosInstance.put(`/bookings/${id}`, data),
    cancel: (id: string) => axiosInstance.post(`/bookings/${id}/cancel`),
  },

  // Reviews
  reviews: {
    create: (formData: FormData) => axiosInstance.post('/reviews', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getByItem: (itemId: string, itemType: string) =>
      axiosInstance.get('/reviews', { params: { itemId, itemType } }),
    markHelpful: (id: string) => axiosInstance.post(`/reviews/${id}/helpful`),
  },

  // Payments
  payments: {
    process: (data: any) => axiosInstance.post('/payments/process', data),
    getPaymentMethods: () => axiosInstance.get('/payments/methods'),
    createPaymentIntent: (amount: number, currency = 'USD') =>
      axiosInstance.post('/payments/create-intent', { amount, currency }),
  },

  // Search
  search: {
    general: (params: any) => axiosInstance.get('/search/general', { params }),
    suggestions: (params: any) => axiosInstance.get('/search/suggestions', { params }),
    trips: (params: any) => axiosInstance.get('/search/trips', { params }),
    accommodations: (params: any) => axiosInstance.get('/search/accommodations', { params }),
    all: (params: any) => axiosInstance.get('/search', { params }),
  },

  // Trip Plans (public)
  tripPlans: {
    getById: (id: string) => axiosInstance.get(`/trip-plans/${id}`),
    getPublic: (params?: any) => axiosInstance.get('/trip-plans/public', { params }),
  },

  // Admin operations
  admin: {
    // Dashboard
    getStats: () => axiosInstance.get('/admin/dashboard/stats'),
    getAnalytics: (period = '30d') => axiosInstance.get('/admin/analytics/overview', { params: { period } }),
    
    // Content Management
    getContent: (params?: any) => axiosInstance.get('/admin/content', { params }),
    
    // User Management
    getUsers: (params?: any) => axiosInstance.get('/admin/users', { params }),
    updateUser: (id: string, data: any) => axiosInstance.put(`/admin/users/${id}`, data),
    
    // Booking Management
    getBookings: (params?: any) => axiosInstance.get('/admin/bookings', { params }),
    updateBooking: (id: string, data: any) => axiosInstance.put(`/admin/bookings/${id}`, data),
    
    // Trip Management
    getTrips: (params?: any) => axiosInstance.get('/admin/trips', { params }),
    updateTrip: (id: string, data: any) => axiosInstance.put(`/admin/trips/${id}`, data),
    
    // Accommodation Management
    getAccommodations: (params?: any) => axiosInstance.get('/admin/accommodations', { params }),
    updateAccommodation: (id: string, data: any) => axiosInstance.put(`/admin/accommodations/${id}`, data),
    
    // Review Management
    getReviews: (params?: any) => axiosInstance.get('/admin/reviews', { params }),
    updateReview: (id: string, data: any) => axiosInstance.put(`/admin/reviews/${id}`, data),
  },
};