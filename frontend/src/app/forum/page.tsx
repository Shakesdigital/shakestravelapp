'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface ForumPost {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  isPinned?: boolean;
  isHot?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  color: string;
}

export default function ForumPage() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: ForumCategory[] = [
    {
      id: 'all',
      name: 'All Topics',
      description: 'Browse all forum discussions',
      icon: '💬',
      posts: 156,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'planning',
      name: 'Trip Planning',
      description: 'Planning your Uganda adventure',
      icon: '🗺️',
      posts: 45,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'wildlife',
      name: 'Wildlife & Nature',
      description: 'Gorillas, safaris, and wildlife experiences',
      icon: '🦍',
      posts: 38,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'accommodations',
      name: 'Where to Stay',
      description: 'Hotels, lodges, and accommodation reviews',
      icon: '🏨',
      posts: 29,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'culture',
      name: 'Culture & People',
      description: 'Local culture, traditions, and communities',
      icon: '🎭',
      posts: 22,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'practical',
      name: 'Practical Info',
      description: 'Visas, transport, money, and practical tips',
      icon: '📋',
      posts: 18,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'photos',
      name: 'Photo Gallery',
      description: 'Share your Uganda photos and experiences',
      icon: '📸',
      posts: 34,
      color: 'bg-pink-100 text-pink-800'
    }
  ];

  const forumPosts: ForumPost[] = [
    {
      id: '1',
      title: 'Best time to visit Bwindi for gorilla trekking?',
      excerpt: 'Planning my first gorilla trek and wondering about the best months to visit. Any advice on weather conditions and gorilla visibility?',
      author: {
        name: 'TravelEnthusiast',
        badge: 'Explorer'
      },
      category: 'wildlife',
      replies: 12,
      views: 245,
      lastActivity: '2 hours ago',
      isPinned: true
    },
    {
      id: '2',
      title: 'Uganda visa requirements for US citizens - Updated 2024',
      excerpt: 'Complete guide to getting a visa for Uganda including online application process and required documents.',
      author: {
        name: 'UgandaExpert',
        badge: 'Local Guide'
      },
      category: 'practical',
      replies: 8,
      views: 189,
      lastActivity: '4 hours ago',
      isPinned: true
    },
    {
      id: '3',
      title: 'Amazing 10-day Uganda itinerary - Gorillas, Safari & Culture',
      excerpt: 'Just returned from an incredible Uganda trip! Sharing my detailed itinerary covering Bwindi, Queen Elizabeth NP, and Kampala.',
      author: {
        name: 'AdventureSeeker',
        badge: 'Frequent Traveler'
      },
      category: 'planning',
      replies: 15,
      views: 356,
      lastActivity: '6 hours ago',
      isHot: true
    },
    {
      id: '4',
      title: 'Budget accommodation recommendations near Murchison Falls',
      excerpt: 'Looking for affordable yet comfortable places to stay near Murchison Falls National Park. Any suggestions?',
      author: {
        name: 'BackpackerLife',
        badge: 'Budget Traveler'
      },
      category: 'accommodations',
      replies: 7,
      views: 134,
      lastActivity: '8 hours ago'
    },
    {
      id: '5',
      title: 'Cultural etiquette tips for visiting local communities',
      excerpt: 'What should I know about local customs and etiquette when visiting rural communities in Uganda?',
      author: {
        name: 'CulturalExplorer',
        badge: 'Cultural Enthusiast'
      },
      category: 'culture',
      replies: 9,
      views: 178,
      lastActivity: '1 day ago'
    }
  ];

  const filteredPosts = forumPosts.filter(post => 
    (activeCategory === 'all' || post.category === activeCategory) &&
    (searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Uganda Travel Forum</h1>
              <p className="text-gray-600">Connect with fellow travelers and share your Uganda experiences</p>
            </div>
            
            {user && (
              <Link
                href="/forum/new-post"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                + New Post
              </Link>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeCategory === category.id
                        ? 'bg-green-100 border-green-500 border'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{category.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-gray-500">{category.description}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                        {category.posts}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Forum Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Forum Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Posts:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-semibold">3,456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Online Now:</span>
                  <span className="font-semibold text-green-600">23</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Forum Coming Soon Notice */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-8 text-white mb-8">
              <h2 className="text-2xl font-bold mb-4">🚧 Forum Coming Soon!</h2>
              <p className="text-lg mb-4">
                We&apos;re building an amazing community forum where travelers can share experiences, 
                ask questions, and get insider tips about Uganda.
              </p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-semibold mb-2">What to expect:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Real traveler experiences and trip reports</li>
                  <li>• Expert advice from local guides</li>
                  <li>• Photo sharing and travel inspiration</li>
                  <li>• Q&A with Uganda travel experts</li>
                  <li>• Community-driven travel tips</li>
                </ul>
              </div>
            </div>

            {/* Preview of Forum Features */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Featured Discussions (Preview)
                </h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Latest Activity</option>
                    <option>Most Popular</option>
                    <option>Most Replies</option>
                  </select>
                </div>
              </div>

              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6 opacity-75">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {post.isPinned && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            📌 Pinned
                          </span>
                        )}
                        {post.isHot && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                            🔥 Hot
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          categories.find(c => c.id === post.category)?.color || 'bg-gray-100 text-gray-800'
                        }`}>
                          {categories.find(c => c.id === post.category)?.name}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-green-600 cursor-pointer">
                        {post.title}
                      </h4>
                      <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {post.author.name.charAt(0)}
                          </div>
                          <span>{post.author.name}</span>
                          {post.author.badge && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {post.author.badge}
                            </span>
                          )}
                        </div>
                        <span>•</span>
                        <span>{post.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-6 text-center text-sm text-gray-500 ml-6">
                      <div>
                        <div className="font-semibold text-gray-900">{post.replies}</div>
                        <div>replies</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{post.views}</div>
                        <div>views</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center mt-8">
              <h3 className="text-xl font-semibold mb-4">Want to be notified when the forum launches?</h3>
              <p className="text-gray-600 mb-6">
                Join our community and be the first to know when our travel forum goes live!
              </p>
              <div className="flex justify-center space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}