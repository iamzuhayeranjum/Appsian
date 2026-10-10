import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HeadlineSegment } from './types';

interface HeadlineProps {
  as?: 'h1' | 'h2' | 'h3';
  segments: HeadlineSegment[];
  className?: string;
  theme?: 'light' | 'dark';
}

export const Headline: React.FC<HeadlineProps> = ({
  as = 'h2',
  segments,
  className = '',
  theme = 'light',
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  const sizeClasses = {
    h1: 'text-[36px] sm:text-[44px] md:text-[48px] leading-[1.08]',
    h2: 'text-[28px] sm:text-[34px] md:text-[40px] leading-[1.1]',
    h3: 'text-[18px] sm:text-[20px] md:text-[22px] leading-[1.25]',
  }[as];

  const Tag = as;

  // Flatten words with their weight
  const wordsWithWeight = segments.flatMap((segment) =>
    segment.text.split(' ').filter(Boolean).map((word) => ({
      word,
      weight: segment.weight,
    }))
  );

  return (
    <Tag
      className={`font-display tracking-[-0.03em] ${sizeClasses} ${className}`}
      style={{ textWrap: 'balance' }}
    >
      {wordsWithWeight.map((item, index) => {
        const isStrong = item.weight === 'strong';
        const colorClass =
          theme === 'dark'
            ? isStrong
              ? 'text-[#F4F5F7] font-[500]'
              : 'text-[#9A9EA8]/80 font-[300]'
            : isStrong
            ? 'text-[#0B0B0F] font-[500]'
            : 'text-[#5B5F68]/80 font-[300]';

        if (reducedMotion) {
          return (
            <span key={index} className={`inline-block mr-[0.28em] ${colorClass}`}>
              {item.word}
            </span>
          );
        }

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.7,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-block mr-[0.28em] ${colorClass}`}
          >
            {item.word}
          </motion.span>
        );
      })}
    </Tag>
  );
};
