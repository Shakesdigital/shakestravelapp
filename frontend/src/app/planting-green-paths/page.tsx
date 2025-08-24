import type { Metadata } from 'next';
import PlantingGreenPathsClient from './PlantingGreenPathsClient';
import GreenPathsStructuredData from '@/components/GreenPathsStructuredData';

export const metadata: Metadata = {
  title: 'Planting Green Paths - Sustainable Conservation Initiative | Shake\'s Travel',
  description: 'Join our Planting Green Paths initiative to conserve Uganda\'s biodiversity through sustainable adventure travel. Plant trees, support communities, and offset your carbon footprint while exploring the Pearl of Africa.',
  keywords: 'Uganda conservation, tree planting, sustainable tourism, eco travel, carbon offset, biodiversity protection, community tourism, green travel Uganda',
  openGraph: {
    title: 'Planting Green Paths - Conservation Through Adventure Travel',
    description: 'Experience Uganda while making a positive environmental impact. Join our tree planting initiatives and sustainable tourism programs.',
    images: [
      {
        url: '/images/tree-planting-uganda.jpg',
        width: 1200,
        height: 630,
        alt: 'Tree planting initiative in Uganda with local communities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planting Green Paths - Conservation Through Adventure Travel',
    description: 'Experience Uganda while making a positive environmental impact through our tree planting and conservation initiatives.',
    images: ['/images/tree-planting-uganda.jpg'],
  },
};

export default function PlantingGreenPathsPage() {
  return (
    <>
      <GreenPathsStructuredData />
      <PlantingGreenPathsClient />
    </>
  );
}