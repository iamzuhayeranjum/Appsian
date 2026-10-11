import React from 'react';
import { ArrowUp } from 'lucide-react';
import { content } from '../content';

export const Footer: React.FC = () => {
  const { footer } = content;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#F5F6F7] pt-12 pb-[140px] flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-[1187px] flex flex-col gap-10">
        {/* Top row: Tagline at left (15px, #5B5F68), Back to top button at right (8px radius) */}
        <div className="flex items-center justify-between">
          <p className="text-[15px] text-[#5B5F68] font-normal tracking-tight">
            {footer.tagline}
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="h-[36px] px-3.5 rounded-[8px] bg-white text-[#5B5F68] hover:text-[#0B0B0F] border border-[rgba(11,11,15,0.08)] text-[13px] font-[500] shadow-1 hover:shadow-2 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* The 'Appsian' wordmark and logo mark are horizontally CENTERED and scaled so the lockup spans the full 1187px content width, about 255px tall. Gradient #4A7BEE to #BFF6FB */}
        <div className="w-full flex items-center justify-center overflow-hidden py-2 select-none">
          <svg
            viewBox="0 0 1187 255"
            className="w-full h-auto max-h-[255px] overflow-visible"
            fill="none"
          >
            <defs>
              <linearGradient id="footerWordmarkGrad" x1="0" y1="0" x2="1187" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A7BEE" />
                <stop offset="100%" stopColor="#BFF6FB" />
              </linearGradient>
            </defs>

            {/* Centered Lockup: Logo Mark + Appsian Text */}
            <g transform="translate(30, 15)">
              {/* Logo mark matching the video's faceted geometric ring */}
              <g transform="translate(0, 12)">
                <polygon
                  points="90,8 172,55 172,145 90,192 8,145 8,55"
                  stroke="url(#footerWordmarkGrad)"
                  strokeWidth="28"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  fill="none"
                />
                <polygon
                  points="90,62 134,100 90,138 46,100"
                  stroke="url(#footerWordmarkGrad)"
                  strokeWidth="14"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>

              {/* Text: Appsian with tight letter-spacing in Instrument Sans */}
              <text
                x="220"
                y="172"
                fontFamily="'Instrument Sans', Inter, 'Helvetica Neue', Arial, sans-serif"
                fontSize="205"
                fontWeight="500"
                letterSpacing="-0.04em"
                fill="url(#footerWordmarkGrad)"
              >
                Appsian
              </text>
            </g>
          </svg>
        </div>

        {/* Legal bar: 1187px wide, 14px radius, #FFFFFF with hairline border and shadow-1 */}
        <div className="w-full h-[56px] bg-white border border-[rgba(11,11,15,0.08)] rounded-[14px] px-6 sm:px-8 flex items-center justify-between gap-4 shadow-1">
          {/* Legal links and copyright at left */}
          <div className="text-xs sm:text-[13px] text-[#5B5F68] font-normal truncate">
            <span>Privacy Policy</span>
            <span className="mx-2 text-[#9A9EA8]">·</span>
            <span>Terms of Service</span>
            <span className="mx-2 text-[#9A9EA8]">·</span>
            <span>©2026 Appsian. All Rights Reserved.</span>
          </div>

          {/* Colored social icons at right separated by thin vertical dividers */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#0A66C2] hover:opacity-80 transition-opacity p-1 rounded-[6px] hover:bg-[#F5F6F7]"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <div className="w-[1px] h-3.5 bg-[rgba(11,11,15,0.08)]" />

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#FF0000] hover:opacity-80 transition-opacity p-1 rounded-[6px] hover:bg-[#F5F6F7]"
              aria-label="YouTube"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L22 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 22c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
              </svg>
            </a>
            <div className="w-[1px] h-3.5 bg-[rgba(11,11,15,0.08)]" />

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#E4405F] hover:opacity-80 transition-opacity p-1 rounded-[6px] hover:bg-[#F5F6F7]"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <div className="w-[1px] h-3.5 bg-[rgba(11,11,15,0.08)]" />

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-[#0B0B0F] hover:opacity-80 transition-opacity p-1 rounded-[6px] hover:bg-[#F5F6F7]"
              aria-label="X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
