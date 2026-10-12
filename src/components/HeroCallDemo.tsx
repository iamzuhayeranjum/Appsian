import React, { useState, useEffect, useRef, useCallback } from 'react';

// Exact transcript text and timings from the reference prototype
export const TX: [number, number, 'A' | 'C', string][] = [
  [0.74, 4.38, 'A', "Hello. My name is Allison. I'm a representative of New York Plumbing. How can I assist you today?"],
  [4.7, 11.5, 'C', "Hey, Allison. I have a leaky pipe in my bathroom right now, and I need someone to come out and help me right now."],
  [11.92, 17.84, 'A', "So you have a leaky pipe in your bathroom. Can you tell me more about the issue? Is it a faucet, toilet, or somewhere else in the bathroom that's leaking?"],
  [18.5, 19.96, 'C', "Yeah, it's under the sink."],
  [20.48, 22.94, 'A', "I'd be happy to help you with that. Can you please tell me your full name?"],
  [23.86, 24.96, 'C', "Yeah. It is Zach Phillips."],
  [25.54, 26.72, 'A', "Can you please tell me your service address?"],
  [27.04, 31.08, 'C', "Yeah. It's 55 Seashell Lane, North Myrtle Beach, South Carolina."],
  [31.44, 35.22, 'A', "All right. Let me check what times we have available to get someone out there to help with leaky pipe under the sink."],
  [36.7, 40.98, 'A', "Okay. We have someone available tomorrow at 10:00 a.m., Wednesday at 2:00 p.m., or Thursday at 9:00 a.m."],
  [41.0, 42.3, 'C', "Yeah, tomorrow-"],
  [42.6, 43.9, 'A', "Are any of these times okay for you?"],
  [44.12, 45.08, 'C', "... at 10:00 a.m. sounds good."],
  [45.51, 52.7, 'A', "All right. Here are your appointment details. Your requested appointment time is tomorrow at 10:00 a.m. at 55 Seashell Lane, North Myrtle Beach, South Carolina, for a leaky pipe under the sink. Is that all correct?"],
  [53.1, 53.54, 'C', "Yes, ma'am."],
];

const p2 = (n: number) => String(n).padStart(2, '0');
const formatClock = (n: number) => Math.floor(n / 60) + ':' + p2(Math.floor(n % 60));
const formatTimer = (n: number) => p2(Math.floor(n / 60)) + ':' + p2(Math.floor(n % 60));

