'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function UgandaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAccommodation, setCurrentAccommodation] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const destinations = [
    {
      id: 1,
      name: 'Bwindi Impenetrable Forest',
      image: '/images/destinations/bwindi.jpg',
      description: 'Home to endangered mountain gorillas and incredible biodiversity',
      location: 'Southwestern Uganda',
      highlights: ['Mountain Gorillas', 'Biodiversity', 'Bird Watching']
    },
    {
      id: 2,
      name: 'Queen Elizabeth National Park',
      image: '/images/destinations/queen-elizabeth.jpg',
      description: 'Uganda\'s most popular safari destination with diverse wildlife',
      location: 'Western Uganda',
      highlights: ['Tree-climbing Lions', 'Boat Safari', 'Crater Lakes']
    },
    {
      id: 3,
      name: 'Murchison Falls National Park',
      image: '/images/destinations/murchison-falls.jpg',
      description: 'Spectacular waterfall where the Nile squeezes through a narrow gorge',
      location: 'Northwestern Uganda',
      highlights: ['Murchison Falls', 'Big Game', 'River Nile']
    },
    {
      id: 4,
      name: 'Lake Bunyonyi',
      image: '/images/destinations/lake-bunyonyi.jpg',
      description: 'Uganda\'s deepest lake surrounded by terraced hills',
      location: 'Southwestern Uganda',
      highlights: ['Island Hopping', 'Canoeing', 'Scenic Views']
    },
    {
      id: 5,
      name: 'Kibale National Park',
      image: '/images/destinations/kibale.jpg',
      description: 'Primate capital of the world with 13 primate species',
      location: 'Western Uganda',
      highlights: ['Chimpanzee Tracking', 'Primate Diversity', 'Forest Walks']
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Mountain Gorilla Trekking',
      duration: '4 days',
      price: '$1,599',
      rating: 4.9,
      image: '/images/experiences/gorilla-trekking.jpg',
      location: 'Bwindi Forest',
      description: 'Trek through dense forest to encounter endangered mountain gorillas in their natural habitat.'
    },
    {
      id: 2,
      title: 'Big Five Safari Adventure',
      duration: '6 days',
      price: '$1,899',
      rating: 4.8,
      image: '/images/experiences/uganda-safari.jpg',
      location: 'Multiple Parks',
      description: 'Complete safari experience across Uganda\'s premier wildlife destinations.'
    },
    {
      id: 3,
      title: 'Chimpanzee Tracking',
      duration: '3 days',
      price: '$899',
      rating: 4.7,
      image: '/images/experiences/chimpanzee-tracking.jpg',
      location: 'Kibale Forest',
      description: 'Track our closest relatives in their natural forest habitat with expert guides.'
    },
    {
      id: 4,
      title: 'Cultural & Wildlife Combo',
      duration: '5 days',
      price: '$1,299',
      rating: 4.6,
      image: '/images/experiences/cultural-uganda.jpg',
      location: 'Various Locations',
      description: 'Experience Uganda\'s rich culture combined with incredible wildlife encounters.'
    }
  ];

  const accommodations = [
    {
      id: 1,
      name: 'Sanctuary Gorilla Forest Camp',
      type: 'Luxury Tented Camp',
      price: '$890/night',
      rating: 4.9,
      image: '/images/accommodations/gorilla-forest-camp.jpg',
      location: 'Bwindi Forest',
      amenities: ['Gorilla Permits', 'Forest Views', 'Spa', 'Gourmet Dining']
    },
    {
      id: 2,
      name: 'Paraa Safari Lodge',
      type: 'Safari Lodge',
      price: '$520/night',
      rating: 4.8,
      image: '/images/accommodations/paraa-lodge.jpg',
      location: 'Murchison Falls',
      amenities: ['River Views', 'Game Drives', 'Boat Safaris', 'Pool']
    },
    {
      id: 3,
      name: 'Bird Nest Resort',
      type: 'Lake Resort',
      price: '$340/night',
      rating: 4.6,
      image: '/images/accommodations/bird-nest.jpg',
      location: 'Lake Bunyonyi',
      amenities: ['Lake Views', 'Island Hopping', 'Canoeing', 'Cultural Tours']
    },
    {
      id: 4,
      name: 'Primate Lodge Kibale',
      type: 'Forest Lodge',
      price: '$280/night',
      rating: 4.5,
      image: '/images/accommodations/primate-lodge.jpg',
      location: 'Kibale Forest',
      amenities: ['Forest Setting', 'Chimpanzee Tracking', 'Nature Walks', 'Bird Watching']
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Best Time to Visit Uganda',
      category: 'Planning',
      readTime: '5 min read',
      image: '/images/insights/uganda-seasons.jpg',
      excerpt: 'Discover the optimal timing for gorilla trekking, wildlife viewing, and exploring Uganda\'s diverse attractions.'
    },
    {
      id: 2,
      title: 'Gorilla Trekking Permits Guide',
      category: 'Wildlife',
      readTime: '4 min read',
      image: '/images/insights/gorilla-permits.jpg',
      excerpt: 'Everything you need to know about securing gorilla permits and preparing for your trek in Bwindi Forest.'
    },
    {
      id: 3,
      title: 'Uganda Safari Packing List',
      category: 'Travel Tips',
      readTime: '6 min read',
      image: '/images/insights/uganda-packing.jpg',
      excerpt: 'Essential items to pack for your Uganda adventure, from gorilla trekking gear to safari essentials.'
    },
    {
      id: 4,
      title: 'Ugandan Culture & Traditions',
      category: 'Culture',
      readTime: '7 min read',
      image: '/images/insights/uganda-culture.jpg',
      excerpt: 'Explore Uganda\'s rich cultural heritage, traditional customs, and diverse ethnic communities.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need a visa to visit Uganda?',
      answer: 'Most visitors need a visa to enter Uganda. You can apply for an eVisa online before travel or get a visa on arrival. The East Africa Tourist Visa allows entry to Uganda, Kenya, and Rwanda for $100.'
    },
    {
      question: 'How much does a gorilla trekking permit cost?',
      answer: 'A gorilla trekking permit in Uganda costs $800 for foreign non-residents, $700 for foreign residents, and UGX 300,000 for East African citizens. Permits include park entrance and guide services.'
    },
    {
      question: 'What is the best time for gorilla trekking?',
      answer: 'Gorilla trekking is possible year-round, but the dry seasons (June-August and December-February) offer easier trekking conditions. The wet seasons may have fewer crowds but more challenging trails.'
    },
    {
      question: 'Is Uganda safe for tourists?',
      answer: 'Uganda is generally safe for tourists, especially in popular destinations and with reputable tour operators. Follow standard travel precautions and stay informed about current conditions.'
    },
    {
      question: 'What vaccinations do I need for Uganda?',
      answer: 'Yellow fever vaccination is required if arriving from a yellow fever endemic area. Recommended vaccinations include hepatitis A&B, typhoid, meningitis, and malaria prophylaxis.'
    },
    {
      question: 'What currency is used in Uganda?',
      answer: 'The Ugandan Shilling (UGX) is the official currency. US dollars are widely accepted for tourist services. Credit cards are accepted in major hotels and lodges, but carry cash for local purchases.'
    }
  ];

  const nextDestination = () => {
    setCurrentDestination((prev) => (prev + 1) % destinations.length);
  };

  const prevDestination = () => {
    setCurrentDestination((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  const nextExperience = () => {
    setCurrentExperience((prev) => (prev + 1) % Math.max(1, experiences.length - 2));
  };

  const prevExperience = () => {
    setCurrentExperience((prev) => (prev - 1 + Math.max(1, experiences.length - 2)) % Math.max(1, experiences.length - 2));
  };

  const nextAccommodation = () => {
    setCurrentAccommodation((prev) => (prev + 1) % Math.max(1, accommodations.length - 2));
  };

  const prevAccommodation = () => {
    setCurrentAccommodation((prev) => (prev - 1 + Math.max(1, accommodations.length - 2)) % Math.max(1, accommodations.length - 2));
  };

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % Math.max(1, insights.length - 2));
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + Math.max(1, insights.length - 2)) % Math.max(1, insights.length - 2));
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
            "name": "Uganda",
            "description": "Experience Uganda's incredible wildlife, from mountain gorillas in Bwindi to the Big Five in Queen Elizabeth National Park. Discover the Pearl of Africa with authentic adventures and eco-friendly accommodations.",
            "url": "https://shakestravelapp.com/destinations/uganda",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Uganda"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/uganda-hero.jpg"
              alt="Uganda landscape with mountain gorillas"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Uganda's <span className="text-[#fec76f]">Treasures</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Trek with mountain gorillas, explore pristine wilderness, and experience the Pearl of Africa's natural wonders
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#destinations"
                className="bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Explore Destinations
              </Link>
              <Link
                href="#experiences"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300"
              >
                View Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Top Destinations */}
        <section id="destinations" className="py-20 bg-gray-50">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Uganda's Premier Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From mountain gorillas to savanna wildlife, discover Uganda's most spectacular natural attractions
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
                          <Link
                            href={`/destinations/${destination.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                            className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
                          >
                            Explore Destination
                          </Link>
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

        {/* Country Introduction */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Why Choose Uganda?
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Uganda, known as the "Pearl of Africa," offers one of the world's most authentic and unspoiled safari experiences. Home to nearly half of the world's remaining mountain gorillas, Uganda provides intimate wildlife encounters that few destinations can match.
                  </p>
                  <p>
                    Beyond gorillas, Uganda boasts incredible biodiversity with over 1,000 bird species, the Big Five, and 13 primate species including our closest relatives, chimpanzees. From the dramatic Murchison Falls to the crater lakes of Queen Elizabeth National Park, Uganda's landscapes are breathtakingly diverse.
                  </p>
                  <p>
                    Uganda's commitment to conservation and community-based tourism ensures your visit directly supports wildlife protection and local communities. Experience authentic African culture while contributing to sustainable development and conservation efforts.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">10</div>
                    <div className="text-gray-600">National Parks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,000+</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/uganda-wildlife.jpg"
                  alt="Uganda wildlife and landscapes"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Top Adventure Experiences */}
        <section id="experiences" className="py-20" style={{ backgroundColor: '#fafafa' }}>
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Unforgettable Uganda Adventures
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Embark on life-changing adventures that showcase Uganda's incredible natural beauty and wildlife
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentExperience * (100 / 3)}%)` }}
                >
                  {experiences.map((experience) => (
                    <div key={experience.id} className="w-1/3 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-64">
                          <Image
                            src={experience.image}
                            alt={experience.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-[#195e48] text-white px-3 py-1 rounded-full text-sm font-medium">
                            {experience.duration}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {experience.location}
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{experience.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {experience.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {experience.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-[#195e48]">
                              {experience.price}
                            </div>
                            <button className="bg-[#195e48] hover:bg-[#164a3a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                              Book Now
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous experiences"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextExperience}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next experiences"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/experiences"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Experiences
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Accommodations */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Premium Uganda Accommodations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay in Uganda's finest lodges and camps, carefully selected for their exceptional service and locations
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentAccommodation * (100 / 3)}%)` }}
                >
                  {accommodations.map((accommodation) => (
                    <div key={accommodation.id} className="w-1/3 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-64">
                          <Image
                            src={accommodation.image}
                            alt={accommodation.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                            {accommodation.type}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              {accommodation.location}
                            </div>
                            <div className="flex items-center">
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{accommodation.rating}</span>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {accommodation.name}
                          </h3>
                          <div className="space-y-3 mb-4">
                            <div className="flex flex-wrap gap-1">
                              {accommodation.amenities.slice(0, 2).map((amenity, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {accommodation.amenities.length > 2 && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{accommodation.amenities.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-[#195e48]">
                              {accommodation.price}
                            </div>
                            <button className="bg-[#195e48] hover:bg-[#164a3a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                              Book Now
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous accommodations"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextAccommodation}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next accommodations"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/accommodations"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Accommodations
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Insights */}
        <section className="py-20" style={{ backgroundColor: '#f8fffe' }}>
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Uganda Travel Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Essential information to help you plan your perfect Uganda adventure
              </p>
            </div>

            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentInsight * (100 / 3)}%)` }}
                >
                  {insights.map((insight) => (
                    <div key={insight.id} className="w-1/3 flex-shrink-0 px-3">
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48">
                          <Image
                            src={insight.image}
                            alt={insight.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4 bg-[#195e48] text-white px-3 py-1 rounded-full text-xs font-medium">
                            {insight.category}
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <ClockIcon className="w-4 h-4 mr-1" />
                            {insight.readTime}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-3">
                            {insight.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {insight.excerpt}
                          </p>
                          <button className="text-[#195e48] hover:text-[#164a3a] font-medium transition-colors duration-300">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Previous insights"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>

              <button
                onClick={nextInsight}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-3 shadow-lg transition-all duration-300 z-10"
                aria-label="Next insights"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/travel-guides"
                className="inline-flex items-center bg-[#195e48] hover:bg-[#164a3a] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                View All Travel Guides
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Uganda Travel FAQs
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