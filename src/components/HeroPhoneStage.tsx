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
  Clock,
  MessageSquare,
} from 'lucide-react';
import { DEMO_AUDIO_SRC, DEMO_AUDIO_VERSION } from '../config/demoCall';

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

const NATURAL_WIDTH = 300;
const NATURAL_HEIGHT = 610;
const VISIBLE_FRACTION = 0.92;

const formatTimer = (totalSec: number) => {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const HeroPhoneStage: React.FC<HeroPhoneStageProps> = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const transcriptListRef = useRef<HTMLDivElement>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);
  const hangUpBtnRef = useRef<HTMLButtonElement | null>(null);
  const fallbackStartRef = useRef<number | null>(null);
  const callTimeRef = useRef<number>(0);
  const callStateRef = useRef<'ringing' | 'answered' | 'ended'>('ringing');
  const acceptTimestampRef = useRef<number>(0);
  const isFirstIntersectionRef = useRef<boolean>(true);

  const [scale, setScale] = useState(1);
  const [callState, setCallState] = useState<'ringing' | 'answered' | 'ended'>('ringing');
  const [callTime, setCallTime] = useState(0);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const [isDeclined, setIsDeclined] = useState(false);
  const [acceptPulse, setAcceptPulse] = useState(false);
  const [notAllowedHint, setNotAllowedHint] = useState(false);
  const [audioPlayFailed, setAudioPlayFailed] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'checking' | 'ok' | 'missing' | 'wrong-type'>('checking');
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

  // Stable End call handler - reads refs so dependency array is empty and never triggers re-creation
  const handleEndCall = useCallback((reason: string = 'hang-up') => {
    console.log(`[demo-call] Reset: ${reason}`);
    const audio = audioInstanceRef.current;
    if (audio) {
      audio.pause();
    }
    const currentDuration = callTimeRef.current;
    setFinalDuration(currentDuration);
    setCallState('ended');
    callStateRef.current = 'ended';

    const resetTimer = setTimeout(() => {
      if (audio) {
        audio.currentTime = 0;
      }
      setCallTime(0);
      callTimeRef.current = 0;
      setAudioPlayFailed(false);
      fallbackStartRef.current = null;
      setCallState('ringing');
      callStateRef.current = 'ringing';
      acceptBtnRef.current?.focus();
    }, 1200);

    return () => clearTimeout(resetTimer);
  }, []);

  // Lazy singleton audio getter: attaches all listeners once, never nulled on re-render
  const getAudio = useCallback(() => {
    if (!audioInstanceRef.current) {
      const audioUrl = `${DEMO_AUDIO_SRC}?${DEMO_AUDIO_VERSION}`;
      console.log('[demo-call] Initializing Audio singleton with URL:', audioUrl);
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.volume = 1;
      audio.muted = false;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');

      audio.addEventListener('loadedmetadata', () => {
        console.log('[demo-call] Event: loadedmetadata (duration:', audio.duration, ')');
      });
      audio.addEventListener('canplay', () => {
        console.log('[demo-call] Event: canplay');
      });
      audio.addEventListener('playing', () => {
        console.log('[demo-call] Event: playing');
      });
      audio.addEventListener('pause', () => {
        console.log('[demo-call] Event: pause');
      });
      audio.addEventListener('ended', () => {
        console.log('[demo-call] Event: ended');
        handleEndCall('ended');
      });
      audio.addEventListener('error', () => {
        const err = audio.error;
        console.error(
          '[demo-call] Event: error',
          err ? `Code ${err.code}: ${err.message}` : 'unknown error'
        );
        setAudioPlayFailed(true);
      });

      try {
        audio.load();
      } catch (e) {
        console.warn('[demo-call] audio.load() threw:', e);
      }

      audioInstanceRef.current = audio;
    }
    return audioInstanceRef.current;
  }, [handleEndCall]);

  // Check audio file on mount with HEAD request
  useEffect(() => {
    const url = `${DEMO_AUDIO_SRC}?${DEMO_AUDIO_VERSION}`;
    console.log('[demo-call] Resolved audio URL:', url);

    const checkAudio = async () => {
      try {
        let res = await fetch(url, { method: 'HEAD' });
        if (!res.ok && res.status === 405) {
          res = await fetch(url, {
            method: 'GET',
            headers: { Range: 'bytes=0-0' },
          });
        }
        const contentType = res.headers.get('content-type') || '';
        console.log(`[demo-call] HEAD check status: ${res.status}, content-type: "${contentType}"`);

        if (!res.ok) {
          setAudioStatus('missing');
          return;
        }

        const isAudioType =
          contentType.startsWith('audio/') ||
          contentType.includes('application/octet-stream') ||
          contentType.includes('video/mp4');

        if (contentType.includes('text/html')) {
          setAudioStatus('wrong-type');
        } else if (isAudioType) {
          setAudioStatus('ok');
        } else {
          setAudioStatus('ok');
        }
      } catch (err) {
        console.warn('[demo-call] Audio HEAD check failed:', err);
        setAudioStatus('ok');
      }
    };

    checkAudio();
    getAudio();

    return () => {
      if (audioInstanceRef.current) {
        console.log('[demo-call] Component unmount: pausing audio');
        audioInstanceRef.current.pause();
      }
    };
  }, [getAudio]);

  // Synchronous Accept handler: audio.play() called first directly in user gesture
  const handleAcceptCall = () => {
    console.log('[demo-call] Accept clicked');
    setNotAllowedHint(false);
    setAudioPlayFailed(false);

    // Call audio.play() synchronously in the user tap call stack
    const audio = getAudio();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 1;
    const playPromise = audio.play();

    acceptTimestampRef.current = performance.now();
    setCallState('answered');
    callStateRef.current = 'answered';

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('[demo-call] play() resolved successfully');
        })
        .catch((err: Error) => {
          console.error('[demo-call] play() rejected:', err.name, err.message);
          if (err.name === 'NotAllowedError') {
            console.log('[demo-call] Autoplay policy prevented playback. Prompting user to tap again.');
            setCallState('ringing');
            callStateRef.current = 'ringing';
            setNotAllowedHint(true);
          } else {
            console.warn('[demo-call] Play failure, running silent fallback timeline:', err);
            setAudioPlayFailed(true);
            fallbackStartRef.current = performance.now();
          }
        });
    }

    setTimeout(() => {
      hangUpBtnRef.current?.focus();
    }, 320);
  };

  // Decline handler: shows "Call declined" for 1.2s then returns to ringing
  const handleDecline = () => {
    console.log('[demo-call] Reset: decline');
    setIsDeclined(true);
    setTimeout(() => {
      setIsDeclined(false);
    }, 1200);
  };

  // Remind Me & Message handler: micro press animation and pulses Accept button once
  const handleRemindOrMessage = () => {
    setAcceptPulse(true);
    setTimeout(() => {
      setAcceptPulse(false);
    }, 600);
  };

  // Seek handler when tapping a step tile
  const handleSeek = (timeSec: number) => {
    if (callStateRef.current !== 'answered') return;
    const audio = audioInstanceRef.current;
    if (audio && !audioPlayFailed) {
      audio.currentTime = timeSec;
    } else if (fallbackStartRef.current) {
      fallbackStartRef.current = performance.now() - timeSec * 1000;
    }
    callTimeRef.current = timeSec;
    setCallTime(timeSec);
  };

  // RAF clock loop driven strictly by audio.currentTime while answered
  useEffect(() => {
    if (callState !== 'answered') return;

    let rafId: number;
    const tick = () => {
      let t = 0;
      const audio = audioInstanceRef.current;
      if (audio && !audio.paused && !isNaN(audio.currentTime)) {
        t = audio.currentTime;
      } else if (fallbackStartRef.current) {
        t = (performance.now() - fallbackStartRef.current) / 1000;
      }
      callTimeRef.current = t;
      setCallTime(t);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [callState, audioPlayFailed]);

  // Auto-scroll transcript list to bottom as lines arrive
  useEffect(() => {
    if (callState === 'answered' && transcriptListRef.current) {
      transcriptListRef.current.scrollTo({
        top: transcriptListRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [callTime, callState, reduceMotion]);

  // Reset to ringing when hero leaves viewport (IntersectionObserver threshold 0.15)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const heroSection = stage.closest('section') || stage.parentElement || stage;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Ignore the very first callback
        if (isFirstIntersectionRef.current) {
          isFirstIntersectionRef.current = false;
          return;
        }

        const timeSinceAccept = performance.now() - acceptTimestampRef.current;
        if (
          !entry.isIntersecting &&
          callStateRef.current === 'answered' &&
          timeSinceAccept > 1500
        ) {
          handleEndCall('hero left view');
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(heroSection);
    return () => observer.disconnect();
  }, [handleEndCall]);

  // Reset to ringing when tab becomes hidden
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && callStateRef.current === 'answered') {
        handleEndCall('tab hidden');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [handleEndCall]);

  const visibleLines = reduceMotion
    ? SCRIPT
    : SCRIPT.filter((line) => line.timeSec <= callTime);

  const isAnswered = (callState === 'answered' && callTime >= 2) || reduceMotion;
  const isQualified = (callState === 'answered' && callTime >= 41) || reduceMotion;
  const isBooked = (callState === 'answered' && callTime >= 52) || reduceMotion;
  const showResultRow = (callState === 'answered' && callTime >= 52) || reduceMotion;

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

                {/* Caller Name & Subtitle / Timer */}
                <div className="mt-3 text-center">
                  <h3 className="text-[19px] font-medium text-[#0B0F19] leading-tight tracking-tight">
                    AI Sales Receptionist
                  </h3>
                  <p className="text-[13px] text-[#64748B] font-normal tabular-nums mt-0.5" aria-hidden="true">
                    {callState === 'answered' ? (
                      formatTimer(callTime)
                    ) : callState === 'ended' ? (
                      `Call ended ${formatTimer(finalDuration || callTime || 54)}`
                    ) : isDeclined ? (
                      <span className="text-[#EF4444] font-medium">Call declined</span>
                    ) : (
                      'mobile'
                    )}
                  </p>
                  {notAllowedHint && callState === 'ringing' && (
                    <span className="text-[11px] text-[#2563eb] font-medium block mt-0.5 leading-tight">
                      Tap Accept again to enable sound
                    </span>
                  )}
                  {audioPlayFailed && callState === 'answered' && (
                    <span className="text-[11px] text-[#EF4444] block mt-0.5 leading-none">
                      {audioStatus === 'missing' || audioStatus === 'wrong-type'
                        ? 'Audio file not found'
                        : 'Audio unavailable'}
                    </span>
                  )}
                </div>
              </div>

              {/* IN-CALL ELEMENTS: Step Tiles, Decorative Grid, Live Transcript & Hang-up */}
              {callState === 'answered' && (
                <>
                  {/* 3 Step Tiles Row */}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.06 }}
                    className="w-full flex items-center justify-between gap-1.5 px-0.5 mt-2 shrink-0 z-10"
                  >
                    {[
                      { time: '0:02', timeSec: 2, label: 'Answered', active: isAnswered },
                      { time: '0:41', timeSec: 41, label: 'Qualified', active: isQualified },
                      { time: '1:06', timeSec: 52, label: 'Booked', active: isBooked },
                    ].map((tile) => (
                      <button
                        key={tile.label}
                        type="button"
                        onClick={() => handleSeek(tile.timeSec)}
                        className={`flex-1 h-[38px] rounded-[12px] flex flex-col justify-center items-center text-center relative transition-all duration-300 cursor-pointer ${
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
                        title={`Jump to ${tile.label} (${tile.time})`}
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
                      </button>
                    ))}
                  </motion.div>

                  {/* Decorative 3x2 Grid of Call Buttons (in background behind transcript) */}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ duration: 0.3, delay: 0.12 }}
                    className="grid grid-cols-3 gap-2.5 px-2 my-auto"
                  >
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
                  </motion.div>

                  {/* Glass Live Transcript Panel */}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
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
                          Live audio stream
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                      </div>
                    </div>

                    {/* Messages List */}
                    <div
                      ref={transcriptListRef}
                      aria-live="polite"
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
                  </motion.div>

                  {/* Red Hang-up Button */}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.25 }}
                    className="w-full flex justify-center items-center pb-2 z-30 shrink-0"
                  >
                    <button
                      ref={hangUpBtnRef}
                      type="button"
                      onClick={() => handleEndCall('hang-up')}
                      className="w-[54px] h-[54px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-md cursor-pointer active:scale-95 hover:brightness-105 transition-all focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Hang up call"
                    >
                      <PhoneOff className="w-6 h-6 stroke-[2.2]" />
                    </button>
                  </motion.div>
                </>
              )}

              {/* RINGING / ENDED SCREEN: Idle transcript card, Remind Me/Message, Decline/Accept */}
              {callState !== 'answered' && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-between py-1 z-10"
                >
                  {/* Compact Idle Transcript Glass Card */}
                  <div
                    className="w-full rounded-[20px] p-3 flex flex-col shrink-0 mt-2 relative z-10"
                    style={{
                      background: 'rgba(255, 255, 255, 0.58)',
                      border: '1px solid rgba(255, 255, 255, 0.85)',
                      backdropFilter: 'blur(16px) saturate(170%)',
                      WebkitBackdropFilter: 'blur(16px) saturate(170%)',
                      boxShadow: 'inset 0 1px 0 #ffffff, 0 16px 40px -18px rgba(40, 60, 160, 0.35)',
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-[rgba(11,21,48,0.06)] pb-1.5 mb-1 px-0.5">
                      <div>
                        <span className="text-[11px] font-semibold text-[#0b1530] block leading-none">
                          Live transcript
                        </span>
                        <span className="text-[9.5px] text-[#64748B] block mt-1 leading-none">
                          Sample call · tap Accept to listen
                        </span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                    <div className="py-2.5 px-1 text-center">
                      <p className="text-[11px] text-[#64748B] leading-relaxed">
                        Answer the call to hear the audio and follow along here.
                      </p>
                    </div>
                  </div>

                  {/* Remind Me and Message Row (Decorative with micro-interaction) */}
                  <div className="w-full flex items-center justify-around px-8 my-auto shrink-0 z-10">
                    <button
                      type="button"
                      onClick={handleRemindOrMessage}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-92 transition-transform select-none"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Remind Me"
                    >
                      <div
                        className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[#1F2937] shadow-xs group-hover:bg-white/80 transition-colors"
                        style={{
                          background: 'rgba(255, 255, 255, 0.60)',
                          border: '1px solid rgba(255, 255, 255, 0.85)',
                        }}
                      >
                        <Clock className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Remind Me
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemindOrMessage}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-92 transition-transform select-none"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Message"
                    >
                      <div
                        className="w-[48px] h-[48px] rounded-full flex items-center justify-center text-[#1F2937] shadow-xs group-hover:bg-white/80 transition-colors"
                        style={{
                          background: 'rgba(255, 255, 255, 0.60)',
                          border: '1px solid rgba(255, 255, 255, 0.85)',
                        }}
                      >
                        <MessageSquare className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Message
                      </span>
                    </button>
                  </div>

                  {/* Decline and Accept Buttons Row */}
                  <div className="w-full flex items-center justify-between px-7 pb-2 shrink-0 z-20">
                    {/* Decline button */}
                    <button
                      type="button"
                      onClick={handleDecline}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2 rounded-full"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Decline call"
                    >
                      <div
                        className="w-[64px] h-[64px] rounded-full flex items-center justify-center text-white shadow-md group-hover:brightness-105 transition-all"
                        style={{
                          background: 'linear-gradient(135deg, #ff5a52 0%, #ff3b30 100%)',
                          boxShadow: '0 10px 22px -8px rgba(255, 59, 48, 0.65)',
                        }}
                      >
                        <PhoneOff className="w-7 h-7 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Decline
                      </span>
                    </button>

                    {/* Accept button with expanding green pulse rings */}
                    <button
                      ref={acceptBtnRef}
                      type="button"
                      onClick={handleAcceptCall}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-2 rounded-full relative"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Accept call"
                    >
                      <motion.div
                        animate={acceptPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                        transition={{ duration: 0.45 }}
                        className="relative w-[64px] h-[64px]"
                      >
                        {/* 2 expanding green pulse rings */}
                        {!reduceMotion && (
                          <>
                            <span
                              className="ring-pulse-ring-1 absolute inset-0 rounded-full pointer-events-none"
                              style={{ border: '2px solid rgba(70, 211, 110, 0.8)' }}
                            />
                            <span
                              className="ring-pulse-ring-2 absolute inset-0 rounded-full pointer-events-none"
                              style={{ border: '2px solid rgba(70, 211, 110, 0.8)' }}
                            />
                          </>
                        )}

                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-white shadow-md group-hover:brightness-105 transition-all relative z-10"
                          style={{
                            background: 'linear-gradient(135deg, #46d36e 0%, #28b84f 100%)',
                            boxShadow: '0 10px 22px -8px rgba(40, 184, 79, 0.65)',
                          }}
                        >
                          <Phone className="w-7 h-7 stroke-[2.2]" />
                        </div>
                      </motion.div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Accept
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

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
