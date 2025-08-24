'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { useForm, useFieldArray } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

interface TripPlannerItem {
  id: string;
  type: 'trip' | 'accommodation';
  itemId: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  date?: string;
  notes?: string;
  order: number;
}

interface SavedTrip {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  items: TripPlannerItem[];
  totalEstimatedCost: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TripFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublic: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function TripPlannerContent() {
  const { user } = useAuth();
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<TripPlannerItem[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripFormData>();

  useEffect(() => {
    if (user) {
      fetchSavedTrips();
      fetchWishlistItems();
      loadCurrentTrip();
    }
  }, [user]);

  const fetchSavedTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/trip-plans`);
      setSavedTrips(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch saved trips:', error);
    }
  };

  const fetchWishlistItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/wishlist`);
      setWishlistItems(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const loadCurrentTrip = () => {
    const saved = localStorage.getItem('currentTripPlan');
    if (saved) {
      setCurrentTrip(JSON.parse(saved));
    }
  };

  const saveCurrentTrip = (items: TripPlannerItem[]) => {
    localStorage.setItem('currentTripPlan', JSON.stringify(items));
    setCurrentTrip(items);
  };

  const addToTrip = (item: any) => {
    const tripItem: TripPlannerItem = {
      id: `${Date.now()}-${Math.random()}`,
      type: item.type,
      itemId: item._id,
      title: item.title,
      location: item.location,
      price: item.price,
      images: item.images || [],
      order: currentTrip.length,
      notes: ''
    };

    const updatedTrip = [...currentTrip, tripItem];
    saveCurrentTrip(updatedTrip);
  };

  const removeFromTrip = (itemId: string) => {
    const updatedTrip = currentTrip.filter(item => item.id !== itemId);
    saveCurrentTrip(updatedTrip);
  };

  const updateTripItem = (itemId: string, updates: Partial<TripPlannerItem>) => {
    const updatedTrip = currentTrip.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    saveCurrentTrip(updatedTrip);
  };

  const reorderItems = (startIndex: number, endIndex: number) => {
    const items = Array.from(currentTrip);
    const [reorderedItem] = items.splice(startIndex, 1);
    items.splice(endIndex, 0, reorderedItem);
    
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    saveCurrentTrip(updatedItems);
  };

  const saveTripPlan = async (data: TripFormData) => {
    if (currentTrip.length === 0) {
      alert('Please add some items to your trip before saving.');
      return;
    }

    setLoading(true);
    try {
      const totalCost = currentTrip.reduce((sum, item) => sum + item.price, 0);
      
      const response = await axios.post(`${API_URL}/users/trip-plans`, {
        ...data,
        items: currentTrip,
        totalEstimatedCost: totalCost
      });

      setSavedTrips([response.data.data, ...savedTrips]);
      setShowCreateForm(false);
      reset();
      
      // Clear current trip
      localStorage.removeItem('currentTripPlan');
      setCurrentTrip([]);
      
      alert('Trip plan saved successfully!');
    } catch (error) {
      console.error('Failed to save trip plan:', error);
      alert('Failed to save trip plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTripPlan = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip plan?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/users/trip-plans/${tripId}`);
      setSavedTrips(savedTrips.filter(trip => trip._id !== tripId));
    } catch (error) {
      console.error('Failed to delete trip plan:', error);
      alert('Failed to delete trip plan. Please try again.');
    }
  };

  const loadTripPlan = (trip: SavedTrip) => {
    setCurrentTrip(trip.items);
    localStorage.setItem('currentTripPlan', JSON.stringify(trip.items));
  };

  const getTotalCost = () => {
    return currentTrip.reduce((sum, item) => sum + item.price, 0);
  };

  const getDuration = () => {
    if (currentTrip.length === 0) return 0;
    
    const dates = currentTrip.filter(item => item.date).map(item => new Date(item.date!));
    if (dates.length < 2) return 1;
    
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    return Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Planner</h1>
              <p className="text-gray-600">Plan your perfect Uganda adventure</p>
            </div>
            
            <div className="flex space-x-3">
              {currentTrip.length > 0 && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Save Trip Plan
                </button>
              )}
              <Link
                href="/search"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Add More Items
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Trip */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Current Trip Plan</h2>
                {currentTrip.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {currentTrip.length} items • {getDuration()} days • ${getTotalCost().toFixed(2)} total
                  </div>
                )}
              </div>

              {currentTrip.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-lg font-semibold mb-2">Start Planning Your Trip</h3>
                  <p className="text-gray-600 mb-4">
                    Add accommodations and adventures from your wishlist or search for new ones.
                  </p>
                  <Link
                    href="/search"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Browse Experiences
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTrip
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          {item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {item.type === 'trip' ? '🏔️' : '🏨'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{item.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-green-600">${item.price}</span>
                              <button
                                onClick={() => removeFromTrip(item.id)}
                                className="text-red-600 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3">📍 {item.location}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Date
                              </label>
                              <input
                                type="date"
                                value={item.date || ''}
                                onChange={(e) => updateTripItem(item.id, { date: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <input
                                type="text"
                                value={item.notes || ''}
                                onChange={(e) => updateTripItem(item.id, { notes: e.target.value })}
                                placeholder="Add notes..."
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => index > 0 && reorderItems(index, index - 1)}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => index < currentTrip.length - 1 && reorderItems(index, index + 1)}
                            disabled={index === currentTrip.length - 1}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Add from Wishlist</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wishlistItems.map(item => (
                    <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-full object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              {item.type === 'trip' ? '🏔️' : '🏨'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.title}</h3>
                          <p className="text-gray-600 text-xs">{item.location}</p>
                          <p className="text-green-600 font-bold text-sm">${item.price}</p>
                        </div>
                        
                        <button
                          onClick={() => addToTrip(item)}
                          disabled={currentTrip.some(tripItem => tripItem.itemId === item._id)}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          {currentTrip.some(tripItem => tripItem.itemId === item._id) ? 'Added' : 'Add'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Summary */}
            {currentTrip.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-medium">{currentTrip.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Duration:</span>
                    <span className="font-medium">{getDuration()} days</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accommodations:</span>
                    <span className="font-medium">
                      {currentTrip.filter(item => item.type === 'accommodation').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adventures:</span>
                    <span className="font-medium">
                      {currentTrip.filter(item => item.type === 'trip').length}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                    <span>Total Cost:</span>
                    <span className="text-green-600">${getTotalCost().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Trip Plans */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Saved Trip Plans</h3>
              
              {savedTrips.length === 0 ? (
                <p className="text-gray-600 text-sm">No saved trip plans yet.</p>
              ) : (
                <div className="space-y-3">
                  {savedTrips.map(trip => (
                    <div key={trip._id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{trip.name}</h4>
                          <p className="text-gray-600 text-xs">{trip.description}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {trip.items.length} items • ${trip.totalEstimatedCost.toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={() => loadTripPlan(trip)}
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteTripPlan(trip._id)}
                            className="text-red-600 hover:text-red-700 text-xs"
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
          </div>
        </div>

        {/* Save Trip Plan Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Save Trip Plan</h3>
              
              <form onSubmit={handleSubmit(saveTripPlan)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Name *
                  </label>
                  <input
                    {...register('name', { required: 'Trip name is required' })}
                    type="text"
                    placeholder="My Uganda Adventure"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    placeholder="Describe your trip plan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      {...register('startDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      {...register('endDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      {...register('isPublic')}
                      type="checkbox"
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Make this trip plan public (others can view and copy)</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    {loading ? 'Saving...' : 'Save Trip Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripPlannerPage() {
  return (
    <AuthGuard requireAuth={true}>
      <TripPlannerContent />
    </AuthGuard>
  );
}