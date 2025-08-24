'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface BookingDetails {
  experienceId: number;
  experienceTitle: string;
  experienceImage: string;
  date: string;
  time: string;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  location: string;
  duration: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequests: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    country: '',
    emergencyContact: '',
    emergencyPhone: '',
    specialRequests: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const primaryColor = '#195e48';

  useEffect(() => {
    // Simulate loading booking details from URL params
    const date = searchParams?.get('date');
    const time = searchParams?.get('time');
    const participants = parseInt(searchParams?.get('participants') || '2');
    
    // In a real app, you'd fetch the experience details based on bookingId
    setTimeout(() => {
      setBookingDetails({
        experienceId: 1,
        experienceTitle: 'Gorilla Trekking in Bwindi Impenetrable Forest',
        experienceImage: '🦍',
        date: date || new Date().toISOString().split('T')[0],
        time: time || '6:00 AM',
        participants,
        pricePerPerson: 800,
        totalPrice: 800 * participants,
        location: 'Bwindi Impenetrable Forest',
        duration: '1 Day'
      });
      setLoading(false);
    }, 1000);
  }, [params, searchParams]);

  const handleInputChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms || !bookingDetails) return;

    setIsSubmitting(true);
    
    // Simulate booking submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success message or redirect
      alert('Booking submitted successfully! You will receive confirmation via email.');
      router.push('/all-experiences');
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6">
              Please log in to complete your booking.
            </p>
            <Link
              href="/auth/login"
              className="btn-primary text-white px-6 py-3 rounded-xl font-semibold w-full block text-center"
              style={{ backgroundColor: primaryColor }}
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="content-section py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl p-8 mb-8">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
          <Link 
            href="/all-experiences"
            className="btn-primary text-white px-6 py-3 rounded-xl font-semibold"
            style={{ backgroundColor: primaryColor }}
          >
            Browse Experiences
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="content-section">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link 
                href={`/experiences/${bookingDetails.experienceId}`}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-600">Checkout</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Complete Your Booking
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              You're almost there! Just a few more details.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold mb-2 text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={personalInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                      required
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mt-6">
                  <label htmlFor="specialRequests" className="block text-sm font-semibold mb-2 text-gray-700">
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    id="specialRequests"
                    value={personalInfo.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Please let us know about any dietary restrictions, medical conditions, or special requirements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent resize-none"
                    style={{ focusRingColor: primaryColor }}
                    rows={4}
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="mt-1 mr-3 w-5 h-5"
                      style={{ accentColor: primaryColor }}
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the Terms and Conditions and Privacy Policy. I understand the cancellation policy and acknowledge that this booking is subject to availability confirmation.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!agreeToTerms || isSubmitting}
                  className={`w-full mt-8 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                    !agreeToTerms || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  }`}
                  style={{
                    backgroundColor: !agreeToTerms || isSubmitting ? undefined : primaryColor
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Complete Booking'
                  )}
                </button>
              </form>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Booking Summary</h3>
                
                {/* Experience Details */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl mr-4"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      {bookingDetails.experienceImage}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {bookingDetails.experienceTitle}
                      </h4>
                      <p className="text-sm text-gray-600">📍 {bookingDetails.location}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date</span>
                      <span className="font-medium">{formatDate(bookingDetails.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time</span>
                      <span className="font-medium">{bookingDetails.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">{bookingDetails.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participants</span>
                      <span className="font-medium">{bookingDetails.participants} {bookingDetails.participants === 1 ? 'person' : 'people'}</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {formatCurrency(bookingDetails.pricePerPerson)} × {bookingDetails.participants} {bookingDetails.participants === 1 ? 'person' : 'people'}
                      </span>
                      <span className="font-medium">{formatCurrency(bookingDetails.totalPrice)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span style={{ color: primaryColor }}>{formatCurrency(bookingDetails.totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 rounded-xl p-4 text-sm">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">No payment required now</div>
                      <div className="text-gray-600">
                        You'll receive a booking confirmation and payment instructions via email within 24 hours.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}