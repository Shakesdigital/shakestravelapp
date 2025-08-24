import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Adventure Categories | Shakes Travel Uganda',
    default: 'Adventure Categories | Shakes Travel Uganda'
  },
  description: 'Explore Uganda\'s diverse adventure categories - from wildlife safaris to cultural tours, hiking adventures to water sports. Sustainable tourism experiences in the Pearl of Africa.',
  keywords: ['Uganda adventures', 'safari tours', 'hiking Uganda', 'cultural tours', 'water sports Uganda', 'extreme sports', 'sustainable tourism'],
  openGraph: {
    title: 'Adventure Categories | Shakes Travel Uganda',
    description: 'Discover diverse adventure experiences across Uganda - wildlife safaris, mountain hiking, cultural immersion, and thrilling water sports.',
    type: 'website',
    siteName: 'Shakes Travel Uganda'
  }
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}