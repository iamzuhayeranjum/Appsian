import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverLift = true,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-[20px] bg-white border border-[rgba(11,11,15,0.08)] shadow-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hoverLift
          ? 'hover:-translate-y-1 hover:shadow-2 hover:border-[rgba(11,11,15,0.14)]'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
