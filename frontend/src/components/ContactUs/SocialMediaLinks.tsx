import React from 'react';

const SocialMediaLinks: React.FC = () => {
  return (
    <section className="social-media bg-gray-100 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
      <div className="social-links">
        <a href="https://facebook.com/shakestravel" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://twitter.com/shakestravel" target="_blank" rel="noopener noreferrer">Twitter</a>
        <a href="https://instagram.com/shakestravel" target="_blank" rel="noopener noreferrer">Instagram</a>
      </div>
    </section>
  );
};

export default SocialMediaLinks;
