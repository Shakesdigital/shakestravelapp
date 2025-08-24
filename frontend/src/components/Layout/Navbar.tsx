'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const primaryColor = '#195e48';

  return (
    <>
      {/* Top bar with theme color */}
      <div className="bg-[#195e48] h-4 w-full fixed top-0 z-[60]"></div>
      <nav className="bg-white shadow-lg border-b fixed w-full top-4 z-50">
        <div className="content-section">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Image 
                  src="/brand_assets/images/logo/logo.png" 
                  alt="Shakes Travel Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-auto"
                  priority
                />
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
                  href="/accommodations" 
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                  onMouseEnter={(e) => e.target.style.color = primaryColor}
                  onMouseLeave={(e) => e.target.style.color = '#111827'}
                >
                  Accommodations
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
              {user ? (
                <>
                  <Link 
                    href="/profile" 
                    className="hidden md:block text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onMouseEnter={(e) => e.target.style.color = primaryColor}
                    onMouseLeave={(e) => e.target.style.color = '#111827'}
                  >
                    Profile
                  </Link>
                  {user.role === 'host' && (
                    <Link 
                      href="/host/dashboard" 
                      className="hidden md:block text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onMouseEnter={(e) => e.target.style.color = primaryColor}
                      onMouseLeave={(e) => e.target.style.color = '#111827'}
                    >
                      Host Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onMouseEnter={(e) => e.target.style.color = primaryColor}
                    onMouseLeave={(e) => e.target.style.color = '#111827'}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#164439'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                  >
                    Sign Up
                  </Link>
                </>
              )}
              
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
                href="/accommodations" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Accommodations
              </Link>
              <Link 
                href="/planting-green-paths" 
                className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Planting Green Paths
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
              {user && (
                <>
                  <Link 
                    href="/profile" 
                    className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  {user.role === 'host' && (
                    <Link 
                      href="/host/dashboard" 
                      className="text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Host Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;