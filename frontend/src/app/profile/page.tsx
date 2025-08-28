'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import axios from 'axios';

interface Booking {
  _id: string;
  type: 'trip' | 'accommodation';
  item: {
    _id: string;
    title: string;
    images: string[];
    location: string;
  };
  checkIn: string;
  checkOut?: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  specialRequests?: string;
}

interface UserReview {
  _id: string;
  itemType: 'trip' | 'accommodation';
  item: {
    _id: string;
    title: string;
    images: string[];
  };
  rating: number;
  title: string;
  comment: string;
  photos: string[];
  createdAt: string;
  helpful: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function ProfilePageContent() {
  const { user, logout } = useAuth();
  const { user: netlifyUser, logout: netlifyLogout } = useNetlifyIdentity();
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reviews' | 'settings'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, reviewsRes] = await Promise.all([
        axios.get(`${API_URL}/users/bookings`),
        axios.get(`${API_URL}/users/reviews`)
      ]);
      
      setBookings(bookingsRes.data.data || []);
      setReviews(reviewsRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await axios.patch(`${API_URL}/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      ));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  user.role === 'host' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'host' ? 'Host/Guide' : 'Traveler'}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {user.role === 'host' && (
                <Link
                  href="/host/dashboard"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Host Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  // Logout from both authentication systems
                  if (netlifyUser) {
                    netlifyLogout();
                  }
                  if (user) {
                    logout();
                  }
                  window.location.href = '/';
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'bookings', label: 'My Bookings' },
                { key: 'reviews', label: 'My Reviews' },
                { key: 'settings', label: 'Settings' }
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
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Bookings</h3>
                    <p className="text-3xl font-bold">{bookings.length}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Reviews Written</h3>
                    <p className="text-3xl font-bold">{reviews.length}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Member Since</h3>
                    <p className="text-lg font-medium">
                      {new Date(user.createdAt || Date.now()).getFullYear()}
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map(booking => (
                      <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div>
                            <h4 className="font-medium">{booking.item.title}</h4>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">My Bookings</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                      <option>All Bookings</option>
                      <option>Upcoming</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-semibold mb-2">No bookings yet</h4>
                    <p className="text-gray-600 mb-4">Start planning your Uganda adventure!</p>
                    <Link
                      href="/search"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Explore Now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4">
                            <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold mb-1">{booking.item.title}</h4>
                              <p className="text-gray-600 mb-2">{booking.item.location}</p>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-500">Check-in:</span>
                                  <p className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                                </div>
                                {booking.checkOut && (
                                  <div>
                                    <span className="text-gray-500">Check-out:</span>
                                    <p className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                                  </div>
                                )}
                                <div>
                                  <span className="text-gray-500">Guests:</span>
                                  <p className="font-medium">{booking.guests}</p>
                                </div>
                                <div>
                                  <span className="text-gray-500">Total:</span>
                                  <p className="font-medium">${booking.totalPrice}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                            
                            <div className="flex space-x-2">
                              <Link
                                href={`/${booking.type === 'trip' ? 'trips' : 'accommodations'}/${booking.item._id}`}
                                className="text-blue-600 hover:text-blue-700 text-sm"
                              >
                                View Details
                              </Link>
                              {booking.status === 'confirmed' && (
                                <button
                                  onClick={() => handleCancelBooking(booking._id)}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {booking.specialRequests && (
                          <div className="mt-4 p-3 bg-white rounded border">
                            <span className="text-sm text-gray-500">Special Requests:</span>
                            <p className="text-sm">{booking.specialRequests}</p>
                          </div>
                        )}
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
                  <h3 className="text-xl font-semibold">My Reviews</h3>
                  <p className="text-gray-600">{reviews.length} reviews written</p>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-lg font-semibold mb-2">No reviews yet</h4>
                    <p className="text-gray-600 mb-4">Share your experiences to help other travelers!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{review.item.title}</h4>
                              <div className="flex items-center space-x-1">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            <h5 className="font-medium mb-2">{review.title}</h5>
                            <p className="text-gray-700 mb-3">{review.comment}</p>
                            
                            {review.photos.length > 0 && (
                              <div className="flex space-x-2 mb-3">
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
                            
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>👍 {review.helpful} people found this helpful</span>
                              <Link
                                href={`/${review.itemType === 'trip' ? 'trips' : 'accommodations'}/${review.item._id}`}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                View Listing
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Account Settings</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Personal Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={user.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Preferences</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Email notifications for bookings
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        Marketing emails and promotions
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        SMS notifications
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Account Actions</h4>
                    <div className="space-y-3">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                        Change Password
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors ml-3">
                        Delete Account
                      </button>
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

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePageContent />
    </AuthGuard>
  );
}