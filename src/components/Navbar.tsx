import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { content } from '../content';
import { useHeroPast } from './useHeroPast';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  pastHero?: boolean;
}

// Frosted-glass look shared by every pill. These are inline styles on purpose.
// IMPORTANT: no ancestor of a glass pill may have opacity < 1, filter, mask or
// clip-path, otherwise backdrop-filter has nothing to blur. The header wrapper
// therefore animates ONLY a transform (y). Opacity is animated on each pill itself.
const GLASS: React.CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)',
  backdropFilter: 'blur(22px) saturate(160%)',
  WebkitBackdropFilter: 'blur(22px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.16)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(255,255,255,0.04), 0 8px 30px rgba(0,0,0,0.25)',
};

const TEXT_SHADOW = '0 1px 8px rgba(0,0,0,0.28)';
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

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
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When the app is ready and we are at the hero, make the header visible so the entrance is seen
  useEffect(() => {
    if (appReady && !pastHero) {
      setIsHeaderVisible(true);
    } else if (pastHero) {
      setMobileMenuOpen(false);
    }
  }, [appReady, pastHero]);

  // Close the mobile dropdown on outside click or Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Hidden only AFTER the exit animation finishes
  const handleAnimationComplete = (definition: unknown) => {
    if (definition === 'hidden' && (!appReady || pastHero)) {
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

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wrapper: transform only (no opacity, no filter), so backdrop-filter on the pills keeps working.
  const headerVariants: Variants = {
    shown: {
      y: 0,
      transition: isReducedMotion
        ? { duration: 0.15 }
        : { duration: 0.45, ease: EASE_OUT, delayChildren: 0.08, staggerChildren: 0.08 },
    },
    hidden: {
      y: isReducedMotion ? 0 : -24,
      transition: isReducedMotion
        ? { duration: 0.15 }
        : { duration: 0.3, ease: EASE_IN, staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  // Each pill fades on its own (opacity on the glass element itself is fine)
  const pillVariants: Variants = {
    shown: {
      opacity: 1,
      transition: { duration: isReducedMotion ? 0.15 : 0.45, ease: EASE_OUT },
    },
    hidden: {
      opacity: 0,
      transition: { duration: isReducedMotion ? 0.15 : 0.25, ease: EASE_IN },
    },
  };

  const isHeaderActive = appReady && !pastHero;
  const pointer = isHeaderActive ? 'pointer-events-auto' : 'pointer-events-none';
  const focusRing =
    'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]';

  return (
    <motion.header
      initial={false}
      animate={isHeaderActive ? 'shown' : 'hidden'}
      variants={headerVariants}
      onAnimationComplete={handleAnimationComplete}
      role="banner"
      aria-label="Top Navigation"
      aria-hidden={!isHeaderActive}
      inert={!isHeaderActive ? true : undefined}
      className="fixed top-[24px] md:top-[30px] left-0 right-0 mx-auto w-[calc(100%-32px)] max-w-[1100px] h-[52px] z-50 pointer-events-none"
      style={{ visibility: isHeaderVisible ? 'visible' : 'hidden' }}
    >
      <div className="w-full h-full flex items-center gap-2">
        {/* PILL 1: logo tile */}
        <motion.button
          type="button"
          variants={pillVariants}
          onClick={handleLogoClick}
          aria-label="Appsian Home"
          style={GLASS}
          className={`${pointer} ${focusRing} w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex items-center justify-center cursor-pointer select-none transition-colors duration-200 hover:border-white/30`}
        >
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
            <div className="w-full h-full bg-[#0E0F13] rounded-[7px] flex items-center justify-center">
              <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
            </div>
          </div>
        </motion.button>

        {/* PILL 2: navigation links (desktop) */}
        <motion.nav
          variants={pillVariants}
          aria-label="Main Navigation"
          style={GLASS}
          className={`${pointer} flex-1 h-[52px] rounded-[14px] hidden min-[900px]:flex items-center justify-evenly px-3`}
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              style={{ textShadow: TEXT_SHADOW }}
              className={`${focusRing} px-[14px] py-[8px] rounded-[10px] font-sans text-[15px] font-medium tracking-[-0.01em] text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-[180ms] select-none`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, '#pricing')}
            style={{ textShadow: TEXT_SHADOW }}
            className={`${focusRing} px-[14px] py-[8px] rounded-[10px] font-sans text-[15px] font-medium tracking-[-0.01em] text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-[180ms] select-none`}
          >
            {nav.loginLabel}
          </a>
        </motion.nav>

        {/* Spacer on small screens so the CTA sits on the right */}
        <div className="flex-1 min-[900px]:hidden" />

        {/* PILL 3: CTA (underlined label + mint arrow square) */}
        <motion.div
          variants={pillVariants}
          style={GLASS}
          className={`${pointer} h-[52px] rounded-[14px] flex items-center p-[6px] min-[900px]:pl-[22px] min-[900px]:gap-[18px]`}
        >
          <button
            type="button"
            onClick={handleCtaClick}
            style={{ textShadow: TEXT_SHADOW }}
            className={`${focusRing} hidden min-[900px]:inline-flex items-center font-sans text-[15px] font-medium text-white underline underline-offset-4 decoration-1 decoration-white/70 hover:decoration-white cursor-pointer select-none`}
          >
            Get Free Demo
          </button>
          <button
            type="button"
            onClick={handleCtaClick}
            aria-label="Get Free Demo"
            className={`${focusRing} group w-[40px] h-[40px] min-w-[40px] rounded-[10px] bg-[#6EEDC2] flex items-center justify-center cursor-pointer transition-all duration-200 hover:brightness-110 active:scale-[0.96] shadow-[0_2px_10px_rgba(110,237,194,0.3)]`}
          >
            <ArrowUpRight
              size={18}
              strokeWidth={2.5}
              className="text-[#062B20] transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
            />
          </button>
        </motion.div>

        {/* Mobile menu button pill */}
        <motion.button
          ref={menuButtonRef}
          type="button"
          variants={pillVariants}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          style={GLASS}
          className={`${pointer} ${focusRing} w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex min-[900px]:hidden items-center justify-center cursor-pointer transition-colors duration-200 hover:border-white/30`}
        >
          {mobileMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </motion.button>
      </div>

      {/* Mobile dropdown (glass) */}
      <AnimatePresence>
        {mobileMenuOpen && isHeaderActive && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-label="Mobile navigation"
            style={GLASS}
            className="absolute top-[62px] left-0 right-0 rounded-[18px] p-3 flex flex-col gap-1 pointer-events-auto min-[900px]:hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="w-full h-12 px-4 rounded-[10px] flex items-center font-sans text-[15px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={(e) => handleScrollTo(e, '#pricing')}
              className="w-full h-12 px-4 rounded-[10px] flex items-center font-sans text-[15px] font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors"
            >
              {nav.loginLabel}
            </a>
            <div className="pt-2 mt-1 border-t border-white/10">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full h-[46px] rounded-[10px] bg-[#6EEDC2] text-[#062B20] font-sans font-semibold text-[15px] flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Get Free Demo</span>
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
