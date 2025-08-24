'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RecommendationSection from './RecommendationSection';
import { api } from '@/lib/axios';
import { showToast } from '@/lib/toast';
import recommendationService from '@/lib/recommendations';

interface UserStats {
  bookingsCount: number;
  wishlistCount: number;
  reviewsCount: number;
  totalSpent: number;
  favoriteDestinations: string[];
  recentActivity: Array<{
    type: 'booking' | 'review' | 'wishlist';
    itemTitle: string;
    date: string;
  }>;
}

export default function PersonalizedDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      // In a real app, this would be a single API call
      const [bookings, wishlist] = await Promise.all([
        api.user.getBookingHistory().catch(() => ({ data: [] })),
        api.user.getWishlist().catch(() => ({ data: [] }))
      ]);

      // Mock stats calculation
      const mockStats: UserStats = {
        bookingsCount: bookings.data?.length || 0,
        wishlistCount: wishlist.data?.length || 0,
        reviewsCount: 0, // Would come from reviews API
        totalSpent: bookings.data?.reduce((sum: number, booking: any) => sum + (booking.total || 0), 0) || 0,
        favoriteDestinations: ['Bwindi', 'Queen Elizabeth NP', 'Murchison Falls'],
        recentActivity: [
          { type: 'wishlist', itemTitle: 'Gorilla Trekking Adventure', date: '2025-01-15' },
          { type: 'booking', itemTitle: 'Lake Bunyonyi Lodge', date: '2025-01-10' },
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to Shakes Travel!</h2>
          <p className="text-xl mb-6">Discover personalized adventures and accommodations</p>
          <div className="space-x-4">
            <a 
              href="/auth/register" 
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Free
            </a>
            <a 
              href="/auth/login" 
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* General recommendations for non-authenticated users */}
        <RecommendationSection
          title="Popular Adventures"
          recommendationType="fallback"
          limit={6}
          className="mt-12"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <p className="text-gray-600 mt-1">Ready for your next adventure in Uganda?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{stats?.bookingsCount || 0}</div>
            <div className="text-sm text-gray-600">Adventures Booked</div>
          </div>
        </div>
      </div>

      {/* User Stats Dashboard */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
            <div className="text-2xl font-bold text-green-600">{stats.bookingsCount}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Wishlist Items</div>
            <div className="text-2xl font-bold text-blue-600">{stats.wishlistCount}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Total Spent</div>
            <div className="text-2xl font-bold text-purple-600">${stats.totalSpent.toFixed(0)}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Reviews Written</div>
            <div className="text-2xl font-bold text-orange-600">{stats.reviewsCount}</div>
          </div>
        </div>
      )}

      {/* Personalized Recommendations */}
      <RecommendationSection
        title="🎯 Recommended Just for You"
        recommendationType="personalized"
        limit={6}
        className="mb-12"
      />

      {/* Recent Activity & Favorites */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Favorite Destinations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Your Favorite Destinations</h3>
            <div className="space-y-2">
              {stats.favoriteDestinations.map((destination, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium">📍 {destination}</span>
                  <button 
                    onClick={() => {
                      // Track interest and redirect to search
                      recommendationService.trackInteraction(`destination_${destination}`, 'trip', 'view');
                      window.location.href = `/search?destination=${encodeURIComponent(destination)}`;
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Explore More →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                    activity.type === 'booking' ? 'bg-green-600' : 
                    activity.type === 'wishlist' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {activity.type === 'booking' ? '✓' : activity.type === 'wishlist' ? '❤️' : '⭐'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.itemTitle}</div>
                    <div className="text-xs text-gray-500">
                      {activity.type === 'booking' ? 'Booked' : 
                       activity.type === 'wishlist' ? 'Added to wishlist' : 'Reviewed'} • {activity.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* More Recommendations */}
      <RecommendationSection
        title="Trending Adventures"
        recommendationType="fallback"
        limit={6}
        className="mb-12"
      />

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-6">Ready to Explore?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="/search?category=trips" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏔️ Find Adventures
          </a>
          <a 
            href="/search?category=accommodations" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🏨 Book Stays
          </a>
          <a 
            href="/trip-planner" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🗺️ Plan Trip
          </a>
          <a 
            href="/profile" 
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ⚙️ Settings
          </a>
        </div>
      </div>
    </div>
  );
}