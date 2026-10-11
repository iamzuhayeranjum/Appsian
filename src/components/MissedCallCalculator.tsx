import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Calculator, ArrowRight, ArrowUpRight, Check } from 'lucide-react';

export const MissedCallCalculator: React.FC = () => {
  // Input states with specified defaults: 10 calls/wk, $750/job, 30% close rate
  const [callsPerWeek, setCallsPerWeek] = useState<number>(10);
  const [jobValue, setJobValue] = useState<number>(750);
  const [closeRate, setCloseRate] = useState<number>(30);

  // Dragging states to show floating value bubble above thumbs
  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const [isDragging3, setIsDragging3] = useState(false);

  // Math calculations:
  // monthlyCalls = missedPerWeek * 52 / 12
  // jobs = monthlyCalls * (closeRate / 100)
  // monthly = jobs * jobValue
  // yearly = monthly * 12
  const monthlyCalls = (callsPerWeek * 52) / 12;
  const rawJobs = monthlyCalls * (closeRate / 100);
  const jobs = Math.round(rawJobs);
  const rawMonthly = rawJobs * jobValue;
  const targetMonthly = Math.round(rawMonthly);
  const targetYearly = Math.round(rawMonthly * 12);

  // Animated counting number state for targetMonthly
  const [displayMonthly, setDisplayMonthly] = useState<number>(targetMonthly);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      setDisplayMonthly(targetMonthly);
      return;
    }

    const startValue = displayMonthly;
    const diff = targetMonthly - startValue;
    if (diff === 0) return;

    const startTime = performance.now();
    const duration = 550; // ms

    let animId: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + diff * ease);
      setDisplayMonthly(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [targetMonthly]);

  // Stacked notifications cycler for cell 4
  const notificationSamples = [
    { title: 'Missed call · Roof repair enquiry · ~$750', sub: 'Caller waited 4 rings · No voicemail left' },
    { title: 'Missed call · Emergency pipe leak · ~$1,200', sub: 'After-hours dispatch enquiry' },
    { title: 'Missed call · Full HVAC inspection · ~$650', sub: 'Commercial unit quote enquiry' },
  ];
  const [notifIndex, setNotifIndex] = useState(0);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const interval = setInterval(() => {
      setNotifIndex((prev) => (prev + 1) % notificationSamples.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Smooth scroll handler to hero demo bar
  const handleScrollToHeroDemo = () => {
    const nameInput = document.getElementById('demo-name');
    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        nameInput.focus();
      }, 600);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const feat = document.getElementById('features');
    if (feat) {
      feat.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper for formatting currency
  const formatMoney = (val: number) => {
    return '$' + val.toLocaleString('en-US');
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Slider percentage calculations for track fill and floating bubble
  const pct1 = Math.max(0, Math.min(100, ((callsPerWeek - 1) / 49) * 100));
  const pct2 = Math.max(0, Math.min(100, ((jobValue - 100) / 9900) * 100));
  const pct3 = Math.max(0, Math.min(100, ((closeRate - 5) / 75) * 100));

  return (
    <section className="w-full bg-[#F5F6F8] pt-[72px] pb-[96px] relative overflow-hidden">
      {/* Custom styles for range slider thumbs and floating bubble */}
      <style>{`
        .custom-range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid rgba(10, 10, 20, 0.08);
          box-shadow: 0 1px 3px rgba(10, 10, 20, 0.12), 0 4px 12px rgba(10, 10, 20, 0.08);
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        .custom-range-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1px solid rgba(10, 10, 20, 0.08);
          box-shadow: 0 1px 3px rgba(10, 10, 20, 0.12), 0 4px 12px rgba(10, 10, 20, 0.08);
          cursor: pointer;
        }
        .custom-range-slider:active::-webkit-slider-thumb {
          transform: scale(1.12);
        }
      `}</style>

      {/* 1px dot grid (14px spacing, 5% opacity, radially masked toward edges) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#101014 1px, transparent 1px)',
          backgroundSize: '14px 14px',
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      <div className="max-w-[1196px] mx-auto px-4 relative z-10">
        {/* Header (centered) */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Eyebrow Pill: "THE COST OF SILENCE" */}
          <div
            className="h-[32px] px-3.5 rounded-[10px] bg-white flex items-center gap-2 select-none"
            style={{
              boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 6px 16px rgba(10,10,20,.05)',
            }}
          >
            <div className="w-4 h-4 rounded-full bg-[#2D283C] flex items-center justify-center text-white shrink-0">
              <Phone className="w-2.5 h-2.5 fill-white stroke-none" />
            </div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.05em] text-[#2D283C]">
              The Cost Of Silence
            </span>
          </div>

          {/* Headline: mixed weight (44px/1.15, letter-spacing -0.03em) */}
          <h2 className="mt-[28px] mb-[46px] text-3xl sm:text-4xl md:text-[44px] font-display leading-[1.15] tracking-[-0.03em] max-w-3xl text-balance">
            <span className="font-light text-[#2D283C]/70">How much are missed calls</span>{' '}
            <span className="inline-flex items-center justify-center align-middle mx-1.5 text-[#2D283C]">
              {/* 4-point sparkle icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" />
              </svg>
            </span>{' '}
            <span className="font-medium text-[#2D283C]">costing you every month?</span>
          </h2>
        </motion.div>

        {/* CONTAINER (1196px outer rim, padding 6px, radius 46px) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full p-[6px] rounded-[46px] transition-all"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(10, 10, 20, 0.05)',
          }}
        >
          {/* Inner Panel: background #F9FAFB, radius 40px, overflow hidden */}
          <div
            className="w-full bg-[#F9FAFB] rounded-[40px] overflow-hidden"
            style={{
              border: '1px solid rgba(10, 10, 20, 0.06)',
              boxShadow: '0 1px 2px rgba(10,10,20,.04), 0 24px 60px -20px rgba(10,10,20,.12)',
            }}
          >
            {/* Header row: 86px tall, 1px hairline divider below */}
            <div className="h-[86px] px-6 sm:px-8 flex items-center justify-between border-b border-[rgba(10,10,20,0.07)] bg-white/40">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center text-[#2D283C] shrink-0"
                  style={{
                    boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 4px 12px rgba(10,10,20,.04)',
                    border: '1px solid rgba(10,10,20,0.04)',
                  }}
                >
                  <Calculator className="w-5 h-5 stroke-[1.75]" />
                </div>
                <span className="font-display font-normal text-lg sm:text-[20px] text-[#2D283C] tracking-tight">
                  Missed-call calculator
                </span>
              </div>

              {/* Mint "Get Free Demo" button (44px tall) */}
              <button
                type="button"
                onClick={handleScrollToHeroDemo}
                className="group h-[44px] rounded-[10px] px-4 sm:px-[22px] bg-[#6EEDC2] text-[#062B20] font-sans font-medium text-[13px] sm:text-[15px] flex items-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-[1px] shadow-[0_8px_30px_rgba(110,237,194,0.35)] active:scale-[0.98]"
              >
                <span>Get Free Demo</span>
                <span className="relative inline-flex items-center justify-center w-4 h-4 overflow-hidden ml-1 shrink-0">
                  <ArrowRight className="w-4 h-4 absolute transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-5" />
                  <ArrowRight className="w-4 h-4 absolute -translate-x-5 transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0" />
                </span>
              </button>
            </div>

            {/* Grid: 2 columns x 2 rows (stacked under 900px), divided by 1px hairlines */}
            <div className="grid grid-cols-1 min-[900px]:grid-cols-2">
              {/* CELL 1: Step 1 */}
              <div className="group/cell min-h-[380px] pt-[32px] px-6 sm:px-10 flex flex-col items-center text-center relative overflow-hidden border-b min-[900px]:border-r border-[rgba(10,10,20,0.07)] transition-colors duration-400 hover:bg-[#FBFBFC]">
                {/* Tag pill */}
                <span
                  className="h-[30px] px-3 rounded-[10px] bg-white flex items-center justify-center text-[11px] font-sans font-semibold uppercase tracking-wider text-[#2D283C] shrink-0"
                  style={{ boxShadow: '0 1px 2px rgba(10,10,20,.05)' }}
                >
                  Step 1
                </span>

                <h3 className="font-display font-normal text-[26px] text-[#2D283C] tracking-tight mt-3">
                  Calls you miss
                </h3>
                <p className="text-[15px] leading-[22px] text-[#2D283C]/70 max-w-[420px] mt-1.5 font-sans">
                  Calls that go unanswered in a typical week: on the job, after hours, on another line.
                </p>

                {/* Slider + Number Input control */}
                <div className="w-full max-w-[420px] mt-6 flex items-center gap-4">
                  <div
                    className="relative flex-1 flex items-center pt-2 pb-2"
                    onMouseEnter={() => setIsDragging1(true)}
                    onMouseLeave={() => setIsDragging1(false)}
                  >
                    {/* Floating value bubble */}
                    <div
                      className={`absolute -top-4 pointer-events-none transition-opacity duration-150 transform -translate-x-1/2 bg-[#2D283C] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm shadow-xs ${
                        isDragging1 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ left: `${pct1}%` }}
                    >
                      {callsPerWeek}
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={callsPerWeek}
                      onMouseDown={() => setIsDragging1(true)}
                      onMouseUp={() => setIsDragging1(false)}
                      onTouchStart={() => setIsDragging1(true)}
                      onTouchEnd={() => setIsDragging1(false)}
                      onChange={(e) => setCallsPerWeek(Number(e.target.value))}
                      aria-label="Calls you miss per week"
                      aria-valuetext={`${callsPerWeek} calls per week`}
                      className="custom-range-slider w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #6EEDC2 0%, #6EEDC2 ${pct1}%, #E2E8F0 ${pct1}%, #E2E8F0 100%)`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={callsPerWeek}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(50, Number(e.target.value) || 1));
                        setCallsPerWeek(val);
                      }}
                      className="w-10 text-center font-sans tabular-nums font-medium text-sm text-[#2D283C] focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 font-sans">calls/wk</span>
                  </div>
                </div>

                {/* Micro-visual: cropped week grid (hidden under 640px) */}
                <div className="hidden sm:block mt-8 w-full max-w-[430px] transition-transform duration-400 group-hover/cell:-translate-y-1">
                  <div
                    className="p-3.5 pb-8 rounded-[14px] text-left"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F7F9 100%)',
                      border: '1px solid rgba(255,255,255,.9)',
                      boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 8px 24px rgba(10,10,20,.06)',
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-2.5 px-1">
                      <span>Missed calls log</span>
                      <span className="text-rose-600 font-semibold">{callsPerWeek} this week</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-center">
                      {days.map((day, dIdx) => {
                        const dotsCount = Math.floor(callsPerWeek / 7) + (dIdx < callsPerWeek % 7 ? 1 : 0);
                        return (
                          <div key={day} className="bg-white/80 rounded-md py-1.5 px-1 border border-slate-100 flex flex-col items-center min-h-[58px]">
                            <span className="text-[10px] text-slate-400 font-sans">{day}</span>
                            <div className="flex flex-wrap items-center justify-center gap-1 mt-1.5 max-w-[32px]">
                              {[...Array(dotsCount)].map((_, dotIdx) => (
                                <span
                                  key={dotIdx}
                                  className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"
                                  style={{ animationDelay: `${(dIdx * 2 + dotIdx) * 100}ms` }}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* CELL 2: Step 2 */}
              <div className="group/cell min-h-[380px] pt-[32px] px-6 sm:px-10 flex flex-col items-center text-center relative overflow-hidden border-b border-[rgba(10,10,20,0.07)] transition-colors duration-400 hover:bg-[#FBFBFC]">
                {/* Tag pill */}
                <span
                  className="h-[30px] px-3 rounded-[10px] bg-white flex items-center justify-center text-[11px] font-sans font-semibold uppercase tracking-wider text-[#2D283C] shrink-0"
                  style={{ boxShadow: '0 1px 2px rgba(10,10,20,.05)' }}
                >
                  Step 2
                </span>

                <h3 className="font-display font-normal text-[26px] text-[#2D283C] tracking-tight mt-3">
                  What a job is worth
                </h3>
                <p className="text-[15px] leading-[22px] text-[#2D283C]/70 max-w-[420px] mt-1.5 font-sans">
                  The average value of a job or estimate you&apos;d book from a call.
                </p>

                {/* Slider + Number Input control */}
                <div className="w-full max-w-[420px] mt-6 flex items-center gap-4">
                  <div
                    className="relative flex-1 flex items-center pt-2 pb-2"
                    onMouseEnter={() => setIsDragging2(true)}
                    onMouseLeave={() => setIsDragging2(false)}
                  >
                    {/* Floating value bubble */}
                    <div
                      className={`absolute -top-4 pointer-events-none transition-opacity duration-150 transform -translate-x-1/2 bg-[#2D283C] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm shadow-xs ${
                        isDragging2 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ left: `${pct2}%` }}
                    >
                      ${jobValue}
                    </div>

                    <input
                      type="range"
                      min={100}
                      max={10000}
                      step={50}
                      value={jobValue}
                      onMouseDown={() => setIsDragging2(true)}
                      onMouseUp={() => setIsDragging2(false)}
                      onTouchStart={() => setIsDragging2(true)}
                      onTouchEnd={() => setIsDragging2(false)}
                      onChange={(e) => setJobValue(Number(e.target.value))}
                      aria-label="Average job value"
                      aria-valuetext={`$${jobValue} average job value`}
                      className="custom-range-slider w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #6EEDC2 0%, #6EEDC2 ${pct2}%, #E2E8F0 ${pct2}%, #E2E8F0 100%)`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
                    <span className="text-xs text-slate-400 font-sans">$</span>
                    <input
                      type="number"
                      min={100}
                      max={10000}
                      step={50}
                      value={jobValue}
                      onChange={(e) => {
                        const val = Math.max(100, Math.min(10000, Number(e.target.value) || 100));
                        setJobValue(val);
                      }}
                      className="w-14 text-center font-sans tabular-nums font-medium text-sm text-[#2D283C] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Micro-visual: cropped estimate card (hidden under 640px) */}
                <div className="hidden sm:block mt-8 w-full max-w-[430px] transition-transform duration-400 group-hover/cell:-translate-y-1">
                  <div
                    className="p-4 pb-8 rounded-[14px] text-left"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F7F9 100%)',
                      border: '1px solid rgba(255,255,255,.9)',
                      boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 8px 24px rgba(10,10,20,.06)',
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="text-[12px] font-semibold text-slate-800">
                          Roof repair estimate
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          Standard dispatched trade quote
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-[#6EEDC2]/30 flex items-center justify-center text-emerald-800">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-3">
                      <span className="text-[11px] text-slate-500 font-sans">Invoice target value</span>
                      <span className="font-sans font-medium text-lg text-slate-900 tabular-nums">
                        {formatMoney(jobValue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CELL 3: Step 3 */}
              <div className="group/cell min-h-[380px] pt-[32px] px-6 sm:px-10 flex flex-col items-center text-center relative overflow-hidden border-b min-[900px]:border-b-0 min-[900px]:border-r border-[rgba(10,10,20,0.07)] transition-colors duration-400 hover:bg-[#FBFBFC]">
                {/* Tag pill */}
                <span
                  className="h-[30px] px-3 rounded-[10px] bg-white flex items-center justify-center text-[11px] font-sans font-semibold uppercase tracking-wider text-[#2D283C] shrink-0"
                  style={{ boxShadow: '0 1px 2px rgba(10,10,20,.05)' }}
                >
                  Step 3
                </span>

                <h3 className="font-display font-normal text-[26px] text-[#2D283C] tracking-tight mt-3">
                  How many become jobs
                </h3>
                <p className="text-[15px] leading-[22px] text-[#2D283C]/70 max-w-[420px] mt-1.5 font-sans">
                  Of the calls you do answer, the share that turn into booked work.
                </p>

                {/* Slider + Number Input control */}
                <div className="w-full max-w-[420px] mt-6 flex items-center gap-4">
                  <div
                    className="relative flex-1 flex items-center pt-2 pb-2"
                    onMouseEnter={() => setIsDragging3(true)}
                    onMouseLeave={() => setIsDragging3(false)}
                  >
                    {/* Floating value bubble */}
                    <div
                      className={`absolute -top-4 pointer-events-none transition-opacity duration-150 transform -translate-x-1/2 bg-[#2D283C] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm shadow-xs ${
                        isDragging3 ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{ left: `${pct3}%` }}
                    >
                      {closeRate}%
                    </div>

                    <input
                      type="range"
                      min={5}
                      max={80}
                      step={1}
                      value={closeRate}
                      onMouseDown={() => setIsDragging3(true)}
                      onMouseUp={() => setIsDragging3(false)}
                      onTouchStart={() => setIsDragging3(true)}
                      onTouchEnd={() => setIsDragging3(false)}
                      onChange={(e) => setCloseRate(Number(e.target.value))}
                      aria-label="Conversion close rate"
                      aria-valuetext={`${closeRate} percent convert to jobs`}
                      className="custom-range-slider w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #6EEDC2 0%, #6EEDC2 ${pct3}%, #E2E8F0 ${pct3}%, #E2E8F0 100%)`,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0 bg-white border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
                    <input
                      type="number"
                      min={5}
                      max={80}
                      value={closeRate}
                      onChange={(e) => {
                        const val = Math.max(5, Math.min(80, Number(e.target.value) || 5));
                        setCloseRate(val);
                      }}
                      className="w-9 text-center font-sans tabular-nums font-medium text-sm text-[#2D283C] focus:outline-none"
                    />
                    <span className="text-xs text-slate-400 font-sans">%</span>
                  </div>
                </div>

                {/* Micro-visual: cropped funnel of 2 horizontal bars (hidden under 640px) */}
                <div className="hidden sm:block mt-8 w-full max-w-[430px] transition-transform duration-400 group-hover/cell:-translate-y-1">
                  <div
                    className="p-4 pb-8 rounded-[14px] text-left"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F7F9 100%)',
                      border: '1px solid rgba(255,255,255,.9)',
                      boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 8px 24px rgba(10,10,20,.06)',
                    }}
                  >
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-sans mb-1">
                          <span>Inbound callers</span>
                          <span className="font-semibold text-slate-800">100%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full" />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-sans mb-1">
                          <span>Converted to booked jobs</span>
                          <span className="font-semibold text-emerald-600">{closeRate}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#6EEDC2] to-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${closeRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CELL 4: Estimate */}
              <div className="group/cell min-h-[380px] pt-[32px] px-6 sm:px-10 flex flex-col items-center text-center relative overflow-hidden transition-colors duration-400 hover:bg-[#FBFBFC]">
                {/* Tag pill */}
                <span
                  className="h-[30px] px-3 rounded-[10px] bg-white flex items-center justify-center text-[11px] font-sans font-semibold uppercase tracking-wider text-[#2D283C] shrink-0"
                  style={{ boxShadow: '0 1px 2px rgba(10,10,20,.05)' }}
                >
                  Estimate
                </span>

                <h3 className="font-display font-normal text-[26px] text-[#2D283C] tracking-tight mt-3">
                  Revenue at risk
                </h3>

                {/* Big Animated Number: 64px (48px under 640px), tabular figures, full ink */}
                <div className="mt-2.5 flex items-baseline justify-center gap-2">
                  <span className="font-display font-medium text-[48px] sm:text-5xl md:text-[64px] leading-none text-[#2D283C] tracking-tight tabular-nums">
                    {formatMoney(displayMonthly)}
                  </span>
                  <span className="text-sm sm:text-base text-[#2D283C]/60 font-sans font-normal">
                    per month
                  </span>
                </div>

                {/* 15px line summary */}
                <p className="text-[15px] leading-[22px] text-[#2D283C]/80 max-w-[420px] mt-2 font-sans">
                  About <strong className="text-[#2D283C] font-semibold">{jobs} jobs</strong> a month, or{' '}
                  <strong className="text-[#2D283C] font-semibold">{formatMoney(targetYearly)}</strong> a year, going to the next business on the list.
                </p>

                {/* Link: "See how Appsian answers every call ↗" */}
                <a
                  href="#features"
                  onClick={handleScrollToFeatures}
                  className="mt-3.5 inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-medium text-[#4A3FB5] hover:text-[#322a87] transition-colors group/link"
                >
                  <span>See how Appsian answers every call</span>
                  <div className="w-4 h-4 rounded-[4px] bg-white shadow-2xs flex items-center justify-center text-[#4A3FB5] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-3 h-3 stroke-[2]" />
                  </div>
                </a>

                {/* Micro-visual: Stack of 3 layered notification cards (visible across viewports) */}
                <div className="mt-6 w-full max-w-[430px] relative h-[86px] transition-transform duration-400 group-hover/cell:-translate-y-1">
                  {/* Card 3 (back) */}
                  <div
                    className="absolute inset-x-4 top-4 h-[60px] rounded-[14px] bg-white opacity-40 scale-[0.92] pointer-events-none"
                    style={{
                      boxShadow: '0 8px 24px rgba(10,10,20,.04)',
                      border: '1px solid rgba(10,10,20,0.04)',
                    }}
                  />
                  {/* Card 2 (middle) */}
                  <div
                    className="absolute inset-x-2 top-2 h-[60px] rounded-[14px] bg-white opacity-75 scale-[0.96] pointer-events-none"
                    style={{
                      boxShadow: '0 8px 24px rgba(10,10,20,.05)',
                      border: '1px solid rgba(10,10,20,0.05)',
                    }}
                  />
                  {/* Card 1 (top, active) */}
                  <div
                    className="relative z-10 p-3 rounded-[14px] flex items-center justify-between text-left transition-all duration-300"
                    style={{
                      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F7F9 100%)',
                      border: '1px solid rgba(255,255,255,.9)',
                      boxShadow: '0 1px 2px rgba(10,10,20,.05), 0 8px 24px rgba(10,10,20,.08)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                        <Phone className="w-3.5 h-3.5 fill-rose-600 stroke-none" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-semibold text-slate-800 truncate">
                          {notificationSamples[notifIndex].title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {notificationSamples[notifIndex].sub}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                      Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Note under container: 12px muted */}
        <p className="mt-4 text-center text-[12px] text-slate-400 font-sans">
          Illustrative estimate based on the numbers you enter. Actual results vary by business.
        </p>
      </div>
    </section>
  );
};
