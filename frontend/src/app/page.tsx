'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { getDestinationLink, hasDestinationPage } from '@/lib/destinations';

interface SearchForm {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  category: 'all' | 'accommodations' | 'experiences';
}

export default function Home() {
  const { register, handleSubmit, watch } = useForm<SearchForm>({
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      category: 'all'
    }
  });

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const watchDestination = watch('destination');

  const onSearch = (data: SearchForm) => {
    const queryParams = new URLSearchParams({
      destination: data.destination,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests.toString(),
      category: data.category
    });
    
    window.location.href = `/search?${queryParams.toString()}`;
  };

  const ugandaDestinations = [
    { name: 'Kampala', description: 'Uganda\'s vibrant capital city', image: '🏙️', experiences: 12 },
    { name: 'Bwindi Impenetrable Forest', description: 'Home to mountain gorillas', image: '🦍', experiences: 8 },
    { name: 'Queen Elizabeth National Park', description: 'Wildlife safari paradise', image: '🦁', experiences: 15 },
    { name: 'Lake Victoria', description: 'Africa\'s largest freshwater lake', image: '🌊', experiences: 8 },
    { name: 'Murchison Falls', description: 'World\'s most powerful waterfall', image: '💦', experiences: 10 },
    { name: 'Jinja', description: 'Adventure capital of East Africa', image: '🚣‍♂️', experiences: 18 },
    { name: 'Lake Bunyonyi', description: 'Switzerland of Africa', image: '🏔️', experiences: 5 },
    { name: 'Sipi Falls', description: 'Three-tier waterfall system', image: '🏔️', experiences: 7 },
    { name: 'Mt Elgon', description: 'Ancient volcanic mountain', image: '⛰️', experiences: 9 },
    { name: 'Mt Rwenzori', description: 'Mountains of the Moon', image: '🏔️', experiences: 6 },
    { name: 'Fort Portal', description: 'Gateway to crater lakes', image: '🌿', experiences: 11 },
    { name: 'Kibale National Park', description: 'Primate capital of the world', image: '🐒', experiences: 8 },
    { name: 'Kidepo Valley National Park', description: 'Remote wilderness paradise', image: '🦓', experiences: 7 },
    { name: 'Ssese Islands', description: 'Tropical island paradise', image: '🏖️', experiences: 6 },
    { name: 'Ngamba Island', description: 'Chimpanzee sanctuary island', image: '🌴', experiences: 2 },
    { name: 'Banda Island', description: 'Secluded island retreat', image: '🏝️', experiences: 3 },
    { name: 'Bulago Island', description: 'Private luxury island', image: '🏭️', experiences: 2 },
    { name: 'Lake Mburo National Park', description: 'Compact savanna park', image: '🦓', experiences: 5 },
    { name: 'Semuliki National Park', description: 'Lowland tropical rainforest', image: '🦅', experiences: 4 },
    { name: 'Pian Upe Wildlife Reserve', description: 'Uganda\'s largest game reserve', image: '🦓', experiences: 3 }
  ];

  const featuredExperiences = [
    {
      id: 1,
      title: 'Gorilla Trekking in Bwindi',
      location: 'Bwindi Impenetrable Forest',
      rating: 4.9,
      reviews: 234,
      price: 800,
      image: '🦍',
      duration: '1 day',
      category: 'Wildlife'
    },
    {
      id: 2,
      title: 'White Water Rafting',
      location: 'Jinja, River Nile',
      rating: 4.7,
      reviews: 187,
      price: 120,
      image: '🚣‍♂️',
      duration: '4 hours',
      category: 'Adventure'
    },
    {
      id: 3,
      title: 'Safari in Queen Elizabeth',
      location: 'Queen Elizabeth National Park',
      rating: 4.8,
      reviews: 312,
      price: 350,
      image: '🦁',
      duration: '3 days',
      category: 'Wildlife'
    },
    {
      id: 4,
      title: 'Cultural Village Tour',
      location: 'Batwa Community',
      rating: 4.6,
      reviews: 89,
      price: 75,
      image: '🏘️',
      duration: '2 hours',
      category: 'Culture'
    }
  ];

  const featuredAccommodations = [
    {
      id: 1,
      name: 'Clouds Mountain Gorilla Lodge',
      location: 'Bwindi Forest',
      rating: 4.9,
      reviews: 156,
      price: 450,
      image: '🏞️',
      type: 'Eco-Lodge'
    },
    {
      id: 2,
      name: 'Chobe Safari Lodge',
      location: 'Murchison Falls',
      rating: 4.7,
      reviews: 203,
      price: 280,
      image: '🦁',
      type: 'Safari Lodge'
    },
    {
      id: 3,
      name: 'Birdnest Resort',
      location: 'Lake Bunyonyi',
      rating: 4.8,
      reviews: 127,
      price: 180,
      image: '🏔️',
      type: 'Resort'
    },
    {
      id: 4,
      name: 'Hairy Lemon Island',
      location: 'Lake Victoria',
      rating: 4.5,
      reviews: 94,
      price: 120,
      image: '🏝️',
      type: 'Island Resort'
    }
  ];

  const greenPathsHighlights = [
    {
      title: 'Tree Planting Programs',
      description: 'Join our reforestation efforts across Uganda',
      icon: '🌳',
      impact: '50,000+ trees planted'
    },
    {
      title: 'Carbon Offset Travel',
      description: 'Every trip contributes to environmental restoration',
      icon: '🌍',
      impact: '100% carbon neutral'
    },
    {
      title: 'Community Conservation',
      description: 'Supporting local communities in conservation efforts',
      icon: '👥',
      impact: '25 communities supported'
    }
  ];

  const travelGuideTeases = [
    {
      title: 'Best Time to Visit Uganda',
      preview: 'Discover the optimal seasons for wildlife viewing and adventure activities...',
      readTime: '5 min read',
      image: '📅'
    },
    {
      title: 'Gorilla Trekking Guide',
      preview: 'Everything you need to know for an unforgettable gorilla encounter...',
      readTime: '8 min read',
      image: '🦍'
    },
    {
      title: 'Cultural Etiquette in Uganda',
      preview: 'Respectful travel tips for meaningful cultural exchanges...',
      readTime: '4 min read',
      image: '🤝'
    }
  ];

  const filteredDestinations = ugandaDestinations.filter(dest =>
    dest.name.toLowerCase().includes(watchDestination.toLowerCase())
  );

  // Responsive carousel navigation functions
  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 card
      if (window.innerWidth < 768) return 2; // Small tablet: 2 cards
      if (window.innerWidth < 1024) return 3; // Tablet: 3 cards
      if (window.innerWidth < 1280) return 4; // Desktop: 4 cards
      return 5; // Large desktop: 5 cards
    }
    return 5; // Default for SSR
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());
  const totalSlides = Math.ceil(ugandaDestinations.length / cardsPerSlide);

  // Update cards per slide on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextDestination = () => {
    if (currentDestinationIndex < totalSlides - 1) {
      setCurrentDestinationIndex(currentDestinationIndex + 1);
    }
  };

  const prevDestination = () => {
    if (currentDestinationIndex > 0) {
      setCurrentDestinationIndex(currentDestinationIndex - 1);
    }
  };

  // Touch/swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentDestinationIndex < totalSlides - 1) {
      nextDestination();
    }
    if (isRightSwipe && currentDestinationIndex > 0) {
      prevDestination();
    }
  };

  const primaryColor = '#195e48';

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Shake's Travel",
    "description": "Sustainable Uganda adventures and eco-friendly accommodations in the Pearl of Africa",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/brand_assets/images/logo/logo.png`,
    "image": `${typeof window !== 'undefined' ? window.location.origin : ''}/images/uganda-hero.jpg`,
    "telephone": "+256-XXX-XXXXXX",
    "email": "info@shakestravel.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressLocality": "Kampala",
      "addressRegion": "Central Region"
    },
    "sameAs": [
      "https://facebook.com/shakestravel",
      "https://instagram.com/shakestravel",
      "https://twitter.com/shakestravel"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Gorilla Trekking Tours",
        "description": "Experience mountain gorillas in their natural habitat",
        "category": "Adventure Tourism"
      },
      {
        "@type": "Offer", 
        "name": "Safari Adventures",
        "description": "Wildlife viewing in Uganda's national parks",
        "category": "Wildlife Tourism"
      },
      {
        "@type": "Offer",
        "name": "Cultural Tours",
        "description": "Authentic cultural experiences with local communities",
        "category": "Cultural Tourism"
      },
      {
        "@type": "Offer",
        "name": "Eco-Friendly Accommodations",
        "description": "Sustainable lodging options across Uganda",
        "category": "Green Accommodations"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Uganda"
    }
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
        className="relative hero-carousel min-h-[90vh] flex items-center justify-center text-white py-20"
        aria-label="Hero section with search functionality"
        role="banner"
      >
        <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
        <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <header>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Discover Uganda's Wonders
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Experience the Pearl of Africa through carefully planned adventures designed to meet your travel goals while conserving the environment, featuring eco-friendly accommodations and meaningful cultural connections
            </p>
          </header>
          
          {/* Enhanced Search Form */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900 max-w-6xl mx-auto"
            role="search"
            aria-label="Search for Uganda travel experiences"
          >
            <form onSubmit={handleSubmit(onSearch)} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="md:col-span-2 search-autocomplete">
                <label htmlFor="destination-search" className="block text-sm font-semibold mb-2 text-gray-700">
                  Where in Uganda?
                </label>
                <input
                  {...register('destination', { required: true })}
                  id="destination-search"
                  type="text"
                  placeholder="Search destinations, parks, activities..."
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-lg"
                  style={{ focusRingColor: primaryColor }}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  aria-describedby="destination-help"
                  autoComplete="off"
                />
                <div id="destination-help" className="sr-only">
                  Type to search for destinations in Uganda. Autocomplete suggestions will appear below.
                </div>
                {showAutocomplete && watchDestination && filteredDestinations.length > 0 && (
                  <div 
                    className="search-autocomplete-dropdown"
                    role="listbox"
                    aria-label="Destination suggestions"
                  >
                    {filteredDestinations.slice(0, 5).map((dest, index) => (
                      <div
                        key={index}
                        className="search-autocomplete-item flex items-center space-x-3"
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        onClick={() => {
                          register('destination').onChange({ target: { value: dest.name } });
                          setShowAutocomplete(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            register('destination').onChange({ target: { value: dest.name } });
                            setShowAutocomplete(false);
                          }
                        }}
                      >
                        <span className="text-2xl" aria-hidden="true">{dest.image}</span>
                        <div>
                          <div className="font-medium">{dest.name}</div>
                          <div className="text-sm text-gray-500">{dest.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="checkin-date" className="block text-sm font-semibold mb-2 text-gray-700">
                  Check-in
                </label>
                <input
                  {...register('checkIn')}
                  id="checkin-date"
                  type="date"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  aria-label="Select check-in date"
                />
              </div>
              
              <div>
                <label htmlFor="guest-count" className="block text-sm font-semibold mb-2 text-gray-700">
                  Guests
                </label>
                <select
                  {...register('guests')}
                  id="guest-count"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  aria-label="Select number of guests"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </form>
            
            <fieldset className="flex flex-wrap gap-6 mt-6 justify-center">
              <legend className="sr-only">Choose experience category</legend>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="all" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="all-experiences-desc"
                />
                All Experiences
                <span id="all-experiences-desc" className="sr-only">Search all types of experiences</span>
              </label>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="accommodations" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="accommodations-desc"
                />
                Accommodations
                <span id="accommodations-desc" className="sr-only">Search for places to stay</span>
              </label>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="experiences" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="adventures-desc"
                />
                Adventures
                <span id="adventures-desc" className="sr-only">Search for adventure activities</span>
              </label>
            </fieldset>
            
            <button
              type="submit"
              className="w-full mt-8 btn-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#164439'}
              onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
              aria-label="Search for Uganda travel experiences"
            >
              🔍 Search Uganda Adventures
            </button>
          </div>
        </div>
      </section>

      {/* Uganda Destinations Showcase */}
      <section id="destinations" className="py-20 bg-gray-50" aria-labelledby="destinations-heading">
        <div className="content-section">
          <header className="text-center mb-16">
            <h2 id="destinations-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Uganda's Treasures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From misty mountains to tropical islands, discover the diverse landscapes that make Uganda truly special
            </p>
          </header>
          
          {/* Destinations Carousel - 5 Cards Per Slide */}
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Arrows */}
            {currentDestinationIndex > 0 && (
              <button
                onClick={prevDestination}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: primaryColor }}
                aria-label="Previous destinations"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {currentDestinationIndex < totalSlides - 1 && (
              <button
                onClick={nextDestination}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: primaryColor }}
                aria-label="Next destinations"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Carousel Container */}
            <div className="overflow-hidden px-4 sm:px-8 lg:px-12">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentDestinationIndex * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="flex gap-2 sm:gap-3 md:gap-4 justify-between">
                      {ugandaDestinations
                        .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                        .map((destination, index) => (
                          <article key={destination.name} className="flex-1 group min-w-0">
                            <Link 
                              href={getDestinationLink(destination.name)}
                              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 block focus:ring-2 focus:ring-offset-2 flex flex-col h-72 sm:h-60 md:h-64"
                              style={{ focusRingColor: primaryColor }}
                              aria-label={`Explore ${destination.name}: ${destination.description}`}
                            >
                              <div 
                                className="h-40 sm:h-28 md:h-32 flex items-center justify-center text-4xl sm:text-3xl md:text-4xl flex-shrink-0 group-hover:scale-105 transition-transform duration-200" 
                                style={{ backgroundColor: `${primaryColor}10` }}
                                aria-hidden="true"
                              >
                                {destination.image}
                              </div>
                              <div className="p-3 sm:p-3 md:p-4 flex flex-col justify-between flex-1">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-sm sm:text-sm text-gray-900 flex-1 line-clamp-1">{destination.name}</h3>
                                    {hasDestinationPage(destination.name) && (
                                      <span className="bg-[#195e48] text-white text-xs px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0 hidden sm:inline">
                                        ✨ Featured
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-xs sm:text-xs mb-3 line-clamp-2 leading-relaxed">{destination.description}</p>
                                </div>
                                <div className="flex justify-between items-center mt-auto">
                                  <span className="text-sm font-medium" style={{ color: primaryColor }}>{destination.experiences} experiences</span>
                                  <span 
                                    className="text-xs font-semibold transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline"
                                    style={{ color: primaryColor }}
                                  >
                                    {hasDestinationPage(destination.name) ? 'Visit →' : 'Explore →'}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </article>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDestinationIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 focus:ring-2 focus:ring-offset-2 ${
                    index === currentDestinationIndex 
                      ? 'opacity-100' 
                      : 'bg-gray-300 opacity-60 hover:opacity-80'
                  }`}
                  style={{ 
                    backgroundColor: index === currentDestinationIndex ? primaryColor : undefined,
                    focusRingColor: primaryColor 
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Top Experiences
              </h2>
              <p className="text-xl text-gray-600">
                Unforgettable adventures awaiting your discovery
              </p>
            </div>
            <Link 
              href="/all-experiences" 
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Experiences
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredExperiences.map((experience) => (
              <Link
                key={experience.id}
                href={`/experiences/${experience.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect"
              >
                <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  {experience.image}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                      {experience.category}
                    </span>
                    <span className="text-sm text-gray-500">{experience.duration}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{experience.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center rating-stars">
                      {'★'.repeat(Math.floor(experience.rating))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {experience.rating} ({experience.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      ${experience.price}
                    </span>
                    <span className="text-sm text-gray-500">per person</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-20 bg-gray-50">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Eco-Friendly Stays
              </h2>
              <p className="text-xl text-gray-600">
                Sustainable accommodations in Uganda's most beautiful locations
              </p>
            </div>
            <Link 
              href="/accommodations" 
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Stays
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAccommodations.map((accommodation) => (
              <Link
                key={accommodation.id}
                href={`/accommodations/${accommodation.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect"
              >
                <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  {accommodation.image}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                      {accommodation.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{accommodation.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {accommodation.location}</p>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center rating-stars">
                      {'★'.repeat(Math.floor(accommodation.rating))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {accommodation.rating} ({accommodation.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      ${accommodation.price}
                    </span>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Planting Green Paths Section */}
      <section className="py-20" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="content-section">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌱 Planting Green Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Travel with purpose. Every journey contributes to Uganda's environmental conservation and community development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {greenPathsHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center card-hover-effect">
                <div className="text-6xl mb-4">{highlight.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{highlight.title}</h3>
                <p className="text-gray-600 mb-4">{highlight.description}</p>
                <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  {highlight.impact}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/planting-green-paths" 
              className="btn-primary text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center"
              style={{ backgroundColor: primaryColor }}
            >
              🌍 Join Our Green Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Guide Teasers */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Travel Insights
              </h2>
              <p className="text-xl text-gray-600">
                Expert tips and guides for your perfect Uganda adventure
              </p>
            </div>
            <Link 
              href="/travel-guide" 
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Guides
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {travelGuideTeases.map((guide, index) => (
              <Link
                key={index}
                href={`/travel-guide/${guide.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-gray-50 rounded-2xl overflow-hidden card-hover-effect"
              >
                <div className="h-32 flex items-center justify-center text-5xl" style={{ backgroundColor: `${primaryColor}10` }}>
                  {guide.image}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{guide.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{guide.preview}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Footer */}
      <section className="py-20 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Uganda Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers discovering sustainable adventures in the Pearl of Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/all-experiences" 
              className="bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              style={{ color: primaryColor }}
            >
              🌟 Explore Experiences
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-white text-white hover:bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              style={{ borderColor: 'white' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              📖 Learn About Us
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
