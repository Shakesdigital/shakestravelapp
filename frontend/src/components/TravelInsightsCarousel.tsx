'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TravelGuide {
  title: string;
  preview: string;
  readTime: string;
  image: string;
  region: string;
}

interface TravelInsightsCarouselProps {
  guides: TravelGuide[];
  primaryColor: string;
}

export default function TravelInsightsCarousel({ guides, primaryColor }: TravelInsightsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(null);

  // Calculate cards per view based on screen size
  const getCardsPerView = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile
      if (window.innerWidth < 1024) return 2; // Tablet
      return 3; // Desktop
    }
    return 3;
  };

  // Start autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const total = Math.ceil(guides.length / cardsPerView);
        return prev >= total - 1 ? 0 : prev + 1;
      });
    }, 5000);

    setAutoplayInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [guides.length, cardsPerView]);

  // Update cards per view on resize
  useEffect(() => {
    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(guides.length / cardsPerView);
  const maxIndex = totalSlides - 1;

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
        const total = Math.ceil(guides.length / cardsPerView);
        return prev >= total - 1 ? 0 : prev + 1;
      });
    }, 5000);
    setAutoplayInterval(interval);
  };

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

    if (isLeftSwipe && currentIndex < maxIndex) {
      nextSlide();
    }
    if (isRightSwipe && currentIndex > 0) {
      prevSlide();
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Previous insights"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Next insights"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Carousel Container */}
      <div className="overflow-hidden px-6 md:px-12">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {Array.from({ length: totalSlides }, (_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 px-2 md:px-4">
              <div className={`grid grid-cols-1 ${cardsPerView === 2 ? 'md:grid-cols-2' : cardsPerView === 3 ? 'md:grid-cols-3' : ''} gap-4 md:gap-8`}>
                {guides
                  .slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView)
                  .map((guide, index) => (
                    <Link
                      key={index}
                      href={`/travel-guide/${guide.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                    >
                      {/* Image/Icon Area */}
                      <div
                        className="h-40 flex items-center justify-center text-6xl relative overflow-hidden"
                        style={{ backgroundColor: `${primaryColor}10` }}
                      >
                        <span aria-hidden="true">{guide.image}</span>
                      </div>

                      <div className="p-6 flex-grow flex flex-col">
                        {/* Region Badge */}
                        <div className="mb-4">
                          <span
                            className="px-3 py-1 text-xs font-semibold rounded-full"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            {guide.region}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                          {guide.title}
                        </h3>

                        {/* Preview Text */}
                        <p className="text-gray-600 mb-4 flex-grow">
                          {guide.preview}
                        </p>

                        {/* Read Time */}
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {guide.readTime}
                        </div>
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