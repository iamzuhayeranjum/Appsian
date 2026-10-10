import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  onClick,
  className = '',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  if (active) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`h-[28px] px-3 rounded-[8px] text-[12px] font-[500] bg-[#6EEDC2] text-[#062B20] flex items-center justify-center transition-all duration-200 select-none shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0F]/30 ${className}`}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[28px] px-3 rounded-[8px] text-[12px] font-[500] transition-all duration-200 select-none cursor-pointer flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0F]/30 ${
        isDark
          ? 'bg-white/6 border border-white/10 text-[#F4F5F7] hover:bg-white/10'
          : 'bg-white border border-[rgba(11,11,15,0.08)] text-[#5B5F68] shadow-xs hover:text-[#0B0B0F] hover:border-[rgba(11,11,15,0.16)]'
      } ${className}`}
    >
      {children}
    </button>
  );
};
