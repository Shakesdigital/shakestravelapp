'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface ContentVersion {
  id: string;
  version: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  createdAt: Date;
  changes: string;
  size: number;
  isAutoSave?: boolean;
  parentVersion?: string;
  tags?: string[];
}

interface VersionControlProps {
  contentId: string;
  versions: ContentVersion[];
  currentVersion: string;
  onVersionSelect: (versionId: string) => void;
  onVersionRestore: (versionId: string) => void;
  onVersionCompare: (version1: string, version2: string) => void;
  onVersionDelete: (versionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function VersionControl({
  contentId,
  versions,
  currentVersion,
  onVersionSelect,
  onVersionRestore,
  onVersionCompare,
  onVersionDelete,
  isOpen,
  onClose
}: VersionControlProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [showConfirmRestore, setShowConfirmRestore] = useState<string | null>(null);

  const filteredVersions = versions.filter(version => {
    if (filterStatus === 'all') return true;
    return version.status === filterStatus;
  }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const handleVersionSelect = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    } else {
      setSelectedVersions([selectedVersions[1], versionId]);
    }
  };

  const handleCompareVersions = () => {
    if (selectedVersions.length === 2) {
      onVersionCompare(selectedVersions[0], selectedVersions[1]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTimeDifference = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getVersionIcon = (version: ContentVersion) => {
    if (version.status === 'published') return '🌟';
    if (version.isAutoSave) return '💾';
    if (version.status === 'archived') return '📦';
    return '📝';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📊 Version History
              </h2>
              <HelpTooltip content="Manage content versions, compare changes, and restore previous versions." />
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">View:</label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded text-sm ${viewMode === 'list' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                  >
                    📋 List
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-1 rounded text-sm ${viewMode === 'timeline' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                  >
                    📅 Timeline
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {selectedVersions.length === 2 && (
                <AnimatedButton
                  onClick={handleCompareVersions}
                  variant="secondary"
                  size="sm"
                >
                  🔍 Compare Selected
                </AnimatedButton>
              )}
              
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {filteredVersions.length} versions
              </span>
            </div>
          </div>
        </div>

        {/* Version List/Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {filteredVersions.map((version) => (
                <div
                  key={version.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    version.id === currentVersion 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : selectedVersions.includes(version.id)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedVersions.includes(version.id)}
                        onChange={() => handleVersionSelect(version.id)}
                        disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getVersionIcon(version)}</span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {version.title || `Version ${version.version}`}
                            </h4>
                            {version.id === currentVersion && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                Current
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(version.status)}`}>
                              {version.status}
                            </span>
                            {version.isAutoSave && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
                                Auto-save
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            v{version.version} • {version.author} • {getTimeDifference(version.createdAt)} • {formatFileSize(version.size)}
                          </div>
                          {version.changes && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              📝 {version.changes}
                            </div>
                          )}
                          {version.tags && version.tags.length > 0 && (
                            <div className="flex items-center space-x-1 mt-2">
                              {version.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onVersionSelect(version.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Preview version"
                      >
                        👁️
                      </button>
                      
                      {version.id !== currentVersion && (
                        <button
                          onClick={() => setShowConfirmRestore(version.id)}
                          className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Restore version"
                        >
                          ↩️
                        </button>
                      )}
                      
                      {!version.isAutoSave && version.status !== 'published' && (
                        <button
                          onClick={() => onVersionDelete(version.id)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete version"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Timeline View
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
              
              <div className="space-y-6">
                {filteredVersions.map((version, index) => (
                  <div key={version.id} className="relative flex items-start space-x-4">
                    <div className={`w-4 h-4 rounded-full border-4 ${
                      version.id === currentVersion
                        ? 'bg-green-500 border-green-200'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    } relative z-10`}></div>
                    
                    <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getVersionIcon(version)}</span>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {version.title || `Version ${version.version}`}
                          </h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(version.status)}`}>
                            {version.status}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {version.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {version.changes && <div className="mb-1">📝 {version.changes}</div>}
                        <div>By {version.author} • {formatFileSize(version.size)}</div>
                      </div>
                      
                      {version.tags && version.tags.length > 0 && (
                        <div className="flex items-center space-x-1 mt-2">
                          {version.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <button
                          onClick={() => onVersionSelect(version.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          👁️ Preview
                        </button>
                        
                        {version.id !== currentVersion && (
                          <button
                            onClick={() => setShowConfirmRestore(version.id)}
                            className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          >
                            ↩️ Restore
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {selectedVersions.length === 2 
                ? 'Compare selected versions to see changes'
                : selectedVersions.length === 1
                ? 'Select one more version to compare'
                : 'Select versions to compare changes'
              }
            </div>
            <AnimatedButton onClick={onClose} variant="secondary">
              Close
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showConfirmRestore && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Confirm Version Restore
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to restore this version? This will create a new version based on the selected one.
              Your current work will be preserved as a draft.
            </p>
            <div className="flex items-center space-x-3">
              <AnimatedButton
                onClick={() => {
                  onVersionRestore(showConfirmRestore);
                  setShowConfirmRestore(null);
                }}
                variant="primary"
                size="sm"
              >
                Restore Version
              </AnimatedButton>
              <AnimatedButton
                onClick={() => setShowConfirmRestore(null)}
                variant="secondary"
                size="sm"
              >
                Cancel
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}