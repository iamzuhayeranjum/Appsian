import { AppsianIcon } from './AppsianLogo';
import { SectionTag } from './SectionTag';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

export const HowItWorks: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [cardHeight, setCardHeight] = useState<number>(550);
  const [activeStep, setActiveStep] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Monitor rendered card height for dynamic vertical centering
  useEffect(() => {
    if (!cardRef.current) return;
    const updateCardHeight = () => {
      if (cardRef.current) {
        setCardHeight(cardRef.current.offsetHeight);
      }
    };
    updateCardHeight();

    const ro = new ResizeObserver(updateCardHeight);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, []);

  // Monitor reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setActiveStep(10);
    }
    const handler = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        setActiveStep(10);
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Drive the diagram's progress from the right column's scroll position:
  // progress is 0 when the top of the diagram reaches 60% of viewport height,
  // and 1 when the final CTA node reaches the vertical center (50%) of the viewport.
  const { scrollYProgress } = useScroll({
    target: diagramRef,
    offset: ['start 60%', 'end 50%'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isReducedMotion) {
      setActiveStep(10);
      return;
    }
    // 10 stages corresponding to the 10 rows
    const thresholds = [0.0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 0.98];
    let step = 0;
    for (let i = 0; i < thresholds.length; i++) {
      if (latest >= thresholds[i]) {
        step = i;
      }
    }
    setActiveStep(step);
  });

  const handleScrollToHeroDemo = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = document.getElementById('demo-name') as HTMLInputElement | null;
      if (input) {
        input.focus();
      }
    }, 500);
  };

  // Node glass style helper
  const getNodeStyle = (isActive: boolean) => {
    if (isActive) {
      return {
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.10) 40%, rgba(0,0,0,0.35) 100%)',
        border: '1px solid rgba(110,237,194,0.7)',
        borderTopColor: 'rgba(110,237,194,0.95)',
        boxShadow:
          '0 0 24px rgba(110,237,194,0.30), inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 30px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      };
    }
    return {
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, rgba(0,0,0,0.3) 100%)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderTopColor: 'rgba(255,255,255,0.35)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 12px 30px rgba(0,0,0,0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
    };
  };

  return (
    <div className="w-full bg-[var(--page-gray,#F5F6F8)] pb-[120px] sm:pb-[140px]">
      {/* SECTION SHELL: Full-width black section with crisp, straight top and bottom edges (overflow: clip) */}
      <section
        id="how-it-works"
        data-theme="dark"
        ref={sectionRef}
        className="relative w-full bg-[#040506] pt-[120px] pb-[140px] text-white"
        style={{
          backgroundColor: '#040506',
          overflow: 'clip',
        }}
      >
        {/* (a) Diagonal light beam sweeping from bottom center to upper right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(115deg, transparent 40%, rgba(150,175,175,0.10) 55%, transparent 70%),
              radial-gradient(ellipse 60% 80% at 75% 100%, rgba(120,150,150,0.18), transparent 60%)
            `,
          }}
        />

        {/* (b) Pure-black vignette at the top center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 35% at 50% 0%, #040506 35%, transparent 100%)',
          }}
        />

        {/* (c) 3% noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Content container: 1200px max width, CSS grid: 416px 1fr, 64px column gap, align-items: start */}
        <div className="relative z-10 max-w-[1200px] w-full mx-auto px-4 sm:px-6 min-[1000px]:px-8 grid grid-cols-1 min-[1000px]:grid-cols-[416px_1fr] min-[1000px]:gap-[64px] items-start">
          {/* ================= LEFT COLUMN: STICKY PROBLEM CARD WRAPPER ================= */}
          <div
            className="w-full max-w-[416px] mx-auto min-[1000px]:mx-0 min-[1000px]:sticky self-start z-20 mb-12 min-[1000px]:mb-0"
            style={{
              top: `max(96px, calc((100vh - ${cardHeight}px) / 2))`,
              alignSelf: 'start',
            }}
          >
            {/* Entrance animation executed on inner card element, NOT on sticky wrapper */}
            <motion.div
              ref={cardRef}
              initial={
                isReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, filter: 'blur(12px)', y: 14 }
              }
              whileInView={
                isReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, filter: 'blur(0px)', y: 0 }
              }
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {/* Outer rim: radius 28px with border: 1px solid rgba(255,255,255,0.10), 6px gap */}
              <div
                className="w-full p-[6px] rounded-[28px]"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                }}
              >
                {/* Inner card: dark gradient (#121415 to #0A0B0C), border: 1px solid rgba(255,255,255,0.08), radius 22px, padding 24px */}
                <div
                  className="w-full rounded-[22px] p-6 text-center"
                  style={{
                    background: 'linear-gradient(180deg, #121415 0%, #0A0B0C 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Eyebrow: "THE PROBLEM" */}
                  <div className="flex justify-center">
                    <SectionTag label="THE PROBLEM" icon="triangle-alert" variant="dark" />
                  </div>

                  {/* Heading: 44px/1.1, lightest available weight of display font, letter-spacing +0.01em */}
                  <h3 className="mt-5 mb-6 text-[30px] sm:text-[44px] leading-[1.1] font-display font-normal text-white tracking-[0.01em] text-balance">
                    The problem with missed calls
                  </h3>

                  {/* Two boxes (14px radius, padding 18px, 12px gap) */}
                  <div className="flex flex-col gap-3">
                    {/* Box 1: "What's happening today:" with faint red border */}
                    <div
                      className="p-[18px] rounded-[14px] text-left"
                      style={{
                        background:
                          'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        border: '1px solid rgba(255,90,70,0.18)',
                        boxShadow: 'inset 0 -1px 0 rgba(255,90,70,0.35)',
                      }}
                    >
                      <h4 className="text-[15px] font-semibold text-white mb-2.5">
                        What's happening today:
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#FF6B5A] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>You can't answer while you're on a job (time)</span>
                        </li>
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#FF6B5A] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>
                            Voicemail ends the conversation and callers dial the next business (leads)
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#FF6B5A] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>
                            Callbacks come too late and after-hours calls go unanswered (speed)
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Box 2: "What you need:" with faint mint border */}
                    <div
                      className="p-[18px] rounded-[14px] text-left"
                      style={{
                        background:
                          'linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                        border: '1px solid rgba(110,237,194,0.2)',
                        boxShadow: 'inset 0 -1px 0 rgba(110,237,194,0.4)',
                      }}
                    >
                      <h4 className="text-[15px] font-semibold text-white mb-2.5">
                        What you need:
                      </h4>
                      <ul className="flex flex-col gap-2.5">
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#6EEDC2] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>Every call answered, day or night</span>
                        </li>
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#6EEDC2] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>Callers qualified by your own rules</span>
                        </li>
                        <li className="flex items-start gap-2 text-[13px] text-[#C7CACC] leading-[1.4]">
                          <span className="text-[#6EEDC2] text-sm font-bold select-none leading-none mt-0.5 shrink-0">
                            ›
                          </span>
                          <span>Jobs and estimates booked straight into your calendar</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= RIGHT COLUMN: APPSIAN CALL FLOW DIAGRAM ================= */}
          {/* Bottom padding of ~30vh ensures the final CTA node rests near center before pin releases */}
          <div className="w-full flex flex-col items-center min-[1000px]:pb-[30vh]">
            {/* Header: eyebrow pill "THE SOLUTION" + heading "The Appsian call flow" */}
            <motion.div
              initial={
                isReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, filter: 'blur(12px)', y: 14 }
              }
              whileInView={
                isReducedMotion
                  ? { opacity: 1, y: 0 }
                  : { opacity: 1, filter: 'blur(0px)', y: 0 }
              }
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-10"
            >
              <div className="flex justify-center mb-4">
                <SectionTag label="THE SOLUTION" icon="lightbulb" variant="dark" />
              </div>

              <h3 className="text-[28px] sm:text-[40px] leading-[1.1] font-display font-normal text-white tracking-[0.01em]">
                The Appsian call flow
              </h3>
            </motion.div>

            {/* FLOWCHART CONTAINER: Target for scroll-linked activation */}
            <div
              ref={diagramRef}
              className="w-full max-w-[620px] flex flex-col items-center select-none"
            >
              {/* ROW 1: "Customer calls" (0:00) */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex flex-col items-center justify-center cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                  activeStep >= 0 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 0)}
              >
                <span className="text-[13px] font-medium leading-tight">Customer calls</span>
                <span className="text-[11px] text-white/60 leading-tight">0:00</span>
              </div>

              {/* CONNECTOR 1 -> 2 (Straight vertical 44px) */}
              <div className="w-full h-[44px] flex justify-center items-center relative">
                <svg className="w-4 h-[44px]" viewBox="0 0 16 44" fill="none">
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="44"
                    stroke={activeStep >= 1 ? '#6EEDC2' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="2"
                    style={
                      activeStep >= 1
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  {activeStep >= 1 && !isReducedMotion && (
                    <line
                      x1="8"
                      y1="0"
                      x2="8"
                      y2="44"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="14 30"
                      className="animate-flow-pulse"
                    />
                  )}
                </svg>
              </div>

              {/* ROW 2: "Appsian answers" (0:02, on your existing number) with logo mark */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex items-center justify-center gap-2.5 px-3 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                  activeStep >= 1 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 1)}
              >
                {/* Appsian Logo Mark */}
                <AppsianIcon size={22} />
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-[13px] font-medium leading-tight truncate">
                    Appsian answers
                  </span>
                  <span className="text-[11px] text-white/60 leading-tight truncate">
                    0:02, existing no.
                  </span>
                </div>
              </div>

              {/* CONNECTOR 2 -> 3 (Straight vertical 44px) */}
              <div className="w-full h-[44px] flex justify-center items-center relative">
                <svg className="w-4 h-[44px]" viewBox="0 0 16 44" fill="none">
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="44"
                    stroke={activeStep >= 2 ? '#6EEDC2' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="2"
                    style={
                      activeStep >= 2
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  {activeStep >= 2 && !isReducedMotion && (
                    <line
                      x1="8"
                      y1="0"
                      x2="8"
                      y2="44"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="14 30"
                      className="animate-flow-pulse"
                    />
                  )}
                </svg>
              </div>

              {/* ROW 3: "Handles questions" (0:18, services, areas, rough pricing) */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex flex-col items-center justify-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] text-center ${
                  activeStep >= 2 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 2)}
              >
                <span className="text-[13px] font-medium leading-tight">Handles questions</span>
                <span className="text-[10px] text-white/60 leading-tight">
                  0:18, services, areas...
                </span>
              </div>

              {/* CONNECTOR 3 -> 4 (Fan-out of 3 rounded-elbow bracket, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[440px] h-[44px] overflow-visible"
                  viewBox="0 0 440 44"
                  fill="none"
                >
                  <path
                    d="M 220 0 L 220 14 Q 220 22 208 22 L 72 22 Q 60 22 60 30 L 60 44"
                    stroke={activeStep >= 3 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 3 ? '1.5' : '1'}
                    style={
                      activeStep >= 3
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <line
                    x1="220"
                    y1="0"
                    x2="220"
                    y2="44"
                    stroke={activeStep >= 3 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 3 ? '1.5' : '1'}
                    style={
                      activeStep >= 3
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 220 0 L 220 14 Q 220 22 232 22 L 368 22 Q 380 22 380 30 L 380 44"
                    stroke={activeStep >= 3 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 3 ? '1.5' : '1'}
                    style={
                      activeStep >= 3
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {/* Travelling pulse when active */}
                  {activeStep >= 3 && !isReducedMotion && (
                    <>
                      <path
                        d="M 220 0 L 220 14 Q 220 22 208 22 L 72 22 Q 60 22 60 30 L 60 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <line
                        x1="220"
                        y1="0"
                        x2="220"
                        y2="44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 220 0 L 220 14 Q 220 22 232 22 L 368 22 Q 380 22 380 30 L 380 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 4: FAN-OUT OF 3 ("Emergency", "Estimate request", "General question") */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 sm:gap-4 w-full">
                {/* 1. Emergency (left node, tilted) */}
                <div
                  className={`w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 3 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 3),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(8deg) skewX(-6deg)'
                        : undefined,
                    transitionDelay: activeStep >= 3 && !isReducedMotion ? '80ms' : '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Emergency
                  </span>
                </div>

                {/* 2. Estimate request (center node, flat) */}
                <div
                  className={`w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 3 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 3),
                    transitionDelay: '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Estimate request
                  </span>
                </div>

                {/* 3. General question (right node, tilted) */}
                <div
                  className={`w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 3 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 3),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(-8deg) skewX(6deg)'
                        : undefined,
                    transitionDelay: activeStep >= 3 && !isReducedMotion ? '80ms' : '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    General question
                  </span>
                </div>
              </div>

              {/* CONNECTOR 4 -> 5 (Merge bracket from 3 back into single center, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[440px] h-[44px] overflow-visible"
                  viewBox="0 0 440 44"
                  fill="none"
                >
                  <path
                    d="M 60 0 L 60 14 Q 60 22 72 22 L 208 22 Q 220 22 220 30 L 220 44"
                    stroke={activeStep >= 4 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 4 ? '1.5' : '1'}
                    style={
                      activeStep >= 4
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <line
                    x1="220"
                    y1="0"
                    x2="220"
                    y2="44"
                    stroke={activeStep >= 4 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 4 ? '1.5' : '1'}
                    style={
                      activeStep >= 4
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 380 0 L 380 14 Q 380 22 368 22 L 232 22 Q 220 22 220 30 L 220 44"
                    stroke={activeStep >= 4 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 4 ? '1.5' : '1'}
                    style={
                      activeStep >= 4
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {activeStep >= 4 && !isReducedMotion && (
                    <>
                      <path
                        d="M 60 0 L 60 14 Q 60 22 72 22 L 208 22 Q 220 22 220 30 L 220 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <line
                        x1="220"
                        y1="0"
                        x2="220"
                        y2="44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 380 0 L 380 14 Q 380 22 368 22 L 232 22 Q 220 22 220 30 L 220 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 5: "Qualifies the caller" (0:41, against your rules) */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex flex-col items-center justify-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] text-center ${
                  activeStep >= 4 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 4)}
              >
                <span className="text-[13px] font-medium leading-tight">Qualifies the caller</span>
                <span className="text-[11px] text-white/60 leading-tight">
                  0:41, your rules
                </span>
              </div>

              {/* CONNECTOR 5 -> 6 (Fan-out of 4 split bracket, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[560px] h-[44px] overflow-visible"
                  viewBox="0 0 560 44"
                  fill="none"
                >
                  <path
                    d="M 280 0 L 280 14 Q 280 22 268 22 L 77 22 Q 65 22 65 30 L 65 44"
                    stroke={activeStep >= 5 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 5 ? '1.5' : '1'}
                    style={
                      activeStep >= 5
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 280 0 L 280 14 Q 280 22 270 22 L 218 22 Q 208 22 208 30 L 208 44"
                    stroke={activeStep >= 5 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 5 ? '1.5' : '1'}
                    style={
                      activeStep >= 5
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 280 0 L 280 14 Q 280 22 290 22 L 342 22 Q 352 22 352 30 L 352 44"
                    stroke={activeStep >= 5 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 5 ? '1.5' : '1'}
                    style={
                      activeStep >= 5
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 280 0 L 280 14 Q 280 22 292 22 L 483 22 Q 495 22 495 30 L 495 44"
                    stroke={activeStep >= 5 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 5 ? '1.5' : '1'}
                    style={
                      activeStep >= 5
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {activeStep >= 5 && !isReducedMotion && (
                    <>
                      <path
                        d="M 280 0 L 280 14 Q 280 22 268 22 L 77 22 Q 65 22 65 30 L 65 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 280 0 L 280 14 Q 280 22 270 22 L 218 22 Q 208 22 208 30 L 208 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 280 0 L 280 14 Q 280 22 290 22 L 342 22 Q 352 22 352 30 L 352 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 280 0 L 280 14 Q 280 22 292 22 L 483 22 Q 495 22 495 30 L 495 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 6: FAN-OUT OF 4 ("Job type", "Urgency", "Location", "Timeline") */}
              <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 w-full max-w-[560px]">
                {/* 1. Job type */}
                <div
                  className={`w-full sm:w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 5 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 5),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(10deg) skewX(-7deg)'
                        : undefined,
                    transitionDelay: activeStep >= 5 && !isReducedMotion ? '80ms' : '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Job type
                  </span>
                </div>

                {/* 2. Urgency */}
                <div
                  className={`w-full sm:w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 5 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 5),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(4deg) skewX(-3deg)'
                        : undefined,
                    transitionDelay: '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Urgency
                  </span>
                </div>

                {/* 3. Location */}
                <div
                  className={`w-full sm:w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 5 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 5),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(-4deg) skewX(3deg)'
                        : undefined,
                    transitionDelay: '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Location
                  </span>
                </div>

                {/* 4. Timeline */}
                <div
                  className={`w-full sm:w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 5 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 5),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(-10deg) skewX(7deg)'
                        : undefined,
                    transitionDelay: activeStep >= 5 && !isReducedMotion ? '80ms' : '0ms',
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Timeline
                  </span>
                </div>
              </div>

              {/* CONNECTOR 6 -> 7 (Merge bracket from 4 back to 1, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[560px] h-[44px] overflow-visible"
                  viewBox="0 0 560 44"
                  fill="none"
                >
                  <path
                    d="M 65 0 L 65 14 Q 65 22 77 22 L 268 22 Q 280 22 280 30 L 280 44"
                    stroke={activeStep >= 6 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 6 ? '1.5' : '1'}
                    style={
                      activeStep >= 6
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 208 0 L 208 14 Q 208 22 218 22 L 270 22 Q 280 22 280 30 L 280 44"
                    stroke={activeStep >= 6 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 6 ? '1.5' : '1'}
                    style={
                      activeStep >= 6
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 352 0 L 352 14 Q 352 22 342 22 L 290 22 Q 280 22 280 30 L 280 44"
                    stroke={activeStep >= 6 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 6 ? '1.5' : '1'}
                    style={
                      activeStep >= 6
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 495 0 L 495 14 Q 495 22 483 22 L 292 22 Q 280 22 280 30 L 280 44"
                    stroke={activeStep >= 6 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 6 ? '1.5' : '1'}
                    style={
                      activeStep >= 6
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {activeStep >= 6 && !isReducedMotion && (
                    <>
                      <path
                        d="M 65 0 L 65 14 Q 65 22 77 22 L 268 22 Q 280 22 280 30 L 280 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 208 0 L 208 14 Q 208 22 218 22 L 270 22 Q 280 22 280 30 L 280 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 352 0 L 352 14 Q 352 22 342 22 L 290 22 Q 280 22 280 30 L 280 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 495 0 L 495 14 Q 495 22 483 22 L 292 22 Q 280 22 280 30 L 280 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 7: "Books or captures" (1:06) */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex flex-col items-center justify-center cursor-default transition-all duration-300 hover:-translate-y-[3px] text-center ${
                  activeStep >= 6 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 6)}
              >
                <span className="text-[13px] font-medium leading-tight">Books or captures</span>
                <span className="text-[11px] text-white/60 leading-tight">1:06</span>
              </div>

              {/* CONNECTOR 7 -> 8 (Fan-out of 2 split bracket, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[300px] h-[44px] overflow-visible"
                  viewBox="0 0 300 44"
                  fill="none"
                >
                  <path
                    d="M 150 0 L 150 14 Q 150 22 138 22 L 84 22 Q 72 22 72 30 L 72 44"
                    stroke={activeStep >= 7 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 7 ? '1.5' : '1'}
                    style={
                      activeStep >= 7
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 150 0 L 150 14 Q 150 22 162 22 L 216 22 Q 228 22 228 30 L 228 44"
                    stroke={activeStep >= 7 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 7 ? '1.5' : '1'}
                    style={
                      activeStep >= 7
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {activeStep >= 7 && !isReducedMotion && (
                    <>
                      <path
                        d="M 150 0 L 150 14 Q 150 22 138 22 L 84 22 Q 72 22 72 30 L 72 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 150 0 L 150 14 Q 150 22 162 22 L 216 22 Q 228 22 228 30 L 228 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 8: FAN-OUT OF 2 ("Estimate booked", "Lead captured") */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                {/* 1. Estimate booked */}
                <div
                  className={`w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 7 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 7),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(8deg) skewX(-6deg)'
                        : undefined,
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Estimate booked
                  </span>
                </div>

                {/* 2. Lead captured */}
                <div
                  className={`w-[130px] h-[48px] rounded-[12px] flex items-center justify-center text-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] ${
                    activeStep >= 7 ? 'text-white' : 'text-white/75'
                  }`}
                  style={{
                    ...getNodeStyle(activeStep >= 7),
                    transform:
                      typeof window !== 'undefined' && window.innerWidth >= 640
                        ? 'perspective(600px) rotateY(-8deg) skewX(6deg)'
                        : undefined,
                  }}
                >
                  <span className="text-[12px] sm:text-[13px] font-medium leading-tight">
                    Lead captured
                  </span>
                </div>
              </div>

              {/* CONNECTOR 8 -> 9 (Merge bracket from 2 back to 1 center, 44px tall) */}
              <div className="w-full h-[44px] flex justify-center items-center relative overflow-visible">
                <svg
                  className="w-full max-w-[300px] h-[44px] overflow-visible"
                  viewBox="0 0 300 44"
                  fill="none"
                >
                  <path
                    d="M 72 0 L 72 14 Q 72 22 84 22 L 138 22 Q 150 22 150 30 L 150 44"
                    stroke={activeStep >= 8 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 8 ? '1.5' : '1'}
                    style={
                      activeStep >= 8
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  <path
                    d="M 228 0 L 228 14 Q 228 22 216 22 L 162 22 Q 150 22 150 30 L 150 44"
                    stroke={activeStep >= 8 ? '#6EEDC2' : 'rgba(255,255,255,0.22)'}
                    strokeWidth={activeStep >= 8 ? '1.5' : '1'}
                    style={
                      activeStep >= 8
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />

                  {activeStep >= 8 && !isReducedMotion && (
                    <>
                      <path
                        d="M 72 0 L 72 14 Q 72 22 84 22 L 138 22 Q 150 22 150 30 L 150 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                      <path
                        d="M 228 0 L 228 14 Q 228 22 216 22 L 162 22 Q 150 22 150 30 L 150 44"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                        strokeDasharray="16 40"
                        className="animate-flow-pulse"
                      />
                    </>
                  )}
                </svg>
              </div>

              {/* ROW 9: "Team notified" (1:09, summary + transcript) */}
              <div
                className={`w-[168px] h-[56px] rounded-[12px] flex flex-col items-center justify-center px-2 cursor-default transition-all duration-300 hover:-translate-y-[3px] text-center ${
                  activeStep >= 8 ? 'text-white' : 'text-white/75'
                }`}
                style={getNodeStyle(activeStep >= 8)}
              >
                <span className="text-[13px] font-medium leading-tight">Team notified</span>
                <span className="text-[10px] text-white/60 leading-tight">
                  1:09, summary + transcript
                </span>
              </div>

              {/* CONNECTOR 9 -> 10 (Straight vertical 44px) */}
              <div className="w-full h-[44px] flex justify-center items-center relative">
                <svg className="w-4 h-[44px]" viewBox="0 0 16 44" fill="none">
                  <line
                    x1="8"
                    y1="0"
                    x2="8"
                    y2="44"
                    stroke={activeStep >= 9 ? '#6EEDC2' : 'rgba(255,255,255,0.18)'}
                    strokeWidth="2"
                    style={
                      activeStep >= 9
                        ? { filter: 'drop-shadow(0 0 6px rgba(110,237,194,0.8))' }
                        : {}
                    }
                  />
                  {activeStep >= 9 && !isReducedMotion && (
                    <line
                      x1="8"
                      y1="0"
                      x2="8"
                      y2="44"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeDasharray="14 30"
                      className="animate-flow-pulse"
                    />
                  )}
                </svg>
              </div>

              {/* ROW 10: MINT BUTTON "Get Free Demo →" */}
              <button
                type="button"
                onClick={handleScrollToHeroDemo}
                className="btn-premium btn-premium--mint btn-glitter group h-[44px] px-6 rounded-[10px] font-sans font-medium text-[15px] flex items-center justify-center gap-3 cursor-pointer"
              >
                <span>Get Free Demo</span>
                <span className="btn-arrow font-bold inline-block">
                  →
                </span>
              </button>

              {/* Caption under diagram: 12px muted text */}
              <p className="text-[12px] text-[#C7CACC]/60 text-center font-sans mt-7">
                Example call timeline. Timings vary by call.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
