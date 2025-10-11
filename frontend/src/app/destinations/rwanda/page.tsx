'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function RwandaPage() {
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
      name: 'Volcanoes National Park',
      image: '/images/destinations/volcanoes-park.jpg',
      description: 'Mountain gorilla sanctuary, Dian Fossey research site, 300+ bird species, 5 extinct volcanoes.',
      location: 'Northern Rwanda',
      highlights: ['Gorilla Sanctuary', 'Dian Fossey Research', '300+ Bird Species'],
      cta: 'Book Trek'
    },
    {
      id: 2,
      name: 'Nyungwe Forest National Park',
      image: '/images/destinations/nyungwe-forest.jpg',
      description: 'Africa\'s oldest rainforest (25 million years), 1,000+ plant species, 13 primate species.',
      location: 'Southwestern Rwanda',
      highlights: ['Africa\'s Oldest Rainforest', 'Canopy Walk', '13 Primate Species'],
      cta: 'Explore Forest'
    },
    {
      id: 3,
      name: 'Akagera National Park',
      image: '/images/destinations/akagera-park.jpg',
      description: 'Big Five reintroduction success, 500+ bird species, restored rhino and lion populations.',
      location: 'Eastern Rwanda',
      highlights: ['Big Five', 'Restored Wildlife', '500+ Bird Species'],
      cta: 'Book Safari'
    },
    {
      id: 4,
      name: 'Lake Kivu',
      image: '/images/destinations/lake-kivu.jpg',
      description: 'Africa\'s 6th largest lake, volcanic islands, thermal springs, border with DRC.',
      location: 'Western Rwanda',
      highlights: ['Volcanic Islands', 'Thermal Springs', 'Rift Valley Lake'],
      cta: 'Plan Visit'
    },
    {
      id: 5,
      name: 'Kigali',
      image: '/images/destinations/kigali.jpg',
      description: 'Clean, modern capital city, genocide memorial, cultural sites, central African location.',
      location: 'Central Rwanda',
      highlights: ['Cleanest African Capital', 'Cultural Sites', 'Central Location'],
      cta: 'Discover City'
    },
    {
      id: 6,
      name: 'Gishwati-Mukura National Park',
      image: '/images/destinations/gishwati-park.jpg',
      description: 'Recently established park, mountain gorilla habitat, restored forests.',
      location: 'Northwestern Rwanda',
      highlights: ['Newly Established', 'Forest Restoration', 'Mountain Gorilla'],
      cta: 'Explore Park'
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Gorilla Trekking (Volcanoes)',
      duration: '1 day',
      price: '$1,500',
      rating: 4.9,
      image: '/images/experiences/gorilla-trekking.jpg',
      location: 'Volcanoes NP',
      description: '98% success rate tracking habituated gorilla families.',
      cta: 'Book Permit'
    },
    {
      id: 2,
      title: 'Canopy Walk (Nyungwe)',
      duration: '2 days',
      price: '$200',
      rating: 4.8,
      image: '/images/experiences/canopy-walk.jpg',
      location: 'Nyungwe Forest',
      description: 'Walk among forest giants in one of Africa\'s oldest rainforests.',
      cta: 'Book Experience'
    },
    {
      id: 3,
      title: 'Big Five Safari (Akagera)',
      duration: '3 days',
      price: '$650',
      rating: 4.7,
      image: '/images/experiences/akagera-safari.jpg',
      location: 'Akagera NP',
      description: 'Witness successful Big Five reintroduction in restored savannas.',
      cta: 'Book Safari'
    },
    {
      id: 4,
      title: 'Lake Kivu Getaway',
      duration: '2-3 days',
      price: '$300',
      rating: 4.6,
      image: '/images/experiences/lake-kivu.jpg',
      location: 'Lake Kivu',
      description: 'Relax on Rwanda\'s beautiful lake with volcanic islands.',
      cta: 'Book Stay'
    },
    {
      id: 5,
      title: 'Cultural Tours (Kigali)',
      duration: '1 day',
      price: '$100',
      rating: 4.8,
      image: '/images/experiences/kigali-cultural.jpg',
      location: 'Kigali',
      description: 'Explore Rwanda\'s culture and history in the cleanest capital.',
      cta: 'Book Tour'
    },
    {
      id: 6,
      title: 'Bird Watching (Nyungwe)',
      duration: '1-2 days',
      price: '$180',
      rating: 4.7,
      image: '/images/experiences/bird-watching.jpg',
      location: 'Nyungwe Forest',
      description: 'Spot 300+ bird species in one of Africa\'s most biodiverse forests.',
      cta: 'Book Tour'
    }
  ];

  const stays = [
    {
      id: 1,
      name: 'Bisate Lodge',
      type: 'Luxury',
      price: '$1,150-1,500/night',
      rating: 4.9,
      image: '/images/stays/bisate-lodge.jpg',
      location: 'Volcanoes NP',
      amenities: ['Gorilla Trekking', 'Award-winning Design', 'Eco-friendly', 'Conservation'],
      description: 'Luxury eco-lodge with volcanic peaks views.',
      cta: 'Book Now'
    },
    {
      id: 2,
      name: 'One & Only Gorilla\'s Nest',
      type: 'Luxury',
      price: '$1,500-2,100/night',
      rating: 5.0,
      image: '/images/stays/gorillas-nest.jpg',
      location: 'Volcanoes NP',
      amenities: ['Gorilla Trekking', 'Infinity Pool', 'Butler Service', 'Forest Views'],
      description: 'Ultra-luxury forest lodge with premium service.',
      cta: 'Book Now'
    },
    {
      id: 3,
      name: 'Nyungwe Top Hill Hotel',
      type: 'Mid-Range',
      price: '$150-300/night',
      rating: 4.5,
      image: '/images/stays/nyungwe-top-hill.jpg',
      location: 'Nyungwe Forest',
      amenities: ['Forest Views', 'Restaurant', 'Wi-Fi', 'Hiking Access'],
      description: 'Comfortable forest edge accommodation.',
      cta: 'Book Now'
    },
    {
      id: 4,
      name: 'Ruzizi Tented Lodge',
      type: 'Mid-Range',
      price: '$200-400/night',
      rating: 4.6,
      image: '/images/stays/ruzizi-lodge.jpg',
      location: 'Akagera NP',
      amenities: ['Lake Views', 'Wildlife Viewing', 'Restaurant', 'Bar'],
      description: 'Safari lodge with lake and wildlife views.',
      cta: 'Book Now'
    },
    {
      id: 5,
      name: 'Kigali Serena Hotel',
      type: 'Luxury',
      price: '$200-350/night',
      rating: 4.7,
      image: '/images/stays/kigali-serena.jpg',
      location: 'Kigali',
      amenities: ['City Center', 'Business Center', 'Spa', 'Multiple Restaurants'],
      description: 'Upscale hotel in the heart of Kigali.',
      cta: 'Book Now'
    },
    {
      id: 6,
      name: 'Mountain Gorilla View Lodge',
      type: 'Budget',
      price: '$100-180/night',
      rating: 4.4,
      image: '/images/stays/mountain-gorilla-view.jpg',
      location: 'Volcanoes NP',
      amenities: ['Volcano Views', 'Restaurant', 'Basic Comfort', 'Affordable'],
      description: 'Affordable accommodation with mountain views.',
      cta: 'Book Now'
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Rwanda Visa & Entry Requirements',
      category: 'Travel Tips',
      readTime: '4 min read',
      image: '/images/insights/rwanda-visa.jpg',
      excerpt: 'e-Visa ($30); East Africa Tourist Visa ($100) covers Rwanda, Uganda, Kenya.'
    },
    {
      id: 2,
      title: 'Health & Safety in Rwanda',
      category: 'Health',
      readTime: '5 min read',
      image: '/images/insights/rwanda-health.jpg',
      excerpt: 'Safe destination with good healthcare, malaria prophylaxis recommended.'
    },
    {
      id: 3,
      title: 'Gorilla Permit Booking Guide',
      category: 'Wildlife',
      readTime: '6 min read',
      image: '/images/insights/gorilla-permits.jpg',
      excerpt: 'Permits cost $1,500, book 6-12 months ahead; limited daily permits available.'
    },
    {
      id: 4,
      title: 'Sustainable Travel in Rwanda',
      category: 'Sustainability',
      readTime: '5 min read',
      image: '/images/insights/sustainable-rwanda.jpg',
      excerpt: 'Rwanda leads in sustainable tourism; plastic ban, eco-lodges supporting communities.'
    },
    {
      id: 5,
      title: 'Rwanda Safari Packing Essentials',
      category: 'Packing',
      readTime: '4 min read',
      image: '/images/insights/rwanda-packing.jpg',
      excerpt: 'Rugged hiking boots for gorilla trekking, insect repellent, rain gear.'
    },
    {
      id: 6,
      title: 'Best Time to Visit Rwanda',
      category: 'Planning',
      readTime: '3 min read',
      image: '/images/insights/rwanda-seasons.jpg',
      excerpt: 'June-September, December-February (dry seasons) ideal for trekking and safaris.'
    }
  ];

  const faqs = [
    {
      question: 'How do I book gorilla permits?',
      answer: 'Permits cost $1,500, book 6-12 months ahead via Rwanda Development Board. Only 96 permits available daily. Book through reputable tour operators who can secure permits and coordinate your entire trip.'
    },
    {
      question: 'Is Rwanda safe for tourists?',
      answer: 'Yes, Rwanda is one of Africa\'s safest countries with low crime rates. The country has excellent infrastructure, clean cities, and friendly people. Exercise normal precautions as in any destination.'
    },
    {
      question: 'What should I pack for gorilla trekking?',
      answer: 'Pack long-sleeved shirts, long pants, good hiking boots with ankle support, rain jacket, gardening gloves, hat, sunscreen, and insect repellent. Porters can carry extra items.'
    },
    {
      question: 'How difficult is gorilla trekking?',
      answer: 'Moderate to difficult depending on gorilla location. Trek can last 2-6 hours round trip through dense forest. Age limit is 15 years. Inform guides of any health conditions.'
    },
    {
      question: 'What wildlife can I see outside gorillas?',
      answer: 'Rwanda offers golden monkeys, 13 other primate species, 700+ bird species, Big Five in Akagera, and diverse flora in Nyungwe Forest. Each park has unique wildlife.'
    },
    {
      question: 'What vaccinations do I need for Rwanda?',
      answer: 'Yellow fever vaccination required if arriving from yellow fever endemic areas. Recommended vaccinations include hepatitis A&B, typhoid, and malaria prophylaxis. Consult your doctor before travel.'
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
            "name": "Rwanda - The Land of a Thousand Hills",
            "description": "Experience Rwanda gorilla trekking in Volcanoes NP, Nyungwe Forest adventures, and Akagera Big Five safaris. Discover the Land of a Thousand Hills with pristine forests, restored wildlife, and vibrant culture.",
            "url": "https://shakestravelapp.com/destinations/rwanda",
            "keywords": "Rwanda gorilla trekking, Volcanoes National Park, Nyungwe Forest, Akagera National Park, Rwanda safari, Kigali city, Lake Kivu",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Rwanda"
            },
            "hasMap": "https://www.google.com/maps/place/Rwanda",
            "image": [
              "/images/destinations/volcanoes-park.jpg",
              "/images/destinations/nyungwe-forest.jpg",
              "/images/destinations/akagera-park.jpg"
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/rwanda-gorillas-hero.jpg"
              alt="Mountain gorillas in Volcanoes National Park, Rwanda"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Explore Rwanda: The <span className="text-[#fec76f]">Land of a Thousand Hills</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Discover pristine forests, restored wildlife populations, and vibrant culture in the cleanest city in Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#destinations"
                className="bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Book Your Rwanda Adventure Now
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
                From mountain gorillas to pristine rainforests, discover Rwanda's most spectacular wildlife and adventure destinations
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

        {/* Brief Introduction About Rwanda */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Brief Introduction About Rwanda
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    <strong>Overview:</strong> Known as the "Land of a Thousand Hills," Rwanda is a compact, green country with spectacular mountainous scenery and some of Africa's best wildlife conservation success stories. From mountain gorillas to pristine rainforests, Rwanda offers unique African experiences in a safe, clean, and progressive environment.
                  </p>
                  <p>
                    <strong>Key Highlights:</strong> Home to 1/3 of the world's remaining mountain gorillas, Africa's oldest rainforest in Nyungwe, and successful Big Five restoration in Akagera National Park. Rwanda is the cleanest, safest country in Africa with a remarkable recovery story.
                  </p>
                  <p>
                    <strong>Best Time to Visit:</strong> June-September and December-February (dry seasons) offer the best conditions for gorilla trekking and safaris with clearer views and easier trail access.
                  </p>
                  <p>
                    <strong>Quick Fact:</strong> Rwanda is the only country in the world where both mountain gorillas and golden monkeys can be tracked in the same location, and it has successfully restored its wildlife populations after the 1994 genocide.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,000+</div>
                    <div className="text-gray-600">Hills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">20,000</div>
                    <div className="text-gray-600">Annual Gorilla Visitors</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/rwanda-landscape-overview.jpg"
                  alt="Rwanda diverse landscapes from mountains to forests"
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
                Embark on life-changing adventures that showcase Rwanda's incredible natural beauty and wildlife
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
                View All Rwanda Experiences
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
                Stay in Rwanda's finest lodges and camps, from luxury gorilla trekking bases to eco-friendly forest retreats
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
                View All Rwanda Stays
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
                Essential information to help you plan your perfect Rwanda gorilla trekking and eco-adventure
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
                View All Rwanda Travel Guides
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
                Get answers to the most common questions about traveling to Rwanda
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