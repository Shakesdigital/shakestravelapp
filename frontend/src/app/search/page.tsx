'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import Link from 'next/link';

interface SearchFilters {
  q: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  type: 'all' | 'accommodation' | 'experience' | 'destination';
  priceMin: number;
  priceMax: number;
  rating: number;
  amenities: string[];
}

interface SearchResult {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  location: string;
  images: string[];
  type: 'accommodation' | 'trip';
  amenities: string[];
  reviews: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { register, handleSubmit, watch, setValue } = useForm<SearchFilters>({
    defaultValues: {
      q: searchParams?.get('q') || '',
      destination: searchParams?.get('destination') || '',
      checkIn: searchParams?.get('checkIn') || '',
      checkOut: searchParams?.get('checkOut') || '',
      guests: Number(searchParams?.get('guests')) || 2,
      type: (searchParams?.get('type') as any) || 'all',
      priceMin: 0,
      priceMax: 1000,
      rating: 0,
      amenities: []
    }
  });

  const searchData = async (filters: SearchFilters) => {
    setLoading(true);
    try {
      const searchParams: any = {};
      
      // Add query parameters
      if (filters.q) searchParams.query = filters.q;
      if (filters.destination) searchParams.destination = filters.destination;
      if (filters.checkIn) searchParams.startDate = filters.checkIn;
      if (filters.checkOut) searchParams.endDate = filters.checkOut;
      if (filters.guests) searchParams.guests = filters.guests;
      if (filters.priceMin) searchParams.minPrice = filters.priceMin;
      if (filters.priceMax) searchParams.priceMax = filters.priceMax;
      if (filters.rating) searchParams.rating = filters.rating;
      if (filters.amenities.length) searchParams.amenities = filters.amenities;

      let response;
      
      // Use appropriate endpoint based on type
      if (filters.type === 'accommodation') {
        response = await api.search.accommodations(searchParams);
      } else if (filters.type === 'experience') {
        response = await api.search.trips(searchParams);
      } else {
        response = await api.search.all(searchParams);
      }
      
      // Handle different response structures
      const data = response.data;
      if (data.success && data.data) {
        if (Array.isArray(data.data)) {
          setResults(data.data);
        } else if (data.data.results) {
          setResults(data.data.results);
        } else if (data.data.trips || data.data.accommodations) {
          const allResults = [
            ...(data.data.trips || []).map((item: any) => ({ ...item, type: 'trip' })),
            ...(data.data.accommodations || []).map((item: any) => ({ ...item, type: 'accommodation' }))
          ];
          setResults(allResults);
        } else {
          setResults([]);
        }
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filters = {
      q: searchParams?.get('q') || '',
      destination: searchParams?.get('destination') || '',
      checkIn: searchParams?.get('checkIn') || searchParams?.get('checkIn') || '',
      checkOut: searchParams?.get('checkOut') || searchParams?.get('checkOut') || '',
      guests: Number(searchParams?.get('guests')) || 2,
      type: (searchParams?.get('type') as any) || 'all',
      priceMin: 0,
      priceMax: 1000,
      rating: 0,
      amenities: []
    };
    
    // Auto-search if there's a query parameter
    if (filters.q || filters.destination) {
      searchData(filters);
    }
  }, [searchParams]);

  const onSubmit = (data: SearchFilters) => {
    searchData(data);
  };

  const availableAmenities = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Pet Friendly',
    'Air Conditioning', 'Room Service', 'Bar', 'Business Center', 'Laundry'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Main Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <input
                  {...register('q')}
                  type="text"
                  placeholder="Search destinations, accommodations, or experiences..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="md:col-span-1">
                <input
                  {...register('destination')}
                  type="text"
                  placeholder="Destination"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            <div>
              <input
                {...register('checkIn')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <input
                {...register('checkOut')}
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <select
                {...register('guests')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </form>
          
          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    {...register('type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="all">All</option>
                    <option value="destination">Destinations</option>
                    <option value="accommodation">Accommodations</option>
                    <option value="experience">Adventures & Experiences</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range (USD)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register('priceMin')}
                      type="number"
                      placeholder="Min"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      {...register('priceMax')}
                      type="number"
                      placeholder="Max"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                  <select
                    {...register('rating')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value="0">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium mb-2">Amenities</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          value={amenity}
                          {...register('amenities')}
                          className="mr-2 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSubmit(onSubmit)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching Uganda experiences...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {results.length} result{results.length !== 1 ? 's' : ''} found
                  </h2>
                  <select className="px-3 py-2 border border-gray-300 rounded-md">
                    <option>Sort by: Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                  </select>
                </div>

                {results.length === 0 ? (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.map(result => {
                      const isTrip = result.type === 'trip';
                      const isAccommodation = result.type === 'accommodation';
                      const displayTitle = result.title || result.name;
                      const displayPrice = result.price || result.pricePerNight;
                      const reviewCount = result.reviews || result.reviewCount;
                      
                      return (
                        <Link
                          key={result._id}
                          href={`/${isAccommodation ? 'accommodations' : 'trips'}/${result._id}`}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative">
                            {result.images?.length > 0 && (
                              <img
                                src={result.images[0]}
                                alt={displayTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            {displayPrice && (
                              <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-md text-sm font-semibold">
                                ${displayPrice}{isAccommodation ? '/night' : ''}
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
                                isAccommodation ? 'bg-green-600' : isTrip ? 'bg-blue-600' : 'bg-purple-600'
                              }`}>
                                {isAccommodation ? 'Stay' : isTrip ? 'Experience' : 'Destination'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">{displayTitle}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{result.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {result.rating && (
                                  <>
                                    <div className="flex text-yellow-400">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < Math.floor(result.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                          ★
                                        </span>
                                      ))}
                                    </div>
                                    <span className="ml-1 text-sm text-gray-600">
                                      {result.rating} {reviewCount && `(${reviewCount} reviews)`}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center">
                              <span className="mr-1">📍</span>
                              {result.location}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 py-8"><div className="max-w-7xl mx-auto px-4"><div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div><p className="mt-4 text-gray-600">Loading search...</p></div></div></div>}>
      <SearchPageContent />
    </Suspense>
  );
}