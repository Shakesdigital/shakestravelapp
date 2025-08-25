'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import Link from 'next/link';

export default function AdminHeader() {
  const { 
    user, 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    darkMode, 
    toggleDarkMode, 
    notifications,
    markNotificationAsRead 
  } = useAdmin();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'k':
            event.preventDefault();
            setShowSearch(true);
            break;
          case '/':
            event.preventDefault();
            setShowSearch(true);
            break;
        }
      }
      if (event.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const formatNotificationTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:border-b-0 lg:shadow-none shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 lg:h-16">
          {/* Left side - Mobile menu button and breadcrumbs */}
          <div className="flex items-center flex-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Enhanced Breadcrumb Navigation */}
            <div className="ml-4 lg:ml-0 flex-1">
              <nav className="flex items-center justify-between" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <Link 
                      href="/admin" 
                      className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 group"
                    >
                      <span className="group-hover:scale-110 transition-transform duration-200">🏠</span>
                      <span className="ml-1 hidden sm:inline">Admin</span>
                    </Link>
                  </li>
                  <li className="text-gray-300 dark:text-gray-600">›</li>
                  <li className="flex items-center">
                    <span className="text-gray-900 dark:text-white font-medium">
                      Dashboard
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      Live
                    </span>
                  </li>
                </ol>

                {/* Page Actions */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200">
                    🔄
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Right side - Search, Actions and user menu */}
          <div className="flex items-center space-x-2">
            {/* Global Search */}
            <div className="relative" ref={searchRef} data-tour="search">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                title="Search (Ctrl+K)"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Dropdown */}
              {showSearch && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search anything..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        autoFocus
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Quick Search Results */}
                    {searchQuery && (
                      <div className="mt-4 space-y-2">
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Quick Results</div>
                        <div className="space-y-1">
                          <Link href="/admin/bookings" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="mr-3">📅</span>
                            <span className="text-sm">Recent Bookings</span>
                          </Link>
                          <Link href="/admin/users" className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                            <span className="mr-3">👥</span>
                            <span className="text-sm">User Management</span>
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                      Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">ESC</kbd> to close
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Link
                href="/admin/listings/experiences/new"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 hover:scale-105"
              >
                <span className="mr-1">➕</span>
                Add Experience
              </Link>
            </div>

            {/* Dark mode toggle with animation */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 group"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative overflow-hidden">
                <span className={`block transition-transform duration-300 ${darkMode ? 'transform -translate-y-6' : 'transform translate-y-0'}`}>
                  🌙
                </span>
                <span className={`absolute top-0 transition-transform duration-300 ${darkMode ? 'transform translate-y-0' : 'transform translate-y-6'}`}>
                  ☀️
                </span>
              </div>
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-200 dark:group-hover:border-green-800 transition-colors duration-200"></div>
            </button>

            {/* Enhanced Notifications */}
            <div className="relative" ref={notificationRef} data-tour="notifications">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 relative group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-200">🔔</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
                <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-green-200 dark:group-hover:border-green-800 transition-colors duration-200"></div>
              </button>

              {/* Enhanced Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {unreadNotifications} unread
                      </span>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                            !notification.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                          onClick={() => {
                            markNotificationAsRead(notification.id);
                            if (notification.action) {
                              window.location.href = notification.action.url;
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 w-2 h-2 rounded-full ${
                              notification.type === 'success' ? 'bg-green-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              notification.type === 'error' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                {formatNotificationTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href="/admin/notifications"
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                    >
                      View all notifications →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-medium shadow-lg group-hover:scale-105 transition-transform duration-200">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role.replace('_', ' ')}
                  </div>
                </div>
                <span className={`text-xs transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {/* Enhanced User dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-300">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                    <span className="inline-block px-2 py-1 mt-2 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      {user?.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/admin/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="mr-3">👤</span>
                      My Profile
                    </Link>
                    <Link
                      href="/admin/settings/account"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="mr-3">⚙️</span>
                      Account Settings
                    </Link>
                    <Link
                      href="/admin/help"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="mr-3">❓</span>
                      Help & Support
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                    <button
                      onClick={() => {
                        // Handle logout
                        console.log('Logout clicked');
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <span className="mr-3">🚪</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}