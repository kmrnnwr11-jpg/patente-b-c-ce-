import { FC } from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';

export const LandingPage: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#5FB894] via-[#4AA9D0] to-[#3B9ED9]">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};
