import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ClipboardList,
  Workflow,
  PhoneForwarded,
  CalendarCheck,
  ArrowRight,
} from 'lucide-react';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

interface StepRow {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepRow[] = [
  {
    title: 'Discovery',
    description:
      'We learn your services, service area, emergency rules and business hours.',
    Icon: ClipboardList,
  },
  {
    title: 'Setup',
    description:
      'We shape the custom greeting, call flow and booking rules, then run test calls.',
    Icon: Workflow,
  },
  {
    title: 'Go live',
    description:
      'Your receptionist answers every call, covers after-hours and qualifies callers.',
    Icon: PhoneForwarded,
  },
  {
    title: 'Ongoing',
    description:
      'See booked estimates, call transcripts, AI summaries and team alerts.',
    Icon: CalendarCheck,
  },
];

// Highlighted row: dark fill, a soft mint glow in the bottom-right corner, and a glowing gradient border.
const ACTIVE_CARD_BG =
  'radial-gradient(ellipse 55% 140% at 100% 100%, rgba(110,237,194,0.14) 0%, rgba(110,237,194,0) 70%) padding-box, linear-gradient(180deg, #0B1117 0%, #080C11 100%) padding-box, linear-gradient(135deg, rgba(150,220,255,0.75) 0%, rgba(110,237,194,0.55) 30%, rgba(74,127,240,0.18) 62%, rgba(110,237,194,0.5) 100%) border-box';

export const GettingStarted: React.FC<GettingStartedProps> = ({ onSuccessDemo }) => {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleCtaClick = () => {
    const demoInput = document.getElementById('demo-name') as HTMLInputElement | null;
    if (demoInput) {
      demoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        demoInput.focus();
      }, 450);
    } else if (onSuccessDemo) {
      onSuccessDemo();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="getting-started"
      className="w-full bg-[#040506] overflow-clip pt-[120px] pb-[120px] relative text-white font-sans"
    >
      <div className="max-w-[1040px] mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center">
        {/* HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="h-[28px] px-3.5 rounded-full bg-[#6EEDC2]/[0.08] border border-[#6EEDC2]/30 inline-flex items-center gap-1.5 select-none mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />
            <span className="text-[12px] font-sans font-medium text-[#6EEDC2] tracking-tight">
              Getting Started
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-display leading-[1.08] tracking-[-0.03em] mb-4">
            <span className="font-normal text-white/70">From signup to</span>
            <span className="font-semibold text-white"> booked jobs</span>
          </h2>

          <p className="text-[15px] leading-[1.6] text-white/70 font-sans max-w-[560px] text-center">
            Four simple steps from first conversation to a receptionist that never misses a call.
          </p>
        </div>

        {/* TABLE */}
        <div className="w-full max-w-[820px] mt-[56px] md:mt-[64px]">
          {/* Column heading */}
          <div className="hidden md:block px-6 pb-4 text-[13px] font-medium text-white/80">
            Step
          </div>

          <ul className="flex flex-col list-none m-0 p-0">
            {STEPS.map((step, index) => {
              const isActive = activeIndex === index;
              // No hairline next to the highlighted card (like the reference).
              const hideDivider = activeIndex === index || activeIndex === index - 1;
              const { Icon } = step;

              return (
                <React.Fragment key={step.title}>
                  {index > 0 && (
                    <li
                      aria-hidden="true"
                      className={`h-px bg-white/[0.09] list-none transition-opacity duration-300 ${
                        hideDivider ? 'opacity-0' : 'opacity-100'
                      }`}
                    />
                  )}
                  <motion.li
                    initial={reduceMotion ? false : { opacity: 0, y: 14, filter: 'blur(10px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.7,
                      delay: reduceMotion ? 0 : index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    tabIndex={0}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className="relative list-none rounded-[18px] outline-none focus-visible:ring-1 focus-visible:ring-[#6EEDC2]/50"
                  >
                    {/* Soft outer glow behind the highlighted row */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -inset-1 rounded-[22px] bg-[#6EEDC2]/[0.10] blur-2xl transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {/* Highlighted card: dark fill + glowing gradient border */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-[18px] border border-transparent transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background: ACTIVE_CARD_BG,
                        boxShadow:
                          '0 18px 40px -20px rgba(110,237,194,0.30), inset 0 1px 0 rgba(255,255,255,0.05)',
                      }}
                    />

                    <div className="relative flex items-center gap-4 md:gap-5 px-5 py-6 md:px-6 md:py-[26px]">
                      <div
                        className={`shrink-0 w-12 h-12 md:w-[52px] md:h-[52px] rounded-[12px] flex items-center justify-center border transition-all duration-300 ${
                          isActive
                            ? 'border-[#6EEDC2]/60 text-[#062B20] shadow-[0_8px_22px_-6px_rgba(110,237,194,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]'
                            : 'border-[#2B4C80]/40 bg-[#0D2347] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                        }`}
                        style={
                          isActive
                            ? { background: 'linear-gradient(160deg, #8DF5D2 0%, #4FDDB0 100%)' }
                            : undefined
                        }
                      >
                        <Icon className="w-[22px] h-[22px] stroke-[1.7]" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-sans font-semibold text-[17px] leading-[1.25] tracking-tight text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] leading-[1.55] text-white/65 max-w-[420px]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-[56px] flex flex-col items-center text-center">
          <button
            type="button"
            onClick={handleCtaClick}
            className="btn-premium btn-premium--mint group relative px-7 py-3.5 rounded-[10px] font-sans font-semibold text-[15px] cursor-pointer select-none flex items-center gap-3"
          >
            <span>Get Free Demo</span>
            <ArrowRight className="btn-arrow w-4 h-4" strokeWidth={2} />
          </button>

          <p className="mt-3 text-[12px] text-white/50 font-sans tracking-normal">
            Founding Client Program: $0 setup, 30 free days.
          </p>
        </div>
      </div>
    </section>
  );
};
