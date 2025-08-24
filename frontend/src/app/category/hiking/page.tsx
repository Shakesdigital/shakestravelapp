'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export default function HikingCategoryPage() {
  const hikingData = {
    slug: 'hiking',
    title: 'Hiking & Trekking',
    subtitle: 'Conquer Uganda\'s majestic peaks and discover breathtaking landscapes',
    description: `Uganda's dramatic topography offers some of Africa's most spectacular hiking and trekking opportunities. From the legendary Mountains of the Moon (Rwenzori) to the volcanic peaks of Mount Elgon, every trail leads to unforgettable adventures and stunning vistas.

Our eco-conscious trekking experiences combine physical challenge with environmental stewardship. Each hike supports local communities through employment opportunities and sustainable tourism practices that protect these pristine mountain ecosystems.

Whether you're seeking multi-day mountain expeditions or scenic day hikes through coffee plantations and waterfalls, Uganda's diverse terrain offers trails for every fitness level and adventure preference.`,
    heroImages: [
      {
        src: '/images/hiking-hero-1.jpg',
        alt: 'Rwenzori Mountains peaks covered in mist',
        caption: 'Rwenzori Mountains - Mountains of the Moon'
      },
      {
        src: '/images/hiking-hero-2.jpg',
        alt: 'Sipi Falls three-tier waterfall system',
        caption: 'Sipi Falls - Three-tier waterfall system'
      },
      {
        src: '/images/hiking-hero-3.jpg',
        alt: 'Mount Elgon caldera and caves',
        caption: 'Mount Elgon - Ancient volcanic caldera'
      },
      {
        src: '/images/hiking-hero-4.jpg',
        alt: 'Fort Portal crater lakes hiking trail',
        caption: 'Fort Portal - Mystical crater lakes'
      }
    ],
    featuredDestinations: [
      {
        id: 'rwenzori-mountains',
        name: 'Rwenzori Mountains',
        description: 'The legendary Mountains of the Moon offering multi-day treks to Africa\'s third-highest peak with glaciers and alpine scenery.',
        image: '🏔️',
        experienceCount: 6
      },
      {
        id: 'mount-elgon',
        name: 'Mount Elgon',
        description: 'Ancient volcanic mountain with the world\'s largest caldera, featuring caves, hot springs, and diverse wildlife.',
        image: '⛰️',
        experienceCount: 8
      },
      {
        id: 'sipi-falls',
        name: 'Sipi Falls',
        description: 'Three-tier waterfall system offering scenic hikes through coffee plantations and traditional villages.',
        image: '💦',
        experienceCount: 5
      },
      {
        id: 'fort-portal-crater-lakes',
        name: 'Fort Portal Crater Lakes',
        description: 'Mystical crater lakes surrounded by lush landscapes, perfect for day hikes and cultural encounters.',
        image: '🌿',
        experienceCount: 7
      },
      {
        id: 'mgahinga-gorilla-park',
        name: 'Mgahinga Gorilla National Park',
        description: 'Golden monkey trekking and volcano hiking in the Virunga Mountains with stunning cross-border views.',
        image: '🐒',
        experienceCount: 4
      },
      {
        id: 'mabira-forest',
        name: 'Mabira Forest',
        description: 'Tropical rainforest with canopy walks, nature trails, and birdwatching opportunities near Kampala.',
        image: '🌳',
        experienceCount: 6
      }
    ],
    featuredExperiences: [
      {
        id: '10',
        title: 'Rwenzori Mountains Expedition',
        location: 'Rwenzori Mountains',
        rating: 4.9,
        reviews: 67,
        price: 1200,
        duration: '7 Days',
        difficulty: 'Challenging',
        image: '⛰️',
        highlights: ['Multi-Day Trek', 'Mountain Huts', 'Alpine Scenery', 'Summit Attempt']
      },
      {
        id: '5',
        title: 'Sipi Falls Hiking Adventure',
        location: 'Mount Elgon',
        rating: 4.5,
        reviews: 156,
        price: 95,
        originalPrice: 120,
        duration: '6 Hours',
        difficulty: 'Moderate',
        image: '🏔️',
        highlights: ['3 Waterfalls', 'Coffee Tour', 'Scenic Views', 'Local Lunch']
      },
      {
        id: '12',
        title: 'Fort Portal Crater Lakes Tour',
        location: 'Fort Portal',
        rating: 4.5,
        reviews: 134,
        price: 55,
        duration: 'Half Day',
        difficulty: 'Easy',
        image: '🌿',
        highlights: ['Crater Lakes', 'Tea Plantations', 'Scenic Drives', 'Local Communities']
      },
      {
        id: '25',
        title: 'Mount Elgon Cave Exploration',
        location: 'Mount Elgon National Park',
        rating: 4.6,
        reviews: 98,
        price: 120,
        duration: 'Full Day',
        difficulty: 'Moderate',
        image: '🕳️',
        highlights: ['Ancient Caves', 'Caldera Views', 'Wildlife Spotting', 'Cultural Sites']
      },
      {
        id: '26',
        title: 'Mabira Forest Canopy Walk',
        location: 'Mabira Forest',
        rating: 4.4,
        reviews: 87,
        price: 45,
        duration: '3 Hours',
        difficulty: 'Easy',
        image: '🌳',
        highlights: ['Canopy Bridge', 'Bird Watching', 'Nature Trails', 'Zip-lining']
      },
      {
        id: '27',
        title: 'Mgahinga Volcano Hike',
        location: 'Mgahinga National Park',
        rating: 4.7,
        reviews: 76,
        price: 180,
        duration: 'Full Day',
        difficulty: 'Challenging',
        image: '🌋',
        highlights: ['Volcano Summit', 'Golden Monkeys', 'Border Views', 'Alpine Plants']
      }
    ],
    travelInsights: [
      {
        id: 'rwenzori-trekking-guide',
        title: 'Complete Rwenzori Trekking Guide',
        excerpt: 'Everything you need to know about trekking the Mountains of the Moon, from permits to packing essentials.',
        image: '🏔️',
        readTime: '10 min read',
        category: 'Mountain Guide'
      },
      {
        id: 'hiking-gear-uganda',
        title: 'Essential Hiking Gear for Uganda',
        excerpt: 'Comprehensive gear guide for Uganda\'s diverse hiking conditions, from tropical forests to alpine environments.',
        image: '🎒',
        readTime: '7 min read',
        category: 'Equipment'
      },
      {
        id: 'altitude-acclimatization',
        title: 'High Altitude Hiking Tips',
        excerpt: 'Expert advice on acclimatization, altitude sickness prevention, and safe mountain hiking practices.',
        image: '⛰️',
        readTime: '6 min read',
        category: 'Safety'
      },
      {
        id: 'coffee-plantation-tours',
        title: 'Coffee Plantation Hiking Tours',
        excerpt: 'Discover Uganda\'s coffee culture while hiking through scenic plantations and meeting local farmers.',
        image: '☕',
        readTime: '5 min read',
        category: 'Culture'
      },
      {
        id: 'waterfall-photography',
        title: 'Capturing Uganda\'s Waterfalls',
        excerpt: 'Photography techniques for stunning waterfall shots during your hiking adventures.',
        image: '📷',
        readTime: '8 min read',
        category: 'Photography'
      },
      {
        id: 'forest-conservation',
        title: 'Forest Conservation Through Hiking',
        excerpt: 'Learn how responsible hiking tourism supports forest conservation and local communities.',
        image: '🌱',
        readTime: '6 min read',
        category: 'Conservation'
      }
    ],
    stats: {
      totalExperiences: 36,
      avgRating: 4.6,
      topDestination: 'Rwenzori'
    }
  };

  return <CategoryPageTemplate categoryData={hikingData} />;
}