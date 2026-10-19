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
        
        {/* LEFT: Logo Lockup (white wordmark and white/bfe0ff gradient logo) */}
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-[10px] cursor-pointer select-none border-0 bg-transparent p-0 text-left group"
          aria-label="Appsian Home - Scroll to top"
        >
          <div className="transition-transform duration-200 group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="260 296 694 569"
              fill="none"
              aria-label="Appsian"
              width={28}
              height={23}
              className="block shrink-0"
            >
              <defs>
                <linearGradient id="appsian-nav-logo-white-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#bfe0ff" />
                </linearGradient>
              </defs>
              <path
                fill="url(#appsian-nav-logo-white-grad)"
                d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
              />
              <path
                fill="url(#appsian-nav-logo-white-grad)"
                d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
              />
            </svg>
          </div>
          <span className="text-[20px] font-semibold tracking-[-0.01em] text-white leading-none">
            Appsian
          </span>
        </button>

        {/* CENTER: The three links centered in one glass-dark pill (Desktop) */}
        <nav
          aria-label="Main Navigation"
          className="glass-dark hidden lg:flex items-center h-[44px] px-[8px] rounded-[16px] absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="px-[16px] h-[34px] flex items-center rounded-[10px] text-[14px] font-medium transition-colors select-none whitespace-nowrap hover:bg-[rgba(255,255,255,0.16)]"
              style={{ color: 'rgba(255, 255, 255, 0.92)' }}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* RIGHT: Desktop CTA (underlined text link in white with 70% underline + 40px light glossy arrow button) */}
        <div className="hidden lg:flex items-center gap-[12px]">
          <button
            type="button"
            onClick={handleCtaClick}
            className="text-[15px] font-normal text-white underline underline-offset-[5px] decoration-1 decoration-[rgba(255,255,255,0.7)] hover:opacity-85 transition-opacity cursor-pointer border-0 bg-transparent p-0 select-none"
          >
            Get Free Demo
          </button>
          
          <button
            type="button"
            onClick={handleCtaClick}
            className="btn-premium btn-premium--light w-[40px] h-[40px] min-w-[40px] rounded-[10px] flex items-center justify-center cursor-pointer select-none text-[#2f6bff] shadow-sm"
            style={{ '--btn-fg': '#2f6bff' } as React.CSSProperties}
            aria-label="Get Free Demo"
          >
            <ArrowUpRight className="btn-arrow-diag w-[18px] h-[18px] stroke-[2.2] text-[#2f6bff]" />
          </button>
        </div>

        {/* RIGHT: Tablet & Mobile controls (Light glossy button + 2-line menu button) */}
        <div className="flex lg:hidden items-center gap-2.5">
          <button
            type="button"
            onClick={handleCtaClick}
            className="btn-premium btn-premium--light w-[40px] h-[40px] min-w-[40px] rounded-[10px] flex items-center justify-center cursor-pointer text-[#2f6bff] shadow-sm"
            style={{ '--btn-fg': '#2f6bff' } as React.CSSProperties}
            aria-label="Get Free Demo"
          >
            <ArrowUpRight className="btn-arrow-diag w-[18px] h-[18px] stroke-[2.2] text-[#2f6bff]" />
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="w-[40px] h-[40px] min-w-[40px] rounded-[10px] border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.12)] backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.2)] active:scale-95"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="#ffffff"
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
                className="btn-premium btn-premium--blue w-full px-4 py-3 rounded-[10px] text-[15px] font-semibold text-white flex items-center justify-between cursor-pointer border-0 mt-0.5"
              >
                <span>Get Free Demo</span>
                <ArrowUpRight className="btn-arrow-diag w-4 h-4 stroke-[2.2] text-white" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
};
