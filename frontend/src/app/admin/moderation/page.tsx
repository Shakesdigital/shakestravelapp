'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

interface ContentItem {
  _id: string;
  title?: string;
  name?: string;
  status?: string;
  description?: string;
}

function AdminModerationContent() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const res = await axios.get(`${API_URL}/user-content/experiences`, { headers }).catch(() => ({ data: { data: { experiences: [] } } }));
      setItems(res.data.data?.experiences || []);
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Moderation</h1>
          <p className="text-gray-600">Review and approve user-generated content</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">{error}</div>}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.title || item.name}</h3>
                  {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Approve</button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Reject</button>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="text-center py-12 text-gray-500">No content to review</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminModerationPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AdminModerationContent />
    </AuthGuard>
  );
}
