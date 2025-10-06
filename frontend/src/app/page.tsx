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
  country: 'uganda' | 'kenya' | 'tanzania' | 'rwanda' | 'all';
  checkIn: string;
  checkOut: string;
  guests: number;
  category: 'all' | 'accommodations' | 'experiences';
}

export default function Home() {
  const { register, handleSubmit, watch } = useForm<SearchForm>({
    defaultValues: {
      destination: '',
      country: 'all',
      checkIn: '',
      checkOut: '',
      guests: 2,
      category: 'all'
    }
  });

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDestinationIndex, setCurrentDestinationIndex] = useState(0);
  const [activeCountryTab, setActiveCountryTab] = useState<'uganda' | 'kenya' | 'tanzania' | 'rwanda'>('uganda');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const watchDestination = watch('destination');
  const watchCountry = watch('country');

  const onSearch = (data: SearchForm) => {
    const queryParams = new URLSearchParams({
      destination: data.destination,
      country: data.country,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      guests: data.guests.toString(),
      category: data.category
    });
    
    window.location.href = `/search?${queryParams.toString()}`;
  };

  const destinations = {
    uganda: [
      { name: 'Kampala', description: "Uganda's vibrant capital city", country: 'Uganda' },
      { name: 'Bwindi Impenetrable Forest', description: 'Home to mountain gorillas', country: 'Uganda' },
      { name: 'Queen Elizabeth National Park', description: 'Wildlife safari paradise', country: 'Uganda' },
      { name: 'Murchison Falls', description: "World's most powerful waterfall", country: 'Uganda' },
      { name: 'Lake Bunyonyi', description: 'Switzerland of Africa', country: 'Uganda' }
    ],
    kenya: [
      { name: 'Maasai Mara', description: 'Home to the Great Migration', country: 'Kenya' },
      { name: 'Amboseli National Park', description: 'Elephants with Kilimanjaro backdrop', country: 'Kenya' },
      { name: 'Lake Nakuru', description: 'Pink flamingo paradise', country: 'Kenya' },
      { name: 'Samburu National Reserve', description: 'Unique northern wildlife', country: 'Kenya' },
      { name: 'Diani Beach', description: 'White sand tropical coastline', country: 'Kenya' }
    ],
    tanzania: [
      { name: 'Serengeti National Park', description: 'Endless plains of wildlife', country: 'Tanzania' },
      { name: 'Ngorongoro Crater', description: "World's largest volcanic caldera", country: 'Tanzania' },
      { name: 'Mount Kilimanjaro', description: "Africa's highest peak", country: 'Tanzania' },
      { name: 'Zanzibar', description: 'Spice island paradise', country: 'Tanzania' },
      { name: 'Tarangire National Park', description: 'Land of giants and baobabs', country: 'Tanzania' }
    ],
    rwanda: [
      { name: 'Volcanoes National Park', description: 'Mountain gorilla sanctuary', country: 'Rwanda' },
      { name: 'Nyungwe Forest', description: 'Pristine rainforest canopy', country: 'Rwanda' },
      { name: 'Lake Kivu', description: 'Great Rift Valley jewel', country: 'Rwanda' },
      { name: 'Akagera National Park', description: 'Big Five savanna experience', country: 'Rwanda' },
      { name: 'Kigali', description: 'Clean, modern capital city', country: 'Rwanda' }
    ]
  };

  const getAllDestinations = () => {
    return [...destinations.uganda, ...destinations.kenya, ...destinations.tanzania, ...destinations.rwanda];
  };

  const getActiveDestinations = () => {
    return destinations[activeCountryTab];
  };

  const featuredExperiences = [
    {
      id: 1,
      title: 'Gorilla Trekking in Bwindi',
      location: 'Bwindi Impenetrable Forest',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 234,
      image: '🦍',
      duration: '1 Day',
      category: 'Wildlife Safari',
      highlights: ['Expert Guide', 'Permit Included'],
      difficulty: 'Moderate',
      availability: 'Daily departures',
      description: 'Experience the magic of encountering mountain gorillas in their natural habitat'
    },
    {
      id: 2,
      title: 'Great Migration Safari',
      location: 'Masai Mara Reserve',
      country: '🇰🇪 Kenya',
      rating: 4.8,
      reviews: 456,
      image: '🦓',
      duration: '3 Days',
      category: 'Wildlife Safari',
      highlights: ['Balloon Safari', 'Luxury Camp'],
      difficulty: 'Easy',
      availability: 'Jul-Oct Best',
      description: "Witness one of nature's greatest spectacles as millions of animals cross the savanna"
    },
    {
      id: 3,
      title: 'Kilimanjaro Summit Trek',
      location: 'Mount Kilimanjaro',
      country: '🇹🇿 Tanzania',
      rating: 4.7,
      reviews: 312,
      image: '🏔️',
      duration: '7 Days',
      category: 'Adventure',
      highlights: ['Full Equipment', 'Expert Guides'],
      difficulty: 'Challenging',
      availability: 'Year-round',
      description: "Conquer Africa's highest peak with breathtaking landscapes and unforgettable adventures"
    },
    {
      id: 4,
      title: 'Golden Monkey Tracking',
      location: 'Volcanoes National Park',
      country: '🇷🇼 Rwanda',
      rating: 4.8,
      reviews: 189,
      image: '🐒',
      duration: '4 Hours',
      category: 'Wildlife Safari',
      highlights: ['Small Groups', 'Photography'],
      difficulty: 'Easy',
      availability: 'Daily 9AM & 2PM',
      description: "Track playful golden monkeys in Rwanda's pristine mountain forests"
    },
    {
      id: 5,
      title: 'White Water Rafting Adventure',
      location: 'Jinja, River Nile',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 187,
      image: '🚣',
      duration: '4 Hours',
      category: 'Water Sports',
      highlights: ['Grade 5 Rapids', 'Safety Equipment'],
      difficulty: 'Challenging',
      availability: 'Daily 9AM & 2PM',
      description: 'Navigate the legendary rapids of the River Nile with expert guides'
    },
    {
      id: 6,
      title: 'Ngorongoro Crater Safari',
      location: 'Ngorongoro Conservation',
      country: '🇹🇿 Tanzania',
      rating: 4.9,
      reviews: 523,
      image: '🦁',
      duration: '2 Days',
      category: 'Wildlife Safari',
      highlights: ['Big Five', 'Crater Lodge'],
      difficulty: 'Easy',
      availability: 'Daily departures',
      description: 'Explore the world\'s largest intact volcanic caldera teeming with wildlife'
    },
    {
      id: 7,
      title: 'Canopy Walk in Nyungwe',
      location: 'Nyungwe Forest',
      country: '🇷🇼 Rwanda',
      rating: 4.6,
      reviews: 145,
      image: '🌲',
      duration: '3 Hours',
      category: 'Adventure',
      highlights: ['Suspended Bridge', 'Bird Watching'],
      difficulty: 'Moderate',
      availability: 'Morning tours',
      description: "Walk among the treetops in one of Africa's oldest rainforests"
    },
    {
      id: 8,
      title: 'Serengeti Balloon Safari',
      location: 'Serengeti National Park',
      country: '🇹🇿 Tanzania',
      rating: 5.0,
      reviews: 267,
      image: '🎈',
      duration: '3 Hours',
      category: 'Aerial Adventure',
      highlights: ['Sunrise Flight', 'Champagne Breakfast'],
      difficulty: 'Easy',
      availability: 'Daily at dawn',
      description: 'Float above the endless plains and witness wildlife from a unique perspective'
    },
    {
      id: 9,
      title: 'Maasai Cultural Experience',
      location: 'Amboseli Region',
      country: '🇰🇪 Kenya',
      rating: 4.7,
      reviews: 203,
      image: '🏘️',
      duration: '1 Day',
      category: 'Cultural',
      highlights: ['Village Visit', 'Traditional Dance'],
      difficulty: 'Easy',
      availability: 'Tue, Thu, Sat',
      description: 'Immerse yourself in the rich traditions of the iconic Maasai people'
    },
    {
      id: 10,
      title: 'Chimpanzee Habituation',
      location: 'Kibale Forest',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 178,
      image: '🦧',
      duration: 'Full Day',
      category: 'Wildlife Safari',
      highlights: ['Research Team', 'All Day Access'],
      difficulty: 'Moderate',
      availability: 'Limited permits',
      description: "Spend an entire day with our closest relatives in their natural forest home"
    },
    {
      id: 11,
      title: 'Zanzibar Spice & Beach Tour',
      location: 'Zanzibar Island',
      country: '🇹🇿 Tanzania',
      rating: 4.6,
      reviews: 412,
      image: '🏝️',
      duration: '1 Day',
      category: 'Cultural',
      highlights: ['Spice Farm', 'Stone Town'],
      difficulty: 'Easy',
      availability: 'Daily tours',
      description: 'Explore aromatic spice farms and pristine beaches on the exotic Spice Island'
    },
    {
      id: 12,
      title: 'Lake Nakuru Flamingo Safari',
      location: 'Lake Nakuru',
      country: '🇰🇪 Kenya',
      rating: 4.5,
      reviews: 289,
      image: '🦩',
      duration: '1 Day',
      category: 'Wildlife Safari',
      highlights: ['Pink Flamingos', 'Rhino Sanctuary'],
      difficulty: 'Easy',
      availability: 'Best Nov-Apr',
      description: 'Marvel at thousands of pink flamingos and endangered rhinos in this beautiful park'
    }
  ];

  const featuredAccommodations = [
    // Uganda - Premium Gorilla Trekking & Safari Accommodations
    {
      id: 1,
      name: 'Clouds Mountain Gorilla Lodge',
      location: 'Bwindi Impenetrable Forest',
      country: '🇺🇬 Uganda',
      rating: 4.9,
      reviews: 156,
      price: 450,
      originalPrice: 520,
      discount: 'Save $70',
      image: '🏞️',
      type: 'Stone Cottage',
      category: 'Luxury Lodge',
      amenities: ['Free WiFi', 'Restaurant', 'Spa', 'Mountain Views', 'Eco-Friendly'],
      specialFeatures: ['Mountain Views', 'Eco-Friendly'],
      availability: 'Available'
    },
    {
      id: 2,
      name: 'Chobe Safari Lodge',
      location: 'Murchison Falls National Park',
      country: '🇺🇬 Uganda',
      rating: 4.7,
      reviews: 203,
      price: 280,
      originalPrice: 340,
      discount: 'Save $60',
      image: '🦁',
      type: 'Safari Tent',
      category: 'Safari Lodge',
      amenities: ['Pool', 'Restaurant', 'Bar', 'River Views', 'Wildlife Viewing'],
      specialFeatures: ['River Views', 'Wildlife Viewing'],
      availability: 'Available'
    },
    {
      id: 3,
      name: 'Birdnest Resort',
      location: 'Lake Bunyonyi',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 127,
      price: 180,
      originalPrice: 220,
      discount: 'Save $40',
      image: '🌊',
      type: 'Lake View Room',
      category: 'Eco Resort',
      amenities: ['Free WiFi', 'Restaurant', 'Canoe Rental', 'Lake Views', 'Bird Watching'],
      specialFeatures: ['Lake Views', 'Bird Watching'],
      availability: 'Available'
    },
    {
      id: 4,
      name: 'Kibale Lodge',
      location: 'Kibale Forest National Park',
      country: '🇺🇬 Uganda',
      rating: 4.8,
      reviews: 189,
      price: 800,
      originalPrice: 1000,
      discount: 'Save $200',
      image: '🦧',
      type: 'Forest Cottage',
      category: 'Luxury Lodge',
      amenities: ['Chimpanzee Trekking', 'Spa', 'Forest Views', 'Butler Service', 'Organic Garden'],
      specialFeatures: ['Rwenzori Mountain Views', 'Chimp Trekking'],
      availability: 'Available'
    },
    // Kenya - Migration & Safari Excellence
    {
      id: 5,
      name: 'Angama Mara',
      location: 'Masai Mara National Reserve',
      country: '🇰🇪 Kenya',
      rating: 4.9,
      reviews: 324,
      price: 800,
      originalPrice: 1000,
      discount: 'Save $200',
      image: '🦓',
      type: 'Luxury Suite',
      category: 'Luxury Lodge',
      amenities: ['Infinity Pool', 'Spa', 'Butler Service', 'Migration Views', 'Hot Air Balloon'],
      specialFeatures: ['Migration Views', 'Out of Africa Film Site'],
      availability: 'Available'
    },
    {
      id: 6,
      name: 'Tortilis Camp',
      location: 'Amboseli National Park',
      country: '🇰🇪 Kenya',
      rating: 4.8,
      reviews: 198,
      price: 600,
      originalPrice: 750,
      discount: 'Save $150',
      image: '🐘',
      type: 'Tented Room',
      category: 'Luxury Camp',
      amenities: ['Kilimanjaro Views', 'Elephant Encounters', 'Pool', 'Spa', 'Game Drives'],
      specialFeatures: ['Kilimanjaro Views', 'Elephant Encounters'],
      availability: 'Available'
    },
    {
      id: 7,
      name: 'Peponi Hotel',
      location: 'Lamu Old Town',
      country: '🇰🇪 Kenya',
      rating: 4.6,
      reviews: 145,
      price: 350,
      originalPrice: 420,
      discount: 'Save $70',
      image: '🏝️',
      type: 'Beachfront Suite',
      category: 'Boutique Hotel',
      amenities: ['Private Beach', 'Water Sports', 'Cultural Tours', 'Swahili Architecture'],
      specialFeatures: ['UNESCO Heritage Site', 'Private Beach'],
      availability: 'Available'
    },
    {
      id: 8,
      name: 'Sasaab Lodge',
      location: 'Samburu National Reserve',
      country: '🇰🇪 Kenya',
      rating: 4.9,
      reviews: 156,
      price: 1800,
      originalPrice: 2200,
      discount: 'Save $400',
      image: '🦒',
      type: 'Moroccan Suite',
      category: 'Ultra Luxury',
      amenities: ['Private Plunge Pool', 'Spa', 'Desert Views', 'Wildlife Encounters', 'Cultural Tours'],
      specialFeatures: ['Westgate Conservancy', 'Unique Wildlife'],
      availability: 'Available'
    },
    // Tanzania - Serengeti & Safari Masterpieces
    {
      id: 9,
      name: 'Four Seasons Safari Lodge',
      location: 'Serengeti National Park',
      country: '🇹🇿 Tanzania',
      rating: 4.9,
      reviews: 456,
      price: 1200,
      originalPrice: 1500,
      discount: 'Save $300',
      image: '🦁',
      type: 'Safari Suite',
      category: 'Ultra Luxury',
      amenities: ['Waterhole Views', 'Infinity Pool', 'Spa', 'Kids Club', 'Butler Service'],
      specialFeatures: ['Waterhole Views', 'Migration Route'],
      availability: 'Available'
    },
    {
      id: 10,
      name: 'Ngorongoro Serena Safari Lodge',
      location: 'Ngorongoro Crater',
      country: '🇹🇿 Tanzania',
      rating: 4.7,
      reviews: 289,
      price: 800,
      originalPrice: 1000,
      discount: 'Save $200',
      image: '🌋',
      type: 'Crater View Room',
      category: 'Luxury Lodge',
      amenities: ['Crater Views', 'Heated Rooms', 'Restaurant', 'Bar', 'Early Game Drives'],
      specialFeatures: ['Crater Rim Location', 'Maasai Design'],
      availability: 'Available'
    },
    {
      id: 11,
      name: 'Park Hyatt Zanzibar',
      location: 'Stone Town, Zanzibar',
      country: '🇹🇿 Tanzania',
      rating: 4.8,
      reviews: 567,
      price: 500,
      originalPrice: 650,
      discount: 'Save $150',
      image: '🏝️',
      type: 'Ocean Suite',
      category: 'Luxury Beach Resort',
      amenities: ['Anantara Spa', 'Private Beach', 'Heritage Location', 'Pool', 'Water Sports'],
      specialFeatures: ['UNESCO Heritage Site', 'Anantara Spa'],
      availability: 'Available'
    },
    {
      id: 12,
      name: 'The Residence Zanzibar',
      location: 'Zanzibar Beaches',
      country: '🇹🇿 Tanzania',
      rating: 4.9,
      reviews: 234,
      price: 800,
      originalPrice: 1000,
      discount: 'Save $200',
      image: '🏖️',
      type: 'Beach Villa',
      category: 'Ultra Luxury Beach',
      amenities: ['Private Beach', 'Spa', 'Water Sports', 'Fine Dining', 'Butler Service'],
      specialFeatures: ['Beachfront Luxury', 'Personalized Service'],
      availability: 'Available'
    },
    // Rwanda - Gorilla Trekking Excellence & Lake Retreats
    {
      id: 13,
      name: "One & Only Gorilla's Nest",
      location: 'Volcanoes National Park',
      country: '🇷🇼 Rwanda',
      rating: 5.0,
      reviews: 98,
      price: 2100,
      originalPrice: 2400,
      discount: 'Save $300',
      image: '🦍',
      type: 'Forest Villa',
      category: 'Ultra Luxury',
      amenities: ['Infinity Pool', 'Spa', 'Butler Service', 'Organic Garden', 'Forest Views'],
      specialFeatures: ['Gorilla Trekking', 'Infinity Pool'],
      availability: 'Available'
    },
    {
      id: 14,
      name: 'Wilderness Bisate Lodge',
      location: 'Volcanoes National Park',
      country: '🇷🇼 Rwanda',
      rating: 4.9,
      reviews: 134,
      price: 1600,
      originalPrice: 1900,
      discount: 'Save $300',
      image: '🌲',
      type: 'Forest Villa',
      category: 'Eco Luxury',
      amenities: ['Award-winning Design', 'Tree Nursery', 'Spa', 'Volcano Views', 'Conservation'],
      specialFeatures: ['Volcanic Amphitheater', 'Tree Nursery'],
      availability: 'Available'
    },
    {
      id: 15,
      name: 'Lake Kivu Serena Hotel',
      location: 'Lake Kivu',
      country: '🇷🇼 Rwanda',
      rating: 4.6,
      reviews: 245,
      price: 400,
      originalPrice: 500,
      discount: 'Save $100',
      image: '🌊',
      type: 'Lakefront Room',
      category: 'Resort',
      amenities: ['Private Beach', 'Swimming Pool', 'Water Sports', 'Spa', 'Lake Views'],
      specialFeatures: ['Lake Views', 'Private Beach'],
      availability: 'Available'
    },
    {
      id: 16,
      name: 'Mantis Kivu Queen uBuranga',
      location: 'Lake Kivu',
      country: '🇷🇼 Rwanda',
      rating: 4.8,
      reviews: 67,
      price: 800,
      originalPrice: 1000,
      discount: 'Save $200',
      image: '⛵',
      type: 'Luxury Cabin',
      category: 'Expedition Vessel',
      amenities: ['Lake Cruises', 'Spa', 'Fine Dining', 'Cultural Tours', 'Sunset Views'],
      specialFeatures: ['Luxury Vessel Experience', 'Lake Cruises'],
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
      description: 'We calculate and offset the environmental impact of each journey through a combination of renewable energy projects, reforestation efforts, and sustainable agriculture initiatives. Experience guilt-free travel while supporting climate action in East Africa.',
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
      title: 'Best Time to Visit East Africa',
      preview: 'Discover optimal seasons for wildlife migrations, gorilla trekking, and adventures across Uganda, Kenya, Tanzania, and Rwanda...',
      readTime: '7 min read',
      image: '📅',
      region: 'All Countries'
    },
    {
      title: 'Great Migration Guide',
      preview: "Follow the world's greatest wildlife spectacle from Serengeti to Maasai Mara and plan your perfect migration safari...",
      readTime: '10 min read',
      image: '🦁',
      region: 'Kenya & Tanzania'
    },
    {
      title: 'Gorilla Trekking Guide',
      preview: 'Complete guide to mountain gorilla encounters in Bwindi and Volcanoes National Parks...',
      readTime: '8 min read',
      image: '🦍',
      region: 'Uganda & Rwanda'
    },
    {
      title: 'Cultural Etiquette in East Africa',
      preview: 'Respectful travel tips for meaningful cultural exchanges across diverse East African communities...',
      readTime: '6 min read',
      image: '🤝',
      region: 'All Countries'
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
    "name": "Shakes Travel",
    "description": "Sustainable Uganda adventures and eco-friendly accommodations in the Pearl of Africa",
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
        "name": "Gorilla Trekking Tours",
        "description": "Experience mountain gorillas in their natural habitat",
        "category": "Adventure Tourism"
      },
      {
        "@type": "Offer", 
        "name": "Safari Adventures",
        "description": "Wildlife viewing in Uganda's national parks",
        "category": "Wildlife Tourism"
      },
      {
        "@type": "Offer",
        "name": "Cultural Tours",
        "description": "Authentic cultural experiences with local communities",
        "category": "Cultural Tourism"
      },
      {
        "@type": "Offer",
        "name": "Eco-Friendly Accommodations",
        "description": "Sustainable lodging options across Uganda",
        "category": "Green Accommodations"
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
              Discover East Africa's Wonders
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
              Experience sustainable tourism that celebrates East Africa's breathtaking natural wonders - crafting immersive journeys that connect travelers deeply with the authentic spirit of the region while championing environmental conservation
            </p>
          </header>
          
          {/* Enhanced Search Form */}
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900 max-w-6xl mx-auto"
            role="search"
            aria-label="Search for Uganda travel experiences"
          >
            <form onSubmit={handleSubmit(onSearch)} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
              {/* Country Selection Tabs */}
              <div className="md:col-span-4 mb-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { key: 'uganda', label: '🇺🇬 Uganda', flag: '🇺🇬' },
                    { key: 'kenya', label: '🇰🇪 Kenya', flag: '🇰🇪' },
                    { key: 'tanzania', label: '🇹🇿 Tanzania', flag: '🇹🇿' },
                    { key: 'rwanda', label: '🇷🇼 Rwanda', flag: '🇷🇼' }
                  ].map((country) => (
                    <button
                      key={country.key}
                      type="button"
                      onClick={() => {
                        setActiveCountryTab(country.key as any);
                        register('country').onChange({ target: { value: country.key } });
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeCountryTab === country.key
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{
                        backgroundColor: activeCountryTab === country.key ? primaryColor : undefined
                      }}
                    >
                      {country.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 search-autocomplete">
                <label htmlFor="destination-search" className="block text-sm font-semibold mb-2 text-gray-700">
                  Where in East Africa?
                </label>
                <input
                  {...register('destination', { required: true })}
                  id="destination-search"
                  type="text"
                  placeholder="Search destinations, parks, activities..."
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
                        <span className="text-2xl" aria-hidden="true">{dest.image}</span>
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
              aria-label="Search for East Africa travel experiences"
            >
              🔍 Search East Africa Adventures
            </button>
          </div>
        </div>
      </section>

      {/* East Africa Destinations Showcase */}
      <section id="destinations" className="py-20 bg-gray-50" aria-labelledby="destinations-heading">
        <div className="content-section">
          <header className="text-center mb-16">
            <h2 id="destinations-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore East Africa's Treasures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From misty mountain gorillas to endless savannas, discover the diverse landscapes across Uganda, Kenya, Tanzania, and Rwanda
            </p>
          </header>
          
          {/* Country Navigation for Destinations */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-md">
              {[ 
                { key: 'uganda', label: '🇺🇬 Uganda' },
                { key: 'kenya', label: '🇰🇪 Kenya' },
                { key: 'tanzania', label: '🇹🇿 Tanzania' },
                { key: 'rwanda', label: '🇷🇼 Rwanda' }
              ].map((country) => (
                <button
                  key={country.key}
                  onClick={() => setActiveCountryTab(country.key as any)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all mx-1 ${activeCountryTab === country.key
                      ? 'text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  style={{
                    backgroundColor: activeCountryTab === country.key ? primaryColor : undefined
                  }}
                >
                  {country.label}
                </button>
              ))}
            </div>
          </div>
          
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
                                {/* Uganda destinations with existing images */}
                                {destination.name === 'Kampala' ? (
                                  <img 
                                    src="/brand_assets/images/destinations/Kampala/Kampala Edited.jpg"
                                    alt={`${destination.name} destination`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : destination.name === 'Bwindi Impenetrable Forest' ? (
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
                                ) : destination.name === 'Murchison Falls' ? (
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
                                destination.name === 'Maasai Mara' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center">
                                    <span className="text-4xl">🦁</span>
                                  </div>
                                ) : destination.name === 'Amboseli National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-blue-200 flex items-center justify-center">
                                    <span className="text-4xl">🐘</span>
                                  </div>
                                ) : destination.name === 'Lake Nakuru' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
                                    <span className="text-4xl">🦩</span>
                                  </div>
                                ) : destination.name === 'Samburu National Reserve' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-red-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🦓</span>
                                  </div>
                                ) : destination.name === 'Diani Beach' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center">
                                    <span className="text-4xl">🏖️</span>
                                  </div>
                                ) : 
                                /* Tanzania destinations */
                                destination.name === 'Serengeti National Park' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-yellow-200 flex items-center justify-center">
                                    <span className="text-4xl">🦁</span>
                                  </div>
                                ) : destination.name === 'Ngorongoro Crater' ? (
                                  <div className="w-full h-full bg-gradient-to-br from-brown-100 to-green-200 flex items-center justify-center">
                                    <span className="text-4xl">🌋</span>
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
                                    <span className="text-4xl">🏝️</span>
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
                Top East Africa Experiences
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked adventures across Uganda, Kenya, Tanzania & Rwanda
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
                Discover premium accommodations across Uganda, Kenya, Tanzania & Rwanda's most stunning destinations
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
                Expert tips and guides for your perfect East Africa adventure
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
            Ready for Your East Africa Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join us in redefining adventure as a force for good - where travelers, hosts, and ecosystems thrive together through responsible, restorative travel
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