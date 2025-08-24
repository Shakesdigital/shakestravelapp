'use client';

import React from 'react';

// Skeleton loader component
export function SkeletonLoader({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
  );
}

// Stats card skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader className="w-8 h-8 rounded-full" />
        <SkeletonLoader className="w-16 h-5 rounded-full" />
      </div>
      <div className="mb-2">
        <SkeletonLoader className="w-20 h-8 rounded" />
      </div>
      <div>
        <SkeletonLoader className="w-24 h-4 rounded mb-1" />
        <SkeletonLoader className="w-16 h-3 rounded" />
      </div>
    </div>
  );
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonLoader key={i} className="h-4 rounded" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <SkeletonLoader key={colIndex} className="h-4 rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Chart skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <SkeletonLoader className="w-32 h-6 rounded mb-2" />
          <SkeletonLoader className="w-48 h-4 rounded" />
        </div>
        <SkeletonLoader className="w-24 h-8 rounded" />
      </div>
      
      {/* Chart area */}
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center">
            <SkeletonLoader className="w-8 h-4 rounded mr-3" />
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative overflow-hidden">
              <div
                className="bg-gray-300 dark:bg-gray-600 h-6 rounded-full"
                style={{ width: `${Math.random() * 80 + 20}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Activity feed skeleton
export function ActivitySkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <SkeletonLoader className="w-28 h-6 rounded mb-1" />
          <SkeletonLoader className="w-40 h-4 rounded" />
        </div>
        <SkeletonLoader className="w-16 h-4 rounded" />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-start space-x-3">
            <SkeletonLoader className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1">
              <SkeletonLoader className="w-3/4 h-4 rounded mb-2" />
              <SkeletonLoader className="w-full h-3 rounded mb-2" />
              <div className="flex items-center justify-between">
                <SkeletonLoader className="w-16 h-3 rounded" />
                <SkeletonLoader className="w-12 h-3 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading spinner component
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-green-600"></div>
    </div>
  );
}

// Full page loading state
export function PageLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Loading Dashboard</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we prepare your admin panel...</p>
      </div>
    </div>
  );
}

// Empty state component
export function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: string; 
  title: string; 
  description: string; 
  action?: React.ReactNode; 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {action && action}
    </div>
  );
}

// Error state component
export function ErrorState({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading this content.", 
  onRetry 
}: { 
  title?: string; 
  description?: string; 
  onRetry?: () => void; 
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">😵</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          🔄 Try Again
        </button>
      )}
    </div>
  );
}