'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Layout from '@/components/Layout/Layout';
import Navbar from '@/components/Layout/Navbar';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Conditional Layout Component with admin-specific layout
const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Special layout for admin routes with main navbar and footer
  if (pathname.startsWith('/admin')) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Main Website Navbar */}
        <Navbar />
        
        {/* Admin Content with navbar spacing */}
        <div className="pt-20"> {/* Account for fixed navbar height */}
          {children}
        </div>
        
        {/* Main Website Footer */}
        <footer className="bg-[#195e48] text-white py-8">
          <div className="content-section">
            <hr className="border-t-2 border-white my-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Shakes Travel</h3>
                <p className="text-gray-200">Discover the Pearl of Africa with authentic adventures and comfortable accommodations.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-white">
                  <li><a href="/about" className="hover:text-[#fec76f]">About Us</a></li>
                  <li><a href="/contact" className="hover:text-[#fec76f]">Contact</a></li>
                  <li><a href="/help" className="hover:text-[#fec76f]">Help Center</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-white">
                  <li><a href="/adventures" className="hover:text-[#fec76f]">Adventures</a></li>
                  <li><a href="/accommodations" className="hover:text-[#fec76f]">Accommodations</a></li>
                  <li><a href="/cultural-tours" className="hover:text-[#fec76f]">Cultural Tours</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Hosts</h4>
                <ul className="space-y-2 text-white">
                  <li><a href="/host/dashboard" className="hover:text-[#fec76f]">Host Dashboard</a></li>
                  <li><a href="/host/resources" className="hover:text-[#fec76f]">Resources</a></li>
                  <li><a href="/host/support" className="hover:text-[#fec76f]">Support</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t-2 border-white mt-8 pt-8 text-center">
              <p>&copy; 2024 Shakes Travel. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  
  return <Layout>{children}</Layout>;
};

export default ConditionalLayout;