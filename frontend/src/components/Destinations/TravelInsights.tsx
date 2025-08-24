'use client';

import React from 'react';
import Link from 'next/link';

interface TravelInsightsProps {
  destinationName: string;
  destinationSlug: string;
}

interface Insight {
  title: string;
  description: string;
  icon: string;
  readTime: string;
  category: string;
  slug: string;
}

const TravelInsights: React.FC<TravelInsightsProps> = ({ 
  destinationName, 
  destinationSlug 
}) => {
  const primaryColor = '#195e48';

  // Get destination-specific insights
  const getDestinationInsights = (slug: string): Insight[] => {
    const insightMap: { [key: string]: Insight[] } = {
      'bwindi-impenetrable-forest': [
        {
          title: 'Gorilla Trekking Tips',
          description: 'Essential preparation and etiquette for mountain gorilla encounters',
          icon: '🦍',
          readTime: '7 min read',
          category: 'Wildlife',
          slug: 'gorilla-trekking-tips'
        },
        {
          title: 'Best Time to Visit Bwindi',
          description: 'Seasonal guide for optimal weather and wildlife viewing',
          icon: '📅',
          readTime: '5 min read',
          category: 'Planning',
          slug: 'best-time-bwindi'
        },
        {
          title: 'Packing for Forest Trekking',
          description: 'Complete gear checklist for rainforest adventures',
          icon: '🎒',
          readTime: '6 min read',
          category: 'Preparation',
          slug: 'forest-trekking-gear'
        },
        {
          title: 'Conservation & Community',
          description: 'How your visit supports gorilla conservation and local communities',
          icon: '🌍',
          readTime: '8 min read',
          category: 'Conservation',
          slug: 'bwindi-conservation'
        }
      ],
      'queen-elizabeth-national-park': [
        {
          title: 'Tree-Climbing Lions Guide',
          description: 'Where and when to spot the famous tree-climbing lions of Ishasha',
          icon: '🦁',
          readTime: '6 min read',
          category: 'Wildlife',
          slug: 'tree-climbing-lions'
        },
        {
          title: 'Kazinga Channel Safari',
          description: 'Boat cruise tips for the best hippo and elephant viewing',
          icon: '🚤',
          readTime: '5 min read',
          category: 'Activities',
          slug: 'kazinga-channel-guide'
        },
        {
          title: 'Game Drive Strategies',
          description: 'Maximize your wildlife viewing with expert timing and routes',
          icon: '🚙',
          readTime: '7 min read',
          category: 'Safari Tips',
          slug: 'qenp-game-drives'
        },
        {
          title: 'Bird Watching Paradise',
          description: 'Guide to the 600+ bird species in Queen Elizabeth',
          icon: '🦅',
          readTime: '9 min read',
          category: 'Birding',
          slug: 'qenp-birding-guide'
        }
      ],
      'jinja': [
        {
          title: 'White Water Rafting Safety',
          description: 'What to expect and how to prepare for Nile rapids',
          icon: '🚣',
          readTime: '6 min read',
          category: 'Adventure',
          slug: 'nile-rafting-safety'
        },
        {
          title: 'Source of the Nile History',
          description: 'The fascinating story of the Nile\'s discovery',
          icon: '📚',
          readTime: '8 min read',
          category: 'History',
          slug: 'source-nile-history'
        },
        {
          title: 'Jinja Adventure Activities',
          description: 'Complete guide to bungee jumping, quad biking, and more',
          icon: '🏃',
          readTime: '10 min read',
          category: 'Activities',
          slug: 'jinja-adventure-guide'
        },
        {
          title: 'Cultural Experiences',
          description: 'Connect with Basoga culture and local communities',
          icon: '🎭',
          readTime: '7 min read',
          category: 'Culture',
          slug: 'jinja-cultural-guide'
        }
      ]
    };

    // Default insights for all destinations
    const defaultInsights: Insight[] = [
      {
        title: `Travel Tips for ${destinationName}`,
        description: `Essential advice for visiting ${destinationName} in Uganda`,
        icon: '💡',
        readTime: '5 min read',
        category: 'Travel Tips',
        slug: 'travel-tips'
      },
      {
        title: 'Best Time to Visit',
        description: 'Seasonal guide for optimal weather and activities',
        icon: '🌤️',
        readTime: '4 min read',
        category: 'Planning',
        slug: 'best-time-to-visit'
      },
      {
        title: 'Cultural Etiquette',
        description: 'Respectful travel practices and local customs',
        icon: '🤝',
        readTime: '6 min read',
        category: 'Culture',
        slug: 'cultural-etiquette'
      },
      {
        title: 'Safety & Health Guide',
        description: 'Important safety tips and health recommendations',
        icon: '🏥',
        readTime: '7 min read',
        category: 'Safety',
        slug: 'safety-health-guide'
      }
    ];

    return insightMap[slug] || defaultInsights;
  };

  const insights = getDestinationInsights(destinationSlug);

  return (
    <section className="travel-insights" id="travel-insights-section">
      <div className="content-section">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Travel Insights for {destinationName}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Expert tips, local knowledge, and essential information to make your {destinationName} experience unforgettable
          </p>
          <Link 
            href="/travel-guide"
            className="inline-block bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
          >
            View Complete Travel Guide →
          </Link>
        </div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, index) => (
            <Link
              key={index}
              href={`/travel-guide/${insight.slug}`}
              className="block group"
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-hover-effect h-full">
                {/* Insight Icon */}
                <div 
                  className="h-32 flex items-center justify-center text-5xl"
                  style={{ backgroundColor: `${primaryColor}10` }}
                >
                  <span aria-hidden="true">{insight.icon}</span>
                </div>
                
                <div className="p-6">
                  {/* Category and Read Time */}
                  <div className="flex justify-between items-center mb-3">
                    <span 
                      className="px-3 py-1 text-xs font-semibold rounded-full"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {insight.category}
                    </span>
                    <span className="text-xs text-gray-500">{insight.readTime}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-[#195e48] transition-colors line-clamp-2">
                    {insight.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {insight.description}
                  </p>
                  
                  {/* Read More Button */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-semibold group-hover:text-[#195e48] transition-colors"
                      style={{ color: primaryColor }}
                    >
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Featured Tip */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Expert Tip</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-6">
              The best way to experience {destinationName} is to connect with local communities and respect the natural environment. 
              Our guides are passionate locals who will share hidden gems and cultural insights you won't find in guidebooks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-[#195e48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
              >
                Get Local Expert Advice
              </Link>
              <Link
                href="/about"
                className="border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
              >
                Meet Our Team
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🏛️</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Local Culture</h4>
            <p className="text-gray-600 text-sm">
              Respect local customs and traditions for a meaningful cultural exchange
            </p>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🌿</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Eco-Friendly</h4>
            <p className="text-gray-600 text-sm">
              Travel sustainably and contribute to conservation efforts in Uganda
            </p>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl mb-3">🛡️</div>
            <h4 className="font-bold text-lg text-gray-900 mb-2">Safe Travel</h4>
            <p className="text-gray-600 text-sm">
              Follow safety guidelines and travel with experienced local guides
            </p>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 text-center bg-[#195e48] text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Travel Tips</h3>
          <p className="text-lg mb-6 opacity-90">
            Get the latest travel insights, destination guides, and exclusive tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-3 rounded-xl text-gray-900 flex-1"
            />
            <button className="bg-white text-[#195e48] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelInsights;
