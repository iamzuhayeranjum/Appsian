import React, { useState, useEffect, useRef } from 'react';
import { TopHeader } from './components/TopHeader';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { WorkflowsSection } from './components/WorkflowsSection';
import { ToolverseSection } from './components/ToolverseSection';
import { CustomersSection } from './components/CustomersSection';
import { ResourcesSection } from './components/ResourcesSection';
import { BottomDock } from './components/BottomDock';
import { Footer } from './components/Footer';
import { CallSimulatorModal } from './components/CallSimulatorModal';

export default function App() {
  const [pastHero, setPastHero] = useState(false);
  const [activeSection, setActiveSection] = useState('services');
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [callerInfo, setCallerInfo] = useState({
    name: 'Marcus Vance',
    trade: 'Plumbing & Drainage',
    phone: '(555) 019-2834',
  });

  const heroRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Scroll detection for pastHero and Scroll-spy
  useEffect(() => {
    const handleScroll = () => {
      // 1. Detect if scrolled past hero
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        // Trigger switch when hero bottom scrolls past the top 120px
        const isPast = heroBottom < 120;
        setPastHero(isPast);
      }

      // 2. Scroll-spy for navigation sections
      const sections = ['services', 'workflows', 'toolverse', 'customers', 'resources'];
      const scrollPos = window.scrollY + 250;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CTA Click handler: smooth-scroll to the hero demo bar and focus its Name field
  const handleCtaClick = () => {
    const demoBar = document.getElementById('hero-demo-bar');
    if (demoBar) {
      demoBar.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Focus Name field after smooth scroll begins
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 450);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCallSimulator = (name?: string, trade?: string, phone?: string) => {
    setCallerInfo({
      name: name || 'Marcus Vance',
      trade: trade || 'Plumbing & Drainage',
      phone: phone || '(555) 019-2834',
    });
    setSimulatorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f1f3f7] relative selection:bg-[#6EEDC2]/30 selection:text-[#6EEDC2]">
      {/* 
        Top Header: Fixed at top 16px, frosted glass over dark hero curtain.
        Slides away and fades when scrolled past hero, returns when scrolling back up.
      */}
      <TopHeader
        pastHero={pastHero}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onCtaClick={handleCtaClick}
      />

      {/* Main Page Content */}
      <main>
        {/* Hero Section with dark curtain background and demo bar */}
        <Hero
          ref={heroRef}
          nameInputRef={nameInputRef}
          onOpenCallSimulator={handleOpenCallSimulator}
        />

        {/* Section 1: Services */}
        <ServicesSection />

        {/* Section 2: Workflows */}
        <WorkflowsSection />

        {/* Section 3: Toolverse */}
        <ToolverseSection />

        {/* Section 4: Customers */}
        <CustomersSection />

        {/* Section 5: Resources (Interactive ROI Calculator) */}
        <ResourcesSection onCtaClick={handleCtaClick} />
      </main>

      {/* Footer */}
      <Footer
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onNavigate={handleNavigate}
      />

      {/* 
        Bottom Dock: Slides up smoothly when scrolled past hero.
        Slides away when scrolling back into hero view.
      */}
      <BottomDock
        visible={pastHero}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onBookDemo={handleCtaClick}
        onOpenCallSimulator={() => handleOpenCallSimulator()}
        onScrollToRoi={() => handleNavigate('resources')}
      />

      {/* Live AI Receptionist Call Simulation Modal */}
      <CallSimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        callerName={callerInfo.name}
        callerTrade={callerInfo.trade}
        callerPhone={callerInfo.phone}
      />
    </div>
  );
}
