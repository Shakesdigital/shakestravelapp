'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const PlantingGreenPathsClient: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const handleTreeSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tree planting signup:', { email, plan: selectedPlan });
    alert('Thank you for joining our tree planting initiative! We\'ll contact you soon.');
    setEmail('');
  };

  const primaryColor = '#195e48';
  const lightGreen = '#2d7a5e';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] min-h-[500px] overflow-hidden"
        aria-label="Planting Green Paths Initiative Hero Section"
        role="banner"
      >
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-gradient-to-r from-green-900/80 to-green-700/60"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(25, 94, 72, 0.85) 0%, rgba(45, 122, 94, 0.65) 100%), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoMTkyMHYxMDgwSDBWMHoiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFmNGUzNztzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDdhNWU7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PC9zdmc+')`
            }}
          />
        </div>
        <div className="relative z-10 content-section h-full flex items-center">
          <div className="max-w-4xl">
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Planting <span className="text-green-200">Green Paths</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-green-100 mb-8 max-w-3xl leading-relaxed">
              Restorative travel that actively heals and protects East Africa's ecosystems. Every adventure plants seeds—literally and figuratively—for a greener, more harmonious future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('tree-planting')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Navigate to tree planting program section"
              >
                Start Planting Trees
              </button>
              <button 
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-300"
                onClick={() => document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Navigate to learn more section"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 right-10 w-16 h-16 rounded-full bg-green-200/20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-green-300/15 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-green-100/25 animate-pulse animation-delay-2000"></div>
      </section>

      {/* Introduction Section */}
      <section id="learn-more" className="py-20 bg-gray-50">
        <div className="content-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: primaryColor }}>
                Adventure That Makes a Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Our Planting Green Paths initiative transforms travel into an advocacy platform for harmonious East Africa - where every experience actively contributes to healing ecosystems, empowering communities, and building resilient economies rooted in tourism's positive potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div className="order-2 md:order-1">
                <h3 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                  Conservation Through Adventure
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  East Africa is home to incredible wildlife, pristine forests, and vibrant communities. Our initiative redefines adventure as a force for good - amplifying local voices and expertise to create pathways for cultural preservation, empower communities, and ensure travelers, hosts, and ecosystems thrive together.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                      <svg className="w-4 h-4 text-white mt-1 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Direct funding for local conservation projects</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                      <svg className="w-4 h-4 text-white mt-1 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Employment opportunities for local communities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full mr-4 mt-1 flex-shrink-0" style={{ backgroundColor: primaryColor }}>
                      <svg className="w-4 h-4 text-white mt-1 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Measurable environmental impact with every trip</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center"
                  >
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">🌳</div>
                      <p className="text-lg font-semibold">Conservation in Action</p>
                      <p className="text-sm opacity-90">Tree planting with local communities</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Embed Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-center mb-6" style={{ color: primaryColor }}>
                See Our Impact in Action
              </h3>
              <div className="relative h-80 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">▶️</div>
                  <p className="text-lg font-semibold text-gray-600">Watch: Planting Green Paths Documentary</p>
                  <p className="text-sm text-gray-500 mt-2">Coming Soon - Stories from our conservation partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-20 bg-white">
        <div className="content-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: primaryColor }}>
                Why Conservation Matters
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                East Africa's ecosystems need protection. Our initiative creates restorative solutions that benefit nature, communities, and travelers through mindful, low-impact exploration.
              </p>
            </div>

            <div className="eco-grid grid md:grid-cols-3 gap-8">
              <div className="card-hover-effect bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-5xl mb-6 text-center">🦍</div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                  Biodiversity Protection
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Uganda hosts over 1,000 bird species, endangered mountain gorillas, and unique ecosystems. Our conservation efforts protect critical habitats for future generations.
                </p>
                <div className="mt-6 text-center">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    1,000+ Species Protected
                  </span>
                </div>
              </div>

              <div className="card-hover-effect bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-5xl mb-6 text-center">🏘️</div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                  Community Benefits
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Local communities receive direct economic benefits, training opportunities, and sustainable income sources through our eco-tourism and conservation programs.
                </p>
                <div className="mt-6 text-center">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    50+ Communities Supported
                  </span>
                </div>
              </div>

              <div className="card-hover-effect bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="text-5xl mb-6 text-center">🌍</div>
                <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: primaryColor }}>
                  Carbon Offset
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  Every tree planted captures CO2, helping combat climate change while restoring degraded landscapes and creating corridors for wildlife movement.
                </p>
                <div className="mt-6 text-center">
                  <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    10,000+ Trees Planted
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Involved Section */}
      <section className="py-20 bg-gray-50">
        <div className="content-section">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: primaryColor }}>
                Join the Green Path Movement
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose your level of involvement in East Africa's restorative future - one mindful step at a time
              </p>
            </div>

            {/* Tree Planting Section */}
            <div id="tree-planting" className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                    🌱 Tree Planting Program
                  </h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    Plant native trees in degraded areas, create wildlife corridors, and restore East Africa's forests. Every tree plants seeds—literally and figuratively—for a greener, more harmonious future.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <input
                        type="radio"
                        id="basic"
                        name="plan"
                        value="basic"
                        checked={selectedPlan === 'basic'}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor="basic" className="font-semibold text-gray-800 cursor-pointer">
                          Basic Planter - $25
                        </label>
                        <p className="text-sm text-gray-600">Plant 10 trees + digital certificate + impact updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <input
                        type="radio"
                        id="guardian"
                        name="plan"
                        value="guardian"
                        checked={selectedPlan === 'guardian'}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor="guardian" className="font-semibold text-gray-800 cursor-pointer">
                          Forest Guardian - $100
                        </label>
                        <p className="text-sm text-gray-600">Plant 50 trees + GPS coordinates + quarterly reports + photo updates</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <input
                        type="radio"
                        id="expedition"
                        name="plan"
                        value="expedition"
                        checked={selectedPlan === 'expedition'}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <label htmlFor="expedition" className="font-semibold text-gray-800 cursor-pointer">
                          Planting Expedition - $500
                        </label>
                        <p className="text-sm text-gray-600">Join us in Uganda for hands-on planting + 3-day eco-tour + accommodation</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <form onSubmit={handleTreeSignup} className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                      Start Your Impact Today
                    </h4>
                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-primary text-white py-3 rounded-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
                    >
                      Join Tree Planting Program
                    </button>
                    <p className="text-xs text-gray-500 mt-3 text-center">
                      Secure payment via PayPal or Mobile Money
                    </p>
                  </form>
                </div>
              </div>
            </div>

            {/* Eco Trips Section */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                  🦎 Eco Adventure Trips
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Experience East Africa's wonders through handcrafted sustainable tours that honor heritage, empower communities, and ensure low-impact, responsible exploration.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🦍</span>
                      <h4 className="font-bold text-lg">Gorilla Conservation Trek</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">3-day sustainable gorilla experience in Bwindi Forest</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $1,200</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★★</span>
                        <span>4.9 (127)</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🌊</span>
                      <h4 className="font-bold text-lg">Source of the Nile Expedition</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">5-day adventure with river conservation activities</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $800</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★★</span>
                        <span>4.8 (89)</span>
                      </div>
                    </div>
                  </div>

                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🦁</span>
                      <h4 className="font-bold text-lg">Wildlife Conservation Safari</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">7-day safari supporting anti-poaching efforts</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $1,500</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★★</span>
                        <span>4.9 (156)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/trips"
                  className="w-full block text-center btn-primary text-white py-3 rounded-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
                >
                  View All Eco Adventures
                </Link>
              </div>

              {/* Eco Stays Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
                  🏡 Eco-Friendly Stays
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Rest in accommodations that prioritize sustainability, support local communities, and minimize environmental impact.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🌿</span>
                      <h4 className="font-bold text-lg">Bwindi Eco Lodge</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Solar-powered lodge near gorilla habitats</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $180/night</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★★</span>
                        <span>4.8 (234)</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        🌱 Carbon Neutral
                      </span>
                    </div>
                  </div>

                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">🏞️</span>
                      <h4 className="font-bold text-lg">Lake Bunyonyi Retreat</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Community-owned eco resort with lake views</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $120/night</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★★</span>
                        <span>4.7 (178)</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        🤝 Community Owned
                      </span>
                    </div>
                  </div>

                  <div className="card-hover-effect border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">⛺</span>
                      <h4 className="font-bold text-lg">Murchison Eco Camp</h4>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Sustainable camping with minimal footprint</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold" style={{ color: primaryColor }}>From $75/night</span>
                      <div className="flex items-center text-sm text-yellow-600">
                        <span className="rating-stars mr-1">★★★★☆</span>
                        <span>4.6 (92)</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ♻️ Zero Waste
                      </span>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/accommodations"
                  className="w-full block text-center btn-primary text-white py-3 rounded-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
                >
                  View All Eco Stays
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20" style={{ backgroundColor: primaryColor }}>
        <div className="content-section">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Plant Your Green Path?
            </h2>
            <p className="text-xl mb-8 text-green-100 leading-relaxed">
              Join us in redefining adventure as a force for good - where travelers, hosts, and ecosystems thrive together in a harmonious East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="bg-white text-green-800 px-8 py-4 rounded-lg text-lg font-semibold hover:transform hover:scale-105 transition-all duration-300"
                onClick={() => document.getElementById('tree-planting')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Planting Trees
              </button>
              <Link 
                href="/trips"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-800 transition-all duration-300 text-center"
              >
                Book Eco Adventure
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlantingGreenPathsClient;