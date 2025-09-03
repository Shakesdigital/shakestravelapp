'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, MapPinIcon, StarIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function KenyaPage() {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [currentAccommodation, setCurrentAccommodation] = useState(0);
  const [currentInsight, setCurrentInsight] = useState(0);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const destinations = [
    {
      id: 1,
      name: 'Maasai Mara National Reserve',
      image: '/images/destinations/masai-mara.jpg',
      description: 'Home to the Great Migration and abundant wildlife',
      location: 'Narok County',
      highlights: ['Great Migration', 'Big Five', 'Maasai Culture']
    },
    {
      id: 2,
      name: 'Amboseli National Park',
      image: '/images/destinations/amboseli.jpg',
      description: 'Stunning views of Mount Kilimanjaro and elephant herds',
      location: 'Kajiado County',
      highlights: ['Mount Kilimanjaro Views', 'Elephant Herds', 'Birdwatching']
    },
    {
      id: 3,
      name: 'Samburu National Reserve',
      image: '/images/destinations/samburu.jpg',
      description: 'Unique wildlife and rugged semi-arid landscape',
      location: 'Samburu County',
      highlights: ['Special Five', 'Cultural Encounters', 'River Wildlife']
    },
    {
      id: 4,
      name: 'Lake Nakuru National Park',
      image: '/images/destinations/lake-nakuru.jpg',
      description: 'Famous for flamingos and rhino sanctuary',
      location: 'Nakuru County',
      highlights: ['Flamingo Flocks', 'Rhino Sanctuary', 'Baboon Cliff']
    },
    {
      id: 5,
      name: 'Diani Beach',
      image: '/images/destinations/diani-beach.jpg',
      description: 'Pristine white sand beaches and coral reefs',
      location: 'Kwale County',
      highlights: ['White Sand Beaches', 'Water Sports', 'Coral Reefs']
    }
  ];

  const experiences = [
    {
      id: 1,
      title: 'Great Migration Safari',
      duration: '7 days',
      price: '$1,899',
      rating: 4.9,
      image: '/images/experiences/great-migration.jpg',
      location: 'Maasai Mara',
      description: 'Witness the greatest wildlife spectacle on earth with millions of wildebeest crossing the Mara River.'
    },
    {
      id: 2,
      title: 'Mount Kenya Climbing',
      duration: '5 days',
      price: '$1,299',
      rating: 4.8,
      image: '/images/experiences/mount-kenya.jpg',
      location: 'Central Kenya',
      description: 'Challenge yourself with Africa\'s second-highest peak and stunning alpine scenery.'
    },
    {
      id: 3,
      title: 'Coastal Safari & Beach',
      duration: '6 days',
      price: '$1,599',
      rating: 4.9,
      image: '/images/experiences/coastal-safari.jpg',
      location: 'Coast Province',
      description: 'Perfect combination of wildlife safari and relaxing beach time on the Indian Ocean.'
    },
    {
      id: 4,
      title: 'Cultural Maasai Experience',
      duration: '3 days',
      price: '$699',
      rating: 4.7,
      image: '/images/experiences/maasai-culture.jpg',
      location: 'Kajiado County',
      description: 'Immerse yourself in authentic Maasai culture with traditional ceremonies and village visits.'
    }
  ];

  const accommodations = [
    {
      id: 1,
      name: 'Angama Mara',
      type: 'Luxury Lodge',
      price: '$890/night',
      rating: 4.9,
      image: '/images/accommodations/angama-mara.jpg',
      location: 'Maasai Mara',
      amenities: ['Game Drives', 'Spa', 'Fine Dining', 'Private Deck']
    },
    {
      id: 2,
      name: 'Elephant Bedroom Camp',
      type: 'Tented Camp',
      price: '$520/night',
      rating: 4.8,
      image: '/images/accommodations/elephant-bedroom.jpg',
      location: 'Samburu',
      amenities: ['River Views', 'Wildlife Viewing', 'Cultural Visits', 'Bush Meals']
    },
    {
      id: 3,
      name: 'Diani Reef Beach Resort',
      type: 'Beach Resort',
      price: '$340/night',
      rating: 4.6,
      image: '/images/accommodations/diani-reef.jpg',
      location: 'Diani Beach',
      amenities: ['Beach Access', 'Water Sports', 'Spa', 'Multiple Restaurants']
    },
    {
      id: 4,
      name: 'Fairmont Mount Kenya Safari Club',
      type: 'Historic Lodge',
      price: '$450/night',
      rating: 4.7,
      image: '/images/accommodations/mount-kenya-safari.jpg',
      location: 'Nanyuki',
      amenities: ['Golf Course', 'Animal Orphanage', 'Spa', 'Mountain Views']
    }
  ];

  const insights = [
    {
      id: 1,
      title: 'Best Time to Visit Kenya',
      category: 'Planning',
      readTime: '5 min read',
      image: '/images/insights/kenya-seasons.jpg',
      excerpt: 'Discover the optimal timing for wildlife viewing, Great Migration, and weather conditions across Kenya.'
    },
    {
      id: 2,
      title: 'Kenya Visa Requirements & Entry',
      category: 'Travel Tips',
      readTime: '4 min read',
      image: '/images/insights/kenya-visa.jpg',
      excerpt: 'Complete guide to Kenya visa requirements, border crossings, and entry procedures for international visitors.'
    },
    {
      id: 3,
      title: 'Wildlife Conservation in Kenya',
      category: 'Conservation',
      readTime: '7 min read',
      image: '/images/insights/kenya-conservation.jpg',
      excerpt: 'Learn about Kenya\'s leading role in wildlife conservation and community-based tourism initiatives.'
    },
    {
      id: 4,
      title: 'Kenyan Cuisine & Cultural Foods',
      category: 'Culture',
      readTime: '6 min read',
      image: '/images/insights/kenyan-cuisine.jpg',
      excerpt: 'Explore Kenya\'s diverse culinary landscape from nyama choma to coastal Swahili dishes.'
    }
  ];

  const faqs = [
    {
      question: 'Do I need a visa to visit Kenya?',
      answer: 'Most visitors need a visa to enter Kenya. You can apply for an eVisa online before travel or get a visa on arrival. The tourist visa costs $51 and is valid for 90 days. Citizens of some countries may enter visa-free.'
    },
    {
      question: 'When is the best time to see the Great Migration?',
      answer: 'The Great Migration is in the Maasai Mara from July to October, with the dramatic river crossings typically occurring between July and September. However, the exact timing can vary based on rainfall patterns.'
    },
    {
      question: 'What vaccinations do I need for Kenya?',
      answer: 'Yellow fever vaccination is required if arriving from a yellow fever endemic area. Recommended vaccinations include hepatitis A&B, typhoid, meningitis, and malaria prophylaxis. Consult your doctor 4-6 weeks before travel.'
    },
    {
      question: 'Is Kenya safe for tourists?',
      answer: 'Kenya is generally safe for tourists, especially in popular safari areas and coastal resorts. Follow standard travel precautions, use reputable tour operators, and stay informed about current conditions in different regions.'
    },
    {
      question: 'What currency is used in Kenya?',
      answer: 'The Kenyan Shilling (KES) is the official currency. US dollars are widely accepted in tourist areas. Credit cards are accepted in hotels and lodges, but carry cash for local purchases and tips.'
    },
    {
      question: 'How do I get around Kenya?',
      answer: 'Domestic flights connect major destinations. For safaris, most visitors use tour operators with 4WD vehicles. In cities, options include taxis, ride-sharing apps, matatus (shared minibuses), and private transfers.'
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
            "name": "Kenya",
            "description": "Discover Kenya's incredible wildlife, stunning landscapes, and rich cultural heritage. From the Great Migration in Maasai Mara to the beaches of Diani, Kenya offers unforgettable safari and coastal experiences.",
            "url": "https://shakestravelapp.com/destinations/kenya",
            "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist", "Cultural Tourist"],
            "geo": {
              "@type": "GeoCoordinates",
              "addressCountry": "Kenya"
            }
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/destinations/kenya-hero.jpg"
              alt="Kenya landscape with wildlife"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Kenya's <span className="text-[#fec76f]">Wonders</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Experience the Great Migration, climb Mount Kenya, and explore pristine beaches on the Indian Ocean
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
                Kenya's Top Destinations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From world-famous game reserves to stunning coastal areas, discover Kenya's most spectacular destinations
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
                  Why Choose Kenya?
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Kenya stands as one of Africa's premier safari destinations, offering an unparalleled combination of wildlife experiences, cultural encounters, and diverse landscapes that span from snow-capped mountains to pristine beaches.
                  </p>
                  <p>
                    Home to the world-famous Great Migration, Kenya's Maasai Mara provides front-row seats to nature's greatest spectacle. Beyond the plains, discover the unique wildlife of Samburu, the elephant herds of Amboseli with Mount Kilimanjaro as a backdrop, and the flamingo-filled waters of Lake Nakuru.
                  </p>
                  <p>
                    Kenya's rich cultural tapestry includes the proud Maasai people, vibrant coastal Swahili culture, and over 40 distinct ethnic groups. From Nairobi's cosmopolitan energy to traditional village life, Kenya offers authentic cultural experiences alongside world-class wildlife viewing.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">60+</div>
                    <div className="text-gray-600">National Parks & Reserves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#195e48]">1,400</div>
                    <div className="text-gray-600">Bird Species</div>
                  </div>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/destinations/kenya-wildlife.jpg"
                  alt="Kenya wildlife and landscapes"
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
                Top Adventure Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Embark on extraordinary adventures that showcase Kenya's incredible natural beauty and wildlife
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
                Featured Accommodations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay in Kenya's finest lodges, camps, and resorts, carefully selected for their exceptional service and locations
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
                Travel Insights & Tips
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Essential information to help you plan your perfect Kenya adventure
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
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get answers to common questions about traveling to Kenya
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