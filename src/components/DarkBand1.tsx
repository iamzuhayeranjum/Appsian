import React, { useState, useEffect } from 'react';
import { content } from '../content';
import { Calendar, UserCheck, FileAudio, Check } from 'lucide-react';
import { GlassCard, Chip, SectionHeader, EyebrowPill, Reveal, BackgroundTexture } from './design-system';

export const DarkBand1: React.FC = () => {
  const { darkBand1 } = content;

  // Auto-looping selected chips for "Quick Qualify"
  const jobTypes = ['Repair', 'Install', 'Quote', 'Emergency'];
  const timelines = ['Today', 'This week'];

  const [activeJobTypeIndex, setActiveJobTypeIndex] = useState(0);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveJobTypeIndex((prev) => (prev + 1) % jobTypes.length);
      setActiveTimelineIndex((prev) => (prev + 1) % timelines.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      {/* 28px-radius dark container inset 24px from viewport edges with black & glass */}
      <div className="w-full max-w-[1248px] rounded-[28px] bg-[#060608] border border-[rgba(255,255,255,0.08)] py-16 md:py-20 px-6 sm:px-10 relative overflow-hidden text-[#F4F5F7]">
        <BackgroundTexture theme="dark" />

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

          {/* Two 20px-radius Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[980px] mx-auto">
            {/* Card 1: Qualifies every caller */}
            <Reveal delay={0.1}>
              <GlassCard className="p-7 flex flex-col justify-between min-h-[460px]">
                {/* Inner panel holding Quick Qualify mockup */}
                <div className="w-full rounded-[14px] p-5 mb-6 bg-white/4 border border-white/8 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-white">
                      Quick Qualify Logic
                    </span>
                    <Chip active theme="dark">
                      Real-time
                    </Chip>
                  </div>

                  {/* Group 1: Job Type */}
                  <div className="mb-4">
                    <span className="text-[10.5px] uppercase tracking-[0.06em] font-medium text-[#9A9EA8] block mb-2">
                      Job Type
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {jobTypes.map((type, idx) => {
                        const isSelected = idx === activeJobTypeIndex;
                        return (
                          <Chip
                            key={type}
                            active={isSelected}
                            theme="dark"
                          >
                            {type}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 2: Timeline */}
                  <div>
                    <span className="text-[10.5px] uppercase tracking-[0.06em] font-medium text-[#9A9EA8] block mb-2">
                      Timeline
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {timelines.map((timeline, idx) => {
                        const isSelected = idx === activeTimelineIndex;
                        return (
                          <Chip
                            key={timeline}
                            active={isSelected}
                            theme="dark"
                          >
                            {timeline}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Title & Blurb */}
                <div>
                  <h3 className="text-[20px] font-display font-[500] text-white tracking-tight mb-1.5">
                    {darkBand1.card1.title}
                  </h3>
                  <p className="text-[15px] leading-[24px] text-[#9A9EA8]">
                    {darkBand1.card1.blurb}
                  </p>
                </div>
              </GlassCard>
            </Reveal>

            {/* Card 2: Syncs with your calendar and CRM */}
            <Reveal delay={0.2}>
              <GlassCard className="p-7 flex flex-col justify-between min-h-[460px]">
                {/* Inner panel holding 3 rows */}
                <div className="w-full rounded-[14px] p-5 mb-6 bg-white/4 border border-white/8 flex flex-col justify-center space-y-3">
                  {/* Row 1: Calendar booking */}
                  <div className="bg-white/6 rounded-[10px] p-3 border border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-blue-500/20 text-blue-300 flex items-center justify-center">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Calendar Dispatch
                        </div>
                        <div className="text-[10px] text-[#9A9EA8]">
                          Slot booked in Google Calendar
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/15 px-2 py-0.5 rounded-[6px] flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Synced
                    </span>
                  </div>

                  {/* Row 2: CRM contact */}
                  <div className="bg-white/6 rounded-[10px] p-3 border border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          CRM Contact Created
                        </div>
                        <div className="text-[10px] text-[#9A9EA8]">
                          HubSpot lead updated
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/15 px-2 py-0.5 rounded-[6px] flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Synced
                    </span>
                  </div>

                  {/* Row 3: Call transcript */}
                  <div className="bg-white/6 rounded-[10px] p-3 border border-white/8 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-[8px] bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                        <FileAudio className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Call Audio &amp; Transcript
                        </div>
                        <div className="text-[10px] text-[#9A9EA8]">
                          Full recording and summary
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium text-[#6EEDC2] bg-[#6EEDC2]/15 px-2 py-0.5 rounded-[6px] flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Attached
                    </span>
                  </div>
                </div>

                {/* Title & Blurb */}
                <div>
                  <h3 className="text-[20px] font-display font-[500] text-white tracking-tight mb-1.5">
                    {darkBand1.card2.title}
                  </h3>
                  <p className="text-[15px] leading-[24px] text-[#9A9EA8]">
                    {darkBand1.card2.blurb}
                  </p>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
