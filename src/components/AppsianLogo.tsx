import React from 'react';

interface AppsianMarkProps {
  size?: number;
  className?: string;
  fill?: string;
}

export const AppsianMark: React.FC<AppsianMarkProps> = ({
  size = 24,
  className = '',
  fill = 'currentColor',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="260 296 694 569"
      fill="none"
      width={size}
      height={size}
      className={`block shrink-0 ${className}`}
      aria-label="Appsian Logo Mark"
    >
      <path
        fill={fill}
        d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
      />
      <path
        fill={fill}
        d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
      />
    </svg>
  );
};

export const AppsianIcon = AppsianMark;

export const AppsianLogo: React.FC<{
  size?: number;
  className?: string;
  showText?: boolean;
}> = ({ size = 28, className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      <AppsianMark size={size} fill="currentColor" />
      {showText && (
        <span className="text-[20px] font-semibold tracking-[-0.01em] text-white leading-none">
          Appsian
        </span>
      )}
    </div>
  );
};
