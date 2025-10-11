'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { getDestinationLink, hasDestinationPage } from '@/lib/destinations';
import ExperienceCarousel from '@/components/ExperienceCarousel';
import AccommodationCarousel from '@/components/AccommodationCarousel';
import TravelInsightsCarousel from '@/components/TravelInsightsCarousel';

interface SearchForm {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  category: 'all' | 'accommodations' | 'experiences';
}

export default function Home() {
  const { register, handleSubmit, watch } = useForm<SearchForm>({
    defaultValues: {
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2,
      category: 'all'
    }
  });

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const watchDestination = watch('destination');

  const onSearch = (data: SearchForm) => {
    const queryParams = new URLSearchParams({
      destination: data.destination,
      country: 'uganda',
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests.toString(),
      category: data.category
    });

    window.location.href = `/search?${queryParams.toString()}`;
  };

  const ugandaDestinations = [
    { name: 'Kampala', description: "Uganda's vibrant capital city", country: 'Uganda', image: '🏙️' },
    { name: 'Bwindi Impenetrable National Park', description: 'Home to mountain gorillas', country: 'Uganda', image: '🦍' },
    { name: 'Queen Elizabeth National Park', description: 'Wildlife safari paradise', country: 'Uganda', image: '🦁' },
    { name: 'Murchison Falls National Park', description: "World's most powerful waterfall", country: 'Uganda', image: '🌊' },
    { name: 'Lake Bunyonyi', description: 'Switzerland of Africa', country: 'Uganda', image: '🏞️' },
    { name: 'Kibale National Park', description: 'Primate capital of the world', country: 'Uganda', image: '🦧' },
    { name: 'Kidepo Valley National Park', description: 'Remote wilderness with unique wildlife', country: 'Uganda', image: '🐃' },
    { name: 'Lake Mburo National Park', description: 'Acacia woodland and zebra sanctuary', country: 'Uganda', image: '🦓' },
    { name: 'Rwenzori Mountains National Park', description: 'Mountains of the Moon', country: 'Uganda', image: '⛰️' },
    { name: 'Semuliki Valley National Park', description: 'Hot springs and rainforest', country: 'Uganda', image: '🌿' },
    { name: 'Mount Elgon National Park', description: 'Ancient volcanic mountain', country: 'Uganda', image: '🏔️' },
    { name: 'Jinja', description: 'Source of the Nile', country: 'Uganda', image: '🌊' },
    { name: 'Mgahinga Gorilla National Park', description: 'Golden monkeys and gorillas', country: 'Uganda', image: '🦍' },
    { name: 'Sipi Falls', description: 'Stunning waterfalls', country: 'Uganda', image: '💧' },
    { name: 'Lake Victoria', description: 'Africa\'s largest lake', country: 'Uganda', image: '🌊' },
    { name: 'Fort Portal', description: 'Gateway to national parks', country: 'Uganda', image: '🏰' }
  ];

  const getAllDestinations = () => {
    return ugandaDestinations;
  };

  const getActiveDestinations = () => {
    return ugandaDestinations;
  };

  const featuredExperiences = [
    {
      id: 1,
      title: 'Gorilla Trekking in Bwindi',
      location: 'Bwindi Impenetrable National Park',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 234,
      image: '🦍',
      duration: 'Full Day',
      category: 'Wildlife',
      highlights: ['Gorilla Family', 'Forest Trek', 'Conservation'],
      difficulty: 'Moderate',
      availability: 'Limited Spots',
      description: 'Experience the magic of encountering mountain gorillas in their natural habitat'
    },
    {
      id: 2,
      title: 'Chimp Tracking in Kibale',
      location: 'Kibale National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 178,
      image: '🦧',
      duration: 'Half Day',
      category: 'Wildlife',
      highlights: ['Chimpanzee Families', 'Primate Research', 'Forest Walk'],
      difficulty: 'Moderate',
      availability: 'Daily',
      description: 'Track our closest relatives with expert primatologists in the \'Primate Capital of the World\''
    },
    {
      id: 3,
      title: 'Kidepo Valley Safari',
      location: 'Kidepo Valley National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 105,
      image: '🐃',
      duration: '3 Days',
      category: 'Wildlife Safari',
      highlights: ['Remote Wilderness', 'Unique Wildlife', 'Mountain Views'],
      difficulty: 'Moderate',
      availability: 'Seasonal',
      description: 'Experience Uganda\'s most remote and pristine national park with exceptional wildlife viewing'
    },
    {
      id: 4,
      title: 'Murchison Falls Safari',
      location: 'Murchison Falls National Park',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 156,
      image: '🌊',
      duration: '2 Days',
      category: 'Wildlife Safari',
      highlights: ['Powerful Waterfall', 'Nile River', 'Big Five'],
      difficulty: 'Easy',
      availability: 'Daily',
      description: 'Witness the world\'s most powerful waterfall and explore Uganda\'s largest national park'
    },
    {
      id: 5,
      title: 'Queen Elizabeth Safari',
      location: 'Queen Elizabeth National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 189,
      image: '🦁',
      duration: '2 Days',
      category: 'Wildlife Safari',
      highlights: ['Tree-Climbing Lions', 'Kazinga Channel', 'Bird Watching'],
      difficulty: 'Easy',
      availability: 'Daily',
      description: 'Discover tree-climbing lions and diverse ecosystems in Uganda\'s most popular safari destination'
    },
    {
      id: 6,
      title: 'White Water Rafting Jinja',
      location: 'Source of the Nile, Jinja',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 234,
      image: '🚣',
      duration: 'Full Day',
      category: 'Adventure & Water Sports',
      highlights: ['Grade 5 Rapids', 'Nile River', 'Adrenaline Rush'],
      difficulty: 'Challenging',
      availability: 'Daily',
      description: 'Experience world-class white water rafting at the source of the mighty Nile River'
    },
    {
      id: 7,
      title: 'Lake Bunyonyi Canoeing',
      location: 'Lake Bunyonyi',
      country: '🇺🇬 Uganda',
      rating: 4.6,
      reviews: 98,
      image: '🏞️',
      duration: 'Half Day',
      category: 'Adventure & Relaxation',
      highlights: ['Island Hopping', 'Bird Watching', 'Scenic Views'],
      difficulty: 'Easy',
      availability: 'Daily',
      description: 'Explore the "Switzerland of Africa" with its stunning islands and crystal-clear waters'
    },
    {
      id: 8,
      title: 'Rwenzori Mountains Trek',
      location: 'Rwenzori Mountains National Park',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 67,
      image: '⛰️',
      duration: '7-9 Days',
      category: 'Adventure & Hiking',
      highlights: ['Snow-Capped Peaks', 'Alpine Lakes', 'Glaciers'],
      difficulty: 'Challenging',
      availability: 'Seasonal',
      description: 'Conquer the legendary Mountains of the Moon with their mystical glaciers and alpine vegetation'
    },
    {
      id: 9,
      title: 'Lake Mburo Wildlife Safari',
      location: 'Lake Mburo National Park',
      country: '🇺🇬 Uganda',
      rating: 4.5,
      reviews: 112,
      image: '🦓',
      duration: '1 Day',
      category: 'Wildlife Safari',
      highlights: ['Zebra Herds', 'Boat Safari', 'Night Game Drives'],
      difficulty: 'Easy',
      availability: 'Daily',
      description: 'Uganda\'s smallest savannah park packed with zebras, impalas, and unique acacia woodlands'
    },
    {
      id: 10,
      title: 'Sipi Falls Hiking',
      location: 'Sipi Falls, Mount Elgon',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 145,
      image: '💧',
      duration: 'Half Day',
      category: 'Adventure & Hiking',
      highlights: ['Three Waterfalls', 'Coffee Tours', 'Mountain Views'],
      difficulty: 'Moderate',
      availability: 'Daily',
      description: 'Trek through stunning waterfalls and learn about coffee cultivation on the slopes of Mount Elgon'
    },
    {
      id: 11,
      title: 'Mgahinga Gorilla Trekking',
      location: 'Mgahinga Gorilla National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 78,
      image: '🦍',
      duration: 'Full Day',
      category: 'Wildlife',
      highlights: ['Mountain Gorillas', 'Golden Monkeys', 'Volcanic Peaks'],
      difficulty: 'Moderate',
      availability: 'Limited Spots',
      description: 'Track gorillas and golden monkeys in the shadow of the Virunga volcanic mountains'
    },
    {
      id: 12,
      title: 'Semuliki Hot Springs',
      location: 'Semuliki National Park',
      country: '🇺🇬 Uganda',
      rating: 4.4,
      reviews: 89,
      image: '🌿',
      duration: 'Half Day',
      category: 'Nature & Cultural',
      highlights: ['Hot Springs', 'Rainforest', 'Batwa Culture'],
      difficulty: 'Easy',
      availability: 'Daily',
      description: 'Explore Uganda\'s only true lowland tropical rainforest with boiling hot springs'
    }
  ];

  const featuredAccommodations = [
    {
      id: 1,
      name: 'Clouds Mountain Gorilla Lodge',
      location: 'Bwindi Impenetrable National Park',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 156,
      price: 450,
      originalPrice: 520,
      discount: 'Save $70',
      image: '🦍',
      type: 'Stone Cottage',
      category: 'Luxury Lodge',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Mountain Views', 'Eco-Friendly'],
      specialFeatures: ['Mountain Views', 'Eco-Friendly'],
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Serena Hotel Kampala',
      location: 'Kampala',
      country: '🇺🇬 Uganda',
      rating: 4.5,
      reviews: 203,
      price: 180,
      originalPrice: 220,
      discount: 'Save $40',
      image: '🏙️',
      type: 'Executive Room',
      category: 'City Hotel',
      amenities: ['Swimming Pool', 'Spa', 'Restaurant', 'Free WiFi', 'Conference Facilities'],
      specialFeatures: ['City Center', 'Business Center'],
      availability: 'Available'
    },
    {
      id: 3,
      name: 'Kibale Forest Camp',
      location: 'Kibale National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 127,
      price: 400,
      originalPrice: 480,
      discount: 'Save $80',
      image: '🦧',
      type: 'Forest Tent',
      category: 'Eco Camp',
      amenities: ['Chimpanzee Tracking', 'Restaurant', 'Bar', 'Forest Views', 'Wildlife Guides'],
      specialFeatures: ['Chimpanzee Tracking', 'Forest Setting'],
      availability: 'Available'
    },
    {
      id: 4,
      name: 'Murchison Falls Safari Lodge',
      location: 'Murchison Falls National Park',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 98,
      price: 280,
      originalPrice: 350,
      discount: 'Save $70',
      image: '🌊',
      type: 'Park View Room',
      category: 'Safari Lodge',
      amenities: ['Nile River Views', 'Game Drives', 'Boating', 'Restaurant', 'Bar'],
      specialFeatures: ['Nile River Views', 'Boating'],
      availability: 'Available'
    },
    {
      id: 5,
      name: 'Kidepo Valley Lodge',
      location: 'Kidepo Valley National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 89,
      price: 350,
      originalPrice: 420,
      discount: 'Save $70',
      image: '🐃',
      type: 'Valley View Room',
      category: 'Remote Safari Lodge',
      amenities: ['Wildlife Viewing', 'Game Drives', 'Cultural Tours', 'Restaurant', 'Bar'],
      specialFeatures: ['Remote Location', 'Unique Wildlife'],
      availability: 'Available'
    },
    {
      id: 6,
      name: 'Lake Bunyonyi Rock View Resort',
      location: 'Lake Bunyonyi',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 123,
      price: 150,
      originalPrice: 180,
      discount: 'Save $30',
      image: '🏞️',
      type: 'Lake View Room',
      category: 'Lake Resort',
      amenities: ['Lake Views', 'Canoeing', 'Swimming', 'Restaurant', 'Cultural Tours'],
      specialFeatures: ['Lake Views', 'Island Tour'],
      availability: 'Available'
    },
    {
      id: 7,
      name: 'Queen Elizabeth Bush Lodge',
      location: 'Queen Elizabeth National Park',
      country: '🇺🇬 Uganda',
      rating: 4.6,
      reviews: 145,
      price: 320,
      originalPrice: 380,
      discount: 'Save $60',
      image: '🦁',
      type: 'Safari Tent',
      category: 'Safari Lodge',
      amenities: ['Kazinga Channel Views', 'Game Drives', 'Swimming Pool', 'Restaurant', 'Bar'],
      specialFeatures: ['Channel Views', 'Tree-Climbing Lions'],
      availability: 'Available'
    },
    {
      id: 8,
      name: 'Wildwaters Lodge',
      location: 'Source of the Nile, Jinja',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 178,
      price: 550,
      originalPrice: 650,
      discount: 'Save $100',
      image: '🚣',
      type: 'River Suite',
      category: 'Luxury Lodge',
      amenities: ['Nile River Island', 'Spa', 'Restaurant', 'Water Sports', 'Private Deck'],
      specialFeatures: ['Island Location', 'White Water Views'],
      availability: 'Available'
    },
    {
      id: 9,
      name: 'Sipi River Lodge',
      location: 'Sipi Falls, Mount Elgon',
      country: '🇺🇬 Uganda',
      rating: 4.5,
      reviews: 112,
      price: 120,
      originalPrice: 150,
      discount: 'Save $30',
      image: '💧',
      type: 'Garden Cottage',
      category: 'Mountain Lodge',
      amenities: ['Waterfall Views', 'Hiking', 'Coffee Tours', 'Restaurant', 'Campfire'],
      specialFeatures: ['Waterfall Views', 'Coffee Farm'],
      availability: 'Available'
    },
    {
      id: 10,
      name: 'Mihingo Lodge',
      location: 'Lake Mburo National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 134,
      price: 380,
      originalPrice: 450,
      discount: 'Save $70',
      image: '🦓',
      type: 'Rock Cottage',
      category: 'Luxury Lodge',
      amenities: ['Infinity Pool', 'Game Drives', 'Horse Riding', 'Restaurant', 'Bar'],
      specialFeatures: ['Rock Setting', 'Infinity Pool'],
      availability: 'Available'
    },
    {
      id: 11,
      name: 'Mount Gahinga Lodge',
      location: 'Mgahinga Gorilla National Park',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 89,
      price: 420,
      originalPrice: 500,
      discount: 'Save $80',
      image: '🦍',
      type: 'Bandas',
      category: 'Safari Lodge',
      amenities: ['Volcano Views', 'Gorilla Trekking', 'Restaurant', 'Garden', 'Cultural Tours'],
      specialFeatures: ['Volcano Views', 'Batwa Experience'],
      availability: 'Available'
    },
    {
      id: 12,
      name: 'Semuliki Safari Lodge',
      location: 'Semuliki National Park',
      country: '🇺🇬 Uganda',
      rating: 4.4,
      reviews: 67,
      price: 280,
      originalPrice: 340,
      discount: 'Save $60',
      image: '🌿',
      type: 'Luxury Tent',
      category: 'Safari Camp',
      amenities: ['Hot Springs Access', 'Forest Views', 'Swimming Pool', 'Restaurant', 'Bar'],
      specialFeatures: ['Hot Springs', 'Rainforest Setting'],
      availability: 'Available'
    }
  ];

  const greenPathsHighlights = [
    {
      title: 'Tree Planting Programs',
      description: 'Join our comprehensive reforestation initiatives across Uganda, where we work with local communities to plant indigenous tree species, restore wildlife corridors, and create sustainable forest ecosystems. Our programs include long-term monitoring and maintenance to ensure tree survival.',
      icon: '🌳'
    },
    {
      title: 'Carbon Offset Travel',
      description: 'We calculate and offset the environmental impact of each journey through a combination of renewable energy projects, reforestation efforts, and sustainable agriculture initiatives. Experience guilt-free travel while supporting climate action in Uganda.',
      icon: '🌍'
    },
    {
      title: 'Community Conservation',
      description: 'Empowering local communities through sustainable conservation projects, including eco-tourism initiatives, environmental education programs, and alternative livelihood development. We ensure that conservation benefits both wildlife and people.',
      icon: '👥'
    }
  ];

  const travelGuideTeases = [
    {
      title: 'Best Time to Visit Uganda',
      preview: 'Discover optimal seasons for gorilla trekking, wildlife safaris, and adventures across Uganda\'s diverse landscapes...',
      readTime: '7 min read',
      image: '📅',
      region: 'Uganda'
    },
    {
      title: 'Ultimate Gorilla Trekking Guide',
      preview: "Complete guide to mountain gorilla encounters in Bwindi and Mgahinga National Parks with permit information and trekking tips...",
      readTime: '10 min read',
      image: '🦍',
      region: 'Uganda'
    },
    {
      title: 'Uganda Safari Planning Guide',
      preview: 'Essential information for planning your perfect Uganda safari from Murchison Falls to Queen Elizabeth National Park...',
      readTime: '8 min read',
      image: '🦁',
      region: 'Uganda'
    },
    {
      title: 'Cultural Etiquette in Uganda',
      preview: 'Respectful travel tips for meaningful cultural exchanges with Uganda\'s diverse communities and tribes...',
      readTime: '6 min read',
      image: '🤝',
      region: 'Uganda'
    }
  ];

  const filteredDestinations = getAllDestinations().filter(dest =>
    dest.name.toLowerCase().includes(watchDestination.toLowerCase())
  );

  // Responsive carousel navigation functions
  const getCardsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 card
      if (window.innerWidth < 768) return 2; // Small tablet: 2 cards
      if (window.innerWidth < 1024) return 3; // Tablet: 3 cards
      if (window.innerWidth < 1280) return 4; // Desktop: 4 cards
      return 5; // Large desktop: 5 cards
    }
    return 5; // Default for SSR
  };

  const [cardsPerSlide, setCardsPerSlide] = useState(getCardsPerSlide());
  const activeDestinations = getActiveDestinations();
  const totalSlides = Math.ceil(activeDestinations.length / cardsPerSlide);

  // Update cards per slide on window resize
  React.useEffect(() => {
    const handleResize = () => {
      setCardsPerSlide(getCardsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextDestination = () => {
    if (currentDestinationIndex < totalSlides - 1) {
      setCurrentDestinationIndex(currentDestinationIndex + 1);
    }
  };

  const prevDestination = () => {
    if (currentDestinationIndex > 0) {
      setCurrentDestinationIndex(currentDestinationIndex - 1);
    }
  };

  // Touch/swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return; 
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentDestinationIndex < totalSlides - 1) {
      nextDestination();
    }
    if (isRightSwipe && currentDestinationIndex > 0) {
      prevDestination();
    }
  };

  const primaryColor = '#195e48';

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Shakes Travel - Uganda Safari & Gorilla Trekking Experts",
    "description": "Discover Uganda's wonders with sustainable safari adventures, gorilla trekking, and eco-friendly accommodations in the Pearl of Africa. Experience authentic Ugandan travel with Shakes Travel.",
    "url": typeof window !== 'undefined' ? window.location.origin : '',
    "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/brand_assets/images/logo/logo.png`,
    "image": `${typeof window !== 'undefined' ? window.location.origin : ''}/images/uganda-hero.jpg`,
    "telephone": "+256-XXX-XXXXXX",
    "email": "info@shakestravel.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressLocality": "Kampala",
      "addressRegion": "Central Region"
    },
    "sameAs": [
      "https://facebook.com/shakestravel",
      "https://instagram.com/shakestravel",
      "https://twitter.com/shakestravel"
    ],
    "makesOffer": [
      {
        "@type": "Offer",
        "name": "Bwindi Gorilla Trekking Tours",
        "description": "Experience mountain gorillas in Bwindi Impenetrable National Park and Mgahinga",
        "category": "Adventure Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "Uganda Safari Adventures",
        "description": "Wildlife safaris in Murchison Falls, Queen Elizabeth, Kidepo Valley, and Lake Mburo National Parks",
        "category": "Wildlife Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "Chimpanzee Tracking",
        "description": "Primate tracking in Kibale National Park, the Primate Capital of the World",
        "category": "Wildlife Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "White Water Rafting Jinja",
        "description": "World-class rafting at the Source of the Nile River",
        "category": "Adventure Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "Rwenzori Mountains Trekking",
        "description": "Mountain trekking in the legendary Mountains of the Moon",
        "category": "Adventure Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "Cultural Tours Uganda",
        "description": "Authentic cultural experiences with Uganda's diverse communities and tribes",
        "category": "Cultural Tourism",
        "areaServed": "Uganda"
      },
      {
        "@type": "Offer",
        "name": "Eco-Friendly Uganda Accommodations",
        "description": "Sustainable lodges and camps across Uganda's national parks",
        "category": "Green Accommodations",
        "areaServed": "Uganda"
      }
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Uganda"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section 
        className="relative hero-carousel min-h-[90vh] flex items-center justify-center text-white py-20"
        aria-label="Hero section with search functionality"
        role="banner"
      >
        <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
        <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <header>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
              Discover Uganda's Wonders
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Experience sustainable tourism in the Pearl of Africa - crafting immersive journeys that connect travelers deeply with Uganda's breathtaking landscapes, incredible wildlife, and vibrant culture while championing environmental conservation
            </p>
          </header>
          
          {/* Enhanced Search Form */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900 max-w-6xl mx-auto"
            role="search"
            aria-label="Search for Uganda travel experiences"
          >
            <form onSubmit={handleSubmit(onSearch)} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              <div className="md:col-span-2 search-autocomplete">
                <label htmlFor="destination-search" className="block text-sm font-semibold mb-2 text-gray-700">
                  Where in Uganda?
                </label>
                <input
                  {...register('destination', { required: true })}
                  id="destination-search"
                  type="text"
                  placeholder="Search Uganda destinations..."
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-lg"
                  style={{ focusRingColor: primaryColor }}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  aria-describedby="destination-help"
                  autoComplete="off"
                />
                <input type="hidden" {...register('country')} />
                <div id="destination-help" className="sr-only">
                  Type to search for destinations in Uganda. Autocomplete suggestions will appear below.
                </div>
                {showAutocomplete && watchDestination && filteredDestinations.length > 0 && (
                  <div 
                    className="search-autocomplete-dropdown"
                    role="listbox"
                    aria-label="Destination suggestions"
                  >
                    {filteredDestinations.slice(0, 5).map((dest, index) => (
                      <div
                        key={index}
                        className="search-autocomplete-item flex items-center space-x-3"
                        role="option"
                        aria-selected="false"
                        tabIndex={0}
                        onClick={() => {
                          register('destination').onChange({ target: { value: dest.name } });
                          setShowAutocomplete(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            register('destination').onChange({ target: { value: dest.name } });
                            setShowAutocomplete(false);
                          }
                        }}
                      >
                        <span className="text-2xl" aria-hidden="true">{dest.image || '🌍'}</span>
                        <div>
                          <div className="font-medium">{dest.name}</div>
                          <div className="text-sm text-gray-500">{dest.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="checkin-date" className="block text-sm font-semibold mb-2 text-gray-700">
                  Check-in
                </label>
                <input
                  {...register('checkIn')}
                  id="checkin-date"
                  type="date"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  aria-label="Select check-in date"
                />
              </div>
              
              <div>
                <label htmlFor="guest-count" className="block text-sm font-semibold mb-2 text-gray-700">
                  Guests
                </label>
                <select
                  {...register('guests')}
                  id="guest-count"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                  style={{ focusRingColor: primaryColor }}
                  aria-label="Select number of guests"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </form>
            
            <fieldset className="flex flex-wrap gap-6 mt-6 justify-center">
              <legend className="sr-only">Choose experience category</legend>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="all" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="all-experiences-desc"
                />
                All Experiences
                <span id="all-experiences-desc" className="sr-only">Search all types of experiences</span>
              </label>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="accommodations" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="accommodations-desc"
                />
                Accommodations
                <span id="accommodations-desc" className="sr-only">Search for places to stay</span>
              </label>
              <label className="flex items-center text-lg">
                <input 
                  {...register('category')} 
                  type="radio" 
                  value="experiences" 
                  className="mr-3 w-4 h-4"
                  style={{ accentColor: primaryColor }}
                  aria-describedby="adventures-desc"
                />
                Adventures
                <span id="adventures-desc" className="sr-only">Search for adventure activities</span>
              </label>
            </fieldset>
            
            <button
              type="submit"
              className="w-full mt-8 btn-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#164439'}
              onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
              aria-label="Search for Uganda travel experiences"
            >
              🔍 Search Uganda Adventures
            </button>
          </div>
        </div>
      </section>

      {/* Uganda Destinations Showcase */}
      <section id="destinations" className="py-20 bg-gray-50" aria-labelledby="destinations-heading">
        <div className="content-section">
          <header className="text-center mb-16">
            <h2 id="destinations-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Uganda's Treasures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From misty mountain gorillas to powerful waterfalls, discover the diverse landscapes and wildlife across the Pearl of Africa
            </p>
          </header>
          
          {/* Destinations Carousel - 5 Cards Per Slide */}
          <div className="relative max-w-7xl mx-auto">
            {/* Navigation Arrows */}
            {currentDestinationIndex > 0 && (
              <button
                onClick={prevDestination}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: primaryColor }}
                aria-label="Previous destinations"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {currentDestinationIndex < totalSlides - 1 && (
              <button
                onClick={nextDestination}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-offset-2"
                style={{ focusRingColor: primaryColor }}
                aria-label="Next destinations"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Carousel Container */}
            <div className="overflow-hidden px-4 sm:px-8 lg:px-12">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentDestinationIndex * 100}%)` }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {Array.from({ length: totalSlides }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="flex gap-4 sm:gap-3 md:gap-4 justify-between px-2 sm:px-0">
                      {activeDestinations
                        .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                        .map((destination, index) => (
                          <article key={destination.name} className="flex-1 group min-w-0">
                            <Link 
                              href={getDestinationLink(destination.name)}
                              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 block focus:ring-2 focus:ring-offset-2 flex flex-col h-72 sm:h-60 md:h-64"
                              style={{ focusRingColor: primaryColor }}
                              aria-label={`Explore ${destination.name}: ${destination.description}`}
                            >
                              <div 
                                className="h-40 sm:h-28 md:h-32 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200 overflow-hidden"
                                style={{ backgroundColor: `${primaryColor}10` }}
                                aria-hidden="true"
                              >
                                {/* East Africa destinations with specific images */}
                                {destination.name === 'Kampala' ? (
                                  <img 
                                    src="/brand_assets/images/destinations/Kampala/Kampala Edited.jpg"
                                    alt={`${destination.name} destination`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : destination.name === 'Bwindi Impenetrable National Park' ? (
                                  <img 
                                    src="/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg"
                                    alt={`${destination.name} destination`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : destination.name === 'Queen Elizabeth National Park' ? (
                                  <img 
                                    src="/brand_assets/images/destinations/Queen Elizabeth National Park/Queen Elizabeth NP 2 Edited.jpg"
                                    alt={`${destination.name} destination`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : destination.name === 'Murchison Falls National Park' ? (
                                  <img 
                                    src="/brand_assets/images/destinations/Murchison Falls/Murchison Falls 1.jpg"
                                    alt={`${destination.name} destination`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : destination.name === 'Lake Bunyonyi' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🌊</span>
                                  </div>
                                ) : 
                                /* Kenya destinations */
                                destination.name === 'Masai Mara National Reserve' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                                    <span className="text-4xl">🦁</span>
                                  </div>
                                ) : destination.name === 'Amboseli National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🐘</span>
                                  </div>
                                ) : destination.name === 'Lake Nakuru National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
                                    <span className="text-4xl">🦩</span>
                                  </div>
                                ) : destination.name === 'Samburu National Reserve' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🐫</span>
                                  </div>
                                ) : destination.name === 'Diani Beach' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center">
                                    <span className="text-4xl">🏖️</span>
                                  </div>
                                ) : destination.name === 'Nairobi National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🦒</span>
                                  </div>
                                ) : destination.name === 'Hell\'s Gate National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-200 flex items-center justify-center">
                                    <span className="text-4xl">🧗</span>
                                  </div>
                                ) : destination.name === 'Tsavo National Parks' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-brown-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🦛</span>
                                  </div>
                                ) : 
                                /* Tanzania destinations */
                                destination.name === 'Serengeti National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🦒</span>
                                  </div>
                                ) : destination.name === 'Ngorongoro Conservation Area' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-brown-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🦓</span>
                                  </div>
                                ) : destination.name === 'Mount Kilimanjaro' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-white to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🏔️</span>
                                  </div>
                                ) : destination.name === 'Zanzibar' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-turquoise-200 flex items-center justify-center">
                                    <span className="text-4xl">🏝️</span>
                                  </div>
                                ) : destination.name === 'Tarangire National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-200 flex items-center justify-center">
                                    <span className="text-4xl">🌳</span>
                                  </div>
                                ) : 
                                /* Uganda destinations */
                                destination.name === 'Kibale National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-4xl">🦧</span>
                                  </div>
                                ) : destination.name === 'Kidepo Valley National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                                    <span className="text-4xl">🐃</span>
                                  </div>
                                ) : destination.name === 'Lake Mburo National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🦓</span>
                                  </div>
                                ) : 
                                /* Rwanda destinations */
                                destination.name === 'Volcanoes National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-4xl">🦍</span>
                                  </div>
                                ) : destination.name === 'Nyungwe Forest' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">
                                    <span className="text-4xl">🌲</span>
                                  </div>
                                ) : destination.name === 'Lake Kivu' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🌊</span>
                                  </div>
                                ) : destination.name === 'Akagera National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                                    <span className="text-4xl">🐅</span>
                                  </div>
                                ) : destination.name === 'Kigali' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🏙️</span>
                                  </div>
                                ) : 
                                /* Other destinations */
                                destination.name === 'Lamu Old Town' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🏛️</span>
                                  </div>
                                ) : destination.name === 'Mount Elgon National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">⛰️</span>
                                  </div>
                                ) : destination.name === 'Mount Kenya National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🏔️</span>
                                  </div>
                                ) : destination.name === 'Lake Turkana National Parks' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center">
                                    <span className="text-4xl">🏜️</span>
                                  </div>
                                ) : destination.name === 'Watamu Marine Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🐠</span>
                                  </div>
                                ) : destination.name === 'Rwenzori Mountains National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-blue-300 flex items-center justify-center">
                                    <span className="text-4xl">⛰️</span>
                                  </div>
                                ) : destination.name === 'Semuliki Valley National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-200 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🌿</span>
                                  </div>
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs font-medium">Photo Coming Soon</span>
                                  </div>
                                )}
                              </div>
                              <div className="p-3 sm:p-3 md:p-4 flex flex-col justify-between flex-1">
                                <div>
                                  <div className="mb-2">
                                    <h3 className="font-semibold text-base sm:text-sm text-gray-900 leading-tight">{destination.name}</h3>
                                  </div>
                                  <p className="text-gray-600 text-xs sm:text-xs mb-3 line-clamp-2 leading-relaxed">{destination.description}</p>
                                </div>
                                <div className="flex justify-end items-center mt-auto">
                                  <span 
                                    className="text-xs font-semibold transition-colors"
                                    style={{ color: primaryColor }}
                                  >
                                    Explore →
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </article>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Experiences with Carousel */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Top Uganda Experiences
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked adventures across the Pearl of Africa
              </p>
            </div>
            <Link
              href="/all-experiences"
              className="hidden md:inline-block btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Experiences
            </Link>
          </div>

          {/* Experience Carousel */}
          <ExperienceCarousel experiences={featuredExperiences} primaryColor={primaryColor} />

          {/* Mobile View All Button */}
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/all-experiences"
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              View All Experiences
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="py-20 bg-gray-50">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find your Perfect Stay
              </h2>
              <p className="text-xl text-gray-600">
                Discover premium accommodations across Uganda's most stunning destinations
              </p>
            </div>
            <Link
              href="/accommodations"
              className="hidden md:inline-block btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Stays
            </Link>
          </div>

          {/* Accommodation Carousel */}
          <AccommodationCarousel accommodations={featuredAccommodations} primaryColor={primaryColor} />

          {/* Mobile View All Button */}
          <div className="text-center mt-8 md:hidden">
            <Link
              href="/accommodations"
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-block"
              style={{ backgroundColor: primaryColor }}
            >
              View All Stays
            </Link>
          </div>
        </div>
      </section>

      {/* Planting Green Paths Section */}
      <section className="py-20" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="content-section">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🌱 Planting Green Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Travel with purpose. Every journey actively contributes to healing and protecting the continent's ecosystems while empowering communities and creating pathways for cultural preservation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {greenPathsHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg text-center card-hover-effect">
                <div className="text-6xl mb-4">{highlight.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{highlight.title}</h3>
                <p className="text-gray-600 mb-4">{highlight.description}</p>
                <div className="px-4 py-2 rounded-full text-sm font-semibold" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                  {highlight.impact}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              href="/planting-green-paths" 
              className="btn-primary text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center"
              style={{ backgroundColor: primaryColor }}
            >
              🌍 Join Our Green Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Guide Teasers */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Travel Insights
              </h2>
              <p className="text-xl text-gray-600">
                Expert tips and guides for your perfect Uganda adventure
              </p>
            </div>
            <Link 
              href="/travel-guide" 
              className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Guides
            </Link>
          </div>
          
          <TravelInsightsCarousel guides={travelGuideTeases} primaryColor={primaryColor} />
        </div>
      </section>

      {/* Call-to-Action Footer */}
      <section className="py-20 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Uganda Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in redefining adventure as a force for good - where travelers, hosts, and ecosystems thrive together through responsible, restorative travel in the Pearl of Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/all-experiences" 
              className="bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              style={{ color: primaryColor }}
            >
              🌟 Explore Experiences
            </Link>
            <Link 
              href="/about" 
              className="border-2 border-white text-white hover:bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              style={{ borderColor: 'white' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              📖 Learn About Us
            </Link>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}