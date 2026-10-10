import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Phone,
  Moon,
  Filter,
  Calendar,
  FileText,
  User,
  Wallet,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface ComparisonRowData {
  id: string;
  label: string;
  iconName: 'phone' | 'moon' | 'funnel' | 'calendar' | 'file-text' | 'user' | 'wallet';
  appsian: 'yes' | 'no' | string;
  voicemail: 'yes' | 'no' | string;
  answeringService: 'yes' | 'no' | string;
  fullTime: 'yes' | 'no' | string;
}

// Single data array as requested
export const COMPARISON_ROWS: ComparisonRowData[] = [
  {
    id: 'answers-every-call',
    label: 'Answers every call',
    iconName: 'phone',
    appsian: 'yes',
    voicemail: 'no',
    answeringService: 'yes',
    fullTime: 'Not always',
  },
  {
    id: 'covers-nights-weekends',
    label: 'Covers nights, weekends and holidays',
    iconName: 'moon',
    appsian: 'yes',
    voicemail: 'Messages only',
    answeringService: 'Varies',
    fullTime: 'Limited',
  },
  {
    id: 'qualifies-callers',
    label: 'Qualifies callers by your rules',
    iconName: 'funnel',
    appsian: 'yes',
    voicemail: 'no',
    answeringService: 'Script-based',
    fullTime: 'yes',
  },
  {
    id: 'books-calendar',
    label: 'Books into your calendar',
    iconName: 'calendar',
    appsian: 'yes',
    voicemail: 'no',
    answeringService: 'Varies',
    fullTime: 'yes',
  },
  {
    id: 'transcript-ai-summary',
    label: 'Transcript and AI summary of every call',
    iconName: 'file-text',
    appsian: 'yes',
    voicemail: 'no',
    answeringService: 'Varies',
    fullTime: 'no',
  },
  {
    id: 'reach-human',
    label: 'Callers can reach a human on request',
    iconName: 'user',
    appsian: 'yes',
    voicemail: 'no',
    answeringService: 'yes',
    fullTime: 'yes',
  },
  {
    id: 'how-you-pay',
    label: 'How you pay',
    iconName: 'wallet',
    appsian: 'Flat monthly plans',
    voicemail: 'Free',
    answeringService: 'Per-minute fees',
    fullTime: 'Salary + benefits',
  },
];

type CompetitorKey = 'voicemail' | 'answeringService' | 'fullTime';

const COMPETITORS: Array<{ key: CompetitorKey; label: string }> = [
  { key: 'voicemail', label: 'Voicemail' },
  { key: 'answeringService', label: 'Answering service' },
  { key: 'fullTime', label: 'Full-time receptionist' },
];

