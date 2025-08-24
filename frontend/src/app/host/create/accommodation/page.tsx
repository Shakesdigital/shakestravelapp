'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface AccommodationFormData {
  title: string;
  description: string;
  longDescription: string;
  price: number;
  type: 'hotel' | 'lodge' | 'guesthouse' | 'camping' | 'hostel';
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
  amenities: string[];
  rooms: Array<{
    type: string;
    capacity: number;
    price: number;
    amenities: string[];
  }>;
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    children: string;
    pets: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CreateAccommodationContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<AccommodationFormData>({
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      price: 0,
      type: 'guesthouse',
      location: {
        name: '',
        address: '',
        coordinates: [0, 0]
      },
      amenities: ['WiFi'],
      rooms: [{ type: 'Standard Room', capacity: 2, price: 0, amenities: ['Private Bathroom'] }],
      policies: {
        checkIn: '14:00',
        checkOut: '11:00',
        cancellation: 'Free cancellation up to 24 hours before check-in',
        children: 'Children are welcome',
        pets: 'Pets not allowed'
      },
      contact: {
        phone: '',
        email: user?.email || '',
        website: ''
      }
    }
  });

  const { fields: amenitiesFields, append: appendAmenity, remove: removeAmenity } = useFieldArray({
    control,
    name: 'amenities'
  });

  const { fields: roomsFields, append: appendRoom, remove: removeRoom } = useFieldArray({
    control,
    name: 'rooms'
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

  const onSubmit = async (data: AccommodationFormData) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add accommodation data
      formData.append('accommodationData', JSON.stringify(data));
      
      // Add photos
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      const response = await axios.post(`${API_URL}/accommodations`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Accommodation created:', response.data);
      router.push('/host/dashboard');
    } catch (error) {
      console.error('Failed to create accommodation:', error);
      alert('Failed to create accommodation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const accommodationTypes = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'lodge', label: 'Lodge' },
    { value: 'guesthouse', label: 'Guesthouse' },
    { value: 'camping', label: 'Camping/Glamping' },
    { value: 'hostel', label: 'Hostel' }
  ];

  const commonAmenities = [
    'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 'Pet Friendly',
    'Air Conditioning', 'Room Service', 'Bar', 'Business Center', 'Laundry',
    'Garden', 'Terrace', 'Kitchen', 'Balcony', 'Hot Tub', 'Fireplace'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Accommodation</h1>
            <p className="text-gray-600">List your property for travelers to discover</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name *
                </label>
                <input
                  {...register('title', { required: 'Property name is required' })}
                  type="text"
                  placeholder="e.g., Bwindi Forest Lodge"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  {...register('type', { required: 'Property type is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {accommodationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  placeholder="Detailed description of your property..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.longDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.longDescription.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Starting Price per Night (USD) *
                </label>
                <input
                  {...register('price', { required: 'Price is required', min: 1 })}
                  type="number"
                  min="1"
                  placeholder="Base price for your most affordable room"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name *
                </label>
                <input
                  {...register('location.name', { required: 'Location name is required' })}
                  type="text"
                  placeholder="e.g., Bwindi Impenetrable National Park"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.location?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  {...register('location.address', { required: 'Address is required' })}
                  rows={3}
                  placeholder="Complete address of your property"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.location?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">Upload high-quality photos of your property</p>
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

            {/* Amenities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Property Amenities</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonAmenities.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      value={amenity}
                      {...register('amenities')}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rooms */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Room Types</h2>
              
              {roomsFields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Room {index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeRoom(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove Room
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      {...register(`rooms.${index}.type` as const)}
                      type="text"
                      placeholder="Room type (e.g., Standard Room)"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <input
                      {...register(`rooms.${index}.capacity` as const)}
                      type="number"
                      min="1"
                      placeholder="Capacity"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    
                    <input
                      {...register(`rooms.${index}.price` as const)}
                      type="number"
                      min="0"
                      placeholder="Price per night"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => appendRoom({ type: '', capacity: 2, price: 0, amenities: [] })}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Room Type
              </button>
            </div>

            {/* Policies */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Policies</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    {...register('policies.checkIn')}
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    {...register('policies.checkOut')}
                    type="time"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Policy
                  </label>
                  <textarea
                    {...register('policies.cancellation')}
                    rows={2}
                    placeholder="Describe your cancellation policy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children Policy
                  </label>
                  <input
                    {...register('policies.children')}
                    type="text"
                    placeholder="e.g., Children are welcome"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pet Policy
                  </label>
                  <input
                    {...register('policies.pets')}
                    type="text"
                    placeholder="e.g., Pets not allowed"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    {...register('contact.phone', { required: 'Phone number is required' })}
                    type="tel"
                    placeholder="+256 XXX XXX XXX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.contact?.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    {...register('contact.email', { required: 'Email is required' })}
                    type="email"
                    placeholder="contact@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.contact?.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.contact.email.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <input
                    {...register('contact.website')}
                    type="url"
                    placeholder="https://www.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Creating...' : 'List Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CreateAccommodationPage() {
  return (
    <AuthGuard requireAuth={true} requireRole="host">
      <CreateAccommodationContent />
    </AuthGuard>
  );
}