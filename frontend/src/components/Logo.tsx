'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  width = 120, 
  height = 40, 
  className = "h-10 w-auto max-w-[120px]",
  priority = true 
}) => {
  const [imageError, setImageError] = useState(false);

  // Fallback text logo component
  const TextLogo = () => (
    <div className="flex items-center">
      <span className="text-xl font-bold text-[#195e48]">
        Shakes Travel
      </span>
    </div>
  );

  // If image failed to load, show text logo
  if (imageError) {
    return <TextLogo />;
  }

  return (
    <div className="relative flex items-center">
      {/* Try multiple logo sources for maximum compatibility */}
      <Image 
        src="/shakes-travel-logo.png" 
        alt="Shakes Travel Logo" 
        width={width} 
        height={height} 
        className={className}
        priority={priority}
        unoptimized={true}
        onError={() => {
          // Try alternative path
          const img = document.createElement('img');
          img.src = '/logo.png';
          img.onload = () => {
            // If alternative works, update the source
            setImageError(false);
          };
          img.onerror = () => {
            // If all images fail, show text logo
            setImageError(true);
          };
        }}
        onLoadingComplete={() => {
          // Image loaded successfully
        }}
      />
    </div>
  );
};

export default Logo;