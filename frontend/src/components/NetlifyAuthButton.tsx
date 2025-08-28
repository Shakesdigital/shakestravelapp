'use client';

import React from 'react';
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';

interface NetlifyAuthButtonProps {
  type: 'login' | 'signup';
  className?: string;
  children?: React.ReactNode;
}

const NetlifyAuthButton: React.FC<NetlifyAuthButtonProps> = ({ 
  type, 
  className = '', 
  children 
}) => {
  const { login, signup, loading } = useNetlifyIdentity();

  const handleClick = () => {
    if (type === 'login') {
      login();
    } else {
      signup();
    }
  };

  const defaultText = type === 'login' ? 'Sign In' : 'Sign Up';

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          Loading...
        </div>
      ) : (
        children || defaultText
      )}
    </button>
  );
};

export default NetlifyAuthButton;