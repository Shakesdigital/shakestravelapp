'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { getDestinationLink, hasDestinationPage } from '@/lib/destinations';

interface ExperienceSearchForm {
  destination: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  priceMin: string;
  priceMax: string;
  duration: string;
  difficulty: string;
}

export default function ExperiencesPage() {
  const { register, handleSubmit, watch } = useForm<ExperienceSearchForm>({
    defaultValues: {
      destination: '',
      category: 'all',
      dateFrom: '',
      dateTo: '',
      priceMin: '',
      priceMax: '',
      duration: 'any',
      difficulty: 'any'
    }
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);

  const primaryColor = '#195e48';

  // Sample experience data
  const featuredExperiences = [
    {
      id: 1,
      title: 'Gorilla Trekking in Bwindi',
      location: 'Bwindi Impenetrable Forest',
      category: 'Wildlife Safari',
      duration: '1 Day',
      difficulty: 'Moderate',
      rating: 4.9,
      reviews: 234,
      price: 800,
      originalPrice: 950,
      image: '🦍',
      description: 'Experience the magic of encountering mountain gorillas in their natural habitat',
      highlights: ['Expert Guide', 'Permit Included', 'Small Groups', 'Photo Opportunities'],
      availability: 'Daily departures'
    },
    {
      id: 2,
      title: 'White Water Rafting Adventure',
      location: 'Jinja, River Nile',
      category: 'Water Sports',
      duration: '4 Hours',
      difficulty: 'Challenging',
      rating: 4.7,
      reviews: 187,
      price: 120,
      originalPrice: 150,
      image: '🚣‍♂️',
      description: 'Navigate the legendary rapids of the River Nile with expert guides',
      highlights: ['Grade 5 Rapids', 'Safety Equipment', 'Lunch Included', 'Transport'],
      availability: 'Daily 9AM & 2PM'
    },
    {
      id: 3,
      title: 'Safari in Queen Elizabeth Park',
      location: 'Queen Elizabeth National Park',
      category: 'Wildlife Safari',
      duration: '3 Days',
      difficulty: 'Easy',
      rating: 4.8,
      reviews: 312,
      price: 350,
      originalPrice: 420,
      image: '🦁',
      description: 'Discover diverse wildlife in Uganda\'s most visited national park',
      highlights: ['Game Drives', 'Boat Safari', '3-Star Lodge', 'All Meals'],
      availability: 'Mon, Wed, Fri'
    },
    {
      id: 4,
      title: 'Cultural Village Experience',
      location: 'Batwa Community',
      category: 'Cultural Tour',
      duration: '2 Hours',
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 89,
      price: 75,
      originalPrice: 90,
      image: '🏘️',
      description: 'Learn traditional customs and crafts from the indigenous Batwa people',
      highlights: ['Cultural Immersion', 'Traditional Crafts', 'Local Guide', 'Photo Friendly'],
      availability: 'Daily 10AM & 3PM'
    },
    {
      id: 5,
      title: 'Sipi Falls Hiking Adventure',
      location: 'Mount Elgon',
      category: 'Hiking & Trekking',
      duration: '6 Hours',
      difficulty: 'Moderate',
      rating: 4.5,
      reviews: 156,
      price: 95,
      originalPrice: 120,
      image: '🏔️',
      description: 'Trek through coffee plantations to three spectacular waterfalls',
      highlights: ['3 Waterfalls', 'Coffee Tour', 'Scenic Views', 'Local Lunch'],
      availability: 'Daily 8AM'
    },
    {
      id: 6,
      title: 'Murchison Falls Boat Safari',
      location: 'Murchison Falls',
      category: 'Wildlife Safari',
      duration: '3 Hours',
      difficulty: 'Easy',
      rating: 4.7,
      reviews: 203,
      price: 85,
      originalPrice: 100,
      image: '🚢',
      description: 'Cruise along the Nile to witness the powerful Murchison Falls',
      highlights: ['Nile Cruise', 'Wildlife Viewing', 'Photography', 'Refreshments'],
      availability: 'Daily 9AM & 2PM'
    }
  ];

  const adventureCategories = [
    { id: 'all', name: 'All Adventures', icon: '🎯', count: 24, slug: null },
    { id: 'wildlife', name: 'Wildlife Safari', icon: '🦁', count: 8, slug: 'safari' },
    { id: 'hiking', name: 'Hiking & Trekking', icon: '🏔️', count: 6, slug: 'hiking' },
    { id: 'water', name: 'Water Sports', icon: '🏄‍♂️', count: 4, slug: 'water-sports' },
    { id: 'cultural', name: 'Cultural Tours', icon: '🏘️', count: 3, slug: 'cultural-tours' },
    { id: 'extreme', name: 'Extreme Sports', icon: '🪂', count: 3, slug: 'extreme-sports' },
    { id: 'biking', name: 'Mountain Biking', icon: '🚴‍♂️', count: 2, slug: 'mountain-biking' },
    { id: 'climbing', name: 'Rock Climbing', icon: '🧗‍♂️', count: 2, slug: 'rock-climbing' },
    { id: 'aerial', name: 'Aerial Adventures', icon: '🎈', count: 3, slug: 'aerial-adventures' },
    { id: 'canopy', name: 'Canopy Tours', icon: '🌲', count: 2, slug: 'canopy-tours' },
    { id: 'horseback', name: 'Horseback Riding', icon: '🐎', count: 1, slug: 'horseback-riding' },
    { id: 'caving', name: 'Caving', icon: '🕳️', count: 1, slug: 'caving' },
    { id: 'motor', name: 'Motor Sports', icon: '🏍️', count: 1, slug: 'motor-sports' },
    { id: 'photography', name: 'Photography', icon: '📷', count: 1, slug: 'photography' },
    { id: 'night', name: 'Night Safari', icon: '🌙', count: 1, slug: 'night-safari' }
  ];

  const ugandaDestinations = [
    { name: 'Bwindi Forest', description: 'Mountain gorilla trekking paradise' },
    { name: 'Queen Elizabeth Park', description: 'Uganda\'s most visited safari park' },
    { name: 'Murchison Falls', description: 'World\'s most powerful waterfall' },
    { name: 'Jinja', description: 'Adventure capital of East Africa' },
    { name: 'Lake Bunyonyi', description: 'Switzerland of Africa' },
    { name: 'Mount Elgon', description: 'Ancient volcanic mountain' },
    { name: 'Kibale Forest', description: 'Primate capital of the world' },
    { name: 'Lake Victoria', description: 'Africa\'s largest freshwater lake' },
    { name: 'Ssese Islands', description: 'Tropical island paradise' },
    { name: 'Ngamba Island', description: 'Chimpanzee sanctuary island' },
    { name: 'Banda Island', description: 'Secluded island retreat' },
    { name: 'Bulago Island', description: 'Private luxury island' },
    { name: 'Rwenzori Mountains', description: 'Mountains of the Moon' },
    { name: 'Lake Mburo Park', description: 'Compact savanna park' },
    { name: 'Kidepo Valley', description: 'Remote wilderness paradise' },
    { name: 'Sipi Falls', description: 'Three-tier waterfall system' },
    { name: 'Fort Portal', description: 'Gateway to crater lakes' },
    { name: 'Semuliki Park', description: 'Lowland tropical rainforest' },
    { name: 'Mount Moroto', description: 'Sacred Karamojong mountain' },
    { name: 'Pian Upe Reserve', description: 'Uganda\'s largest game reserve' }
  ];

  const heroImages = [
    { title: 'Gorilla Trekking Adventures', subtitle: 'Meet mountain gorillas in their natural habitat', image: '🦍' },
    { title: 'River Nile Adventures', subtitle: 'Experience world-class white water rafting', image: '🚣‍♂️' },
    { title: 'Safari Expeditions', subtitle: 'Discover Uganda\'s incredible wildlife', image: '🦁' },
    { title: 'Cultural Encounters', subtitle: 'Connect with local communities', image: '🏘️' }
  ];

  const onSearch = (data: ExperienceSearchForm) => {
    const queryParams = new URLSearchParams(data as any);
    window.location.href = `/search?${queryParams.toString()}`;
  };

  const filteredExperiences = selectedCategory === 'all' 
    ? featuredExperiences 
    : featuredExperiences.filter(exp => 
        exp.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );

  // Auto-advance hero carousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Category carousel navigation
  const nextCategories = () => {
    const maxIndex = Math.max(0, adventureCategories.length - 6); // Show 6 categories at a time
    setCurrentCategoryIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevCategories = () => {
    setCurrentCategoryIndex(prev => Math.max(prev - 1, 0));
  };

  const getVisibleCategories = () => {
    return adventureCategories.slice(currentCategoryIndex, currentCategoryIndex + 6);
  };

  // Destination carousel navigation
  const nextDestinations = () => {
    const maxIndex = Math.max(0, ugandaDestinations.length - 6); // Show 6 destinations at a time
    setCurrentDestinationIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevDestinations = () => {
    setCurrentDestinationIndex(prev => Math.max(prev - 1, 0));
  };

  const getVisibleDestinations = () => {
    return ugandaDestinations.slice(currentDestinationIndex, currentDestinationIndex + 6);
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Uganda Adventure Experiences",
    "description": "Discover amazing adventure experiences in Uganda - from gorilla trekking to white water rafting",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "hasPart": featuredExperiences.map(exp => ({
      "@type": "TouristAttraction",
      "name": exp.title,
      "description": exp.description,
      "location": {
        "@type": "Place",
        "name": exp.location
      },
      "offers": {
        "@type": "Offer",
        "price": exp.price,
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": exp.rating,
        "reviewCount": exp.reviews
      }
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
          aria-label="Adventure experiences hero section"
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
              aria-label="Search Uganda adventure experiences"
            >
              <form onSubmit={handleSubmit(onSearch)}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                    <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-700">
                      Experience Type
                    </label>
                    <select
                      {...register('category')}
                      id="category"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      <option value="all">All Experiences</option>
                      <option value="wildlife">Wildlife Safari</option>
                      <option value="hiking">Hiking & Trekking</option>
                      <option value="water">Water Sports</option>
                      <option value="cultural">Cultural Tours</option>
                      <option value="adventure">Extreme Sports</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="dateFrom" className="block text-sm font-semibold mb-2 text-gray-700">
                      From Date
                    </label>
                    <input
                      {...register('dateFrom')}
                      id="dateFrom"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateTo" className="block text-sm font-semibold mb-2 text-gray-700">
                      To Date
                    </label>
                    <input
                      {...register('dateTo')}
                      id="dateTo"
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
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
                        <label htmlFor="duration" className="block text-sm font-semibold mb-2 text-gray-700">
                          Duration
                        </label>
                        <select
                          {...register('duration')}
                          id="duration"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        >
                          <option value="any">Any Duration</option>
                          <option value="half-day">Half Day (≤4 hours)</option>
                          <option value="full-day">Full Day (4-8 hours)</option>
                          <option value="multi-day">Multi-Day (2+ days)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="difficulty" className="block text-sm font-semibold mb-2 text-gray-700">
                          Difficulty
                        </label>
                        <select
                          {...register('difficulty')}
                          id="difficulty"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        >
                          <option value="any">Any Level</option>
                          <option value="easy">Easy</option>
                          <option value="moderate">Moderate</option>
                          <option value="challenging">Challenging</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-gray-700">
                          Price Range (USD)
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
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
                  style={{ backgroundColor: primaryColor }}
                  aria-label="Search Uganda adventure experiences"
                >
                  🔍 Search Adventures
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

        {/* Adventure Categories Section */}
        <section className="landing-section bg-gray-50" aria-labelledby="categories-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Adventure Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose your perfect adventure from our diverse range of Uganda experiences
              </p>
            </header>
            
            {/* Category Carousel with Navigation */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevCategories}
                    disabled={currentCategoryIndex === 0}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous categories"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextCategories}
                    disabled={currentCategoryIndex >= Math.max(0, adventureCategories.length - 6)}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next categories"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {getVisibleCategories().map((category) => {
                  const CategoryComponent = category.slug ? Link : 'button';
                  const componentProps = category.slug 
                    ? { href: `/category/${category.slug}` }
                    : { onClick: () => setSelectedCategory(category.id) };
                  
                  return (
                    <CategoryComponent
                      key={category.id}
                      {...componentProps}
                      className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 text-center focus:ring-2 focus:ring-offset-2 block ${
                        selectedCategory === category.id 
                          ? 'border-2 border-[#195e48] bg-[#195e48] text-white' 
                          : 'border border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        focusRingColor: primaryColor
                      }}
                      aria-label={category.slug ? `Explore ${category.name}` : `Filter by ${category.name}`}
                    >
                      <div className="text-3xl mb-2" aria-hidden="true">{category.icon}</div>
                      <h3 className="font-semibold text-xs mb-1">{category.name}</h3>
                      <p className="text-xs opacity-75">{category.count} experiences</p>
                      {category.slug && (
                        <div className="text-xs mt-1 opacity-60">View Category →</div>
                      )}
                    </CategoryComponent>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Uganda Destinations Map/Grid */}
        <section className="landing-section bg-white" aria-labelledby="destinations-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="destinations-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Uganda Destinations
              </h2>
              <p className="text-xl text-gray-600">
                Explore adventures across Uganda's most spectacular locations, from mountain peaks to tropical islands
              </p>
            </header>
            
            {/* Destinations Carousel with Navigation */}
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevDestinations}
                    disabled={currentDestinationIndex === 0}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous destinations"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextDestinations}
                    disabled={currentDestinationIndex >= Math.max(0, ugandaDestinations.length - 6)}
                    className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next destinations"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {currentDestinationIndex + 1}-{Math.min(currentDestinationIndex + 6, ugandaDestinations.length)} of {ugandaDestinations.length} destinations
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {getVisibleDestinations().map((destination, index) => (
                  <Link
                    key={destination.name}
                    href={getDestinationLink(destination.name)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden focus:ring-2 focus:ring-offset-2 group"
                    style={{ focusRingColor: primaryColor }}
                  >
                    <div 
                      className="h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: `${primaryColor}10` }}
                      aria-hidden="true"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-xs font-medium">Photo Coming Soon</span>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="mb-1">
                        <h3 className="font-semibold text-sm mb-1 leading-tight">{destination.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 leading-4 line-clamp-2 mb-2">{destination.description}</p>
                      <div className="flex justify-center">
                        <span 
                          className="text-xs font-semibold"
                          style={{ color: primaryColor }}
                        >
                          Explore →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: Math.ceil(ugandaDestinations.length / 6) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDestinationIndex(index * 6)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      Math.floor(currentDestinationIndex / 6) === index 
                        ? 'opacity-100' 
                        : 'bg-gray-300 opacity-60 hover:opacity-80'
                    }`}
                    style={{ 
                      backgroundColor: Math.floor(currentDestinationIndex / 6) === index ? primaryColor : undefined
                    }}
                    aria-label={`Go to destinations page ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="landing-section bg-gray-50" aria-labelledby="experiences-heading">
          <div className="content-section">
            <header className="flex justify-between items-center mb-12">
              <div>
                <h2 id="experiences-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured Experiences
                </h2>
                <p className="text-xl text-gray-600">
                  {selectedCategory === 'all' 
                    ? 'Our most popular Uganda adventures' 
                    : `Top ${adventureCategories.find(c => c.id === selectedCategory)?.name} experiences`
                  }
                </p>
              </div>
              <Link 
                href="/all-experiences" 
                className="hidden md:block btn-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                View All Experiences
              </Link>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredExperiences.map((experience) => (
                <article 
                  key={experience.id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={`/experiences/${experience.id}`}>
                    {/* Experience Image */}
                    <div 
                      className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <span aria-hidden="true">{experience.image}</span>
                      {experience.originalPrice > experience.price && (
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
                        <div className="flex items-center rating-stars">
                          {'★'.repeat(Math.floor(experience.rating))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          {experience.rating} ({experience.reviews} reviews)
                        </span>
                      </div>
                      
                      {/* Difficulty and Availability */}
                      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                        <span>🏃‍♂️ {experience.difficulty}</span>
                        <span>📅 {experience.availability}</span>
                      </div>
                      
                      {/* Price and Book Button */}
                      <div className="flex justify-between items-center">
                        <div>
                          {experience.originalPrice > experience.price && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              ${experience.originalPrice}
                            </span>
                          )}
                          <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                            ${experience.price}
                          </span>
                          <span className="text-sm text-gray-500 ml-1">per person</span>
                        </div>
                        <button
                          className="btn-primary text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                          style={{ backgroundColor: primaryColor }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/experiences/${experience.id}`;
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
                href="/all-experiences" 
                className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                View All Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Guide Integration */}
        <section className="landing-section bg-white" aria-labelledby="guides-heading">
          <div className="content-section">
            <header className="text-center mb-12">
              <h2 id="guides-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Adventure Travel Guides
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert tips and comprehensive guides to help you plan your perfect Uganda adventure
              </p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link
                href="/travel-guide/gorilla-trekking-guide"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  🦍
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Ultimate Gorilla Trekking Guide</h3>
                  <p className="text-gray-600 text-sm mb-4">Everything you need to know about gorilla permits, preparation, and what to expect</p>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>Read Guide →</span>
                </div>
              </Link>
              
              <Link
                href="/travel-guide/best-time-visit-uganda"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  📅
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Best Time to Visit Uganda</h3>
                  <p className="text-gray-600 text-sm mb-4">Discover optimal seasons for wildlife viewing, hiking, and adventure activities</p>
                  <span className="text-sm font-medium" style={{ color: primaryColor }}>Read Guide →</span>
                </div>
              </Link>
              
              <Link
                href="/travel-guide/adventure-safety-tips"
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  🛡️
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Adventure Safety Tips</h3>
                  <p className="text-gray-600 text-sm mb-4">Essential safety guidelines for outdoor adventures and wildlife encounters</p>
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
                View All Travel Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}