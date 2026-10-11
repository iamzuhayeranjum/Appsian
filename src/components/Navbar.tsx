import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { content } from '../content';
import { useHeroPast } from './useHeroPast';

interface NavbarProps {
  onBookDemoClick?: () => void;
  pastHero?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onBookDemoClick,
  pastHero: propPastHero,
}) => {
  const hookPastHero = useHeroPast();
  const pastHero = propPastHero !== undefined ? propPastHero : hookPastHero;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(!pastHero);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When returning to hero, make visible immediately so entrance animation is visible
  useEffect(() => {
    if (!pastHero) {
      setIsHeaderVisible(true);
    } else {
      setMobileMenuOpen(false);
    }
  }, [pastHero]);

  // Handle animation complete to toggle visibility: hidden only AFTER exit animation finishes
  const handleAnimationComplete = (definition: string | { opacity?: number }) => {
    const isHiddenDef =
      definition === 'hidden' ||
      (typeof definition === 'object' && definition.opacity === 0);
    if (isHiddenDef && pastHero) {
      setIsHeaderVisible(false);
    }
  };

  const { nav } = content.hero;

  const handleScrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const yOffset = -70;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onBookDemoClick) {
      onBookDemoClick();
      return;
    }
    const demoInput = document.getElementById('demo-name') as HTMLInputElement | null;
    if (demoInput) {
      demoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        demoInput.focus();
      }, 450);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const headerVariants = {
    shown: {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: isReducedMotion
        ? { duration: 0.15 }
        : {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.12,
          },
    },
    hidden: {
      y: isReducedMotion ? 0 : -28,
      opacity: 0,
      filter: isReducedMotion ? 'blur(0px)' : 'blur(8px)',
      transition: isReducedMotion
        ? { duration: 0.15 }
        : {
            duration: 0.3,
            ease: [0.4, 0, 1, 1] as const,
            delay: 0,
          },
    },
  };

  return (
    <motion.header
      initial={false}
      animate={pastHero ? 'hidden' : 'shown'}
      variants={headerVariants}
      onAnimationComplete={handleAnimationComplete}
      aria-label="Top Navigation"
      aria-hidden={pastHero}
      inert={pastHero ? true : undefined}
      className={`fixed top-0 left-0 right-0 z-50 h-[83px] ${
        pastHero ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        visibility: isHeaderVisible ? 'visible' : 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {/* Frosted translucent background */}
      <div className="absolute inset-0 bg-[#0A0B0E]/70 backdrop-blur-md border-b border-white/[0.06] pointer-events-none" />

      <div className="relative max-w-[1187px] h-full mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group select-none"
          aria-label="Appsian Home"
        >
          <div className="w-6 h-6 rounded-[6px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0F13] rounded-[5px] flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
            </div>
          </div>
          <span className="text-white font-[500] text-[15px] tracking-tight font-display">
            {nav.brand}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-white/80 hover:text-white transition-colors duration-150 text-[14px] font-sans font-[500] px-3.5 py-1.5 rounded-[8px] hover:bg-white/[0.06]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, '#pricing')}
            className="text-white/80 hover:text-white transition-colors text-[14px] font-sans font-[500] px-3 py-1.5 rounded-[8px] hover:bg-white/[0.04]"
          >
            {nav.loginLabel}
          </a>

          <button
            type="button"
            onClick={handleCtaClick}
            className="relative px-4 py-2 rounded-[10px] bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#050507] font-sans font-[600] text-[14px] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-[1px] active:translate-y-0 cursor-pointer"
          >
            {nav.ctaLabel}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && !pastHero && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden absolute top-[83px] left-0 right-0 bg-[#0A0B0E]/95 backdrop-blur-xl border-b border-white/[0.1] px-5 py-5 flex flex-col gap-3 shadow-2xl"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-white/90 hover:text-white text-[15px] font-sans font-[500] py-2 px-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 border-t border-white/[0.08] flex flex-col gap-2.5">
              <a
                href="#pricing"
                onClick={(e) => handleScrollTo(e, '#pricing')}
                className="text-white/80 hover:text-white text-[15px] font-sans font-[500] py-2 px-3 rounded-lg hover:bg-white/[0.06] transition-colors"
              >
                {nav.loginLabel}
              </a>

              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full py-2.5 rounded-[10px] bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#050507] font-sans font-[600] text-[15px] shadow-sm text-center transition-all cursor-pointer"
              >
                {nav.ctaLabel}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
