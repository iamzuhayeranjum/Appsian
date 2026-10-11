import React, { useRef, useState, useEffect, useId } from 'react';

export type CurtainVariant = 'hero' | 'blue' | 'violet' | 'getting-started';

export interface CurtainBackgroundProps {
  variant?: CurtainVariant;
  offset?: number;
  className?: string;
  baseGradient?: string;
  children?: React.ReactNode;
}

// Band length cycle as specified: 55%, 85%, 65%, 90%, 60%, 75%, 50%, 80%
const BAND_LENGTHS = [0.55, 0.85, 0.65, 0.9, 0.6, 0.75, 0.5, 0.8];

export const CurtainBackground: React.FC<CurtainBackgroundProps> = ({
  variant = 'hero',
  offset = 0,
  className = '',
  baseGradient,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId().replace(/:/g, '');

  const [period, setPeriod] = useState<number>(229);
  const [isVisible, setIsVisible] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Compute period P = clamp(160px, 15vw, 260px)
  useEffect(() => {
    const updateDimensions = () => {
      const w = containerRef.current?.offsetWidth || window.innerWidth;
      const computedPeriod = Math.min(260, Math.max(160, Math.round(w * 0.15)));
      setPeriod(computedPeriod);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      mq.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // IntersectionObserver to pause animation when out of view
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
  useEffect(() => {
    if (isReducedMotion || !trackRef.current || setWidth <= 0) return;

    let animId: number;
    let lastTime: number | null = null;
    let elapsed = 0;

    // Apply initial starting offset
    const initialOffset = (offset % setWidth + setWidth) % setWidth;
    let currentX = -setWidth + initialOffset;

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

      let speed = 40;
      if (variant === 'violet') {
        speed = 35; // drifting slowly to the right at about 35px/s
      } else if (variant === 'hero' || variant === 'getting-started') {
        speed = 45;
        // Hero / Getting Started has initial speed easing: 90px/s -> 45px/s over first 1.5s
        if (elapsed < 1.5) {
          const t = elapsed / 1.5;
          const easeOut = 1 - Math.pow(1 - t, 2);
          speed = 90 - 45 * easeOut;
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
  }, [setWidth, isVisible, isReducedMotion, variant, offset]);

  // Styling tokens per variant
  const getBaseGradient = () => {
    if (baseGradient) return baseGradient;
    switch (variant) {
      case 'blue':
        return 'linear-gradient(180deg, #04060F 0%, #070B2A 14%, #14246E 30%, #2F55B0 50%, #5E9BE6 68%, #A5D9F8 86%, #D6F3FF 100%)';
      case 'violet':
        return 'linear-gradient(180deg, #08070D 0%, #1B1850 30%, #4B47B0 55%, #7C7DBE 75%, #9199D7 100%)';
      case 'getting-started':
        return 'linear-gradient(180deg, #050507 0px, #050507 160px, #0D0D2E 340px, #1C1966 540px, #363098 860px, #4B47B0 1200px, #6467CE 1560px, #7A7BE6 1900px, #98A9FB 2180px, #A9C8FB 2400px, #CDEAFF 2600px, #EAF7FF 100%)';
      case 'hero':
      default:
        return 'linear-gradient(180deg, #050507 0%, #050507 14%, #1C1966 26%, #4B47B0 38%, #7A7BE6 56%, #98A9FB 68%, #A9C8FB 82%, #CDEAFF 94%, #EAF7FF 100%)';
    }
  };

  const getBandColor = () => {
    switch (variant) {
      case 'blue':
        return 'rgba(18, 28, 120, 0.7)';
      case 'violet':
        return 'rgba(36, 30, 150, 0.7)';
      case 'getting-started':
      case 'hero':
      default:
        return 'rgba(36, 30, 150, 0.85)';
    }
  };

  const getBandBlur = () => {
    return variant === 'hero' || variant === 'getting-started' ? 'blur(12px)' : 'blur(16px)';
  };

  const getHairlineGradient = () => {
    switch (variant) {
      case 'blue':
        return 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.20) 40%, rgba(255,255,255,0.06) 100%)';
      case 'violet':
        return 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.06) 100%)';
      case 'getting-started':
      case 'hero':
      default:
        return 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 40%, rgba(255,255,255,0.12) 100%)';
    }
  };

  const renderPeriodSet = (setIndex: number) => (
    <div key={`set-${setIndex}`} className="flex h-full shrink-0" style={{ width: `${setWidth}px` }}>
      {BAND_LENGTHS.map((lengthRatio, i) => {
        const isEven = (setIndex * 8 + i) % 2 === 0;

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

            {/* a) Soft dark tapering band */}
            <div
              className="absolute top-0 pointer-events-none rounded-b-[24px]"
              style={{
                left: '0%',
                width: '22%',
                height: `${Math.round(lengthRatio * 100)}%`,
                background: `linear-gradient(90deg, transparent 0%, ${getBandColor()} 50%, transparent 100%)`,
                maskImage:
                  'linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(180deg, #000 0%, #000 55%, rgba(0,0,0,0.5) 80%, transparent 100%)',
                filter: getBandBlur(),
              }}
            />

            {/* b) 1px hairline immediately to the right of the band (at ~19% of P) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none w-[1px]"
              style={{
                left: '19%',
                background: getHairlineGradient(),
              }}
            />
          </div>
        );
      })}
    </div>
  );

  const backgroundLayers = (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      style={{ contain: 'strict' }}
    >
      {/* 1) BASE GRADIENT */}
      <div
        className="absolute inset-0"
        style={{
          background: getBaseGradient(),
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
      {variant === 'hero' || variant === 'getting-started' ? (
        <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden h-[450px]">
          <div className="w-full h-full animate-organic-breathe origin-top">
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 450"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <filter id={`organicTopFeather-${uniqueId}`} x="-10%" y="-10%" width="120%" height="130%">
                  <feGaussianBlur stdDeviation="20" />
                </filter>
              </defs>
              <path
                d="M 0 0 L 1440 0 L 1440 164 C 1220 175, 1100 240, 960 320 C 860 365, 750 360, 640 295 C 500 215, 260 160, 0 164 Z"
                fill="#050507"
                filter={`url(#organicTopFeather-${uniqueId})`}
              />
              <rect x="0" y="0" width="1440" height="120" fill="#050507" />
            </svg>
          </div>
        </div>
      ) : (
        /* Shallower organic top for blue and violet bands (12-16% of container height) */
        <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden h-[110px]">
          <div className="w-full h-full animate-organic-breathe origin-top">
            <svg
              className="w-full h-full"
              viewBox="0 0 1440 110"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <filter id={`organicTopFeather-${uniqueId}`} x="-10%" y="-10%" width="120%" height="130%">
                  <feGaussianBlur stdDeviation="14" />
                </filter>
              </defs>
              <path
                d="M 0 0 L 1440 0 L 1440 40 C 1220 48, 1080 70, 940 85 C 840 95, 740 92, 620 75 C 480 55, 260 42, 0 45 Z"
                fill={variant === 'blue' ? '#04060F' : '#08070D'}
                filter={`url(#organicTopFeather-${uniqueId})`}
              />
              <rect x="0" y="0" width="1440" height="30" fill={variant === 'blue' ? '#04060F' : '#08070D'} />
            </svg>
          </div>
        </div>
      )}

      {/* 4) BOTTOM GLOW (stays cleanly inside container bounds) */}
      {variant === 'hero' || variant === 'getting-started' ? (
        <>
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '240px',
              background:
                'radial-gradient(ellipse 45% 22% at 45% 100%, rgba(217,244,255,0.9), transparent 70%)',
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '21.9px',
              backgroundColor: '#F2FAFF',
            }}
          />
        </>
      ) : variant === 'blue' ? (
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '180px',
            background:
              'radial-gradient(ellipse 55% 30% at 50% 100%, rgba(165, 217, 248, 0.7), transparent 70%)',
          }}
        />
      ) : (
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '160px',
            background:
              'radial-gradient(ellipse 55% 30% at 50% 100%, rgba(145, 153, 215, 0.5), transparent 70%)',
          }}
        />
      )}
    </div>
  );

  if (children) {
    return (
      <div className={`relative overflow-clip ${className}`}>
        {backgroundLayers}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }

  return backgroundLayers;
};
