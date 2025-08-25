import React from 'react';
import Navbar from '@/components/Layout/Navbar';
import HeroGallery from '@/components/Destinations/HeroGallery';
import DestinationDescription from '@/components/Destinations/DestinationDescription';
import AdventureExperiences from '@/components/Destinations/AdventureExperiences';
import Accommodations from '@/components/Destinations/Accommodations';
import TravelInsights from '@/components/Destinations/TravelInsights';
import FAQs from '@/components/Destinations/FAQs';
import Testimonials from '@/components/Destinations/Testimonials';

const DestinationPage: React.FC = () => {
  return (
    <div className="destination-page">
      <Navbar />
      <main className="content-container mx-auto px-4 sm:px-2">
        <HeroGallery />
        <DestinationDescription />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <AdventureExperiences />
          <Accommodations />
          <TravelInsights />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <FAQs />
          <Testimonials />
        </div>
      </main>
    </div>
  );
};

export default DestinationPage;
