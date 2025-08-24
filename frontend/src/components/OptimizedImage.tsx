'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

// Generate a simple blur data URL
const generateBlurDataURL = (width = 8, height = 8) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    // Create a simple gradient blur placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f3f4f6');
    gradient.addColorStop(1, '#e5e7eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  objectFit = 'cover',
  objectPosition = 'center',
  fallbackSrc = '/images/placeholder.jpg',
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate blur placeholder if not provided
  const blurPlaceholder = blurDataURL || (typeof window !== 'undefined' ? generateBlurDataURL() : undefined);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    onError?.();
  }, [imgSrc, fallbackSrc, onError]);

  // Fallback component for broken images
  const FallbackComponent = () => (
    <div 
      className={cn(
        'flex items-center justify-center bg-gray-200 text-gray-400',
        className
      )}
      style={{ width, height }}
    >
      <svg
        className="w-8 h-8"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );

  if (hasError) {
    return <FallbackComponent />;
  }

  const imageProps = {
    src: imgSrc,
    alt,
    onLoad: handleLoad,
    onError: handleError,
    className: cn(
      'transition-opacity duration-300',
      isLoading && 'opacity-0',
      !isLoading && 'opacity-100',
      className
    ),
    priority,
    quality,
    sizes: fill ? sizes : undefined,
    style: {
      objectFit: fill ? objectFit : undefined,
      objectPosition: fill ? objectPosition : undefined,
    },
    placeholder,
    blurDataURL: blurPlaceholder,
    loading: priority ? 'eager' : loading,
    ...(fill ? { fill: true } : { width, height }),
  };

  return (
    <div className={cn('relative', !fill && 'inline-block')}>
      <Image {...imageProps} />
      
      {/* Loading skeleton */}
      {isLoading && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse',
            fill ? 'w-full h-full' : '',
            className
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}
    </div>
  );
}

// Utility function to create responsive image sizes
export const createImageSizes = (breakpoints: Record<string, string>) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
    .join(', ');
};

// Common image size presets
export const imageSizes = {
  hero: '100vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  gallery: '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw',
  avatar: '(max-width: 768px) 64px, 128px',
  thumbnail: '(max-width: 768px) 100px, 200px',
};

// Image quality presets
export const imageQuality = {
  low: 50,
  medium: 75,
  high: 90,
  max: 100,
};