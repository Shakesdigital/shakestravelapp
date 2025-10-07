'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

/**
 * Dashboard Router
 *
 * This page acts as a smart router that redirects users to the appropriate
 * dashboard based on their role:
 * - 'user' or 'guest' -> Content Dashboard (/dashboard/content)
 * - 'host' -> Host Dashboard (/host/dashboard)
 * - 'admin' -> Admin Dashboard (/admin/dashboard)
 */

function DashboardRouter() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'host':
          router.replace('/host/dashboard');
          break;
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        case 'user':
        case 'guest':
        default:
          router.replace('/dashboard/content');
          break;
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking role
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show loading during redirect
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardRouter />
    </AuthGuard>
  );
}
