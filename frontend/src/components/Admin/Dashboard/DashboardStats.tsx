'use client';

import React, { useState, useEffect } from 'react';
import { SkeletonLoader, StatsCardSkeleton } from '../UI/LoadingStates';

interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  description: string;
}

const stats: StatCard[] = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$45,821',
    change: '+12.5%',
    changeType: 'increase',
    icon: '💰',
    description: 'vs last month'
  },
  {
    id: 'bookings',
    title: 'Total Bookings',
    value: '1,247',
    change: '+8.2%',
    changeType: 'increase',
    icon: '📅',
    description: 'vs last month'
  },
  {
    id: 'users',
    title: 'Active Users',
    value: '3,456',
    change: '+15.3%',
    changeType: 'increase',
    icon: '👥',
    description: 'vs last month'
  },
  {
    id: 'conversion',
    title: 'Conversion Rate',
    value: '3.2%',
    change: '-0.5%',
    changeType: 'decrease',
    icon: '📈',
    description: 'vs last month'
  },
  {
    id: 'listings',
    title: 'Active Listings',
    value: '156',
    change: '+4',
    changeType: 'increase',
    icon: '🏨',
    description: 'new this month'
  },
  {
    id: 'satisfaction',
    title: 'Customer Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    changeType: 'increase',
    icon: '⭐',
    description: 'average rating'
  }
];

export default function DashboardStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <SkeletonLoader className="w-32 h-6 rounded" />
          <SkeletonLoader className="w-48 h-8 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Stats Header with Period Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Key metrics for your travel platform</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {(['today', 'week', 'month', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group relative overflow-hidden"
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10">
              {/* Icon and change indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">{stat.icon}</div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  stat.changeType === 'increase'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 group-hover:bg-green-200 dark:group-hover:bg-green-800'
                    : stat.changeType === 'decrease'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 group-hover:bg-red-200 dark:group-hover:bg-red-800'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                } ${
                  hoveredCard === stat.id ? 'animate-pulse' : ''
                }`}>
                  {stat.changeType === 'increase' && '📈'}
                  {stat.changeType === 'decrease' && '📉'}
                  {stat.changeType === 'neutral' && '➡️'}
                  <span className="ml-1">{stat.change}</span>
                </div>
              </div>

              {/* Value with animation */}
              <div className="mb-3">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200">
                  {stat.value}
                </h3>
              </div>

              {/* Title and description */}
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-200">
                  {stat.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                  {stat.description}
                </p>
              </div>

              {/* Progress indicator for hovered card */}
              {hoveredCard === stat.id && (
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Target Progress</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: '85%' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Key Insights</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Revenue is up 12.5% this {selectedPeriod}, with strong growth in safari bookings. 
              Consider expanding gorilla trekking capacity to meet demand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}