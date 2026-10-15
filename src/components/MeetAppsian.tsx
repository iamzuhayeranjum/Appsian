import { AppsianMark, AppsianIcon } from './AppsianLogo';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ArrowUpRight,
  Check,
  Search,
  Filter,
  Download,
  Loader2,
  ChevronRight,
  Circle,
} from 'lucide-react';

// Pill tab options
const TABS = [
  'After-hours calls',
  'Qualifies the job',
  'Books the estimate',
  'Human handoff',
  'Call summary',
] as const;

type TabType = (typeof TABS)[number];

interface CallRow {
  id: string;
  caller: string;
  job: string;
  status: 'Booked' | 'Qualifying' | 'Callback';
  bookedFor: string;
}

const CALLS_DATA: CallRow[] = [
  { id: '1', caller: 'Mark', job: 'Roof leak', status: 'Booked', bookedFor: 'Tue 9:00 AM' },
  { id: '2', caller: 'Dana', job: 'AC not cooling', status: 'Booked', bookedFor: 'Tue 1:30 PM' },
  { id: '3', caller: 'Luis', job: 'Water heater swap', status: 'Qualifying', bookedFor: '—' },
  { id: '4', caller: 'Priya', job: 'Panel upgrade', status: 'Booked', bookedFor: 'Wed 8:00 AM' },
  { id: '5', caller: 'Tom', job: 'Drain clog', status: 'Callback', bookedFor: '—' },
];

