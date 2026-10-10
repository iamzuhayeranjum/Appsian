import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  hoverLift = true,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }}
      className={`rounded-[20px] text-[#F4F5F7] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        hoverLift ? 'hover:-translate-y-1 hover:border-white/20' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
