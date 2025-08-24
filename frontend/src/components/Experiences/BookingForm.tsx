'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Experience {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  availability: {
    times: string[];
    daysAvailable: string[];
  };
  additionalInfo: {
    maxGroupSize: number;
    minAge?: number;
  };
  freeCancel: boolean;
  instantBooking: boolean;
}

interface BookingFormProps {
  experience: Experience;
  onBookingSubmit: (data: BookingData) => void;
  isSticky?: boolean;
  isMobile?: boolean;
}

interface BookingData {
  experienceId: number;
  date: string;
  time: string;
  participants: number;
  totalPrice: number;
  specialRequests?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({
  experience,
  onBookingSubmit,
  isSticky = false,
  isMobile = false
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [participants, setParticipants] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState({
    basePrice: experience.price,
    totalPrice: experience.price * 2,
    savings: 0
  });

  const primaryColor = '#195e48';

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (6 months from now)
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate())
    .toISOString().split('T')[0];

  useEffect(() => {
    // Calculate pricing
    const basePrice = experience.price;
    const totalPrice = basePrice * participants;
    let savings = 0;

    if (experience.originalPrice) {
      savings = (experience.originalPrice - experience.price) * participants;
    }

    setPriceBreakdown({
      basePrice,
      totalPrice,
      savings
    });
  }, [participants, experience]);

  useEffect(() => {
    // Validate form
    const isValid = selectedDate && selectedTime && participants >= 1 && participants <= experience.additionalInfo.maxGroupSize;
    setIsFormValid(isValid);
  }, [selectedDate, selectedTime, participants, experience.additionalInfo.maxGroupSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;

    const bookingData: BookingData = {
      experienceId: experience.id,
      date: selectedDate,
      time: selectedTime,
      participants,
      totalPrice: priceBreakdown.totalPrice,
      specialRequests: specialRequests || undefined
    };

    onBookingSubmit(bookingData);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);
    
    // Auto-select first available time if only one option
    if (experience.availability.times.length === 1) {
      setSelectedTime(experience.availability.times[0]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 ${
      isSticky ? 'sticky top-6' : ''
    } ${isMobile ? 'shadow-none border-0' : ''}`}>
      <div className="p-6">
        {/* Price Header */}
        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold" style={{ color: primaryColor }}>
              {formatCurrency(experience.price)}
            </span>
            <span className="text-gray-600 ml-2">per person</span>
          </div>
          
          {experience.originalPrice && experience.originalPrice > experience.price && (
            <div className="flex items-center mt-1">
              <span className="text-lg text-gray-400 line-through mr-2">
                {formatCurrency(experience.originalPrice)}
              </span>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                Save {formatCurrency(experience.originalPrice - experience.price)}
              </span>
            </div>
          )}

          {/* Key Features */}
          <div className="flex flex-wrap gap-2 mt-4">
            {experience.freeCancel && (
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                🔄 Free cancellation
              </span>
            )}
            {experience.instantBooking && (
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                ⚡ Instant confirmation
              </span>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="block text-sm font-semibold mb-2 text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={minDate}
              max={maxDate}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-base"
              style={{ focusRingColor: primaryColor }}
              required
              aria-describedby="date-help"
            />
            <div id="date-help" className="text-xs text-gray-500 mt-1">
              Available: {experience.availability.daysAvailable.join(', ')}
            </div>
          </div>

          {/* Time Selection */}
          {experience.availability.times.length > 1 && (
            <div>
              <label htmlFor="time" className="block text-sm font-semibold mb-2 text-gray-700">
                Select Time
              </label>
              <select
                id="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-base"
                style={{ focusRingColor: primaryColor }}
                required
              >
                <option value="">Choose a time</option>
                {experience.availability.times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Participants Selection */}
          <div>
            <label htmlFor="participants" className="block text-sm font-semibold mb-2 text-gray-700">
              Number of Participants
            </label>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setParticipants(Math.max(1, participants - 1))}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                disabled={participants <= 1}
                aria-label="Decrease participants"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex-1 px-4 py-3 text-center font-medium">
                {participants} {participants === 1 ? 'Person' : 'People'}
              </div>
              
              <button
                type="button"
                onClick={() => setParticipants(Math.min(experience.additionalInfo.maxGroupSize, participants + 1))}
                className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                disabled={participants >= experience.additionalInfo.maxGroupSize}
                aria-label="Increase participants"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Maximum {experience.additionalInfo.maxGroupSize} people per booking
              {experience.additionalInfo.minAge && ` • Minimum age: ${experience.additionalInfo.minAge} years`}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="special-requests" className="block text-sm font-semibold mb-2 text-gray-700">
              Special Requests (Optional)
            </label>
            <textarea
              id="special-requests"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Any dietary requirements, mobility needs, or special occasions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent text-base resize-none"
              style={{ focusRingColor: primaryColor }}
              rows={3}
            />
          </div>

          {/* Price Breakdown */}
          {participants > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {formatCurrency(priceBreakdown.basePrice)} × {participants} {participants === 1 ? 'person' : 'people'}
                </span>
                <span>{formatCurrency(priceBreakdown.totalPrice)}</span>
              </div>
              
              {priceBreakdown.savings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Your savings</span>
                  <span>-{formatCurrency(priceBreakdown.savings)}</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span style={{ color: primaryColor }}>
                    {formatCurrency(priceBreakdown.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isFormValid
                ? 'text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
            style={{
              backgroundColor: isFormValid ? primaryColor : undefined,
            }}
            aria-describedby="submit-help"
          >
            {!user ? 'Login to Book' : experience.instantBooking ? 'Book Now' : 'Request Booking'}
          </button>
          
          <div id="submit-help" className="text-xs text-center text-gray-500">
            {!user && 'You need to login to make a booking'}
            {user && experience.instantBooking && 'Instant confirmation - no waiting!'}
            {user && !experience.instantBooking && 'We\'ll confirm your booking within 24 hours'}
          </div>
        </form>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No payment required now
          </div>
          
          {experience.freeCancel && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Free cancellation up to 48 hours
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure booking process
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Need help with booking?</p>
            <div className="flex justify-center space-x-4">
              <a
                href="tel:+256-XXX-XXXXXX"
                className="flex items-center text-sm font-medium transition-colors hover:underline"
                style={{ color: primaryColor }}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Us
              </a>
              <a
                href="/contact"
                className="flex items-center text-sm font-medium transition-colors hover:underline"
                style={{ color: primaryColor }}
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Message Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;