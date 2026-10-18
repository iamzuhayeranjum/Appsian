import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Phone, Volume2, Check, Clock, CheckCircle2 } from 'lucide-react';
import { SectionTag } from './SectionTag';

export const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const fanRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(fanRef, { once: true, amount: 0.25 });

  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<'left' | 'center' | 'right' | null>(null);
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Typewriter effect state for "Reclaim your time"
  const summaryText =
    'Caller reported sudden boiler leak in basement. Verified service address at 42 Elm St. Confirmed diagnostic slot for Tuesday 9:30 AM with master tech.';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Measure window & reduced motion
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1000);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', checkViewport);
      mq.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // IntersectionObserver to pause loops when out of view
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Typewriter loop - paused if section is out of view
  useEffect(() => {
    if (!isSectionVisible) return;

    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayText.length < summaryText.length) {
      timeout = setTimeout(() => {
        setDisplayText(summaryText.slice(0, displayText.length + 1));
      }, 40);
    } else if (!isDeleting && displayText.length === summaryText.length) {
      timeout = setTimeout(() => {
        setDeleting(true);
      }, 2600);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(summaryText.slice(0, displayText.length - 2));
      }, 20);
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false);
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isSectionVisible]);

  const setDeleting = (val: boolean) => {
    setIsDeleting(val);
  };

  // Parallax mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || !isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const normX = Math.max(-1, Math.min(1, x / (rect.width / 2)));
    const normY = Math.max(-1, Math.min(1, y / (rect.height / 2)));
    // Max tilt 4deg following cursor
    setParallax({ x: -normY * 4, y: normX * 4 });
  };

  const handleCardMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
    setHoveredCard(null);
  };

  // Render Inner Content for Card 1 (Left: Reclaim your time)
  const renderCardLeftContent = () => (
    <>
      {/* 1) Image Area: 340px tall with lavender-to-cyan gradient */}
      <div
        className="h-[340px] relative overflow-hidden p-4 flex flex-col justify-between"
        style={{ background: 'linear-gradient(160deg, #EEF0FF, #DDF3FF)' }}
      >
        {/* Status Pill */}
        <div className="h-[34px] px-3.5 rounded-[8px] bg-white/80 backdrop-blur-md border border-white/60 shadow-xs inline-flex items-center gap-2 self-start select-none z-10">
          <span className="w-2 h-2 rounded-full bg-[#6EEDC2]" />
          <span className="text-[13px] font-medium text-[#2D283C]">AI summaries</span>
        </div>

        {/* Mockup Card (scaled up & bleeding off bottom edge) */}
        <div className="w-[310px] mx-auto bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 -mb-6 transform translate-y-2 z-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#6EEDC2]" />
              <span className="text-xs font-semibold text-slate-800">
                AI Call Summary
              </span>
            </div>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
              <Check className="w-3 h-3" />
              <span>Mark as complete</span>
            </div>
          </div>

          {/* Typewriter box */}
          <div className="bg-[#FAFBFD] rounded-xl p-3 min-h-[92px] text-xs text-slate-700 leading-relaxed font-sans border border-slate-100">
            <span>{displayText}</span>
            <span className="inline-block w-1.5 h-3.5 bg-[#4A3FB5] ml-0.5 animate-pulse" />
          </div>

          <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Duration: 2m 14s
            </span>
            <span>Dispatched to technician</span>
          </div>
        </div>
      </div>

      {/* 2) Text Area: 160px, background #FAFBFC, 1px hairline */}
      <div className="h-[160px] bg-[#FAFBFC] border-t border-[rgba(10,10,20,0.06)] p-6 flex flex-col justify-center text-left">
        <h3 className="text-[26px] font-display font-light text-[#2D283C] leading-[1.2] tracking-tight mb-2">
          Reclaim your time
        </h3>
        <p className="text-[15px] leading-[23px] text-[#2D283C]/75 line-clamp-3 font-normal">
          Stop playing phone tag. Get a clear summary of every call.
        </p>
      </div>
    </>
  );

  // Render Inner Content for Card 2 (Center: Never lose a lead to voicemail)
  const renderCardCenterContent = () => (
    <>
      {/* 1) Image Area: 340px tall with lavender-to-cyan gradient */}
      <div
        className="h-[340px] relative overflow-hidden p-4 flex flex-col justify-between"
        style={{ background: 'linear-gradient(160deg, #EEF0FF, #DDF3FF)' }}
      >
        {/* Status Pill with pulsing mint dot */}
        <div className="h-[34px] px-3.5 rounded-[8px] bg-white/80 backdrop-blur-md border border-white/60 shadow-xs inline-flex items-center gap-2 self-start select-none z-20">
          <span
            className={`w-2 h-2 rounded-full bg-[#6EEDC2] ${
              isReducedMotion ? '' : 'animate-pulse'
            }`}
          />
          <span className="text-[13px] font-medium text-[#2D283C]">Always on</span>
        </div>

        {/* Overlapping Floating Mockup Cards bleeding off the bottom */}
        <div className="relative w-full h-[250px] -mb-4 flex items-center justify-center z-10">
          {/* Back Card: Live Call */}
          <div className="absolute left-1 top-0 w-[240px] bg-white rounded-2xl p-3.5 shadow-md border border-slate-100 transform -rotate-3 transition-transform duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-3 h-3" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-800 block">
                    Incoming Line 1
                  </span>
                  <span className="text-[8.5px] text-slate-400">02:45 · Connected</span>
                </div>
              </div>
              <span className="text-[9px] font-medium bg-[#6EEDC2]/20 text-emerald-800 px-1.5 py-0.5 rounded-full">
                Live Call
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-2 mb-2">
              <div className="text-[10px] font-medium text-slate-700 line-clamp-1">
                &ldquo;Water heater leaking...&rdquo;
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Volume2 className="w-2.5 h-2.5 text-[#4A3FB5]" />
                <div className="flex gap-0.5 items-end h-2">
                  <div className="w-0.5 h-1.5 bg-[#4A3FB5] animate-pulse" />
                  <div className="w-0.5 h-2 bg-[#4A3FB5] animate-pulse delay-75" />
                  <div className="w-0.5 h-1 bg-[#4A3FB5] animate-pulse delay-150" />
                </div>
                <span className="text-[8px] text-slate-400 ml-0.5">Listening</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-100">
              <span>Caller: Marcus V.</span>
              <span className="text-emerald-600 font-medium">Auto-qualifying</span>
            </div>
          </div>

          {/* Front Card: Qualification Progress */}
          <div className="absolute right-1 bottom-1 w-[250px] bg-white rounded-2xl p-3.5 shadow-lg border border-slate-100 transform rotate-2 transition-transform duration-300 z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-semibold text-slate-800">
                Qualification Progress
              </span>
              <span className="text-[9px] font-semibold text-[#4A3FB5] bg-indigo-50 px-1.5 py-0.5 rounded-full">
                92% Done
              </span>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full mb-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6EEDC2] to-[#4A3FB5] rounded-full"
                style={{ width: '92%' }}
              />
            </div>

            <div className="space-y-1.5 text-[9.5px]">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Plumbing emergency
                </span>
                <span className="text-slate-400 text-[8.5px]">Verified</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Slot confirmed
                </span>
                <span className="text-slate-400 text-[8.5px]">Tue 9:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2) Text Area: 160px, background #FAFBFC, 1px hairline */}
      <div className="h-[160px] bg-[#FAFBFC] border-t border-[rgba(10,10,20,0.06)] p-6 flex flex-col justify-center text-left">
        <h3 className="text-[26px] font-display font-light text-[#2D283C] leading-[1.2] tracking-tight mb-2">
          Never lose a lead to voicemail
        </h3>
        <p className="text-[15px] leading-[23px] text-[#2D283C]/75 line-clamp-3 font-normal">
          Appsian picks up on your existing number, talks to callers naturally and captures every detail, even at 2am on a Sunday.
        </p>
      </div>
    </>
  );

  // Render Inner Content for Card 3 (Right: Stay on top of every call)
  const renderCardRightContent = () => (
    <>
      {/* 1) Image Area: 340px tall with lavender-to-cyan gradient */}
      <div
        className="h-[340px] relative overflow-hidden p-4 flex flex-col justify-between"
        style={{ background: 'linear-gradient(160deg, #EEF0FF, #DDF3FF)' }}
      >
        {/* Status Pill */}
        <div className="h-[34px] px-3.5 rounded-[8px] bg-white/80 backdrop-blur-md border border-white/60 shadow-xs inline-flex items-center gap-2 self-start select-none z-10">
          <span className="w-2 h-2 rounded-full bg-[#6EEDC2]" />
          <span className="text-[13px] font-medium text-[#2D283C]">Live dashboard</span>
        </div>

        {/* Mockup Card (scaled up & bleeding off bottom edge) */}
        <div className="w-[310px] mx-auto bg-white rounded-2xl p-4 shadow-sm border border-slate-100/80 -mb-6 space-y-2.5 transform translate-y-1 z-0">
          {/* Row 1: Booked */}
          <div className="p-2.5 bg-[#FAFBFD] rounded-xl flex items-center justify-between border border-slate-100">
            <div className="space-y-1.5 flex-1 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800">
                  Sarah Jenkins
                </span>
                <span className="text-[9.5px] text-slate-400">· 11:42 AM</span>
              </div>
              <div className="w-4/5 h-1.5 bg-slate-200/80 rounded-full" />
              <div className="w-2/5 h-1 bg-slate-100 rounded-full" />
            </div>
            <span className="text-[9.5px] font-semibold text-emerald-700 bg-[#6EEDC2]/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              Booked
            </span>
          </div>

          {/* Row 2: Escalated */}
          <div className="p-2.5 bg-[#FAFBFD] rounded-xl flex items-center justify-between border border-slate-100">
            <div className="space-y-1.5 flex-1 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800">
                  Highland Dental Clinic
                </span>
                <span className="text-[9.5px] text-slate-400">· 01:15 PM</span>
              </div>
              <div className="w-3/4 h-1.5 bg-slate-200/80 rounded-full" />
              <div className="w-1/2 h-1 bg-slate-100 rounded-full" />
            </div>
            <span className="text-[9.5px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
              Escalated
            </span>
          </div>

          {/* Row 3: Quote Sent (bleeding off) */}
          <div className="p-2 bg-[#FAFBFD] rounded-xl flex items-center justify-between opacity-80 border border-slate-100">
            <div className="space-y-1 flex-1 pr-2">
              <span className="text-[11px] font-semibold text-slate-800 block">
                David Miller
              </span>
              <div className="w-2/3 h-1.5 bg-slate-200/80 rounded-full" />
            </div>
            <span className="text-[9px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Quote Sent
            </span>
          </div>
        </div>
      </div>

      {/* 2) Text Area: 160px, background #FAFBFC, 1px hairline */}
      <div className="h-[160px] bg-[#FAFBFC] border-t border-[rgba(10,10,20,0.06)] p-6 flex flex-col justify-center text-left">
        <h3 className="text-[26px] font-display font-light text-[#2D283C] leading-[1.2] tracking-tight mb-2">
          Stay on top of every call
        </h3>
        <p className="text-[15px] leading-[23px] text-[#2D283C]/75 line-clamp-3 font-normal">
          Every call, booking and caller detail in one simple dashboard.
        </p>
      </div>
    </>
  );

  return (
    <section
      id="features"
      ref={sectionRef}
      className="w-full bg-[#FFFFFF] pt-[96px] pb-[120px] relative overflow-x-clip"
    >
      {/* 1. Dot Grid background: 14px spacing, 4% opacity, radial mask */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(10, 10, 20, 0.04) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* 2. Soft cool spotlight behind card fan */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 55% 45% at 50% 55%, rgba(198,210,255,0.35), transparent 70%)',
        }}
      />

      <div className="max-w-[1187px] mx-auto px-4 relative z-10 flex flex-col items-center">
        {/* Eyebrow Pill: "WHAT YOU GET" */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 16 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="select-none"
        >
          <SectionTag label="What You Get" icon="gift" />
        </motion.div>

        {/* Headline: 52px, light weight of display font, ink, letter-spacing -0.03em */}
        <motion.h2
          initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-[28px] mb-[56px] text-center text-3xl sm:text-4xl md:text-[52px] font-display font-light text-[#2D283C] tracking-[-0.03em] leading-[1.15] max-w-4xl"
        >
          Save hours and keep jobs moving
        </motion.h2>

        {/* ========================================================= */}
        {/* THE FAN (3 CARDS)                                         */}
        {/* ========================================================= */}
        <div ref={fanRef} className="w-full">
          {isDesktop ? (
            /* DESKTOP 3D FAN (perspective 1400px, preserve-3d) */
            <div
              className="relative w-full h-[530px] flex items-center justify-center select-none"
              style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* CARD 1: LEFT ("Reclaim your time") */}
              <motion.div
                initial={
                  isReducedMotion
                    ? { x: -330, y: 24, scale: 0.94, rotateY: 18, rotateZ: -4, opacity: 0.9 }
                    : { x: 0, y: 24, scale: 0.94, rotateY: 0, rotateZ: 0, opacity: 0, filter: 'blur(12px)' }
                }
                animate={
                  isInView
                    ? {
                        x:
                          hoveredCard === 'left'
                            ? -330
                            : hoveredCard === 'center'
                            ? -342
                            : hoveredCard === 'right'
                            ? -342
                            : -330,
                        y: hoveredCard === 'left' ? 0 : 24,
                        scale: hoveredCard === 'left' ? 1.02 : 0.94,
                        rotateY:
                          hoveredCard === 'left'
                            ? parallax.y
                            : 18,
                        rotateZ: hoveredCard === 'left' ? 0 : -4,
                        rotateX: hoveredCard === 'left' ? parallax.x : 0,
                        opacity: hoveredCard === 'left' ? 1 : 0.9,
                        filter: 'blur(0px)',
                      }
                    : {}
                }
                transition={{
                  duration: 0.9,
                  delay: isReducedMotion ? 0 : 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHoveredCard('left')}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[340px] h-[500px] cursor-pointer"
                style={{
                  zIndex: hoveredCard === 'left' ? 10 : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Outer rim: 6px padding, rgba(255,255,255,0.6), border 1px solid rgba(10,10,20,0.06), radius 34px */}
                <div
                  className="w-full h-full p-[6px] rounded-[34px] transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(10, 10, 20, 0.06)',
                  }}
                >
                  {/* Inner card: white, border rgba(10,10,20,0.07), radius 28px */}
                  <div
                    className="w-full h-full rounded-[28px] bg-white overflow-hidden flex flex-col relative transition-shadow duration-300"
                    style={{
                      border: '1px solid rgba(10, 10, 20, 0.07)',
                      boxShadow:
                        hoveredCard === 'left'
                          ? '0 2px 4px rgba(10,10,20,.06), 0 32px 72px -20px rgba(10,10,20,.24)'
                          : '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                    }}
                  >
                    {renderCardLeftContent()}

                    {/* 12% soft white overlay (fades out on hover) */}
                    <div
                      className="absolute inset-0 bg-white/12 pointer-events-none rounded-[28px] transition-opacity duration-300"
                      style={{ opacity: hoveredCard === 'left' ? 0 : 1 }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* CARD 2: CENTER ("Never lose a lead to voicemail") */}
              <motion.div
                initial={
                  isReducedMotion
                    ? { x: 0, y: 0, scale: 1, rotateY: 0, rotateZ: 0, opacity: 1 }
                    : { x: 0, y: 20, scale: 1, rotateY: 0, rotateZ: 0, opacity: 0, filter: 'blur(14px)' }
                }
                animate={
                  isInView
                    ? {
                        x:
                          hoveredCard === 'center'
                            ? 0
                            : hoveredCard === 'left'
                            ? 12
                            : hoveredCard === 'right'
                            ? -12
                            : 0,
                        y: hoveredCard === 'center' ? -6 : 0,
                        scale: hoveredCard === 'center' ? 1.02 : 1,
                        rotateY: hoveredCard === 'center' ? parallax.y : 0,
                        rotateX: hoveredCard === 'center' ? parallax.x : 0,
                        rotateZ: 0,
                        opacity: 1,
                        filter: 'blur(0px)',
                      }
                    : {}
                }
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHoveredCard('center')}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[360px] h-[500px] cursor-pointer"
                style={{
                  zIndex: hoveredCard === 'center' ? 10 : 3,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Outer rim */}
                <div
                  className="w-full h-full p-[6px] rounded-[34px] transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(10, 10, 20, 0.06)',
                  }}
                >
                  {/* Inner card */}
                  <div
                    className="w-full h-full rounded-[28px] bg-white overflow-hidden flex flex-col relative transition-shadow duration-300"
                    style={{
                      border: '1px solid rgba(10, 10, 20, 0.07)',
                      boxShadow:
                        hoveredCard === 'center'
                          ? '0 2px 4px rgba(10,10,20,.06), 0 32px 72px -20px rgba(10,10,20,.24)'
                          : '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                    }}
                  >
                    {renderCardCenterContent()}
                  </div>
                </div>
              </motion.div>

              {/* CARD 3: RIGHT ("Stay on top of every call") */}
              <motion.div
                initial={
                  isReducedMotion
                    ? { x: 330, y: 24, scale: 0.94, rotateY: -18, rotateZ: 4, opacity: 0.9 }
                    : { x: 0, y: 24, scale: 0.94, rotateY: 0, rotateZ: 0, opacity: 0, filter: 'blur(12px)' }
                }
                animate={
                  isInView
                    ? {
                        x:
                          hoveredCard === 'right'
                            ? 330
                            : hoveredCard === 'center'
                            ? 342
                            : hoveredCard === 'left'
                            ? 342
                            : 330,
                        y: hoveredCard === 'right' ? 0 : 24,
                        scale: hoveredCard === 'right' ? 1.02 : 0.94,
                        rotateY:
                          hoveredCard === 'right'
                            ? parallax.y
                            : -18,
                        rotateZ: hoveredCard === 'right' ? 0 : 4,
                        rotateX: hoveredCard === 'right' ? parallax.x : 0,
                        opacity: hoveredCard === 'right' ? 1 : 0.9,
                        filter: 'blur(0px)',
                      }
                    : {}
                }
                transition={{
                  duration: 0.9,
                  delay: isReducedMotion ? 0 : 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
                onMouseEnter={() => setHoveredCard('right')}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleCardMouseLeave}
                className="absolute left-1/2 top-0 -translate-x-1/2 w-[340px] h-[500px] cursor-pointer"
                style={{
                  zIndex: hoveredCard === 'right' ? 10 : 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Outer rim */}
                <div
                  className="w-full h-full p-[6px] rounded-[34px] transition-all duration-300"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(10, 10, 20, 0.06)',
                  }}
                >
                  {/* Inner card */}
                  <div
                    className="w-full h-full rounded-[28px] bg-white overflow-hidden flex flex-col relative transition-shadow duration-300"
                    style={{
                      border: '1px solid rgba(10, 10, 20, 0.07)',
                      boxShadow:
                        hoveredCard === 'right'
                          ? '0 2px 4px rgba(10,10,20,.06), 0 32px 72px -20px rgba(10,10,20,.24)'
                          : '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                    }}
                  >
                    {renderCardRightContent()}

                    {/* 12% soft white overlay (fades out on hover) */}
                    <div
                      className="absolute inset-0 bg-white/12 pointer-events-none rounded-[28px] transition-opacity duration-300"
                      style={{ opacity: hoveredCard === 'right' ? 0 : 1 }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* MOBILE / TABLET STACK (<1000px): Center card first, 100% width max 420px */
            <div className="flex flex-col items-center gap-6 w-full max-w-[420px] mx-auto">
              {/* 1. Center card first */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-[6px] rounded-[34px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(10, 10, 20, 0.06)',
                }}
              >
                <div
                  className="w-full rounded-[28px] bg-white overflow-hidden flex flex-col"
                  style={{
                    border: '1px solid rgba(10, 10, 20, 0.07)',
                    boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                  }}
                >
                  {renderCardCenterContent()}
                </div>
              </motion.div>

              {/* 2. Left card (Reclaim your time) */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-[6px] rounded-[34px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(10, 10, 20, 0.06)',
                }}
              >
                <div
                  className="w-full rounded-[28px] bg-white overflow-hidden flex flex-col"
                  style={{
                    border: '1px solid rgba(10, 10, 20, 0.07)',
                    boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                  }}
                >
                  {renderCardLeftContent()}
                </div>
              </motion.div>

              {/* 3. Right card (Stay on top of every call) */}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full p-[6px] rounded-[34px]"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid rgba(10, 10, 20, 0.06)',
                }}
              >
                <div
                  className="w-full rounded-[28px] bg-white overflow-hidden flex flex-col"
                  style={{
                    border: '1px solid rgba(10, 10, 20, 0.07)',
                    boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 24px 60px -24px rgba(10,10,20,.18)',
                  }}
                >
                  {renderCardRightContent()}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
