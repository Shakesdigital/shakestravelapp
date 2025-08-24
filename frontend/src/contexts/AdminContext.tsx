'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  avatar?: string;
  permissions: string[];
}

interface AdminContextType {
  user: AdminUser | null;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  notifications: Notification[];
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleDarkMode: () => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

const AdminContext = createContext<AdminContextType | null>(null);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@shakestravelapp.com',
    role: 'super_admin',
    avatar: '',
    permissions: ['all']
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Booking Alert',
      message: '5 new bookings received in the last hour',
      type: 'success',
      timestamp: new Date(),
      read: false,
      action: { label: 'View Bookings', url: '/admin/bookings' }
    },
    {
      id: '2',
      title: 'Review Pending',
      message: '3 trip listings waiting for approval',
      type: 'warning',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      action: { label: 'Review Listings', url: '/admin/listings' }
    },
    {
      id: '3',
      title: 'System Update',
      message: 'Platform maintenance scheduled for tonight',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true
    }
  ]);

  useEffect(() => {
    // Load dark mode preference from localStorage
    const savedDarkMode = localStorage.getItem('admin-dark-mode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('admin-dark-mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AdminContext.Provider
      value={{
        user,
        sidebarCollapsed,
        darkMode,
        notifications,
        setSidebarCollapsed,
        toggleDarkMode,
        markNotificationAsRead,
        clearAllNotifications,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}