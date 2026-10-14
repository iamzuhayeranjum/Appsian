import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { content } from '../content';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  // Kept so App.tsx can keep passing it. The header no longer reacts to it:
  // it sits at the top of the page and simply scrolls away with the hero.
  pastHero?: boolean;
}

// Frosted-glass look shared by every pill (inline on purpose).
// No ancestor of a glass pill may have opacity < 1, filter, mask or clip-path,
// otherwise backdrop-filter has nothing to blur. Only the pills themselves animate.
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

export const Navbar: React.FC<NavbarProps> = ({ onBookDemoClick }) => {
  const appReady = useAppReady();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

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

  // Entrance only (after the preloader). Each pill fades in on its own, staggered.
  const pillVariants: Variants = {
    hidden: { opacity: 0, y: isReducedMotion ? 0 : -10 },
    shown: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: isReducedMotion
        ? { duration: 0.15 }
        : { duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.08 },
    }),
  };

  const pointer = appReady ? 'pointer-events-auto' : 'pointer-events-none';
  const focusRing =
    'focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]';
  const linkClass = `${focusRing} px-5 py-2 rounded-[10px] font-sans text-[15px] font-medium tracking-[-0.01em] text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-[180ms] select-none whitespace-nowrap`;

  return (
    // absolute (NOT fixed): the header belongs to the top of the page, it does not float.
    // It scrolls away together with the hero, and the bottom dock takes over after the hero.
    <header
      role="banner"
      aria-label="Top Navigation"
      aria-hidden={!appReady}
      inert={!appReady ? true : undefined}
      className="absolute top-4 left-0 right-0 mx-auto w-[calc(100%-32px)] max-w-[1100px] h-[52px] z-50 pointer-events-none"
    >
      <div className="w-full h-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* LEFT: logo tile */}
        <div className="justify-self-start">
          <motion.button
            type="button"
            custom={0}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
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
        </div>

        {/* CENTER: compact menu pill (desktop only), sized to its content */}
        <motion.nav
          custom={1}
          variants={pillVariants}
          initial="hidden"
          animate={appReady ? 'shown' : 'hidden'}
          aria-label="Main Navigation"
          style={GLASS}
          className={`${pointer} hidden min-[900px]:flex items-center justify-center gap-1 h-[52px] px-2 rounded-[14px]`}
        >
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              style={{ textShadow: TEXT_SHADOW }}
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
        </motion.nav>
        {/* keeps the grid centered on small screens where the menu pill is hidden */}
        <div className="min-[900px]:hidden" />

        {/* RIGHT: CTA pill + mobile menu button */}
        <div className="justify-self-end flex items-center gap-2">
          <motion.div
            custom={2}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
            style={GLASS}
            className={`${pointer} h-[52px] rounded-[14px] flex items-center p-[6px] min-[900px]:pl-[22px] min-[900px]:gap-[18px]`}
          >
            <button
              type="button"
              onClick={handleCtaClick}
              style={{ textShadow: TEXT_SHADOW }}
              className={`${focusRing} hidden min-[900px]:inline-flex items-center font-sans text-[15px] font-medium text-white underline underline-offset-4 decoration-1 decoration-white/70 hover:decoration-white cursor-pointer select-none whitespace-nowrap`}
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

          <motion.button
            ref={menuButtonRef}
            type="button"
            custom={2}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
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
      </div>

      {/* Mobile dropdown (glass) */}
      <AnimatePresence>
        {mobileMenuOpen && appReady && (
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
    </header>
  );
};
