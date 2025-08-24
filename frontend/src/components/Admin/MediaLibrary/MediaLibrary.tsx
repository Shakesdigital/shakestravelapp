'use client';

import React, { useState, useRef, useCallback } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

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

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (file: MediaFile) => void;
  allowMultiple?: boolean;
  fileTypes?: string[];
}

export default function MediaLibrary({ 
  isOpen, 
  onClose, 
  onSelect, 
  allowMultiple = false,
  fileTypes = ['image/*', 'video/*', 'application/pdf']
}: MediaLibraryProps) {
  const [files, setFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'bali-sunset.jpg',
      url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400',
      type: 'image',
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
      type: 'image',
      size: 856000,
      uploadDate: '2024-01-12',
      alt: 'Tokyo street at night',
      caption: 'Vibrant neon lights in Shibuya district',
      tags: ['tokyo', 'japan', 'night', 'urban'],
      folder: 'destinations'
    },
    {
      id: '3',
      name: 'paris-guide.pdf',
      url: '/docs/paris-guide.pdf',
      type: 'document',
      size: 2048000,
      uploadDate: '2024-01-10',
      tags: ['paris', 'guide', 'travel'],
      folder: 'guides'
    }
  ]);

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [dragOver, setDragOver] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folders = ['all', 'destinations', 'guides', 'experiences', 'accommodations'];

  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'size': return b.size - a.size;
        case 'date': return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        default: return 0;
      }
    });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  }, []);

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: MediaFile[] = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'document',
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: [],
      folder: selectedFolder === 'all' ? 'destinations' : selectedFolder
    }));
    
    setFiles([...newFiles, ...files]);
    setShowUploadModal(false);
  };

  const handleFileSelect = (file: MediaFile) => {
    if (allowMultiple) {
      setSelectedFiles(prev => 
        prev.includes(file.id) 
          ? prev.filter(id => id !== file.id)
          : [...prev, file.id]
      );
    } else {
      onSelect?.(file);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'document': return '📄';
      default: return '📎';
    }
  };

  const deleteFile = (fileId: string) => {
    setFiles(files.filter(file => file.id !== fileId));
  };

  const updateFileMetadata = (fileId: string, updates: Partial<MediaFile>) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
    setEditingFile(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                📚 Media Library
              </h2>
              <HelpTooltip content="Upload, organize, and manage your media files. Drag and drop files to upload, or use the upload button." />
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
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
              </div>

              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                {folders.map(folder => (
                  <option key={folder} value={folder}>
                    {folder === 'all' ? 'All Folders' : folder.charAt(0).toUpperCase() + folder.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'size')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                {viewMode === 'grid' ? '📋' : '⚏'}
              </button>
              
              <AnimatedButton
                onClick={() => setShowUploadModal(true)}
                variant="primary"
              >
                📤 Upload Files
              </AnimatedButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Grid/List */}
          <div 
            className={`flex-1 p-6 overflow-y-auto ${dragOver ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {dragOver && (
              <div className="border-2 border-dashed border-green-500 rounded-lg p-8 text-center mb-4">
                <div className="text-4xl mb-2">📤</div>
                <p className="text-green-600 dark:text-green-400 font-medium">
                  Drop files here to upload
                </p>
              </div>
            )}

            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No files found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
                : 'space-y-2'
              }>
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`
                      border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer
                      ${selectedFiles.includes(file.id) ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20' : 'hover:border-gray-300 dark:hover:border-gray-500'}
                      ${viewMode === 'list' ? 'flex items-center p-3' : 'p-3'}
                    `}
                    onClick={() => handleFileSelect(file)}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Grid View */}
                        <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.alt || file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">{getFileIcon(file.type)}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)}
                        </p>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3">
                          {file.type === 'image' ? (
                            <img
                              src={file.url}
                              alt={file.alt || file.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <span className="text-xl">{getFileIcon(file.type)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {file.uploadDate}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingFile(file);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteFile(file.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            🗑️
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredFiles.length} files • {selectedFiles.length} selected
          </div>
          <div className="flex items-center space-x-2">
            {allowMultiple && selectedFiles.length > 0 && (
              <AnimatedButton
                onClick={() => {
                  const selectedFileObjects = files.filter(f => selectedFiles.includes(f.id));
                  selectedFileObjects.forEach(file => onSelect?.(file));
                  onClose();
                }}
                variant="primary"
              >
                Use Selected ({selectedFiles.length})
              </AnimatedButton>
            )}
            <AnimatedButton onClick={onClose} variant="secondary">
              Cancel
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Upload Files
            </h3>
            
            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-4xl mb-2">📤</div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supports: Images, Videos, PDFs
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={fileTypes.join(',')}
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileUpload(Array.from(e.target.files));
                  }
                }}
                className="hidden"
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <AnimatedButton
                onClick={() => setShowUploadModal(false)}
                variant="secondary"
              >
                Cancel
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      {editingFile && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Edit File Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File Name
                </label>
                <input
                  value={editingFile.name}
                  onChange={(e) => setEditingFile({ ...editingFile, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              {editingFile.type === 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Alt Text
                    </label>
                    <input
                      value={editingFile.alt || ''}
                      onChange={(e) => setEditingFile({ ...editingFile, alt: e.target.value })}
                      placeholder="Describe the image for accessibility"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Caption
                    </label>
                    <input
                      value={editingFile.caption || ''}
                      onChange={(e) => setEditingFile({ ...editingFile, caption: e.target.value })}
                      placeholder="Optional caption"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  value={editingFile.tags.join(', ')}
                  onChange={(e) => setEditingFile({ 
                    ...editingFile, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  placeholder="travel, bali, sunset"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Folder
                </label>
                <select
                  value={editingFile.folder || ''}
                  onChange={(e) => setEditingFile({ ...editingFile, folder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  {folders.filter(f => f !== 'all').map(folder => (
                    <option key={folder} value={folder}>
                      {folder.charAt(0).toUpperCase() + folder.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <AnimatedButton
                onClick={() => setEditingFile(null)}
                variant="secondary"
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                onClick={() => updateFileMetadata(editingFile.id, editingFile)}
                variant="primary"
              >
                Save Changes
              </AnimatedButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}