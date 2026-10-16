import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PhoneIncoming,
  Phone,
  CalendarCheck,
  Megaphone,
  ClipboardCheck,
  Check,
  Bell,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { SectionHeader, EyebrowPill } from './design-system';

interface ResultsSectionProps {
  onSuccessDemo?: () => void;
}

// ---------------------------------------------------------------------------
// Small building blocks for the floating mini "app" cards on the right
// ---------------------------------------------------------------------------

interface MiniCardProps {
  title: string;
  className?: string;
  delay?: number;
  reduceMotion: boolean | null;
  children: React.ReactNode;
}

const MiniCard: React.FC<MiniCardProps> = ({ title, className = '', delay = 0, reduceMotion, children }) => (
  <motion.div
    initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    className={`rounded-[16px] bg-white p-4 shadow-[0_14px_32px_-14px_rgba(11,11,15,0.25),0_2px_6px_rgba(11,11,15,0.05)] ${className}`}
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-[14px] font-display font-medium text-[#0B0B0F] tracking-tight">{title}</span>
      <span className="flex gap-[3px]" aria-hidden="true">
        <i className="w-[3px] h-[3px] rounded-full bg-[#9AA0AB]" />
        <i className="w-[3px] h-[3px] rounded-full bg-[#9AA0AB]" />
        <i className="w-[3px] h-[3px] rounded-full bg-[#9AA0AB]" />
      </span>
    </div>
    {children}
  </motion.div>
);

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="shrink-0 rounded-full bg-[#E3FAF1] px-2 py-[2px] text-[10.5px] font-medium text-[#0F7A58]">
    {children}
  </span>
);

const Row: React.FC<{ icon?: React.ReactNode; label: string; right?: React.ReactNode }> = ({ icon, label, right }) => (
  <div className="flex items-center justify-between gap-2 rounded-[10px] bg-[#F5F6F8] px-2.5 py-[7px]">
    <span className="flex items-center gap-2 text-[12px] text-[#0B0B0F]">
      {icon}
      {label}
    </span>
    {right}
  </div>
);

const Tick: React.FC = () => (
  <span className="inline-flex w-4 h-4 shrink-0 items-center justify-center rounded-full bg-[#22C58B]">
    <Check className="w-2.5 h-2.5 text-white stroke-[3.2]" aria-hidden="true" />
  </span>
);

const CheckRow: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-[12px] text-[#0B0B0F]">
    <Tick />
    {label}
  </div>
);

const KeyValue: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex items-center justify-between gap-3 text-[12px]">
    <span className="text-[#7B808B]">{k}</span>
    <span className="font-medium text-[#0B0B0F] text-right">{v}</span>
  </div>
);

const IconTile: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex w-8 h-8 shrink-0 items-center justify-center rounded-[10px] bg-[#E3FAF1] text-[#0F7A58]">
    {children}
  </span>
);

// ---------------------------------------------------------------------------
// The four results
// ---------------------------------------------------------------------------

interface ResultTab {
  label: string;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
  stage: string; // gradient behind the white card
  tint: string; // tint of the right-hand panel
  cards: (reduceMotion: boolean | null) => React.ReactNode;
}

