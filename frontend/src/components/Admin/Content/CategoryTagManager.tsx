'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  icon: string;
  color: string;
  articleCount: number;
  isActive: boolean;
  seoData?: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  articleCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryTagManagerProps {
  onCategoryChange?: (categories: Category[]) => void;
  onTagChange?: (tags: Tag[]) => void;
}

export default function CategoryTagManager({
  onCategoryChange,
  onTagChange
}: CategoryTagManagerProps) {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count' | 'date'>('name');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    parentId: '',
    icon: '📄',
    color: '#10B981',
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  const [tagForm, setTagForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    isActive: true
  });

  // Initialize with mock data
  useEffect(() => {
    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Adventure Travel',
        slug: 'adventure-travel',
        description: 'Thrilling adventures and extreme sports',
        icon: '🏔️',
        color: '#DC2626',
        articleCount: 24,
        isActive: true,
        seoData: {
          title: 'Adventure Travel Guides - Uganda Expeditions',
          description: 'Discover thrilling adventure travel experiences in Uganda',
          keywords: ['adventure travel', 'uganda expeditions', 'outdoor activities']
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Wildlife Safari',
        slug: 'wildlife-safari',
        description: 'African wildlife and safari experiences',
        icon: '🦁',
        color: '#F59E0B',
        articleCount: 18,
        isActive: true,
        seoData: {
          title: 'Wildlife Safari Tours - Uganda Safari Guide',
          description: 'Experience amazing wildlife safaris in Uganda\'s national parks',
          keywords: ['wildlife safari', 'uganda safari', 'african wildlife']
        },
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Cultural Tours',
        slug: 'cultural-tours',
        description: 'Local culture and traditional experiences',
        icon: '🎭',
        color: '#8B5CF6',
        articleCount: 12,
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Gorilla Trekking',
        slug: 'gorilla-trekking',
        description: 'Mountain gorilla trekking experiences',
        parentId: '1',
        icon: '🦍',
        color: '#065F46',
        articleCount: 8,
        isActive: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        name: 'Water Sports',
        slug: 'water-sports',
        description: 'Water-based activities and sports',
        parentId: '1',
        icon: '🚣',
        color: '#0284C7',
        articleCount: 6,
        isActive: false,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockTags: Tag[] = [
      {
        id: '1',
        name: 'Budget Travel',
        slug: 'budget-travel',
        description: 'Affordable travel options and tips',
        color: '#10B981',
        articleCount: 15,
        isActive: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        name: 'Solo Travel',
        slug: 'solo-travel',
        description: 'Tips and guides for solo travelers',
        color: '#F59E0B',
        articleCount: 12,
        isActive: true,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        name: 'Photography',
        slug: 'photography',
        description: 'Travel photography tips and locations',
        color: '#8B5CF6',
        articleCount: 9,
        isActive: true,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        name: 'Luxury Travel',
        slug: 'luxury-travel',
        color: '#DC2626',
        articleCount: 7,
        isActive: false,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    setCategories(mockCategories);
    setTags(mockTags);
  }, []);

  // Filter and sort functions
  const filteredCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          category.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterActive === 'all' || 
                          (filterActive === 'active' && category.isActive) ||
                          (filterActive === 'inactive' && !category.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'count': return b.articleCount - a.articleCount;
        case 'date': return b.updatedAt.getTime() - a.updatedAt.getTime();
        default: return 0;
      }
    });

  const filteredTags = tags
    .filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tag.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterActive === 'all' || 
                          (filterActive === 'active' && tag.isActive) ||
                          (filterActive === 'inactive' && !tag.isActive);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'count': return b.articleCount - a.articleCount;
        case 'date': return b.updatedAt.getTime() - a.updatedAt.getTime();
        default: return 0;
      }
    });

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSaveCategory = () => {
    const newCategory: Category = {
      id: editingCategory?.id || Math.random().toString(36).substr(2, 9),
      name: categoryForm.name,
      slug: generateSlug(categoryForm.name),
      description: categoryForm.description,
      parentId: categoryForm.parentId || undefined,
      icon: categoryForm.icon,
      color: categoryForm.color,
      isActive: categoryForm.isActive,
      articleCount: editingCategory?.articleCount || 0,
      seoData: {
        title: categoryForm.seoTitle || categoryForm.name,
        description: categoryForm.seoDescription || categoryForm.description,
        keywords: categoryForm.seoKeywords.split(',').map(k => k.trim()).filter(k => k)
      },
      createdAt: editingCategory?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingCategory) {
      setCategories(prev => prev.map(cat => cat.id === editingCategory.id ? newCategory : cat));
    } else {
      setCategories(prev => [...prev, newCategory]);
    }

    resetCategoryForm();
    onCategoryChange?.(categories);
  };

  const handleSaveTag = () => {
    const newTag: Tag = {
      id: editingTag?.id || Math.random().toString(36).substr(2, 9),
      name: tagForm.name,
      slug: generateSlug(tagForm.name),
      description: tagForm.description,
      color: tagForm.color,
      isActive: tagForm.isActive,
      articleCount: editingTag?.articleCount || 0,
      createdAt: editingTag?.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (editingTag) {
      setTags(prev => prev.map(tag => tag.id === editingTag.id ? newTag : tag));
    } else {
      setTags(prev => [...prev, newTag]);
    }

    resetTagForm();
    onTagChange?.(tags);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      parentId: '',
      icon: '📄',
      color: '#10B981',
      isActive: true,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const resetTagForm = () => {
    setTagForm({
      name: '',
      description: '',
      color: '#3B82F6',
      isActive: true
    });
    setEditingTag(null);
    setShowTagForm(false);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryForm({
      name: category.name,
      description: category.description,
      parentId: category.parentId || '',
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      seoTitle: category.seoData?.title || '',
      seoDescription: category.seoData?.description || '',
      seoKeywords: category.seoData?.keywords.join(', ') || ''
    });
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleEditTag = (tag: Tag) => {
    setTagForm({
      name: tag.name,
      description: tag.description || '',
      color: tag.color,
      isActive: tag.isActive
    });
    setEditingTag(tag);
    setShowTagForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      onCategoryChange?.(categories);
    }
  };

  const handleDeleteTag = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tag? This action cannot be undone.')) {
      setTags(prev => prev.filter(tag => tag.id !== id));
      onTagChange?.(tags);
    }
  };

  const toggleCategoryStatus = (id: string) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, isActive: !cat.isActive, updatedAt: new Date() } : cat
    ));
    onCategoryChange?.(categories);
  };

  const toggleTagStatus = (id: string) => {
    setTags(prev => prev.map(tag => 
      tag.id === id ? { ...tag, isActive: !tag.isActive, updatedAt: new Date() } : tag
    ));
    onTagChange?.(tags);
  };

  const iconOptions = ['📄', '🏔️', '🦁', '🎭', '🦍', '🚣', '🏖️', '🎯', '🌍', '✈️', '🗺️', '📸'];
  const colorOptions = ['#10B981', '#F59E0B', '#DC2626', '#8B5CF6', '#3B82F6', '#065F46', '#0284C7', '#7C2D12'];

  const tabs = [
    { id: 'categories', label: 'Categories', icon: '📁', count: categories.length },
    { id: 'tags', label: 'Tags', icon: '🏷️', count: tags.length }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              🏷️ Category & Tag Management
            </h2>
            <HelpTooltip content="Organize your content with categories and tags. Categories create hierarchical organization while tags provide flexible labeling." />
          </div>

          <div className="flex items-center space-x-3">
            <AnimatedButton
              onClick={() => activeTab === 'categories' ? setShowCategoryForm(true) : setShowTagForm(true)}
              variant="primary"
            >
              ➕ Add {activeTab === 'categories' ? 'Category' : 'Tag'}
            </AnimatedButton>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span className="ml-2 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="name">Name</option>
                <option value="count">Article Count</option>
                <option value="date">Last Updated</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter:</label>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'categories' ? (
          <div className="space-y-3">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => {
                const hasChildren = categories.some(c => c.parentId === category.id);
                
                return (
                  <div
                    key={category.id}
                    className={`border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow ${
                      !category.isActive ? 'opacity-60' : ''
                    }`}
                    style={{ marginLeft: category.parentId ? '2rem' : '0' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.icon}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            {category.parentId && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                → Child Category
                              </span>
                            )}
                            {hasChildren && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">
                                Has subcategories
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              category.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {category.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>📄 {category.articleCount} articles</span>
                            <span>🔗 /{category.slug}</span>
                            <span>📅 {category.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleCategoryStatus(category.id)}
                          className={`p-2 rounded-md transition-colors ${
                            category.isActive
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                          }`}
                          title={category.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {category.isActive ? '⏸️' : '▶️'}
                        </button>

                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="Edit category"
                        >
                          ✏️
                        </button>

                        {!hasChildren && category.articleCount === 0 && (
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition-colors"
                            title="Delete category"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? 'No categories match your search criteria.' : 'Create your first category to organize your content.'}
                </p>
                {!searchQuery && (
                  <AnimatedButton onClick={() => setShowCategoryForm(true)} variant="primary">
                    ➕ Create First Category
                  </AnimatedButton>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTags.map((tag) => (
                  <div
                    key={tag.id}
                    className={`border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow ${
                      !tag.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: tag.color }}
                      >
                        #{tag.name}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTagStatus(tag.id)}
                          className={`p-1 rounded text-xs transition-colors ${
                            tag.isActive
                              ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                              : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                          }`}
                          title={tag.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {tag.isActive ? '⏸️' : '▶️'}
                        </button>

                        <button
                          onClick={() => handleEditTag(tag)}
                          className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded text-xs transition-colors"
                          title="Edit tag"
                        >
                          ✏️
                        </button>

                        {tag.articleCount === 0 && (
                          <button
                            onClick={() => handleDeleteTag(tag.id)}
                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-xs transition-colors"
                            title="Delete tag"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>

                    {tag.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {tag.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>📄 {tag.articleCount} articles</span>
                        <span className={`px-2 py-1 rounded-full ${
                          tag.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {tag.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      🔗 /{tag.slug} • 📅 {tag.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏷️</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Tags Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery ? 'No tags match your search criteria.' : 'Create your first tag to start labeling your content.'}
                </p>
                {!searchQuery && (
                  <AnimatedButton onClick={() => setShowTagForm(true)} variant="primary">
                    ➕ Create First Tag
                  </AnimatedButton>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Adventure Travel"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Parent Category
                    </label>
                    <select
                      value={categoryForm.parentId}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">None (Top Level)</option>
                      {categories
                        .filter(cat => cat.id !== editingCategory?.id && !cat.parentId)
                        .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Describe this category..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Icon
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, icon })}
                          className={`p-2 text-xl border rounded-md transition-colors ${
                            categoryForm.icon === icon
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, color })}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            categoryForm.color === color
                              ? 'border-gray-800 dark:border-white scale-110'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">SEO Settings</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={categoryForm.seoTitle}
                        onChange={(e) => setCategoryForm({ ...categoryForm, seoTitle: e.target.value })}
                        placeholder="SEO optimized title"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SEO Description
                      </label>
                      <textarea
                        value={categoryForm.seoDescription}
                        onChange={(e) => setCategoryForm({ ...categoryForm, seoDescription: e.target.value })}
                        placeholder="SEO meta description"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SEO Keywords
                      </label>
                      <input
                        type="text"
                        value={categoryForm.seoKeywords}
                        onChange={(e) => setCategoryForm({ ...categoryForm, seoKeywords: e.target.value })}
                        placeholder="keyword1, keyword2, keyword3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="categoryActive"
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="categoryActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <AnimatedButton type="submit" variant="primary">
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </AnimatedButton>
                  <AnimatedButton type="button" onClick={resetCategoryForm} variant="secondary">
                    Cancel
                  </AnimatedButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tag Form Modal */}
      {showTagForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h3>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveTag(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tag Name *
                  </label>
                  <input
                    type="text"
                    value={tagForm.name}
                    onChange={(e) => setTagForm({ ...tagForm, name: e.target.value })}
                    placeholder="Budget Travel"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={tagForm.description}
                    onChange={(e) => setTagForm({ ...tagForm, description: e.target.value })}
                    placeholder="Describe this tag..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setTagForm({ ...tagForm, color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          tagForm.color === color
                            ? 'border-gray-800 dark:border-white scale-110'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tagActive"
                    checked={tagForm.isActive}
                    onChange={(e) => setTagForm({ ...tagForm, isActive: e.target.checked })}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <label htmlFor="tagActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <AnimatedButton type="submit" variant="primary">
                    {editingTag ? 'Update Tag' : 'Create Tag'}
                  </AnimatedButton>
                  <AnimatedButton type="button" onClick={resetTagForm} variant="secondary">
                    Cancel
                  </AnimatedButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
