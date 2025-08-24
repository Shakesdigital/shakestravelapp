'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Location {
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  formattedAddress?: string;
}

interface LocationMapperProps {
  location: Location;
  onLocationChange: (location: Location) => void;
  showMap?: boolean;
}

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  type: 'current' | 'suggestion' | 'nearby';
}

export default function LocationMapper({ 
  location, 
  onLocationChange, 
  showMap = true 
}: LocationMapperProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [manualCoords, setManualCoords] = useState({
    lat: location.coordinates.lat.toString(),
    lng: location.coordinates.lng.toString()
  });

  // Mock geocoding service
  const geocodeLocation = async (query: string): Promise<Location[]> => {
    setIsGeocoding(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses for common Uganda locations
    const mockResults: Location[] = [];
    
    if (query.toLowerCase().includes('kampala')) {
      mockResults.push({
        address: 'Kampala Central Business District',
        city: 'Kampala',
        country: 'Uganda',
        coordinates: { lat: 0.3476, lng: 32.5825 },
        placeId: 'kampala-cbd',
        formattedAddress: 'Kampala CBD, Kampala, Uganda'
      });
      mockResults.push({
        address: 'Makerere University',
        city: 'Kampala',
        country: 'Uganda',
        coordinates: { lat: 0.3354, lng: 32.5656 },
        placeId: 'makerere-university',
        formattedAddress: 'Makerere University, Kampala, Uganda'
      });
    }
    
    if (query.toLowerCase().includes('jinja')) {
      mockResults.push({
        address: 'Source of the Nile',
        city: 'Jinja',
        country: 'Uganda',
        coordinates: { lat: 0.4236, lng: 33.2042 },
        placeId: 'source-nile-jinja',
        formattedAddress: 'Source of the Nile, Jinja, Uganda'
      });
    }
    
    if (query.toLowerCase().includes('murchison') || query.toLowerCase().includes('masindi')) {
      mockResults.push({
        address: 'Murchison Falls National Park',
        city: 'Masindi',
        country: 'Uganda',
        coordinates: { lat: 2.2734, lng: 31.8440 },
        placeId: 'murchison-falls-np',
        formattedAddress: 'Murchison Falls National Park, Masindi, Uganda'
      });
    }
    
    if (query.toLowerCase().includes('bwindi')) {
      mockResults.push({
        address: 'Bwindi Impenetrable National Park',
        city: 'Kanungu',
        country: 'Uganda',
        coordinates: { lat: -1.0232, lng: 29.6958 },
        placeId: 'bwindi-np',
        formattedAddress: 'Bwindi Impenetrable National Park, Kanungu, Uganda'
      });
    }
    
    if (query.toLowerCase().includes('kigali')) {
      mockResults.push({
        address: 'Kigali City Center',
        city: 'Kigali',
        country: 'Rwanda',
        coordinates: { lat: -1.9441, lng: 30.0619 },
        placeId: 'kigali-center',
        formattedAddress: 'Kigali City Center, Kigali, Rwanda'
      });
    }
    
    if (mockResults.length === 0) {
      // Generic result for any other query
      mockResults.push({
        address: query,
        city: 'Unknown City',
        country: 'Uganda',
        coordinates: { 
          lat: Math.random() * 4 - 2, // Random lat between -2 and 2
          lng: Math.random() * 6 + 29 // Random lng between 29 and 35
        },
        placeId: 'generic-location',
        formattedAddress: `${query}, Uganda`
      });
    }
    
    setIsGeocoding(false);
    return mockResults;
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<Location | null> => {
    setIsGeocoding(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock reverse geocoding
    const result: Location = {
      address: 'Geocoded Address',
      city: 'Geocoded City',
      country: 'Uganda',
      coordinates: { lat, lng },
      placeId: 'reverse-geocoded',
      formattedAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)} - Uganda`
    };
    
    setIsGeocoding(false);
    return result;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const results = await geocodeLocation(searchQuery);
      setSuggestions(results);
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  const handleSuggestionSelect = (suggestion: Location) => {
    onLocationChange(suggestion);
    setSuggestions([]);
    setSearchQuery('');
    
    // Update map markers
    setMapMarkers([
      {
        id: 'current',
        position: suggestion.coordinates,
        title: suggestion.formattedAddress || suggestion.address,
        type: 'current'
      }
    ]);
  };

  const handleManualCoordinateUpdate = async () => {
    const lat = parseFloat(manualCoords.lat);
    const lng = parseFloat(manualCoords.lng);
    
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert('Coordinates are out of valid range');
      return;
    }
    
    try {
      const result = await reverseGeocode(lat, lng);
      if (result) {
        onLocationChange(result);
        setMapMarkers([
          {
            id: 'current',
            position: { lat, lng },
            title: result.formattedAddress || `${lat}, ${lng}`,
            type: 'current'
          }
        ]);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const result = await reverseGeocode(latitude, longitude);
          if (result) {
            onLocationChange(result);
            setManualCoords({
              lat: latitude.toString(),
              lng: longitude.toString()
            });
            setMapMarkers([
              {
                id: 'current',
                position: { lat: latitude, lng: longitude },
                title: 'Current Location',
                type: 'current'
              }
            ]);
          }
        } catch (error) {
          console.error('Failed to get current location:', error);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Could not get your current location');
      }
    );
  };

  // Update manual coordinates when location changes
  useEffect(() => {
    setManualCoords({
      lat: location.coordinates.lat.toString(),
      lng: location.coordinates.lng.toString()
    });
  }, [location.coordinates]);

  const popularLocations = [
    { name: 'Kampala CBD', coordinates: { lat: 0.3476, lng: 32.5825 } },
    { name: 'Entebbe Airport', coordinates: { lat: 0.0424, lng: 32.4435 } },
    { name: 'Jinja (Source of Nile)', coordinates: { lat: 0.4236, lng: 33.2042 } },
    { name: 'Murchison Falls NP', coordinates: { lat: 2.2734, lng: 31.8440 } },
    { name: 'Queen Elizabeth NP', coordinates: { lat: -0.2667, lng: 29.8833 } },
    { name: 'Bwindi Impenetrable NP', coordinates: { lat: -1.0232, lng: 29.6958 } },
    { name: 'Lake Mburo NP', coordinates: { lat: -0.6167, lng: 30.9667 } },
    { name: 'Kigali, Rwanda', coordinates: { lat: -1.9441, lng: 30.0619 } }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            📍 Location & GPS Coordinates
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Set precise location for accurate mapping and directions
          </p>
        </div>
        <HelpTooltip content="Accurate GPS coordinates help customers find your location easily. Use search or click on the map to set coordinates." />
      </div>

      {/* Current Location Display */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Current Location
            </h4>
            <div className="text-sm text-green-700 dark:text-green-300 mt-1">
              <div>{location.formattedAddress || `${location.address}, ${location.city}, ${location.country}`}</div>
              <div className="text-xs mt-1">
                📍 {location.coordinates.lat.toFixed(6)}, {location.coordinates.lng.toFixed(6)}
              </div>
            </div>
          </div>
          <AnimatedButton
            onClick={() => setShowCoordinateInput(!showCoordinateInput)}
            variant="secondary"
            size="sm"
          >
            ⚙️ Edit Coordinates
          </AnimatedButton>
        </div>
      </div>

      {/* Search Interface */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            🔍 Search for Location
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter address, landmark, or place name..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              disabled={isGeocoding}
            />
            <AnimatedButton
              onClick={handleSearch}
              disabled={isGeocoding || !searchQuery.trim()}
              variant="primary"
            >
              {isGeocoding ? '🔄' : '🔍'} Search
            </AnimatedButton>
            <AnimatedButton
              onClick={getCurrentLocation}
              variant="secondary"
              title="Get current location"
            >
              📍 My Location
            </AnimatedButton>
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {suggestion.formattedAddress || suggestion.address}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  📍 {suggestion.coordinates.lat.toFixed(4)}, {suggestion.coordinates.lng.toFixed(4)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Popular Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          🌟 Popular Locations
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {popularLocations.map((place, index) => (
            <button
              key={index}
              onClick={() => {
                const newLocation: Location = {
                  address: place.name,
                  city: place.name.split(' ')[0],
                  country: place.name.includes('Rwanda') ? 'Rwanda' : 'Uganda',
                  coordinates: place.coordinates,
                  formattedAddress: place.name
                };
                onLocationChange(newLocation);
                setMapMarkers([
                  {
                    id: 'current',
                    position: place.coordinates,
                    title: place.name,
                    type: 'current'
                  }
                ]);
              }}
              className="px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {place.name}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Coordinate Input */}
      {showCoordinateInput && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            ⚙️ Manual Coordinate Entry
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Latitude
              </label>
              <input
                type="number"
                value={manualCoords.lat}
                onChange={(e) => setManualCoords({ ...manualCoords, lat: e.target.value })}
                placeholder="-1.9441"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: -90 to 90
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Longitude
              </label>
              <input
                type="number"
                value={manualCoords.lng}
                onChange={(e) => setManualCoords({ ...manualCoords, lng: e.target.value })}
                placeholder="30.0619"
                step="any"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Range: -180 to 180
              </p>
            </div>
            
            <div className="flex items-end">
              <AnimatedButton
                onClick={handleManualCoordinateUpdate}
                variant="primary"
                className="w-full"
                disabled={isGeocoding}
              >
                {isGeocoding ? '🔄' : '📍'} Update Location
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      {showMap && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-white">
                🗺️ Interactive Map
              </h4>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Click on map to set location
              </div>
            </div>
          </div>
          
          <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center relative">
            {/* Mock Map Interface */}
            <div className="text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Interactive Map Integration
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                In a production environment, this would be integrated with Google Maps, Mapbox, or OpenStreetMap.
                Users could click, drag markers, and visually select precise locations.
              </p>
            </div>
            
            {/* Mock Marker */}
            {location.coordinates.lat !== 0 && location.coordinates.lng !== 0 && (
              <div 
                className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: '50%',
                  top: '50%'
                }}
              >
                📍
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>📍 Current: {location.coordinates.lat.toFixed(4)}, {location.coordinates.lng.toFixed(4)}</span>
              <div className="flex items-center space-x-2">
                <button className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">
                  🔍 Zoom In
                </button>
                <button className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">
                  🔍 Zoom Out
                </button>
                <button className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">
                  🛰️ Satellite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Accuracy Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
          💡 Location Accuracy Tips
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use specific landmarks or building names for better accuracy</li>
          <li>• For remote locations, use GPS coordinates from your phone or GPS device</li>
          <li>• Test the location in Google Maps to ensure it's easily findable</li>
          <li>• Consider accessibility - can vehicles reach this location?</li>
          <li>• For experiences, set the meeting point location, not the destination</li>
        </ul>
      </div>

      {/* Validation Warnings */}
      {(location.coordinates.lat === 0 && location.coordinates.lng === 0) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</span>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Location Not Set
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Please set a valid GPS location for your listing. This helps customers find you and improves search visibility.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}