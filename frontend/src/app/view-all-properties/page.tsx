'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Accommodation {
  id: number;
  name: string;
  type: string;
  location: string;
  region: string;
  description: string;
  pricePerNight: number;
  originalPrice?: number;
  rating: number;
  guestRating: number;
  reviews: number;
  image: string;
  amenities: string[];
  starRating: number;
  ecoFriendly: boolean;
  accessibility: boolean;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  photos: number;
}

interface Filters {
  category: string;
  region: string;
  priceMin: string;
  priceMax: string;
  starRating: string;
  guestRating: string;
  amenities: string[];
  ecoFriendly: boolean;
  accessibility: boolean;
  searchQuery: string;
}

const ViewAllPropertiesPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    region: 'all',
    priceMin: '',
    priceMax: '',
    starRating: 'all',
    guestRating: 'all',
    amenities: [],
    ecoFriendly: false,
    accessibility: false,
    searchQuery: ''
  });

  const primaryColor = '#195e48';

  // Sample accommodations data (in real app, this would come from API)
  const allAccommodations: Accommodation[] = [
    {
      id: 1,
      name: 'Clouds Mountain Gorilla Lodge',
      type: 'Eco-Lodge',
      location: 'Bwindi Forest',
      region: 'Southwestern Uganda',
      description: 'Luxury eco-lodge with stunning views of Bwindi Impenetrable Forest, perfect for gorilla trekking adventures.',
      pricePerNight: 450,
      originalPrice: 520,
      rating: 4.9,
      guestRating: 9.2,
      reviews: 156,
      image: '🏞️',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Spa', 'Eco-Friendly', 'Guided Tours', 'Airport Transfer'],
      starRating: 5,
      ecoFriendly: true,
      accessibility: true,
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      photos: 24
    },
    {
      id: 2,
      name: 'Chobe Safari Lodge',
      type: 'Safari Lodge',
      location: 'Murchison Falls',
      region: 'Northern Uganda',
      description: 'Premier safari lodge overlooking the Nile River with easy access to Murchison Falls National Park.',
      pricePerNight: 280,
      originalPrice: 320,
      rating: 4.7,
      guestRating: 8.8,
      reviews: 203,
      image: '🦁',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Pool', 'Bar', 'Game Drives', 'River Cruise'],
      starRating: 4,
      ecoFriendly: true,
      accessibility: false,
      checkInTime: '3:00 PM',
      checkOutTime: '10:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      photos: 18
    },
    {
      id: 3,
      name: 'Birdnest Resort',
      type: 'Resort',
      location: 'Lake Bunyonyi',
      region: 'Southwestern Uganda',
      description: 'Peaceful lakeside resort with traditional architecture and modern amenities on the shores of Lake Bunyonyi.',
      pricePerNight: 180,
      rating: 4.8,
      guestRating: 8.9,
      reviews: 127,
      image: '🏔️',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Boat Rental', 'Hiking Trails', 'Cultural Tours'],
      starRating: 4,
      ecoFriendly: true,
      accessibility: true,
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      photos: 15
    },
    {
      id: 4,
      name: 'Hairy Lemon Island',
      type: 'Island Resort',
      location: 'Lake Victoria',
      region: 'Central Uganda',
      description: 'Unique island getaway with sustainable accommodations and water sports activities on Lake Victoria.',
      pricePerNight: 120,
      rating: 4.5,
      guestRating: 8.4,
      reviews: 94,
      image: '🏝️',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Water Sports', 'Kayaking', 'Fishing'],
      starRating: 3,
      ecoFriendly: true,
      accessibility: false,
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      cancellationPolicy: 'Free cancellation up to 72 hours before check-in',
      photos: 12
    },
    {
      id: 5,
      name: 'Kampala Serena Hotel',
      type: 'Hotel',
      location: 'Kampala',
      region: 'Central Uganda',
      description: 'Luxury hotel in the heart of Kampala with modern amenities and easy access to city attractions.',
      pricePerNight: 250,
      rating: 4.6,
      guestRating: 8.7,
      reviews: 312,
      image: '🏨',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Pool', 'Gym', 'Business Center', 'Airport Transfer'],
      starRating: 5,
      ecoFriendly: false,
      accessibility: true,
      checkInTime: '3:00 PM',
      checkOutTime: '12:00 PM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      photos: 32
    },
    {
      id: 6,
      name: 'Jinja Nile Resort',
      type: 'Resort',
      location: 'Jinja',
      region: 'Eastern Uganda',
      description: 'Adventure resort at the source of the Nile with water sports and comfortable accommodations.',
      pricePerNight: 195,
      rating: 4.4,
      guestRating: 8.3,
      reviews: 178,
      image: '🚣‍♂️',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Pool', 'Water Sports', 'Adventure Tours', 'Bar'],
      starRating: 4,
      ecoFriendly: true,
      accessibility: false,
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      photos: 20
    },
    {
      id: 7,
      name: 'Entebbe Airport Guest House',
      type: 'Guesthouse',
      location: 'Entebbe',
      region: 'Central Uganda',
      description: 'Convenient guesthouse near Entebbe Airport with comfortable rooms and friendly service.',
      pricePerNight: 85,
      rating: 4.2,
      guestRating: 8.1,
      reviews: 89,
      image: '🏠',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Airport Transfer', 'Parking'],
      starRating: 3,
      ecoFriendly: false,
      accessibility: true,
      checkInTime: '1:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      photos: 8
    },
    {
      id: 8,
      name: 'Kidepo Savannah Lodge',
      type: 'Safari Lodge',
      location: 'Kidepo Valley',
      region: 'Northern Uganda',
      description: 'Remote luxury lodge in Kidepo Valley National Park offering exclusive wildlife experiences.',
      pricePerNight: 380,
      rating: 4.8,
      guestRating: 9.1,
      reviews: 67,
      image: '🦓',
      amenities: ['Restaurant', 'Bar', 'Game Drives', 'Cultural Tours', 'Stargazing'],
      starRating: 4,
      ecoFriendly: true,
      accessibility: false,
      checkInTime: '2:00 PM',
      checkOutTime: '10:00 AM',
      cancellationPolicy: 'Free cancellation up to 7 days before check-in',
      photos: 16
    },
    {
      id: 9,
      name: 'Fort Portal Mountain Lodge',
      type: 'Eco-Lodge',
      location: 'Fort Portal',
      region: 'Western Uganda',
      description: 'Eco-friendly lodge surrounded by crater lakes and tea plantations with guided nature walks.',
      pricePerNight: 165,
      rating: 4.6,
      guestRating: 8.6,
      reviews: 134,
      image: '🌿',
      amenities: ['Free Wi-Fi', 'Restaurant', 'Hiking Trails', 'Tea Tours', 'Eco-Friendly'],
      starRating: 3,
      ecoFriendly: true,
      accessibility: true,
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in',
      photos: 14
    },
    {
      id: 10,
      name: 'Sipi River Lodge',
      type: 'Eco-Lodge',
      location: 'Mount Elgon',
      region: 'Eastern Uganda',
      description: 'Riverside eco-lodge near Sipi Falls with coffee tours and hiking opportunities.',
      pricePerNight: 135,
      rating: 4.5,
      guestRating: 8.5,
      reviews: 98,
      image: '🏔️',
      amenities: ['Restaurant', 'Coffee Tours', 'Hiking Trails', 'Eco-Friendly', 'Cultural Tours'],
      starRating: 3,
      ecoFriendly: true,
      accessibility: false,
      checkInTime: '2:00 PM',
      checkOutTime: '11:00 AM',
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
      photos: 11
    }
  ];

  const heroImages = [
    { title: 'Luxury Eco-Lodges', subtitle: 'Sustainable comfort in pristine wilderness', image: '🏞️' },
    { title: 'Safari Lodges', subtitle: 'Wildlife experiences with premium amenities', image: '🦁' },
    { title: 'Lakeside Resorts', subtitle: 'Tranquil waters and mountain views', image: '🏔️' },
    { title: 'Island Getaways', subtitle: 'Unique accommodations on scenic islands', image: '🏝️' },
    { title: 'City Hotels', subtitle: 'Modern comfort in Uganda\'s vibrant cities', image: '🏨' }
  ];

  const categories = [
    { value: 'all', label: 'All Properties', count: 10 },
    { value: 'Eco-Lodge', label: 'Eco-Lodges', count: 3 },
    { value: 'Safari Lodge', label: 'Safari Lodges', count: 2 },
    { value: 'Resort', label: 'Resorts', count: 2 },
    { value: 'Hotel', label: 'Hotels', count: 1 },
    { value: 'Guesthouse', label: 'Guesthouses', count: 1 },
    { value: 'Island Resort', label: 'Island Resorts', count: 1 }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Central Uganda', label: 'Central Uganda' },
    { value: 'Eastern Uganda', label: 'Eastern Uganda' },
    { value: 'Western Uganda', label: 'Western Uganda' },
    { value: 'Southwestern Uganda', label: 'Southwestern Uganda' },
    { value: 'Northern Uganda', label: 'Northern Uganda' }
  ];

  const availableAmenities = [
    'Free Wi-Fi', 'Restaurant', 'Pool', 'Spa', 'Gym', 'Bar', 'Parking',
    'Airport Transfer', 'Eco-Friendly', 'Water Sports', 'Game Drives',
    'Hiking Trails', 'Cultural Tours', 'Business Center'
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load accommodations (in real app, this would be an API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAccommodations(allAccommodations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort accommodations
  const filteredAccommodations = useMemo(() => {
    let filtered = accommodations.filter(acc => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!acc.name.toLowerCase().includes(query) && 
            !acc.location.toLowerCase().includes(query) &&
            !acc.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && acc.type !== filters.category) {
        return false;
      }

      // Region filter
      if (filters.region !== 'all' && acc.region !== filters.region) {
        return false;
      }

      // Price filter
      if (filters.priceMin && acc.pricePerNight < parseInt(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && acc.pricePerNight > parseInt(filters.priceMax)) {
        return false;
      }

      // Star rating filter
      if (filters.starRating !== 'all' && acc.starRating < parseInt(filters.starRating)) {
        return false;
      }

      // Guest rating filter
      if (filters.guestRating !== 'all') {
        const minRating = parseFloat(filters.guestRating);
        if (acc.guestRating < minRating) {
          return false;
        }
      }

      // Amenities filter
      if (filters.amenities.length > 0) {
        const hasAllAmenities = filters.amenities.every(amenity => 
          acc.amenities.includes(amenity)
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      // Eco-friendly filter
      if (filters.ecoFriendly && !acc.ecoFriendly) {
        return false;
      }

      // Accessibility filter
      if (filters.accessibility && !acc.accessibility) {
        return false;
      }

      return true;
    });

    // Sort accommodations
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'guest-rating':
        filtered.sort((a, b) => b.guestRating - a.guestRating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default: // rating
        filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [accommodations, filters, sortBy]);

  const handleFilterChange = (key: keyof Filters, value: string | boolean | string[]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      region: 'all',
      priceMin: '',
      priceMax: '',
      starRating: 'all',
      guestRating: 'all',
      amenities: [],
      ecoFriendly: false,
      accessibility: false,
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.region !== 'all' || 
           filters.priceMin || 
           filters.priceMax || 
           filters.starRating !== 'all' || 
           filters.guestRating !== 'all' || 
           filters.amenities.length > 0 || 
           filters.ecoFriendly || 
           filters.accessibility || 
           filters.searchQuery;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background with rotating images */}
        <div 
          className="absolute inset-0 hero-carousel transition-all duration-1000"
          style={{ 
            background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%)`
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center w-full content-section">
          <div className="mb-8">
            <div className="text-8xl mb-4" aria-hidden="true">
              {heroImages[currentHeroImage].image}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Find Your Perfect Stay in Uganda
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {heroImages[currentHeroImage].subtitle}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{accommodations.length}</div>
              <div className="text-sm opacity-90">Total Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{filteredAccommodations.length}</div>
              <div className="text-sm opacity-90">Available Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length - 1}</div>
              <div className="text-sm opacity-90">Property Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{regions.length - 1}</div>
              <div className="text-sm opacity-90">Regions</div>
            </div>
          </div>
        </div>
        
        {/* Hero Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentHeroImage ? 'opacity-100' : 'bg-white opacity-50'
              }`}
              style={{ backgroundColor: index === currentHeroImage ? 'white' : undefined }}
              aria-label={`Go to hero image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="content-section">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Uganda Accommodations
                </h2>
                <p className="text-gray-600">
                  {filteredAccommodations.length} propert{filteredAccommodations.length !== 1 ? 'ies' : 'y'} found
                  {hasActiveFilters() && ' with current filters'}
                </p>
              </div>
              
              {/* Sort & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="guest-rating">Guest Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="reviews">Most Reviewed</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden btn-primary text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  🔍 Filters {hasActiveFilters() && '•'}
                </button>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-semibold mb-2 text-gray-700">
                      Search Properties
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      placeholder="Search by name, location..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-700">
                      Property Type
                    </label>
                    <select
                      id="category"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold mb-2 text-gray-700">
                      Region
                    </label>
                    <select
                      id="region"
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Price per Night (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                        style={{ focusRingColor: primaryColor }}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                        style={{ focusRingColor: primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label htmlFor="starRating" className="block text-sm font-semibold mb-2 text-gray-700">
                      Star Rating
                    </label>
                    <select
                      id="starRating"
                      value={filters.starRating}
                      onChange={(e) => handleFilterChange('starRating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      <option value="all">Any Rating</option>
                      <option value="5">5 Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                    </select>
                  </div>

                  {/* Guest Rating */}
                  <div>
                    <label htmlFor="guestRating" className="block text-sm font-semibold mb-2 text-gray-700">
                      Guest Rating
                    </label>
                    <select
                      id="guestRating"
                      value={filters.guestRating}
                      onChange={(e) => handleFilterChange('guestRating', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      <option value="all">Any Rating</option>
                      <option value="9">9.0+ Exceptional</option>
                      <option value="8">8.0+ Very Good</option>
                      <option value="7">7.0+ Good</option>
                    </select>
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      Amenities
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {availableAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenityToggle(amenity)}
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: primaryColor }}
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Features */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.ecoFriendly}
                        onChange={(e) => handleFilterChange('ecoFriendly', e.target.checked)}
                        className="mr-3 w-4 h-4"
                        style={{ accentColor: primaryColor }}
                      />
                      <span className="text-sm font-medium text-gray-700">🌱 Eco-Friendly Only</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.accessibility}
                        onChange={(e) => handleFilterChange('accessibility', e.target.checked)}
                        className="mr-3 w-4 h-4"
                        style={{ accentColor: primaryColor }}
                      />
                      <span className="text-sm font-medium text-gray-700">♿ Accessible</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3">
              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Active Filters Display */}
                  {hasActiveFilters() && (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">Active filters:</span>
                        {filters.category !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Type: {filters.category}
                          </span>
                        )}
                        {filters.region !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Region: {filters.region}
                          </span>
                        )}
                        {(filters.priceMin || filters.priceMax) && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Price: ${filters.priceMin || '0'} - ${filters.priceMax || '∞'}
                          </span>
                        )}
                        {filters.starRating !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {filters.starRating}+ Stars
                          </span>
                        )}
                        {filters.amenities.length > 0 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {filters.amenities.length} Amenities
                          </span>
                        )}
                        {filters.ecoFriendly && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            🌱 Eco-Friendly
                          </span>
                        )}
                        {filters.accessibility && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            ♿ Accessible
                          </span>
                        )}
                        {filters.searchQuery && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Search: "{filters.searchQuery}"
                          </span>
                        )}
                      </div>
                      <button
                        onClick={clearFilters}
                        className="text-sm font-medium transition-colors"
                        style={{ color: primaryColor }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}

                  {/* Accommodations Grid */}
                  {filteredAccommodations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredAccommodations.map((accommodation) => (
                        <article 
                          key={accommodation.id} 
                          className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect"
                        >
                          <Link href={`/accommodations/${accommodation.id}`}>
                            {/* Property Image */}
                            <div 
                              className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                              style={{ backgroundColor: `${primaryColor}10` }}
                            >
                              <span aria-hidden="true">{accommodation.image}</span>
                              {accommodation.originalPrice && accommodation.originalPrice > accommodation.pricePerNight && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                  Save ${accommodation.originalPrice - accommodation.pricePerNight}
                                </div>
                              )}
                              {accommodation.ecoFriendly && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                  🌱 Eco
                                </div>
                              )}
                              <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                                {accommodation.photos} photos
                              </div>
                            </div>
                            
                            <div className="p-6">
                              {/* Property Type and Star Rating */}
                              <div className="flex justify-between items-center mb-3">
                                <span 
                                  className="px-3 py-1 text-xs font-semibold rounded-full"
                                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                                >
                                  {accommodation.type}
                                </span>
                                <div className="flex items-center">
                                  {'★'.repeat(accommodation.starRating)}
                                  <span className="text-xs text-gray-500 ml-1">({accommodation.starRating})</span>
                                </div>
                              </div>
                              
                              {/* Name and Location */}
                              <h3 className="font-bold text-xl text-gray-900 mb-2">{accommodation.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">📍 {accommodation.location}</p>
                              
                              {/* Description */}
                              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{accommodation.description}</p>
                              
                              {/* Amenities */}
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-1">
                                  {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                                    <span 
                                      key={index}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {accommodation.amenities.length > 3 && (
                                    <span className="text-xs text-gray-400">
                                      +{accommodation.amenities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Rating and Reviews */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                  <div className="flex items-center rating-stars mr-2">
                                    {'★'.repeat(Math.floor(accommodation.rating))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {accommodation.rating} ({accommodation.reviews} reviews)
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div 
                                    className="text-sm font-semibold px-2 py-1 rounded"
                                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                                  >
                                    {accommodation.guestRating}/10
                                  </div>
                                </div>
                              </div>
                              
                              {/* Additional Info */}
                              <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
                                <span>Check-in: {accommodation.checkInTime}</span>
                                <span>Check-out: {accommodation.checkOutTime}</span>
                              </div>
                              
                              {/* Price and Book Button */}
                              <div className="flex justify-between items-center">
                                <div>
                                  {accommodation.originalPrice && accommodation.originalPrice > accommodation.pricePerNight && (
                                    <span className="text-sm text-gray-400 line-through mr-2">
                                      ${accommodation.originalPrice}
                                    </span>
                                  )}
                                  <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                    ${accommodation.pricePerNight}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-1">per night</span>
                                </div>
                                <button
                                  className="btn-primary text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                                  style={{ backgroundColor: primaryColor }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/accommodations/${accommodation.id}`;
                                  }}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : (
                    /* No Results */
                    <div className="text-center py-12">
                      <div className="text-8xl mb-4">🏨</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No properties found</h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your filters or search terms to find more accommodations.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="btn-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Same filter content as desktop (simplified for mobile) */}
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Search Properties
                  </label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    placeholder="Search by name, location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Property Type
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Price per Night (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                </div>

                {/* Special Features */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ecoFriendly}
                      onChange={(e) => handleFilterChange('ecoFriendly', e.target.checked)}
                      className="mr-3 w-4 h-4"
                      style={{ accentColor: primaryColor }}
                    />
                    <span className="text-sm font-medium text-gray-700">🌱 Eco-Friendly Only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.accessibility}
                      onChange={(e) => handleFilterChange('accessibility', e.target.checked)}
                      className="mr-3 w-4 h-4"
                      style={{ accentColor: primaryColor }}
                    />
                    <span className="text-sm font-medium text-gray-700">♿ Accessible</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 btn-primary text-white px-4 py-2 rounded-lg font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Show Results ({filteredAccommodations.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllPropertiesPage;