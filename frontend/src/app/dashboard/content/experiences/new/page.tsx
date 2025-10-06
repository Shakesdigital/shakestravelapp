'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shakes-travel-backend.netlify.app/api';

const primaryColor = '#195e48';

interface ExperienceForm {
  title: string;
  location: string;
  region: string;
  category: string;
  duration: string;
  difficulty: string;
  price: number;
  originalPrice?: number;
  description: string;
  overview: string;
  highlights: string[];
  included: string[];
  images: string[];
  itinerary: Array<{
    time?: string;
    title: string;
    description: string;
  }>;
  additionalInfo: {
    cancellationPolicy: string;
    whatToBring: string[];
    meetingPoint: string;
    minAge?: number;
    maxGroupSize: number;
    languages: string[];
    accessibility: string;
  };
  availability: {
    times: string[];
    daysAvailable: string[];
    seasonality?: string;
  };
  ecoFriendly: boolean;
  instantBooking: boolean;
  freeCancel: boolean;
  pickupIncluded: boolean;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
}

const REGIONS = ['Uganda', 'Kenya', 'Tanzania', 'Rwanda', 'East Africa'];
const CATEGORIES = [
  'Wildlife Safari',
  'Cultural Experience',
  'Adventure Sports',
  'Nature & Hiking',
  'City Tours',
  'Food & Dining',
  'Water Activities',
  'Photography Tours',
  'Eco-Tourism',
  'Historical Sites'
];
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Extreme'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Daily'];

