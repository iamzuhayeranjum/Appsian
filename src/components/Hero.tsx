import React from 'react';
import { motion } from 'motion/react';
import { CurtainBackground } from './CurtainBackground';
import { DashboardMockup } from './DashboardMockup';
import { DemoBar } from './DemoBar';
import { content } from '../content';
import { SectionFade } from './SectionFade';

interface HeroProps {
  onBookDemoClick: () => void;
  onPlayClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookDemoClick, onPlayClick }) => {
  const { hero } = content;

  return (
    <section className="relative w-full h-[1095px] overflow-hidden bg-[#F5F6F7]">
      {/* Hero Background replacement layer: hard-edged panels with tapering bands, hairlines, organic dark top, bottom glow */}
      <CurtainBackground variant="hero" />

      {/* Spacing placeholder maintaining the exact 83px vertical offset so hero content does not shift */}
      <div className="w-full h-[83px]" aria-hidden="true" />

      {/* Hero Copy Container */}
      <div className="max-w-[1187px] mx-auto px-4 pt-12 sm:pt-14 md:pt-[54px] text-center flex flex-col items-center z-10 relative">
        {/* H1 with blur-to-sharp animation: light weight, text-wrap: balance, max-w-[880px] */}
        <motion.h1
          initial={{ opacity: 0, filter: 'blur(20px)', y: 16 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="text-white text-3xl sm:text-4xl md:text-[56px] font-display font-normal tracking-[-0.035em] leading-[1.2] max-w-[880px] mx-auto text-balance"
        >
          {hero.h1}
        </motion.h1>

        {/* Subline: 18px with line-height 29px, white at 70% */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
          animate={{ opacity: 0.7, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/70 text-base sm:text-lg md:text-[18px] leading-[29px] max-w-xl mx-auto mt-3.5 sm:mt-4 font-normal text-balance"
        >
          {hero.subline}
        </motion.p>

        {/* Email Demo Bar: Replaces the two buttons, 32px of space above */}
        <DemoBar onSuccess={onBookDemoClick} />
      </div>

      {/* Dashboard Mockup - starts 518px from top of hero, 987px wide, cut flat at hero's bottom edge (577px visible) */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(16px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-[518px] left-1/2 -translate-x-1/2 w-[987px] max-w-[94vw] z-20"
      >
        <DashboardMockup onPlayClick={onPlayClick} />
      </motion.div>

      {/* Soft blurry dissolve into next section (#F5F6F7) */}
      <SectionFade fadeTo="#F5F6F7" height={200} zIndex={30} />

      {/* 1px sentinel element at the very bottom of the hero for useHeroPast IntersectionObserver */}
      <div
        id="hero-sentinel"
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </section>
  );
};
