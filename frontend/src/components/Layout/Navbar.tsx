'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const primaryColor = '#195e48';

  return (
    <>
      {/* Top bar with auth buttons */}
      <div className="bg-[#195e48] h-10 w-full fixed top-0 z-[60] flex items-center">
        <div className="content-section flex justify-end pr-6">
          {user ? (
          <div className="relative inline-block text-white">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profile
                </Link>
                {user.role === 'host' && (
                  <Link
                    href="/host/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Host Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link 
              href="/auth/login" 
              className="px-4 py-1.5 text-sm text-white border border-white rounded-md hover:bg-white hover:text-[#195e48] transition-colors duration-200"
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="px-4 py-1.5 text-sm bg-white text-[#195e48] rounded-md hover:bg-opacity-90 transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}
        </div>
      </div>
      <nav className="bg-white shadow-lg border-b fixed w-full top-10 z-50">
        <div className="content-section">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Logo />
              </Link>
            </div>
            
            {/* Centered Navigation */}
            <div className="hidden xl:flex xl:items-center xl:justify-center xl:flex-1">
              <div className="flex xl:space-x-8">
                <Link 
                  href="/" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Home
                </Link>
                <Link 
                  href="/trips" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Experiences
                </Link>
                <Link 
                  href="/stays" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Stays
                </Link>
                
                <Link
                  href="/destinations/uganda"
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Destinations
                </Link>
                <Link 
                  href="/planting-green-paths" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Planting Green Paths
                </Link>
                <Link 
                  href="/travel-guide" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Travel Guide
                </Link>
                <Link 
                  href="/about" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              {/* Hamburger menu button */}
              <button
                onClick={toggleMobileMenu}
                className="xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset"
                style={{ focusRingColor: primaryColor }}
                aria-expanded="false"
                aria-label="Toggle navigation menu"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden">
            <div className="content-section pt-2 pb-3 space-y-1 bg-white shadow-lg">
              <Link 
                href="/" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/trips" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Experiences
              </Link>
              <Link 
                href="/stays" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Stays
              </Link>
              <Link 
                href="/planting-green-paths" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planting Green Paths
              </Link>
              
              <Link
                href="/destinations/uganda"
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Destinations
              </Link>
              <Link 
                href="/travel-guide" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Travel Guide
              </Link>
              <Link 
                href="/about" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>

            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;