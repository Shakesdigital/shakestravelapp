import React from 'react';
import { notFound } from 'next/navigation';
import axios from 'axios';
import ItineraryClient from './ItineraryClient';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getTripPlan(id: string): Promise<TripPlan | null> {
  try {
    const response = await axios.get(`${API_URL}/trip-plans/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch trip plan:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const tripPlan = await getTripPlan(params.id);
  
  if (!tripPlan) {
    return {
  title: 'Itinerary Not Found - Shakes Travel'
    };
  }

  return {
  title: `${tripPlan.name} - Itinerary - Shakes Travel`,
    description: tripPlan.description || `View detailed itinerary for ${tripPlan.name}`,
  };
}

export default async function ItineraryPage({ params }: { params: { id: string } }) {
  const tripPlan = await getTripPlan(params.id);

  if (!tripPlan) {
    notFound();
  }

  return <ItineraryClient tripPlan={tripPlan} />;
}