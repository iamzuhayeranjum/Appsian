import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { content } from '../content';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  pastHero?: boolean;
}

// Light frosted-glass pill style for elements on the light notch
const NAV_GLASS: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.82)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow:
    '0 2px 10px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Page background color that matches the space around the hero box exactly
const PAGE_BG = '#F5F6F8';

export const Navbar: React.FC<NavbarProps> = ({ onBookDemoClick, pastHero = false }) => {
  const appReady = useAppReady();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);

  // Dynamic measurement of the unified header bar (Logo + Nav Links + CTA)
  const [barSize, setBarSize] = useState<{ width: number; height: number }>({
    width: 540,
    height: 48,
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Measure full header bar size to size the notch dynamically
  useLayoutEffect(() => {
    if (!headerBarRef.current) return;

    const measure = () => {
      if (headerBarRef.current) {
        const rect = headerBarRef.current.getBoundingClientRect();
        if (rect.width > 0) {
          setBarSize({
            width: Math.round(rect.width),
            height: Math.round(rect.height) || 48,
          });
        }
      }
    };

    measure();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && headerBarRef.current) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(headerBarRef.current);
    }
    window.addEventListener('resize', measure);

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [appReady]);

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

  // Entrance and hide/show variants tied to appReady and pastHero
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

  const isVisible = appReady && !pastHero;
  const pointer = isVisible ? 'pointer-events-auto' : 'pointer-events-none';
  const focusRing =
    'focus-visible:outline-2 focus-visible:outline-[#111827] focus-visible:outline-offset-[2px]';
  const linkClass = `${focusRing} px-3 md:px-4 py-1.5 md:py-2 rounded-[9px] font-sans text-[13px] md:text-[14px] font-semibold tracking-[-0.01em] text-[#111827] hover:text-black hover:bg-black/[0.05] transition-colors duration-150 select-none whitespace-nowrap`;

  // Geometry calculations for the notch wrapping the complete header bar
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const paddingX = isDesktop ? 22 : 14;
  const paddingBottom = 12;
  const topOffset = isDesktop ? 10 : 8;

  const maxNotchWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 1100;
  const notchWidth = Math.min(barSize.width + paddingX * 2, maxNotchWidth);
  const notchHeight = topOffset + barSize.height + paddingBottom;

  const f = 20; // 20px concave fillets where notch meets hero top edge
  const r = 26; // 26px bottom corner radius
  const o = 4;  // 4px upward overlap into page background so no subpixel seams ever appear

  const svgWidth = notchWidth + 2 * f;
  const svgHeight = notchHeight + o;

  // Exact SVG path with:
  // - Top edge overlap into page background
  // - Left concave fillet (radius f) at the hero top edge
  // - Left vertical wall
  // - Bottom-left convex rounded corner (radius r)
  // - Bottom flat edge
  // - Bottom-right convex rounded corner (radius r)
  // - Right vertical wall
  // - Right concave fillet (radius f) meeting hero top edge
  const pathD = `
    M 0,0
    L 0,${o}
    A ${f},${f} 0 0,1 ${f},${o + f}
    L ${f},${o + notchHeight - r}
    A ${r},${r} 0 0,0 ${f + r},${o + notchHeight}
    L ${f + notchWidth - r},${o + notchHeight}
    A ${r},${r} 0 0,0 ${f + notchWidth},${o + notchHeight - r}
    L ${f + notchWidth},${o + f}
    A ${f},${f} 0 0,1 ${f + notchWidth + f},${o}
    L ${f + notchWidth + f},0
    Z
  `;

  return (
    // Header outermost wrapper is absolutely positioned at the top of the hero box:
    // (top: 8px on mobile, 14px on md, matching hero-box's inset padding)
    <header
      role="banner"
      aria-label="Top Navigation"
      aria-hidden={!isVisible}
      inert={!isVisible ? true : undefined}
      className="absolute top-[8px] md:top-[14px] left-0 right-0 w-full z-50 pointer-events-none"
    >
      {/* 1. HERO NOTCH: Sized to the full header bar, seamless page background fill */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <motion.div
          data-testid="hero-notch"
          initial={{ opacity: 0, y: isReducedMotion ? 0 : -10 }}
          animate={
            isVisible
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: isReducedMotion ? 0 : -10 }
          }
          transition={
            isReducedMotion
              ? { duration: 0.15 }
              : { duration: 0.5, ease: EASE_OUT, delay: 0.1 }
          }
          style={{
            position: 'relative',
            marginTop: `-${o}px`,
          }}
        >
          <svg
            width={svgWidth}
            height={svgHeight}
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            fill={PAGE_BG}
            style={{ display: 'block' }}
          >
            <path d={pathD} fill={PAGE_BG} />
          </svg>
        </motion.div>
      </div>

      {/* 2. UNIFIED HEADER BAR: Logo, Nav Links, and CTA together INSIDE the notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        style={{ paddingTop: `${topOffset}px` }}
      >
        <div
          ref={headerBarRef}
          className="inline-flex items-center gap-2 md:gap-3 pointer-events-auto"
        >
          {/* LEFT: Logo tile - crisp dark tile that pops on the light notch */}
          <motion.button
            type="button"
            custom={0}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={handleLogoClick}
            aria-label="Appsian Home"
            className={`${pointer} ${focusRing} w-[42px] h-[42px] md:w-[46px] md:h-[46px] min-w-[42px] md:min-w-[46px] rounded-[13px] bg-[#0E0F13] border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.12),_inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center cursor-pointer select-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]`}
          >
            <div className="w-6 h-6 md:w-6.5 md:h-6.5 rounded-[8px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[1.5px] flex items-center justify-center">
              <div className="w-full h-full bg-[#0E0F13] rounded-[7px] flex items-center justify-center">
                <div className="w-2 md:w-2.5 h-2 md:h-2.5 rotate-45 border-2 border-[#6EEDC2] rounded-xs" />
              </div>
            </div>
          </motion.button>

          {/* CENTER: Nav links - dark text in a crisp light-gray glass pill */}
          <motion.nav
            custom={1}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            aria-label="Main Navigation"
            style={NAV_GLASS}
            className={`${pointer} hidden min-[680px]:flex items-center justify-center gap-0.5 md:gap-1 h-[42px] md:h-[46px] px-1 md:px-1.5 rounded-[13px]`}
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={linkClass}
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          {/* RIGHT: CTA pill - dark pill with crisp white text and bright accent icon */}
          <motion.div
            custom={2}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={handleCtaClick}
            className={`${pointer} ${focusRing} h-[42px] md:h-[46px] rounded-[13px] bg-[#0E0F13] text-white border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.12),_inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center p-[3px] md:p-[4px] pl-3.5 md:pl-4 gap-2 md:gap-2.5 group cursor-pointer hover:bg-[#1A1C24] transition-colors`}
          >
            <button
              type="button"
              className={`${focusRing} inline-flex items-center font-sans text-[13px] md:text-[14px] font-medium text-white cursor-pointer select-none whitespace-nowrap`}
            >
              Get Free Demo
            </button>
            <div
              aria-hidden="true"
              className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] min-w-[30px] md:min-w-[34px] rounded-[9px] bg-[#6EEDC2] flex items-center justify-center transition-transform duration-200 group-hover:translate-x-[1.5px] group-hover:-translate-y-[1.5px] shadow-[0_2px_6px_rgba(110,237,194,0.3)]"
            >
              <ArrowUpRight
                size={16}
                strokeWidth={2.5}
                className="text-[#062B20]"
              />
            </div>
          </motion.div>

          {/* MOBILE MENU BUTTON (shown when screen is < 680px) */}
          <motion.button
            ref={menuButtonRef}
            type="button"
            custom={3}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={NAV_GLASS}
            className={`${pointer} ${focusRing} w-[42px] h-[42px] md:w-[46px] md:h-[46px] min-w-[42px] md:min-w-[46px] rounded-[13px] flex min-[680px]:hidden items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-white`}
          >
            {mobileMenuOpen ? (
              <X size={18} className="text-[#111827]" />
            ) : (
              <Menu size={18} className="text-[#111827]" />
            )}
          </motion.button>
        </div>

        {/* Mobile dropdown on light glass */}
        <AnimatePresence>
          {mobileMenuOpen && isVisible && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              role="dialog"
              aria-label="Mobile navigation"
              className="absolute top-[64px] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[340px] rounded-[18px] p-3 flex flex-col gap-1 pointer-events-auto bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_20px_40px_rgba(0,0,0,0.18)]"
            >
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="w-full h-11 px-4 rounded-[10px] flex items-center font-sans text-[15px] font-semibold text-[#111827] hover:bg-black/[0.05] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 mt-1 border-t border-black/10">
                <button
                  type="button"
                  onClick={handleCtaClick}
                  className="w-full h-[44px] rounded-[10px] bg-[#0E0F13] text-white font-sans font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A1C24] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Get Free Demo</span>
                  <div className="w-5 h-5 rounded-[5px] bg-[#6EEDC2] flex items-center justify-center text-[#062B20]">
                    <ArrowUpRight size={14} strokeWidth={2.5} />
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
