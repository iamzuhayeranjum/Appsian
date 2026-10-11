import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Wrench,
  Droplets,
  Flame,
  Zap,
  Home,
  Hammer,
  Snowflake,
  Thermometer,
  Phone,
  CalendarCheck,
  MessageSquare,
  Clock,
  MapPin,
  ShieldAlert,
  Siren,
  Receipt,
  FileText,
  Bell,
  Mic,
  Headphones,
  Star,
  ClipboardList,
  Truck,
  KeyRound,
  Users,
  BarChart3,
  Mail,
  Voicemail,
  Workflow,
  PhoneCall,
  PhoneForwarded,
  Moon,
  ShieldCheck,
  BellRing,
  ArrowRight,
} from 'lucide-react';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

interface StepCardData {
  step: string;
  title: string;
  description: string;
  icons: React.ComponentType<{ className?: string }>[];
  tags: string[];
}

export const GettingStarted: React.FC<GettingStartedProps> = ({ onSuccessDemo }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { margin: '200px 0px 200px 0px' });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeCardPulse, setActiveCardPulse] = useState<number>(-1);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Traveling pulse timing: 4s loop (1s per card). Border flashes when pulse reaches card.
  useEffect(() => {
    if (isReducedMotion || !isInView) {
      setActiveCardPulse(-1);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) % 4000;
      const step = Math.floor(elapsed / 1000); // 0, 1, 2, 3
      const phaseInStep = (elapsed % 1000) / 1000;
      // Flash during arrival at card (last 300ms of each 1s segment)
      if (phaseInStep >= 0.65 && phaseInStep <= 0.95) {
        setActiveCardPulse(step);
      } else {
        setActiveCardPulse(-1);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isReducedMotion, isInView]);

  // Row 1 Lucide icons (repeat twice for seamless marquee loop)
  const row1Icons = useMemo(() => [
    { Icon: Wrench, isMint: false },
    { Icon: Droplets, isMint: false },
    { Icon: Flame, isMint: true },
    { Icon: Zap, isMint: false },
    { Icon: Home, isMint: false },
    { Icon: Hammer, isMint: false },
    { Icon: Snowflake, isMint: false },
    { Icon: Thermometer, isMint: false },
    { Icon: Phone, isMint: false },
    { Icon: CalendarCheck, isMint: true },
    { Icon: MessageSquare, isMint: false },
    { Icon: Clock, isMint: false },
    { Icon: MapPin, isMint: false },
    { Icon: ShieldAlert, isMint: false },
  ], []);

  // Row 2 Lucide icons
  const row2Icons = useMemo(() => [
    { Icon: Siren, isMint: false },
    { Icon: Receipt, isMint: false },
    { Icon: FileText, isMint: false },
    { Icon: Bell, isMint: false },
    { Icon: Mic, isMint: true },
    { Icon: Headphones, isMint: false },
    { Icon: Star, isMint: false },
    { Icon: ClipboardList, isMint: false },
    { Icon: Truck, isMint: true },
    { Icon: KeyRound, isMint: false },
    { Icon: Users, isMint: false },
    { Icon: BarChart3, isMint: false },
    { Icon: Mail, isMint: false },
    { Icon: Voicemail, isMint: false },
  ], []);

  // Four Step Cards Data
  const cards: StepCardData[] = [
    {
      step: '01',
      title: 'Discovery',
      description: 'We learn how your business runs: services, areas, hours and emergency rules.',
      icons: [Wrench, MapPin, Clock],
      tags: ['Service list', 'Service area', 'Emergency rules', 'Business hours'],
    },
    {
      step: '02',
      title: 'Setup',
      description: 'We build your agent, connect your calendar and test calls with you.',
      icons: [Mic, Workflow, CalendarCheck, PhoneCall],
      tags: ['Custom greeting', 'Call flow', 'Booking rules', 'Test calls'],
    },
    {
      step: '03',
      title: 'Go live',
      description: 'Point your number to Appsian. Every call is answered and qualified.',
      icons: [PhoneForwarded, Moon, ShieldCheck],
      tags: ['Calls answered', 'After-hours cover', 'Callers qualified'],
    },
    {
      step: '04',
      title: 'Ongoing',
      description: 'Every call ends in a booked estimate or a captured lead, summarized for your team.',
      icons: [CalendarCheck, FileText, BellRing, BarChart3],
      tags: ['Booked estimates', 'Call transcripts', 'AI summaries', 'Team alerts'],
    },
  ];

  const handleCtaClick = () => {
    const demoInput = document.getElementById('demo-name') as HTMLInputElement | null;
    if (demoInput) {
      demoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        demoInput.focus();
      }, 450);
    } else if (onSuccessDemo) {
      onSuccessDemo();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="getting-started"
      className="w-full bg-[#040506] overflow-clip pt-[120px] pb-[120px] relative text-white font-sans"
    >
      <style>{`
        @keyframes driftLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes driftRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: driftLeft 41s linear infinite;
        }
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: driftRight 41s linear infinite;
        }
      `}</style>

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* ========================================================= */}
        {/* 1) HEADER (centered, matching reference)                  */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center">
          {/* Eyebrow Pill (~28px tall, 12px text, mint outline and text) */}
          <div className="h-[28px] px-3.5 rounded-full bg-[#6EEDC2]/[0.08] border border-[#6EEDC2]/30 inline-flex items-center gap-1.5 select-none mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />
            <span className="text-[12px] font-sans font-medium text-[#6EEDC2] tracking-tight">
              Getting Started
            </span>
          </div>

          {/* H2, 48px/1.08, mixed weight */}
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-display leading-[1.08] tracking-[-0.03em] mb-4">
            <span className="font-normal text-white/70">From signup to</span>
            <span className="font-semibold text-white"> booked jobs</span>
          </h2>

          {/* Subtext, 15px/1.6, rgba(255,255,255,0.7), max-w 560px */}
          <p className="text-[15px] leading-[1.6] text-white/70 font-sans max-w-[560px] text-center">
            Four simple steps from first conversation to a receptionist that never misses a call.
          </p>
        </div>

        {/* 70px gap down to the tile rows */}
        <div className="w-full h-[70px]" aria-hidden="true" />

        {/* ========================================================= */}
        {/* 2 & 3) TILE ROWS (MARQUEE) + OVERLAPPING CENTER LENS (HUB) */}
        {/* ========================================================= */}
        <div className="relative w-full overflow-hidden flex flex-col items-center py-2">
          {/* Faded edges mask container for the two drifting rows */}
          <div
            className="w-full overflow-hidden flex flex-col gap-[18px] py-1 select-none pointer-events-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            }}
          >
            {/* ROW 1: drifts left (~28px/s) */}
            <div
              className="marquee-track-left gap-[18px]"
              style={{
                animationPlayState: isInView && !isReducedMotion ? 'running' : 'paused',
              }}
            >
              {[...row1Icons, ...row1Icons].map((item, idx) => (
                <div
                  key={`r1-${idx}`}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-[14px] md:rounded-[16px] flex items-center justify-center flex-shrink-0 transition-transform ${
                    item.isMint
                      ? 'border border-[#6EEDC2]/35 shadow-[inset_0_1px_0_rgba(110,237,194,0.3)]'
                      : 'border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
                  }`}
                  style={{
                    background: item.isMint
                      ? 'linear-gradient(180deg, rgba(110,237,194,0.12) 0%, rgba(110,237,194,0.04) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
                  }}
                >
                  <item.Icon
                    className={`w-5 h-5 md:w-[26px] md:h-[26px] stroke-[1.5] ${
                      item.isMint ? 'text-[#6EEDC2]' : 'text-white/75'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* ROW 2: offset by half a tile, drifts right (~28px/s) */}
            <div
              className="marquee-track-right gap-[18px] pl-[24px] md:pl-[41px]"
              style={{
                animationPlayState: isInView && !isReducedMotion ? 'running' : 'paused',
              }}
            >
              {[...row2Icons, ...row2Icons].map((item, idx) => (
                <div
                  key={`r2-${idx}`}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-[14px] md:rounded-[16px] flex items-center justify-center flex-shrink-0 transition-transform ${
                    item.isMint
                      ? 'border border-[#6EEDC2]/35 shadow-[inset_0_1px_0_rgba(110,237,194,0.3)]'
                      : 'border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]'
                  }`}
                  style={{
                    background: item.isMint
                      ? 'linear-gradient(180deg, rgba(110,237,194,0.12) 0%, rgba(110,237,194,0.04) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
                  }}
                >
                  <item.Icon
                    className={`w-5 h-5 md:w-[26px] md:h-[26px] stroke-[1.5] ${
                      item.isMint ? 'text-[#6EEDC2]' : 'text-white/75'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* CENTER LENS (HUB): 160px circular glass lens overlapping the two rows */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full flex items-center justify-center pointer-events-none"
            style={{
              backdropFilter: 'blur(4px) brightness(1.1)',
              WebkitBackdropFilter: 'blur(4px) brightness(1.1)',
              border: '1.5px solid rgba(110, 237, 194, 0.7)',
              boxShadow:
                '0 0 60px -10px rgba(110,237,194,0.45), 0 0 120px -30px rgba(110,237,194,0.3), inset 0 0 20px rgba(110,237,194,0.12)',
              background:
                'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(110,237,194,0.08) 55%, rgba(6,10,15,0.5) 100%)',
            }}
          >
            {/* Inner rim reflection */}
            <div className="absolute inset-[3px] rounded-full border border-white/20 pointer-events-none" />

            {/* Appsian white glyph mark in center (about 52px on desktop) */}
            <div className="relative z-10 w-10 h-10 md:w-[52px] md:h-[52px] rounded-[11px] md:rounded-[14px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[2px] md:p-[2.5px] flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#0E0F13] rounded-[9px] md:rounded-[12px] flex items-center justify-center">
                <div className="w-3 h-3 md:w-4 md:h-4 rotate-45 border-[2px] md:border-[2.5px] border-[#6EEDC2] rounded-xs" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4) CONNECTORS (Bracket branching line down to 4 cards)    */}
        {/* ========================================================= */}
        {/* Desktop / Large screen bracket SVG connector */}
        <div className="hidden lg:flex justify-center w-full max-w-[1000px] h-[76px] relative pointer-events-none -mt-1 mb-2">
          <svg
            viewBox="0 0 1000 76"
            className="w-full h-full overflow-visible"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <filter id="mintGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 4 Distinct branch paths for the bracket branching system */}
            {/* Center stem: (500,0) down to (500,38) then branches to card centers */}
            <path
              id="branch-0"
              d="M 500,0 L 500,38 L 132.25,38 Q 118.25,38 118.25,52 L 118.25,76"
              stroke="rgba(110, 237, 194, 0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-1"
              d="M 500,0 L 500,38 L 386.75,38 Q 372.75,38 372.75,52 L 372.75,76"
              stroke="rgba(110, 237, 194, 0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-2"
              d="M 500,0 L 500,38 L 613.25,38 Q 627.25,38 627.25,52 L 627.25,76"
              stroke="rgba(110, 237, 194, 0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-3"
              d="M 500,0 L 500,38 L 867.75,38 Q 881.75,38 881.75,52 L 881.75,76"
              stroke="rgba(110, 237, 194, 0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Terminal node dots at top center of each card */}
            <circle cx="118.25" cy="76" r="3.5" fill="#6EEDC2" filter="url(#mintGlow)" />
            <circle cx="372.75" cy="76" r="3.5" fill="#6EEDC2" filter="url(#mintGlow)" />
            <circle cx="627.25" cy="76" r="3.5" fill="#6EEDC2" filter="url(#mintGlow)" />
            <circle cx="881.75" cy="76" r="3.5" fill="#6EEDC2" filter="url(#mintGlow)" />

            {/* Hub stem junction dot */}
            <circle cx="500" cy="0" r="3.5" fill="#6EEDC2" filter="url(#mintGlow)" />

            {/* Traveling bright mint pulse animations (4s loop, each card receives pulse in turn) */}
            {!isReducedMotion && isInView && (
              <>
                {/* Pulse 0: (0s - 1s) */}
                <circle r="4.5" fill="#FFFFFF" filter="url(#mintGlow)">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    keyPoints="0;1;1;1"
                    keyTimes="0;0.23;0.99;1"
                  >
                    <mpath href="#branch-0" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0;0"
                    keyTimes="0;0.04;0.22;0.25;1"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Pulse 1: (1s - 2s) */}
                <circle r="4.5" fill="#FFFFFF" filter="url(#mintGlow)">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    keyPoints="0;0;1;1;1"
                    keyTimes="0;0.25;0.48;0.99;1"
                  >
                    <mpath href="#branch-1" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0;0"
                    keyTimes="0;0.25;0.29;0.47;0.5;1"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Pulse 2: (2s - 3s) */}
                <circle r="4.5" fill="#FFFFFF" filter="url(#mintGlow)">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    keyPoints="0;0;1;1;1"
                    keyTimes="0;0.5;0.73;0.99;1"
                  >
                    <mpath href="#branch-2" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0;0"
                    keyTimes="0;0.5;0.54;0.72;0.75;1"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Pulse 3: (3s - 4s) */}
                <circle r="4.5" fill="#FFFFFF" filter="url(#mintGlow)">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    keyPoints="0;0;1;1;1"
                    keyTimes="0;0.75;0.98;0.99;1"
                  >
                    <mpath href="#branch-3" />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;0;1;1;0;0"
                    keyTimes="0;0.75;0.79;0.97;0.99;1"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </svg>
        </div>

        {/* Mobile / Tablet vertical connector drop */}
        <div className="flex lg:hidden flex-col items-center w-full py-4 pointer-events-none">
          <div className="w-[2px] h-[36px] bg-gradient-to-b from-[#6EEDC2] to-[#6EEDC2]/40" />
          <div className="w-2 h-2 rounded-full bg-[#6EEDC2] shadow-[0_0_10px_#6EEDC2]" />
        </div>

        {/* ========================================================= */}
        {/* 5) FOUR CARDS (like the reference)                        */}
        {/* ========================================================= */}
        <div className="w-full max-w-[1000px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] items-stretch">
          {cards.map((card, index) => {
            const isPulsed = activeCardPulse === index;

            return (
              <motion.div
                key={card.step}
                initial={
                  isReducedMotion
                    ? false
                    : { opacity: 0, y: 14, filter: 'blur(10px)' }
                }
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.8,
                  delay: isReducedMotion ? 0 : index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative rounded-[18px] p-[18px] flex flex-col justify-between transition-all duration-200 select-none ${
                  isPulsed
                    ? 'border-[#6EEDC2] shadow-[0_0_24px_-4px_rgba(110,237,194,0.45)] -translate-y-1'
                    : 'border-[#6EEDC2]/[0.16] hover:border-[#6EEDC2]/40 hover:-translate-y-1 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)] hover:shadow-[0_24px_48px_-16px_rgba(110,237,194,0.2)]'
                }`}
                style={{
                  minHeight: '215px',
                  background: 'linear-gradient(180deg, #0C1218 0%, #070A0F 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: isPulsed
                    ? '0 0 24px -4px rgba(110,237,194,0.45), inset 0 1px 0 rgba(255,255,255,0.18)'
                    : '0 20px 40px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)',
                }}
              >
                <div>
                  {/* Title row with Step number */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-sans font-semibold text-[18px] leading-[1.2] text-white">
                      {card.title}
                    </h3>
                    <span className="font-sans text-[12px] text-white/40 font-normal tracking-wider">
                      {card.step}
                    </span>
                  </div>

                  {/* Row of icon tiles (36px x 36px, radius 10px, 18px icons, white 80%) */}
                  <div className="flex items-center gap-2 mb-3">
                    {card.icons.map((IconComp, iIdx) => (
                      <div
                        key={iIdx}
                        className="w-9 h-9 rounded-[10px] bg-white/[0.08] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] flex items-center justify-center group-hover:border-white/20 transition-colors"
                      >
                        <IconComp className="w-[18px] h-[18px] text-white/80 stroke-[1.6]" />
                      </div>
                    ))}
                  </div>

                  {/* One-line / concise description */}
                  <p className="text-[12.5px] leading-[1.5] text-white/65 font-sans mb-3 line-clamp-3">
                    {card.description}
                  </p>
                </div>

                {/* "YOU GET:" label and wrapped tags */}
                <div className="pt-2 border-t border-white/[0.06]">
                  <div className="text-[11px] font-sans font-semibold uppercase tracking-[0.08em] text-white/45 mb-2">
                    YOU GET:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11.5px] font-sans font-medium text-white/85 bg-white/[0.08] border border-white/[0.04] rounded-[6px] px-[9px] py-[4px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 6) CTA BUTTON & FOUNDING CLIENT SUBTEXT                   */}
        {/* ========================================================= */}
        <div className="mt-[56px] flex flex-col items-center text-center">
          {/* Centered Mint Button with Arrow icon */}
          <button
            type="button"
            onClick={handleCtaClick}
            className="group relative px-7 py-3.5 rounded-[10px] bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#062B20] font-sans font-semibold text-[15px] cursor-pointer transition-all duration-200 select-none hover:-translate-y-[1px] active:translate-y-0 shadow-[0_8px_20px_-6px_rgba(110,237,194,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(110,237,194,0.65)] flex items-center gap-2"
          >
            <span>Get Free Demo</span>
            <ArrowRight className="w-4 h-4 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Subtext under button */}
          <p className="mt-3 text-[12px] text-white/50 font-sans tracking-normal">
            Founding Client Program: $0 setup, 30 free days.
          </p>
        </div>
      </div>
    </section>
  );
};
