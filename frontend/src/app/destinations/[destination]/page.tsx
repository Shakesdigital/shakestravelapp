import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import HeroGallery from '@/components/Destinations/HeroGallery';
import DestinationDescription from '@/components/Destinations/DestinationDescription';
import AdventureExperiences from '@/components/Destinations/AdventureExperiences';
import Accommodations from '@/components/Destinations/Accommodations';
import TravelInsights from '@/components/Destinations/TravelInsights';
import FAQs from '@/components/Destinations/FAQs';
import Testimonials from '@/components/Destinations/Testimonials';

interface DestinationPageProps {
  params: Promise<{
    destination: string;
  }>;
}

// Generate static params for all destinations
export async function generateStaticParams() {
  return [
    // Countries
    { destination: 'uganda' },
    { destination: 'rwanda' },
    { destination: 'kenya' },
    { destination: 'tanzania' },
    { destination: 'bwindi' },
    { destination: 'jinja' },
    // Popular destinations that users click on from home page
    { destination: 'bwindi-impenetrable-forest' },
    { destination: 'queen-elizabeth-national-park' },
    { destination: 'murchison-falls-national-park' },
    { destination: 'lake-bunyonyi' },
    { destination: 'kampala' },
    { destination: 'kibale-forest' },
    { destination: 'mount-elgon' },
    { destination: 'mgahinga-gorilla-national-park' },
    { destination: 'lake-victoria' },
    { destination: 'sipi-falls' },
    { destination: 'ziwa-rhino-sanctuary' },
    { destination: 'kidepo-valley-national-park' },
    { destination: 'fort-portal' },
    { destination: 'mount-rwenzori' },
  ];
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { destination } = await params;
  
  // Decode the destination parameter
  const destinationName = decodeURIComponent(destination);
  
  // List of valid destinations (countries and specific locations)
  const validDestinations = [
    // Countries
    'uganda',
    'rwanda',
    'kenya',
    'tanzania',
    'bwindi',
    'jinja',
    // All mapped destinations from the destinations.ts file
    'bwindi-impenetrable-forest',
    'queen-elizabeth-national-park',
    'murchison-falls-national-park',
    'lake-bunyonyi',
    'kampala',
    'kibale-forest',
    'mount-elgon',
    'mgahinga-gorilla-national-park',
    'lake-victoria',
    'sipi-falls',
    'ziwa-rhino-sanctuary',
    'kidepo-valley-national-park',
    'fort-portal',
    'mount-rwenzori',
    // Additional slugs for destinations that might be accessed
    'murchison-falls',
    'queen-elizabeth',
    'kibale-national-park',
    'mt-elgon',
    'mt-rwenzori',
    'kidepo-valley',
    'kidepo'
  ];

  // Check if destination is valid
  if (!validDestinations.includes(destination.toLowerCase())) {
    notFound();
  }

  // Convert slug to readable name
  const getReadableName = (slug: string): string => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const readableDestinationName = getReadableName(destination);

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": readableDestinationName,
    "description": `Explore ${readableDestinationName} in Uganda with comprehensive travel information, experiences, accommodations, and local insights.`,
    "url": `https://shakestravelapp.com/destinations/${destination}`,
    "touristType": ["Eco Tourist", "Adventure Tourist", "Wildlife Tourist"],
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "Uganda"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Hero Gallery Section */}
        <HeroGallery destinationName={readableDestinationName} destinationSlug={destination} />
        
        {/* Breadcrumb Navigation */}
        <nav className="content-section py-4 border-b border-gray-200" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#195e48] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/#destinations" className="hover:text-[#195e48] transition-colors">
                Destinations
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-gray-900 font-medium" aria-current="page">
              {readableDestinationName}
            </li>
          </ol>
        </nav>
        
        {/* Main Content Area */}
        <div className="bg-white">
          {/* Destination Description Section */}
          <section className="py-16 bg-white w-full">
            <DestinationDescription destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
          
          {/* Adventure Experiences Section */}
          <section className="py-20 bg-gray-25 w-full" style={{ backgroundColor: '#fafafa' }}>
            <AdventureExperiences destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
          
          {/* Accommodations Section */}
          <section className="py-20 bg-white w-full">
            <Accommodations destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
          
          {/* Travel Insights Section */}
          <section className="py-20 w-full" style={{ backgroundColor: '#f8fffe' }}>
            <TravelInsights destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
          
          {/* FAQs Section */}
          <section className="py-20 bg-white w-full">
            <FAQs destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
          
          {/* Testimonials Section */}
          <section className="py-20 w-full" style={{ backgroundColor: '#f0fdf4' }}>
            <Testimonials destinationName={readableDestinationName} destinationSlug={destination} />
          </section>
        </div>
      </div>
    </>
  );
}