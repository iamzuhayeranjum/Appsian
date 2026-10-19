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
  Phone,
  Check,
  Calendar,
} from 'lucide-react';

interface HeroPhoneStageProps {
  appReady?: boolean;
}

interface ScriptLine {
  timeSec: number;
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

const SPEED = 4.5;
const TOTAL_CALL_SECS = 70;
const PAUSE_AFTER_SECS = 3.5;

const NATURAL_WIDTH = 300;
const NATURAL_HEIGHT = 610;
const VISIBLE_FRACTION = 0.92;

const formatTimer = (totalSec: number) => {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const HeroPhoneStage: React.FC<HeroPhoneStageProps> = ({ appReady = true }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [callState, setCallState] = useState<'incoming' | 'in-call'>('incoming');
  const [callTime, setCallTime] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Compute scale based on stage container dimensions
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const updateScale = () => {
      const h = stage.clientHeight;
      const w = stage.clientWidth;
      if (h <= 0 || w <= 0) return;

      // Scale so that 92% of phone fits stage height
      let s = h / (NATURAL_HEIGHT * VISIBLE_FRACTION);
      // Limit width to 380px maximum
      s = Math.min(s, 380 / NATURAL_WIDTH);
      // Fit in container width (accounting for 48px padding)
      s = Math.min(s, Math.max(0.4, (w - 48) / NATURAL_WIDTH));
      // Max scale 1.25
      s = Math.min(s, 1.25);
      s = Math.max(s, 0.55);
      setScale(s);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Auto-answer after initial entrance delay if user doesn't click
  useEffect(() => {
    if (!appReady) return;
    const timer = setTimeout(() => {
      setCallState('in-call');
    }, 1800);
    return () => clearTimeout(timer);
  }, [appReady]);

  // Call simulation loop
  useEffect(() => {
    if (reduceMotion) {
      setCallTime(TOTAL_CALL_SECS);
      return;
    }
    if (callState !== 'in-call') return;

    const realIntervalMs = 100;
    const callSecsPerTick = (realIntervalMs / 1000) * SPEED;

    const interval = setInterval(() => {
      setCallTime((prev) => {
        const next = prev + callSecsPerTick;
        if (next >= TOTAL_CALL_SECS + PAUSE_AFTER_SECS * SPEED) {
          return 1;
        }
        return next;
      });
    }, realIntervalMs);

    return () => clearInterval(interval);
  }, [callState, reduceMotion]);

  // Auto-scroll transcript list
  useEffect(() => {
    if (transcriptListRef.current) {
      transcriptListRef.current.scrollTo({
        top: transcriptListRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [callTime, reduceMotion]);

  const handleAcceptCall = useCallback(() => {
    setCallState('in-call');
    setCallTime(1);
  }, []);

  const handleDeclineOrHangUp = useCallback(() => {
    setCallState('incoming');
    setCallTime(0);
  }, []);

  const visibleLines = reduceMotion
    ? SCRIPT
    : SCRIPT.filter((line) => line.timeSec <= callTime);

  const isAnswered = callState === 'in-call' || reduceMotion;
  const isQualified = (callState === 'in-call' && callTime >= 41) || reduceMotion;
  const isBooked = (callState === 'in-call' && callTime >= 66) || reduceMotion;
  const showResultRow = (callState === 'in-call' && callTime >= 70) || reduceMotion;

  return (
    <div
      ref={stageRef}
      className="w-full h-full relative flex items-start justify-center xl:justify-end overflow-visible"
    >
      {/* Phone Sized Outer Wrapper with Fade Mask */}
      <div
        className="relative phone-fade-mask shrink-0"
        style={
          {
            width: `${NATURAL_WIDTH * scale + 48}px`,
            height: `${NATURAL_HEIGHT * scale}px`,
            paddingLeft: '24px',
            paddingRight: '24px',
            '--phone-fade': '10%',
          } as React.CSSProperties
        }
      >
        {/* Natural Size Phone Scaled from Top Left (starts cleanly at left padding 24px) */}
        <div
          style={{
            width: `${NATURAL_WIDTH}px`,
            height: `${NATURAL_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="relative pointer-events-auto"
        >
          {/* Frosted iPhone Outer Frame */}
          <div
            className="w-full h-full rounded-[48px] p-[8px] relative select-none"
            style={{
              background: 'linear-gradient(145deg, #F4F5F8 0%, #C9CDD6 50%, #F1F2F6 100%)',
              boxShadow:
                '0 0 0 1px rgba(255, 255, 255, 0.9), 0 35px 80px -25px rgba(4, 30, 100, 0.45)',
            }}
          >
            {/* Inner Phone Screen */}
            <div className="w-full h-full rounded-[40px] overflow-hidden relative flex flex-col justify-between p-3.5 bg-gradient-to-b from-[#E9EEFC] to-[#DCE4F7]">
              {/* Top Bar: Dynamic Island + Status Bar */}
              <div className="w-full flex flex-col items-center shrink-0">
                {/* Dynamic Island */}
                <div className="w-[84px] h-[24px] bg-[#0B0F19] rounded-full mx-auto flex items-center justify-end pr-2.5 shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A1F2C]" />
                </div>

                {/* Status Bar */}
                <div className="w-full flex items-center justify-between text-[#0B0F19] text-[11px] font-semibold px-2.5 -mt-3.5">
                  <span>9:58</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">5G</span>
                    <div className="w-4 h-2 rounded-[2px] border border-current p-[1px] flex items-center">
                      <div className="w-2.5 h-full bg-current rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Caller Name & Timer */}
                <div className="mt-3 text-center">
                  <h3 className="text-[19px] font-medium text-[#0B0F19] leading-tight tracking-tight">
                    AI Sales Receptionist
                  </h3>
                  <p className="text-[13px] text-[#64748B] font-normal tabular-nums mt-0.5">
                    {callState === 'in-call' ? formatTimer(callTime) : 'mobile'}
                  </p>
                </div>
              </div>

              {/* 3 Step Tiles Row (Mounted inside screen) */}
              <div className="w-full flex items-center justify-between gap-1.5 px-0.5 mt-2 shrink-0 z-10">
                {[
                  { time: '0:02', label: 'Answered', active: isAnswered },
                  { time: '0:41', label: 'Qualified', active: isQualified },
                  { time: '1:06', label: 'Booked', active: isBooked },
                ].map((tile) => (
                  <div
                    key={tile.label}
                    className={`flex-1 h-[38px] rounded-[12px] flex flex-col justify-center items-center text-center relative transition-all duration-300 ${
                      tile.active ? 'border-[rgba(59,130,246,0.65)]' : 'border-[rgba(255,255,255,0.85)]'
                    }`}
                    style={{
                      background: tile.active
                        ? 'rgba(255, 255, 255, 0.72)'
                        : 'rgba(255, 255, 255, 0.50)',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      boxShadow: tile.active
                        ? '0 4px 12px rgba(59,130,246,0.18), inset 0 1px 0 rgba(255,255,255,0.95)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.95)',
                    }}
                  >
                    {tile.active && (
                      <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#3b82f6] flex items-center justify-center text-white">
                        <Check className="w-2 h-2 stroke-[2.8]" />
                      </div>
                    )}
                    <span className="text-[12.5px] font-semibold text-[#0B0F19] tabular-nums leading-none">
                      {tile.time}
                    </span>
                    <span className="text-[10px] text-[#64748B] mt-0.5 leading-none">
                      {tile.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative 3x2 Grid of Call Buttons */}
              <div className="grid grid-cols-3 gap-2.5 px-2 my-auto opacity-70">
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
                    <div key={btn.label} className="flex flex-col items-center gap-1">
                      <div
                        className="w-[46px] h-[46px] rounded-full flex items-center justify-center text-[#1F2937] shadow-xs"
                        style={{
                          background: 'rgba(255, 255, 255, 0.60)',
                          border: '1px solid rgba(255, 255, 255, 0.85)',
                        }}
                      >
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[10px] text-[#475569] font-normal">{btn.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Glass Live Transcript Panel */}
              <div
                className="absolute left-[12px] right-[12px] top-[146px] bottom-[86px] rounded-[20px] p-2.5 flex flex-col z-20 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.58)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(16px) saturate(170%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(170%)',
                  boxShadow: 'inset 0 1px 0 #ffffff, 0 16px 40px -18px rgba(40, 60, 160, 0.35)',
                }}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[rgba(11,21,48,0.06)] pb-1.5 mb-1.5 px-1 shrink-0">
                  <div>
                    <span className="text-[11px] font-semibold text-[#0b1530] block leading-none">
                      Live transcript
                    </span>
                    <span className="text-[9.5px] text-[#64748B] block mt-0.5 leading-none">
                      {callState === 'incoming'
                        ? 'Sample call · tap Accept to listen'
                        : 'Live audio stream'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        callState === 'in-call' ? 'bg-[#3b82f6] animate-pulse' : 'bg-slate-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Body: Messages List */}
                {callState === 'incoming' ? (
                  <div className="flex-1 flex items-center justify-center p-3 text-center">
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      Answer the call to hear the audio and follow along here.
                    </p>
                  </div>
                ) : (
                  <div
                    ref={transcriptListRef}
                    className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-1.5 pr-0.5 relative"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent 0, #000 22px)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 22px)',
                    }}
                  >
                    {visibleLines.map((line, idx) => {
                      const isAppsian = line.speaker === 'Appsian';
                      return (
                        <motion.div
                          key={idx}
                          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className={`flex flex-col max-w-[88%] text-left ${
                            isAppsian ? 'self-start items-start' : 'self-end items-end'
                          }`}
                        >
                          <div
                            className={`px-2.5 py-1.5 rounded-[14px] text-[12px] leading-[1.38] ${
                              isAppsian
                                ? 'bg-white text-[#0b1530] shadow-xs'
                                : 'bg-[#e6eeff] text-[#0b1530]'
                            }`}
                          >
                            {isAppsian && (
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3b82f6] mr-1.5 align-middle" />
                            )}
                            <span>{line.text}</span>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Job Details Card (appears when booked) */}
                    <AnimatePresence>
                      {showResultRow && (
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="w-full mt-1 p-2 rounded-[14px] bg-white/95 border border-[rgba(59,130,246,0.45)] shadow-xs flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-[#3b82f6] flex items-center justify-center text-white">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-[11.5px] font-semibold text-[#0B0F19]">
                              Job booked
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-[#64748B]">
                            <Calendar className="w-3 h-3 stroke-[2]" />
                            <span>Tomorrow, 10:00 AM</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Interactive Buttons Row */}
              <div className="w-full flex justify-center items-center pb-2 z-20 shrink-0">
                {callState === 'incoming' ? (
                  <div className="flex items-center justify-around w-full px-6">
                    <button
                      type="button"
                      onClick={handleDeclineOrHangUp}
                      className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform"
                      aria-label="Decline Call"
                    >
                      <div className="w-[50px] h-[50px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-md group-hover:brightness-105">
                        <PhoneOff className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium">Decline</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAcceptCall}
                      className="flex flex-col items-center gap-1 cursor-pointer group active:scale-95 transition-transform"
                      aria-label="Accept Call"
                    >
                      <div className="w-[50px] h-[50px] rounded-full bg-[#22C55E] flex items-center justify-center text-white shadow-md group-hover:brightness-105 animate-pulse">
                        <Phone className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium">Accept</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDeclineOrHangUp}
                    className="w-[54px] h-[54px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-md cursor-pointer active:scale-95 hover:brightness-105 transition-all"
                    aria-label="Hang up call"
                  >
                    <PhoneOff className="w-6 h-6 stroke-[2.2]" />
                  </button>
                )}
              </div>

              {/* Diagonal Glass Sheen */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none opacity-30"
                style={{
                  background:
                    'linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.6) 50%, transparent 62%)',
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Progressive Blur Layer Scoped Directly to Phone Screen Bottom */}
        <div className="progressive-blur-phone" aria-hidden="true">
          <i /><i /><i /><i /><i />
        </div>
      </div>
    </div>
  );
};
