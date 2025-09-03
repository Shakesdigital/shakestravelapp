import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetlifyIdentityProvider } from "@/contexts/NetlifyIdentityContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QueryProvider from "@/components/QueryProvider";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shake's Travel - Sustainable East Africa Adventures | Eco-Friendly Travel",
  description: "Discover East Africa's wonders through sustainable adventures across Uganda, Kenya, Tanzania, and Rwanda. Experience eco-friendly accommodations and meaningful cultural connections.",
  keywords: "East Africa travel, Uganda Kenya Tanzania Rwanda, eco-friendly tourism, sustainable travel, gorilla trekking, safari adventures, cultural tours, green travel, East Africa accommodations",
  authors: [{ name: "Shake's Travel" }],
  creator: "Shake's Travel",
  publisher: "Shake's Travel",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://shakestravel.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Shake's Travel - Sustainable East Africa Adventures",
    description: "Experience East Africa's wonders through eco-friendly adventures and meaningful cultural connections across Uganda, Kenya, Tanzania, and Rwanda.",
    url: '/',
    siteName: "Shake's Travel",
    images: [
      {
        url: '/images/uganda-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Beautiful Uganda landscape with mountains and wildlife',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shake's Travel - Sustainable East Africa Adventures",
    description: "Discover eco-friendly travel experiences across East Africa. Book sustainable adventures in Uganda, Kenya, Tanzania, and Rwanda."
    images: ['/images/uganda-hero.jpg'],
    creator: '@shakestravel',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          type="text/javascript" 
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <NetlifyIdentityProvider>
            <AuthProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </AuthProvider>
          </NetlifyIdentityProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

