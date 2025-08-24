'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroGalleryProps {
  images: string[];
  title: string;
  location: string;
  rating: number;
  reviews: number;
  category: string;
  ecoFriendly: boolean;
  instantBooking: boolean;
  freeCancel: boolean;
  pickupIncluded: boolean;
}

const HeroGallery: React.FC<HeroGalleryProps> = ({
  images,
  title,
  location,
  rating,
  reviews,
  category,
  ecoFriendly,
  instantBooking,
  freeCancel,
  pickupIncluded
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  
  const primaryColor = '#195e48';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <section className="relative h-[60vh] lg:h-[70vh] overflow-hidden bg-gray-900">
        {/* Main Image Display */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full flex items-center justify-center text-8xl lg:text-[12rem] transition-all duration-500"
            style={{ backgroundColor: `${primaryColor}20` }}
            role="img"
            aria-label={`Experience image ${currentImageIndex + 1} of ${images.length}`}
          >
            {images[currentImageIndex]}
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2"
              style={{ focusRingColor: primaryColor }}
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2"
              style={{ focusRingColor: primaryColor }}
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setShowFullscreen(true)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-lg px-4 py-2 font-medium shadow-lg transition-all duration-200 focus:ring-2 focus:ring-offset-2"
          style={{ focusRingColor: primaryColor }}
          aria-label="View all photos"
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            View all {images.length} photos
          </span>
        </button>

        {/* Experience Header */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="content-section">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              {/* Title and Location */}
              <div className="flex-1">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span 
                    className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-gray-800"
                  >
                    {category}
                  </span>
                  {ecoFriendly && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">
                      🌱 Eco-Friendly
                    </span>
                  )}
                  {instantBooking && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">
                      ⚡ Instant Booking
                    </span>
                  )}
                  {freeCancel && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-500 text-white">
                      🔄 Free Cancellation
                    </span>
                  )}
                  {pickupIncluded && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">
                      🚐 Pickup Included
                    </span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  {title}
                </h1>
                
                <div className="flex items-center text-white/90 text-lg mb-3">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {location}
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white ml-2 font-medium">
                    {rating} ({reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Fullscreen Gallery Modal */}
      {showFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 z-10"
              aria-label="Close fullscreen view"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="max-w-4xl w-full h-full flex items-center justify-center">
              <div 
                className="text-[20rem] transition-all duration-500"
                role="img"
                aria-label={`Experience image ${currentImageIndex + 1} of ${images.length}`}
              >
                {images[currentImageIndex]}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/50 rounded-full p-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white/30 ring-2 ring-white scale-110'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    {image}
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroGallery;