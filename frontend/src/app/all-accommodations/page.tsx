'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { accommodations, type Accommodation } from '@/data/accommodations';

interface Filters {
  category: string;
  type: string;
  priceRange: string;
  searchQuery: string;
}

const AllAccommodationsPage: React.FC = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    type: 'all',
    priceRange: 'all',
    searchQuery: ''
  });

  const primaryColor = '#195e48';

  const heroImages = [
    { title: 'Luxury Lodges', subtitle: 'Experience premium comfort in the wild', image: '🏨' },
    { title: 'Eco Camps', subtitle: 'Sustainable stays in nature', image: '🏕️' },
    { title: 'Safari Lodges', subtitle: 'Your gateway to wildlife adventures', image: '🦁' },
    { title: 'Mountain Retreats', subtitle: 'Escape to serene mountain getaways', image: '⛰️' }
  ];

  // Get unique categories and types from accommodations
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(accommodations.map(a => a.category))];
    return cats.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Categories' : cat,
      count: cat === 'all' ? accommodations.length : accommodations.filter(a => a.category === cat).length
    }));
  }, []);

  const types = useMemo(() => {
    const typesList = ['all', ...new Set(accommodations.map(a => a.type))];
    return typesList.map(type => ({
      value: type,
      label: type === 'all' ? 'All Types' : type,
      count: type === 'all' ? accommodations.length : accommodations.filter(a => a.type === type).length
    }));
  }, []);

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: '0-150', label: 'Under $150' },
    { value: '150-300', label: '$150 - $300' },
    { value: '300-500', label: '$300 - $500' },
    { value: '500+', label: '$500+' }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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
      if (filters.category !== 'all' && acc.category !== filters.category) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && acc.type !== filters.type) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const price = acc.price;
        if (filters.priceRange === '0-150' && price >= 150) return false;
        if (filters.priceRange === '150-300' && (price < 150 || price >= 300)) return false;
        if (filters.priceRange === '300-500' && (price < 300 || price >= 500)) return false;
        if (filters.priceRange === '500+' && price < 500) return false;
      }

      return true;
    });

    // Sort accommodations
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [filters, sortBy]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      priceRange: 'all',
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' ||
           filters.type !== 'all' ||
           filters.priceRange !== 'all' ||
           filters.searchQuery;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
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
              All Accommodations
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {heroImages[currentHeroImage].subtitle}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{accommodations.length}</div>
              <div className="text-sm opacity-90">Total Accommodations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{filteredAccommodations.length}</div>
              <div className="text-sm opacity-90">Available Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length - 1}</div>
              <div className="text-sm opacity-90">Categories</div>
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
                  {filteredAccommodations.length} accommodation{filteredAccommodations.length !== 1 ? 's' : ''} found
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
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name (A-Z)</option>
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
                      Search Accommodations
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      placeholder="Search by name, location..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-semibold mb-2 text-gray-700">
                      Accommodation Type
                    </label>
                    <select
                      id="type"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    >
                      {types.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label} {type.value !== 'all' && `(${type.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label htmlFor="priceRange" className="block text-sm font-semibold mb-2 text-gray-700">
                      Price Range (per night)
                    </label>
                    <select
                      id="priceRange"
                      value={filters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    >
                      {priceRanges.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3">
              {/* Active Filters Display */}
              {hasActiveFilters() && (
                <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    {filters.category !== 'all' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Category: {filters.category}
                      </span>
                    )}
                    {filters.type !== 'all' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Type: {filters.type}
                      </span>
                    )}
                    {filters.priceRange !== 'all' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Price: {priceRanges.find(r => r.value === filters.priceRange)?.label}
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
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Link href={`/accommodations/${accommodation.slug}`}>
                        {/* Accommodation Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={accommodation.image}
                            alt={accommodation.name}
                            fill
                            className="object-cover"
                          />
                          {accommodation.discount && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {accommodation.discount}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Category and Type */}
                          <div className="flex justify-between items-center mb-3">
                            <span
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                              {accommodation.category}
                            </span>
                            <span className="text-sm text-gray-500">{accommodation.type}</span>
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
                          <div className="flex items-center mb-4">
                            <div className="flex items-center text-yellow-500">
                              {'★'.repeat(Math.floor(accommodation.rating))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {accommodation.rating} ({accommodation.reviews} reviews)
                            </span>
                          </div>

                          {/* Availability and Price */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-600 font-medium">
                              {accommodation.availability}
                            </span>
                            <div className="text-right">
                              {accommodation.originalPrice && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                  ${accommodation.originalPrice}
                                </span>
                              )}
                              <div>
                                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                  ${accommodation.price}
                                </span>
                                <span className="text-sm text-gray-500">/night</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : (
                /* No Results */
                <div className="text-center py-12">
                  <div className="text-8xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No accommodations found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find more places to stay.
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

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Search Accommodations
                  </label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    placeholder="Search by name, location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Accommodation Type
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  >
                    {types.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.value !== 'all' && `(${type.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Price Range (per night)
                  </label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
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

export default AllAccommodationsPage;
