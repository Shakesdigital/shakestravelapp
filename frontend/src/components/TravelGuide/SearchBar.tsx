"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';

interface FormValues {
  q: string;
}

const SearchBar: React.FC = () => {
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({ defaultValues: { q: '' } });
  const [suggestions, setSuggestions] = useState<Array<{ id: string; title: string; type?: string }>>([]);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const q = watch('q');

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
        // Non-blocking: silently ignore network errors here
        setSuggestions([]);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [q]);

  const onSubmit = (data: FormValues) => {
    if (!data.q) return;
    window.location.href = `/search?q=${encodeURIComponent(data.q)}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative w-full max-w-2xl">
      <label htmlFor="guide-search" className="sr-only">Search Travel Guides</label>
      <div className="relative">
        <div className="flex items-center bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:border-[#195e48] focus-within:ring-4 focus-within:ring-[#195e48]/10">
          <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="guide-search"
            aria-label="Search travel guides and destinations"
            {...register('q')}
            ref={(e) => { register('q').ref(e); inputRef.current = e; }}
            className="flex-1 bg-transparent outline-none text-base placeholder-gray-500"
            placeholder="Where do you want to explore in Uganda?"
            onFocus={() => setShow(true)}
            onBlur={() => setTimeout(() => setShow(false), 150)}
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-6 py-2 rounded-xl bg-[#195e48] text-white font-semibold hover:bg-[#164439] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#195e48]/50"
          >
            Search
          </button>
        </div>
        
        {/* Popular Searches */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500">Popular:</span>
          {['Gorilla Trekking', 'Jinja Rafting', 'Queen Elizabeth Park', 'Cultural Tours'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setValue('q', term);
                handleSubmit(onSubmit)({ q: term });
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
                window.location.href = s.url || `/travel-guide/${s.slug || s.id}`;
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
