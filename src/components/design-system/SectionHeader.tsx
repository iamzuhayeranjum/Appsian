import React from 'react';
import { EyebrowPill } from './EyebrowPill';
import { Headline } from './Headline';
import { HeadlineSegment } from './types';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  eyebrow?: React.ReactNode;
  headline: HeadlineSegment[] | string;
  sub?: React.ReactNode;
  theme?: 'light' | 'dark';
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  headline,
  sub,
  theme = 'light',
  align = 'center',
  className = '',
}) => {
  const isCenter = align === 'center';

  const segments: HeadlineSegment[] =
    typeof headline === 'string'
      ? [{ text: headline, weight: 'strong' }]
      : headline;

  return (
    <div
      className={`flex flex-col ${
        isCenter ? 'items-center text-center' : 'items-start text-left'
      } mb-12 sm:mb-16 ${className}`}
    >
      {eyebrow && (
        <Reveal delay={0} className="mb-4">
          {typeof eyebrow === 'string' ? (
            <EyebrowPill theme={theme}>{eyebrow}</EyebrowPill>
          ) : (
            eyebrow
          )}
        </Reveal>
      )}

      <Headline
        as="h2"
        segments={segments}
        theme={theme}
        className="max-w-2xl mb-4"
      />

      {sub && (
        <Reveal delay={0.15}>
          <p
            className={`text-[15px] sm:text-[16px] leading-[24px] max-w-xl ${
              theme === 'dark' ? 'text-[#9A9EA8]' : 'text-[#5B5F68]'
            }`}
          >
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
};
