'use client';

import React from 'react';
import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export default function WaterSportsCategoryPage() {
  const waterSportsData = {
    slug: 'water-sports',
    title: 'Water Sports',
    subtitle: 'Dive into Uganda\'s pristine waters for thrilling aquatic adventures',
    description: `Uganda's abundant water bodies offer world-class water sports experiences, from the legendary source of the Nile in Jinja to the tranquil islands of Lake Victoria. Experience heart-pounding white water rafting, peaceful island hopping, and exciting water-based activities.

Our water sports adventures emphasize environmental responsibility and safety, with expert guides ensuring thrilling yet secure experiences. Each activity is designed to showcase Uganda's stunning aquatic landscapes while supporting local communities through sustainable tourism.

From adrenaline-pumping rapids to serene lake cruises, Uganda's waters provide the perfect backdrop for unforgettable aquatic adventures that combine excitement with natural beauty.`,
    heroImages: [
      {
        src: '/images/watersports-hero-1.jpg',
        alt: 'White water rafting on the Nile River rapids',
        caption: 'White water rafting on the legendary Nile rapids'
      },
      {
        src: '/images/watersports-hero-2.jpg',
        alt: 'Kayaking on Lake Victoria near islands',
        caption: 'Kayaking adventures on Lake Victoria'
      },
      {
        src: '/images/watersports-hero-3.jpg',
        alt: 'Stand-up paddleboarding on calm waters',
        caption: 'Stand-up paddleboarding on pristine lakes'
      },
      {
        src: '/images/watersports-hero-4.jpg',
        alt: 'Boat cruise on Lake Bunyonyi',
        caption: 'Scenic boat cruises on Lake Bunyonyi'
      }
    ],
    featuredDestinations: [
      {
        id: 'jinja-nile',
        name: 'Jinja - Source of the Nile',
        description: 'Adventure capital of East Africa, home to world-class white water rafting and extreme water sports.',
        image: '🌊',
        experienceCount: 12
      },
      {
        id: 'lake-victoria',
        name: 'Lake Victoria',
        description: 'Africa\'s largest freshwater lake offering island hopping, fishing, and peaceful water activities.',
        image: '🏞️',
        experienceCount: 10
      },
      {
        id: 'ssese-islands',
        name: 'Ssese Islands',
        description: 'Tropical paradise perfect for kayaking, swimming, and exploring pristine island beaches.',
        image: '🏖️',
        experienceCount: 8
      },
      {
        id: 'lake-bunyonyi',
        name: 'Lake Bunyonyi',
        description: 'The Switzerland of Africa, ideal for canoeing, swimming, and scenic boat cruises.',
        image: '🛶',
        experienceCount: 6
      },
      {
        id: 'murchison-falls-nile',
        name: 'Murchison Falls - Nile',
        description: 'Experience the power of the Nile with boat safaris to the base of the spectacular falls.',
        image: '💦',
        experienceCount: 7
      },
      {
        id: 'lake-albert',
        name: 'Lake Albert',
        description: 'Great Rift Valley lake offering fishing expeditions and scenic water-based adventures.',
        image: '🎣',
        experienceCount: 4
      }
    ],
    featuredExperiences: [
      {
        id: '2',
        title: 'White Water Rafting Adventure',
        location: 'Jinja, River Nile',
        rating: 4.7,
        reviews: 187,
        price: 120,
        originalPrice: 150,
        duration: '4 Hours',
        difficulty: 'Challenging',
        image: '🚣‍♂️',
        highlights: ['Grade 5 Rapids', 'Safety Equipment', 'Lunch Included', 'Transport']
      },
      {
        id: '8',
        title: 'Lake Bunyonyi Island Hopping',
        location: 'Lake Bunyonyi',
        rating: 4.4,
        reviews: 98,
        price: 65,
        duration: 'Full Day',
        difficulty: 'Easy',
        image: '🏔️',
        highlights: ['Canoe Rides', 'Island Villages', 'Bird Watching', 'Swimming']
      },
      {
        id: '22',
        title: 'Stand-Up Paddleboarding',
        location: 'Lake Victoria',
        rating: 4.2,
        reviews: 78,
        price: 45,
        duration: '2 Hours',
        difficulty: 'Easy',
        image: '🏄‍♂️',
        highlights: ['Equipment Included', 'Beginner Friendly', 'Scenic Views', 'Swimming Break']
      },
      {
        id: '28',
        title: 'Ssese Islands Kayaking',
        location: 'Ssese Islands',
        rating: 4.6,
        reviews: 123,
        price: 85,
        duration: 'Full Day',
        difficulty: 'Moderate',
        image: '🚣‍♀️',
        highlights: ['Island Exploration', 'Beach Lunch', 'Snorkeling', 'Wildlife Viewing']
      },
      {
        id: '29',
        title: 'Nile Sunset Cruise',
        location: 'Jinja, River Nile',
        rating: 4.5,
        reviews: 165,
        price: 55,
        duration: '2 Hours',
        difficulty: 'Easy',
        image: '🌅',
        highlights: ['Sunset Views', 'Refreshments', 'Live Music', 'Photography']
      },
      {
        id: '30',
        title: 'Lake Victoria Fishing Safari',
        location: 'Lake Victoria',
        rating: 4.3,
        reviews: 94,
        price: 95,
        duration: '6 Hours',
        difficulty: 'Easy',
        image: '🎣',
        highlights: ['Traditional Fishing', 'Local Guides', 'Fresh Fish Lunch', 'Cultural Exchange']
      }
    ],
    travelInsights: [
      {
        id: 'nile-rafting-guide',
        title: 'Ultimate Nile Rafting Guide',
        excerpt: 'Complete guide to white water rafting on the Nile, including safety tips, what to expect, and best seasons.',
        image: '🚣‍♂️',
        readTime: '9 min read',
        category: 'Adventure Guide'
      },
      {
        id: 'water-safety-tips',
        title: 'Water Sports Safety in Uganda',
        excerpt: 'Essential safety guidelines for enjoying Uganda\'s water activities, from swimming to extreme sports.',
        image: '🦺',
        readTime: '6 min read',
        category: 'Safety'
      },
      {
        id: 'ssese-islands-travel',
        title: 'Ssese Islands Travel Guide',
        excerpt: 'Discover the tropical paradise of Ssese Islands - transportation, accommodation, and activities.',
        image: '🏖️',
        readTime: '8 min read',
        category: 'Destination'
      },
      {
        id: 'lake-victoria-conservation',
        title: 'Lake Victoria Conservation Efforts',
        excerpt: 'Learn about conservation initiatives protecting Africa\'s largest lake and how tourism helps.',
        image: '🌊',
        readTime: '7 min read',
        category: 'Conservation'
      },
      {
        id: 'fishing-culture-uganda',
        title: 'Traditional Fishing Culture',
        excerpt: 'Explore Uganda\'s rich fishing traditions and how local communities depend on freshwater resources.',
        image: '🎣',
        readTime: '5 min read',
        category: 'Culture'
      },
      {
        id: 'water-photography',
        title: 'Water Sports Photography',
        excerpt: 'Tips for capturing stunning action shots and scenic water landscapes during your adventures.',
        image: '📷',
        readTime: '6 min read',
        category: 'Photography'
      }
    ],
    stats: {
      totalExperiences: 28,
      avgRating: 4.5,
      topDestination: 'Jinja'
    }
  };

  return <CategoryPageTemplate categoryData={waterSportsData} />;
}