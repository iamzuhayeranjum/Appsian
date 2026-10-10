import React, { useRef, useState, useEffect } from 'react';

// Band length cycle as specified: 55%, 85%, 65%, 90%, 60%, 75%, 50%, 80%
const BAND_LENGTHS = [0.55, 0.85, 0.65, 0.9, 0.6, 0.75, 0.5, 0.8];

export const HeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [period, setPeriod] = useState<number>(229);
  const [isVisible, setIsVisible] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Measure hero container width and compute period P = clamp(160px, 15vw, 260px)
  useEffect(() => {
    const updateDimensions = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth;
      const computedPeriod = Math.min(260, Math.max(160, Math.round(w * 0.15)));
      setPeriod(computedPeriod);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // Reduced motion check
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      mq.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // IntersectionObserver to pause animation when hero is scrolled out of view
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const setWidth = period * 8; // One set of 8 periods

  // Drift RIGHT animation: transform: translate3d(...) only.
  // Seamless loop from -setWidth to 0 at steady 45px/s.
  // On page load, starts faster (~90px/s) and eases down to 45px/s over the first 1.5s.
  useEffect(() => {
    if (isReducedMotion || !trackRef.current || setWidth <= 0) return;

    let animId: number;
    let lastTime: number | null = null;
    let elapsed = 0;
    let currentX = -setWidth;

    const tick = (now: number) => {
      if (!isVisible) {
        lastTime = null;
        animId = requestAnimationFrame(tick);
        return;
      }

      if (lastTime === null) {
        lastTime = now;
      }
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      elapsed += dt;

      // Initial speed easing: 90px/s -> 45px/s over first 1.5s
      let speed = 45;
      if (elapsed < 1.5) {
        const t = elapsed / 1.5;
        const easeOut = 1 - Math.pow(1 - t, 2);
        speed = 90 - 45 * easeOut;
      }

      // Check if --drift-speed is customized via CSS
      if (trackRef.current) {
        const customSpeed = getComputedStyle(trackRef.current).getPropertyValue('--drift-speed');
        if (customSpeed) {
          const parsed = parseFloat(customSpeed);
          if (!isNaN(parsed) && elapsed >= 1.5) {
            speed = parsed;
          }
        }
      }

      currentX += speed * dt;
      if (currentX >= 0) {
        currentX -= setWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${currentX}px, 0, 0)`;
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [setWidth, isVisible, isReducedMotion]);

  // Render a single set of 8 periods
  const renderPeriodSet = (setIndex: number) => (
    <div key={`set-${setIndex}`} className="flex h-full shrink-0" style={{ width: `${setWidth}px` }}>
      {BAND_LENGTHS.map((lengthRatio, i) => {
        const isEven = (setIndex * 8 + i) % 2 === 0;
        const bandHeightPx = Math.round(1095 * lengthRatio);

        return (
          <div
            key={`period-${setIndex}-${i}`}
            className="relative h-full shrink-0 overflow-hidden"
            style={{ width: `${period}px` }}
          >
            {/* c) Panel plane brightness offset (alternate +4% and -4% overlay) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: isEven ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
              }}
            />

            {/* a) Soft dark-indigo band: width ~22% of P, vertical taper, blur(12px) */}
            <div
              className="absolute top-0 pointer-events-none rounded-b-[24px]"
              style={{
                left: '0%',
                width: '22%',
                height: `${bandHeightPx}px`,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(36, 30, 150, 0.85) 50%, transparent 100%)',
                maskImage:
                  'linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                filter: 'blur(12px)',
              }}
            />

            {/* b) 1px hairline immediately to the right of the band (at ~19% of P) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none w-[1px]"
              style={{
                left: '19%',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0.12) 100%)',
              }}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      style={{
        height: '1095px',
        contain: 'strict',
      }}
    >
      {/* 1) BASE GRADIENT (full hero, vertical) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #050507 0%, #050507 14%, #1C1966 26%, #4B47B0 38%, #7A7BE6 56%, #98A9FB 68%, #A9C8FB 82%, #CDEAFF 94%, #EAF7FF 100%)',
        }}
      />

      {/* 2) PANEL TRACK (repeating 2 sets side by side, drifting right) */}
      <div
        ref={trackRef}
        className="absolute top-0 bottom-0 flex h-full"
        style={{
          width: `${setWidth * 2}px`,
          willChange: 'transform',
          transform: isReducedMotion
            ? `translate3d(-${setWidth / 2}px, 0, 0)`
            : `translate3d(-${setWidth}px, 0, 0)`,
        }}
      >
        {renderPeriodSet(0)}
        {renderPeriodSet(1)}
      </div>

      {/* 3) BLACK TOP WITH AN ORGANIC LOWER EDGE */}
      <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden h-[450px]">
        <div className="w-full h-full animate-organic-breathe origin-top">
          {/* Layered feathered SVG path for organic contour */}
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 450"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <filter id="organicTopFeather" x="-10%" y="-10%" width="120%" height="130%">
                <feGaussianBlur stdDeviation="20" />
              </filter>
            </defs>
            {/* Core dark fill with feather */}
            <path
              d="M 0 0 L 1440 0 L 1440 164 C 1220 175, 1100 240, 960 320 C 860 365, 750 360, 640 295 C 500 215, 260 160, 0 164 Z"
              fill="#050507"
              filter="url(#organicTopFeather)"
            />
            {/* Crisp top anchor ensuring upper 120px stays solid black */}
            <rect x="0" y="0" width="1440" height="120" fill="#050507" />
          </svg>
        </div>
      </div>

      {/* 4) BOTTOM GLOW (stays inside hero, ends cleanly at hero bottom edge) */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '240px',
          background:
            'radial-gradient(ellipse 45% 22% at 45% 100%, rgba(217,244,255,0.9), transparent 70%)',
        }}
      />
      {/* 2% solid #F2FAFF strip at the very bottom */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '21.9px', // exactly 2% of 1095px
          backgroundColor: '#F2FAFF',
        }}
      />
    </div>
  );
};
