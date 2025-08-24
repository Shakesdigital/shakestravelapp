import { api } from './axios';

export interface RecommendationParams {
  type?: 'trips' | 'accommodations';
  limit?: number;
  excludeId?: string;
  userLocation?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  preferences?: string[];
}

export interface PersonalizedRecommendation {
  _id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  location: {
    name: string;
    coordinates?: [number, number];
  };
  type: 'trip' | 'accommodation';
  // Recommendation metadata
  recommendationScore: number;
  recommendationReason: string;
  matchFactors: string[];
  isPersonalized: boolean;
}

export interface RecommendationResponse {
  data: PersonalizedRecommendation[];
  metadata: {
    totalRecommendations: number;
    personalizedCount: number;
    algorithmUsed: 'collaborative' | 'content-based' | 'hybrid' | 'fallback';
    userProfileCompleteness: number;
  };
}

// Personalized recommendations service
export const recommendationService = {
  // Get personalized recommendations for authenticated users
  getPersonalizedRecommendations: async (params: RecommendationParams = {}): Promise<RecommendationResponse> => {
    try {
      const response = await api.user.getRecommendations(params.type, params.limit);
      return response.data;
    } catch (error) {
      console.warn('Personalized recommendations failed, falling back to general recommendations');
      return await recommendationService.getFallbackRecommendations(params);
    }
  },

  // Get recommendations based on item similarity (for detail pages)
  getItemBasedRecommendations: async (
    itemId: string, 
    itemType: 'trips' | 'accommodations',
    limit = 6
  ): Promise<PersonalizedRecommendation[]> => {
    try {
      let response;
      if (itemType === 'trips') {
        response = await api.trips.getRecommendations(itemId, limit);
      } else {
        response = await api.accommodations.getRecommendations(itemId, limit);
      }
      return response.data.data || response.data;
    } catch (error) {
      console.warn(`Item-based recommendations failed for ${itemType}:${itemId}`);
      return [];
    }
  },

  // Fallback recommendations for unauthenticated users or when personalization fails
  getFallbackRecommendations: async (params: RecommendationParams = {}): Promise<RecommendationResponse> => {
    try {
      let response;
      if (params.type === 'trips') {
        response = await api.search.trips({
          limit: params.limit || 10,
          sort: 'rating',
          excludeId: params.excludeId
        });
      } else if (params.type === 'accommodations') {
        response = await api.search.accommodations({
          limit: params.limit || 10,
          sort: 'rating',
          excludeId: params.excludeId
        });
      } else {
        // Mixed recommendations
        const [tripsResponse, accommodationsResponse] = await Promise.all([
          api.search.trips({ limit: Math.ceil((params.limit || 10) / 2), sort: 'rating' }),
          api.search.accommodations({ limit: Math.floor((params.limit || 10) / 2), sort: 'rating' })
        ]);
        
        const combined = [
          ...(tripsResponse.data.data || []).map((item: any) => ({ ...item, type: 'trip' })),
          ...(accommodationsResponse.data.data || []).map((item: any) => ({ ...item, type: 'accommodation' }))
        ].slice(0, params.limit || 10);

        return {
          data: combined.map(item => ({
            ...item,
            recommendationScore: item.rating || 0,
            recommendationReason: 'Popular choice',
            matchFactors: ['High rating', 'Popular destination'],
            isPersonalized: false
          })),
          metadata: {
            totalRecommendations: combined.length,
            personalizedCount: 0,
            algorithmUsed: 'fallback',
            userProfileCompleteness: 0
          }
        };
      }

      const items = response.data.data || response.data || [];
      return {
        data: items.map((item: any) => ({
          ...item,
          type: params.type || 'trip',
          recommendationScore: item.rating || 0,
          recommendationReason: 'Popular choice',
          matchFactors: ['High rating'],
          isPersonalized: false
        })),
        metadata: {
          totalRecommendations: items.length,
          personalizedCount: 0,
          algorithmUsed: 'fallback',
          userProfileCompleteness: 0
        }
      };
    } catch (error) {
      console.error('Fallback recommendations failed:', error);
      return {
        data: [],
        metadata: {
          totalRecommendations: 0,
          personalizedCount: 0,
          algorithmUsed: 'fallback',
          userProfileCompleteness: 0
        }
      };
    }
  },

  // Track user interaction for improving recommendations
  trackInteraction: async (
    itemId: string, 
    itemType: 'trip' | 'accommodation',
    interactionType: 'view' | 'like' | 'book' | 'share' | 'save'
  ) => {
    try {
      // This would typically be sent to analytics/recommendation engine
      const interactionData = {
        itemId,
        itemType,
        interactionType,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        userAgent: navigator.userAgent
      };
      
      // Store locally for now (in production, this would go to a recommendation service)
      const interactions = getStoredInteractions();
      interactions.push(interactionData);
      
      // Keep only last 100 interactions per session
      if (interactions.length > 100) {
        interactions.splice(0, interactions.length - 100);
      }
      
      localStorage.setItem('userInteractions', JSON.stringify(interactions));
      
      // In production, also send to backend
      // await api.post('/analytics/interactions', interactionData);
    } catch (error) {
      console.warn('Failed to track interaction:', error);
    }
  },

  // Get user's interaction history for debugging/analysis
  getUserInteractions: () => {
    return getStoredInteractions();
  },

  // Clear interaction history
  clearInteractionHistory: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInteractions');
    }
  }
};

// Helper functions
const getSessionId = (): string => {
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }
  return 'server_session';
};

const getStoredInteractions = (): any[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('userInteractions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Example collaborative filtering logic for backend implementation
export const collaborativeFilteringExample = {
  // This is an example of what the backend recommendation logic might look like
  generateRecommendations: async (userId: string, itemType: 'trips' | 'accommodations') => {
    /*
    Backend Implementation Example:
    
    1. Get user's booking/rating history
    2. Find similar users based on preferences
    3. Get items liked by similar users that current user hasn't interacted with
    4. Score and rank recommendations
    
    const userHistory = await getUserBookingHistory(userId);
    const similarUsers = await findSimilarUsers(userId, userHistory);
    const recommendations = await getRecommendationsFromSimilarUsers(similarUsers, userHistory);
    
    return {
      data: recommendations,
      metadata: {
        algorithmUsed: 'collaborative',
        confidence: calculateConfidence(similarUsers.length),
        explanations: generateExplanations(recommendations, similarUsers)
      }
    };
    */
  }
};

export default recommendationService;