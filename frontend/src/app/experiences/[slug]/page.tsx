'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { experiences } from '@/data/experiences';

export default function ExperiencePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(2);

  const primaryColor = '#195e48';
  const experience = experiences.find(exp => exp.slug === params.slug);

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Experience Not Found</h1>
          <p className="text-gray-600 mb-8">
            The experience you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/all-experiences"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-white transition-colors"
            style={{ backgroundColor: primaryColor }}
          >
            Browse All Experiences
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotal = () => experience.price * participants;

  const handleBookNow = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    router.push(`/booking/${experience.id}?date=${selectedDate}&participants=${participants}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          {experience.image.startsWith('/') ? (
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-9xl"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              {experience.image}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        </div>

        <div className="relative h-full flex items-end">
          <div className="content-section pb-12">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold" style={{ color: primaryColor }}>
                  {experience.category}
                </span>
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700">
                  {experience.difficulty}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {experience.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="text-lg font-semibold">{experience.rating}</span>
                  <span className="text-lg">({experience.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-lg">{experience.duration}</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Experience</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {experience.description}
              </p>
            </section>

            {/* Highlights */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {experience.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-2xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <ul className="space-y-3">
                  {experience.whatsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0" style={{ color: primaryColor }}>✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Itinerary */}
            {experience.itinerary && experience.itinerary.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Itinerary</h2>
                <div className="space-y-4">
                  {experience.itinerary.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-900 mb-1">{item.time}</div>
                          <div className="text-gray-700">{item.activity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                      ${experience.price}
                    </span>
                    <span className="text-gray-600">per person</span>
                  </div>
                  {experience.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-400 line-through">${experience.originalPrice}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        Save ${experience.originalPrice - experience.price}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    />
                  </div>

                  <div>
                    <label htmlFor="participants" className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Participants
                    </label>
                    <select
                      id="participants"
                      value={participants}
                      onChange={(e) => setParticipants(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">${experience.price} × {participants} {participants === 1 ? 'person' : 'people'}</span>
                    <span className="font-semibold text-gray-900">${experience.price * participants}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span style={{ color: primaryColor }}>${calculateTotal()}</span>
                  </div>
                </div>

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
                    <span>Free cancellation up to 48 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✓</span>
                    <span>Available: {experience.availability}</span>
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

      {/* Related Experiences */}
      <section className="py-16 bg-white">
        <div className="content-section">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Similar Experiences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences
              .filter(exp => exp.category === experience.category && exp.id !== experience.id)
              .slice(0, 3)
              .map(relatedExp => (
                <Link key={relatedExp.id} href={`/experiences/${relatedExp.slug}`}>
                  <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48">
                      {relatedExp.image.startsWith('/') ? (
                        <Image
                          src={relatedExp.image}
                          alt={relatedExp.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-6xl"
                          style={{ backgroundColor: `${primaryColor}20` }}
                        >
                          {relatedExp.image}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{relatedExp.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span>⭐ {relatedExp.rating}</span>
                        <span>•</span>
                        <span>{relatedExp.duration}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                          ${relatedExp.price}
                        </span>
                        <span className="text-sm text-gray-600">per person</span>
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
