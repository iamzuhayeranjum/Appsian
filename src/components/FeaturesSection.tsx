import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { content } from '../content';
import { Check, CheckCircle2, Phone, Volume2, Clock } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const { features } = content;

  // Typewriter effect state for "Reclaim your time"
  const summaryText =
    'Caller reported sudden boiler leak in basement. Verified service address at 42 Elm St. Confirmed diagnostic slot for Tuesday 9:30 AM with master tech.';
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!isDeleting && displayText.length < summaryText.length) {
      timeout = setTimeout(() => {
        setDisplayText(summaryText.slice(0, displayText.length + 1));
      }, 40);
    } else if (!isDeleting && displayText.length === summaryText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2600);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(summaryText.slice(0, displayText.length - 2));
      }, 20);
    } else if (isDeleting && displayText.length === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
      }, 600);
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting]);

  return (
    <section id="features" className="w-full pt-[110px] sm:pt-[140px] md:pt-[160px] pb-[140px] bg-white">
      <div className="max-w-[1187px] mx-auto px-4">
        {/* Section Heading: 52px, weight 400, letter-spacing -0.03em */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(12px)', y: 24 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center pt-6 sm:pt-10 md:pt-12 mb-14"
        >
          <h2 className="pt-4 sm:pt-6 md:pt-8 text-3xl sm:text-4xl md:text-[52px] font-display font-normal text-[#2D283C] tracking-[-0.03em] leading-[1.15]">
            {features.h2}
          </h2>
        </motion.div>

        {/* 1. Wide Card (987x580, radius 60, surface #F6F8F7, soft diffuse shadow, no visible borders) */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(16px)', y: 24 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[987px] mx-auto bg-[#F6F8F7] rounded-[60px] p-6 sm:p-12 relative overflow-hidden shadow-[0_10px_40px_rgba(60,50,120,0.08)] flex flex-col justify-between min-h-[540px] md:h-[580px]"
        >
          {/* Concentric faint arc lines in the background */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
            <svg
              className="w-[800px] h-[800px] -top-32 absolute"
              viewBox="0 0 800 800"
              fill="none"
            >
              <circle
                cx="400"
                cy="400"
                r="180"
                stroke="#D8E2EC"
                strokeWidth="1"
                strokeDasharray="4 6"
              />
              <circle cx="400" cy="400" r="260" stroke="#CBD5E1" strokeWidth="1" />
              <circle
                cx="400"
                cy="400"
                r="340"
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="8 8"
              />
              <circle cx="400" cy="400" r="420" stroke="#E2E8F0" strokeWidth="1" />
            </svg>
          </div>

          {/* Overlapping Floating Mockup Cards */}
          <div className="relative z-10 w-full pt-4 pb-4 flex items-center justify-center">
            <div className="relative w-full max-w-[620px] h-[260px] sm:h-[280px]">
              {/* Back Card: Live Call Card */}
              <div className="absolute left-2 sm:left-6 top-2 w-[280px] sm:w-[320px] bg-white rounded-3xl p-4 sm:p-5 shadow-[0_15px_35px_rgba(45,40,60,0.08)] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-800 block">
                        Incoming Line 1
                      </span>
                      <span className="text-[9px] text-slate-400">02:45 · Connected</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-[#6EEDC2]/20 text-emerald-800 px-2 py-0.5 rounded-full">
                    Live Call
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 mb-2.5">
                  <div className="text-[11px] font-medium text-slate-700">
                    &ldquo;My water heater is making a buzzing sound and leaking...&rdquo;
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Volume2 className="w-3 h-3 text-[#4A3FB5]" />
                    <div className="flex gap-1 items-end h-2.5">
                      <div className="w-0.5 h-2 bg-[#4A3FB5] animate-pulse" />
                      <div className="w-0.5 h-3 bg-[#4A3FB5] animate-pulse delay-75" />
                      <div className="w-0.5 h-1.5 bg-[#4A3FB5] animate-pulse delay-150" />
                      <div className="w-0.5 h-2.5 bg-[#4A3FB5] animate-pulse delay-100" />
                      <div className="w-0.5 h-1 bg-[#4A3FB5] animate-pulse" />
                    </div>
                    <span className="text-[9px] text-slate-400 ml-1">AI Listening</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Caller: Marcus V.</span>
                  <span className="text-emerald-600 font-medium">Auto-qualifying...</span>
                </div>
              </div>

              {/* Front Card: Progress Card */}
              <div className="absolute right-2 sm:right-6 bottom-2 w-[290px] sm:w-[340px] bg-white rounded-3xl p-4 sm:p-5 shadow-[0_20px_45px_rgba(45,40,60,0.12)] transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Qualification Progress
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#4A3FB5] bg-indigo-50 px-2 py-0.5 rounded-full">
                    92% Complete
                  </span>
                </div>

                {/* Animated progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full mb-3.5 overflow-hidden">
                  <motion.div
                    initial={{ width: '20%' }}
                    whileInView={{ width: '92%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#6EEDC2] to-[#4A3FB5] rounded-full"
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Emergency Plumbing triage
                    </span>
                    <span className="text-slate-400 text-[10px]">Verified</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Calendar slot confirmed
                    </span>
                    <span className="text-slate-400 text-[10px]">Tue 9:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Title & Blurb */}
          <div className="relative z-10 text-center max-w-xl mx-auto pt-4">
            <h3 className="text-2xl sm:text-[24px] font-display font-medium text-[#2D283C] tracking-tight mb-2">
              {features.bigCard.title}
            </h3>
            <p className="text-[16px] sm:text-[17px] leading-[25px] text-[#2D283C]/85">
              {features.bigCard.blurb}
            </p>
          </div>
        </motion.div>

        {/* 2. Two Half-Width Cards (485x430, radius 50, 16px gap, no borders, soft diffuse shadow) */}
        <div className="max-w-[987px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Left Card: Reclaim your time (485x430, radius 50) */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(14px)', y: 24 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[485px] h-[430px] bg-[#F6F8F7] rounded-[50px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_40px_rgba(60,50,120,0.08)] relative overflow-hidden"
          >
            {/* Mockup with "Mark as complete" chip and typewriter summary, bleeding off bottom */}
            <div className="bg-white rounded-3xl p-5 shadow-sm flex-1 flex flex-col justify-between mb-4">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6EEDC2]" />
                    <span className="text-xs font-semibold text-slate-800">
                      AI Call Summary
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>Mark as complete</span>
                  </div>
                </div>

                {/* Rich text box with typewriter effect */}
                <div className="bg-[#FAFBFD] rounded-xl p-3 min-h-[96px] text-xs text-slate-700 leading-relaxed font-sans">
                  <span>{displayText}</span>
                  <span className="inline-block w-1.5 h-3.5 bg-[#4A3FB5] ml-0.5 animate-pulse" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Duration: 2m 14s
                </span>
                <span>Dispatched to technician</span>
              </div>
            </div>

            {/* Title & Blurb */}
            <div>
              <h3 className="text-xl sm:text-[24px] font-display font-medium text-[#2D283C] tracking-tight mb-1">
                {features.card1.title}
              </h3>
              <p className="text-[16px] leading-[25px] text-[#2D283C]/85">
                {features.card1.blurb}
              </p>
            </div>
          </motion.div>

          {/* Right Card: Stay on top of every call (485x430, radius 50) */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(14px)', y: 24 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-[485px] h-[430px] bg-[#F6F8F7] rounded-[50px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_10px_40px_rgba(60,50,120,0.08)] relative overflow-hidden"
          >
            {/* Mockup with two call rows (Booked, Escalated) & skeleton lines */}
            <div className="bg-white rounded-3xl p-5 shadow-sm flex-1 flex flex-col justify-center space-y-3 mb-4">
              {/* Row 1: Booked */}
              <div className="p-3 bg-[#FAFBFD] rounded-xl flex items-center justify-between">
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Sarah Jenkins
                    </span>
                    <span className="text-[10px] text-slate-400">· 11:42 AM</span>
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-4/5 h-2 bg-slate-200/80 rounded-full" />
                  <div className="w-2/5 h-1.5 bg-slate-100 rounded-full" />
                </div>
                <span className="text-[10px] font-semibold text-emerald-700 bg-[#6EEDC2]/30 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Booked
                </span>
              </div>

              {/* Row 2: Escalated */}
              <div className="p-3 bg-[#FAFBFD] rounded-xl flex items-center justify-between">
                <div className="space-y-1.5 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-800">
                      Highland Dental Clinic
                    </span>
                    <span className="text-[10px] text-slate-400">· 01:15 PM</span>
                  </div>
                  {/* Skeleton lines */}
                  <div className="w-3/4 h-2 bg-slate-200/80 rounded-full" />
                  <div className="w-1/2 h-1.5 bg-slate-100 rounded-full" />
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Escalated
                </span>
              </div>
            </div>

            {/* Title & Blurb */}
            <div>
              <h3 className="text-xl sm:text-[24px] font-display font-medium text-[#2D283C] tracking-tight mb-1">
                {features.card2.title}
              </h3>
              <p className="text-[16px] leading-[25px] text-[#2D283C]/85">
                {features.card2.blurb}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
