'use client';

import React from 'react';
import Link from 'next/link';

interface TouchCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const TouchCard: React.FC<TouchCardProps> = ({
  children,
  className = '',
  href,
  onClick,
  interactive = false,
  padding = 'md',
  shadow = 'md'
}) => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 transition-all duration-150';
  
  const interactiveClasses = interactive || href || onClick 
    ? 'card-interactive cursor-pointer hover:shadow-lg active:shadow-sm' 
    : '';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  };

  const finalClassName = [
    baseClasses,
    interactiveClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    className
  ].join(' ');

  const cardContent = (
    <div className={finalClassName} onClick={onClick}>
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-select">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default TouchCard;