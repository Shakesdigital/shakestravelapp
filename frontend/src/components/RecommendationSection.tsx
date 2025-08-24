'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import recommendationService, { PersonalizedRecommendation, RecommendationResponse } from '@/lib/recommendations';
import { showToast } from '@/lib/toast';

interface RecommendationSectionProps {
  title?: string;
  itemId?: string;
  itemType?: 'trip' | 'accommodation';
  recommendationType: 'personalized' | 'item-based' | 'fallback';
  limit?: number;
  className?: string;
}

export default function RecommendationSection({
  title = 'Recommended for You',
  itemId,
  itemType,
  recommendationType,
  limit = 6,
  className = ''
}: RecommendationSectionProps) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [metadata, setMetadata] = useState<RecommendationResponse['metadata'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [itemId, itemType, recommendationType, user]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result: PersonalizedRecommendation[] = [];
      let meta: RecommendationResponse['metadata'] | null = null;

      switch (recommendationType) {
        case 'personalized':
          if (user) {
            const response = await recommendationService.getPersonalizedRecommendations({ limit });
            result = response.data;
            meta = response.metadata;
          } else {
            const response = await recommendationService.getFallbackRecommendations({ limit });
            result = response.data;
            meta = response.metadata;
          }
          break;

        case 'item-based':
          if (itemId && itemType) {
            result = await recommendationService.getItemBasedRecommendations(itemId, itemType, limit);
            meta = {
              totalRecommendations: result.length,
              personalizedCount: 0,
              algorithmUsed: 'content-based',
              userProfileCompleteness: user ? 50 : 0
            };
          }
          break;

        case 'fallback':
        default:
          const response = await recommendationService.getFallbackRecommendations({ 
            type: itemType, 
            limit,
            excludeId: itemId 
          });
          result = response.data;
          meta = response.metadata;
      }

      setRecommendations(result);
      setMetadata(meta);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Unable to load recommendations');
      showToast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (rec: PersonalizedRecommendation) => {
    // Track click for improving recommendations
    recommendationService.trackInteraction(rec._id, rec.type, 'view');
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {metadata && (
            <div className="text-sm text-gray-600 mt-1">
              {metadata.personalizedCount > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mr-2">
                  🎯 {metadata.personalizedCount} personalized
                </span>
              )}
              <span className="text-gray-500">
                Based on {metadata.algorithmUsed === 'collaborative' ? 'your preferences' : 
                         metadata.algorithmUsed === 'content-based' ? 'similar items' : 
                         metadata.algorithmUsed === 'hybrid' ? 'smart recommendations' : 'popular choices'}
              </span>
            </div>
          )}
        </div>
        
        {user && metadata && metadata.userProfileCompleteness < 80 && (
          <div className="text-sm text-blue-600">
            <Link href="/profile" className="hover:underline">
              Complete profile for better recommendations →
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <div key={rec._id} className="relative">
            <Link 
              href={`/${rec.type === 'trip' ? 'trips' : 'accommodations'}/${rec._id}`}
              onClick={() => handleRecommendationClick(rec)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
            >
              <div className="h-48 bg-gradient-to-r from-green-400 to-blue-500 relative overflow-hidden">
                {rec.images && rec.images.length > 0 ? (
                  <img
                    src={rec.images[0]}
                    alt={rec.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                    {rec.type === 'trip' ? '🏔️' : '🏨'}
                  </div>
                )}
                
                {rec.isPersonalized && (
                  <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    For You
                  </div>
                )}
                
                {rec.recommendationScore > 4.5 && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    ⭐ Top Rated
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{rec.description}</p>
                
                {rec.location && (
                  <p className="text-gray-500 text-xs mb-2">📍 {rec.location.name}</p>
                )}
                
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-green-600">
                    ${rec.price}{rec.type === 'accommodation' ? '/night' : ''}
                  </span>
                  <div className="flex items-center text-yellow-400">
                    <span className="text-sm">★ {rec.rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500 ml-1">({rec.reviewCount})</span>
                  </div>
                </div>
                
                {rec.recommendationReason && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    💡 {rec.recommendationReason}
                  </div>
                )}
                
                {rec.matchFactors && rec.matchFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {rec.matchFactors.slice(0, 2).map((factor, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {process.env.NODE_ENV === 'development' && metadata && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
          <strong>Debug Info:</strong> Algorithm: {metadata.algorithmUsed}, 
          Personalized: {metadata.personalizedCount}/{metadata.totalRecommendations}, 
          Profile: {metadata.userProfileCompleteness}%
        </div>
      )}
    </div>
  );
}