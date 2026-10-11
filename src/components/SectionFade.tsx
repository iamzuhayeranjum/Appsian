import React from 'react';

interface SectionFadeProps {
  fadeTo?: string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
}

/**
 * Parses hex (#FFF, #FFFFFF), rgb(r, g, b), or CSS vars into [r, g, b]
 */
function parseColorToRgb(color: string): [number, number, number] {
  const trimmed = color.trim();

  // Handle CSS variable with fallback or known name
  if (trimmed.includes('--page-gray')) {
    return [245, 246, 248]; // #F5F6F8
  }

  // Hex color #RGB or #RRGGBB
  if (trimmed.startsWith('#')) {
    let hex = trimmed.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6) {
      const num = parseInt(hex, 16);
      return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }
  }

  // rgb(...) format
  const rgbMatch = trimmed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return [parseInt(rgbMatch[1], 10), parseInt(rgbMatch[2], 10), parseInt(rgbMatch[3], 10)];
  }

  // Common named fallback or default page gray
  if (trimmed.toLowerCase() === 'white') return [255, 255, 255];
  if (trimmed.toLowerCase() === 'black') return [0, 0, 0];

  return [245, 246, 248];
}

/**
 * Reusable SectionFade component that dissolves the bottom edge of a curtain/container
 * smoothly into the subsequent section background with an 8-stop ease-in gradient.
 */
export const SectionFade: React.FC<SectionFadeProps> = ({
  fadeTo = '#F5F6F8',
  height = 150,
  className = '',
  style = {},
  zIndex = 1,
}) => {
  const [r, g, b] = parseColorToRgb(fadeTo);

  // 8-stop ease-in curve: 0, 0.06, 0.16, 0.32, 0.55, 0.78, 0.93, 1
  const gradient = `linear-gradient(to bottom, ` +
    `rgba(${r}, ${g}, ${b}, 0) 0%, ` +
    `rgba(${r}, ${g}, ${b}, 0.06) 12%, ` +
    `rgba(${r}, ${g}, ${b}, 0.16) 25%, ` +
    `rgba(${r}, ${g}, ${b}, 0.32) 40%, ` +
    `rgba(${r}, ${g}, ${b}, 0.55) 58%, ` +
    `rgba(${r}, ${g}, ${b}, 0.78) 75%, ` +
    `rgba(${r}, ${g}, ${b}, 0.93) 90%, ` +
    `rgba(${r}, ${g}, ${b}, 1) 100%)`;

  const formattedHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      aria-hidden="true"
      className={`absolute left-0 right-0 bottom-0 pointer-events-none select-none ${className}`}
      style={{
        height: formattedHeight,
        zIndex,
        background: gradient,
        ...style,
      }}
    />
  );
};
