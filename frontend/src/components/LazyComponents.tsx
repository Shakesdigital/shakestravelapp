'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

// Loading components for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Lazy-loaded components with appropriate loading states

// Trip and Accommodation Components
export const LazyTripDetailClient = dynamic(
  () => import('@/app/trips/[id]/TripDetailClient'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50">
        <div className="h-96 bg-gray-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <FormSkeleton />
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const LazyAccommodationDetailClient = dynamic(
  () => import('@/app/accommodations/[id]/AccommodationDetailClient'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50">
        <div className="h-96 bg-gray-200 animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-64 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <FormSkeleton />
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

// Form Components (often not needed on initial page load)
export const LazyBookingWidget = dynamic(
  () => import('@/components/BookingWidget'),
  {
    loading: () => <FormSkeleton />,
    ssr: false, // Forms can be client-side only
  }
);

export const LazyReviewSection = dynamic(
  () => import('@/components/ReviewSection'),
  {
    loading: () => (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Map Components (heavy and often not immediately visible)
export const LazyMapComponent = dynamic(
  () => import('@/components/MapComponent'),
  {
    loading: () => (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-gray-400">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Dashboard and Admin Components
export const LazyPersonalizedDashboard = dynamic(
  () => import('@/components/PersonalizedDashboard'),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false, // Dashboard is typically user-specific
  }
);

export const LazyTripPlannerContent = dynamic(
  () => import('@/app/trip-planner/page').then(mod => ({ default: mod.default })),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormSkeleton />
            </div>
            <div className="space-y-6">
              <FormSkeleton />
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Search Components
export const LazySearchResults = dynamic(
  () => import('@/components/SearchResults'),
  {
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    ),
    ssr: false,
  }
);

// Photo Gallery (heavy component with image processing)
export const LazyPhotoGallery = dynamic(
  () => import('@/components/PhotoGallery'),
  {
    loading: () => (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
    ),
    ssr: false,
  }
);

// Recommendation Section with intelligent loading
export const LazyRecommendationSection = dynamic(
  () => import('@/components/RecommendationSection'),
  {
    loading: () => (
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    ),
    ssr: false, // Recommendations are user-specific
  }
);

// Checkout Components (only loaded when needed)
export const LazyCheckoutClient = dynamic(
  () => import('@/app/checkout/[bookingId]/CheckoutClient'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FormSkeleton />
            <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false, // Checkout is interactive
  }
);

// Itinerary Components
export const LazyItineraryClient = dynamic(
  () => import('@/app/itinerary/[id]/ItineraryClient'),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 animate-pulse">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: true, // Itineraries can be shared, so SEO matters
  }
);

// Higher-order component for lazy loading with intersection observer
export function withLazyLoading<P extends object>(
  Component: React.ComponentType<P>,
  LoadingComponent: React.ComponentType = LoadingSpinner
) {
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={<LoadingComponent />}>
        <Component {...props} />
      </Suspense>
    );
  };
}

// Hook for progressive loading
export function useProgressiveLoading(threshold = 0.1) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Component for progressive loading sections
export function ProgressiveSection({ 
  children, 
  fallback = <LoadingSpinner />,
  className = '',
  threshold = 0.1 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const { ref, isVisible } = useProgressiveLoading(threshold);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
}