export const WhyAppsian: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  const [isDesktop, setIsDesktop] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [selectedCompetitor, setSelectedCompetitor] = useState<CompetitorKey>('voicemail');
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [hoveredColIndex, setHoveredColIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handleMotion = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handleMotion);

    return () => {
      window.removeEventListener('resize', handleResize);
      mq.removeEventListener('change', handleMotion);
    };
  }, []);

  const handleScrollToDemoBar = () => {
    const nameInput = document.getElementById('demo-name') || document.querySelector('input[type="email"]');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        (nameInput as HTMLElement).focus();
      }, 600);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getRowIcon = (name: ComparisonRowData['iconName']) => {
    const props = { className: 'w-4 h-4 text-[#8C909A] stroke-[1.75] shrink-0' };
    switch (name) {
      case 'phone':
        return <Phone {...props} />;
      case 'moon':
        return <Moon {...props} />;
      case 'funnel':
        return <Filter {...props} />;
      case 'calendar':
        return <Calendar {...props} />;
      case 'file-text':
        return <FileText {...props} />;
      case 'user':
        return <User {...props} />;
      case 'wallet':
        return <Wallet {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  // Cell icon rendering
  const renderCellContent = (val: string, isAppsianCol: boolean, rowIndex: number) => {
    if (val === 'yes') {
      if (isAppsianCol) {
        return (
          <div className="flex items-center justify-center">
            {/* 28px soft mint halo with 20px filled mint circle */}
            <motion.div
              initial={isReducedMotion ? { scale: 1 } : { scale: 0.6, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{
                delay: isReducedMotion ? 0 : 0.25 + rowIndex * 0.08,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-7 h-7 rounded-full bg-[#6EEDC2]/20 shadow-xs flex items-center justify-center"
              aria-label="Yes"
            >
              <div className="w-5 h-5 rounded-full bg-[#6EEDC2] flex items-center justify-center text-[#062B20]">
                <svg
                  className="w-3 h-3 stroke-current stroke-[2.8] fill-none"
                  viewBox="0 0 16 16"
                >
                  <motion.path
                    initial={isReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                    animate={isInView ? { pathLength: 1 } : {}}
                    transition={{
                      delay: isReducedMotion ? 0 : 0.35 + rowIndex * 0.08,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                    d="M3.5 8.5L6.5 11.5L12.5 5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center">
          {/* Standard yes: 28px soft white halo with 20px filled ink circle */}
          <motion.div
            initial={isReducedMotion ? { scale: 1 } : { scale: 0.6, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              delay: isReducedMotion ? 0 : 0.25 + rowIndex * 0.08,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-7 h-7 rounded-full bg-white/70 shadow-xs flex items-center justify-center"
            aria-label="Yes"
          >
            <div className="w-5 h-5 rounded-full bg-[#2D283C] flex items-center justify-center text-white">
              <svg
                className="w-3 h-3 stroke-current stroke-[2.8] fill-none"
                viewBox="0 0 16 16"
              >
                <motion.path
                  initial={isReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{
                    delay: isReducedMotion ? 0 : 0.35 + rowIndex * 0.08,
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                  d="M3.5 8.5L6.5 11.5L12.5 5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </motion.div>
        </div>
      );
    }

    if (val === 'no') {
      return (
        <div className="flex items-center justify-center" aria-label="No">
          {/* 20px gray circle (#C8CACF) with white X */}
          <div className="w-5 h-5 rounded-full bg-[#C8CACF] flex items-center justify-center text-white">
            <svg
              className="w-2.5 h-2.5 stroke-current stroke-[2.5] fill-none"
              viewBox="0 0 12 12"
            >
              <path
                d="M3 3L9 9M9 3L3 9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      );
    }

    // Text cell
    return (
      <span
        className={`text-[13px] sm:text-[14px] font-normal text-center leading-snug ${
          isAppsianCol ? 'font-medium text-[#2D283C]' : 'text-[#2D283C]/65'
        }`}
      >
        {val}
      </span>
    );
  };

  return (
    <section
      id="why-appsian"
      className="w-full bg-[#F5F6F8] pt-[96px] pb-[110px] relative overflow-hidden"
    >
      {/* Halftone dot texture: 12px spacing, masked toward right and top-center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(20,20,30,0.12) 1px, transparent 1.6px)',
          backgroundSize: '12px 12px',
          maskImage: 'radial-gradient(ellipse 60% 70% at 85% 45%, #000, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at 85% 45%, #000, transparent 75%)',
        }}
      />

      <div
        ref={containerRef}
        className="max-w-[1187px] mx-auto px-4 relative z-10 flex flex-col items-center"
      >
        {/* Eyebrow Pill: "WHY APPSIAN" */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="h-[32px] px-3.5 rounded-[10px] bg-white flex items-center gap-2 select-none"
          style={{
            boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 6px 16px rgba(10,10,20,.05)',
          }}
        >
          <div className="w-4 h-4 rounded-full bg-[#2D283C] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-2.5 h-2.5 fill-white stroke-none" />
          </div>
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.05em] text-[#2D283C]">
            Why Appsian
          </span>
        </motion.div>

        {/* Headline: 2 lines, 52px/1.1, lightest display weight */}
        <motion.h2
          initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 mb-5 text-center text-3xl sm:text-4xl md:text-[52px] leading-[1.1] font-display font-light text-[#2D283C] tracking-[-0.03em] max-w-4xl text-balance"
        >
          Not voicemail. Not an answering service.
          <br />
          Not another hire.
        </motion.h2>

        {/* Subline: 18px, ink at 80%, 20px below headline */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-base sm:text-lg md:text-[18px] leading-[28px] text-[#2D283C]/80 font-normal max-w-xl text-balance"
        >
          Appsian is an AI receptionist built for local service businesses.
        </motion.p>

        {/* Under 900px: 3-chip competitor selector */}
        {!isDesktop && (
          <div className="mt-8 mb-4 flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-[#2D283C]/60 font-medium mr-1">Compare with:</span>
            {COMPETITORS.map((comp) => {
              const active = selectedCompetitor === comp.key;
              return (
                <button
                  key={comp.key}
                  type="button"
                  onClick={() => setSelectedCompetitor(comp.key)}
                  className={`h-[34px] px-3.5 rounded-[10px] text-xs font-medium transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-[#2D283C] text-white shadow-xs'
                      : 'bg-white text-[#2D283C]/70 hover:text-[#2D283C] border border-[rgba(10,10,20,0.06)]'
                  }`}
                >
                  {comp.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* COMPARISON TABLE CONTAINER                                */}
        {/* ========================================================= */}
        <div
          role="table"
          aria-label="Why Appsian comparison table"
          className="w-full max-w-[1100px] mt-[56px] relative select-none"
        >
          {isDesktop ? (
            /* DESKTOP TABLE: 5 Columns (320px + 4 x 195px) */
            <div
              className="grid w-full relative"
              style={{
                gridTemplateColumns: '320px 195px 195px 195px 195px',
              }}
            >
              {/* Highlighted Appsian Column Card: spans from header to row 7 */}
              <motion.div
                initial={isReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="absolute top-0 bottom-0 pointer-events-none rounded-[24px] z-0 overflow-hidden"
                style={{
                  left: '314px',
                  width: '207px', // slightly wider than 195px (extending 6px each side)
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.5))',
                  border: '1px solid rgba(255,255,255,0.9)',
                  boxShadow:
                    '0 0 0 1px rgba(10,10,20,0.04), 0 20px 60px -20px rgba(10,10,20,0.12)',
                }}
              >
                {/* Lit mint rim on top edge */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] overflow-hidden">
                  <div
                    className="w-[120px] h-full mx-auto animate-mint-sweep"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, #6EEDC2 50%, transparent 100%)',
                    }}
                  />
                </div>
                {/* Lit mint rim on bottom edge */}
                <div className="absolute bottom-0 inset-x-0 h-[1.5px] overflow-hidden">
                  <div
                    className="w-[120px] h-full mx-auto animate-mint-sweep"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent 0%, #6EEDC2 50%, transparent 100%)',
                    }}
                  />
                </div>
              </motion.div>

              {/* Header Row (56px) */}
              <div
                role="row"
                className="col-span-5 grid items-center h-[56px] relative z-10"
                style={{
                  gridTemplateColumns: '320px 195px 195px 195px 195px',
                }}
              >
                {/* Empty corner header */}
                <div role="columnheader" className="px-4" />

                {/* Col 1: Appsian Header */}
                <motion.div
                  role="columnheader"
                  initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex items-center justify-center gap-1.5 h-full relative"
                  onMouseEnter={() => setHoveredColIndex(1)}
                  onMouseLeave={() => setHoveredColIndex(null)}
                >
                  <div className="w-5 h-5 rounded-[6px] bg-[#6EEDC2] flex items-center justify-center text-[#062B20] font-bold text-[10px] shadow-2xs">
                    ✦
                  </div>
                  <span className="text-[14px] font-semibold text-[#2D283C] tracking-tight">
                    Appsian
                  </span>
                  <div
                    className={`absolute bottom-1 w-12 h-[1px] bg-[#6EEDC2] transition-opacity duration-200 ${
                      hoveredColIndex === 1 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>

                {/* Col 2: Voicemail */}
                <motion.div
                  role="columnheader"
                  initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.16 }}
                  className="flex items-center justify-center h-full relative text-[14px] font-semibold text-[#2D283C]/80"
                  onMouseEnter={() => setHoveredColIndex(2)}
                  onMouseLeave={() => setHoveredColIndex(null)}
                >
                  <span>Voicemail</span>
                  <div
                    className={`absolute bottom-1 w-12 h-[1px] bg-[#2D283C]/30 transition-opacity duration-200 ${
                      hoveredColIndex === 2 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>

                {/* Col 3: Answering service */}
                <motion.div
                  role="columnheader"
                  initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.22 }}
                  className="flex items-center justify-center h-full relative text-[14px] font-semibold text-[#2D283C]/80 text-center px-1"
                  onMouseEnter={() => setHoveredColIndex(3)}
                  onMouseLeave={() => setHoveredColIndex(null)}
                >
                  <span>Answering service</span>
                  <div
                    className={`absolute bottom-1 w-12 h-[1px] bg-[#2D283C]/30 transition-opacity duration-200 ${
                      hoveredColIndex === 3 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>

                {/* Col 4: Full-time receptionist */}
                <motion.div
                  role="columnheader"
                  initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.28 }}
                  className="flex items-center justify-center h-full relative text-[14px] font-semibold text-[#2D283C]/80 text-center px-1"
                  onMouseEnter={() => setHoveredColIndex(4)}
                  onMouseLeave={() => setHoveredColIndex(null)}
                >
                  <span>Full-time receptionist</span>
                  <div
                    className={`absolute bottom-1 w-12 h-[1px] bg-[#2D283C]/30 transition-opacity duration-200 ${
                      hoveredColIndex === 4 ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </motion.div>
              </div>

              {/* 7 Data Rows (each 56px tall) */}
              {COMPARISON_ROWS.map((row, rowIndex) => {
                const isHovered = hoveredRowIndex === rowIndex;

                return (
                  <motion.div
                    key={row.id}
                    role="row"
                    initial={isReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: isReducedMotion ? 0 : 0.2 + rowIndex * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                    onMouseLeave={() => {
                      setHoveredRowIndex(null);
                      setHoveredColIndex(null);
                    }}
                    className="col-span-5 grid items-center h-[56px] relative z-10 transition-colors duration-200 rounded-[12px]"
                    style={{
                      gridTemplateColumns: '320px 195px 195px 195px 195px',
                      backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.7)' : 'transparent',
                    }}
                  >
                    {/* Horizontal hairline divider above row (fading toward right) */}
                    <div
                      className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(10,10,20,0.07) 0%, rgba(10,10,20,0.07) 70%, transparent 100%)',
                      }}
                    />

                    {/* Vertical hairlines between data columns (fading at both ends) */}
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none w-[1px]"
                      style={{
                        left: '515px',
                        background:
                          'linear-gradient(180deg, transparent 0%, rgba(10,10,20,0.07) 15%, rgba(10,10,20,0.07) 85%, transparent 100%)',
                      }}
                    />
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none w-[1px]"
                      style={{
                        left: '710px',
                        background:
                          'linear-gradient(180deg, transparent 0%, rgba(10,10,20,0.07) 15%, rgba(10,10,20,0.07) 85%, transparent 100%)',
                      }}
                    />
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none w-[1px]"
                      style={{
                        left: '905px',
                        background:
                          'linear-gradient(180deg, transparent 0%, rgba(10,10,20,0.07) 15%, rgba(10,10,20,0.07) 85%, transparent 100%)',
                      }}
                    />

                    {/* Label Column (with 16px gray line icon) */}
                    <div
                      role="rowheader"
                      className="px-4 flex items-center gap-3 h-full"
                    >
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {getRowIcon(row.iconName)}
                      </div>
                      <span className="text-[15px] font-medium text-[#2D283C] truncate">
                        {row.label}
                      </span>
                    </div>

                    {/* Col 1: Appsian */}
                    <div
                      role="cell"
                      className="flex items-center justify-center px-3 h-full"
                      onMouseEnter={() => setHoveredColIndex(1)}
                    >
                      {renderCellContent(row.appsian, true, rowIndex)}
                    </div>

                    {/* Col 2: Voicemail */}
                    <div
                      role="cell"
                      className="flex items-center justify-center px-3 h-full"
                      onMouseEnter={() => setHoveredColIndex(2)}
                    >
                      {renderCellContent(row.voicemail, false, rowIndex)}
                    </div>

                    {/* Col 3: Answering service */}
                    <div
                      role="cell"
                      className="flex items-center justify-center px-3 h-full"
                      onMouseEnter={() => setHoveredColIndex(3)}
                    >
                      {renderCellContent(row.answeringService, false, rowIndex)}
                    </div>

                    {/* Col 4: Full-time receptionist */}
                    <div
                      role="cell"
                      className="flex items-center justify-center px-3 h-full"
                      onMouseEnter={() => setHoveredColIndex(4)}
                    >
                      {renderCellContent(row.fullTime, false, rowIndex)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            /* MOBILE / TABLET TABLE: 3 Columns (Label + Appsian + Selected Competitor) */
            <div
              className="grid w-full relative"
              style={{
                gridTemplateColumns: 'minmax(140px, 1.4fr) minmax(95px, 1fr) minmax(95px, 1fr)',
              }}
            >
              {/* Highlighted Appsian Column Card in Mobile */}
              <div
                className="absolute top-0 bottom-0 pointer-events-none rounded-[20px] z-0 overflow-hidden"
                style={{
                  left: 'calc(1.4 / 3.4 * 100% - 4px)',
                  width: 'calc(1 / 3.4 * 100% + 8px)',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.5))',
                  border: '1px solid rgba(255,255,255,0.9)',
                  boxShadow:
                    '0 0 0 1px rgba(10,10,20,0.04), 0 20px 40px -20px rgba(10,10,20,0.12)',
                }}
              >
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-[#6EEDC2]" />
                <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#6EEDC2]" />
              </div>

              {/* Mobile Header Row */}
              <div
                role="row"
                className="col-span-3 grid items-center h-[56px] relative z-10"
                style={{
                  gridTemplateColumns: 'minmax(140px, 1.4fr) minmax(95px, 1fr) minmax(95px, 1fr)',
                }}
              >
                <div role="columnheader" className="px-2" />
                <div
                  role="columnheader"
                  className="flex items-center justify-center gap-1 text-[13px] font-semibold text-[#2D283C]"
                >
                  <span className="w-3.5 h-3.5 rounded-[4px] bg-[#6EEDC2] text-[#062B20] inline-flex items-center justify-center text-[9px] font-bold">
                    ✦
                  </span>
                  Appsian
                </div>
                <div
                  role="columnheader"
                  className="flex items-center justify-center text-[12px] font-semibold text-[#2D283C]/75 text-center px-1"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={selectedCompetitor}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="truncate"
                    >
                      {COMPETITORS.find((c) => c.key === selectedCompetitor)?.label}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Rows */}
              {COMPARISON_ROWS.map((row, rowIndex) => {
                const compValue = row[selectedCompetitor];

                return (
                  <div
                    key={row.id}
                    role="row"
                    className="col-span-3 grid items-center min-h-[56px] py-2 relative z-10"
                    style={{
                      gridTemplateColumns: 'minmax(140px, 1.4fr) minmax(95px, 1fr) minmax(95px, 1fr)',
                    }}
                  >
                    <div
                      className="absolute top-0 inset-x-0 h-[1px] pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(10,10,20,0.07) 0%, rgba(10,10,20,0.07) 80%, transparent 100%)',
                      }}
                    />

                    {/* Label */}
                    <div
                      role="rowheader"
                      className="px-2 flex items-center gap-2"
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        {getRowIcon(row.iconName)}
                      </div>
                      <span className="text-[13px] font-medium text-[#2D283C] leading-snug">
                        {row.label}
                      </span>
                    </div>

                    {/* Appsian */}
                    <div role="cell" className="flex items-center justify-center px-1">
                      {renderCellContent(row.appsian, true, rowIndex)}
                    </div>

                    {/* Competitor */}
                    <div role="cell" className="flex items-center justify-center px-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${selectedCompetitor}-${row.id}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.18 }}
                          className="flex items-center justify-center w-full"
                        >
                          {renderCellContent(compValue, false, rowIndex)}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 12px Muted Note */}
        <p className="mt-8 text-center text-[12px] text-[#2D283C]/50 font-normal">
          Comparison reflects typical options. Details vary by provider.
        </p>

        {/* 32px below note: Centered mint "Get Free Demo" button */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleScrollToDemoBar}
            className="group relative inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-[12px] bg-[#6EEDC2] hover:bg-[#85f3ce] text-[#062B20] text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <span>Get Free Demo</span>
            <ArrowRight className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
