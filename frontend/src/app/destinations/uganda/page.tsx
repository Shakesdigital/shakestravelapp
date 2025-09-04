'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function UgandaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAccommodation, setCurrentAccommodation] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const experienceRef = useRef<HTMLDivElement>(null);
  const accommodationRef = useRef<HTMLDivElement>(null);
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

  const onTouchEnd = (e: React.TouchEvent, type: 'experience' | 'accommodation' | 'insight') => {
    if (!handleTouchStart.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = handleTouchStart.current.x - touch.clientX;
    const deltaY = handleTouchStart.current.y - touch.clientY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe left - next
        if (type === 'experience') nextExperience();
        if (type === 'accommodation') nextAccommodation();
        if (type === 'insight') nextInsight();
      } else {
        // Swipe right - previous
        if (type === 'experience') prevExperience();
        if (type === 'accommodation') prevAccommodation();
        if (type === 'insight') prevInsight();
      }
    }
    
    handleTouchStart.current = null;
  };

  const destinations = [
    {
      id: 1,
      name: 'Bwindi Impenetrable National Park',
      image: '/images/destinations/bwindi.jpg',
      description: 'UNESCO World Heritage Site, home to over 500 mountain gorillas (half the world\'s population), 23 habituated gorilla families, ancient 25,000-year-old forest, 350+ bird species, 310 butterfly species.',
      location: 'Southwestern Uganda',
      highlights: ['500+ Mountain Gorillas', '23 Habituated Families', '350+ Bird Species'],
      cta: 'Book Now'
    },
    {
      id: 2,
      name: 'Queen Elizabeth National Park',
      image: '/images/destinations/queen-elizabeth.jpg',
      description: 'Tree-climbing lions in Ishasha sector, Kazinga Channel with the world\'s highest hippo concentration, 95+ mammal species, 600+ bird species, volcanic crater lakes.',
      location: 'Western Uganda',
      highlights: ['Tree-climbing Lions', 'Highest Hippo Concentration', '600+ Bird Species'],
      cta: 'Explore Safaris'
    },
    {
      id: 3,
      name: 'Murchison Falls National Park',
      image: '/images/destinations/murchison-falls.jpg',
      description: 'World\'s most powerful waterfall (Victoria Nile through 7m gorge), Uganda\'s largest park, 76+ mammal species, 451+ bird species.',
      location: 'Northwestern Uganda',
      highlights: ['World\'s Most Powerful Waterfall', 'Uganda\'s Largest Park', '451+ Bird Species'],
      cta: 'Book Safari'
    },
    {
      id: 4,
      name: 'Kidepo Valley National Park',
      image: '/images/destinations/kidepo.jpg',
      description: 'Most remote park, 475+ bird species, 77+ mammal species (cheetahs, ostriches), Karamojong cultural encounters.',
      location: 'Northeastern Uganda',
      highlights: ['Most Remote Park', 'Cheetahs & Ostriches', 'Karamojong Culture'],
      cta: 'Discover More'
    },
    {
      id: 5,
      name: 'Kibale Forest National Park',
      image: '/images/destinations/kibale.jpg',
      description: 'World\'s highest primate concentration (1,450 chimpanzees), 13 primate species, 375+ bird species, "Primate Capital."',
      location: 'Western Uganda',
      highlights: ['Primate Capital', '1,450 Chimpanzees', '13 Primate Species'],
      cta: 'Book Trek'
    },
    {
      id: 6,
      name: 'Rwenzori Mountains National Park',
      image: '/images/destinations/rwenzori.jpg',
      description: 'Africa\'s third-highest peak (Margherita Peak, 5,109m), equatorial snow, UNESCO site, unique alpine flora.',
      location: 'Western Uganda',
      highlights: ['Africa\'s 3rd Highest Peak', 'Equatorial Snow', 'UNESCO Site'],
      cta: 'Plan Trek'
    },
    {
      id: 7,
      name: 'Mount Elgon National Park',
      image: '/images/destinations/mount-elgon.jpg',
      description: '4,321m Wagagai peak, world\'s largest volcanic caldera, Sipi Falls, Kitum Cave.',
      location: 'Eastern Uganda',
      highlights: ['Largest Volcanic Caldera', 'Sipi Falls', 'Kitum Cave'],
      cta: 'Explore Now'
    },
    {
      id: 8,
      name: 'Lake Bunyonyi',
      image: '/images/destinations/lake-bunyonyi.jpg',
      description: 'Africa\'s second-deepest lake, 29 islands, bilharzia- and crocodile-free swimming, 200+ bird species.',
      location: 'Southwestern Uganda',
      highlights: ['29 Islands', 'Safe Swimming', '200+ Bird Species'],
      cta: 'Book Stay'
    },
    {
      id: 9,
      name: 'Lake Victoria (Ssese Islands)',
      image: '/images/destinations/ssese-islands.jpg',
      description: 'World\'s second-largest freshwater lake, 84 tropical islands, pristine beaches, fishing culture.',
      location: 'Central Uganda',
      highlights: ['84 Tropical Islands', 'Pristine Beaches', 'Fishing Culture'],
      cta: 'Discover Islands'
    },
    {
      id: 10,
      name: 'Source of the Nile (Jinja)',
      image: '/images/destinations/jinja.jpg',
      description: 'Beginning of the world\'s longest river, adventure sports hub.',
      location: 'Eastern Uganda',
      highlights: ['World\'s Longest River', 'Adventure Sports', 'Historical Significance'],
      cta: 'Book Adventure'
    },
    {
      id: 11,
      name: 'Sempaya Hot Springs (Semuliki)',
      image: '/images/destinations/sempaya-springs.jpg',
      description: '103°C boiling springs, 2m geysers, tropical lowland forest.',
      location: 'Western Uganda',
      highlights: ['103°C Boiling Springs', '2m Geysers', 'Tropical Forest'],
      cta: 'Visit Now'
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Gorilla Trekking (Bwindi)',
      duration: '1 day',
      price: '$800',
      rating: 4.9,
      image: '/images/experiences/gorilla-trekking.jpg',
      location: 'Bwindi Forest',
      description: '98% success rate, encounter habituated gorilla families in ancient forest.',
      cta: 'Book Permit'
    },
    {
      id: 2,
      title: 'Chimpanzee Tracking (Kibale)',
      duration: '1 day',
      price: '$250',
      rating: 4.8,
      image: '/images/experiences/chimpanzee-tracking.jpg',
      location: 'Kibale Forest',
      description: 'World\'s highest primate density, 98% encounter success.',
      cta: 'Book Trek'
    },
    {
      id: 3,
      title: 'White-Water Rafting (Jinja)',
      duration: '1 day',
      price: '$125',
      rating: 4.7,
      image: '/images/experiences/white-water-rafting.jpg',
      location: 'Source of the Nile',
      description: 'Thrilling rapids at the Source of the Nile.',
      cta: 'Book Adventure'
    },
    {
      id: 4,
      title: 'Game Drives (Queen Elizabeth)',
      duration: '2-3 days',
      price: '$350',
      rating: 4.8,
      image: '/images/experiences/queen-elizabeth-safari.jpg',
      location: 'Queen Elizabeth NP',
      description: 'See tree-climbing lions, Big Five, Kazinga Channel cruises.',
      cta: 'Book Safari'
    },
    {
      id: 5,
      title: 'Mountain Hiking (Rwenzori)',
      duration: '7-10 days',
      price: '$1,200',
      rating: 4.6,
      image: '/images/experiences/rwenzori-hiking.jpg',
      location: 'Rwenzori Mountains',
      description: 'Climb Africa\'s third-highest peak with equatorial glaciers.',
      cta: 'Plan Trek'
    },
    {
      id: 6,
      title: 'Cultural Visits (Kidepo)',
      duration: '2 days',
      price: '$200',
      rating: 4.5,
      image: '/images/experiences/karamojong-culture.jpg',
      location: 'Kidepo Valley',
      description: 'Meet Karamojong pastoralists for authentic cultural experiences.',
      cta: 'Explore Culture'
    }
  ];

  const accommodations = [
    {
      id: 1,
      name: 'Sanctuary Gorilla Forest Camp',
      type: 'Luxury',
      price: '$500-2,000/night',
      rating: 4.9,
      image: '/images/accommodations/sanctuary-gorilla-forest.jpg',
      location: 'Bwindi',
      amenities: ['Intimate Forest Setting', 'Eco-friendly', 'Premium Service', 'Gorilla Trekking'],
      description: 'Intimate forest setting, eco-friendly, premium service.',
      cta: 'Book Now'
    },
    {
      id: 2,
      name: 'Buhoma Lodge',
      type: 'Mid-Range',
      price: '$150-500/night',
      rating: 4.7,
      image: '/images/accommodations/buhoma-lodge.jpg',
      location: 'Bwindi',
      amenities: ['Close to Trekking Start', 'Stunning Views', 'Cozy Chalets', 'Restaurant'],
      description: 'Close to trekking start, stunning views, cozy chalets.',
      cta: 'Book Now'
    },
    {
      id: 3,
      name: 'Bwindi Guest House',
      type: 'Budget',
      price: '$20-150/night',
      rating: 4.4,
      image: '/images/accommodations/bwindi-guest-house.jpg',
      location: 'Bwindi',
      amenities: ['Community-run', 'Affordable', 'Near Park Entrance', 'Local Experience'],
      description: 'Community-run, affordable, near park entrance.',
      cta: 'Book Now'
    },
    {
      id: 4,
      name: 'Mweya Safari Lodge',
      type: 'Luxury',
      price: '$500-2,000/night',
      rating: 4.8,
      image: '/images/accommodations/mweya-safari-lodge.jpg',
      location: 'Queen Elizabeth NP',
      amenities: ['Kazinga Channel Views', 'Upscale', 'Pool', 'Game Drives'],
      description: 'Kazinga Channel views, upscale, pool.',
      cta: 'Book Now'
    },
    {
      id: 5,
      name: 'Ishasha Wilderness Camp',
      type: 'Mid-Range',
      price: '$150-500/night',
      rating: 4.6,
      image: '/images/accommodations/ishasha-wilderness.jpg',
      location: 'Queen Elizabeth NP',
      amenities: ['Riverside', 'Eco-friendly', 'Near Lions', 'Tented Camp'],
      description: 'Riverside, eco-friendly, near lions.',
      cta: 'Book Now'
    },
    {
      id: 6,
      name: 'Pumba Safari Cottages',
      type: 'Budget',
      price: '$20-150/night',
      rating: 4.3,
      image: '/images/accommodations/pumba-safari.jpg',
      location: 'Queen Elizabeth NP',
      amenities: ['Scenic', 'Community-focused', 'Affordable', 'Local Guides'],
      description: 'Scenic, community-focused, affordable.',
      cta: 'Book Now'
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Uganda Visa & Entry Requirements',
      category: 'Travel Tips',
      readTime: '4 min read',
      image: '/images/insights/uganda-visa.jpg',
      excerpt: 'e-Visa or visa on arrival ($50); East Africa Tourist Visa ($100) covers Uganda, Kenya, Rwanda.'
    },
    {
      id: 2,
      title: 'Health & Vaccination Guide for Uganda',
      category: 'Health',
      readTime: '5 min read',
      image: '/images/insights/uganda-health.jpg',
      excerpt: 'Yellow fever vaccination required, malaria prophylaxis recommended except high altitudes (>2,500m).'
    },
    {
      id: 3,
      title: 'Gorilla & Chimpanzee Permits Guide',
      category: 'Wildlife',
      readTime: '6 min read',
      image: '/images/insights/uganda-permits.jpg',
      excerpt: 'Gorilla permits ($800), book 6-12 months ahead; chimpanzee permits ($250).'
    },
    {
      id: 4,
      title: 'Sustainable Travel in Uganda',
      category: 'Sustainability',
      readTime: '5 min read',
      image: '/images/insights/sustainable-uganda.jpg',
      excerpt: 'Choose community lodges like Bwindi Guest House to support locals; practice Leave No Trace.'
    },
    {
      id: 5,
      title: 'Uganda Safari Packing Essentials',
      category: 'Packing',
      readTime: '4 min read',
      image: '/images/insights/uganda-packing.jpg',
      excerpt: 'Light hiking gear, insect repellent, binoculars for birding.'
    },
    {
      id: 6,
      title: 'Best Time to Visit Uganda',
      category: 'Planning',
      readTime: '3 min read',
      image: '/images/insights/uganda-seasons.jpg',
      excerpt: 'June-October, December-February (dry seasons for trekking and safaris).'
    }
  ];

  const faqs = [
    {
      question: 'How do I book gorilla permits?',
      answer: 'Permits cost $800, book 6-12 months ahead via Uganda Wildlife Authority or trusted operators. We recommend booking through reputable tour operators who can secure permits and coordinate your entire trip.'
    },
    {
      question: 'What is the best time for gorilla trekking?',
      answer: 'Dry seasons (June-October, December-February) offer easier hiking conditions with less mud and clearer forest paths. However, gorilla trekking is possible year-round as the gorillas don\'t migrate.'
    },
    {
      question: 'Is Uganda safe for solo travelers?',
      answer: 'Yes, Uganda is generally safe for solo travelers, especially when using reputable operators and staying in established accommodations. Always follow park guides\' instructions and inform others of your itinerary.'
    },
    {
      question: 'What should I pack for Uganda safaris?',
      answer: 'Pack neutral-colored clothing (khaki, brown, green), sturdy hiking boots, sunscreen, insect repellent, binoculars, camera with extra batteries, and a rain jacket. Avoid bright colors and camouflage patterns.'
    },
    {
      question: 'How to prepare for high-altitude treks in Rwenzori?',
      answer: 'Prepare with gradual acclimatization, stay well-hydrated, maintain physical fitness, and ensure you have comprehensive travel insurance with high-altitude evacuation coverage. Consider spending a few days at moderate altitude before the trek.'
    },
    {
      question: 'What vaccinations do I need for Uganda?',
      answer: 'Yellow fever vaccination is mandatory if arriving from yellow fever endemic areas. Recommended vaccinations include hepatitis A&B, typhoid, meningitis, and malaria prophylaxis (except for high altitudes above 2,500m).'
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

  const nextAccommodation = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, accommodations.length - itemsToShow);
    setCurrentAccommodation((prev) => (prev + 1) % (maxIndex + 1));
  };

  const prevAccommodation = () => {
    const itemsToShow = isMobile ? 1 : isTablet ? 2 : 3;
    const maxIndex = Math.max(0, accommodations.length - itemsToShow);
    setCurrentAccommodation((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1));
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
            "name": "Uganda - The Pearl of Africa",
            "description": "Discover Uganda gorilla trekking in Bwindi, Murchison Falls safari adventures, and Source of the Nile experiences. Home to 500+ mountain gorillas, world's most powerful waterfall, and diverse wildlife.",
            "url": "https://shakestravelapp.com/destinations/uganda",
            "keywords": "Uganda gorilla trekking, Murchison Falls safari, Source of the Nile adventure, Bwindi Impenetrable Forest, Queen Elizabeth National Park, Uganda wildlife safari",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Uganda"
            },
            "hasMap": "https://www.google.com/maps/place/Uganda",
            "image": [
              "/images/destinations/bwindi.jpg",
              "/images/destinations/murchison-falls.jpg",
              "/images/destinations/queen-elizabeth.jpg"
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/uganda-gorillas-hero.jpg"
              alt="Mountain gorillas in Bwindi Impenetrable National Park, Uganda"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Uganda: The <span className="text-[#fec76f]">Pearl of Africa</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Embark on life-changing gorilla treks, thrilling safaris, and cultural adventures in Uganda's diverse landscapes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#destinations"
                className="bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Book Your Uganda Adventure Now
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
                From mountain gorillas to powerful waterfalls, discover Uganda's most spectacular wildlife and adventure destinations
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
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentDestination ? 'bg-[#195e48]' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to destination ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Brief Introduction About Uganda */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Brief Introduction About Uganda
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    <strong>Overview:</strong> Known as the Pearl of Africa, Uganda offers premier gorilla trekking, vast savannas, and rich cultural experiences. This East African gem combines incredible wildlife encounters with diverse landscapes and warm, welcoming people.
                  </p>
                  <p>
                    <strong>Key Highlights:</strong> Home to 500+ mountain gorillas (half the world's population), the world's most powerful waterfall at Murchison Falls, and Africa's largest national park. Uganda hosts 13 primate species, over 1,000 bird species, and the source of the world's longest river.
                  </p>
                  <p>
                    <strong>Best Time to Visit:</strong> June-October and December-February (dry seasons) offer the best conditions for trekking and safaris with easier trail access and optimal wildlife viewing opportunities.
                  </p>
                  <p>
                    <strong>Quick Fact:</strong> Uganda hosts Africa's largest national park (Murchison Falls) and is the only country where you can trek both mountain gorillas and chimpanzees in their natural habitat.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">500+</div>
                    <div className="text-gray-600">Mountain Gorillas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,000+</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/uganda-landscape-overview.jpg"
                  alt="Uganda diverse landscapes and wildlife"
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
                Embark on life-changing adventures that showcase Uganda's incredible natural beauty and wildlife
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
                    <div key={experience.id} className={`flex-shrink-0 px-2 md:px-3 ${
                      isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'
                    }`}>
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
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentExperience ? 'bg-[#195e48]' : 'bg-gray-300'
                    }`}
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
                View All Uganda Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Accommodation Stays */}
        <section className="py-12 md:py-20 bg-white">
          <div className="content-section">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Accommodation Stays
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Stay in Uganda's finest lodges and camps, from luxury forest camps to community-run eco-lodges
              </p>
            </div>

            <div className="relative">
              <div 
                ref={accommodationRef}
                className="overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchEnd={(e) => onTouchEnd(e, 'accommodation')}
              >
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ 
                    transform: `translateX(-${currentAccommodation * (isMobile ? 100 : isTablet ? 50 : 100/3)}%)` 
                  }}
                >
                  {accommodations.map((accommodation) => (
                    <div key={accommodation.id} className={`flex-shrink-0 px-2 md:px-3 ${
                      isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'
                    }`}>
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48 md:h-64">
                          <Image
                            src={accommodation.image}
                            alt={accommodation.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute top-3 md:top-4 left-3 md:left-4 bg-white bg-opacity-90 text-gray-900 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                            {accommodation.type}
                          </div>
                        </div>
                        <div className="p-4 md:p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-xs md:text-sm text-gray-500">
                              <MapPinIcon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                              <span className="truncate">{accommodation.location}</span>
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="w-3 md:w-4 h-3 md:h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-xs md:text-sm font-medium">{accommodation.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                            {accommodation.name}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-3 line-clamp-2">
                            {accommodation.description}
                          </p>
                          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                            <div className="flex flex-wrap gap-1">
                              {accommodation.amenities.slice(0, isMobile ? 1 : 2).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {accommodation.amenities.length > (isMobile ? 1 : 2) && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{accommodation.amenities.length - (isMobile ? 1 : 2)} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-base md:text-lg font-bold text-[#195e48]">
                              {accommodation.price}
                            </div>
                            <button className="bg-[#195e48] hover:bg-[#164a3a] text-white px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors duration-300">
                              {accommodation.cta}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevAccommodation}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous accommodations"
              >
                <ChevronLeftIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>

              <button
                onClick={nextAccommodation}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2 md:p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next accommodations"
              >
                <ChevronRightIcon className="w-4 md:w-6 h-4 md:h-6 text-gray-600" />
              </button>

              {/* Dots indicator for mobile */}
              <div className="flex justify-center mt-6 space-x-2 md:hidden">
                {Array.from({ length: Math.max(1, accommodations.length) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAccommodation(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentAccommodation ? 'bg-[#195e48]' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to accommodation ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/accommodations"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Uganda Accommodations
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
                Essential information to help you plan your perfect Uganda adventure
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
                    <div key={insight.id} className={`flex-shrink-0 px-2 md:px-3 ${
                      isMobile ? 'w-full' : isTablet ? 'w-1/2' : 'w-1/3'
                    }`}>
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
                          <div className="flex items-center text-xs md:text-sm text-gray-500 mb-3">
                            <ClockIcon className="w-3 md:w-4 h-3 md:h-4 mr-1" />
                            {insight.readTime}
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 line-clamp-2">
                            {insight.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
                            {insight.excerpt}
                          </p>
                          <button className="text-[#195e48] hover:text-[#164a3a] text-sm md:text-base font-medium transition-colors duration-300">
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
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentInsight ? 'bg-[#195e48]' : 'bg-gray-300'
                    }`}
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
                View All Uganda Travel Guides
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
                Get answers to the most common questions about traveling to Uganda
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
                        className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                          expandedFAQ === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
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