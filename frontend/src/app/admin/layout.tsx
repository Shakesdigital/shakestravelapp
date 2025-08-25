'use client';

import React from 'react';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import AdminHeader from '@/components/Admin/AdminHeader';
import { AdminProvider } from '@/contexts/AdminContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="lg:pl-64 min-h-screen flex flex-col">
          {/* Top Header - Fixed height and clean */}
          <AdminHeader />
          
          {/* Page Content - Clean spacing aligned with sidebar */}
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}