export const HeroCallDemo: React.FC = () => {
  const [callState, setCallState] = useState<'incoming' | 'call' | 'ended' | 'declined'>('incoming');
  const [timerText, setTimerText] = useState('mobile');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(53.9);
  const [activeLineIdx, setActiveLineIdx] = useState(-1);
  const [lineWordCounts, setLineWordCounts] = useState<number[]>(() => TX.map(() => 0));

  // Toggles for in-call buttons
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // References
  const rootRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const bdRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const backTimerRef = useRef<NodeJS.Timeout | null>(null);
  const declineTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Prefers reduced motion
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pre-split line words
  const parsedLines = useRef(
    TX.map((line) => ({
      start: line[0],
      end: line[1],
      speaker: line[2],
      text: line[3],
      words: line[3].split(' '),
    }))
  ).current;

  // Reset to initial waiting state
  const resetState = useCallback(() => {
    setActiveLineIdx(-1);
    setLineWordCounts(TX.map(() => 0));
    setCurrentTime(0);
    setIsMuted(false);
    setIsAudioOn(true);
  }, []);

  // Finish call with message
  const finishCall = useCallback(
    (msg: string) => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setCallState('ended');
      setTimerText(msg);

      if (backTimerRef.current) clearTimeout(backTimerRef.current);
      backTimerRef.current = setTimeout(() => {
        setCallState('incoming');
        setTimerText('mobile');
        resetState();
      }, 1600);
    },
    [resetState]
  );

  // Paint / Animation update loop
  const paint = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;

    const c = a.currentTime;
    const d = a.duration || 53.9;
    setCurrentTime(c);
    setDuration(d);
    setTimerText(formatTimer(c));

    // Find current line
    let n = -1;
    for (let i = 0; i < TX.length; i++) {
      if (c >= TX[i][0]) {
        n = i;
      }
    }

    setActiveLineIdx(n);

    // Compute visible word counts
    if (n >= 0) {
      const l = TX[n];
      const wordsCount = parsedLines[n].words.length;
      const progress = Math.max(0, Math.min(1, (c - l[0]) / (l[1] - l[0])));
      const k = Math.ceil(wordsCount * progress);

      setLineWordCounts((prev) => {
        const next = [...prev];
        // All lines before n have all words visible
        for (let j = 0; j < n; j++) {
          next[j] = parsedLines[j].words.length;
        }
        next[n] = k;
        // Lines after n have 0
        for (let j = n + 1; j < TX.length; j++) {
          next[j] = 0;
        }
        return next;
      });

      // Auto scroll transcript body
      if (bdRef.current) {
        bdRef.current.scrollTo({
          top: bdRef.current.scrollHeight,
          behavior: isReducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  }, [parsedLines, isReducedMotion]);

  // Main RAF loop
  const loop = useCallback(() => {
    paint();
    const a = audioRef.current;
    if (a && !a.paused && !a.ended) {
      rafRef.current = requestAnimationFrame(loop);
    }
  }, [paint]);

  // Handle Accept
  const handleAccept = () => {
    if (backTimerRef.current) clearTimeout(backTimerRef.current);
    if (declineTimerRef.current) clearTimeout(declineTimerRef.current);
    resetState();
    setCallState('call');

    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Fallback for autoplay policy rejection: still let timer/animation run
      });
    }

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  };

  // Handle Decline
  const handleDecline = () => {
    setCallState('declined');
    setTimerText('declined');
    if (declineTimerRef.current) clearTimeout(declineTimerRef.current);
    declineTimerRef.current = setTimeout(() => {
      setCallState('incoming');
      setTimerText('mobile');
    }, 1200);
  };

  // Handle End Call
  const handleEndCall = () => {
    paint();
    finishCall('call ended');
  };

  // Sync audio play/ended events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    const onEnded = () => {
      paint();
      finishCall('call ended');
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('ended', onEnded);
    };
  }, [loop, paint, finishCall]);

  // Pause & reset when hero leaves viewport (IntersectionObserver threshold 0.2)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // When scrolled out of view, pause audio and reset to incoming
            const audio = audioRef.current;
            if (audio && !audio.paused) {
              audio.pause();
            }
            if (rafRef.current) {
              cancelAnimationFrame(rafRef.current);
              rafRef.current = null;
            }
            setCallState('incoming');
            setTimerText('mobile');
            resetState();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [resetState]);

  // Pause when browser tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const audio = audioRef.current;
        if (audio && !audio.paused) {
          audio.pause();
        }
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (backTimerRef.current) clearTimeout(backTimerRef.current);
      if (declineTimerRef.current) clearTimeout(declineTimerRef.current);
    };
  }, []);

  const progressBarPercent = Math.min(100, Math.max(0, (currentTime / (duration || 53.9)) * 100));

  const isCallLive = callState === 'call';
  const hasStartedTranscript = activeLineIdx >= 0 || callState === 'call' || callState === 'ended';

  let statusSubtitle = 'Sample call · tap Accept to listen';
  if (callState === 'call') {
    statusSubtitle = 'Live · call in progress';
  } else if (callState === 'ended') {
    statusSubtitle = 'Call ended';
  }

  return (
    <div
      ref={rootRef}
      className="hcd-root relative w-full flex flex-col min-[900px]:flex-row items-center justify-center gap-6 min-[900px]:gap-10 py-4 select-none"
    >
      {/* Scoped CSS block strictly isolated to .hcd-root */}
      <style>{`
        .hcd-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .hcd-phone {
          --u: calc(244.5px / 852);
          width: 244.5px;
          height: 530px;
          aspect-ratio: 852 / 1847;
          position: relative;
          overflow: hidden;
          color: #fff;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          border-radius: 13% / 6%;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 20px 45px -10px rgba(0, 0, 0, 0.5);
          flex: none;
          background:
            radial-gradient(ellipse 75% 7% at 8% 56.5%, rgba(32, 92, 140, 0.55), transparent),
            radial-gradient(ellipse 90% 9% at 50% 70%, rgba(86, 88, 90, 0.5), transparent),
            radial-gradient(ellipse 70% 8% at 62% 91.5%, rgba(130, 86, 44, 0.85), transparent),
            radial-gradient(ellipse 45% 6% at 12% 96%, rgba(70, 86, 40, 0.45), transparent),
            linear-gradient(180deg, #101010 0%, #121212 42%, #17222c 56%, #252a2e 68%, #32312f 82%, #43382d 100%);
        }
        @media (max-width: 600px) {
          .hcd-phone {
            width: 220px;
            height: 477px;
            --u: calc(220px / 852);
          }
        }
        .hcd-a {
          position: absolute;
          left: calc(var(--x) * var(--u));
          top: calc(var(--y) * var(--u));
          width: calc(var(--w) * var(--u));
          height: calc(var(--h) * var(--u));
        }
        .hcd-island {
          background: #000;
          border-radius: 999px;
        }
        .hcd-island i {
          position: absolute;
          left: calc(174 * var(--u));
          top: calc(33 * var(--u));
          width: calc(13 * var(--u));
          height: calc(13 * var(--u));
          border-radius: 50%;
          background: #ff9500;
        }
        .hcd-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 calc(72 * var(--u)) 0 calc(95 * var(--u));
        }
        .hcd-sl, .hcd-sr {
          display: flex;
          align-items: center;
        }
        .hcd-sl {
          gap: calc(12 * var(--u));
        }
        .hcd-sr {
          gap: calc(16 * var(--u));
        }
        .hcd-time {
          font-size: calc(40 * var(--u));
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #fff;
        }
        .hcd-bat {
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(53 * var(--u));
          height: calc(29 * var(--u));
          border-radius: calc(9 * var(--u));
          background: #cfcfd1;
          position: relative;
          margin-right: calc(5 * var(--u));
        }
        .hcd-bat::after {
          content: "";
          position: absolute;
          right: calc(-5 * var(--u));
          top: calc(9.5 * var(--u));
          width: calc(3 * var(--u));
          height: calc(10 * var(--u));
          border-radius: 0 calc(2 * var(--u)) calc(2 * var(--u)) 0;
          background: rgba(255, 255, 255, 0.4);
        }
        .hcd-bat b {
          font-size: calc(26 * var(--u));
          font-weight: 700;
          color: #1c1c1e;
          letter-spacing: -0.02em;
        }
        .hcd-name, .hcd-timer {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .hcd-name {
          font-size: calc(66 * var(--u));
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #fff;
        }
        .hcd-timer {
          font-size: calc(46 * var(--u));
          font-weight: 400;
          color: rgba(255, 255, 255, 0.55);
          font-variant-numeric: tabular-nums;
        }
        .hcd-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(10 * var(--u));
          background: none;
          border: 0;
          padding: 0;
          color: inherit;
          font: inherit;
          cursor: pointer;
        }
        .hcd-c {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.14);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
          color: #fff;
          transition: background 0.2s, color 0.2s;
        }
        .hcd-c svg {
          width: calc(var(--sw, 72) * var(--u));
          height: calc(var(--sh, 72) * var(--u));
          overflow: visible;
        }
        .hcd-btn.on .hcd-c {
          background: #fff;
          color: #000;
        }
        .hcd-btn:active .hcd-c {
          filter: brightness(1.3);
        }
        .hcd-l {
          font-size: calc(36 * var(--u));
          height: calc(50 * var(--u));
          line-height: calc(50 * var(--u));
          white-space: nowrap;
          color: #fff;
        }
        .hcd-end {
          display: grid;
          place-items: center;
          border: 0;
          padding: 0;
          border-radius: 50%;
          background: #ff453a;
          color: #fff;
          cursor: pointer;
          transition: filter 0.15s;
        }
        .hcd-end:active {
          filter: brightness(0.85);
        }
        .hcd-end svg {
          width: calc(88 * var(--u));
          height: calc(32 * var(--u));
        }
        .hcd-home {
          background: rgba(235, 235, 240, 0.92);
          border-radius: 999px;
        }
        .hcd-phone button:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
        .hcd-layer {
          position: absolute;
          inset: 0;
          transition: opacity 0.25s;
        }
        .hcd-sm {
          --sw: 54;
          --sh: 54;
        }
        .hcd-sm .hcd-l {
          font-size: calc(34 * var(--u));
        }
        .hcd-c.red {
          background: #ff453a;
        }
        .hcd-c.green {
          background: #30d158;
          animation: hcd-ring 1.6s ease-out infinite;
        }
        @keyframes hcd-ring {
          0% { box-shadow: 0 0 0 0 rgba(48, 209, 88, 0.55); }
          100% { box-shadow: 0 0 0 calc(46 * var(--u)) rgba(48, 209, 88, 0); }
        }

        /* Transcript Panel Styles matching white dashboard theme */
        .hcd-panel {
          display: flex;
          flex-direction: column;
          width: min(100%, 400px);
          height: 530px;
          padding: 22px 22px 18px;
          border-radius: 24px;
          background: #FFFFFF;
          color: #1C1C1E;
          border: 1px solid rgba(0, 0, 0, 0.08);
          font-size: 15px;
          line-height: 1.5;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 1px rgba(0, 0, 0, 0.1);
          flex: none;
        }
        @media (max-width: 899px) {
          .hcd-panel {
            width: 100%;
            height: 340px;
          }
        }
        .hcd-panel header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .hcd-panel h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1C1C1E;
          letter-spacing: -0.015em;
        }
        .hcd-panel header p {
          margin: 2px 0 0;
          font-size: 13px;
          color: #6E6E73;
        }
        .hcd-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.12);
          transition: background 0.3s;
        }
        .hcd-panel.live .hcd-dot {
          background: #1F9D45;
          box-shadow: 0 0 0 3px rgba(31, 157, 69, 0.2);
        }
        .hcd-bd {
          position: relative;
          flex: 1;
          min-height: 0;
          overflow-y: auto;
        }
        .hcd-tx {
          list-style: none;
          margin: 0;
          padding: 0 4px 0 0;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .hcd-ln {
          display: none;
          padding-left: 12px;
          border-left: 3px solid transparent;
          color: #6E6E73;
          animation: hcd-in 0.3s ease-out;
        }
        .hcd-ln.show {
          display: block;
        }
        .hcd-ln.on {
          border-color: #1F9D45;
          color: #1C1C1E;
        }
        .hcd-ln b {
          display: block;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 2px;
        }
        .hcd-ln p {
          margin: 0;
          font-size: 14.5px;
          line-height: 1.45;
        }
        @keyframes hcd-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        .hcd-empty {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          margin: 0;
          padding: 0 24px;
          text-align: center;
          color: #6E6E73;
          font-size: 14px;
        }
        .hcd-panel.has .hcd-empty,
        .hcd-panel.live .hcd-empty {
          display: none;
        }
        .hcd-panel footer {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          font-size: 13px;
          color: #6E6E73;
          font-variant-numeric: tabular-nums;
        }
        .hcd-bar {
          flex: 1;
          height: 4px;
          border-radius: 2px;
          background: rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .hcd-bar i {
          display: block;
          height: 100%;
          background: #1F9D45;
          transition: width 0.1s linear;
        }
        .hcd-ln span {
          opacity: 0;
          transition: opacity 0.15s;
        }
        .hcd-ln span.v {
          opacity: 1;
        }
        .hcd-ln.cl {
          margin-left: 18px;
        }
        @media (prefers-reduced-motion: reduce) {
          .hcd-c.green, .hcd-ln { animation: none; }
          .hcd-ln span { transition: none; }
        }
      `}</style>

      {/* Hidden audio element loading on demand without autoplay */}
      <audio ref={audioRef} preload="none" src="/call-demo.mp3" />

      {/* iPhone Screen Frame */}
      <main
        className="hcd-phone"
        data-state={callState}
        aria-label="Phone call screen"
      >
        {/* Dynamic Island */}
        <div className="hcd-island hcd-a" style={{ '--x': 291, '--y': 25, '--w': 270, '--h': 79 } as React.CSSProperties}>
          <i />
        </div>

        {/* Status Bar */}
        <header className="hcd-status hcd-a" style={{ '--x': 0, '--y': 25, '--w': 852, '--h': 79 } as React.CSSProperties}>
          <div className="hcd-sl">
            <span className="hcd-time">9:58</span>
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              aria-hidden="true"
              style={{ width: 'calc(27 * var(--u))', height: 'calc(27 * var(--u))' }}
            >
              <polygon points="25,2 3,11.5 13,14 15.5,25" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="hcd-sr">
            <svg
              viewBox="0 0 44 28"
              aria-hidden="true"
              style={{ width: 'calc(43 * var(--u))', height: 'calc(28 * var(--u))' }}
              fill="#fff"
            >
              <rect x="0" y="18" width="8" height="10" rx="2.5" />
              <rect x="12" y="12" width="8" height="16" rx="2.5" />
              <rect x="24" y="6" width="8" height="22" rx="2.5" />
              <rect x="36" y="0" width="8" height="28" rx="2.5" opacity=".35" />
            </svg>
            <svg
              viewBox="0 0 37 27"
              aria-hidden="true"
              style={{ width: 'calc(37 * var(--u))', height: 'calc(27 * var(--u))' }}
            >
              <defs>
                <clipPath id="hcd-wifi-clip">
                  <polygon points="18.5,25 -6.5,0 43.5,0" />
                </clipPath>
              </defs>
              <g clipPath="url(#hcd-wifi-clip)" fill="none" stroke="#fff" strokeWidth="4.6">
                <circle cx="18.5" cy="25" r="22" />
                <circle cx="18.5" cy="25" r="14" />
                <circle cx="18.5" cy="25" r="6.2" />
              </g>
              <circle cx="18.5" cy="25" r="2.6" fill="#fff" />
            </svg>
            <span className="hcd-bat">
              <b>39</b>
            </span>
          </div>
        </header>

        {/* Contact Name */}
        <h1 className="hcd-name hcd-a" style={{ '--x': 0, '--y': 243, '--w': 852, '--h': 80 } as React.CSSProperties}>
          AI Sales Receptionist
        </h1>

        {/* Timer / Status Tag */}
        <p className="hcd-timer hcd-a" style={{ '--x': 0, '--y': 330, '--w': 852, '--h': 56 } as React.CSSProperties}>
          {timerText}
        </p>

        {/* IN-CALL LAYER */}
        <div
          className={`hcd-layer transition-opacity duration-200 ${
            callState === 'call' || callState === 'ended'
              ? 'opacity-100 pointer-events-auto visible'
              : 'opacity-0 pointer-events-none invisible'
          }`}
        >
          {/* Row 1 */}
          <button
            type="button"
            onClick={() => setIsMuted((prev) => !prev)}
            className={`hcd-btn hcd-a ${isMuted ? 'on' : ''}`}
            style={{ '--x': 88, '--y': 669, '--w': 184 } as React.CSSProperties}
            aria-label="mute"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 48 48" style={{ '--sw': 62, '--sh': 62 } as React.CSSProperties} fill="currentColor">
                <defs>
                  <mask id="hcd-mute-mask">
                    <rect width="48" height="48" fill="#fff" />
                    <line x1="5" y1="3" x2="43" y2="45" stroke="#000" strokeWidth="9" />
                  </mask>
                </defs>
                <g mask="url(#hcd-mute-mask)">
                  <rect x="17" y="3" width="14" height="25" rx="7" />
                  <path d="M10 22v2a14 14 0 0 0 28 0v-2" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
                  <path d="M24 38v6M17 44h14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" fill="none" />
                </g>
                <line x1="8" y1="6" x2="40" y2="43" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
              </svg>
            </span>
            <span className="hcd-l">mute</span>
          </button>

          <button
            type="button"
            className="hcd-btn hcd-a"
            style={{ '--x': 335, '--y': 669, '--w': 184 } as React.CSSProperties}
            aria-label="keypad"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 72 72" fill="currentColor">
                <g id="hcd-keypad-row">
                  <circle cx="11" cy="11" r="10.5" />
                  <circle cx="36" cy="11" r="10.5" />
                  <circle cx="61" cy="11" r="10.5" />
                </g>
                <use href="#hcd-keypad-row" y="25" />
                <use href="#hcd-keypad-row" y="50" />
              </svg>
            </span>
            <span className="hcd-l">keypad</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAudioOn((prev) => !prev)}
            className={`hcd-btn hcd-a ${isAudioOn ? 'on' : ''}`}
            style={{ '--x': 581, '--y': 669, '--w': 184 } as React.CSSProperties}
            aria-label="audio"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 84 72" style={{ '--sw': 84 } as React.CSSProperties} fill="currentColor">
                <path d="M4 24h12L36 6q6-4 6 3v54q0 7-6 3L16 48H4q-4 0-4-4V28q0-4 4-4z" />
                <g fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round">
                  <path d="M54.5 27.5A12 12 0 0 1 54.5 44.5" />
                  <path d="M64.4 17.6A26 26 0 0 1 64.4 54.4" />
                  <path d="M74.3 7.7A40 40 0 0 1 74.3 64.3" />
                </g>
              </svg>
            </span>
            <span className="hcd-l">audio</span>
          </button>

          {/* Row 2 */}
          <button
            type="button"
            className="hcd-btn hcd-a"
            style={{ '--x': 88, '--y': 953, '--w': 184 } as React.CSSProperties}
            aria-label="add call"
          >
            <span className="hcd-c">
              <svg
                viewBox="0 0 72 72"
                style={{ '--sw': 60, '--sh': 60 } as React.CSSProperties}
                fill="none"
                stroke="currentColor"
                strokeWidth="5.5"
                strokeLinecap="round"
              >
                <path d="M6 36h60M36 6v60" />
              </svg>
            </span>
            <span className="hcd-l">add call</span>
          </button>

          <button
            type="button"
            className="hcd-btn hcd-a"
            style={{ '--x': 335, '--y': 953, '--w': 184 } as React.CSSProperties}
            aria-label="FaceTime"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 88 58" style={{ '--sw': 88, '--sh': 58 } as React.CSSProperties} fill="currentColor">
                <rect width="62" height="58" rx="13" />
                <path d="M66 22l14-11q6-4 6 3v30q0 7-6 3L66 36z" />
              </svg>
            </span>
            <span className="hcd-l">FaceTime</span>
          </button>

          <button
            type="button"
            className="hcd-btn hcd-a"
            style={{ '--x': 581, '--y': 953, '--w': 184 } as React.CSSProperties}
            aria-label="contacts"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 72 72" fill="currentColor">
                <defs>
                  <clipPath id="hcd-contact-clip">
                    <circle cx="36" cy="36" r="30" />
                  </clipPath>
                </defs>
                <circle cx="36" cy="36" r="33.5" fill="none" stroke="currentColor" strokeWidth="5" />
                <g clipPath="url(#hcd-contact-clip)">
                  <circle cx="36" cy="28" r="11" />
                  <ellipse cx="36" cy="62" rx="23" ry="18" />
                </g>
              </svg>
            </span>
            <span className="hcd-l">contacts</span>
          </button>

          {/* End Call Button */}
          <button
            type="button"
            onClick={handleEndCall}
            className="hcd-end hcd-a"
            style={{ '--x': 345, '--y': 1411, '--w': 163, '--h': 163 } as React.CSSProperties}
            aria-label="end call"
          >
            <svg viewBox="0 0 88 32" fill="currentColor">
              <path d="M2 22C2 12 14 7 44 7s42 5 42 15v4q0 4-4 4H70q-4 0-4-4v-4q0-3-4-3.5-18-2.5-36 0-4 .5-4 3.5v4q0 4-4 4H6q-4 0-4-4z" />
            </svg>
          </button>
        </div>

        {/* INCOMING CALL LAYER */}
        <div
          className={`hcd-layer transition-opacity duration-200 ${
            callState === 'incoming' || callState === 'declined'
              ? 'opacity-100 pointer-events-auto visible'
              : 'opacity-0 pointer-events-none invisible'
          }`}
        >
          <button
            type="button"
            className="hcd-btn hcd-sm hcd-a"
            style={{ '--x': 135, '--y': 1120, '--w': 130 } as React.CSSProperties}
            aria-label="Remind me"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="27" cy="27" r="22" />
                <path d="M27 14v14l10 7" />
              </svg>
            </span>
            <span className="hcd-l">Remind Me</span>
          </button>

          <button
            type="button"
            className="hcd-btn hcd-sm hcd-a"
            style={{ '--x': 587, '--y': 1120, '--w': 130 } as React.CSSProperties}
            aria-label="Message"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 54 54" fill="currentColor">
                <path d="M27 6C14.5 6 5 14 5 24c0 5.2 2.6 9.8 6.8 13-.4 3.3-1.8 6.2-4.3 8.4 5.2.1 9.2-1.8 11.9-4.2 2.3.6 4.5.8 7.6.8 12.5 0 22-8 22-18S39.5 6 27 6z" />
              </svg>
            </span>
            <span className="hcd-l">Message</span>
          </button>

          <button
            type="button"
            onClick={handleDecline}
            className="hcd-btn hcd-a"
            style={{ '--x': 118, '--y': 1411, '--w': 163 } as React.CSSProperties}
            aria-label="Decline"
          >
            <span className="hcd-c red">
              <svg viewBox="0 0 88 32" style={{ '--sw': 80, '--sh': 29 } as React.CSSProperties} fill="currentColor">
                <path d="M2 22C2 12 14 7 44 7s42 5 42 15v4q0 4-4 4H70q-4 0-4-4v-4q0-3-4-3.5-18-2.5-36 0-4 .5-4 3.5v4q0 4-4 4H6q-4 0-4-4z" />
              </svg>
            </span>
            <span className="hcd-l">Decline</span>
          </button>

          <button
            type="button"
            onClick={handleAccept}
            className="hcd-btn hcd-a"
            style={{ '--x': 571, '--y': 1411, '--w': 163 } as React.CSSProperties}
            aria-label="Accept"
          >
            <span className="hcd-c green">
              <svg
                viewBox="0 0 88 32"
                style={{ '--sw': 80, '--sh': 29, transform: 'rotate(-135deg)' } as React.CSSProperties}
                fill="currentColor"
              >
                <path d="M2 22C2 12 14 7 44 7s42 5 42 15v4q0 4-4 4H70q-4 0-4-4v-4q0-3-4-3.5-18-2.5-36 0-4 .5-4 3.5v4q0 4-4 4H6q-4 0-4-4z" />
              </svg>
            </span>
            <span className="hcd-l">Accept</span>
          </button>
        </div>

        {/* Home Indicator */}
        <div className="hcd-home hcd-a" style={{ '--x': 275, '--y': 1819, '--w': 303, '--h': 10 } as React.CSSProperties} />
      </main>

      {/* Transcript Panel */}
      <aside
        className={`hcd-panel ${isCallLive ? 'live' : ''} ${hasStartedTranscript ? 'has' : ''}`}
        aria-label="Call transcript"
      >
        <header>
          <div>
            <h2>Live transcript</h2>
            <p>{statusSubtitle}</p>
          </div>
          <span className="hcd-dot" />
        </header>

        <div ref={bdRef} className="hcd-bd">
          <p className="hcd-empty">Answer the call to hear the audio and follow along here.</p>

          <ol className="hcd-tx" aria-live="polite">
            {parsedLines.map((line, idx) => {
              const isShown = idx <= activeLineIdx;
              const isCurrent = idx === activeLineIdx;
              const isAI = line.speaker === 'A';
              const visibleWordsCount = lineWordCounts[idx];

              return (
                <li
                  key={idx}
                  className={`hcd-ln ${isAI ? 'ai' : 'cl'} ${isShown ? 'show' : ''} ${isCurrent ? 'on' : ''}`}
                >
                  <b>{isAI ? 'Allison (AI)' : 'Caller'}</b>
                  <p>
                    {line.words.map((w, wIdx) => (
                      <span key={wIdx} className={wIdx < visibleWordsCount ? 'v' : ''}>
                        {w}{' '}
                      </span>
                    ))}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <footer>
          <div className="hcd-bar">
            <i style={{ width: `${progressBarPercent}%` }} />
          </div>
          <span>
            {formatClock(currentTime)} / {formatClock(Math.round(duration || 53.9))}
          </span>
        </footer>
      </aside>
    </div>
  );
};
