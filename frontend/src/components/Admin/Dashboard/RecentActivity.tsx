'use client';

import React from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  type: 'booking' | 'user' | 'listing' | 'payment' | 'review';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  status?: 'success' | 'pending' | 'failed';
  amount?: number;
  rating?: number;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'booking',
    title: 'New Booking Received',
    description: 'Gorilla Trekking Experience for 4 guests',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user: 'Sarah Johnson',
    status: 'success',
    amount: 2400
  },
  {
    id: '2',
    type: 'user',
    title: 'New User Registration',
    description: 'User completed profile setup',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    user: 'Michael Chen'
  },
  {
    id: '3',
    type: 'review',
    title: 'New Review Submitted',
    description: 'Lake Bunyonyi Cultural Tour',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    user: 'Emma Williams',
    rating: 5
  },
  {
    id: '4',
    type: 'listing',
    title: 'Listing Approval Needed',
    description: 'Murchison Falls Safari Lodge',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user: 'Safari Adventures Co.',
    status: 'pending'
  },
  {
    id: '5',
    type: 'payment',
    title: 'Payment Processed',
    description: 'White Water Rafting Adventure',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    user: 'David Miller',
    status: 'success',
    amount: 450
  },
  {
    id: '6',
    type: 'booking',
    title: 'Booking Cancelled',
    description: 'Mount Elgon Hiking Experience',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: 'Lisa Anderson',
    status: 'failed'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'booking': return '📅';
    case 'user': return '👤';
    case 'listing': return '🏨';
    case 'payment': return '💳';
    case 'review': return '⭐';
    default: return '📋';
  }
};

const getStatusColor = (status?: Activity['status']) => {
  switch (status) {
    case 'success': return 'text-green-600 dark:text-green-400';
    case 'pending': return 'text-yellow-600 dark:text-yellow-400';
    case 'failed': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const formatTimestamp = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return timestamp.toLocaleDateString();
};

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Latest platform activities and updates
          </p>
        </div>
        <Link
          href="/admin/activity"
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
        >
          View All →
        </Link>
      </div>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {/* Activity Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
              </div>
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {activity.description}
              </p>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-4">
                  {activity.user && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      👤 {activity.user}
                    </span>
                  )}
                  
                  {activity.status && (
                    <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  )}
                  
                  {activity.rating && (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < activity.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {activity.amount && (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ${activity.amount.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Showing last 6 activities</span>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-700 dark:hover:text-gray-300">
              🔄 Refresh
            </button>
            <button className="hover:text-gray-700 dark:hover:text-gray-300">
              ⚙️ Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}