'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
  description: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-experience',
    label: 'Add Experience',
    icon: '🎯',
    href: '/admin/listings/experiences/new',
    description: 'Create new travel experience',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'add-accommodation',
    label: 'Add Accommodation',
    icon: '🏨',
    href: '/admin/listings/accommodations/new',
    description: 'Add new accommodation',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'review-bookings',
    label: 'Review Bookings',
    icon: '📋',
    href: '/admin/bookings/pending',
    description: 'Check pending bookings',
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    id: 'user-support',
    label: 'User Support',
    icon: '🎧',
    href: '/admin/communications/support',
    description: 'Handle support tickets',
    color: 'bg-purple-500 hover:bg-purple-600'
  }
];

export default function QuickActions() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      {/* Mobile dropdown button */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <span className="mr-2">⚡</span>
          Quick Actions
          <span className="ml-2">▼</span>
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="py-1">
              {quickActions.map((action) => (
                <Link
                  key={action.id}
                  href={action.href}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="text-lg mr-3">{action.icon}</span>
                  <div>
                    <div className="font-medium">{action.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {action.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop buttons */}
      <div className="hidden sm:flex items-center space-x-2">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${action.color} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
            title={action.description}
          >
            <span className="mr-1">{action.icon}</span>
            <span className="hidden lg:inline">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}