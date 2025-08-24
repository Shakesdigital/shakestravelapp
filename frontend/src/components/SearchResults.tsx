'use client';

import React from 'react';
import Link from 'next/link';
import OptimizedImage from './OptimizedImage';

interface SearchResultItem {
  id: string | number;
  title: string;
  type: 'experience' | 'accommodation' | 'destination';
  image?: string;
  price?: number;
  rating?: number;
  reviews?: number;
  location: string;
  description?: string;
  duration?: string;
  category?: string;
}

interface SearchResultsProps {
  results: SearchResultItem[];
  loading?: boolean;
  query?: string;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onLoadMore?: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results = [],
  loading = false,
  query = '',
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onLoadMore
}) => {
  const primaryColor = '#195e48';

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any results for "{query}". Try adjusting your search criteria.
        </p>
        <div className="text-sm text-gray-500">
          <p>Try searching for:</p>
          <ul className="mt-2 space-y-1">
            <li>• Popular destinations like "Bwindi" or "Lake Victoria"</li>
            <li>• Activities like "gorilla trekking" or "safari"</li>
            <li>• Accommodation types like "lodge" or "camp"</li>
          </ul>
        </div>
      </div>
    );
  }

  const getItemLink = (item: SearchResultItem) => {
    switch (item.type) {
      case 'experience':
        return `/trips/${item.id}`;
      case 'accommodation':
        return `/accommodations/${item.id}`;
      case 'destination':
        return `/search?destination=${encodeURIComponent(item.title)}`;
      default:
        return '#';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'experience':
        return 'Experience';
      case 'accommodation':
        return 'Stay';
      case 'destination':
        return 'Destination';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'experience':
        return 'bg-blue-100 text-blue-800';
      case 'accommodation':
        return 'bg-green-100 text-green-800';
      case 'destination':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      {query && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Search Results {query && `for "${query}"`}
            </h2>
            {totalResults > 0 && (
              <p className="text-gray-600 mt-1">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((item, index) => (
          <article key={`${item.type}-${item.id}-${index}`} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link href={getItemLink(item)} className="block">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                {item.image ? (
                  <OptimizedImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex items-center justify-center text-6xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    {item.type === 'experience' ? '🎯' : 
                     item.type === 'accommodation' ? '🏨' : 
                     '📍'}
                  </div>
                )}
                
                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(item.type)}`}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category and Duration */}
                {(item.category || item.duration) && (
                  <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
                    {item.category && <span>{item.category}</span>}
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                )}

                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>

                {/* Location */}
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <span className="mr-1">📍</span>
                  {item.location}
                </p>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Rating and Reviews */}
                {item.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex items-center text-yellow-400">
                      {'★'.repeat(Math.floor(item.rating))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {item.rating} {item.reviews && `(${item.reviews} reviews)`}
                    </span>
                  </div>
                )}

                {/* Price */}
                {item.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                      ${item.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.type === 'accommodation' ? 'per night' : 'per person'}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {currentPage < totalPages && onLoadMore && (
        <div className="text-center pt-8">
          <button
            onClick={onLoadMore}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#164439'}
            onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
          >
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;