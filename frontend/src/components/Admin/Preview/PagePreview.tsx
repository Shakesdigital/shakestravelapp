'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'quote' | 'list' | 'travel-info' | 'destination-card' | 'itinerary' | 'pricing-table';
  content: any;
  attributes?: any;
}

interface PagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  blocks: Block[];
  seoData?: {
    title: string;
    description: string;
    keywords: string[];
  };
  publishedUrl?: string;
}

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
type PreviewMode = 'live' | 'responsive' | 'seo';

export default function PagePreview({ 
  isOpen, 
  onClose, 
  title, 
  blocks, 
  seoData,
  publishedUrl 
}: PagePreviewProps) {
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [mode, setMode] = useState<PreviewMode>('live');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const deviceSizes = {
    desktop: { width: '100%', height: '100%', icon: '🖥️', label: 'Desktop' },
    tablet: { width: '768px', height: '1024px', icon: '📱', label: 'Tablet' },
    mobile: { width: '375px', height: '667px', icon: '📱', label: 'Mobile' }
  };

  const modes = [
    { id: 'live', label: 'Live Preview', icon: '👁️', description: 'See how your content looks live' },
    { id: 'responsive', label: 'Responsive', icon: '📐', description: 'Test different screen sizes' },
    { id: 'seo', label: 'SEO Preview', icon: '🔍', description: 'See search engine results' }
  ];

  useEffect(() => {
    if (isOpen && publishedUrl) {
      generatePreviewUrl();
    }
  }, [isOpen, publishedUrl, blocks]);

  const generatePreviewUrl = async () => {
    setLoading(true);
    try {
      // Simulate generating preview URL
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPreviewUrl(publishedUrl || `/preview/${Math.random().toString(36).substr(2, 9)}`);
    } catch (error) {
      console.error('Failed to generate preview:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBlockPreview = (block: Block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {block.content || 'Your paragraph text will appear here...'}
          </p>
        );

      case 'heading':
        const HeadingTag = `h${block.attributes?.level || 2}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: 'text-4xl font-bold mb-6',
          2: 'text-3xl font-bold mb-5',
          3: 'text-2xl font-bold mb-4',
          4: 'text-xl font-bold mb-3'
        }[block.attributes?.level || 2];
        
        return (
          <HeadingTag className={`text-gray-900 dark:text-white ${headingClasses}`}>
            {block.content || 'Your heading text'}
          </HeadingTag>
        );

      case 'image':
        return (
          <figure className={`mb-6 ${
            block.attributes?.alignment === 'left' ? 'text-left' :
            block.attributes?.alignment === 'right' ? 'text-right' : 'text-center'
          }`}>
            {block.content?.src ? (
              <img
                src={block.content.src}
                alt={block.content.alt || ''}
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">📷 Image placeholder</span>
              </div>
            )}
            {block.content?.caption && (
              <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
                {block.content.caption}
              </figcaption>
            )}
          </figure>
        );

      case 'gallery':
        return (
          <div className={`grid gap-4 mb-6 ${
            block.attributes?.columns === 2 ? 'grid-cols-2' :
            block.attributes?.columns === 4 ? 'grid-cols-4' : 'grid-cols-3'
          }`}>
            {block.content?.images?.length > 0 ? (
              block.content.images.map((image: any, index: number) => (
                <div key={index} className="aspect-square">
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt || ''}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">📷</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-gray-200 dark:bg-gray-700 h-32 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">🖼️ Gallery placeholder</span>
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <blockquote className="border-l-4 border-green-500 pl-6 py-4 mb-6 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
              "{block.content?.text || 'Your quote text will appear here...'}"
            </p>
            {block.content?.author && (
              <cite className="text-gray-600 dark:text-gray-400 text-sm">
                — {block.content.author}
              </cite>
            )}
          </blockquote>
        );

      case 'list':
        const ListTag = block.content?.ordered ? 'ol' : 'ul';
        return (
          <ListTag className={`mb-6 ${block.content?.ordered ? 'list-decimal' : 'list-disc'} list-inside space-y-2`}>
            {block.content?.items?.length > 0 ? (
              block.content.items.map((item: string, index: number) => (
                <li key={index} className="text-gray-700 dark:text-gray-300">
                  {item || 'List item...'}
                </li>
              ))
            ) : (
              <li className="text-gray-500 dark:text-gray-400">List items will appear here...</li>
            )}
          </ListTag>
        );

      case 'travel-info':
        return (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              ✈️ Travel Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                <p className="text-gray-900 dark:text-white">{block.content?.duration || 'TBD'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Difficulty:</span>
                <p className="text-gray-900 dark:text-white">{block.content?.difficulty || 'TBD'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Best Season:</span>
                <p className="text-gray-900 dark:text-white">{block.content?.season || 'TBD'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price Range:</span>
                <p className="text-gray-900 dark:text-white">{block.content?.price || 'TBD'}</p>
              </div>
            </div>
          </div>
        );

      case 'destination-card':
        return (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg mb-6">
            {block.content?.image ? (
              <img
                src={block.content.image}
                alt={block.content?.title || ''}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">🏞️ Destination image</span>
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {block.content?.title || 'Destination Name'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                📍 {block.content?.location || 'Location'}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {block.content?.description || 'Destination description will appear here...'}
              </p>
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              📅 Travel Itinerary
            </h4>
            <div className="space-y-4">
              {block.content?.days?.length > 0 ? (
                block.content.days.map((day: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                        Day {day.day}
                      </span>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {day.title || `Day ${day.day}`}
                      </h5>
                    </div>
                    <ul className="space-y-2">
                      {day.activities?.map((activity: string, actIndex: number) => (
                        <li key={actIndex} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {activity || 'Activity description...'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Itinerary days will appear here...</p>
              )}
            </div>
          </div>
        );

      case 'pricing-table':
        return (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              💰 Pricing Options
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {block.content?.packages?.length > 0 ? (
                block.content.packages.map((pkg: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                    <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {pkg.name || 'Package Name'}
                    </h5>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
                      {pkg.price || '$0'}
                    </div>
                    <ul className="space-y-2 text-left">
                      {pkg.features?.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {feature || 'Feature...'}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Choose Plan
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 p-6 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
                  <span className="text-gray-500 dark:text-gray-400">Pricing packages will appear here...</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6">
            <span className="text-gray-500 dark:text-gray-400">
              Preview for "{block.type}" block not implemented
            </span>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Preview Panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preview: {title}
            </h2>
            <HelpTooltip content="Preview how your content will look to visitors across different devices and contexts." />
          </div>

          <div className="flex items-center space-x-4">
            {/* Mode Selector */}
            <div className="flex items-center space-x-2">
              {modes.map((modeOption) => (
                <button
                  key={modeOption.id}
                  onClick={() => setMode(modeOption.id as PreviewMode)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    mode === modeOption.id
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                  }`}
                  title={modeOption.description}
                >
                  {modeOption.icon} {modeOption.label}
                </button>
              ))}
            </div>

            {/* Device Selector */}
            {mode === 'responsive' && (
              <div className="flex items-center space-x-2 border-l border-gray-300 dark:border-gray-600 pl-4">
                {Object.entries(deviceSizes).map(([deviceKey, deviceData]) => (
                  <button
                    key={deviceKey}
                    onClick={() => setDevice(deviceKey as PreviewDevice)}
                    className={`p-2 rounded-md transition-colors ${
                      device === deviceKey
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
                    }`}
                    title={deviceData.label}
                  >
                    {deviceData.icon}
                  </button>
                ))}
              </div>
            )}

            <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
              <AnimatedButton onClick={onClose} variant="secondary" size="sm">
                ✕ Close
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800">
          {mode === 'seo' ? (
            <div className="p-8">
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Google SERP Preview */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    🔍 Google Search Results
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="text-xs text-green-700 dark:text-green-400 mb-1">
                      {previewUrl || 'https://example.com/page-url'}
                    </div>
                    <h4 className="text-lg text-blue-600 dark:text-blue-400 cursor-pointer hover:underline mb-1">
                      {seoData?.title || title || 'Page Title'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {seoData?.description || 'Meta description will appear here...'}
                    </p>
                  </div>
                </div>

                {/* Social Media Previews */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    📱 Social Media Preview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook</h4>
                      <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <div className="h-32 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <span className="text-green-600 dark:text-green-400">🖼️ Featured Image</span>
                        </div>
                        <div className="p-3">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {previewUrl || 'example.com'}
                          </div>
                          <h5 className="font-medium text-gray-900 dark:text-white text-sm">
                            {title || 'Page Title'}
                          </h5>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {seoData?.description || 'Description...'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SEO Analysis */}
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    📊 SEO Analysis
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Title Length</span>
                      <span className={`text-sm font-medium ${
                        (seoData?.title?.length || 0) >= 30 && (seoData?.title?.length || 0) <= 60
                          ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {seoData?.title?.length || 0}/60
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Description Length</span>
                      <span className={`text-sm font-medium ${
                        (seoData?.description?.length || 0) >= 120 && (seoData?.description?.length || 0) <= 160
                          ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {seoData?.description?.length || 0}/160
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Keywords</span>
                      <span className={`text-sm font-medium ${
                        (seoData?.keywords?.length || 0) >= 3 && (seoData?.keywords?.length || 0) <= 5
                          ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {seoData?.keywords?.length || 0} keywords
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-full p-4">
              <div 
                className={`bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 ${
                  mode === 'responsive' ? 'mx-auto' : 'w-full max-w-4xl'
                }`}
                style={
                  mode === 'responsive' 
                    ? { 
                        width: deviceSizes[device].width, 
                        height: deviceSizes[device].height,
                        maxHeight: '90vh',
                        overflow: 'auto'
                      } 
                    : {}
                }
              >
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin text-4xl mb-4">⏳</div>
                      <p className="text-gray-500 dark:text-gray-400">Generating preview...</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 md:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {title || 'Page Title'}
                    </h1>
                    
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      {blocks.length > 0 ? (
                        blocks.map((block) => (
                          <div key={block.id}>
                            {renderBlockPreview(block)}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">📝</div>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                            No Content Yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400">
                            Add some blocks to see your content preview
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}