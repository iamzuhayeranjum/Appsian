/**
 * Appsian Marketing Website
 * Pixel-for-pixel recreation of UI, UX and animation matching the reference video.
 * @license Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';
import { Hero } from './components/Hero';
import { IntegrationsStrip } from './components/IntegrationsStrip';
import { MissedCallCalculator } from './components/MissedCallCalculator';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorks } from './components/HowItWorks';
import { DarkBand1 } from './components/DarkBand1';
import { TrustRow } from './components/TrustRow';
import { WhyAppsian } from './components/WhyAppsian';
import { GettingStarted } from './components/GettingStarted';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaBand } from './components/FinalCtaBand';
import { Footer } from './components/Footer';
import { VoiceDemoModal } from './components/VoiceDemoModal';

export default function App() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleOpenDemoModal = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemoModal = () => {
    setIsDemoModalOpen(false);
  };

  const handlePlanSelect = (planName: string) => {
    setIsDemoModalOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#2D283C] flex flex-col items-center">
      <Analytics />
      {/* 1. Hero (full viewport height, curtain gradient, flush to top) */}
      <Hero
        onBookDemoClick={handleOpenDemoModal}
        onPlayClick={handleOpenDemoModal}
      />

      {/* 2. Integrations Strip */}
      <IntegrationsStrip />

      {/* Missed-call calculator: The cost of a missed call */}
      <MissedCallCalculator />

      {/* 3. Features (white section with 987px big card & two 485px cards) */}
      <FeaturesSection />

      {/* How it works: problem + animated call flow */}
      <HowItWorks />

      {/* 4. Dark Band 1 (sky-blue curtain variant, 1187px wide) */}
      <DarkBand1 />

      {/* 5. Three-Column Trust Row (1187px wide) */}
      <TrustRow />

      {/* Why Appsian comparison table */}
      <WhyAppsian />

      {/* Getting Started (4-step timeline) */}
      <GettingStarted onSuccessDemo={handleOpenDemoModal} />

      {/* 6. Pricing (1187px wide) */}
      <PricingSection onPlanSelect={handlePlanSelect} />

      {/* 7. Testimonials (dark band 2, 1187px wide) */}
      <TestimonialsSection />

      {/* 8. FAQ (two columns, 28px radius rows) */}
      <FaqSection />

      {/* 9. Final CTA Band (curtain gradient, 1187px wide, 440px tall) */}
      <FinalCtaBand onSuccessDemo={handleOpenDemoModal} />

      {/* 10. Footer (tagline, back-to-top, giant gradient wordmark, legal pill) */}
      <Footer />

      {/* Voice Demo Modal: "Live voice demo goes here" */}
      <VoiceDemoModal
        isOpen={isDemoModalOpen}
        onClose={handleCloseDemoModal}
      />
    </div>
  );
}
