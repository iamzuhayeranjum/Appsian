import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_AUDIO_SRC, DEMO_AUDIO_VERSION } from '../config/demoCall';
import {
  lines,
  jobDetails,
  phases,
  durationSeconds,
  TRANSCRIPT_OFFSET,
} from '../config/demoTranscript';

export type CallState = 'ringing' | 'answered' | 'ended';

export const formatTimer = (totalSec: number) => {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

interface UseDemoCallOptions {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function useDemoCall({ containerRef }: UseDemoCallOptions) {
  const transcriptListRef = useRef<HTMLDivElement>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const acceptBtnRef = useRef<HTMLButtonElement | null>(null);
  const hangUpBtnRef = useRef<HTMLButtonElement | null>(null);
  const fallbackStartRef = useRef<number | null>(null);
  const callTimeRef = useRef<number>(0);
  const callStateRef = useRef<CallState>('ringing');
  const acceptTimestampRef = useRef<number>(0);
  const isFirstIntersectionRef = useRef<boolean>(true);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [callState, setCallState] = useState<CallState>('ringing');
  const [callTime, setCallTime] = useState(0);
  const [finalDuration, setFinalDuration] = useState<number | null>(null);
  const [isDeclined, setIsDeclined] = useState(false);
  const [acceptPulse, setAcceptPulse] = useState(false);
  const [notAllowedHint, setNotAllowedHint] = useState(false);
  const [audioPlayFailed, setAudioPlayFailed] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'checking' | 'ok' | 'missing' | 'wrong-type'>('checking');
  const [audioDuration, setAudioDuration] = useState<number>(durationSeconds);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const isUserScrolledUpRef = useRef(false);
  const [isDebugTime, setIsDebugTime] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsDebugTime(params.get('debugtime') === '1');
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
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

    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = setTimeout(() => {
      if (audio) {
        audio.currentTime = 0;
      }
      setCallTime(0);
      callTimeRef.current = 0;
      setAudioPlayFailed(false);
      fallbackStartRef.current = null;
      setIsScrolled(false);
      isUserScrolledUpRef.current = false;
      setIsUserScrolledUp(false);
      setCallState('ringing');
      callStateRef.current = 'ringing';
      acceptBtnRef.current?.focus();
    }, 1200);
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // Lazy singleton audio getter: attaches all listeners once, never nulled on re-render
  const getAudio = useCallback(() => {
    if (!audioInstanceRef.current) {
      const audioUrl = `${DEMO_AUDIO_SRC}?${DEMO_AUDIO_VERSION}`;
      console.log('[demo-call] Initializing Audio singleton with URL:', audioUrl);
      console.log('[demo-call] Audio elements in memory:', 1);
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.playbackRate = 1;
      audio.defaultPlaybackRate = 1;
      (audio as any).preservesPitch = true;
      if ('webkitPreservesPitch' in audio) (audio as any).webkitPreservesPitch = true;
      if ('mozPreservesPitch' in audio) (audio as any).mozPreservesPitch = true;
      audio.volume = 1;
      audio.muted = false;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');

      audio.addEventListener('loadedmetadata', () => {
        if (Number.isFinite(audio.duration) && audio.duration > 10) {
          setAudioDuration(audio.duration);
        }
        console.log('[demo-call] Event: loadedmetadata', {
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          defaultPlaybackRate: audio.defaultPlaybackRate,
          preservesPitch: (audio as any).preservesPitch,
          volume: audio.volume,
        });
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
      audio.addEventListener('ratechange', () => {
        console.log('[demo-call] Event: ratechange, rate is', audio.playbackRate);
        if (audio.playbackRate !== 1) {
          console.warn(
            `[demo-call] playbackRate is not 1 (was ${audio.playbackRate}), resetting to 1`
          );
          audio.playbackRate = 1;
        }
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
          if (res.status === 0 || res.type === 'opaque' || url.startsWith('http')) {
            console.warn('[demo-call] Cross-origin or restricted check response, allowing audio playback attempt:', res.status);
            setAudioStatus('ok');
            return;
          }
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
        console.warn('[demo-call] Audio check failed (cross-origin or network), allowing audio playback attempt:', err);
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
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setNotAllowedHint(false);
    setAudioPlayFailed(false);
    setIsScrolled(false);
    isUserScrolledUpRef.current = false;
    setIsUserScrolledUp(false);

    const audio = getAudio();
    audio.playbackRate = 1;
    audio.defaultPlaybackRate = 1;
    (audio as any).preservesPitch = true;
    if ('webkitPreservesPitch' in audio) (audio as any).webkitPreservesPitch = true;
    if ('mozPreservesPitch' in audio) (audio as any).mozPreservesPitch = true;
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 1;
    const playPromise = audio.play();

    acceptTimestampRef.current = performance.now();
    setCallState('answered');
    callStateRef.current = 'answered';

    console.log('[demo-call] State after play():', {
      duration: audio.duration,
      playbackRate: audio.playbackRate,
      defaultPlaybackRate: audio.defaultPlaybackRate,
      preservesPitch: (audio as any).preservesPitch,
      volume: audio.volume,
      paused: audio.paused,
    });

    // Speed check 3 seconds after playback starts
    const acceptStartTime = performance.now();
    setTimeout(() => {
      if (
        callStateRef.current === 'answered' &&
        audioInstanceRef.current &&
        !audioInstanceRef.current.paused
      ) {
        const elapsedWallClock = (performance.now() - acceptStartTime) / 1000;
        const audioTime = audioInstanceRef.current.currentTime;
        const ratio = audioTime / elapsedWallClock;
        console.log(
          `[demo-call] Speed check at 3s: elapsed wall-clock=${elapsedWallClock.toFixed(
            2
          )}s, audio.currentTime=${audioTime.toFixed(2)}s, ratio=${ratio.toFixed(2)}`
        );
        if (ratio < 0.8 || ratio > 1.2) {
          console.warn(
            `[demo-call] playback speed mismatch: wall-clock=${elapsedWallClock.toFixed(
              2
            )}s, audio.currentTime=${audioTime.toFixed(2)}s`
          );
        }
      }
    }, 3000);

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

  // Seek handler when tapping a step tile, progress bar, or transcript line
  const handleSeek = useCallback(
    (timeSec: number) => {
      if (callStateRef.current !== 'answered') return;
      const clamped = Math.max(0, Math.min(audioDuration, timeSec));
      const audio = audioInstanceRef.current;
      if (audio && !audioPlayFailed) {
        audio.currentTime = clamped;
      } else if (fallbackStartRef.current) {
        fallbackStartRef.current = performance.now() - clamped * 1000;
      }
      callTimeRef.current = clamped;
      setCallTime(clamped);
    },
    [audioDuration, audioPlayFailed]
  );

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
        if (t >= durationSeconds) {
          handleEndCall('ended');
          return;
        }
      }
      if (t !== callTimeRef.current) {
        callTimeRef.current = t;
        setCallTime(t);
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [callState, audioPlayFailed, handleEndCall]);

  const handleListScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrolled = el.scrollTop > 2;
    setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));

    if (callStateRef.current === 'answered') {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      const scrolledUp = distanceFromBottom > 40;
      if (scrolledUp !== isUserScrolledUpRef.current) {
        isUserScrolledUpRef.current = scrolledUp;
        setIsUserScrolledUp(scrolledUp);
      }
    }
  }, []);

  const jumpToLive = useCallback(() => {
    isUserScrolledUpRef.current = false;
    setIsUserScrolledUp(false);
    if (transcriptListRef.current) {
      transcriptListRef.current.scrollTo({
        top: transcriptListRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [reduceMotion]);

  // Auto-scroll transcript list to bottom as lines arrive (unless user scrolled up)
  useEffect(() => {
    if (callState === 'answered' && !isUserScrolledUpRef.current && transcriptListRef.current) {
      transcriptListRef.current.scrollTo({
        top: transcriptListRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    }
  }, [callTime, callState, reduceMotion]);

  // Reset to ringing when hero leaves viewport (IntersectionObserver threshold 0.15)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const heroSection = el.closest('section') || el.parentElement || el;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
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
  }, [containerRef, handleEndCall]);

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

  const isLiveOrEnding = callState === 'answered' || callState === 'ended';

  const visibleLines =
    callState !== 'ringing' && reduceMotion
      ? lines
      : lines.filter((line) => callTime >= line.start + TRANSCRIPT_OFFSET - 0.1);

  const isAnswered =
    isLiveOrEnding && (callTime >= phases.answered + TRANSCRIPT_OFFSET || reduceMotion);
  const isQualified =
    isLiveOrEnding && (callTime >= phases.qualified + TRANSCRIPT_OFFSET || reduceMotion);
  const isBooked =
    isLiveOrEnding && (callTime >= phases.booked + TRANSCRIPT_OFFSET || reduceMotion);

  const showIssue = Boolean(
    isLiveOrEnding &&
      jobDetails.issue?.value &&
      (reduceMotion || callTime >= jobDetails.issue.time + TRANSCRIPT_OFFSET)
  );
  const showCaller = Boolean(
    isLiveOrEnding &&
      jobDetails.callerName?.value &&
      (reduceMotion || callTime >= jobDetails.callerName.time + TRANSCRIPT_OFFSET)
  );
  const showAddress = Boolean(
    isLiveOrEnding &&
      jobDetails.address?.value &&
      (reduceMotion || callTime >= jobDetails.address.time + TRANSCRIPT_OFFSET)
  );
  const showAppointment = Boolean(
    isLiveOrEnding &&
      jobDetails.appointment?.value &&
      (reduceMotion || callTime >= jobDetails.appointment.time + TRANSCRIPT_OFFSET)
  );
  const showBooked = Boolean(
    isLiveOrEnding &&
      jobDetails.booked?.value &&
      (reduceMotion || callTime >= jobDetails.booked.time + TRANSCRIPT_OFFSET)
  );

  const hasVisibleJobDetails =
    isLiveOrEnding && (showIssue || showCaller || showAddress || showAppointment || showBooked);

  const revealedDetailsCount = [showIssue, showCaller, showAddress, showAppointment].filter(
    Boolean
  ).length;

  let latestVisibleLineIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (callTime >= lines[i].start + TRANSCRIPT_OFFSET - 0.1) {
      latestVisibleLineIdx = i;
      break;
    }
  }

  let activeLineIndex = -1;
  let upcomingLineIndex = -1;
  let timeUntilNextLine = Infinity;

  if (callState === 'answered') {
    for (let i = 0; i < lines.length; i++) {
      const lStart = lines[i].start + TRANSCRIPT_OFFSET;
      const lEnd = lines[i].end + TRANSCRIPT_OFFSET;
      if (callTime >= lStart && callTime <= lEnd) {
        activeLineIndex = i;
        break;
      }
    }

    if (activeLineIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        const lStart = lines[i].start + TRANSCRIPT_OFFSET;
        if (lStart > callTime) {
          upcomingLineIndex = i;
          timeUntilNextLine = lStart - callTime;
          break;
        }
      }
    }
  }

  return {
    transcriptListRef,
    acceptBtnRef,
    hangUpBtnRef,
    callState,
    callTime,
    currentTime: callTime,
    duration: audioDuration,
    finalDuration,
    isDeclined,
    acceptPulse,
    notAllowedHint,
    audioPlayFailed,
    audioStatus,
    reduceMotion,
    isScrolled,
    isUserScrolledUp,
    isDebugTime,
    visibleLines,
    activeLineIndex,
    upcomingLineIndex,
    timeUntilNextLine,
    phaseTimes: phases,
    isAnswered,
    isQualified,
    isBooked,
    showIssue,
    showCaller,
    showAddress,
    showAppointment,
    showBooked,
    revealedDetailsCount,
    hasVisibleJobDetails,
    latestVisibleLineIdx,
    handleAcceptCall,
    accept: handleAcceptCall,
    handleDecline,
    decline: handleDecline,
    handleEndCall,
    hangUp: () => handleEndCall('hang-up'),
    handleRemindOrMessage,
    handleSeek,
    seekTo: handleSeek,
    handleListScroll,
    jumpToLive,
  };
}
