import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'View All Properties | Uganda Accommodations & Lodges | Shake\'s Travel',
  description: 'Browse all accommodations in Uganda. Find eco-lodges, safari lodges, hotels, resorts, and guesthouses. Filter by location, price, amenities, and ratings.',
  keywords: 'Uganda accommodations, hotels Uganda, eco-lodges, safari lodges, Uganda resorts, guesthouses, Kampala hotels, Bwindi lodges, accommodation booking',
  openGraph: {
    title: 'View All Properties in Uganda | Shake\'s Travel',
    description: 'Discover and book from our complete collection of Uganda accommodations. From luxury eco-lodges to budget guesthouses.',
    images: ['/images/uganda-accommodations.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'View All Properties in Uganda',
    description: 'Browse and book Uganda accommodations with advanced filtering',
    images: ['/images/uganda-accommodations.jpg'],
  },
};

export default function ViewAllPropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}