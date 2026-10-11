import React, { useState } from 'react';
import { content } from '../content';
import { Calendar, UserCheck, FileAudio, Check } from 'lucide-react';
import { SectionHeader, EyebrowPill, Reveal } from './design-system';
import { CurtainBackground } from './CurtainBackground';

export const DarkBand1: React.FC = () => {
  const { darkBand1 } = content;

  // Selected chips for "Quick Qualify Logic"
  const jobTypes = ['Repair', 'Install', 'Quote', 'Emergency'];
  const timelines = ['Today', 'This week'];

  const [activeJobType, setActiveJobType] = useState('Quote');
  const [activeTimeline, setActiveTimeline] = useState('Today');

  return (
    <section className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      {/* 56px-radius dark container inset 24px from viewport edges with blue curtain background */}
      <div className="w-full max-w-[1248px] rounded-[56px] border border-[rgba(255,255,255,0.08)] py-16 md:py-20 px-6 sm:px-10 relative overflow-clip text-[#F4F5F7]">
        <CurtainBackground variant="blue" offset={120} />

        <div className="relative z-10 max-w-[1187px] mx-auto">
          {/* Section Header */}
          <SectionHeader
            theme="dark"
            eyebrow={<EyebrowPill theme="dark">Automated Qualification</EyebrowPill>}
            headline={[
              { text: darkBand1.h2Line1, weight: 'light' },
              { text: darkBand1.h2Line2, weight: 'strong' },
            ]}
          />

          {/* Two 28px-radius Dark Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[980px] mx-auto items-stretch">
            {/* Card 1: Qualifies every caller */}
            <Reveal delay={0.1}>
              <div
                className="h-full rounded-[28px] p-[28px] flex flex-col justify-start border border-white/[0.14] transition-all duration-300 hover:-translate-y-[3px] hover:border-white/[0.24]"
                style={{
                  background: 'rgba(8, 12, 36, 0.82)',
                  backdropFilter: 'blur(18px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(120%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -24px rgba(4,8,30,0.55)',
                }}
              >
                {/* Mini-UI panel on top at fixed equal height (260px) */}
                <div className="w-full rounded-[18px] p-[20px] mb-[28px] bg-[#0D1233] border border-white/[0.08] flex flex-col justify-center h-auto md:h-[260px]">
                  {/* Top Header: Row Title + Status Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[15px] font-semibold text-white font-sans">
                      Quick Qualify Logic
                    </span>
                    <span className="text-[12px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/[0.12] border border-[#6EEDC2]/[0.35] px-2.5 py-1 rounded-[8px] leading-none select-none font-sans">
                      Real-time
                    </span>
                  </div>

                  {/* Group 1: Job Type */}
                  <div className="mb-3.5">
                    <span className="text-[11px] uppercase tracking-[0.08em] font-medium text-white/50 block mb-2 font-sans">
                      JOB TYPE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {jobTypes.map((type) => {
                        const isSelected = type === activeJobType;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setActiveJobType(type)}
                            className={`h-[34px] px-3.5 rounded-[10px] text-[13px] font-medium font-sans flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border border-[#6EEDC2] text-[#6EEDC2] bg-[#6EEDC2]/[0.12] shadow-[0_0_12px_rgba(110,237,194,0.15)]'
                                : 'bg-white/[0.06] border border-white/[0.08] text-white/[0.75] hover:bg-white/[0.1] hover:text-white'
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
                    <span className="text-[11px] uppercase tracking-[0.08em] font-medium text-white/50 block mb-2 font-sans">
                      TIMELINE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {timelines.map((timeline) => {
                        const isSelected = timeline === activeTimeline;
                        return (
                          <button
                            key={timeline}
                            type="button"
                            onClick={() => setActiveTimeline(timeline)}
                            className={`h-[34px] px-3.5 rounded-[10px] text-[13px] font-medium font-sans flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'border border-[#6EEDC2] text-[#6EEDC2] bg-[#6EEDC2]/[0.12] shadow-[0_0_12px_rgba(110,237,194,0.15)]'
                                : 'bg-white/[0.06] border border-white/[0.08] text-white/[0.75] hover:bg-white/[0.1] hover:text-white'
                            }`}
                          >
                            {timeline}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Title & Blurb with High Contrast */}
                <div className="flex flex-col">
                  <h3 className="text-[22px] font-sans font-semibold text-white tracking-[-0.01em] mb-2 leading-[1.3]">
                    {darkBand1.card1.title}
                  </h3>
                  <p className="text-[15px] leading-[1.55] text-white/[0.78] font-sans">
                    {darkBand1.card1.blurb}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Syncs with your calendar and CRM */}
            <Reveal delay={0.2}>
              <div
                className="h-full rounded-[28px] p-[28px] flex flex-col justify-start border border-white/[0.14] transition-all duration-300 hover:-translate-y-[3px] hover:border-white/[0.24]"
                style={{
                  background: 'rgba(8, 12, 36, 0.82)',
                  backdropFilter: 'blur(18px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(18px) saturate(120%)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.08), 0 30px 60px -24px rgba(4,8,30,0.55)',
                }}
              >
                {/* Mini-UI panel on top at fixed equal height (260px) */}
                <div className="w-full rounded-[18px] p-[20px] mb-[28px] bg-[#0D1233] border border-white/[0.08] flex flex-col justify-center space-y-[12px] h-auto md:h-[260px]">
                  {/* Row 1: Calendar booking */}
                  <div className="h-[64px] rounded-[12px] bg-white/[0.04] border border-white/[0.08] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[36px] h-[36px] rounded-[10px] bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <div className="text-[15px] font-semibold text-white font-sans leading-tight truncate">
                          Calendar Dispatch
                        </div>
                        <div className="text-[13px] text-white/[0.65] font-sans leading-tight mt-0.5 truncate">
                          Slot booked in Google Calendar
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/[0.12] border border-[#6EEDC2]/[0.35] px-2.5 py-1 rounded-[8px] flex items-center gap-1.5 shrink-0 select-none font-sans">
                      <Check className="w-3 h-3 stroke-[2.5]" /> Synced
                    </span>
                  </div>

                  {/* Row 2: CRM contact */}
                  <div className="h-[64px] rounded-[12px] bg-white/[0.04] border border-white/[0.08] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[36px] h-[36px] rounded-[10px] bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <div className="text-[15px] font-semibold text-white font-sans leading-tight truncate">
                          CRM Contact Created
                        </div>
                        <div className="text-[13px] text-white/[0.65] font-sans leading-tight mt-0.5 truncate">
                          HubSpot lead updated
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/[0.12] border border-[#6EEDC2]/[0.35] px-2.5 py-1 rounded-[8px] flex items-center gap-1.5 shrink-0 select-none font-sans">
                      <Check className="w-3 h-3 stroke-[2.5]" /> Synced
                    </span>
                  </div>

                  {/* Row 3: Call transcript */}
                  <div className="h-[64px] rounded-[12px] bg-white/[0.04] border border-white/[0.08] px-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-[36px] h-[36px] rounded-[10px] bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                        <FileAudio className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col text-left min-w-0">
                        <div className="text-[15px] font-semibold text-white font-sans leading-tight truncate">
                          Call Audio &amp; Transcript
                        </div>
                        <div className="text-[13px] text-white/[0.65] font-sans leading-tight mt-0.5 truncate">
                          Full recording and summary
                        </div>
                      </div>
                    </div>
                    <span className="text-[12px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/[0.12] border border-[#6EEDC2]/[0.35] px-2.5 py-1 rounded-[8px] flex items-center gap-1.5 shrink-0 select-none font-sans">
                      <Check className="w-3 h-3 stroke-[2.5]" /> Attached
                    </span>
                  </div>
                </div>

                {/* Title & Blurb with High Contrast */}
                <div className="flex flex-col">
                  <h3 className="text-[22px] font-sans font-semibold text-white tracking-[-0.01em] mb-2 leading-[1.3]">
                    {darkBand1.card2.title}
                  </h3>
                  <p className="text-[15px] leading-[1.55] text-white/[0.78] font-sans">
                    {darkBand1.card2.blurb}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
