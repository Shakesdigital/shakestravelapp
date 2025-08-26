"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';

interface FormValues {
  q: string;
  searchType: 'all' | 'destination' | 'accommodation' | 'experience';
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

const SearchBar: React.FC = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({ 
    defaultValues: { 
      q: '', 
      searchType: 'all',
      guests: 1
    } 
  });
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; type?: string; description?: string; url?: string }>>([]);
  const [show, setShow] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const q = watch('q');
  const searchType = watch('searchType');

  // Mock suggestions for development
  const getMockSuggestions = (query: string) => {
    const allSuggestions = [
      { id: 'bwindi', title: 'Bwindi Impenetrable Forest', type: 'destination', description: 'Mountain gorilla trekking destination', url: '/search?destination=Bwindi Impenetrable Forest' },
      { id: 'queen-elizabeth', title: 'Queen Elizabeth National Park', type: 'destination', description: 'Wildlife and boat safaris', url: '/search?destination=Queen Elizabeth National Park' },
      { id: 'murchison-falls', title: 'Murchison Falls National Park', type: 'destination', description: 'Uganda\'s largest national park', url: '/search?destination=Murchison Falls National Park' },
      { id: 'jinja', title: 'Jinja', type: 'destination', description: 'White water rafting and Nile activities', url: '/search?destination=Jinja' },
      { id: 'kampala', title: 'Kampala', type: 'destination', description: 'Capital city and cultural hub', url: '/search?destination=Kampala' },
      { id: 'lake-bunyonyi', title: 'Lake Bunyonyi', type: 'destination', description: 'Scenic crater lake', url: '/search?destination=Lake Bunyonyi' },
      { id: 'gorilla-trekking', title: 'Bwindi Gorilla Trekking Experience', type: 'guide', description: 'Mountain gorilla trekking adventure', url: '/trips/gorilla-trekking' },
      { id: 'jinja-rafting', title: 'Jinja White Water Rafting', type: 'guide', description: 'Thrilling rafting on the Nile', url: '/trips/jinja-rafting' },
      { id: 'safari-lodge', title: 'Queen Elizabeth Safari Lodge', type: 'guide', description: 'Luxury safari accommodation', url: '/accommodations/safari-lodge' },
      { id: 'cultural-tour', title: 'Kampala City Cultural Tour', type: 'guide', description: 'Explore Uganda\'s capital culture', url: '/trips/cultural-tour' }
    ];

    return allSuggestions.filter(suggestion => 
      suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 6);
  };

  useEffect(() => {
    let active = true;
    if (!q || q.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await api.search.general({ q, limit: 6 });
        if (!active) return;
        // Expecting backend to return items with id and title
        setSuggestions((res.data && Array.isArray(res.data.items)) ? res.data.items : []);
        setShow(true);
      } catch (err) {
        // If API fails, use mock suggestions
        console.log('API not available, using mock suggestions for development');
        if (!active) return;
        const mockSuggestions = getMockSuggestions(q);
        setSuggestions(mockSuggestions);
        setShow(true);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q]);

  const onSubmit = (data: FormValues) => {
    if (!data.q) return;
    
    const params = new URLSearchParams();
    params.append('q', data.q);
    
    if (data.searchType && data.searchType !== 'all') {
      params.append('type', data.searchType);
    }
    
    if (data.checkIn) {
      params.append('checkIn', data.checkIn);
    }
    
    if (data.checkOut) {
      params.append('checkOut', data.checkOut);
    }
    
    if (data.guests && data.guests > 1) {
      params.append('guests', data.guests.toString());
    }
    
    window.location.href = `/search?${params.toString()}`;
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'destination':
        return 'Where in Uganda do you want to go?';
      case 'accommodation':
        return 'Find hotels, lodges, and camps in Uganda...';
      case 'experience':
        return 'Search adventures, safaris, and activities...';
      default:
        return 'Where do you want to explore in Uganda?';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-4xl">
      <label htmlFor="guide-search" className="sr-only">Search Travel Guides</label>
      <div className="relative">
        {/* Search Type Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 font-medium">Search for:</span>
          {[
            { key: 'all', label: 'All', icon: '🔍' },
            { key: 'destination', label: 'Destinations', icon: '📍' },
            { key: 'accommodation', label: 'Hotels & Lodges', icon: '🏨' },
            { key: 'experience', label: 'Adventures', icon: '🎯' }
          ].map(type => (
            <button
              key={type.key}
              type="button"
              onClick={() => setValue('searchType', type.key as any)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                searchType === type.key 
                  ? 'bg-[#195e48] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-xs">{type.icon}</span>
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:border-[#195e48] focus-within:ring-4 focus-within:ring-[#195e48]/10">
          <div className="flex items-center flex-1 px-4 py-4">
            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="guide-search"
              aria-label="Search travel guides and destinations"
              {...register('q')}
              ref={(e) => { register('q').ref(e); inputRef.current = e; }}
              className="flex-1 bg-transparent outline-none text-base placeholder-gray-500"
              placeholder={getSearchPlaceholder()}
              onFocus={() => setShow(true)}
              onBlur={() => setTimeout(() => setShow(false), 150)}
            />
          </div>

          {/* Date and Guest Filters */}
          {(searchType === 'accommodation' || searchType === 'experience') && (
            <div className="flex items-center gap-2 px-4 border-l border-gray-200">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-[#195e48] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Dates
              </button>
            </div>
          )}

          <div className="px-4">
            <button
              type="submit"
              aria-label="Search"
              className="px-6 py-3 rounded-xl bg-[#195e48] text-white font-semibold hover:bg-[#164439] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#195e48]/50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Date Filters Dropdown */}
        {showFilters && (searchType === 'accommodation' || searchType === 'experience') && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <input
                  {...register('checkIn')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195e48]/50 focus:border-[#195e48]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <input
                  {...register('checkOut')}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195e48]/50 focus:border-[#195e48]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <select
                  {...register('guests')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#195e48]/50 focus:border-[#195e48]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
        
        {/* Popular Searches */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Popular:</span>
          {[
            'Bwindi Gorilla Trekking', 
            'Queen Elizabeth Safari', 
            'Jinja White Water Rafting', 
            'Kampala City Tour',
            'Lake Bunyonyi',
            'Sipi Falls'
          ].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setValue('q', term);
                handleSubmit(onSubmit)({ ...watch(), q: term });
              }}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 hover:text-[#195e48] transition-colors duration-200"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {show && suggestions.length > 0 && (
        <ul
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-30 left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-auto"
        >
          {suggestions.map((s: any) => (
            <li
              key={s.id || s.title}
              role="option"
              tabIndex={0}
              onMouseDown={() => {
                // navigate to item
                if (s.url) {
                  window.location.href = s.url;
                } else if (s.type === 'destination') {
                  window.location.href = `/search?destination=${encodeURIComponent(s.title)}`;
                } else if (s.slug) {
                  const basePath = s.type === 'guide' ? '/trips' : '/travel-guide';
                  window.location.href = `${basePath}/${s.slug}`;
                } else {
                  window.location.href = `/travel-guide/${s.id}`;
                }
              }}
              className="px-4 py-4 hover:bg-green-50 cursor-pointer flex items-center gap-4 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#195e48]/10 flex items-center justify-center">
                {s.type === 'destination' && (
                  <svg className="w-5 h-5 text-[#195e48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {s.type === 'guide' && (
                  <svg className="w-5 h-5 text-[#195e48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
                {!s.type && (
                  <svg className="w-5 h-5 text-[#195e48]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{s.title || s.name}</div>
                {s.type && <div className="text-sm text-gray-500 capitalize">{s.type}</div>}
                {s.description && <div className="text-sm text-gray-600 mt-1 line-clamp-1">{s.description}</div>}
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
