'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

// This will be moved to metadata when we convert to server component
export const safariMetadata = {
  title: 'Wildlife Safari Adventures in Uganda | Shakes Travel',
  description: 'Experience Uganda\'s incredible wildlife on eco-friendly safari adventures. Gorilla trekking in Bwindi, Big Five safaris in Queen Elizabeth Park, and sustainable wildlife encounters.',
  keywords: ['Uganda safari', 'gorilla trekking', 'wildlife tours Uganda', 'Big Five safari', 'mountain gorillas', 'chimpanzee trekking'],
};

export default function SafariCategoryPage() {
  const safariData = {
    slug: 'safari',
    title: 'Wildlife Safari',
    subtitle: 'Encounter Uganda\'s incredible wildlife in their natural habitat',
    description: `Uganda is renowned as one of Africa's premier safari destinations, offering unparalleled wildlife experiences in diverse ecosystems. From the legendary mountain gorillas of Bwindi to the Big Five in Queen Elizabeth National Park, Uganda's safari adventures combine conservation with unforgettable encounters.

Our eco-friendly safari experiences prioritize sustainable tourism, directly supporting local communities and wildlife conservation efforts. Each safari is designed to minimize environmental impact while maximizing your connection with Uganda's remarkable biodiversity.

Experience the thrill of tracking endangered species, witness spectacular wildlife migrations, and discover why Uganda is called the "Pearl of Africa" through responsible and transformative safari adventures.`,
    heroImages: [
      {
        src: '/images/safari-hero-1.jpg',
        alt: 'Mountain gorillas in Bwindi Impenetrable Forest',
        caption: 'Mountain gorillas in Bwindi Impenetrable Forest'
      },
      {
        src: '/images/safari-hero-2.jpg',
        alt: 'Lions in Queen Elizabeth National Park',
        caption: 'Lions in Queen Elizabeth National Park'
      },
      {
        src: '/images/safari-hero-3.jpg',
        alt: 'Elephants at Murchison Falls',
        caption: 'Elephants at Murchison Falls'
      },
      {
        src: '/images/safari-hero-4.jpg',
        alt: 'Chimpanzees in Kibale Forest',
        caption: 'Chimpanzees in Kibale Forest'
      }
    ],
    featuredDestinations: [
      {
        id: 'bwindi-forest',
        name: 'Bwindi Impenetrable Forest',
        description: 'Home to nearly half of the world\'s remaining mountain gorillas, offering once-in-a-lifetime gorilla trekking experiences.',
        image: '🦍',
        experienceCount: 8
      },
      {
        id: 'queen-elizabeth-park',
        name: 'Queen Elizabeth National Park',
        description: 'Uganda\'s most visited park featuring tree-climbing lions, boat safaris, and diverse wildlife in savanna landscapes.',
        image: '🦁',
        experienceCount: 12
      },
      {
        id: 'murchison-falls-park',
        name: 'Murchison Falls National Park',
        description: 'Experience the power of the world\'s strongest waterfall while spotting elephants, giraffes, and Nile crocodiles.',
        image: '🐘',
        experienceCount: 10
      },
      {
        id: 'kibale-forest',
        name: 'Kibale Forest National Park',
        description: 'The primate capital of the world, home to 13 primate species including our closest relatives, the chimpanzees.',
        image: '🐒',
        experienceCount: 6
      },
      {
        id: 'kidepo-valley',
        name: 'Kidepo Valley National Park',
        description: 'Remote wilderness offering authentic African safari experiences with unique wildlife and stunning landscapes.',
        image: '🦓',
        experienceCount: 5
      },
      {
        id: 'lake-mburo-park',
        name: 'Lake Mburo National Park',
        description: 'Compact savanna park perfect for horseback safaris, boat trips, and spotting zebras and antelopes.',
        image: '🦌',
        experienceCount: 7
      }
    ],
    featuredExperiences: [
      {
        id: '1',
        title: 'Mountain Gorilla Trekking',
        location: 'Bwindi Impenetrable Forest',
        rating: 4.9,
        reviews: 234,
        price: 800,
        originalPrice: 950,
        duration: '1 Day',
        difficulty: 'Moderate',
        image: '🦍',
        highlights: ['Expert Guide', 'Permit Included', 'Small Groups', 'Photo Opportunities']
      },
      {
        id: '3',
        title: 'Queen Elizabeth Safari',
        location: 'Queen Elizabeth National Park',
        rating: 4.8,
        reviews: 312,
        price: 350,
        originalPrice: 420,
        duration: '3 Days',
        difficulty: 'Easy',
        image: '🦁',
        highlights: ['Game Drives', 'Boat Safari', '3-Star Lodge', 'All Meals']
      },
      {
        id: '6',
        title: 'Murchison Falls Boat Safari',
        location: 'Murchison Falls',
        rating: 4.7,
        reviews: 203,
        price: 85,
        originalPrice: 100,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🚢',
        highlights: ['Nile Cruise', 'Wildlife Viewing', 'Photography', 'Refreshments']
      },
      {
        id: '7',
        title: 'Chimpanzee Trekking',
        location: 'Kibale National Park',
        rating: 4.8,
        reviews: 145,
        price: 200,
        duration: 'Half Day',
        difficulty: 'Moderate',
        image: '🐒',
        highlights: ['Expert Tracker', 'Forest Walk', 'Primate Education', 'Photo Opportunities']
      },
      {
        id: '11',
        title: 'Kidepo Valley Safari',
        location: 'Kidepo Valley National Park',
        rating: 4.7,
        reviews: 89,
        price: 450,
        duration: '2 Days',
        difficulty: 'Easy',
        image: '🦓',
        highlights: ['Remote Location', 'Unique Wildlife', 'Cultural Encounters', 'Stargazing']
      },
      {
        id: '24',
        title: 'Night Game Drive',
        location: 'Lake Mburo National Park',
        rating: 4.5,
        reviews: 89,
        price: 85,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🌙',
        highlights: ['Spotlights Provided', 'Nocturnal Animals', 'Expert Guide', 'Refreshments']
      }
    ],
    travelInsights: [
      {
        id: 'gorilla-trekking-guide',
        title: 'Ultimate Gorilla Trekking Guide',
        excerpt: 'Everything you need to know about gorilla permits, preparation, and what to expect during your encounter with mountain gorillas.',
        image: '🦍',
        readTime: '8 min read',
        category: 'Wildlife Guide'
      },
      {
        id: 'safari-photography-tips',
        title: 'Safari Photography Masterclass',
        excerpt: 'Professional tips for capturing stunning wildlife photos during your Uganda safari adventure.',
        image: '📷',
        readTime: '6 min read',
        category: 'Photography'
      },
      {
        id: 'wildlife-conservation',
        title: 'Conservation Through Tourism',
        excerpt: 'Learn how your safari directly contributes to wildlife conservation and community development in Uganda.',
        image: '🌿',
        readTime: '5 min read',
        category: 'Conservation'
      },
      {
        id: 'safari-packing-guide',
        title: 'Safari Packing Essentials',
        excerpt: 'Complete packing checklist for your Uganda safari, from clothing to photography gear.',
        image: '🎒',
        readTime: '4 min read',
        category: 'Planning'
      },
      {
        id: 'best-safari-seasons',
        title: 'Best Time for Wildlife Viewing',
        excerpt: 'Discover the optimal seasons for different safari experiences across Uganda\'s national parks.',
        image: '📅',
        readTime: '7 min read',
        category: 'Planning'
      },
      {
        id: 'safari-ethics',
        title: 'Responsible Safari Guidelines',
        excerpt: 'Essential guidelines for ethical wildlife viewing and minimizing your environmental impact.',
        image: '🤝',
        readTime: '5 min read',
        category: 'Ethics'
      }
    ],
    stats: {
      totalExperiences: 48,
      avgRating: 4.8,
      topDestination: 'Bwindi'
    }
  };

  return <CategoryPageTemplate categoryData={safariData} />;
}