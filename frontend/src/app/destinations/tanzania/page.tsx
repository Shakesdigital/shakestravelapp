'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TanzaniaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAccommodation, setCurrentAccommodation] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const destinations = [
    {
      id: 1,
      name: 'Serengeti National Park',
      image: '/images/destinations/serengeti.jpg',
      description: 'Endless plains home to the Great Migration and Big Five',
      location: 'Northern Tanzania',
      highlights: ['Great Migration', 'Big Five', 'Endless Plains']
    },
    {
      id: 2,
      name: 'Ngorongoro Crater',
      image: '/images/destinations/ngorongoro.jpg',
      description: 'World\'s largest intact volcanic caldera with incredible wildlife',
      location: 'Northern Tanzania',
      highlights: ['Volcanic Crater', 'Dense Wildlife', 'UNESCO World Heritage']
    },
    {
      id: 3,
      name: 'Mount Kilimanjaro',
      image: '/images/destinations/kilimanjaro.jpg',
      description: 'Africa\'s highest peak and world\'s tallest free-standing mountain',
      location: 'Northern Tanzania',
      highlights: ['Highest Peak', 'Multiple Climates', 'Seven Summits']
    },
    {
      id: 4,
      name: 'Zanzibar Island',
      image: '/images/destinations/zanzibar.jpg',
      description: 'Pristine beaches and rich cultural heritage in the Indian Ocean',
      location: 'Zanzibar Archipelago',
      highlights: ['White Sand Beaches', 'Stone Town', 'Spice Tours']
    },
    {
      id: 5,
      name: 'Tarangire National Park',
      image: '/images/destinations/tarangire.jpg',
      description: 'Famous for ancient baobab trees and large elephant herds',
      location: 'Northern Tanzania',
      highlights: ['Baobab Trees', 'Elephant Herds', 'Diverse Wildlife']
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Serengeti Migration Safari',
      duration: '8 days',
      price: '$2,299',
      rating: 4.9,
      image: '/images/experiences/serengeti-migration.jpg',
      location: 'Serengeti & Ngorongoro',
      description: 'Witness the Great Migration and explore Tanzania\'s most iconic wildlife destinations.'
    },
    {
      id: 2,
      title: 'Kilimanjaro Climbing Adventure',
      duration: '7 days',
      price: '$1,899',
      rating: 4.8,
      image: '/images/experiences/kilimanjaro-climb.jpg',
      location: 'Mount Kilimanjaro',
      description: 'Conquer Africa\'s highest peak on the scenic Machame or Lemosho route.'
    },
    {
      id: 3,
      title: 'Zanzibar Beach & Culture',
      duration: '5 days',
      price: '$1,299',
      rating: 4.7,
      image: '/images/experiences/zanzibar-beach.jpg',
      location: 'Zanzibar Island',
      description: 'Relax on pristine beaches and explore the historic Stone Town\'s cultural treasures.'
    },
    {
      id: 4,
      title: 'Northern Circuit Safari',
      duration: '6 days',
      price: '$1,799',
      rating: 4.8,
      image: '/images/experiences/northern-circuit.jpg',
      location: 'Northern Tanzania',
      description: 'Complete northern Tanzania safari covering Serengeti, Ngorongoro, and Tarangire.'
    }
  ];

  const accommodations = [
    {
      id: 1,
      name: 'Four Seasons Safari Lodge Serengeti',
      type: 'Luxury Lodge',
      price: '$1,200/night',
      rating: 4.9,
      image: '/images/accommodations/four-seasons-serengeti.jpg',
      location: 'Serengeti',
      amenities: ['Game Drives', 'Infinity Pool', 'Spa', 'Fine Dining']
    },
    {
      id: 2,
      name: 'Ngorongoro Crater Lodge',
      type: 'Luxury Lodge',
      price: '$980/night',
      rating: 4.8,
      image: '/images/accommodations/ngorongoro-lodge.jpg',
      location: 'Ngorongoro',
      amenities: ['Crater Views', 'Butler Service', 'Gourmet Dining', 'Cultural Visits']
    },
    {
      id: 3,
      name: 'Park Hyatt Zanzibar',
      type: 'Beach Resort',
      price: '$450/night',
      rating: 4.7,
      image: '/images/accommodations/park-hyatt-zanzibar.jpg',
      location: 'Stone Town',
      amenities: ['Beachfront', 'Spa', 'Multiple Restaurants', 'Cultural Tours']
    },
    {
      id: 4,
      name: 'Kilimanjaro Mountain Resort',
      type: 'Mountain Lodge',
      price: '$280/night',
      rating: 4.6,
      image: '/images/accommodations/kilimanjaro-resort.jpg',
      location: 'Moshi',
      amenities: ['Mountain Views', 'Climbing Support', 'Pool', 'Local Cuisine']
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Best Time to Visit Tanzania',
      category: 'Planning',
      readTime: '6 min read',
      image: '/images/insights/tanzania-seasons.jpg',
      excerpt: 'Discover optimal timing for the Great Migration, climbing Kilimanjaro, and enjoying Zanzibar\'s beaches.'
    },
    {
      id: 2,
      title: 'Tanzania Visa & Entry Requirements',
      category: 'Travel Tips',
      readTime: '4 min read',
      image: '/images/insights/tanzania-visa.jpg',
      excerpt: 'Complete guide to Tanzania visa requirements, including single entry, multiple entry, and transit visas.'
    },
    {
      id: 3,
      title: 'Climbing Kilimanjaro: What to Expect',
      category: 'Adventure',
      readTime: '8 min read',
      image: '/images/insights/kilimanjaro-guide.jpg',
      excerpt: 'Essential preparation tips, route comparisons, and what to pack for your Kilimanjaro climbing adventure.'
    },
    {
      id: 4,
      title: 'Tanzanian Culture & Traditions',
      category: 'Culture',
      readTime: '5 min read',
      image: '/images/insights/tanzania-culture.jpg',
      excerpt: 'Explore Tanzania\'s diverse cultures, from Maasai traditions to Swahili coastal heritage.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need a visa to visit Tanzania?',
      answer: 'Most visitors need a visa to enter Tanzania. You can apply for an eVisa online before travel or get a visa on arrival. The single-entry tourist visa costs $50 and is valid for 90 days. US citizens pay $100 for a multiple-entry visa.'
    },
    {
      question: 'When is the best time to see the Great Migration?',
      answer: 'The Great Migration is in Tanzania\'s Serengeti from December to July. The dramatic river crossings occur from June to September as herds move between Tanzania and Kenya. January-March is calving season with newborns on the plains.'
    },
    {
      question: 'How difficult is climbing Mount Kilimanjaro?',
      answer: 'Kilimanjaro is considered a non-technical climb but requires good physical fitness and mental preparation. The main challenges are altitude and weather. Success rates vary by route: Machame (~85%), Lemosho (~90%), Marangu (~65%).'
    },
    {
      question: 'What vaccinations do I need for Tanzania?',
      answer: 'Yellow fever vaccination is required if arriving from a yellow fever endemic area. Recommended vaccinations include hepatitis A&B, typhoid, meningitis, and malaria prophylaxis. Consult your doctor 4-6 weeks before travel.'
    },
    {
      question: 'What currency is used in Tanzania?',
      answer: 'The Tanzanian Shilling (TZS) is the official currency. US dollars are widely accepted in tourist areas and for park fees. Credit cards are accepted in hotels and lodges, but carry cash for local purchases and tips.'
    },
    {
      question: 'Is Tanzania safe for tourists?',
      answer: 'Tanzania is generally safe for tourists, especially in popular safari areas and Zanzibar. Follow standard travel precautions, use reputable tour operators, and stay informed about current conditions. Avoid walking alone at night in cities.'
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
            "name": "Tanzania",
            "description": "Experience Tanzania's incredible diversity from the Great Migration in Serengeti to the summit of Mount Kilimanjaro and the pristine beaches of Zanzibar. Discover East Africa's most iconic destinations.",
            "url": "https://shakestravelapp.com/destinations/tanzania",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist", "Beach Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Tanzania"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/tanzania-hero.jpg"
              alt="Tanzania landscape with Mount Kilimanjaro"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Tanzania's <span className="text-[#fec76f]">Majesty</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              From Kilimanjaro's peak to Serengeti's plains and Zanzibar's shores - experience East Africa's crown jewel
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
                Tanzania's Iconic Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore the diverse landscapes that make Tanzania one of Africa's premier travel destinations
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
                  Why Choose Tanzania?
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Tanzania offers the quintessential African experience, combining world-class wildlife safaris, Africa's highest mountain, and pristine Indian Ocean beaches. Home to the Serengeti and Ngorongoro Crater, Tanzania hosts some of the planet's most spectacular wildlife phenomena.
                  </p>
                  <p>
                    The Great Migration, often called the "Greatest Show on Earth," sees over two million wildebeest, zebras, and gazelles traverse the Serengeti ecosystem. Beyond wildlife, conquer Mount Kilimanjaro's summit or unwind on Zanzibar's spice-scented shores with their rich cultural heritage.
                  </p>
                  <p>
                    Tanzania's cultural diversity spans over 120 ethnic groups, from the proud Maasai warriors to the Swahili coastal communities. This cultural tapestry, combined with stunning natural beauty, creates an unparalleled destination for adventurous travelers.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">22</div>
                    <div className="text-gray-600">National Parks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,100+</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/tanzania-wildlife.jpg"
                  alt="Tanzania wildlife and cultural heritage"
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
                Epic Tanzania Adventures
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Embark on life-changing adventures from safari expeditions to mountain climbing and beach escapes
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
                Exceptional Accommodations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay in Tanzania's premier lodges and resorts, from luxury safari camps to beachfront retreats
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
                Tanzania Travel Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert tips and essential information for planning your Tanzania adventure
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
                Tanzania Travel FAQs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to the most common questions about traveling to Tanzania
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