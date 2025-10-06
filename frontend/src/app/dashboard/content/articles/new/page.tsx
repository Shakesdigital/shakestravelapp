'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

const primaryColor = '#195e48';

interface ArticleForm {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: {
    url: string;
    caption?: string;
    altText?: string;
  };
  images: Array<{
    url: string;
    caption?: string;
    altText?: string;
  }>;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
}

const ARTICLE_CATEGORIES = [
  'travel-guide',
  'destination-review',
  'travel-tips',
  'cultural-insights',
  'safari-stories',
  'accommodation-review',
  'food-and-dining',
  'adventure',
  'photography',
  'budget-travel',
  'luxury-travel',
  'family-travel',
  'solo-travel',
  'eco-tourism',
  'wildlife',
  'events-and-festivals'
];

const COUNTRIES = ['Uganda', 'Kenya', 'Tanzania', 'Rwanda'];

function CreateArticleContent() {
  const { token } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAsDraft, setSaveAsDraft] = useState(false);

  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    excerpt: '',
    content: '',
    category: 'travel-guide',
    tags: [''],
    featuredImage: {
      url: ''
    },
    images: [],
    location: {
      country: 'Uganda'
    },
    seo: {
      keywords: ['']
    }
  });

  const totalSteps = 4;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const handleArrayAdd = (field: string, defaultValue: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], defaultValue]
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleSubmit = async (isDraft: boolean) => {
    setLoading(true);
    setError(null);
    setSaveAsDraft(isDraft);

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Clean up data
      const cleanedData = {
        ...formData,
        tags: formData.tags.filter(t => t.trim()),
        images: formData.images.filter(img => img.url.trim()),
        seo: {
          ...formData.seo,
          keywords: formData.seo.keywords.filter(k => k.trim())
        }
      };

      // Create article (always starts as draft)
      const response = await axios.post(
        `${API_URL}/user-content/articles`,
        cleanedData,
        { headers }
      );

      // If user wants to submit for review immediately
      if (!isDraft) {
        await axios.post(
          `${API_URL}/user-content/articles/${response.data.data._id}/submit-review`,
          {},
          { headers }
        );
        alert('Article submitted for review!');
      } else {
        alert('Article saved as draft!');
      }

      router.push('/dashboard/content');

    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step <= currentStep
                  ? 'text-white bg-purple-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step}
            </div>
            {step < 4 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Step {currentStep} of {totalSteps}
        </h2>
        <p className="text-gray-600">
          {currentStep === 1 && 'Basic Information'}
          {currentStep === 2 && 'Write Your Article'}
          {currentStep === 3 && 'Images & Media'}
          {currentStep === 4 && 'SEO & Publishing'}
        </p>
      </div>
    </div>
  );

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write New Article</h1>
          <p className="text-gray-600">Share your travel stories and insights with the community</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">†</div>
              <div>
                <div className="font-medium text-red-800">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStepIndicator()}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title * (Max 200 characters)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  placeholder="e.g., 10 Must-Visit Places in Uganda for First-Time Travelers"
                  maxLength={200}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.title.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Excerpt/Summary * (Max 500 characters)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Write a brief summary that will appear in article previews..."
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.excerpt.length}/500 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    {ARTICLE_CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {getCategoryLabel(category)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country (Optional)
                  </label>
                  <select
                    value={formData.location?.country || ''}
                    onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Not specific</option>
                    {COUNTRIES.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location?.region || ''}
                    onChange={(e) => handleNestedChange('location', 'region', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Western Uganda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location?.city || ''}
                    onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Kampala"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (helps readers find your article)
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., safari, adventure, budget-travel"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        onClick={() => handleArrayRemove('tags', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('tags', '')}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 w-full"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Write Your Article */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-purple-600 mr-3 mt-1">=°</div>
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">Writing Tips</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>" Write in a conversational, engaging tone</li>
                      <li>" Use headings and paragraphs to organize your content</li>
                      <li>" Include personal experiences and practical tips</li>
                      <li>" Keep paragraphs short for easy reading</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content *
                </label>
                <div className="mb-2 flex space-x-2 text-xs text-gray-500">
                  <span>=° Formatting tips:</span>
                  <span>Use line breaks for paragraphs</span>
                  <span>"</span>
                  <span>Start with an introduction</span>
                  <span>"</span>
                  <span>End with a conclusion</span>
                </div>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                  rows={20}
                  placeholder="Start writing your article here...

Introduction:
Introduce your topic and hook the reader's attention.

Main Content:
Share your insights, experiences, and tips. Use clear paragraphs and organize your thoughts.

Conclusion:
Summarize key points and provide a call-to-action or final thoughts.
"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {formData.content.split(/\s+/).filter(w => w).length} words "
                    {' '}{Math.ceil(formData.content.split(/\s+/).filter(w => w).length / 200)} min read
                  </p>
                  <p className="text-sm text-gray-500">{formData.content.length} characters</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Article Structure Checklist</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" readOnly checked={formData.content.length > 100} />
                    <span>Has an engaging introduction</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" readOnly checked={formData.content.split(/\s+/).length > 300} />
                    <span>At least 300 words (recommended: 500+)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" readOnly checked={formData.content.includes('\n\n')} />
                    <span>Uses paragraph breaks for readability</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images & Media */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image * (Main image for your article)
                </label>
                <input
                  type="url"
                  value={formData.featuredImage.url}
                  onChange={(e) => handleNestedChange('featuredImage', 'url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2"
                  placeholder="https://example.com/featured-image.jpg"
                  required
                />

                <input
                  type="text"
                  value={formData.featuredImage.caption || ''}
                  onChange={(e) => handleNestedChange('featuredImage', 'caption', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-2"
                  placeholder="Image caption (optional)"
                />

                <input
                  type="text"
                  value={formData.featuredImage.altText || ''}
                  onChange={(e) => handleNestedChange('featuredImage', 'altText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Alt text for accessibility (optional)"
                />
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Additional Images (Optional)
                </label>
                <p className="text-sm text-gray-500 mb-4">Add supporting images for your article</p>

                {formData.images.map((image, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Image {index + 1}</h4>
                      <button
                        onClick={() => handleArrayRemove('images', index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="https://example.com/image.jpg"
                      />

                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Image caption"
                      />

                      <input
                        type="text"
                        value={image.altText || ''}
                        onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Alt text"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => handleArrayAdd('images', { url: '' })}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 w-full"
                >
                  + Add Image
                </button>
              </div>
            </div>
          )}

          {/* Step 4: SEO & Publishing */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-green-600 mr-3 mt-1">=</div>
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">SEO Optimization</h4>
                    <p className="text-sm text-green-700">
                      These fields help search engines understand your content and improve discoverability
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Meta Title (Max 60 characters)
                </label>
                <input
                  type="text"
                  value={formData.seo.metaTitle || ''}
                  onChange={(e) => handleNestedChange('seo', 'metaTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder={formData.title || "Leave empty to use article title"}
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(formData.seo.metaTitle || formData.title).length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Meta Description (Max 160 characters)
                </label>
                <textarea
                  value={formData.seo.metaDescription || ''}
                  onChange={(e) => handleNestedChange('seo', 'metaDescription', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={2}
                  placeholder={formData.excerpt || "Leave empty to use excerpt"}
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {(formData.seo.metaDescription || formData.excerpt).length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Keywords
                </label>
                {formData.seo.keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={keyword}
                      onChange={(e) => {
                        const newKeywords = [...formData.seo.keywords];
                        newKeywords[index] = e.target.value;
                        handleNestedChange('seo', 'keywords', newKeywords);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Uganda travel, safari tips"
                    />
                    {formData.seo.keywords.length > 1 && (
                      <button
                        onClick={() => {
                          const newKeywords = formData.seo.keywords.filter((_, i) => i !== index);
                          handleNestedChange('seo', 'keywords', newKeywords);
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleNestedChange('seo', 'keywords', [...formData.seo.keywords, ''])}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 w-full"
                >
                  + Add Keyword
                </button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Article</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{formData.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{getCategoryLabel(formData.category)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Word Count:</span>
                    <span className="font-medium">
                      {formData.content.split(/\s+/).filter(w => w).length} words
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reading Time:</span>
                    <span className="font-medium">
                      ~{Math.ceil(formData.content.split(/\s+/).filter(w => w).length / 200)} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tags:</span>
                    <span className="font-medium">{formData.tags.filter(t => t).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Images:</span>
                    <span className="font-medium">
                      {formData.featuredImage.url ? 1 : 0} + {formData.images.filter(img => img.url).length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-3 mt-1">=›</div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Publishing Options</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>" <strong>Save as Draft:</strong> Keep working on your article later</li>
                      <li>" <strong>Submit for Review:</strong> Send to admin for approval and publishing</li>
                      <li>" Once approved, your article will be visible to all readers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              ê Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === totalSteps && (
                <>
                  <button
                    onClick={() => handleSubmit(true)}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading && saveAsDraft ? 'Saving...' : 'Save as Draft'}
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading && !saveAsDraft ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </>
              )}
              {currentStep < totalSteps && (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Next í
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateArticlePage() {
  return (
    <AuthGuard requireAuth={true}>
      <CreateArticleContent />
    </AuthGuard>
  );
}
