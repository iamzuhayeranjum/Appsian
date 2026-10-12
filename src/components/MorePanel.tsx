import React, { useState, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface MorePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: (href: string) => void;
  activeSection?: string;
}

export const MorePanel = forwardRef<HTMLDivElement, MorePanelProps>(
  (
    {
      isOpen,
      onClose,
      onMouseEnter,
      onMouseLeave,
      onNavigate,
      activeSection,
    },
    ref
  ) => {
    const [isMuted, setIsMuted] = useState(true);

    const menuItems = [
      {
        id: 'why-appsian',
        label: 'Why Appsian',
        description: 'Why trades choose Appsian over traditional call centers',
        href: '#why-appsian',
      },
      {
        id: 'testimonials',
        label: 'Reviews & Results',
        description: 'Real revenue metrics from plumbing, HVAC & electrical pros',
        href: '#testimonials',
      },
      {
        id: 'calculator',
        label: 'Revenue Calculator',
        description: 'See how much unanswered calls are costing your business',
        href: '#calculator',
      },
      {
        id: 'features',
        label: 'Software Integrations',
        description: 'Direct 2-way sync with ServiceTitan, Housecall Pro & FieldEdge',
        href: '#features',
      },
      {
        id: 'pricing',
        label: 'Pricing & Guarantee',
        description: 'Predictable flat rates, 30-day free trial, and $0 setup fee',
        href: '#pricing',
      },
      {
        id: 'faq',
        label: 'Frequently Asked Questions',
        description: 'Voice customization, dispatching logic, and phone routing',
        href: '#faq',
      },
    ];

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else {
        const target = document.querySelector(href);
        if (target) {
          const yOffset = -70;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-[110] pointer-events-auto"
        style={{
          width: '824px',
          maxWidth: 'calc(100vw - 32px)',
        }}
      >
        {/* Outer Card */}
        <div
          className="relative w-full rounded-[26px] bg-[#FAFAFA] p-5 sm:p-7 md:p-[28px] overflow-hidden"
          style={{
            border: '1px solid rgba(10, 10, 20, 0.08)',
            boxShadow:
              '0 30px 80px -20px rgba(0, 0, 0, 0.22), 0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 1px 0 rgba(0, 0, 0, 0.12)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-7 items-stretch">
            {/* Left Column: Dark Preview Card */}
            <div className="md:col-span-5 relative rounded-[20px] bg-gradient-to-b from-[#151228] via-[#0E0D1B] to-[#080811] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-inner border border-white/[0.08]">
              {/* Ambient lighting glows inside dark card */}
              <div
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none opacity-40 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(147, 98, 255, 0.55) 0%, transparent 70%)',
                }}
              />
              <div
                className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none opacity-30 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(110, 237, 194, 0.45) 0%, transparent 70%)',
                }}
              />

              {/* Top Chat / Dialogue Bubbles */}
              <div className="relative z-10 flex flex-col gap-2.5 mb-4">
                {/* Bubble 1 */}
                <div className="rounded-[16px] bg-white/[0.08] backdrop-blur-md border border-white/[0.14] px-4 py-2.5 text-white/95 shadow-sm">
                  <p className="text-[12.5px] leading-snug font-medium text-white/95">
                    The phones keep ringing
                  </p>
                  <p className="text-[12px] leading-snug font-normal text-white/70">
                    Staff can&apos;t answer in time
                  </p>
                </div>

                {/* Bubble 2 */}
                <div className="rounded-[16px] bg-white/[0.08] backdrop-blur-md border border-white/[0.14] px-4 py-2.5 text-white/95 shadow-sm">
                  <p className="text-[12.5px] leading-snug font-medium text-white/95">
                    Appsian picks up instantly
                  </p>
                  <p className="text-[12px] leading-snug font-normal text-white/70">
                    Every high-value job is booked
                  </p>
                </div>
              </div>

              {/* Video / Dispatcher Representative Thumbnail */}
              <div className="relative z-10 my-1 rounded-[16px] overflow-hidden border border-white/10 shadow-lg bg-black/40 aspect-[4/3] group">
                <img
                  src="/src/assets/images/dispatcher_preview_1791799376624.jpg"
                  alt="Appsian AI Dispatch Voice Specialist"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Subtle bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Live badge in top-left */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[10.5px] font-medium text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2] animate-pulse" />
                  <span>Live Voice Demo</span>
                </div>
              </div>

              {/* Bottom Caption & Mute Button */}
              <div className="relative z-10 mt-3 pt-2 flex items-center justify-between gap-3">
                <p className="text-[12.5px] font-medium text-white/90 leading-tight tracking-tight flex items-center gap-1.5">
                  <span className="text-[#6EEDC2]">“</span>
                  Emergency booked for 8:00 AM
                  <span className="text-[#6EEDC2]">”</span>
                </p>
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="flex-none w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/80" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-[#6EEDC2]" />
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Navigation Links */}
            <div className="md:col-span-7 flex flex-col justify-between py-1">
              <div className="flex flex-col gap-1.5">
                {menuItems.map((item) => {
                  const isCurrent = activeSection === item.id;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="group flex flex-col px-3 py-2 sm:py-2.5 rounded-[12px] hover:bg-[#EEF1F4]/70 transition-colors duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[15px] sm:text-[16px] font-semibold text-[#1B1D22] group-hover:text-black tracking-tight flex items-center gap-2">
                          {item.label}
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                          )}
                        </span>
                      </div>
                      <span className="text-[12.5px] sm:text-[13px] text-[#6E7482] group-hover:text-[#4B5160] leading-snug mt-0.5">
                        {item.description}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Pointer Notch aimed at the More button below */}
        <div
          className="absolute -bottom-[8px] right-9 md:right-[calc(50%-290px)] pointer-events-none z-20"
        >
          <svg width="20" height="9" viewBox="0 0 20 9" fill="none">
            <path d="M0 0 L10 8.5 L20 0 Z" fill="#FAFAFA" />
            <path
              d="M0 0 L10 8.5 L20 0"
              stroke="rgba(10, 10, 20, 0.08)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      </motion.div>
    );
  }
);

MorePanel.displayName = 'MorePanel';
