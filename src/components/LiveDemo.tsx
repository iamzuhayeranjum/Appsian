import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Grid,
  Volume2,
  Plus,
  Video,
  Users,
  PhoneOff,
  Check,
  Calendar,
  RotateCcw,
  User,
  ArrowRight,
} from 'lucide-react';
import { AppsianIcon } from './AppsianLogo';
import { SectionTag } from './SectionTag';

interface LiveDemoProps {
  onBookDemoClick?: () => void;
}

interface ScriptLine {
  timeSec: number; // call time in seconds (0 to 70)
  speaker: 'Appsian' | 'Caller';
  text: string;
}

const SCRIPT: ScriptLine[] = [
  { timeSec: 2, speaker: 'Appsian', text: 'Thanks for calling. This is Appsian. How can I help you today?' },
  { timeSec: 8, speaker: 'Caller', text: "Hi, I've got a leak in my roof. Can someone take a look?" },
  { timeSec: 14, speaker: 'Appsian', text: "I'm sorry to hear that. Is water coming in right now?" },
  { timeSec: 22, speaker: 'Caller', text: "Yes, it's dripping in the hallway." },
  { timeSec: 30, speaker: 'Appsian', text: 'Understood, that sounds urgent. Can I get your name and the best number?' },
  { timeSec: 41, speaker: 'Caller', text: "It's Mark." },
  { timeSec: 52, speaker: 'Appsian', text: 'Thanks, Mark. I can book an estimate tomorrow at 10:00 AM. Does that work?' },
  { timeSec: 60, speaker: 'Caller', text: 'Yes, that works.' },
  { timeSec: 66, speaker: 'Appsian', text: "You're all set. I've booked tomorrow at 10:00 AM and sent the details to the team." },
];

const SPEED = 5; // 5x speed: 70 call seconds in 14 real seconds
const TOTAL_CALL_SECS = 70;
const PAUSE_AFTER_SECS = 3; // 3 seconds pause at end

const SHARED_GLASS_STYLE: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'blur(16px) saturate(1.25)',
  WebkitBackdropFilter: 'blur(16px) saturate(1.25)',
  border: '1px solid rgba(255, 255, 255, 0.85)',
  boxShadow:
    '0 0 0 1px rgba(15, 23, 42, 0.05), 0 10px 30px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
};

