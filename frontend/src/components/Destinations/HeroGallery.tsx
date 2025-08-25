'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HeroGalleryProps {
  destinationName: string;
  destinationSlug: string;
}

interface DestinationImage {
  src: string;
  alt: string;
  title: string;
  credit?: string;
}

const HeroGallery: React.FC<HeroGalleryProps> = ({ destinationName, destinationSlug }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Destination-specific image data (in production, this would come from API/CMS)
  const getDestinationImages = (slug: string): DestinationImage[] => {
    const imageMap: { [key: string]: DestinationImage[] } = {
      'bwindi-impenetrable-forest': [
        { src: '/images/gorilla-trekking.jpg', alt: 'Mountain gorillas in Bwindi Forest', title: 'Mountain Gorilla Encounter' },
        { src: '/images/bwindi-forest.jpg', alt: 'Dense forest canopy of Bwindi', title: 'Ancient Rainforest' },
        { src: '/images/gorilla-family.jpg', alt: 'Gorilla family in natural habitat', title: 'Wildlife Photography' },
        { src: '/images/bwindi-trek.jpg', alt: 'Trekking through Bwindi forest', title: 'Forest Trekking Adventure' }
      ],
      'queen-elizabeth-national-park': [
        { src: '/images/tree-climbing-lions.jpg', alt: 'Lions resting in fig trees', title: 'Tree-Climbing Lions' },
        { src: '/images/kazinga-channel.jpg', alt: 'Boat safari on Kazinga Channel', title: 'Kazinga Channel Cruise' },
        { src: '/images/savanna-landscape.jpg', alt: 'Vast savanna plains', title: 'African Savanna' },
        { src: '/images/elephants-qenp.jpg', alt: 'Elephant herd in the park', title: 'Elephant Families' }
      ],
      'jinja': [
        { src: '/images/jinja-rafting.jpg', alt: 'White water rafting on River Nile', title: 'Nile River Adventures' },
        { src: '/images/source-of-nile.jpg', alt: 'Source of the River Nile', title: 'Source of the Nile' },
        { src: '/images/bungee-jumping.jpg', alt: 'Bungee jumping over the Nile', title: 'Extreme Sports' },
        { src: '/images/sunset-nile.jpg', alt: 'Beautiful sunset over River Nile', title: 'Nile Sunset Views' }
      ]
    };

    // Default images if specific destination not found
    const defaultImages: DestinationImage[] = [
      { src: '/images/uganda-hero.jpg', alt: `${destinationName} landscape`, title: `Discover ${destinationName}` },
      { src: '/images/uganda-culture.jpg', alt: `Cultural experiences in ${destinationName}`, title: 'Cultural Heritage' },
      { src: '/images/uganda-wildlife.jpg', alt: `Wildlife in ${destinationName}`, title: 'Wildlife Encounters' },
      { src: '/images/uganda-adventure.jpg', alt: `Adventure activities in ${destinationName}`, title: 'Adventure Activities' }
    ];

    return imageMap[slug] || defaultImages;
  };

  const images = getDestinationImages(destinationSlug);
  const primaryColor = '#195e48';

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || !isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying, isMounted]);

  const goToSlide = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10 seconds
  };

  const goToPrevious = () => {
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section 
      className="hero-gallery relative h-[80vh] overflow-hidden"
      aria-label={`${destinationName} image gallery`}
      role="banner"
    >
      {/* Background Images */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: 'linear-gradient(135deg, #195e48 0%, #2d7f5b 50%, #1a5945 100%)'
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === 0}
              className="w-full h-full"
              unoptimized
              onError={(e) => {
                // Fallback to a solid color background if image fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40" aria-hidden="true"></div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        <div className="text-center max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-lg">
            Explore {destinationName}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 drop-shadow-md">
            {images[currentImageIndex].title}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const experiencesSection = document.getElementById('experiences-section');
                  experiencesSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Discover Experiences
            </button>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2"
              style={{ backgroundColor: `${primaryColor}80` }}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const accommodationsSection = document.getElementById('accommodations-section');
                  accommodationsSection?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Find Accommodations
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              index === currentImageIndex 
                ? 'bg-white scale-110' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`Go to image ${index + 1}: ${images[index].title}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 z-20 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
        {currentImageIndex + 1} / {images.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
      </div>
    </section>
  );
};

export default HeroGallery;
