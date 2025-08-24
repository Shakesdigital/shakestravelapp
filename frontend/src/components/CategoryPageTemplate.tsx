'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImages: {
    src: string;
    alt: string;
    caption: string;
  }[];
  featuredDestinations: {
    id: string;
    name: string;
    description: string;
    image: string;
    experienceCount: number;
  }[];
  featuredExperiences: {
    id: string;
    title: string;
    location: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice?: number;
    duration: string;
    difficulty: string;
    image: string;
    highlights: string[];
  }[];
  travelInsights: {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    readTime: string;
    category: string;
  }[];
  stats: {
    totalExperiences: number;
    avgRating: number;
    topDestination: string;
  };
}

interface CategoryPageTemplateProps {
  categoryData: CategoryData;
}

const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({ categoryData }) => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [currentExperienceIndex, setCurrentExperienceIndex] = useState(0);
  
  const primaryColor = '#195e48';
  
  // Auto-advance hero carousel
  useEffect(() => {
    if (categoryData.heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroImage(prev => (prev + 1) % categoryData.heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [categoryData.heroImages.length]);

  // Destination carousel navigation
  const nextDestinations = () => {
    const maxIndex = Math.max(0, categoryData.featuredDestinations.length - 3);
    setCurrentDestinationIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevDestinations = () => {
    setCurrentDestinationIndex(prev => Math.max(prev - 1, 0));
  };

  // Experience carousel navigation
  const nextExperiences = () => {
    const maxIndex = Math.max(0, categoryData.featuredExperiences.length - 3);
    setCurrentExperienceIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevExperiences = () => {
    setCurrentExperienceIndex(prev => Math.max(prev - 1, 0));
  };

  const getVisibleDestinations = () => {
    return categoryData.featuredDestinations.slice(currentDestinationIndex, currentDestinationIndex + 3);
  };

  const getVisibleExperiences = () => {
    return categoryData.featuredExperiences.slice(currentExperienceIndex, currentExperienceIndex + 3);
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoryData.title} Adventures in Uganda`,
    "description": categoryData.description,
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "hasPart": categoryData.featuredExperiences.map(exp => ({
      "@type": "TouristAttraction",
      "name": exp.title,
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
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center text-white overflow-hidden">
          {/* Hero Image Carousel */}
          <div className="absolute inset-0">
            {categoryData.heroImages.map((heroImage, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    background: `linear-gradient(135deg, rgba(25, 94, 72, 0.7) 0%, rgba(25, 94, 72, 0.5) 100%)`
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-20" />
              </div>
            ))}
          </div>
          
          <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {categoryData.title} Adventures in Uganda
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                {categoryData.subtitle}
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{categoryData.stats.totalExperiences}</div>
                <div className="text-sm opacity-90">Unique Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categoryData.stats.avgRating}</div>
                <div className="text-sm opacity-90">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categoryData.stats.topDestination}</div>
                <div className="text-sm opacity-90">Top Destination</div>
              </div>
            </div>
          </div>
          
          {/* Hero Navigation */}
          {categoryData.heroImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentHeroImage(prev => 
                  prev === 0 ? categoryData.heroImages.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentHeroImage(prev => 
                  (prev + 1) % categoryData.heroImages.length
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Hero Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {categoryData.heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentHeroImage ? 'bg-white opacity-100' : 'bg-white opacity-50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Introduction Section */}
        <section className="py-16 bg-white">
          <div className="content-section">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Discover {categoryData.title} in Uganda
              </h2>
              <div className="text-lg text-gray-600 leading-relaxed space-y-4">
                {categoryData.description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Destinations Section */}
        <section className="py-16 bg-gray-50">
          <div className="content-section">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Top {categoryData.title} Destinations
                </h2>
                <p className="text-xl text-gray-600">
                  Explore Uganda's premier locations for {categoryData.title.toLowerCase()} adventures
                </p>
              </div>
              
              {/* Destination Navigation */}
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
                  disabled={currentDestinationIndex >= Math.max(0, categoryData.featuredDestinations.length - 3)}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next destinations"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getVisibleDestinations().map((destination) => (
                <article 
                  key={destination.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div 
                    className="h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <span aria-hidden="true">{destination.image}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{destination.name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{destination.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium" style={{ color: primaryColor }}>
                        {destination.experienceCount} experiences
                      </span>
                    </div>
                    <Link
                      href={`/destinations/${destination.id}`}
                      className="btn-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors block text-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Explore {destination.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Experiences Section */}
        <section className="py-16 bg-white">
          <div className="content-section">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Featured {categoryData.title} Experiences
                </h2>
                <p className="text-xl text-gray-600">
                  Hand-picked adventures that showcase the best of {categoryData.title.toLowerCase()}
                </p>
              </div>
              
              {/* Experience Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevExperiences}
                  disabled={currentExperienceIndex === 0}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous experiences"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextExperiences}
                  disabled={currentExperienceIndex >= Math.max(0, categoryData.featuredExperiences.length - 3)}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next experiences"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {getVisibleExperiences().map((experience) => (
                <article 
                  key={experience.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <span aria-hidden="true">{experience.image}</span>
                    {experience.originalPrice && experience.originalPrice > experience.price && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Save ${experience.originalPrice - experience.price}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-gray-500">{experience.duration}</span>
                      <span className="text-sm text-gray-500">🏃‍♂️ {experience.difficulty}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{experience.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      <div className="flex items-center rating-stars">
                        {'★'.repeat(Math.floor(experience.rating))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {experience.rating} ({experience.reviews} reviews)
                      </span>
                    </div>
                    
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
                    
                    {/* Price and CTA */}
                    <div className="flex justify-between items-center">
                      <div>
                        {experience.originalPrice && experience.originalPrice > experience.price && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            ${experience.originalPrice}
                          </span>
                        )}
                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                          ${experience.price}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">per person</span>
                      </div>
                      <Link
                        href={`/trips/${experience.id}`}
                        className="btn-primary text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                        style={{ backgroundColor: primaryColor }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href={`/all-experiences?category=${categoryData.slug}`}
                className="btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Explore More {categoryData.title} →
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Guide Insights Section */}
        <section className="py-16 bg-gray-50">
          <div className="content-section">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {categoryData.title} Travel Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert tips, guides, and stories to help you make the most of your {categoryData.title.toLowerCase()} adventure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoryData.travelInsights.map((insight) => (
                <article 
                  key={insight.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="h-32 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <span aria-hidden="true">{insight.image}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                      >
                        {insight.category}
                      </span>
                      <span className="text-xs text-gray-500">{insight.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{insight.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{insight.excerpt}</p>
                    <Link
                      href={`/travel-guide/${insight.id}`}
                      className="text-sm font-semibold transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/travel-guide"
                className="btn-outline border-2 px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                View All Travel Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryPageTemplate;