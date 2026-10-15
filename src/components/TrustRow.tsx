import React from 'react';
import { content } from '../content';
import { SectionHeader, Reveal, EyebrowPill } from './design-system';

// ---------------------------------------------------------------------------
// Glossy "glass" icons (inline SVG, 96x96). Each has a soft shadow, a coloured
// body and a white gloss highlight, like the 3D icons in the reference.
// ---------------------------------------------------------------------------

const IconAlwaysOn: React.FC = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="tr-blue-body" x1="20" y1="10" x2="76" y2="86" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#A9D6FF" />
        <stop offset="0.55" stopColor="#56A2FF" />
        <stop offset="1" stopColor="#2F6FEA" />
      </linearGradient>
      <linearGradient id="tr-blue-gloss" x1="48" y1="14" x2="48" y2="52" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="tr-blue-shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    <ellipse cx="48" cy="86" rx="24" ry="5" fill="#2F6FEA" opacity="0.28" filter="url(#tr-blue-shadow)" />
    <circle cx="48" cy="46" r="34" fill="url(#tr-blue-body)" />
    <circle cx="48" cy="46" r="34" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="1.5" />
    <circle cx="48" cy="46" r="24" fill="#FFFFFF" fillOpacity="0.30" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.5" />
    <path d="M48 33v14.5l9.5 6" stroke="#0E3C94" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="48" cy="46" r="3" fill="#0E3C94" />
    <path d="M20 40c2-14 14-24 28-24s26 10 28 24c-8-8-18-11-28-11s-20 3-28 11z" fill="url(#tr-blue-gloss)" />
  </svg>
);

const IconHuman: React.FC = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="tr-orange-body" x1="40" y1="30" x2="76" y2="86" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFE0BE" />
        <stop offset="0.5" stopColor="#FFB874" />
        <stop offset="1" stopColor="#FF8F3F" />
      </linearGradient>
      <linearGradient id="tr-orange-gloss" x1="58" y1="32" x2="58" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="tr-ghost" x1="20" y1="14" x2="44" y2="72" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#4A4F5C" stopOpacity="0.55" />
        <stop offset="1" stopColor="#1F232D" stopOpacity="0.85" />
      </linearGradient>
      <filter id="tr-orange-shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    <ellipse cx="50" cy="86" rx="26" ry="5" fill="#FF8F3F" opacity="0.28" filter="url(#tr-orange-shadow)" />
    {/* back person: dark glass */}
    <circle cx="35" cy="28" r="12" fill="url(#tr-ghost)" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
    <path d="M12 72c0-14 9-22 23-22s23 8 23 22v2H12v-2z" fill="url(#tr-ghost)" stroke="#FFFFFF" strokeOpacity="0.45" strokeWidth="1.2" />
    {/* front person: orange glass */}
    <circle cx="58" cy="36" r="13" fill="url(#tr-orange-body)" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.5" />
    <path d="M32 80c0-15 11-24 26-24s26 9 26 24v2H32v-2z" fill="url(#tr-orange-body)" stroke="#FFFFFF" strokeOpacity="0.8" strokeWidth="1.5" />
        <path d="M40 66c4-6 10-8 18-8s14 2 18 8c-6-3-12-4-18-4s-12 1-18 4z" fill="url(#tr-orange-gloss)" />
  </svg>
);

