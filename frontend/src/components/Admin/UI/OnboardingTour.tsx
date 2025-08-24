'use client';

import React, { useState, useEffect } from 'react';

interface TourStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: '🎉 Welcome to Shakes Travel Admin!',
    content: 'Let\'s take a quick tour to help you get started with managing your travel platform.',
    position: 'bottom'
  },
  {
    id: 'sidebar',
    title: '🧭 Navigation Sidebar',
    content: 'Use the sidebar to navigate between different sections. Hover over items for quick descriptions.',
    target: '[data-tour="sidebar"]',
    position: 'right'
  },
  {
    id: 'stats',
    title: '📊 Performance Overview',
    content: 'Monitor key metrics like revenue, bookings, and user growth. Switch between different time periods.',
    target: '[data-tour="stats"]',
    position: 'bottom'
  },
  {
    id: 'notifications',
    title: '🔔 Stay Updated',
    content: 'Important notifications appear here. Click to view details and take action.',
    target: '[data-tour="notifications"]',
    position: 'bottom'
  },
  {
    id: 'quick-actions',
    title: '⚡ Quick Actions',
    content: 'Access frequently used actions like adding new experiences or reviewing bookings.',
    target: '[data-tour="quick-actions"]',
    position: 'bottom'
  },
  {
    id: 'search',
    title: '🔍 Global Search',
    content: 'Quickly find anything using the search feature. Press Ctrl+K for keyboard shortcut.',
    target: '[data-tour="search"]',
    position: 'bottom'
  }
];

interface OnboardingTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingTour({ isVisible, onComplete, onSkip }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const step = tourSteps[currentStep];
    if (step.target) {
      const element = document.querySelector(step.target) as HTMLElement;
      setTargetElement(element);
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.position = 'relative';
        element.style.zIndex = '60';
      }
    } else {
      setTargetElement(null);
    }

    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
      }
    };
  }, [currentStep, isVisible, targetElement]);

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const isLastStep = currentStep === tourSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300" />
      
      {/* Spotlight effect */}
      {targetElement && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-300"
          style={{
            top: targetElement.offsetTop - 8,
            left: targetElement.offsetLeft - 8,
            width: targetElement.offsetWidth + 16,
            height: targetElement.offsetHeight + 16,
            boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.5)',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Tour Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full animate-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentTourStep.title}
              </h3>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span>Step {currentStep + 1} of {tourSteps.length}</span>
                <span>{Math.round(((currentStep + 1) / tourSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {currentTourStep.content}
            </p>
            
            {currentTourStep.action && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <button
                  onClick={currentTourStep.action.onClick}
                  className="text-sm font-medium text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 transition-colors duration-200"
                >
                  {currentTourStep.action.label} →
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            >
              Skip Tour
            </button>
            
            <div className="flex items-center space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                {isLastStep ? 'Get Started! 🚀' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Hook to manage onboarding state
export function useOnboarding() {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('admin-onboarding-completed');
    if (!hasCompletedOnboarding) {
      setShowTour(true);
    }
  }, []);

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem('admin-onboarding-completed', 'true');
  };

  const skipTour = () => {
    setShowTour(false);
    localStorage.setItem('admin-onboarding-completed', 'true');
  };

  const restartTour = () => {
    setShowTour(true);
  };

  return {
    showTour,
    completeTour,
    skipTour,
    restartTour
  };
}