import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronUp, LayoutGrid, ListChecks, CircleDollarSign, Menu } from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { useHeroPast } from './useHeroPast';
import { MorePanel } from './MorePanel';
import ProgressiveBlur from './ProgressiveBlur';
import { navigate } from '../lib/navigate';

interface BottomNavProps {
  onCtaClick?: () => void;
  pastHero?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onCtaClick, pastHero: propPastHero }) => {
  const hookPastHero = useHeroPast();
  const pastHero = propPastHero !== undefined ? propPastHero : hookPastHero;

  const [activeSection, setActiveSection] = useState<string>('');
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isHoveredCta, setIsHoveredCta] = useState(false);
  const [isDockVisible, setIsDockVisible] = useState(pastHero);
  const moreRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dockNavRef = useRef<HTMLElement>(null);
  const dockContainerRef = useRef<HTMLDivElement>(null);

  // Distance from the right edge of the dock to the centre of the "More" button.
  // The panel is right-aligned to the dock, so its pointer notch uses this to sit exactly over "More".
  // Phone layout (below 768px) uses its own full-width dock; desktop dock is untouched.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileAnchorRef = useRef<HTMLDivElement>(null);
  const moreMobileRef = useRef<HTMLDivElement>(null);
  const [mobileBarH, setMobileBarH] = useState<number>(72);

  const [notchRight, setNotchRight] = useState<number>(76);
  useLayoutEffect(() => {
    if (!isMoreOpen) return;
    const container = isMobile ? mobileAnchorRef.current : dockContainerRef.current;
    const more = isMobile ? moreMobileRef.current : moreRef.current;
    if (!container || !more) return;
    const c = container.getBoundingClientRect();
    const m = more.getBoundingClientRect();
    const fromRight = c.right - (m.left + m.width / 2);
    if (fromRight > 16 && fromRight < c.width - 16) setNotchRight(Math.round(fromRight));
  }, [isMoreOpen, isMobile]);

  // Exact distance from viewport bottom to the resting top edge of the dock
  const [dockTopFromBottom, setDockTopFromBottom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? 96 : 76;
    }
    return 96;
  });

  const updateDockMeasurement = useCallback(() => {
    if (typeof window === 'undefined') return;
    const isMd = window.innerWidth >= 768;
    if (!isMd && mobileNavRef.current && mobileNavRef.current.offsetHeight > 0) {
      const h = mobileNavRef.current.offsetHeight;
      setMobileBarH(h);
      setDockTopFromBottom(h);
      return;
    }
    const defaultOffset = isMd ? 24 : 12;
    const defaultHeight = isMd ? 72 : 64;

    let bottomOffset = defaultOffset;
    if (wrapperRef.current) {
      const computed = window.getComputedStyle(wrapperRef.current);
      const parsed = parseFloat(computed.bottom);
      if (!isNaN(parsed) && parsed > 0) {
        bottomOffset = parsed;
      }
    }

    let dockHeight = defaultHeight;
    if (dockNavRef.current && dockNavRef.current.offsetHeight > 0) {
      dockHeight = dockNavRef.current.offsetHeight;
    }

    setDockTopFromBottom(bottomOffset + dockHeight);
  }, []);

  useEffect(() => {
    updateDockMeasurement();

    window.addEventListener('resize', updateDockMeasurement);
    window.addEventListener('orientationchange', updateDockMeasurement);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateDockMeasurement();
      });
      if (dockNavRef.current) {
        resizeObserver.observe(dockNavRef.current);
      }
      if (wrapperRef.current) {
        resizeObserver.observe(wrapperRef.current);
      }
    }

    return () => {
      window.removeEventListener('resize', updateDockMeasurement);
      window.removeEventListener('orientationchange', updateDockMeasurement);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [updateDockMeasurement]);

  // Check prefers-reduced-motion
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // When pastHero becomes true, make visible immediately so entrance animation is visible
  useEffect(() => {
    if (pastHero) {
      setIsDockVisible(true);
    } else {
      setIsMoreOpen(false);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    }
  }, [pastHero]);

  // Clean up hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Hover handlers for smooth bridge between More button and Mega Panel
  const handleMoreMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsMoreOpen(true);
  };

  const handleMoreMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 220);
  };

  const handlePanelMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePanelMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 220);
  };

  // Handle animation complete to toggle visibility: hidden only AFTER exit animation finishes
  const handleAnimationComplete = (definition: string | { opacity?: number }) => {
    const isHiddenDef =
      definition === 'hidden' ||
      (typeof definition === 'object' && definition.opacity === 0);
    if (isHiddenDef && !pastHero) {
      setIsDockVisible(false);
    }
    updateDockMeasurement();
  };

  // Primary navigation slots around the center CTA
  const leftSlots: NavItem[] = [
    { id: 'features', label: 'Product', href: '#features' },
    { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
  ];

  const rightSlots: NavItem[] = [
    { id: 'pricing', label: 'Pricing', href: '#pricing' },
  ];

  // Secondary links under "More"
  const moreLinks: NavItem[] = [
    { id: 'why-appsian', label: 'Why Appsian', href: '#why-appsian' },
    { id: 'results', label: 'Results', href: '#results' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'login', label: 'Log In', href: '#pricing' },
  ];

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    const observedIds = ['features', 'how-it-works', 'pricing', 'why-appsian', 'results', 'faq'];
    const elements = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // Close "More" popover on click outside or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideMore =
        moreRef.current?.contains(target) || moreMobileRef.current?.contains(target);
      const isInsidePanel = panelRef.current?.contains(target);
      if (!isInsideMore && !isInsidePanel) {
        setIsMoreOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };

    if (isMoreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoreOpen]);

  // Smooth scroll handler with offset for section header clearance
  const handleScrollToHref = (href: string) => {
    setIsMoreOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const yOffset = -70; // offset so section headings are not hidden
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleScrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    handleScrollToHref(href);
  };

  // Center CTA button click handler
  const handleCtaClick = () => {
    setIsMoreOpen(false);
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    navigate('/book');
  };

  // Variants for the 5 inner slots with 40ms stagger when shown, no stagger on exit
  const slotVariants = {
    hidden: {
      opacity: 0,
      y: isReducedMotion ? 0 : 8,
      transition: {
        duration: isReducedMotion ? 0.15 : 0.2,
        ease: [0.4, 0, 1, 1] as const,
        delay: 0, // No stagger on exit
      },
    },
    shown: (customIndex: number) => ({
      opacity: 1,
      y: 0,
      transition: isReducedMotion
        ? { duration: 0.15 }
        : {
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1] as const,
            delay: 0.14 + 0.04 * customIndex, // 40ms stagger per slot
          },
    }),
  };

  // Helper to render an item slot
  const renderItemSlot = (item: NavItem) => {
    const isActive = activeSection === item.id;

    return (
      <a
        href={item.href}
        onClick={(e) => handleScrollTo(e, item.href)}
        className="group relative w-full h-full flex flex-col items-center justify-center text-white hover:text-white transition-colors duration-180 select-none px-2 rounded-[12px] hover:bg-white/[0.06]"
      >
        <span className="text-[13px] md:text-[15px] font-sans font-[500] tracking-tight whitespace-nowrap">
          {item.label}
        </span>
        {/* 4px mint active dot */}
        <span
          className={`absolute bottom-1 w-1 h-1 rounded-full bg-[#6EEDC2] transition-opacity duration-200 ${
            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        />
      </a>
    );
  };

  const isMoreActive = moreLinks.some((link) => link.id === activeSection);

  const dockVariants = {
    hidden: {
      y: isReducedMotion ? 0 : 44,
      scale: isReducedMotion ? 1 : 0.96,
      opacity: 0,
      filter: isReducedMotion ? 'blur(0px)' : 'blur(10px)',
      transition: isReducedMotion
        ? { duration: 0.15 }
        : {
            duration: 0.28,
            ease: [0.4, 0, 1, 1] as const,
            delay: 0,
          },
    },
    shown: {
      y: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      transition: isReducedMotion
        ? { duration: 0.15 }
        : {
            type: 'spring' as const,
            stiffness: 260,
            damping: 26,
            mass: 0.9,
            delay: 0.14,
          },
    },
  };

  return (
    <>
      <ProgressiveBlur visible={pastHero} dockTopFromBottom={dockTopFromBottom} />
      {/* Page blur while the "More" panel is open (below the dock z-100, above the page and the bottom blur strip) */}
      <AnimatePresence>
        {isMoreOpen && (
          <motion.div
            key="more-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[95] pointer-events-none"
            style={{
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              backgroundColor: 'rgba(8, 12, 24, 0.12)',
            }}
          />
        )}
      </AnimatePresence>
      {/* ===== PHONE DOCK (below md): full-width bar, raised centre button with a round notch cut-out ===== */}
      <div className="md:hidden" style={{ visibility: isDockVisible ? 'visible' : 'hidden' }}>
        {/* Anchor for the "More" panel, sits just above the bar */}
        <div
          ref={mobileAnchorRef}
          className="fixed left-3 right-3 z-[100] h-0 pointer-events-none"
          style={{ bottom: mobileBarH + 14 }}
        >
          <AnimatePresence>
            {isMoreOpen && isMobile && (
              <MorePanel
                ref={panelRef}
                isOpen={isMoreOpen}
                onClose={() => setIsMoreOpen(false)}
                onNavigate={handleScrollToHref}
                onCtaClick={handleCtaClick}
                notchRight={notchRight}
                activeSection={activeSection}
              />
            )}
          </AnimatePresence>
        </div>

        <motion.nav
          ref={mobileNavRef}
          initial={false}
          animate={pastHero ? 'shown' : 'hidden'}
          variants={{
            hidden: {
              y: isReducedMotion ? 0 : 90,
              opacity: 0,
              transition: { duration: isReducedMotion ? 0.15 : 0.25, ease: [0.4, 0, 1, 1] as const },
            },
            shown: {
              y: 0,
              opacity: 1,
              transition: isReducedMotion
                ? { duration: 0.15 }
                : { type: 'spring' as const, stiffness: 260, damping: 26, mass: 0.9, delay: 0.14 },
            },
          }}
          onAnimationComplete={handleAnimationComplete}
          aria-label="Mobile Navigation"
          aria-hidden={!pastHero}
          inert={!pastHero ? true : undefined}
          className={`fixed inset-x-0 bottom-0 z-[100] ${pastHero ? 'pointer-events-auto' : 'pointer-events-none'}`}
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Dark bar with a circular bite taken out of the top centre */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-t-[26px] bg-[#0A0A0A]"
            style={{
              border: '1px solid rgba(110, 237, 194, 0.35)',
              borderBottom: 'none',
              boxShadow:
                'inset 0 1px 0 rgba(255, 255, 255, 0.06), inset 0 0 28px -10px rgba(110, 237, 194, 0.22)',
              WebkitMaskImage: 'radial-gradient(circle 50px at 50% 0px, transparent 49.5px, #000 50px)',
              maskImage: 'radial-gradient(circle 50px at 50% 0px, transparent 49.5px, #000 50px)',
            }}
          />
          {/* Mint outline that follows the notch */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 -top-[50px] w-[100px] h-[100px] -translate-x-1/2 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(110, 237, 194, 0.35)', clipPath: 'inset(50% 0 0 0)' }}
          />

          {/* Raised centre CTA */}
          <div className="absolute left-1/2 -top-[26px] -translate-x-1/2 z-10">
            <style>{`
              @keyframes appsianDockDrift { from { background-position: 0 0; } to { background-position: 64px 0; } }
              @keyframes appsianDockWave { 0% { transform: translateX(-22%) scale(1); } 50% { transform: translateX(22%) scale(1.15); } 100% { transform: translateX(-22%) scale(1); } }
              @media (prefers-reduced-motion: reduce) { .appsian-dock-logo-anim { animation: none !important; } }
            `}</style>
            <button
              type="button"
              onClick={() => {
                setIsMoreOpen(false);
                navigate('/book');
              }}
              aria-label="Book a free demo"
              className="relative w-[64px] h-[64px] rounded-[20px] flex items-center justify-center overflow-hidden cursor-pointer select-none active:scale-95 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #0b3d99 0%, #1263d6 42%, #2e86f0 72%, #7db9f8 100%)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                boxShadow:
                  '0 10px 24px -8px rgba(18, 99, 214, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
              }}
            >
              {/* Moving background: deep blue folds drifting sideways, like the hero */}
              <span
                aria-hidden="true"
                className="appsian-dock-logo-anim absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(90deg, rgba(8,42,107,0) 0px, rgba(8,42,107,0) 9px, rgba(8,42,107,0.55) 17px, rgba(8,42,107,0.25) 25px, rgba(8,42,107,0) 40px, rgba(8,42,107,0.4) 47px, rgba(8,42,107,0) 55px, rgba(8,42,107,0) 64px)',
                  backgroundSize: '64px 100%',
                  WebkitMaskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.7) 40%, transparent 85%)',
                  maskImage: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.7) 40%, transparent 85%)',
                  animation: 'appsianDockDrift 5s linear infinite',
                }}
              />
              {/* Soft light that slides along the bottom, like the pale glow of the hero background */}
              <span
                aria-hidden="true"
                className="appsian-dock-logo-anim absolute -bottom-6 left-[-20%] right-[-20%] h-[46px] pointer-events-none"
                style={{
                  background: 'radial-gradient(60% 70% at 50% 100%, rgba(207, 232, 255, 0.85), rgba(207, 232, 255, 0) 70%)',
                  animation: 'appsianDockWave 6s ease-in-out infinite',
                }}
              />
              <AppsianMark size={34} fill="#FFFFFF" className="relative z-10 drop-shadow-[0_2px_6px_rgba(8,42,107,0.45)]" />
            </button>
          </div>

          <div className="relative h-[72px] flex items-stretch">
            {[
              { id: 'features', label: 'Product', href: '#features', Icon: LayoutGrid },
              { id: 'how-it-works', label: 'How it works', href: '#how-it-works', Icon: ListChecks },
            ].map(({ id, label, href, Icon }) => (
              <a
                key={id}
                href={href}
                onClick={(e) => handleScrollTo(e, href)}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1.5 select-none active:opacity-70 transition-colors ${
                  activeSection === id ? 'text-[#6EEDC2]' : 'text-white'
                }`}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={1.75} />
                <span className="text-[12.5px] font-sans font-[600] tracking-tight leading-none whitespace-nowrap">{label}</span>
              </a>
            ))}

            <div className="w-[92px] shrink-0" aria-hidden="true" />

            <a
              href="#pricing"
              onClick={(e) => handleScrollTo(e, '#pricing')}
              className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1.5 select-none active:opacity-70 transition-colors ${
                activeSection === 'pricing' ? 'text-[#6EEDC2]' : 'text-white'
              }`}
            >
              <CircleDollarSign className="w-[22px] h-[22px]" strokeWidth={1.75} />
              <span className="text-[12.5px] font-sans font-[600] tracking-tight leading-none">Pricing</span>
            </a>

            <div ref={moreMobileRef} className="flex-1 min-w-0 flex">
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                aria-expanded={isMoreOpen}
                className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-1.5 select-none active:opacity-70 transition-colors ${
                  isMoreOpen || isMoreActive ? 'text-[#6EEDC2]' : 'text-white'
                }`}
              >
                <Menu className="w-[22px] h-[22px]" strokeWidth={1.75} />
                <span className="text-[12.5px] font-sans font-[600] tracking-tight leading-none">More</span>
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Non-animated fixed centering wrapper (no translateX(-50%) on animated element) */}
      <div
        ref={wrapperRef}
        className="fixed left-0 right-0 z-[100] flex justify-center pointer-events-none bottom-[calc(12px+env(safe-area-inset-bottom,0px))] md:bottom-[calc(24px+env(safe-area-inset-bottom,0px))]"
      style={{
        visibility: isDockVisible ? 'visible' : 'hidden',
      }}
    >
      <div ref={dockContainerRef} className="relative flex justify-center w-auto">
        {/* Mega-panel sibling above motion.nav */}
        <AnimatePresence>
          {isMoreOpen && !isMobile && (
            <MorePanel
              ref={panelRef}
              isOpen={isMoreOpen}
              onClose={() => setIsMoreOpen(false)}
              onMouseEnter={handlePanelMouseEnter}
              onMouseLeave={handlePanelMouseLeave}
              onNavigate={handleScrollToHref}
              onCtaClick={handleCtaClick}
              notchRight={notchRight}
              activeSection={activeSection}
            />
          )}
        </AnimatePresence>

        <motion.nav
          ref={dockNavRef}
          initial={false}
          animate={pastHero ? 'shown' : 'hidden'}
          variants={dockVariants}
          onAnimationComplete={handleAnimationComplete}
          aria-label="Floating Navigation"
          aria-hidden={!pastHero}
          inert={!pastHero ? true : undefined}
          className={`relative w-[calc(100vw-24px)] max-w-[440px] md:w-[712px] md:max-w-[712px] h-[64px] md:h-[72px] p-2 md:p-[10px] rounded-[18px] bg-[#0A0A0A] hidden md:flex items-center justify-between ${
            pastHero ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            border: '1px solid rgba(110, 237, 194, 0.35)',
            boxShadow:
              '0 0 0 1px rgba(110, 237, 194, 0.08), 0 0 24px -6px rgba(110, 237, 194, 0.18), 0 24px 48px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
            willChange: 'transform, opacity',
          }}
        >
          {/* Slot 0: Product */}
          <motion.div
            className="flex-1 h-full flex items-center justify-center"
            variants={slotVariants}
            custom={0}
          >
            {renderItemSlot(leftSlots[0])}
          </motion.div>

          {/* Slot 1: How it works */}
          <motion.div
            className="flex-1 h-full flex items-center justify-center"
            variants={slotVariants}
            custom={1}
          >
            {renderItemSlot(leftSlots[1])}
          </motion.div>

          {/* Slot 2 (CENTER): Primary CTA Button */}
          <motion.div
            className="flex-none flex items-center justify-center px-1"
            variants={slotVariants}
            custom={2}
          >
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-premium btn-premium--mint btn-glitter group relative w-[132px] md:w-[164px] h-[46px] md:h-[54px] rounded-[10px] flex items-center justify-center gap-2 md:gap-3 font-sans font-[600] text-[13px] md:text-[15px] cursor-pointer select-none"
            >
              <span className="relative z-10 whitespace-nowrap">Get Free Demo</span>
              <ArrowRight
                className="btn-arrow relative z-10 w-4 h-4 md:w-[18px] md:h-[18px]"
                strokeWidth={2}
              />
            </button>
          </motion.div>

          {/* Slot 3: Pricing */}
          <motion.div
            className="flex-1 h-full flex items-center justify-center"
            variants={slotVariants}
            custom={3}
          >
            {renderItemSlot(rightSlots[0])}
          </motion.div>

          {/* Slot 4: More (opens Mega Panel on hover & click) */}
          <motion.div
            ref={moreRef}
            className="relative flex-1 h-full flex items-center justify-center"
            variants={slotVariants}
            custom={4}
            onMouseEnter={handleMoreMouseEnter}
            onMouseLeave={handleMoreMouseLeave}
          >
            <button
              type="button"
              onClick={() => setIsMoreOpen((prev) => !prev)}
              aria-expanded={isMoreOpen}
              className={`group relative w-full h-full flex flex-col items-center justify-center text-white hover:text-white transition-colors duration-180 select-none px-2 rounded-[12px] hover:bg-white/[0.06] ${
                isMoreOpen ? 'bg-white/[0.08]' : ''
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-[13px] md:text-[15px] font-sans font-[500] tracking-tight whitespace-nowrap">
                  More
                </span>
                <ChevronUp
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                    isMoreOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              {/* 4px mint dot if any "more" section is active */}
              <span
                className={`absolute bottom-1 w-1 h-1 rounded-full bg-[#6EEDC2] transition-opacity duration-200 ${
                  isMoreActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
              />
            </button>
          </motion.div>
        </motion.nav>
      </div>
    </div>
  </>
  );
};
