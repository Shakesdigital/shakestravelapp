
import React from 'react';
import Hero from '@/components/ContactUs/Hero';
import ContactForm from '@/components/ContactUs/ContactForm';
import OfficeInfo from '@/components/ContactUs/OfficeInfo';
import Map from '@/components/ContactUs/Map';
import FAQAccordion from '@/components/ContactUs/FAQAccordion';
import SocialMediaLinks from '@/components/ContactUs/SocialMediaLinks';

const ContactUsPage: React.FC = () => {
  return (
    <div className="contact-us-page">
      <Hero />
      <div className="content-section">
        <ContactForm />
        <OfficeInfo />
        <Map />
        <FAQAccordion />
        <SocialMediaLinks />
      </div>
    </div>
  );
};

export default ContactUsPage;
