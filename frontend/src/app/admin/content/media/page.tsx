'use client';

import React, { useState } from 'react';
import MediaLibrary from '@/components/Admin/MediaLibrary/MediaLibrary';
import { AnimatedButton } from '@/components/Admin/UI/FeedbackComponents';
import { HelpTooltip } from '@/components/Admin/UI/Tooltip';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadDate: string;
  alt?: string;
  caption?: string;
  tags: string[];
  folder?: string;
}

export default function MediaManagementPage() {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<MediaFile[]>([]);

  // Mock data for demonstration
  const mockStats = {
    totalFiles: 156,
    totalSize: '2.1 GB',
    imagesCount: 134,
    videosCount: 18,
    documentsCount: 4,
    recentUploads: 12
  };

  const recentFiles = [
    {
      id: '1',
      name: 'bali-sunset.jpg',
      url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      type: 'image' as const,
      size: 1024000,
      uploadDate: '2024-01-15',
      alt: 'Beautiful sunset in Bali',
      caption: 'Stunning sunset view from Uluwatu Temple',
      tags: ['bali', 'sunset', 'travel', 'temple'],
      folder: 'destinations'
    },
    {
      id: '2',
      name: 'tokyo-street.jpg', 
      url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
      type: 'image' as const,
      size: 856000,
      uploadDate: '2024-01-12',
      alt: 'Tokyo street at night',
      caption: 'Vibrant neon lights in Shibuya district',
      tags: ['tokyo', 'japan', 'night', 'urban'],
      folder: 'destinations'
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📚 Media Library
            </h1>
            <HelpTooltip content="Manage all your media files including images, videos, and documents. Upload, organize, and optimize your media assets." />
          </div>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Upload, organize, and manage all your media files in one place.
          </p>
        </div>
        
        <div className="mt-6 sm:mt-0 flex items-center space-x-3">
          <AnimatedButton
            onClick={() => setShowMediaLibrary(true)}
            variant="primary"
          >
            📤 Upload Media
          </AnimatedButton>
          <AnimatedButton variant="secondary">
            📁 Organize Folders
          </AnimatedButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalFiles}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 dark:text-green-400">+{mockStats.recentUploads} this week</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.totalSize}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💾</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '42%' }}></div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">42% of 5GB limit</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Images</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockStats.imagesCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {mockStats.videosCount} videos, {mockStats.documentsCount} docs
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Optimization</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-yellow-600 dark:text-yellow-400">18 files need optimization</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Uploads */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Uploads</h3>
              <button
                onClick={() => setShowMediaLibrary(true)}
                className="text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentFiles.map((file) => (
                <div
                  key={file.id}
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  <div className="aspect-square">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl">
                          {file.type === 'video' ? '🎥' : '📄'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                        👁️
                      </button>
                      <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                        ✏️
                      </button>
                      <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tools */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowMediaLibrary(true)}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl">📤</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Upload Files</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add new media files</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl">🔧</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Bulk Optimize</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Compress images</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl">📁</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Create Folder</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organize files</p>
                </div>
              </button>
              
              <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-xl">📊</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Usage Report</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">View analytics</p>
                </div>
              </button>
            </div>
          </div>

          {/* Storage Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Storage Breakdown</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🖼️</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Images</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">1.2 GB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '57%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎥</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Videos</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">0.8 GB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '38%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📄</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">0.1 GB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-sm">📤</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Uploaded <span className="font-medium">bali-sunset.jpg</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-sm">🔧</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Optimized 5 images in <span className="font-medium">destinations</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="text-sm">📁</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white">
                    Created folder <span className="font-medium">experiences</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(file) => {
          setSelectedFiles([...selectedFiles, file]);
        }}
        allowMultiple={true}
      />
    </div>
  );
}