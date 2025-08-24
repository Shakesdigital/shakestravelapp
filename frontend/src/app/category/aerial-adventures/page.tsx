'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export default function AerialAdventuresCategoryPage() {
  const aerialAdventuresData = {
    slug: 'aerial-adventures',
    title: 'Aerial Adventures',
    subtitle: 'Experience Uganda from above with breathtaking aerial perspectives',
    description: `Soar above Uganda's stunning landscapes and witness the Pearl of Africa from a bird's-eye view. From hot air balloon safaris over national parks to paragliding adventures in the mountains, our aerial experiences offer unparalleled perspectives of Uganda's natural beauty.

Our aerial adventures combine thrill with conservation awareness, allowing you to appreciate Uganda's diverse ecosystems from above while supporting sustainable tourism initiatives. Each flight is operated by certified professionals with impeccable safety records.

Whether you're seeking peaceful sunrise balloon flights or adrenaline-pumping paragliding adventures, Uganda's skies offer unforgettable experiences that showcase the country's remarkable biodiversity and stunning landscapes.`,
    heroImages: [
      {
        src: '/images/aerial-hero-1.jpg',
        alt: 'Hot air balloon floating over Murchison Falls',
        caption: 'Hot air balloon safari over Murchison Falls'
      },
      {
        src: '/images/aerial-hero-2.jpg',
        alt: 'Paragliding over Rwenzori Mountains',
        caption: 'Paragliding over the Mountains of the Moon'
      },
      {
        src: '/images/aerial-hero-3.jpg',
        alt: 'Helicopter tour over Lake Victoria',
        caption: 'Helicopter scenic flight over Lake Victoria'
      },
      {
        src: '/images/aerial-hero-4.jpg',
        alt: 'Microlight aircraft over Uganda landscape',
        caption: 'Microlight flights over Ugandan wilderness'
      }
    ],
    featuredDestinations: [
      {
        id: 'murchison-falls-aerial',
        name: 'Murchison Falls National Park',
        description: 'Experience the world\'s most powerful waterfall from above with hot air balloon safaris and scenic flights.',
        image: '🎈',
        experienceCount: 5
      },
      {
        id: 'queen-elizabeth-balloon',
        name: 'Queen Elizabeth National Park',
        description: 'Balloon safaris over diverse ecosystems offering unique wildlife viewing from the sky.',
        image: '🦁',
        experienceCount: 4
      },
      {
        id: 'rwenzori-paragliding',
        name: 'Rwenzori Mountains',
        description: 'Paragliding and hang-gliding adventures over Africa\'s highest mountain range.',
        image: '⛰️',
        experienceCount: 6
      },
      {
        id: 'lake-victoria-helicopter',
        name: 'Lake Victoria',
        description: 'Helicopter and microlight tours over Africa\'s largest lake and its tropical islands.',
        image: '🚁',
        experienceCount: 3
      },
      {
        id: 'jinja-skydiving',
        name: 'Jinja - Source of the Nile',
        description: 'Tandem skydiving and aerial tours over the legendary source of the River Nile.',
        image: '🪂',
        experienceCount: 4
      },
      {
        id: 'bwindi-helicopter',
        name: 'Bwindi Impenetrable Forest',
        description: 'Helicopter transfers and scenic flights over the ancient rainforest canopy.',
        image: '🦍',
        experienceCount: 2
      }
    ],
    featuredExperiences: [
      {
        id: '18',
        title: 'Hot Air Balloon Safari',
        location: 'Murchison Falls',
        rating: 4.9,
        reviews: 45,
        price: 450,
        originalPrice: 520,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🎈',
        highlights: ['Sunrise Flight', 'Champagne Breakfast', 'Wildlife From Above', 'Photo Opportunities']
      },
      {
        id: '20',
        title: 'Paragliding Adventure',
        location: 'Rwenzori Mountains',
        rating: 4.7,
        reviews: 63,
        price: 180,
        duration: '2 Hours',
        difficulty: 'Challenging',
        image: '🪂',
        highlights: ['Tandem Flight', 'Mountain Views', 'Safety Briefing', 'HD Video Recording']
      },
      {
        id: '36',
        title: 'Helicopter Scenic Tour',
        location: 'Lake Victoria',
        rating: 4.8,
        reviews: 32,
        price: 350,
        duration: '1 Hour',
        difficulty: 'Easy',
        image: '🚁',
        highlights: ['Island Views', 'Professional Pilot', 'Photo Stops', 'Safety Equipment']
      },
      {
        id: '37',
        title: 'Microlight Adventure Flight',
        location: 'Jinja',
        rating: 4.6,
        reviews: 28,
        price: 220,
        duration: '45 Minutes',
        difficulty: 'Moderate',
        image: '✈️',
        highlights: ['Open Cockpit', 'Nile Views', 'Professional Instructor', 'Certificate']
      },
      {
        id: '38',
        title: 'Tandem Skydiving',
        location: 'Jinja Airfield',
        rating: 4.9,
        reviews: 19,
        price: 380,
        duration: '4 Hours',
        difficulty: 'Challenging',
        image: '🪂',
        highlights: ['15,000ft Jump', 'Certified Instructor', 'Video Package', 'Training Included']
      },
      {
        id: '39',
        title: 'Sunset Balloon Flight',
        location: 'Queen Elizabeth Park',
        rating: 4.7,
        reviews: 41,
        price: 420,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🌅',
        highlights: ['Sunset Views', 'Game Viewing', 'Sparkling Wine', 'Certificate']
      }
    ],
    travelInsights: [
      {
        id: 'balloon-safari-guide',
        title: 'Hot Air Balloon Safari Guide',
        excerpt: 'Everything you need to know about balloon safaris in Uganda, from weather conditions to what to expect.',
        image: '🎈',
        readTime: '8 min read',
        category: 'Safari Guide'
      },
      {
        id: 'paragliding-safety',
        title: 'Paragliding Safety Guidelines',
        excerpt: 'Essential safety information and preparation tips for paragliding adventures in Uganda.',
        image: '🪂',
        readTime: '7 min read',
        category: 'Safety'
      },
      {
        id: 'aerial-photography',
        title: 'Aerial Photography Tips',
        excerpt: 'Master the art of aerial photography during your scenic flights and balloon adventures.',
        image: '📸',
        readTime: '6 min read',
        category: 'Photography'
      },
      {
        id: 'weather-flying-conditions',
        title: 'Understanding Flying Weather',
        excerpt: 'Learn about weather patterns and optimal conditions for aerial adventures in Uganda.',
        image: '☁️',
        readTime: '5 min read',
        category: 'Weather'
      },
      {
        id: 'helicopter-tour-preparation',
        title: 'Preparing for Helicopter Tours',
        excerpt: 'What to expect and how to prepare for scenic helicopter flights over Uganda.',
        image: '🚁',
        readTime: '6 min read',
        category: 'Preparation'
      },
      {
        id: 'skydiving-first-time',
        title: 'First-Time Skydiving Guide',
        excerpt: 'Complete guide for first-time skydivers, from training to the jump itself.',
        image: '🪂',
        readTime: '9 min read',
        category: 'Adventure'
      }
    ],
    stats: {
      totalExperiences: 14,
      avgRating: 4.7,
      topDestination: 'Murchison'
    }
  };

  return <CategoryPageTemplate categoryData={aerialAdventuresData} />;
}