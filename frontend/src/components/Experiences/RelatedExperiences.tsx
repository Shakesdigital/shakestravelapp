'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface RelatedExperience {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  ecoFriendly: boolean;
  region: string;
}

interface RelatedExperiencesProps {
  currentExperienceId: number;
  category: string;
  region: string;
}

const RelatedExperiences: React.FC<RelatedExperiencesProps> = ({
  currentExperienceId,
  category,
  region
}) => {
  const [relatedExperiences, setRelatedExperiences] = useState<RelatedExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const primaryColor = '#195e48';

  // Sample related experiences data (in production, this would come from an API)
  const sampleExperiences: RelatedExperience[] = [
    {
      id: 2,
      title: 'Chimpanzee Trekking in Kibale',
      location: 'Kibale National Park',
      category: 'Wildlife Safari',
      duration: 'Half Day',
      difficulty: 'Moderate',
      rating: 4.8,
      reviews: 145,
      price: 200,
      image: '🐒',
      description: 'Track our closest relatives through the lush forests of Kibale National Park',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 3,
      title: 'Queen Elizabeth Safari',
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
      ecoFriendly: true,
      region: 'Western Uganda'
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
      ecoFriendly: true,
      region: 'Southwestern Uganda'
    },
    {
      id: 5,
      title: 'Lake Bunyonyi Island Hopping',
      location: 'Lake Bunyonyi',
      category: 'Water Sports',
      duration: 'Full Day',
      difficulty: 'Easy',
      rating: 4.4,
      reviews: 98,
      price: 65,
      image: '🏔️',
      description: 'Explore the beautiful islands of Africa\'s deepest lake',
      ecoFriendly: true,
      region: 'Southwestern Uganda'
    },
    {
      id: 6,
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
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 7,
      title: 'Rwenzori Mountains Expedition',
      location: 'Rwenzori Mountains',
      category: 'Hiking & Trekking',
      duration: '7 Days',
      difficulty: 'Challenging',
      rating: 4.9,
      reviews: 67,
      price: 1200,
      image: '⛰️',
      description: 'Summit the legendary Mountains of the Moon with experienced guides',
      ecoFriendly: true,
      region: 'Western Uganda'
    }
  ];

  useEffect(() => {
    setLoading(true);
    
    // Simulate API call with filtering logic
    setTimeout(() => {
      let filtered = sampleExperiences.filter(exp => exp.id !== currentExperienceId);
      
      // Prioritize experiences in same category or region
      const sameCategory = filtered.filter(exp => exp.category === category);
      const sameRegion = filtered.filter(exp => exp.region === region && exp.category !== category);
      const others = filtered.filter(exp => exp.category !== category && exp.region !== region);
      
      // Combine with priority order and limit to 6
      const related = [...sameCategory, ...sameRegion, ...others].slice(0, 6);
      
      setRelatedExperiences(related);
      setLoading(false);
    }, 500);
  }, [currentExperienceId, category, region]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % Math.ceil(relatedExperiences.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + Math.ceil(relatedExperiences.length / 3)) % Math.ceil(relatedExperiences.length / 3));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || relatedExperiences.length === 0) {
    return null;
  }

  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(relatedExperiences.length / cardsPerSlide);

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="content-section">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              You Might Also Like
            </h2>
            <p className="text-xl text-gray-600">
              Similar experiences in {region} and {category.toLowerCase()} adventures
            </p>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={prevSlide}
              disabled={totalSlides <= 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous experiences"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={totalSlides <= 1}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next experiences"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Carousel */}
        <div className="hidden lg:block relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-3 gap-6">
                    {relatedExperiences
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((experience) => (
                        <ExperienceCard key={experience.id} experience={experience} />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide
                      ? 'opacity-100'
                      : 'bg-gray-300 opacity-60 hover:opacity-80'
                  }`}
                  style={{
                    backgroundColor: index === currentSlide ? primaryColor : undefined
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mobile Grid */}
        <div className="lg:hidden space-y-6">
          {relatedExperiences.slice(0, 4).map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} isMobile />
          ))}
          
          {relatedExperiences.length > 4 && (
            <div className="text-center pt-4">
              <Link
                href="/all-experiences"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                View All Experiences
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* View All Link for Desktop */}
        <div className="hidden lg:block text-center mt-12">
          <Link
            href="/all-experiences"
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            Explore All Uganda Adventures
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// Experience Card Component
interface ExperienceCardProps {
  experience: RelatedExperience;
  isMobile?: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, isMobile = false }) => {
  const primaryColor = '#195e48';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <article 
      className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group ${
        isMobile ? 'flex space-x-4' : ''
      }`}
    >
      <Link href={`/experiences/${experience.id}`} className="block">
        {/* Image */}
        <div 
          className={`flex items-center justify-center text-6xl relative overflow-hidden group-hover:scale-105 transition-transform duration-300 ${
            isMobile ? 'w-24 h-24 rounded-xl flex-shrink-0 mt-4 ml-4' : 'h-48'
          }`}
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <span aria-hidden="true">{experience.image}</span>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {experience.originalPrice && experience.originalPrice > experience.price && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Save {formatCurrency(experience.originalPrice - experience.price)}
              </span>
            )}
            {experience.ecoFriendly && (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                🌱 Eco
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-4 ${isMobile ? 'flex-1' : 'p-6'}`}>
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
          <h3 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            {experience.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
          
          {/* Description */}
          {!isMobile && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {experience.description}
            </p>
          )}
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(experience.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {experience.rating} ({experience.reviews} reviews)
            </span>
          </div>
          
          {/* Difficulty */}
          {!isMobile && (
            <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
              <span>🏃‍♂️ {experience.difficulty}</span>
            </div>
          )}
          
          {/* Price */}
          <div className="flex justify-between items-center">
            <div>
              {experience.originalPrice && experience.originalPrice > experience.price && (
                <span className="text-sm text-gray-400 line-through mr-2">
                  {formatCurrency(experience.originalPrice)}
                </span>
              )}
              <span className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ color: primaryColor }}>
                {formatCurrency(experience.price)}
              </span>
              <span className="text-sm text-gray-500 ml-1">per person</span>
            </div>
            
            {!isMobile && (
              <span 
                className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: primaryColor }}
              >
                View Details →
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default RelatedExperiences;