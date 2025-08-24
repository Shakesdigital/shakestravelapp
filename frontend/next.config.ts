import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment - no static export
  
  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  
  // ESLint configuration for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Optimized image configuration for Vercel
  images: {
    domains: ['localhost', 'www.shakestravel.com', 'shakestravel.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'https', 
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'shakestravel.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shakestravel.com',
      }
    ],
  },
  
  // Enable experimental features for better performance on Vercel
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Performance optimizations for Vercel
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
