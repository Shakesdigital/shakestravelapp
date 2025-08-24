import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Plan Your Uganda Adventure | Shake\'s Travel',
  description: 'Get in touch with Uganda\'s premier eco-friendly adventure travel company. Contact us for gorilla trekking, safaris, cultural tours, and sustainable travel planning.',
  keywords: 'contact Shakes Travel, Uganda travel planning, gorilla trekking booking, safari inquiries, adventure travel Uganda, eco-tourism contact',
  openGraph: {
    title: 'Contact Shake\'s Travel | Uganda Adventure Planning',
    description: 'Contact Uganda\'s leading eco-friendly adventure travel company for personalized trip planning and sustainable tourism experiences.',
    images: ['/images/contact-uganda.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Shake\'s Travel | Uganda Adventures',
    description: 'Get in touch for personalized Uganda adventure planning',
    images: ['/images/contact-uganda.jpg'],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}