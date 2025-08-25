'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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

interface PaymentFormData {
  paymentMethod: 'card' | 'mobile_money' | 'bank_transfer';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  mobileNumber?: string;
  savePaymentMethod: boolean;
  agreeToTerms: boolean;
}

interface CheckoutClientProps {
  booking: BookingDetails;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CheckoutContent({ booking }: CheckoutClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'review' | 'payment' | 'processing' | 'success' | 'error'>('review');
  const [errorMessage, setErrorMessage] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: {
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolderName: user?.name || '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Uganda'
      },
      mobileNumber: '',
      savePaymentMethod: false,
      agreeToTerms: false
    }
  });

  const paymentMethod = watch('paymentMethod');
  const isUserBooking = user && user.id === booking.user._id;

  const onSubmit = async (data: PaymentFormData) => {
    if (!data.agreeToTerms) {
      alert('Please agree to the terms and conditions to proceed.');
      return;
    }

    setProcessing(true);
    setPaymentStep('processing');
    setErrorMessage('');

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call payment API
      const paymentResponse = await axios.post(`${API_URL}/payments/process`, {
        bookingId: booking._id,
        paymentMethod: data.paymentMethod,
        paymentDetails: {
          ...data,
          amount: booking.finalTotal
        }
      });

      if (paymentResponse.data.success) {
        setPaymentStep('success');
        
        // Redirect to booking confirmation after a short delay
        setTimeout(() => {
          router.push(`/booking/${booking._id}`);
        }, 3000);
      } else {
        throw new Error(paymentResponse.data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment failed:', error);
      setErrorMessage(error.message || 'Payment processing failed. Please try again.');
      setPaymentStep('error');
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setPaymentStep('payment');
    setErrorMessage('');
  };

  if (!isUserBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You can only access checkout for your own bookings.</p>
          <Link
            href="/profile"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
          <p className="text-gray-600">Please wait while we process your payment. Do not close this page.</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-green-600">✓</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. You will be redirected to your booking confirmation.
          </p>
          <Link
            href={`/booking/${booking._id}`}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            View Booking
          </Link>
        </div>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl text-red-600">✕</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
          <p className="text-gray-600 mb-2">{errorMessage}</p>
          <p className="text-sm text-gray-500 mb-6">Please check your payment details and try again.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <Link
              href={`/booking/${booking._id}`}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Booking
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Secure checkout for your Uganda adventure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="card"
                      className="mr-3 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💳</span>
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="mobile_money"
                      className="mr-3 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📱</span>
                      <div>
                        <div className="font-medium">Mobile Money</div>
                        <div className="text-sm text-gray-500">MTN Mobile Money, Airtel Money</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="bank_transfer"
                      className="mr-3 text-green-600 focus:ring-green-500"
                    />
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏦</span>
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Direct bank transfer</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Card Payment Fields */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      {...register('cardNumber', { 
                        required: 'Card number is required',
                        pattern: {
                          value: /^[0-9\s]{13,19}$/,
                          message: 'Please enter a valid card number'
                        }
                      })}
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        {...register('expiryDate', { 
                          required: 'Expiry date is required',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                            message: 'Format: MM/YY'
                          }
                        })}
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                      {errors.expiryDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        {...register('cvv', { 
                          required: 'CVV is required',
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: 'CVV must be 3-4 digits'
                          }
                        })}
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      {...register('cardHolderName', { required: 'Cardholder name is required' })}
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                    {errors.cardHolderName && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardHolderName.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Money Fields */}
              {paymentMethod === 'mobile_money' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <input
                    {...register('mobileNumber', { 
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^(\+256|0)[0-9]{9}$/,
                        message: 'Please enter a valid Uganda mobile number'
                      }
                    })}
                    type="tel"
                    placeholder="+256 XXX XXX XXX"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    You will receive a payment prompt on your mobile device.
                  </p>
                </div>
              )}

              {/* Bank Transfer Info */}
              {paymentMethod === 'bank_transfer' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Bank Transfer Instructions</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Bank:</strong> Stanbic Bank Uganda</p>
                    <p><strong>Account Name:</strong> Shakes Travel Ltd</p>
                    <p><strong>Account Number:</strong> 9030012345678</p>
                    <p><strong>Reference:</strong> {booking.bookingReference}</p>
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    Please include the booking reference in your transfer description.
                  </p>
                </div>
              )}

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Address</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    {...register('billingAddress.street')}
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      {...register('billingAddress.city')}
                      type="text"
                      placeholder="Kampala"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      {...register('billingAddress.zipCode')}
                      type="text"
                      placeholder="12345"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement */}
              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    {...register('savePaymentMethod')}
                    type="checkbox"
                    className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    Save payment method for future bookings
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                    type="checkbox"
                    className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition-colors"
              >
                {processing ? 'Processing...' : `Pay $${booking.finalTotal.toFixed(2)}`}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-green-600 mr-2">🔒</span>
                Your payment information is encrypted and secure. We use industry-standard SSL encryption.
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Item Details */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                  {booking.item.images && booking.item.images.length > 0 ? (
                    <img
                      src={booking.item.images[0]}
                      alt={booking.item.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      📸
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.item.title}</h3>
                  <p className="text-gray-600 text-sm">📍 {booking.item.location}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {booking.item.type === 'trip' ? 'Adventure Experience' : 'Accommodation'}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Booking Reference:</span>
                <span className="font-medium">{booking.bookingReference}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {booking.item.type === 'trip' ? 'Start Date:' : 'Check-in:'}
                </span>
                <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
              </div>
              
              {booking.checkOut && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {booking.item.type === 'trip' ? 'End Date:' : 'Check-out:'}
                  </span>
                  <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Guests:</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${booking.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">${booking.serviceFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span className="font-medium">${booking.taxes.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${booking.finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Support */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 mb-3">
                Our support team is available 24/7 to assist you with your booking.
              </p>
              <div className="text-sm text-blue-700">
                📞 +256 XXX XXX XXX<br />
                ✉️ support@ugandaexplorer.com
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient({ booking }: CheckoutClientProps) {
  return (
    <AuthGuard requireAuth={true}>
      <CheckoutContent booking={booking} />
    </AuthGuard>
  );
}