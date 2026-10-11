import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import {
  Sparkles,
  Check,
  Wrench,
  MapPin,
  Clock,
  Tag,
  Siren,
  MessageCircleQuestion,
  Star,
  Volume2,
  Play,
  PhoneIncoming,
  ListChecks,
  CalendarCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { DemoBar } from './DemoBar';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

// Background noise overlay (3% opacity SVG feTurbulence)
const NoiseOverlay: React.FC = () => (
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay z-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

export const GettingStarted: React.FC<GettingStartedProps> = ({ onSuccessDemo }) => {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Formatted date for Phone mockup in Step 4
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <section
      id="getting-started"
      className="w-full bg-[#040506] overflow-clip py-[120px] relative text-white"
    >
      <div
        ref={containerRef}
        className="max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center"
      >
        {/* ========================================================= */}
        {/* HEADER                                                    */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-16">
          {/* Eyebrow pill */}
          <div className="h-[32px] px-3.5 rounded-[10px] bg-white/[0.06] border border-white/[0.1] inline-flex items-center gap-2 select-none mb-6 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.08em] text-white/90">
              Getting Started
            </span>
          </div>

          {/* H2 in ONE line, 48px, light weight, white */}
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-display font-light text-white leading-[1.1] tracking-[-0.03em] mb-3">
            Getting Started
          </h2>

          {/* Subtext 15px rgba(255,255,255,0.55) */}
          <p className="text-[15px] leading-[1.6] text-white/55 font-sans max-w-xl">
            Four simple steps from first conversation to a receptionist that never misses a call.
          </p>
        </div>

        {/* ========================================================= */}
        {/* FOUR BIG FULL-WIDTH CARDS STACKED VERTICALLY              */}
        {/* ========================================================= */}
        <div className="w-full flex flex-col gap-8 items-center">
          {/* CARD 1: Text Left / Visual Right */}
          <StepCardWrapper index={0} isReducedMotion={isReducedMotion}>
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Text half: Left */}
              <div className="h-full flex flex-col justify-center px-8 sm:px-12 lg:pl-14 lg:pr-8 py-10 lg:py-0">
                <div className="text-[11px] uppercase tracking-[0.08em] font-sans mb-3 text-white/45">
                  <span className="text-[#6EEDC2] font-semibold">STEP 1</span> · DISCOVERY
                </div>
                <h3 className="text-2xl sm:text-[32px] font-display font-light text-white leading-[1.2] tracking-[-0.02em] mb-4">
                  Tell us how your business runs
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/60 font-sans max-w-[380px]">
                  We learn your services, service area, hours, pricing rules and what counts as an emergency, so your AI receptionist answers the way you would.
                </p>
              </div>

              {/* Visual half: Right (Node diagram) */}
              <div className="p-3 h-full">
                <div className="w-full h-[400px] lg:h-full rounded-[20px] bg-[#07080A] border border-white/[0.06] relative overflow-hidden flex flex-col items-center justify-between p-4 sm:p-5">
                  <NoiseOverlay />
                  {/* Soft radial light behind hero element */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 65% 55% at 50% 35%, rgba(110,237,194,0.07), transparent 70%)',
                    }}
                  />
                  <Visual1NodeDiagram isReducedMotion={isReducedMotion} />
                </div>
              </div>
            </div>
          </StepCardWrapper>

          {/* CARD 2: Visual Left / Text Right */}
          <StepCardWrapper index={1} isReducedMotion={isReducedMotion}>
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Visual half: Left (Agent setup app window) */}
              <div className="p-3 h-full order-2 lg:order-1">
                <div className="w-full h-[400px] lg:h-full rounded-[20px] bg-[#07080A] border border-white/[0.06] relative overflow-hidden p-4 sm:p-5">
                  <NoiseOverlay />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 65% 55% at 45% 45%, rgba(110,237,194,0.07), transparent 70%)',
                    }}
                  />
                  <Visual2AgentSetup isReducedMotion={isReducedMotion} />
                </div>
              </div>

              {/* Text half: Right */}
              <div className="h-full flex flex-col justify-center px-8 sm:px-12 lg:pl-14 lg:pr-8 py-10 lg:py-0 order-1 lg:order-2">
                <div className="text-[11px] uppercase tracking-[0.08em] font-sans mb-3 text-white/45">
                  <span className="text-[#6EEDC2] font-semibold">STEP 2</span> · SETUP
                </div>
                <h3 className="text-2xl sm:text-[32px] font-display font-light text-white leading-[1.2] tracking-[-0.02em] mb-4">
                  We build and test your agent
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/60 font-sans max-w-[380px]">
                  We configure your greeting, call flow and booking rules, connect your calendar, and run test calls with you until it sounds right.
                </p>
              </div>
            </div>
          </StepCardWrapper>

          {/* CARD 3: Text Left / Visual Right */}
          <StepCardWrapper index={2} isReducedMotion={isReducedMotion}>
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Text half: Left */}
              <div className="h-full flex flex-col justify-center px-8 sm:px-12 lg:pl-14 lg:pr-8 py-10 lg:py-0">
                <div className="text-[11px] uppercase tracking-[0.08em] font-sans mb-3 text-white/45">
                  <span className="text-[#6EEDC2] font-semibold">STEP 3</span> · GO LIVE
                </div>
                <h3 className="text-2xl sm:text-[32px] font-display font-light text-white leading-[1.2] tracking-[-0.02em] mb-4">
                  Start answering every call
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/60 font-sans max-w-[380px]">
                  Point your business number to Appsian. Calls get answered, nights, weekends and holidays included, and qualified by your rules.
                </p>
              </div>

              {/* Visual half: Right (Incoming call & toasts) */}
              <div className="p-3 h-full">
                <div className="w-full h-[400px] lg:h-full rounded-[20px] bg-[#07080A] border border-white/[0.06] relative overflow-hidden flex items-center justify-center p-4 sm:p-5">
                  <NoiseOverlay />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(110,237,194,0.07), transparent 70%)',
                    }}
                  />
                  <Visual3IncomingCall isReducedMotion={isReducedMotion} />
                </div>
              </div>
            </div>
          </StepCardWrapper>

          {/* CARD 4: Visual Left / Text Right */}
          <StepCardWrapper index={3} isReducedMotion={isReducedMotion}>
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
              {/* Visual half: Left (Phone frame) */}
              <div className="p-3 h-full order-2 lg:order-1">
                <div className="w-full h-[400px] lg:h-full rounded-[20px] bg-[#07080A] border border-white/[0.06] relative overflow-hidden flex flex-col justify-between p-4 sm:p-5">
                  <NoiseOverlay />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(ellipse 65% 55% at 50% 40%, rgba(110,237,194,0.07), transparent 70%)',
                    }}
                  />
                  <Visual4PhoneFrame formattedDate={formattedDate} isReducedMotion={isReducedMotion} />
                </div>
              </div>

              {/* Text half: Right */}
              <div className="h-full flex flex-col justify-center px-8 sm:px-12 lg:pl-14 lg:pr-8 py-10 lg:py-0 order-1 lg:order-2">
                <div className="text-[11px] uppercase tracking-[0.08em] font-sans mb-3 text-white/45">
                  <span className="text-[#6EEDC2] font-semibold">STEP 4</span> · ONGOING
                </div>
                <h3 className="text-2xl sm:text-[32px] font-display font-light text-white leading-[1.2] tracking-[-0.02em] mb-4">
                  Jobs booked, summaries sent
                </h3>
                <p className="text-[15px] leading-[1.6] text-white/60 font-sans max-w-[380px]">
                  Every call ends in a booked estimate or a captured lead, with a transcript and AI summary sent straight to your team.
                </p>
              </div>
            </div>
          </StepCardWrapper>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION (80px below cards)                         */}
        {/* ========================================================= */}
        <div className="w-full mt-20 flex flex-col items-center">
          {/* Two cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[22px] w-full max-w-[1060px]">
            {/* Left Card: Done-for-you setup */}
            <div
              className="w-full h-full min-h-[340px] rounded-[28px] border border-white/[0.09] p-8 flex flex-col items-center text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0A0B0E 0%, #050607 100%)',
                boxShadow:
                  '0 0 0 3px rgba(255,255,255,0.035), 0 24px 48px -12px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              {/* Faint inner mint top glow */}
              <div
                className="absolute inset-x-0 top-0 h-[100px] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(110,237,194,0.09), transparent 70%)',
                }}
              />

              <span className="h-[28px] px-3 rounded-[8px] bg-white/[0.05] border border-white/[0.08] text-[11px] font-sans uppercase tracking-[0.08em] text-white/70 inline-flex items-center mb-4 z-10">
                DONE-FOR-YOU
              </span>

              <h4 className="text-[28px] font-display font-light text-white tracking-[-0.02em] mb-6 z-10">
                Done-for-you setup
              </h4>

              <div className="w-full max-w-[320px] space-y-3 text-left z-10">
                {[
                  'We configure the agent for you',
                  'Custom greeting and call flow',
                  'Calendar and tools connected',
                  'Test calls before you go live',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#6EEDC2]/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#6EEDC2] stroke-[2.5]" />
                    </div>
                    <span className="text-[14px] text-white/70 font-sans">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card: Founding Client Program */}
            <div
              className="w-full h-full min-h-[340px] rounded-[28px] border border-white/[0.09] p-8 flex flex-col items-center text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0A0B0E 0%, #050607 100%)',
                boxShadow:
                  '0 0 0 3px rgba(255,255,255,0.035), 0 24px 48px -12px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
              }}
            >
              {/* Faint inner mint top glow */}
              <div
                className="absolute inset-x-0 top-0 h-[100px] pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(110,237,194,0.09), transparent 70%)',
                }}
              />

              <span className="h-[28px] px-3 rounded-[8px] bg-white/[0.05] border border-white/[0.08] text-[11px] font-sans uppercase tracking-[0.08em] text-white/70 inline-flex items-center mb-4 z-10">
                FOUNDING CLIENT PROGRAM
              </span>

              <h4 className="text-[28px] font-display font-light text-white tracking-[-0.02em] mb-6 z-10">
                Founding Client Program
              </h4>

              <div className="w-full max-w-[320px] space-y-3 text-left z-10">
                {[
                  '$0 setup',
                  '30 free days',
                  'Free personalized demo',
                  'Hands-on onboarding',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[#6EEDC2]/15 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#6EEDC2] stroke-[2.5]" />
                    </div>
                    <span className="text-[14px] text-white/70 font-sans">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Merging 1px dashed lines down to DemoBar */}
          <div className="w-full max-w-[1060px] flex flex-col items-center relative py-2">
            <svg
              className="w-full h-[60px] overflow-visible text-white"
              viewBox="0 0 1060 60"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Left card node & line down towards center */}
              <circle
                cx="265"
                cy="6"
                r="4"
                fill="#040506"
                stroke="#6EEDC2"
                strokeWidth="1.5"
              />
              <motion.path
                initial={{ pathLength: isReducedMotion ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                d="M 265 10 L 265 30 Q 265 45 285 45 L 530 45"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Right card node & line down towards center */}
              <circle
                cx="795"
                cy="6"
                r="4"
                fill="#040506"
                stroke="#6EEDC2"
                strokeWidth="1.5"
              />
              <motion.path
                initial={{ pathLength: isReducedMotion ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                d="M 795 10 L 795 30 Q 795 45 775 45 L 530 45"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />

              {/* Merged center vertical line down */}
              <motion.path
                initial={{ pathLength: isReducedMotion ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                d="M 530 45 L 530 60"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <circle
                cx="530"
                cy="58"
                r="3"
                fill="#6EEDC2"
              />
            </svg>
          </div>

          {/* Reused DemoBar component */}
          <div className="w-full max-w-[652px] -mt-4">
            <DemoBar onSuccess={onSuccessDemo} />
          </div>

          {/* Single footnote under demo bar as requested */}
          <p className="text-center text-[11px] text-white/35 font-sans mt-4">
            Interface previews use sample data.
          </p>
        </div>
      </div>
    </section>
  );
};

// =========================================================================
// CARD WRAPPER WITH STICKY SCROLL BEHAVIOR & CLEAN EDGES
// =========================================================================
interface StepCardWrapperProps {
  children: React.ReactNode;
  index: number;
  isReducedMotion: boolean;
}

const StepCardWrapper: React.FC<StepCardWrapperProps> = ({
  children,
  index,
  isReducedMotion,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1000);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 100px', 'end 100px'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, index === 3 ? 1 : 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, index === 3 ? 1 : 0.75]);

  return (
    <motion.div
      ref={cardRef}
      initial={isReducedMotion ? {} : { opacity: 0, filter: 'blur(10px)', y: 14 }}
      whileInView={isReducedMotion ? {} : { opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
      className="w-full max-w-[1060px] lg:sticky lg:top-[100px] z-10 origin-top"
      style={{
        zIndex: index + 1,
        scale: isDesktop && !isReducedMotion ? scale : 1,
        opacity: isDesktop && !isReducedMotion ? opacity : 1,
      }}
    >
      {/* 1px hairline border + ONE faint outer ring 3px away, identical on all sides */}
      <div
        className="w-full h-auto min-h-[550px] lg:h-[550px] rounded-[28px] border border-white/[0.09] relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0A0B0E 0%, #050607 100%)',
          boxShadow:
            '0 0 0 3px rgba(255,255,255,0.035), 0 24px 48px -12px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.4)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

// =========================================================================
// VISUAL 1: NODE DIAGRAM (Discovery) - Rebuilt with Depth & Real Content
// =========================================================================
const Visual1NodeDiagram: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center relative z-10 py-1">
      {/* Top Section: Center Node + 6 Connected Chips */}
      <div className="w-full flex items-center justify-between relative mt-1 px-1">
        {/* Left 3 Chips: Text on outer side (left), icon on side nearest center (right) */}
        <div className="flex flex-col gap-3 z-20">
          {[
            { label: 'Services', icon: Wrench },
            { label: 'Service area', icon: MapPin },
            { label: 'Business hours', icon: Clock },
          ].map((chip) => {
            const Icon = chip.icon;
            return (
              <div
                key={chip.label}
                className="h-[36px] pl-3.5 pr-2.5 rounded-[10px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-3 text-[13px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_14px_rgba(0,0,0,0.5)] hover:border-[#6EEDC2]/40 transition-colors"
              >
                <span className="font-sans font-medium">{chip.label}</span>
                <div className="w-6 h-6 rounded-[6px] bg-[#6EEDC2]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#6EEDC2]" strokeWidth={1.75} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Center 120px Glowing Circular Node */}
        <div className="relative z-20 shrink-0 my-1 mx-2">
          {/* Rotating Conic Ring */}
          <motion.div
            animate={isReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-[3px] rounded-full pointer-events-none -z-10 opacity-75"
            style={{
              background: 'conic-gradient(from 0deg, #6EEDC2, transparent 65%, #6EEDC2)',
            }}
          />

          {/* Blurred Mint Halo */}
          <div
            className="absolute inset-0 rounded-full blur-[24px] pointer-events-none -z-10"
            style={{ backgroundColor: 'rgba(110,237,194,0.35)' }}
          />

          {/* Inner Glass Circle with 2px Mint Ring */}
          <div
            className="w-[120px] h-[120px] rounded-full bg-[#0D0F14]/90 border-2 border-[#6EEDC2] flex flex-col items-center justify-center text-center backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.7),0_0_24px_rgba(110,237,194,0.25)]"
          >
            <div className="w-7 h-7 rounded-full bg-[#6EEDC2]/20 flex items-center justify-center mb-1">
              <Sparkles className="w-4 h-4 text-[#6EEDC2]" />
            </div>
            <span className="text-[13px] font-sans font-medium text-white tracking-wide">
              Appsian AI
            </span>
          </div>
        </div>

        {/* Right 3 Chips: Icon on side nearest center (left), text on outer side (right) */}
        <div className="flex flex-col gap-3 z-20">
          {[
            { label: 'Pricing rules', icon: Tag },
            { label: 'Emergency rules', icon: Siren },
            { label: 'FAQs', icon: MessageCircleQuestion },
          ].map((chip) => {
            const Icon = chip.icon;
            return (
              <div
                key={chip.label}
                className="h-[36px] pl-2.5 pr-3.5 rounded-[10px] bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center gap-3 text-[13px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_14px_rgba(0,0,0,0.5)] hover:border-[#6EEDC2]/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-[6px] bg-[#6EEDC2]/15 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#6EEDC2]" strokeWidth={1.75} />
                </div>
                <span className="font-sans font-medium">{chip.label}</span>
              </div>
            );
          })}
        </div>

        {/* Smooth Curved SVG Bezier Paths with Travelling Mint Dots */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 460 140"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Left 3 paths */}
          <path id="path-left-1" d="M 125 22 C 165 22, 175 60, 200 65" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <path id="path-left-2" d="M 125 65 C 160 65, 170 65, 200 65" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <path id="path-left-3" d="M 125 108 C 165 108, 175 75, 200 70" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />

          {/* Right 3 paths */}
          <path id="path-right-1" d="M 335 22 C 295 22, 285 60, 260 65" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <path id="path-right-2" d="M 335 65 C 300 65, 290 65, 260 65" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
          <path id="path-right-3" d="M 335 108 C 295 108, 285 75, 260 70" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />

          {/* Small mint traveling dots along the paths */}
          {!isReducedMotion && (
            <>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="2.8s" repeatCount="indefinite" path="M 125 22 C 165 22, 175 60, 200 65" />
              </circle>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="2.4s" begin="0.5s" repeatCount="indefinite" path="M 125 65 C 160 65, 170 65, 200 65" />
              </circle>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="3.0s" begin="1s" repeatCount="indefinite" path="M 125 108 C 165 108, 175 75, 200 70" />
              </circle>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="2.7s" begin="0.2s" repeatCount="indefinite" path="M 335 22 C 295 22, 285 60, 260 65" />
              </circle>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="2.5s" begin="0.7s" repeatCount="indefinite" path="M 335 65 C 300 65, 290 65, 260 65" />
              </circle>
              <circle r="2.5" fill="#6EEDC2" filter="drop-shadow(0 0 4px #6EEDC2)">
                <animateMotion dur="3.1s" begin="1.2s" repeatCount="indefinite" path="M 335 108 C 295 108, 285 75, 260 70" />
              </circle>
            </>
          )}
        </svg>
      </div>

      {/* Vertical Pulse Connector Line Down */}
      <div className="w-[1.5px] h-5 bg-gradient-to-b from-[#6EEDC2] to-white/20 relative my-0.5">
        <motion.div
          animate={isReducedMotion ? {} : { y: [0, 20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2] absolute -left-[2.25px] shadow-[0_0_8px_#6EEDC2]"
        />
      </div>

      {/* Middle: Business Profile Tile (~360px wide, video-tile style with Glowing Rim) */}
      <div
        className="w-full max-w-[380px] rounded-[16px] bg-[#0A0D12]/90 border border-[#6EEDC2]/45 backdrop-blur-md p-4 shadow-[0_0_20px_-2px_rgba(110,237,194,0.2),inset_0_1px_0_rgba(255,255,255,0.12),0_14px_32px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-3 mb-2.5">
          {/* Gradient Initials Logo Tile "NP" */}
          <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[#1B382F] to-[#0A1A14] border border-[#6EEDC2]/50 flex items-center justify-center font-bold text-[#6EEDC2] text-[13.5px] shadow-[0_0_12px_rgba(110,237,194,0.25)] shrink-0">
            NP
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[14px] font-sans font-medium text-white truncate">
              Northside Plumbing & HVAC
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-2.5 h-2.5 fill-[#6EEDC2] text-[#6EEDC2]" />
                ))}
              </div>
              <span className="text-[11.5px] font-sans font-medium text-[#6EEDC2] tabular-nums">
                4.9
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-2.5 border-t border-white/[0.08] text-[12.5px] text-white/75 font-sans">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#6EEDC2] shrink-0" strokeWidth={1.75} />
            <span>Serves Austin and 25 miles around</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#6EEDC2] shrink-0" strokeWidth={1.75} />
            <span>Mon-Sat 7am-6pm · Emergency 24/7</span>
          </div>
        </div>
      </div>

      {/* Bottom: 3 Glowing-Rim Cards Side by Side */}
      <div className="grid grid-cols-3 gap-3 w-full mt-2">
        {/* Card 1: Services */}
        <div className="rounded-[14px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 p-3 shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#6EEDC2] mb-2">
            Services
          </span>
          <div className="space-y-1.5 text-[12px] text-white/85">
            {['Plumbing', 'HVAC', 'Water heaters', 'Drain cleaning'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#6EEDC2] stroke-[2.2] shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Rules */}
        <div className="rounded-[14px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 p-3 shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#6EEDC2] mb-2">
            Rules
          </span>
          <div className="space-y-2 text-[11.5px] text-white/80">
            {[
              { label: 'Emergency → ring owner' },
              { label: 'After hours → take message' },
              { label: 'New quote → book estimate' },
            ].map((rule) => (
              <div key={rule.label} className="flex items-center justify-between gap-1">
                <span className="truncate text-[11px] leading-tight">{rule.label}</span>
                <div className="w-6 h-3.5 rounded-full bg-[#6EEDC2] flex items-center justify-end px-0.5 shrink-0 shadow-[0_0_8px_rgba(110,237,194,0.4)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#040506]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Calendar */}
        <div className="rounded-[14px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 p-3 shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.5)] flex flex-col">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#6EEDC2] mb-1.5">
            Calendar
          </span>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-white/40 mb-1">
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10.5px] tabular-nums text-white/75">
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
            ].map((d) => {
              const isMint = d === 8 || d === 14 || d === 20;
              return (
                <div
                  key={d}
                  className={`h-4.5 rounded-full flex items-center justify-center ${
                    isMint
                      ? 'bg-[#6EEDC2] text-[#040506] font-semibold shadow-[0_0_8px_rgba(110,237,194,0.7)]'
                      : ''
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// VISUAL 2: AGENT SETUP WINDOW (Setup) - Rebuilt with Realistic Depth
// =========================================================================
const Visual2AgentSetup: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  return (
    <div
      className="w-full h-full rounded-[18px] bg-[#0A0D12]/95 border border-[#6EEDC2]/35 shadow-[0_0_24px_-4px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.14),0_16px_36px_rgba(0,0,0,0.6)] p-4 flex flex-col justify-between relative z-10"
    >
      {/* App Window Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          {/* Appsian Mint Logo Mark */}
          <div className="w-6 h-6 rounded-[6px] bg-[#6EEDC2] flex items-center justify-center text-[#040506] shadow-[0_0_10px_rgba(110,237,194,0.4)]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[13px] font-sans font-medium text-white/90">Agent setup</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[11px] font-sans font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Draft
          </span>
        </div>

        {/* Avatar JD */}
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 border border-white/20 flex items-center justify-center text-[11px] font-sans font-semibold text-white shadow-xs">
          JD
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 pt-2 pb-2 border-b border-white/[0.06] text-[13px] font-sans">
        <span className="text-[#6EEDC2] font-medium border-b-2 border-[#6EEDC2] pb-1.5 shadow-[0_2px_8px_rgba(110,237,194,0.3)]">
          Greeting
        </span>
        <span className="text-white/45 pb-1.5 cursor-pointer hover:text-white/70 transition-colors">
          Call flow
        </span>
        <span className="text-white/45 pb-1.5 cursor-pointer hover:text-white/70 transition-colors">
          Booking
        </span>
        <span className="text-white/45 pb-1.5 cursor-pointer hover:text-white/70 transition-colors">
          Test
        </span>
      </div>

      {/* Greeting Block with subtle glowing rim */}
      <div className="rounded-[14px] bg-white/[0.04] border border-[#6EEDC2]/25 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.4)] relative">
        <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-white/50 mb-1.5">
          Greeting
        </div>
        <p className="text-[13.5px] leading-relaxed text-white/95 font-sans mb-3">
          &ldquo;Thanks for calling Northside Plumbing. How can I help you today?&rdquo;
          <span className="inline-block w-1.5 h-3.5 bg-[#6EEDC2] ml-1 align-middle animate-pulse" />
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
          {/* Voice selector chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-white/[0.05] border border-white/[0.09] text-[12px] text-white/85 shadow-xs">
            <Volume2 className="w-3.5 h-3.5 text-[#6EEDC2]" strokeWidth={1.75} />
            <span>Voice: Warm, friendly</span>
          </div>

          {/* Play button with animated waveform */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-[8px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/30 text-[#6EEDC2] text-[12px] font-medium shadow-[0_0_10px_rgba(110,237,194,0.2)]">
            <Play className="w-3 h-3 fill-current" />
            <div className="flex items-center gap-0.5 h-3">
              {[4, 10, 6, 12, 8, 11, 5].map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 rounded-full bg-[#6EEDC2]"
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Call Flow Nodes: Answer -> Qualify -> Book */}
      <div className="flex items-center justify-between gap-2">
        {[
          { label: 'Answer', icon: PhoneIncoming },
          { label: 'Qualify', icon: ListChecks },
          { label: 'Book', icon: CalendarCheck },
        ].map((node, idx) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={node.label}>
              <div className="flex-1 rounded-[10px] bg-white/[0.04] border border-[#6EEDC2]/25 p-2.5 flex items-center justify-center gap-2 text-[12.5px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_4px_12px_rgba(0,0,0,0.3)]">
                <Icon className="w-3.5 h-3.5 text-[#6EEDC2]" strokeWidth={1.75} />
                <span className="font-sans font-medium">{node.label}</span>
              </div>
              {idx < 2 && <span className="text-[#6EEDC2]/80 font-bold text-xs">→</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Calendar Full Month Grid with Real Appointment Chips */}
      <div className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-3 flex-1 flex flex-col justify-between shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] mt-2.5">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-white/45 mb-1 font-sans font-medium">
          <span>SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5 flex-1">
          {Array.from({ length: 14 }).map((_, i) => {
            const dayNum = i + 1;
            const hasEstimate = dayNum === 8;
            const hasRepair = dayNum === 11;
            return (
              <div
                key={i}
                className="rounded-[8px] bg-white/[0.02] border border-white/[0.04] p-1 flex flex-col justify-between min-h-[46px]"
              >
                <span className="text-[13px] font-sans font-medium text-white/70 tabular-nums leading-none">
                  {dayNum}
                </span>
                {hasEstimate && (
                  <span className="mt-1 px-1 py-0.5 rounded-[4px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/35 text-[#6EEDC2] text-[11px] font-sans font-medium truncate leading-tight shadow-[0_0_8px_rgba(110,237,194,0.25)]">
                    Estimate 9:00
                  </span>
                )}
                {hasRepair && (
                  <span className="mt-1 px-1 py-0.5 rounded-[4px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/35 text-[#6EEDC2] text-[11px] font-sans font-medium truncate leading-tight shadow-[0_0_8px_rgba(110,237,194,0.25)]">
                    Repair 1:30
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Collaborator Cursors with Pointer Arrows */}
      <motion.div
        animate={isReducedMotion ? {} : { x: [-3, 3, -3], y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-28 right-6 z-30 px-2.5 py-1 rounded-full bg-[#6EEDC2] text-[#040506] font-sans font-medium text-[11px] shadow-[0_4px_16px_rgba(110,237,194,0.4)] flex items-center gap-1.5"
      >
        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
          <path d="M1 1l5.5 14 2.5-6 6-2.5L1 1z" />
        </svg>
        <span>Appsian team</span>
      </motion.div>

      <motion.div
        animate={isReducedMotion ? {} : { x: [3, -3, 3], y: [3, -3, 3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 left-14 z-30 px-2.5 py-1 rounded-full bg-white text-[#040506] font-sans font-medium text-[11px] shadow-[0_4px_16px_rgba(255,255,255,0.3)] flex items-center gap-1.5"
      >
        <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
          <path d="M1 1l5.5 14 2.5-6 6-2.5L1 1z" />
        </svg>
        <span>You</span>
      </motion.div>
    </div>
  );
};

// =========================================================================
// VISUAL 3: INCOMING CALL & TRANSCRIPT (Go Live) - Dense & Layered Realism
// =========================================================================
const Visual3IncomingCall: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    if (isReducedMotion) return;
    const timer = setInterval(() => {
      setSeconds((prev) => (prev >= 59 ? 42 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isReducedMotion]);

  return (
    <div className="w-full h-full relative z-10 flex items-center justify-center p-2 overflow-hidden">
      {/* Dark Satin Silk Wallpaper Folds with Faint Mint Reflection */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0"
        viewBox="0 0 500 500"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M -50 100 Q 150 280 320 160 T 550 380"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="90"
          filter="blur(28px)"
        />
        <path
          d="M 50 420 Q 240 280 420 480"
          stroke="rgba(110,237,194,0.07)"
          strokeWidth="70"
          filter="blur(32px)"
        />
      </svg>

      {/* Main Card (about 420px wide, fills the panel, with Glowing Rim) */}
      <div
        className="w-full max-w-[420px] rounded-[20px] bg-[#0A0D12]/92 border border-[#6EEDC2]/45 backdrop-blur-md p-4 sm:p-5 shadow-[0_0_24px_-4px_rgba(110,237,194,0.22),inset_0_1px_0_rgba(255,255,255,0.12),0_24px_48px_-12px_rgba(0,0,0,0.7)] relative z-10"
      >
        {/* Header with Pulsing Mint Dot & Live Timer */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6EEDC2] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6EEDC2]" />
            </span>
            <span className="text-[13px] font-sans font-medium text-white/95">Incoming call</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-sans font-medium">
              Live
            </span>
            <span className="text-[12.5px] font-sans font-medium text-[#6EEDC2] tabular-nums">
              00:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        {/* Caller Row */}
        <div className="flex items-center gap-3 p-2.5 rounded-[12px] bg-white/[0.03] border border-white/[0.06] mb-3.5 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 border border-white/20 flex items-center justify-center text-[12px] font-sans font-bold text-white shadow-xs shrink-0">
            MR
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-sans font-medium text-white">Mike R.</div>
            <div className="text-[12px] font-sans text-white/50 tabular-nums">
              (512) 555-0142
            </div>
          </div>
        </div>

        {/* Live Transcript with Real Chat Bubbles (13px) */}
        <div className="space-y-2.5 mb-4 text-[13px] font-sans leading-relaxed">
          {/* Bubble 1: Caller */}
          <div className="flex flex-col items-start">
            <span className="text-[10.5px] text-white/40 mb-0.5 ml-1">Mike R.</span>
            <div className="max-w-[85%] rounded-[12px] rounded-tl-[4px] bg-white/[0.06] border border-white/[0.08] p-2.5 text-white/90 shadow-xs">
              Hi, my water heater is leaking in the basement.
            </div>
          </div>

          {/* Bubble 2: Appsian */}
          <div className="flex flex-col items-end">
            <span className="text-[10.5px] text-[#6EEDC2]/80 mb-0.5 mr-1 font-medium">Appsian AI</span>
            <div className="max-w-[85%] rounded-[12px] rounded-tr-[4px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/35 p-2.5 text-white shadow-xs">
              I&apos;m sorry to hear that. Is the water still actively leaking?
            </div>
          </div>

          {/* Bubble 3: Caller */}
          <div className="flex flex-col items-start">
            <span className="text-[10.5px] text-white/40 mb-0.5 ml-1">Mike R.</span>
            <div className="max-w-[85%] rounded-[12px] rounded-tl-[4px] bg-white/[0.06] border border-white/[0.08] p-2.5 text-white/90 shadow-xs">
              Yes, it&apos;s pretty bad.
            </div>
          </div>

          {/* Bubble 4: Appsian typing out */}
          <div className="flex flex-col items-end">
            <span className="text-[10.5px] text-[#6EEDC2]/80 mb-0.5 mr-1 font-medium">Appsian AI</span>
            <div className="max-w-[85%] rounded-[12px] rounded-tr-[4px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/35 p-2.5 text-white shadow-xs flex items-center gap-1.5">
              <span>Understood, I&apos;ll flag this as urgent. Can I get your address?</span>
              <span className="flex items-center gap-0.5 shrink-0 ml-1">
                <span className="w-1 h-1 rounded-full bg-[#6EEDC2] animate-bounce" />
                <span className="w-1 h-1 rounded-full bg-[#6EEDC2] animate-bounce [animation-delay:0.2s]" />
              </span>
            </div>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="flex items-center flex-wrap gap-1.5 pt-3 border-t border-white/[0.08]">
          <span className="px-2 py-0.5 rounded-[6px] bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] font-sans font-medium">
            Urgent
          </span>
          <span className="px-2 py-0.5 rounded-[6px] bg-white/[0.05] border border-white/[0.08] text-white/80 text-[11px] font-sans">
            Water heater leak
          </span>
          <span className="px-2 py-0.5 rounded-[6px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/30 text-[#6EEDC2] text-[11px] font-sans font-medium flex items-center gap-1">
            <CalendarCheck className="w-3 h-3" />
            Estimate booked · Tue 10:30 AM
          </span>
        </div>
      </div>

      {/* Floating Toast 1: Top-left Overhanging with Glowing Rim */}
      <motion.div
        animate={isReducedMotion ? {} : { y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-3 z-20 px-3.5 py-2.5 rounded-[14px] bg-[#0E1015]/95 border border-[#6EEDC2]/45 shadow-[0_0_20px_-2px_rgba(110,237,194,0.25),0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center gap-3"
      >
        <div className="w-7 h-7 rounded-[8px] bg-[#6EEDC2]/20 flex items-center justify-center text-[#6EEDC2] shrink-0">
          <CalendarCheck className="w-4 h-4" />
        </div>
        <div className="text-left font-sans">
          <div className="text-[12.5px] font-medium text-white">Estimate booked</div>
          <div className="text-[11px] text-white/55 tabular-nums">Tue 10:30 AM</div>
        </div>
      </motion.div>

      {/* Floating Toast 2: Right Overhanging with Glowing Rim */}
      <motion.div
        animate={isReducedMotion ? {} : { y: [3, -3, 3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-20 px-3.5 py-2.5 rounded-[14px] bg-[#0E1015]/95 border border-[#6EEDC2]/45 shadow-[0_0_20px_-2px_rgba(110,237,194,0.25),0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center gap-3"
      >
        <div className="w-7 h-7 rounded-[8px] bg-rose-500/20 flex items-center justify-center text-rose-300 shrink-0">
          <Siren className="w-4 h-4" />
        </div>
        <div className="text-left font-sans">
          <div className="text-[12.5px] font-medium text-white">Lead captured</div>
          <div className="text-[11px] text-white/55">Water heater leak, urgent</div>
        </div>
      </motion.div>

      {/* Floating Toast 3: Bottom-left Overhanging with Glowing Rim */}
      <motion.div
        animate={isReducedMotion ? {} : { y: [-2, 2, -2] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 left-6 z-20 px-3.5 py-2.5 rounded-[14px] bg-[#0E1015]/95 border border-[#6EEDC2]/45 shadow-[0_0_20px_-2px_rgba(110,237,194,0.25),0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center gap-3"
      >
        <div className="w-7 h-7 rounded-[8px] bg-[#6EEDC2]/20 flex items-center justify-center text-[#6EEDC2] shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="text-left font-sans">
          <div className="text-[12.5px] font-medium text-white">Team notified</div>
          <div className="text-[11px] text-white/55">Summary sent</div>
        </div>
      </motion.div>
    </div>
  );
};

// =========================================================================
// VISUAL 4: PHONE FRAME & STAT TILES (Ongoing) - Rebuilt with Titanium Depth
// =========================================================================
const Visual4PhoneFrame: React.FC<{ formattedDate: string; isReducedMotion: boolean }> = ({
  formattedDate,
  isReducedMotion,
}) => {
  const [counts, setCounts] = useState({ answered: 42, booked: 18, leads: 24 });
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isInView && !isReducedMotion) {
      setCounts({ answered: 148, booked: 42, leads: 64 });
    }
  }, [isInView, isReducedMotion]);

  return (
    <div ref={ref} className="w-full h-full relative z-10 flex flex-col justify-between items-center overflow-hidden pt-1">
      {/* Titanium-Style Phone Frame (270px wide, flush to bottom, cropped) */}
      <div
        className="w-[270px] h-[370px] rounded-t-[44px] p-[1.5px] relative shadow-[0_24px_50px_rgba(0,0,0,0.9)] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 100%)',
        }}
      >
        {/* Inner 8px Black Bezel */}
        <div className="w-full h-full rounded-t-[43px] p-[8px] pb-0 bg-[#0C0D10] flex flex-col justify-start relative">
          {/* Lock Screen Interior with Dark Satin Silk Wallpaper */}
          <div
            className="w-full h-full rounded-t-[35px] relative overflow-hidden p-3.5 pb-0 flex flex-col items-center"
            style={{
              background: 'radial-gradient(ellipse 90% 60% at 50% 20%, #151821 0%, #060709 100%)',
            }}
          >
            {/* SVG Folds of Satin Silk with Faint Mint Reflection */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
              viewBox="0 0 250 350"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M -20 50 Q 80 140 180 80 T 280 200"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="48"
                filter="blur(16px)"
              />
              <path
                d="M 30 220 Q 140 160 220 280"
                stroke="rgba(110,237,194,0.08)"
                strokeWidth="40"
                filter="blur(20px)"
              />
            </svg>

            {/* Dynamic Island Pill */}
            <div className="w-20 h-4 rounded-full bg-black mx-auto mb-1.5 shadow-sm relative z-20" />

            {/* Status Bar */}
            <div className="w-full flex items-center justify-between text-[11.5px] font-sans font-semibold text-white/80 px-1 mb-1 relative z-20">
              <span className="tabular-nums">2:31</span>
              {/* Signal, WiFi, Battery SVGs */}
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                  <path d="M1 12h2v3H1v-3zm4-3h2v6H5V9zm4-4h2v10H9V5zm4-4h2v14h-2V1z" />
                </svg>
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
                  <path d="M8 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-4.24-2.83a6 6 0 0 1 8.48 0l-1.06 1.06a4.5 4.5 0 0 0-6.36 0L3.76 9.17zm-2.83-2.83a10 10 0 0 1 14.14 0l-1.06 1.06a8.5 8.5 0 0 0-12.02 0L.93 6.34z" />
                </svg>
                <div className="w-4 h-2 rounded-[3px] border border-current p-0.5 flex items-center">
                  <div className="w-full h-full bg-current rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Date & Big 76px Clock */}
            <div className="text-[12.5px] font-sans font-medium text-white/70 mt-1 relative z-20">
              {formattedDate}
            </div>
            <div className="text-[76px] font-display font-light text-white tracking-tight leading-none my-1 tabular-nums relative z-20">
              2:31
            </div>

            {/* Three Notification Cards with Heavy Glass */}
            <div className="w-full space-y-2 relative z-20 mt-1">
              {[
                {
                  title: 'Estimate booked',
                  sub: 'Tue 10:30 AM, 123 Oak St',
                  time: 'now',
                },
                {
                  title: 'Emergency lead captured',
                  sub: 'Water heater leak, callback needed',
                  time: '3m ago',
                },
                {
                  title: 'Call summary ready',
                  sub: '4 calls handled overnight',
                  time: '12m ago',
                },
              ].map((notif) => (
                <div
                  key={notif.title}
                  className="rounded-[16px] bg-white/[0.08] border border-white/[0.1] backdrop-blur-[20px] p-2.5 shadow-md flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-[8px] bg-[#6EEDC2] flex items-center justify-center text-[#040506] shrink-0 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-sans font-semibold text-white truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10.5px] font-sans text-white/45 tabular-nums">
                        {notif.time}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-sans text-white/60 truncate">
                      {notif.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Stat Tiles (Glass, 16px radius, equal width) with Glowing Mint Rim */}
      <div className="w-full grid grid-cols-3 gap-2.5 pt-3 border-t border-white/[0.06] relative z-20">
        <div className="rounded-[16px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 backdrop-blur-md p-3 text-center shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.5)]">
          <div className="text-[26px] font-display font-medium text-[#6EEDC2] tabular-nums leading-tight">
            {counts.answered}
          </div>
          <div className="text-[12px] font-sans text-white/65 mt-0.5">Calls answered</div>
        </div>

        <div className="rounded-[16px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 backdrop-blur-md p-3 text-center shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.5)]">
          <div className="text-[26px] font-display font-medium text-[#6EEDC2] tabular-nums leading-tight">
            {counts.booked}
          </div>
          <div className="text-[12px] font-sans text-white/65 mt-0.5">Jobs booked</div>
        </div>

        <div className="rounded-[16px] bg-[#0A0D12]/90 border border-[#6EEDC2]/40 backdrop-blur-md p-3 text-center shadow-[0_0_16px_-2px_rgba(110,237,194,0.18),inset_0_1px_0_rgba(255,255,255,0.08),0_6px_20px_rgba(0,0,0,0.5)]">
          <div className="text-[26px] font-display font-medium text-[#6EEDC2] tabular-nums leading-tight">
            {counts.leads}
          </div>
          <div className="text-[12px] font-sans text-white/65 mt-0.5">Leads captured</div>
        </div>
      </div>
    </div>
  );
};
