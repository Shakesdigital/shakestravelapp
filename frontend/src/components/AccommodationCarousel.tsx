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

  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 card
      if (window.innerWidth < 768) return 2; // Small tablet: 2 cards
      if (window.innerWidth < 1024) return 3; // Tablet: 3 cards
      return 4; // Desktop: 4 cards
    }
    return 4; // Default for SSR
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());
  const totalSlides = Math.ceil(accommodations.length / cardsPerSlide);

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
      <div className="overflow-hidden px-4 sm:px-8 lg:px-12">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {accommodations
                  .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                  .map((accommodation) => (
                    <article key={accommodation.id} className="group">
                      <Link
                        href={`/accommodations/${accommodation.id}`}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 block transform hover:-translate-y-1 focus:ring-2 focus:ring-offset-2"
                        style={{ focusRingColor: primaryColor }}
                        aria-label={`Book ${accommodation.name} in ${accommodation.location}`}
                      >
                        {/* Discount Badge */}
                        {accommodation.discount && (
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                              {accommodation.discount}
                            </span>
                          </div>
                        )}

                        {/* Availability Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <span
                            className="text-white text-sm font-semibold px-3 py-1 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {accommodation.availability}
                          </span>
                        </div>

                        {/* Image */}
                        <div
                          className="h-48 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-200 overflow-hidden relative"
                          style={{ backgroundColor: `${primaryColor}10` }}
                          aria-hidden="true"
                        >
                          {accommodation.image}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          {/* Category Badge */}
                          <div className="flex justify-between items-start mb-3">
                            <span
                              className="px-3 py-1 text-xs font-semibold rounded-full"
                              style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                            >
                              {accommodation.category}
                            </span>
                            <span
                              className="px-2 py-1 text-xs font-medium rounded"
                              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                            >
                              {accommodation.type}
                            </span>
                          </div>

                          {/* Title and Location */}
                          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{accommodation.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 flex items-center">
                            <span className="mr-1">📍</span>
                            {accommodation.location}, {accommodation.country}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center mb-4">
                            <div className="flex items-center">
                              {'★'.repeat(Math.floor(accommodation.rating))}
                            </div>
                            <span className="text-sm text-gray-600 ml-2">
                              {accommodation.rating} ({accommodation.reviews} reviews)
                            </span>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                              >
                                {amenity}
                              </span>
                            ))}
                            {accommodation.amenities.length > 3 && (
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                +{accommodation.amenities.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Special Features */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {accommodation.specialFeatures.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 rounded"
                                style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Pricing */}
                          <div className="flex justify-between items-end">
                            <div>
                              {accommodation.originalPrice > accommodation.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${accommodation.originalPrice}
                                </span>
                              )}
                              <div className="flex items-baseline">
                                <span
                                  className="text-2xl font-bold"
                                  style={{ color: primaryColor }}
                                >
                                  ${accommodation.price}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">per night</span>
                              </div>
                            </div>
                            <button
                              className="text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 hover:shadow-lg focus:ring-2 focus:ring-offset-2"
                              style={{
                                backgroundColor: primaryColor,
                                focusRingColor: primaryColor
                              }}
                              onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                              Book Now
                            </button>
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

      {/* Slide Indicators */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === index
                ? 'w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            style={{
              backgroundColor: currentSlide === index ? primaryColor : undefined
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}