'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

interface ContentStats {
  experiences: {
    pending?: number;
    approved?: number;
    rejected?: number;
    revision_requested?: number;
  };
  accommodations: {
    pending?: number;
    approved?: number;
    rejected?: number;
    revision_requested?: number;
  };
  articles: {
    draft?: number;
    pending?: number;
    approved?: number;
    rejected?: number;
  };
}

interface ContentItem {
  _id: string;
  title: string;
  name?: string; // for accommodations
  status: string;
  moderationStatus?: string; // for articles
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  revisionNotes?: string;
  adminNotes?: string;
  price?: number;
  pricePerNight?: number;
  location?: string;
  region?: string;
  category?: string;
  type?: string;
  images?: string[];
  featuredImage?: { url: string };
  rating?: number;
  views?: number;
  bookings?: number;
}

function ContentDashboardPage() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'accommodations' | 'articles'>('overview');
  const [stats, setStats] = useState<ContentStats>({
    experiences: {},
    accommodations: {},
    articles: {}
  });
  const [experiences, setExperiences] = useState<ContentItem[]>([]);
  const [accommodations, setAccommodations] = useState<ContentItem[]>([]);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const primaryColor = '#195e48';

  useEffect(() => {
    if (user && token) {
      fetchDashboardData();
    }
  }, [user, token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch stats and content in parallel
      const [statsRes, experiencesRes, accommodationsRes, articlesRes] = await Promise.all([
        axios.get(`${API_URL}/user-content/stats`, { headers }).catch(() => ({ data: { data: {} } })),
        axios.get(`${API_URL}/user-content/experiences?limit=100`, { headers }).catch(() => ({ data: { data: { experiences: [] } } })),
        axios.get(`${API_URL}/user-content/accommodations?limit=100`, { headers }).catch(() => ({ data: { data: { accommodations: [] } } })),
        axios.get(`${API_URL}/user-content/articles?limit=100`, { headers }).catch(() => ({ data: { data: { articles: [] } } }))
      ]);

      setStats(statsRes.data.data || {
        experiences: {},
        accommodations: {},
        articles: {}
      });

      setExperiences(experiencesRes.data.data?.experiences || []);
      setAccommodations(accommodationsRes.data.data?.accommodations || []);
      setArticles(articlesRes.data.data?.articles || []);

    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: 'experiences' | 'accommodations' | 'articles', id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await axios.delete(`${API_URL}/user-content/${type}/${id}`, { headers });

      // Update local state
      if (type === 'experiences') {
        setExperiences(experiences.filter(item => item._id !== id));
      } else if (type === 'accommodations') {
        setAccommodations(accommodations.filter(item => item._id !== id));
      } else {
        setArticles(articles.filter(item => item._id !== id));
      }

      alert('Item deleted successfully');
      fetchDashboardData(); // Refresh stats
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleSubmitForReview = async (type: 'experiences' | 'accommodations' | 'articles', id: string) => {
    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const endpoint = type === 'articles'
        ? `${API_URL}/user-content/articles/${id}/submit-review`
        : `${API_URL}/user-content/${type}/${id}/submit-review`;

      await axios.post(endpoint, {}, { headers });

      alert('Successfully submitted for review!');
      fetchDashboardData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit for review');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      revision_requested: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Revision Needed' },
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' }
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getTotalItems = () => {
    return experiences.length + accommodations.length + articles.length;
  };

  const getPendingCount = () => {
    return (
      (stats.experiences.pending || 0) +
      (stats.accommodations.pending || 0) +
      (stats.articles.pending || 0)
    );
  };

  const getApprovedCount = () => {
    return (
      (stats.experiences.approved || 0) +
      (stats.accommodations.approved || 0) +
      (stats.articles.approved || 0)
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your experiences, accommodations, and articles</p>
            </div>

            <div className="flex space-x-3">
              <Link
                href="/dashboard/content/experiences/new"
                className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                + New Experience
              </Link>
              <Link
                href="/dashboard/content/accommodations/new"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              >
                + New Accommodation
              </Link>
              <Link
                href="/dashboard/content/articles/new"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors"
              >
                + New Article
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Total Content</div>
            <div className="text-3xl font-bold text-gray-900">{getTotalItems()}</div>
            <div className="text-xs text-gray-500 mt-2">All types combined</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-600">{getPendingCount()}</div>
            <div className="text-xs text-gray-500 mt-2">Awaiting approval</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Approved</div>
            <div className="text-3xl font-bold text-green-600">{getApprovedCount()}</div>
            <div className="text-xs text-gray-500 mt-2">Live on website</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Total Views</div>
            <div className="text-3xl font-bold" style={{ color: primaryColor }}>
              {[...experiences, ...accommodations].reduce((sum, item) => sum + (item.views || 0), 0)}
            </div>
            <div className="text-xs text-gray-500 mt-2">Across all content</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'overview', label: 'Overview', icon: '=Ê' },
                { key: 'experiences', label: 'Experiences', icon: '<Ô', count: experiences.length },
                { key: 'accommodations', label: 'Accommodations', icon: '<è', count: accommodations.length },
                { key: 'articles', label: 'Articles', icon: '=Ý', count: articles.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-current text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={activeTab === tab.key ? { borderColor: primaryColor, color: primaryColor } : {}}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-red-600 mr-3"> </div>
                  <div>
                    <div className="font-medium text-red-800">Error</div>
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Experiences Summary */}
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Experiences</h3>
                          <span className="text-3xl"><Ô</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total:</span>
                            <span className="font-semibold">{experiences.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Pending:</span>
                            <span className="font-semibold text-yellow-600">{stats.experiences.pending || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Approved:</span>
                            <span className="font-semibold text-green-600">{stats.experiences.approved || 0}</span>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/content/experiences/new"
                          className="mt-4 block w-full text-center py-2 rounded-lg text-white font-medium"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Create Experience
                        </Link>
                      </div>

                      {/* Accommodations Summary */}
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Accommodations</h3>
                          <span className="text-3xl"><è</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total:</span>
                            <span className="font-semibold">{accommodations.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Pending:</span>
                            <span className="font-semibold text-yellow-600">{stats.accommodations.pending || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Approved:</span>
                            <span className="font-semibold text-green-600">{stats.accommodations.approved || 0}</span>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/content/accommodations/new"
                          className="mt-4 block w-full text-center bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-white font-medium transition-colors"
                        >
                          Create Accommodation
                        </Link>
                      </div>

                      {/* Articles Summary */}
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Articles</h3>
                          <span className="text-3xl">=Ý</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Total:</span>
                            <span className="font-semibold">{articles.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Draft:</span>
                            <span className="font-semibold text-gray-600">{stats.articles.draft || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Published:</span>
                            <span className="font-semibold text-green-600">{stats.articles.approved || 0}</span>
                          </div>
                        </div>
                        <Link
                          href="/dashboard/content/articles/new"
                          className="mt-4 block w-full text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-white font-medium transition-colors"
                        >
                          Write Article
                        </Link>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => setActiveTab('experiences')}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left"
                        >
                          <div className="font-medium mb-1">Manage Experiences</div>
                          <div className="text-sm text-gray-600">View and edit your experiences</div>
                        </button>

                        <button
                          onClick={() => setActiveTab('accommodations')}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="font-medium mb-1">Manage Accommodations</div>
                          <div className="text-sm text-gray-600">View and edit your properties</div>
                        </button>

                        <button
                          onClick={() => setActiveTab('articles')}
                          className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-left"
                        >
                          <div className="font-medium mb-1">Manage Articles</div>
                          <div className="text-sm text-gray-600">View and edit your blog posts</div>
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {[...experiences, ...accommodations, ...articles]
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 5)
                          .map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{item.title || item.name}</div>
                                <div className="text-sm text-gray-600">
                                  Created {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              {getStatusBadge(item.status || item.moderationStatus || 'draft')}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Type Tabs - Will be implemented in next iteration */}
                {activeTab !== 'overview' && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">
                      {activeTab === 'experiences' && '<Ô'}
                      {activeTab === 'accommodations' && '<è'}
                      {activeTab === 'articles' && '=Ý'}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Detailed {activeTab} management interface coming soon
                    </p>
                    <Link
                      href={`/dashboard/content/${activeTab}/new`}
                      className="inline-block px-6 py-3 rounded-lg text-white font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Create New {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(0, -1).slice(1)}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentDashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <ContentDashboardPage />
    </AuthGuard>
  );
}
