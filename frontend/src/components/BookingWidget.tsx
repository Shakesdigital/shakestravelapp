'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

interface BookingWidgetProps {
  itemId: string;
  itemType: 'accommodation' | 'trip';
  basePrice: number;
  availability?: boolean;
  maxGuests?: number;
  onBooking?: (bookingData: BookingData) => Promise<void>;
}

export default function BookingWidget({
  itemId,
  itemType,
  basePrice,
  availability = true,
  maxGuests = 8,
  onBooking
}: BookingWidgetProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<'booking' | 'payment' | 'confirmation'>('booking');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<BookingData>({
    defaultValues: {
      checkIn: '',
      checkOut: '',
      guests: 2,
      specialRequests: ''
    }
  });

  const watchedData = watch();
  const nights = watchedData.checkIn && watchedData.checkOut 
    ? Math.ceil((new Date(watchedData.checkOut).getTime() - new Date(watchedData.checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const totalPrice = nights > 0 ? basePrice * nights * watchedData.guests : basePrice * watchedData.guests;
  const serviceFee = totalPrice * 0.1;
  const taxes = totalPrice * 0.05;
  const finalTotal = totalPrice + serviceFee + taxes;

  const onSubmit = async (data: BookingData) => {
    if (!user) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?returnUrl=${returnUrl}`;
      return;
    }

    // Enhanced validation for dates
    if (itemType === 'accommodation') {
      const checkInDate = new Date(data.checkIn);
      const checkOutDate = new Date(data.checkOut);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkInDate < today) {
        alert('Check-in date cannot be in the past');
        return;
      }

      if (checkOutDate <= checkInDate) {
        alert('Check-out date must be after check-in date');
        return;
      }
    }

    setLoading(true);
    try {
      // Create booking first
      const response = await axios.post(`${API_URL}/bookings`, {
        itemId,
        itemType,
        ...data
      });

      const bookingId = response.data.data._id;
      
      // Redirect to checkout page instead of showing payment form
      window.location.href = `/checkout/${bookingId}`;
    } catch (error) {
      console.error('Booking creation failed:', error);
      alert('Failed to create booking. Please try again.');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!bookingData || !onBooking) return;

    setLoading(true);
    try {
      await onBooking(bookingData);
      setStep('confirmation');
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 mb-4">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>
          <button
            onClick={() => window.location.href = '/profile/bookings'}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
        
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Check-in:</span>
              <span>{bookingData?.checkIn}</span>
            </div>
            <div className="flex justify-between">
              <span>Check-out:</span>
              <span>{bookingData?.checkOut}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{bookingData?.guests}</span>
            </div>
            {nights > 0 && (
              <div className="flex justify-between">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVV</label>
              <input
                type="text"
                placeholder="123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>${basePrice} x {watchedData.guests} guests {nights > 0 && `x ${nights} nights`}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button
            onClick={() => setStep('booking')}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold">${basePrice}</span>
          <span className="text-gray-600 ml-1">
            {itemType === 'accommodation' ? 'per night' : 'per person'}
          </span>
        </div>
        {availability ? (
          <span className="text-green-600 text-sm font-medium">Available</span>
        ) : (
          <span className="text-red-600 text-sm font-medium">Unavailable</span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {itemType === 'accommodation' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Check-in</label>
              <input
                {...register('checkIn', { required: 'Check-in date is required' })}
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.checkIn && (
                <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Check-out</label>
              <input
                {...register('checkOut', { required: 'Check-out date is required' })}
                type="date"
                min={watchedData.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              />
              {errors.checkOut && (
                <p className="text-red-500 text-sm mt-1">{errors.checkOut.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            {itemType === 'accommodation' ? 'Guests' : 'Participants'}
          </label>
          <select
            {...register('guests', { required: 'Number of guests is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          >
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
          <textarea
            {...register('specialRequests')}
            placeholder="Any special requests or dietary requirements..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Price Calculation */}
        {watchedData.checkIn && watchedData.checkOut && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>${basePrice} x {watchedData.guests} guests {nights > 0 && `x ${nights} nights`}</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={!availability || loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          {!user ? 'Login to Book' : availability ? 'Reserve Now' : 'Unavailable'}
        </button>
      </form>

      {!user && (
        <p className="text-center text-sm text-gray-600 mt-3">
          You won&apos;t be charged yet
        </p>
      )}
    </div>
  );
}