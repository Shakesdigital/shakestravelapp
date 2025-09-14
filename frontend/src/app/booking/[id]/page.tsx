import React from 'react';
import { notFound } from 'next/navigation';
import axios from 'axios';
import BookingConfirmationClient from './BookingConfirmationClient';

interface BookingDetails {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  item: {
    _id: string;
    title: string;
    type: 'trip' | 'accommodation';
    images: string[];
    location: string;
    price: number;
  };
  checkIn: string;
  checkOut?: string;
  guests: number;
  totalPrice: number;
  serviceFee: number;
  taxes: number;
  finalTotal: number;
  status: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
  payment?: {
    method: string;
    transactionId: string;
    paidAt: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getBookingDetails(id: string): Promise<BookingDetails | null> {
  try {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const booking = await getBookingDetails(params.id);
  
  if (!booking) {
    return {
  title: 'Booking Not Found - Shakes Travel'
    };
  }

  return {
  title: `Booking Confirmation - ${booking.item.title} - Shakes Travel`,
    description: `Booking confirmation for ${booking.item.title}`,
  };
}

export default async function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const booking = await getBookingDetails(params.id);

  if (!booking) {
    notFound();
  }

  return <BookingConfirmationClient booking={booking} />;
}