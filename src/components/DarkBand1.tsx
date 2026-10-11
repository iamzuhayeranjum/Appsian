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
    <section className="w-full bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      {/* Container with rounded top corners matching Image 1, blue curtain background */}
      <div className="w-full max-w-[1248px] rounded-t-[56px] rounded-b-none border-t border-x border-[rgba(255,255,255,0.12)] pt-16 md:pt-20 pb-20 md:pb-28 px-6 sm:px-10 relative overflow-clip text-[#F4F5F7]">
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

          {/* Two White Cards with Frosted Halo Rings (matching Image 1) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[990px] mx-auto items-stretch justify-items-center">
            {/* Card 1: Qualifies every caller */}
            <Reveal delay={0.1} className="w-full flex justify-center">
              <div
                className="w-full max-w-[480px] p-[7px] rounded-[37px] transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.28)',
                  border: '1px solid rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="h-full bg-white rounded-[30px] p-[8px] flex flex-col justify-between"
                  style={{
                    boxShadow:
                      '0 24px 50px -22px rgba(40, 70, 160, 0.35), 0 2px 6px rgba(20, 30, 70, 0.06)',
                  }}
                >
                  {/* Top Visual Panel: Tinted rounded panel (radius 22px, ~255px height) */}
                  <div className="w-full h-[255px] rounded-[22px] bg-gradient-to-b from-[#EEF4FF] via-[#F4F7FE] to-[#F9FBFF] border border-[#E0E8F8]/80 p-3.5 flex flex-col justify-end items-center overflow-hidden relative">
                    {/* Floating white micro-sheet */}
                    <div className="w-full max-w-[340px] bg-white rounded-t-[16px] rounded-b-[14px] p-4 shadow-[0_10px_25px_-5px_rgba(20,40,90,0.06),0_2px_6px_rgba(20,40,90,0.03)] border border-slate-100 flex flex-col">
                      {/* Top Header: Row Title + Status Badge */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[13.5px] font-semibold text-slate-800 font-sans">
                          Quick Qualify Logic
                        </span>
                        <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[6px] select-none font-sans leading-none">
                          Real-time
                        </span>
                      </div>

                      {/* Group 1: Job Type */}
                      <div className="mb-2.5">
                        <span className="text-[10px] uppercase tracking-[0.08em] font-medium text-slate-400 block mb-1.5 font-sans">
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
                                className={`h-[30px] px-3 rounded-[8px] text-[12px] font-medium font-sans flex items-center justify-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border border-[#3B82F6] text-[#2563EB] bg-[#EFF6FF] shadow-xs'
                                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:text-slate-800'
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
                        <span className="text-[10px] uppercase tracking-[0.08em] font-medium text-slate-400 block mb-1.5 font-sans">
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
                                className={`h-[30px] px-3 rounded-[8px] text-[12px] font-medium font-sans flex items-center justify-center transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border border-[#3B82F6] text-[#2563EB] bg-[#EFF6FF] shadow-xs'
                                    : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:text-slate-800'
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

                  {/* Bottom Text Area (centered, clean, Inter font) */}
                  <div className="pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center justify-center flex-1 text-center">
                    <h3 className="text-[20px] font-sans font-semibold text-[#1E293B] tracking-[-0.015em] mb-2 leading-[1.3] text-center">
                      {darkBand1.card1.title}
                    </h3>
                    <p className="text-[14px] leading-[1.55] text-[#64748B] font-sans text-center max-w-[340px] mx-auto">
                      {darkBand1.card1.blurb}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Card 2: Syncs with your calendar and CRM */}
            <Reveal delay={0.2} className="w-full flex justify-center">
              <div
                className="w-full max-w-[480px] p-[7px] rounded-[37px] transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(255, 255, 255, 0.28)',
                  border: '1px solid rgba(255, 255, 255, 0.55)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className="h-full bg-white rounded-[30px] p-[8px] flex flex-col justify-between"
                  style={{
                    boxShadow:
                      '0 24px 50px -22px rgba(40, 70, 160, 0.35), 0 2px 6px rgba(20, 30, 70, 0.06)',
                  }}
                >
                  {/* Top Visual Panel: Tinted rounded panel (radius 22px, ~255px height) */}
                  <div className="w-full h-[255px] rounded-[22px] bg-gradient-to-b from-[#EEF4FF] via-[#F4F7FE] to-[#F9FBFF] border border-[#E0E8F8]/80 p-3.5 flex flex-col justify-end items-center overflow-hidden relative">
                    {/* Floating white micro-sheet */}
                    <div className="w-full max-w-[340px] bg-white rounded-t-[16px] rounded-b-[14px] p-3 shadow-[0_10px_25px_-5px_rgba(20,40,90,0.06),0_2px_6px_rgba(20,40,90,0.03)] border border-slate-100 flex flex-col space-y-2">
                      {/* Row 1: Calendar booking */}
                      <div className="h-[48px] rounded-[10px] bg-[#F8FAFC] border border-[#EDF2F7] px-2.5 flex items-center justify-between transition-colors hover:bg-slate-100/70">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-[28px] h-[28px] rounded-[7px] bg-blue-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
                            <Calendar className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col text-left min-w-0">
                            <div className="text-[12px] font-semibold text-slate-800 font-sans leading-tight truncate">
                              Calendar Dispatch
                            </div>
                            <div className="text-[10.5px] text-slate-500 font-sans leading-tight mt-0.5 truncate">
                              Slot booked in Google Calendar
                            </div>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0 select-none font-sans leading-none">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Synced
                        </span>
                      </div>

                      {/* Row 2: CRM contact */}
                      <div className="h-[48px] rounded-[10px] bg-[#F8FAFC] border border-[#EDF2F7] px-2.5 flex items-center justify-between transition-colors hover:bg-slate-100/70">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-[28px] h-[28px] rounded-[7px] bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center shrink-0">
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col text-left min-w-0">
                            <div className="text-[12px] font-semibold text-slate-800 font-sans leading-tight truncate">
                              CRM Contact Created
                            </div>
                            <div className="text-[10.5px] text-slate-500 font-sans leading-tight mt-0.5 truncate">
                              HubSpot lead updated
                            </div>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0 select-none font-sans leading-none">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Synced
                        </span>
                      </div>

                      {/* Row 3: Call transcript */}
                      <div className="h-[48px] rounded-[10px] bg-[#F8FAFC] border border-[#EDF2F7] px-2.5 flex items-center justify-between transition-colors hover:bg-slate-100/70">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-[28px] h-[28px] rounded-[7px] bg-sky-50 border border-sky-100/80 text-sky-600 flex items-center justify-center shrink-0">
                            <FileAudio className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex flex-col text-left min-w-0">
                            <div className="text-[12px] font-semibold text-slate-800 font-sans leading-tight truncate">
                              Call Audio &amp; Transcript
                            </div>
                            <div className="text-[10.5px] text-slate-500 font-sans leading-tight mt-0.5 truncate">
                              Full recording and summary
                            </div>
                          </div>
                        </div>
                        <span className="text-[10.5px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-[5px] flex items-center gap-1 shrink-0 select-none font-sans leading-none">
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" /> Attached
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Text Area (centered, clean, Inter font) */}
                  <div className="pt-6 pb-6 px-4 sm:px-6 flex flex-col items-center justify-center flex-1 text-center">
                    <h3 className="text-[20px] font-sans font-semibold text-[#1E293B] tracking-[-0.015em] mb-2 leading-[1.3] text-center">
                      {darkBand1.card2.title}
                    </h3>
                    <p className="text-[14px] leading-[1.55] text-[#64748B] font-sans text-center max-w-[340px] mx-auto">
                      {darkBand1.card2.blurb}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

