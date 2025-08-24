'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import HeroGallery from '@/components/Experiences/HeroGallery';
import ExperienceDetails from '@/components/Experiences/ExperienceDetails';
import BookingForm from '@/components/Experiences/BookingForm';
import RelatedExperiences from '@/components/Experiences/RelatedExperiences';

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

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(2);
  const [showBookingMobile, setShowBookingMobile] = useState(false);

  const primaryColor = '#195e48';

  // Sample experience data (in production, this would come from an API)
  const sampleExperience: Experience = {
    id: 1,
    title: 'Gorilla Trekking in Bwindi Impenetrable Forest',
    location: 'Bwindi Impenetrable Forest',
    region: 'Southwestern Uganda',
    category: 'Wildlife Safari',
    duration: '1 Day',
    difficulty: 'Moderate',
    rating: 4.9,
    reviews: 234,
    price: 800,
    originalPrice: 950,
    images: [
      '🦍', '🌿', '🥾', '📸', '🏞️', '👥'
    ],
    description: 'Embark on an unforgettable journey through the mist-covered mountains of southwestern Uganda to encounter endangered mountain gorillas in their natural habitat.',
    overview: 'Experience the magic of coming face-to-face with mountain gorillas in the UNESCO World Heritage site of Bwindi Impenetrable Forest. This once-in-a-lifetime adventure takes you deep into ancient rainforest where nearly half of the world\'s remaining mountain gorillas live. Led by expert trackers and guides, you\'ll navigate through dense vegetation to spend precious moments observing these magnificent creatures in their family groups.',
    highlights: [
      'Track endangered mountain gorillas with expert guides',
      'Spend up to 1 hour observing gorilla families',
      'Explore UNESCO World Heritage Bwindi Forest',
      'Small group experience (maximum 8 people)',
      'All permits and park fees included',
      'Professional photography opportunities',
      'Cultural visit to local Batwa community',
      'Certificate of participation'
    ],
    included: [
      'Gorilla trekking permit (included in price)',
      'Professional guide and tracker services',
      'Park entrance fees',
      'Trekking poles and walking sticks',
      'Bottled water and energy snacks',
      'Transportation from meeting point',
      'Batwa cultural experience',
      'Lunch at local eco-lodge',
      'Certificate of achievement',
      'Emergency evacuation insurance'
    ],
    itinerary: [
      {
        time: '6:00 AM',
        title: 'Early Morning Briefing',
        description: 'Meet at the park headquarters for registration, briefing about gorilla trekking rules, and assignment to gorilla families. Enjoy coffee and light breakfast.'
      },
      {
        time: '8:00 AM',
        title: 'Trek Begins',
        description: 'Start the trek into Bwindi Impenetrable Forest with your guide and tracker team. The trek can take 2-8 hours depending on gorilla location.'
      },
      {
        time: '10:00 AM - 2:00 PM',
        title: 'Gorilla Encounter',
        description: 'Once gorillas are found, spend up to 1 magical hour observing them. Watch them play, feed, and interact while maintaining a respectful distance.'
      },
      {
        time: '3:00 PM',
        title: 'Return Trek',
        description: 'Begin the return journey to park headquarters. Celebrate your achievement and receive your certificate.'
      },
      {
        time: '4:30 PM',
        title: 'Batwa Cultural Experience',
        description: 'Visit the indigenous Batwa community to learn about their traditional forest life and cultural practices.'
      },
      {
        time: '6:00 PM',
        title: 'Return to Accommodation',
        description: 'Return to your lodge for dinner and reflection on this incredible wildlife experience.'
      }
    ],
    additionalInfo: {
      cancellationPolicy: 'Free cancellation up to 48 hours before the experience. No refund within 48 hours due to limited permit availability.',
      whatToBring: [
        'Comfortable hiking boots with good grip',
        'Long pants and long-sleeved shirt',
        'Rain jacket or poncho',
        'Hat and sunglasses',
        'Camera with extra batteries',
        'Personal medications',
        'Small backpack',
        'Insect repellent',
        'Hand sanitizer'
      ],
      meetingPoint: 'Bwindi Impenetrable Forest Park Headquarters, Buhoma Gate',
      minAge: 15,
      maxGroupSize: 8,
      languages: ['English', 'Local languages with translation'],
      accessibility: 'Moderate fitness level required. Not suitable for mobility impairments due to challenging terrain.'
    },
    availability: {
      times: ['6:00 AM'],
      daysAvailable: ['Daily'],
      seasonality: 'Year-round availability. Dry seasons (June-August, December-February) offer easier trekking conditions.'
    },
    ecoFriendly: true,
    instantBooking: false,
    freeCancel: true,
    pickupIncluded: true
  };

  const sampleReviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩‍🦱',
      rating: 5,
      date: '2024-08-15',
      comment: 'Absolutely incredible experience! Our guide Moses was amazing and really knew how to track the gorillas. Seeing the silverback up close was emotional and unforgettable. The Batwa cultural visit was also very enlightening.',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar: '👨‍💼',
      rating: 5,
      date: '2024-08-10',
      comment: 'Best wildlife experience of my life. The organization was perfect and the guides were very knowledgeable. The trek was challenging but so worth it. Highly recommend booking in advance!',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Thompson',
      avatar: '👩‍🏫',
      rating: 4,
      date: '2024-08-05',
      comment: 'Amazing experience though quite physically demanding. Make sure you\'re in good shape! The hour with the gorilla family passed so quickly. Great value for money considering everything included.',
      verified: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setExperience(sampleExperience);
      setReviews(sampleReviews);
      setLoading(false);
    }, 1000);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="h-96 bg-gray-200"></div>
        <div className="content-section py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Experience not found</h1>
          <p className="text-gray-600 mb-6">The experience you're looking for doesn't exist.</p>
          <Link 
            href="/all-experiences"
            className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: primaryColor }}
          >
            Browse All Experiences
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    return experience.price * participants;
  };

  const handleBookingSubmit = (bookingData: any) => {
    // Handle booking submission
    console.log('Booking submitted:', bookingData);
    router.push(`/checkout/${experience.id}?date=${selectedDate}&time=${selectedTime}&participants=${participants}`);
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": experience.title,
    "description": experience.description,
    "image": experience.images,
    "location": {
      "@type": "Place",
      "name": experience.location,
      "address": {
        "@type": "PostalAddress",
        "addressRegion": experience.region,
        "addressCountry": "Uganda"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": experience.price,
      "priceCurrency": "USD",
      "availability": "InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": experience.rating,
      "reviewCount": experience.reviews,
      "bestRating": 5,
      "worstRating": 1
    },
    "duration": experience.duration,
    "category": experience.category
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Gallery Section */}
        <HeroGallery 
          images={experience.images}
          title={experience.title}
          location={experience.location}
          rating={experience.rating}
          reviews={experience.reviews}
          category={experience.category}
          ecoFriendly={experience.ecoFriendly}
          instantBooking={experience.instantBooking}
          freeCancel={experience.freeCancel}
          pickupIncluded={experience.pickupIncluded}
        />

        {/* Main Content */}
        <div className="content-section py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Experience Details */}
            <div className="lg:col-span-2">
              <ExperienceDetails 
                experience={experience}
                reviews={reviews}
              />
            </div>

            {/* Right Column - Booking Form (Desktop) */}
            <div className="hidden lg:block">
              <BookingForm 
                experience={experience}
                onBookingSubmit={handleBookingSubmit}
                isSticky={true}
              />
            </div>
          </div>
        </div>

        {/* Related Experiences */}
        <RelatedExperiences 
          currentExperienceId={experience.id}
          category={experience.category}
          region={experience.region}
        />

        {/* Mobile Booking Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">From</div>
              <div className="text-2xl font-bold" style={{ color: primaryColor }}>
                ${experience.price}
              </div>
            </div>
            <button
              onClick={() => setShowBookingMobile(true)}
              className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
              style={{ backgroundColor: primaryColor }}
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Mobile Booking Overlay */}
        {showBookingMobile && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Book Experience</h3>
                  <button
                    onClick={() => setShowBookingMobile(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <BookingForm 
                  experience={experience}
                  onBookingSubmit={(data) => {
                    setShowBookingMobile(false);
                    handleBookingSubmit(data);
                  }}
                  isSticky={false}
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}