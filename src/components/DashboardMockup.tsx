import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PhoneCall,
  FileText,
  CalendarCheck,
  Users,
  Plug,
  Settings,
  Search,
  Sun,
  Play,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface DashboardMockupProps {
  onPlayClick: () => void;
}

export const DashboardMockup: React.FC<DashboardMockupProps> = ({ onPlayClick }) => {
  // Live ticking KPI sample numbers (slight jitter)
  const [callsAnswered, setCallsAnswered] = useState(148);
  const [jobsBooked, setJobsBooked] = useState(42);
  const [afterHours, setAfterHours] = useState(54);

  // Donut chart cycling: 47 -> 61 -> 72 -> 78 -> 84% in a loop
  const rateSteps = [47, 61, 72, 78, 84];
  const [rateIndex, setRateIndex] = useState(0);

  useEffect(() => {
    // Donut rate cycler
    const rateInterval = setInterval(() => {
      setRateIndex((prev) => (prev + 1) % rateSteps.length);
    }, 2800);

    // Subtle number ticker jitter
    const tickerInterval = setInterval(() => {
      setCallsAnswered((prev) => {
        const delta = Math.random() > 0.5 ? 1 : 0;
        return 148 + delta;
      });
      setJobsBooked((prev) => {
        const delta = Math.random() > 0.7 ? 1 : 0;
        return 42 + delta;
      });
      setAfterHours((prev) => {
        const delta = Math.random() > 0.6 ? 1 : 0;
        return 54 + delta;
      });
    }, 3500);

    return () => {
      clearInterval(rateInterval);
      clearInterval(tickerInterval);
    };
  }, []);

  const currentRate = rateSteps[rateIndex];
  // SVG circle calculation: r=40, circumference = 2 * PI * 40 = 251.32
  const circumference = 251.32;
  const strokeDashoffset = circumference - (currentRate / 100) * circumference;

  // Chart hover state
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(3);
  const chartPoints = [
    { day: 'Mon', calls: 24, booked: 7, x: 20, y: 75 },
    { day: 'Tue', calls: 32, booked: 9, x: 75, y: 55 },
    { day: 'Wed', calls: 41, booked: 12, x: 130, y: 35 },
    { day: 'Thu', calls: 48, booked: 15, x: 185, y: 22 },
    { day: 'Fri', calls: 38, booked: 11, x: 240, y: 45 },
    { day: 'Sat', calls: 29, booked: 8, x: 295, y: 62 },
    { day: 'Sun', calls: 34, booked: 10, x: 350, y: 50 },
  ];

  return (
    <div className="w-full max-w-[987px] mx-auto">
      {/* Outer frosted glass shell with 40px radius */}
      <div className="rounded-[40px] p-2.5 sm:p-3.5 bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_20px_70px_rgba(30,20,60,0.22)]">
          {/* Main Dashboard Canvas */}
        <div className="bg-[#FFFFFF] rounded-[32px] overflow-hidden border border-slate-100 flex flex-col md:flex-row shadow-sm min-h-[660px]">
          {/* Dashboard Sidebar */}
          <aside className="w-full md:w-[195px] bg-[#FBFBFC] border-r border-slate-100 p-4 flex flex-col justify-between shrink-0">
            <div>
              <div className="flex items-center gap-2 px-2 py-1 mb-5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#6EEDC2] to-[#4A3FB5] flex items-center justify-center text-white text-[11px] font-bold">
                  A
                </div>
                <span className="font-semibold text-xs tracking-tight text-slate-800">
                  Appsian Suite
                </span>
              </div>

              <div className="text-[10px] uppercase font-semibold text-slate-400 px-2 mb-2 tracking-wider">
                Menu
              </div>

              <nav className="space-y-1 text-xs">
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-medium shadow-xs">
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#6EEDC2]" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  <span>Calls</span>
                </div>
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>Transcripts</span>
                  </div>
                  <span className="text-[9px] bg-[#6EEDC2]/30 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bookings</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Leads</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <Plug className="w-3.5 h-3.5 text-slate-400" />
                  <span>Integrations</span>
                </div>
                <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </div>
              </nav>
            </div>

            {/* Sidebar Upgrade to PRO Card - cropped around 577px */}
            <div className="pt-3 border-t border-slate-100">
              <div className="rounded-xl bg-gradient-to-br from-slate-900 to-[#1e1b4b] p-3 text-white shadow-sm">
                <div className="text-[11px] font-semibold text-[#6EEDC2] mb-0.5">
                  Upgrade to PRO
                </div>
                <div className="text-[10px] text-slate-300 leading-tight mb-2">
                  Unlock multi-line dispatch &amp; webhooks
                </div>
                <button
                  type="button"
                  className="w-full py-1 text-[10px] font-medium bg-[#6EEDC2] text-slate-950 rounded-md"
                >
                  Upgrade
                </button>
              </div>
              <div className="text-[9px] text-slate-400 px-1 pt-2">
                Sample data · v2.6
              </div>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 p-4 sm:p-5 flex flex-col justify-between bg-white relative">
            <div>
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
                <div className="relative flex-1 max-w-[280px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    readOnly
                    value="Search calls or jobs..."
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-full pl-8 pr-3 py-1 text-xs text-slate-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    aria-label="Toggle display mode"
                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2 pl-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
                      JD
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-medium text-slate-800 leading-tight">
                        Apex Trades
                      </div>
                      <div className="text-[10px] text-slate-400">Reception Active</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Title & subtitle */}
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                    Appsian Dashboard - Calls this week
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live answering &amp; automatic calendar dispatch
                  </p>
                </div>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Line Active (24/7)
                </span>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Calls answered
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold text-slate-900 font-sans tabular-nums">
                      {callsAnswered}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                      +14%
                    </span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Jobs booked
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold text-slate-900 font-sans tabular-nums">
                      {jobsBooked}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                      +28%
                    </span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-500 font-medium">
                    After-hours
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold text-slate-900 font-sans tabular-nums">
                      {afterHours}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center">
                      <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
                      +19%
                    </span>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-500 font-medium">
                    Missed calls
                  </div>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-bold text-slate-900 font-sans tabular-nums">
                      0
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      -100%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Line Chart + Donut Chart */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 relative">
                {/* Play button centered over chart area */}
                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                  <button
                    type="button"
                    onClick={onPlayClick}
                    className="pointer-events-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#6EEDC2] text-[#0A261D] flex items-center justify-center animate-pulse-glow shadow-[0_0_30px_rgba(110,237,194,0.65)] hover:scale-108 transition-transform cursor-pointer group"
                    aria-label="Play live voice demo"
                  >
                    <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-[#0A261D] ml-0.5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                {/* Line Chart */}
                <div className="md:col-span-2 bg-[#FAFBFD] border border-slate-100 rounded-2xl p-3 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#4A3FB5]" />
                      <span className="text-xs font-semibold text-slate-800">
                        Performance Overview
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">Calls this week</span>
                  </div>

                  <div className="relative h-28 w-full">
                    <svg
                      viewBox="0 0 380 100"
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="mintVioletGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6EEDC2" />
                          <stop offset="50%" stopColor="#4A3FB5" />
                          <stop offset="100%" stopColor="#7C7DBE" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6EEDC2" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4A3FB5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Area fill */}
                      <path
                        d="M 20 75 Q 75 55, 130 35 T 240 45 T 350 50 L 350 100 L 20 100 Z"
                        fill="url(#areaGrad)"
                      />

                      {/* Smooth curve line */}
                      <path
                        d="M 20 75 Q 75 55, 130 35 T 240 45 T 350 50"
                        fill="none"
                        stroke="url(#mintVioletGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                      />

                      {/* Data dots */}
                      {chartPoints.map((pt, idx) => (
                        <g key={pt.day}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={hoveredPoint === idx ? 5 : 3.5}
                            fill="#FFFFFF"
                            stroke={hoveredPoint === idx ? '#6EEDC2' : '#4A3FB5'}
                            strokeWidth="2.5"
                            className="transition-all cursor-pointer"
                            onMouseEnter={() => setHoveredPoint(idx)}
                          />
                          <text
                            x={pt.x}
                            y="96"
                            textAnchor="middle"
                            fontSize="9"
                            fill="#94A3B8"
                            className="font-medium select-none"
                          >
                            {pt.day}
                          </text>
                        </g>
                      ))}
                    </svg>

                    {/* Tooltip */}
                    {hoveredPoint !== null && (
                      <div
                        className="absolute bg-slate-900 text-white text-[10px] rounded-md px-2 py-1 pointer-events-none shadow-md transform -translate-x-1/2 -translate-y-8"
                        style={{
                          left: `${(chartPoints[hoveredPoint].x / 380) * 100}%`,
                          top: `${chartPoints[hoveredPoint].y}%`,
                        }}
                      >
                        <div className="font-semibold text-[#6EEDC2]">
                          {chartPoints[hoveredPoint].calls} calls
                        </div>
                        <div className="text-[9px] text-slate-300">
                          {chartPoints[hoveredPoint].booked} jobs booked
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Donut Chart: Answer Rate Cycling */}
                <div className="bg-[#FAFBFD] border border-slate-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-800 mb-1">
                    Answer rate
                  </span>
                  <span className="text-[10px] text-slate-500 mb-2">
                    Zero rings missed
                  </span>

                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background track */}
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#E2E8F0"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Progress stroke */}
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="#6EEDC2"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-slate-900 font-sans tabular-nums">
                        {currentRate}%
                      </span>
                      <span className="text-[9px] text-emerald-600 font-medium">
                        24/7 AI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments section - situated around 530-577px, cut flat at bottom */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-800">
                  Payments
                </span>
                <span className="text-[10px] text-slate-400">View all</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">Direct Deposit</span>
                  <span className="font-semibold text-slate-900 font-sans tabular-nums">$6,045.00</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg flex items-center justify-between">
                  <span className="text-slate-600 text-[11px]">Completed Jobs</span>
                  <span className="font-semibold text-slate-900 font-sans tabular-nums">$14,820.00</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
