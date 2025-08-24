'use client';

import React from 'react';

const GreenPathsStructuredData: React.FC = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "Planting Green Paths - Sustainable Conservation Initiative",
    "description": "Experience Uganda's wonders through sustainable adventure travel that supports conservation and local communities. Join our tree planting initiative and eco-friendly tours.",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/planting-green-paths`,
    "image": [
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/images/tree-planting-uganda.jpg`,
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/images/uganda-conservation.jpg`,
      `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/images/eco-tourism-uganda.jpg`
    ],
    "touristType": ["EcoTourist", "AdventureTourist", "CulturalTourist"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "1.3733",
      "longitude": "32.2903"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressRegion": "Uganda"
    },
    "provider": {
      "@type": "Organization",
      "name": "Shake's Travel",
      "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com',
      "logo": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/logo.png`,
      "sameAs": [
        "https://facebook.com/shakestravel",
        "https://instagram.com/shakestravel",
        "https://twitter.com/shakestravel"
      ]
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Tree Planter Package",
        "description": "Plant 10 trees with digital certificate and impact updates",
        "price": "25",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "category": "Conservation"
      },
      {
        "@type": "Offer",
        "name": "Forest Guardian Package",
        "description": "Plant 50 trees with GPS coordinates and quarterly reports",
        "price": "100",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "category": "Conservation"
      },
      {
        "@type": "Offer",
        "name": "Planting Expedition",
        "description": "Join us in Uganda for hands-on planting with 3-day eco-tour",
        "price": "500",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "category": "Experience"
      }
    ],
    "activity": [
      {
        "@type": "Activity",
        "name": "Tree Planting",
        "description": "Participate in reforestation efforts across Uganda"
      },
      {
        "@type": "Activity", 
        "name": "Eco Tours",
        "description": "Sustainable wildlife and cultural experiences"
      },
      {
        "@type": "Activity",
        "name": "Conservation Education",
        "description": "Learn about biodiversity and environmental protection"
      }
    ],
    "keywords": [
      "Uganda conservation",
      "tree planting",
      "sustainable tourism",
      "eco travel",
      "carbon offset",
      "biodiversity protection",
      "community tourism",
      "green travel Uganda",
      "environmental conservation",
      "reforestation"
    ],
    "hasMap": "https://maps.google.com/?q=Uganda",
    "isAccessibleForFree": false,
    "publicAccess": true
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shake's Travel",
    "alternateName": "Shake's Travel Uganda",
    "description": "Sustainable adventure travel company specializing in eco-friendly Uganda experiences and conservation initiatives.",
    "url": process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com',
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/logo.png`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.com'}/images/shakes-travel-team.jpg`,
    "telephone": "+256-XXX-XXXXX",
    "email": "info@shakestravel.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Travel Street",
      "addressLocality": "Kampala",
      "addressRegion": "Central Region",
      "postalCode": "XXXXX",
      "addressCountry": "UG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "0.3476",
      "longitude": "32.5825"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Uganda"
    },
    "serviceType": [
      "Eco Tourism",
      "Adventure Travel",
      "Conservation Tours",
      "Cultural Experiences",
      "Sustainable Accommodations"
    ],
    "sameAs": [
      "https://facebook.com/shakestravel",
      "https://instagram.com/shakestravel",
      "https://twitter.com/shakestravel",
      "https://linkedin.com/company/shakestravel"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData)
        }}
      />
    </>
  );
};

export default GreenPathsStructuredData;