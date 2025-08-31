'use client';

import React from 'react';
import Link from 'next/link';

interface TouchButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  onClick,
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = 'touch-target no-select transition-all duration-150 rounded-md font-medium text-center inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-[#195e48] text-white hover:bg-[#164439] active:bg-[#0f3329] focus:ring-[#195e48] disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-600 disabled:bg-gray-400',
    outline: 'border-2 border-[#195e48] text-[#195e48] hover:bg-[#195e48] hover:text-white active:bg-[#164439] active:text-white focus:ring-[#195e48] disabled:border-gray-400 disabled:text-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-500 disabled:text-gray-400'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[44px]',
    lg: 'px-6 py-4 text-lg min-h-[48px]'
  };

  const disabledClasses = disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer';

  const finalClassName = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    className
  ].join(' ');

  if (href && !disabled) {
    return (
      <Link href={href} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={finalClassName}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TouchButton;