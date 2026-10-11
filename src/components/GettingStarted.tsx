import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import {
  Sparkles,
  Check,
  ArrowRight,
  Phone,
  Calendar,
} from 'lucide-react';
import { DemoBar } from './DemoBar';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

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

  // Formatted date for Phone mockup in Step 4 ("Sunday, October 11")
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
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
                <div className="w-full h-[400px] lg:h-full rounded-[14px] bg-[#07080A] border border-white/[0.08] relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-5">
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
                <div className="w-full h-[400px] lg:h-full rounded-[14px] bg-[#07080A] border border-white/[0.08] relative overflow-hidden p-4 sm:p-5 flex items-start justify-start">
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
                <div className="w-full h-[400px] lg:h-full rounded-[14px] bg-[#07080A] border border-white/[0.08] relative overflow-hidden flex items-center justify-center p-4 sm:p-5">
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
                <div className="w-full h-[400px] lg:h-full rounded-[14px] bg-[#07080A] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between items-center p-4 sm:p-5 pb-0">
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
// VISUAL 1 (Discovery): 6 elements, calm, filled, flat surfaces
// =========================================================================
const Visual1NodeDiagram: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  return (
    <div className="w-full h-full max-w-[460px] flex flex-col justify-center items-center relative py-2">
      {/* Upper Half: Center Node + Left/Right Pills + Curved Connecting Lines */}
      <div className="w-full h-[230px] relative flex items-center justify-between px-2">
        {/* Left Column: 3 Label Pills */}
        <div className="flex flex-col gap-4 z-20">
          {['Services', 'Service area', 'Business hours'].map((label) => (
            <div
              key={label}
              className="h-[36px] px-4 rounded-[14px] bg-[#0D0E11] border border-white/[0.08] flex items-center justify-center text-[14px] font-medium text-white/[0.92] font-sans shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Center 112px Circular Node (only glow in section) */}
        <div className="w-[112px] h-[112px] rounded-full bg-[#0D0E11] border border-[#6EEDC2] flex items-center justify-center text-center z-20 shadow-[0_0_20px_rgba(110,237,194,0.25)]">
          <span className="text-[14px] font-semibold text-white/[0.92] font-sans">
            Appsian AI
          </span>
        </div>

        {/* Right Column: 3 Label Pills */}
        <div className="flex flex-col gap-4 z-20">
          {['Pricing rules', 'Emergency rules', 'FAQs'].map((label) => (
            <div
              key={label}
              className="h-[36px] px-4 rounded-[14px] bg-[#0D0E11] border border-white/[0.08] flex items-center justify-center text-[14px] font-medium text-white/[0.92] font-sans shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Curved connecting 1px lines (white 14%) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox="0 0 460 230"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Left 3 paths to center node */}
          <path d="M 125 45 C 160 45, 165 95, 180 100" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <path d="M 140 115 L 174 115" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <path d="M 155 185 C 170 185, 170 135, 180 130" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />

          {/* Right 3 paths to center node */}
          <path d="M 335 45 C 300 45, 295 95, 280 100" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <path d="M 320 115 L 286 115" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <path d="M 305 185 C 290 185, 290 135, 280 130" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        </svg>
      </div>

      {/* 1px Vertical Connecting Line with Traveling Mint Dot */}
      <div className="w-[1px] h-9 bg-white/[0.14] relative my-1">
        <motion.div
          animate={isReducedMotion ? { y: 14 } : { y: [0, 28, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-[#6EEDC2] absolute -left-[3.5px]"
        />
      </div>

      {/* Below Node: ONE Business Card (about 340px wide) */}
      <div className="w-[340px] max-w-full rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-3.5 flex items-center gap-3.5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] z-20">
        <div className="w-[44px] h-[44px] rounded-[10px] bg-[#16181D] border border-white/[0.08] flex items-center justify-center shrink-0">
          <span className="text-[14px] font-semibold text-white/[0.92] font-sans">NP</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-semibold text-white/[0.92] font-sans leading-tight truncate">
            Northside Plumbing & HVAC
          </span>
          <span className="text-[12px] font-normal text-white/[0.55] font-sans mt-0.5">
            Serves Austin + 25 miles
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// VISUAL 2 (Setup): 5 elements, window flush top-left and cropped
// =========================================================================
const Visual2AgentSetup: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  return (
    <div className="w-[480px] max-w-none rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-5 flex flex-col gap-5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] relative overflow-hidden -mt-2 -ml-2 sm:-mt-3 sm:-ml-3">
      {/* Element 1: Top Row (Title + Tabs) */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <span className="text-[14px] font-semibold text-white/[0.92] font-sans">
          Agent setup
        </span>
        <div className="flex items-center gap-5 text-[14px] font-medium font-sans">
          <span className="text-white/[0.92] border-b-2 border-[#6EEDC2] pb-1 cursor-default">
            Greeting
          </span>
          <span className="text-white/[0.55] pb-1 cursor-default">Call flow</span>
          <span className="text-white/[0.55] pb-1 cursor-default">Booking</span>
          <span className="text-white/[0.55] pb-1 cursor-default">Test</span>
        </div>
      </div>

      {/* Element 2: Greeting Card */}
      <div className="rounded-[14px] bg-[#16181D] border border-white/[0.08] p-4 flex flex-col gap-1.5">
        <span className="text-[12px] font-normal text-white/[0.55] font-sans">
          Greeting
        </span>
        <p className="text-[20px] font-medium text-white/[0.92] font-sans leading-snug">
          Thanks for calling Northside Plumbing. How can I help you today?
          <span className="inline-block w-0.5 h-5 bg-[#6EEDC2] ml-1.5 align-middle animate-pulse" />
        </p>
      </div>

      {/* Element 3: Flow Row (Answer -> Qualify -> Book) */}
      <div className="flex items-center gap-3">
        <div className="flex-1 py-2.5 px-3 rounded-[10px] bg-[#16181D] border border-white/[0.08] text-center text-[14px] font-medium text-white/[0.92] font-sans">
          Answer
        </div>
        <ArrowRight className="w-4 h-4 text-white/[0.55] shrink-0" strokeWidth={1.5} />
        <div className="flex-1 py-2.5 px-3 rounded-[10px] bg-[#16181D] border border-white/[0.08] text-center text-[14px] font-medium text-white/[0.92] font-sans">
          Qualify
        </div>
        <ArrowRight className="w-4 h-4 text-white/[0.55] shrink-0" strokeWidth={1.5} />
        <div className="flex-1 py-2.5 px-3 rounded-[10px] bg-[#16181D] border border-[#6EEDC2] text-center text-[14px] font-medium text-white/[0.92] font-sans">
          Book
        </div>
      </div>

      {/* Element 4: One-Week Strip (Mon to Sun) */}
      <div className="rounded-[14px] bg-[#16181D] border border-white/[0.08] p-3 flex flex-col gap-2">
        <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-normal text-white/[0.55] font-sans">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-[14px] font-medium font-sans tabular-nums">
          {[
            { day: 12, isToday: false, hasDot: false },
            { day: 13, isToday: false, hasDot: false },
            { day: 14, isToday: true, hasDot: false },
            { day: 15, isToday: false, hasDot: true },
            { day: 16, isToday: false, hasDot: false },
            { day: 17, isToday: false, hasDot: true },
            { day: 18, isToday: false, hasDot: false },
          ].map((item) => (
            <div key={item.day} className="flex flex-col items-center justify-center">
              <div
                className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${
                  item.isToday
                    ? 'bg-white text-black font-semibold'
                    : 'text-white/[0.92]'
                }`}
              >
                {item.day}
              </div>
              {item.hasDot ? (
                <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2] mt-1" />
              ) : (
                <span className="w-1.5 h-1.5 mt-1 opacity-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Element 5: Two Cursor Pills (drift slowly ±6px) */}
      <motion.div
        animate={isReducedMotion ? {} : { x: [-3, 3, -3], y: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-24 right-5 z-20 px-2.5 py-1 rounded-full bg-[#6EEDC2] text-[#062B20] text-[12px] font-medium font-sans shadow-md flex items-center gap-1.5 pointer-events-none"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
          <path d="M1 1l5.5 14 2.5-6 6-2.5L1 1z" />
        </svg>
        <span>Appsian team</span>
      </motion.div>

      <motion.div
        animate={isReducedMotion ? {} : { x: [3, -3, 3], y: [3, -3, 3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 left-12 z-20 px-2.5 py-1 rounded-full bg-white text-black text-[12px] font-medium font-sans shadow-md flex items-center gap-1.5 pointer-events-none"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
          <path d="M1 1l5.5 14 2.5-6 6-2.5L1 1z" />
        </svg>
        <span>You</span>
      </motion.div>
    </div>
  );
};

// =========================================================================
// VISUAL 3 (Go live): 4 elements, clean centered call card + 2 toasts
// =========================================================================
const WAVE_BARS = [6, 14, 10, 18, 22, 16, 8, 12, 20, 15, 7, 13, 19, 24, 17, 9, 14, 21, 12, 18, 15, 8, 11, 5];

const Visual3IncomingCall: React.FC<{ isReducedMotion: boolean }> = ({ isReducedMotion }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative p-6">
      {/* Centered Call Card (about 380px wide) */}
      <div className="w-full max-w-[380px] rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-5 flex flex-col gap-4 relative shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]">
        {/* Element 1: Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6EEDC2]" />
            <span className="text-[14px] font-semibold text-white/[0.92] font-sans">
              Incoming call
            </span>
          </div>
          <span className="text-[12px] font-normal text-white/[0.55] font-sans tabular-nums">
            Live 00:42
          </span>
        </div>

        {/* Element 2: Two Transcript Lines */}
        <div className="flex flex-col gap-3">
          <div className="rounded-[14px] bg-[#16181D] border border-white/[0.08] p-3 text-[14px] font-normal text-white/[0.92] font-sans leading-relaxed">
            Hi, my water heater is leaking in the basement.
          </div>
          <div className="rounded-[14px] bg-[#6EEDC2]/10 border border-[#6EEDC2]/25 p-3 text-[14px] font-normal text-white/[0.92] font-sans leading-relaxed">
            I&apos;m sorry to hear that. Is the water still actively leaking?
          </div>
        </div>

        {/* Element 3: Thin Mint Audio Waveform (24 bars, 2px wide) */}
        <div className="flex items-center justify-between h-7 px-1 pt-1">
          {WAVE_BARS.map((baseH, i) => (
            <motion.div
              key={i}
              animate={
                isReducedMotion
                  ? { height: baseH }
                  : { height: [baseH, Math.max(4, (baseH * 1.5) % 24), baseH] }
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: (i * 0.05) % 0.6,
                ease: 'easeInOut',
              }}
              className="w-[2px] rounded-full bg-[#6EEDC2]"
              style={{ height: `${baseH}px` }}
            />
          ))}
        </div>

        {/* Element 4: TWO Toast Chips (overlapping right and bottom-left edges) */}
        <motion.div
          initial={isReducedMotion ? {} : { opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute -right-6 top-1/4 z-20 px-3.5 py-2.5 rounded-[14px] bg-[#0D0E11] border border-white/[0.08] text-[12px] font-medium text-white/[0.92] font-sans shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] flex items-center gap-2 whitespace-nowrap"
        >
          <Calendar className="w-4 h-4 text-white/70" strokeWidth={1.5} />
          <span>Estimate booked · Tue 10:30 AM</span>
        </motion.div>

        <motion.div
          initial={isReducedMotion ? {} : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="absolute -left-6 -bottom-4 z-20 px-3.5 py-2.5 rounded-[14px] bg-[#0D0E11] border border-white/[0.08] text-[12px] font-medium text-white/[0.92] font-sans shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] flex items-center gap-2 whitespace-nowrap"
        >
          <Check className="w-4 h-4 text-white/70" strokeWidth={1.5} />
          <span>Lead captured · Water heater leak</span>
        </motion.div>
      </div>
    </div>
  );
};

// =========================================================================
// VISUAL 4 (Ongoing): 5 elements, phone cropped at bottom + stat tiles
// =========================================================================
const Visual4PhoneFrame: React.FC<{ formattedDate: string; isReducedMotion: boolean }> = ({
  formattedDate,
  isReducedMotion,
}) => {
  const [counts, setCounts] = useState({
    answered: isReducedMotion ? 148 : 0,
    booked: isReducedMotion ? 42 : 0,
    leads: isReducedMotion ? 64 : 0,
  });
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView || isReducedMotion) return;
    const duration = 1200;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        answered: Math.round(148 * ease),
        booked: Math.round(42 * ease),
        leads: Math.round(64 * ease),
      });
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, isReducedMotion]);

  return (
    <div
      ref={ref}
      className="w-full h-full relative z-10 flex flex-col justify-between items-center overflow-hidden"
    >
      {/* Element 1: 260px Phone Frame */}
      <div className="w-[260px] rounded-t-[40px] border border-white/[0.18] p-2 pb-0 bg-[#0A0B0D] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)] mt-2">
        <div
          className="w-full rounded-t-[32px] p-3 pb-3 flex flex-col items-center relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 55%), #0B0C10',
          }}
        >
          {/* Small island pill */}
          <div className="w-16 h-3.5 rounded-full bg-black mx-auto mb-2" />

          {/* Element 2: Date & Clock */}
          <div className="text-[14px] font-medium text-white/70 font-sans text-center">
            {formattedDate}
          </div>
          <div className="text-[72px] font-[200] text-white/[0.92] font-sans text-center leading-none tracking-tight my-1 tabular-nums">
            2:31
          </div>

          {/* Element 3: Three Notification Cards */}
          <div className="w-full space-y-2 mt-2">
            {[
              {
                title: 'Estimate booked',
                sub: 'Tue 10:30 AM, 123 Oak St',
                time: 'now',
              },
              {
                title: 'Emergency lead captured',
                sub: 'Water heater leak',
                time: '3m ago',
              },
              {
                title: 'Call summary ready',
                sub: '4 calls handled overnight',
                time: '12m ago',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="w-full rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-2.5 flex items-start gap-2.5 text-left"
              >
                <div className="w-7 h-7 rounded-[8px] bg-[#6EEDC2]/15 border border-[#6EEDC2]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-[#6EEDC2]" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-white/[0.92] font-sans truncate">
                      {item.title}
                    </span>
                    <span className="text-[12px] font-normal text-white/[0.55] font-sans ml-2 shrink-0">
                      {item.time}
                    </span>
                  </div>
                  <div className="text-[12px] font-normal text-white/[0.55] font-sans truncate mt-0.5">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Element 4: Three Stat Tiles at Bottom (16px padding, no overlap) */}
      <div className="w-full grid grid-cols-3 gap-3 p-4 pt-2 z-20">
        <div className="rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-3 text-center">
          <div className="text-[20px] font-semibold text-white/[0.92] font-sans tabular-nums leading-tight">
            {counts.answered}
          </div>
          <div className="text-[12px] font-normal text-white/[0.55] font-sans mt-0.5">
            Calls answered
          </div>
        </div>
        <div className="rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-3 text-center">
          <div className="text-[20px] font-semibold text-white/[0.92] font-sans tabular-nums leading-tight">
            {counts.booked}
          </div>
          <div className="text-[12px] font-normal text-white/[0.55] font-sans mt-0.5">
            Jobs booked
          </div>
        </div>
        <div className="rounded-[14px] bg-[#0D0E11] border border-white/[0.08] p-3 text-center">
          <div className="text-[20px] font-semibold text-white/[0.92] font-sans tabular-nums leading-tight">
            {counts.leads}
          </div>
          <div className="text-[12px] font-normal text-white/[0.55] font-sans mt-0.5">
            Leads captured
          </div>
        </div>
      </div>
    </div>
  );
};

