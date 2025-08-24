import React from 'react';

const FAQAccordion: React.FC = () => {
  return (
    <section className="faq bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="accordion">
        <div className="accordion-item">
          <h3 className="accordion-header">What is Shake's Travel?</h3>
          <p className="accordion-content">Shake's Travel is your go-to platform for amazing travel experiences.</p>
        </div>
        <div className="accordion-item">
          <h3 className="accordion-header">How can I contact support?</h3>
          <p className="accordion-content">You can contact us via email at support@shakestravel.com or call us at +1 (555) 123-4567.</p>
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
