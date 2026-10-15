import { AppsianMark } from './AppsianLogo';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// Constant at top of file: set to true to ignore sessionStorage and always test the preloader
const SHOW_PRELOADER_ALWAYS = false;
const PRELOADER_SEEN_KEY = 'appsian_preloader_seen';

export function hasSeenPreloader(): boolean {
  if (SHOW_PRELOADER_ALWAYS) return false;
  try {
    return sessionStorage.getItem(PRELOADER_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markPreloaderSeen() {
  try {
    sessionStorage.setItem(PRELOADER_SEEN_KEY, 'true');
  } catch {
    // Ignore storage errors
  }
}

// Global store for app readiness so Hero and Navbar gate entrance animations
let globalAppReady = hasSeenPreloader();
const appReadyListeners = new Set<(ready: boolean) => void>();

export function setGlobalAppReady(val: boolean) {
  if (globalAppReady !== val) {
    globalAppReady = val;
    appReadyListeners.forEach((fn) => fn(val));
  }
}

export function useAppReady(): boolean {
  const [ready, setReady] = useState(globalAppReady);
  useEffect(() => {
    appReadyListeners.add(setReady);
    return () => {
      appReadyListeners.delete(setReady);
    };
  }, []);
  return ready;
}

export function restorePageScroll() {
  try {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  } catch {
    // Ignore
  }
}

interface PreloaderProps {
  onComplete?: () => void;
}

const PreloaderInner: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [shouldShow] = useState(() => !hasSeenPreloader());

  const [progress, setProgress] = useState(0);
  const [isLogoFading, setIsLogoFading] = useState(false);
  const [isIrisClosing, setIsIrisClosing] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // StrictMode & lifecycle refs
  const mountedRef = useRef(true);
  const startedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());
  const isReadyRef = useRef(false);
  const hasBegunExitRef = useRef(false);
  const isFinishedRef = useRef(false);

  const rAFRef = useRef<number | null>(null);
  const failsafe1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failsafe2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Single idempotent finish function
  const finish = () => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (rAFRef.current !== null) {
      cancelAnimationFrame(rAFRef.current);
      rAFRef.current = null;
    }
    if (failsafe1Ref.current) clearTimeout(failsafe1Ref.current);
    if (failsafe2Ref.current) clearTimeout(failsafe2Ref.current);
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);

    setGlobalAppReady(true);
    restorePageScroll();
    markPreloaderSeen();

    if (mountedRef.current) {
      setIsRemoved(true);
    }
    if (onComplete) onComplete();
  };

  // Exit sequence: fill 100%, fade logo, close iris, trigger appReady, finish
  const beginExit = () => {
    if (hasBegunExitRef.current || isFinishedRef.current) return;
    hasBegunExitRef.current = true;

    setProgress(100);

    setTimeout(() => {
      if (!mountedRef.current || isFinishedRef.current) return;
      setIsLogoFading(true);

      setTimeout(() => {
        if (!mountedRef.current || isFinishedRef.current) return;
        // Trigger appReady synchronously when iris starts closing
        setGlobalAppReady(true);
        setIsIrisClosing(true);

        // Guaranteed plain setTimeout for completion (iris duration 1000ms + 300ms buffer)
        exitTimerRef.current = setTimeout(() => {
          finish();
        }, isReducedMotion ? 350 : 1300);
      }, 250);
    }, 80);
  };

  useEffect(() => {
    mountedRef.current = true;

    if (!shouldShow) {
      setGlobalAppReady(true);
      restorePageScroll();
      return;
    }

    if (!startedRef.current) {
      startedRef.current = true;
      startTimeRef.current = Date.now();
      // Mark seen immediately so a refresh on an aborted load never traps the user
      markPreloaderSeen();

      // Lock scrolling
      try {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } catch {}

      // Hard Failsafe 1 (4000ms): force begin exit regardless of readiness
      failsafe1Ref.current = setTimeout(() => {
        if (!isFinishedRef.current && !hasBegunExitRef.current) {
          beginExit();
        }
      }, 4000);

      // Hard Failsafe 2 (6000ms): force-clean everything, restore scroll, release appReady
      failsafe2Ref.current = setTimeout(() => {
        finish();
      }, 6000);

      // Readiness: ONLY (a) DOM ready (interactive/complete) and (b) fonts with 1500ms timeout race
      const checkDomReady = () => {
        try {
          return document.readyState === 'interactive' || document.readyState === 'complete';
        } catch {
          return true;
        }
      };

      const domPromise = checkDomReady()
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const onReady = () => {
              resolve();
              document.removeEventListener('DOMContentLoaded', onReady);
              window.removeEventListener('load', onReady);
            };
            document.addEventListener('DOMContentLoaded', onReady, { once: true });
            window.addEventListener('load', onReady, { once: true });
          });

      const fontTimeout = new Promise<void>((resolve) => setTimeout(resolve, 1500));
      const fontPromise = (document.fonts ? document.fonts.ready : Promise.resolve())
        .catch(() => {})
        .then(() => {});

      const fontRace = Promise.race([fontPromise, fontTimeout]);

      Promise.all([domPromise, fontRace])
        .then(() => {
          isReadyRef.current = true;
        })
        .catch(() => {
          isReadyRef.current = true;
        });

      // Time-driven progress via requestAnimationFrame
      const updateProgress = () => {
        if (isFinishedRef.current) return;
        const elapsed = Date.now() - startTimeRef.current;

        // Ease toward 90% over about 1.4s (1400ms)
        if (elapsed < 1400) {
          const t = elapsed / 1400;
          const p = Math.round(90 * (1 - (1 - t) * (1 - t)));
          setProgress(Math.min(p, 90));
        } else {
          setProgress(90);
        }

        // Complete when ready AND min duration (1.8s) has elapsed
        if (isReadyRef.current && elapsed >= 1800) {
          beginExit();
          return;
        }

        rAFRef.current = requestAnimationFrame(updateProgress);
      };

      rAFRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      // Cleanup on unmount
      mountedRef.current = false;
      if (!isFinishedRef.current) {
        restorePageScroll();
        setGlobalAppReady(true);
      }
    };
  }, [shouldShow]);

  if (!shouldShow || isRemoved) {
    return null;
  }

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[1000] pointer-events-auto overflow-hidden select-none"
      style={{
        backgroundColor: '#EEF1F4',
        willChange: 'clip-path, opacity',
      }}
      initial={{
        clipPath: 'circle(150% at 50% 50%)',
        opacity: 1,
      }}
      animate={
        isIrisClosing
          ? {
              clipPath: isReducedMotion ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 50%)',
              opacity: isReducedMotion ? 0 : 1,
            }
          : {
              clipPath: 'circle(150% at 50% 50%)',
              opacity: 1,
            }
      }
      transition={
        isReducedMotion
          ? { duration: 0.3, ease: 'easeOut' }
          : { duration: 1.0, ease: [0.76, 0, 0.24, 1] as const }
      }
    >
      <span className="sr-only">Loading</span>

      <style>{`
        @keyframes blobDrift1 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(18px, -16px); }
          100% { transform: translate(-14px, 12px); }
        }
        @keyframes blobDrift2 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-16px, 18px); }
          100% { transform: translate(15px, -15px); }
        }
        @keyframes blobDrift3 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(14px, 14px); }
          100% { transform: translate(-18px, -12px); }
        }
        @keyframes blobDrift4 {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-12px, -14px); }
          100% { transform: translate(16px, 10px); }
        }
        @keyframes breathePulse {
          0% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.018); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>

      {/* 1. Global Faint Dot Grid Pattern (whole screen) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(60, 70, 90, 0.14) 1px, transparent 1.5px)',
          backgroundSize: '30px 30px',
          opacity: 0.7,
        }}
      />

      {/* 2. Soft Blurred Shadow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1: Upper-left cool blue-gray #C7D3E1 */}
        <div
          className="absolute -top-[10%] -left-[5%] w-[480px] h-[380px] sm:w-[580px] sm:h-[450px] rounded-full"
          style={{
            backgroundColor: '#C7D3E1',
            opacity: 0.55,
            filter: 'blur(90px)',
            animation: isReducedMotion ? 'none' : 'blobDrift1 14s ease-in-out infinite alternate',
          }}
        />

        {/* Blob 2: Lower-right cool blue-gray #C7D3E1 */}
        <div
          className="absolute -bottom-[12%] -right-[6%] w-[520px] h-[400px] sm:w-[620px] sm:h-[480px] rounded-full"
          style={{
            backgroundColor: '#C7D3E1',
            opacity: 0.55,
            filter: 'blur(90px)',
            animation: isReducedMotion ? 'none' : 'blobDrift2 14s ease-in-out infinite alternate',
          }}
        />

        {/* Blob 3: Right-center smaller cool blue-gray #C7D3E1 */}
        <div
          className="absolute top-[38%] -right-[4%] w-[320px] h-[260px] sm:w-[380px] sm:h-[300px] rounded-full"
          style={{
            backgroundColor: '#C7D3E1',
            opacity: 0.55,
            filter: 'blur(90px)',
            animation: isReducedMotion ? 'none' : 'blobDrift3 14s ease-in-out infinite alternate',
          }}
        />

        {/* Blob 4: Lower-left pale white #FFFFFF */}
        <div
          className="absolute -bottom-[5%] -left-[5%] w-[440px] h-[340px] sm:w-[520px] sm:h-[400px] rounded-full"
          style={{
            backgroundColor: '#FFFFFF',
            opacity: 0.6,
            filter: 'blur(90px)',
            animation: isReducedMotion ? 'none' : 'blobDrift4 14s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* 3. OUTER CIRCLE: centered, clamp(520px, 60vw, 1140px), #EDF0F3 */}
      <motion.div
        initial={isReducedMotion ? false : { scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: isReducedMotion ? 0.2 : 1.2,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none w-[120vw] h-[120vw] sm:w-[clamp(520px,60vw,1140px)] sm:h-[clamp(520px,60vw,1140px)] overflow-hidden"
        style={{
          backgroundColor: '#EDF0F3',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: 'inset 0 0 120px rgba(255, 255, 255, 0.45)',
        }}
      >
        {/* Faint dot grid inside outer circle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(60, 70, 90, 0.12) 1px, transparent 1.5px)',
            backgroundSize: '30px 30px',
            opacity: 0.6,
          }}
        />
      </motion.div>

      {/* 4. INNER CIRCLE WRAPPER: centered, clamp(220px, 21.6vw, 410px), #ECEFF2 */}
      <motion.div
        initial={isReducedMotion ? false : { scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: isReducedMotion ? 0.2 : 1.1,
          delay: isReducedMotion ? 0 : 0.15,
          ease: [0.22, 1, 0.36, 1] as const,
        }}
        className="absolute left-1/2 top-1/2 pointer-events-none flex items-center justify-center w-[min(56vw,220px)] h-[min(56vw,220px)] sm:w-[clamp(220px,21.6vw,410px)] sm:h-[clamp(220px,21.6vw,410px)]"
        style={{
          animation:
            isReducedMotion || isIrisClosing
              ? 'none'
              : 'breathePulse 3s ease-in-out infinite alternate',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Trailing soft blue-gray shadow drifting to one side (like reference) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '105%',
            height: '105%',
            left: '6%',
            top: '6%',
            background: 'radial-gradient(circle, rgba(110, 130, 160, 0.35) 0%, transparent 70%)',
            filter: 'blur(35px)',
            opacity: isIrisClosing ? 0 : 0.85,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Inner Circle Disc */}
        <div
          className="relative w-full h-full rounded-full flex items-center justify-center"
          style={{
            backgroundColor: '#ECEFF2',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: isIrisClosing
              ? 'none'
              : '0 40px 90px -24px rgba(110, 130, 160, 0.5), 0 10px 30px -10px rgba(110, 130, 160, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.9)',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* 5. LOGO: Appsian mark + wordmark centered, about 50% of inner circle, #0B0B0F */}
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={
              isLogoFading
                ? { opacity: 0, scale: 0.97, transition: { duration: 0.25, ease: 'easeOut' } }
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
            }
            transition={{
              duration: isReducedMotion ? 0.2 : 0.8,
              delay: isReducedMotion ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
            className="flex items-center justify-center gap-2.5 sm:gap-3 text-[#0B0B0F] select-none"
            style={{
              willChange: 'transform, opacity',
            }}
          >
            {/* Appsian Brand Mark */}
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center shrink-0">
              <AppsianMark size={28} />
            </div>

            {/* Wordmark: Appsian in near-black */}
            <span className="font-display font-semibold text-[19px] sm:text-[23px] md:text-[26px] tracking-tight text-[#0B0B0F]">
              Appsian
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* 6. PROGRESS LINE: along the bottom edge, left 16px, right 16px, bottom 16px, height 3px */}
      <div
        className="absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 h-[3px] rounded-[3px] overflow-hidden pointer-events-none z-30"
        style={{
          backgroundColor: 'rgba(10, 10, 20, 0.08)',
          opacity: isLogoFading ? 0 : 1,
          transition: 'opacity 0.25s ease-out',
        }}
      >
        <div
          className="h-full bg-[#0B0B0F] rounded-[3px]"
          style={{
            width: `${progress}%`,
            transition: 'width 0.12s ease-out',
          }}
        />
      </div>
    </motion.div>
  );
};

// Error Boundary for fail-safe rendering: on any runtime error, renders null and calls finish()
interface ErrorBoundaryProps {
  children: React.ReactNode;
  onComplete?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class PreloaderErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    setGlobalAppReady(true);
    restorePageScroll();
    markPreloaderSeen();
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export const Preloader: React.FC<PreloaderProps> = (props) => {
  return (
    <PreloaderErrorBoundary onComplete={props.onComplete}>
      <PreloaderInner {...props} />
    </PreloaderErrorBoundary>
  );
};
