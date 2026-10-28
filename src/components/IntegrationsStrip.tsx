import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface IntegrationItem {
  name: string;
  file: string;
  scale?: number;
}

const INTEGRATIONS: IntegrationItem[] = [
  { name: 'Salesforce', file: 'image-4.svg' },
  { name: 'GoHighLevel', file: 'image-5.svg' },
  { name: 'HubSpot', file: 'image-6.svg' },
  { name: 'Calendly', file: 'image-7.svg' },
  { name: 'Google Calendar', file: 'image-8.svg' },
  { name: 'Cal.com', file: 'cal-com-logo.svg' },
  { name: 'Zoho CRM', file: 'zoho-crm-logo.svg' },
  { name: 'Zendesk', file: 'zendesk-mark.svg' },
];

export const IntegrationsStrip: React.FC = () => {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isMobilePaused, setIsMobilePaused] = useState(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stripRef, { once: true, margin: '-80px' });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const rawBase = import.meta.env.BASE_URL || '/';
  const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const getLogoSrc = (file: string) => `${baseUrl}logos/${file}`;

  const handleImageError = (name: string, src: string) => {
    console.warn(`[Integrations] Logo failed to load: ${src}`);
    setFailedImages((prev) => ({ ...prev, [name]: true }));
  };

  const renderLogo = (item: IntegrationItem) => {
    const src = getLogoSrc(item.file);
    const isFailed = failedImages[item.name];

    if (isFailed) {
      return (
        <span className="text-[14px] font-semibold text-[#374151] select-none text-center px-2 leading-tight">
          {item.name}
        </span>
      );
    }

    return (
      <img
        src={src}
        alt={item.name}
        loading="lazy"
        decoding="async"
        draggable={false}
        width={120}
        height={56}
        onError={() => handleImageError(item.name, src)}
        style={{
          maxWidth: '120px',
          maxHeight: '56px',
          objectFit: 'contain',
          transform: `scale(${item.scale ?? 1})`,
        }}
        className="w-auto h-auto transition-transform duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:-translate-y-1 select-none"
      />
    );
  };

  // Node & divider distance from center (center index is 4)
  const getNodeDelay = (i: number) => {
    const dist = Math.abs(i - 4);
    return 0.28 + dist * 0.05;
  };

  return (
    <section
      id="integrations"
      className="w-full bg-[#F5F6F8] pt-[72px] md:pt-[96px] pb-0 overflow-x-clip select-none"
    >
      {/* Centered Header */}
      <div className="max-w-[1248px] mx-auto px-4 text-center mb-12 md:mb-16">
        <p className="text-[12px] font-semibold tracking-[0.14em] uppercase text-[#6b7280]">
          Works with your existing software
        </p>
        <h2 className="mt-2.5 text-[clamp(18px,2vw,24px)] font-medium text-[#0b1530] tracking-[-0.01em] max-w-[640px] mx-auto leading-snug">
          Zero setup changes to your phone number or CRM
        </h2>
      </div>

      {/* STRIP CONTAINER */}
      <div ref={stripRef} className="w-full relative">
        {/* ========================================================================= */}
        {/* DESKTOP VIEW (md and up: 768px+)                                          */}
        {/* ========================================================================= */}
        <div
          className="hidden md:block w-full relative"
          style={{ '--cell-w': 'clamp(96px, 12.5vw, 160px)' } as React.CSSProperties}
        >
          {/* Top Line: Edge to Edge with Traveling Light */}
          <div className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none z-10 overflow-hidden">
            <motion.div
              initial={reduceMotion ? false : { scaleX: 0 }}
              animate={isInView || reduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'center' }}
              className="w-full h-full bg-[rgba(15,23,42,0.09)]"
            />
            {/* Traveling Light Bar: 140px long, 1px tall gradient */}
            {!reduceMotion && (
              <div
                className="integrations-traveling-light absolute top-0 left-0 w-[140px] h-[1px] bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.75)] to-transparent pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Centered 8-Cell Grid Wrapper */}
          <div className="relative mx-auto w-[calc(var(--cell-w)*8)] max-w-full">
            {/* 9 Vertical Dividers & 9 Nodes Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <React.Fragment key={i}>
                  {/* Vertical Divider Line with Bottom Fade */}
                  <motion.div
                    initial={reduceMotion ? false : { scaleY: 0 }}
                    animate={isInView || reduceMotion ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{
                      delay: reduceMotion ? 0 : getNodeDelay(i) + 0.04,
                      duration: reduceMotion ? 0 : 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      left: `calc(var(--cell-w) * ${i})`,
                      transformOrigin: 'top',
                      maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                    }}
                    className="absolute top-0 bottom-0 w-[1px] bg-[rgba(15,23,42,0.07)] -translate-x-1/2 pointer-events-none"
                  />

                  {/* Hollow Circle Node Centered on Top Line and Divider */}
                  <motion.div
                    initial={reduceMotion ? false : { scale: 0 }}
                    animate={isInView || reduceMotion ? { scale: 1 } : { scale: 0 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : {
                            delay: getNodeDelay(i),
                            type: 'spring',
                            stiffness: 450,
                            damping: 24,
                          }
                    }
                    style={{
                      left: `calc(var(--cell-w) * ${i})`,
                    }}
                    className="absolute top-0 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-20"
                  />
                </React.Fragment>
              ))}
            </div>

            {/* 8 Integration Cells */}
            <ul className="relative z-10 w-[calc(var(--cell-w)*8)] grid grid-cols-8 mx-auto list-none p-0 m-0">
              {INTEGRATIONS.map((item, idx) => (
                <li
                  key={item.name}
                  className="w-[var(--cell-w)] h-[clamp(160px,16vw,184px)] relative flex items-center justify-center pt-5 group cursor-default transition-colors duration-250 hover:bg-white/60"
                >
                  {/* Blue Hover Dot at Center of Cell on Top Line */}
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full bg-[#3b82f6] shadow-[0_0_0_4px_rgba(59,130,246,0.18)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30"
                    aria-hidden="true"
                  />

                  {/* Logo Container with Entrance Animation */}
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={isInView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.42 + idx * 0.06,
                      duration: reduceMotion ? 0 : 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="max-w-[120px] max-h-[56px] flex items-center justify-center"
                  >
                    {renderLogo(item)}
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (below 768px): Infinite Smooth Marquee or Scroll-Snap          */}
        {/* ========================================================================= */}
        <div
          className="block md:hidden w-full overflow-hidden relative"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent)',
          }}
          onTouchStart={() => setIsMobilePaused(true)}
          onTouchEnd={() => setIsMobilePaused(false)}
        >
          {reduceMotion ? (
            /* Reduced Motion: Horizontal Scroll-Snap Container */
            <ul className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full list-none p-0 m-0">
              {INTEGRATIONS.map((item, idx) => (
                <li
                  key={item.name}
                  className="w-[120px] h-[140px] shrink-0 relative flex items-center justify-center pt-5 snap-center"
                >
                  {/* Top Line Segment */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(15,23,42,0.09)] pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Left Divider Line */}
                  <div
                    style={{
                      maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                    }}
                    className="absolute top-0 bottom-0 left-0 w-[1px] bg-[rgba(15,23,42,0.07)] pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Left Node */}
                  <div
                    className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-10"
                    aria-hidden="true"
                  />

                  {/* Closing Divider on last item */}
                  {idx === INTEGRATIONS.length - 1 && (
                    <>
                      <div
                        style={{
                          maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                          WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                        }}
                        className="absolute top-0 bottom-0 right-0 w-[1px] bg-[rgba(15,23,42,0.07)] pointer-events-none"
                        aria-hidden="true"
                      />
                      <div
                        className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-10"
                        aria-hidden="true"
                      />
                    </>
                  )}

                  <div className="max-w-[100px] max-h-[48px] flex items-center justify-center">
                    {renderLogo(item)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            /* Standard: 36s Infinite Marquee with Duplicated List */
            <div
              className={`integrations-marquee-track ${isMobilePaused ? 'is-paused' : ''}`}
            >
              {/* Primary List */}
              <ul className="flex list-none p-0 m-0 shrink-0">
                {INTEGRATIONS.map((item) => (
                  <li
                    key={item.name}
                    className="w-[120px] h-[140px] shrink-0 relative flex items-center justify-center pt-5"
                  >
                    {/* Top Line Segment */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(15,23,42,0.09)] pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Left Divider Line */}
                    <div
                      style={{
                        maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                      }}
                      className="absolute top-0 bottom-0 left-0 w-[1px] bg-[rgba(15,23,42,0.07)] pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Left Node */}
                    <div
                      className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    <div className="max-w-[100px] max-h-[48px] flex items-center justify-center">
                      {renderLogo(item)}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Duplicate List for Seamless 36s Loop */}
              <ul className="flex list-none p-0 m-0 shrink-0" aria-hidden="true">
                {INTEGRATIONS.map((item, idx) => (
                  <li
                    key={`dup-${item.name}-${idx}`}
                    className="w-[120px] h-[140px] shrink-0 relative flex items-center justify-center pt-5"
                  >
                    {/* Top Line Segment */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[1px] bg-[rgba(15,23,42,0.09)] pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Left Divider Line */}
                    <div
                      style={{
                        maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                      }}
                      className="absolute top-0 bottom-0 left-0 w-[1px] bg-[rgba(15,23,42,0.07)] pointer-events-none"
                      aria-hidden="true"
                    />

                    {/* Left Node */}
                    <div
                      className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-10"
                      aria-hidden="true"
                    />

                    {/* Closing divider for right edge of duplicate list */}
                    {idx === INTEGRATIONS.length - 1 && (
                      <>
                        <div
                          style={{
                            maskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent 100%)',
                          }}
                          className="absolute top-0 bottom-0 right-0 w-[1px] bg-[rgba(15,23,42,0.07)] pointer-events-none"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full border border-[rgba(15,23,42,0.18)] bg-[#F5F6F8] pointer-events-none z-10"
                          aria-hidden="true"
                        />
                      </>
                    )}

                    <div className="max-w-[100px] max-h-[48px] flex items-center justify-center">
                      {renderLogo(item)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