const formatTimer = (totalSec: number) => {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const LiveDemo: React.FC<LiveDemoProps> = ({ onBookDemoClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [callTime, setCallTime] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeaker, setTypingSpeaker] = useState<'Appsian' | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // IntersectionObserver to start and pause simulation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const resetCall = useCallback(() => {
    setCallTime(1);
    setIsTyping(false);
    setTypingSpeaker(null);
  }, []);

  // Simulation tick loop
  useEffect(() => {
    if (reduceMotion) {
      setCallTime(TOTAL_CALL_SECS);
      return;
    }
    if (!isInView) return;

    const realIntervalMs = 100; // tick every 100ms
    const callSecsPerTick = (realIntervalMs / 1000) * SPEED; // 0.5 call seconds per tick

    const interval = setInterval(() => {
      setCallTime((prev) => {
        const next = prev + callSecsPerTick;

        // Check if approaching next Appsian line to show typing indicator
        const nextAppsianLine = SCRIPT.find(
          (line) => line.speaker === 'Appsian' && line.timeSec > prev && line.timeSec <= next + 3.5
        );
        if (nextAppsianLine && nextAppsianLine.timeSec - next <= 3.5) {
          setIsTyping(true);
          setTypingSpeaker('Appsian');
        } else {
          setIsTyping(false);
          setTypingSpeaker(null);
        }

        // Loop after call ends + 3s pause
        if (next >= TOTAL_CALL_SECS + PAUSE_AFTER_SECS * SPEED) {
          return 1;
        }
        return next;
      });
    }, realIntervalMs);

    return () => clearInterval(interval);
  }, [isInView, reduceMotion]);

  // Auto-scroll transcript container as new lines appear
  useEffect(() => {
    if (transcriptListRef.current) {
      transcriptListRef.current.scrollTo({
        top: transcriptListRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [callTime, isTyping, reduceMotion]);

  const visibleLines = reduceMotion
    ? SCRIPT
    : SCRIPT.filter((line) => line.timeSec <= callTime);

  const isAnswered = reduceMotion || callTime >= 2;
  const isQualified = reduceMotion || callTime >= 41;
  const isBooked = reduceMotion || callTime >= 66;
  const showResultRow = reduceMotion || callTime >= 70;

  return (
    <section
      ref={sectionRef}
      id="live-demo"
      className="w-full bg-white pt-24 pb-16 flex flex-col items-center select-none"
    >
      {/* 1. SECTION HEADER */}
      <div className="flex flex-col items-center text-center max-w-[850px] mx-auto px-5 mb-12">
        {/* Eyebrow Pill */}
        <SectionTag label="LIVE DEMO" icon="play" className="mb-4" />

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-display font-light text-[#2D283C] tracking-[-0.03em] leading-[1.15] text-balance">
          See a call from start to finish
        </h2>

        {/* Section Subtitle */}
        <p className="mt-4 text-[15px] sm:text-[17px] leading-[26px] text-[#5B5F68] max-w-xl mx-auto font-normal text-balance">
          Watch Appsian answer, qualify and book a job in about a minute.
        </p>
      </div>

      {/* 2. THE BIG ROUNDED PANEL */}
      <div className="w-[calc(100%-32px)] max-w-[1180px] mx-auto rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 lg:p-10 relative overflow-hidden bg-gradient-to-b from-[#F8F9FD] to-[#F1F3FA] border border-[rgba(15,23,42,0.07)]">
        {/* Double Border Inner Frame */}
        <div
          className="absolute inset-[8px] sm:inset-[12px] rounded-[20px] sm:rounded-[26px] border border-[rgba(255,255,255,0.95)] pointer-events-none z-0"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.03)',
          }}
          aria-hidden="true"
        />

        {/* Soft Colored Light Blobs for Glass Refraction */}
        <div
          className="w-[320px] h-[320px] rounded-full blur-[70px] absolute top-10 left-12 pointer-events-none z-0"
          style={{ background: 'rgba(201, 192, 250, 0.55)' }}
          aria-hidden="true"
        />
        <div
          className="w-[360px] h-[360px] rounded-full blur-[70px] absolute top-12 right-12 pointer-events-none z-0"
          style={{ background: 'rgba(189, 240, 220, 0.50)' }}
          aria-hidden="true"
        />
        <div
          className="w-[300px] h-[240px] rounded-full blur-[70px] absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-0"
          style={{ background: 'rgba(255, 217, 199, 0.35)' }}
          aria-hidden="true"
        />

        {/* 2-Column Content Grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[44%_56%] gap-8 lg:gap-10 items-center">
          
          {/* LEFT SIDE: THE IPHONE & OVERLAPPING STAT CARDS */}
          <div className="flex flex-col items-center justify-center relative w-full pt-4 pb-8 sm:pb-12">
            
            {/* iPhone Frame */}
            <div
              className="w-[240px] sm:w-[260px] lg:w-[290px] aspect-[9/19] rounded-[42px] sm:rounded-[50px] p-[8px] sm:p-[10px] relative shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18)] select-none"
              style={{
                background: 'linear-gradient(145deg, #F4F5F8 0%, #C9CDD6 50%, #F1F2F6 100%)',
                boxShadow:
                  '0 0 0 1px rgba(255, 255, 255, 0.9), 0 24px 60px -12px rgba(15, 23, 42, 0.18)',
              }}
            >
              {/* Inner Screen */}
              <div className="w-full h-full rounded-[34px] sm:rounded-[40px] overflow-hidden relative flex flex-col justify-between p-3.5 sm:p-4 bg-gradient-to-b from-[#E9EEFC] to-[#DCE4F7]">
                
                {/* Top Bar & Dynamic Island */}
                <div className="w-full flex flex-col items-center">
                  {/* Dynamic Island */}
                  <div className="w-[84px] sm:w-[90px] h-[24px] sm:h-[26px] bg-[#0B0F19] rounded-full mx-auto flex items-center justify-end pr-2.5 shadow-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1A1F2C]" />
                  </div>

                  {/* Status Bar */}
                  <div className="w-full flex items-center justify-between text-[#0B0F19] text-[11px] sm:text-[12px] font-semibold px-2 -mt-4">
                    <span>9:58</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">5G</span>
                      <div className="w-4 h-2 rounded-[2px] border border-current p-[1px] flex items-center">
                        <div className="w-2.5 h-full bg-current rounded-[1px]" />
                      </div>
                    </div>
                  </div>

                  {/* Caller Name & Call Timer */}
                  <div className="mt-5 sm:mt-7 text-center">
                    <h3 className="text-[19px] sm:text-[22px] font-medium text-[#0B0F19] leading-tight tracking-tight">
                      AI Sales Receptionist
                    </h3>
                    <p className="text-[14px] sm:text-[16px] text-[#64748B] font-normal tabular-nums mt-0.5">
                      {formatTimer(callTime)}
                    </p>
                  </div>
                </div>

                {/* 3x2 Grid of Call Buttons */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 my-auto px-1 sm:px-2">
                  {[
                    { label: 'mute', icon: Mic },
                    { label: 'keypad', icon: Grid },
                    { label: 'audio', icon: Volume2 },
                    { label: 'add call', icon: Plus },
                    { label: 'video', icon: Video },
                    { label: 'contacts', icon: Users },
                  ].map((btn) => {
                    const Icon = btn.icon;
                    return (
                      <div key={btn.label} className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-full flex items-center justify-center text-[#1F2937] shadow-xs"
                          style={{
                            background: 'rgba(255, 255, 255, 0.60)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.85)',
                          }}
                        >
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
                        </div>
                        <span className="text-[10.5px] sm:text-[12px] text-[#475569] font-normal">
                          {btn.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Red End-Call Button */}
                <div className="w-full flex justify-center pb-2">
                  <div className="w-[54px] h-[54px] sm:w-[64px] sm:h-[64px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-md">
                    <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
                  </div>
                </div>

                {/* Diagonal Glass Sheen */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none opacity-40"
                  style={{
                    background:
                      'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.6) 50%, transparent 62%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* THREE GLASS STAT CARDS (overlapping the bottom edge of phone) */}
            <div className="w-full max-w-[440px] flex items-center justify-center gap-2.5 sm:gap-3.5 -mt-8 sm:-mt-9 relative z-20 px-2">
              {[
                { time: '0:02', label: 'Answered', active: isAnswered },
                { time: '0:41', label: 'Qualified', active: isQualified },
                { time: '1:06', label: 'Booked', active: isBooked },
              ].map((card, idx) => (
                <motion.div
                  key={card.label}
                  animate={
                    card.active && !reduceMotion
                      ? {
                          scale: [1, 1.04, 1],
                          opacity: 1,
                        }
                      : {
                          scale: 1,
                          opacity: card.active ? 1 : 0.5,
                        }
                  }
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="flex-1 max-w-[128px] h-[64px] sm:h-[74px] rounded-[16px] p-2 sm:p-2.5 flex flex-col justify-center items-center text-center relative transition-opacity duration-300"
                  style={SHARED_GLASS_STYLE}
                >
                  {/* Active Mint Check */}
                  {card.active && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#6EEDC2] flex items-center justify-center text-[#062B20] shadow-xs">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.8]" />
                    </div>
                  )}
                  <span className="text-[17px] sm:text-[22px] font-medium text-[#0B0F19] tabular-nums leading-none">
                    {card.time}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#64748B] mt-1 sm:mt-1.5 leading-none">
                    {card.label}
                  </span>
                </motion.div>
              ))}
            </div>

          </div>

          {/* RIGHT SIDE: THE TRANSCRIPT CARD */}
          <div className="flex flex-col items-center lg:items-start w-full">
            <div
              className="w-full max-w-[500px] h-[390px] sm:h-[420px] rounded-[24px] p-5 sm:p-7 flex flex-col relative overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
              style={SHARED_GLASS_STYLE}
            >
              {/* Glowing Gradient Border Accent */}
              <div
                className="absolute inset-0 rounded-[24px] pointer-events-none p-[1px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(52,211,153,0.9) 0%, rgba(124,92,255,0.45) 45%, rgba(255,255,255,0) 75%)',
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                aria-hidden="true"
              />

              {/* Card Top Row: Tag Pill & Replay Button */}
              <div className="flex items-center justify-between w-full mb-3">
                {/* Live Transcript Tag Pill */}
                <div
                  className="h-[28px] pl-2.5 pr-3 rounded-full flex items-center gap-1.5 shadow-xs"
                  style={{
                    background: 'rgba(255, 255, 255, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2] animate-pulse" />
                  <span className="text-[10.5px] font-sans font-medium uppercase tracking-[0.06em] text-[#334155]">
                    LIVE TRANSCRIPT
                  </span>
                </div>

                {/* Replay Icon Button */}
                <button
                  type="button"
                  onClick={resetCall}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-[rgba(255,255,255,0.9)] bg-white/75 hover:bg-white active:scale-95 transition-all text-[#334155] hover:text-[#0B0F19] shadow-xs"
                  aria-label="Replay call demo"
                  title="Replay call"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </div>

              {/* Title Row */}
              <div className="mb-3 text-left">
                <h3 className="text-[20px] sm:text-[22px] font-display font-medium text-[#0B0F19] leading-tight">
                  Sample call
                </h3>
                <p className="text-[12.5px] sm:text-[13px] text-[#64748B] mt-0.5">
                  Roofing · After hours
                </p>
              </div>

              {/* Transcript Messages List with Top Fade Mask */}
              <div
                ref={transcriptListRef}
                className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3.5 pr-1 relative"
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 18%)',
                }}
              >
                {visibleLines.map((line, idx) => {
                  const isAppsian = line.speaker === 'Appsian';
                  return (
                    <motion.div
                      key={idx}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="flex items-start gap-2.5 text-left"
                    >
                      {/* 26px Speaker Icon */}
                      <div className="w-[26px] h-[26px] min-w-[26px] rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {isAppsian ? (
                          <AppsianIcon size={22} />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center">
                            <User className="w-3.5 h-3.5 stroke-[2]" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-[11.5px] font-medium text-[#64748B] leading-none mb-1">
                          {line.speaker}
                        </span>
                        <p className="text-[14px] sm:text-[15px] text-[#1F2937] leading-[1.45] font-normal">
                          {line.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Typing Indicator before Appsian lines */}
                {isTyping && typingSpeaker === 'Appsian' && !reduceMotion && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <div className="w-[26px] h-[26px] min-w-[26px] rounded-full flex items-center justify-center shrink-0">
                      <AppsianIcon size={22} />
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/80 border border-slate-100 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* End of Call Result Pill */}
              <AnimatePresence>
                {showResultRow && (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="mt-3.5 w-full h-[42px] px-3.5 rounded-full flex items-center justify-between shadow-xs"
                    style={{
                      background: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid rgba(110, 237, 194, 0.65)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#6EEDC2] flex items-center justify-center text-[#062B20]">
                        <Check className="w-3 h-3 stroke-[2.8]" />
                      </div>
                      <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#0B0F19]">
                        Job booked
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[13px] sm:text-[14px] text-[#64748B]">
                      <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                      <span>Tomorrow, 10:00 AM</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Disclaimer Under Card */}
            <p className="text-[12px] text-[#94A3B8] mt-3 text-center lg:text-left pl-1">
              Example call. Names and details are placeholders.
            </p>
          </div>

        </div>
      </div>

      {/* 7. CTA BUTTON UNDER THE PANEL */}
      <div className="mt-9 flex justify-center">
        <button
          type="button"
          onClick={onBookDemoClick}
          className="btn-premium group h-[52px] px-7 rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[#4A7FF0] focus-visible:outline-offset-[2px]"
        >
          <span>Get Free Demo</span>
          <ArrowRight className="btn-arrow w-[18px] h-[18px]" strokeWidth={2} />
        </button>
      </div>
    </section>
  );
};
