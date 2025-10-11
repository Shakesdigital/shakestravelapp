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
    // East Africa destinations that users click on from home page
    { destination: 'amboseli-national-park' },
    { destination: 'bwindi-impenetrable-national-park' },
    { destination: 'diani-beach' },
    { destination: 'hells-gate-national-park' },
    { destination: 'jinja' },
    { destination: 'kibale-national-park' },
    { destination: 'kidepo-valley-national-park' },
    { destination: 'lake-bunyonyi' },
    { destination: 'lake-mburo-national-park' },
    { destination: 'lake-nakuru-national-park' },
    { destination: 'lake-turkana-national-parks' },
    { destination: 'lamu-old-town' },
    { destination: 'masai-mara-national-reserve' },
    { destination: 'mount-elgon-national-park' },
    { destination: 'mount-kenya-national-park' },
    { destination: 'murchison-falls-national-park' },
    { destination: 'nairobi-national-park' },
    { destination: 'ngorongoro-conservation-area' },
    { destination: 'queen-elizabeth-national-park' },
    { destination: 'rwenzori-mountains-national-park' },
    { destination: 'samburu-national-reserve' },
    { destination: 'semuliki-valley-national-park' },
    { destination: 'serengeti-national-park' },
    { destination: 'tsavo-national-parks' },
    { destination: 'watamu-marine-park' },
    { destination: 'kampala' },
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
    // East Africa destinations
    'amboseli-national-park',
    'bwindi-impenetrable-national-park',
    'diani-beach',
    'hells-gate-national-park',
    'jinja',
    'kibale-national-park',
    'kidepo-valley-national-park',
    'lake-bunyonyi',
    'lake-mburo-national-park',
    'lake-nakuru-national-park',
    'lake-turkana-national-parks',
    'lamu-old-town',
    'masai-mara-national-reserve',
    'mount-elgon-national-park',
    'mount-kenya-national-park',
    'murchison-falls-national-park',
    'nairobi-national-park',
    'ngorongoro-conservation-area',
    'queen-elizabeth-national-park',
    'rwenzori-mountains-national-park',
    'samburu-national-reserve',
    'semuliki-valley-national-park',
    'serengeti-national-park',
    'tsavo-national-parks',
    'watamu-marine-park',
    'kampala',
    // Legacy destinations (for backward compatibility)
    'bwindi',
    'murchison-falls',
    'queen-elizabeth',
    'kibale-national-park',
    'kidepo-valley',
    'kidepo',
    // Variants of existing destinations
    'murchison-falls-national-park',
    'queen-elizabeth-national-park',
    'kibale-forest',
    'mount-elgon',
    'mgahinga-gorilla-national-park',
    'lake-victoria',
    'sipi-falls',
    'ziwa-rhino-sanctuary',
    'mount-rwenzori',
    'fort-portal'
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