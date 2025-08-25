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
      <div className="space-y-8">
        {/* Dashboard Header - Clean and aligned */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6" data-tour="header">
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                  Dashboard Overview
                </h1>
                <HelpTooltip content="This dashboard provides a comprehensive overview of your travel platform's performance, including key metrics, recent activities, and important notifications." />
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Welcome back! Here's what's happening with your travel platform.
              </p>
              
              {/* Quick insights - Better organized */}
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm">
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-green-700 dark:text-green-300 font-medium">System Operational</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </div>
                <button 
                  onClick={restartTour}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium hover:underline transition-colors"
                >
                  🎯 Take Tour Again
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:flex-shrink-0" data-tour="quick-actions">
            <QuickActions />
          </div>
        </div>

        {/* Key Stats - Clean spacing */}
        <div data-tour="stats">
          <DashboardStats />
        </div>

        {/* Main Dashboard Grid - Better organized */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Analytics Charts - Main content */}
          <div className="xl:col-span-2 space-y-6">
            <AnalyticsCharts />
          </div>

          {/* Side Panel - Clean organization */}
          <div className="xl:col-span-1 space-y-6">
            <div data-tour="notifications">
              <NotificationPanel />
            </div>
            <RecentActivity />
          </div>
        </div>
        
        {/* Getting Started Panel - Better organized */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>🚀</span>
                Getting Started
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                New to the admin panel? Check out these essential tasks to get your platform running smoothly.
              </p>
            </div>
            <div className="hidden lg:block text-6xl opacity-20">
              🎯
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">📝</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">Add Your First Experience</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Create compelling travel experiences for your customers.</p>
              <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                Get Started
                <span>→</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🏨</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">Configure Accommodations</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Set up lodging options and pricing.</p>
              <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                Configure
                <span>→</span>
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-base">Platform Settings</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">Customize your platform settings and preferences.</p>
              <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                Settings
                <span>→</span>
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