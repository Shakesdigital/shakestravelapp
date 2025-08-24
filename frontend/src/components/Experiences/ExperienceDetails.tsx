'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Experience {
  id: number;
  title: string;
  location: string;
  region: string;
  category: string;
  duration: string;
  difficulty: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  overview: string;
  highlights: string[];
  included: string[];
  itinerary: Array<{
    time?: string;
    title: string;
    description: string;
  }>;
  additionalInfo: {
    cancellationPolicy: string;
    whatToBring: string[];
    meetingPoint: string;
    minAge?: number;
    maxGroupSize: number;
    languages: string[];
    accessibility: string;
  };
  availability: {
    times: string[];
    daysAvailable: string[];
    seasonality?: string;
  };
  ecoFriendly: boolean;
  instantBooking: boolean;
  freeCancel: boolean;
  pickupIncluded: boolean;
}

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ExperienceDetailsProps {
  experience: Experience;
  reviews: Review[];
}

const ExperienceDetails: React.FC<ExperienceDetailsProps> = ({
  experience,
  reviews
}) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const primaryColor = '#195e48';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'itinerary', label: 'Itinerary', icon: '🗓️' },
    { id: 'included', label: 'What\'s Included', icon: '✅' },
    { id: 'additional', label: 'Additional Info', icon: 'ℹ️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto" aria-label="Experience details navigation">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`flex-shrink-0 px-4 py-4 text-sm font-medium transition-colors border-b-2 ${
                activeSection === section.id
                  ? 'border-current text-white'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
              style={{
                backgroundColor: activeSection === section.id ? primaryColor : 'transparent',
                borderBottomColor: activeSection === section.id ? primaryColor : 'transparent'
              }}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              <span className="mr-2" aria-hidden="true">{section.icon}</span>
              {section.label}
              {section.id === 'reviews' && (
                <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {reviews.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 space-y-8">
        {/* Overview Section */}
        <section id="overview" className="scroll-mt-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Experience Overview</h2>
            
            {/* Key Details Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">⏰</div>
                <div className="text-sm text-gray-600">Duration</div>
                <div className="font-semibold">{experience.duration}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🏃‍♂️</div>
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className="font-semibold">{experience.difficulty}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">👥</div>
                <div className="text-sm text-gray-600">Max Group</div>
                <div className="font-semibold">{experience.additionalInfo.maxGroupSize} people</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">🗣️</div>
                <div className="text-sm text-gray-600">Languages</div>
                <div className="font-semibold">{experience.additionalInfo.languages.join(', ')}</div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {experience.overview}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Experience Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {experience.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Itinerary Section */}
        <section id="itinerary" className="scroll-mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Day Itinerary</h2>
          <div className="space-y-4">
            {experience.itinerary.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-sm">
                      {item.time || `${index + 1}`}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What's Included Section */}
        <section id="included" className="scroll-mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {experience.included.map((item, index) => (
              <div key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Information Section */}
        <section id="additional" className="scroll-mt-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
          
          <div className="space-y-6">
            {/* Meeting Point */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📍 Meeting Point</h4>
              <p className="text-gray-700">{experience.additionalInfo.meetingPoint}</p>
            </div>

            {/* What to Bring */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🎒 What to Bring</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {experience.additionalInfo.whatToBring.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age and Accessibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.additionalInfo.minAge && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">👶 Minimum Age</h4>
                  <p className="text-gray-700">{experience.additionalInfo.minAge} years old</p>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">♿ Accessibility</h4>
                <p className="text-gray-700">{experience.additionalInfo.accessibility}</p>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🔄 Cancellation Policy</h4>
              <p className="text-gray-700">{experience.additionalInfo.cancellationPolicy}</p>
            </div>

            {/* Availability */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">📅 Availability</h4>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <strong>Days:</strong> {experience.availability.daysAvailable.join(', ')}
                </p>
                <p className="text-gray-700">
                  <strong>Times:</strong> {experience.availability.times.join(', ')}
                </p>
                {experience.availability.seasonality && (
                  <p className="text-gray-700">
                    <strong>Best Season:</strong> {experience.availability.seasonality}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="scroll-mt-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
            <div className="flex items-center">
              <div className="flex items-center text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(experience.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {experience.rating} ({experience.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4 text-2xl">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-semibold text-gray-900">{review.name}</h4>
                        {review.verified && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center text-yellow-400 mr-2">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
            
            {!showAllReviews && reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(true)}
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Show All {reviews.length} Reviews
              </button>
            )}

            {showAllReviews && reviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(false)}
                className="w-full py-3 border-2 border-gray-200 hover:border-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
              >
                Show Less
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExperienceDetails;