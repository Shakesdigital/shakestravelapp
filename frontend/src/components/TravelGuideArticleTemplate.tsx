'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleSection {
  id: string;
  title: string;
  content: string;
}

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface RelatedAccommodation {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  image: string;
  features: string[];
  description: string;
}

interface RelatedTrip {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  duration: string;
  difficulty: string;
  image: string;
  highlights: string[];
}

interface RelatedArticle {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  category: string;
}

interface ArticleData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  heroImages: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  metadata: {
    author: string;
    publishDate: string;
    readTime: string;
    category: string;
    tags: string[];
  };
  tableOfContents?: TableOfContentsItem[];
  sections: ArticleSection[];
  relatedAccommodations?: RelatedAccommodation[];
  relatedTrips?: RelatedTrip[];
  relatedArticles?: RelatedArticle[];
}

interface TravelGuideArticleTemplateProps {
  articleData: ArticleData;
}

const TravelGuideArticleTemplate: React.FC<TravelGuideArticleTemplateProps> = ({ articleData }) => {
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  const primaryColor = '#195e48';
  
  // Auto-advance hero carousel
  useEffect(() => {
    if (articleData.heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroImage(prev => (prev + 1) % articleData.heroImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [articleData.heroImages.length]);

  // Handle scroll spy for table of contents
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of articleData.sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleData.sections]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      const yOffset = -100; // Account for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.title,
    "description": articleData.description,
    "author": {
      "@type": "Organization",
      "name": articleData.metadata.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Shakes Travel Uganda"
    },
    "datePublished": articleData.metadata.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-end justify-center text-white overflow-hidden">
          {/* Hero Image Carousel */}
          <div className="absolute inset-0">
            {articleData.heroImages.map((heroImage, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentHeroImage ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    background: `linear-gradient(135deg, rgba(25, 94, 72, 0.6) 0%, rgba(25, 94, 72, 0.4) 100%)`
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-30" />
              </div>
            ))}
          </div>
          
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
            <div className="max-w-4xl">
              {/* Breadcrumb */}
              <nav className="mb-6" aria-label="Breadcrumb">
                <div className="flex items-center text-sm">
                  <Link href="/" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    Home
                  </Link>
                  <svg className="w-4 h-4 mx-2 text-white opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href="/travel-guide" className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    Travel Guide
                  </Link>
                  <svg className="w-4 h-4 mx-2 text-white opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white opacity-80">{articleData.title}</span>
                </div>
              </nav>

              {/* Article Meta */}
              <div className="flex items-center gap-4 mb-4">
                <span 
                  className="px-3 py-1 text-sm font-semibold rounded-full bg-white bg-opacity-20 backdrop-blur-sm"
                >
                  {articleData.metadata.category}
                </span>
                <span className="text-sm opacity-90">{articleData.metadata.readTime}</span>
                <span className="text-sm opacity-90">{new Date(articleData.metadata.publishDate).toLocaleDateString()}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {articleData.title}
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                {articleData.subtitle}
              </p>
            </div>
          </div>
          
          {/* Hero Navigation */}
          {articleData.heroImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentHeroImage(prev => 
                  prev === 0 ? articleData.heroImages.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentHeroImage(prev => 
                  (prev + 1) % articleData.heroImages.length
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 rounded-full p-3 hover:bg-opacity-30 transition-all duration-200"
                aria-label="Next image"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Hero Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {articleData.heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentHeroImage(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentHeroImage ? 'bg-white opacity-100' : 'bg-white opacity-50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Main Content */}
        <div className="content-section relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 py-12">
            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Mobile TOC Toggle */}
                <button
                  onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                  className="lg:hidden w-full mb-4 p-3 bg-gray-100 rounded-lg text-left font-semibold flex items-center justify-between"
                >
                  <span>Table of Contents</span>
                  <svg 
                    className={`w-5 h-5 transform transition-transform ${isSidebarVisible ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* TOC Content */}
                <div className={`bg-white rounded-xl border border-gray-200 p-4 ${isSidebarVisible || 'lg:block'} ${!isSidebarVisible && 'hidden'}`}>
                  <h3 className="font-bold text-base text-gray-900 mb-3">Table of Contents</h3>
                  <nav>
                    <ul className="space-y-1">
                      {(articleData.tableOfContents || articleData.sections)?.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => scrollToSection(item.id)}
                            className={`block w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${
                              activeSection === item.id
                                ? 'font-semibold text-white'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                            style={{
                              backgroundColor: activeSection === item.id ? primaryColor : undefined,
                              paddingLeft: articleData.tableOfContents && 'level' in item ? `${item.level * 6 + 8}px` : undefined
                            }}
                          >
                            {item.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              </div>
            </aside>

            {/* Article Content */}
            <main className="lg:col-span-4">
              <article className="max-w-none">
                {/* Introduction */}
                <div className="mb-8">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {articleData.description}
                  </p>
                </div>

                {/* Article Sections */}
                <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
                  {articleData.sections.map((section, index) => (
                    <section
                      key={section.id}
                      ref={(el) => {sectionRefs.current[section.id] = el}}
                      className="mb-12"
                    >
                      <h2 
                        className="text-2xl md:text-3xl font-bold mb-6 text-gray-900"
                        style={{ color: primaryColor }}
                      >
                        {section.title}
                      </h2>
                      <div 
                        className="text-gray-700 leading-relaxed [&>*]:max-w-none [&>ul]:max-w-none [&>ol]:max-w-none [&>p]:max-w-none [&>div]:max-w-none [&>table]:max-w-none [&>blockquote]:max-w-none [&>.image-placeholder]:mx-0 [&>.accommodations-embed]:mx-0 [&>.activities-embed]:mx-0"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </section>
                  ))}
                </div>

                {/* Tags */}
                {articleData.metadata.tags && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {articleData.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </main>
          </div>
        </div>


        {/* Related Articles Section */}
        <section className="py-16 bg-gray-50">
          <div className="content-section">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Related Travel Guides
              </h2>
              <p className="text-xl text-gray-600">
                Continue exploring with these handpicked travel insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articleData.relatedArticles.map((article) => (
                <article 
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    className="h-32 flex items-center justify-center text-5xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    <span aria-hidden="true">{article.image}</span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span 
                        className="px-3 py-1 text-xs font-semibold rounded-full"
                        style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Travel Guide
                      </span>
                      <Link
                        href={`/travel-guide/${article.id}`}
                        className="text-sm font-semibold transition-colors"
                        style={{ color: primaryColor }}
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/travel-guide"
                className="btn-outline border-2 px-8 py-3 rounded-xl font-semibold transition-colors"
                style={{ borderColor: primaryColor, color: primaryColor }}
              >
                View All Travel Guides
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TravelGuideArticleTemplate;