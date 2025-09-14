'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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

interface BookingConfirmationClientProps {
  booking: BookingDetails;
}

export default function BookingConfirmationClient({ booking }: BookingConfirmationClientProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    // TODO: Implement PDF generation and download
    setTimeout(() => {
      setIsDownloading(false);
    }, 1000);
  };

  const primaryColor = '#195e48';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: `${primaryColor}20` }}>
            <svg className="w-8 h-8" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for choosing Shakes Travel</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200" style={{ backgroundColor: `${primaryColor}05` }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{booking.item.title}</h2>
                <p className="text-gray-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {booking.item.location}
                </p>
              </div>
              <div className="text-right">
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
                <p className="text-sm text-gray-500 mt-1">#{booking.bookingReference}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in</span>
                    <span className="font-medium">{formatDate(booking.checkIn)}</span>
                  </div>
                  {booking.checkOut && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">{formatDate(booking.checkOut)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests</span>
                    <span className="font-medium">{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium capitalize">{booking.item.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked on</span>
                    <span className="font-medium">{formatDate(booking.createdAt)}</span>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Special Requests</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{booking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name</span>
                    <span className="font-medium">{booking.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email</span>
                    <span className="font-medium">{booking.user.email}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price</span>
                    <span>${booking.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span>${booking.serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span>${booking.taxes.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span style={{ color: primaryColor }}>${booking.finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {booking.payment && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-800 font-medium">Payment Confirmed</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Paid via {booking.payment.method} on {formatDate(booking.payment.paidAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="flex items-center justify-center px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isDownloading ? 'Downloading...' : 'Download Receipt'}
          </button>

          <Link
            href="/profile"
            className="flex items-center justify-center px-6 py-3 text-white rounded-xl font-semibold transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            View My Bookings
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center px-6 py-3 bg-gray-100 rounded-xl font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Support Section */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">Our travel experts are here to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Contact Support
            </Link>
            <Link
              href="/travel-guide"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Travel Guide
            </Link>
            <Link
              href="/about"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}