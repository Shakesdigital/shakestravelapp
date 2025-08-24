'use client';

import React, { useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

const revenueData: ChartData[] = [
  { label: 'Jan', value: 15000, color: '#10B981' },
  { label: 'Feb', value: 18000, color: '#10B981' },
  { label: 'Mar', value: 22000, color: '#10B981' },
  { label: 'Apr', value: 19000, color: '#10B981' },
  { label: 'May', value: 28000, color: '#10B981' },
  { label: 'Jun', value: 32000, color: '#10B981' },
  { label: 'Jul', value: 35000, color: '#10B981' },
  { label: 'Aug', value: 31000, color: '#10B981' },
  { label: 'Sep', value: 38000, color: '#10B981' },
  { label: 'Oct', value: 42000, color: '#10B981' },
  { label: 'Nov', value: 39000, color: '#10B981' },
  { label: 'Dec', value: 45000, color: '#10B981' }
];

const bookingData: ChartData[] = [
  { label: 'Safari Tours', value: 35, color: '#F59E0B' },
  { label: 'Gorilla Trekking', value: 25, color: '#EF4444' },
  { label: 'Cultural Tours', value: 20, color: '#8B5CF6' },
  { label: 'Adventure Sports', value: 15, color: '#06B6D4' },
  { label: 'Accommodations', value: 5, color: '#84CC16' }
];

export default function AnalyticsCharts() {
  const [activeTab, setActiveTab] = useState<'revenue' | 'bookings'>('revenue');

  const maxValue = Math.max(...revenueData.map(d => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Analytics Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your platform performance and trends
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 sm:mt-0">
          <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'revenue'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              💰 Revenue
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'bookings'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📊 Bookings by Category
            </button>
          </nav>
        </div>
      </div>

      {/* Chart Content */}
      {activeTab === 'revenue' && (
        <div>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Monthly Revenue Trend (USD)
            </h4>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-3">
            {revenueData.map((item, index) => (
              <div key={item.label} className="flex items-center">
                <div className="w-8 text-xs text-gray-500 dark:text-gray-400">
                  {item.label}
                </div>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-green-500 h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                      style={{ width: `${(item.value / maxValue) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        ${(item.value / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Booking Distribution by Category (%)
            </h4>
          </div>

          {/* Donut Chart Representation */}
          <div className="flex flex-col lg:flex-row items-center">
            {/* Simple Donut Visualization */}
            <div className="relative w-48 h-48 mb-6 lg:mb-0 lg:mr-8">
              <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 relative overflow-hidden">
                {/* Segments */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #F59E0B 0% 35%,
                      #EF4444 35% 60%,
                      #8B5CF6 60% 80%,
                      #06B6D4 80% 95%,
                      #84CC16 95% 100%
                    )`
                  }}
                />
                {/* Center hole */}
                <div className="absolute inset-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              {bookingData.map((item) => (
                <div key={item.label} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.value}% of total bookings
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Chart Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </div>
          <div className="mt-2 sm:mt-0 flex space-x-2">
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              📊 View Detailed Report
            </button>
            <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              📥 Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}