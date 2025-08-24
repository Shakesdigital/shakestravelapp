'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export default function CulturalToursCategoryPage() {
  const culturalToursData = {
    slug: 'cultural-tours',
    title: 'Cultural Tours',
    subtitle: 'Immerse yourself in Uganda\'s rich cultural heritage and traditions',
    description: `Uganda's cultural diversity spans over 50 different tribes, each with unique traditions, languages, and customs. Our cultural tours provide authentic, respectful encounters with local communities, offering deep insights into Uganda's vibrant heritage.

Our community-based cultural experiences directly benefit local populations through fair employment and cultural preservation initiatives. Each tour is designed with community input to ensure authentic representation while respecting privacy and cultural sensitivities.

From traditional dance performances to hands-on craft workshops, from royal palace visits to rural homestead experiences, discover the warmth and richness of Ugandan culture through meaningful, sustainable tourism.`,
    heroImages: [
      {
        src: '/images/cultural-hero-1.jpg',
        alt: 'Traditional Ugandan dancers in colorful attire',
        caption: 'Traditional Ugandan cultural dance performance'
      },
      {
        src: '/images/cultural-hero-2.jpg',
        alt: 'Batwa community members demonstrating traditional crafts',
        caption: 'Batwa community cultural experience'
      },
      {
        src: '/images/cultural-hero-3.jpg',
        alt: 'Buganda Kingdom palace and cultural site',
        caption: 'Buganda Kingdom royal cultural heritage'
      },
      {
        src: '/images/cultural-hero-4.jpg',
        alt: 'Local market with traditional crafts and foods',
        caption: 'Traditional markets and local craftsmanship'
      }
    ],
    featuredDestinations: [
      {
        id: 'kampala-cultural-sites',
        name: 'Kampala Cultural Heritage',
        description: 'Explore Uganda\'s capital with visits to royal palaces, museums, and vibrant local markets.',
        image: '🏛️',
        experienceCount: 15
      },
      {
        id: 'batwa-community',
        name: 'Batwa Community',
        description: 'Learn from the indigenous forest people about traditional forest living and cultural practices.',
        image: '🏘️',
        experienceCount: 6
      },
      {
        id: 'karamoja-region',
        name: 'Karamoja Region',
        description: 'Experience the unique pastoral culture of the Karamojong people in northeastern Uganda.',
        image: '🐄',
        experienceCount: 8
      },
      {
        id: 'buganda-kingdom',
        name: 'Buganda Kingdom',
        description: 'Visit the largest traditional kingdom in Uganda with royal sites and cultural ceremonies.',
        image: '👑',
        experienceCount: 10
      },
      {
        id: 'ankole-region',
        name: 'Ankole Region',
        description: 'Discover the cattle-keeping culture and traditional practices of the Ankole people.',
        image: '🐃',
        experienceCount: 7
      },
      {
        id: 'toro-kingdom',
        name: 'Toro Kingdom',
        description: 'Experience royal culture and traditional ceremonies in western Uganda\'s Toro Kingdom.',
        image: '🏰',
        experienceCount: 5
      }
    ],
    featuredExperiences: [
      {
        id: '4',
        title: 'Batwa Cultural Village Experience',
        location: 'Batwa Community',
        rating: 4.6,
        reviews: 89,
        price: 75,
        originalPrice: 90,
        duration: '2 Hours',
        difficulty: 'Easy',
        image: '🏘️',
        highlights: ['Cultural Immersion', 'Traditional Crafts', 'Local Guide', 'Photo Friendly']
      },
      {
        id: '9',
        title: 'Kampala City Cultural Tour',
        location: 'Kampala',
        rating: 4.3,
        reviews: 176,
        price: 45,
        duration: '4 Hours',
        difficulty: 'Easy',
        image: '🏙️',
        highlights: ['Local Markets', 'Historical Sites', 'Street Food', 'Local Guide']
      },
      {
        id: '31',
        title: 'Buganda Kingdom Palace Tour',
        location: 'Mengo, Kampala',
        rating: 4.7,
        reviews: 124,
        price: 35,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '👑',
        highlights: ['Royal Palace', 'Cultural Museum', 'Traditional Architecture', 'Royal History']
      },
      {
        id: '32',
        title: 'Traditional Craft Workshop',
        location: 'Various Communities',
        rating: 4.5,
        reviews: 98,
        price: 65,
        duration: '4 Hours',
        difficulty: 'Easy',
        image: '🎨',
        highlights: ['Hands-on Crafts', 'Local Artisans', 'Take Home Souvenirs', 'Cultural Stories']
      },
      {
        id: '33',
        title: 'Karamoja Cultural Experience',
        location: 'Karamoja Region',
        rating: 4.8,
        reviews: 67,
        price: 150,
        duration: '2 Days',
        difficulty: 'Moderate',
        image: '🐄',
        highlights: ['Pastoral Culture', 'Traditional Dances', 'Homestead Visit', 'Authentic Meals']
      },
      {
        id: '34',
        title: 'Uganda Cultural Festival',
        location: 'Kampala',
        rating: 4.6,
        reviews: 145,
        price: 25,
        duration: '6 Hours',
        difficulty: 'Easy',
        image: '🎭',
        highlights: ['Multiple Tribes', 'Traditional Music', 'Dance Performances', 'Cultural Foods']
      }
    ],
    travelInsights: [
      {
        id: 'cultural-etiquette-uganda',
        title: 'Cultural Etiquette in Uganda',
        excerpt: 'Essential guidelines for respectful cultural interactions and understanding Ugandan customs and traditions.',
        image: '🤝',
        readTime: '7 min read',
        category: 'Etiquette'
      },
      {
        id: 'ugandan-languages-guide',
        title: 'Languages of Uganda',
        excerpt: 'Learn about Uganda\'s linguistic diversity with basic phrases in major local languages.',
        image: '💬',
        readTime: '6 min read',
        category: 'Language'
      },
      {
        id: 'traditional-foods-uganda',
        title: 'Traditional Ugandan Cuisine',
        excerpt: 'Discover Uganda\'s diverse culinary traditions and must-try local dishes during your cultural tour.',
        image: '🍽️',
        readTime: '8 min read',
        category: 'Food Culture'
      },
      {
        id: 'ugandan-kingdoms',
        title: 'Uganda\'s Traditional Kingdoms',
        excerpt: 'Explore the history and significance of Uganda\'s four traditional kingdoms and their cultural impact.',
        image: '👑',
        readTime: '9 min read',
        category: 'History'
      },
      {
        id: 'cultural-festivals-uganda',
        title: 'Cultural Festivals Calendar',
        excerpt: 'Plan your visit around Uganda\'s vibrant cultural festivals and traditional celebrations.',
        image: '🎉',
        readTime: '5 min read',
        category: 'Events'
      },
      {
        id: 'responsible-cultural-tourism',
        title: 'Responsible Cultural Tourism',
        excerpt: 'Guidelines for ethical cultural tourism that benefits local communities and preserves traditions.',
        image: '🌱',
        readTime: '6 min read',
        category: 'Ethics'
      }
    ],
    stats: {
      totalExperiences: 32,
      avgRating: 4.5,
      topDestination: 'Kampala'
    }
  };

  return <CategoryPageTemplate categoryData={culturalToursData} />;
}