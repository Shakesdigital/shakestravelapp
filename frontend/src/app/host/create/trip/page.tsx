'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface TripFormData {
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  difficulty: 'easy' | 'moderate' | 'challenging';
  location: {
    name: string;
    coordinates: [number, number];
  };
  includes: string[];
  excludes: string[];
  requirements: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    activities: string[];
  }>;
  guide: {
    name: string;
    experience: string;
    languages: string[];
  };
  availableDates: string[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CreateTripContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<TripFormData>({
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      price: 0,
      duration: 1,
      maxGroupSize: 8,
      difficulty: 'moderate',
      location: {
        name: '',
        coordinates: [0, 0]
      },
      includes: [''],
      excludes: [''],
      requirements: [''],
      itinerary: [{ day: 1, title: '', description: '', activities: [''] }],
      guide: {
        name: user?.name || '',
        experience: '',
        languages: ['English']
      },
      availableDates: []
    }
  });

  const { fields: includesFields, append: appendInclude, remove: removeInclude } = useFieldArray({
    control,
    name: 'includes'
  });

  const { fields: excludesFields, append: appendExclude, remove: removeExclude } = useFieldArray({
    control,
    name: 'excludes'
  });

  const { fields: requirementsFields, append: appendRequirement, remove: removeRequirement } = useFieldArray({
    control,
    name: 'requirements'
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: 'itinerary'
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotos([...photos, ...files]);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setPhotoPreview([...photoPreview, ...previews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    URL.revokeObjectURL(photoPreview[index]);
    setPhotoPreview(photoPreview.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TripFormData) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add trip data
      formData.append('tripData', JSON.stringify(data));
      
      // Add photos
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await axios.post(`${API_URL}/trips`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Trip created:', response.data);
      router.push('/host/dashboard');
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Adventure</h1>
            <p className="text-gray-600">Share your amazing Uganda adventure with travelers</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adventure Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  type="text"
                  placeholder="e.g., Gorilla Trekking in Bwindi Forest"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={3}
                  placeholder="Brief description that appears in search results"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  {...register('longDescription', { required: 'Detailed description is required' })}
                  rows={8}
                  placeholder="Detailed description of your adventure..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                {errors.longDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.longDescription.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Person (USD) *
                  </label>
                  <input
                    {...register('price', { required: 'Price is required', min: 1 })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days) *
                  </label>
                  <input
                    {...register('duration', { required: 'Duration is required', min: 1 })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Group Size *
                  </label>
                  <input
                    {...register('maxGroupSize', { required: 'Group size is required', min: 1 })}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.maxGroupSize && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxGroupSize.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  {...register('difficulty', { required: 'Difficulty is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="easy">Easy - Suitable for beginners</option>
                  <option value="moderate">Moderate - Some experience required</option>
                  <option value="challenging">Challenging - For experienced adventurers</option>
                </select>
                {errors.difficulty && (
                  <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  {...register('location.name', { required: 'Location is required' })}
                  type="text"
                  placeholder="e.g., Bwindi Impenetrable National Park"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                {errors.location?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.name.message}</p>
                )}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
                <p className="mt-1 text-sm text-gray-500">Upload high-quality photos of your adventure</p>
              </div>

              {photoPreview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {photoPreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">What&apos;s Included</h2>
              
              {includesFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <input
                    {...register(`includes.${index}` as const)}
                    type="text"
                    placeholder="e.g., Professional guide"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => appendInclude('')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Item
              </button>
            </div>

            {/* What's Not Included */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">What&apos;s Not Included</h2>
              
              {excludesFields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <input
                    {...register(`excludes.${index}` as const)}
                    type="text"
                    placeholder="e.g., International flights"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeExclude(index)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => appendExclude('')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Item
              </button>
            </div>

            {/* Itinerary */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Day-by-Day Itinerary</h2>
              
              {itineraryFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Day {index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeItinerary(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Day
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <input
                      {...register(`itinerary.${index}.title` as const)}
                      type="text"
                      placeholder="Day title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                    
                    <textarea
                      {...register(`itinerary.${index}.description` as const)}
                      rows={3}
                      placeholder="Day description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => appendItinerary({ day: itineraryFields.length + 1, title: '', description: '', activities: [''] })}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Day
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'Create Adventure'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateTripPage() {
  return (
    <AuthGuard requireAuth={true} requireRole="host">
      <CreateTripContent />
    </AuthGuard>
  );
}