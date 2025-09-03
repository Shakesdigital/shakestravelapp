'use client';

import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
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
                <li><a href="/planting-green-paths" className="hover:text-[#fec76f]">Planting Green Paths</a></li>
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
};

export default Layout;