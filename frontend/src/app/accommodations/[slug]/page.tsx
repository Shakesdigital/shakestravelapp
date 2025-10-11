'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { accommodations } from '@/data/accommodations';

export default function AccommodationPage() {
  const params = useParams();
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(0);

  const primaryColor = '#195e48';
  const accommodation = accommodations.find(acc => acc.slug === params.slug);

  if (!accommodation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Accommodation Not Found</h1>
          <p className="text-gray-600 mb-8">
            The accommodation you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/view-all-properties"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Browse All Accommodations
          </Link>
        </div>
      </div>
    );
  }

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomPrice = accommodation.roomTypes[selectedRoom]?.price || accommodation.price;
    return nights * roomPrice;
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    router.push(`/booking/${accommodation.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&roomType=${selectedRoom}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          {accommodation.image.startsWith('/') ? (
            <Image
              src={accommodation.image}
              alt={accommodation.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-9xl"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              {accommodation.image}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        </div>

        <div className="relative h-full flex items-end">
          <div className="content-section pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold" style={{ color: primaryColor }}>
                  {accommodation.category}
                </span>
                {accommodation.specialFeatures.slice(0, 2).map((feature, index) => (
                  <span key={index} className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700">
                    {feature}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {accommodation.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg">{accommodation.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-lg font-semibold">{accommodation.rating}</span>
                  <span className="text-lg">({accommodation.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏨</span>
                  <span className="text-lg">{accommodation.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="content-section py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Property</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {accommodation.description}
              </p>
            </section>

            {/* Amenities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {accommodation.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Room Types */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Room Options</h2>
              <div className="space-y-4">
                {accommodation.roomTypes.map((room, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-6 shadow-sm cursor-pointer transition-all ${
                      selectedRoom === index ? 'ring-2' : 'hover:shadow-md'
                    }`}
                    style={{ ringColor: selectedRoom === index ? primaryColor : 'transparent' }}
                    onClick={() => setSelectedRoom(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-3">{room.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>👥 Sleeps {room.capacity}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold" style={{ color: primaryColor }}>
                          ${room.price}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Special Features */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Special Features</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accommodation.specialFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-2xl">🌟</span>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                      ${accommodation.roomTypes[selectedRoom]?.price || accommodation.price}
                    </span>
                    <span className="text-gray-600">per night</span>
                  </div>
                  {accommodation.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 line-through">${accommodation.originalPrice}</span>
                      {accommodation.discount && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {accommodation.discount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="checkIn" className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      id="checkIn"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>

                  <div>
                    <label htmlFor="checkOut" className="block text-sm font-semibold text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      id="checkOut"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>

                  <div>
                    <label htmlFor="guests" className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Guests
                    </label>
                    <select
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {checkIn && checkOut && (
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">
                        ${accommodation.roomTypes[selectedRoom]?.price || accommodation.price} × {calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${(accommodation.roomTypes[selectedRoom]?.price || accommodation.price) * calculateNights()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span style={{ color: primaryColor }}>${calculateTotal()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookNow}
                  className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Book Now
                </button>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Free cancellation up to 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Status: {accommodation.availability}</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mt-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Need Help?</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Our travel experts are here to assist you with your booking.
                </p>
                <Link
                  href="/contact"
                  className="block w-full py-3 text-center border-2 rounded-xl font-semibold transition-colors"
                  style={{ borderColor: primaryColor, color: primaryColor }}
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Accommodations */}
      <section className="py-16 bg-white">
        <div className="content-section">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accommodations
              .filter(acc => acc.category === accommodation.category && acc.id !== accommodation.id)
              .slice(0, 3)
              .map(relatedAcc => (
                <Link key={relatedAcc.id} href={`/accommodations/${relatedAcc.slug}`}>
                  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      {relatedAcc.image.startsWith('/') ? (
                        <Image
                          src={relatedAcc.image}
                          alt={relatedAcc.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          {relatedAcc.image}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{relatedAcc.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span>⭐ {relatedAcc.rating}</span>
                        <span>•</span>
                        <span>{relatedAcc.type}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                          ${relatedAcc.price}
                        </span>
                        <span className="text-sm text-gray-600">per night</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
