'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import WYSIWYGEditor from '@/components/Admin/Editor/WYSIWYGEditor';
import SEOEditor from '@/components/Admin/SEO/SEOEditor';
import { AnimatedButton } from '@/components/Admin/UI/FeedbackComponents';
import { HelpTooltip } from '@/components/Admin/UI/Tooltip';
import VersionHistory from '@/components/Admin/Editor/VersionHistory';
import CategoryTagManager from '@/components/Admin/Content/CategoryTagManager';
import FeaturedImageGallery from '@/components/Admin/Content/FeaturedImageGallery';

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'quote' | 'list' | 'travel-info' | 'destination-card' | 'itinerary' | 'pricing-table';
  content: any;
  attributes?: any;
}

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

interface ContentData {
  id: string;
  title: string;
  type: 'page' | 'article';
  status: 'published' | 'draft' | 'scheduled';
  blocks: Block[];
  seo: SEOData;
  publishDate?: Date;
  lastModified: Date;
  author: string;
  slug: string;
  categories?: string[];
  tags?: string[];
  featured?: boolean;
}

export default function ContentEditClient() {
  const params = useParams();
  const contentId = params.id as string;
  
  const [content, setContent] = useState<ContentData>({
    id: contentId,
    title: 'Untitled Content',
    type: 'article',
    status: 'draft',
    blocks: [],
    seo: {
      title: '',
      description: '',
      keywords: [],
      robots: {
        index: true,
        follow: true,
        archive: true,
        snippet: true
      }
    },
    lastModified: new Date(),
    author: 'Current User',
    slug: 'untitled-content'
  });

  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (content.blocks.length > 0 || content.title !== 'Untitled Content') {
        handleSave(true); // Auto-save as draft
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearTimeout(autoSave);
  }, [content]);

  // Load content data
  useEffect(() => {
    if (contentId !== 'new') {
      // Load existing content
      // This would typically be an API call
      const mockContent: ContentData = {
        id: contentId,
        title: 'Ultimate Gorilla Trekking Guide',
        type: 'article',
        status: 'published',
        blocks: [
          {
            id: '1',
            type: 'heading',
            content: 'Ultimate Gorilla Trekking Guide',
            attributes: { level: 1 }
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'Embark on an extraordinary adventure through the lush rainforests of Rwanda and Uganda to encounter the magnificent mountain gorillas in their natural habitat.'
          },
          {
            id: '3',
            type: 'travel-info',
            content: {
              duration: '3-7 days',
              difficulty: 'Moderate',
              season: 'Dry season (June-September)',
              price: '$1,500-3,000'
            }
          }
        ],
        seo: {
          title: 'Ultimate Gorilla Trekking Guide 2024 - Rwanda & Uganda Adventures',
          description: 'Discover the best gorilla trekking experiences in Rwanda and Uganda. Complete guide with permits, best times to visit, and expert tips for your African adventure.',
          keywords: ['gorilla trekking', 'rwanda travel', 'uganda safari', 'mountain gorillas', 'africa adventure'],
          focusKeyword: 'gorilla trekking',
          canonicalUrl: 'https://shakestravelapp.com/guides/gorilla-trekking',
          ogTitle: 'Ultimate Gorilla Trekking Guide - African Wildlife Adventure',
          ogDescription: 'Experience the magic of encountering mountain gorillas in their natural habitat. Expert guide to gorilla trekking in Rwanda and Uganda.',
          ogImage: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200',
          ogType: 'article',
          twitterCard: 'summary_large_image',
          robots: {
            index: true,
            follow: true,
            archive: true,
            snippet: true
          },
          structuredData: {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Ultimate Gorilla Trekking Guide",
            "description": "Complete guide to gorilla trekking in Rwanda and Uganda",
            "author": {
              "@type": "Organization",
              "name": "Shakes Travel"
            }
          }
        },
        lastModified: new Date(),
        author: 'Travel Expert',
        slug: 'ultimate-gorilla-trekking-guide',
        categories: ['Wildlife', 'Adventure', 'Guides'],
        tags: ['gorilla', 'trekking', 'rwanda', 'uganda', 'safari'],
        featured: true
      };
      setContent(mockContent);
    }
  }, [contentId]);

  const handleSave = async (isDraft = false) => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedContent = {
      ...content,
      status: isDraft ? 'draft' as const : content.status,
      lastModified: new Date()
    };
    
    setContent(updatedContent);
    setLastSaved(new Date());
    setSaving(false);
  };

  const handlePublish = async () => {
    setSaving(true);
    
    const updatedContent = {
      ...content,
      status: 'published' as const,
      publishDate: new Date(),
      lastModified: new Date()
    };
    
    setContent(updatedContent);
    await handleSave();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const updateSEOTitle = (title: string) => {
    setContent({
      ...content,
      seo: {
        ...content.seo,
        title: title || content.title
      }
    });
  };

  useEffect(() => {
    // Auto-update SEO title when content title changes
    if (!content.seo.title || content.seo.title === content.title) {
      updateSEOTitle(content.title);
    }
    
    // Auto-update slug
    if (content.slug === 'untitled-content' || content.slug === generateSlug(content.title)) {
      setContent(prev => ({
        ...prev,
        slug: generateSlug(content.title)
      }));
    }
  }, [content.title]);

  const tabs = [
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <input
                value={content.title}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Enter content title..."
                className="text-xl font-semibold bg-transparent border-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  content.status === 'published' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : content.status === 'draft'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
                </span>
                
                {lastSaved && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => handleSave(true)}
                variant="secondary"
                size="sm"
                loading={saving}
              >
                💾 Save Draft
              </AnimatedButton>
              
              <AnimatedButton
                onClick={() => setActiveTab('seo')}
                variant="secondary"
                size="sm"
              >
                👁️ Preview
              </AnimatedButton>
              
              <AnimatedButton
                onClick={handlePublish}
                variant="primary"
                size="sm"
                loading={saving}
              >
                🚀 Publish
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'content' && (
          <div className="max-w-4xl mx-auto">
            <WYSIWYGEditor
              content={content.blocks}
              onChange={(blocks) => setContent({ ...content, blocks })}
              placeholder="Start writing your amazing travel content..."
            />
          </div>
        )}

        {activeTab === 'seo' && (
          <div className="max-w-4xl mx-auto">
            <SEOEditor
              data={content.seo}
              onChange={(seo) => setContent({ ...content, seo })}
              contentPreview={content.blocks.map(block => 
                typeof block.content === 'string' ? block.content : ''
              ).join(' ')}
              showAdvanced={true}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Basic Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                ⚙️ Content Settings
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content Type
                    </label>
                    <select
                      value={content.type}
                      onChange={(e) => setContent({ ...content, type: e.target.value as 'page' | 'article' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="page">Page</option>
                      <option value="article">Article</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={content.status}
                      onChange={(e) => setContent({ ...content, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL Slug
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      shakestravelapp.com/
                    </span>
                    <input
                      value={content.slug}
                      onChange={(e) => setContent({ ...content, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={content.featured || false}
                    onChange={(e) => setContent({ ...content, featured: e.target.checked })}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                    Featured content
                  </label>
                </div>
              </div>
            </div>

            {/* Categories and Tags */}
            {content.type === 'article' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  📂 Categories & Tags
                </h3>
                
                <CategoryTagManager />
              </div>
            )}

            {/* Featured Image & Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                🖼️ Featured Image & Gallery
              </h3>
              
              <FeaturedImageGallery />
            </div>

            {/* Publishing Options */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                📅 Publishing
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author
                  </label>
                  <input
                    value={content.author}
                    onChange={(e) => setContent({ ...content, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {content.publishDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Published Date
                    </label>
                    <input
                      type="datetime-local"
                      value={content.publishDate.toISOString().slice(0, -8)}
                      onChange={(e) => setContent({ 
                        ...content, 
                        publishDate: new Date(e.target.value) 
                      })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Modified
                  </label>
                  <input
                    type="text"
                    value={content.lastModified.toLocaleString()}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Version History */}
            <VersionHistory />
          </div>
        )}
      </div>
    </div>
  );
}