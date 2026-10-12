import React from 'react';
import { HeroCallDemo } from './HeroCallDemo';

interface DashboardMockupProps {
  onPlayClick?: () => void;
}

export const DashboardMockup: React.FC<DashboardMockupProps> = () => {
  return (
    <div className="w-full max-w-[987px] mx-auto">
      {/* Outer frosted glass shell with 40px radius - EXACT outer shell preserved */}
      <div className="rounded-[40px] p-2.5 sm:p-3.5 bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_20px_70px_rgba(30,20,60,0.22)]">
        {/* Main Dashboard Canvas - EXACT background, radius, border, and bottom crop preserved */}
        <div className="bg-[#FFFFFF] rounded-[32px] overflow-hidden border border-slate-100 shadow-sm min-h-[570px] flex items-center justify-center p-2.5 sm:p-5">
          <HeroCallDemo />
        </div>
      </div>
    </div>
  );
};
