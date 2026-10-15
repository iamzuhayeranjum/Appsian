import { AppsianIcon } from './AppsianLogo';
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
  title: string;
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

  // Four Step Cards Data (Compact, matched to Image 2)
  const cards: StepCardData[] = [
    {
      title: 'Discovery',
      icons: [Wrench, MapPin, Clock],
      tags: ['Service list', 'Service area', 'Emergency rules', 'Business hours'],
    },
    {
      title: 'Setup',
      icons: [Mic, Workflow, CalendarCheck, PhoneCall],
      tags: ['Custom greeting', 'Call flow', 'Booking rules', 'Test calls'],
    },
    {
      title: 'Go live',
      icons: [PhoneForwarded, Moon, ShieldCheck],
      tags: ['Calls answered', 'After-hours cover', 'Callers qualified'],
    },
    {
      title: 'Ongoing',
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

            <div className="relative z-10 w-10 h-10 md:w-[52px] md:h-[52px] rounded-[11px] md:rounded-[14px] bg-gradient-to-tr from-[#6EEDC2] to-[#4A7FF0] p-[2px] md:p-[2.5px] flex items-center justify-center shadow-lg overflow-hidden">
              <AppsianIcon size={36} className="md:hidden" />
              <AppsianIcon size={46} className="hidden md:block" />
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4) CONNECTORS (Bracket branching line down to 4 cards)    */}
        {/* ========================================================= */}
        {/* Desktop / Large screen bracket SVG connector (max-w-[800px] aligned to cards) */}
        <div className="hidden lg:flex justify-center w-full max-w-[800px] h-[52px] relative pointer-events-none mb-0">
          <svg
            viewBox="0 0 800 52"
            className="w-full h-full overflow-visible"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="mintGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 4 Distinct branch paths directly into card top edge (no terminal dots, exactly like Image 2) */}
            {/* Center stem: (400,0) down to (400,26), horizontal bus, then vertical drops at 94, 298, 502, 706 */}
            <path
              id="branch-0"
              d="M 400,0 L 400,26 L 102,26 Q 94,26 94,34 L 94,52"
              stroke="rgba(110, 237, 194, 0.75)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-1"
              d="M 400,0 L 400,26 L 306,26 Q 298,26 298,34 L 298,52"
              stroke="rgba(110, 237, 194, 0.75)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-2"
              d="M 400,0 L 400,26 L 494,26 Q 502,26 502,34 L 502,52"
              stroke="rgba(110, 237, 194, 0.75)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="branch-3"
              d="M 400,0 L 400,26 L 698,26 Q 706,26 706,34 L 706,52"
              stroke="rgba(110, 237, 194, 0.75)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Traveling bright pulse animations along branch paths */}
            {!isReducedMotion && isInView && (
              <>
                {/* Pulse 0 */}
                <circle r="3" fill="#FFFFFF" filter="url(#mintGlow)">
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

                {/* Pulse 1 */}
                <circle r="3" fill="#FFFFFF" filter="url(#mintGlow)">
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

                {/* Pulse 2 */}
                <circle r="3" fill="#FFFFFF" filter="url(#mintGlow)">
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

                {/* Pulse 3 */}
                <circle r="3" fill="#FFFFFF" filter="url(#mintGlow)">
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
        <div className="flex lg:hidden flex-col items-center w-full py-3 pointer-events-none">
          <div className="w-[1.5px] h-[28px] bg-gradient-to-b from-[#6EEDC2] to-[#6EEDC2]/40" />
        </div>

        {/* ========================================================= */}
        {/* 5) FOUR CARDS (rebuilt to match reference Image 2)        */}
        {/* ========================================================= */}
        <div className="w-full max-w-[800px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {cards.map((card, index) => {
            const isPulsed = activeCardPulse === index;

            return (
              <motion.div
                key={card.title}
                initial={
                  isReducedMotion
                    ? false
                    : { opacity: 0, y: 12, filter: 'blur(8px)' }
                }
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.7,
                  delay: isReducedMotion ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`group relative rounded-[14px] p-[14px] pb-4 flex flex-col justify-between transition-all duration-200 select-none overflow-hidden ${
                  isPulsed
                    ? 'border-[#6EEDC2] shadow-[0_0_20px_-3px_rgba(110,237,194,0.45),0_12px_28px_-10px_rgba(0,0,0,0.7)] -translate-y-[2px]'
                    : 'border-[#6EEDC2]/[0.14] hover:border-[#6EEDC2]/35 hover:-translate-y-[2px] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.65)] hover:shadow-[0_16px_32px_-8px_rgba(110,237,194,0.18)]'
                }`}
                style={{
                  minHeight: '175px',
                  background:
                    'radial-gradient(circle at 15% 15%, rgba(110,237,194,0.05) 0%, transparent 60%), linear-gradient(180deg, #0B1523 0%, #070C14 100%)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  boxShadow: isPulsed
                    ? '0 0 20px -3px rgba(110,237,194,0.45), inset 0 1px 0 rgba(255,255,255,0.14)'
                    : '0 12px 28px -10px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)',
                }}
              >
                <div>
                  {/* Title only (no step number) */}
                  <div className="mb-2.5">
                    <h3 className="font-sans font-semibold text-[15px] leading-[1.25] text-white tracking-tight">
                      {card.title}
                    </h3>
                  </div>

                  {/* Icon tiles row (28px x 28px, radius 8px, 14px icons, white 75%) */}
                  <div className="flex items-center gap-1.5 mb-3.5">
                    {card.icons.map((IconComp, iIdx) => (
                      <div
                        key={iIdx}
                        className="w-7 h-7 rounded-[8px] bg-white/[0.07] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] flex items-center justify-center group-hover:border-white/20 transition-colors flex-shrink-0"
                      >
                        <IconComp className="w-3.5 h-3.5 text-white/75 stroke-[1.6]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* "YOU GET:" label and wrapped tags (aligned horizontally across all cards) */}
                <div className="pt-2 border-t border-white/[0.07]">
                  <div className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] text-white/40 mb-1.5">
                    YOU GET:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10.5px] font-sans font-medium text-white/80 bg-white/[0.06] border border-white/[0.04] rounded-[5px] px-2 py-[2.5px] leading-tight"
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
