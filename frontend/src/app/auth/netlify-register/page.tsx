'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNetlifyIdentity } from '@/contexts/NetlifyIdentityContext';
import NetlifyAuthButton from '@/components/NetlifyAuthButton';

export default function NetlifyRegisterPage() {
  const { user, loading } = useNetlifyIdentity();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !loading) {
      // Redirect to profile or onboarding after successful registration
      router.push('/profile');
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
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us for sustainable Uganda adventures
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <NetlifyAuthButton type="signup">
                Sign up with Netlify Identity
              </NetlifyAuthButton>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Features</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Google OAuth authentication
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Secure Netlify Identity service
              </div>
              <div className="flex items-center">
                <svg className="h-4 w-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Works only on live server
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/netlify-login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                By signing up, you agree to our{' '}
                <Link href="/terms" className="text-green-600 hover:text-green-500">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-green-600 hover:text-green-500">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}