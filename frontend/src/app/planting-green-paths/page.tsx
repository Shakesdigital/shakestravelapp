import type { Metadata } from 'next';
import PlantingGreenPathsClient from './PlantingGreenPathsClient';
import GreenPathsStructuredData from '@/components/GreenPathsStructuredData';

export const metadata: Metadata = {
  title: 'Planting Green Paths - Sustainable Conservation Initiative | Shake\'s Travel',
  description: 'Join our Planting Green Paths initiative to conserve East Africa\'s biodiversity through sustainable adventure travel across Uganda, Kenya, Tanzania, and Rwanda. Plant trees, support communities, and offset your carbon footprint.',
  keywords: 'East Africa conservation, tree planting, sustainable tourism, eco travel, carbon offset, biodiversity protection, community tourism, green travel Uganda Kenya Tanzania Rwanda',
  openGraph: {
    title: 'Planting Green Paths - Conservation Through Adventure Travel',
    description: 'Experience East Africa while making a positive environmental impact. Join our tree planting initiatives and sustainable tourism programs across Uganda, Kenya, Tanzania, and Rwanda.',
    images: [
      {
        url: '/images/tree-planting-east-africa.jpg',
        width: 1200,
        height: 630,
        alt: 'Tree planting initiative in East Africa with local communities',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Planting Green Paths - Conservation Through Adventure Travel',
    description: 'Experience East Africa while making a positive environmental impact through our tree planting and conservation initiatives across four countries.',
    images: ['/images/tree-planting-east-africa.jpg'],
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