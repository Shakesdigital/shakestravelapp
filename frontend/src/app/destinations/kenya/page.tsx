'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function KenyaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentStay, setCurrentStay] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);
  const stayRef = useRef<HTMLDivElement>(null);
  const insightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Touch event handlers for swipe gestures
  const handleTouchStart = useRef<{ x: number; y: number } | null>(null);
  
  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleTouchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent, type: 'experience' | 'stay' | 'insight') => {
    if (!handleTouchStart.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = handleTouchStart.current.x - touch.clientX;
    const deltaY = handleTouchStart.current.y - touch.clientY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe left - next
        if (type === 'experience') nextExperience();
        if (type === 'stay') nextStay();
        if (type === 'insight') nextInsight();
      } else {
        // Swipe right - previous
        if (type === 'experience') prevExperience();
        if (type === 'stay') prevStay();
        if (type === 'insight') prevInsight();
      }
    }
    
    handleTouchStart.current = null;
  };

  const destinations = [
    {
      id: 1,
      name: 'Mount Kenya National Park',
      image: '/images/destinations/mount-kenya.jpg',
      description: 'Africa\'s second-highest mountain (5,199m), UNESCO site, Big Five, 11 endemic plants, 250+ bird species.',
      location: 'Central Kenya',
      highlights: ['Africa\'s 2nd Highest Mountain', 'UNESCO World Heritage', '250+ Bird Species'],
      cta: 'Book Trek'
    },
    {
      id: 2,
      name: 'Nairobi National Park',
      image: '/images/destinations/nairobi-national-park.jpg',
      description: 'World\'s only wildlife park in a capital city, black rhino sanctuary, 400+ bird species, city skyline backdrop.',
      location: 'Nairobi',
      highlights: ['World\'s Only Capital City Park', 'Black Rhino Sanctuary', '400+ Bird Species'],
      cta: 'Book Safari'
    },
    {
      id: 3,
      name: 'Hell\'s Gate National Park',
      image: '/images/destinations/hells-gate.jpg',
      description: 'Dramatic gorges, geothermal features, buffalo herds, no major predators for walking safaris.',
      location: 'Great Rift Valley',
      highlights: ['Walking Safaris', 'Dramatic Gorges', 'Geothermal Features'],
      cta: 'Explore Now'
    },
    {
      id: 4,
      name: 'Diani Beach',
      image: '/images/destinations/diani-beach.jpg',
      description: '17km pristine white sand beach, coral reefs, colobus monkeys, voted Africa\'s best beach.',
      location: 'Kwale County',
      highlights: ['Africa\'s Best Beach', '17km White Sand', 'Coral Reefs'],
      cta: 'Book Stay'
    },
    {
      id: 5,
      name: 'Lamu Old Town',
      image: '/images/destinations/lamu.jpg',
      description: 'UNESCO site, 700-year-old Swahili settlement, car-free, 12km Shela beach.',
      location: 'Lamu Archipelago',
      highlights: ['700-year-old Settlement', 'Car-free Island', 'UNESCO World Heritage'],
      cta: 'Discover Culture'
    },
    {
      id: 6,
      name: 'Watamu Marine National Park',
      image: '/images/destinations/watamu.jpg',
      description: 'World-class coral reefs, sea turtle sanctuary, top diving sites.',
      location: 'Kilifi County',
      highlights: ['World-class Coral Reefs', 'Sea Turtle Sanctuary', 'Top Diving Sites'],
      cta: 'Book Dive'
    },
    {
      id: 7,
      name: 'Masai Mara National Reserve',
      image: '/images/destinations/masai-mara.jpg',
      description: 'Great Migration (July-October), Big Five, highest predator density, 450+ bird species.',
      location: 'Narok County',
      highlights: ['Great Migration', 'Highest Predator Density', '450+ Bird Species'],
      cta: 'Book Safari'
    },
    {
      id: 8,
      name: 'Lake Nakuru National Park',
      image: '/images/destinations/lake-nakuru.jpg',
      description: 'Rhino sanctuary, flamingo populations, 450+ bird species, soda lake.',
      location: 'Nakuru County',
      highlights: ['Rhino Sanctuary', 'Flamingo Populations', '450+ Bird Species'],
      cta: 'Explore Now'
    },
    {
      id: 9,
      name: 'Samburu National Reserve',
      image: '/images/destinations/samburu.jpg',
      description: 'Special Five (Grevy\'s zebra, reticulated giraffe, Somali ostrich, beisa oryx, gerenuk), Ewaso Nyiro River.',
      location: 'Samburu County',
      highlights: ['Special Five Species', 'Ewaso Nyiro River', 'Unique Wildlife'],
      cta: 'Book Safari'
    },
    {
      id: 10,
      name: 'Lake Turkana National Parks',
      image: '/images/destinations/lake-turkana.jpg',
      description: 'World\'s largest desert lake, UNESCO site, Koobi Fora fossil sites, "Cradle of Mankind." ',
      location: 'Northern Kenya',
      highlights: ['World\'s Largest Desert Lake', 'Cradle of Mankind', 'UNESCO World Heritage'],
      cta: 'Discover More'
    },
    {
      id: 11,
      name: 'Tsavo East/West National Parks',
      image: '/images/destinations/tsavo.jpg',
      description: 'Kenya\'s largest park system, red elephants, Mzima Springs with underwater hippo viewing.',
      location: 'Southeastern Kenya',
      highlights: ['Kenya\'s Largest Park System', 'Red Elephants', 'Underwater Hippo Viewing'],
      cta: 'Book Safari'
    },
    {
      id: 12,
      name: 'Amboseli National Park',
      image: '/images/destinations/amboseli.jpg',
      description: 'Spectacular Kilimanjaro views, large elephant herds, Masai culture.',
      location: 'Kajiado County',
      highlights: ['Kilimanjaro Views', 'Large Elephant Herds', 'Masai Culture'],
      cta: 'Book Now'
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Game Drives (Masai Mara)',
      duration: '3-4 days',
      price: '$450',
      rating: 4.9,
      image: '/images/experiences/masai-mara-migration.jpg',
      location: 'Masai Mara',
      description: 'Witness 1.3M wildebeest in the Great Migration (July-October).',
      cta: 'Book Safari'
    },
    {
      id: 2,
      title: 'Hot Air Balloon Safaris (Masai Mara)',
      duration: '1 day',
      price: '$480',
      rating: 4.9,
      image: '/images/experiences/hot-air-balloon.jpg',
      location: 'Masai Mara',
      description: 'Aerial views of wildlife spectacles.',
      cta: 'Book Now'
    },
    {
      id: 3,
      title: 'Diving/Snorkeling (Watamu)',
      duration: '1-2 days',
      price: '$120',
      rating: 4.8,
      image: '/images/experiences/watamu-diving.jpg',
      location: 'Watamu',
      description: 'Explore coral reefs, whale shark encounters.',
      cta: 'Book Dive'
    },
    {
      id: 4,
      title: 'Rock Climbing (Hell\'s Gate)',
      duration: '1 day',
      price: '$85',
      rating: 4.7,
      image: '/images/experiences/hells-gate-climbing.jpg',
      location: 'Hell\'s Gate',
      description: 'Climb dramatic gorges, safe for families.',
      cta: 'Explore Now'
    },
    {
      id: 5,
      title: 'Cultural Visits (Samburu)',
      duration: '2 days',
      price: '$180',
      rating: 4.6,
      image: '/images/experiences/samburu-culture.jpg',
      location: 'Samburu',
      description: 'Engage with Samburu communities, unique culture.',
      cta: 'Book Tour'
    },
    {
      id: 6,
      title: 'Elephant Viewing (Amboseli)',
      duration: '2-3 days',
      price: '$320',
      rating: 4.8,
      image: '/images/experiences/amboseli-elephants.jpg',
      location: 'Amboseli',
      description: 'Iconic photography with Kilimanjaro backdrop.',
      cta: 'Book Safari'
    }
  ];

  const stays = [
    {
      id: 1,
      name: 'Fairmont Mount Kenya Safari Club',
      type: 'Luxury',
      price: '$500-2,000/night',
      rating: 4.9,
      image: '/images/stays/fairmont-mount-kenya.jpg',
      location: 'Mount Kenya',
      amenities: ['Resort-style', 'Golf Course', 'Mountain Views', 'Luxury Service'],
      description: 'Resort-style, golf course, mountain views.',
      cta: 'Book Now'
    },
    {
      id: 2,
      name: 'Serena Mountain Lodge',
      type: 'Mid-Range',
      price: '$150-500/night',
      rating: 4.7,
      image: '/images/stays/serena-mountain-lodge.jpg',
      location: 'Mount Kenya',
      amenities: ['Treehouse-style', 'Cozy', 'Forest Setting', 'Wildlife Viewing'],
      description: 'Treehouse-style, cozy, forest setting.',
      cta: 'Book Now'
    },
    {
      id: 3,
      name: 'Naro Moru River Lodge',
      type: 'Budget',
      price: '$20-150/night',
      rating: 4.4,
      image: '/images/stays/naro-moru.jpg',
      location: 'Mount Kenya',
      amenities: ['Affordable', 'Near Trekking Routes', 'Mountain Base', 'Basic Comfort'],
      description: 'Affordable, near trekking routes.',
      cta: 'Book Now'
    },
    {
      id: 4,
      name: 'Mara Serena Safari Lodge',
      type: 'Luxury',
      price: '$500-2,000/night',
      rating: 4.8,
      image: '/images/stays/mara-serena.jpg',
      location: 'Masai Mara',
      amenities: ['Hilltop', 'Upscale', 'Migration Views', 'Premium Service'],
      description: 'Hilltop, upscale, migration views.',
      cta: 'Book Now'
    },
    {
      id: 5,
      name: 'Mara Eden Safari Camp',
      type: 'Mid-Range',
      price: '$150-500/night',
      rating: 4.6,
      image: '/images/stays/mara-eden.jpg',
      location: 'Masai Mara',
      amenities: ['Riverside', 'Eco-friendly', 'Wildlife Proximity', 'Tented Camp'],
      description: 'Riverside, eco-friendly, wildlife proximity.',
      cta: 'Book Now'
    },
    {
      id: 6,
      name: 'Mara Explorers Camp',
      type: 'Budget',
      price: '$20-150/night',
      rating: 4.3,
      image: '/images/stays/mara-explorers.jpg',
      location: 'Masai Mara',
      amenities: ['Budget Tents', 'Community-focused', 'Affordable', 'Local Experience'],
      description: 'Budget tents, community-focused.',
      cta: 'Book Now'
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Kenya Visa & Entry Requirements',
      category: 'Travel Tips',
      readTime: '4 min read',
      image: '/images/insights/kenya-visa.jpg',
      excerpt: 'e-Visa ($50); East Africa Tourist Visa ($100) covers Kenya, Uganda, Rwanda.'
    },
    {
      id: 2,
      title: 'Health & Vaccination Guide for Kenya',
      category: 'Health',
      readTime: '5 min read',
      image: '/images/insights/kenya-health.jpg',
      excerpt: 'Yellow fever vaccination required, malaria prophylaxis for lowlands.'
    },
    {
      id: 3,
      title: 'Great Migration Booking Guide',
      category: 'Wildlife',
      readTime: '6 min read',
      image: '/images/insights/migration-booking.jpg',
      excerpt: 'Migration season bookings require 6-12 months advance for prime lodges.'
    },
    {
      id: 4,
      title: 'Sustainable Safari Travel in Kenya',
      category: 'Sustainability',
      readTime: '5 min read',
      image: '/images/insights/sustainable-kenya.jpg',
      excerpt: 'Choose eco-lodges like Nairobi Tented Camp to support conservation.'
    },
    {
      id: 5,
      title: 'Kenya Safari Packing Essentials',
      category: 'Packing',
      readTime: '4 min read',
      image: '/images/insights/kenya-packing.jpg',
      excerpt: 'Binoculars, sunscreen, light layers for variable climates.'
    },
    {
      id: 6,
      title: 'Best Time to Visit Kenya',
      category: 'Planning',
      readTime: '3 min read',
      image: '/images/insights/kenya-seasons.jpg',
      excerpt: 'June-October, December-February for safaris; year-round for beaches.'
    }
  ];

  const faqs = [
    {
      question: 'When is the Great Migration?',
      answer: 'Peak river crossings occur July-September in Masai Mara. The dramatic wildebeest river crossings typically happen between July and September, though exact timing varies based on rainfall patterns. Over 1.3 million wildebeest cross from Tanzania\'s Serengeti into Kenya\'s Masai Mara during this period.'
    },
    {
      question: 'Is cycling in Hell\'s Gate safe?',
      answer: 'Yes, no major predators; guided tours recommended. Hell\'s Gate is one of the few Kenyan parks where you can safely cycle and walk among wildlife. The park has buffalo, zebras, and gazelles, but no large predators like lions or leopards, making it family-friendly.'
    },
    {
      question: 'How to book diving in Watamu?',
      answer: 'Book through resorts like Hemingways Watamu with dive centers. The best diving is from October to March when visibility is clearest. Popular sites include the Watamu Marine National Park coral gardens and offshore reefs where you can encounter whale sharks, manta rays, and sea turtles.'
    },
    {
      question: 'What\'s the best park for rhinos?',
      answer: 'Lake Nakuru for black and white rhino sightings. Lake Nakuru National Park is Kenya\'s premier rhino sanctuary, home to both black and white rhinoceros populations. The park\'s relatively small size (188 km²) makes rhino sightings almost guaranteed during game drives.'
    },
    {
      question: 'Are beaches family-friendly?',
      answer: 'Diani Beach offers calm waters and family resorts. The 17km stretch of white sand beach has calm, warm waters protected by coral reefs. Many family-friendly resorts offer kids\' clubs, shallow swimming areas, and water sports suitable for all ages.'
    },
    {
      question: 'What vaccinations do I need for Kenya?',
      answer: 'Yellow fever vaccination is required if arriving from yellow fever endemic areas. Recommended vaccinations include hepatitis A&B, typhoid, meningitis, and malaria prophylaxis for lowland areas. Consult your doctor 4-6 weeks before travel for personalized advice.'
    }
  ];

  const nextDestination = () => {
    setCurrentDestination((prev) => (prev + 1) % destinations.length);
  };

  const prevDestination = () => {
    setCurrentDestination((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const nextExperience = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, experiences.length - itemsToShow);
    setCurrentExperience((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevExperience = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, experiences.length - itemsToShow);
    setCurrentExperience((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  const nextStay = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, stays.length - itemsToShow);
    setCurrentStay((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevStay = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, stays.length - itemsToShow);
    setCurrentStay((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  const nextInsight = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, insights.length - itemsToShow);
    setCurrentInsight((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevInsight = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, insights.length - itemsToShow);
    setCurrentInsight((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": "Kenya - The Cradle of Safari",
            "description": "Explore Kenya safari adventures in Masai Mara migration, Diani Beach diving, and Mount Kenya trekking. Experience the Great Migration, world-class beaches, and vibrant Swahili coast culture.",
            "url": "https://shakestravelapp.com/destinations/kenya",
            "keywords": "Kenya safari, Masai Mara migration, Diani Beach diving, Mount Kenya trekking, Great Migration Kenya, Nairobi National Park, Hell's Gate climbing",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist", "Beach Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Kenya"
            },
            "hasMap": "https://www.google.com/maps/place/Kenya",
            "image": [
              "/images/destinations/masai-mara.jpg",
              "/images/destinations/diani-beach.jpg",
              "/images/destinations/mount-kenya.jpg"
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/kenya-migration-hero.jpg"
              alt="Wildebeest migration in Masai Mara with Kilimanjaro from Amboseli, Kenya"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Explore Kenya: The <span className="text-[#fec76f]">Cradle of Safari</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Witness the Great Migration, climb Mount Kenya, and relax on world-class beaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#destinations"
                className="bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Book Your Kenya Adventure Now
              </Link>
              <Link
                href="#experiences"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300"
              >
                Explore Destinations
              </Link>
            </div>
          </div>
        </section>

        {/* Tourist Travel and Adventure Destinations */}
        <section id="destinations" className="py-20 bg-gray-50">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Tourist Travel and Adventure Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From the Great Migration to pristine beaches, discover Kenya's most spectacular wildlife and adventure destinations
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentDestination * 100}%)` }}
                >
                  {destinations.map((destination) => (
                    <div key={destination.id} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="relative h-96 lg:h-[500px] rounded-xl overflow-hidden">
                          <Image
                            src={destination.image}
                            alt={destination.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-6">
                          <div className="flex items-center text-[#195e48] text-sm font-medium">
                            <MapPinIcon className="w-4 h-4 mr-2" />
                            {destination.location}
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900">
                            {destination.name}
                          </h3>
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {destination.description}
                          </p>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Key Highlights:</h4>
                            <div className="flex flex-wrap gap-2">
                              {destination.highlights.map((highlight, index) => (
                                <span
                                  key={index}
                                  className="bg-[#195e48] bg-opacity-10 text-[#195e48] px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300">
                            {destination.cta}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevDestination}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous destination"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextDestination}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next destination"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>

              <div className="flex justify-center mt-8 space-x-2">
                {destinations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentDestination(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${ index === currentDestination ? 'bg-[#195e48]' : 'bg-gray-300'}`}
                    aria-label={`Go to destination ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brief Introduction About Kenya */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Brief Introduction About Kenya
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    <strong>Overview:</strong> The cradle of safari, Kenya blends iconic wildlife, stunning mountains, and pristine beaches. From the legendary Great Migration to world-class diving and Africa's second-highest peak, Kenya offers the complete East African experience.
                  </p>
                  <p>
                    <strong>Key Highlights:</strong> Home to the Great Migration spectacle, spectacular Mount Kilimanjaro views from Amboseli, vibrant Swahili coast culture, and the world's only wildlife park within a capital city. Kenya pioneered the modern safari experience.
                  </p>
                  <p>
                    <strong>Best Time to Visit:</strong> June-October and December-February offer optimal safari conditions with the Great Migration peak. Kenya's beaches are enjoyable year-round with consistent tropical weather and calm Indian Ocean waters.
                  </p>
                  <p>
                    <strong>Quick Fact:</strong> Kenya is home to the world's only wildlife park within a capital city (Nairobi National Park) and hosts one of nature's greatest spectacles - the annual Great Migration of over 1.3 million wildebeest.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1.3M</div>
                    <div className="text-gray-600">Wildebeest Migration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,100+</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/kenya-landscape-overview.jpg"
                  alt="Kenya diverse landscapes from mountains to beaches"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Top Adventure Experiences */}
        <section id="experiences" className="py-12 md:py-20" style={{ backgroundColor: '#fafafa' }}>
          <div className="content-section">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Adventure Experiences
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Embark on legendary adventures that showcase Kenya's incredible wildlife spectacles and diverse landscapes
              </p>
            </div>

            <div className="relative">
              <div 
                ref={experienceRef}
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={(e) => onTouchEnd(e, 'experience')}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentExperience * (isMobile ? 100 : isTablet ? 50 : 100/3)}%)` 
                  }}
                >
                  {experiences.map((experience) => (
                    <div key={experience.id} className={`flex-shrink-0 px-2 md:px-3 ${ isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48 md:h-64">
                          <Image
                            src={experience.image}
                            alt={experience.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#195e48] text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                            {experience.duration}
                          </div>
                        </div>
                        <div className="p-4 md:p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <MapPinIcon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                              <span className="truncate">{experience.location}</span>
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="w-3 md:w-4 h-3 md:h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs md:text-sm font-medium">{experience.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                            {experience.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                            {experience.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-lg md:text-2xl font-bold text-[#195e48]">
                              {experience.price}
                            </div>
                            <button className="bg-[#195e48] hover:bg-[#164a3a] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-300">
                              {experience.cta}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevExperience}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous experiences"
              >
                <ChevronLeftIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>

              <button
                onClick={nextExperience}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next experiences"
              >
                <ChevronRightIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>
              
              {/* Dots indicator for mobile */}
              <div className="flex justify-center mt-6 space-x-2 md:hidden">
                {Array.from({ length: Math.max(1, experiences.length) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExperience(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${ index === currentExperience ? 'bg-[#195e48]' : 'bg-gray-300'}`}
                    aria-label={`Go to experience ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/experiences"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Kenya Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Stays */}
        <section className="py-12 md:py-20 bg-white">
          <div className="content-section">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Stays
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Stay in Kenya's finest lodges and camps, from luxury safari lodges to mountain retreats and beach resorts
              </p>
            </div>

            <div className="relative">
              <div 
                ref={stayRef}
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={(e) => onTouchEnd(e, 'stay')}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentStay * (isMobile ? 100 : isTablet ? 50 : 100/3)}%)` 
                  }}
                >
                  {stays.map((stay) => (
                    <div key={stay.id} className={`flex-shrink-0 px-2 md:px-3 ${ isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'}`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48 md:h-64">
                          <Image
                            src={stay.image}
                            alt={stay.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white bg-opacity-90 text-gray-900 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                            {stay.type}
                          </div>
                        </div>
                        <div className="p-4 md:p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <MapPinIcon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                              <span className="truncate">{stay.location}</span>
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="w-3 md:w-4 h-3 md:h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs md:text-sm font-medium">{stay.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                            {stay.name}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3 line-clamp-2">
                            {stay.description}
                          </p>
                          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                            <div className="flex flex-wrap gap-1">
                              {stay.amenities.slice(0, isMobile ? 1 : 2).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {stay.amenities.length > (isMobile ? 1 : 2) && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{stay.amenities.length - (isMobile ? 1 : 2)} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm md:text-lg font-bold text-[#195e48]">
                              {stay.price}
                            </div>
                            <button className="bg-[#195e48] hover:bg-[#164a3a] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-300">
                              {stay.cta}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevStay}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous stays"
              >
                <ChevronLeftIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>

              <button
                onClick={nextStay}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next stays"
              >
                <ChevronRightIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>
              
              {/* Dots indicator for mobile */}
              <div className="flex justify-center mt-6 space-x-2 md:hidden">
                {Array.from({ length: Math.max(1, stays.length) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStay(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${ index === currentStay ? 'bg-[#195e48]' : 'bg-gray-300'}`}
                    aria-label={`Go to stay ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/stays"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Kenya Stays
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Insights */}
        <section className="py-12 md:py-20" style={{ backgroundColor: '#f8fffe' }}>
          <div className="content-section">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Travel Insights
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Essential information to help you plan your perfect Kenya safari and beach adventure
              </p>
            </div>

            <div className="relative">
              <div 
                ref={insightRef}
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={(e) => onTouchEnd(e, 'insight')}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentInsight * (isMobile ? 100 : isTablet ? 50 : 100/3)}%)` 
                  }}
                >
                  {insights.map((insight) => (
                    <div key={insight.id} className={`flex-shrink-0 px-2 md:px-3 ${ isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'}`}>
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-40 md:h-48">
                          <Image
                            src={insight.image}
                            alt={insight.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-[#195e48] text-white px-2 md:px-3 py-1 rounded-full text-xs font-medium">
                            {insight.category}
                          </div>
                        </div>
                        <div className="p-4 md:p-6">
                          <div className="flex items-center text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                            <ClockIcon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                            {insight.readTime}
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                            {insight.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                            {insight.excerpt}
                          </p>
                          <button className="text-[#195e48] hover:text-[#164a3a] font-medium text-sm md:text-base transition-colors duration-300">
                            Read More →
                          </button>
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevInsight}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous insights"
              >
                <ChevronLeftIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>

              <button
                onClick={nextInsight}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next insights"
              >
                <ChevronRightIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>
              
              {/* Dots indicator for mobile */}
              <div className="flex justify-center mt-6 space-x-2 md:hidden">
                {Array.from({ length: Math.max(1, insights.length) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentInsight(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${ index === currentInsight ? 'bg-[#195e48]' : 'bg-gray-300'}`}
                    aria-label={`Go to insight ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/travel-guides"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Kenya Travel Guides
              </Link>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to the most common questions about traveling to Kenya
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#195e48] focus:ring-inset"
                      aria-expanded={expandedFAQ === index}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${ expandedFAQ === index ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${ expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
