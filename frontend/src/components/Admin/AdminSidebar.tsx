'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';

// Icons (using emoji for now, can be replaced with icon library)
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊',
    href: '/admin',
    description: 'Overview & Analytics',
    badge: null,
    shortcut: 'Ctrl+D'
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: '📝',
    href: '/admin/content',
    description: 'Pages, Articles, Media',
    badge: '12',
    badgeColor: 'bg-blue-500',
    submenu: [
      { label: 'Pages', href: '/admin/content/pages', icon: '📄' },
      { label: 'Blog Articles', href: '/admin/content/articles', icon: '📰' },
      { label: 'Media Library', href: '/admin/content/media', icon: '🖼️' },
      { label: 'Travel Guides', href: '/admin/content/guides', icon: '🗺️' }
    ]
  },
  {
    id: 'listings',
    label: 'Listings Management',
    icon: '🏨',
    href: '/admin/listings',
    description: 'Experiences & Accommodations',
    badge: '5',
    badgeColor: 'bg-yellow-500',
    submenu: [
      { label: 'Experiences', href: '/admin/listings/experiences', icon: '🎯' },
      { label: 'Accommodations', href: '/admin/listings/accommodations', icon: '🏠' },
      { label: 'Categories', href: '/admin/listings/categories', icon: '📂' },
      { label: 'Destinations', href: '/admin/listings/destinations', icon: '🌍' }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: '👥',
    href: '/admin/users',
    description: 'Users & Permissions',
    submenu: [
      { label: 'Website Users', href: '/admin/users/customers', icon: '👤' },
      { label: 'Host Partners', href: '/admin/users/hosts', icon: '🤝' },
      { label: 'Admin Users', href: '/admin/users/admins', icon: '👨‍💼' },
      { label: 'Roles & Permissions', href: '/admin/users/roles', icon: '🔐' }
    ]
  },
  {
    id: 'bookings',
    label: 'Bookings & Reservations',
    icon: '📅',
    href: '/admin/bookings',
    description: 'Reservations & Payments',
    badge: '23',
    badgeColor: 'bg-green-500',
    submenu: [
      { label: 'All Bookings', href: '/admin/bookings/all', icon: '📋' },
      { label: 'Pending Approval', href: '/admin/bookings/pending', icon: '⏳' },
      { label: 'Cancellations', href: '/admin/bookings/cancelled', icon: '❌' },
      { label: 'Payment Issues', href: '/admin/bookings/payments', icon: '💳' }
    ]
  },
  {
    id: 'communications',
    label: 'Messages & Communications',
    icon: '💬',
    href: '/admin/communications',
    description: 'Support & Messaging',
    submenu: [
      { label: 'Customer Support', href: '/admin/communications/support', icon: '🎧' },
      { label: 'Host Messages', href: '/admin/communications/hosts', icon: '📧' },
      { label: 'System Notifications', href: '/admin/communications/notifications', icon: '🔔' },
      { label: 'Email Templates', href: '/admin/communications/templates', icon: '📨' }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    icon: '📈',
    href: '/admin/analytics',
    description: 'Insights & Reports',
    submenu: [
      { label: 'Revenue Reports', href: '/admin/analytics/revenue', icon: '💰' },
      { label: 'User Analytics', href: '/admin/analytics/users', icon: '📊' },
      { label: 'Booking Trends', href: '/admin/analytics/bookings', icon: '📈' },
      { label: 'Performance Metrics', href: '/admin/analytics/performance', icon: '⚡' }
    ]
  },
  {
    id: 'settings',
    label: 'Settings & Configuration',
    icon: '⚙️',
    href: '/admin/settings',
    description: 'System Configuration',
    submenu: [
      { label: 'Platform Settings', href: '/admin/settings/platform', icon: '🌐' },
      { label: 'Payment Settings', href: '/admin/settings/payments', icon: '💎' },
      { label: 'Email Configuration', href: '/admin/settings/email', icon: '📬' },
      { label: 'Security Settings', href: '/admin/settings/security', icon: '🔒' }
    ]
  }
];

export default function AdminSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useAdmin();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const pathname = usePathname();

  // Auto-expand current menu section
  useEffect(() => {
    const currentSection = menuItems.find(item => 
      pathname.startsWith(item.href) && item.href !== '/admin'
    );
    if (currentSection && currentSection.submenu) {
      setExpandedMenu(currentSection.id);
    }
  }, [pathname]);

  const isActiveRoute = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar - Properly constrained below main navbar */}
      <div
        data-tour="sidebar"
        className={`fixed top-20 bottom-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{ height: 'calc(100vh - 5rem)' }} /* Account for 20px (5rem) top spacing */
      >
        {/* Logo - Clean header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
              🌍
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Shakes Travel
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {/* Navigation - Clean organization with proper scrolling and padding */}
        <nav className="flex-1 mt-6 px-3 pr-6 overflow-y-auto">
          {/* Quick Stats Banner - Better design */}
          <div className="mb-6 p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg">
            <div className="text-sm font-semibold mb-2 opacity-90">Today's Overview</div>
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center gap-1">
                <span>📊</span>
                24 Bookings
              </span>
              <span className="flex items-center gap-1">
                <span>💰</span>
                $12.5k
              </span>
            </div>
          </div>

          <div className="space-y-2 pb-4">
            {menuItems.map((item) => (
              <div key={item.id}>
                {/* Main menu item */}
                <div 
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredItem(item.id);
                    if (sidebarCollapsed) setShowTooltip(item.id);
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                    setShowTooltip(null);
                  }}
                >
                  <div className="flex items-center group">
                    <Link
                      href={item.href}
                      className={`flex items-center flex-1 px-3 py-2.5 mr-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActiveRoute(item.href)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      } ${hoveredItem === item.id ? 'transform scale-[1.01]' : ''}`}
                    >
                      <span className="text-base mr-3 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</span>
                      <div className="flex-1 min-w-0 overflow-hidden pr-2">
                        <div className="font-medium text-sm truncate leading-tight">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                          {item.description}
                        </div>
                      </div>
                      {item.badge && (
                        <span className={`ml-1 px-1.5 py-0.5 text-xs font-semibold text-white rounded-full flex-shrink-0 ${item.badgeColor || 'bg-red-500'}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  
                    {/* Submenu toggle - Better positioned */}
                    {item.submenu && (
                      <button
                        onClick={() => toggleSubmenu(item.id)}
                        className="p-1.5 mr-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 rounded-md transition-all duration-200 flex-shrink-0"
                        title={expandedMenu === item.id ? 'Collapse menu' : 'Expand menu'}
                      >
                        <span className={`transform transition-transform duration-300 text-xs block w-4 h-4 flex items-center justify-center ${
                          expandedMenu === item.id ? 'rotate-90' : ''
                        }`}>
                          ▶
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && showTooltip === item.id && (
                    <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-300 mt-1">{item.description}</div>
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>

                {/* Submenu with animation and proper spacing */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out mr-2 ${
                  item.submenu && expandedMenu === item.id ? 'max-h-96 opacity-100 mb-2' : 'max-h-0 opacity-0'
                }`}>
                  {item.submenu && (
                    <div className="mt-2 ml-6 mr-4 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                      {item.submenu.map((subItem, index) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 group ${
                            pathname === subItem.href
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="text-sm mr-2 flex-shrink-0 transition-transform duration-200 group-hover:scale-110">{subItem.icon}</span>
                          <span className="group-hover:translate-x-0.5 transition-transform duration-200 truncate text-xs pr-2">{subItem.label}</span>
                          {pathname === subItem.href && (
                            <div className="ml-auto w-1 h-1 bg-green-500 rounded-full animate-ping flex-shrink-0"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer - Contained within sidebar */}
        <div className="flex-shrink-0 mt-auto p-4 mr-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 rounded-t-lg">
          <div className="space-y-2">
            {/* System Status */}
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-gray-500 dark:text-gray-400 truncate">Status</span>
              <span className="flex items-center text-green-600 dark:text-green-400 flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-xs">Live</span>
              </span>
            </div>
            
            {/* Quick Actions - More compact */}
            <div className="flex justify-center space-x-1 px-1">
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded transition-all duration-200 text-sm"
                title="Help & Support"
              >
                ❓
              </button>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded transition-all duration-200 text-sm"
                title="Settings"
              >
                ⚙️
              </button>
              <button 
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 rounded transition-all duration-200 text-sm"
                title="Feedback"
              >
                📝
              </button>
            </div>
            
            {/* Version Info */}
            <div className="text-xs text-gray-400 dark:text-gray-500 text-center truncate px-1">
              v2.1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}