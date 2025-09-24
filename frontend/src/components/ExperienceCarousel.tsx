'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Experience {
  id: number;
  title: string;
  location: string;
  country: string;
  rating: number;
  reviews: number;
  image: string;
  duration: string;
  category: string;
  highlights: string[];
  difficulty: string;
  availability: string;
  description: string;
  price?: number;
  originalPrice?: number;
}

interface ExperienceCarouselProps {
  experiences: Experience[];
  primaryColor: string;
}

import { topEastAfricaExperiences } from '@/data/topExperiences';

export default function ExperienceCarousel({ experiences = topEastAfricaExperiences, primaryColor }: ExperienceCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) return 1; // Mobile
      if (window.innerWidth < 1280) return 2; // Tablet/Small Desktop
      return 3; // Large Desktop
    }
    return 3;
  };

  // Calculate total slides and maxIndex based on current state
  const totalSlides = Math.ceil(experiences.length / cardsPerView);
  const maxIndex = totalSlides - 1;

  // Autoplay disabled

  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const handleMouseEnter = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  };

  const handleMouseLeave = () => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const total = Math.ceil(experiences.length / cardsPerView);
        return prev >= total - 1 ? 0 : prev + 1;
      });
    }, 5000);
    setAutoplayInterval(interval);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    // Prevent default to avoid scrolling while swiping
    e.preventDefault();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    // Prevent scrolling while swiping
    e.preventDefault();
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  // Auto-play functionality disabled
  useEffect(() => {
    // No auto-play interval
  }, [maxIndex]);

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ color: primaryColor }}
          aria-label="Previous experiences"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ color: primaryColor }}
          aria-label="Next experiences"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden px-2 md:px-4">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 px-1 md:px-2">
              <div className={`grid grid-cols-1 ${cardsPerView === 2 ? 'md:grid-cols-2' : cardsPerView === 3 ? 'md:grid-cols-3' : ''} gap-2 md:gap-4`}>
                {experiences
                  .slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView)
                  .map((experience) => (
                    <Link
                      key={experience.id}
                      href={`/experiences/${experience.id}`}
                      className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group flex flex-col w-full max-w-md mx-auto"
                    >
                      {/* Image/Icon Area */}
                      <div className="relative">
                        <div
                          className="h-56 flex items-center justify-center text-6xl relative overflow-hidden"
                          style={{ backgroundColor: `${primaryColor}10` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          {experience.image}
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Category and Duration */}
                        <div className="flex justify-between items-start mb-2">
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            {experience.category}
                          </span>
                          <span className="text-sm text-gray-500">{experience.duration}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                          {experience.title}
                        </h3>

                        {/* Location with Country */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">📍 {experience.location}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-700 mb-3">
                          {experience.country}
                        </div>

                        {/* Description/Introduction */}
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {experience.description}
                        </p>

                        {/* Highlights */}
                        <div className="flex gap-2 mb-3">
                          {experience.highlights.map((highlight, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          <div className="flex items-center text-yellow-500">
                            {'★'.repeat(Math.floor(experience.rating))}
                            {'☆'.repeat(5 - Math.floor(experience.rating))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {experience.rating} ({experience.reviews} reviews)
                          </span>
                        </div>

                        {/* Difficulty and Availability */}
                        <div className="flex justify-between items-center mb-4 text-xs">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {experience.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {experience.availability}
                          </span>
                        </div>

                        {/* Price Information */}
                        {experience.price !== undefined && (
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              {experience.originalPrice && experience.originalPrice > experience.price && (
                                <span className="text-sm text-gray-400 line-through mr-2">
                                  ${experience.originalPrice}
                                </span>
                              )}
                              <span className="text-lg font-bold" style={{ color: primaryColor }}>
                                ${experience.price}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">per person</span>
                            </div>
                          </div>
                        )}

                        {/* Learn More Button */}
                        <button
                          className="w-full mt-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:brightness-110"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Learn More
                        </button>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8' : 'w-2'
            }`}
            style={{
              backgroundColor: index === currentIndex ? primaryColor : '#D1D5DB'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}