'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TestimonialsProps {
  destinationName: string;
  destinationSlug: string;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  experience: string;
  date: string;
  avatar: string;
  verified: boolean;
  highlights: string[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ destinationName, destinationSlug }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const primaryColor = '#195e48';

  // Get destination-specific testimonials
  const getDestinationTestimonials = (slug: string): Testimonial[] => {
    const testimonialMap: { [key: string]: Testimonial[] } = {
      'bwindi-impenetrable-forest': [
        {
          id: 1,
          name: 'Sarah Williams',
          location: 'London, UK',
          rating: 5,
          review: 'Seeing the mountain gorillas in their natural habitat was absolutely life-changing. Our guide was incredibly knowledgeable and the entire experience exceeded all expectations. The trek was challenging but so worth it!',
          experience: 'Gorilla Trekking',
          date: '2024-01-15',
          avatar: '👩‍🦰',
          verified: true,
          highlights: ['Excellent Guide', 'Life-Changing', 'Well Organized']
        },
        {
          id: 2,
          name: 'Michael Chen',
          location: 'San Francisco, USA',
          rating: 5,
          review: 'The conservation work being done in Bwindi is remarkable. Not only did we have an incredible wildlife experience, but we also learned so much about protecting these amazing creatures. A must-visit destination!',
          experience: 'Conservation Tour',
          date: '2024-02-20',
          avatar: '👨‍💼',
          verified: true,
          highlights: ['Educational', 'Conservation Focus', 'Professional Service']
        },
        {
          id: 3,
          name: 'Emma Thompson',
          location: 'Melbourne, Australia',
          rating: 5,
          review: 'From the moment we arrived, everything was perfectly organized. The lodge was comfortable, the food was excellent, and the gorilla encounter was beyond magical. Thank you for an unforgettable adventure!',
          experience: 'Luxury Gorilla Experience',
          date: '2024-03-10',
          avatar: '👩‍🏫',
          verified: true,
          highlights: ['Luxury Experience', 'Perfect Organization', 'Magical Moments']
        },
        {
          id: 4,
          name: 'David Rodriguez',
          location: 'Madrid, Spain',
          rating: 4,
          review: 'The biodiversity in Bwindi is incredible! Beyond the gorillas, we saw so many bird species and learned about the ecosystem. Our local guide shared fascinating insights about the forest and local culture.',
          experience: 'Biodiversity Tour',
          date: '2024-01-28',
          avatar: '👨‍🔬',
          verified: true,
          highlights: ['Biodiversity Rich', 'Cultural Insights', 'Local Expertise']
        }
      ],
      'queen-elizabeth-national-park': [
        {
          id: 5,
          name: 'Lisa Johnson',
          location: 'Toronto, Canada',
          rating: 5,
          review: 'The tree-climbing lions were absolutely incredible to see! The Kazinga Channel boat cruise was also a highlight - so many hippos and elephants. Our safari guide was fantastic and really knew where to find the animals.',
          experience: 'Complete Safari Package',
          date: '2024-02-05',
          avatar: '👩‍💻',
          verified: true,
          highlights: ['Tree-Climbing Lions', 'Great Wildlife Viewing', 'Expert Guide']
        },
        {
          id: 6,
          name: 'James Mitchell',
          location: 'Cape Town, South Africa',
          rating: 5,
          review: 'Queen Elizabeth delivered everything we hoped for and more. The diversity of landscapes and animals is stunning. From savanna to wetlands, every game drive brought new surprises. Highly recommend!',
          experience: 'Photography Safari',
          date: '2024-03-15',
          avatar: '👨‍🎨',
          verified: true,
          highlights: ['Photography Paradise', 'Diverse Landscapes', 'Constant Surprises']
        },
        {
          id: 7,
          name: 'Rachel Green',
          location: 'New York, USA',
          rating: 4,
          review: 'Amazing wildlife experience! We were lucky to see all the Big 4 (no rhinos in Uganda) plus the famous tree lions. The accommodation was comfortable and the staff were incredibly friendly.',
          experience: 'Big Game Safari',
          date: '2024-01-22',
          avatar: '👩‍🎨',
          verified: true,
          highlights: ['Big Game Viewing', 'Comfortable Lodge', 'Friendly Staff']
        }
      ],
      'jinja': [
        {
          id: 8,
          name: 'Tom Wilson',
          location: 'Sydney, Australia',
          rating: 5,
          review: 'The white water rafting on the Nile was absolutely thrilling! Grade 5 rapids got the adrenaline pumping. The safety briefing was thorough and the guides were experienced. An adventure I\'ll never forget!',
          experience: 'Nile Rafting Adventure',
          date: '2024-02-12',
          avatar: '👨‍💪',
          verified: true,
          highlights: ['Thrilling Rapids', 'Safety Focused', 'Experienced Guides']
        },
        {
          id: 9,
          name: 'Sofia Martinez',
          location: 'Barcelona, Spain',
          rating: 5,
          review: 'Jinja exceeded our expectations! The Source of the Nile was historically fascinating, and the bungee jump was the highlight of our Uganda trip. Perfect mix of adventure and culture.',
          experience: 'Adventure Package',
          date: '2024-03-01',
          avatar: '👩‍🎓',
          verified: true,
          highlights: ['Historical Interest', 'Perfect Adventure Mix', 'Cultural Value']
        },
        {
          id: 10,
          name: 'Alex Kumar',
          location: 'Mumbai, India',
          rating: 4,
          review: 'Great base for Nile activities! The sunset boat cruise was peaceful and beautiful. Staff arranged everything perfectly and the local food recommendations were excellent. Will definitely return!',
          experience: 'Cultural & Leisure',
          date: '2024-01-30',
          avatar: '👨‍🍳',
          verified: true,
          highlights: ['Perfect Organization', 'Beautiful Sunsets', 'Excellent Service']
        }
      ]
    };

    // Default testimonials for all destinations
    const defaultTestimonials: Testimonial[] = [
      {
        id: 11,
        name: 'Jennifer Adams',
        location: 'London, UK',
        rating: 5,
        review: `${destinationName} was absolutely incredible! The natural beauty and wildlife exceeded all our expectations. Our local guide was knowledgeable and passionate about conservation.`,
        experience: 'Wildlife Safari',
        date: '2024-02-15',
        avatar: '👩‍🌾',
        verified: true,
        highlights: ['Natural Beauty', 'Knowledgeable Guide', 'Conservation Focus']
      },
      {
        id: 12,
        name: 'Robert Taylor',
        location: 'Chicago, USA',
        rating: 4,
        review: `A fantastic experience in ${destinationName}! The organization was perfect and we saw so much wildlife. The accommodation was comfortable and the food was delicious.`,
        experience: 'Complete Package',
        date: '2024-01-20',
        avatar: '👨‍🏭',
        verified: true,
        highlights: ['Well Organized', 'Great Wildlife', 'Comfortable Stay']
      },
      {
        id: 13,
        name: 'Marie Dubois',
        location: 'Paris, France',
        rating: 5,
        review: `${destinationName} offers such unique experiences! The combination of adventure and cultural learning made this trip special. We loved every moment of our Uganda adventure.`,
        experience: 'Cultural Adventure',
        date: '2024-03-05',
        avatar: '👩‍🎨',
        verified: true,
        highlights: ['Unique Experiences', 'Cultural Learning', 'Adventure Focus']
      }
    ];

    return testimonialMap[slug] || defaultTestimonials;
  };

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulate API call
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = getDestinationTestimonials(destinationSlug);
        setTestimonials(data);
      } catch (err) {
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (isMounted) {
      fetchTestimonials();
    }
  }, [destinationSlug, isMounted]);

  // Auto-advance testimonials
  useEffect(() => {
    if (testimonials.length === 0 || !isMounted) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, isMounted]);

  if (loading) {
    return (
      <section className="testimonials" id="testimonials-section">
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What People Say About {destinationName}
            </h2>
            <p className="text-xl text-gray-600">Loading traveler experiences...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="loading-shimmer h-64 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const averageRating = (testimonials || []).length > 0 ? (testimonials || []).reduce((sum, t) => sum + t.rating, 0) / (testimonials || []).length : 0;
  const totalReviews = (testimonials || []).length;

  return (
    <section className="testimonials" id="testimonials-section">
      <div className="content-section">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What People Say About {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Real experiences from travelers who have discovered the magic of {destinationName}
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex items-center">
              <div className="flex items-center rating-stars text-xl">
                {'★'.repeat(Math.floor(averageRating))}
                {averageRating % 1 !== 0 && <span className="text-gray-300">★</span>}
              </div>
              <span className="ml-2 text-2xl font-bold text-[#195e48]">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-500">based on {totalReviews} reviews</span>
          </div>

          <Link 
            href="/reviews"
            className="inline-block bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
          >
            Read All Reviews →
          </Link>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-6">
              <span className="text-6xl mb-4 block">{testimonials[currentTestimonial]?.avatar || '👤'}</span>
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center rating-stars text-xl text-yellow-400">
                  {'★'.repeat(testimonials[currentTestimonial]?.rating || 5)}
                </div>
              </div>
            </div>
            
            <blockquote className="text-xl md:text-2xl text-gray-700 text-center mb-8 leading-relaxed italic">
              "{testimonials[currentTestimonial]?.review}"
            </blockquote>
            
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-lg">
                {testimonials[currentTestimonial]?.name}
              </p>
              <p className="text-gray-500 mb-4">
                {testimonials[currentTestimonial]?.location} • {testimonials[currentTestimonial]?.experience}
              </p>
              
              {/* Highlights */}
              <div className="flex flex-wrap justify-center gap-2">
                {(testimonials[currentTestimonial]?.highlights || []).map((highlight, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 text-xs rounded-full font-medium"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {(testimonials || []).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentTestimonial 
                    ? 'bg-[#195e48] scale-110' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(testimonials || []).slice(0, 6).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
                {testimonial.verified && (
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                    ✓ Verified
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center rating-stars text-yellow-400">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-600">{testimonial.rating}.0</span>
              </div>
              
              {/* Review */}
              <p className="text-gray-700 mb-4 line-clamp-4">
                "{testimonial.review}"
              </p>
              
              {/* Experience and Date */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-[#195e48] mb-2">
                  {testimonial.experience}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Create Your Own Story?</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Join hundreds of travelers who have discovered the magic of {destinationName}. Let us help you plan your unforgettable adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#195e48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
            >
              Start Planning Your Trip
            </Link>
            <Link
              href={`/trips?search=${encodeURIComponent(destinationName)}`}
              className="border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
            >
              Browse Experiences
            </Link>
          </div>
        </div>

        {/* Review Statistics */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-[#195e48] mb-2">{totalReviews}</div>
            <p className="text-gray-600 text-sm">Happy Travelers</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-[#195e48] mb-2">{averageRating.toFixed(1)}</div>
            <p className="text-gray-600 text-sm">Average Rating</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-[#195e48] mb-2">
              {totalReviews > 0 ? Math.round(((testimonials || []).filter(t => t.rating === 5).length / totalReviews) * 100) : 0}%
            </div>
            <p className="text-gray-600 text-sm">5-Star Reviews</p>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-[#195e48] mb-2">100%</div>
            <p className="text-gray-600 text-sm">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
