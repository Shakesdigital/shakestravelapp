'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AccommodationsProps {
  destinationName: string;
  destinationSlug: string;
}

interface Accommodation {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  amenities: string[];
  roomType: string;
  availability: string;
  features: string[];
}

const Accommodations: React.FC<AccommodationsProps> = ({ 
  destinationName, 
  destinationSlug 
}) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const primaryColor = '#195e48';

  // Map destination slugs to search queries
  const getLocationQuery = (slug: string): string => {
    const locationMap: { [key: string]: string } = {
      'amboseli-national-park': 'Amboseli',
      'bwindi-impenetrable-national-park': 'Bwindi',
      'diani-beach': 'Diani',
      'hells-gate-national-park': 'Hell\'s Gate',
      'jinja': 'Jinja',
      'kibale-national-park': 'Kibale',
      'kidepo-valley-national-park': 'Kidepo',
      'lake-bunyonyi': 'Bunyonyi',
      'lake-mburo-national-park': 'Mburo',
      'lake-nakuru-national-park': 'Nakuru',
      'lake-turkana-national-parks': 'Turkana',
      'lamu-old-town': 'Lamu',
      'masai-mara-national-reserve': 'Masai Mara',
      'mount-elgon-national-park': 'Elgon',
      'mount-kenya-national-park': 'Mount Kenya',
      'murchison-falls-national-park': 'Murchison',
      'nairobi-national-park': 'Nairobi',
      'ngorongoro-conservation-area': 'Ngorongoro',
      'queen-elizabeth-national-park': 'Queen Elizabeth',
      'rwenzori-mountains-national-park': 'Rwenzori',
      'samburu-national-reserve': 'Samburu',
      'semuliki-valley-national-park': 'Semuliki',
      'serengeti-national-park': 'Serengeti',
      'tsavo-national-parks': 'Tsavo',
      'watamu-marine-park': 'Watamu',
      'kampala': 'Kampala',
      'mgahinga-gorilla-national-park': 'Mgahinga',
      'lake-victoria': 'Victoria',
      'sipi-falls': 'Sipi',
      'ziwa-rhino-sanctuary': 'Ziwa'
    };
    
    return locationMap[slug] || destinationName;
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch accommodations from API
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const locationQuery = getLocationQuery(destinationSlug);
        const response = await fetch(`/api/accommodations?search=${encodeURIComponent(locationQuery)}&limit=6`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch accommodations');
        }
        
        const data = await response.json();
        setAccommodations(data.accommodations || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load accommodations');
        console.error('Error fetching accommodations:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchAccommodations();
    }
  }, [destinationSlug, destinationName, isMounted]);

  // Display limited or all accommodations (6 for section layout)
  const displayedAccommodations = showAll ? (accommodations || []) : (accommodations || []).slice(0, 6);

  // Fallback accommodations if API doesn't return results
  const fallbackAccommodations: Accommodation[] = [
    {
      id: 1,
      name: `Eco Lodge in ${destinationName}`,
      location: destinationName,
      category: 'Eco Lodge',
      rating: 4.5,
      reviews: 89,
      price: 180,
      originalPrice: 220,
      image: '🏞️',
      description: `Sustainable accommodation in the heart of ${destinationName}`,
      amenities: ['Free WiFi', 'Restaurant', 'Eco-Friendly'],
      roomType: 'Standard Room',
      availability: 'Available',
      features: ['Scenic Views', 'Eco-Friendly', 'Local Cuisine']
    },
    {
      id: 2,
      name: `Safari Lodge ${destinationName}`,
      location: destinationName,
      category: 'Safari Lodge',
      rating: 4.3,
      reviews: 67,
      price: 250,
      originalPrice: 300,
      image: '🦁',
      description: `Experience wildlife up close at this safari lodge in ${destinationName}`,
      amenities: ['Game Drives', 'Restaurant', 'Bar'],
      roomType: 'Safari Tent',
      availability: 'Available',
      features: ['Wildlife Viewing', 'Adventure Activities', 'Local Guides']
    },
    {
      id: 3,
      name: `Resort in ${destinationName}`,
      location: destinationName,
      category: 'Resort',
      rating: 4.4,
      reviews: 123,
      price: 120,
      originalPrice: 150,
      image: '🏖️',
      description: `Comfortable resort accommodation in ${destinationName}`,
      amenities: ['Pool', 'Spa', 'Restaurant'],
      roomType: 'Deluxe Room',
      availability: 'Available',
      features: ['Comfortable Stay', 'Modern Amenities', 'Local Experience']
    }
  ];

  const accommodationsToShow = (displayedAccommodations && displayedAccommodations.length > 0) ? displayedAccommodations : fallbackAccommodations.slice(0, 6);

  if (loading) {
    return (
      <section className="accommodations" id="accommodations-section">
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Where to Stay in {destinationName}
            </h2>
            <p className="text-xl text-gray-600">Loading the best accommodations...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="loading-shimmer h-96 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="accommodations" id="accommodations-section">
      <div className="content-section">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Where to Stay in {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            From eco-friendly lodges to luxury resorts, find the perfect accommodation for your {destinationName} adventure
          </p>
          <Link 
            href={`/accommodations?search=${encodeURIComponent(getLocationQuery(destinationSlug))}`}
            className="inline-block bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
          >
            View All Accommodations →
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">Unable to load accommodations. Showing sample options.</p>
          </div>
        )}

        {/* Accommodations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accommodationsToShow.map((accommodation) => (
            <Link
              key={accommodation.id}
              href={`/accommodations/${accommodation.id}`}
              className="block group"
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect">
                {/* Accommodation Image */}
                <div 
                  className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <span aria-hidden="true">{accommodation.image}</span>
                  {accommodation.originalPrice > accommodation.price && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Save ${accommodation.originalPrice - accommodation.price}
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  {/* Category and Availability */}
                  <div className="flex justify-between items-center mb-3">
                    <span 
                      className="px-3 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {accommodation.category}
                    </span>
                    <span className={`text-sm px-2 py-1 rounded-full text-xs font-semibold ${
                      accommodation.availability === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {accommodation.availability}
                    </span>
                  </div>
                  
                  {/* Name and Location */}
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#195e48] transition-colors">
                    {accommodation.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {accommodation.location}</p>
                  
                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{accommodation.description}</p>
                  
                  {/* Room Type */}
                  <p className="text-sm font-medium text-gray-600 mb-3">
                    🏠 {accommodation.roomType}
                  </p>
                  
                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(accommodation.amenities || []).slice(0, 3).map((amenity, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {(accommodation.amenities || []).length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{(accommodation.amenities || []).length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Rating and Reviews */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center rating-stars">
                      {'★'.repeat(Math.floor(accommodation.rating))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {accommodation.rating} ({accommodation.reviews} reviews)
                    </span>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {(accommodation.features || []).slice(0, 2).map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {accommodation.originalPrice > accommodation.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${accommodation.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[#195e48]">
                        ${accommodation.price}
                      </span>
                      <span className="text-sm text-gray-500">per night</span>
                    </div>
                  </div>

                  {/* Book Now Button */}
                  <button
                    className="w-full bg-[#195e48] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#164439] transition-colors group-hover:shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== 'undefined') {
                        window.location.href = `/accommodations/${accommodation.id}`;
                      }
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Show More/Less Button */}
        {accommodations.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
            >
              {showAll ? `Show Less Accommodations` : `Show All ${accommodations.length} Accommodations`}
            </button>
          </div>
        )}

        {/* Empty State */}
        {accommodations.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Accommodations Found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're currently updating our accommodation listings for {destinationName}. Check back soon or explore other destinations.
            </p>
            <Link
              href="/accommodations"
              className="inline-block bg-[#195e48] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#164439] transition-colors"
            >
              Browse All Accommodations
            </Link>
          </div>
        )}

        {/* Call to Action */}
        {accommodations.length > 0 && (
          <div className="mt-16 text-center bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#195e48] mb-4">Need Help Choosing Your Stay?</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Our local experts can help you find the perfect accommodation in {destinationName} that matches your style and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#195e48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
              >
                Get Accommodation Advice
              </Link>
              <Link
                href={`/accommodations?search=${encodeURIComponent(getLocationQuery(destinationSlug))}`}
                className="border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
              >
                View All Options
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Accommodations;
