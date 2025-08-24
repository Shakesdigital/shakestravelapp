'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';
import ExperienceManager from './ExperienceManager';
import AccommodationManager from './AccommodationManager';
import ListingStatusManager from './ListingStatusManager';

interface ListingBase {
  id: string;
  title: string;
  description: string;
  type: 'experience' | 'accommodation';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';
  featured: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: {
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_person' | 'per_group' | 'per_night' | 'per_room';
  };
  categories: string[];
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  verificationScore: number;
  bookingCount: number;
  revenue: number;
}

interface Experience extends ListingBase {
  type: 'experience';
  duration: {
    value: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  groupSize: {
    min: number;
    max: number;
  };
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  includes: string[];
  excludes: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  languages: string[];
  ageRestriction: {
    min?: number;
    max?: number;
  };
  equipment: string[];
  seasonality: {
    bestMonths: number[];
    available: boolean[];
  };
}

interface Accommodation extends ListingBase {
  type: 'accommodation';
  propertyType: 'hotel' | 'lodge' | 'camp' | 'guesthouse' | 'resort' | 'apartment' | 'villa';
  roomTypes: {
    id: string;
    name: string;
    description: string;
    capacity: number;
    beds: {
      single: number;
      double: number;
      queen: number;
      king: number;
    };
    amenities: string[];
    images: string[];
    basePrice: number;
    available: boolean;
  }[];
  facilities: string[];
  checkInTime: string;
  checkOutTime: string;
  policies: {
    cancellation: string;
    children: string;
    pets: boolean;
    smoking: boolean;
  };
  nearbyAttractions: {
    name: string;
    distance: number;
    type: string;
  }[];
}

type Listing = Experience | Accommodation;

interface ListingsManagerProps {
  userRole: 'admin' | 'manager' | 'owner';
}

export default function ListingsManager({ userRole }: ListingsManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'accommodations' | 'pending'>('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    featured: 'all',
    search: ''
  });
  const [view, setView] = useState<'grid' | 'table'>('table');
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockListings: Listing[] = [
      {
        id: '1',
        title: 'Gorilla Trekking Adventure',
        description: 'Experience the thrill of tracking mountain gorillas in their natural habitat',
        type: 'experience',
        status: 'published',
        featured: true,
        visibility: 'public',
        owner: {
          id: 'owner1',
          name: 'Adventure Uganda Ltd',
          email: 'info@adventureuganda.com',
          avatar: '🏔️'
        },
        location: {
          address: 'Bwindi Impenetrable National Park',
          city: 'Kanungu',
          country: 'Uganda',
          coordinates: { lat: -1.0232, lng: 29.6958 }
        },
        images: [
          { id: 'img1', url: '/images/gorilla-trekking.jpg', caption: 'Mountain Gorilla Family', isPrimary: true },
          { id: 'img2', url: '/images/gorilla-habitat.jpg', caption: 'Forest Trail', isPrimary: false }
        ],
        pricing: {
          basePrice: 800,
          currency: 'USD',
          priceType: 'per_person'
        },
        categories: ['wildlife', 'adventure'],
        tags: ['gorillas', 'trekking', 'wildlife', 'uganda'],
        rating: { average: 4.8, count: 156 },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        verificationScore: 95,
        bookingCount: 128,
        revenue: 102400,
        duration: { value: 1, unit: 'days' },
        groupSize: { min: 2, max: 8 },
        difficulty: 'challenging',
        includes: ['Park permits', 'Professional guide', 'Porter service', 'Lunch'],
        excludes: ['Accommodation', 'Transportation', 'Personal expenses'],
        meetingPoint: 'Bwindi Park Headquarters',
        cancellationPolicy: '48 hours notice required',
        languages: ['English', 'Swahili'],
        ageRestriction: { min: 15 },
        equipment: ['Hiking boots', 'Rain jacket', 'Walking stick'],
        seasonality: {
          bestMonths: [6, 7, 8, 12, 1, 2],
          available: [true, true, true, true, true, true, true, true, true, true, true, true]
        }
      } as Experience,
      {
        id: '2',
        title: 'Nile River Safari Lodge',
        description: 'Luxury safari lodge overlooking the majestic Nile River',
        type: 'accommodation',
        status: 'published',
        featured: false,
        visibility: 'public',
        owner: {
          id: 'owner2',
          name: 'Nile Hospitality Group',
          email: 'reservations@nilelodge.com',
          avatar: '🏨'
        },
        location: {
          address: 'Murchison Falls National Park',
          city: 'Masindi',
          country: 'Uganda',
          coordinates: { lat: 2.2734, lng: 31.8440 }
        },
        images: [
          { id: 'img3', url: '/images/nile-lodge-exterior.jpg', caption: 'Lodge Exterior', isPrimary: true },
          { id: 'img4', url: '/images/nile-lodge-room.jpg', caption: 'Deluxe Room', isPrimary: false }
        ],
        pricing: {
          basePrice: 250,
          currency: 'USD',
          priceType: 'per_night'
        },
        categories: ['accommodation', 'luxury'],
        tags: ['safari', 'nile', 'luxury', 'wildlife'],
        rating: { average: 4.6, count: 89 },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        verificationScore: 88,
        bookingCount: 67,
        revenue: 16750,
        propertyType: 'lodge',
        roomTypes: [
          {
            id: 'room1',
            name: 'Deluxe River View',
            description: 'Spacious room with panoramic Nile views',
            capacity: 2,
            beds: { single: 0, double: 0, queen: 1, king: 0 },
            amenities: ['Air conditioning', 'Private balcony', 'Mini bar', 'WiFi'],
            images: ['/images/deluxe-room.jpg'],
            basePrice: 250,
            available: true
          },
          {
            id: 'room2',
            name: 'Family Suite',
            description: 'Perfect for families with children',
            capacity: 4,
            beds: { single: 2, double: 1, queen: 0, king: 0 },
            amenities: ['Air conditioning', 'Living area', 'Mini fridge', 'WiFi'],
            images: ['/images/family-suite.jpg'],
            basePrice: 400,
            available: true
          }
        ],
        facilities: ['Restaurant', 'Swimming pool', 'Spa', 'Game drives', 'Boat trips'],
        checkInTime: '14:00',
        checkOutTime: '11:00',
        policies: {
          cancellation: '24 hours notice required',
          children: 'Children under 12 stay free',
          pets: false,
          smoking: false
        },
        nearbyAttractions: [
          { name: 'Murchison Falls', distance: 5, type: 'waterfall' },
          { name: 'Game Reserve', distance: 0, type: 'wildlife' }
        ]
      } as Accommodation,
      {
        id: '3',
        title: 'White Water Rafting Experience',
        description: 'Thrilling white water rafting on the Nile River',
        type: 'experience',
        status: 'pending',
        featured: false,
        visibility: 'private',
        owner: {
          id: 'owner3',
          name: 'Nile Adventures',
          email: 'info@nileadventures.com',
          avatar: '🚣'
        },
        location: {
          address: 'Jinja',
          city: 'Jinja',
          country: 'Uganda',
          coordinates: { lat: 0.4236, lng: 33.2042 }
        },
        images: [
          { id: 'img5', url: '/images/rafting1.jpg', caption: 'Rapids Action', isPrimary: true }
        ],
        pricing: {
          basePrice: 120,
          currency: 'USD',
          priceType: 'per_person'
        },
        categories: ['adventure', 'water-sports'],
        tags: ['rafting', 'nile', 'adventure', 'jinja'],
        rating: { average: 4.5, count: 23 },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        verificationScore: 72,
        bookingCount: 15,
        revenue: 1800,
        duration: { value: 6, unit: 'hours' },
        groupSize: { min: 4, max: 16 },
        difficulty: 'moderate',
        includes: ['Safety equipment', 'Professional guide', 'Lunch', 'Transportation'],
        excludes: ['Personal insurance', 'Gratuities'],
        meetingPoint: 'Nile River Explorers Base',
        cancellationPolicy: '24 hours notice required',
        languages: ['English'],
        ageRestriction: { min: 12 },
        equipment: ['Helmet', 'Life jacket', 'Paddle'],
        seasonality: {
          bestMonths: [3, 4, 5, 6, 7, 8, 9, 10, 11],
          available: [true, true, true, true, true, true, true, true, true, true, true, false]
        }
      } as Experience
    ];

