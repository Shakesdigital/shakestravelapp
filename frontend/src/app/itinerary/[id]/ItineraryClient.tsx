'use client';

import React from 'react';
import Image from 'next/image';

interface TripPlanItem {
  id: string;
  type: 'trip' | 'accommodation';
  itemId: string;
  title: string;
  location: string;
  price: number;
  images: string[];
  date?: string;
  notes?: string;
  order: number;
}

interface TripPlan {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  items: TripPlanItem[];
  totalEstimatedCost: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ItineraryClientProps {
  tripPlan: TripPlan;
}

export default function ItineraryClient({ tripPlan }: ItineraryClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tripPlan.name}</h1>
          {tripPlan.description && (
            <p className="text-gray-600 mb-4">{tripPlan.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div>
              <span className="font-medium">Start Date:</span> {formatDate(tripPlan.startDate)}
            </div>
            <div>
              <span className="font-medium">End Date:</span> {formatDate(tripPlan.endDate)}
            </div>
            <div>
              <span className="font-medium">Total Cost:</span> {formatPrice(tripPlan.totalEstimatedCost)}
            </div>
            <div>
              <span className="font-medium">Created by:</span> {tripPlan.user.name}
            </div>
          </div>
        </div>

        {/* Itinerary Items */}
        <div className="space-y-6">
          {tripPlan.items
            .sort((a, b) => a.order - b.order)
            .map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600">{item.location}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${
                        item.type === 'trip' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.type === 'trip' ? 'Activity' : 'Accommodation'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(item.price)}
                      </div>
                      {item.date && (
                        <div className="text-sm text-gray-500">
                          {formatDate(item.date)}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-1">Notes:</h4>
                      <p className="text-gray-600 text-sm">{item.notes}</p>
                    </div>
                  )}

                  {/* Images */}
                  {item.images && item.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {item.images.slice(0, 3).map((image, index) => (
                        <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`${item.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ))}
                      {item.images.length > 3 && (
                        <div className="flex items-center justify-center bg-gray-100 rounded-lg h-48">
                          <span className="text-gray-500 font-medium">
                            +{item.images.length - 3} more images
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{tripPlan.items.length}</div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {tripPlan.items.filter(item => item.type === 'accommodation').length}
              </div>
              <div className="text-sm text-gray-600">Accommodations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {tripPlan.items.filter(item => item.type === 'trip').length}
              </div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}