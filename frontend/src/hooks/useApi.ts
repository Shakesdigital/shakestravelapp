import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { showToast } from '@/lib/toast';
import recommendationService from '@/lib/recommendations';

// Auth hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: () => api.user.getProfile().then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Trip hooks
export const useTrips = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.trips.list(params),
    queryFn: () => api.trips.getAll(params).then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTrip = (id: string) => {
  return useQuery({
    queryKey: queryKeys.trips.detail(id),
    queryFn: () => api.trips.getById(id).then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    meta: {
      onSuccess: () => {
        // Track view interaction
        recommendationService.trackInteraction(id, 'trip', 'view');
      },
    },
  });
};

export const useTripRecommendations = (id: string, limit = 6) => {
  return useQuery({
    queryKey: queryKeys.trips.recommendations(id, limit),
    queryFn: () => api.trips.getRecommendations(id, limit).then(res => res.data),
    staleTime: 15 * 60 * 1000, // 15 minutes
    enabled: !!id,
  });
};

// Accommodation hooks
export const useAccommodations = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.accommodations.list(params),
    queryFn: () => api.accommodations.getAll(params).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAccommodation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accommodations.detail(id),
    queryFn: () => api.accommodations.getById(id).then(res => res.data),
    staleTime: 10 * 60 * 1000,
    meta: {
      onSuccess: () => {
        recommendationService.trackInteraction(id, 'accommodation', 'view');
      },
    },
  });
};

export const useAccommodationRecommendations = (id: string, limit = 6) => {
  return useQuery({
    queryKey: queryKeys.accommodations.recommendations(id, limit),
    queryFn: () => api.accommodations.getRecommendations(id, limit).then(res => res.data),
    staleTime: 15 * 60 * 1000,
    enabled: !!id,
  });
};

// Search hooks
export const useSearch = (params: any) => {
  return useQuery({
    queryKey: queryKeys.search.results(params),
    queryFn: () => api.search.general(params).then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    enabled: !!params.destination || !!params.query,
  });
};

export const useSearchSuggestions = (query: string) => {
  return useQuery({
    queryKey: queryKeys.search.suggestions(query),
    queryFn: () => api.search.general({ query, limit: 5 }).then(res => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: query.length > 2,
  });
};

// User data hooks
export const useWishlist = () => {
  return useQuery({
    queryKey: queryKeys.user.wishlist,
    queryFn: () => api.user.getWishlist().then(res => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useTripPlans = () => {
  return useQuery({
    queryKey: queryKeys.user.tripPlans,
    queryFn: () => api.user.getTripPlans().then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBookings = () => {
  return useQuery({
    queryKey: queryKeys.user.bookings,
    queryFn: () => api.user.getBookingHistory().then(res => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePersonalizedRecommendations = (type?: 'trips' | 'accommodations', limit = 10) => {
  return useQuery({
    queryKey: queryKeys.user.recommendations(type, limit),
    queryFn: () => recommendationService.getPersonalizedRecommendations({ type, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Booking hooks
export const useBooking = (id: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(id),
    queryFn: () => api.bookings.getById(id).then(res => res.data),
    staleTime: 30 * 1000, // 30 seconds for booking status
    enabled: !!id,
  });
};

// Trip plan hooks
export const useTripPlan = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tripPlans.detail(id),
    queryFn: () => api.tripPlans.getById(id).then(res => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

// Reviews hooks
export const useReviews = (itemId: string, itemType: string) => {
  return useQuery({
    queryKey: queryKeys.reviews.byItem(itemId, itemType),
    queryFn: () => api.reviews.getByItem(itemId, itemType).then(res => res.data),
    staleTime: 5 * 60 * 1000,
    enabled: !!itemId && !!itemType,
  });
};

// Mutation hooks
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData: any) => api.bookings.create(bookingData),
    onSuccess: (data, variables) => {
      showToast.bookingSuccess(data.data._id);
      invalidateQueries.onBookingCreate();
      
      // Track booking interaction
      recommendationService.trackInteraction(
        variables.tripId || variables.accommodationId, 
        variables.type, 
        'book'
      );
    },
    onError: (error: any) => {
      showToast.error('Booking failed. Please try again.');
    },
  });
};

export const useUpdateWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, itemId, itemType }: { 
      action: 'add' | 'remove';
      itemId: string;
      itemType: 'trip' | 'accommodation';
    }) => {
      if (action === 'add') {
        return api.user.addToWishlist(itemId, itemType);
      } else {
        return api.user.removeFromWishlist(itemId);
      }
    },
    onSuccess: (data, { action, itemId, itemType }) => {
      if (action === 'add') {
        showToast.wishlistAdded(`${itemType === 'trip' ? 'Adventure' : 'Accommodation'}`);
        recommendationService.trackInteraction(itemId, itemType, 'save');
      } else {
        showToast.wishlistRemoved(`${itemType === 'trip' ? 'Adventure' : 'Accommodation'}`);
      }
      
      invalidateQueries.onWishlistChange();
    },
  });
};

export const useCreateTripPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (tripPlanData: any) => api.user.createTripPlan(tripPlanData),
    onSuccess: (data) => {
      showToast.tripPlanSaved(data.data.name);
      invalidateQueries.onTripPlanChange();
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reviewData: FormData) => api.reviews.create(reviewData),
    onSuccess: (data, formData) => {
      showToast.success('Review submitted successfully!');
      
      // Extract itemId and itemType from formData for invalidation
      const itemId = formData.get('tripId') || formData.get('accommodationId') as string;
      const itemType = formData.get('tripId') ? 'trip' : 'accommodation';
      
      if (itemId && itemType) {
        invalidateQueries.onReviewSubmit(itemId, itemType);
      }
    },
  });
};

// Optimistic updates for better UX
export const useOptimisticWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, itemId, itemType }: {
      action: 'add' | 'remove';
      itemId: string;
      itemType: 'trip' | 'accommodation';
    }) => {
      if (action === 'add') {
        return api.user.addToWishlist(itemId, itemType);
      } else {
        return api.user.removeFromWishlist(itemId);
      }
    },
    onMutate: async ({ action, itemId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.wishlist });
      
      // Snapshot the previous value
      const previousWishlist = queryClient.getQueryData(queryKeys.user.wishlist);
      
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.user.wishlist, (old: any) => {
        if (!old) return old;
        
        if (action === 'add') {
          return [...old, { _id: itemId }];
        } else {
          return old.filter((item: any) => item._id !== itemId);
        }
      });
      
      return { previousWishlist };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.user.wishlist, context.previousWishlist);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlist });
    },
  });
};

// Infinite query for pagination
export const useInfiniteTrips = (params?: any) => {
  return useQuery({
    queryKey: queryKeys.trips.list({ ...params, infinite: true }),
    queryFn: ({ pageParam = 1 }) => 
      api.trips.getAll({ ...params, page: pageParam, limit: 12 }).then(res => res.data),
    // getNextPageParam: (lastPage) => {
    //   return lastPage.hasMore ? lastPage.page + 1 : undefined;
    // },
    staleTime: 5 * 60 * 1000,
  });
};

// Real-time data with polling
export const useBookingStatus = (bookingId: string) => {
  return useQuery({
    queryKey: queryKeys.bookings.detail(bookingId),
    queryFn: () => api.bookings.getById(bookingId).then(res => res.data),
    refetchInterval: (data) => {
      // Poll every 5 seconds if booking is pending
      return data?.status === 'pending' ? 5000 : false;
    },
    enabled: !!bookingId,
  });
};