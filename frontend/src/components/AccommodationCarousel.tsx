'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Accommodation {
  id: number;
  name: string;
  location: string;
  country: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  discount: string;
  image: string;
  type: string;
  category: string;
  amenities: string[];
  specialFeatures: string[];
  availability: string;
}

interface AccommodationCarouselProps {
  accommodations: Accommodation[];
  primaryColor: string;
}

export default function AccommodationCarousel({ accommodations, primaryColor }: AccommodationCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      return 3; // Desktop
    }
    return 3; // Default for SSR
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());
  const totalSlides = Math.ceil(accommodations.length / cardsPerSlide);

  // Start autoplay
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    setAutoplayInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [totalSlides]);

  React.useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const minSwipeDistance = 50;

  const handleMouseEnter = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayInterval(null);
    }
  };

  const handleMouseLeave = () => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
    setAutoplayInterval(interval);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      nextSlide();
    }
    if (isRightSwipe && currentSlide > 0) {
      prevSlide();
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto">
      {/* Navigation Arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          style={{ focusRingColor: primaryColor }}
          aria-label="Previous accommodations"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentSlide < totalSlides - 1 && (
        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          style={{ focusRingColor: primaryColor }}
          aria-label="Next accommodations"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden px-6 md:px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 px-2 md:px-4">
              <div className={`grid grid-cols-1 ${cardsPerSlide === 2 ? 'md:grid-cols-2' : cardsPerSlide === 3 ? 'md:grid-cols-3' : ''} gap-4 md:gap-8`}>
                {accommodations
                  .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                  .map((accommodation) => (
                    <Link
                      key={accommodation.id}
                      href={`/accommodations/${accommodation.id}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group mx-2 md:mx-4 flex flex-col"
                      aria-label={`Book ${accommodation.name} in ${accommodation.location}`}
                    >
                        {/* Discount Badge */}
                        <div className="relative">
                          {accommodation.discount && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                {accommodation.discount}
                              </span>
                            </div>
                          )}

                          {/* Image/Icon Area */}
                          <div
                            className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                            style={{ backgroundColor: `${primaryColor}10` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {accommodation.image}
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          {/* Category and Type */}
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                              {accommodation.category}
                            </span>
                            <span className="text-sm text-gray-500">{accommodation.type}</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                            {accommodation.name}
                          </h3>

                          {/* Location with Country */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-600">📍 {accommodation.location}</span>
                          </div>
                          <div className="text-sm font-medium text-gray-700 mb-3">
                            {accommodation.country}
                          </div>

                          {/* Amenities */}
                          <div className="flex gap-2 mb-3">
                            {accommodation.amenities.slice(0, 2).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>

                          {/* Rating */}
                          <div className="flex items-center mb-3">
                            <div className="flex items-center text-yellow-500">
                              {'★'.repeat(Math.floor(accommodation.rating))}
                              {'☆'.repeat(5 - Math.floor(accommodation.rating))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {accommodation.rating} ({accommodation.reviews} reviews)
                            </span>
                          </div>

                          {/* Special Features and Availability */}
                          <div className="flex justify-between items-center mb-4 text-xs">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                              </svg>
                              {accommodation.specialFeatures[0]}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {accommodation.availability}
                            </span>
                          </div>

                          {/* Price - Push to bottom */}
                          <div className="flex justify-between items-center pt-4 border-t mt-auto">
                            <div>
                              <span className="text-gray-400 line-through text-sm">${accommodation.originalPrice}</span>
                              <span className="text-2xl font-bold ml-2" style={{ color: primaryColor }}>
                                ${accommodation.price}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">per night</span>
                          </div>

                          {/* Book Now Button (always visible with hover effect) */}
                          <button
                            className="w-full mt-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:brightness-110"
                            style={{ backgroundColor: primaryColor }}
                          >
                            Book Now
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
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-8' : 'w-2'
            }`}
            style={{
              backgroundColor: index === currentSlide ? primaryColor : '#D1D5DB'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}