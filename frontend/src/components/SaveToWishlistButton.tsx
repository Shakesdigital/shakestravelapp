'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import { showToast } from '@/lib/toast';
import recommendationService from '@/lib/recommendations';

interface SaveToWishlistButtonProps {
  itemId: string;
  itemType: 'trip' | 'accommodation';
  className?: string;
  showText?: boolean;
  itemTitle?: string; // For toast messages
}

export default function SaveToWishlistButton({ 
  itemId, 
  itemType, 
  className = '',
  showText = true,
  itemTitle = ''
}: SaveToWishlistButtonProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, itemId]);

  const checkIfSaved = async () => {
    try {
      const response = await api.user.checkWishlistItem(itemId, itemType);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      // Redirect to login
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?returnUrl=${returnUrl}`;
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await api.user.removeFromWishlist(itemId);
        setIsSaved(false);
        showToast.wishlistRemoved(itemTitle || `${itemType === 'trip' ? 'Adventure' : 'Accommodation'}`);
        // Track interaction for recommendations
        await recommendationService.trackInteraction(itemId, itemType, 'like'); // Remove is still a like interaction
      } else {
        await api.user.addToWishlist(itemId, itemType);
        setIsSaved(true);
        showToast.wishlistAdded(itemTitle || `${itemType === 'trip' ? 'Adventure' : 'Accommodation'}`);
        // Track interaction for recommendations
        await recommendationService.trackInteraction(itemId, itemType, 'save');
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
        isSaved 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
      } disabled:opacity-50 ${className}`}
    >
      <span className="text-lg">
        {loading ? '⏳' : isSaved ? '❤️' : '🤍'}
      </span>
      {showText && (
        <span className="font-medium">
          {loading ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}