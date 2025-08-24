'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';
import MediaLibrary from '../MediaLibrary/MediaLibrary';

interface Block {
  id: string;
  type: 'paragraph' | 'heading' | 'image' | 'gallery' | 'quote' | 'list' | 'travel-info' | 'destination-card' | 'itinerary' | 'pricing-table';
  content: any;
  attributes?: any;
}

interface WYSIWYGEditorProps {
  content: Block[];
  onChange: (content: Block[]) => void;
  placeholder?: string;
}

export default function WYSIWYGEditor({ content, onChange, placeholder = "Start writing your travel content..." }: WYSIWYGEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(content);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showBlockInserter, setShowBlockInserter] = useState(false);
  const [insertPosition, setInsertPosition] = useState<number>(0);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaSelectionBlock, setMediaSelectionBlock] = useState<string | null>(null);

  useEffect(() => {
    onChange(blocks);
  }, [blocks, onChange]);

  const blockTypes = [
    { type: 'paragraph', icon: '📝', label: 'Paragraph', description: 'Start with the building block of all narrative.' },
    { type: 'heading', icon: '📖', label: 'Heading', description: 'Introduce new sections and organize content.' },
    { type: 'image', icon: '🖼️', label: 'Image', description: 'Insert a single image with caption.' },
    { type: 'gallery', icon: '🖼️🖼️', label: 'Gallery', description: 'Display multiple images in a grid.' },
    { type: 'quote', icon: '💬', label: 'Quote', description: 'Give a quote the emphasis it deserves.' },
    { type: 'list', icon: '📋', label: 'List', description: 'Create an ordered or unordered list.' },
    { type: 'travel-info', icon: '✈️', label: 'Travel Info', description: 'Add travel details like duration, difficulty, etc.' },
    { type: 'destination-card', icon: '🗺️', label: 'Destination Card', description: 'Showcase a destination with image and details.' },
    { type: 'itinerary', icon: '📅', label: 'Itinerary', description: 'Create a day-by-day travel itinerary.' },
    { type: 'pricing-table', icon: '💰', label: 'Pricing Table', description: 'Display pricing options and packages.' }
  ];

  const addBlock = (type: Block['type'], position: number) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: getDefaultContent(type),
      attributes: getDefaultAttributes(type)
    };

    const newBlocks = [...blocks];
    newBlocks.splice(position, 0, newBlock);
    setBlocks(newBlocks);
    setShowBlockInserter(false);
    setSelectedBlock(newBlock.id);
  };

  const getDefaultContent = (type: Block['type']) => {
    switch (type) {
      case 'paragraph': return '';
      case 'heading': return 'New Heading';
      case 'image': return { src: '', alt: '', caption: '' };
      case 'gallery': return { images: [] };
      case 'quote': return { text: '', author: '' };
      case 'list': return { items: [''], ordered: false };
      case 'travel-info': return { duration: '', difficulty: '', season: '', price: '' };
      case 'destination-card': return { title: '', description: '', image: '', location: '' };
      case 'itinerary': return { days: [{ day: 1, title: '', activities: [''] }] };
      case 'pricing-table': return { packages: [{ name: '', price: '', features: [''] }] };
      default: return '';
    }
  };

  const getDefaultAttributes = (type: Block['type']) => {
    switch (type) {
      case 'heading': return { level: 2 };
      case 'image': return { alignment: 'center', size: 'large' };
      case 'gallery': return { columns: 3 };
      default: return {};
    }
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    setSelectedBlock(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < blocks.length - 1)
    ) {
      const newBlocks = [...blocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Editor Toolbar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content Editor</h3>
          <HelpTooltip content="Click the + button to add new blocks. Select any block to edit it or move it around." />
        </div>
        
        <div className="flex items-center space-x-2">
          <AnimatedButton variant="secondary" size="sm">
            👁️ Preview
          </AnimatedButton>
          <AnimatedButton variant="secondary" size="sm">
            💾 Save Draft
          </AnimatedButton>
          <AnimatedButton variant="primary" size="sm">
            🚀 Publish
          </AnimatedButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-800 border-x border-gray-200 dark:border-gray-700 min-h-[600px]">
        <div className="p-8">
          {blocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Start Creating Amazing Content
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {placeholder}
              </p>
              <AnimatedButton
                onClick={() => {
                  setInsertPosition(0);
                  setShowBlockInserter(true);
                }}
              >
                ➕ Add Your First Block
              </AnimatedButton>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id}>
                  {/* Block Inserter Above */}
                  <div className="relative group">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          setInsertPosition(index);
                          setShowBlockInserter(true);
                        }}
                        className="w-8 h-8 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        ➕
                      </button>
                    </div>
                  </div>

                  {/* Block Content */}
                  <BlockRenderer
                    block={block}
                    isSelected={selectedBlock === block.id}
                    onSelect={() => setSelectedBlock(block.id)}
                    onUpdate={(updates) => updateBlock(block.id, updates)}
                    onDelete={() => deleteBlock(block.id)}
                    onMoveUp={() => moveBlock(block.id, 'up')}
                    onMoveDown={() => moveBlock(block.id, 'down')}
                    canMoveUp={index > 0}
                    canMoveDown={index < blocks.length - 1}
                  />
                </div>
              ))}

              {/* Final Block Inserter */}
              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setInsertPosition(blocks.length);
                    setShowBlockInserter(true);
                  }}
                  className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                >
                  <span className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400">
                    ➕ Add Block
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Block Inserter Modal */}
      {showBlockInserter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Choose a Block Type
                </h3>
                <button
                  onClick={() => setShowBlockInserter(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blockTypes.map((blockType) => (
                  <button
                    key={blockType.type}
                    onClick={() => addBlock(blockType.type as Block['type'], insertPosition)}
                    className="text-left p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">{blockType.icon}</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {blockType.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {blockType.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibrary
        isOpen={showMediaLibrary}
        onClose={() => {
          setShowMediaLibrary(false);
          setMediaSelectionBlock(null);
        }}
        onSelect={(file) => {
          if (mediaSelectionBlock) {
            const targetBlock = blocks.find(b => b.id === mediaSelectionBlock);
            if (targetBlock?.type === 'image') {
              updateBlock(mediaSelectionBlock, {
                content: {
                  ...targetBlock.content,
                  src: file.url,
                  alt: file.alt || file.name,
                  caption: file.caption || ''
                }
              });
            } else if (targetBlock?.type === 'gallery') {
              const newImages = [...targetBlock.content.images, {
                src: file.url,
                alt: file.alt || file.name
              }];
              updateBlock(mediaSelectionBlock, {
                content: {
                  ...targetBlock.content,
                  images: newImages
                }
              });
            }
          }
          setShowMediaLibrary(false);
          setMediaSelectionBlock(null);
        }}
        fileTypes={['image/*']}
      />
    </div>
  );
}

// Block Renderer Component
interface BlockRendererProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

function BlockRenderer({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: BlockRendererProps) {
  const renderBlock = () => {
    switch (block.type) {
      case 'paragraph':
        return (
          <textarea
            value={block.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Write your paragraph here..."
            className="w-full p-4 border-none resize-none focus:outline-none bg-transparent text-gray-900 dark:text-white"
            rows={3}
          />
        );

      case 'heading':
        const HeadingTag = `h${block.attributes?.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <select
                value={block.attributes?.level || 2}
                onChange={(e) => onUpdate({ attributes: { ...block.attributes, level: parseInt(e.target.value) } })}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
              >
                <option value={1}>H1</option>
                <option value={2}>H2</option>
                <option value={3}>H3</option>
                <option value={4}>H4</option>
              </select>
            </div>
            <HeadingTag className={`font-bold text-gray-900 dark:text-white ${
              block.attributes?.level === 1 ? 'text-3xl' :
              block.attributes?.level === 2 ? 'text-2xl' :
              block.attributes?.level === 3 ? 'text-xl' : 'text-lg'
            }`}>
              <input
                value={block.content}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Heading text..."
                className="w-full bg-transparent border-none focus:outline-none"
              />
            </HeadingTag>
          </div>
        );

      case 'travel-info':
        return (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">✈️ Travel Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                <input
                  value={block.content.duration}
                  onChange={(e) => onUpdate({ content: { ...block.content, duration: e.target.value } })}
                  placeholder="e.g., 7 days"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
                <select
                  value={block.content.difficulty}
                  onChange={(e) => onUpdate({ content: { ...block.content, difficulty: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Best Season</label>
                <input
                  value={block.content.season}
                  onChange={(e) => onUpdate({ content: { ...block.content, season: e.target.value } })}
                  placeholder="e.g., Dry season"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range</label>
                <input
                  value={block.content.price}
                  onChange={(e) => onUpdate({ content: { ...block.content, price: e.target.value } })}
                  placeholder="e.g., $500-800"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'destination-card':
        return (
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🗺️ Destination Card</h4>
            <div className="space-y-3">
              <input
                value={block.content.title}
                onChange={(e) => onUpdate({ content: { ...block.content, title: e.target.value } })}
                placeholder="Destination name"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-medium"
              />
              <input
                value={block.content.location}
                onChange={(e) => onUpdate({ content: { ...block.content, location: e.target.value } })}
                placeholder="Location"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <textarea
                value={block.content.description}
                onChange={(e) => onUpdate({ content: { ...block.content, description: e.target.value } })}
                placeholder="Destination description..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <input
                value={block.content.image}
                onChange={(e) => onUpdate({ content: { ...block.content, image: e.target.value } })}
                placeholder="Image URL"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🖼️ Image</h4>
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    value={block.content.src}
                    onChange={(e) => onUpdate({ content: { ...block.content, src: e.target.value } })}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      setMediaSelectionBlock(block.id);
                      setShowMediaLibrary(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    📚 Browse
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alignment</label>
                  <select
                    value={block.attributes?.alignment || 'center'}
                    onChange={(e) => onUpdate({ attributes: { ...block.attributes, alignment: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              <input
                value={block.content.alt}
                onChange={(e) => onUpdate({ content: { ...block.content, alt: e.target.value } })}
                placeholder="Alt text for accessibility"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              <input
                value={block.content.caption}
                onChange={(e) => onUpdate({ content: { ...block.content, caption: e.target.value } })}
                placeholder="Image caption (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              {block.content.src && (
                <div className="mt-3">
                  <img
                    src={block.content.src}
                    alt={block.content.alt}
                    className="max-w-full h-auto rounded-md"
                  />
                  {block.content.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                      {block.content.caption}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">🖼️🖼️ Image Gallery</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gallery Images</label>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">Columns:</label>
                  <select
                    value={block.attributes?.columns || 3}
                    onChange={(e) => onUpdate({ attributes: { ...block.attributes, columns: parseInt(e.target.value) } })}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                {block.content.images.map((image: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      value={image.src || ''}
                      onChange={(e) => {
                        const newImages = [...block.content.images];
                        newImages[index] = { ...newImages[index], src: e.target.value };
                        onUpdate({ content: { ...block.content, images: newImages } });
                      }}
                      placeholder="Image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <input
                      value={image.alt || ''}
                      onChange={(e) => {
                        const newImages = [...block.content.images];
                        newImages[index] = { ...newImages[index], alt: e.target.value };
                        onUpdate({ content: { ...block.content, images: newImages } });
                      }}
                      placeholder="Alt text"
                      className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        const newImages = block.content.images.filter((_: any, i: number) => i !== index);
                        onUpdate({ content: { ...block.content, images: newImages } });
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const newImages = [...block.content.images, { src: '', alt: '' }];
                      onUpdate({ content: { ...block.content, images: newImages } });
                    }}
                    className="flex-1 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    ➕ Add Image
                  </button>
                  <button
                    onClick={() => {
                      setMediaSelectionBlock(block.id);
                      setShowMediaLibrary(true);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    📚 Browse
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-l-4 border-gray-400 dark:border-gray-500">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">💬 Quote</h4>
            <div className="space-y-3">
              <textarea
                value={block.content.text}
                onChange={(e) => onUpdate({ content: { ...block.content, text: e.target.value } })}
                placeholder="Enter the quote text..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-lg italic"
                rows={3}
              />
              <input
                value={block.content.author}
                onChange={(e) => onUpdate({ content: { ...block.content, author: e.target.value } })}
                placeholder="Quote author (optional)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              />
              {block.content.text && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <blockquote className="text-lg italic text-gray-700 dark:text-gray-300">
                    "{block.content.text}"
                  </blockquote>
                  {block.content.author && (
                    <cite className="block text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
                      — {block.content.author}
                    </cite>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">📋 List</h4>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Type:</label>
                <select
                  value={block.content.ordered ? 'ordered' : 'unordered'}
                  onChange={(e) => onUpdate({ content: { ...block.content, ordered: e.target.value === 'ordered' } })}
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                >
                  <option value="unordered">Bullet List</option>
                  <option value="ordered">Numbered List</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              {block.content.items.map((item: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-500 dark:text-gray-400 w-6">
                    {block.content.ordered ? `${index + 1}.` : '•'}
                  </span>
                  <input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...block.content.items];
                      newItems[index] = e.target.value;
                      onUpdate({ content: { ...block.content, items: newItems } });
                    }}
                    placeholder="List item..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      const newItems = block.content.items.filter((_: any, i: number) => i !== index);
                      onUpdate({ content: { ...block.content, items: newItems } });
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...block.content.items, ''];
                  onUpdate({ content: { ...block.content, items: newItems } });
                }}
                className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                ➕ Add Item
              </button>
            </div>
          </div>
        );

      case 'itinerary':
        return (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">📅 Travel Itinerary</h4>
            <div className="space-y-4">
              {block.content.days.map((day: any, dayIndex: number) => (
                <div key={dayIndex} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                        Day {day.day}
                      </span>
                      <input
                        value={day.title}
                        onChange={(e) => {
                          const newDays = [...block.content.days];
                          newDays[dayIndex] = { ...newDays[dayIndex], title: e.target.value };
                          onUpdate({ content: { ...block.content, days: newDays } });
                        }}
                        placeholder="Day title..."
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-medium"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const newDays = block.content.days.filter((_: any, i: number) => i !== dayIndex);
                        onUpdate({ content: { ...block.content, days: newDays } });
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="space-y-2">
                    {day.activities.map((activity: string, actIndex: number) => (
                      <div key={actIndex} className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">•</span>
                        <input
                          value={activity}
                          onChange={(e) => {
                            const newDays = [...block.content.days];
                            newDays[dayIndex].activities[actIndex] = e.target.value;
                            onUpdate({ content: { ...block.content, days: newDays } });
                          }}
                          placeholder="Activity description..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <button
                          onClick={() => {
                            const newDays = [...block.content.days];
                            newDays[dayIndex].activities = newDays[dayIndex].activities.filter((_: any, i: number) => i !== actIndex);
                            onUpdate({ content: { ...block.content, days: newDays } });
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newDays = [...block.content.days];
                        newDays[dayIndex].activities.push('');
                        onUpdate({ content: { ...block.content, days: newDays } });
                      }}
                      className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-sm"
                    >
                      ➕ Add Activity
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newDays = [...block.content.days, { 
                    day: block.content.days.length + 1, 
                    title: '', 
                    activities: [''] 
                  }];
                  onUpdate({ content: { ...block.content, days: newDays } });
                }}
                className="w-full p-3 border border-dashed border-blue-300 dark:border-blue-600 rounded-md hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                ➕ Add Day
              </button>
            </div>
          </div>
        );

      case 'pricing-table':
        return (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">💰 Pricing Table</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {block.content.packages.map((pkg: any, pkgIndex: number) => (
                <div key={pkgIndex} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      value={pkg.name}
                      onChange={(e) => {
                        const newPackages = [...block.content.packages];
                        newPackages[pkgIndex] = { ...newPackages[pkgIndex], name: e.target.value };
                        onUpdate({ content: { ...block.content, packages: newPackages } });
                      }}
                      placeholder="Package name"
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-medium"
                    />
                    <button
                      onClick={() => {
                        const newPackages = block.content.packages.filter((_: any, i: number) => i !== pkgIndex);
                        onUpdate({ content: { ...block.content, packages: newPackages } });
                      }}
                      className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                  <input
                    value={pkg.price}
                    onChange={(e) => {
                      const newPackages = [...block.content.packages];
                      newPackages[pkgIndex] = { ...newPackages[pkgIndex], price: e.target.value };
                      onUpdate({ content: { ...block.content, packages: newPackages } });
                    }}
                    placeholder="$999"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-lg font-bold text-center mb-3"
                  />
                  <div className="space-y-2">
                    {pkg.features.map((feature: string, featureIndex: number) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <span className="text-green-500 text-sm">✓</span>
                        <input
                          value={feature}
                          onChange={(e) => {
                            const newPackages = [...block.content.packages];
                            newPackages[pkgIndex].features[featureIndex] = e.target.value;
                            onUpdate({ content: { ...block.content, packages: newPackages } });
                          }}
                          placeholder="Feature..."
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <button
                          onClick={() => {
                            const newPackages = [...block.content.packages];
                            newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter((_: any, i: number) => i !== featureIndex);
                            onUpdate({ content: { ...block.content, packages: newPackages } });
                          }}
                          className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newPackages = [...block.content.packages];
                        newPackages[pkgIndex].features.push('');
                        onUpdate({ content: { ...block.content, packages: newPackages } });
                      }}
                      className="w-full p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-md hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-sm"
                    >
                      ➕ Add Feature
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => {
                    const newPackages = [...block.content.packages, { 
                      name: '', 
                      price: '', 
                      features: [''] 
                    }];
                    onUpdate({ content: { ...block.content, packages: newPackages } });
                  }}
                  className="text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                  ➕ Add Package
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              Block type "{block.type}" not implemented yet
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group border-2 rounded-lg transition-all duration-200 ${
        isSelected 
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {/* Block Controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex items-center space-x-1 bg-gray-900 text-white rounded-md px-2 py-1 text-xs">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (canMoveUp) onMoveUp();
            }}
            disabled={!canMoveUp}
            className="hover:bg-gray-700 px-1 py-0.5 rounded disabled:opacity-50"
          >
            ↑
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (canMoveDown) onMoveDown();
            }}
            disabled={!canMoveDown}
            className="hover:bg-gray-700 px-1 py-0.5 rounded disabled:opacity-50"
          >
            ↓
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="hover:bg-red-600 px-1 py-0.5 rounded text-red-300"
          >
            🗑️
          </button>
        </div>
      )}

      {renderBlock()}
    </div>
  );
}