    setListings(mockListings);
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesStatus = filters.status === 'all' || listing.status === filters.status;
    const matchesType = filters.type === 'all' || listing.type === filters.type;
    const matchesFeatured = filters.featured === 'all' || 
      (filters.featured === 'yes' && listing.featured) ||
      (filters.featured === 'no' && !listing.featured);
    const matchesSearch = !filters.search || 
      listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.owner.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesType && matchesFeatured && matchesSearch;
  });

  const pendingListings = listings.filter(listing => listing.status === 'pending');

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on ${selectedListings.length} listings`);
    // Implement bulk actions
    setSelectedListings([]);
    setShowBulkActions(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      pending: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
      approved: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
      published: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
      archived: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getVerificationColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', count: listings.length },
    { id: 'experiences', label: 'Experiences', icon: '🏔️', count: listings.filter(l => l.type === 'experience').length },
    { id: 'accommodations', label: 'Accommodations', icon: '🏨', count: listings.filter(l => l.type === 'accommodation').length },
    { id: 'pending', label: 'Pending Review', icon: '⏳', count: pendingListings.length, highlight: pendingListings.length > 0 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏷️ Listings Management
          </h1>
          <HelpTooltip content="Manage travel experiences and accommodations. Review, approve, and optimize listings for maximum bookings." />
        </div>
        
        <div className="flex items-center space-x-3">
          {selectedListings.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedListings.length} selected
              </span>
              <AnimatedButton
                onClick={() => setShowBulkActions(true)}
                variant="secondary"
                size="sm"
              >
                🔧 Bulk Actions
              </AnimatedButton>
            </div>
          )}
          <AnimatedButton variant="primary">
            ➕ Add New Listing
          </AnimatedButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {listings.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Listings</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingListings.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Pending Review</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⭐</div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {listings.filter(l => l.featured).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Featured</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3">💰</div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${listings.reduce((sum, l) => sum + l.revenue, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                tab.highlight 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex-1 max-w-md relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    placeholder="Search listings..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="rejected">Rejected</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="experience">Experiences</option>
                    <option value="accommodation">Accommodations</option>
                  </select>
                </div>

                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                  <button
                    onClick={() => setView('table')}
                    className={`p-1 rounded ${view === 'table' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                  >
                    📋
                  </button>
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1 rounded ${view === 'grid' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                  >
                    ⊞
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {view === 'table' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedListings(filteredListings.map(l => l.id));
                            } else {
                              setSelectedListings([]);
                            }
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Listing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedListings.includes(listing.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedListings([...selectedListings, listing.id]);
                              } else {
                                setSelectedListings(selectedListings.filter(id => id !== listing.id));
                              }
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              {listing.images[0] ? (
                                <img
                                  className="h-12 w-12 rounded-lg object-cover"
                                  src={listing.images[0].url}
                                  alt={listing.title}
                                />
                              ) : (
                                <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <span className="text-gray-500 text-xl">
                                    {listing.type === 'experience' ? '🏔️' : '🏨'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {listing.title}
                                </div>
                                {listing.featured && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                    ⭐ Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                {listing.description}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                📍 {listing.location.city}, {listing.location.country}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            {listing.type === 'experience' ? '🏔️' : '🏨'} {listing.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <span className="mr-2">{listing.owner.avatar}</span>
                            <div>
                              <div className="font-medium">{listing.owner.name}</div>
                              <div className="text-xs">{listing.owner.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div>
                            <div className="flex items-center">
                              <span className="text-yellow-500">⭐</span>
                              <span className="ml-1">{listing.rating.average}</span>
                              <span className="ml-1">({listing.rating.count})</span>
                            </div>
                            <div className="text-xs">
                              📅 {listing.bookingCount} bookings
                            </div>
                            <div className="text-xs font-medium text-green-600">
                              💰 ${listing.revenue.toLocaleString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${getVerificationColor(listing.verificationScore)}`}>
                              {listing.verificationScore}%
                            </span>
                            <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  listing.verificationScore >= 90 ? 'bg-green-500' :
                                  listing.verificationScore >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${listing.verificationScore}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              👁️ View
                            </button>
                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                              ✏️ Edit
                            </button>
                            {userRole === 'admin' && listing.status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                  ✅ Approve
                                </button>
                                <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                  ❌ Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {filteredListings.map((listing) => (
                  <div key={listing.id} className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      {listing.images[0] ? (
                        <img
                          className="w-full h-48 object-cover"
                          src={listing.images[0].url}
                          alt={listing.title}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 text-4xl">
                            {listing.type === 'experience' ? '🏔️' : '🏨'}
                          </span>
                        </div>
                      )}
                      {listing.featured && (
                        <span className="absolute top-2 left-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {listing.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>📍 {listing.location.city}</span>
                        <span>⭐ {listing.rating.average} ({listing.rating.count})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          ${listing.pricing.basePrice}
                          <span className="text-sm font-normal text-gray-500">
                            /{listing.pricing.priceType.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md">
                            👁️
                          </button>
                          <button className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md">
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'experiences' && (
        <ExperienceManager 
          experiences={listings.filter(l => l.type === 'experience') as Experience[]}
          userRole={userRole}
          onUpdate={(updatedExperiences) => {
            setListings(prev => [
              ...prev.filter(l => l.type !== 'experience'),
              ...updatedExperiences
            ]);
          }}
        />
      )}

      {activeTab === 'accommodations' && (
        <AccommodationManager 
          accommodations={listings.filter(l => l.type === 'accommodation') as Accommodation[]}
          userRole={userRole}
          onUpdate={(updatedAccommodations) => {
            setListings(prev => [
              ...prev.filter(l => l.type !== 'accommodation'),
              ...updatedAccommodations
            ]);
          }}
        />
      )}

      {activeTab === 'pending' && (
        <ListingStatusManager 
          listings={pendingListings}
          userRole={userRole}
          onStatusUpdate={(listingId, newStatus) => {
            setListings(prev => prev.map(l => 
              l.id === listingId ? { ...l, status: newStatus } : l
            ));
          }}
        />
      )}

      {/* Bulk Actions Modal */}
      {showBulkActions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                🔧 Bulk Actions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Apply actions to {selectedListings.length} selected listings
              </p>
              
              <div className="space-y-3">
                <AnimatedButton
                  onClick={() => handleBulkAction('publish')}
                  variant="primary"
                  className="w-full justify-center"
                >
                  📢 Publish All
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => handleBulkAction('feature')}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  ⭐ Mark as Featured
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => handleBulkAction('archive')}
                  variant="secondary"
                  className="w-full justify-center"
                >
                  📦 Archive All
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => handleBulkAction('delete')}
                  variant="secondary"
                  className="w-full justify-center text-red-600"
                >
                  🗑️ Delete All
                </AnimatedButton>
              </div>

              <div className="flex items-center space-x-3 mt-6">
                <AnimatedButton
                  onClick={() => setShowBulkActions(false)}
                  variant="secondary"
                  className="flex-1 justify-center"
                >
                  Cancel
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}