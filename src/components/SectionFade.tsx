import React from 'react';

interface SectionFadeProps {
  fadeTo?: string;
  height?: number | string;
  zIndex?: number;
  position?: 'bottom' | 'top';
}

export const SectionFade: React.FC<SectionFadeProps> = ({
  fadeTo = '#F5F6F7',
  height = 150,
  zIndex = 1,
  position = 'bottom',
}) => {
  const isBottom = position === 'bottom';
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`absolute left-0 right-0 pointer-events-none ${
        isBottom ? 'bottom-0' : 'top-0'
      }`}
      style={{
        height: h,
        zIndex,
        background: isBottom
          ? `linear-gradient(to bottom, transparent 0%, ${fadeTo} 100%)`
          : `linear-gradient(to top, transparent 0%, ${fadeTo} 100%)`,
      }}
      aria-hidden="true"
    />
  );
};
