'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
  robots?: {
    index: boolean;
    follow: boolean;
    archive: boolean;
    snippet: boolean;
  };
  focusKeyword?: string;
  readabilityScore?: number;
  seoScore?: number;
}

interface SEOEditorProps {
  data: SEOData;
  onChange: (data: SEOData) => void;
  contentPreview?: string;
  showAdvanced?: boolean;
}

export default function SEOEditor({ 
  data, 
  onChange, 
  contentPreview = '',
  showAdvanced = false 
}: SEOEditorProps) {
  const [seoData, setSeoData] = useState<SEOData>(data);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced' | 'analysis'>('basic');
  const [keywordInput, setKeywordInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    onChange(seoData);
  }, [seoData, onChange]);

  // Auto-generate SEO suggestions
  const generateSuggestions = () => {
    const suggestions: string[] = [];
    
    // Title length check
    if (seoData.title.length < 30) suggestions.push('Title is too short (recommended: 30-60 characters)');
    if (seoData.title.length > 60) suggestions.push('Title is too long (recommended: 30-60 characters)');
    
    // Description length check
    if (seoData.description.length < 120) suggestions.push('Meta description is too short (recommended: 120-160 characters)');
    if (seoData.description.length > 160) suggestions.push('Meta description is too long (recommended: 120-160 characters)');
    
    // Keywords check
    if (seoData.keywords.length < 3) suggestions.push('Add more keywords (recommended: 3-5 keywords)');
    if (seoData.keywords.length > 5) suggestions.push('Too many keywords (recommended: 3-5 keywords)');
    
    // Focus keyword in title
    if (seoData.focusKeyword && !seoData.title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) {
      suggestions.push('Focus keyword not found in title');
    }
    
    // Focus keyword in description
    if (seoData.focusKeyword && !seoData.description.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) {
      suggestions.push('Focus keyword not found in meta description');
    }

    return suggestions;
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !seoData.keywords.includes(keywordInput.trim())) {
      setSeoData({
        ...seoData,
        keywords: [...seoData.keywords, keywordInput.trim()]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setSeoData({
      ...seoData,
      keywords: seoData.keywords.filter(k => k !== keyword)
    });
  };

  const calculateSEOScore = (): number => {
    let score = 0;
    const maxScore = 100;
    
    // Title optimization (25 points)
    if (seoData.title.length >= 30 && seoData.title.length <= 60) score += 15;
    if (seoData.focusKeyword && seoData.title.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) score += 10;
    
    // Description optimization (25 points)
    if (seoData.description.length >= 120 && seoData.description.length <= 160) score += 15;
    if (seoData.focusKeyword && seoData.description.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) score += 10;
    
    // Keywords optimization (20 points)
    if (seoData.keywords.length >= 3 && seoData.keywords.length <= 5) score += 20;
    
    // Social media optimization (15 points)
    if (seoData.ogTitle && seoData.ogDescription) score += 10;
    if (seoData.ogImage) score += 5;
    
    // Technical SEO (15 points)
    if (seoData.canonicalUrl) score += 5;
    if (seoData.robots) score += 5;
    if (seoData.structuredData) score += 5;
    
    return Math.min(score, maxScore);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  const tabs = [
    { id: 'basic', label: 'Basic SEO', icon: '🎯' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'advanced', label: 'Advanced', icon: '⚙️' },
    { id: 'analysis', label: 'Analysis', icon: '📊' }
  ];

  const currentScore = calculateSEOScore();
  const suggestions = generateSuggestions();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              🔍 SEO Optimization
            </h3>
            <HelpTooltip content="Optimize your content for search engines and social media platforms." />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className={`text-lg font-bold ${getScoreColor(currentScore)}`}>
                {currentScore}/100
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {getScoreLabel(currentScore)}
              </div>
            </div>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              👁️ Preview
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScore >= 80 ? 'bg-green-500' :
                currentScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${currentScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* SEO Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SEO Title
              </label>
              <input
                value={seoData.title}
                onChange={(e) => setSeoData({ ...seoData, title: e.target.value })}
                placeholder="Enter SEO-optimized title..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                maxLength={60}
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${
                  seoData.title.length >= 30 && seoData.title.length <= 60 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {seoData.title.length}/60 characters
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 30-60 characters
                </span>
              </div>
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Meta Description
              </label>
              <textarea
                value={seoData.description}
                onChange={(e) => setSeoData({ ...seoData, description: e.target.value })}
                placeholder="Write a compelling meta description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                rows={3}
                maxLength={160}
              />
              <div className="flex justify-between items-center mt-1">
                <span className={`text-xs ${
                  seoData.description.length >= 120 && seoData.description.length <= 160 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-yellow-600 dark:text-yellow-400'
                }`}>
                  {seoData.description.length}/160 characters
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended: 120-160 characters
                </span>
              </div>
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Focus Keyword
              </label>
              <input
                value={seoData.focusKeyword || ''}
                onChange={(e) => setSeoData({ ...seoData, focusKeyword: e.target.value })}
                placeholder="Enter your main keyword..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                The primary keyword you want this content to rank for
              </p>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Keywords & Tags
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                  placeholder="Add a keyword..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <AnimatedButton onClick={addKeyword} size="sm">
                  Add
                </AnimatedButton>
              </div>
              <div className="flex flex-wrap gap-2">
                {seoData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                  >
                    {keyword}
                    <button
                      onClick={() => removeKeyword(keyword)}
                      className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                value={seoData.canonicalUrl || ''}
                onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                placeholder="https://example.com/canonical-url"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Specify the canonical version of this page to prevent duplicate content issues
              </p>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-6">
            {/* Open Graph */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                📘 Facebook / Open Graph
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Title
                  </label>
                  <input
                    value={seoData.ogTitle || seoData.title}
                    onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
                    placeholder="Facebook title (defaults to SEO title)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Description
                  </label>
                  <textarea
                    value={seoData.ogDescription || seoData.description}
                    onChange={(e) => setSeoData({ ...seoData, ogDescription: e.target.value })}
                    placeholder="Facebook description (defaults to meta description)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Image
                  </label>
                  <input
                    value={seoData.ogImage || ''}
                    onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                    placeholder="https://example.com/og-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended size: 1200x630px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    OG Type
                  </label>
                  <select
                    value={seoData.ogType || 'website'}
                    onChange={(e) => setSeoData({ ...seoData, ogType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="product">Product</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Twitter */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                🐦 Twitter Card
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Card Type
                  </label>
                  <select
                    value={seoData.twitterCard || 'summary_large_image'}
                    onChange={(e) => setSeoData({ ...seoData, twitterCard: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Title
                  </label>
                  <input
                    value={seoData.twitterTitle || seoData.title}
                    onChange={(e) => setSeoData({ ...seoData, twitterTitle: e.target.value })}
                    placeholder="Twitter title (defaults to SEO title)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Description
                  </label>
                  <textarea
                    value={seoData.twitterDescription || seoData.description}
                    onChange={(e) => setSeoData({ ...seoData, twitterDescription: e.target.value })}
                    placeholder="Twitter description (defaults to meta description)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Twitter Image
                  </label>
                  <input
                    value={seoData.twitterImage || seoData.ogImage || ''}
                    onChange={(e) => setSeoData({ ...seoData, twitterImage: e.target.value })}
                    placeholder="https://example.com/twitter-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Robots Meta */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                🤖 Robots Meta Tags
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={seoData.robots?.index !== false}
                    onChange={(e) => setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, index: e.target.checked }
                    })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Index</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={seoData.robots?.follow !== false}
                    onChange={(e) => setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, follow: e.target.checked }
                    })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Follow</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={seoData.robots?.archive !== false}
                    onChange={(e) => setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, archive: e.target.checked }
                    })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Archive</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={seoData.robots?.snippet !== false}
                    onChange={(e) => setSeoData({
                      ...seoData,
                      robots: { ...seoData.robots, snippet: e.target.checked }
                    })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Snippet</span>
                </label>
              </div>
            </div>

            {/* Structured Data */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                📋 Structured Data (JSON-LD)
              </h4>
              
              <textarea
                value={seoData.structuredData ? JSON.stringify(seoData.structuredData, null, 2) : ''}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setSeoData({ ...seoData, structuredData: parsed });
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "TravelAction",
  "target": {
    "@type": "EntryPoint",
    "name": "Destination Name"
  }
}`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm"
                rows={8}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add structured data to help search engines understand your content
              </p>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* SEO Score Breakdown */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                📊 SEO Score Breakdown
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Title Optimization</span>
                  <span className={`text-sm font-medium ${
                    (seoData.title.length >= 30 && seoData.title.length <= 60) && 
                    (!seoData.focusKeyword || seoData.title.toLowerCase().includes(seoData.focusKeyword.toLowerCase()))
                      ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(seoData.title.length >= 30 && seoData.title.length <= 60) && 
                     (!seoData.focusKeyword || seoData.title.toLowerCase().includes(seoData.focusKeyword.toLowerCase()))
                      ? '25/25' : '10/25'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Description Optimization</span>
                  <span className={`text-sm font-medium ${
                    (seoData.description.length >= 120 && seoData.description.length <= 160) && 
                    (!seoData.focusKeyword || seoData.description.toLowerCase().includes(seoData.focusKeyword.toLowerCase()))
                      ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {(seoData.description.length >= 120 && seoData.description.length <= 160) && 
                     (!seoData.focusKeyword || seoData.description.toLowerCase().includes(seoData.focusKeyword.toLowerCase()))
                      ? '25/25' : '10/25'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Keywords</span>
                  <span className={`text-sm font-medium ${
                    seoData.keywords.length >= 3 && seoData.keywords.length <= 5
                      ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {seoData.keywords.length >= 3 && seoData.keywords.length <= 5 ? '20/20' : '5/20'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Social Media</span>
                  <span className={`text-sm font-medium ${
                    seoData.ogTitle && seoData.ogDescription && seoData.ogImage
                      ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {seoData.ogTitle && seoData.ogDescription && seoData.ogImage ? '15/15' : '5/15'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Technical SEO</span>
                  <span className={`text-sm font-medium ${
                    seoData.canonicalUrl && seoData.robots && seoData.structuredData
                      ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {seoData.canonicalUrl && seoData.robots && seoData.structuredData ? '15/15' : '5/15'}
                  </span>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                💡 SEO Suggestions
              </h4>
              
              {suggestions.length > 0 ? (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-0.5">⚠️</span>
                      <span className="text-sm text-yellow-800 dark:text-yellow-300">{suggestion}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 dark:text-green-400">✅</span>
                    <span className="text-sm text-green-800 dark:text-green-300">
                      Great job! Your SEO optimization looks excellent.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SERP Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  🔍 Search Result Preview
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              {/* Google SERP Preview */}
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-900">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {seoData.canonicalUrl || 'https://example.com/page-url'}
                </div>
                <h3 className="text-lg text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mb-1">
                  {seoData.title || 'Page Title'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {seoData.description || 'Meta description will appear here...'}
                </p>
              </div>

              {/* Social Media Previews */}
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Facebook Preview</h4>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {seoData.ogImage && (
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 bg-cover bg-center" 
                           style={{ backgroundImage: `url(${seoData.ogImage})` }}></div>
                    )}
                    <div className="p-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {seoData.canonicalUrl || 'example.com'}
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {seoData.ogTitle || seoData.title || 'Page Title'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {seoData.ogDescription || seoData.description || 'Description...'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Twitter Preview</h4>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {(seoData.twitterImage || seoData.ogImage) && (
                      <div className="h-32 bg-gray-200 dark:bg-gray-700 bg-cover bg-center" 
                           style={{ backgroundImage: `url(${seoData.twitterImage || seoData.ogImage})` }}></div>
                    )}
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {seoData.twitterTitle || seoData.title || 'Page Title'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {seoData.twitterDescription || seoData.description || 'Description...'}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {seoData.canonicalUrl || 'example.com'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}