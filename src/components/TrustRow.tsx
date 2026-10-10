import React from 'react';
import { content } from '../content';
import { Card, SectionHeader, Reveal, EyebrowPill } from './design-system';

export const TrustRow: React.FC = () => {
  const { trustRow } = content;

  // Geometric line-art icons (48px, 1px stroke)
  const icons = [
    (
      <svg
        className="w-10 h-10 text-[#0B0B0F]"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <rect x="12" y="12" width="24" height="24" transform="rotate(45 24 24)" />
        <rect x="15" y="15" width="18" height="18" />
        <circle cx="24" cy="24" r="5" />
        <line x1="24" y1="4" x2="24" y2="44" />
        <line x1="4" y1="24" x2="44" y2="24" />
      </svg>
    ),
    (
      <svg
        className="w-10 h-10 text-[#0B0B0F]"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="24" cy="24" r="18" />
        <ellipse cx="24" cy="24" rx="18" ry="7" />
        <ellipse cx="24" cy="24" rx="18" ry="13" />
        <line x1="24" y1="6" x2="24" y2="42" />
      </svg>
    ),
    (
      <svg
        className="w-10 h-10 text-[#0B0B0F]"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <polygon points="24,6 40,15 40,33 24,42 8,33 8,15" />
        <line x1="24" y1="6" x2="24" y2="24" />
        <line x1="40" y1="15" x2="24" y2="24" />
        <line x1="8" y1="15" x2="24" y2="24" />
        <line x1="24" y1="24" x2="24" y2="42" />
        <circle cx="24" cy="24" r="2.5" />
      </svg>
    ),
  ];

  return (
    <section className="w-full pb-[120px] bg-[#F5F6F7]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <SectionHeader
          eyebrow={<EyebrowPill>Principles</EyebrowPill>}
          headline={[
            { text: trustRow.h2Line1, weight: 'light' },
            { text: trustRow.h2Line2, weight: 'strong' },
          ]}
        />

        {/* Three Card columns (20px radius, shadow-1, 4px hover lift) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustRow.columns.map((col, idx) => (
            <Reveal key={col.title} delay={0.1 * idx}>
              <Card className="p-8 h-full flex flex-col items-start text-left">
                <div className="mb-6 p-2.5 rounded-[12px] bg-[#F5F6F7] border border-[rgba(11,11,15,0.06)] shadow-xs">
                  {icons[idx]}
                </div>

                <h3 className="text-[20px] font-display font-[500] text-[#0B0B0F] tracking-tight mb-2">
                  {col.title}
                </h3>

                <p className="text-[15px] leading-[24px] text-[#5B5F68]">
                  {col.blurb}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
