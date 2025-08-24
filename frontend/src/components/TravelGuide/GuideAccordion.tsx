"use client";

import React, { useState } from 'react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

const GuideAccordion: React.FC<{ items: AccordionItem[] }> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const getRegionIcon = (id: string) => {
    if (id.includes('northern')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    if (id.includes('south')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (id.includes('central')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  return (
    <div className="bg-white" role="region" aria-label="Guide sections accordion">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8 overflow-x-auto" aria-label="Guide sections">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => setOpenId(item.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                openId === item.id
                  ? 'border-[#195e48] text-[#195e48]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={openId === item.id}
              role="tab"
            >
              <div className="flex items-center gap-2">
                <span className={openId === item.id ? 'text-[#195e48]' : 'text-gray-400'}>
                  {getRegionIcon(item.id)}
                </span>
                {item.title}
                {item.badge && (
                  <span className="ml-2 bg-[#195e48]/10 text-[#195e48] px-2 py-1 rounded-full text-xs font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        {items.map(item => (
          <div
            key={item.id}
            id={`content-${item.id}`}
            role="tabpanel"
            aria-hidden={openId !== item.id}
            className={openId === item.id ? 'block' : 'hidden'}
          >
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#195e48] rounded-2xl flex items-center justify-center text-white">
                  {getRegionIcon(item.id)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{`Uganda's regions offer a rich tapestry of travel experiences, from the lush forests and vibrant wildlife of the west to the cultural heartlands of the central districts. Each area is unique, with its own history, traditions, and natural wonders. Whether you're seeking adventure, relaxation, or cultural immersion, our guides provide in-depth insights, practical tips, and personal stories to help you plan a memorable journey. Explore the best times to visit, local customs, must-see attractions, and eco-friendly travel options, all written in a friendly, blog-style format to inspire your next adventure.`}</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none text-gray-700">{item.content}</div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#195e48] text-white rounded-xl font-semibold hover:bg-[#164439] transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  View Detailed Guide
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Explore Experiences
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideAccordion;
