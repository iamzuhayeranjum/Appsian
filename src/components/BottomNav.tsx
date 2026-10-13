import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronUp } from 'lucide-react';
import { useHeroPast } from './useHeroPast';
import { MorePanel } from './MorePanel';
import ProgressiveBlur from './ProgressiveBlur';

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
    { id: 'testimonials', label: 'Reviews', href: '#testimonials' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
    { id: 'login', label: 'Log In', href: '#pricing' },
  ];

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    const observedIds = ['features', 'how-it-works', 'pricing', 'why-appsian', 'testimonials', 'faq'];
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
      const isInsideMore = moreRef.current?.contains(target);
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
      {/* Non-animated fixed centering wrapper (no translateX(-50%) on animated element) */}
      <div
        ref={wrapperRef}
        className="fixed left-0 right-0 z-[100] flex justify-center pointer-events-none bottom-[calc(12px+env(safe-area-inset-bottom,0px))] md:bottom-[calc(24px+env(safe-area-inset-bottom,0px))]"
      style={{
        visibility: isDockVisible ? 'visible' : 'hidden',
      }}
    >
      <div className="relative flex justify-center w-auto">
        {/* Mega-panel sibling above motion.nav */}
        <AnimatePresence>
          {isMoreOpen && (
            <MorePanel
              ref={panelRef}
              isOpen={isMoreOpen}
              onClose={() => setIsMoreOpen(false)}
              onMouseEnter={handlePanelMouseEnter}
              onMouseLeave={handlePanelMouseLeave}
              onNavigate={handleScrollToHref}
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
          className={`relative w-[calc(100vw-24px)] max-w-[440px] md:w-[712px] md:max-w-[712px] h-[64px] md:h-[72px] p-2 md:p-[10px] rounded-[18px] bg-[#0A0A0A] flex items-center justify-between ${
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
              onMouseEnter={() => setIsHoveredCta(true)}
              onMouseLeave={() => setIsHoveredCta(false)}
              className="group relative w-[132px] md:w-[164px] h-[46px] md:h-[54px] rounded-[10px] flex items-center justify-center gap-1.5 md:gap-2 text-[#062B20] font-sans font-[600] text-[13px] md:text-[15px] cursor-pointer transition-all duration-200 overflow-hidden select-none hover:-translate-y-[1px] active:translate-y-0"
              style={{
                background: 'linear-gradient(135deg, #7CF2CD 0%, #4DDDAE 100%)',
                border: '1px solid rgba(255, 255, 255, 0.45)',
                boxShadow: isHoveredCta
                  ? '0 10px 24px -4px rgba(110, 237, 194, 0.65)'
                  : '0 8px 20px -6px rgba(110, 237, 194, 0.45)',
              }}
            >
              {/* Subtle top-right sheen */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background:
                    'radial-gradient(circle at top right, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 65%)',
                  opacity: isHoveredCta ? 0.45 : 0.25,
                }}
              />

              <span className="relative z-10 whitespace-nowrap">Get Free Demo</span>
              <ArrowRight
                className="relative z-10 w-4 h-4 md:w-[18px] md:h-[18px] stroke-[2.4] transition-transform duration-200 group-hover:translate-x-[3px]"
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
