import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { content } from '../content';
import { useHeroPast } from './useHeroPast';
import { useAppReady } from './Preloader';

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
  const appReady = useAppReady();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(appReady && !pastHero);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When app is ready and at hero, make visible immediately so entrance animation is visible
  useEffect(() => {
    if (appReady && !pastHero) {
      setIsHeaderVisible(true);
    } else if (pastHero) {
      setMobileMenuOpen(false);
    }
  }, [appReady, pastHero]);

  // Handle animation complete to toggle visibility: hidden only AFTER exit animation finishes
  const handleAnimationComplete = (definition: string | { opacity?: number }) => {
    const isHiddenDef =
      definition === 'hidden' ||
      (typeof definition === 'object' && definition.opacity === 0);
    if (isHiddenDef && (!appReady || pastHero)) {
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

  const isHeaderActive = appReady && !pastHero;

  const glassStyle: React.CSSProperties = {
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06))',
    backdropFilter: 'blur(22px) saturate(160%)',
    WebkitBackdropFilter: 'blur(22px) saturate(160%)',
    border: '1px solid rgba(255,255,255,0.16)',
    boxShadow:
      'inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 30px rgba(0,0,0,0.25)',
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <motion.header
      initial={false}
      animate={isHeaderActive ? 'shown' : 'hidden'}
      variants={headerVariants}
      onAnimationComplete={handleAnimationComplete}
      aria-label="Top Navigation"
      aria-hidden={!isHeaderActive}
      inert={!isHeaderActive ? true : undefined}
      className="fixed top-0 left-0 right-0 z-50 pt-[15.5px] px-4 pointer-events-none"
      style={{
        visibility: isHeaderVisible ? 'visible' : 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      <div className="max-w-[1180px] w-full mx-auto flex items-center justify-between gap-[12px]">
        {/* Left: 52x52 rounded glass tile with existing Appsian logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={glassStyle}
          className="w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shrink-0 cursor-pointer pointer-events-auto transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
          aria-label="Appsian Home"
        >
          <div className="w-6 h-6 rounded-[6px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0F13] rounded-[5px] flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
            </div>
          </div>
        </a>

        {/* Middle: glass pill with existing nav links, white Inter 15px/500 text */}
        <nav
          style={glassStyle}
          className="hidden md:flex flex-1 h-[52px] rounded-full items-center justify-center gap-7 lg:gap-9 px-6 pointer-events-auto"
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-white hover:text-white/80 transition-colors duration-150 text-[15px] font-[500] whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: glass pill with underlined 'Get Free Demo' label + 40x40 rounded mint square button */}
        <button
          type="button"
          onClick={handleCtaClick}
          style={glassStyle}
          className="hidden md:flex h-[52px] rounded-full pl-6 pr-1.5 items-center gap-3.5 shrink-0 cursor-pointer pointer-events-auto group transition-all duration-150 hover:border-white/30"
        >
          <span className="text-white font-[500] text-[15px] underline underline-offset-4 tracking-tight">
            Get Free Demo
          </span>
          <div className="w-[40px] h-[40px] rounded-[12px] bg-[#6EEDC2] group-hover:bg-[#85f3ce] text-[#062B20] flex items-center justify-center transition-transform duration-150 group-hover:scale-105 active:scale-95 shrink-0 shadow-xs">
            <ArrowUpRight className="w-5 h-5 text-[#062B20] stroke-[2.2]" />
          </div>
        </button>

        {/* Mobile menu button (<768px): glass button opening dropdown */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          style={glassStyle}
          className="flex md:hidden w-[52px] h-[52px] rounded-[16px] items-center justify-center shrink-0 text-white cursor-pointer pointer-events-auto transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Glass Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && !pastHero && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={glassStyle}
            className="md:hidden mt-3 max-w-[1180px] mx-auto rounded-2xl p-4 flex flex-col gap-2 pointer-events-auto shadow-2xl"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-white hover:text-white/80 text-[15px] font-[500] py-2 px-3 rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-2 border-t border-white/[0.12] flex items-center justify-between mt-1">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#062B20] font-[600] text-[15px] transition-all cursor-pointer"
              >
                <span>Get Free Demo</span>
                <ArrowUpRight className="w-4 h-4 text-[#062B20] stroke-[2.2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
