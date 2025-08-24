'use client';

import React from 'react';
import DashboardStats from '@/components/Admin/Dashboard/DashboardStats';
import RecentActivity from '@/components/Admin/Dashboard/RecentActivity';
import AnalyticsCharts from '@/components/Admin/Dashboard/AnalyticsCharts';
import QuickActions from '@/components/Admin/Dashboard/QuickActions';
import NotificationPanel from '@/components/Admin/Dashboard/NotificationPanel';
import OnboardingTour, { useOnboarding } from '@/components/Admin/UI/OnboardingTour';
import { ToastProvider } from '@/components/Admin/UI/FeedbackComponents';
import { HelpTooltip } from '@/components/Admin/UI/Tooltip';

export default function AdminDashboard() {
  const { showTour, completeTour, skipTour, restartTour } = useOnboarding();

  return (
    <ToastProvider>
      <div className="space-y-6">
        {/* Enhanced Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between" data-tour="header">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard Overview
              </h1>
              <HelpTooltip content="This dashboard provides a comprehensive overview of your travel platform's performance, including key metrics, recent activities, and important notifications." />
            </div>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Welcome back! Here's what's happening with your travel platform.
            </p>
            
            {/* Quick insights */}
            <div className="mt-3 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>System Operational</span>
              </div>
              <div>Last updated: {new Date().toLocaleTimeString()}</div>
              <button 
                onClick={restartTour}
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Take Tour Again
              </button>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-0" data-tour="quick-actions">
            <QuickActions />
          </div>
        </div>

        {/* Enhanced Key Stats */}
        <div data-tour="stats">
          <DashboardStats />
        </div>

        {/* Enhanced Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Analytics Charts */}
          <div className="lg:col-span-2">
            <AnalyticsCharts />
          </div>

          {/* Enhanced Side Panel */}
          <div className="space-y-6">
            <div data-tour="notifications">
              <NotificationPanel />
            </div>
            <RecentActivity />
          </div>
        </div>
        
        {/* Additional Quick Access Panel */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🚀 Getting Started
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                New to the admin panel? Check out these essential tasks to get your platform running smoothly.
              </p>
            </div>
            <div className="hidden sm:block text-6xl opacity-20">
              🎯
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Add Your First Experience</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Create compelling travel experiences for your customers.</p>
              <button className="text-xs text-green-600 dark:text-green-400 hover:underline">
                Get Started →
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="text-2xl mb-2">🏨</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Configure Accommodations</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Set up lodging options and pricing.</p>
              <button className="text-xs text-green-600 dark:text-green-400 hover:underline">
                Configure →
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
              <div className="text-2xl mb-2">⚙️</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">Platform Settings</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Customize your platform settings and preferences.</p>
              <button className="text-xs text-green-600 dark:text-green-400 hover:underline">
                Settings →
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Onboarding Tour */}
      <OnboardingTour
        isVisible={showTour}
        onComplete={completeTour}
        onSkip={skipTour}
      />
    </ToastProvider>
  );
}