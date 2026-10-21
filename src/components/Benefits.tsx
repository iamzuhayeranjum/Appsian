import React, { useState, useEffect, useRef } from 'react';
import { Check, ArrowUpRight, Moon, Calendar, MessageSquare, PhoneCall } from 'lucide-react';
import { AppsianIcon } from './AppsianLogo';
import { SectionTag } from './SectionTag';

interface BenefitsProps {
  onBookDemoClick?: () => void;
}

interface BenefitCardData {
  tag: string;
  bg: string;
  accent: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  chips: string[];
}

const CARDS_DATA: BenefitCardData[] = [
  {
    tag: 'ANSWER',
    bg: '#EEF4FF',
    accent: '#3555F0',
    headlineLine1: 'Pick up every call,',
    headlineLine2: 'day or night',
    description:
      "Appsian answers the moment the phone rings, even after hours and while you're up a ladder, so callers never reach voicemail.",
    chips: ['24/7 coverage', 'After-hours included', 'No voicemail'],
  },
  {
    tag: 'QUALIFY',
    bg: '#FFF1EA',
    accent: '#C2490B',
    headlineLine1: 'Only the jobs',
    headlineLine2: 'that fit your rules',
    description:
      'It asks about the job type, urgency, location and timeline, so you see qualified jobs instead of guesswork.',
    chips: ['Your own rules', 'Urgency flagged', 'Service area check'],
  },
  {
    tag: 'BOOK',
    bg: '#E8FAF1',
    accent: '#0F9D6B',
    headlineLine1: 'Estimates booked',
    headlineLine2: 'straight into your calendar',
    description:
      'Appsian puts the estimate on your calendar while you work, so the next job is already scheduled when you finish.',
    chips: ['Calendar booking', 'No back-and-forth', 'Reminders sent'],
  },
  {
    tag: 'HANDOFF',
    bg: '#F5EEFF',
    accent: '#7C3AED',
    headlineLine1: 'A real person',
    headlineLine2: 'when it matters',
    description:
      'If a caller asks for a person, Appsian hands the call to you right away, and sends you a short summary of what was said.',
    chips: ['Human on demand', 'Call summary', 'You stay in control'],
  },
];

