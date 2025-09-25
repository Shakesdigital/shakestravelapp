import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Sustainable East Africa Adventures | Shake\'s Travel',
  description: 'Welcome to Shakes Travel, a Uganda-based travel agency dedicated to inspiring meaningful travel experiences that showcase East Africa\'s stunning natural beauty through our flagship Planting Green Paths Initiative.',
  keywords: 'about Shakes Travel, East Africa travel company, Uganda Kenya Tanzania Rwanda, sustainable tourism, eco-friendly adventures, team, mission, values',
  openGraph: {
    title: 'About Shake\'s Travel | Sustainable East Africa Adventures',
    description: 'East Africa\'s premier eco-friendly adventure travel company committed to sustainable tourism and conservation across Uganda, Kenya, Tanzania, and Rwanda.',
    images: ['/images/team-uganda.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Shake\'s Travel | Sustainable East Africa Adventures',
    description: 'East Africa\'s premier eco-friendly adventure travel company',
    images: ['/images/team-uganda.jpg'],
  },
};

const AboutPage: React.FC = () => {
  const primaryColor = '#195e48';

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Nakato',
      role: 'Founder & CEO',
      bio: 'Born and raised in Kampala, Sarah founded Shake\'s Travel with a vision to showcase East Africa\'s natural beauty while supporting local communities across all four countries.',
      image: '👩🏿‍💼',
      expertise: ['Sustainable Tourism', 'Regional Development', 'Conservation'],
      experience: '12+ years',
      region: 'Uganda'
    },
    {
      id: 2,
      name: 'James Okello',
      role: 'Head Guide & Wildlife Expert',
      bio: 'With over 15 years guiding experience across East Africa, James specializes in gorilla trekking, safari expeditions, and cross-border wildlife experiences.',
      image: '👨🏿‍🌾',
      expertise: ['Gorilla Trekking', 'Safari Leadership', 'Regional Navigation'],
      experience: '15+ years',
      region: 'Uganda/Rwanda'
    },
    {
      id: 3,
      name: 'Amara Kiprotich',
      role: 'Kenya Operations Manager',
      bio: 'Based in Nairobi, Amara coordinates our Kenya experiences, from Maasai Mara safaris to coastal adventures, ensuring authentic Kenyan hospitality.',
      image: '👩🏿‍💼',
      expertise: ['Safari Operations', 'Cultural Experiences', 'Coastal Tourism'],
      experience: '10+ years',
      region: 'Kenya'
    },
    {
      id: 4,
      name: 'Zawadi Mwalimu',
      role: 'Tanzania Regional Director',
      bio: 'Leading our Tanzania operations from Arusha, Zawadi brings expertise in Kilimanjaro climbs, Serengeti expeditions, and Zanzibar cultural tours.',
      image: '👨🏿‍🎆',
      expertise: ['Mountain Climbing', 'Safari Logistics', 'Island Tourism'],
      experience: '12+ years',
      region: 'Tanzania'
    },
    {
      id: 5,
      name: 'Marie Uwimana',
      role: 'Rwanda Conservation Specialist',
      bio: 'Based in Kigali, Marie focuses on Rwanda\'s conservation tourism, gorilla trekking programs, and sustainable community initiatives.',
      image: '👩🏿‍🔬',
      expertise: ['Gorilla Conservation', 'Community Tourism', 'Sustainable Practices'],
      experience: '8+ years',
      region: 'Rwanda'
    },
    {
      id: 6,
      name: 'David Musisi',
      role: 'Regional Conservation Officer',
      bio: 'Environmental scientist passionate about East Africa\'s ecosystems, David leads our region-wide tree planting and conservation initiatives.',
      image: '👨🏿‍🔬',
      expertise: ['Environmental Science', 'Regional Reforestation', 'Cross-Border Conservation'],
      experience: '10+ years',
      region: 'East Africa'
    }
  ];

  const companyValues = [
    {
      icon: '🌱',
      title: 'Environmental Conservation',
      description: 'Through strategic tree planting and reforestation, every trip with us actively restores East Africa\'s natural ecosystems and leaves a greener, more vibrant footprint.'
    },
    {
      icon: '🤝',
      title: 'Local Community Partnership',
      description: 'We collaborate with authentic local providers across East Africa, ensuring our tours benefit communities while delivering exceptional, culturally immersive experiences.'
    },
    {
      icon: '🦍',
      title: 'Wildlife Conservation',
      description: 'We support cross-border wildlife protection through responsible tourism, contributing to regional conservation funds and habitat preservation.'
    },
    {
      icon: '✨',
      title: 'Meaningful Travel Experiences',
      description: 'Our journeys immerse travelers in East Africa\'s stunning natural beauty, vibrant cultures, and diverse landscapes, creating transformative adventures with purpose.'
    },
    {
      icon: '🛡️',
      title: 'Safety & Quality',
      description: 'Your safety is our priority across all four countries. We maintain the highest standards in equipment, guides, and emergency preparedness.'
    },
    {
      icon: '💚',
      title: 'Sustainable Tourism Mission',
      description: 'We are committed to sustainable tourism that actively restores natural ecosystems while fostering deep, responsible connections with East Africa\'s people and places.'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Emily Thompson',
      location: 'Canada',
      rating: 5,
      text: 'Shake\'s Travel gave us the most incredible gorilla trekking experience. The guides were knowledgeable and the commitment to conservation was evident throughout.',
      trip: 'Gorilla Trekking Adventure'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      location: 'United States',
      rating: 5,
      text: 'Amazing cultural immersion! The community visits were authentic and respectful. You can tell this company truly cares about Uganda and its people.',
      trip: 'Cultural Village Experience'
    },
    {
      id: 3,
      name: 'Sophie Mitchell',
      location: 'United Kingdom',
      rating: 5,
      text: 'The tree planting program was a highlight of our trip. It felt great knowing our travel was contributing to environmental conservation in Uganda.',
      trip: 'Eco-Adventure Package'
    }
  ];

  const partners = [
    { name: 'Uganda Wildlife Authority', logo: '🦁', description: 'Official conservation partner' },
    { name: 'Tree Uganda', logo: '🌳', description: 'Reforestation initiatives' },
    { name: 'Local Communities Network', logo: '🏘️', description: 'Community development' },
    { name: 'Conservation International', logo: '🌍', description: 'Global conservation support' }
  ];

  const milestones = [
    { year: '2012', title: 'Founded', description: 'Shake\'s Travel established with a focus on sustainable tourism' },
    { year: '2015', title: 'First Green Initiative', description: 'Launched tree planting program with local communities' },
    { year: '2018', title: '10,000 Trees Planted', description: 'Reached milestone of 10,000 trees planted across Uganda' },
    { year: '2020', title: 'COVID Support', description: 'Supported local communities through pandemic challenges' },
    { year: '2022', title: 'Carbon Neutral', description: 'Achieved 100% carbon neutral operations' },
    { year: '2024', title: '50,000+ Trees', description: 'Surpassed 50,000 trees planted, expanding conservation impact' }
  ];

  // Structured data for SEO - defined statically to avoid hydration issues
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Shake's Travel",
    "description": "Uganda's premier eco-friendly adventure travel company",
    "url": "https://shakestravel.com/about",
    "logo": "https://shakestravel.com/brand_assets/images/logo/logo.png",
    "foundingDate": "2012",
    "founder": {
      "@type": "Person",
      "name": "Sarah Nakato"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "UG",
      "addressLocality": "Kampala",
      "addressRegion": "Central Region"
    },
    "sameAs": [
      "https://facebook.com/shakestravel",
      "https://instagram.com/shakestravel"
    ],
    "employee": [
      {
        "@type": "Person",
        "name": "Sarah Nakato",
        "jobTitle": "Founder & CEO",
        "description": "Born and raised in Kampala, Sarah founded Shake's Travel with a vision to showcase Uganda's natural beauty while supporting local communities."
      },
      {
        "@type": "Person",
        "name": "James Okello",
        "jobTitle": "Head Guide & Wildlife Expert",
        "description": "With over 15 years guiding experience, James specializes in gorilla trekking and wildlife safaris across Uganda's national parks."
      },
      {
        "@type": "Person",
        "name": "Mary Atim",
        "jobTitle": "Community Relations Manager",
        "description": "Mary bridges the gap between travelers and local communities, ensuring authentic cultural experiences that benefit everyone."
      },
      {
        "@type": "Person",
        "name": "David Musisi",
        "jobTitle": "Conservation Officer",
        "description": "Environmental scientist passionate about Uganda's ecosystems, David leads our tree planting and conservation initiatives."
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
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden py-20">
          {/* Background with team imagery */}
          <div 
            className="absolute inset-0 hero-carousel transition-all duration-1000"
            style={{ 
              background: `linear-gradient(135deg, rgba(25, 94, 72, 0.8) 0%, rgba(25, 94, 72, 0.6) 100%), url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMCAwSDEtOTIwVjEwODBIMFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxOTIwIiB5Mj0iMTA4MCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjMTk1ZTQ4Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzJkN2E1ZSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=') center/cover`
            }}
          />
          <div className="absolute inset-0 bg-black opacity-20" aria-hidden="true"></div>
          
          <div className="relative z-10 text-center w-full content-section">
            <div className="mb-8">
              <div className="text-6xl mb-4" aria-hidden="true">🇺🇬 🇰🇪 🇹🇿 🇷🇼</div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                About Shake's Travel
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
A Uganda-based travel agency dedicated to inspiring and crafting meaningful travel and adventure experiences that showcase East Africa's stunning natural beauty, vibrant cultures, and diverse landscapes
              </p>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-center">
                <div className="text-3xl font-bold">12+</div>
                <div className="text-sm opacity-90">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Trees Planted</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">5000+</div>
                <div className="text-sm opacity-90">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm opacity-90">Carbon Neutral</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="landing-section bg-white" aria-labelledby="story-heading">
          <div className="content-section">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="story-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Our Story
                </h2>
                <div className="prose prose-lg text-gray-600 space-y-6">
                  <p>
                    Welcome to Shakes Travel, a Uganda-based travel agency dedicated to inspiring and crafting meaningful travel and adventure experiences that showcase East Africa's stunning natural beauty, vibrant cultures, and diverse landscapes. Our journeys immerse travelers in the heart of East Africa while advancing environmental conservation through our flagship Planting Green Paths Initiative.
                  </p>
                  <p>
                    We are committed to sustainable tourism that actively restores East Africa's natural ecosystems. Through strategic tree planting and reforestation, every trip leaves a greener, more vibrant footprint. At the core of our mission, we deliver exceptional travel experiences across iconic East African destinations—Maasai Mara, Amboseli, Serengeti, Zanzibar, Volcanoes National Park, and Bwindi—rooted in local insight and authentic partnerships with community tour providers.
                  </p>
                  <p>
                    We collaborate with local providers to offer meticulously planned safaris, convenient tourist accommodations, and immersive cultural and historical tours that highlight the region's rich heritage. Our eco-friendly services, including green travel options with tree planting initiatives and expert travel consultation, ensure unforgettable journeys while fostering deep, responsible connections with East Africa's people and places.
                  </p>
                </div>
                <Link 
                  href="/trips" 
                  className="mt-8 inline-flex items-center gap-2 btn-primary text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                  style={{ backgroundColor: primaryColor }}
                >
                  Explore Our Adventures
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {/* Story Timeline */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Journey</h3>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div 
                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="landing-section bg-gray-50" aria-labelledby="mission-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="mission-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                To inspire and craft meaningful travel and adventure experiences that showcase East Africa's stunning natural beauty while advancing environmental conservation through our flagship Planting Green Paths Initiative, creating transformative journeys that preserve the wild beauty of East Africa with purpose
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover-effect text-center">
                <div className="text-6xl mb-6">🌍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Planting Green Paths Initiative</h3>
                <p className="text-gray-600">
                  Through the Planting Green Paths Initiative, we combat deforestation and restore fragile habitats across East Africa's tourist and adventure destinations. A portion of every booking directly funds the planting of a tree seedling, ensuring that every traveler contributes to conservation.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover-effect text-center">
                <div className="text-6xl mb-6">🤝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Local Partnerships</h3>
                <p className="text-gray-600">
                  We collaborate with local providers to offer meticulously planned safaris, convenient tourist accommodations, and immersive cultural and historical tours. Our authentic partnerships with community tour providers ensure meaningful connections with East Africa's people and places.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover-effect text-center">
                <div className="text-6xl mb-6">💚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ecosystem Restoration</h3>
                <p className="text-gray-600">
                  By choosing Shakes Travel, you help us plant trees that preserve biodiversity, stabilize ecosystems, and safeguard East Africa's natural beauty for future generations. Every journey leaves a greener, more vibrant footprint.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="landing-section bg-white" aria-labelledby="team-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="team-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our passionate team of East African natives and conservation experts from across Uganda, Kenya, Tanzania, and Rwanda who make every adventure unforgettable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <article key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover-effect">
                  <div 
                    className="h-48 flex items-center justify-center text-6xl"
                    style={{ backgroundColor: `${primaryColor}10` }}
                  >
                    {member.image}
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{member.name}</h3>
                    <div 
                      className="text-sm font-semibold mb-3 px-3 py-1 rounded-full inline-block"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {member.role}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-500 mb-2">EXPERTISE</div>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">Experience</span>
                      <span className="font-semibold" style={{ color: primaryColor }}>{member.experience}</span>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Region: </span>{member.region}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section id="values" className="landing-section bg-gray-50" aria-labelledby="values-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="values-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The principles that guide everything we do, from planning your adventure to supporting local communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {companyValues.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg card-hover-effect">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="landing-section bg-white" aria-labelledby="testimonials-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="testimonials-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                What Travelers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real experiences from adventurers who've discovered Uganda with us
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <article key={testimonial.id} className="bg-gray-50 rounded-2xl p-8 card-hover-effect">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center rating-stars mr-2">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                    <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                  </div>
                  
                  <blockquote className="text-gray-700 italic mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <footer>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 mb-2">{testimonial.location}</div>
                    <div 
                      className="text-xs font-medium px-3 py-1 rounded-full inline-block"
                      style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                    >
                      {testimonial.trip}
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="landing-section bg-gray-50" aria-labelledby="partners-heading">
          <div className="content-section">
            <div className="text-center mb-16">
              <h2 id="partners-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Partners
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Working together with leading organizations to maximize our conservation and community impact
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partners.map((partner, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-md card-hover-effect">
                  <div className="text-5xl mb-4">{partner.logo}</div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{partner.name}</h3>
                  <p className="text-sm text-gray-600">{partner.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 text-white" style={{ backgroundColor: primaryColor }}>
          <div className="content-section text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Explore East Africa?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Join us for transformative East African adventures where every journey preserves the wild beauty of East Africa with purpose. Experience our flagship Planting Green Paths Initiative and discover iconic destinations like Maasai Mara, Serengeti, Zanzibar, and Bwindi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/trips" 
                className="bg-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
                style={{ color: primaryColor }}
              >
                🌟 Browse Adventures
              </Link>
              <Link 
                href="/contact" 
                className="about-cta-secondary border-2 border-white text-white text-lg font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                💬 Get In Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default AboutPage;