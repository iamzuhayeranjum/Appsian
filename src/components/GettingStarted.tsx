import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'motion/react';
import {
  ArrowRight,
  Check,
  PhoneIncoming,
  Sparkles,
  Bell,
  User,
} from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { SectionTag } from './SectionTag';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

interface StepItem {
  number: string;
  title: string;
  description: string;
}

const STEPS_DATA: StepItem[] = [
  {
    number: '01',
    title: 'Discovery',
    description:
      'We learn your services, service area, emergency rules and business hours.',
  },
  {
    number: '02',
    title: 'Setup',
    description:
      'We shape the custom greeting, call flow and booking rules, then run test calls.',
  },
  {
    number: '03',
    title: 'Go live',
    description:
      'Your receptionist answers every call, covers after-hours and qualifies callers.',
  },
  {
    number: '04',
    title: 'Ongoing',
    description:
      'See booked estimates, call transcripts, AI summaries and team alerts.',
  },
];

// ---------------------------------------------------------------------------
// Card 1: Discovery Visual (Light Chat)
// ---------------------------------------------------------------------------
const DiscoveryVisual: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[340px] flex flex-col gap-2.5 px-2"
    >
      {/* Q1: Appsian */}
      <div className="flex items-center justify-end gap-2">
        <div className="px-3.5 py-2 rounded-[14px] bg-gradient-to-r from-[#4F5BD6] to-[#6366F1] text-white text-[12px] leading-tight shadow-xs">
          Which services do you offer?
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-[#4F5BD6] flex items-center justify-center shrink-0 shadow-xs">
          <AppsianMark size={16} />
        </div>
      </div>

      {/* A1: User */}
      <div className="flex items-center justify-start gap-2">
        <div className="w-[30px] h-[30px] rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0 shadow-xs border border-[#CBD5E1]">
          <User className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
        <div className="px-3.5 py-2 rounded-[14px] bg-white border border-[#E2E8F0] shadow-xs text-[#1E293B] text-[12px] leading-tight">
          Plumbing, heating and emergency repairs
        </div>
      </div>

      {/* Q2: Appsian */}
      <div className="flex items-center justify-end gap-2">
        <div className="px-3.5 py-2 rounded-[14px] bg-gradient-to-r from-[#4F5BD6] to-[#6366F1] text-white text-[12px] leading-tight shadow-xs">
          When should calls be answered?
        </div>
        <div className="w-[30px] h-[30px] rounded-full bg-[#4F5BD6] flex items-center justify-center shrink-0 shadow-xs">
          <AppsianMark size={16} />
        </div>
      </div>

      {/* A2: User */}
      <div className="flex items-center justify-start gap-2">
        <div className="w-[30px] h-[30px] rounded-full bg-[#F1F5F9] text-[#475569] flex items-center justify-center shrink-0 shadow-xs border border-[#CBD5E1]">
          <User className="w-3.5 h-3.5 stroke-[2.2]" />
        </div>
        <div className="px-3.5 py-2 rounded-[14px] bg-white border border-[#E2E8F0] shadow-xs text-[#1E293B] text-[12px] leading-tight">
          Weekdays 8 to 6, plus emergencies at night
        </div>
      </div>

      {/* Typing indicator row */}
      <div className="flex items-center justify-end gap-2 mt-0.5">
        <div className="h-[24px] px-2.5 rounded-[12px] bg-gradient-to-r from-[#4F5BD6] to-[#6366F1] flex items-center gap-1 shadow-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full bg-white/90 ${reduceMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '0ms' }}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full bg-white/90 ${reduceMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '180ms' }}
          />
          <span
            className={`w-1.5 h-1.5 rounded-full bg-white/90 ${reduceMotion ? '' : 'animate-bounce'}`}
            style={{ animationDelay: '360ms' }}
          />
        </div>
        <div className="w-[30px] shrink-0" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Card 2: Setup Visual (Light Floating Cards)
// ---------------------------------------------------------------------------
const SetupVisual: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  const waveformHeights = [8, 14, 20, 12, 18, 10, 16, 22, 14, 8, 16, 12, 18, 10];

  return (
    <div aria-hidden="true" className="w-full max-w-[340px] relative h-[210px] flex items-center justify-center">
      {/* Top card: Call flow */}
      <motion.div
        animate={reduceMotion ? {} : { y: [-3, 3, -3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1 left-1/2 -translate-x-1/2 w-[220px] rounded-[14px] bg-white/95 border border-[#E2E8F0] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.10)] p-2.5 z-10 -rotate-[1.5deg]"
      >
        <div className="text-[10.5px] font-medium text-[#64748B] mb-1.5">Call flow</div>
        <div className="flex items-center justify-between gap-1.5">
          <div className="px-2 py-0.5 rounded-[6px] bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] font-medium text-[#1E293B]">
            Answer
          </div>
          <div className="w-3.5 h-[1.5px] bg-[#CBD5E1]" />
          <div className="px-2 py-0.5 rounded-[6px] bg-[#F8FAFC] border border-[#CBD5E1] text-[11px] font-medium text-[#1E293B]">
            Qualify
          </div>
          <div className="w-3.5 h-[1.5px] bg-[#CBD5E1]" />
          <div className="px-2 py-0.5 rounded-[6px] bg-[#EEF2FF] border border-[#818CF8] text-[11px] font-semibold text-[#4F5BD6] flex items-center gap-1">
            <span>Book</span>
            <Check className="w-3 h-3 text-[#4F5BD6] stroke-[2.5]" />
          </div>
        </div>
      </motion.div>

      {/* Bottom left card: Greeting */}
      <motion.div
        animate={reduceMotion ? {} : { y: [3, -3, 3] }}
        transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-5 left-1 w-[165px] rounded-[14px] bg-white/95 border border-[#E2E8F0] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.10)] p-2.5 z-20 -rotate-[3deg]"
      >
        <div className="text-[10px] font-medium text-[#64748B]">Greeting</div>
        <div className="text-[10.5px] text-[#1E293B] mt-0.5 italic leading-snug">
          &ldquo;Thanks for calling! How can I help?&rdquo;
        </div>
        <div className="flex items-end gap-[2px] h-[18px] mt-2">
          {waveformHeights.map((h, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full bg-gradient-to-t from-[#4F5BD6] to-[#818CF8]"
              style={{ height: `${h * 0.75}px` }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom right card: Booking rules */}
      <motion.div
        animate={reduceMotion ? {} : { y: [-2, 4, -2] }}
        transition={{ duration: 6, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-3 right-1 w-[160px] rounded-[14px] bg-white/95 border border-[#E2E8F0] shadow-[0_12px_28px_-10px_rgba(0,0,0,0.10)] p-2.5 z-20 rotate-[3deg]"
      >
        <div className="text-[10px] font-medium text-[#64748B] mb-1.5">Booking rules</div>
        <div className="flex flex-col gap-1.5">
          {['Emergencies', 'After hours', 'Service area'].map((rule) => (
            <div key={rule} className="flex items-center justify-between text-[10.5px] text-[#1E293B]">
              <span>{rule}</span>
              <div className="w-6 h-3.5 rounded-full bg-[#EEF2FF] border border-[#E0E7FF] relative p-0.5 flex items-center justify-end">
                <div className="w-2.5 h-2.5 rounded-full bg-[#4F5BD6] shadow-xs" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Test call passed overlapping pill */}
      <div className="absolute -bottom-1 z-30 px-3 py-1 rounded-full bg-white border border-[#34D399] shadow-[0_4px_16px_rgba(16,185,129,0.15)] flex items-center gap-1.5 text-[11px] font-medium text-[#059669]">
        <Check className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />
        <span className="text-[#059669]">Test call passed</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Card 3: Go Live Visual (Light Incoming Call)
// ---------------------------------------------------------------------------
const GoLiveVisual: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  const bars = [6, 12, 18, 24, 16, 10, 20, 26, 14, 8, 22, 18, 12, 26, 20, 14, 24, 18, 10, 16, 12, 8];

  return (
    <div aria-hidden="true" className="w-[84%] max-w-[340px] rounded-[16px] bg-white/95 border border-[#E2E8F0] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.10)] p-3.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12.5px] font-semibold text-[#0F172A]">Incoming call</span>
        <span className="px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[10px] font-medium text-[#64748B] border border-[#E2E8F0]">
          After hours
        </span>
      </div>

      {/* Caller info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-[#4F5BD6] to-[#6366F1] text-white flex items-center justify-center shrink-0 shadow-xs">
            <PhoneIncoming className="w-4 h-4 stroke-[2]" />
            {/* Pulsing ring */}
            {!reduceMotion && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full border-2 border-[#6366F1] pointer-events-none"
              />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-[#0F172A] leading-tight truncate">
              Zach P.
            </div>
            <div className="text-[10.5px] text-[#64748B] leading-tight truncate mt-0.5">
              Answered by your AI receptionist
            </div>
          </div>
        </div>
        <div className="tabular-nums font-mono text-[11.5px] font-semibold text-[#4F5BD6] shrink-0">
          0:12
        </div>
      </div>

      {/* Waveform bars */}
      <div className="flex items-center justify-between gap-[2px] h-[26px] mt-3.5 px-0.5">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            animate={
              reduceMotion
                ? {}
                : {
                    height: [`${h * 0.5}px`, `${h}px`, `${h * 0.5}px`],
                  }
            }
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: (i % 6) * 0.12,
              ease: 'easeInOut',
            }}
            className="w-[2.5px] rounded-full bg-[#6366F1]"
            style={{
              height: `${h * 0.8}px`,
              opacity: i % 3 === 0 ? 0.45 : 0.95,
            }}
          />
        ))}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#F1F5F9]">
        <span className="px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[10.5px] font-medium text-[#4338CA] border border-[#C7D2FE]">
          Qualified
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[10.5px] font-medium text-[#B45309] border border-[#FDE68A]">
          Emergency
        </span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Card 4: Ongoing Visual (Light Dashboard)
// ---------------------------------------------------------------------------
const OngoingVisual: React.FC<{ reduceMotion: boolean | null }> = () => {
  return (
    <div aria-hidden="true" className="w-[88%] max-w-[340px] relative">
      <div className="rounded-[16px] bg-white/95 border border-[#E2E8F0] shadow-[0_14px_32px_-10px_rgba(0,0,0,0.10)] p-3.5">
        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] font-semibold text-[#0F172A]">Booked estimates</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[10px] font-medium text-[#4338CA] border border-[#C7D2FE]">
            <Bell className="w-2.5 h-2.5 text-[#4F5BD6]" />
            <span>Team alert sent</span>
          </span>
        </div>

        {/* 3 rows */}
        <div className="flex flex-col gap-1.5">
          {[
            { initials: 'MR', name: 'Mark R.', time: 'Tomorrow, 10:00 AM', bg: 'bg-[#EEF2FF]', color: 'text-[#4338CA]' },
            { initials: 'SK', name: 'Sarah K.', time: 'Thu, 2:30 PM', bg: 'bg-[#ECFDF5]', color: 'text-[#059669]' },
            { initials: 'DL', name: 'David L.', time: 'Fri, 9:00 AM', bg: 'bg-[#FEF3C7]', color: 'text-[#B45309]' },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 p-1.5 rounded-[8px] bg-[#F8FAFC] border border-[#F1F5F9]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full ${item.bg} ${item.color} text-[10px] font-semibold flex items-center justify-center shrink-0`}
                >
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-medium text-[#0F172A] leading-tight truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-[#64748B] leading-tight truncate">
                    {item.time}
                  </div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded-[5px] bg-[#ECFDF5] text-[10px] font-semibold text-[#059669] border border-[#A7F3D0] shrink-0">
                Booked
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating AI summary overlapping bottom right */}
      <div className="absolute -bottom-2 -right-1.5 w-[190px] rounded-[12px] bg-white border border-[#E2E8F0] shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-2 z-10">
        <div className="flex items-center gap-1 text-[10.5px] font-semibold text-[#4F5BD6]">
          <Sparkles className="w-3 h-3 text-[#4F5BD6]" />
          <span>AI summary</span>
        </div>
        <p className="text-[10px] text-[#334155] leading-snug mt-1">
          Burst pipe, urgent. Booked for tomorrow.
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export const GettingStarted: React.FC<GettingStartedProps> = ({ onSuccessDemo }) => {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [containerHeight, setContainerHeight] = useState(1600);
  const [nodeTops, setNodeTops] = useState<number[]>([10, 480, 950, 1420]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Measure container height and node top positions
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const containerRect = el.getBoundingClientRect();
      setContainerHeight(containerRect.height);

      const tops = rowRefs.current.map((row) => {
        if (!row) return 0;
        const rowRect = row.getBoundingClientRect();
        return rowRect.top - containerRect.top + 10;
      });
      if (tops.length === 4) {
        setNodeTops(tops);
      }
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Motion scroll progress across the steps container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 65%', 'end 65%'],
  });

  // Calculate filled line scaleY
  const scaleY = useTransform(scrollYProgress, (v) => {
    const maxL = Math.max(1, containerHeight - 18);
    const filled = Math.min(maxL, Math.max(0, v * containerHeight - 18));
    return filled / maxL;
  });

  // Monitor scroll progress to update active step index
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const currentPx = latest * containerHeight;
    let idx = -1;
    for (let i = 0; i < nodeTops.length; i++) {
      if (currentPx >= (nodeTops[i] || 0) + 8) {
        idx = i;
      }
    }
    setActiveStepIndex(idx);
  });

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

  const cardVisuals = [
    <DiscoveryVisual key="c1" reduceMotion={reduceMotion} />,
    <SetupVisual key="c2" reduceMotion={reduceMotion} />,
    <GoLiveVisual key="c3" reduceMotion={reduceMotion} />,
    <OngoingVisual key="c4" reduceMotion={reduceMotion} />,
  ];

  return (
    <section
      id="getting-started"
      className="w-full bg-[#F5F6F8] pt-0 px-0 pb-16 md:pb-24 font-sans select-none"
    >
      {/* INNER PANEL (LIGHT, EDGE-TO-EDGE, SQUARE TOP, CURVED BOTTOM, NO BACKGROUND GLOWS) */}
      <div className="w-full rounded-t-none rounded-b-[28px] md:rounded-b-[48px] bg-white border-b border-[#E5E7EB] py-16 px-5 md:py-[112px] md:px-10 relative overflow-hidden">
        {/* CONTENT WRAPPER */}
        <div className="max-w-[1040px] mx-auto w-full relative z-10 flex flex-col items-center">
          {/* HEADER BLOCK */}
          <div className="flex flex-col items-center text-center mb-[72px] md:mb-[96px]">
            {/* Badge */}
            <SectionTag label="Getting Started" icon="rocket" className="mb-6" />

            {/* Heading */}
            <h2 className="text-[clamp(36px,4.2vw,56px)] tracking-[-0.035em] leading-[1.05] text-center font-display mb-4">
              <span className="font-light text-[#555C6D]">From signup to</span>
              <span className="font-semibold text-[#0E1118]"> booked jobs</span>
            </h2>

            {/* Subline */}
            <p className="text-[16px] text-[#555C6D] max-w-[440px] text-center mt-4 font-normal leading-[1.6]">
              Four simple steps from first conversation to a receptionist that never misses a call.
            </p>
          </div>

          {/* THE TIMELINE CONTAINER */}
          <div ref={containerRef} className="w-full relative">
            {/* Track Line */}
            <div
              aria-hidden="true"
              className="absolute left-[7px] top-[18px] bottom-0 w-[2px] rounded-[2px] bg-[#E5E7EB] pointer-events-none"
            />

            {/* Fill Line */}
            <motion.div
              aria-hidden="true"
              style={{ scaleY }}
              className="absolute left-[7px] top-[18px] bottom-0 w-[2px] rounded-[2px] origin-top bg-gradient-to-b from-[#4F5BD6] to-[#6366F1] shadow-[0_0_10px_rgba(79,91,214,0.35)] pointer-events-none z-10"
            />

            {/* Steps Rows */}
            <div className="flex flex-col gap-y-[56px] md:gap-y-[72px]">
              {STEPS_DATA.map((step, index) => {
                const isActive = activeStepIndex >= index;
                const isCurrentActive = activeStepIndex === index;
                const isFuture = index > activeStepIndex;

                return (
                  <div
                    key={step.number}
                    ref={(el) => {
                      rowRefs.current[index] = el;
                    }}
                    className="relative flex flex-col pl-10 md:pl-0 md:grid md:grid-cols-[48px_1fr_400px] md:gap-x-8 items-start md:min-h-[380px]"
                  >
                    {/* TIMELINE GUTTER / NODE */}
                    <div className="absolute left-0 top-[6px] md:static md:top-auto md:left-auto md:mt-[8px] flex items-center justify-start z-20">
                      <div
                        className={`step-node w-4 h-4 rounded-[5px] transition-all duration-300 ${
                          isActive
                            ? 'bg-[#4F5BD6] border-[2px] border-white shadow-[0_0_0_3px_rgba(79,91,214,0.25)]'
                            : 'bg-[#F1F5F9] border-[1.5px] border-[#CBD5E1] shadow-none'
                        }`}
                      />
                    </div>

                    {/* TEXT COLUMN */}
                    <div className="flex flex-col justify-start">
                      {/* Title row + step number */}
                      <div className="flex items-center gap-2.5">
                        <h3
                          className={`font-display text-[clamp(24px,2.4vw,30px)] font-[500] tracking-[-0.02em] leading-tight transition-colors duration-300 ${
                            isActive ? 'text-[#0E1118]' : 'text-[#94A3B8]'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <span
                          className={`h-[22px] px-2 rounded-full border text-[12px] font-semibold inline-flex items-center justify-center transition-colors duration-300 ${
                            isActive
                              ? 'bg-[#EEF2FF] border-[#D5DDFF] text-[#4F5BD6]'
                              : 'bg-[#F1F5F9] border-[#E2E8F0] text-[#94A3B8]'
                          }`}
                        >
                          {step.number}
                        </span>
                      </div>

                      {/* Description */}
                      <p
                        className={`mt-3.5 md:mt-10 text-[15.5px] leading-[1.6] max-w-[360px] transition-colors duration-300 ${
                          isActive ? 'text-[#4B5563]' : 'text-[#94A3B8]'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* VISUAL CARD (right column) */}
                    <motion.div
                      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className={`mt-6 md:mt-0 w-full max-w-[420px] md:max-w-[400px] h-[260px] md:h-[300px] rounded-[28px] overflow-hidden relative select-none flex items-center justify-center border transition-all duration-500 ${
                        isCurrentActive
                          ? 'border-[#C7D2FE] shadow-[0_24px_50px_-20px_rgba(79,91,214,0.22)]'
                          : 'border-[#E2E8F0] shadow-[0_16px_40px_-24px_rgba(0,0,0,0.08)]'
                      }`}
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                        opacity: isFuture ? 0.7 : 1,
                      }}
                    >
                      {/* Soft rising glow from bottom edge of card */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                        style={{
                          opacity: isCurrentActive ? 1 : 0.6,
                          background:
                            'radial-gradient(75% 60% at 50% 118%, rgba(99,102,241,0.20), rgba(99,102,241,0) 70%)',
                        }}
                      />

                      {/* Inner card UI */}
                      <div className="relative z-10 w-full flex items-center justify-center">
                        {cardVisuals[index]}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CALL TO ACTION BLOCK */}
          <div className="mt-[72px] md:mt-[96px] flex flex-col items-center text-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-premium btn-premium--mint group relative h-[52px] px-7 rounded-[14px] font-sans font-semibold text-[15px] cursor-pointer select-none flex items-center justify-center gap-2.5"
            >
              <span>Get Free Demo</span>
              <ArrowRight className="btn-arrow w-4 h-4" strokeWidth={2} />
            </button>

            <p className="mt-3.5 text-[13px] text-[#64748B] font-sans tracking-normal">
              Founding Client Program: $0 setup, 30 free days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
