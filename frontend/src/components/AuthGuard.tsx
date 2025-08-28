'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: 'user' | 'host' | 'admin';
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireRole,
  redirectTo = '/auth/login'
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const { user: netlifyUser, loading: netlifyLoading } = useNetlifyIdentity();
  const router = useRouter();
  const pathname = usePathname();

  // User is authenticated if either auth system has a user
  const isAuthenticated = user || netlifyUser;
  const isLoading = loading || netlifyLoading;

  useEffect(() => {
    if (isLoading) return; // Wait for both auth systems to load

    // If authentication is required but user is not logged in via either system
    if (requireAuth && !isAuthenticated) {
      const returnUrl = encodeURIComponent(pathname);
      router.push(`${redirectTo}?returnUrl=${returnUrl}`);
      return;
    }

    // If specific role is required but user doesn't have it
    if (requireRole && user && user.role !== requireRole) {
      router.push('/unauthorized');
      return;
    }

    // If user is logged in but trying to access auth pages
    if (!requireAuth && isAuthenticated && (pathname.startsWith('/auth/'))) {
      router.push('/profile');
      return;
    }
  }, [isAuthenticated, isLoading, requireAuth, requireRole, router, pathname, redirectTo, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, show nothing (redirect will happen)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If specific role is required but user doesn't have it, show nothing (redirect will happen)
  if (requireRole && user && user.role !== requireRole) {
    return null;
  }

  // If user is authenticated but trying to access auth pages, show nothing (redirect will happen)
  if (!requireAuth && isAuthenticated && pathname.startsWith('/auth/')) {
    return null;
  }

  return <>{children}</>;
}

// Higher-order component for protecting pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<AuthGuardProps, 'children'>
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}

// Hook for checking auth status in components
export function useAuthGuard(requireRole?: 'user' | 'host' | 'admin') {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = () => {
    if (loading) return { authorized: false, loading: true };

    if (!user) return { authorized: false, loading: false };

    if (requireRole && user.role !== requireRole) {
      return { authorized: false, loading: false, hasWrongRole: true };
    }

    return { authorized: true, loading: false };
  };

  const redirectToLogin = () => {
    const returnUrl = encodeURIComponent(pathname);
    router.push(`/auth/login?returnUrl=${returnUrl}`);
  };

  const redirectToUnauthorized = () => {
    router.push('/unauthorized');
  };

  return {
    ...checkAuth(),
    user,
    redirectToLogin,
    redirectToUnauthorized
  };
}