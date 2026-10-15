import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ClipboardList,
  Workflow,
  PhoneForwarded,
  CalendarCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

interface GettingStartedProps {
  onSuccessDemo?: () => void;
}

interface StepRow {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

const STEPS: StepRow[] = [
  {
    title: 'Discovery',
    description: 'We learn your services, service area, emergency rules and business hours.',
    Icon: ClipboardList,
    tags: ['Service list', 'Service area', 'Emergency rules', 'Business hours'],
  },
  {
    title: 'Setup',
    description: 'We shape the greeting, call flow and booking rules, then run test calls.',
    Icon: Workflow,
    tags: ['Custom greeting', 'Call flow', 'Booking rules', 'Test calls'],
  },
  {
    title: 'Go live',
    description: 'Your receptionist answers every call, covers after-hours and qualifies callers.',
    Icon: PhoneForwarded,
    tags: ['Calls answered', 'After-hours cover', 'Callers qualified'],
  },
  {
    title: 'Ongoing',
    description: 'See booked estimates, call transcripts, AI summaries and team alerts.',
    Icon: CalendarCheck,
    tags: ['Booked estimates', 'Call transcripts', 'AI summaries', 'Team alerts'],
  },
];

// Glowing gradient border + dark fill for the highlighted row (mint instead of violet).
const ACTIVE_CARD_BG =
  'linear-gradient(180deg, #0B1117 0%, #080C11 100%) padding-box, linear-gradient(135deg, rgba(110,237,194,0.95) 0%, rgba(74,127,240,0.35) 48%, rgba(110,237,194,0.65) 100%) border-box';

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

        {/* COMPARISON-STYLE TABLE */}
        <div className="w-full mt-[56px] md:mt-[64px]">
          {/* Column headers (desktop only) */}
          <div className="hidden md:grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-8 px-6 pb-4 text-[13px] font-medium text-white/45">
            <div>Step</div>
            <div>You get</div>
          </div>

          <ul className="flex flex-col list-none m-0 p-0">
            {STEPS.map((step, index) => {
              const isActive = activeIndex === index;
              const { Icon } = step;

              return (
                <React.Fragment key={step.title}>
                  {index > 0 && (
                    <li aria-hidden="true" className="mx-5 md:mx-7 h-px bg-white/[0.07] list-none" />
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
                    className="group relative list-none rounded-[20px] outline-none focus-visible:ring-1 focus-visible:ring-[#6EEDC2]/50"
                  >
                    {/* Soft glow behind the highlighted row */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -inset-1 rounded-[24px] bg-[#6EEDC2]/[0.16] blur-2xl transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    {/* Highlighted card: dark fill + glowing gradient border */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-[20px] border border-transparent transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background: ACTIVE_CARD_BG,
                        boxShadow: '0 18px 40px -18px rgba(110,237,194,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                    />

                    <div className="relative grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-5 md:gap-8 items-center px-5 py-5 md:px-6 md:py-[22px]">
                      {/* Left: icon tile + title + description */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`shrink-0 w-12 h-12 md:w-[52px] md:h-[52px] rounded-[14px] flex items-center justify-center border transition-all duration-300 ${
                            isActive
                              ? 'border-[#6EEDC2]/60 text-[#062B20] shadow-[0_8px_22px_-6px_rgba(110,237,194,0.6),inset_0_1px_0_rgba(255,255,255,0.45)]'
                              : 'border-white/10 bg-[#0C1426] text-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
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
                          <p className="mt-1 text-[13.5px] leading-[1.5] text-white/55 max-w-[400px]">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: what you get, as check chips */}
                      <div>
                        <div className="md:hidden mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40">
                          You get
                        </div>
                        <ul className="flex flex-wrap gap-2 list-none m-0 p-0">
                          {step.tags.map((tag) => (
                            <li
                              key={tag}
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-[6px] text-[12.5px] font-medium leading-none transition-colors duration-300 ${
                                isActive
                                  ? 'border-[#6EEDC2]/30 bg-[#6EEDC2]/[0.08] text-white'
                                  : 'border-white/[0.08] bg-white/[0.04] text-white/80'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[2.6] text-[#6EEDC2]" aria-hidden="true" />
                              {tag}
                            </li>
                          ))}
                        </ul>
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
            className="group relative px-7 py-3.5 rounded-[10px] bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#062B20] font-sans font-semibold text-[15px] cursor-pointer transition-all duration-200 select-none hover:-translate-y-[1px] active:translate-y-0 shadow-[0_8px_20px_-6px_rgba(110,237,194,0.45)] hover:shadow-[0_12px_28px_-4px_rgba(110,237,194,0.65)] flex items-center gap-2"
          >
            <span>Get Free Demo</span>
            <ArrowRight className="w-4 h-4 stroke-[2.4] transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p className="mt-3 text-[12px] text-white/50 font-sans tracking-normal">
            Founding Client Program: $0 setup, 30 free days.
          </p>
        </div>
      </div>
    </section>
  );
};
