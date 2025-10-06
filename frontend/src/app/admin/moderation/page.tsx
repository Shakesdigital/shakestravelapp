'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

const primaryColor = '#195e48';

interface ContentItem {
  _id: string;
  title?: string;
  name?: string;
  status?: string;
  moderationStatus?: string;
  createdAt: string;
  userId?: any;
  authorId?: any;
  providerId?: any;
  hostId?: any;
  category?: string;
  type?: string;
  location?: string;
  price?: number;
  pricePerNight?: number;
  description?: string;
  excerpt?: string;
  reviewedBy?: any;
  reviewedAt?: string;
  rejectionReason?: string;
  revisionNotes?: string;
}

interface ModerationStats {
  experiences: {
    draft?: number;
    active?: number;
    paused?: number;
    suspended?: number;
    total?: number;
  };
  accommodations: {
    draft?: number;
    active?: number;
    paused?: number;
    suspended?: number;
    total?: number;
  };
  articles: {
    draft?: number;
    pending?: number;
    approved?: number;
    rejected?: number;
    flagged?: number;
    total?: number;
  };
  summary?: {
    totalPending?: number;
    totalActive?: number;
    totalRejected?: number;
    totalFlagged?: number;
  };
}

function AdminModerationContent() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'accommodations' | 'articles'>('overview');
  const [stats, setStats] = useState<ModerationStats>({
    experiences: {},
    accommodations: {},
    articles: {}
  });
  const [pendingExperiences, setPendingExperiences] = useState<ContentItem[]>([]);
  const [pendingAccommodations, setPendingAccommodations] = useState<ContentItem[]>([]);
  const [pendingArticles, setPendingArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'flag' | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (token) {
      fetchModerationData();
    }
  }, [token]);

  const fetchModerationData = async () => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${API_URL}/admin/moderation/stats`, { headers }).catch(() => ({ data: { data: {} } })),
        axios.get(`${API_URL}/admin/moderation/pending-all`, { headers }).catch(() => ({ data: { data: { experiences: [], accommodations: [], articles: [] } } }))
      ]);

      setStats(statsRes.data.data || {});

      const pendingData = pendingRes.data.data || {};
      setPendingExperiences(pendingData.experiences || []);
      setPendingAccommodations(pendingData.accommodations || []);
      setPendingArticles(pendingData.articles || []);

    } catch (err: any) {
      console.error('Failed to fetch moderation data:', err);
      setError(err.response?.data?.message || 'Failed to load moderation data');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedItem || !reviewAction) return;

    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let endpoint = '';
      let itemType = '';

      // Determine item type and endpoint
      if (selectedItem.providerId) {
        itemType = 'experiences';
      } else if (selectedItem.hostId) {
        itemType = 'accommodations';
      } else if (selectedItem.authorId) {
        itemType = 'articles';
      }

      endpoint = `${API_URL}/admin/moderation/${itemType}/${selectedItem._id}/${reviewAction}`;

      const payload: any = {};
      if (reviewAction === 'approve') {
        payload.feedback = feedback;
        if (itemType === 'articles') {
          payload.autoPublish = true;
        }
      } else if (reviewAction === 'reject' || reviewAction === 'flag') {
        payload.reason = feedback;
      }

      await axios.put(endpoint, payload, { headers });

      alert(`Content ${reviewAction}ed successfully!`);
      setShowReviewModal(false);
      setSelectedItem(null);
      setFeedback('');
      setReviewAction(null);

      // Refresh data
      await fetchModerationData();

    } catch (err: any) {
      console.error('Review error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to process review');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (item: ContentItem, action: 'approve' | 'reject' | 'flag') => {
    setSelectedItem(item);
    setReviewAction(action);
    setShowReviewModal(true);
    setFeedback('');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      active: { bg: 'bg-green-100', text: 'text-green-800' },
      approved: { bg: 'bg-green-100', text: 'text-green-800' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800' },
      flagged: { bg: 'bg-red-100', text: 'text-red-800' },
      suspended: { bg: 'bg-orange-100', text: 'text-orange-800' }
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.draft;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const ContentCard = ({ item, type }: { item: ContentItem; type: string }) => {
    const getUserName = () => {
      const user = item.userId || item.authorId || item.providerId || item.hostId;
      if (!user) return 'Unknown User';
      if (typeof user === 'string') return user;
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown';
    };

    const getUserEmail = () => {
      const user = item.userId || item.authorId || item.providerId || item.hostId;
      if (!user || typeof user === 'string') return '';
      return user.email || '';
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {item.title || item.name}
            </h3>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="mr-1">=d</span>
                {getUserName()}
              </span>
              {getUserEmail() && (
                <span className="flex items-center">
                  <span className="mr-1">	</span>
                  {getUserEmail()}
                </span>
              )}
            </div>
          </div>
          {getStatusBadge(item.status || item.moderationStatus || 'pending')}
        </div>

        <div className="space-y-2 text-sm mb-4">
          {item.category && (
            <div className="flex">
              <span className="text-gray-500 w-24">Category:</span>
              <span className="text-gray-900">{item.category}</span>
            </div>
          )}
          {item.type && (
            <div className="flex">
              <span className="text-gray-500 w-24">Type:</span>
              <span className="text-gray-900">{item.type}</span>
            </div>
          )}
          {item.location && (
            <div className="flex">
              <span className="text-gray-500 w-24">Location:</span>
              <span className="text-gray-900">{item.location}</span>
            </div>
          )}
          {(item.price || item.pricePerNight) && (
            <div className="flex">
              <span className="text-gray-500 w-24">Price:</span>
              <span className="text-gray-900">
                ${item.price || item.pricePerNight} {item.pricePerNight ? '/night' : ''}
              </span>
            </div>
          )}
          <div className="flex">
            <span className="text-gray-500 w-24">Submitted:</span>
            <span className="text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {(item.description || item.excerpt) && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {item.description || item.excerpt}
          </p>
        )}

        <div className="flex space-x-2 pt-4 border-t">
          <button
            onClick={() => openReviewModal(item, 'approve')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
             Approve
          </button>
          <button
            onClick={() => openReviewModal(item, 'reject')}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
             Reject
          </button>
          {type === 'articles' && (
            <button
              onClick={() => openReviewModal(item, 'flag')}
              className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
            >
              =© Flag
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Review and approve user-generated content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="text-sm text-yellow-700 mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-yellow-900">
              {(stats.summary?.totalPending || 0)}
            </div>
            <div className="text-xs text-yellow-600 mt-2">Awaiting action</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="text-sm text-green-700 mb-2">Approved</div>
            <div className="text-3xl font-bold text-green-900">
              {(stats.summary?.totalActive || 0)}
            </div>
            <div className="text-xs text-green-600 mt-2">Live on site</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm p-6 border border-red-200">
            <div className="text-sm text-red-700 mb-2">Rejected</div>
            <div className="text-3xl font-bold text-red-900">
              {(stats.summary?.totalRejected || 0)}
            </div>
            <div className="text-xs text-red-600 mt-2">Not approved</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200">
            <div className="text-sm text-orange-700 mb-2">Flagged</div>
            <div className="text-3xl font-bold text-orange-900">
              {(stats.summary?.totalFlagged || 0)}
            </div>
            <div className="text-xs text-orange-600 mt-2">Needs attention</div>
          </div>
        </div>

        {/* Error Display */}
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

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'overview', label: 'Overview', icon: '=Ê' },
                { key: 'experiences', label: 'Experiences', icon: '<Ô', count: pendingExperiences.length },
                { key: 'accommodations', label: 'Accommodations', icon: '<è', count: pendingAccommodations.length },
                { key: 'articles', label: 'Articles', icon: '=Ý', count: pendingArticles.length }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-current'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  style={activeTab === tab.key ? { borderColor: primaryColor, color: primaryColor } : {}}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading && !pendingExperiences.length && !pendingAccommodations.length && !pendingArticles.length ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pending Review Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Experiences</h4>
                            <span className="text-3xl"><Ô</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Pending:</span>
                              <span className="font-semibold">{stats.experiences.draft || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Approved:</span>
                              <span className="font-semibold">{stats.experiences.active || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-semibold">{stats.experiences.total || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Accommodations</h4>
                            <span className="text-3xl"><è</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Pending:</span>
                              <span className="font-semibold">{stats.accommodations.draft || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Approved:</span>
                              <span className="font-semibold">{stats.accommodations.active || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-semibold">{stats.accommodations.total || 0}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-900">Articles</h4>
                            <span className="text-3xl">=Ý</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Pending:</span>
                              <span className="font-semibold">{stats.articles.pending || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Approved:</span>
                              <span className="font-semibold">{stats.articles.approved || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Total:</span>
                              <span className="font-semibold">{stats.articles.total || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Pending Items */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
                      {pendingExperiences.length === 0 && pendingAccommodations.length === 0 && pendingArticles.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                          <div className="text-4xl mb-4"></div>
                          <h4 className="text-lg font-semibold mb-2">All Caught Up!</h4>
                          <p className="text-gray-600">No pending content to review</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {[...pendingExperiences.slice(0, 3), ...pendingAccommodations.slice(0, 3), ...pendingArticles.slice(0, 3)]
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 6)
                            .map((item, index) => (
                              <ContentCard
                                key={index}
                                item={item}
                                type={item.providerId ? 'experiences' : item.hostId ? 'accommodations' : 'articles'}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Experiences Tab */}
                {activeTab === 'experiences' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">
                        Pending Experiences ({pendingExperiences.length})
                      </h3>
                      <button
                        onClick={fetchModerationData}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={loading}
                      >
                        = Refresh
                      </button>
                    </div>

                    {pendingExperiences.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4"><Ô</div>
                        <h4 className="text-lg font-semibold mb-2">No Pending Experiences</h4>
                        <p className="text-gray-600">All experiences have been reviewed</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingExperiences.map(item => (
                          <ContentCard key={item._id} item={item} type="experiences" />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Accommodations Tab */}
                {activeTab === 'accommodations' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">
                        Pending Accommodations ({pendingAccommodations.length})
                      </h3>
                      <button
                        onClick={fetchModerationData}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={loading}
                      >
                        = Refresh
                      </button>
                    </div>

                    {pendingAccommodations.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4"><è</div>
                        <h4 className="text-lg font-semibold mb-2">No Pending Accommodations</h4>
                        <p className="text-gray-600">All accommodations have been reviewed</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingAccommodations.map(item => (
                          <ContentCard key={item._id} item={item} type="accommodations" />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">
                        Pending Articles ({pendingArticles.length})
                      </h3>
                      <button
                        onClick={fetchModerationData}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                        disabled={loading}
                      >
                        = Refresh
                      </button>
                    </div>

                    {pendingArticles.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-4">=Ý</div>
                        <h4 className="text-lg font-semibold mb-2">No Pending Articles</h4>
                        <p className="text-gray-600">All articles have been reviewed</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingArticles.map(item => (
                          <ContentCard key={item._id} item={item} type="articles" />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {reviewAction === 'approve' && ' Approve Content'}
                {reviewAction === 'reject' && ' Reject Content'}
                {reviewAction === 'flag' && '=© Flag Content'}
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Content:</p>
                <p className="font-medium">{selectedItem.title || selectedItem.name}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {reviewAction === 'approve' ? 'Feedback (optional)' : 'Reason *'}
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Add any feedback for the creator...'
                      : 'Explain why this content is being rejected...'
                  }
                  required={reviewAction !== 'approve'}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedItem(null);
                    setFeedback('');
                    setReviewAction(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReview}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium ${
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : reviewAction === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                  }`}
                  disabled={loading || (reviewAction !== 'approve' && !feedback.trim())}
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminModerationPage() {
  return (
    <AuthGuard requireAuth={true} requireRole="admin">
      <AdminModerationContent />
    </AuthGuard>
  );
}
