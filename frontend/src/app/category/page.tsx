'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoryIndexPage() {
  const primaryColor = '#195e48';
  
  const categories = [
    {
      slug: 'safari',
      title: 'Wildlife Safari',
      description: 'Encounter Uganda\'s incredible wildlife in their natural habitat',
      image: '🦁',
      experienceCount: 48,
      featured: true
    },
    {
      slug: 'hiking',
      title: 'Hiking & Trekking',
      description: 'Conquer Uganda\'s majestic peaks and discover breathtaking landscapes',
      image: '🏔️',
      experienceCount: 36,
      featured: true
    },
    {
      slug: 'water-sports',
      title: 'Water Sports',
      description: 'Dive into Uganda\'s pristine waters for thrilling aquatic adventures',
      image: '🏄‍♂️',
      experienceCount: 28,
      featured: true
    },
    {
      slug: 'cultural-tours',
      title: 'Cultural Tours',
      description: 'Immerse yourself in Uganda\'s rich cultural heritage and traditions',
      image: '🏘️',
      experienceCount: 32,
      featured: true
    },
    {
      slug: 'extreme-sports',
      title: 'Extreme Sports',
      description: 'Push your limits with heart-pounding adrenaline adventures',
      image: '🪂',
      experienceCount: 18,
      featured: false
    },
    {
      slug: 'aerial-adventures',
      title: 'Aerial Adventures',
      description: 'Experience Uganda from above with breathtaking aerial perspectives',
      image: '🎈',
      experienceCount: 14,
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%)`
          }}
        />
        <div className="absolute inset-0 bg-black opacity-20" />
        
        <div className="relative z-10 text-center w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Adventure Categories
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Discover Uganda's diverse adventure experiences across multiple categories, 
            from wildlife safaris to extreme sports and cultural immersion
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="content-section">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Adventure Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose your adventure style and discover amazing experiences tailored to your interests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <article 
                key={category.slug}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="relative">
                    <div 
                      className="h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${primaryColor}10` }}
                    >
                      <span aria-hidden="true">{category.image}</span>
                    </div>
                    {category.featured && (
                      <div className="absolute top-4 right-4 bg-[#195e48] text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ✨ Popular
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{category.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium" style={{ color: primaryColor }}>
                        {category.experienceCount} experiences
                      </span>
                    </div>
                    <div 
                      className="btn-primary text-white px-6 py-3 rounded-xl font-semibold transition-colors block text-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Explore {category.title}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="content-section text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Can't Decide? Explore All Experiences
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Browse our complete collection of Uganda adventures or let us help you plan the perfect itinerary
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/all-experiences"
              className="btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              View All Experiences
            </Link>
            <Link 
              href="/trip-planner"
              className="btn-outline border-2 px-8 py-4 rounded-xl font-bold text-lg transition-colors"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              Plan Your Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}