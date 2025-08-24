'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQsProps {
  destinationName: string;
  destinationSlug: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQs: React.FC<FAQsProps> = ({ destinationName, destinationSlug }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0); // First FAQ open by default
  const primaryColor = '#195e48';

  // Get destination-specific FAQs
  const getDestinationFAQs = (slug: string): FAQ[] => {
    const faqMap: { [key: string]: FAQ[] } = {
      'bwindi-impenetrable-forest': [
        {
          question: 'How long does gorilla trekking take?',
          answer: 'Gorilla trekking can take anywhere from 2-8 hours depending on where the gorillas are located. The trek involves hiking through dense forest terrain, so a moderate level of fitness is recommended.',
          category: 'Activity'
        },
        {
          question: 'What is the best time to visit Bwindi?',
          answer: 'The best time to visit is during the dry seasons: June to August and December to February. During these months, trails are less muddy and wildlife viewing is optimal.',
          category: 'Planning'
        },
        {
          question: 'Do I need a permit for gorilla trekking?',
          answer: 'Yes, a gorilla trekking permit is required and costs $800 per person. Permits should be booked well in advance as only 8 permits per gorilla family are issued daily.',
          category: 'Requirements'
        },
        {
          question: 'What should I pack for the forest trek?',
          answer: 'Essential items include waterproof hiking boots, long pants, long-sleeved shirts, rain jacket, gloves, hat, and insect repellent. A walking stick is recommended for steep terrain.',
          category: 'Preparation'
        },
        {
          question: 'Are there accommodation options near the park?',
          answer: 'Yes, there are various accommodations ranging from luxury lodges to budget guesthouses in nearby communities like Buhoma and Rushaga.',
          category: 'Accommodation'
        },
        {
          question: 'Is it safe to visit Bwindi?',
          answer: 'Yes, Bwindi is safe for tourists. Rangers accompany all trekking groups, and the local communities are welcoming. Follow your guide\'s instructions at all times.',
          category: 'Safety'
        }
      ],
      'queen-elizabeth-national-park': [
        {
          question: 'When is the best time for game drives?',
          answer: 'Early morning (6-9 AM) and late afternoon (4-7 PM) offer the best wildlife viewing opportunities when animals are most active and temperatures are cooler.',
          category: 'Activity'
        },
        {
          question: 'Can I see tree-climbing lions?',
          answer: 'Yes, the Ishasha sector is famous for tree-climbing lions. While sightings aren\'t guaranteed, early morning visits increase your chances of seeing them resting in fig trees.',
          category: 'Wildlife'
        },
        {
          question: 'What animals will I see in the park?',
          answer: 'The park is home to over 95 mammal species including elephants, lions, leopards, hippos, buffalo, and various antelope species, plus over 600 bird species.',
          category: 'Wildlife'
        },
        {
          question: 'Is the Kazinga Channel boat cruise worth it?',
          answer: 'Absolutely! The 2-hour boat cruise offers excellent hippo and elephant viewing, plus diverse birdlife. It\'s one of the park\'s highlights.',
          category: 'Activity'
        },
        {
          question: 'Do I need a 4WD vehicle?',
          answer: 'While not strictly necessary during dry season, a 4WD is recommended for better access to remote areas and comfort during rainy season.',
          category: 'Transportation'
        },
        {
          question: 'Are there cultural activities available?',
          answer: 'Yes, you can visit local fishing villages, experience traditional dances, and learn about the local Bakonzo and other communities around the park.',
          category: 'Culture'
        }
      ],
      'jinja': [
        {
          question: 'Is white water rafting safe for beginners?',
          answer: 'Yes! Professional guides provide comprehensive safety briefings and all necessary equipment. The Nile has rapids suitable for all experience levels.',
          category: 'Safety'
        },
        {
          question: 'What adventure activities are available?',
          answer: 'Jinja offers white water rafting, bungee jumping, kayaking, quad biking, horseback riding, zip-lining, and boat cruises to the Source of the Nile.',
          category: 'Activities'
        },
        {
          question: 'How do I get to Jinja from Kampala?',
          answer: 'Jinja is about 80km east of Kampala, approximately 1.5-2 hours by road. Regular bus services and private transport options are available.',
          category: 'Transportation'
        },
        {
          question: 'What is the Source of the Nile?',
          answer: 'The Source of the Nile is where Lake Victoria begins its journey as the White Nile River. It\'s marked by a commemorative monument and offers beautiful sunset views.',
          category: 'Attractions'
        },
        {
          question: 'When is the best time for water activities?',
          answer: 'Year-round, but the dry seasons (December-February and June-August) offer the most reliable weather conditions for outdoor activities.',
          category: 'Planning'
        },
        {
          question: 'Are there family-friendly activities?',
          answer: 'Yes! Boat cruises, cultural tours, visit to local markets, and gentle river activities are perfect for families with children.',
          category: 'Family'
        }
      ]
    };

    // Default FAQs for all destinations
    const defaultFAQs: FAQ[] = [
      {
        question: `What is the best time to visit ${destinationName}?`,
        answer: `${destinationName} can be visited year-round, but the dry seasons typically offer the best weather conditions for outdoor activities and wildlife viewing.`,
        category: 'Planning'
      },
      {
        question: 'Do I need a visa to visit Uganda?',
        answer: 'Most visitors need a visa to enter Uganda. You can obtain a tourist visa online, at the airport, or through a Ugandan embassy. The visa costs $50 for single entry.',
        category: 'Requirements'
      },
      {
        question: 'What vaccinations do I need?',
        answer: 'Yellow fever vaccination is mandatory. Recommended vaccines include hepatitis A & B, typhoid, and malaria prophylaxis. Consult your doctor before travel.',
        category: 'Health'
      },
      {
        question: 'Is it safe to travel in Uganda?',
        answer: 'Uganda is generally safe for tourists. Follow standard travel precautions, use reputable tour operators, and stay aware of your surroundings.',
        category: 'Safety'
      },
      {
        question: 'What currency is used in Uganda?',
        answer: 'The Ugandan Shilling (UGX) is the local currency. USD is widely accepted for tourism services. ATMs are available in major towns.',
        category: 'Practical'
      },
      {
        question: 'What should I pack for Uganda?',
        answer: 'Pack light, breathable clothing, rain gear, insect repellent, sunscreen, hat, comfortable walking shoes, and any personal medications.',
        category: 'Preparation'
      }
    ];

    return faqMap[slug] || defaultFAQs;
  };

  const faqs = getDestinationFAQs(destinationSlug);

  // Group FAQs by category
  const faqCategories = faqs.reduce((acc, faq, index) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push({ ...faq, originalIndex: index });
    return acc;
  }, {} as { [key: string]: (FAQ & { originalIndex: number })[] });

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="faqs" id="faqs-section">
      <div className="content-section">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Get answers to the most common questions about visiting {destinationName}
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-[#195e48] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
          >
            Ask Our Experts →
          </Link>
        </div>

        {/* FAQ Categories */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {Object.keys(faqCategories).map((category) => (
              <span 
                key={category}
                className="text-xs text-center py-2 px-3 rounded-full text-gray-600"
                style={{ backgroundColor: `${primaryColor}10` }}
              >
                {category}
              </span>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                {/* Question Header */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  aria-expanded={openFAQ === index}
                >
                  <div className="flex items-center space-x-4">
                    <span 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-lg pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span 
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {faq.category}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                        openFAQ === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5">
                    <div className="pl-12 pr-8">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
          <div className="text-5xl mb-4">❓</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Our local experts are here to help you plan the perfect trip to {destinationName}. Get personalized advice and insider tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-[#195e48] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#164439] transition-colors"
            >
              Contact Our Experts
            </Link>
            <Link
              href="/travel-guide"
              className="border-2 border-[#195e48] text-[#195e48] px-8 py-3 rounded-xl font-semibold hover:bg-[#195e48] hover:text-white transition-colors"
            >
              Browse Travel Guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
