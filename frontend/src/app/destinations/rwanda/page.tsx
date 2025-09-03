'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function RwandaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAccommodation, setCurrentAccommodation] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const destinations = [
    {
      id: 1,
      name: 'Volcanoes National Park',
      image: '/images/destinations/volcanoes-rwanda.jpg',
      description: 'Home to endangered mountain gorillas and golden monkeys',
      location: 'Northern Rwanda',
      highlights: ['Mountain Gorillas', 'Golden Monkeys', 'Volcano Hiking']
    },
    {
      id: 2,
      name: 'Akagera National Park',
      image: '/images/destinations/akagera.jpg',
      description: 'Rwanda\'s only Big Five safari destination with savanna wildlife',
      location: 'Eastern Rwanda',
      highlights: ['Big Five', 'Boat Safaris', 'Wildlife Conservation']
    },
    {
      id: 3,
      name: 'Nyungwe Forest National Park',
      image: '/images/destinations/nyungwe.jpg',
      description: 'Ancient rainforest with chimpanzees and canopy walkway',
      location: 'Southern Rwanda',
      highlights: ['Chimpanzee Tracking', 'Canopy Walkway', 'Bird Watching']
    },
    {
      id: 4,
      name: 'Lake Kivu',
      image: '/images/destinations/lake-kivu.jpg',
      description: 'One of Africa\'s Great Lakes with stunning scenery and beaches',
      location: 'Western Rwanda',
      highlights: ['Lake Activities', 'Beach Resorts', 'Island Hopping']
    },
    {
      id: 5,
      name: 'Kigali City',
      image: '/images/destinations/kigali.jpg',
      description: 'Clean, safe capital city with rich history and vibrant culture',
      location: 'Central Rwanda',
      highlights: ['Genocide Memorial', 'Clean Streets', 'Local Markets']
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Mountain Gorilla Trekking',
      duration: '3 days',
      price: '$1,699',
      rating: 4.9,
      image: '/images/experiences/gorilla-trekking-rwanda.jpg',
      location: 'Volcanoes National Park',
      description: 'Once-in-a-lifetime encounter with endangered mountain gorillas in their natural habitat.'
    },
    {
      id: 2,
      title: 'Big Five Safari in Akagera',
      duration: '4 days',
      price: '$1,299',
      rating: 4.8,
      image: '/images/experiences/akagera-safari.jpg',
      location: 'Akagera National Park',
      description: 'Experience Rwanda\'s only Big Five destination with game drives and boat safaris.'
    },
    {
      id: 3,
      title: 'Chimpanzee & Canopy Walk',
      duration: '2 days',
      price: '$899',
      rating: 4.7,
      image: '/images/experiences/nyungwe-chimps.jpg',
      location: 'Nyungwe Forest',
      description: 'Track chimpanzees and walk through the treetops on Africa\'s only canopy walkway.'
    },
    {
      id: 4,
      title: 'Cultural Heritage Tour',
      duration: '5 days',
      price: '$1,199',
      rating: 4.6,
      image: '/images/experiences/rwanda-culture.jpg',
      location: 'Kigali & Villages',
      description: 'Explore Rwanda\'s remarkable recovery story and vibrant cultural traditions.'
    }
  ];

  const accommodations = [
    {
      id: 1,
      name: 'Bisate Lodge',
      type: 'Luxury Eco-Lodge',
      price: '$1,850/night',
      rating: 4.9,
      image: '/images/accommodations/bisate-lodge.jpg',
      location: 'Volcanoes National Park',
      amenities: ['Gorilla Trekking', 'Reforestation', 'Farm-to-Table', 'Spa']
    },
    {
      id: 2,
      name: 'Magashi Camp',
      type: 'Safari Lodge',
      price: '$780/night',
      rating: 4.8,
      image: '/images/accommodations/magashi-camp.jpg',
      location: 'Akagera National Park',
      amenities: ['Game Drives', 'Boat Safaris', 'Lakeside Views', 'Conservation']
    },
    {
      id: 3,
      name: 'One&Only Nyungwe House',
      type: 'Luxury Resort',
      price: '$650/night',
      rating: 4.7,
      image: '/images/accommodations/nyungwe-house.jpg',
      location: 'Nyungwe Forest',
      amenities: ['Forest Views', 'Spa', 'Tea Plantation', 'Primate Tracking']
    },
    {
      id: 4,
      name: 'Lake Kivu Serena Hotel',
      type: 'Lake Resort',
      price: '$320/night',
      rating: 4.5,
      image: '/images/accommodations/kivu-serena.jpg',
      location: 'Gisenyi',
      amenities: ['Lake Views', 'Beach Access', 'Water Sports', 'Cultural Tours']
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Rwanda Gorilla Permit Guide',
      category: 'Wildlife',
      readTime: '5 min read',
      image: '/images/insights/rwanda-permits.jpg',
      excerpt: 'Everything you need to know about securing gorilla trekking permits and planning your visit.'
    },
    {
      id: 2,
      title: 'Best Time to Visit Rwanda',
      category: 'Planning',
      readTime: '4 min read',
      image: '/images/insights/rwanda-seasons.jpg',
      excerpt: 'Discover the optimal timing for gorilla trekking, wildlife viewing, and exploring Rwanda\'s attractions.'
    },
    {
      id: 3,
      title: 'Rwanda\'s Conservation Success Story',
      category: 'Conservation',
      readTime: '7 min read',
      image: '/images/insights/rwanda-conservation.jpg',
      excerpt: 'Learn how Rwanda became a model for wildlife conservation and sustainable tourism in Africa.'
    },
    {
      id: 4,
      title: 'Kigali: Africa\'s Cleanest Capital',
      category: 'Culture',
      readTime: '6 min read',
      image: '/images/insights/kigali-city.jpg',
      excerpt: 'Explore Kigali\'s transformation into one of Africa\'s most modern and sustainable cities.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need a visa to visit Rwanda?',
      answer: 'Citizens of most countries can get a visa on arrival or apply for an eVisa online. The 30-day tourist visa costs $50. Citizens of African Union, Commonwealth, and some other countries can enter visa-free for up to 90 days.'
    },
    {
      question: 'How much does a gorilla trekking permit cost?',
      answer: 'A gorilla trekking permit in Rwanda costs $1,500 per person per trek. This includes park entrance, guide services, and one hour with a gorilla family. Permits should be booked well in advance as they are limited and in high demand.'
    },
    {
      question: 'What is the best time for gorilla trekking in Rwanda?',
      answer: 'Gorilla trekking is possible year-round, but the dry seasons (June-September and December-February) are generally easier for trekking. The wet seasons may have fewer tourists but can be more challenging for hiking.'
    },
    {
      question: 'Is Rwanda safe for tourists?',
      answer: 'Rwanda is considered one of the safest countries in Africa for tourists. It has low crime rates, excellent infrastructure, and a stable political environment. Kigali is known as one of Africa\'s cleanest and safest capitals.'
    },
    {
      question: 'What currency is used in Rwanda?',
      answer: 'The Rwandan Franc (RWF) is the official currency. US dollars are widely accepted, especially for tourist services. Credit cards are accepted in major hotels and restaurants in Kigali, but carry cash for rural areas.'
    },
    {
      question: 'What vaccinations do I need for Rwanda?',
      answer: 'Yellow fever vaccination is required if arriving from a yellow fever endemic area. Recommended vaccinations include hepatitis A&B, typhoid, and malaria prophylaxis. Consult your doctor 4-6 weeks before travel.'
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
            "name": "Rwanda",
            "description": "Experience Rwanda's incredible transformation and natural wonders. Trek with mountain gorillas in Volcanoes National Park, explore Akagera's Big Five, and discover the Land of a Thousand Hills.",
            "url": "https://shakestravelapp.com/destinations/rwanda",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Rwanda"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/rwanda-hero.jpg"
              alt="Rwanda landscape with rolling hills"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Rwanda's <span className="text-[#fec76f]">Miracles</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Trek with mountain gorillas, experience Africa's cleanest city, and witness the Land of a Thousand Hills
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
                Rwanda's Premier Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore the diverse landscapes and experiences that make Rwanda the "Land of a Thousand Hills"
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
                  Why Choose Rwanda?
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Rwanda, known as the "Land of a Thousand Hills," represents one of Africa's most remarkable success stories. From its tragic past, Rwanda has emerged as a beacon of hope, progress, and conservation excellence that attracts visitors from around the world.
                  </p>
                  <p>
                    Home to nearly half of the world's remaining mountain gorillas, Rwanda offers the most accessible and well-organized gorilla trekking experience. Beyond primates, discover the Big Five in Akagera National Park, walk among ancient trees in Nyungwe Forest, and enjoy the pristine waters of Lake Kivu.
                  </p>
                  <p>
                    Rwanda's commitment to sustainability is unparalleled - it was the first country to ban plastic bags, boasts Africa's cleanest capital city in Kigali, and leads continental conservation efforts. This makes it an ideal destination for conscious travelers seeking authentic experiences.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">400+</div>
                    <div className="text-gray-600">Mountain Gorillas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">700+</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/rwanda-landscape.jpg"
                  alt="Rwanda's rolling hills and cultural heritage"
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
                Unique Rwanda Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover life-changing encounters with mountain gorillas and explore Rwanda's diverse ecosystems
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
                Premium Rwanda Accommodations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience Rwanda's finest eco-lodges and resorts, committed to conservation and luxury
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
                Rwanda Travel Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Essential information for planning your Rwanda adventure and gorilla trekking experience
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
                Rwanda Travel FAQs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to the most common questions about visiting Rwanda
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