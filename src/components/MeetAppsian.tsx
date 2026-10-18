import { AppsianMark } from './AppsianLogo';
import { SectionTag } from './SectionTag';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MeetAppsianProduct, TABS, type TabType } from './MeetAppsianProduct';

export const MeetAppsian: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Books the estimate');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-advance tabs every 4 seconds unless hovered or user clicked
  useEffect(() => {
    if (hasUserInteracted || isHovered) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TABS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex];
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [hasUserInteracted, isHovered]);

  const handleTabClick = (tab: TabType) => {
    setHasUserInteracted(true);
    setActiveTab(tab);
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FFFFFF] pt-[96px] pb-[112px] overflow-hidden select-none"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. FAINT FRAME LINES & RADIAL WASH */}
      {/* 1100px centered frame boundary with two 1px vertical lines */}
      <div className="absolute inset-x-0 top-0 bottom-0 max-w-[1100px] mx-auto pointer-events-none">
        <div
          className="absolute left-0 top-0 bottom-0 w-[1px]"
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[1px]"
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
        />
      </div>

      {/* Two 1px horizontal lines at 40px below top and 40px above bottom */}
      <div
        className="absolute left-0 right-0 top-[40px] h-[1px] pointer-events-none"
        style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
      />
      <div
        className="absolute left-0 right-0 bottom-[40px] h-[1px] pointer-events-none"
        style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
      />

      {/* Soft faint lighter-blue radial wash behind headline (5% opacity, no visible edges) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(59, 130, 246, 0.06), transparent 70%)',
        }}
      />

        {/* Main content wrapper */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* 2. TEXT BLOCK (Eyebrow, Headline, Subline) */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-[850px] mx-auto"
        >
          {/* Eyebrow Pill */}
          <SectionTag label="Product Overview" icon="layout-grid" className="mb-4" />

          {/* Headline: Solid #2D283C, font-display, font-light (300), matching site section headers */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-display font-light text-[#2D283C] tracking-[-0.03em] leading-[1.15] text-balance">
            Meet
            <span className="inline-flex items-center align-middle gap-2 px-2.5 py-1 rounded-[10px] bg-white border border-[#2D283C]/10 shadow-xs mx-2">
              <AppsianMark size={22} />
              <span className="font-medium text-[#2D283C] text-[18px] sm:text-[20px] tracking-tight">
                Appsian
              </span>
            </span>
            <br className="hidden sm:inline" />
            the AI phone agent that answers every call and books the job
          </h2>

          {/* 3. SUBLINE */}
          <motion.p
            initial={isReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[15px] sm:text-[17px] leading-[26px] text-[#5B5F68] max-w-xl mx-auto font-normal text-balance"
          >
            Appsian picks up when you can&apos;t. It qualifies the caller and puts the estimate on your calendar.
          </motion.p>
        </motion.div>

        {/* 4. TAB PILLS ROW */}
        <div
          className="mt-10 relative flex justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mask container: Row only has linear-gradient mask fading both edges */}
          <div
            className="w-full max-w-[860px] overflow-x-auto no-scrollbar py-2"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 min-w-max px-8">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    initial={isReducedMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: isReducedMotion ? 0 : 0.2 + idx * 0.04,
                      ease: 'easeOut',
                    }}
                    className={`h-[36px] px-4 rounded-full text-[14px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                      isActive
                        ? 'bg-[#DBEAFE] text-[#1E3A8A] shadow-xs'
                        : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]'
                    }`}
                    style={{
                      fontFamily: 'inherit',
                    }}
                  >
                    {tab}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. PRODUCT MOCKUP (dashboard + Appsian's work) lives in MeetAppsianProduct.tsx */}
        <MeetAppsianProduct
          activeTab={activeTab}
          isReducedMotion={isReducedMotion}
          onHover={setIsHovered}
        />
      </div>
    </section>
  );
};
