import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export configuration for cPanel shared hosting
  output: 'export',
  distDir: 'out',

  // Environment variables for client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api',
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

  // Optimized image configuration for static hosting
  images: {
    unoptimized: true,
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
      },
      {
        protocol: 'https',
        hostname: '**.netlify.app',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      }
    ],
  },
  
  // Enable experimental features for better performance on Vercel
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Performance optimizations for Netlify
  poweredByHeader: false,
  compress: true,
  
  // Netlify-specific optimizations
  trailingSlash: false,
  distDir: '.next',
};

export default nextConfig;
