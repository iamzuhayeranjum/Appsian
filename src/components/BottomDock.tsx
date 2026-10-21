import React from 'react';
import { Phone, ArrowUp, ArrowUpRight, Calculator, Calendar } from 'lucide-react';

interface BottomDockProps {
  visible: boolean;
  onScrollToTop: () => void;
  onBookDemo: () => void;
  onOpenCallSimulator: () => void;
  onScrollToRoi: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  visible,
  onScrollToTop,
  onBookDemo,
  onOpenCallSimulator,
  onScrollToRoi,
}) => {
  return (
    <div
      aria-label="Bottom Navigation Dock"
      className={`fixed bottom-[20px] left-0 right-0 mx-auto w-fit max-w-[92vw] z-[90] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-12 opacity-0 pointer-events-none'
      }`}
    >
      <div className="glass-pill rounded-full p-1.5 flex items-center gap-1.5 sm:gap-2 shadow-[0_16px_36px_-10px_rgba(0,0,0,0.85)]">
        {/* Quick Call Simulator */}
        <button
          type="button"
          onClick={onOpenCallSimulator}
          className="btn-glitter px-3 sm:px-4 py-2 rounded-full bg-white/10 hover:bg-white/16 text-white text-[13px] sm:text-[14px] font-medium flex items-center gap-2 transition-all cursor-pointer select-none"
        >
          <Phone size={14} className="text-[#6EEDC2]" />
          <span className="hidden xs:inline">Test Call</span>
          <span className="xs:hidden">Test</span>
        </button>

        {/* ROI Calculator */}
        <button
          type="button"
          onClick={onScrollToRoi}
          className="btn-glitter px-3 sm:px-4 py-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white text-[13px] sm:text-[14px] font-medium flex items-center gap-2 transition-all cursor-pointer select-none hidden sm:flex"
        >
          <Calculator size={14} />
          <span>ROI Calc</span>
        </button>

        {/* CTA "Book Demo" that scrolls to hero demo bar and focuses Name */}
        <button
          type="button"
          onClick={onBookDemo}
          className="btn-glitter btn-glitter--light px-3.5 sm:px-5 py-2 rounded-full bg-[#6EEDC2] hover:bg-[#85f5cd] text-[#062B20] text-[13px] sm:text-[14px] font-semibold flex items-center gap-1.5 transition-all shadow-[0_2px_12px_rgba(110,237,194,0.35)] cursor-pointer select-none active:scale-95"
        >
          <span>Get Free Demo</span>
          <ArrowUpRight size={15} strokeWidth={2.5} />
        </button>

        {/* Divider */}
        <span className="w-px h-5 bg-white/15 mx-0.5" />

        {/* Back to top button */}
        <button
          type="button"
          onClick={onScrollToTop}
          aria-label="Back to top"
          title="Back to top"
          className="btn-glitter w-9 h-9 rounded-full hover:bg-white/12 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer select-none"
        >
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
};
