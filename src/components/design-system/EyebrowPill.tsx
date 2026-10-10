import React from 'react';

interface EyebrowPillProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
}

export const EyebrowPill: React.FC<EyebrowPillProps> = ({
  children,
  icon,
  theme = 'light',
  className = '',
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`inline-flex items-center gap-2 h-[26px] px-2.5 rounded-[8px] select-none ${
        isDark
          ? 'bg-white/6 border border-white/12 text-[#F4F5F7]'
          : 'bg-white border border-[rgba(11,11,15,0.08)] text-[#0B0B0F] shadow-1'
      } ${className}`}
    >
      {/* 14px circle icon at left */}
      <div
        className={`w-[14px] h-[14px] rounded-full flex items-center justify-center shrink-0 ${
          isDark ? 'bg-white/20 text-[#6EEDC2]' : 'bg-[#0B0B0F] text-[#6EEDC2]'
        }`}
      >
        {icon || <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />}
      </div>

      {/* 10.5px uppercase text with 0.06em tracking */}
      <span className="text-[10.5px] uppercase tracking-[0.06em] font-[500] leading-none">
        {children}
      </span>
    </div>
  );
};
