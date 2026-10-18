import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Calendar, UserCheck, Headphones, Check, Sparkles } from 'lucide-react';
import { SectionTag } from './SectionTag';
import { content } from '../content';

export const DarkBand1: React.FC = () => {
  const { darkBand1 } = content;
  const reduceMotion = useReducedMotion();

  // Card 1 interactive/timed qualification state
  const jobTypes = ['Repair', 'Install', 'Quote', 'Emergency'];
  const timelines = ['Today', 'This week'];
  const jobSequence = ['Quote', 'Emergency', 'Repair', 'Install'];

  const [activeJobType, setActiveJobType] = useState('Quote');
  const [activeTimeline, setActiveTimeline] = useState('Today');
  const [seqIdx, setSeqIdx] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const interval = setInterval(() => {
      setSeqIdx((prev) => {
        const next = (prev + 1) % jobSequence.length;
        setActiveJobType(jobSequence[next]);
        setActiveTimeline(next % 2 === 0 ? 'Today' : 'This week');
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [reduceMotion, jobSequence]);

  // Shared card entrance animation parameters
  const cardEntrance = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: 0.7,
      delay: reduceMotion ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });

  return (
    <section className="w-full bg-[#F5F6F8] py-[72px] md:py-[120px] px-4 md:px-10 flex justify-center font-sans">
      <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center">
        {/* 1. BADGE */}
        <SectionTag label="Automated Qualification" icon="list-checks" />

        {/* 2. HEADLINE */}
        <h2 className="mt-[22px] mb-12 md:mb-[56px] text-center font-display tracking-[-0.03em] leading-[1.15] text-3xl sm:text-4xl md:text-[44px] max-w-3xl">
          <span className="font-light text-[#7B8296]">Made for busy trades,</span>{' '}
          <br className="hidden md:inline" />
          <span className="font-semibold text-[#0B0B0F]">built for booked jobs</span>
        </h2>

        {/* 3. BENTO GRID */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-10 gap-[14px]">
          {/* ========================================================================= */}
          {/* CARD 1 (Top-Left): Qualifies every caller                                */}
          {/* ========================================================================= */}
          <motion.div
            {...cardEntrance(0)}
            className="lg:col-span-5 min-h-[400px] lg:h-[410px] rounded-[24px] overflow-hidden relative p-[22px] md:p-7 border border-[rgba(255,255,255,0.7)] shadow-[0_20px_50px_-28px_rgba(60,70,160,0.35)] flex flex-col justify-between group transition-all duration-250 lg:hover:-translate-y-1 lg:hover:shadow-[0_26px_60px_-24px_rgba(60,70,160,0.45)]"
            style={{
              background: 'linear-gradient(160deg, #E8EBFF 0%, #CDD5FF 55%, #B8C4FF 100%)',
            }}
          >
            {/* Dot texture */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(70,80,170,0.10) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                maskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
              }}
            />

            {/* Header info */}
            <div className="relative z-10">
              <h3 className="text-[21px] font-semibold text-[#1B1F3B] tracking-[-0.02em] leading-snug">
                {darkBand1.card1.title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-[#5A6285] max-w-[340px] mt-2 font-normal">
                {darkBand1.card1.blurb}
              </p>
            </div>

            {/* Illustration: Quick Qualify Logic with stacked ghost cards */}
            <div
              aria-hidden="true"
              className="relative w-full flex justify-end mt-6 lg:mt-0 transition-transform duration-250 lg:group-hover:-translate-y-1"
            >
              <div className="relative w-full max-w-[350px] -mb-7 sm:-mb-6 mr-0 sm:-mr-2">
                {/* Ghost Card 2 */}
                <div className="hidden md:block absolute inset-0 -top-7 -left-7 rounded-[16px] bg-white/25 rotate-[-6deg] pointer-events-none" />
                {/* Ghost Card 1 */}
                <div className="hidden md:block absolute inset-0 -top-3.5 -left-3.5 rounded-[16px] bg-white/45 rotate-[-3deg] pointer-events-none" />

                {/* Main White Micro-Sheet */}
                <div className="relative z-10 w-full rounded-[16px] bg-white p-3.5 sm:p-4 border border-[rgba(15,16,32,0.06)] shadow-[0_16px_40px_-16px_rgba(40,50,150,0.35)] flex flex-col">
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] sm:text-[13.5px] font-semibold text-[#0B0B0F]">
                      Quick Qualify Logic
                    </span>
                    <span className="text-[10.5px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[6px] select-none leading-none">
                      Real-time
                    </span>
                  </div>

                  {/* Group 1: Job Type */}
                  <div className="mb-2.5">
                    <span className="text-[10px] uppercase tracking-[0.08em] font-medium text-slate-400 block mb-1.5">
                      JOB TYPE
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobTypes.map((type) => {
                        const isSelected = type === activeJobType;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setActiveJobType(type)}
                            className={`h-[28px] sm:h-[30px] px-2.5 sm:px-3 rounded-[8px] text-[11.5px] sm:text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border border-[#4A7FF0] text-[#2F5FD0] bg-[#EEF3FF] shadow-xs'
                                : 'bg-white border border-[#E2E8F0] text-[#475569]'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 2: Timeline */}
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.08em] font-medium text-slate-400 block mb-1.5">
                      TIMELINE
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {timelines.map((timeline) => {
                        const isSelected = timeline === activeTimeline;
                        return (
                          <button
                            key={timeline}
                            type="button"
                            onClick={() => setActiveTimeline(timeline)}
                            className={`h-[28px] sm:h-[30px] px-2.5 sm:px-3 rounded-[8px] text-[11.5px] sm:text-[12px] font-medium transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'border border-[#4A7FF0] text-[#2F5FD0] bg-[#EEF3FF] shadow-xs'
                                : 'bg-white border border-[#E2E8F0] text-[#475569]'
                            }`}
                          >
                            {timeline}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* CARD 2 (Top-Right): Syncs with your calendar and CRM                      */}
          {/* ========================================================================= */}
          <motion.div
            {...cardEntrance(0.08)}
            className="lg:col-span-5 min-h-[400px] lg:h-[410px] rounded-[24px] overflow-hidden relative p-[22px] md:p-7 border border-[rgba(255,255,255,0.7)] shadow-[0_20px_50px_-28px_rgba(60,70,160,0.35)] flex flex-col justify-between group transition-all duration-250 lg:hover:-translate-y-1 lg:hover:shadow-[0_26px_60px_-24px_rgba(60,70,160,0.45)]"
            style={{
              background: 'linear-gradient(160deg, #E1EEFF 0%, #CBE3FF 55%, #B6D8FF 100%)',
            }}
          >
            {/* Dot texture */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(70,80,170,0.10) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                maskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
              }}
            />

            {/* Header info */}
            <div className="relative z-10">
              <h3 className="text-[21px] font-semibold text-[#1B1F3B] tracking-[-0.02em] leading-snug">
                {darkBand1.card2.title}
              </h3>
              <p className="text-[15px] leading-[1.55] text-[#5A6285] max-w-[340px] mt-2 font-normal">
                {darkBand1.card2.blurb}
              </p>
            </div>

            {/* Illustration: Dark panel with live sync rows */}
            <div
              aria-hidden="true"
              className="relative w-full flex justify-end mt-6 lg:mt-0 transition-transform duration-250 lg:group-hover:-translate-y-1"
            >
              <div
                className="w-full max-w-[390px] rounded-[16px] bg-[#1C1D23] p-3.5 border border-white/8 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_-6px_30px_rgba(111,124,240,0.35)] -mb-4 -mr-2 flex flex-col space-y-2 relative z-10"
              >
                {/* Panel Header */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span
                    className={`w-2 h-2 rounded-full bg-[#10B981] ${
                      reduceMotion ? '' : 'animate-pulse'
                    }`}
                  />
                  <span className="text-white text-[13px] font-semibold">Live sync</span>
                </div>

                {/* Staggered Row 1 */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 }}
                  className="h-[46px] rounded-[12px] bg-[#25262D] px-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#2F3040] text-[#A9B4FF] flex items-center justify-center shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <div className="text-[12.5px] font-semibold text-white leading-tight truncate">
                        Calendar Dispatch
                      </div>
                      <div className="text-[11px] text-[#9AA0B5] leading-tight mt-0.5 truncate">
                        Slot booked in Google Calendar
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#34D399] bg-[#34D399]/12 border border-[#34D399]/30 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Synced
                  </span>
                </motion.div>

                {/* Staggered Row 2 */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
                  className="h-[46px] rounded-[12px] bg-[#25262D] px-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#2F3040] text-[#A9B4FF] flex items-center justify-center shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <div className="text-[12.5px] font-semibold text-white leading-tight truncate">
                        CRM Contact Created
                      </div>
                      <div className="text-[11px] text-[#9AA0B5] leading-tight mt-0.5 truncate">
                        HubSpot lead updated
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#34D399] bg-[#34D399]/12 border border-[#34D399]/30 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Synced
                  </span>
                </motion.div>

                {/* Staggered Row 3 */}
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.65 }}
                  className="h-[46px] rounded-[12px] bg-[#25262D] px-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-[30px] h-[30px] rounded-[8px] bg-[#2F3040] text-[#A9B4FF] flex items-center justify-center shrink-0">
                      <Headphones className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left min-w-0">
                      <div className="text-[12.5px] font-semibold text-white leading-tight truncate">
                        Call Audio &amp; Transcript
                      </div>
                      <div className="text-[11px] text-[#9AA0B5] leading-tight mt-0.5 truncate">
                        Full recording and summary
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#34D399] bg-[#34D399]/12 border border-[#34D399]/30 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Attached
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* CARD 3 (Bottom-Left, Narrow): Never misses a call                         */}
          {/* ========================================================================= */}
          <motion.div
            {...cardEntrance(0.16)}
            className="lg:col-span-3 min-h-[400px] lg:h-[430px] rounded-[24px] overflow-hidden relative p-[22px] md:p-7 border border-[rgba(255,255,255,0.7)] shadow-[0_20px_50px_-28px_rgba(60,70,160,0.35)] flex flex-col justify-between group transition-all duration-250 lg:hover:-translate-y-1 lg:hover:shadow-[0_26px_60px_-24px_rgba(60,70,160,0.45)]"
            style={{
              background: 'linear-gradient(170deg, #7C41F9 0%, #6A2FE0 100%)',
            }}
          >
            {/* White dot texture */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                maskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
              }}
            />

            {/* Header info */}
            <div className="relative z-10">
              <h3 className="text-[21px] font-semibold text-white tracking-[-0.02em] leading-snug">
                Never misses a call
              </h3>
              <p className="text-[15px] leading-[1.55] text-white/78 max-w-[340px] mt-2 font-normal">
                Every call is answered, including nights, weekends and emergencies, so no enquiry goes to voicemail.
              </p>
            </div>

            {/* Illustration: Dark panel with 3 glowing chips */}
            <div
              aria-hidden="true"
              className="relative w-full flex justify-center mt-6 lg:mt-0 transition-transform duration-250 lg:group-hover:-translate-y-1"
            >
              <div
                className="w-full rounded-t-[16px] bg-[#1C1D23] p-3 sm:p-3.5 pb-6 border-t border-x border-white/8 shadow-[0_-10px_40px_rgba(190,150,255,0.55)] -mb-7 flex flex-col space-y-2 relative z-10"
              >
                {[
                  'Every call answered',
                  'After-hours covered',
                  'Emergencies flagged',
                ].map((chipLabel, i) => (
                  <motion.div
                    key={chipLabel}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : 0.2 + i * 0.2 }}
                    className="h-[38px] px-3.5 rounded-[10px] bg-[#2A2B33] border border-white/8 flex items-center gap-2 text-white text-[13px] sm:text-[13.5px] font-medium"
                  >
                    <Check className="w-4 h-4 text-[#C4B5FD] stroke-[2.5]" />
                    <span>{chipLabel}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* CARD 4 (Bottom-Right, Wide): Summaries and alerts for your team           */}
          {/* ========================================================================= */}
          <motion.div
            {...cardEntrance(0.24)}
            className="lg:col-span-7 min-h-[440px] lg:h-[430px] rounded-[24px] overflow-hidden relative p-[22px] md:p-7 border border-[rgba(255,255,255,0.7)] shadow-[0_20px_50px_-28px_rgba(60,70,160,0.35)] flex flex-col lg:flex-row justify-between items-start gap-6 group transition-all duration-250 lg:hover:-translate-y-1 lg:hover:shadow-[0_26px_60px_-24px_rgba(60,70,160,0.45)]"
            style={{
              background: 'linear-gradient(160deg, #DCE6FF 0%, #C8D6FF 55%, #B9C7FF 100%)',
            }}
          >
            {/* Dot texture */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(70,80,170,0.10) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
                maskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
                WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
              }}
            />

            {/* LEFT HALF (Desktop): White list card "Recent calls" */}
            <div
              aria-hidden="true"
              className="order-2 lg:order-1 w-full lg:w-[48%] relative z-10 transition-transform duration-250 lg:group-hover:-translate-y-1"
            >
              <div className="w-full rounded-[16px] bg-white p-3.5 sm:p-4 border border-[rgba(15,16,32,0.06)] shadow-[0_16px_40px_-16px_rgba(40,50,150,0.35)]">
                <h4 className="text-[16px] sm:text-[17px] font-semibold text-[#0B0B0F] mb-3">
                  Recent calls
                </h4>
                <div className="flex flex-col divide-y divide-[#E9ECF5]">
                  {[
                    {
                      initials: 'ZP',
                      bg: 'bg-[#FDE7D8]',
                      color: 'text-[#9A3412]',
                      name: 'Zach P.',
                      job: 'Burst pipe',
                      tags: ['Emergency', 'Booked'],
                    },
                    {
                      initials: 'ML',
                      bg: 'bg-[#DDEBFF]',
                      color: 'text-[#1E40AF]',
                      name: 'Maria L.',
                      job: 'Boiler service',
                      tags: ['Quote sent', 'Summary ready'],
                    },
                    {
                      initials: 'DR',
                      bg: 'bg-[#E6E0FF]',
                      color: 'text-[#5B21B6]',
                      name: 'Dan R.',
                      job: 'Roof leak',
                      tags: ['Urgent', 'Alert sent'],
                    },
                    {
                      initials: 'PS',
                      bg: 'bg-[#D9F5EA]',
                      color: 'text-[#065F46]',
                      name: 'Priya S.',
                      job: 'AC install',
                      tags: ['Estimate', 'Booked'],
                    },
                  ].map((row) => (
                    <div key={row.name} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full ${row.bg} ${row.color} text-[12px] font-semibold flex items-center justify-center shrink-0`}
                        >
                          {row.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-semibold text-[#0B0B0F] leading-tight truncate">
                            {row.name}
                          </span>
                          <span className="text-[11.5px] text-[#64748B] leading-tight mt-0.5 truncate">
                            {row.job}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {row.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded-[6px] bg-[#E8EEFF] text-[#3F57B5] text-[10.5px] font-medium leading-none whitespace-nowrap"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT HALF (Desktop): Title, Description & Radar Decoration */}
            <div className="order-1 lg:order-2 w-full lg:w-[48%] relative z-10 flex flex-col justify-start">
              <div>
                <h3 className="text-[21px] font-semibold text-[#1B1F3B] tracking-[-0.02em] leading-snug">
                  Summaries and alerts for your team
                </h3>
                <p className="text-[15px] leading-[1.55] text-[#5A6285] max-w-[340px] mt-2 font-normal">
                  Every call comes with a transcript, an AI summary and an alert, so your team always knows what happens next.
                </p>
              </div>

              {/* Radar Decoration (lg and up) */}
              <div
                aria-hidden="true"
                className="hidden lg:block relative w-[320px] h-[220px] mt-2 -mr-6 self-end pointer-events-none"
              >
                {/* Concentric rings */}
                <div className="absolute right-[-20px] bottom-[-40px] w-[280px] h-[280px] rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-[190px] h-[190px] rounded-full border border-white/35 flex items-center justify-center">
                    <div className="w-[100px] h-[100px] rounded-full border border-white/55" />
                  </div>

                  {/* Rotating sweep wedge */}
                  <motion.div
                    animate={reduceMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        'conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.30) 0deg, rgba(255,255,255,0) 90deg, transparent 90deg)',
                    }}
                  />
                </div>

                {/* Floating Avatars around rings */}
                {[
                  { initials: 'JR', bg: 'bg-[#FEE2E2]', color: 'text-[#991B1B]', top: '15px', right: '180px', delay: 0 },
                  { initials: 'AK', bg: 'bg-[#FEF3C7]', color: 'text-[#92400E]', top: '25px', right: '50px', delay: 1 },
                  { initials: 'TC', bg: 'bg-[#E0E7FF]', color: 'text-[#3730A3]', top: '90px', right: '220px', delay: 2 },
                  { initials: 'BH', bg: 'bg-[#D1FAE5]', color: 'text-[#065F46]', top: '85px', right: '25px', delay: 1.5 },
                  { initials: 'SL', bg: 'bg-[#F3E8FF]', color: 'text-[#6B21A8]', top: '155px', right: '190px', delay: 2.5 },
                  { initials: 'EN', bg: 'bg-[#CFFAFE]', color: 'text-[#155E75]', top: '160px', right: '70px', delay: 0.5 },
                ].map((marker) => (
                  <motion.div
                    key={marker.initials}
                    animate={reduceMotion ? {} : { y: [-5, 5, -5] }}
                    transition={{
                      duration: 6,
                      delay: marker.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className={`absolute w-[42px] h-[42px] rounded-full ${marker.bg} ${marker.color} border-[3px] border-white shadow-[0_10px_24px_-8px_rgba(40,50,150,0.4)] flex items-center justify-center text-[12px] font-semibold`}
                    style={{ top: marker.top, right: marker.right }}
                  >
                    {marker.initials}
                  </motion.div>
                ))}

                {/* Marker 7: One larger marker with pulsing ring and "Alert sent" bubble */}
                <motion.div
                  animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
                  transition={{ duration: 5.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-[80px] right-[105px] z-10 flex items-center gap-1.5"
                >
                  <div className="relative w-[52px] h-[52px] rounded-full bg-[#DBEAFE] text-[#1E40AF] border-[3px] border-white shadow-[0_12px_28px_-8px_rgba(40,50,150,0.45)] flex items-center justify-center text-[14px] font-semibold">
                    {!reduceMotion && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                        className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                      />
                    )}
                    <span>ZP</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-white border border-slate-100 shadow-md text-[10px] font-semibold text-[#1E40AF] whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#3B82F6]" />
                    <span>Alert sent</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
