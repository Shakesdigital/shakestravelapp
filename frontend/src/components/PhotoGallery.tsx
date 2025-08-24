'use client';

import React, { useState } from 'react';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedBy?: string;
  uploadedAt?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  allowUpload?: boolean;
  onPhotoUpload?: (file: File, caption: string) => void;
}

export default function PhotoGallery({ photos, allowUpload = false, onPhotoUpload }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadCaption, setUploadCaption] = useState('');

  const handlePhotoUpload = () => {
    if (uploadFile && onPhotoUpload) {
      onPhotoUpload(uploadFile, uploadCaption);
      setShowUploadModal(false);
      setUploadFile(null);
      setUploadCaption('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      {allowUpload && (
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Upload Photo
        </button>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer group"
            onClick={() => setSelectedPhoto(index)}
          >
            <img
              src={photo.url}
              alt={photo.caption || `Photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg group-hover:opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
            {photo.caption && (
              <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-70 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.caption}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ✕
          </button>
          
          <button
            onClick={() => setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : photos.length - 1)}
            className="absolute left-4 text-white text-2xl hover:text-gray-300"
          >
            ‹
          </button>
          
          <button
            onClick={() => setSelectedPhoto(selectedPhoto < photos.length - 1 ? selectedPhoto + 1 : 0)}
            className="absolute right-4 text-white text-2xl hover:text-gray-300"
          >
            ›
          </button>

          <div className="max-w-4xl max-h-full">
            <img
              src={photos[selectedPhoto].url}
              alt={photos[selectedPhoto].caption || `Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-full object-contain"
            />
            {photos[selectedPhoto].caption && (
              <div className="text-white text-center mt-4 p-4">
                <p className="text-lg">{photos[selectedPhoto].caption}</p>
                {photos[selectedPhoto].uploadedBy && (
                  <p className="text-sm text-gray-300 mt-2">
                    By {photos[selectedPhoto].uploadedBy} • {photos[selectedPhoto].uploadedAt}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upload Photo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Choose Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Caption (optional)</label>
                <textarea
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Describe your photo..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoUpload}
                disabled={!uploadFile}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}