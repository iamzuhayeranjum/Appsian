import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { content } from '../content';

// The footer artwork lives in /public. It already contains the "Appsian" wordmark.
const FOOTER_IMAGE = '/appsian-footer.jpg';

// Shown behind the image (and on its own if the image file is missing).
const FALLBACK_BG =
  'linear-gradient(180deg, #02030A 0%, #03112E 28%, #0540C8 58%, #0A74FF 80%, #19C2FF 100%)';

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
  const [imgFailed, setImgFailed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Page-gray frame (matches the hero frame). Extra bottom padding keeps the legal bar clear of the floating dock.
    <footer className="w-full bg-[#F5F6F8] px-2 md:px-[14px] pt-16 pb-[110px]">
      <h2 className="sr-only">Appsian</h2>

      <div className="relative w-full max-w-[1920px] mx-auto">
        {/* Artwork box: rounded like the hero box. Under 1024px it is just the image (no overlay). */}
        <div
          className="relative w-full overflow-clip rounded-[28px] lg:rounded-[48px] lg:aspect-[2172/724] lg:min-h-[420px]"
          style={{ background: FALLBACK_BG }}
        >
          {!imgFailed ? (
            <img
              src={FOOTER_IMAGE}
              alt=""
              aria-hidden="true"
              width={2172}
              height={724}
              loading="lazy"
              decoding="async"
              draggable={false}
              onError={() => setImgFailed(true)}
              className="block w-full h-auto lg:absolute lg:inset-0 lg:h-full lg:object-cover select-none"
            />
          ) : (
            <div className="h-[170px] lg:hidden" aria-hidden="true" />
          )}
        </div>

        {/* Text layer: sits over the artwork from 1024px up, stacked under it on smaller screens */}
        <div className="flex flex-col gap-4 pt-5 lg:pt-0 lg:absolute lg:inset-0 lg:justify-between lg:p-8">
          {/* Top row: tagline left, Back to top right */}
          <div className="flex items-center justify-between gap-4">
            <p className="text-[15px] font-normal tracking-tight text-[#5B5F68] lg:text-white/75">
              {footer.tagline}
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="h-9 px-3.5 rounded-[10px] text-[13px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors bg-white text-[#5B5F68] border border-[rgba(11,11,15,0.08)] hover:text-[#0B0B0F] lg:bg-white/10 lg:text-white lg:border-white/25 lg:hover:bg-white/20 lg:backdrop-blur-xl"
            >
              <span>{footer.backToTop}</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Legal bar: white card on small screens, frosted glass over the artwork on large screens */}
          <div className="w-full min-h-[56px] rounded-[14px] px-5 lg:px-8 py-3 flex items-center justify-between gap-4 bg-white border border-[rgba(11,11,15,0.08)] text-[#5B5F68] lg:bg-white/10 lg:border-white/20 lg:text-white/80 lg:backdrop-blur-xl lg:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[13px] font-normal">
              <span>Privacy Policy</span>
              <span className="text-[#9A9EA8] lg:text-white/40">·</span>
              <span>Terms of Service</span>
              <span className="text-[#9A9EA8] lg:text-white/40">·</span>
              <span>©2026 Appsian. All Rights Reserved.</span>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {SOCIALS.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && (
                    <div className="w-[1px] h-3.5 bg-[rgba(11,11,15,0.08)] lg:bg-white/20" />
                  )}
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="p-1 rounded-[6px] text-[#5B5F68] hover:text-[#0B0B0F] lg:text-white/80 lg:hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d={s.path} />
                    </svg>
                  </a>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
