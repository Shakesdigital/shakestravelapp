import React from 'react';
import { Metadata } from 'next';

// Base SEO configuration
export const seoConfig = {
  siteName: 'Shakes Travel',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://ugandaexplorer.com',
  description: 'Discover the Pearl of Africa with authentic adventures and comfortable accommodations. Book your Uganda experience today.',
  keywords: [
    'Uganda travel',
    'Africa safari',
    'gorilla trekking',
    'Uganda accommodations',
    'Pearl of Africa',
    'Uganda adventures',
    'East Africa tourism',
    'wildlife safari',
    'Uganda national parks',
    'cultural tours Uganda'
  ],
  defaultImage: '/images/og-default.jpg',
  twitterHandle: '@ugandaexplorer',
  fbAppId: process.env.NEXT_PUBLIC_FB_APP_ID,
};

// Generate base metadata
export function generateMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.siteName;
  const fullDescription = description || seoConfig.description;
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const fullImage = image ? `${seoConfig.siteUrl}${image}` : `${seoConfig.siteUrl}${seoConfig.defaultImage}`;
  const allKeywords = [...seoConfig.keywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      title: fullTitle,
      description: fullDescription,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };

  return metadata;
}

// Generate structured data for different content types
export function generateStructuredData(type: string, data: any) {
  const baseOrganization = {
    '@type': 'TravelAgency',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/images/logo.png`,
    sameAs: [
      'https://twitter.com/ugandaexplorer',
      'https://facebook.com/ugandaexplorer',
      'https://instagram.com/ugandaexplorer',
    ],
  };

  switch (type) {
    case 'trip':
      return {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: data.title,
        description: data.description,
        image: data.images?.map((img: string) => `${seoConfig.siteUrl}${img}`) || [],
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          validFrom: new Date().toISOString(),
        },
        provider: baseOrganization,
        location: {
          '@type': 'Place',
          name: data.location?.name,
          geo: data.location?.coordinates ? {
            '@type': 'GeoCoordinates',
            latitude: data.location.coordinates[1],
            longitude: data.location.coordinates[0],
          } : undefined,
        },
        duration: data.duration ? `P${data.duration}D` : undefined,
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      };

    case 'accommodation':
      return {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: data.title,
        description: data.description,
        image: data.images?.map((img: string) => `${seoConfig.siteUrl}${img}`) || [],
        address: {
          '@type': 'PostalAddress',
          streetAddress: data.location?.address,
          addressLocality: data.location?.name,
          addressCountry: 'Uganda',
        },
        geo: data.location?.coordinates ? {
          '@type': 'GeoCoordinates',
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0],
        } : undefined,
        priceRange: `$${data.price}`,
        amenityFeature: data.amenities?.map((amenity: string) => ({
          '@type': 'LocationFeatureSpecification',
          name: amenity,
        })) || [],
        aggregateRating: data.rating ? {
          '@type': 'AggregateRating',
          ratingValue: data.rating,
          reviewCount: data.reviewCount || 0,
          bestRating: 5,
          worstRating: 1,
        } : undefined,
      };

    case 'review':
      return {
        '@context': 'https://schema.org',
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: data.user?.name,
        },
        datePublished: data.createdAt,
        reviewBody: data.comment,
        name: data.title,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: data.rating,
          bestRating: 5,
          worstRating: 1,
        },
      };

    case 'breadcrumb':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item: any, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${seoConfig.siteUrl}${item.url}`,
        })),
      };

    case 'faq':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((faq: any) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      };

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        ...baseOrganization,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+256-XXX-XXXXXX',
          contactType: 'customer service',
          availableLanguage: ['English'],
        },
      };

    default:
      return null;
  }
}

// SEO metadata for different page types
export const seoMetadata = {
  home: generateMetadata({
    title: 'Discover Uganda - The Pearl of Africa',
    description: 'Explore Uganda\'s breathtaking adventures and comfortable accommodations. From gorilla trekking to luxury lodges, discover authentic experiences in the Pearl of Africa.',
    url: '/',
  }),

  trips: generateMetadata({
    title: 'Uganda Adventures & Safari Tours',
    description: 'Discover amazing adventures in Uganda. Gorilla trekking, wildlife safaris, cultural tours, and more. Book your authentic Uganda experience today.',
    url: '/trips',
    keywords: ['Uganda safari', 'gorilla trekking', 'wildlife tours', 'Uganda adventures'],
  }),

  accommodations: generateMetadata({
    title: 'Uganda Accommodations - Hotels, Lodges & Stays',
    description: 'Find the perfect place to stay in Uganda. From luxury safari lodges to budget-friendly hotels. Book comfortable accommodations for your Uganda adventure.',
    url: '/accommodations',
    keywords: ['Uganda hotels', 'safari lodges', 'Uganda accommodation', 'places to stay Uganda'],
  }),

  search: generateMetadata({
    title: 'Search Uganda Experiences',
    description: 'Find the perfect Uganda adventure or accommodation. Search by destination, price, and preferences to discover your ideal travel experience.',
    url: '/search',
  }),

  about: generateMetadata({
  title: 'About Shakes Travel',
  description: 'Learn about Shakes Travel, your trusted guide to authentic Uganda experiences. Discover why we\'re the leading platform for Uganda travel.',
    url: '/about',
    type: 'website',
  }),

  contact: generateMetadata({
  title: 'Contact Shakes Travel',
  description: 'Get in touch with Shakes Travel. We\'re here to help you plan the perfect Uganda adventure. Contact our expert travel consultants today.',
    url: '/contact',
  }),
};

// Component for injecting structured data
export function StructuredData({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Breadcrumb component with structured data
export function Breadcrumb({ items }: { items: Array<{ name: string; url: string }> }) {
  const structuredData = generateStructuredData('breadcrumb', { items });
  
  return (
    <>
      <nav className="text-sm text-gray-600 mb-4">
        {items.map((item, index) => (
          <span key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {index === items.length - 1 ? (
              <span className="text-gray-900">{item.name}</span>
            ) : (
              <a href={item.url} className="hover:text-gray-900">
                {item.name}
              </a>
            )}
          </span>
        ))}
      </nav>
      {structuredData && <StructuredData data={structuredData} />}
    </>
  );
}

// Generate sitemap data
export function generateSitemapUrls(data: {
  trips: any[];
  accommodations: any[];
  staticPages: string[];
}) {
  const baseUrl = seoConfig.siteUrl;
  const urls = [];

  // Static pages
  data.staticPages.forEach(page => {
    urls.push({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '/' ? 1.0 : 0.8,
    });
  });

  // Dynamic pages
  data.trips.forEach(trip => {
    urls.push({
      url: `${baseUrl}/trips/${trip._id}`,
      lastModified: new Date(trip.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    });
  });

  data.accommodations.forEach(accommodation => {
    urls.push({
      url: `${baseUrl}/accommodations/${accommodation._id}`,
      lastModified: new Date(accommodation.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    });
  });

  return urls;
}

// Generate robots.txt content
export function generateRobotsTxt() {
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${seoConfig.siteUrl}/sitemap.xml

# Block admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /checkout/
Disallow: /profile/

# Allow search engines to index images
User-agent: Googlebot-Image
Allow: /images/

# Crawl delay for other bots
User-agent: *
Crawl-delay: 1`;
}

export default {
  generateMetadata,
  generateStructuredData,
  seoMetadata,
  StructuredData,
  Breadcrumb,
  generateSitemapUrls,
  generateRobotsTxt,
};