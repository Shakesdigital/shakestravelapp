import React from 'react';
import { notFound } from 'next/navigation';
import axios from 'axios';
import CheckoutClient from './CheckoutClient';

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getBookingDetails(bookingId: string): Promise<BookingDetails | null> {
  try {
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { bookingId: string } }) {
  const booking = await getBookingDetails(params.bookingId);
  
  if (!booking) {
    return {
  title: 'Checkout - Booking Not Found - Shakes Travel'
    };
  }

  return {
  title: `Checkout - ${booking.item.title} - Shakes Travel`,
    description: `Complete your payment for ${booking.item.title}`,
  };
}

export default async function CheckoutPage({ params }: { params: { bookingId: string } }) {
  const booking = await getBookingDetails(params.bookingId);

  if (!booking) {
    notFound();
  }

  // Redirect if already paid
  if (booking.paymentStatus === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Already Completed</h1>
          <p className="text-gray-600 mb-6">This booking has already been paid for.</p>
          <a
            href={`/booking/${booking._id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Booking Details
          </a>
        </div>
      </div>
    );
  }

  return <CheckoutClient booking={booking} />;
}