const TABS: ResultTab[] = [
  {
    label: 'Opportunities',
    title: 'More opportunities captured',
    description: 'Enquiries that previously would have gone unanswered.',
    Icon: PhoneIncoming,
    stage: 'linear-gradient(125deg, #E6FBF3 0%, #A6F2D6 42%, #BBDDFF 100%)',
    tint: '#D9F7EB',
    cards: (rm) => (
      <>
        <MiniCard title="Incoming calls" delay={0} reduceMotion={rm} className="md:absolute md:left-[7%] md:top-[6%] md:w-[46%]">
          <div className="flex flex-col gap-1.5">
            <Row icon={<PhoneIncoming className="w-3.5 h-3.5 text-[#5B5F68]" />} label="After-hours call" right={<Badge>Answered</Badge>} />
            <Row icon={<PhoneIncoming className="w-3.5 h-3.5 text-[#5B5F68]" />} label="Weekend call" right={<Badge>Answered</Badge>} />
            <Row icon={<PhoneIncoming className="w-3.5 h-3.5 text-[#5B5F68]" />} label="Holiday call" right={<Badge>Answered</Badge>} />
          </div>
        </MiniCard>
        <MiniCard title="Caller details" delay={0.12} reduceMotion={rm} className="md:absolute md:right-[5%] md:top-[41%] md:w-[44%]">
          <div className="flex flex-col gap-2">
            <KeyValue k="Service needed" v="Emergency repair" />
            <KeyValue k="Location" v="In your service area" />
          </div>
        </MiniCard>
        <MiniCard title="Enquiry captured" delay={0.24} reduceMotion={rm} className="md:absolute md:left-[13%] md:bottom-[7%] md:w-[56%]">
          <div className="flex items-center gap-2.5">
            <Tick />
            <span className="text-[12px] text-[#5B5F68]">Saved with the call transcript</span>
          </div>
        </MiniCard>
      </>
    ),
  },
  {
    label: 'Jobs won',
    title: 'More jobs won',
    description: 'Enquiries that actually convert into paying customers.',
    Icon: CalendarCheck,
    stage: 'linear-gradient(125deg, #E2EBFF 0%, #9DBBFF 46%, #B8F1DE 100%)',
    tint: '#DDE7FF',
    cards: (rm) => (
      <>
        <MiniCard title="Qualified caller" delay={0} reduceMotion={rm} className="md:absolute md:left-[7%] md:top-[6%] md:w-[50%]">
          <div className="flex flex-col gap-2.5">
            <CheckRow label="Service is in your list" />
            <CheckRow label="Inside your service area" />
            <CheckRow label="Fits your rules" />
          </div>
        </MiniCard>
        <MiniCard title="Booked estimate" delay={0.12} reduceMotion={rm} className="md:absolute md:right-[5%] md:top-[37%] md:w-[46%]">
          <div className="flex items-center gap-2.5">
            <IconTile>
              <CalendarCheck className="w-4 h-4" />
            </IconTile>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-medium text-[#0B0B0F]">Estimate booked</div>
              <div className="text-[11.5px] text-[#7B808B]">Added to your calendar</div>
            </div>
            <Badge>Booked</Badge>
          </div>
        </MiniCard>
        <MiniCard title="From enquiry to job" delay={0.24} reduceMotion={rm} className="md:absolute md:left-[11%] md:bottom-[7%] md:w-[60%]">
          <div className="flex items-center gap-1.5 text-[11.5px]">
            <span className="rounded-full bg-[#F5F6F8] px-2.5 py-1 text-[#5B5F68]">Enquiry</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#B3B8C2]" aria-hidden="true" />
            <span className="rounded-full bg-[#F5F6F8] px-2.5 py-1 text-[#5B5F68]">Qualified</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#B3B8C2]" aria-hidden="true" />
            <span className="rounded-full bg-[#E3FAF1] px-2.5 py-1 font-medium text-[#0F7A58]">Booked</span>
          </div>
        </MiniCard>
      </>
    ),
  },
  {
    label: 'Ad spend',
    title: 'More value from existing ad spend',
    description: 'Turn more of the demand you already pay for into qualified opportunities.',
    Icon: Megaphone,
    stage: 'linear-gradient(125deg, #DDF6FF 0%, #86DBF2 46%, #B2F2D3 100%)',
    tint: '#D8F3FA',
    cards: (rm) => (
      <>
        <MiniCard title="Calls from your ads" delay={0} reduceMotion={rm} className="md:absolute md:left-[7%] md:top-[7%] md:w-[50%]">
          <div className="flex flex-col gap-1.5">
            <Row icon={<Phone className="w-3.5 h-3.5 text-[#5B5F68]" />} label="New enquiry" right={<Badge>Answered</Badge>} />
            <Row icon={<Phone className="w-3.5 h-3.5 text-[#5B5F68]" />} label="New enquiry" right={<Badge>Qualified</Badge>} />
          </div>
        </MiniCard>
        <MiniCard title="Demand you pay for" delay={0.12} reduceMotion={rm} className="md:absolute md:right-[5%] md:top-[36%] md:w-[46%]">
          <div className="flex flex-col gap-2.5">
            <CheckRow label="Enquiries answered" />
            <CheckRow label="Callers qualified" />
            <CheckRow label="Estimates booked" />
          </div>
        </MiniCard>
        <MiniCard title="Qualified opportunity" delay={0.24} reduceMotion={rm} className="md:absolute md:left-[13%] md:bottom-[7%] md:w-[56%]">
          <div className="flex items-center gap-2.5">
            <Tick />
            <span className="text-[12px] text-[#5B5F68]">Ready for your team</span>
          </div>
        </MiniCard>
      </>
    ),
  },
  {
    label: 'Admin time',
    title: 'Less administrative work',
    description: 'Fewer repetitive calls and less manual information gathering.',
    Icon: ClipboardCheck,
    stage: 'linear-gradient(125deg, #EAF0FF 0%, #B9C9FF 44%, #A4F0D2 100%)',
    tint: '#E3E9FF',
    cards: (rm) => (
      <>
        <MiniCard title="Call transcript" delay={0} reduceMotion={rm} className="md:absolute md:left-[7%] md:top-[6%] md:w-[54%]">
          <div className="flex flex-col gap-2 text-[12px] leading-[1.4]">
            <div>
              <span className="text-[#7B808B]">Caller: </span>
              <span className="text-[#0B0B0F]">My water heater has stopped working.</span>
            </div>
            <div>
              <span className="text-[#7B808B]">Receptionist: </span>
              <span className="text-[#0B0B0F]">I can help with that. What is the address?</span>
            </div>
          </div>
        </MiniCard>
        <MiniCard title="AI summary" delay={0.12} reduceMotion={rm} className="md:absolute md:right-[5%] md:top-[35%] md:w-[46%]">
          <div className="flex flex-col gap-2">
            <KeyValue k="Service" v="Water heater repair" />
            <KeyValue k="Urgency" v="Emergency" />
            <KeyValue k="Next step" v="Estimate booked" />
          </div>
        </MiniCard>
        <MiniCard title="Team alert" delay={0.24} reduceMotion={rm} className="md:absolute md:left-[11%] md:bottom-[5%] md:w-[56%]">
          <div className="flex items-center gap-2.5">
            <IconTile>
              <Bell className="w-4 h-4" />
            </IconTile>
            <div className="min-w-0">
              <div className="text-[12.5px] font-medium text-[#0B0B0F]">New booked estimate</div>
              <div className="text-[11.5px] text-[#7B808B]">Sent to your team</div>
            </div>
          </div>
        </MiniCard>
      </>
    ),
  },
];

// How much scrolling each result gets (in screen heights) while the stage is pinned.
const SEGMENT_VH = 70;

export const ResultsSection: React.FC<ResultsSectionProps> = ({ onSuccessDemo }) => {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // The stage is pinned and driven by scrolling only on desktop and when motion is allowed.
  const pinned = isDesktop && !reduceMotion;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Scrolling through the tall track moves to the next result.
  useEffect(() => {
    if (!pinned) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / range));
      const next = Math.min(TABS.length - 1, Math.floor(progress * TABS.length));
      setActive((current) => (current === next ? current : next));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned]);

  // Clicking a tab scrolls to that result when pinned, otherwise switches directly.
  const goToTab = (index: number) => {
    const el = trackRef.current;
    if (pinned && el) {
      const top = window.scrollY + el.getBoundingClientRect().top;
      const range = el.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + ((index + 0.5) / TABS.length) * range, behavior: 'smooth' });
    } else {
      setActive(index);
    }
  };

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

  const tab = TABS[active];
  const { Icon } = tab;

  return (
    <section id="results" className="w-full bg-[var(--page-gray,#F5F6F8)] font-sans">
      <div className="max-w-[1320px] mx-auto px-2 md:px-[14px] pt-[100px]">
        <div className="px-2 sm:px-6">
          <SectionHeader
            eyebrow={<EyebrowPill>Results</EyebrowPill>}
            headline={[
              { text: 'What changes when', weight: 'light' },
              { text: 'every call is answered.', weight: 'strong' },
            ]}
            subline="The results you can expect from using an AI phone calling agent."
          />
        </div>
      </div>

      {/* Tall scroll track: the stage stays pinned while you scroll, and each stretch of scrolling shows the next result. */}
      <div
        ref={trackRef}
        className="relative"
        style={pinned ? { height: `${100 + (TABS.length - 1) * SEGMENT_VH}vh` } : undefined}
      >
        <div
          className={
            pinned
              ? 'sticky top-0 h-screen flex items-center pb-[88px]'
              : 'pb-[110px]'
          }
        >
          <div className="w-full max-w-[1320px] mx-auto px-2 md:px-[14px]">
        {/* Gradient stage */}
        <div className="relative overflow-clip rounded-[28px] md:rounded-[40px] px-3 pt-8 pb-3 sm:px-6 sm:pt-12 sm:pb-6 md:px-12 md:pt-12 md:pb-10">
          {/* Gradients cross-fade as the result changes */}
          {TABS.map((t, i) => (
            <div
              key={t.label}
              aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-[900ms] ease-out"
              style={{ background: t.stage, opacity: i === active ? 1 : 0 }}
            />
          ))}

          <div className="relative">
            {/* Tabs */}
            <div role="tablist" aria-label="Results" className="flex flex-wrap justify-center gap-2 mb-3">
              {TABS.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.label}
                    type="button"
                    role="tab"
                    id={`results-tab-${i}`}
                    aria-selected={isActive}
                    aria-controls="results-panel"
                    onClick={() => goToTab(i)}
                    className={`relative h-10 px-5 rounded-full bg-white text-[13.5px] font-sans transition-colors duration-300 shadow-[0_6px_16px_-8px_rgba(11,11,15,0.25)] ${
                      isActive ? 'text-[#0B0B0F] font-medium' : 'text-[#5B5F68] hover:text-[#0B0B0F]'
                    }`}
                  >
                    {t.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full w-5 h-3 bg-white"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* White card: text on the left, tinted panel with floating cards on the right */}
            <div
              id="results-panel"
              role="tabpanel"
              aria-labelledby={`results-tab-${active}`}
              className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-2 md:gap-3 rounded-[24px] md:rounded-[32px] bg-white p-2 md:p-3 shadow-[0_40px_80px_-40px_rgba(11,11,15,0.4)]"
            >
              {/* Left */}
              <motion.div
                key={`copy-${active}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between gap-10 px-5 py-6 md:px-9 md:py-9 md:min-h-[440px]"
              >
                <div>
                  <Icon className="w-9 h-9 text-[#0B0B0F] stroke-[1.3]" />
                  <h3 className="mt-10 md:mt-16 text-[30px] sm:text-[34px] md:text-[38px] leading-[1.08] font-display font-medium tracking-[-0.03em] text-[#0B0B0F]">
                    {tab.title}
                  </h3>
                  <p className="mt-4 max-w-[400px] text-[15px] leading-[1.6] text-[#5B5F68]">{tab.description}</p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleCtaClick}
                    className="btn-premium btn-premium--dark group inline-flex items-center gap-3 h-11 px-6 rounded-full text-[14px] font-medium"
                  >
                    Get Free Demo
                    <ArrowRight className="btn-arrow w-4 h-4" strokeWidth={2} />
                  </button>
                </div>
              </motion.div>

              {/* Right */}
              <div
                className="relative overflow-hidden rounded-[18px] md:rounded-[24px] transition-colors duration-700 min-h-[300px] md:min-h-[440px]"
                style={{ backgroundColor: tab.tint }}
              >
                <div key={`cards-${active}`} className="relative flex flex-col gap-3 p-3 md:block md:p-0 md:absolute md:inset-0">
                  {tab.cards(reduceMotion)}
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </section>
  );
};
