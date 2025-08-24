import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for cPanel hosting
  output: process.env.NODE_ENV === 'production' && process.env.HOSTING_PLATFORM === 'cpanel' ? 'export' : undefined,
  trailingSlash: true,
  
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
  
  // Image configuration for different hosting platforms
  images: {
    unoptimized: process.env.HOSTING_PLATFORM === 'cpanel',
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
      }
    ],
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
