'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

interface ContentItem {
  _id: string;
  title?: string;
  name?: string;
  status?: string;
  createdAt: string;
}

function DashboardContentPage() {
  const { token } = useAuth();
  const [experiences, setExperiences] = useState<ContentItem[]>([]);
  const [accommodations, setAccommodations] = useState<ContentItem[]>([]);
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) fetchContent();
  }, [token]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [expRes, accRes, artRes] = await Promise.all([
        axios.get(`${API_URL}/user-content/experiences`, { headers }).catch(() => ({ data: { data: { experiences: [] } } })),
        axios.get(`${API_URL}/user-content/accommodations`, { headers }).catch(() => ({ data: { data: { accommodations: [] } } })),
        axios.get(`${API_URL}/user-content/articles`, { headers }).catch(() => ({ data: { data: { articles: [] } } }))
      ]);
      setExperiences(expRes.data.data?.experiences || []);
      setAccommodations(accRes.data.data?.accommodations || []);
      setArticles(artRes.data.data?.articles || []);
    } catch (err) {
      console.error('Failed to fetch content', err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Content</h1>
          <p className="text-gray-600">Manage your experiences, accommodations, and articles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="text-sm text-blue-700 mb-2">Experiences</div>
            <div className="text-3xl font-bold text-blue-900">{experiences.length}</div>
            <Link href="/dashboard/content/experiences/new" className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              Create New
            </Link>
          </div>
          <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="text-sm text-purple-700 mb-2">Accommodations</div>
            <div className="text-3xl font-bold text-purple-900">{accommodations.length}</div>
            <Link href="/dashboard/content/accommodations/new" className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm">
              Create New
            </Link>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <div className="text-sm text-orange-700 mb-2">Articles</div>
            <div className="text-3xl font-bold text-orange-900">{articles.length}</div>
            <Link href="/dashboard/content/articles/new" className="inline-block mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm">
              Create New
            </Link>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {!loading && (
          <div className="space-y-8">
            <ContentSection title="Experiences" items={experiences} />
            <ContentSection title="Accommodations" items={accommodations} />
            <ContentSection title="Articles" items={articles} />
          </div>
        )}
      </div>
    </div>
  );
}

const ContentSection = ({ title, items }: { title: string; items: ContentItem[] }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    {items.length === 0 ? (
      <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} yet</p>
    ) : (
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.title || item.name}</h3>
                <p className="text-sm text-gray-500">Created: {new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function ContentDashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <DashboardContentPage />
    </AuthGuard>
  );
}
