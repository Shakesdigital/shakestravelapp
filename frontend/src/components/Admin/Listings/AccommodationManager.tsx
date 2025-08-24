'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Accommodation {
  id: string;
  title: string;
  description: string;
  type: 'accommodation';
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
    roomType?: string;
  }[];
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
    roomCount: number;
    size: number; // in sq meters
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
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_night' | 'per_room';
    seasonalRates?: {
      season: string;
      startDate: Date;
      endDate: Date;
      multiplier: number;
    }[];
  };
  availability: {
    calendar: {
      [date: string]: {
        available: boolean;
        price?: number;
        minStay?: number;
      };
    };
    blackoutDates: Date[];
    advanceBooking: {
      min: number;
      max: number;
    };
  };
  categories: string[];
  tags: string[];
  rating: {
    average: number;
    count: number;
    breakdown: {
      cleanliness: number;
      location: number;
      service: number;
      value: number;
      facilities: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  verificationScore: number;
  bookingCount: number;
  revenue: number;
}

interface AccommodationManagerProps {
  accommodations: Accommodation[];
  userRole: 'admin' | 'manager' | 'owner';
  onUpdate: (accommodations: Accommodation[]) => void;
}

const propertyTemplates = [
  {
    id: 'safari-lodge',
    name: 'Safari Lodge',
    description: 'Luxury lodge near national parks',
    icon: '🏨',
    propertyType: 'lodge' as const,
    facilities: ['Restaurant', 'Bar', 'Swimming pool', 'Spa', 'Game drives', 'Conference room'],
    roomTypes: [
      {
        name: 'Standard Safari Room',
        description: 'Comfortable room with savanna views',
        capacity: 2,
        beds: { single: 0, double: 1, queen: 0, king: 0 },
        amenities: ['Air conditioning', 'Private bathroom', 'Mini bar', 'Balcony', 'WiFi'],
        basePrice: 250,
        size: 35
      },
      {
        name: 'Luxury Safari Suite',
        description: 'Spacious suite with panoramic views',
        capacity: 4,
        beds: { single: 0, double: 0, queen: 1, king: 1 },
        amenities: ['Air conditioning', 'Private bathroom', 'Living area', 'Mini bar', 'Balcony', 'WiFi'],
        basePrice: 450,
        size: 65
      }
    ]
  },
  {
    id: 'eco-camp',
    name: 'Eco Camp',
    description: 'Sustainable camping experience',
    icon: '⛺',
    propertyType: 'camp' as const,
    facilities: ['Restaurant', 'Campfire area', 'Nature walks', 'Bike rental', 'Solar power'],
    roomTypes: [
      {
        name: 'Safari Tent',
        description: 'Comfortable canvas tent with modern amenities',
        capacity: 2,
        beds: { single: 0, double: 1, queen: 0, king: 0 },
        amenities: ['Shared bathroom', 'Solar lighting', 'Mosquito nets', 'Storage space'],
        basePrice: 120,
        size: 20
      },
      {
        name: 'Luxury Glamping',
        description: 'Upscale tent with private facilities',
        capacity: 3,
        beds: { single: 1, double: 1, queen: 0, king: 0 },
        amenities: ['Private bathroom', 'Solar lighting', 'Mosquito nets', 'Mini fridge', 'Deck'],
        basePrice: 200,
        size: 40
      }
    ]
  },
  {
    id: 'mountain-resort',
    name: 'Mountain Resort',
    description: 'High-altitude luxury resort',
    icon: '🏔️',
    propertyType: 'resort' as const,
    facilities: ['Restaurant', 'Spa', 'Gym', 'Hiking trails', 'Conference facilities', 'Kids club'],
    roomTypes: [
      {
        name: 'Mountain View Room',
        description: 'Room with stunning mountain vistas',
        capacity: 2,
        beds: { single: 0, double: 0, queen: 1, king: 0 },
        amenities: ['Heating', 'Private bathroom', 'Mountain view', 'WiFi', 'Room service'],
        basePrice: 180,
        size: 30
      },
      {
        name: 'Alpine Suite',
        description: 'Spacious suite with fireplace',
        capacity: 4,
        beds: { single: 0, double: 1, queen: 0, king: 1 },
        amenities: ['Heating', 'Fireplace', 'Private bathroom', 'Living area', 'Mountain view', 'WiFi'],
        basePrice: 350,
        size: 55
      }
    ]
  }
];

export default function AccommodationManager({ accommodations, userRole, onUpdate }: AccommodationManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeStep, setActiveStep] = useState(1);
  const [activeRoomType, setActiveRoomType] = useState<string>('');
  const [showPricingCalendar, setShowPricingCalendar] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Accommodation>>({});

  const steps = [
    { id: 1, title: 'Property Info', icon: '🏨' },
    { id: 2, title: 'Room Types', icon: '🛏️' },
    { id: 3, title: 'Facilities', icon: '🏊' },
    { id: 4, title: 'Media', icon: '📸' },
    { id: 5, title: 'Pricing', icon: '💰' },
    { id: 6, title: 'Policies', icon: '📋' },
    { id: 7, title: 'Review', icon: '✅' }
  ];

  const commonFacilities = [
    'Restaurant', 'Bar', 'Swimming pool', 'Spa', 'Gym', 'WiFi',
    'Parking', 'Room service', 'Laundry', 'Conference room', 
    'Business center', 'Kids club', 'Pet friendly', 'Airport shuttle',
    'Game drives', 'Nature walks', 'Boat trips', 'Fishing',
    'Solar power', 'Generator backup', 'Medical services'
  ];

  const commonAmenities = [
    'Air conditioning', 'Heating', 'Private bathroom', 'Shared bathroom',
    'Hot water', 'WiFi', 'TV', 'Mini bar', 'Mini fridge', 'Safe',
    'Balcony', 'Terrace', 'Garden view', 'Lake view', 'Mountain view',
    'Room service', 'Housekeeping', 'Mosquito nets', 'Fan'
  ];

  const initializeForm = (template?: typeof propertyTemplates[0]) => {
    const baseForm = {
      title: '',
      description: '',
      type: 'accommodation' as const,
      status: 'draft' as const,
      featured: false,
      visibility: 'public' as const,
      location: {
        address: '',
        city: '',
        country: 'Uganda',
        coordinates: { lat: 0, lng: 0 }
      },
      images: [],
      roomTypes: [],
      facilities: [],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      policies: {
        cancellation: '24 hours notice required',
        children: 'Children welcome',
        pets: false,
        smoking: false
      },
      nearbyAttractions: [],
      pricing: {
        basePrice: 0,
        currency: 'USD',
        priceType: 'per_night' as const
      },
      availability: {
        calendar: {},
        blackoutDates: [],
        advanceBooking: { min: 1, max: 365 }
      },
      categories: [],
      tags: []
    };

    if (template) {
      return {
        ...baseForm,
        propertyType: template.propertyType,
        facilities: template.facilities,
        roomTypes: template.roomTypes.map((room, index) => ({
          id: `room-${index}`,
          ...room,
          images: [],
          available: true,
          roomCount: 1
        }))
      };
    }

    return baseForm;
  };

  const handleCreateAccommodation = () => {
    setEditingAccommodation(null);
    setSelectedTemplate('');
    setFormData(initializeForm());
    setActiveStep(1);
    setShowCreateModal(true);
  };

  const handleEditAccommodation = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setFormData(accommodation);
    setActiveStep(1);
    setShowCreateModal(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = propertyTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(initializeForm(template));
    }
  };

  const handleSaveAccommodation = () => {
    if (!formData.title || !formData.description) return;

    const accommodationData: Accommodation = {
      id: editingAccommodation?.id || Math.random().toString(36).substr(2, 9),
      owner: editingAccommodation?.owner || {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      rating: editingAccommodation?.rating || { 
        average: 0, 
        count: 0, 
        breakdown: { cleanliness: 0, location: 0, service: 0, value: 0, facilities: 0 }
      },
      createdAt: editingAccommodation?.createdAt || new Date(),
      updatedAt: new Date(),
      verificationScore: editingAccommodation?.verificationScore || 50,
      bookingCount: editingAccommodation?.bookingCount || 0,
      revenue: editingAccommodation?.revenue || 0,
      ...formData
    } as Accommodation;

    const updatedAccommodations = editingAccommodation
      ? accommodations.map(acc => acc.id === editingAccommodation.id ? accommodationData : acc)
      : [...accommodations, accommodationData];

    onUpdate(updatedAccommodations);
    setShowCreateModal(false);
    setFormData({});
  };

  const addRoomType = () => {
    const newRoom = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      capacity: 2,
      beds: { single: 0, double: 1, queen: 0, king: 0 },
      amenities: [],
      images: [],
      basePrice: 100,
      available: true,
      roomCount: 1,
      size: 25
    };
    
    setFormData({
      ...formData,
      roomTypes: [...(formData.roomTypes || []), newRoom]
    });
  };

  const updateRoomType = (roomId: string, updates: any) => {
    setFormData({
      ...formData,
      roomTypes: (formData.roomTypes || []).map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      )
    });
  };

  const removeRoomType = (roomId: string) => {
    setFormData({
      ...formData,
      roomTypes: (formData.roomTypes || []).filter(room => room.id !== roomId)
    });
  };

  const addNearbyAttraction = () => {
    setFormData({
      ...formData,
      nearbyAttractions: [
        ...(formData.nearbyAttractions || []),
        { name: '', distance: 0, type: '' }
      ]
    });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🏨 Accommodation Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage properties with room types, pricing calendars, and booking availability
          </p>
        </div>
        <AnimatedButton onClick={handleCreateAccommodation} variant="primary">
          ➕ Add Property
        </AnimatedButton>
      </div>

      {/* Property Templates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          🏨 Property Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {propertyTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                handleTemplateSelect(template.id);
                setShowCreateModal(true);
              }}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 hover:border-green-500"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {template.description}
                </p>
                <div className="text-xs">
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded mr-1">
                    {template.roomTypes.length} room types
                  </span>
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                    {template.facilities.length} facilities
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodations List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Active Properties ({accommodations.length})
          </h3>
        </div>

        {accommodations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Rooms & Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {accommodations.map((accommodation) => (
                  <tr key={accommodation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {accommodation.images[0] ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={accommodation.images[0].url}
                              alt={accommodation.title}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <span className="text-gray-500 text-xl">🏨</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {accommodation.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            📍 {accommodation.location.city}, {accommodation.location.country}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {accommodation.propertyType} • {accommodation.facilities.length} facilities
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="mr-2">🏠</span>
                          {accommodation.propertyType}
                        </div>
                        <div className="flex items-center mb-1">
                          <span className="mr-2">🕐</span>
                          Check-in: {accommodation.checkInTime}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">🕑</span>
                          Check-out: {accommodation.checkOutTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white mb-1">
                          {accommodation.roomTypes.length} room types
                        </div>
                        <div className="text-xs space-y-1">
                          {accommodation.roomTypes.slice(0, 2).map((room) => (
                            <div key={room.id} className="flex justify-between">
                              <span>{room.name}</span>
                              <span className="font-medium">${room.basePrice}/night</span>
                            </div>
                          ))}
                          {accommodation.roomTypes.length > 2 && (
                            <div className="text-gray-400">+{accommodation.roomTypes.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center mb-1">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span>{accommodation.rating.average}</span>
                        <span className="text-gray-400 ml-1">({accommodation.rating.count})</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        📅 {accommodation.bookingCount} bookings
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        💰 ${accommodation.revenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        accommodation.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : accommodation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {accommodation.status}
                      </span>
                      {accommodation.featured && (
                        <span className="block mt-1 text-xs text-yellow-600">⭐ Featured</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowPricingCalendar(accommodation.id)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        >
                          📅 Calendar
                        </button>
                        <button
                          onClick={() => handleEditAccommodation(accommodation)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          ✏️ Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Properties Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first accommodation listing using our professional templates.
            </p>
            <AnimatedButton onClick={handleCreateAccommodation} variant="primary">
              ➕ Add Your First Property
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingAccommodation ? 'Edit Property' : 'Create New Property'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Step Progress */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center ${
                      step.id === activeStep
                        ? 'text-green-600'
                        : step.id < activeStep
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.id === activeStep
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                        : step.id < activeStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {step.id < activeStep ? '✓' : step.id}
                    </div>
                    <div className="ml-2 text-xs font-medium hidden md:block">
                      {step.icon} {step.title}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`ml-4 w-8 md:w-12 h-px ${
                        step.id < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="px-6 py-6">
              {activeStep === 1 && (
                <div className="space-y-6">
                  {!editingAccommodation && selectedTemplate && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {propertyTemplates.find(t => t.id === selectedTemplate)?.icon}
                        </span>
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Using Template: {propertyTemplates.find(t => t.id === selectedTemplate)?.name}
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Pre-configured with room types and facilities
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Property Name *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Safari Lodge Murchison Falls"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Property Type *
                      </label>
                      <select
                        value={formData.propertyType || ''}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select type</option>
                        <option value="hotel">Hotel</option>
                        <option value="lodge">Lodge</option>
                        <option value="camp">Camp</option>
                        <option value="guesthouse">Guesthouse</option>
                        <option value="resort">Resort</option>
                        <option value="apartment">Apartment</option>
                        <option value="villa">Villa</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your property in detail..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location!, city: e.target.value }
                        })}
                        placeholder="Kampala"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-in Time
                      </label>
                      <input
                        type="time"
                        value={formData.checkInTime || '14:00'}
                        onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-out Time
                      </label>
                      <input
                        type="time"
                        value={formData.checkOutTime || '11:00'}
                        onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      🛏️ Room Types
                    </h4>
                    <AnimatedButton onClick={addRoomType} variant="secondary" size="sm">
                      ➕ Add Room Type
                    </AnimatedButton>
                  </div>

                  <div className="space-y-6">
                    {(formData.roomTypes || []).map((room, index) => (
                      <div key={room.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            Room Type {index + 1}
                          </h5>
                          <button
                            onClick={() => removeRoomType(room.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️ Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Room Name *
                            </label>
                            <input
                              type="text"
                              value={room.name}
                              onChange={(e) => updateRoomType(room.id, { name: e.target.value })}
                              placeholder="Deluxe Safari Room"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Capacity
                            </label>
                            <input
                              type="number"
                              value={room.capacity}
                              onChange={(e) => updateRoomType(room.id, { capacity: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="1"
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={room.description}
                            onChange={(e) => updateRoomType(room.id, { description: e.target.value })}
                            placeholder="Room description..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            rows={2}
                          />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Single Beds
                            </label>
                            <input
                              type="number"
                              value={room.beds.single}
                              onChange={(e) => updateRoomType(room.id, { 
                                beds: { ...room.beds, single: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Double Beds
                            </label>
                            <input
                              type="number"
                              value={room.beds.double}
                              onChange={(e) => updateRoomType(room.id, { 
                                beds: { ...room.beds, double: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Queen Beds
                            </label>
                            <input
                              type="number"
                              value={room.beds.queen}
                              onChange={(e) => updateRoomType(room.id, { 
                                beds: { ...room.beds, queen: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              King Beds
                            </label>
                            <input
                              type="number"
                              value={room.beds.king}
                              onChange={(e) => updateRoomType(room.id, { 
                                beds: { ...room.beds, king: parseInt(e.target.value) || 0 }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Base Price (per night) *
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <input
                                type="number"
                                value={room.basePrice}
                                onChange={(e) => updateRoomType(room.id, { basePrice: parseFloat(e.target.value) })}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Room Count
                            </label>
                            <input
                              type="number"
                              value={room.roomCount}
                              onChange={(e) => updateRoomType(room.id, { roomCount: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                              min="1"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Size (sq m)
                            </label>
                            <input
                              type="number"
                              value={room.size}
                              onChange={(e) => updateRoomType(room.id, { size: parseFloat(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Room Amenities
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                            {commonAmenities.map((amenity) => (
                              <label key={amenity} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={room.amenities.includes(amenity)}
                                  onChange={(e) => {
                                    const updatedAmenities = e.target.checked
                                      ? [...room.amenities, amenity]
                                      : room.amenities.filter(a => a !== amenity);
                                    updateRoomType(room.id, { amenities: updatedAmenities });
                                  }}
                                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{amenity}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(formData.roomTypes || []).length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="text-4xl mb-4">🛏️</div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No room types added yet
                      </p>
                      <AnimatedButton onClick={addRoomType} variant="primary">
                        ➕ Add Your First Room Type
                      </AnimatedButton>
                    </div>
                  )}
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    🏊 Property Facilities
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {commonFacilities.map((facility) => (
                      <label key={facility} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={(formData.facilities || []).includes(facility)}
                          onChange={(e) => {
                            const updatedFacilities = e.target.checked
                              ? [...(formData.facilities || []), facility]
                              : (formData.facilities || []).filter(f => f !== facility);
                            setFormData({ ...formData, facilities: updatedFacilities });
                          }}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{facility}</span>
                      </label>
                    ))}
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-4">
                      📍 Nearby Attractions
                    </h5>
                    <div className="space-y-3">
                      {(formData.nearbyAttractions || []).map((attraction, index) => (
                        <div key={index} className="grid grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={attraction.name}
                            onChange={(e) => {
                              const updated = [...(formData.nearbyAttractions || [])];
                              updated[index] = { ...attraction, name: e.target.value };
                              setFormData({ ...formData, nearbyAttractions: updated });
                            }}
                            placeholder="Attraction name"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          />
                          <input
                            type="number"
                            value={attraction.distance}
                            onChange={(e) => {
                              const updated = [...(formData.nearbyAttractions || [])];
                              updated[index] = { ...attraction, distance: parseFloat(e.target.value) };
                              setFormData({ ...formData, nearbyAttractions: updated });
                            }}
                            placeholder="Distance (km)"
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          />
                          <div className="flex items-center space-x-2">
                            <select
                              value={attraction.type}
                              onChange={(e) => {
                                const updated = [...(formData.nearbyAttractions || [])];
                                updated[index] = { ...attraction, type: e.target.value };
                                setFormData({ ...formData, nearbyAttractions: updated });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                            >
                              <option value="">Type</option>
                              <option value="wildlife">Wildlife</option>
                              <option value="waterfall">Waterfall</option>
                              <option value="cultural">Cultural</option>
                              <option value="adventure">Adventure</option>
                              <option value="shopping">Shopping</option>
                              <option value="restaurant">Restaurant</option>
                            </select>
                            <button
                              onClick={() => {
                                const updated = (formData.nearbyAttractions || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, nearbyAttractions: updated });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <AnimatedButton
                      onClick={addNearbyAttraction}
                      variant="secondary"
                      size="sm"
                      className="mt-3"
                    >
                      ➕ Add Attraction
                    </AnimatedButton>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      📸 Property Photos
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">📷</div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Upload high-quality photos of your property and rooms
                      </p>
                      <AnimatedButton variant="secondary">
                        📁 Upload Photos
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    💰 Pricing & Availability
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Currency
                      </label>
                      <select
                        value={formData.pricing?.currency || 'USD'}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing!, currency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="UGX">UGX - Ugandan Shilling</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Advance Booking (days)
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={formData.availability?.advanceBooking?.min || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            availability: {
                              ...formData.availability!,
                              advanceBooking: {
                                ...formData.availability!.advanceBooking,
                                min: parseInt(e.target.value)
                              }
                            }
                          })}
                          placeholder="Min"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="number"
                          value={formData.availability?.advanceBooking?.max || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            availability: {
                              ...formData.availability!,
                              advanceBooking: {
                                ...formData.availability!.advanceBooking,
                                max: parseInt(e.target.value)
                              }
                            }
                          })}
                          placeholder="Max"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      📅 Pricing Calendar
                    </h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Individual room pricing is set in Room Types section. Use the calendar after saving to set seasonal rates and availability.
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 6 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    📋 Property Policies
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cancellation Policy
                    </label>
                    <textarea
                      value={formData.policies?.cancellation || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        policies: { ...formData.policies!, cancellation: e.target.value }
                      })}
                      placeholder="Describe your cancellation policy..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Children Policy
                    </label>
                    <textarea
                      value={formData.policies?.children || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        policies: { ...formData.policies!, children: e.target.value }
                      })}
                      placeholder="Describe your policy for children..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="pets"
                        checked={formData.policies?.pets || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          policies: { ...formData.policies!, pets: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="pets" className="text-sm text-gray-700 dark:text-gray-300">
                        🐕 Pets Allowed
                      </label>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="smoking"
                        checked={formData.policies?.smoking || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          policies: { ...formData.policies!, smoking: e.target.checked }
                        })}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="smoking" className="text-sm text-gray-700 dark:text-gray-300">
                        🚬 Smoking Allowed
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 7 && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-4">
                      ✅ Property Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Property:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Type:</strong> {formData.propertyType}
                      </div>
                      <div>
                        <strong>Location:</strong> {formData.location?.city}, {formData.location?.country}
                      </div>
                      <div>
                        <strong>Room Types:</strong> {(formData.roomTypes || []).length}
                      </div>
                      <div>
                        <strong>Facilities:</strong> {(formData.facilities || []).length}
                      </div>
                      <div>
                        <strong>Check-in/out:</strong> {formData.checkInTime} / {formData.checkOutTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                      ⭐ Mark as Featured Property
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publication Status
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="pending">Submit for Review</option>
                      {userRole === 'admin' && <option value="published">Publish Immediately</option>}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                {activeStep > 1 && (
                  <AnimatedButton
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="secondary"
                  >
                    ← Previous
                  </AnimatedButton>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <AnimatedButton
                  onClick={() => setShowCreateModal(false)}
                  variant="secondary"
                >
                  Cancel
                </AnimatedButton>
                
                {activeStep < 7 ? (
                  <AnimatedButton
                    onClick={() => setActiveStep(activeStep + 1)}
                    variant="primary"
                  >
                    Next →
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    onClick={handleSaveAccommodation}
                    variant="primary"
                  >
                    💾 Save Property
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Calendar Modal */}
      {showPricingCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  📅 Pricing Calendar
                </h3>
                <button
                  onClick={() => setShowPricingCalendar('')}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                <div className="text-4xl mb-4">📅</div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Advanced Pricing Calendar
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  Interactive calendar for managing seasonal rates, availability, and minimum stays would be implemented here.
                  Features would include drag-to-select dates, bulk pricing updates, and integration with booking systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}