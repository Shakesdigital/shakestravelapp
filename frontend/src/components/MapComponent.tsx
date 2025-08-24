'use client';

import React, { useState } from 'react';

interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  description?: string;
}

interface MapComponentProps {
  location: MapLocation;
  nearbyPlaces?: MapLocation[];
  height?: string;
  showNearby?: boolean;
}

export default function MapComponent({ 
  location, 
  nearbyPlaces = [], 
  height = '400px',
  showNearby = true 
}: MapComponentProps) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  // Google Maps placeholder - Replace with actual Google Maps integration
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${location.lat},${location.lng}&zoom=14`;

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h3 className="text-lg font-semibold">Location</h3>
          <p className="text-gray-600">{location.title}</p>
        </div>
        
        {/* Placeholder Map - Replace with actual Google Maps */}
        <div 
          className="relative bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center"
          style={{ height }}
        >
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl">
              📍
            </div>
            <h4 className="text-xl font-semibold mb-2">{location.title}</h4>
            <p className="text-gray-600 mb-4">{location.description}</p>
            <div className="text-sm text-gray-500">
              Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </div>
            
            {/* Google Maps Integration Notice */}
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
              <p className="text-sm text-yellow-800">
                🗺️ Google Maps integration placeholder
                <br />
                Replace with actual Google Maps API
              </p>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-2">
            <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
              Satellite
            </button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
              Terrain
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 transition-colors">
              Get Directions
            </button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
              Share Location
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Places */}
      {showNearby && nearbyPlaces.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Nearby Places</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyPlaces.map((place, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setActiveMarker(activeMarker === index ? null : index)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{place.title}</h4>
                    {place.description && (
                      <p className="text-gray-600 text-sm mt-1">{place.description}</p>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700 text-sm">
                    View
                  </button>
                </div>
                
                {activeMarker === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                        Directions
                      </button>
                      <button className="bg-white border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors">
                        More Info
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Getting There</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🚗</div>
            <h4 className="font-semibold">By Car</h4>
            <p className="text-sm text-gray-600 mt-1">
              2 hours from Kampala
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">🚌</div>
            <h4 className="font-semibold">By Bus</h4>
            <p className="text-sm text-gray-600 mt-1">
              Daily departures available
            </p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl mb-2">✈️</div>
            <h4 className="font-semibold">By Flight</h4>
            <p className="text-sm text-gray-600 mt-1">
              Charter flights available
            </p>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Location Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Coordinates:</span>
            <span className="font-mono text-sm">{location.lat.toFixed(6)}, {location.lng.toFixed(6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Elevation:</span>
            <span>1,200m above sea level</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Climate:</span>
            <span>Tropical, warm year-round</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Best time to visit:</span>
            <span>December - February, June - August</span>
          </div>
        </div>
      </div>
    </div>
  );
}