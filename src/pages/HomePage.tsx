import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { ToolGrid } from '../components/home/ToolGrid';
import { HowItWorks } from '../components/home/HowItWorks';
import { PrivacySecurityBanner } from '../components/home/PrivacySecurityBanner';
import { FAQSection } from '../components/home/FAQSection';
import { SEOContentSection } from '../components/home/SEOContentSection';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-4">
      <Hero onSearchChange={setSearchQuery} />
      <ToolGrid searchQuery={searchQuery} />
      <SEOContentSection />
      <HowItWorks />
      <PrivacySecurityBanner />
      <FAQSection />
    </div>
  );
};

