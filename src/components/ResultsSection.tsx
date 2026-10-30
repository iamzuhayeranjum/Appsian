import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PhoneIncoming,
  Phone,
  CalendarCheck,
  Megaphone,
  ClipboardCheck,
  Check,
  Bell,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { SectionHeader } from './design-system';
import { SectionTag } from './SectionTag';

interface ResultsSectionProps {
  onSuccessDemo?: () => void;
}

// ---------------------------------------------------------------------------
// Compact Mini-Cards for Active Result Illustration
// ---------------------------------------------------------------------------

interface CompactCardProps {
  title: string;
  className?: string;
  delay?: number;
  floatY?: [number, number, number];
  floatDuration?: number;
  reduceMotion: boolean | null;
  children: React.ReactNode;
}

const CompactCard: React.FC<CompactCardProps> = ({
  title,
  className = '',
  delay = 0,
  floatY = [-2, 2, -2],
  floatDuration = 6,
  reduceMotion,
  children,
}) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
    animate={
      reduceMotion
        ? { opacity: 1, y: 0 }
        : {
            opacity: 1,
            y: floatY,
          }
    }
    transition={
      reduceMotion
        ? { duration: 0.2 }
        : {
            opacity: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] },
            y: {
              repeat: Infinity,
              duration: floatDuration,
              ease: 'easeInOut',
              delay: delay + 0.45,
            },
          }
    }
    className={`rounded-[14px] bg-white border border-[rgba(15,23,42,0.06)] shadow-[0_12px_28px_-14px_rgba(30,60,160,0.35)] p-2.5 ${className}`}
  >
    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-[rgba(15,23,42,0.04)]">
      <span className="text-[12px] font-semibold text-[#0b1530] tracking-tight">{title}</span>
      <span className="flex gap-[2.5px]" aria-hidden="true">
        <i className="w-[3px] h-[3px] rounded-full bg-[#94a3b8]" />
        <i className="w-[3px] h-[3px] rounded-full bg-[#94a3b8]" />
        <i className="w-[3px] h-[3px] rounded-full bg-[#94a3b8]" />
      </span>
    </div>
    {children}
  </motion.div>
);

const Chip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="shrink-0 rounded-full bg-[#dcfce7] px-2 py-[1.5px] text-[10.5px] font-medium text-[#15803d]">
    {children}
  </span>
);

const CardRow: React.FC<{ icon?: React.ReactNode; label: string; right?: React.ReactNode }> = ({
  icon,
  label,
  right,
}) => (
  <div className="flex items-center justify-between gap-1.5 rounded-[8px] bg-[#f8fafc] px-2 py-[4px]">
    <span className="flex items-center gap-1.5 text-[11px] text-[#0b1530]">
      {icon}
      {label}
    </span>
    {right}
  </div>
);

const CheckTick: React.FC = () => (
  <span className="inline-flex w-3.5 h-3.5 shrink-0 items-center justify-center rounded-full bg-[#10b981] text-white">
    <Check className="w-2.5 h-2.5 stroke-[3]" aria-hidden="true" />
  </span>
);

const CheckItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-[11px] text-[#0b1530]">
    <CheckTick />
    <span>{label}</span>
  </div>
);

const CardKeyValue: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex items-center justify-between gap-2 text-[11px]">
    <span className="text-[#64748b]">{k}</span>
    <span className="font-medium text-[#0b1530] text-right truncate max-w-[130px]">{v}</span>
  </div>
);

