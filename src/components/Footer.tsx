import React, { useState, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { content } from '../content';

// Direct footer artwork containing the "Appsian" wordmark and blue glowing streaks
const FOOTER_IMAGE = 'https://i.ibb.co.com/VpYWytwb/8d575d99-c8d3-44f1-8166-906c84c632a9.png';
const LOCAL_FOOTER_IMAGE = '/appsian-footer.png';

const SOCIALS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    label: 'X',
    href: 'https://x.com',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
];

export const Footer: React.FC = () => {
  const { footer } = content;
  const footerRef = useRef<HTMLElement>(null);
  const [imgSrc, setImgSrc] = useState(FOOTER_IMAGE);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== LOCAL_FOOTER_IMAGE) {
      setImgSrc(LOCAL_FOOTER_IMAGE);
    } else {
      setImgFailed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full min-h-screen min-h-[100svh] bg-[#050608] overflow-hidden flex flex-col justify-between m-0 p-0 rounded-none border-0 select-none font-['Inter',sans-serif] z-[95]"
      style={
        {
          width: '100%',
          '--wm-crop-top': '0.206',
          '--wm-letters-ratio': '0.59',
        } as React.CSSProperties
      }
    >
      <h2 className="sr-only">Appsian</h2>

      {/* ── VERTICAL FLOW: Top row -> Tagline -> Cropped & Scaled Wordmark ── */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* 1. Top row (Terms of Service / Copyright / Privacy Policy) */}
        <div className="w-full pt-[56px] px-6 md:px-[clamp(24px,6vw,120px)]">
          <div className="w-full max-w-[1920px] mx-auto">
            {/* Mobile Layout (< 768px) */}
            <div className="flex md:hidden flex-col items-center text-center gap-2.5">
              <span className="text-[14px] text-white/90 tracking-tight font-medium">
                ©2026 Appsian. All Rights Reserved.
              </span>
              <div className="flex items-center justify-center gap-5 text-[14px] text-white/88">
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <span className="text-white/40">·</span>
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>

            {/* Desktop Layout (>= 768px): 3-column grid */}
            <div className="hidden md:grid grid-cols-3 items-center w-full text-[15px] font-normal tracking-tight text-white/88">
              <div className="text-left">
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </div>
              <div className="text-center text-white/85">
                ©2026 Appsian. All Rights Reserved.
              </div>
              <div className="text-right">
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="hover:underline hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tagline (64px space above on desktop, 40px on mobile) */}
        <p className="mt-10 md:mt-16 text-[16px] leading-normal text-white/60 tracking-tight text-center max-w-xl px-4">
          {footer.tagline}
        </p>

        {/* 3. Wordmark wrapper with exact tight gap (40px desktop, 28px mobile) */}
        {/* Crops empty space above glyphs via aspect-ratio + object-position bottom */}
        {/* Scales wrapper so visible letters span 78% on desktop */}
        <div className="relative w-full mt-7 md:mt-10 pointer-events-none select-none">
          <style>{`
            .wm-crop-wrapper {
              width: calc(94% / var(--wm-letters-ratio, 0.59));
              aspect-ratio: calc(2172 / (724 * (1 - var(--wm-crop-top, 0.206))));
            }
            @media (min-width: 768px) {
              .wm-crop-wrapper {
                width: calc(78% / var(--wm-letters-ratio, 0.59));
              }
            }
          `}</style>
          <div className="wm-crop-wrapper relative left-1/2 -translate-x-1/2 overflow-hidden">
            {!imgFailed && (
              <img
                src={imgSrc}
                onError={handleImageError}
                alt="Appsian"
                width={2172}
                height={724}
                loading="eager"
                draggable={false}
                className="w-full h-full object-cover object-bottom"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: Back to Top (Left) & Social Icons (Right) ────────── */}
      {/* Positioned above the dock blur, fully sharp and clickable */}
      <div className="relative z-20 w-full pointer-events-none pb-[120px] md:pb-8">
        {/* BACK TO TOP PILL */}
        <div className="pointer-events-auto absolute z-5 md:left-[clamp(24px,4vw,56px)] md:bottom-6 bottom-[104px] left-1/2 -translate-x-1/2 md:translate-x-0">
          <button
            type="button"
            onClick={scrollToTop}
            className="btn-premium btn-premium--dark btn-glitter group h-[44px] rounded-full pl-[7px] pr-4 py-[7px] flex items-center gap-2.5 cursor-pointer"
            aria-label="Back to top"
          >
            <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <ArrowUp className="w-3.5 h-3.5 text-[#0A0A0A] stroke-[2.5]" />
            </span>
            <span className="text-[14px] font-medium text-white tracking-tight">
              Back to Top
            </span>
          </button>
        </div>

        {/* SOCIAL ICONS PILL */}
        <div className="pointer-events-auto absolute z-5 md:right-[clamp(24px,4vw,56px)] md:bottom-6 bottom-[160px] left-1/2 -translate-x-1/2 md:translate-x-0">
          <div className="h-[44px] bg-white/[0.08] backdrop-blur-md border border-white/[0.18] rounded-full px-4 flex items-center gap-[14px] shadow-lg">
            {SOCIALS.map((s, idx) => (
              <React.Fragment key={s.label}>
                {idx > 0 && (
                  <span className="w-[1px] h-3 bg-white/20" aria-hidden="true" />
                )}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-[18px] h-[18px] flex items-center justify-center text-white/80 hover:text-white hover:opacity-100 transition-all duration-150"
                >
                  <svg
                    className="w-[18px] h-[18px] fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