const IconRules: React.FC = () => (
  <svg viewBox="0 0 96 96" className="w-full h-full" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="tr-mint-body" x1="18" y1="14" x2="78" y2="82" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#D2FBEA" />
        <stop offset="0.5" stopColor="#7DEFC6" />
        <stop offset="1" stopColor="#35CE9C" />
      </linearGradient>
      <linearGradient id="tr-mint-gloss" x1="48" y1="14" x2="48" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id="tr-mint-shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
    <ellipse cx="48" cy="86" rx="24" ry="5" fill="#35CE9C" opacity="0.32" filter="url(#tr-mint-shadow)" />
    <rect x="16" y="14" width="64" height="64" rx="20" fill="url(#tr-mint-body)" />
    <rect x="16" y="14" width="64" height="64" rx="20" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="1.5" />
    {/* three sliders = "your rules" */}
    <path d="M30 34h36M30 46h36M30 58h36" stroke="#FFFFFF" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round" />
    <circle cx="56" cy="34" r="6" fill="#0F5C46" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="38" cy="46" r="6" fill="#0F5C46" stroke="#FFFFFF" strokeWidth="2" />
    <circle cx="52" cy="58" r="6" fill="#0F5C46" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M18 40c0-14 10-24 24-24h12c14 0 24 10 24 24-8-6-18-8-30-8s-22 2-30 8z" fill="url(#tr-mint-gloss)" />
  </svg>
);

const ICONS = [IconAlwaysOn, IconHuman, IconRules];

// Soft coloured light along the bottom edge of each card (blue, orange, mint).
const GLOWS = [
  'radial-gradient(60% 100% at 50% 118%, rgba(74,127,240,0.20) 0%, rgba(74,127,240,0) 70%)',
  'radial-gradient(60% 100% at 50% 118%, rgba(255,150,70,0.22) 0%, rgba(255,150,70,0) 70%)',
  'radial-gradient(60% 100% at 50% 118%, rgba(110,237,194,0.34) 0%, rgba(110,237,194,0) 70%)',
];

// White card with a pearly gradient hairline border (darker at the top and bottom edges, like the lit edges in the reference).
const CARD_STYLE: React.CSSProperties = {
  border: '1px solid transparent',
  background:
    'linear-gradient(180deg, #FFFFFF 0%, #FBFBFC 100%) padding-box, linear-gradient(180deg, rgba(11,11,15,0.16) 0%, rgba(11,11,15,0.05) 38%, rgba(11,11,15,0.05) 62%, rgba(11,11,15,0.12) 100%) border-box',
  boxShadow:
    '0 1px 2px rgba(11,11,15,0.04), 0 24px 48px -28px rgba(11,11,15,0.18), inset 0 1px 0 rgba(255,255,255,1)',
};

// Fine dot grid, strongest at the top of the card and fading out downward.
const DOTS_STYLE: React.CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(11,11,15,0.13) 1px, transparent 1.3px)',
  backgroundSize: '14px 14px',
  WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 50% 0%, #000 0%, transparent 100%)',
  maskImage: 'radial-gradient(ellipse 80% 75% at 50% 0%, #000 0%, transparent 100%)',
};

export const TrustRow: React.FC = () => {
  const { trustRow } = content;

  return (
    <section className="w-full pb-[120px] md:pb-[152px] bg-[var(--page-gray,#F5F6F8)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow={<EyebrowPill>Principles</EyebrowPill>}
          headline={[
            { text: trustRow.h2Line1, weight: 'light' },
            { text: trustRow.h2Line2, weight: 'strong' },
          ]}
        />

        {/* Three glass cards. On desktop the middle card sits 32px higher than the two side cards. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch md:pt-8">
          {trustRow.columns.map((col, idx) => {
            const Icon = ICONS[idx];

            return (
              <div key={col.title} className={idx === 1 ? 'md:-translate-y-8' : ''}>
                <Reveal delay={0.1 * idx} className="h-full">
                  <div
                    className="group relative h-full min-h-[280px] md:min-h-[300px] overflow-hidden rounded-[28px] flex flex-col items-center justify-between text-center px-7 pt-9 pb-8 transition-transform duration-300 ease-out hover:-translate-y-1"
                    style={CARD_STYLE}
                  >
                    {/* Dot-grid texture */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={DOTS_STYLE} />
                    {/* Coloured light along the bottom edge */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] transition-opacity duration-300 opacity-80 group-hover:opacity-100"
                      style={{ background: GLOWS[idx] }}
                    />
                    {/* Pearly highlight on the top edge */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                    />

                    {/* Glossy icon */}
                    <div className="relative w-[100px] h-[100px] md:w-[116px] md:h-[116px] transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]">
                      <Icon />
                    </div>

                    {/* Title + blurb */}
                    <div className="relative mt-8">
                      <h3 className="text-[19px] leading-[1.25] font-display font-[500] text-[#0B0B0F] tracking-tight mb-2">
                        {col.title}
                      </h3>
                      <p className="text-[15px] leading-[24px] text-[#5B5F68] max-w-[300px] mx-auto md:min-h-[72px]">
                        {col.blurb}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
