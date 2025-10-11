'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { getDestinationLink } from '@/lib/destinations';
import { experiences } from '@/data/experiences';
import { accommodations } from '@/data/accommodations';

interface SearchForm {
  destination: string;
  checkIn: string;
  guests: number;
  category: 'all' | 'accommodations' | 'experiences';
}

export default function Home() {
  const { register, handleSubmit, watch } = useForm<SearchForm>({
    defaultValues: {
      destination: '',
      checkIn: '',
      guests: 2,
      category: 'all'
    }
  });

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const watchDestination = watch('destination');
  const primaryColor = '#195e48';

  const onSearch = (data: SearchForm) => {
    const queryParams = new URLSearchParams({
      destination: data.destination,
      country: 'uganda',
      checkIn: data.checkIn,
      guests: data.guests.toString(),
      category: data.category
    });

    window.location.href = `/search?${queryParams.toString()}`;
  };

  const ugandaDestinations = [
    { name: 'Kampala', description: "Uganda's vibrant capital city", image: '/brand_assets/images/destinations/Kampala/Kampala Edited.jpg' },
    { name: 'Bwindi Impenetrable National Park', description: 'Home to mountain gorillas', image: '/brand_assets/images/destinations/Bwindi/Bwindi Edited.jpg' },
    { name: 'Queen Elizabeth National Park', description: 'Wildlife safari paradise', image: '/brand_assets/images/destinations/Queen Elizabeth National Park/Queen Elizabeth NP 2 Edited.jpg' },
    { name: 'Murchison Falls National Park', description: "World's most powerful waterfall", image: '/brand_assets/images/destinations/Murchison Falls/Murchison Falls 1.jpg' },
    { name: 'Lake Bunyonyi', description: 'Switzerland of Africa', image: '/brand_assets/images/destinations/Lake Bunyonyi/Lake Bunyonyi 1.jpg' },
    { name: 'Kibale National Park', description: 'Primate capital of the world', image: '/brand_assets/images/destinations/Kibale/Kibale Forest 1.jpg' },
    { name: 'Kidepo Valley National Park', description: 'Remote wilderness', image: '/brand_assets/images/destinations/Kidepo National Park/Kidepo Valley National Park 1.jpg' },
    { name: 'Jinja', description: 'Source of the Nile', image: '/brand_assets/images/destinations/Jinja/Jinja Bridge 1.jpg' },
  ];

  const filteredDestinations = ugandaDestinations.filter(dest =>
    dest.name.toLowerCase().includes(watchDestination.toLowerCase())
  );

  const greenPathsHighlights = [
    {
      title: 'Tree Planting',
      description: 'Join our reforestation initiatives across Uganda',
      icon: '🌳'
    },
    {
      title: 'Carbon Offset',
      description: 'Travel responsibly with carbon-neutral journeys',
      icon: '🌍'
    },
    {
      title: 'Community Support',
      description: 'Empower local communities through conservation',
      icon: '👥'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative hero-carousel min-h-[85vh] flex items-center justify-center text-white"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center w-full px-4 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover Uganda
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Experience the Pearl of Africa through sustainable travel
          </p>

          {/* Simple Search Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-gray-900 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSearch)} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 relative">
                <label htmlFor="destination-search" className="block text-sm font-semibold mb-2 text-gray-700">
                  Where to?
                </label>
                <input
                  {...register('destination', { required: true })}
                  id="destination-search"
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-lg"
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  autoComplete="off"
                />
                {showAutocomplete && watchDestination && filteredDestinations.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                    {filteredDestinations.slice(0, 5).map((dest, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          register('destination').onChange({ target: { value: dest.name } });
                          setShowAutocomplete(false);
                        }}
                      >
                        <div className="font-medium">{dest.name}</div>
                        <div className="text-sm text-gray-500">{dest.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="guest-count" className="block text-sm font-semibold mb-2 text-gray-700">
                  Guests
                </label>
                <select
                  {...register('guests')}
                  id="guest-count"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </form>

            <button
              type="submit"
              onClick={handleSubmit(onSearch)}
              className="w-full mt-6 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Search Adventures
            </button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Uganda
            </h2>
            <p className="text-xl text-gray-600">
              From mountain gorillas to powerful waterfalls
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {ugandaDestinations.slice(0, 8).map((destination, index) => (
              <Link
                key={index}
                href={getDestinationLink(destination.name)}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-48">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{destination.name}</h3>
                    <p className="text-sm text-gray-600">{destination.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Top Experiences
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked adventures across Uganda
              </p>
            </div>
            <Link
              href="/all-experiences"
              className="hidden md:inline-block text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {experiences.slice(0, 8).map(experience => (
              <Link key={experience.id} href={`/experiences/${experience.slug}`}>
                <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {experience.image.startsWith('/') ? (
                      <Image
                        src={experience.image}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-6xl"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        {experience.image}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold mb-2" style={{ color: primaryColor }}>
                      {experience.category}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{experience.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span>⭐ {experience.rating}</span>
                      <span>•</span>
                      <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                        ${experience.price}
                      </span>
                      <span className="text-sm text-gray-600">per person</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/all-experiences"
              className="inline-block text-white px-8 py-3 rounded-xl font-semibold transition-colors"
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
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Stays
              </h2>
              <p className="text-xl text-gray-600">
                Premium accommodations across Uganda
              </p>
            </div>
            <Link
              href="/view-all-properties"
              className="hidden md:inline-block text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {accommodations.slice(0, 8).map(accommodation => (
              <Link key={accommodation.id} href={`/accommodations/${accommodation.slug}`}>
                <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {accommodation.image.startsWith('/') ? (
                      <Image
                        src={accommodation.image}
                        alt={accommodation.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-6xl"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        {accommodation.image}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold mb-2" style={{ color: primaryColor }}>
                      {accommodation.category}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{accommodation.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span>⭐ {accommodation.rating}</span>
                      <span>•</span>
                      <span>{accommodation.type}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                        ${accommodation.price}
                      </span>
                      <span className="text-sm text-gray-600">per night</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/view-all-properties"
              className="inline-block text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Stays
            </Link>
          </div>
        </div>
      </section>

      {/* Green Paths Section */}
      <section className="py-20" style={{ backgroundColor: `${primaryColor}05` }}>
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Planting Green Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Travel with purpose. Every journey contributes to environmental conservation and community empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {greenPathsHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <div className="text-6xl mb-4">{highlight.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/planting-green-paths"
              className="inline-block text-white px-10 py-4 rounded-xl font-semibold text-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="content-section text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for Your Uganda Adventure?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join us in responsible, restorative travel in the Pearl of Africa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/all-experiences"
              className="bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              style={{ color: primaryColor }}
            >
              Explore Experiences
            </Link>
            <Link
              href="/about"
              className="border-2 border-white text-white hover:bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'white';
              }}
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
