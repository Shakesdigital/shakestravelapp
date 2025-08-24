"use client";

import React from 'react';
import Image from 'next/image';
import SearchBar from './SearchBar';

const Hero: React.FC = () => {
  const primaryColor = '#195e48';

  return (
    <section
      aria-label="Travel Guide Hero"
      className="relative w-full bg-gradient-to-br from-green-50 to-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23195e48' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 py-20">
          <div className="w-full lg:w-6/12 z-10">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-gray-500">
                <li><a href="/" className="hover:text-gray-700">Home</a></li>
                <li><span className="mx-2">/</span></li>
                <li className="font-medium" style={{ color: primaryColor }}>Travel Guide</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              <span className="block">Uganda Travel</span>
              <span className="block" style={{ color: primaryColor }}>Guide</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
              Discover Uganda's pristine wilderness, vibrant culture, and sustainable adventures. 
              From gorilla trekking to Nile rafting—plan your eco-friendly journey with expert insights.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-white text-sm font-bold">10+</span>
                </div>
                <span className="text-sm text-gray-600">National Parks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-white text-sm font-bold">50+</span>
                </div>
                <span className="text-sm text-gray-600">Travel Tips</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  <span className="text-white text-sm font-bold">25+</span>
                </div>
                <span className="text-sm text-gray-600">Itineraries</span>
              </div>
            </div>

            <div className="mb-8">
              <SearchBar />
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ backgroundColor: primaryColor }}
                href="#guides"
                aria-label="Browse guides"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explore Guides
              </a>
              <a
                className="inline-flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-800 hover:border-gray-300 transition-all duration-300 bg-white hover:bg-gray-50"
                href="#itineraries"
                aria-label="See itineraries"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View Itineraries
              </a>
            </div>
          </div>

          <div className="w-full lg:w-6/12 relative">
            {/* Image Collage */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl transform rotate-2">
                <Image
                  src="/images/uganda-hero.jpg"
                  alt="Uganda landscape with mountains and wildlife"
                  fill
                  sizes="(min-width:1024px) 50vw, 100vw"
                  style={{ objectFit: 'cover' }}
                  priority
                  className="transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">🌿 Eco-friendly adventures across Uganda</p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/images/gorilla-trekking.jpg" alt="Gorilla" width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Gorilla Trekking</p>
                    <p className="text-xs text-gray-500">Bwindi Forest</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-4 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image src="/images/jinja-rafting.jpg" alt="Rafting" width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Nile Rafting</p>
                    <p className="text-xs text-gray-500">Jinja</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
