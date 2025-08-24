'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { getDestinationLink, hasDestinationPage } from '@/lib/destinations';

interface AccommodationSearchForm {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  accommodationType: string;
  priceMin: string;
  priceMax: string;
  amenities: string[];
  rating: string;
}

export default function AccommodationsPage() {
  const { register, handleSubmit, watch } = useForm<AccommodationSearchForm>({
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      rooms: 1,
      accommodationType: 'all',
      priceMin: '',
      priceMax: '',
      amenities: [],
      rating: 'any'
    }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  const primaryColor = '#195e48';

  // Sample accommodation data
  const featuredAccommodations = [
    {
      id: 1,
      name: 'Clouds Mountain Gorilla Lodge',
      location: 'Bwindi Impenetrable Forest',
      category: 'Luxury Lodge',
      rating: 4.9,
      reviews: 156,
      price: 450,
      originalPrice: 520,
      image: '🏞️',
      description: 'Luxury eco-lodge with stunning mountain views and gorilla trekking access',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Game Drives', 'All Inclusive'],
      roomType: 'Stone Cottage',
      availability: 'Available',
      features: ['Mountain Views', 'Eco-Friendly', 'Local Cuisine', 'Wildlife Viewing']
    },
    {
      id: 2,
      name: 'Chobe Safari Lodge',
      location: 'Murchison Falls National Park',
      category: 'Safari Lodge',
      rating: 4.7,
      reviews: 203,
      price: 280,
      originalPrice: 340,
      image: '🦁',
      description: 'Riverside lodge offering exceptional wildlife viewing and comfort',
      amenities: ['Pool', 'Restaurant', 'Bar', 'Game Drives', 'Boat Safaris'],
      roomType: 'Safari Tent',
      availability: 'Available',
      features: ['River Views', 'Wildlife Viewing', 'Cultural Tours', 'Photography']
    },
    {
      id: 3,
      name: 'Birdnest Resort Lake Bunyonyi',
      location: 'Lake Bunyonyi',
      category: 'Eco Resort',
      rating: 4.8,
      reviews: 127,
      price: 180,
      originalPrice: 220,
      image: '🏔️',
      description: 'Peaceful lakeside resort surrounded by terraced hills',
      amenities: ['Free WiFi', 'Restaurant', 'Canoe Rental', 'Hiking', 'Cultural Tours'],
      roomType: 'Lake View Room',
      availability: 'Available',
      features: ['Lake Views', 'Bird Watching', 'Canoeing', 'Hill Hiking']
    },
    {
      id: 4,
      name: 'Hairy Lemon Island',
      location: 'Lake Victoria',
      category: 'Island Resort',
      rating: 4.5,
      reviews: 94,
      price: 120,
      originalPrice: 150,
      image: '🏝️',
      description: 'Unique island getaway with water sports and relaxation',
      amenities: ['Beach Access', 'Water Sports', 'Restaurant', 'Fishing', 'Kayaking'],
      roomType: 'Beach Banda',
      availability: 'Available',
      features: ['Island Setting', 'Water Sports', 'Fishing', 'Beach Activities']
    },
    {
      id: 5,
      name: 'Mount Gahinga Lodge',
      location: 'Mgahinga Gorilla National Park',
      category: 'Eco Lodge',
      rating: 4.6,
      reviews: 89,
      price: 320,
      originalPrice: 380,
      image: '⛰️',
      description: 'Luxury lodge at the foot of the Virunga Mountains',
      amenities: ['Spa', 'Restaurant', 'Bar', 'Gorilla Trekking', 'Cultural Tours'],
      roomType: 'Mountain Banda',
      availability: 'Available',
      features: ['Mountain Views', 'Gorilla Access', 'Cultural Immersion', 'Hiking']
    },
    {
      id: 6,
      name: 'Ndali Lodge',
      location: 'Kibale Forest',
      category: 'Boutique Lodge',
      rating: 4.7,
      reviews: 112,
      price: 240,
      originalPrice: 290,
      image: '🌳',
      description: 'Intimate lodge overlooking crater lakes and forest',
      amenities: ['Pool', 'Restaurant', 'Bar', 'Chimpanzee Tracking', 'Nature Walks'],
      roomType: 'Forest Cottage',
      availability: 'Available',
      features: ['Forest Views', 'Crater Lakes', 'Chimp Tracking', 'Nature Walks']
    }
  ];

  const accommodationCategories = [
    { id: 'all', name: 'All Properties', icon: '🏨', count: 42 },
    { id: 'luxury', name: 'Luxury Lodges', icon: '✨', count: 12 },
    { id: 'eco', name: 'Eco-Friendly', icon: '🌿', count: 18 },
    { id: 'safari', name: 'Safari Lodges', icon: '🦁', count: 8 },
    { id: 'budget', name: 'Budget Stays', icon: '💰', count: 15 },
    { id: 'unique', name: 'Unique Stays', icon: '🏝️', count: 6 }
  ];

  const accommodationDestinations = [
    { name: 'Bwindi Forest', count: 8, image: '🦍' },
    { name: 'Queen Elizabeth Park', count: 6, image: '🦁' },
    { name: 'Murchison Falls', count: 5, image: '💦' },
    { name: 'Lake Bunyonyi', count: 7, image: '🏔️' },
    { name: 'Jinja', count: 4, image: '🚣‍♂️' },
    { name: 'Kampala', count: 12, image: '🏙️' }
  ];

  const heroImages = [
    { title: 'Luxury Safari Lodges', subtitle: 'Experience comfort in Uganda\'s wilderness', image: '🦁' },
    { title: 'Eco-Friendly Accommodations', subtitle: 'Sustainable stays in pristine nature', image: '🌿' },
    { title: 'Lakeside Retreats', subtitle: 'Peaceful getaways by Uganda\'s beautiful lakes', image: '🏔️' },
    { title: 'Mountain Lodges', subtitle: 'Breathtaking views from the mountains', image: '⛰️' }
  ];

  const popularAmenities = [
    'Free WiFi', 'Restaurant', 'Pool', 'Spa', 'Bar', 'Game Drives',
    'Cultural Tours', 'Airport Transfer', 'Laundry', 'Room Service'
  ];

  const onSearch = (data: AccommodationSearchForm) => {
    const queryParams = new URLSearchParams(data as any);
    window.location.href = `/search?${queryParams.toString()}`;
  };

  const filteredAccommodations = selectedCategory === 'all' 
    ? featuredAccommodations 
    : featuredAccommodations.filter(acc => 
        acc.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'eco' && acc.features.some(f => f.toLowerCase().includes('eco'))) ||
        (selectedCategory === 'luxury' && acc.category.toLowerCase().includes('luxury')) ||
        (selectedCategory === 'safari' && acc.category.toLowerCase().includes('safari')) ||
        (selectedCategory === 'budget' && acc.price < 200) ||
        (selectedCategory === 'unique' && ['Island Resort', 'Unique'].some(t => acc.category.includes(t)))
      );

  // Auto-advance hero carousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Uganda Accommodations & Lodges",
    "description": "Discover the best accommodations in Uganda - from luxury safari lodges to eco-friendly retreats",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "hasPart": featuredAccommodations.map(acc => ({
      "@type": "LodgingBusiness",
      "name": acc.name,
      "description": acc.description,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": acc.location,
        "addressCountry": "Uganda"
      },
      "priceRange": `$${acc.price}`,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": acc.rating,
        "reviewCount": acc.reviews
      },
      "amenityFeature": acc.amenities.map(amenity => ({
        "@type": "LocationFeatureSpecification",
        "name": amenity
      }))
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section with Search */}
        <section 
          className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden py-20"
          aria-label="Accommodations hero section"
          role="banner"
        >
          {/* Background with rotating images */}
          <div 
            className="absolute inset-0 hero-carousel transition-all duration-1000"
            style={{ 
              background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%)`
            }}
          />
          <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
          
          <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="text-8xl mb-4" aria-hidden="true">
                {heroImages[currentHeroImage].image}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {heroImages[currentHeroImage].title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {heroImages[currentHeroImage].subtitle}
              </p>
            </div>
            
            {/* Advanced Search Form */}
            <div 
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900 max-w-5xl mx-auto"
              role="search"
              aria-label="Search Uganda accommodations"
            >
              <form onSubmit={handleSubmit(onSearch)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="destination" className="block text-sm font-semibold mb-2 text-gray-700">
                      Where in Uganda?
                    </label>
                    <input
                      {...register('destination')}
                      id="destination"
                      type="text"
                      placeholder="Search destinations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-semibold mb-2 text-gray-700">
                      Check-in
                    </label>
                    <input
                      {...register('checkIn')}
                      id="checkIn"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-semibold mb-2 text-gray-700">
                      Check-out
                    </label>
                    <input
                      {...register('checkOut')}
                      id="checkOut"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-sm font-semibold mb-2 text-gray-700">
                      Guests
                    </label>
                    <select
                      {...register('guests')}
                      id="guests"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="accommodationType" className="block text-sm font-semibold mb-2 text-gray-700">
                      Type
                    </label>
                    <select
                      {...register('accommodationType')}
                      id="accommodationType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      <option value="all">All Types</option>
                      <option value="hotel">Hotels</option>
                      <option value="lodge">Lodges</option>
                      <option value="resort">Resorts</option>
                      <option value="eco">Eco-Stays</option>
                      <option value="camping">Camping</option>
                    </select>
                  </div>
                </div>
                
                {/* Advanced Filters Toggle */}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm font-medium transition-colors mb-4"
                    style={{ color: primaryColor }}
                  >
                    {showFilters ? '− Less Filters' : '+ More Filters'}
                  </button>
                  
                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label htmlFor="rating" className="block text-sm font-semibold mb-2 text-gray-700">
                          Minimum Rating
                        </label>
                        <select
                          {...register('rating')}
                          id="rating"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        >
                          <option value="any">Any Rating</option>
                          <option value="3">3+ Stars</option>
                          <option value="4">4+ Stars</option>
                          <option value="4.5">4.5+ Stars</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Price Range (USD/night)
                        </label>
                        <div className="flex gap-2">
                          <input
                            {...register('priceMin')}
                            type="number"
                            placeholder="Min"
                            className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                          />
                          <input
                            {...register('priceMax')}
                            type="number"
                            placeholder="Max"
                            className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="rooms" className="block text-sm font-semibold mb-2 text-gray-700">
                          Rooms
                        </label>
                        <select
                          {...register('rooms')}
                          id="rooms"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        >
                          {[1,2,3,4].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Search Uganda accommodations"
                >
                  🔍 Find Your Perfect Stay
                </button>
              </form>
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

        {/* Accommodation Categories Section */}
        <section className="py-16 bg-gray-50" aria-labelledby="categories-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Accommodation Types
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our curated selection of Uganda's finest accommodations
              </p>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {accommodationCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 text-center focus:ring-2 focus:ring-offset-2 ${
                    selectedCategory === category.id ? 'ring-2' : ''
                  }`}
                  style={{ 
                    focusRingColor: primaryColor,
                    ringColor: selectedCategory === category.id ? primaryColor : undefined
                  }}
                  aria-label={`Filter by ${category.name}`}
                >
                  <div className="text-4xl mb-3" aria-hidden="true">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-2">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} properties</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Uganda Destinations */}
        <section className="py-16 bg-white" aria-labelledby="destinations-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="destinations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Accommodation Destinations
              </h2>
              <p className="text-xl text-gray-600">
                Discover places to stay across Uganda's most spectacular locations
              </p>
            </header>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {accommodationDestinations.map((destination, index) => (
                <Link
                  key={destination.name}
                  href={getDestinationLink(destination.name)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden focus:ring-2 focus:ring-offset-2"
                  style={{ focusRingColor: primaryColor }}
                >
                  <div 
                    className="h-32 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                    aria-hidden="true"
                  >
                    {destination.image}
                  </div>
                  <div className="p-4 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <h3 className="font-semibold text-sm">{destination.name}</h3>
                      {hasDestinationPage(destination.name) && (
                        <span className="ml-2 text-xs">✨</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{destination.count} properties</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Accommodations */}
        <section className="py-16 bg-gray-50" aria-labelledby="accommodations-heading">
          <div className="content-section">
            <header className="flex justify-between items-center mb-12">
              <div>
                <h2 id="accommodations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Accommodations
                </h2>
                <p className="text-xl text-gray-600">
                  {selectedCategory === 'all' 
                    ? 'Our most popular Uganda accommodations' 
                    : `Top ${accommodationCategories.find(c => c.id === selectedCategory)?.name}`
                  }
                </p>
              </div>
              <Link 
                href="/view-all-properties" 
                className="hidden md:block btn-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                View All Properties
              </Link>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAccommodations.map((accommodation) => (
                <article 
                  key={accommodation.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/accommodations/${accommodation.id}`}>
                    {/* Accommodation Image */}
                    <div 
                      className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <span aria-hidden="true">{accommodation.image}</span>
                      {accommodation.originalPrice > accommodation.price && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Save ${accommodation.originalPrice - accommodation.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      {/* Category and Availability */}
                      <div className="flex justify-between items-center mb-3">
                        <span 
                          className="px-3 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                          {accommodation.category}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full text-xs font-semibold ${
                          accommodation.availability === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {accommodation.availability}
                        </span>
                      </div>
                      
                      {/* Name and Location */}
                      <h3 className="font-bold text-xl text-gray-900 mb-2">{accommodation.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">📍 {accommodation.location}</p>
                      
                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{accommodation.description}</p>
                      
                      {/* Room Type */}
                      <p className="text-sm font-medium text-gray-600 mb-3">
                        🏠 {accommodation.roomType}
                      </p>
                      
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
                        <div className="flex items-center rating-stars">
                          {'★'.repeat(Math.floor(accommodation.rating))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {accommodation.rating} ({accommodation.reviews} reviews)
                        </span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {accommodation.features.slice(0, 2).map((feature, index) => (
                          <span 
                            key={index}
                            className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Price and Book Button */}
                      <div className="flex justify-between items-center">
                        <div>
                          {accommodation.originalPrice > accommodation.price && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              ${accommodation.originalPrice}
                            </span>
                          )}
                          <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                            ${accommodation.price}
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
            
            <div className="text-center mt-12 md:hidden">
              <Link 
                href="/view-all-properties" 
                className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                View All Properties
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Guide Integration */}
        <section className="py-16 bg-white" aria-labelledby="guides-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="guides-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Accommodation Travel Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert advice and tips for choosing the perfect place to stay in Uganda
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link
                href="/travel-guide/where-to-stay-uganda"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  🏨
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Where to Stay in Uganda</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete guide to Uganda's best accommodation options by region and budget</p>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>Read Guide →</span>
                </div>
              </Link>
              
              <Link
                href="/travel-guide/eco-lodges-uganda"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  🌿
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Eco-Friendly Accommodations</h3>
                  <p className="text-gray-600 text-sm mb-4">Discover sustainable lodges and eco-friendly stays that support conservation</p>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>Read Guide →</span>
                </div>
              </Link>
              
              <Link
                href="/travel-guide/luxury-safari-lodges"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  ✨
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Luxury Safari Lodges</h3>
                  <p className="text-gray-600 text-sm mb-4">Premium accommodations offering exceptional wildlife experiences and comfort</p>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>Read Guide →</span>
                </div>
              </Link>
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/travel-guide" 
                className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                View All Accommodation Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}