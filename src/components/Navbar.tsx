import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    if (onBookDemoClick) {
      onBookDemoClick();
    } else {
      const heroDemoForm = document.getElementById('hero-demo-name');
      if (heroDemoForm) {
        heroDemoForm.focus();
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
      className="absolute top-0 left-0 right-0 w-full z-50 pointer-events-none"
    >
      {/* Plain full-width bar (72px desktop, 64px mobile, transparent background) */}
      <div className="w-full h-[64px] lg:h-[72px] px-5 lg:px-[clamp(20px,2.4vw,40px)] flex items-center justify-between relative pointer-events-auto">
        
        {/* LEFT: Logo Lockup */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-[10px] cursor-pointer select-none border-0 bg-transparent p-0 text-left group"
          aria-label="Appsian Home - Scroll to top"
        >
          <div className="transition-transform duration-200 group-hover:scale-105">
            <AppsianMark width={28} height={23} />
          </div>
          <span className="text-[20px] font-semibold tracking-[-0.01em] text-[#0B0F19] leading-none">
            Appsian
          </span>
        </button>

        {/* CENTER: The three links centered on the PAGE (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-[40px] absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="group relative py-1 text-[15px] font-normal text-[#1F2937] hover:text-[#0B0F19] transition-colors duration-200 select-none whitespace-nowrap"
            >
              <span>{link.label}</span>
              {/* 1px underline that animates in from the left on hover */}
              <span
                className="absolute left-0 bottom-[-2px] w-full h-[1px] bg-[#0B0F19] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out pointer-events-none"
                aria-hidden="true"
              />
            </a>
          ))}
        </nav>

        {/* RIGHT: Desktop CTA (underlined text link + 40px mint arrow button) */}
        <div className="hidden lg:flex items-center gap-[12px]">
          <button
            type="button"
            onClick={handleCtaClick}
            className="text-[15px] font-normal text-[#0B0F19] underline underline-offset-[5px] decoration-1 decoration-[#0B0F19] hover:opacity-75 transition-opacity cursor-pointer border-0 bg-transparent p-0 select-none"
          >
            Get Free Demo
          </button>
          
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-[40px] h-[40px] min-w-[40px] rounded-[10px] bg-[#6EEDC2] flex items-center justify-center cursor-pointer border-0 shadow-none transition-transform duration-160 ease-out hover:-translate-y-[2px] hover:translate-x-[2px] active:scale-95 select-none"
            aria-label="Get Free Demo"
          >
            <ArrowUpRight className="w-[18px] h-[18px] stroke-[2] text-[#0B0F19]" />
          </button>
        </div>

        {/* RIGHT: Tablet & Mobile controls (Mint button + 2-line menu button) */}
        <div className="flex lg:hidden items-center gap-2.5">
          <button
            type="button"
            onClick={handleCtaClick}
            className="w-[40px] h-[40px] min-w-[40px] rounded-[10px] bg-[#6EEDC2] flex items-center justify-center cursor-pointer border-0 shadow-none active:scale-95"
            aria-label="Get Free Demo"
          >
            <ArrowUpRight className="w-[18px] h-[18px] stroke-[2] text-[#0B0F19]" />
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-[40px] h-[40px] min-w-[40px] rounded-[10px] border border-[rgba(15,23,42,0.12)] bg-transparent flex items-center justify-center cursor-pointer transition-colors hover:bg-slate-50 active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="#0B0F19"
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
              className="absolute right-5 top-[68px] z-50 w-[240px] bg-white rounded-[16px] shadow-[0_12px_32px_rgba(15,23,42,0.12)] p-2 border border-slate-100 flex flex-col"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-4 py-3 rounded-[10px] text-[16px] font-medium text-[#1F2937] hover:bg-slate-50 hover:text-[#0B0F19] transition-colors select-none"
                >
                  {link.label}
                </a>
              ))}
              
              <div className="h-[1px] bg-slate-100 my-1" />

              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full px-4 py-3 rounded-[10px] text-[15px] font-semibold text-[#0B0F19] bg-[#6EEDC2] hover:bg-[#5FE2B5] transition-colors flex items-center justify-between cursor-pointer border-0 mt-0.5"
              >
                <span>Get Free Demo</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
};
