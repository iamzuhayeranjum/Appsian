import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { content } from '../content';
import { useAppReady } from './Preloader';

interface NavbarProps {
  onBookDemoClick?: () => void;
  pastHero?: boolean;
}

// Shared Dark Frosted-Glass style matching reference
const GLASS: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(26,28,38,0.90) 0%, rgba(10,11,16,0.86) 100%)',
  backdropFilter: 'blur(22px) saturate(160%)',
  WebkitBackdropFilter: 'blur(22px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.10)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.03), 0 8px 24px rgba(15,16,24,0.18)',
  borderRadius: '14px',
};
const GLASS_BLOCK = GLASS;
const TEXT_SHADOW = 'none';

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Page background color that matches the space around the hero box exactly
const PAGE_BG = '#FFFFFF';

export const Navbar: React.FC<NavbarProps> = ({ onBookDemoClick, pastHero = false }) => {
  const appReady = useAppReady();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string>('#features');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerBarRef = useRef<HTMLDivElement>(null);

  // Dynamic measurement of the unified header bar (Logo + Nav Links + CTA)
  const [barSize, setBarSize] = useState<{ width: number; height: number }>({
    width: 580,
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
    const heroDemoInput = document.getElementById('hero-demo-name') as HTMLInputElement | null;
    if (heroDemoInput && window.scrollY < window.innerHeight * 0.8) {
      heroDemoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        heroDemoInput.focus();
      }, 450);
      return;
    }
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
    'focus-visible:outline-2 focus-visible:outline-[#4A7FF0] focus-visible:outline-offset-[2px]';

  // Geometry calculations for the notch wrapping the complete header bar
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  const paddingX = 20; // 20px padding each side
  const paddingBottom = 12; // 12px bottom padding
  const topOffset = 12; // 12px top padding

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
          className="inline-flex items-center gap-2 pointer-events-auto"
        >
          {/* 1. LEFT: Logo tile - 48px square (44px on mobile) frosted glass tile with centered Appsian mark in #0B0F19 */}
          <motion.button
            type="button"
            custom={0}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={handleLogoClick}
            aria-label="Appsian Home"
            style={{ ...GLASS_BLOCK, fontFamily: 'inherit' }}
            className={`${pointer} ${focusRing} w-[44px] h-[44px] min-w-[44px] lg:w-[48px] lg:h-[48px] lg:min-w-[48px] rounded-[14px] flex items-center justify-center cursor-pointer select-none transition-all duration-150 ease-out hover:!bg-[rgba(255,255,255,0.75)] active:scale-[0.97]`}
          >
            <div className="flex items-center justify-center shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="260 296 694 569"
                fill="none"
                role="img"
                aria-label="Appsian"
                width={24}
                height={20}
                style={{ display: 'block', flexShrink: 0 }}
              >
                <path
                  fill="#FFFFFF"
                  d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
                />
                <path
                  fill="#FFFFFF"
                  d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
                />
              </svg>
            </div>
          </motion.button>

          {/* 2. CENTER: Nav links pill - 48px height, 14px radius, light glass, 0 28px padding, 36px gap (desktop) */}
          <motion.nav
            custom={1}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            aria-label="Main Navigation"
            style={GLASS_BLOCK}
            className={`${pointer} hidden lg:flex items-center justify-center gap-[36px] h-[48px] px-[28px] rounded-[14px]`}
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  setActiveLink(link.href);
                  handleScrollTo(e, link.href);
                }}
                style={{ fontFamily: 'inherit' }}
                className={`relative py-[6px] px-[10px] rounded-[10px] text-[14px] font-medium text-white/90 transition-all duration-150 select-none whitespace-nowrap ${
                  activeLink === link.href
                    ? 'bg-white/[0.14] text-white'
                    : 'hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.nav>

          {/* 2b. TABLET / MOBILE MENU BUTTON: 44px compact glass menu block with 2-line hamburger icon */}
          <motion.button
            ref={menuButtonRef}
            type="button"
            custom={1}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            style={{ ...GLASS_BLOCK, fontFamily: 'inherit' }}
            className={`${pointer} ${focusRing} w-[44px] h-[44px] min-w-[44px] rounded-[14px] flex lg:hidden items-center justify-center cursor-pointer transition-all duration-150 ease-out hover:brightness-110 active:scale-[0.97]`}
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="14" y2="14" />
                <line x1="14" y1="4" x2="4" y2="14" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="15" y2="6" />
                <line x1="3" y1="12" x2="15" y2="12" />
              </svg>
            )}
          </motion.button>

          {/* 3. RIGHT: CTA block ("Get Free Demo") - 48px height, 14px radius, light glass, underlined text + 36px mint square arrow button */}
          <motion.div
            custom={2}
            variants={pillVariants}
            initial="hidden"
            animate={isVisible ? 'shown' : 'hidden'}
            onClick={handleCtaClick}
            style={{ ...GLASS_BLOCK, fontFamily: 'inherit' }}
            className={`${pointer} ${focusRing} h-[44px] w-[44px] min-w-[44px] p-0 lg:w-auto lg:h-[48px] lg:min-w-0 lg:pl-[20px] lg:pr-[6px] lg:gap-3 rounded-[14px] flex items-center justify-center group cursor-pointer hover:brightness-110 transition-all duration-150 ease-out active:scale-[0.98]`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCtaClick();
              }
            }}
            aria-label="Get Free Demo"
          >
            <span
              style={{
                fontFamily: 'inherit',
                textDecoration: 'underline',
                textDecorationThickness: '1px',
                textUnderlineOffset: '4px',
                textDecorationColor: '#FFFFFF',
              }}
              className="hidden lg:inline text-[14px] font-medium text-white select-none whitespace-nowrap"
            >
              Get Free Demo
            </span>
            <div
              aria-hidden="true"
              className="btn-premium btn-premium--mint w-[36px] h-[36px] min-w-[36px] rounded-[10px] flex items-center justify-center transition-transform duration-150 ease-out group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
            >
              <ArrowUpRight
                size={16}
                strokeWidth={2}
                className="btn-arrow-diag text-[#0B0F19]"
              />
            </div>
          </motion.div>
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
              className="absolute top-[64px] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[340px] rounded-[18px] p-3 flex flex-col gap-1 pointer-events-auto bg-white/95 backdrop-blur-xl border border-black/10 shadow-[0_20px_40px_rgba(20,20,50,0.25)]"
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
                  style={{ ...GLASS_BLOCK, fontFamily: 'inherit' }}
                  className="w-full h-[44px] rounded-[10px] text-white font-medium text-[14px] flex items-center justify-between px-4 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer group"
                >
                  <span className="underline underline-offset-[4px] decoration-1 decoration-white">Get Free Demo</span>
                  <div className="btn-premium btn-premium--mint w-[30px] h-[30px] rounded-[8px] flex items-center justify-center text-[#0B0F19] group-hover:-translate-y-[1px] group-hover:translate-x-[1px] transition-transform">
                    <ArrowUpRight size={15} strokeWidth={2} className="btn-arrow-diag" />
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
