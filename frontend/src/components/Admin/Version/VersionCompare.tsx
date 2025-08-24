'use client';

import React, { useState } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';

interface ContentVersion {
  id: string;
  version: string;
  title: string;
  status: 'published' | 'draft' | 'archived';
  author: string;
  createdAt: Date;
  content: string;
  blocks?: any[];
}

interface VersionCompareProps {
  version1: ContentVersion;
  version2: ContentVersion;
  isOpen: boolean;
  onClose: () => void;
  onRestoreVersion: (versionId: string) => void;
}

interface DiffResult {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumber?: number;
}

export default function VersionCompare({
  version1,
  version2,
  isOpen,
  onClose,
  onRestoreVersion
}: VersionCompareProps) {
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [showContent, setShowContent] = useState<'text' | 'blocks'>('text');

  // Simple diff algorithm for demonstration
  const generateDiff = (text1: string, text2: string): DiffResult[] => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const result: DiffResult[] = [];
    
    const maxLines = Math.max(lines1.length, lines2.length);
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        result.push({ type: 'unchanged', text: line1, lineNumber: i + 1 });
      } else {
        if (line1 && !line2) {
          result.push({ type: 'removed', text: line1, lineNumber: i + 1 });
        } else if (!line1 && line2) {
          result.push({ type: 'added', text: line2, lineNumber: i + 1 });
        } else {
          result.push({ type: 'removed', text: line1, lineNumber: i + 1 });
          result.push({ type: 'added', text: line2, lineNumber: i + 1 });
        }
      }
    }
    
    return result;
  };

  const getDiffCounts = () => {
    const diff = generateDiff(version1.content, version2.content);
    const added = diff.filter(d => d.type === 'added').length;
    const removed = diff.filter(d => d.type === 'removed').length;
    return { added, removed };
  };

  const renderDiffLine = (diff: DiffResult, index: number) => {
    const bgColor = diff.type === 'added' ? 'bg-green-50 dark:bg-green-900/20' :
                   diff.type === 'removed' ? 'bg-red-50 dark:bg-red-900/20' :
                   'bg-white dark:bg-gray-800';
    
    const textColor = diff.type === 'added' ? 'text-green-800 dark:text-green-300' :
                     diff.type === 'removed' ? 'text-red-800 dark:text-red-300' :
                     'text-gray-800 dark:text-gray-200';
    
    const prefix = diff.type === 'added' ? '+ ' :
                  diff.type === 'removed' ? '- ' : '  ';

    return (
      <div key={index} className={`flex items-start space-x-4 px-4 py-1 ${bgColor}`}>
        <span className="text-xs text-gray-400 w-8 text-right">
          {diff.lineNumber}
        </span>
        <span className={`text-xs ${textColor} font-mono flex-1`}>
          {prefix}{diff.text}
        </span>
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const { added, removed } = getDiffCounts();
  const diff = generateDiff(version1.content, version2.content);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔍 Compare Versions
              </h2>
              <div className="mt-2 flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>{removed} removals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>{added} additions</span>
                </div>
                <span>{diff.length} total changes</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'side-by-side' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setViewMode('unified')}
                  className={`px-3 py-1 rounded text-sm ${viewMode === 'unified' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'text-gray-400'}`}
                >
                  Unified
                </button>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Version Headers */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Version {version1.version} (Older)
                  </h3>
                  <AnimatedButton
                    onClick={() => onRestoreVersion(version1.id)}
                    variant="secondary"
                    size="sm"
                  >
                    ↩️ Restore
                  </AnimatedButton>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {version1.author} • {formatDate(version1.createdAt)}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    version1.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {version1.status}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Version {version2.version} (Newer)
                  </h3>
                  <AnimatedButton
                    onClick={() => onRestoreVersion(version2.id)}
                    variant="secondary"
                    size="sm"
                  >
                    ↩️ Restore
                  </AnimatedButton>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {version2.author} • {formatDate(version2.createdAt)}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    version2.status === 'published' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {version2.status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Comparing v{version1.version} → v{version2.version}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {formatDate(version1.createdAt)} → {formatDate(version2.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <AnimatedButton
                  onClick={() => onRestoreVersion(version1.id)}
                  variant="secondary"
                  size="sm"
                >
                  ↩️ Restore v{version1.version}
                </AnimatedButton>
                <AnimatedButton
                  onClick={() => onRestoreVersion(version2.id)}
                  variant="secondary"
                  size="sm"
                >
                  ↩️ Restore v{version2.version}
                </AnimatedButton>
              </div>
            </div>
          )}
        </div>

        {/* Content Comparison */}
        <div className="flex-1 overflow-hidden">
          {viewMode === 'side-by-side' ? (
            <div className="grid grid-cols-2 h-full">
              {/* Left Panel - Version 1 */}
              <div className="border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-1">
                    {version1.content.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start space-x-4 px-2 py-1">
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {index + 1}
                        </span>
                        <span className="text-sm font-mono flex-1 text-gray-800 dark:text-gray-200">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Panel - Version 2 */}
              <div className="overflow-y-auto">
                <div className="p-4">
                  <div className="space-y-1">
                    {version2.content.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start space-x-4 px-2 py-1">
                        <span className="text-xs text-gray-400 w-8 text-right">
                          {index + 1}
                        </span>
                        <span className="text-sm font-mono flex-1 text-gray-800 dark:text-gray-200">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Unified View
            <div className="overflow-y-auto h-full">
              <div className="p-4">
                <div className="space-y-1 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  {diff.map((diffItem, index) => renderDiffLine(diffItem, index))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Use the restore buttons to revert to a specific version. A new version will be created based on your selection.
            </div>
            <AnimatedButton onClick={onClose} variant="secondary">
              Close Comparison
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}