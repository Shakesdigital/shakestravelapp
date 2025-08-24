'use client';

import React, { useState, useEffect } from 'react';
import { AnimatedButton } from '../UI/FeedbackComponents';
import { HelpTooltip } from '../UI/Tooltip';

interface Experience {
  id: string;
  title: string;
  description: string;
  type: 'experience';
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published' | 'archived';
  featured: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  owner: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  location: {
    address: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  images: {
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  videos: {
    id: string;
    url: string;
    title: string;
    thumbnail: string;
    duration: number;
  }[];
  pricing: {
    basePrice: number;
    currency: string;
    priceType: 'per_person' | 'per_group';
    seasonalPricing?: {
      season: string;
      startDate: Date;
      endDate: Date;
      price: number;
    }[];
    groupDiscounts?: {
      minSize: number;
      discountPercentage: number;
    }[];
  };
  availability: {
    schedule: 'daily' | 'weekly' | 'monthly' | 'custom';
    startTime: string;
    endTime: string;
    daysOfWeek: number[];
    blackoutDates: Date[];
    maxBookingsPerDay: number;
    advanceBooking: {
      min: number;
      max: number;
    };
  };
  duration: {
    value: number;
    unit: 'hours' | 'days' | 'weeks';
  };
  groupSize: {
    min: number;
    max: number;
  };
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  includes: string[];
  excludes: string[];
  meetingPoint: string;
  cancellationPolicy: string;
  languages: string[];
  ageRestriction: {
    min?: number;
    max?: number;
  };
  equipment: string[];
  seasonality: {
    bestMonths: number[];
    available: boolean[];
  };
  categories: string[];
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  verificationScore: number;
  bookingCount: number;
  revenue: number;
}

interface ExperienceTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  fields: {
    includes: string[];
    excludes: string[];
    equipment: string[];
    difficulty: Experience['difficulty'];
    duration: Experience['duration'];
    groupSize: Experience['groupSize'];
  };
}

interface ExperienceManagerProps {
  experiences: Experience[];
  userRole: 'admin' | 'manager' | 'owner';
  onUpdate: (experiences: Experience[]) => void;
}

export default function ExperienceManager({ experiences, userRole, onUpdate }: ExperienceManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Experience>>({});

  const templates: ExperienceTemplate[] = [
    {
      id: 'gorilla-trekking',
      name: 'Gorilla Trekking',
      description: 'Mountain gorilla tracking experience',
      category: 'Wildlife',
      icon: '🦍',
      fields: {
        includes: ['Park permits', 'Professional guide', 'Porter service', 'Lunch'],
        excludes: ['Accommodation', 'Transportation', 'Personal expenses'],
        equipment: ['Hiking boots', 'Rain jacket', 'Walking stick', 'Camera'],
        difficulty: 'challenging',
        duration: { value: 1, unit: 'days' },
        groupSize: { min: 2, max: 8 }
      }
    },
    {
      id: 'safari-drive',
      name: 'Safari Game Drive',
      description: 'Wildlife viewing safari experience',
      category: 'Wildlife',
      icon: '🦁',
      fields: {
        includes: ['Safari vehicle', 'Professional guide', 'Park fees', 'Lunch'],
        excludes: ['Accommodation', 'Drinks', 'Gratuities'],
        equipment: ['Binoculars', 'Camera', 'Sun hat', 'Sunscreen'],
        difficulty: 'easy',
        duration: { value: 8, unit: 'hours' },
        groupSize: { min: 4, max: 12 }
      }
    },
    {
      id: 'white-water-rafting',
      name: 'White Water Rafting',
      description: 'Thrilling river rafting adventure',
      category: 'Adventure',
      icon: '🚣',
      fields: {
        includes: ['Safety equipment', 'Professional guide', 'Lunch', 'Transportation'],
        excludes: ['Personal insurance', 'Gratuities', 'Photos'],
        equipment: ['Helmet', 'Life jacket', 'Paddle', 'Waterproof bag'],
        difficulty: 'moderate',
        duration: { value: 6, unit: 'hours' },
        groupSize: { min: 4, max: 16 }
      }
    },
    {
      id: 'cultural-tour',
      name: 'Cultural Village Tour',
      description: 'Traditional culture and community experience',
      category: 'Culture',
      icon: '🎭',
      fields: {
        includes: ['Local guide', 'Cultural activities', 'Traditional meal', 'Transportation'],
        excludes: ['Personal expenses', 'Souvenirs', 'Drinks'],
        equipment: ['Comfortable shoes', 'Camera', 'Sun hat'],
        difficulty: 'easy',
        duration: { value: 4, unit: 'hours' },
        groupSize: { min: 2, max: 20 }
      }
    },
    {
      id: 'mountain-hiking',
      name: 'Mountain Hiking',
      description: 'Guided mountain hiking adventure',
      category: 'Adventure',
      icon: '🏔️',
      fields: {
        includes: ['Professional guide', 'Hiking permits', 'Lunch', 'First aid kit'],
        excludes: ['Personal gear', 'Accommodation', 'Transportation'],
        equipment: ['Hiking boots', 'Backpack', 'Walking poles', 'Rain gear'],
        difficulty: 'moderate',
        duration: { value: 2, unit: 'days' },
        groupSize: { min: 2, max: 10 }
      }
    }
  ];

  const initializeForm = (template?: ExperienceTemplate) => {
    const baseForm = {
      title: '',
      description: '',
      type: 'experience' as const,
      status: 'draft' as const,
      featured: false,
      visibility: 'public' as const,
      location: {
        address: '',
        city: '',
        country: 'Uganda',
        coordinates: { lat: 0, lng: 0 }
      },
      images: [],
      videos: [],
      pricing: {
        basePrice: 0,
        currency: 'USD',
        priceType: 'per_person' as const
      },
      availability: {
        schedule: 'daily' as const,
        startTime: '08:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        blackoutDates: [],
        maxBookingsPerDay: 10,
        advanceBooking: { min: 1, max: 30 }
      },
      categories: [],
      tags: [],
      languages: ['English'],
      ageRestriction: {},
      meetingPoint: '',
      cancellationPolicy: '48 hours notice required for full refund'
    };

    if (template) {
      return {
        ...baseForm,
        includes: template.fields.includes,
        excludes: template.fields.excludes,
        equipment: template.fields.equipment,
        difficulty: template.fields.difficulty,
        duration: template.fields.duration,
        groupSize: template.fields.groupSize,
        categories: [template.category.toLowerCase()]
      };
    }

    return baseForm;
  };

  const handleCreateExperience = () => {
    setEditingExperience(null);
    setSelectedTemplate('');
    setFormData(initializeForm());
    setActiveStep(1);
    setShowCreateModal(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setFormData(experience);
    setActiveStep(1);
    setShowCreateModal(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData(initializeForm(template));
    }
  };

  const handleSaveExperience = () => {
    if (!formData.title || !formData.description) return;

    const experienceData: Experience = {
      id: editingExperience?.id || Math.random().toString(36).substr(2, 9),
      owner: editingExperience?.owner || {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com'
      },
      rating: editingExperience?.rating || { average: 0, count: 0 },
      createdAt: editingExperience?.createdAt || new Date(),
      updatedAt: new Date(),
      verificationScore: editingExperience?.verificationScore || 50,
      bookingCount: editingExperience?.bookingCount || 0,
      revenue: editingExperience?.revenue || 0,
      ...formData
    } as Experience;

    const updatedExperiences = editingExperience
      ? experiences.map(exp => exp.id === editingExperience.id ? experienceData : exp)
      : [...experiences, experienceData];

    onUpdate(updatedExperiences);
    setShowCreateModal(false);
    setFormData({});
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: '📝' },
    { id: 2, title: 'Details', icon: '📋' },
    { id: 3, title: 'Media', icon: '📸' },
    { id: 4, title: 'Pricing', icon: '💰' },
    { id: 5, title: 'Availability', icon: '📅' },
    { id: 6, title: 'Review', icon: '✅' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', icon: '🟢', description: 'Suitable for all fitness levels' },
    { value: 'moderate', label: 'Moderate', icon: '🟡', description: 'Some physical activity required' },
    { value: 'challenging', label: 'Challenging', icon: '🟠', description: 'Good fitness level needed' },
    { value: 'extreme', label: 'Extreme', icon: '🔴', description: 'Excellent fitness required' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            🏔️ Experience Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage travel experiences with professional templates
          </p>
        </div>
        <AnimatedButton onClick={handleCreateExperience} variant="primary">
          ➕ Create Experience
        </AnimatedButton>
      </div>

      {/* Experience Templates Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          📋 Quick Start Templates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                handleTemplateSelect(template.id);
                setShowCreateModal(true);
              }}
              className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md cursor-pointer transition-all duration-200 hover:border-green-500"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {template.description}
                </p>
                <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                  {template.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Experience List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Active Experiences ({experiences.length})
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Pricing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {experiences.map((experience) => (
                <tr key={experience.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        {experience.images[0] ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={experience.images[0].url}
                            alt={experience.title}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-500 text-xl">🏔️</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {experience.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          📍 {experience.location.city}, {experience.location.country}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="mr-2">⏱️</span>
                        {experience.duration.value} {experience.duration.unit}
                      </div>
                      <div className="flex items-center mb-1">
                        <span className="mr-2">👥</span>
                        {experience.groupSize.min}-{experience.groupSize.max} people
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">
                          {difficultyOptions.find(d => d.value === experience.difficulty)?.icon}
                        </span>
                        {experience.difficulty}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      ${experience.pricing.basePrice}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">
                      {experience.pricing.priceType.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center mb-1">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span>{experience.rating.average}</span>
                      <span className="text-gray-400 ml-1">({experience.rating.count})</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      📅 {experience.bookingCount} bookings
                    </div>
                    <div className="text-xs font-medium text-green-600">
                      💰 ${experience.revenue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      experience.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : experience.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {experience.status}
                    </span>
                    {experience.featured && (
                      <span className="block mt-1 text-xs text-yellow-600">⭐ Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditExperience(experience)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        ✏️ Edit
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        📊 Analytics
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏔️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Experiences Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first travel experience using our professional templates.
            </p>
            <AnimatedButton onClick={handleCreateExperience} variant="primary">
              ➕ Create Your First Experience
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* Create/Edit Experience Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingExperience ? 'Edit Experience' : 'Create New Experience'}
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Step Progress */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center ${
                      step.id === activeStep
                        ? 'text-green-600'
                        : step.id < activeStep
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      step.id === activeStep
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                        : step.id < activeStep
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {step.id < activeStep ? '✓' : step.id}
                    </div>
                    <div className="ml-2 text-sm font-medium">
                      {step.icon} {step.title}
                    </div>
                    {step.id < steps.length && (
                      <div className={`ml-4 w-16 h-px ${
                        step.id < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="px-6 py-6">
              {activeStep === 1 && (
                <div className="space-y-6">
                  {!editingExperience && selectedTemplate && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">
                          {templates.find(t => t.id === selectedTemplate)?.icon}
                        </span>
                        <div>
                          <h4 className="font-medium text-green-800 dark:text-green-200">
                            Using Template: {templates.find(t => t.id === selectedTemplate)?.name}
                          </h4>
                          <p className="text-sm text-green-700 dark:text-green-300">
                            Pre-filled with common settings for this experience type
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Amazing Gorilla Trekking Adventure"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.categories?.[0] || ''}
                        onChange={(e) => setFormData({ ...formData, categories: [e.target.value] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Select category</option>
                        <option value="wildlife">Wildlife</option>
                        <option value="adventure">Adventure</option>
                        <option value="culture">Culture</option>
                        <option value="nature">Nature</option>
                        <option value="water-sports">Water Sports</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe your experience in detail..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.location?.city || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location!, city: e.target.value }
                        })}
                        placeholder="Kampala"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country *
                      </label>
                      <select
                        value={formData.location?.country || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location!, country: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Uganda">Uganda</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Tanzania">Tanzania</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Meeting Point *
                      </label>
                      <input
                        type="text"
                        value={formData.meetingPoint || ''}
                        onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                        placeholder="Park Headquarters"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={formData.duration?.value || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            duration: { ...formData.duration!, value: parseInt(e.target.value) }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <select
                          value={formData.duration?.unit || 'hours'}
                          onChange={(e) => setFormData({
                            ...formData,
                            duration: { ...formData.duration!, unit: e.target.value as any }
                          })}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        >
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Group Size
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={formData.groupSize?.min || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            groupSize: { ...formData.groupSize!, min: parseInt(e.target.value) }
                          })}
                          placeholder="Min"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="number"
                          value={formData.groupSize?.max || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            groupSize: { ...formData.groupSize!, max: parseInt(e.target.value) }
                          })}
                          placeholder="Max"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty Level
                      </label>
                      <select
                        value={formData.difficulty || ''}
                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        {difficultyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.icon} {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What's Included
                      </label>
                      <div className="space-y-2">
                        {(formData.includes || []).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newIncludes = [...(formData.includes || [])];
                                newIncludes[index] = e.target.value;
                                setFormData({ ...formData, includes: newIncludes });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newIncludes = (formData.includes || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, includes: newIncludes });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            includes: [...(formData.includes || []), '']
                          })}
                          variant="secondary"
                          size="sm"
                        >
                          ➕ Add Item
                        </AnimatedButton>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        What's Excluded
                      </label>
                      <div className="space-y-2">
                        {(formData.excludes || []).map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => {
                                const newExcludes = [...(formData.excludes || [])];
                                newExcludes[index] = e.target.value;
                                setFormData({ ...formData, excludes: newExcludes });
                              }}
                              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newExcludes = (formData.excludes || []).filter((_, i) => i !== index);
                                setFormData({ ...formData, excludes: newExcludes });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        <AnimatedButton
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            excludes: [...(formData.excludes || []), '']
                          })}
                          variant="secondary"
                          size="sm"
                        >
                          ➕ Add Item
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      📸 Media Gallery
                    </h4>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                      <div className="text-4xl mb-4">📷</div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Upload high-quality images and videos to showcase your experience
                      </p>
                      <AnimatedButton variant="secondary">
                        📁 Choose Files
                      </AnimatedButton>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                      🎥 Virtual Tour (Optional)
                    </h4>
                    <input
                      type="url"
                      placeholder="https://example.com/virtual-tour"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Add a 360° virtual tour or video walkthrough
                    </p>
                  </div>
                </div>
              )}

              {activeStep === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Base Price *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={formData.pricing?.basePrice || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            pricing: { ...formData.pricing!, basePrice: parseFloat(e.target.value) }
                          })}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.pricing?.currency || 'USD'}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing!, currency: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="UGX">UGX - Ugandan Shilling</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Price Type
                      </label>
                      <select
                        value={formData.pricing?.priceType || 'per_person'}
                        onChange={(e) => setFormData({
                          ...formData,
                          pricing: { ...formData.pricing!, priceType: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="per_person">Per Person</option>
                        <option value="per_group">Per Group</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cancellation Policy
                    </label>
                    <textarea
                      value={formData.cancellationPolicy || ''}
                      onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                      placeholder="Describe your cancellation policy..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {activeStep === 5 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Schedule Type
                      </label>
                      <select
                        value={formData.availability?.schedule || 'daily'}
                        onChange={(e) => setFormData({
                          ...formData,
                          availability: { ...formData.availability!, schedule: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Bookings Per Day
                      </label>
                      <input
                        type="number"
                        value={formData.availability?.maxBookingsPerDay || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          availability: { ...formData.availability!, maxBookingsPerDay: parseInt(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.availability?.startTime || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          availability: { ...formData.availability!, startTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.availability?.endTime || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          availability: { ...formData.availability!, endTime: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeStep === 6 && (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-4">
                      ✅ Experience Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Title:</strong> {formData.title}
                      </div>
                      <div>
                        <strong>Location:</strong> {formData.location?.city}, {formData.location?.country}
                      </div>
                      <div>
                        <strong>Duration:</strong> {formData.duration?.value} {formData.duration?.unit}
                      </div>
                      <div>
                        <strong>Group Size:</strong> {formData.groupSize?.min}-{formData.groupSize?.max} people
                      </div>
                      <div>
                        <strong>Price:</strong> ${formData.pricing?.basePrice} {formData.pricing?.priceType?.replace('_', ' ')}
                      </div>
                      <div>
                        <strong>Difficulty:</strong> {formData.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured || false}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700 dark:text-gray-300">
                      ⭐ Mark as Featured Experience
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Publication Status
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="draft">Save as Draft</option>
                      <option value="pending">Submit for Review</option>
                      {userRole === 'admin' && <option value="published">Publish Immediately</option>}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                {activeStep > 1 && (
                  <AnimatedButton
                    onClick={() => setActiveStep(activeStep - 1)}
                    variant="secondary"
                  >
                    ← Previous
                  </AnimatedButton>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <AnimatedButton
                  onClick={() => setShowCreateModal(false)}
                  variant="secondary"
                >
                  Cancel
                </AnimatedButton>
                
                {activeStep < 6 ? (
                  <AnimatedButton
                    onClick={() => setActiveStep(activeStep + 1)}
                    variant="primary"
                  >
                    Next →
                  </AnimatedButton>
                ) : (
                  <AnimatedButton
                    onClick={handleSaveExperience}
                    variant="primary"
                  >
                    💾 Save Experience
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}