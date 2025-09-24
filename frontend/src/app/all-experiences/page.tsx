'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Experience {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  highlights: string[];
  availability: string;
  groupSize: string;
  ecoFriendly: boolean;
  region: string;
  price: number;
  originalPrice?: number;
}

interface Filters {
  category: string;
  region: string;
  duration: string;
  difficulty: string;
  ecoFriendly: boolean;
  searchQuery: string;
}

const AllExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  const [filters, setFilters] = useState<Filters>({
    category: 'all',
    region: 'all',
    duration: 'all',
    difficulty: 'all',
    ecoFriendly: false,
    searchQuery: ''
  });

  const primaryColor = '#195e48';

  // Sample experiences data (in real app, this would come from API)
  const allExperiences: Experience[] = [
    {
      id: 1,
      title: 'Gorilla Trekking in Bwindi',
      location: 'Bwindi Impenetrable Forest',
      category: 'Wildlife Safari',
      duration: '1 Day',
      difficulty: 'Moderate',
      rating: 4.9,
      reviews: 234,
      price: 800,
      originalPrice: 950,
      image: '🦍',
      description: 'Experience the magic of encountering mountain gorillas in their natural habitat',
      highlights: ['Expert Guide', 'Permit Included', 'Small Groups', 'Photo Opportunities'],
      availability: 'Daily departures',
      groupSize: '2-8 people',
      ecoFriendly: true,
      region: 'Southwestern Uganda'
    },
    {
      id: 2,
      title: 'White Water Rafting Adventure',
      location: 'Jinja, River Nile',
      category: 'Water Sports',
      duration: '4 Hours',
      difficulty: 'Challenging',
      rating: 4.7,
      reviews: 187,
      price: 120,
      originalPrice: 150,
      image: '🚣‍♂️',
      description: 'Navigate the legendary rapids of the River Nile with expert guides',
      highlights: ['Grade 5 Rapids', 'Safety Equipment', 'Lunch Included', 'Transport'],
      availability: 'Daily 9AM & 2PM',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 3,
      title: 'Safari in Queen Elizabeth Park',
      location: 'Queen Elizabeth National Park',
      category: 'Wildlife Safari',
      duration: '3 Days',
      difficulty: 'Easy',
      rating: 4.8,
      reviews: 312,
      price: 350,
      originalPrice: 420,
      image: '🦁',
      description: 'Discover diverse wildlife in Uganda\'s most visited national park',
      highlights: ['Game Drives', 'Boat Safari', '3-Star Lodge', 'All Meals'],
      availability: 'Mon, Wed, Fri',
      groupSize: '2-15 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 4,
      title: 'Cultural Village Experience',
      location: 'Batwa Community',
      category: 'Cultural Tour',
      duration: '2 Hours',
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 89,
      price: 75,
      originalPrice: 90,
      image: '🏘️',
      description: 'Learn traditional customs and crafts from the indigenous Batwa people',
      highlights: ['Cultural Immersion', 'Traditional Crafts', 'Local Guide', 'Photo Friendly'],
      availability: 'Daily 10AM & 3PM',
      groupSize: '5-20 people',
      ecoFriendly: true,
      region: 'Southwestern Uganda'
    },
    {
      id: 5,
      title: 'Sipi Falls Hiking Adventure',
      location: 'Mount Elgon',
      category: 'Hiking & Trekking',
      duration: '6 Hours',
      difficulty: 'Moderate',
      rating: 4.5,
      reviews: 156,
      price: 95,
      originalPrice: 120,
      image: '🏔️',
      description: 'Trek through coffee plantations to three spectacular waterfalls',
      highlights: ['3 Waterfalls', 'Coffee Tour', 'Scenic Views', 'Local Lunch'],
      availability: 'Daily 8AM',
      groupSize: '2-10 people',
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 6,
      title: 'Murchison Falls Boat Safari',
      location: 'Murchison Falls',
      category: 'Wildlife Safari',
      duration: '3 Hours',
      difficulty: 'Easy',
      rating: 4.7,
      reviews: 203,
      price: 85,
      originalPrice: 100,
      image: '🚢',
      description: 'Cruise along the Nile to witness the powerful Murchison Falls',
      highlights: ['Nile Cruise', 'Wildlife Viewing', 'Photography', 'Refreshments'],
      availability: 'Daily 9AM & 2PM',
      groupSize: '8-25 people',
      ecoFriendly: true,
      region: 'Northern Uganda'
    },
    {
      id: 7,
      title: 'Chimpanzee Trekking Kibale',
      location: 'Kibale National Park',
      category: 'Wildlife Safari',
      duration: 'Half Day',
      difficulty: 'Moderate',
      rating: 4.8,
      reviews: 145,
      price: 200,
      image: '🐒',
      description: 'Track our closest relatives through the lush forests of Kibale',
      highlights: ['Expert Tracker', 'Forest Walk', 'Primate Education', 'Photo Opportunities'],
      availability: 'Daily 8AM & 2PM',
      groupSize: '2-8 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 8,
      title: 'Lake Bunyonyi Island Hopping',
      location: 'Lake Bunyonyi',
      category: 'Water Sports',
      duration: 'Full Day',
      difficulty: 'Easy',
      rating: 4.4,
      reviews: 98,
      price: 65,
      image: '🏔️',
      description: 'Explore the beautiful islands of Africa\'s deepest lake',
      highlights: ['Canoe Rides', 'Island Villages', 'Bird Watching', 'Swimming'],
      availability: 'Daily 9AM',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Southwestern Uganda'
    },
    {
      id: 9,
      title: 'Kampala City Cultural Tour',
      location: 'Kampala',
      category: 'Cultural Tour',
      duration: '4 Hours',
      difficulty: 'Easy',
      rating: 4.3,
      reviews: 176,
      price: 45,
      image: '🏙️',
      description: 'Discover Uganda\'s vibrant capital through local markets and historical sites',
      highlights: ['Local Markets', 'Historical Sites', 'Street Food', 'Local Guide'],
      availability: 'Daily 10AM & 2PM',
      groupSize: '6-15 people',
      ecoFriendly: false,
      region: 'Central Uganda'
    },
    {
      id: 10,
      title: 'Rwenzori Mountains Expedition',
      location: 'Rwenzori Mountains',
      category: 'Hiking & Trekking',
      duration: '7 Days',
      difficulty: 'Challenging',
      rating: 4.9,
      reviews: 67,
      price: 1200,
      image: '⛰️',
      description: 'Summit the legendary Mountains of the Moon with experienced guides',
      highlights: ['Multi-Day Trek', 'Mountain Huts', 'Alpine Scenery', 'Summit Attempt'],
      availability: 'Weekly departures',
      groupSize: '2-6 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 11,
      title: 'Kidepo Valley Safari',
      location: 'Kidepo Valley National Park',
      category: 'Wildlife Safari',
      duration: '2 Days',
      difficulty: 'Easy',
      rating: 4.7,
      reviews: 89,
      price: 450,
      image: '🦓',
      description: 'Experience Uganda\'s most remote and pristine wilderness',
      highlights: ['Remote Location', 'Unique Wildlife', 'Cultural Encounters', 'Stargazing'],
      availability: 'Sat & Sun',
      groupSize: '2-12 people',
      ecoFriendly: true,
      region: 'Northern Uganda'
    },
    {
      id: 12,
      title: 'Fort Portal Crater Lakes Tour',
      location: 'Fort Portal',
      category: 'Hiking & Trekking',
      duration: 'Half Day',
      difficulty: 'Easy',
      rating: 4.5,
      reviews: 134,
      price: 55,
      image: '🌿',
      description: 'Explore the mystical crater lakes and tea plantations',
      highlights: ['Crater Lakes', 'Tea Plantations', 'Scenic Drives', 'Local Communities'],
      availability: 'Daily 9AM & 2PM',
      groupSize: '4-15 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 13,
      title: 'Mountain Biking Trails',
      location: 'Jinja & Sipi Falls',
      category: 'Mountain Biking',
      duration: 'Full Day',
      difficulty: 'Moderate',
      rating: 4.6,
      reviews: 98,
      price: 85,
      image: '🚴‍♂️',
      description: 'Navigate thrilling mountain bike trails through diverse landscapes',
      highlights: ['Trail Riding', 'Equipment Provided', 'Scenic Routes', 'Safety Briefing'],
      availability: 'Daily 8AM',
      groupSize: '4-10 people',
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 14,
      title: 'Rock Climbing Adventure',
      location: 'Mount Elgon',
      category: 'Rock Climbing',
      duration: '6 Hours',
      difficulty: 'Challenging',
      rating: 4.7,
      reviews: 76,
      price: 120,
      image: '🧗‍♂️',
      description: 'Scale dramatic rock faces with expert climbing guides',
      highlights: ['Professional Gear', 'Expert Guides', 'Multi-Pitch Routes', 'Safety First'],
      availability: 'Tue, Thu, Sat',
      groupSize: '2-6 people',
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 15,
      title: 'Bungee Jumping Experience',
      location: 'Jinja, River Nile',
      category: 'Extreme Sports',
      duration: '2 Hours',
      difficulty: 'Challenging',
      rating: 4.8,
      reviews: 156,
      price: 90,
      image: '🪂',
      description: 'Take the ultimate leap over the source of the River Nile',
      highlights: ['44m Jump', 'Safety Certified', 'Photo Package', 'Certificate'],
      availability: 'Daily 10AM-4PM',
      groupSize: '1-2 people',
      ecoFriendly: false,
      region: 'Eastern Uganda'
    },
    {
      id: 16,
      title: 'Zip-lining Forest Adventure',
      location: 'Mabira Forest',
      category: 'Canopy Tours',
      duration: '3 Hours',
      difficulty: 'Easy',
      rating: 4.4,
      reviews: 203,
      price: 65,
      image: '🌲',
      description: 'Soar through the treetops on exciting zip-line courses',
      highlights: ['Multiple Lines', 'Forest Views', 'Safety Equipment', 'Nature Walk'],
      availability: 'Daily 9AM & 2PM',
      groupSize: '6-15 people',
      ecoFriendly: true,
      region: 'Central Uganda'
    },
    {
      id: 17,
      title: 'Horseback Safari Experience',
      location: 'Lake Mburo National Park',
      category: 'Horseback Riding',
      duration: '4 Hours',
      difficulty: 'Moderate',
      rating: 4.5,
      reviews: 87,
      price: 110,
      image: '🐎',
      description: 'Explore the savanna on horseback alongside zebras and antelopes',
      highlights: ['Trained Horses', 'Wildlife Viewing', 'Professional Guide', 'Lunch Included'],
      availability: 'Daily 7AM & 3PM',
      groupSize: '3-8 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 18,
      title: 'Hot Air Balloon Safari',
      location: 'Murchison Falls',
      category: 'Aerial Adventures',
      duration: '3 Hours',
      difficulty: 'Easy',
      rating: 4.9,
      reviews: 45,
      price: 450,
      originalPrice: 520,
      image: '🎈',
      description: 'Float over the African wilderness at sunrise',
      highlights: ['Sunrise Flight', 'Champagne Breakfast', 'Wildlife From Above', 'Photo Opportunities'],
      availability: 'Daily 5:30AM',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Northern Uganda'
    },
    {
      id: 19,
      title: 'Caving Exploration',
      location: 'Nyero Rock Paintings',
      category: 'Speleology',
      duration: '4 Hours',
      difficulty: 'Moderate',
      rating: 4.3,
      reviews: 112,
      price: 75,
      image: '🕳️',
      description: 'Discover underground wonders and ancient rock art',
      highlights: ['Cave Systems', 'Rock Paintings', 'Headlamps Provided', 'Historical Insights'],
      availability: 'Wed, Fri, Sun',
      groupSize: '4-10 people',
      ecoFriendly: true,
      region: 'Eastern Uganda'
    },
    {
      id: 20,
      title: 'Paragliding Adventure',
      location: 'Rwenzori Mountains',
      category: 'Aerial Adventures',
      duration: '2 Hours',
      difficulty: 'Challenging',
      rating: 4.7,
      reviews: 63,
      price: 180,
      image: '🪂',
      description: 'Soar over the Mountains of the Moon with certified instructors',
      highlights: ['Tandem Flight', 'Mountain Views', 'Safety Briefing', 'HD Video Recording'],
      availability: 'Daily 10AM & 2PM',
      groupSize: '1-4 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 21,
      title: 'Quad Biking Safari',
      location: 'Lake Mburo National Park',
      category: 'Motor Sports',
      duration: '3 Hours',
      difficulty: 'Moderate',
      rating: 4.4,
      reviews: 94,
      price: 95,
      image: '🏍️',
      description: 'Navigate rugged terrain on powerful quad bikes',
      highlights: ['All-Terrain Vehicles', 'Safety Gear', 'Wildlife Spotting', 'Training Provided'],
      availability: 'Daily 8AM & 3PM',
      groupSize: '2-8 people',
      ecoFriendly: false,
      region: 'Western Uganda'
    },
    {
      id: 22,
      title: 'Stand-Up Paddleboarding',
      location: 'Lake Victoria',
      category: 'Water Sports',
      duration: '2 Hours',
      difficulty: 'Easy',
      rating: 4.2,
      reviews: 78,
      price: 45,
      image: '🏄‍♂️',
      description: 'Glide across calm waters while enjoying lake views',
      highlights: ['Equipment Included', 'Beginner Friendly', 'Scenic Views', 'Swimming Break'],
      availability: 'Daily 9AM & 4PM',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Central Uganda'
    },
    {
      id: 23,
      title: 'Photography Safari',
      location: 'Queen Elizabeth National Park',
      category: 'Photography',
      duration: '2 Days',
      difficulty: 'Easy',
      rating: 4.6,
      reviews: 67,
      price: 280,
      image: '📷',
      description: 'Capture stunning wildlife and landscapes with expert guidance',
      highlights: ['Professional Tips', 'Prime Locations', 'All Game Drives', 'Portfolio Review'],
      availability: 'Weekends',
      groupSize: '4-8 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    },
    {
      id: 24,
      title: 'Night Game Drive',
      location: 'Lake Mburo National Park',
      category: 'Night Safari',
      duration: '3 Hours',
      difficulty: 'Easy',
      rating: 4.5,
      reviews: 89,
      price: 85,
      image: '🌙',
      description: 'Discover nocturnal wildlife with specialized night vision equipment',
      highlights: ['Spotlights Provided', 'Nocturnal Animals', 'Expert Guide', 'Refreshments'],
      availability: 'Daily 7PM',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Western Uganda'
    }
  ];

  const heroImages = [
    { title: 'Gorilla Encounters', subtitle: 'Meet mountain gorillas in Bwindi Forest', image: '🦍' },
    { title: 'Adventure Rapids', subtitle: 'Conquer the legendary Nile waters', image: '🚣‍♂️' },
    { title: 'Wildlife Safaris', subtitle: 'Discover Uganda\'s incredible animals', image: '🦁' },
    { title: 'Mountain Adventures', subtitle: 'Scale Uganda\'s majestic peaks', image: '🏔️' },
    { title: 'Cultural Journeys', subtitle: 'Connect with local communities', image: '🏘️' },
    { title: 'Extreme Sports', subtitle: 'Push your limits with adrenaline rushes', image: '🪂' },
    { title: 'Aerial Views', subtitle: 'See Uganda from above in stunning flights', image: '🎈' },
    { title: 'Water Adventures', subtitle: 'Explore Uganda\'s pristine waterways', image: '🏄‍♂️' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories', count: 24 },
    { value: 'Wildlife Safari', label: 'Wildlife Safari', count: 5 },
    { value: 'Hiking & Trekking', label: 'Hiking & Trekking', count: 3 },
    { value: 'Water Sports', label: 'Water Sports', count: 3 },
    { value: 'Cultural Tour', label: 'Cultural Tours', count: 2 },
    { value: 'Mountain Biking', label: 'Mountain Biking', count: 1 },
    { value: 'Rock Climbing', label: 'Rock Climbing', count: 1 },
    { value: 'Extreme Sports', label: 'Extreme Sports', count: 1 },
    { value: 'Canopy Tours', label: 'Canopy Tours', count: 1 },
    { value: 'Horseback Riding', label: 'Horseback Riding', count: 1 },
    { value: 'Aerial Adventures', label: 'Aerial Adventures', count: 2 },
    { value: 'Speleology', label: 'Caving', count: 1 },
    { value: 'Motor Sports', label: 'Motor Sports', count: 1 },
    { value: 'Photography', label: 'Photography', count: 1 },
    { value: 'Night Safari', label: 'Night Safari', count: 1 }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Central Uganda', label: 'Central Uganda' },
    { value: 'Eastern Uganda', label: 'Eastern Uganda' },
    { value: 'Western Uganda', label: 'Western Uganda' },
    { value: 'Southwestern Uganda', label: 'Southwestern Uganda' },
    { value: 'Northern Uganda', label: 'Northern Uganda' }
  ];

  const durations = [
    { value: 'all', label: 'Any Duration' },
    { value: 'Half Day', label: 'Half Day (≤4 hours)' },
    { value: 'Full Day', label: 'Full Day (4-8 hours)' },
    { value: 'Multi-Day', label: 'Multi-Day (2+ days)' }
  ];

  const difficulties = [
    { value: 'all', label: 'Any Level' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Moderate', label: 'Moderate' },
    { value: 'Challenging', label: 'Challenging' }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Load experiences (in real app, this would be an API call)
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setExperiences(allExperiences);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = experiences.filter(exp => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        if (!exp.title.toLowerCase().includes(query) && 
            !exp.location.toLowerCase().includes(query) &&
            !exp.description.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && exp.category !== filters.category) {
        return false;
      }

      // Region filter
      if (filters.region !== 'all' && exp.region !== filters.region) {
        return false;
      }

      // Price filter
      if (filters.priceMin && exp.price < parseInt(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && exp.price > parseInt(filters.priceMax)) {
        return false;
      }

      // Duration filter
      if (filters.duration !== 'all') {
        if (filters.duration === 'Half Day' && !exp.duration.toLowerCase().includes('hour') && exp.duration !== 'Half Day') {
          return false;
        }
        if (filters.duration === 'Full Day' && exp.duration !== 'Full Day' && !exp.duration.toLowerCase().includes('day') && exp.duration.toLowerCase().includes('hours')) {
          return false;
        }
        if (filters.duration === 'Multi-Day' && !exp.duration.toLowerCase().includes('days') && exp.duration !== '7 Days') {
          return false;
        }
      }

      // Difficulty filter
      if (filters.difficulty !== 'all' && exp.difficulty !== filters.difficulty) {
        return false;
      }

      // Eco-friendly filter
      if (filters.ecoFriendly && !exp.ecoFriendly) {
        return false;
      }

      return true;
    });

    // Sort experiences
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration.localeCompare(b.duration));
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    return filtered;
  }, [experiences, filters, sortBy]);

  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      region: 'all',
      priceMin: '',
      priceMax: '',
      duration: 'all',
      difficulty: 'all',
      ecoFriendly: false,
      searchQuery: ''
    });
  };

  const hasActiveFilters = () => {
    return filters.category !== 'all' || 
           filters.region !== 'all' || 
           filters.priceMin || 
           filters.priceMax || 
           filters.duration !== 'all' || 
           filters.difficulty !== 'all' || 
           filters.ecoFriendly || 
           filters.searchQuery;
  };

  // Category carousel navigation
  const nextCategories = () => {
    const maxIndex = Math.max(0, categories.length - 6); // Show 6 categories at a time
    setCurrentCategoryIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevCategories = () => {
    setCurrentCategoryIndex(prev => Math.max(prev - 1, 0));
  };

  const getVisibleCategories = () => {
    return categories.slice(currentCategoryIndex, currentCategoryIndex + 6);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        {/* Background with rotating images */}
        <div 
          className="absolute inset-0 hero-carousel transition-all duration-1000"
          style={{ 
            background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%)`
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
        
        <div className="relative z-10 text-center w-full content-section">
          <div className="mb-8">
            <div className="text-8xl mb-4" aria-hidden="true">
              {heroImages[currentHeroImage].image}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              All Adventure Experiences
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {heroImages[currentHeroImage].subtitle}
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{experiences.length}</div>
              <div className="text-sm opacity-90">Total Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{filteredExperiences.length}</div>
              <div className="text-sm opacity-90">Available Now</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length - 1}</div>
              <div className="text-sm opacity-90">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{regions.length - 1}</div>
              <div className="text-sm opacity-90">Regions</div>
            </div>
          </div>
        </div>
        
        {/* Hero Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${ index === currentHeroImage ? 'opacity-100' : 'bg-white opacity-50'}`}
              style={{ backgroundColor: index === currentHeroImage ? 'white' : undefined }}
              aria-label={`Go to hero image ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Category Carousel Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="content-section">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevCategories}
                disabled={currentCategoryIndex === 0}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous categories"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextCategories}
                disabled={currentCategoryIndex >= Math.max(0, categories.length - 6)}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next categories"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {getVisibleCategories().map((category) => (
              <button
                key={category.value}
                onClick={() => handleFilterChange('category', category.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-md ${ filters.category === category.value
                    ? 'border-[#195e48] bg-[#195e48] text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-2">
                  {category.value === 'Wildlife Safari' && '🦁'}
                  {category.value === 'Hiking & Trekking' && '🏔️'}
                  {category.value === 'Water Sports' && '🏄‍♂️'}
                  {category.value === 'Cultural Tour' && '🏘️'}
                  {category.value === 'Mountain Biking' && '🚴‍♂️'}
                  {category.value === 'Rock Climbing' && '🧗‍♂️'}
                  {category.value === 'Extreme Sports' && '🪂'}
                  {category.value === 'Canopy Tours' && '🌲'}
                  {category.value === 'Horseback Riding' && '🐎'}
                  {category.value === 'Aerial Adventures' && '🎈'}
                  {category.value === 'Speleology' && '🕳️'}
                  {category.value === 'Motor Sports' && '🏍️'}
                  {category.value === 'Photography' && '📷'}
                  {category.value === 'Night Safari' && '🌙'}
                  {category.value === 'all' && '🎯'}
                </div>
                <div className="font-semibold text-sm mb-1">{category.label}</div>
                {category.value !== 'all' && (
                  <div className="text-xs opacity-75">{category.count} experience{category.count !== 1 ? 's' : ''}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gray-50">
        <div className="content-section">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Discover Uganda Adventures
                </h2>
                <p className="text-gray-600">
                  {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''} found
                  {hasActiveFilters() && ' with current filters'}
                </p>
              </div>
              
              {/* Sort & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
                
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="md:hidden btn-primary text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  🔍 Filters {hasActiveFilters() && '•'}
                </button>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="text-sm font-medium transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label htmlFor="search" className="block text-sm font-semibold mb-2 text-gray-700">
                      Search Experiences
                    </label>
                    <input
                      type="text"
                      id="search"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      placeholder="Search by name, location..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-semibold mb-2 text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold mb-2 text-gray-700">
                      Region
                    </label>
                    <select
                      id="region"
                      value={filters.region}
                      onChange={(e) => handleFilterChange('region', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Price Range (USD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceMin}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                        style={{ focusRingColor: primaryColor }}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceMax}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                        style={{ focusRingColor: primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label htmlFor="duration" className="block text-sm font-semibold mb-2 text-gray-700">
                      Duration
                    </label>
                    <select
                      id="duration"
                      value={filters.duration}
                      onChange={(e) => handleFilterChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {durations.map(duration => (
                        <option key={duration.value} value={duration.value}>
                          {duration.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-semibold mb-2 text-gray-700">
                      Difficulty Level
                    </label>
                    <select
                      id="difficulty"
                      value={filters.difficulty}
                      onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {difficulties.map(difficulty => (
                        <option key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Eco-Friendly */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.ecoFriendly}
                        onChange={(e) => handleFilterChange('ecoFriendly', e.target.checked)}
                        className="mr-3 w-4 h-4"
                        style={{ accentColor: primaryColor }}
                      />
                      <span className="text-sm font-medium text-gray-700">🌱 Eco-Friendly Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:col-span-3">
              {/* Loading State */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-3"></div>
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Active Filters Display */}
                  {hasActiveFilters() && (
                    <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">Active filters:</span>
                        {filters.category !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Category: {filters.category}
                          </span>
                        )}
                        {filters.region !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Region: {filters.region}
                          </span>
                        )}
                        {(filters.priceMin || filters.priceMax) && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Price: ${filters.priceMin || '0'} - ${filters.priceMax || '∞'}
                          </span>
                        )}
                        {filters.duration !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Duration: {filters.duration}
                          </span>
                        )}
                        {filters.difficulty !== 'all' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            Difficulty: {filters.difficulty}
                          </span>
                        )}
                        {filters.ecoFriendly && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            🌱 Eco-Friendly
                          </span>
                        )}
                        {filters.searchQuery && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            Search: "{filters.searchQuery}"
                          </span>
                        )}
                      </div>
                      <button
                        onClick={clearFilters}
                        className="text-sm font-medium transition-colors"
                        style={{ color: primaryColor }}
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}

                  {/* Experiences Grid */}
                  {filteredExperiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredExperiences.map((experience) => (
                        <article 
                          key={experience.id} 
                          className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect"
                        >
                          <Link href={`/experiences/${experience.id}`}>
                            {/* Experience Image */}
                            <div 
                              className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                              style={{ backgroundColor: `${primaryColor}10` }}
                            >
                              <span aria-hidden="true">{experience.image}</span>
                              {experience.originalPrice && experience.originalPrice > experience.price && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                  Save ${experience.originalPrice - experience.price}
                                </div>
                              )}
                              {experience.ecoFriendly && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                  🌱 Eco
                                </div>
                              )}
                            </div>
                            
                            <div className="p-6">
                              {/* Category and Duration */}
                              <div className="flex justify-between items-center mb-3">
                                <span 
                                  className="px-3 py-1 text-xs font-semibold rounded-full"
                                  style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                                >
                                  {experience.category}
                                </span>
                                <span className="text-sm text-gray-500">{experience.duration}</span>
                              </div>
                              
                              {/* Title and Location */}
                              <h3 className="font-bold text-xl text-gray-900 mb-2">{experience.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
                              
                              {/* Description */}
                              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{experience.description}</p>
                              
                              {/* Highlights */}
                              <div className="mb-4">
                                <div className="flex flex-wrap gap-1">
                                  {experience.highlights.slice(0, 2).map((highlight, index) => (
                                    <span 
                                      key={index}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {highlight}
                                    </span>
                                  ))}
                                  {experience.highlights.length > 2 && (
                                    <span className="text-xs text-gray-400">
                                      +{experience.highlights.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Rating and Reviews */}
                              <div className="flex items-center mb-4">
                                <div className="flex items-center rating-stars">
                                  {'★'.repeat(Math.floor(experience.rating))}
                                </div>
                                <span className="text-sm text-gray-600 ml-2">
                                  {experience.rating} ({experience.reviews} reviews)
                                </span>
                              </div>
                              
                              {/* Difficulty and Group Size */}
                              <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                                <span>🏃‍♂️ {experience.difficulty}</span>
                                <span>👥 {experience.groupSize}</span>
                              </div>
                              
                              {/* Book Button */}
                              <div className="flex justify-end items-center">
                                <button
                                  className="btn-primary text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
                                  style={{ backgroundColor: primaryColor }}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `/experiences/${experience.id}`;
                                  }}
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </Link>
                        </article>
                      ))}
                    </div>
                  ) : (
                    /* No Results */
                    <div className="text-center py-12">
                      <div className="text-8xl mb-4">🔍</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">No experiences found</h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your filters or search terms to find more adventures.
                      </p>
                      <button
                        onClick={clearFilters}
                        className="btn-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Same filter content as desktop */}
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Search Experiences
                  </label>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                    placeholder="Search by name, location..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label} {cat.value !== 'all' && `(${cat.count})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other filters... (same as desktop) */}
                {/* Region */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Region
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                    style={{ focusRingColor: primaryColor }}
                  >
                    {regions.map(region => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    Price Range (USD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>
                </div>

                {/* Eco-Friendly */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.ecoFriendly}
                      onChange={(e) => handleFilterChange('ecoFriendly', e.target.checked)}
                      className="mr-3 w-4 h-4"
                      style={{ accentColor: primaryColor }}
                    />
                    <span className="text-sm font-medium text-gray-700">🌱 Eco-Friendly Only</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex gap-3">
                  {hasActiveFilters() && (
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 btn-primary text-white px-4 py-2 rounded-lg font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Show Results ({filteredExperiences.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExperiencesPage;
