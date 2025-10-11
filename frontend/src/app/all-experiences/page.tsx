'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { experiences, type Experience } from '@/data/experiences';

interface Filters {
  category: string;
  duration: string;
  difficulty: string;
  searchQuery: string;
}

const AllExperiencesPage: React.FC = () => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');

  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    duration: 'all',
    difficulty: 'all',
    searchQuery: ''
  });

  const primaryColor = '#195e48';

  const heroImages = [
    { title: 'Gorilla Encounters', subtitle: 'Meet mountain gorillas in Bwindi Forest', image: '🦍' },
    { title: 'Adventure Rapids', subtitle: 'Conquer the legendary Nile waters', image: '🚣‍♂️' },
    { title: 'Wildlife Safaris', subtitle: 'Discover Uganda\'s incredible animals', image: '🦁' },
    { title: 'Mountain Adventures', subtitle: 'Scale Uganda\'s majestic peaks', image: '🏔️' }
  ];

  // Get unique categories from experiences
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(experiences.map(e => e.category))];
    return cats.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Categories' : cat,
      count: cat === 'all' ? experiences.length : experiences.filter(e => e.category === cat).length
    }));
  }, []);

  const difficulties = [
    { value: 'all', label: 'Any Level' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Challenging', label: 'Challenging' }
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: 'Half Day', label: 'Half Day' },
    { value: 'Full Day', label: 'Full Day' },
    { value: 'Multi-Day', label: 'Multi-Day (2+ days)' }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = experiences.filter(exp => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!exp.title.toLowerCase().includes(query) &&
            !exp.location.toLowerCase().includes(query) &&
            !exp.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && exp.category !== filters.category) {
        return false;
      }

      // Duration filter
      if (filters.duration !== 'all') {
        if (filters.duration === 'Half Day' && !exp.duration.toLowerCase().includes('half')) {
          return false;
        }
        if (filters.duration === 'Full Day' && exp.duration !== 'Full Day') {
          return false;
        }
        if (filters.duration === 'Multi-Day' && (exp.duration === 'Full Day' || exp.duration === 'Half Day' || !exp.duration.toLowerCase().includes('day'))) {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && exp.difficulty !== filters.difficulty) {
        return false;
      }

      return true;
    });

    // Sort experiences
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
      case 'duration':
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [experiences, filters, sortBy]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      duration: 'all',
      difficulty: 'all',
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' ||
           filters.duration !== 'all' ||
           filters.difficulty !== 'all' ||
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
              All Adventure Experiences
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {heroImages[currentHeroImage].subtitle}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{experiences.length}</div>
              <div className="text-sm opacity-90">Total Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{filteredExperiences.length}</div>
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
                  Discover Uganda Adventures
                </h2>
                <p className="text-gray-600">
                  {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''} found
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
                    <option value="duration">Duration</option>
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
                      Search Experiences
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

                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold mb-2 text-gray-700">
                      Duration
                    </label>
                    <select
                      id="duration"
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    >
                      {durations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-semibold mb-2 text-gray-700">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={filters.difficulty}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
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
                    {filters.duration !== 'all' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Duration: {filters.duration}
                      </span>
                    )}
                    {filters.difficulty !== 'all' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        Difficulty: {filters.difficulty}
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

              {/* Experiences Grid */}
              {filteredExperiences.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredExperiences.map((experience) => (
                    <article
                      key={experience.id}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Link href={`/experiences/${experience.slug}`}>
                        {/* Experience Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={experience.image}
                            alt={experience.title}
                            fill
                            className="object-cover"
                          />
                          {experience.originalPrice && experience.originalPrice > experience.price && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Save ${experience.originalPrice - experience.price}
                            </div>
                          )}
                        </div>

                        <div className="p-6">
                          {/* Category and Duration */}
                          <div className="flex justify-between items-center mb-3">
                            <span
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                              {experience.category}
                            </span>
                            <span className="text-sm text-gray-500">{experience.duration}</span>
                          </div>

                          {/* Title and Location */}
                          <h3 className="font-bold text-xl text-gray-900 mb-2">{experience.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>

                          {/* Description */}
                          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{experience.description}</p>

                          {/* Highlights */}
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {experience.highlights.slice(0, 2).map((highlight, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {highlight}
                                </span>
                              ))}
                              {experience.highlights.length > 2 && (
                                <span className="text-xs text-gray-400">
                                  +{experience.highlights.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Reviews */}
                          <div className="flex items-center mb-4">
                            <div className="flex items-center text-yellow-500">
                              {'★'.repeat(Math.floor(experience.rating))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {experience.rating} ({experience.reviews} reviews)
                            </span>
                          </div>

                          {/* Difficulty and Price */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">🏃‍♂️ {experience.difficulty}</span>
                            <div className="text-right">
                              {experience.originalPrice && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                  ${experience.originalPrice}
                                </span>
                              )}
                              <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                                ${experience.price}
                              </span>
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">No experiences found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms to find more adventures.
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
                    Search Experiences
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

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Duration
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) => handleFilterChange('duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  >
                    {durations.map(duration => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
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
                    Show Results ({filteredExperiences.length})
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

export default AllExperiencesPage;
