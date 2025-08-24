'use client';

import React from 'react';
import WYSIWYGEditor from '@/components/Admin/Editor/WYSIWYGEditor';
import SEOEditor from '@/components/Admin/SEO/SEOEditor';
import { AnimatedButton } from '@/components/Admin/UI/FeedbackComponents';
import { HelpTooltip } from '@/components/Admin/UI/Tooltip';

export default function NewArticle() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Write New Article
            </h1>
            <HelpTooltip content="Create engaging travel content with rich media, SEO optimization, and more." />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a new travel article or blog post
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <AnimatedButton variant="secondary">
            📋 Preview
          </AnimatedButton>
          <AnimatedButton variant="primary">
            💾 Save
          </AnimatedButton>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Article Title
            </label>
            <input
              type="text"
              placeholder="Enter article title..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* WYSIWYG Editor */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Article Content
            </label>
            <WYSIWYGEditor 
              content="" 
              onChange={(content) => console.log('Content updated:', content)} 
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Article Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="article-url-slug"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="">Select a category...</option>
                  <option value="destinations">Destinations</option>
                  <option value="activities">Activities</option>
                  <option value="guides">Travel Guides</option>
                  <option value="tips">Travel Tips</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">
                    Choose Image
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h3>
            <SEOEditor 
              data={{
                title: '',
                description: '',
                keywords: [],
              }}
              onChange={(data) => console.log('SEO data updated:', data)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
