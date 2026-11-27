import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { content } from '../content';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  pastHero?: boolean;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const Navbar: React.FC<NavbarProps> = ({ onBookDemoClick, pastHero = false }) => {
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

  // Close mobile dropdown on outside click or Escape
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

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFocusHeroForm = () => {
    setMobileMenuOpen(false);
    const nameInput = document.getElementById('hero-demo-name') as HTMLInputElement | null;
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        nameInput.focus({ preventScroll: true });
      }, 240);
    } else if (onBookDemoClick) {
      onBookDemoClick();
    }
  };

  const isVisible = appReady && !pastHero;
  const navLinks = content.hero?.nav?.links || [
    { label: 'Product', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How it works', href: '#how-it-works' },
  ];

  return (
    <motion.header
      role="banner"
      aria-label="Top Navigation"
      aria-hidden={!isVisible}
      inert={!isVisible ? true : undefined}
      initial={{ opacity: 0, y: isReducedMotion ? 0 : -8 }}
      animate={
        isVisible
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: isReducedMotion ? 0 : -10 }
      }
      transition={{
        duration: isReducedMotion ? 0.15 : 0.4,
        ease: EASE_OUT,
      }}
      className="fixed top-0 left-0 right-0 w-full z-50 pointer-events-none"
    >
      {/* Floating white top-centered bar */}
      <div className="header-row">
        {/* LEFT: Dark Appsian Logo + Wordmark */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="header-logo-group flex items-center gap-[9px] cursor-pointer select-none border-0 bg-transparent p-0 text-left group focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-[8px]"
          aria-label="Appsian Home - Scroll to top"
        >
          <div className="transition-transform duration-200 group-hover:scale-105">
            <AppsianMark size={24} fill="#0b1530" />
          </div>
          <span className="text-[18px] font-bold tracking-[-0.02em] text-[#0b1530] leading-none">
            Appsian
          </span>
        </button>

        {/* CENTER: Nav links (Desktop 900px+) */}
        <nav aria-label="Main Navigation" className="header-nav">
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              initial={isReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
              animate={
                isVisible
                  ? isReducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0 }
                  : isReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 6 }
              }
              transition={{
                duration: isReducedMotion ? 0.15 : 0.35,
                delay: isReducedMotion ? 0 : 0.08 + index * 0.05,
                ease: EASE_OUT,
              }}
              whileTap={!isReducedMotion ? { y: 1, transition: { duration: 0.1 } } : undefined}
              className="header-nav-link"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        {/* RIGHT: Desktop CTA (Outlined white Login + Dark filled Get Free Demo) */}
        <div className="header-desktop-cta">
          <a
            href="https://dashboard.appsianai.digital/"
            className="h-[38px] px-[16px] rounded-[10px] bg-white text-[#0b1530] border border-[rgba(11,21,48,0.14)] text-[13.5px] font-medium inline-flex items-center justify-center hover:bg-[#f8fafc] hover:border-[rgba(11,21,48,0.26)] transition-colors whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px]"
          >
            Login
          </a>

          <button
            type="button"
            onClick={handleFocusHeroForm}
            className="btn-premium btn-premium--dark h-[38px] px-[16px] rounded-[10px] text-[13.5px] font-semibold text-white inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px]"
          >
            <span>Get Free Demo</span>
            <ArrowRight className="btn-arrow w-[14px] h-[14px] text-white" strokeWidth={2.2} />
          </button>
        </div>

        {/* RIGHT: Mobile & Tablet Hamburger inside white bar (< 900px) */}
        <div className="header-mobile-controls">
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-[38px] h-[38px] min-w-[38px] rounded-[10px] border border-[rgba(11,21,48,0.12)] bg-[#f8fafc] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#f1f5f9] active:scale-95 focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="#0b1530"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="15" y2="6" />
                  <line x1="3" y1="12" x2="15" y2="12" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Card */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
              className="absolute right-0 top-[64px] z-50 w-[250px] bg-white rounded-[18px] shadow-[0_14px_36px_rgba(11,21,48,0.16)] p-2 border border-[rgba(11,21,48,0.08)] flex flex-col"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-4 py-2.5 rounded-[10px] text-[15px] font-medium text-[#0b1530] hover:bg-slate-50 transition-colors select-none"
                >
                  {link.label}
                </a>
              ))}

              <div className="h-[1px] bg-slate-100 my-1.5" />

              <div className="flex flex-col gap-2 p-1">
                <a
                  href="https://dashboard.appsianai.digital/"
                  className="w-full h-[38px] px-4 rounded-[10px] bg-white text-[#0b1530] border border-[rgba(11,21,48,0.14)] text-[14px] font-medium flex items-center justify-center hover:bg-[#f8fafc] transition-colors"
                >
                  Login
                </a>

                <button
                  type="button"
                  onClick={handleFocusHeroForm}
                  className="btn-premium btn-premium--dark w-full h-[38px] px-4 rounded-[10px] text-[14px] font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Get Free Demo</span>
                  <ArrowRight className="btn-arrow w-4 h-4 text-white" strokeWidth={2.2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};