const CardIconTile: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex w-6 h-6 shrink-0 items-center justify-center rounded-[8px] bg-[#eaf1ff] text-[#1d4ed8]">
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// Illustrations for the Active Row
// ---------------------------------------------------------------------------

interface IllustrationProps {
  index: number;
  reduceMotion: boolean | null;
  isMobile?: boolean;
}

const IllustrationCards: React.FC<IllustrationProps> = ({ index, reduceMotion, isMobile }) => {
  switch (index) {
    case 0:
      return (
        <>
          <CompactCard
            title="Incoming calls"
            delay={0}
            floatY={[-2, 2, -2]}
            floatDuration={5.5}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-2 top-2 w-[62%] z-10' : 'absolute left-3 top-2.5 w-[56%] z-10'}
          >
            <div className="flex flex-col gap-1">
              <CardRow
                icon={<PhoneIncoming className="w-3 h-3 text-[#64748b]" />}
                label="After-hours call"
                right={<Chip>Answered</Chip>}
              />
              <CardRow
                icon={<PhoneIncoming className="w-3 h-3 text-[#64748b]" />}
                label="Weekend call"
                right={<Chip>Answered</Chip>}
              />
              <CardRow
                icon={<PhoneIncoming className="w-3 h-3 text-[#64748b]" />}
                label="Holiday call"
                right={<Chip>Answered</Chip>}
              />
            </div>
          </CompactCard>

          <CompactCard
            title="Caller details"
            delay={0.08}
            floatY={[2, -2, 2]}
            floatDuration={6.2}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute right-2 top-[34px] w-[52%] z-20' : 'absolute right-3 top-[28px] w-[46%] z-20'}
          >
            <div className="flex flex-col gap-1.5">
              <CardKeyValue k="Service needed" v="Emergency repair" />
              <CardKeyValue k="Location" v="In your service area" />
            </div>
          </CompactCard>

          <CompactCard
            title="Enquiry captured"
            delay={0.16}
            floatY={[-1.5, 2.5, -1.5]}
            floatDuration={6.8}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-3.5 bottom-2.5 w-[68%] z-30' : 'absolute left-[16%] bottom-2.5 w-[58%] z-30'}
          >
            <div className="flex items-center gap-2">
              <CheckTick />
              <span className="text-[11px] text-[#64748b]">Saved with the call transcript</span>
            </div>
          </CompactCard>
        </>
      );

    case 1:
      return (
        <>
          <CompactCard
            title="Qualified caller"
            delay={0}
            floatY={[-2, 2, -2]}
            floatDuration={5.6}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-2 top-2 w-[62%] z-10' : 'absolute left-3 top-2.5 w-[56%] z-10'}
          >
            <div className="flex flex-col gap-1.5">
              <CheckItem label="Service is in your list" />
              <CheckItem label="Inside your service area" />
              <CheckItem label="Fits your rules" />
            </div>
          </CompactCard>

          <CompactCard
            title="Booked estimate"
            delay={0.08}
            floatY={[2, -2, 2]}
            floatDuration={6.4}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute right-2 top-[34px] w-[54%] z-20' : 'absolute right-3 top-[28px] w-[49%] z-20'}
          >
            <div className="flex items-center gap-2">
              <CardIconTile>
                <CalendarCheck className="w-3.5 h-3.5" />
              </CardIconTile>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-medium text-[#0b1530] leading-tight truncate">Estimate booked</div>
                <div className="text-[10.5px] text-[#64748b] leading-tight truncate">Added to your calendar</div>
              </div>
              <Chip>Booked</Chip>
            </div>
          </CompactCard>

          <CompactCard
            title="From enquiry to job"
            delay={0.16}
            floatY={[-1.5, 2.5, -1.5]}
            floatDuration={6.7}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-3.5 bottom-2.5 w-[72%] z-30' : 'absolute left-[14%] bottom-2.5 w-[62%] z-30'}
          >
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[#64748b]">Enquiry</span>
              <ChevronRight className="w-3 h-3 text-[#94a3b8]" aria-hidden="true" />
              <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[#64748b]">Qualified</span>
              <ChevronRight className="w-3 h-3 text-[#94a3b8]" aria-hidden="true" />
              <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 font-medium text-[#15803d]">Booked</span>
            </div>
          </CompactCard>
        </>
      );

    case 2:
      return (
        <>
          <CompactCard
            title="Calls from your ads"
            delay={0}
            floatY={[-2, 2, -2]}
            floatDuration={5.4}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-2 top-2 w-[62%] z-10' : 'absolute left-3 top-2.5 w-[56%] z-10'}
          >
            <div className="flex flex-col gap-1">
              <CardRow
                icon={<Phone className="w-3 h-3 text-[#64748b]" />}
                label="New enquiry"
                right={<Chip>Answered</Chip>}
              />
              <CardRow
                icon={<Phone className="w-3 h-3 text-[#64748b]" />}
                label="New enquiry"
                right={<Chip>Qualified</Chip>}
              />
            </div>
          </CompactCard>

          <CompactCard
            title="Demand you pay for"
            delay={0.08}
            floatY={[2, -2, 2]}
            floatDuration={6.3}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute right-2 top-[34px] w-[52%] z-20' : 'absolute right-3 top-[28px] w-[48%] z-20'}
          >
            <div className="flex flex-col gap-1.5">
              <CheckItem label="Enquiries answered" />
              <CheckItem label="Callers qualified" />
              <CheckItem label="Estimates booked" />
            </div>
          </CompactCard>

          <CompactCard
            title="Qualified opportunity"
            delay={0.16}
            floatY={[-1.5, 2.5, -1.5]}
            floatDuration={6.9}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-3.5 bottom-2.5 w-[68%] z-30' : 'absolute left-[16%] bottom-2.5 w-[58%] z-30'}
          >
            <div className="flex items-center gap-2">
              <CheckTick />
              <span className="text-[11px] text-[#64748b]">Ready for your team</span>
            </div>
          </CompactCard>
        </>
      );

    case 3:
      return (
        <>
          <CompactCard
            title="Call transcript"
            delay={0}
            floatY={[-2, 2, -2]}
            floatDuration={5.5}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-2 top-2 w-[66%] z-10' : 'absolute left-3 top-2.5 w-[58%] z-10'}
          >
            <div className="flex flex-col gap-1 text-[11px] leading-tight">
              <div>
                <span className="text-[#64748b]">Caller: </span>
                <span className="text-[#0b1530]">My water heater has stopped working.</span>
              </div>
              <div>
                <span className="text-[#64748b]">Receptionist: </span>
                <span className="text-[#0b1530]">I can help with that. What is the address?</span>
              </div>
            </div>
          </CompactCard>

          <CompactCard
            title="AI summary"
            delay={0.08}
            floatY={[2, -2, 2]}
            floatDuration={6.1}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute right-2 top-[34px] w-[52%] z-20' : 'absolute right-3 top-[28px] w-[46%] z-20'}
          >
            <div className="flex flex-col gap-1">
              <CardKeyValue k="Service" v="Water heater repair" />
              <CardKeyValue k="Urgency" v="Emergency" />
              <CardKeyValue k="Next step" v="Estimate booked" />
            </div>
          </CompactCard>

          <CompactCard
            title="Team alert"
            delay={0.16}
            floatY={[-1.5, 2.5, -1.5]}
            floatDuration={6.6}
            reduceMotion={reduceMotion}
            className={isMobile ? 'absolute left-3.5 bottom-2.5 w-[68%] z-30' : 'absolute left-[16%] bottom-2.5 w-[58%] z-30'}
          >
            <div className="flex items-center gap-2">
              <CardIconTile>
                <Bell className="w-3.5 h-3.5" />
              </CardIconTile>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-medium text-[#0b1530] leading-tight truncate">New booked estimate</div>
                <div className="text-[10.5px] text-[#64748b] leading-tight truncate">Sent to your team</div>
              </div>
            </div>
          </CompactCard>
        </>
      );

    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// The 4 Results Data
// ---------------------------------------------------------------------------

interface ResultItem {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const RESULTS: ResultItem[] = [
  {
    title: 'More opportunities captured',
    description: 'Enquiries that previously would have gone unanswered.',
    Icon: PhoneIncoming,
  },
  {
    title: 'More jobs won',
    description: 'Enquiries that actually convert into paying customers.',
    Icon: CalendarCheck,
  },
  {
    title: 'More value from existing ad spend',
    description: 'Turn more of the demand you already pay for into qualified opportunities.',
    Icon: Megaphone,
  },
  {
    title: 'Less administrative work',
    description: 'Fewer repetitive calls and less manual information gathering.',
    Icon: ClipboardCheck,
  },
];

// ---------------------------------------------------------------------------
// Main ResultsSection Component
// ---------------------------------------------------------------------------

export const ResultsSection: React.FC<ResultsSectionProps> = ({ onSuccessDemo }) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Screen width observer
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Intersection observer for section presence
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance loop: every 6s (desktop) or 7s (mobile) until first user interaction
  useEffect(() => {
    if (reduceMotion || hasInteracted || !isInView || isHovered || isFocused) {
      return;
    }
    const intervalTime = isDesktop ? 6000 : 7000;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % RESULTS.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [reduceMotion, hasInteracted, isInView, isHovered, isFocused, isDesktop]);

  // Keyboard navigation for WAI-ARIA radio group
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % RESULTS.length;
      setActive(next);
      setHasInteracted(true);
      buttonRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + RESULTS.length) % RESULTS.length;
      setActive(prev);
      setHasInteracted(true);
      buttonRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
      setHasInteracted(true);
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(RESULTS.length - 1);
      setHasInteracted(true);
      buttonRefs.current[RESULTS.length - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(index);
      setHasInteracted(true);
    }
  };

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
      id="results"
      ref={sectionRef}
      className="w-full bg-[var(--page-gray,#F5F6F8)] font-sans py-[100px]"
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        {/* Section Heading & Eyebrow */}
        <div className="px-2 sm:px-6">
          <SectionHeader
            eyebrow={<SectionTag label="Results" icon="trending-up" />}
            headline={[
              { text: 'What changes when', weight: 'light' },
              { text: 'every call is answered.', weight: 'strong' },
            ]}
            subline="The results you can expect from using an AI phone calling agent."
          />
        </div>

        {/* List Container Shell */}
        <div className="max-w-[1040px] mx-auto px-5 md:px-8 mt-14 md:mt-[72px]">
          <div
            className="w-full bg-[#FFFFFF] border border-[rgba(15,23,42,0.06)] rounded-[32px] p-3 md:px-7 md:py-4 shadow-[0_30px_70px_-40px_rgba(30,60,160,0.25)] relative"
            style={{ minHeight: isDesktop ? '624px' : undefined }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsFocused(false);
              }
            }}
          >
            <ul
              role="radiogroup"
              aria-label="What changes when every call is answered"
              className="flex flex-col relative w-full"
            >
              {RESULTS.map((result, index) => {
                const isActive = active === index;
                const { Icon } = result;

                return (
                  <React.Fragment key={result.title}>
                    <li className="relative w-full">
                      <button
                        ref={(el) => {
                          buttonRefs.current[index] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActive(index);
                          setHasInteracted(true);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`group relative w-full rounded-[24px] text-left cursor-pointer transition-colors duration-200 outline-none select-none flex flex-col justify-center focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-[3px] ${
                          !isActive ? 'hover:bg-[rgba(59,130,246,0.04)]' : ''
                        }`}
                      >
                        {/* Highlight Box with motion layout animation */}
                        {isActive && (
                          <motion.div
                            layoutId="result-highlight"
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 260, damping: 30 }
                            }
                            className="absolute -inset-x-2 inset-y-0 rounded-[24px] pointer-events-none"
                            style={{
                              background: 'linear-gradient(135deg, #f6f9ff 0%, #eaf1ff 100%)',
                              boxShadow: '0 18px 44px -20px rgba(37,99,235,0.45)',
                            }}
                          >
                            {/* Radial glow in top-right corner */}
                            <div
                              className="absolute inset-0 rounded-[24px] pointer-events-none"
                              style={{
                                background:
                                  'radial-gradient(45% 90% at 100% 0%, rgba(59,130,246,0.22), rgba(59,130,246,0) 70%)',
                              }}
                            />
                            {/* Rotating 1px gradient border */}
                            <div className="result-highlight-border" />
                          </motion.div>
                        )}

                        {/* DESKTOP ROW CONTENT (>= 768px) */}
                        <div
                          className={`hidden md:flex items-center gap-5 py-6 px-2 w-full relative z-10 transition-[min-height] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive ? 'min-h-[232px]' : 'min-h-[120px]'
                          }`}
                        >
                          {/* LEFT: Icon Tile (56px) */}
                          <div
                            className={`w-[56px] h-[56px] rounded-[16px] shrink-0 flex items-center justify-center relative transition-all duration-250 ${
                              isActive ? 'text-white' : 'text-[#1e3a8a]'
                            }`}
                            style={
                              isActive
                                ? {
                                    background: 'linear-gradient(135deg, #5b8def, #1d4ed8)',
                                    boxShadow:
                                      '0 10px 24px -10px rgba(29,78,216,0.6), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.45)',
                                  }
                                : {
                                    background: '#EAF1FF',
                                    border: '1px solid rgba(59,130,246,0.18)',
                                  }
                            }
                          >
                            <Icon className="w-6 h-6 stroke-[1.75]" />
                          </div>

                          {/* MIDDLE: Title & Description */}
                          <div className="flex flex-col text-left max-w-[460px] mr-auto">
                            <h3 className="font-display font-semibold text-[20px] lg:text-[22px] tracking-[-0.015em] text-[#0b1530] leading-snug">
                              {result.title}
                            </h3>
                            <p className="text-[14.5px] leading-[1.55] text-[#64748b] mt-1.5">
                              {result.description}
                            </p>
                          </div>

                          {/* RIGHT: Illustration (Active) or Arrow Button (Inactive) */}
                          {isActive ? (
                            <div
                              className="w-[52%] min-w-[440px] max-w-[560px] h-[184px] rounded-[22px] p-3.5 relative overflow-hidden shrink-0 ml-auto select-none"
                              style={{
                                background: 'linear-gradient(135deg, #eef5ff 0%, #e2edff 100%)',
                                border: '1px solid rgba(59,130,246,0.14)',
                              }}
                              aria-hidden="true"
                            >
                              <IllustrationCards index={index} reduceMotion={reduceMotion} />
                            </div>
                          ) : (
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(15,23,42,0.12)] text-[#64748b] group-hover:border-[rgba(59,130,246,0.4)] group-hover:text-[#1d4ed8] transition-all duration-200 shrink-0 ml-auto"
                              aria-hidden="true"
                            >
                              <ChevronRight className="w-4 h-4 text-current transition-transform duration-200 group-hover:translate-x-[3px]" />
                            </div>
                          )}
                        </div>

                        {/* MOBILE ROW CONTENT (< 768px) */}
                        <div className="flex md:hidden flex-col w-full py-4 px-2 relative z-10">
                          {/* Title line with Icon tile & Title on left, Arrow button on right */}
                          <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center relative transition-all duration-250 ${
                                  isActive ? 'text-white' : 'text-[#1e3a8a]'
                                }`}
                                style={
                                  isActive
                                    ? {
                                        background: 'linear-gradient(135deg, #5b8def, #1d4ed8)',
                                        boxShadow:
                                          '0 10px 24px -10px rgba(29,78,216,0.6), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.45)',
                                      }
                                    : {
                                        background: '#EAF1FF',
                                        border: '1px solid rgba(59,130,246,0.18)',
                                      }
                                }
                              >
                                <Icon className="w-5 h-5 stroke-[1.75]" />
                              </div>
                              <h3 className="font-display font-semibold text-[17px] text-[#0b1530] tracking-[-0.015em] leading-snug">
                                {result.title}
                              </h3>
                            </div>

                            {!isActive && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(15,23,42,0.12)] text-[#64748b] shrink-0"
                                aria-hidden="true"
                              >
                                <ChevronRight className="w-4 h-4 text-current" />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[14px] leading-relaxed text-[#64748b] text-left mt-2.5 w-full">
                            {result.description}
                          </p>

                          {/* Expanded Illustration for Active row on mobile */}
                          {isActive && (
                            <div
                              className="w-full h-[210px] mt-3.5 rounded-[18px] p-2.5 relative overflow-hidden select-none"
                              style={{
                                background: 'linear-gradient(135deg, #eef5ff 0%, #e2edff 100%)',
                                border: '1px solid rgba(59,130,246,0.14)',
                              }}
                              aria-hidden="true"
                            >
                              <IllustrationCards index={index} reduceMotion={reduceMotion} isMobile />
                            </div>
                          )}
                        </div>
                      </button>
                    </li>

                    {/* 1px Hairline divider between rows: hidden next to active row */}
                    {index < RESULTS.length - 1 && (
                      <div
                        className={`h-[1px] w-full transition-opacity duration-200 pointer-events-none ${
                          active === index || active === index + 1 ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ backgroundColor: 'rgba(15,23,42,0.08)' }}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>

          {/* Centered "Get Free Demo" CTA button */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-premium btn-premium--dark btn-glitter group h-[52px] md:h-[48px] px-7 rounded-[12px] text-[16px] font-semibold text-white inline-flex items-center justify-center gap-[10px] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[rgba(124,92,255,0.6)] focus-visible:outline-offset-[2px]"
            >
              <span>Get Free Demo</span>
              <ArrowRight className="btn-arrow w-[18px] h-[18px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
