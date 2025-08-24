'use client';

import React from 'react';
import Link from 'next/link';

interface ImportantNotification {
  id: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: {
    label: string;
    href: string;
  };
  dismissible: boolean;
}

const notifications: ImportantNotification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Payment Issue Alert',
    message: '3 failed payment transactions require immediate attention.',
    action: {
      label: 'Review Payments',
      href: '/admin/bookings/payments'
    },
    dismissible: true
  },
  {
    id: '2',
    type: 'warning',
    title: 'Pending Approvals',
    message: '5 new accommodation listings waiting for approval.',
    action: {
      label: 'Review Listings',
      href: '/admin/listings/accommodations?status=pending'
    },
    dismissible: true
  },
  {
    id: '3',
    type: 'info',
    title: 'System Maintenance',
    message: 'Scheduled maintenance tonight from 2:00 AM to 4:00 AM UTC.',
    dismissible: false
  },
  {
    id: '4',
    type: 'success',
    title: 'Milestone Reached!',
    message: 'Platform has reached 1,000 successful bookings this month.',
    dismissible: true
  }
];

const getNotificationIcon = (type: ImportantNotification['type']) => {
  switch (type) {
    case 'urgent': return '🚨';
    case 'warning': return '⚠️';
    case 'info': return 'ℹ️';
    case 'success': return '✅';
    default: return '📢';
  }
};

const getNotificationStyle = (type: ImportantNotification['type']) => {
  switch (type) {
    case 'urgent':
      return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
    case 'info':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
    case 'success':
      return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    default:
      return 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600';
  }
};

const getTextColor = (type: ImportantNotification['type']) => {
  switch (type) {
    case 'urgent':
      return 'text-red-800 dark:text-red-200';
    case 'warning':
      return 'text-yellow-800 dark:text-yellow-200';
    case 'info':
      return 'text-blue-800 dark:text-blue-200';
    case 'success':
      return 'text-green-800 dark:text-green-200';
    default:
      return 'text-gray-800 dark:text-gray-200';
  }
};

export default function NotificationPanel() {
  const [dismissedNotifications, setDismissedNotifications] = React.useState<string[]>([]);

  const visibleNotifications = notifications.filter(
    notification => !dismissedNotifications.includes(notification.id)
  );

  const dismissNotification = (id: string) => {
    setDismissedNotifications(prev => [...prev, id]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Important Notifications
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Critical updates requiring your attention
          </p>
        </div>
        <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {visibleNotifications.length}
        </span>
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        {visibleNotifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-gray-500 dark:text-gray-400">
              All caught up! No urgent notifications.
            </p>
          </div>
        ) : (
          visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${getNotificationStyle(notification.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                </div>
                
                <div className="ml-3 flex-1">
                  <h4 className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-90`}>
                    {notification.message}
                  </p>
                  
                  {notification.action && (
                    <div className="mt-3">
                      <Link
                        href={notification.action.href}
                        className={`inline-flex items-center text-sm font-medium hover:underline ${getTextColor(notification.type)}`}
                      >
                        {notification.action.label} →
                      </Link>
                    </div>
                  )}
                </div>

                {notification.dismissible && (
                  <div className="flex-shrink-0 ml-4">
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className={`${getTextColor(notification.type)} opacity-60 hover:opacity-100 transition-opacity duration-200`}
                      title="Dismiss notification"
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/notifications"
            className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            View All Notifications →
          </Link>
          <div className="flex items-center space-x-2">
            <button className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              ⚙️ Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}