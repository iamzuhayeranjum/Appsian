import React from 'react';

export interface AppsianLogoProps {
  className?: string;
  size?: number | string;
  color?: string; // fill color, defaults to 'currentColor'
  title?: string;
}

/**
 * Appsian official brand logo mark:
 * Stylized geometric capital 'A'
 */
export const AppsianLogoMark: React.FC<AppsianLogoProps> = ({
  className = '',
  size = 20,
  color = 'currentColor',
  title = 'Appsian',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={title}
      role="img"
    >
      <path
        d="M 50 14 C 47.5 14 45.2 15.5 44 17.8 L 19.5 74.2 C 18 77.6 20.4 81.5 24.2 81.5 L 34.5 81.5 C 37.2 81.5 39.5 79.7 40.5 77.2 L 44.5 67 L 55.5 67 L 59.5 77.2 C 60.5 79.7 62.8 81.5 65.5 81.5 L 75.8 81.5 C 79.6 81.5 82 77.6 80.5 74.2 L 56 17.8 C 54.8 15.5 52.5 14 50 14 Z M 50 36.5 L 53.6 56.5 L 46.4 56.5 Z"
        fill={color}
      />
    </svg>
  );
};

export default AppsianLogoMark;