export const MeetAppsian: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Books the estimate');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [bookEstimateCompleted, setBookEstimateCompleted] = useState(false);

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Auto-advance tabs every 4 seconds unless hovered or user clicked
  useEffect(() => {
    if (hasUserInteracted || isHovered) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const currentIndex = TABS.indexOf(prev);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex];
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [hasUserInteracted, isHovered]);

  // For "Books the estimate": checklist shows spinner then a check after 1.2s
  useEffect(() => {
    if (activeTab === 'Books the estimate') {
      setBookEstimateCompleted(false);
      const timer = setTimeout(() => {
        setBookEstimateCompleted(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setBookEstimateCompleted(false);
    }
  }, [activeTab]);

  const handleTabClick = (tab: TabType) => {
    setHasUserInteracted(true);
    setActiveTab(tab);
  };

  // Checklist content configuration based on active tab
  const getChecklistConfig = () => {
    switch (activeTab) {
      case 'After-hours calls':
        return [
          { label: 'Call answered', status: 'spinner' as const },
          { label: 'Job qualified', status: 'pending' as const },
          { label: 'Estimate booked', status: 'pending' as const },
        ];
      case 'Qualifies the job':
        return [
          { label: 'Call answered', status: 'check' as const },
          { label: 'Job qualified', status: 'spinner' as const },
          { label: 'Estimate booked', status: 'pending' as const },
        ];
      case 'Books the estimate':
        return [
          { label: 'Call answered', status: 'check' as const },
          { label: 'Job qualified', status: 'check' as const },
          {
            label: 'Estimate booked',
            status: bookEstimateCompleted ? ('check' as const) : ('spinner' as const),
          },
        ];
      case 'Human handoff':
        return [
          { label: 'Call answered', status: 'check' as const },
          { label: 'Caller asked for a person', status: 'check' as const },
          { label: 'Transferred to you', status: 'check' as const },
        ];
      case 'Call summary':
        return [
          { label: 'Call answered', status: 'check' as const },
          { label: 'Summary written', status: 'check' as const },
          { label: 'Sent to your phone', status: 'check' as const },
        ];
    }
  };

  const checklistItems = getChecklistConfig();

  // Status badge styling
  const renderBadge = (status: CallRow['status']) => {
    switch (status) {
      case 'Booked':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6FBF2] text-[#0B6B46] border border-[#6EEDC2]/40">
            Booked
          </span>
        );
      case 'Qualifying':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D]/60">
            Qualifying
          </span>
        );
      case 'Callback':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
            Callback
          </span>
        );
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#FFFFFF] pt-[96px] pb-[112px] overflow-hidden select-none"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 1. FAINT FRAME LINES & RADIAL WASH */}
      {/* 1100px centered frame boundary with two 1px vertical lines */}
      <div className="absolute inset-x-0 top-0 bottom-0 max-w-[1100px] mx-auto pointer-events-none">
        <div
          className="absolute left-0 top-0 bottom-0 w-[1px]"
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-[1px]"
          style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
        />
      </div>

      {/* Two 1px horizontal lines at 40px below top and 40px above bottom */}
      <div
        className="absolute left-0 right-0 top-[40px] h-[1px] pointer-events-none"
        style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
      />
      <div
        className="absolute left-0 right-0 bottom-[40px] h-[1px] pointer-events-none"
        style={{ backgroundColor: 'rgba(229, 231, 235, 0.6)' }}
      />

      {/* Soft faint lighter-blue radial wash behind headline (5% opacity, no visible edges) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[480px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, rgba(59, 130, 246, 0.06), transparent 70%)',
        }}
      />

        {/* Main content wrapper */}
      <div className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* 2. TEXT BLOCK (Eyebrow, Headline, Subline) */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-[850px] mx-auto"
        >
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE8F0] border border-[#2D283C]/10 text-[11px] font-sans font-medium uppercase tracking-[0.05em] text-[#2D283C] mb-4 select-none">
            <div className="w-4 h-4 rounded-full bg-[#2D283C] flex items-center justify-center text-white shrink-0">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
              </svg>
            </div>
            <span>Product Overview</span>
          </div>

          {/* Headline: Solid #2D283C, font-display, font-light (300), matching site section headers */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-display font-light text-[#2D283C] tracking-[-0.03em] leading-[1.15] text-balance">
            Meet
            <span className="inline-flex items-center align-middle gap-2 px-2.5 py-1 rounded-[10px] bg-white border border-[#2D283C]/10 shadow-xs mx-2">
              <AppsianMark size={22} />
              <span className="font-medium text-[#2D283C] text-[18px] sm:text-[20px] tracking-tight">
                Appsian
              </span>
            </span>
            <br className="hidden sm:inline" />
            the AI phone agent that answers every call and books the job
          </h2>

          {/* 3. SUBLINE */}
          <motion.p
            initial={isReducedMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 text-[15px] sm:text-[17px] leading-[26px] text-[#5B5F68] max-w-xl mx-auto font-normal text-balance"
          >
            Appsian picks up when you can&apos;t. It qualifies the caller and puts the estimate on your calendar.
          </motion.p>
        </motion.div>

        {/* 4. TAB PILLS ROW */}
        <div
          className="mt-10 relative flex justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Mask container: Row only has linear-gradient mask fading both edges */}
          <div
            className="w-full max-w-[860px] overflow-x-auto no-scrollbar py-2"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-2.5 min-w-max px-8">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    initial={isReducedMotion ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.4,
                      delay: isReducedMotion ? 0 : 0.2 + idx * 0.04,
                      ease: 'easeOut',
                    }}
                    className={`h-[36px] px-4 rounded-full text-[14px] font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
                      isActive
                        ? 'bg-[#DBEAFE] text-[#1E3A8A] shadow-xs'
                        : 'bg-[#F3F4F6] text-[#4B5563] hover:bg-[#E5E7EB] hover:text-[#1F2937]'
                    }`}
                    style={{
                      fontFamily: 'inherit',
                    }}
                  >
                    {tab}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5. PRODUCT MOCKUP ON A BLUE PANEL */}
        <div
          className="mt-14 relative w-full flex flex-col items-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Rounded light-blue panel (height ~440px, radius 32px) */}
          <div
            className="w-full h-[400px] sm:h-[440px] rounded-[32px] relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #C7DDFB 0%, #DBEAFE 100%)',
            }}
          >
            {/* Fine subtle noise overlay at 4% opacity */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(30, 58, 138, 0.4) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
              }}
            />
          </div>

          {/* Overlapping Mockup Card: sits ~40px ABOVE panel top edge */}
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 -mt-[40px] w-[96%] sm:w-[92%] md:w-[86%] max-w-[950px] rounded-[16px] overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 20px 50px rgba(30, 58, 138, 0.12)',
            }}
          >
            {/* Top Bar: Appsian mark + Calls | Avatar & ghost buttons */}
            <div className="h-[46px] px-4 border-b border-[#EEF0F3] flex items-center justify-between bg-white/70">
              <div className="flex items-center gap-2">
                <AppsianIcon size={22} />
                <span className="font-semibold text-[13px] text-[#111827]">Calls</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium text-[#4B5563] hover:bg-black/[0.04] transition-colors"
                  style={{ fontFamily: 'inherit' }}
                >
                  <Filter size={12} className="text-[#6B7280]" />
                  <span>Filter</span>
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[12px] font-medium text-[#4B5563] hover:bg-black/[0.04] transition-colors"
                  style={{ fontFamily: 'inherit' }}
                >
                  <Download size={12} className="text-[#6B7280]" />
                  <span>Export</span>
                </button>
                <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold">
                  AP
                </div>
              </div>
            </div>

            {/* Layout Body: Sidebar + Main Table Area */}
            <div className="flex min-h-[300px]">
              {/* Left Sidebar (width ~190px, hidden on tablet < 1024px & mobile) */}
              <div className="hidden lg:flex w-[190px] border-r border-[#EEF0F3] p-3 flex-col gap-3 bg-white/40 shrink-0">
                {/* Search input */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    readOnly
                    value="Search calls..."
                    aria-label="Search calls"
                    className="w-full h-[28px] pl-7 pr-2 rounded-[6px] bg-[#F9FAFB] border border-[#E5E7EB] text-[11px] text-[#6B7280] focus:outline-none"
                    style={{ fontFamily: 'inherit' }}
                  />
                </div>

                {/* Sidebar Navigation */}
                <div className="flex flex-col gap-0.5">
                  {[
                    { label: 'All calls', count: '28' },
                    { label: 'Booked', count: '19' },
                    { label: 'Needs callback', count: '4' },
                    { label: 'After hours', count: '5' },
                  ].map((item) => {
                    const isSelected =
                      activeTab === 'After-hours calls'
                        ? item.label === 'After hours'
                        : item.label === 'All calls';

                    return (
                      <div
                        key={item.label}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#DBEAFE]/80 text-[#1E3A8A]'
                            : 'text-[#4B5563] hover:bg-black/[0.03]'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-[11px] opacity-75">{item.count}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Trades group */}
                <div className="mt-2 pt-2 border-t border-[#EEF0F3] flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-semibold text-[#9CA3AF] px-2 tracking-wider">
                    Trades
                  </span>
                  <div className="px-2.5 py-1 rounded-[6px] text-[12px] text-[#4B5563]">Roofing</div>
                  <div className="px-2.5 py-1 rounded-[6px] text-[12px] text-[#4B5563]">HVAC</div>
                </div>
              </div>

              {/* Main Table Area */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-[#EEF0F3] bg-white/60 text-[#6B7280] font-medium">
                      <th className="py-2.5 px-3 sm:px-4 w-8 font-medium">#</th>
                      <th className="py-2.5 px-3 sm:px-4 font-medium">Caller</th>
                      <th className="py-2.5 px-3 sm:px-4 font-medium">Job</th>
                      <th className="py-2.5 px-3 sm:px-4 font-medium">Status</th>
                      <th className="hidden sm:table-cell py-2.5 px-3 sm:px-4 font-medium">Booked for</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CALLS_DATA.map((row, i) => {
                      // Adjust status for Tab 1 / Tab 3
                      let rowStatus = row.status;
                      if (activeTab === 'Qualifies the job' && row.id === '3') {
                        rowStatus = 'Qualifying';
                      }

                      const isHighlightedCallback =
                        activeTab === 'Human handoff' && row.id === '5';

                      return (
                        <tr
                          key={row.id}
                          className={`h-[40px] border-b border-[#EEF0F3] transition-colors ${
                            isHighlightedCallback
                              ? 'bg-amber-50/60 font-medium'
                              : i % 2 === 1
                              ? 'bg-[#FAFAFC]/60'
                              : 'bg-transparent'
                          }`}
                        >
                          <td className="py-2 px-3 sm:px-4 text-[#9CA3AF]">{row.id}</td>
                          <td className="py-2 px-3 sm:px-4 font-medium text-[#111827]">
                            {row.caller}
                          </td>
                          <td className="py-2 px-3 sm:px-4 text-[#4B5563]">{row.job}</td>
                          <td className="py-2 px-3 sm:px-4">{renderBadge(rowStatus)}</td>
                          <td className="hidden sm:table-cell py-2 px-3 sm:px-4 text-[#4B5563] font-mono text-[11px]">
                            {row.bookedFor}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom 35% dissolver overlay fading into panel bottom color #DBEAFE */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(219, 234, 254, 0) 0%, #DBEAFE 100%)',
              }}
            />

            {/* FLOATING CARD: Sits at upper center-right, gently floats */}
            <motion.div
              initial={isReducedMotion ? false : { opacity: 0, scale: 0.9, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
              animate={
                isReducedMotion
                  ? {}
                  : {
                      y: [0, -6, 0],
                      transition: {
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
              }
              className="hidden sm:block absolute top-[28px] right-[40px] md:right-[90px] w-[230px] md:w-[270px] rounded-[14px] bg-white p-3.5 z-20"
              style={{
                boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
                border: '1px solid #EEF0F3',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#EEF0F3]">
                <AppsianIcon size={28} />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-[14px] text-[#111827] leading-none">
                    Appsian
                  </span>
                  <span className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                    Your AI receptionist
                  </span>
                </div>
              </div>

              {/* Checklist items with 200ms crossfade on text & icon */}
              <div className="mt-3 flex flex-col gap-2.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + (bookEstimateCompleted ? '-done' : '-progress')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2.5"
                  >
                    {checklistItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between text-[12px]"
                      >
                        <span className="text-[#374151] font-medium">{item.label}</span>
                        {item.status === 'check' && (
                          <div className="w-4 h-4 rounded-full bg-[#E6FBF2] flex items-center justify-center text-[#0B6B46] shrink-0">
                            <Check size={11} strokeWidth={2.8} />
                          </div>
                        )}
                        {item.status === 'spinner' && (
                          <div className="w-4 h-4 flex items-center justify-center text-[#1E3A8A] shrink-0">
                            <Loader2 size={13} className="animate-spin text-[#3B82F6]" />
                          </div>
                        )}
                        {item.status === 'pending' && (
                          <div className="w-4 h-4 flex items-center justify-center text-[#D1D5DB] shrink-0">
                            <Circle size={12} strokeWidth={1.8} />
                          </div>
                        )}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* FLOATING PILL: "Add to calendar" extending past right edge, connected via dotted line */}
            <motion.div
              initial={isReducedMotion ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.5, ease: 'easeOut' }}
              className="hidden lg:flex absolute top-[16px] -right-[24px] z-30 items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
            >
              <Calendar size={13} className="text-[#1E3A8A]" />
              <span className="text-[13px] font-semibold text-[#111827]">Add to calendar</span>
              <div className="w-5 h-5 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shrink-0 ml-0.5">
                <ArrowUpRight size={11} strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* DOTTED CONNECTOR LINE: From pill's left, curving down into card's right */}
            <svg
              className="hidden lg:block absolute pointer-events-none z-20"
              style={{
                top: '24px',
                right: '48px',
                width: '120px',
                height: '70px',
                overflow: 'visible',
              }}
              viewBox="0 0 120 70"
              fill="none"
            >
              <motion.path
                d="M 116,6 C 80,6 60,38 4,38"
                stroke="rgba(17, 24, 39, 0.6)"
                strokeWidth="1.5"
                strokeDasharray="2 3"
                initial={isReducedMotion ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.6, ease: 'easeInOut' }}
              />
              {/* Dot ending at the card's right edge */}
              <circle cx="4" cy="38" r="2.5" fill="rgba(17, 24, 39, 0.8)" />
            </svg>
          </motion.div>

          {/* MOBILE ONLY FLOATING CARD (centered below table when screen < 640px) */}
          <div className="block sm:hidden w-[90%] mt-4 mx-auto rounded-[14px] bg-white p-3.5 shadow-[0_12px_32px_rgba(15,23,42,0.14)] border border-[#EEF0F3] z-20">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#EEF0F3]">
              <AppsianIcon size={28} />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-[14px] text-[#111827] leading-none">
                  Appsian
                </span>
                <span className="text-[12px] text-[#6B7280] leading-tight mt-0.5">
                  Your AI receptionist
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2.5">
              {checklistItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-[12px]">
                  <span className="text-[#374151] font-medium">{item.label}</span>
                  {item.status === 'check' && (
                    <div className="w-4 h-4 rounded-full bg-[#E6FBF2] flex items-center justify-center text-[#0B6B46] shrink-0">
                      <Check size={11} strokeWidth={2.8} />
                    </div>
                  )}
                  {item.status === 'spinner' && (
                    <div className="w-4 h-4 flex items-center justify-center text-[#1E3A8A] shrink-0">
                      <Loader2 size={13} className="animate-spin text-[#3B82F6]" />
                    </div>
                  )}
                  {item.status === 'pending' && (
                    <div className="w-4 h-4 flex items-center justify-center text-[#D1D5DB] shrink-0">
                      <Circle size={12} strokeWidth={1.8} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
