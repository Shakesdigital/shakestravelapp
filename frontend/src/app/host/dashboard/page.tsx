'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import axios from 'axios';

interface HostItem {
  _id: string;
  title: string;
  type: 'trip' | 'accommodation';
  price: number;
  rating: number;
  reviewCount: number;
  bookings: number;
  status: 'active' | 'draft' | 'suspended';
  images: string[];
  createdAt: string;
  lastUpdated: string;
}

interface HostReview {
  _id: string;
  itemId: string;
  itemTitle: string;
  itemType: 'trip' | 'accommodation';
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  createdAt: string;
  helpful: number;
  status: 'pending' | 'approved' | 'flagged';
}

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  pendingReviews: number;
  monthlyBookings: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function HostDashboardContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'reviews' | 'analytics'>('overview');
  const [items, setItems] = useState<HostItem[]>([]);
  const [reviews, setReviews] = useState<HostReview[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    pendingReviews: 0,
    monthlyBookings: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHostData();
    }
  }, [user]);

  const fetchHostData = async () => {
    setLoading(true);
    try {
      const [statsRes, itemsRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/host/stats`),
        axios.get(`${API_URL}/host/items`),
        axios.get(`${API_URL}/host/reviews`)
      ]);
      
      setStats(statsRes.data.data || stats);
      setItems(itemsRes.data.data || []);
      setReviews(reviewsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch host data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await axios.delete(`${API_URL}/host/items/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleToggleItemStatus = async (itemId: string, newStatus: 'active' | 'draft') => {
    try {
      await axios.patch(`${API_URL}/host/items/${itemId}/status`, { status: newStatus });
      setItems(items.map(item => 
        item._id === itemId ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error('Failed to update item status:', error);
    }
  };

  const handleReviewModeration = async (reviewId: string, action: 'approve' | 'flag') => {
    try {
      await axios.patch(`${API_URL}/host/reviews/${reviewId}/moderate`, { action });
      setReviews(reviews.map(review => 
        review._id === reviewId 
          ? { ...review, status: action === 'approve' ? 'approved' : 'flagged' }
          : review
      ));
    } catch (error) {
      console.error('Failed to moderate review:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'flagged': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            
            <div className="flex space-x-3">
              <Link
                href="/host/create/trip"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Create Adventure
              </Link>
              <Link
                href="/host/create/accommodation"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                + Add Accommodation
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Listings</h3>
            <p className="text-3xl font-bold">{stats.totalListings}</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold">{stats.totalBookings}</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
            <p className="text-3xl font-bold">{stats.averageRating.toFixed(1)}★</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'listings', label: 'My Listings' },
                { key: 'bookings', label: 'Bookings' },
                { key: 'reviews', label: 'Reviews' },
                { key: 'analytics', label: 'Analytics' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'reviews' && reviews.filter(r => r.status === 'pending').length > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {reviews.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {items.slice(0, 3).map(item => (
                        <div key={item._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.bookings} bookings</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/host/create/trip"
                        className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
                      >
                        <div className="text-green-600 text-2xl mb-2">🏔️</div>
                        <div className="font-medium">Create New Adventure</div>
                        <div className="text-sm text-gray-600">Add a new trip or tour</div>
                      </Link>
                      
                      <Link
                        href="/host/create/accommodation"
                        className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-blue-600 text-2xl mb-2">🏨</div>
                        <div className="font-medium">Add Accommodation</div>
                        <div className="text-sm text-gray-600">List your property</div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                {reviews.filter(r => r.status === 'pending').length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-yellow-600 mr-3">⚠️</div>
                      <div>
                        <h4 className="font-medium text-yellow-800">
                          You have {reviews.filter(r => r.status === 'pending').length} pending review(s)
                        </h4>
                        <p className="text-sm text-yellow-700">
                          Review and moderate new reviews from your guests.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('reviews')}
                        className="ml-auto bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                      >
                        View Reviews
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">My Listings ({items.length})</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>All Listings</option>
                      <option>Active</option>
                      <option>Draft</option>
                      <option>Suspended</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-semibold mb-2">No listings yet</h4>
                    <p className="text-gray-600 mb-4">Create your first listing to start hosting!</p>
                    <div className="flex justify-center space-x-3">
                      <Link
                        href="/host/create/trip"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Create Adventure
                      </Link>
                      <Link
                        href="/host/create/accommodation"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Add Accommodation
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                      <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{item.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium">${item.price}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Bookings:</span>
                              <p className="font-medium">{item.bookings}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Rating:</span>
                              <p className="font-medium">{item.rating.toFixed(1)}★ ({item.reviewCount})</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="font-medium">{item.type}</p>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link
                              href={`/host/edit/${item.type}/${item._id}`}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleToggleItemStatus(item._id, item.status === 'active' ? 'draft' : 'active')}
                              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded text-sm transition-colors"
                            >
                              {item.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Review Management</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>All Reviews</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Flagged</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-semibold mb-2">No reviews yet</h4>
                    <p className="text-gray-600">Reviews from guests will appear here for moderation.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {review.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold">{review.user.name}</h4>
                              <p className="text-sm text-gray-600">
                                for {review.itemTitle} • {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                              {review.status}
                            </span>
                          </div>
                        </div>
                        
                        <h5 className="font-medium mb-2">{review.title}</h5>
                        <p className="text-gray-700 mb-3">{review.comment}</p>
                        
                        {review.photos.length > 0 && (
                          <div className="flex space-x-2 mb-4">
                            {review.photos.slice(0, 3).map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                            {review.photos.length > 3 && (
                              <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                                +{review.photos.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            👍 {review.helpful} people found this helpful
                          </span>
                          
                          {review.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleReviewModeration(review._id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReviewModeration(review._id, 'flag')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Flag
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Analytics & Insights</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Monthly Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Bookings this month:</span>
                        <span className="font-semibold">{stats.monthlyBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average response time:</span>
                        <span className="font-semibold">2 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Occupancy rate:</span>
                        <span className="font-semibold">75%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Revenue Insights</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total revenue:</span>
                        <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average booking value:</span>
                        <span className="font-semibold">${Math.round(stats.totalRevenue / Math.max(stats.totalBookings, 1))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Commission fees:</span>
                        <span className="font-semibold">${Math.round(stats.totalRevenue * 0.1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HostDashboardPage() {
  return (
    <AuthGuard requireAuth={true} requireRole="host">
      <HostDashboardContent />
    </AuthGuard>
  );
}