function CreateExperienceContent() {
  const { token } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExperienceForm>({
    title: '',
    location: '',
    region: 'Uganda',
    category: 'Wildlife Safari',
    duration: '',
    difficulty: 'Moderate',
    price: 0,
    description: '',
    overview: '',
    highlights: [''],
    included: [''],
    images: [''],
    itinerary: [{ time: '', title: '', description: '' }],
    additionalInfo: {
      cancellationPolicy: '',
      whatToBring: [''],
      meetingPoint: '',
      maxGroupSize: 1,
      languages: ['English'],
      accessibility: ''
    },
    availability: {
      times: [''],
      daysAvailable: [],
      seasonality: ''
    },
    ecoFriendly: false,
    instantBooking: false,
    freeCancel: false,
    pickupIncluded: false,
    contactInfo: {
      phone: '',
      email: ''
    }
  });

  const totalSteps = 6;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev as any)[parent],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].map((item: any, i: number) => i === index ? value : item)
    }));
  };

  const handleArrayAdd = (field: string, defaultValue: any = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev as any)[field], defaultValue]
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleItineraryChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Clean up empty array items
      const cleanedData = {
        ...formData,
        highlights: formData.highlights.filter(h => h.trim()),
        included: formData.included.filter(i => i.trim()),
        images: formData.images.filter(img => img.trim()),
        itinerary: formData.itinerary.filter(item => item.title.trim()),
        additionalInfo: {
          ...formData.additionalInfo,
          whatToBring: formData.additionalInfo.whatToBring.filter(w => w.trim()),
          languages: formData.additionalInfo.languages.filter(l => l.trim())
        },
        availability: {
          ...formData.availability,
          times: formData.availability.times.filter(t => t.trim())
        }
      };

      const response = await axios.post(
        `${API_URL}/user-content/experiences`,
        cleanedData,
        { headers }
      );

      alert(isDraft ? 'Experience saved as draft!' : 'Experience submitted for review!');
      router.push('/dashboard/content');

    } catch (err: any) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create experience');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step <= currentStep
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
              style={step <= currentStep ? { backgroundColor: primaryColor } : {}}
            >
              {step}
            </div>
            {step < 6 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  step < currentStep ? '' : 'bg-gray-200'
                }`}
                style={step < currentStep ? { backgroundColor: primaryColor } : {}}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Step {currentStep} of {totalSteps}
        </h2>
        <p className="text-gray-600">
          {currentStep === 1 && 'Basic Information'}
          {currentStep === 2 && 'Description & Highlights'}
          {currentStep === 3 && 'Itinerary'}
          {currentStep === 4 && 'Additional Information'}
          {currentStep === 5 && 'Availability & Features'}
          {currentStep === 6 && 'Contact & Review'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Experience</h1>
          <p className="text-gray-600">Share your amazing adventure with travelers worldwide</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 mr-3">†</div>
              <div>
                <div className="font-medium text-red-800">Error</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {renderStepIndicator()}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Gorilla Trekking in Bwindi Impenetrable Forest"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Bwindi Impenetrable Forest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {REGIONS.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 1 Day, 3 Days 2 Nights"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 800"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Original Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 950"
                    min="0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description & Highlights */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description * (50-500 characters)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Brief overview of the experience..."
                  maxLength={500}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Overview * (100-2000 characters)
                </label>
                <textarea
                  value={formData.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={6}
                  placeholder="Detailed description of what guests will experience..."
                  maxLength={2000}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">{formData.overview.length}/2000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Highlights *
                </label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Track endangered mountain gorillas"
                    />
                    {formData.highlights.length > 1 && (
                      <button
                        onClick={() => handleArrayRemove('highlights', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('highlights', '')}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Highlight
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Included *
                </label>
                {formData.included.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('included', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Gorilla trekking permit"
                    />
                    {formData.included.length > 1 && (
                      <button
                        onClick={() => handleArrayRemove('included', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('included', '')}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Included Item
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URLs
                </label>
                <p className="text-sm text-gray-500 mb-2">Add URLs of your experience images (uploaded to image hosting service)</p>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => handleArrayChange('images', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        onClick={() => handleArrayRemove('images', index)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('images', '')}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Image URL
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Itinerary */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Day Itinerary *
                </label>
                {formData.itinerary.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Activity {index + 1}</h4>
                      {formData.itinerary.length > 1 && (
                        <button
                          onClick={() => handleArrayRemove('itinerary', index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        value={item.time || ''}
                        onChange={(e) => handleItineraryChange(index, 'time', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Time (e.g., 6:00 AM)"
                      />

                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Activity Title *"
                        required
                      />

                      <textarea
                        value={item.description}
                        onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        rows={3}
                        placeholder="Activity Description *"
                        required
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => handleArrayAdd('itinerary', { time: '', title: '', description: '' })}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Activity
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Policy *
                </label>
                <textarea
                  value={formData.additionalInfo.cancellationPolicy}
                  onChange={(e) => handleNestedChange('additionalInfo', 'cancellationPolicy', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="e.g., Free cancellation up to 48 hours before..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Point *
                </label>
                <input
                  type="text"
                  value={formData.additionalInfo.meetingPoint}
                  onChange={(e) => handleNestedChange('additionalInfo', 'meetingPoint', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Bwindi Park Headquarters, Buhoma Gate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What to Bring *
                </label>
                {formData.additionalInfo.whatToBring.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...formData.additionalInfo.whatToBring];
                        newItems[index] = e.target.value;
                        handleNestedChange('additionalInfo', 'whatToBring', newItems);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., Hiking boots"
                    />
                    {formData.additionalInfo.whatToBring.length > 1 && (
                      <button
                        onClick={() => {
                          const newItems = formData.additionalInfo.whatToBring.filter((_, i) => i !== index);
                          handleNestedChange('additionalInfo', 'whatToBring', newItems);
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleNestedChange('additionalInfo', 'whatToBring', [...formData.additionalInfo.whatToBring, ''])}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Age
                  </label>
                  <input
                    type="number"
                    value={formData.additionalInfo.minAge || ''}
                    onChange={(e) => handleNestedChange('additionalInfo', 'minAge', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 15"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Group Size *
                  </label>
                  <input
                    type="number"
                    value={formData.additionalInfo.maxGroupSize}
                    onChange={(e) => handleNestedChange('additionalInfo', 'maxGroupSize', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., 8"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accessibility Information *
                </label>
                <textarea
                  value={formData.additionalInfo.accessibility}
                  onChange={(e) => handleNestedChange('additionalInfo', 'accessibility', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  rows={2}
                  placeholder="e.g., Moderate fitness level required..."
                  required
                />
              </div>
            </div>
          )}

          {/* Step 5: Availability & Features */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Times
                </label>
                {formData.availability.times.map((time, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => {
                        const newTimes = [...formData.availability.times];
                        newTimes[index] = e.target.value;
                        handleNestedChange('availability', 'times', newTimes);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="e.g., 6:00 AM"
                    />
                    {formData.availability.times.length > 1 && (
                      <button
                        onClick={() => {
                          const newTimes = formData.availability.times.filter((_, i) => i !== index);
                          handleNestedChange('availability', 'times', newTimes);
                        }}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleNestedChange('availability', 'times', [...formData.availability.times, ''])}
                  className="mt-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 w-full"
                >
                  + Add Time
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days Available *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DAYS.map(day => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.availability.daysAvailable.includes(day)}
                        onChange={(e) => {
                          const newDays = e.target.checked
                            ? [...formData.availability.daysAvailable, day]
                            : formData.availability.daysAvailable.filter(d => d !== day);
                          handleNestedChange('availability', 'daysAvailable', newDays);
                        }}
                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seasonality Information
                </label>
                <input
                  type="text"
                  value={formData.availability.seasonality || ''}
                  onChange={(e) => handleNestedChange('availability', 'seasonality', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Year-round, Best June-August"
                />
              </div>

              <div className="border-t pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Features
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ecoFriendly}
                      onChange={(e) => handleInputChange('ecoFriendly', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm">{ Eco-Friendly Experience</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.instantBooking}
                      onChange={(e) => handleInputChange('instantBooking', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm">° Instant Booking Available</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.freeCancel}
                      onChange={(e) => handleInputChange('freeCancel', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm">= Free Cancellation</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pickupIncluded}
                      onChange={(e) => handleInputChange('pickupIncluded', e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm">=ó Pickup Included</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Contact & Review */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="text-blue-600 mr-3 mt-1">9</div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Contact Information</h4>
                    <p className="text-sm text-blue-700">
                      This information will only be shared with confirmed bookings and for admin verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleNestedChange('contactInfo', 'phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="+256..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleNestedChange('contactInfo', 'email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.contactInfo.whatsapp || ''}
                  onChange={(e) => handleNestedChange('contactInfo', 'whatsapp', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+256..."
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Your Experience</h3>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Title:</span>
                    <span className="font-medium">{formData.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{formData.location || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{formData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">${formData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{formData.duration || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Highlights:</span>
                    <span className="font-medium">{formData.highlights.filter(h => h).length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Itinerary:</span>
                    <span className="font-medium">{formData.itinerary.filter(i => i.title).length} activities</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="text-yellow-600 mr-3 mt-1">†</div>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Before Submitting</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>" Your experience will be reviewed by our admin team</li>
                      <li>" You'll be notified once it's approved or if changes are needed</li>
                      <li>" Approved experiences will appear on the website</li>
                      <li>" You can edit draft experiences anytime before submission</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              ê Previous
            </button>

            <div className="flex space-x-3">
              {currentStep === totalSteps ? (
                <>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {loading ? 'Submitting...' : 'Submit for Review'}
                  </button>
                </>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 rounded-lg font-medium text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Next í
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateExperiencePage() {
  return (
    <AuthGuard requireAuth={true}>
      <CreateExperienceContent />
    </AuthGuard>
  );
}
