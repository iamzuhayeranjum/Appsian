import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { content } from '../content';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  // Kept so App.tsx can keep passing it. The header does not react to it:
  // it sits in the notch at the top of the hero box and scrolls away with the hero.
  pastHero?: boolean;
}

// Page background colour. The notch is cut out of the hero box in this exact colour,
// so it must match the hero's outer frame colour (#F5F6F8).
const PAGE_GRAY = '#F5F6F8';

// Dark frosted-glass pills. They sit on the light notch, so they get a dark tint
// with a thin light edge and white text. Inline on purpose.
// No ancestor of a pill may have opacity < 1, filter, mask or clip-path (it would
// stop backdrop-filter). Only the pills themselves animate.
const GLASS_DARK: React.CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(38,40,52,0.82) 0%, rgba(12,13,18,0.92) 100%)',
  backdropFilter: 'blur(18px) saturate(140%)',
  WebkitBackdropFilter: 'blur(18px) saturate(140%)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow:
    'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.35), 0 6px 18px rgba(12,14,24,0.16)',
};

const TEXT_SHADOW = '0 1px 6px rgba(0,0,0,0.35)';
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FILLET = 18; // px, size of the concave corners where the notch meets the box edge

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
    'focus-visible:outline-2 focus-visible:outline-[#6EEDC2] focus-visible:outline-offset-[3px]';
  const linkClass = `${focusRing} px-5 py-2 rounded-[10px] font-sans text-[15px] font-medium tracking-[-0.01em] text-white/90 hover:text-white hover:bg-white/10 transition-colors duration-[180ms] select-none whitespace-nowrap`;

  return (
    // absolute (NOT fixed): the notch belongs to the top of the page and scrolls away with the hero.
    <header
      role="banner"
      aria-label="Top Navigation"
      aria-hidden={!appReady}
      inert={!appReady ? true : undefined}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      {/*
        THE NOTCH: a page-coloured tab cut out of the top-centre of the rounded hero box.
        The hero box starts 8px (mobile) / 14px (md+) below the top of the page, so the notch is
        (frame + 70px) tall: it merges with the page-coloured frame above and dips 70px into the box.
      */}
      <div
        className="relative h-[78px] md:h-[84px] px-3 pt-[17px] md:pt-[23px] rounded-b-[26px] pointer-events-none"
        style={{ backgroundColor: PAGE_GRAY }}
      >
        {/* Concave corners: smooth fillets where the notch meets the top edge of the box */}
        <span
          aria-hidden="true"
          className="absolute top-[8px] md:top-[14px] pointer-events-none"
          style={{
            right: 'calc(100% - 1px)',
            width: FILLET,
            height: FILLET,
            background: `radial-gradient(circle at 0 100%, transparent ${FILLET - 0.5}px, ${PAGE_GRAY} ${FILLET}px)`,
          }}
        />
        <span
          aria-hidden="true"
          className="absolute top-[8px] md:top-[14px] pointer-events-none"
          style={{
            left: 'calc(100% - 1px)',
            width: FILLET,
            height: FILLET,
            background: `radial-gradient(circle at 100% 100%, transparent ${FILLET - 0.5}px, ${PAGE_GRAY} ${FILLET}px)`,
          }}
        />

        {/* Three separate dark-glass pills inside the notch */}
        <div className="flex items-center gap-2 h-[52px]">
          {/* PILL 1: logo tile */}
          <motion.button
            type="button"
            custom={0}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
            onClick={handleLogoClick}
            aria-label="Appsian Home"
            style={GLASS_DARK}
            className={`${pointer} ${focusRing} w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex items-center justify-center cursor-pointer select-none transition-colors duration-200 hover:border-white/25`}
          >
            <div className="w-7 h-7 rounded-[8px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#0E0F13] rounded-[7px] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
              </div>
            </div>
          </motion.button>

          {/* PILL 2: menu pill (desktop only), sized to its content */}
          <motion.nav
            custom={1}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
            aria-label="Main Navigation"
            style={GLASS_DARK}
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

          {/* PILL 3: CTA (underlined label + mint arrow square) */}
          <motion.div
            custom={2}
            variants={pillVariants}
            initial="hidden"
            animate={appReady ? 'shown' : 'hidden'}
            style={GLASS_DARK}
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

          {/* Mobile menu button pill (under 900px) */}
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
            style={GLASS_DARK}
            className={`${pointer} ${focusRing} w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex min-[900px]:hidden items-center justify-center cursor-pointer transition-colors duration-200 hover:border-white/25`}
          >
            {mobileMenuOpen ? (
              <X size={20} className="text-white" />
            ) : (
              <Menu size={20} className="text-white" />
            )}
          </motion.button>
        </div>

        {/* Mobile dropdown (dark glass), opens under the notch */}
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
              style={GLASS_DARK}
              className="absolute top-full mt-2 right-0 w-[min(88vw,320px)] rounded-[18px] p-3 flex flex-col gap-1 pointer-events-auto min-[900px]:hidden shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
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
      </div>
    </header>
  );
};
