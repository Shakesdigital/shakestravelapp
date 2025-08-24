'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
  preferredContact: string;
  travelDate: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: '',
    preferredContact: 'email',
    travelDate: ''
  });

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formErrors, setFormErrors] = useState<Partial<ContactForm>>({});

  const primaryColor = '#195e48';

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'gorilla-trekking', label: 'Gorilla Trekking', icon: '🦍' },
    { value: 'safari', label: 'Wildlife Safari', icon: '🦁' },
    { value: 'cultural', label: 'Cultural Tours', icon: '🏘️' },
    { value: 'adventure', label: 'Adventure Sports', icon: '🚣‍♂️' },
    { value: 'accommodation', label: 'Accommodations', icon: '🏞️' },
    { value: 'custom', label: 'Custom Itinerary', icon: '✈️' },
    { value: 'group', label: 'Group Booking', icon: '👥' }
  ];

  const officeLocations = [
    {
      id: 'kampala',
      city: 'Kampala',
      type: 'Main Office',
      address: 'Plot 123, Kampala Road, Central Division',
      phone: '+256 (0) 414 123 456',
      email: 'info@shakestravel.com',
      hours: 'Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM',
      coordinates: { lat: 0.3136, lng: 32.5811 },
      icon: '🏢'
    },
    {
      id: 'jinja',
      city: 'Jinja',
      type: 'Adventure Hub',
      address: 'Nile Crescent, Source of the Nile',
      phone: '+256 (0) 434 123 789',
      email: 'jinja@shakestravel.com',
      hours: 'Daily: 7:00 AM - 7:00 PM',
      coordinates: { lat: 0.4297, lng: 33.2041 },
      icon: '🚣‍♂️'
    },
    {
      id: 'bwindi',
      city: 'Bwindi',
      type: 'Gorilla Trekking Base',
      address: 'Buhoma Sector, Bwindi Impenetrable Forest',
      phone: '+256 (0) 486 123 101',
      email: 'bwindi@shakestravel.com',
      hours: 'Daily: 6:00 AM - 8:00 PM',
      coordinates: { lat: -1.0652, lng: 29.7256 },
      icon: '🦍'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: 'booking',
      category: 'Booking',
      question: 'How far in advance should I book my Uganda adventure?',
      answer: 'For gorilla trekking, we recommend booking 3-6 months in advance as permits are limited. For other adventures, 4-8 weeks is usually sufficient, though peak season (June-September, December-February) requires earlier booking.'
    },
    {
      id: 'permits',
      category: 'Permits',
      question: 'Do you handle gorilla trekking permits?',
      answer: 'Yes! We handle all permit bookings through the Uganda Wildlife Authority. Gorilla permits cost $700 per person for foreign non-residents. We secure permits as soon as you confirm your booking and pay the deposit.'
    },
    {
      id: 'safety',
      category: 'Safety',
      question: 'How safe is adventure travel in Uganda?',
      answer: 'Uganda is generally very safe for tourists. Our experienced guides are trained in first aid and emergency procedures. We provide safety briefings, quality equipment, and maintain communication with local authorities and park rangers.'
    },
    {
      id: 'weather',
      category: 'Travel',
      question: 'What\'s the best time to visit Uganda?',
      answer: 'Uganda can be visited year-round! Dry seasons (June-September, December-February) offer easier trekking conditions. Wet seasons (March-May, October-November) have fewer crowds and lush landscapes, plus discounted rates.'
    },
    {
      id: 'health',
      category: 'Health',
      question: 'What vaccinations do I need for Uganda?',
      answer: 'Yellow fever vaccination is mandatory. We also recommend hepatitis A/B, typhoid, and malaria prophylaxis. Consult your doctor 4-6 weeks before travel. We provide detailed health guidelines upon booking.'
    },
    {
      id: 'payment',
      category: 'Payment',
      question: 'What are your payment terms?',
      answer: 'We require a 30% deposit to secure your booking, with the balance due 45 days before departure. We accept bank transfers, credit cards, and mobile money. All major currencies are accepted.'
    },
    {
      id: 'cancellation',
      category: 'Policies',
      question: 'What is your cancellation policy?',
      answer: 'Cancellations more than 45 days before departure: 85% refund. 15-45 days: 50% refund. Less than 15 days: no refund. Gorilla permits are non-refundable once issued. We recommend travel insurance.'
    },
    {
      id: 'group-size',
      category: 'Travel',
      question: 'What are your group sizes?',
      answer: 'We specialize in small groups (2-8 people) for personalized experiences. For gorilla trekking, maximum group size is 8 per permit. We also offer private tours and can accommodate larger groups with advance notice.'
    }
  ];

  const socialLinks = [
    { platform: 'Facebook', icon: '📘', url: 'https://facebook.com/shakestravel', handle: '@shakestravel' },
    { platform: 'Instagram', icon: '📸', url: 'https://instagram.com/shakestravel', handle: '@shakestravel' },
    { platform: 'Twitter', icon: '🐦', url: 'https://twitter.com/shakestravel', handle: '@shakestravel' },
    { platform: 'YouTube', icon: '📺', url: 'https://youtube.com/shakestravel', handle: 'Shake\'s Travel' },
    { platform: 'TripAdvisor', icon: '🦉', url: 'https://tripadvisor.com/shakestravel', handle: 'Shake\'s Travel Uganda' },
    { platform: 'WhatsApp', icon: '💬', url: 'https://wa.me/256414123456', handle: '+256 414 123 456' }
  ];

  const validateForm = (): boolean => {
    const errors: Partial<ContactForm> = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) errors.message = 'Message is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name as keyof ContactForm]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'general',
          message: '',
          preferredContact: 'email',
          travelDate: ''
        });
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Group FAQs by category
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden py-20">
          {/* Background with Uganda scenery */}
          <div 
            className="absolute inset-0 hero-carousel transition-all duration-1000"
            style={{ 
              background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDEtOTIwVjEwODBIMFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxOTIwIiB5Mj0iMTA4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTk1ZTQ4Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzJkN2E1ZSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=') center/cover`
            }}
          />
          <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
          
          <div className="relative z-10 text-center w-full content-section">
            <div className="mb-8">
              <div className="text-8xl mb-4" aria-hidden="true">📞</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Get In Touch
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
                Ready to start your Uganda adventure? We're here to help plan your perfect eco-friendly journey
              </p>
            </div>
            
            {/* Contact Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link 
                href="#contact-form" 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">✉️</div>
                <div className="font-semibold">Send Message</div>
                <div className="text-sm opacity-90">Get personalized advice</div>
              </Link>
              
              <a 
                href="tel:+256414123456" 
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">📞</div>
                <div className="font-semibold">Call Us</div>
                <div className="text-sm opacity-90">+256 414 123 456</div>
              </a>
              
              <a 
                href="https://wa.me/256414123456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-opacity-20 transition-all"
              >
                <div className="text-4xl mb-2">💬</div>
                <div className="font-semibold">WhatsApp</div>
                <div className="text-sm opacity-90">Instant messaging</div>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="landing-section bg-white" aria-labelledby="form-heading">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 id="form-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Fill out the form below and we'll get back to you within 24 hours with personalized recommendations for your Uganda adventure.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={{ focusRingColor: primaryColor }}
                        placeholder="Your full name"
                        aria-describedby={formErrors.name ? 'name-error' : undefined}
                      />
                      {formErrors.name && (
                        <p id="name-error" className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        style={{ focusRingColor: primaryColor }}
                        placeholder="your@email.com"
                        aria-describedby={formErrors.email ? 'email-error' : undefined}
                      />
                      {formErrors.email && (
                        <p id="email-error" className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone and Travel Date Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: primaryColor }}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="travelDate" className="block text-sm font-semibold mb-2 text-gray-700">
                        Preferred Travel Date
                      </label>
                      <input
                        type="date"
                        id="travelDate"
                        name="travelDate"
                        value={formData.travelDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                        style={{ focusRingColor: primaryColor }}
                      />
                    </div>
                  </div>

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-semibold mb-2 text-gray-700">
                      What are you interested in?
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:border-transparent"
                      style={{ focusRingColor: primaryColor }}
                    >
                      {inquiryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700">
                      How would you prefer us to contact you?
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleInputChange}
                          className="mr-2"
                          style={{ accentColor: primaryColor }}
                        />
                        📧 Email
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleInputChange}
                          className="mr-2"
                          style={{ accentColor: primaryColor }}
                        />
                        📞 Phone
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="whatsapp"
                          checked={formData.preferredContact === 'whatsapp'}
                          onChange={handleInputChange}
                          className="mr-2"
                          style={{ accentColor: primaryColor }}
                        />
                        💬 WhatsApp
                      </label>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent transition-colors ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                      style={{ focusRingColor: primaryColor }}
                      placeholder="Tell us about your ideal Uganda adventure, group size, interests, or any specific questions you have..."
                      aria-describedby={formErrors.message ? 'message-error' : undefined}
                    />
                    {formErrors.message && (
                      <p id="message-error" className="text-red-500 text-sm mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full btn-primary text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors ${
                      formStatus === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{ backgroundColor: primaryColor }}
                  >
                    {formStatus === 'submitting' ? (
                      <>🔄 Sending Message...</>
                    ) : (
                      <>🚀 Send Message</>
                    )}
                  </button>

                  {/* Form Status Messages */}
                  {formStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">✅</span>
                        <div>
                          <div className="font-semibold">Message sent successfully!</div>
                          <div className="text-sm">We'll get back to you within 24 hours.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">❌</span>
                        <div>
                          <div className="font-semibold">Oops! Something went wrong.</div>
                          <div className="text-sm">Please try again or contact us directly.</div>
                        </div>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">⚡</div>
                    <div>
                      <div className="font-semibold text-gray-900">Quick Response</div>
                      <div className="text-gray-600 text-sm">We respond to all inquiries within 24 hours</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="font-semibold text-gray-900">Personalized Planning</div>
                      <div className="text-gray-600 text-sm">Every itinerary is customized to your interests</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">🌍</div>
                    <div>
                      <div className="font-semibold text-gray-900">Local Expertise</div>
                      <div className="text-gray-600 text-sm">Born and raised in Uganda, we know the best spots</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">💚</div>
                    <div>
                      <div className="font-semibold text-gray-900">Eco-Friendly Focus</div>
                      <div className="text-gray-600 text-sm">Sustainable tourism that gives back</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Emergency Contact</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>24/7 Emergency Line: <strong>+256 (0) 414 999 888</strong></div>
                    <div>For travelers currently in Uganda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="landing-section bg-gray-50" aria-labelledby="offices-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="offices-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Locations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Visit us at our offices across Uganda, strategically located for easy access to major attractions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {officeLocations.map((location) => (
                <div key={location.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect">
                  <div 
                    className="h-32 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    {location.icon}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl text-gray-900">{location.city}</h3>
                      <span 
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                      >
                        {location.type}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <span>📍</span>
                        <span>{location.address}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span>📞</span>
                        <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="hover:text-current transition-colors">
                          {location.phone}
                        </a>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span>✉️</span>
                        <a href={`mailto:${location.email}`} className="hover:text-current transition-colors">
                          {location.email}
                        </a>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <span>🕒</span>
                        <span>{location.hours}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <a
                        href={`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold transition-colors"
                        style={{ color: primaryColor }}
                      >
                        📍 View on Map →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Uganda Map */}
        <section className="landing-section bg-white" aria-labelledby="map-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="map-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Us Across Uganda
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We operate throughout Uganda with offices and partners in key locations
              </p>
            </div>

            {/* Simplified Visual Map */}
            <div className="bg-gray-50 rounded-2xl p-8 relative overflow-hidden">
              <div className="text-center text-6xl mb-8">🇺🇬</div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl mb-3">🏢</div>
                  <h3 className="font-bold text-lg mb-2">Kampala HQ</h3>
                  <p className="text-gray-600 text-sm">Main operations & planning</p>
                  <div className="mt-3">
                    <a href="tel:+256414123456" className="text-sm font-semibold" style={{ color: primaryColor }}>
                      +256 414 123 456
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl mb-3">🚣‍♂️</div>
                  <h3 className="font-bold text-lg mb-2">Jinja Adventure Hub</h3>
                  <p className="text-gray-600 text-sm">White water rafting & Nile activities</p>
                  <div className="mt-3">
                    <a href="tel:+256434123789" className="text-sm font-semibold" style={{ color: primaryColor }}>
                      +256 434 123 789
                    </a>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-3xl mb-3">🦍</div>
                  <h3 className="font-bold text-lg mb-2">Bwindi Base</h3>
                  <p className="text-gray-600 text-sm">Gorilla trekking headquarters</p>
                  <div className="mt-3">
                    <a href="tel:+256486123101" className="text-sm font-semibold" style={{ color: primaryColor }}>
                      +256 486 123 101
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <a
                  href="https://maps.google.com/search/Shake's+Travel+Uganda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  🗺️ Open Interactive Map
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="landing-section bg-gray-50" aria-labelledby="faq-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get quick answers to common questions about Uganda adventures
              </p>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {Object.entries(faqsByCategory).map(([category, categoryFaqs]) => (
                <div key={category}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {category[0]}
                    </span>
                    {category}
                  </h3>
                  
                  <div className="space-y-4">
                    {categoryFaqs.map((faq) => (
                      <div key={faq.id} className="bg-white rounded-2xl overflow-hidden shadow-md">
                        <button
                          onClick={() => toggleAccordion(faq.id)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                          aria-expanded={activeAccordion === faq.id}
                          aria-controls={`faq-content-${faq.id}`}
                        >
                          <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                          <span className="text-2xl flex-shrink-0">
                            {activeAccordion === faq.id ? '−' : '+'}
                          </span>
                        </button>
                        
                        {activeAccordion === faq.id && (
                          <div id={`faq-content-${faq.id}`} className="px-6 pb-4">
                            <div className="text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media & Follow Section */}
        <section className="landing-section bg-white" aria-labelledby="social-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="social-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Follow Our Adventures
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay connected and get inspired by real Uganda adventures from our travelers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-2xl p-6 text-center card-hover-effect group"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{social.platform}</h3>
                  <p className="text-gray-600 text-sm mb-4">{social.handle}</p>
                  <div 
                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                    style={{ color: primaryColor }}
                  >
                    Follow us
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="content-section text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Planning?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Whether you're dreaming of gorilla encounters, Nile adventures, or cultural immersion, we're here to make it happen
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/trips" 
                className="bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
                style={{ color: primaryColor }}
              >
                🌟 Browse Adventures
              </Link>
              <a 
                href="https://wa.me/256414123456" 
                target="_blank" 
                rel="noopener noreferrer"
                className="border-2 border-white text-white hover:bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors about-cta-secondary"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;