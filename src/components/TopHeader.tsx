import React, { useState, useEffect, useRef } from 'react';
import { AppsianMark } from './AppsianLogo';
import { ArrowUpRight, Menu, X } from 'lucide-react';

interface TopHeaderProps {
  pastHero: boolean;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onCtaClick: () => void;
}

const NAV_ITEMS = [
  { id: 'services', label: 'Services' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'toolverse', label: 'Toolverse' },
  { id: 'customers', label: 'Customers' },
  { id: 'resources', label: 'Resources' },
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  pastHero,
  activeSection,
  onNavigate,
  onCtaClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Entrance animation trigger after preloader / initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasEntered(true);
    }, 120);
    return () => clearTimeout(timer);
  }, []);

  // Close mobile dropdown on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  // Entrance animation styles with stagger
  const getPillEntranceStyle = (index: number): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {
        opacity: hasEntered ? 1 : 0,
        transition: 'opacity 500ms ease',
      };
    }

    const delay = index * 80; // 0ms, 80ms, 160ms
    return {
      opacity: hasEntered ? 1 : 0,
      transform: hasEntered ? 'translateY(0)' : 'translateY(-12px)',
      filter: hasEntered ? 'blur(0px)' : 'blur(8px)',
      transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, filter 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    };
  };

  return (
    <header
      className="fixed top-[16px] left-0 right-0 mx-auto w-[calc(100%-32px)] max-w-[1100px] h-[52px] z-[100] pointer-events-none"
      role="banner"
    >
      {/* 
        Inner wrapper: handles pastHero show/hide transition.
        Notice: No CSS transform on the fixed wrapper itself per specification!
      */}
      <div
        className={`w-full h-full flex items-center gap-[8px] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          pastHero
            ? 'opacity-0 -translate-y-5 pointer-events-none'
            : 'opacity-100 translate-y-0 pointer-events-auto'
        }`}
      >
        {/* ========================================================
            PILL 1: Logo Tile (52px x 52px square, radius 14px)
            ======================================================== */}
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Appsian Home - Scroll to top"
          style={getPillEntranceStyle(0)}
          className="glass-pill w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-white/30 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] select-none group"
        >
          <div className="w-[26px] flex items-center justify-center shrink-0">
            <AppsianMark size={26} />
          </div>
        </button>

        {/* ========================================================
            PILL 2: Navigation (Desktop >= 900px)
            flex 1, radius 14px, height 52px, evenly distributed
            Inter 15px, weight 500, white at 88%
            ======================================================== */}
        <nav
          style={getPillEntranceStyle(1)}
          aria-label="Main Navigation"
          className="glass-pill flex-1 h-[52px] rounded-[14px] hidden min-[900px]:flex items-center justify-evenly px-4"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`relative px-[14px] py-[8px] rounded-[10px] text-[15px] font-medium tracking-[-0.01em] transition-all duration-[180ms] cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] select-none hover:bg-white/10 ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-white/88 hover:text-white'
                }`}
              >
                <span className="glass-text-shadow">{item.label}</span>
                {/* 4px mint dot under active item */}
                {isActive && (
                  <span
                    className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full bg-[#6EEDC2] shadow-[0_0_8px_#6EEDC2]"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Spacer on mobile to push CTA to right when middle pill is hidden */}
        <div className="flex-1 min-[900px]:hidden" />

        {/* ========================================================
            PILL 3: CTA Pill
            Desktop (>= 900px):
              auto width, radius 14px, height 52px, padding 6px 6px 6px 22px
              underlined text link "Get Free Demo" (Inter 15px, weight 500, white, 1px underline with 4px offset, color rgba(255,255,255,0.7))
              18px gap
              40px x 40px square button (radius 10px, bg #6EEDC2, arrow lucide 18px #062B20)
            Mobile (< 900px):
              square mint button only (hide text link)
            ======================================================== */}
        <div
          style={getPillEntranceStyle(2)}
          className="glass-pill h-[52px] rounded-[14px] flex items-center p-[6px] min-[900px]:pl-[22px] min-[900px]:pr-[6px] min-[900px]:py-[6px] min-[900px]:gap-[18px] transition-all duration-200"
        >
          {/* Underlined text link (hidden on < 900px) */}
          <button
            type="button"
            onClick={onCtaClick}
            className="hidden min-[900px]:inline-flex items-center text-[15px] font-medium text-white underline underline-offset-4 decoration-1 decoration-white/70 hover:decoration-white hover:text-white transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px] select-none glass-text-shadow"
          >
            Get Free Demo
          </button>

          {/* 40px x 40px mint button */}
          <button
            type="button"
            onClick={onCtaClick}
            aria-label="Get Free Demo - Scroll to demo bar"
            className="group w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-[10px] bg-[#6EEDC2] flex items-center justify-center cursor-pointer transition-all duration-180 hover:brightness-108 active:scale-[0.96] shadow-[0_2px_10px_rgba(110,237,194,0.3)] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]"
          >
            <ArrowUpRight
              size={18}
              strokeWidth={2.5}
              className="text-[#062B20] transition-transform duration-180 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
            />
          </button>
        </div>

        {/* ========================================================
            MOBILE MENU BUTTON PILL (< 900px)
            52px x 52px menu button (lucide Menu / X icon) pill
            ======================================================== */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          style={getPillEntranceStyle(2)}
          className="glass-pill w-[52px] h-[52px] min-w-[52px] rounded-[14px] flex min-[900px]:hidden items-center justify-center cursor-pointer transition-all duration-200 hover:border-white/30 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[3px]"
        >
          {mobileMenuOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <Menu size={20} className="text-white" />
          )}
        </button>
      </div>

      {/* ========================================================
          MOBILE DROPDOWN PANEL (< 900px)
          Glass style, radius 18px, padding 12px, below header
          List of existing links, 48px tall each, hover highlight
          ======================================================== */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="glass-pill absolute top-[62px] left-0 right-0 w-full rounded-[18px] p-[12px] flex flex-col gap-[4px] shadow-[0_20px_40px_rgba(0,0,0,0.65)] pointer-events-auto min-[900px]:hidden animate-in fade-in slide-in-from-top-2 duration-200"
          role="dialog"
          aria-label="Mobile Navigation"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.id)}
                className={`w-full h-[48px] px-4 rounded-[10px] flex items-center justify-between text-[15px] font-medium transition-all duration-180 cursor-pointer hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-[2px] ${
                  isActive ? 'text-white font-semibold bg-white/5' : 'text-white/88'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-[#6EEDC2] shadow-[0_0_8px_#6EEDC2]" />
                )}
              </button>
            );
          })}

          <div className="pt-2 mt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                onCtaClick();
                setMobileMenuOpen(false);
              }}
              className="w-full h-[46px] rounded-[10px] bg-[#6EEDC2] text-[#062B20] font-semibold text-[15px] flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all"
            >
              <span>Get Free Demo</span>
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
