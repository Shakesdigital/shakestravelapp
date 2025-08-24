'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdventureExperiencesProps {
  destinationName: string;
  destinationSlug: string;
}

interface Experience {
  id: number;
  title: string;
  location: string;
  category: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  highlights: string[];
  availability: string;
  groupSize: string;
  ecoFriendly: boolean;
  region: string;
}

const AdventureExperiences: React.FC<AdventureExperiencesProps> = ({ 
  destinationName, 
  destinationSlug 
}) => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const primaryColor = '#195e48';

  // Map destination slugs to search queries
  const getLocationQuery = (slug: string): string => {
    const locationMap: { [key: string]: string } = {
      'bwindi-impenetrable-forest': 'Bwindi',
      'queen-elizabeth-national-park': 'Queen Elizabeth',
      'murchison-falls-national-park': 'Murchison',
      'jinja': 'Jinja',
      'lake-bunyonyi': 'Bunyonyi',
      'kampala': 'Kampala',
      'kibale-forest': 'Kibale',
      'mount-elgon': 'Elgon',
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

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const locationQuery = getLocationQuery(destinationSlug);
        const response = await fetch(`/api/experiences?search=${encodeURIComponent(locationQuery)}&limit=6`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch experiences');
        }
        
        const data = await response.json();
        setExperiences(data.experiences || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load experiences');
        console.error('Error fetching experiences:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchExperiences();
    }
  }, [destinationSlug, destinationName, isMounted]);

  // Display limited or all experiences (6 for section layout)
  const displayedExperiences = showAll ? (experiences || []) : (experiences || []).slice(0, 6);

  // Fallback experiences if API doesn't return results
  const fallbackExperiences: Experience[] = [
    {
      id: 1,
      title: `Wildlife Safari in ${destinationName}`,
      location: destinationName,
      category: 'Wildlife Safari',
      duration: '1 Day',
      difficulty: 'Easy',
      rating: 4.5,
      reviews: 89,
      price: 150,
      originalPrice: 180,
      image: '🦁',
      description: `Discover the incredible wildlife of ${destinationName}`,
      highlights: ['Expert Guide', 'Wildlife Viewing', 'Photography'],
      availability: 'Daily',
      groupSize: '2-8 people',
      ecoFriendly: true,
      region: 'Uganda'
    },
    {
      id: 2,
      title: `Cultural Tour in ${destinationName}`,
      location: destinationName,
      category: 'Cultural Tour',
      duration: 'Half Day',
      difficulty: 'Easy',
      rating: 4.3,
      reviews: 67,
      price: 75,
      originalPrice: 90,
      image: '🏘️',
      description: `Experience local culture and traditions in ${destinationName}`,
      highlights: ['Local Guide', 'Cultural Immersion', 'Traditional Crafts'],
      availability: 'Daily',
      groupSize: '4-12 people',
      ecoFriendly: true,
      region: 'Uganda'
    },
    {
      id: 3,
      title: `Nature Walk in ${destinationName}`,
      location: destinationName,
      category: 'Hiking & Trekking',
      duration: '3 Hours',
      difficulty: 'Moderate',
      rating: 4.4,
      reviews: 45,
      price: 50,
      originalPrice: 65,
      image: '🥾',
      description: `Explore the natural beauty of ${destinationName} on foot`,
      highlights: ['Scenic Views', 'Nature Guide', 'Bird Watching'],
      availability: 'Daily',
      groupSize: '2-10 people',
      ecoFriendly: true,
      region: 'Uganda'
    }
  ];

  const experiencesToShow = (displayedExperiences && displayedExperiences.length > 0) ? displayedExperiences : fallbackExperiences.slice(0, 6);

  if (loading) {
    return (
      <section className="adventure-experiences" id="experiences-section">
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Adventure Experiences in {destinationName}
            </h2>
            <p className="text-xl text-gray-600">Loading amazing experiences...</p>
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
    <section className="adventure-experiences" id="experiences-section">
      <div className="content-section">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Adventure Experiences in {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Discover unforgettable adventures and activities that showcase the best of this incredible destination
          </p>
          <Link 
            href={`/trips?search=${encodeURIComponent(getLocationQuery(destinationSlug))}`}
            className="inline-block bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
          >
            View All Experiences →
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-sm">Unable to load experiences. Showing sample activities.</p>
          </div>
        )}

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {experiencesToShow.map((experience) => (
            <Link
              key={experience.id}
              href={`/trips/${experience.id}`}
              className="block group"
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect">
                {/* Experience Image */}
                <div 
                  className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <span aria-hidden="true">{experience.image}</span>
                  {experience.originalPrice > experience.price && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Save ${experience.originalPrice - experience.price}
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
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#195e48] transition-colors">
                    {experience.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">📍 {experience.location}</p>
                  
                  {/* Description */}
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{experience.description}</p>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(experience.highlights || []).slice(0, 3).map((highlight, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {highlight}
                        </span>
                      ))}
                      {experience.highlights.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{experience.highlights.length - 3} more
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
                  
                  {/* Difficulty and Availability */}
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                    <span>🏃‍♂️ {experience.difficulty}</span>
                    <span>📅 {experience.availability}</span>
                  </div>
                  
                  {/* Price and Eco Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {experience.originalPrice > experience.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ${experience.originalPrice}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[#195e48]">
                        ${experience.price}
                      </span>
                      <span className="text-sm text-gray-500">per person</span>
                    </div>
                    {experience.ecoFriendly && (
                      <div className="flex items-center space-x-1">
                        <span className="text-green-500 text-sm">🌿</span>
                        <span className="text-xs text-green-600 font-medium">Eco-Friendly</span>
                      </div>
                    )}
                  </div>

                  {/* Book Now Button */}
                  <button
                    className="w-full bg-[#195e48] text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-[#164439] transition-colors group-hover:shadow-md"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/trips/${experience.id}`;
                    }}
                  >
                    Book Experience
                  </button>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Show More/Less Button */}
        {experiences.length > 6 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-white border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
            >
              {showAll ? `Show Less Experiences` : `Show All ${experiences.length} Experiences`}
            </button>
          </div>
        )}

        {/* Empty State */}
        {experiences.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Experiences Found</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're currently updating our experiences for {destinationName}. Check back soon or explore other destinations.
            </p>
            <Link
              href="/trips"
              className="inline-block bg-[#195e48] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#164439] transition-colors"
            >
              Browse All Experiences
            </Link>
          </div>
        )}

        {/* Call to Action */}
        {experiences.length > 0 && (
          <div className="mt-16 text-center bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#195e48] mb-4">Planning Your {destinationName} Adventure?</h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Get personalized recommendations and expert advice from our local guides who know {destinationName} inside and out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#195e48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
              >
                Contact Our Experts
              </Link>
              <Link
                href="/trip-planner"
                className="border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdventureExperiences;
