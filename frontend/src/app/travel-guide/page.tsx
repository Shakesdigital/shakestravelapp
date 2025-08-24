import React from 'react';
import Link from 'next/link';
import Hero from '@/components/TravelGuide/Hero';
import GuideAccordion from '@/components/TravelGuide/GuideAccordion';
import Image from 'next/image';

export const metadata = {
  title: 'Uganda Travel Guide | Eco-Friendly Adventures & Expert Tips | Shake\'s Travel',
  description: 'Complete Uganda travel guide with expert tips, destination guides, cultural insights, and sustainable adventure planning. Discover gorilla trekking, Nile rafting, and eco-friendly experiences.',
  keywords: 'Uganda travel guide, gorilla trekking, Nile rafting, eco-tourism, sustainable travel, Bwindi Forest, Queen Elizabeth Park, Jinja adventures',
  openGraph: {
    title: 'Uganda Travel Guide | Eco-Friendly Adventures',
    description: 'Expert travel guide for sustainable adventures in Uganda. Gorilla trekking, cultural experiences, and eco-friendly tourism.',
    images: ['/images/uganda-hero.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Uganda Travel Guide | Eco-Friendly Adventures',
    description: 'Expert travel guide for sustainable adventures in Uganda',
    images: ['/images/uganda-hero.jpg'],
  },
};

const TravelGuidePage: React.FC = () => {
  const primaryColor = '#195e48';

  const guides = [
    {
      id: 'northern-uganda',
      title: 'Northern Uganda — Safaris & Wildlife',
      content: (
        <>
          <p>
            Northern Uganda offers unique savannah ecosystems, exceptional birding and big-game safaris. Highlights include Kidepo Valley National Park and nearby communities.
          </p>
          <ul>
            <li>Best time: December to February, June to August</li>
            <li>Key activities: Game drives, birdwatching, cultural visits</li>
            <li>How to get there: Fly via Entebbe or shared road transfers</li>
          </ul>
        </>
      )
    },
    {
      id: 'south-west-uganda',
      title: 'South West — Gorilla Trekking & Highlands',
      content: (
        <>
          <p>
            Home to Bwindi Impenetrable Forest and Mgahinga, this region is the gateway to gorilla trekking and coffee-farm stays.
          </p>
          <ul>
            <li>Permits: Book permits well in advance</li>
            <li>Accommodation: Eco-lodges & community camps</li>
            <li>Health: Yellow fever vaccination recommended</li>
          </ul>
        </>
      )
    },
    {
      id: 'central-uganda',
      title: 'Central — Kampala & Culture',
      content: (
        <>
          <p>
            Experience Kampala's markets, museums and vibrant food scene. Ideal for short stays and cultural immersion.
          </p>
          <ul>
            <li>Local customs: Dress modestly in rural areas</li>
            <li>Transport: Taxis, boda-bodas, and matatus for short hops</li>
            <li>Safety: Keep valuables secure in busy areas</li>
          </ul>
        </>
      )
    }
  ];

  const travelTips = [
    {
      id: 'packing',
      title: 'Packing Tips',
      content: (
        <>
          <p>Bring lightweight quick-dry clothing, sturdy walking shoes, a rain jacket, sunscreen, and insect repellent.</p>
          <p>Consider a portable water filter and biodegradable toiletries to reduce waste.</p>
        </>
      )
    },
    {
      id: 'visas',
      title: 'Visas & Entry Requirements',
      content: (
        <>
          <p>Most visitors can obtain an e-visa prior to arrival. Ensure your passport is valid for at least 6 months.</p>
        </>
      )
    },
    {
      id: 'safety',
      title: 'Safety & Health',
      content: (
        <>
          <p>Carry a basic first-aid kit, follow guide instructions around wildlife, and drink bottled or purified water.</p>
        </>
      )
    }
  ];

  const itineraries = [
    {
      id: '7-day-gorilla-safari',
      title: '7-Day Gorilla & Wildlife',
      days: '7 days',
      excerpt: 'Combine gorilla trekking in Bwindi with safari time in Queen Elizabeth National Park.'
    },
    {
      id: '5-day-rafting-adventure',
      title: '5-Day Nile Rafting & Adventure',
      days: '5 days',
      excerpt: 'White water rafting in Jinja, with cultural experiences and relaxation on Lake Victoria.'
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "name": "Uganda Travel Guide",
    "description": "Complete guide to eco-friendly adventures in Uganda including gorilla trekking, Nile rafting, and cultural experiences",
    "url": "https://shakestravel.com/travel-guide",
    "publisher": {
      "@type": "Organization",
      "name": "Shake's Travel",
      "logo": {
        "@type": "ImageObject",
        "url": "https://shakestravel.com/logo.png"
      }
    },
    "mainEntity": [
      {
        "@type": "Place",
        "name": "Northern Uganda",
        "description": "Savannah ecosystems, wildlife safaris, and Kidepo Valley National Park"
      },
      {
        "@type": "Place", 
        "name": "South West Uganda",
        "description": "Gorilla trekking in Bwindi Impenetrable Forest and Mgahinga National Parks"
      },
      {
        "@type": "Place",
        "name": "Central Uganda", 
        "description": "Kampala culture, markets, museums, and local experiences"
      }
    ],
    "mentions": [
      {
        "@type": "TouristAttraction",
        "name": "Bwindi Impenetrable Forest",
        "description": "UNESCO World Heritage site for mountain gorilla trekking"
      },
      {
        "@type": "TouristAttraction", 
        "name": "Source of the Nile",
        "description": "White water rafting and adventure sports in Jinja"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="min-h-screen bg-white">
        <Hero />

        {/* Uganda Destinations Showcase */}
        <section id="guides" className="landing-section bg-gray-50" aria-labelledby="guides-heading">
          <div className="content-section">
            <header className="text-center mb-16">
              <h2 id="guides-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Uganda by Region
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From northern savannas to southwestern highlands, each region offers unique experiences and breathtaking landscapes
              </p>
            </header>

            <GuideAccordion items={guides.map(g => ({ id: g.id, title: g.title, content: g.content }))} />
          </div>
        </section>

        {/* Travel Tips */}
        <section id="tips" className="landing-section bg-white">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Essential Travel Tips</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to know for a safe, sustainable, and memorable journey through Uganda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {travelTips.map((tip, index) => (
                <div key={tip.id} className="bg-white rounded-2xl shadow-lg card-hover-effect overflow-hidden border border-gray-100">
                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      index === 0 ? 'bg-green-100' : index === 1 ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      {index === 0 && (
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{tip.title}</h3>
                    <div className="text-gray-600 leading-relaxed">{tip.content}</div>
                    <Link href={`/travel-guide/${tip.id}`} className="mt-6 inline-flex items-center gap-2 text-[#195e48] font-semibold hover:gap-3 transition-all duration-200">
                      Learn more
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggested Itineraries */}
        <section id="itineraries" className="landing-section bg-gray-50">
          <div className="content-section">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Suggested Itineraries</h2>
                <p className="text-xl text-gray-600">
                  Expert-designed adventures tailored for different interests and time frames
                </p>
              </div>
              <Link 
                href="/trip-planner" 
                className="hidden md:block btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Create Custom Plan
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {itineraries.map((it, index) => (
                <article key={it.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect">
                  <div className="relative h-48 bg-gray-100">
                    <Image 
                      src={`/images/itinerary-${it.id}.jpg`} 
                      alt={`${it.title} image`} 
                      fill 
                      sizes="(min-width:1024px) 50vw, 100vw" 
                      style={{ objectFit: 'cover' }} 
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {it.days}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">{it.title}</h3>
                    <p className="text-gray-600 mb-4">{it.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                        {index === 0 ? 'Wildlife' : 'Adventure'}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Eco-friendly
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold" style={{ color: primaryColor }}>$499</span>
                        <span className="text-gray-500 ml-1">per person</span>
                      </div>
                      <Link 
                        href={`/itinerary/${it.id}`} 
                        className="btn-primary text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                        style={{ backgroundColor: primaryColor }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12 md:hidden">
              <Link 
                href="/trip-planner" 
                className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ backgroundColor: primaryColor }}
              >
                Create Custom Plan
              </Link>
            </div>
          </div>
        </section>

        {/* Travel Insights / Articles */}
        <section id="articles" className="landing-section bg-white">
            <div className="content-section">
              <div className="flex justify-between items-center mb-16">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Travel Insights</h2>
                  <p className="text-xl text-gray-600">
                    Expert tips and comprehensive guides for your perfect Uganda adventure
                  </p>
                </div>
                <Link 
                  href="/travel-guide/articles" 
                  className="hidden md:block btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  View All Guides
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Link
                  href="/travel-guide/gorilla-trekking-guide"
                  className="bg-gray-50 rounded-2xl overflow-hidden card-hover-effect"
                >
                  <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: `${primaryColor}10` }}>
                    🦍
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                        Wildlife Guide
                      </span>
                      <span className="text-sm text-gray-500">5 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Gorilla Trekking: What to Expect</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">From permits to packing, plan your trek with confidence.</p>
                  </div>
                </Link>
                
                <Link
                  href="/travel-guide/rafting-jinja"
                  className="bg-gray-50 rounded-2xl overflow-hidden card-hover-effect"
                >
                  <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: `${primaryColor}10` }}>
                    🚣‍♂️
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        Adventure Guide
                      </span>
                      <span className="text-sm text-gray-500">7 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">White Water Rafting in Jinja</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Safety tips, best seasons and what to bring for the rapids.</p>
                  </div>
                </Link>
                
                <Link
                  href="/travel-guide/culture-etiquette"
                  className="bg-gray-50 rounded-2xl overflow-hidden card-hover-effect"
                >
                  <div className="h-48 flex items-center justify-center text-6xl" style={{ backgroundColor: `${primaryColor}10` }}>
                    🤝
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        Cultural Guide
                      </span>
                      <span className="text-sm text-gray-500">6 min read</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Etiquette & Experiences</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">How to travel respectfully and connect with local communities.</p>
                  </div>
                </Link>
              </div>
              
              <div className="text-center mt-12 md:hidden">
                <Link 
                  href="/travel-guide/articles" 
                  className="btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  View All Guides
                </Link>
              </div>
            </div>
        </section>
      </main>
    </>
  );
};

export default TravelGuidePage;
