import React from 'react';
import { BackgroundTexture } from './BackgroundTexture';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  id?: string;
  showTexture?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  children,
  theme = 'light',
  className = '',
  id,
  showTexture = true,
  ...props
}) => {
  if (theme === 'dark') {
    return (
      <section
        id={id}
        className={`w-full py-6 md:py-10 bg-[#F5F6F7] flex justify-center px-4 sm:px-6 ${className}`}
        {...props}
      >
        {/* 28px-radius dark containers inset 24px from viewport edges */}
        <div className="w-full max-w-[1248px] rounded-[28px] bg-[#060608] border border-[rgba(255,255,255,0.08)] relative overflow-hidden text-[#F4F5F7] py-16 md:py-[120px]">
          {showTexture && <BackgroundTexture theme="dark" />}
          <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`w-full py-16 md:py-[120px] bg-[#F5F6F7] text-[#0B0B0F] relative overflow-hidden ${className}`}
      {...props}
    >
      {showTexture && <BackgroundTexture theme="light" />}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        {children}
      </div>
    </section>
  );
};
