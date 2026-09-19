import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroSection } from '../components/landing/HeroSection';
import { CanvasMockupSection } from '../components/landing/CanvasMockupSection';
import { CapabilitiesSection } from '../components/landing/CapabilitiesSection';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { TestimonialSection } from '../components/landing/TestimonialSection';
import { CtaSection } from '../components/landing/CtaSection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface antialiased">
      <Navbar />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-16rem)]">
        <HeroSection />
        <CanvasMockupSection />
        <CapabilitiesSection />
        <WorkflowSection />
        <TestimonialSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
