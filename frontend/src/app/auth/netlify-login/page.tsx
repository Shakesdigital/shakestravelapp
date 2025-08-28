'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';
import NetlifyAuthButton from '@/components/NetlifyAuthButton';

export default function NetlifyLoginPage() {
  const { user, loading } = useNetlifyIdentity();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !loading) {
      // Redirect to profile or dashboard after successful login
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      if (returnUrl) {
        router.push(returnUrl);
      } else {
        router.push('/profile');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="animate-spin mx-auto h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Loading authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Shakes Travel</h1>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account with Google OAuth or email
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <NetlifyAuthButton type="login">
                Sign in with Netlify Identity
              </NetlifyAuthButton>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/auth/netlify-register" className="font-medium text-green-600 hover:text-green-500">
                  Sign up here
                </Link>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                This page uses Netlify Identity with Google OAuth.<br/>
                Authentication happens on the live server only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}