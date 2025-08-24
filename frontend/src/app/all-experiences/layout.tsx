import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Adventure Experiences | Uganda Travel & Tours | Shake\'s Travel',
  description: 'Explore all adventure experiences in Uganda. Browse gorilla trekking, safaris, hiking, water sports, and cultural tours. Filter by region, price, duration, and difficulty level.',
  keywords: 'Uganda adventures, all experiences, gorilla trekking, safari tours, hiking Uganda, water sports, cultural tours, adventure travel, eco-tourism Uganda',
  openGraph: {
    title: 'All Adventure Experiences in Uganda | Shake\'s Travel',
    description: 'Browse and book from our complete collection of Uganda adventure experiences. Find the perfect tour with our advanced filtering system.',
    images: ['/images/uganda-adventures.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Adventure Experiences in Uganda',
    description: 'Browse and book Uganda adventures with advanced filtering',
    images: ['/images/uganda-adventures.jpg'],
  },
};

export default function AllExperiencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}