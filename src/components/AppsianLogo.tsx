import React, { useId } from 'react';

export interface AppsianLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AppsianMark: The "A" only, transparent background, blue gradient, for LIGHT backgrounds.
 * Default size: 24. width = size, height = auto.
 * display: block, flex-shrink: 0, max-width: none, margin: 0.
 */
export const AppsianMark: React.FC<AppsianLogoProps> = ({
  size = 24,
  className = '',
  style,
  width,
  height,
  ...props
}) => {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, '');

  const computedWidth = width !== undefined ? width : size;
  const computedHeight = height !== undefined ? height : 'auto';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="260 296 694 569"
      fill="none"
      role="img"
      aria-label="Appsian"
      width={computedWidth}
      height={computedHeight}
      className={className}
      style={{
        display: 'block',
        flexShrink: 0,
        maxWidth: 'none',
        margin: 0,
        width: computedWidth,
        height: computedHeight,
        ...style,
      }}
      {...props}
    >
      <defs>
        <linearGradient id={`am-a-${id}`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#1A74FA" />
          <stop offset="1" stopColor="#053DAD" />
        </linearGradient>
        <linearGradient id={`am-b-${id}`} x1="0.3" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4BB7FC" />
          <stop offset="1" stopColor="#1A74FA" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#am-a-${id})`}
        d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
      />
      <path
        fill={`url(#am-b-${id})`}
        d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
      />
    </svg>
  );
};

/**
 * AppsianIcon: Rounded square with the light "A", for the favicon and DARK surfaces.
 * Default size: 24. width = size, height = size.
 * display: block, flex-shrink: 0, max-width: none, margin: 0.
 */
export const AppsianIcon: React.FC<AppsianLogoProps> = ({
  size = 24,
  className = '',
  style,
  width,
  height,
  ...props
}) => {
  const rawId = useId();
  const id = rawId.replace(/[:]/g, '');

  const computedWidth = width !== undefined ? width : size;
  const computedHeight = height !== undefined ? height : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1254 1254"
      fill="none"
      role="img"
      aria-label="Appsian"
      width={computedWidth}
      height={computedHeight}
      className={className}
      style={{
        display: 'block',
        flexShrink: 0,
        maxWidth: 'none',
        margin: 0,
        width: computedWidth,
        height: computedHeight,
        ...style,
      }}
      {...props}
    >
      <defs>
        <radialGradient id={`ai-bg-${id}`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#053DAD" />
          <stop offset="1" stopColor="#2F8FFD" />
        </radialGradient>
      </defs>
      <rect width="1254" height="1254" rx="280" fill={`url(#ai-bg-${id})`} />
      <path
        fill="#B8DBFC"
        d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
      />
      <path
        fill="#AED6FB"
        d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
      />
    </svg>
  );
};
