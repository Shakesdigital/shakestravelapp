'use client';

import React, { useState } from 'react';

interface DestinationDescriptionProps {
  destinationName: string;
  destinationSlug: string;
}

interface DestinationInfo {
  description: string;
  highlights: string[];
  history: string;
  culture: string;
  naturalFeatures: string;
  accessibility: {
    byAir: string;
    byRoad: string;
    publicTransport: string;
    nearestAirport: string;
    drivingTime: string;
    bestTimeToVisit: string;
  };
}

const DestinationDescription: React.FC<DestinationDescriptionProps> = ({ 
  destinationName, 
  destinationSlug 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'getting-there'>('overview');
  const primaryColor = '#195e48';

  // Destination-specific information (in production, this would come from CMS/API)
  const getDestinationInfo = (slug: string): DestinationInfo => {
    const destinationMap: { [key: string]: DestinationInfo } = {
      'bwindi-impenetrable-forest': {
        description: 'Bwindi Impenetrable Forest is a UNESCO World Heritage Site in southwestern Uganda, home to nearly half of the world\'s remaining mountain gorillas. This ancient rainforest spans 331 square kilometers and offers one of the most extraordinary wildlife experiences on Earth.',
        highlights: [
          'Mountain gorilla trekking with 19 habituated gorilla families',
          'Over 400 bird species including 23 endemic to the Albertine Rift',
          '120 mammal species and 200 butterfly species',
          'Ancient forest ecosystem dating back 25,000 years',
          'Cultural encounters with the Batwa people'
        ],
        history: 'Bwindi has been a forest reserve since 1961 and became a national park in 1991. The name "Bwindi" comes from the local Rukiga word meaning "impenetrable," referring to the dense vegetation that characterizes this ancient ecosystem.',
        culture: 'The area is home to the Batwa people, often called "People of the Forest," who lived as hunter-gatherers in the forest for thousands of years. Today, cultural tours offer insights into their traditional way of life.',
        naturalFeatures: 'The park features a complex ecosystem with montane and lowland forests, creating a unique habitat for endangered mountain gorillas, chimpanzees, and numerous endemic species.',
        accessibility: {
          byAir: 'Fly to Kihihi Airstrip (1-hour drive to park) or Kisoro Airstrip (2-hour drive). Charter flights available from Entebbe Airport.',
          byRoad: '8-9 hours drive from Kampala via Mbarara and Kabale. Roads are generally good but can be challenging during rainy season.',
          publicTransport: 'Bus services available from Kampala to Kabale, then taxi/boda-boda to park entrance. Not recommended for tourists.',
          nearestAirport: 'Kihihi Airstrip (30km), Kisoro Airstrip (70km), Entebbe International Airport (460km)',
          drivingTime: '8-9 hours from Kampala, 2 hours from Kabale',
          bestTimeToVisit: 'June-August and December-February (dry seasons) for easier trekking conditions'
        }
      },
      'queen-elizabeth-national-park': {
        description: 'Queen Elizabeth National Park is Uganda\'s most visited savanna reserve, renowned for its incredible biodiversity and the famous tree-climbing lions of Ishasha. The park spans 1,978 square kilometers across the equator, offering classic African safari experiences.',
        highlights: [
          'Tree-climbing lions in the Ishasha sector',
          'Boat safaris on the Kazinga Channel',
          'Over 600 bird species recorded',
          '95 mammal species including elephants, leopards, and hippos',
          'Chimpanzee tracking in Kyambura Gorge'
        ],
        history: 'Originally established as Kazinga National Park in 1952, it was renamed Queen Elizabeth National Park in 1954 to commemorate a visit by Queen Elizabeth II.',
        culture: 'The park area is inhabited by several communities including the Bakonzo people of the Rwenzori Mountains and fishing communities along Lake Edward.',
        naturalFeatures: 'The park encompasses savanna, wetlands, lakes, and forests, with the Kazinga Channel connecting Lakes Edward and George, creating a wildlife corridor.',
        accessibility: {
          byAir: 'Kasese Airstrip or Mweya Airstrip within the park. Charter flights from Entebbe Airport.',
          byRoad: '6-7 hours drive from Kampala via Mbarara. Well-maintained tarmac roads most of the way.',
          publicTransport: 'Bus services to Kasese town, then taxi to park gates. Limited public transport within the park.',
          nearestAirport: 'Kasese Airstrip (5km), Mweya Airstrip (inside park), Entebbe International Airport (420km)',
          drivingTime: '6-7 hours from Kampala, 1 hour from Kasese',
          bestTimeToVisit: 'Year-round destination, but dry seasons (June-August, December-February) offer best game viewing'
        }
      },
      'jinja': {
        description: 'Jinja, known as the adventure capital of East Africa, sits at the source of the mighty River Nile. This vibrant town offers world-class white water rafting, bungee jumping, and cultural experiences along the banks of the world\'s longest river.',
        highlights: [
          'Source of the River Nile with historical significance',
          'Grade 5 white water rafting on the Nile',
          'Bungee jumping from 44 meters above the Nile',
          'Boat cruises and sunset tours',
          'Cultural sites and colonial architecture'
        ],
        history: 'Jinja was founded in 1901 and became a major trading center due to its strategic location at the source of the Nile. The town played a crucial role in Uganda\'s colonial history and industrial development.',
        culture: 'Jinja is home to diverse communities including the Basoga people, with rich cultural traditions centered around fishing and agriculture along the Nile.',
        naturalFeatures: 'The town is situated where Lake Victoria transforms into the River Nile, creating powerful rapids and scenic landscapes perfect for adventure activities.',
        accessibility: {
          byAir: 'No commercial airport in Jinja. Nearest is Entebbe International Airport (87km).',
          byRoad: '2 hours drive from Kampala via well-maintained highway. 1.5 hours from Entebbe Airport.',
          publicTransport: 'Regular bus and taxi services from Kampala to Jinja. Local boda-bodas available for short distances.',
          nearestAirport: 'Entebbe International Airport (87km)',
          drivingTime: '2 hours from Kampala, 1.5 hours from Entebbe Airport',
          bestTimeToVisit: 'Year-round destination, but dry seasons offer the best conditions for outdoor activities'
        }
      }
    };

    // Default information for destinations not specifically defined
    const defaultInfo: DestinationInfo = {
      description: `${destinationName} is one of Uganda's remarkable destinations, offering unique experiences in East Africa's pearl. This destination combines natural beauty with cultural richness, providing unforgettable adventures for travelers.`,
      highlights: [
        'Spectacular natural landscapes and wildlife',
        'Rich cultural heritage and local communities',
        'Adventure activities and outdoor experiences',
        'Photography opportunities',
        'Sustainable tourism practices'
      ],
      history: `${destinationName} has a rich history intertwined with Uganda's cultural and natural heritage, offering visitors insights into the region's past and present.`,
      culture: 'The area is home to local communities with diverse cultural traditions, offering opportunities for authentic cultural exchanges and learning experiences.',
      naturalFeatures: `${destinationName} features diverse ecosystems and natural attractions that showcase Uganda's incredible biodiversity and scenic beauty.`,
      accessibility: {
        byAir: 'Access via charter flights to nearby airstrips or through Entebbe International Airport.',
        byRoad: 'Accessible by road from major cities with varying travel times depending on road conditions.',
        publicTransport: 'Public transportation available but private transport recommended for comfort and convenience.',
        nearestAirport: 'Entebbe International Airport with connecting flights or road transport',
        drivingTime: 'Travel time varies depending on departure point and road conditions',
        bestTimeToVisit: 'Year-round destination with seasonal variations affecting specific activities'
      }
    };

    return destinationMap[slug] || defaultInfo;
  };

  const destinationInfo = getDestinationInfo(destinationSlug);

  return (
    <section className="destination-description mt-12" id="destination-description">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover everything you need to know about this incredible Uganda destination
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'text-[#195e48] border-[#195e48]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            Overview & Culture
          </button>
          <button
            onClick={() => setActiveTab('getting-there')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 ${
              activeTab === 'getting-there'
                ? 'text-[#195e48] border-[#195e48]'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            How to Get There
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Main Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Destination Overview
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {destinationInfo.description}
                </p>
                
                {/* Highlights */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Key Highlights</h4>
                    <ul className="space-y-3">
                      {destinationInfo.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-[#195e48] mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4">Best Time to Visit</h4>
                    <p className="text-gray-700 mb-4">{destinationInfo.accessibility.bestTimeToVisit}</p>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-[#195e48] mb-2">Quick Facts</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Location: {destinationName}, Uganda</li>
                        <li>• Activities: Adventure, Wildlife, Culture</li>
                        <li>• Suitable for: All levels of travelers</li>
                        <li>• Eco-friendly: Sustainable tourism practices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* History & Culture */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">History</h3>
                  <p className="text-gray-700 leading-relaxed">{destinationInfo.history}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Culture & People</h3>
                  <p className="text-gray-700 leading-relaxed">{destinationInfo.culture}</p>
                </div>
              </div>

              {/* Natural Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Natural Features</h3>
                <p className="text-gray-700 leading-relaxed">{destinationInfo.naturalFeatures}</p>
              </div>
            </div>
          )}

          {activeTab === 'getting-there' && (
            <div className="space-y-8">
              {/* Transportation Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Transportation Options</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* By Air */}
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <h4 className="text-xl font-semibold text-gray-900">By Air</h4>
                    </div>
                    <p className="text-gray-700">{destinationInfo.accessibility.byAir}</p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Nearest Airport:</strong> {destinationInfo.accessibility.nearestAirport}
                      </p>
                    </div>
                  </div>

                  {/* By Road */}
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h4 className="text-xl font-semibold text-gray-900">By Road</h4>
                    </div>
                    <p className="text-gray-700">{destinationInfo.accessibility.byRoad}</p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Driving Time:</strong> {destinationInfo.accessibility.drivingTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Public Transport */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <svg className="w-6 h-6 text-[#195e48] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-900">Public Transportation</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{destinationInfo.accessibility.publicTransport}</p>
                
                {/* Travel Tips */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                  <h4 className="text-lg font-semibold text-yellow-800 mb-3">Travel Tips</h4>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Book accommodation in advance, especially during peak seasons</li>
                    <li>• Consider hiring a local guide for the best experience</li>
                    <li>• Pack appropriate clothing for varying weather conditions</li>
                    <li>• Carry sufficient cash as ATMs may be limited in remote areas</li>
                    <li>• Respect local customs and wildlife conservation guidelines</li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help Planning Your Trip?</h3>
                <p className="text-gray-700 mb-6">
                  Our local experts can help you plan the perfect itinerary and arrange transportation to {destinationName}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Contact Our Experts
                  </button>
                  <button
                    className="border-2 border-[#195e48] text-[#195e48] px-6 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
                    onClick={() => window.location.href = '/trip-planner'}
                  >
                    Plan Your Trip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DestinationDescription;
