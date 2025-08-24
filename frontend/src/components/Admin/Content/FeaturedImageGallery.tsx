import React, { useState } from 'react';

const mockImages = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
    alt: 'Mountain Gorilla in Bwindi',
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
    alt: 'Nile River Rafting',
  }
];

const FeaturedImageGallery: React.FC<{ selectedImageId?: string; onSelect?: (id: string) => void }> = ({ selectedImageId, onSelect }) => {
  const [images, setImages] = useState(mockImages);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-8">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">🖼 Featured Image & Gallery</h3>
      <div className="flex gap-4 flex-wrap">
        {images.map(img => (
          <div key={img.id} className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${selectedImageId === img.id ? 'border-green-500' : 'border-gray-200'}`}
            onClick={() => onSelect && onSelect(img.id)}
          >
            <img src={img.url} alt={img.alt} className="w-32 h-24 object-cover" />
            <div className="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">{img.alt}</div>
          </div>
        ))}
      </div>
      <button className="mt-4 px-4 py-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200">Add Image</button>
    </section>
  );
};

export default FeaturedImageGallery;
