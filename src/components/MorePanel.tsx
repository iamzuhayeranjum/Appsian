import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Phone } from 'lucide-react';

interface MorePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: (href: string) => void;
  onCtaClick?: () => void;
  /** Distance (px) from the panel's right edge to the centre of the "More" button. */
  notchRight?: number;
  activeSection?: string;
}

const ITEMS = [
  { title: 'Meet Appsian', desc: 'Interactive phone agent breakdown', href: '#meet-appsian' },
  { title: 'Features', desc: 'Real-time booking & call flow', href: '#features' },
  { title: 'Integrations', desc: 'Works with your existing software', href: '#integrations' },
  { title: 'Results', desc: 'What changes when every call is answered', href: '#results' },
  { title: 'Pricing', desc: 'Simple monthly plans for any trade', href: '#pricing' },
  { title: 'FAQ', desc: 'Setup time, porting & guarantees', href: '#faq' },
];

const BAR_HEIGHTS = [10, 18, 28, 14, 34, 22, 38, 16, 30, 12, 26, 18, 32, 14, 22, 10];

const STEPS = ['Call answered', 'Details captured', 'Job booked'];

export const MorePanel = forwardRef<HTMLDivElement, MorePanelProps>(
  (
    { onMouseEnter, onMouseLeave, onNavigate, onClose, onCtaClick, notchRight = 76, activeSection },
    ref
  ) => {
    const reduce = useReducedMotion();

    const handleClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      onClose();
    };

    return (
      <motion.div
        ref={ref}
        role="menu"
        aria-label="More"
        initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 8, scale: reduce ? 1 : 0.98 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          transformOrigin: `calc(100% - ${notchRight}px) 100%`,
          fontFamily: "'Inter', sans-serif",
          boxShadow:
            '0 40px 90px -24px rgba(8, 12, 30, 0.40), 0 12px 28px -12px rgba(8, 12, 30, 0.18), 0 0 0 1px rgba(10, 15, 30, 0.06)',
        }}
        className="absolute bottom-[calc(100%+14px)] right-0 w-full md:w-[640px] rounded-[26px] bg-white p-2.5 z-50 text-[#0B1020] pointer-events-auto"
      >
        {/* Invisible bridge so the cursor can travel from "More" to the panel without closing it */}
        <span aria-hidden="true" className="absolute left-0 right-0 -bottom-[16px] h-[16px]" />

        {/* Pointer notch aligned to the centre of the "More" button */}
        <span
          aria-hidden="true"
          className="absolute -bottom-[7px] w-[16px] h-[16px] rotate-45 bg-white rounded-[3px]"
          style={{
            right: notchRight - 8,
            boxShadow: '3px 3px 6px -3px rgba(8, 12, 30, 0.14)',
          }}
        />

        <div className="relative flex flex-col md:flex-row gap-2.5 bg-white rounded-[20px]">
          {/* LEFT: dark Appsian media tile (desktop only) */}
          <div
            className="hidden md:flex relative w-[232px] shrink-0 flex-col justify-between overflow-hidden rounded-[18px] p-4 text-white"
            style={{
              background:
                'radial-gradient(120% 70% at 85% 0%, rgba(110,237,194,0.30) 0%, rgba(110,237,194,0) 60%), radial-gradient(90% 60% at 0% 100%, rgba(74,127,240,0.30) 0%, rgba(74,127,240,0) 60%), #07090D',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#6EEDC2] opacity-60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[#6EEDC2]" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/70">
                Live call
              </span>
            </div>

            <div className="rounded-[14px] border border-white/10 bg-white/[0.06] p-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6EEDC2] text-[#062B20] flex items-center justify-center">
                  <Phone className="w-3 h-3" strokeWidth={2.4} />
                </span>
                <span className="text-[12px] font-medium text-white/90">Incoming call</span>
              </div>

              <div className="mt-3 flex items-center justify-between h-[40px]" aria-hidden="true">
                {BAR_HEIGHTS.map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-[3px] rounded-full bg-[#6EEDC2]"
                    style={{ height: h, originY: 0.5 }}
                    animate={reduce ? undefined : { scaleY: [1, 0.35, 1] }}
                    transition={
                      reduce
                        ? undefined
                        : { duration: 1.1 + (i % 5) * 0.14, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }
                    }
                  />
                ))}
              </div>

              <ul className="mt-3 space-y-1.5">
                {STEPS.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-[12px] text-white/80">
                    <span className="w-4 h-4 rounded-full bg-[#6EEDC2]/15 text-[#6EEDC2] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[15px] font-semibold leading-snug tracking-tight">
                Answers every call.
                <br />
                Books the job.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCtaClick?.();
                }}
                className="btn-premium btn-premium--mint btn-glitter group relative mt-3 w-full h-[40px] rounded-[10px] flex items-center justify-center gap-2 font-sans font-[600] text-[13px] cursor-pointer select-none"
              >
                <span className="relative z-10 whitespace-nowrap">Get Free Demo</span>
                <ArrowRight className="btn-arrow relative z-10 w-4 h-4" strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* RIGHT: link list */}
          <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
            {ITEMS.map((it, i) => {
              const isActive = `#${activeSection}` === it.href;
              return (
                <motion.a
                  key={it.href}
                  role="menuitem"
                  href={it.href}
                  onClick={(e) => handleClick(e, it.href)}
                  initial={{ opacity: 0, x: reduce ? 0 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: reduce ? 0 : 0.05 + i * 0.03 }}
                  className="group flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 hover:bg-[#F3F5F8] transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-semibold tracking-tight text-[#0B1020]">
                        {it.title}
                      </span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />}
                    </div>
                    <div className="mt-0.5 text-[13px] leading-snug text-[#6B7280] truncate">
                      {it.desc}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#0B1020] opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }
);

MorePanel.displayName = 'MorePanel';
