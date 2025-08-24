'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export default function ExtremeSportsCategoryPage() {
  const extremeSportsData = {
    slug: 'extreme-sports',
    title: 'Extreme Sports',
    subtitle: 'Push your limits with heart-pounding adrenaline adventures',
    description: `For thrill-seekers and adrenaline junkies, Uganda offers some of Africa's most exciting extreme sports experiences. From bungee jumping over the source of the Nile to paragliding over the Mountains of the Moon, push your boundaries in spectacular natural settings.

Our extreme sports adventures prioritize safety without compromising excitement. All activities are led by certified professionals using international safety standards and top-quality equipment. Each experience is designed to challenge your limits while ensuring your well-being.

Whether you're seeking your first extreme sports experience or you're a seasoned adrenaline enthusiast, Uganda's diverse landscapes provide the perfect backdrop for unforgettable high-octane adventures.`,
    heroImages: [
      {
        src: '/images/extreme-hero-1.jpg',
        alt: 'Bungee jumping over the Nile River',
        caption: 'Bungee jumping over the source of the Nile'
      },
      {
        src: '/images/extreme-hero-2.jpg',
        alt: 'Paragliding over Rwenzori Mountains',
        caption: 'Paragliding over the Mountains of the Moon'
      },
      {
        src: '/images/extreme-hero-3.jpg',
        alt: 'Rock climbing on steep cliff faces',
        caption: 'Rock climbing on Uganda\'s dramatic cliffs'
      },
      {
        src: '/images/extreme-hero-4.jpg',
        alt: 'Zip-lining through forest canopy',
        caption: 'High-speed zip-lining through forest canopy'
      }
    ],
    featuredDestinations: [
      {
        id: 'jinja-extreme',
        name: 'Jinja - Extreme Sports Capital',
        description: 'Home to Uganda\'s most thrilling extreme sports including bungee jumping, white water rafting, and river boarding.',
        image: '🪂',
        experienceCount: 8
      },
      {
        id: 'rwenzori-aerial',
        name: 'Rwenzori Mountains',
        description: 'Spectacular paragliding and hang-gliding opportunities with breathtaking mountain and valley views.',
        image: '⛰️',
        experienceCount: 4
      },
      {
        id: 'mount-elgon-climbing',
        name: 'Mount Elgon',
        description: 'Challenging rock climbing routes and abseiling adventures on ancient volcanic cliff faces.',
        image: '🧗‍♂️',
        experienceCount: 6
      },
      {
        id: 'mabira-forest-zip',
        name: 'Mabira Forest',
        description: 'High-speed zip-lining through tropical rainforest canopy with multiple challenging lines.',
        image: '🌲',
        experienceCount: 3
      },
      {
        id: 'lake-mburo-atv',
        name: 'Lake Mburo National Park',
        description: 'Off-road ATV adventures and quad biking through savanna landscapes and wildlife areas.',
        image: '🏍️',
        experienceCount: 5
      },
      {
        id: 'queen-elizabeth-aerial',
        name: 'Queen Elizabeth Park',
        description: 'Hot air ballooning safaris combining extreme adventure with spectacular wildlife viewing.',
        image: '🎈',
        experienceCount: 2
      }
    ],
    featuredExperiences: [
      {
        id: '15',
        title: 'Bungee Jumping Experience',
        location: 'Jinja, River Nile',
        rating: 4.8,
        reviews: 156,
        price: 90,
        duration: '2 Hours',
        difficulty: 'Challenging',
        image: '🪂',
        highlights: ['44m Jump', 'Safety Certified', 'Photo Package', 'Certificate']
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
        id: '14',
        title: 'Rock Climbing Adventure',
        location: 'Mount Elgon',
        rating: 4.7,
        reviews: 76,
        price: 120,
        duration: '6 Hours',
        difficulty: 'Challenging',
        image: '🧗‍♂️',
        highlights: ['Professional Gear', 'Expert Guides', 'Multi-Pitch Routes', 'Safety First']
      },
      {
        id: '16',
        title: 'Zip-lining Forest Adventure',
        location: 'Mabira Forest',
        rating: 4.4,
        reviews: 203,
        price: 65,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🌲',
        highlights: ['Multiple Lines', 'Forest Views', 'Safety Equipment', 'Nature Walk']
      },
      {
        id: '21',
        title: 'Quad Biking Safari',
        location: 'Lake Mburo National Park',
        rating: 4.4,
        reviews: 94,
        price: 95,
        duration: '3 Hours',
        difficulty: 'Moderate',
        image: '🏍️',
        highlights: ['All-Terrain Vehicles', 'Safety Gear', 'Wildlife Spotting', 'Training Provided']
      },
      {
        id: '35',
        title: 'River Boarding Extreme',
        location: 'Jinja, River Nile',
        rating: 4.6,
        reviews: 87,
        price: 110,
        duration: '4 Hours',
        difficulty: 'Challenging',
        image: '🏄‍♂️',
        highlights: ['Body Surfing', 'Rapid Navigation', 'Expert Instruction', 'Action Photos']
      }
    ],
    travelInsights: [
      {
        id: 'extreme-sports-safety',
        title: 'Extreme Sports Safety Guide',
        excerpt: 'Comprehensive safety guidelines and what to expect from extreme sports adventures in Uganda.',
        image: '🛡️',
        readTime: '10 min read',
        category: 'Safety'
      },
      {
        id: 'bungee-jumping-preparation',
        title: 'Preparing for Your First Bungee Jump',
        excerpt: 'Everything you need to know before taking the leap, from mental preparation to safety protocols.',
        image: '🪂',
        readTime: '7 min read',
        category: 'Preparation'
      },
      {
        id: 'paragliding-weather-conditions',
        title: 'Best Weather for Paragliding',
        excerpt: 'Understanding weather conditions and optimal times for paragliding adventures in Uganda.',
        image: '🌤️',
        readTime: '6 min read',
        category: 'Weather'
      },
      {
        id: 'rock-climbing-techniques',
        title: 'Rock Climbing Basics',
        excerpt: 'Essential techniques and skills for rock climbing beginners tackling Uganda\'s cliff faces.',
        image: '🧗‍♂️',
        readTime: '8 min read',
        category: 'Skills'
      },
      {
        id: 'extreme-sports-insurance',
        title: 'Adventure Sports Insurance',
        excerpt: 'Important information about travel insurance coverage for extreme sports activities.',
        image: '📋',
        readTime: '5 min read',
        category: 'Planning'
      },
      {
        id: 'adrenaline-photography',
        title: 'Capturing Extreme Action',
        excerpt: 'Tips for photographing and videoing extreme sports adventures while maintaining safety.',
        image: '📹',
        readTime: '6 min read',
        category: 'Photography'
      }
    ],
    stats: {
      totalExperiences: 18,
      avgRating: 4.6,
      topDestination: 'Jinja'
    }
  };

  return <CategoryPageTemplate categoryData={extremeSportsData} />;
}