export const Benefits: React.FC<BenefitsProps> = ({ onBookDemoClick }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false, false]);
  const [cardProgress, setCardProgress] = useState<number[]>([0, 0, 0, 0]);

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Check prefers-reduced-motion and viewport width
  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mqMotion.matches);
    const handleMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mqMotion.addEventListener('change', handleMotion);

    const checkViewport = () => {
      const w = window.innerWidth;
      setIsMobile(w < 768);
      setIsTablet(w >= 768 && w < 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    return () => {
      mqMotion.removeEventListener('change', handleMotion);
      window.removeEventListener('resize', checkViewport);
    };
  }, []);

  // IntersectionObserver for entrance animations (once)
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  // requestAnimationFrame scroll listener for card depth stacking effect
  useEffect(() => {
    if (isReducedMotion || isMobile) {
      setCardProgress([0, 0, 0, 0]);
      return;
    }

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const newProgress = [0, 0, 0, 0];
        const cards = cardRefs.current;

        for (let i = 0; i < cards.length - 1; i++) {
          const current = cards[i];
          const next = cards[i + 1];
          if (!current || !next) continue;

          const currentRect = current.getBoundingClientRect();
          const nextRect = next.getBoundingClientRect();

          // How far next card has traveled up over the current card
          // Transition occurs as nextRect.top goes from window.innerHeight to currentRect.top + 50
          const startCover = window.innerHeight;
          const endCover = currentRect.top + 60;
          const totalDistance = startCover - endCover;

          if (totalDistance > 0) {
            const currentTravel = startCover - nextRect.top;
            const p = Math.min(Math.max(currentTravel / totalDistance, 0), 1);
            newProgress[i] = p;
          }
        }

        setCardProgress(newProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReducedMotion, isMobile]);

  const handleCtaClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBookDemoClick) {
      onBookDemoClick();
      return;
    }
    const demoInput = document.getElementById('demo-name') as HTMLInputElement | null;
    if (demoInput) {
      demoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => demoInput.focus(), 450);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector('#how-it-works');
    if (target) {
      const yOffset = -70;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-white pt-[96px] pb-[96px] select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* 1) SECTION HEADER */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex flex-col items-center text-center mb-[56px]">
        {/* Eyebrow Pill: "BENEFITS" */}
        <SectionTag label="Benefits" icon="sparkles" className="mb-4" />

        {/* Heading: "What changes when Appsian picks up" */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-display font-light text-[#2D283C] tracking-[-0.03em] leading-[1.15] text-balance">
          What changes when Appsian picks up
        </h2>

        {/* Subline: "Every call answered, every caller qualified, every estimate booked." */}
        <p className="mt-4 text-[15px] sm:text-[17px] leading-[26px] text-[#5B5F68] max-w-xl mx-auto font-normal text-balance">
          Every call answered, every caller qualified, every estimate booked.
        </p>
      </div>

      {/* 2) THE STACK (4 CARDS) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col gap-4 sm:gap-8">
          {CARDS_DATA.map((card, i) => {
            const isCardVisible = visibleCards[i] || isReducedMotion;
            const progress = cardProgress[i] || 0;
            const scale = isReducedMotion || isMobile ? 1 : 1 - progress * 0.035;

            // Desktop sticky top: 24px + i * 14px
            // Tablet sticky top: 20px + i * 10px
            // Mobile: normal static flow
            const topOffset = isMobile
              ? undefined
              : isTablet
              ? `${20 + i * 10}px`
              : `${24 + i * 14}px`;

            const cardStyle: React.CSSProperties = {
              backgroundColor: card.bg,
              position: isMobile ? 'relative' : 'sticky',
              top: topOffset,
              zIndex: 10 + i * 10,
              transform: isReducedMotion || isMobile ? 'none' : `scale(${scale})`,
              transformOrigin: 'top center',
              transition: isReducedMotion ? 'none' : 'transform 0.1s ease-out',
            };

            return (
              <div
                key={card.tag}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                style={cardStyle}
                className="relative w-full rounded-[24px] sm:rounded-[32px] p-[18px] sm:p-6 lg:h-[min(620px,calc(100svh-150px))] shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-black/[0.04] overflow-hidden"
              >
                {/* Subtle dark depth overlay that dims the card when covered */}
                {!isReducedMotion && !isMobile && i < CARDS_DATA.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none transition-opacity duration-150 rounded-[32px] z-30"
                    style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.05)',
                      opacity: progress,
                    }}
                  />
                )}

                {/* Card Content Grid: Text 46% | Panel 54% */}
                <div className="relative z-10 w-full h-full flex flex-col lg:flex-row gap-6 lg:gap-8">
                  {/* LEFT COLUMN */}
                  <div
                    className={`w-full lg:w-[46%] flex flex-col justify-between transition-all duration-500 ease-out ${
                      isCardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                    }`}
                  >
                    <div>
                      {/* Tag pill with two overlapping lighter pills behind it */}
                      <div className="relative inline-flex items-center">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 translate-x-[12px] rounded-full pointer-events-none"
                          style={{ backgroundColor: card.accent, opacity: 0.12 }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 translate-x-[6px] rounded-full pointer-events-none"
                          style={{ backgroundColor: card.accent, opacity: 0.25 }}
                        />
                        <span
                          className="relative z-10 inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] text-white select-none shadow-xs"
                          style={{ backgroundColor: card.accent }}
                        >
                          {card.tag}
                        </span>
                      </div>

                      {/* Headline: Line 1 near-black, Line 2 in card accent */}
                      <h3 className="mt-5 text-[28px] sm:text-[34px] lg:text-[clamp(32px,3.4vw,48px)] font-display font-medium tracking-[-0.02em] leading-[1.08]">
                        <span className="block text-[#0B0F19]">{card.headlineLine1}</span>
                        <span className="block" style={{ color: card.accent }}>
                          {card.headlineLine2}
                        </span>
                      </h3>

                      {/* Description */}
                      <p className="mt-5 text-[15px] sm:text-[17px] leading-[1.5] text-[#1F2937] max-w-[420px]">
                        {card.description}
                      </p>
                    </div>

                    {/* Lower Area: Capability chips + Buttons */}
                    <div className="mt-6 lg:mt-auto pt-4">
                      {/* Capability Chips */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {card.chips.map((chip) => (
                          <div
                            key={chip}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/[0.06] shadow-xs text-[13px] font-medium text-[#374151] select-none"
                          >
                            <Check size={14} strokeWidth={2.5} style={{ color: card.accent }} />
                            <span>{chip}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                          type="button"
                          onClick={handleCtaClick}
                          style={{ fontFamily: 'inherit' }}
                          className="btn-premium btn-premium--dark btn-glitter group h-[50px] px-5 rounded-[14px] text-[15px] font-medium flex items-center justify-center gap-3 cursor-pointer"
                        >
                          <span>Get Free Demo</span>
                          <ArrowUpRight
                            size={16}
                            strokeWidth={2}
                            className="btn-arrow-diag text-[#6EEDC2]"
                          />
                        </button>

                        <a
                          href="#how-it-works"
                          onClick={handleSecondaryClick}
                          style={{ fontFamily: 'inherit' }}
                          className="btn-premium btn-premium--light btn-glitter btn-glitter--light h-[50px] px-5 rounded-[14px] text-[15px] font-medium flex items-center justify-center cursor-pointer"
                        >
                          <span>See how it works</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Illustration Studio Panel */}
                  <div
                    className={`w-full lg:w-[54%] h-[280px] sm:h-[300px] lg:h-full rounded-[24px] overflow-hidden relative flex items-center justify-center transition-all duration-600 ease-out ${
                      isCardVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.96]'
                    }`}
                    style={{
                      background:
                        'linear-gradient(180deg, #F3EEE6 0%, #F3EEE6 55%, #E6DECF 55%, #E6DECF 100%)',
                    }}
                  >
                    {/* Faint subtle grid/noise texture on studio floor */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Studio Mockup per Card */}
                    {i === 0 && (
                      <Card1Mockup accent={card.accent} isReducedMotion={isReducedMotion} />
                    )}
                    {i === 1 && (
                      <Card2Mockup accent={card.accent} isReducedMotion={isReducedMotion} />
                    )}
                    {i === 2 && (
                      <Card3Mockup accent={card.accent} isReducedMotion={isReducedMotion} />
                    )}
                    {i === 3 && (
                      <Card4Mockup accent={card.accent} isReducedMotion={isReducedMotion} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ========================================================================= */
/* CARD 1 MOCKUP: Phone-style Incoming Call + Sound Wave + After Hours pill  */
/* ========================================================================= */
const Card1Mockup: React.FC<{ accent: string; isReducedMotion: boolean }> = ({
  accent,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <style>{`
        @keyframes bobCard1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes soundWave {
          0%, 100% { height: 8px; }
          50% { height: 26px; }
        }
      `}</style>

      {/* Main incoming call card (width ~250px, radius 28px) */}
      <div
        className="w-[250px] bg-white rounded-[28px] p-5 shadow-[0_18px_40px_rgba(60,45,20,0.14)] border border-black/[0.05] flex flex-col items-center text-center relative z-10"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard1 5s ease-in-out infinite',
        }}
      >
        <span className="text-[11px] font-medium text-[#6B7280]">
          Incoming call · 2:14 AM
        </span>
        <span className="mt-1 text-[16px] font-semibold text-[#0B0F19]">
          Mark · Roof leak
        </span>

        {/* Mint badge: "Answered by Appsian" with AppsianIcon */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6FBF2] text-[#062B20] border border-[#6EEDC2]/50 shadow-xs">
          <AppsianIcon size={18} />
          <span className="text-[11px] font-medium">Answered by Appsian</span>
        </div>

        {/* Animated sound-wave: 9 vertical bars */}
        <div className="mt-5 flex items-center justify-center gap-1.5 h-[30px]">
          {[12, 22, 16, 28, 14, 26, 18, 24, 10].map((h, idx) => (
            <span
              key={idx}
              className="w-[3px] rounded-full"
              style={{
                backgroundColor: accent,
                height: `${h}px`,
                animation: isReducedMotion
                  ? 'none'
                  : `soundWave 1.2s ease-in-out infinite ${idx * 0.12}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Smaller floating card at lower right: "After hours · No voicemail" with moon icon */}
      <div
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white rounded-[14px] px-3.5 py-2 text-[12px] font-medium text-[#0B0F19] shadow-[0_14px_30px_rgba(60,45,20,0.14)] border border-black/[0.05] flex items-center gap-2 z-20"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard1 5s ease-in-out infinite 0.8s',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#3555F0]">
          <Moon size={13} className="fill-[#3555F0]" />
        </div>
        <span>After hours · No voicemail</span>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* CARD 2 MOCKUP: Job details card (4 rows + status dots) + Your rules pill  */
/* ========================================================================= */
const Card2Mockup: React.FC<{ accent: string; isReducedMotion: boolean }> = ({
  accent,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <style>{`
        @keyframes bobCard2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Floating pill at top right: "Your rules ✓" */}
      <div
        className="absolute top-4 right-4 sm:top-6 sm:right-8 bg-white rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0B0F19] shadow-[0_14px_30px_rgba(60,45,20,0.12)] border border-black/[0.05] flex items-center gap-1.5 z-20"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard2 5s ease-in-out infinite 0.5s',
        }}
      >
        <span>Your rules</span>
        <span className="text-[#C2490B] font-bold">✓</span>
      </div>

      {/* Main "Job details" card (width ~300px) */}
      <div
        className="w-[290px] sm:w-[310px] bg-white rounded-[22px] p-4 sm:p-5 shadow-[0_18px_40px_rgba(60,45,20,0.14)] border border-black/[0.05] relative z-10"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard2 5s ease-in-out infinite',
        }}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06]">
          <span className="text-[13px] font-semibold text-[#0B0F19]">Job details</span>
          <span className="text-[11px] font-medium text-[#6B7280]">Verified</span>
        </div>

        <div className="flex flex-col gap-2.5 text-[12px]">
          {/* Row 1: Job type */}
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Job type</span>
            <span className="font-medium text-[#0B0F19]">Roof leak</span>
          </div>

          {/* Row 2: Urgency */}
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Urgency</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-[#92400E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
              Emergency
            </span>
          </div>

          {/* Row 3: Location */}
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Location</span>
            <span className="inline-flex items-center gap-1 text-[#047857] font-medium">
              <Check size={12} strokeWidth={3} />
              In service area
            </span>
          </div>

          {/* Row 4: Timeline */}
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Timeline</span>
            <span className="font-medium text-[#0B0F19]">This week</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* CARD 3 MOCKUP: Mini Week Calendar card + Synced to your calendar pill     */
/* ========================================================================= */
const Card3Mockup: React.FC<{ accent: string; isReducedMotion: boolean }> = ({
  accent,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <style>{`
        @keyframes bobCard3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {/* Main Mini Week Calendar (width ~320px) */}
      <div
        className="w-[290px] sm:w-[320px] bg-white rounded-[22px] p-4 shadow-[0_18px_40px_rgba(60,45,20,0.14)] border border-black/[0.05] relative z-10"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard3 5s ease-in-out infinite',
        }}
      >
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-black/[0.06]">
          <span className="text-[13px] font-semibold text-[#0B0F19]">This week</span>
          <span className="text-[11px] font-medium text-[#0F9D6B] bg-[#E8FAF1] px-2 py-0.5 rounded-full">
            Auto-booked
          </span>
        </div>

        {/* 5 Day Columns */}
        <div className="grid grid-cols-5 gap-1.5 text-center text-[11px] font-medium text-[#6B7280] mb-2">
          <span>Mon</span>
          <span className="text-[#0F9D6B] font-bold">Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
        </div>

        {/* Calendar Grid Area with Tuesday Event */}
        <div className="relative h-[90px] rounded-[10px] bg-[#F9FAFB] border border-black/[0.04] p-1.5 flex flex-col justify-center">
          {/* Hour guide lines */}
          <div className="absolute inset-x-0 top-[30px] border-b border-black/[0.04]" />
          <div className="absolute inset-x-0 top-[60px] border-b border-black/[0.04]" />

          {/* Highlighted Booking Block */}
          <div className="relative z-10 mx-auto w-full max-w-[260px] bg-[#E8FAF1] border border-[#0F9D6B]/30 rounded-[8px] p-2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0F9D6B] shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-[#0F9D6B] leading-tight">
                9:00 AM · Roof leak estimate
              </span>
              <span className="text-[10px] text-[#065F46]">Confirmed with Mark</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating pill below: "Synced to your calendar" with Calendar icon */}
      <div
        className="absolute bottom-3 left-4 sm:bottom-4 sm:left-6 bg-white rounded-full px-3 py-1.5 text-[12px] font-medium text-[#0B0F19] shadow-[0_14px_30px_rgba(60,45,20,0.12)] border border-black/[0.05] flex items-center gap-1.5 z-20"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard3 5s ease-in-out infinite 0.7s',
        }}
      >
        <Calendar size={13} className="text-[#0F9D6B]" />
        <span>Synced to your calendar</span>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* CARD 4 MOCKUP: Transfer card with ringing indicator + summary pill        */
/* ========================================================================= */
const Card4Mockup: React.FC<{ accent: string; isReducedMotion: boolean }> = ({
  accent,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <style>{`
        @keyframes bobCard4 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      {/* Main "Transfer" Card (width ~290px) */}
      <div
        className="w-[280px] sm:w-[290px] bg-white rounded-[22px] p-5 shadow-[0_18px_40px_rgba(60,45,20,0.14)] border border-black/[0.05] flex flex-col items-center text-center relative z-10"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard4 5s ease-in-out infinite',
        }}
      >
        <span className="text-[11px] font-medium text-[#6B7280]">
          Caller asked for a person
        </span>

        {/* Animated Ringing Indicator with two expanding rings */}
        <div className="relative my-4 flex items-center justify-center">
          {!isReducedMotion && (
            <>
              <span
                className="absolute w-12 h-12 rounded-full border-2 border-[#7C3AED]/40"
                style={{ animation: 'ringPulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite' }}
              />
              <span
                className="absolute w-12 h-12 rounded-full border-2 border-[#7C3AED]/30"
                style={{
                  animation: 'ringPulse 2s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.6s',
                }}
              />
            </>
          )}
          <div className="w-11 h-11 rounded-full bg-[#F5EEFF] text-[#7C3AED] flex items-center justify-center shadow-xs">
            <PhoneCall size={18} />
          </div>
        </div>

        <span className="text-[15px] font-semibold text-[#0B0F19]">
          Transferring to you…
        </span>
        <span className="text-[12px] text-[#4B5563] mt-0.5">
          Mark · (555) 234-8901
        </span>
      </div>

      {/* Second small floating card: "Call summary sent to your phone" with message icon */}
      <div
        className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 bg-white rounded-[14px] px-3.5 py-2 text-[12px] font-medium text-[#0B0F19] shadow-[0_14px_30px_rgba(60,45,20,0.12)] border border-black/[0.05] flex items-center gap-2 z-20"
        style={{
          animation: isReducedMotion ? 'none' : 'bobCard4 5s ease-in-out infinite 0.9s',
        }}
      >
        <div className="w-6 h-6 rounded-full bg-[#F5EEFF] flex items-center justify-center text-[#7C3AED]">
          <MessageSquare size={13} />
        </div>
        <span>Call summary sent to your phone</span>
      </div>
    </div>
  );
};
