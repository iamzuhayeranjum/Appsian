import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  ArrowUpRight,
  Check,
  Search,
  Filter,
  Loader2,
  Circle,
  Moon,
  ClipboardList,
  PhoneForwarded,
  Send,
} from 'lucide-react';
import { AppsianIcon } from './AppsianLogo';

export const TABS = [
  'After-hours calls',
  'Qualifies the job',
  'Books the estimate',
  'Human handoff',
  'Call summary',
] as const;

export type TabType = (typeof TABS)[number];

type Status = 'Booked' | 'Qualifying' | 'Callback' | 'Transferred';

interface CallRow {
  id: string;
  caller: string;
  job: string;
  status: Status;
  bookedFor: string;
}

const CALLS_DATA: CallRow[] = [
  { id: '1', caller: 'Caller 1', job: 'Roof leak', status: 'Booked', bookedFor: 'Tue 9:00 AM' },
  { id: '2', caller: 'Caller 2', job: 'AC not cooling', status: 'Booked', bookedFor: 'Tue 1:30 PM' },
  { id: '3', caller: 'Caller 3', job: 'Water heater swap', status: 'Qualifying', bookedFor: '—' },
  { id: '4', caller: 'Caller 4', job: 'Panel upgrade', status: 'Booked', bookedFor: 'Wed 8:00 AM' },
  { id: '5', caller: 'Caller 5', job: 'Drain clog', status: 'Callback', bookedFor: '—' },
];

const TAB_STORY: Record<
  TabType,
  { rows: number[]; filter: string; chip: string; icon: React.ElementType }
> = {
  'After-hours calls': { rows: [0, 3], filter: 'After hours', chip: 'Log the call', icon: Moon },
  'Qualifies the job': { rows: [2], filter: 'All calls', chip: 'Save job details', icon: ClipboardList },
  'Books the estimate': { rows: [3], filter: 'Booked', chip: 'Add to calendar', icon: Calendar },
  'Human handoff': { rows: [4], filter: 'Needs callback', chip: 'Transfer to you', icon: PhoneForwarded },
  'Call summary': { rows: [0], filter: 'All calls', chip: 'Send to your phone', icon: Send },
};

type Step = 'check' | 'spinner' | 'pending';

const CHECKLISTS: Record<TabType, [string, Step | 'book'][]> = {
  'After-hours calls': [['Call answered', 'spinner'], ['Job qualified', 'pending'], ['Estimate booked', 'pending']],
  'Qualifies the job': [['Call answered', 'check'], ['Job qualified', 'spinner'], ['Estimate booked', 'pending']],
  'Books the estimate': [['Call answered', 'check'], ['Job qualified', 'check'], ['Estimate booked', 'book']],
  'Human handoff': [['Call answered', 'check'], ['Caller asked for a person', 'check'], ['Transferred to you', 'check']],
  'Call summary': [['Call answered', 'check'], ['Summary written', 'check'], ['Sent to your phone', 'check']],
};

const BADGES: Record<Status, string> = {
  Booked: 'bg-[#E6FBF2] text-[#0B6B46] border-[#6EEDC2]/40',
  Qualifying: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]/60',
  Callback: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
  Transferred: 'bg-[#EEF2FF] text-[#3730A3] border-[#C7D2FE]',
};

interface MeetAppsianProductProps {
  activeTab: TabType;
  isReducedMotion: boolean;
  onHover: (hovered: boolean) => void;
}

const StepIcon: React.FC<{ status: Step }> = ({ status }) =>
  status === 'check' ? (
    <div className="w-4 h-4 rounded-full bg-[#E6FBF2] flex items-center justify-center text-[#0B6B46] shrink-0">
      <Check size={11} strokeWidth={2.8} />
    </div>
  ) : status === 'spinner' ? (
    <Loader2 size={13} className="animate-spin text-[#3B82F6] shrink-0" />
  ) : (
    <Circle size={12} strokeWidth={1.8} className="text-[#D1D5DB] shrink-0" />
  );

export const MeetAppsianProduct: React.FC<MeetAppsianProductProps> = ({
  activeTab,
  isReducedMotion,
  onHover,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const [link, setLink] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [bookEstimateCompleted, setBookEstimateCompleted] = useState(false);

  useEffect(() => {
    setBookEstimateCompleted(false);
    if (activeTab !== 'Books the estimate') return;
    const timer = setTimeout(() => setBookEstimateCompleted(true), 1200);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const checklistItems = CHECKLISTS[activeTab].map(([label, state]) => ({
    label,
    status: state === 'book' ? (bookEstimateCompleted ? 'check' : 'spinner') : state,
  }));

  const story = TAB_STORY[activeTab];
  const focusRow = story.rows[0];
  const ChipIcon = story.icon;

  const statusFor = (row: CallRow): Status => {
    if (activeTab === 'Books the estimate' && row.id === '4' && !bookEstimateCompleted) return 'Qualifying';
    if (activeTab === 'Human handoff' && row.id === '5') return 'Transferred';
    return row.status;
  };
  const slotFor = (row: CallRow) =>
    activeTab === 'Books the estimate' && row.id === '4' && !bookEstimateCompleted ? '—' : row.bookedFor;

  useLayoutEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      const shell = shellRef.current;
      const card = cardRef.current;
      const row = rowRefs.current[focusRow];
      if (!stage || !shell || !card || !row) return;
      const s = stage.getBoundingClientRect();
      const sh = shell.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const r = row.getBoundingClientRect();
      setLink({
        x1: sh.right - s.left - 16,
        y1: r.top - s.top + r.height / 2,
        x2: c.left - s.left,
        y2: c.top - s.top + 38,
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [focusRow, activeTab]);

  const linkPath = link
    ? `M ${link.x1},${link.y1} C ${(link.x1 + link.x2) / 2},${link.y1} ${(link.x1 + link.x2) / 2},${link.y2} ${link.x2},${link.y2}`
    : '';

  const renderBadge = (status: Status) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${BADGES[status]}`}>
      {status}
    </span>
  );

  return (
    <div
      ref={stageRef}
      className="mt-14 relative w-full"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div
        className="absolute inset-x-0 top-10 bottom-0 rounded-[32px] overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #C7DDFB 0%, #DBEAFE 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(30, 58, 138, 0.4) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
          }}
        />
      </div>

      <div className="relative flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-10 px-3 sm:px-6 lg:px-10 pb-8 sm:pb-12">
        {/* DASHBOARD */}
        <motion.div
          ref={shellRef}
          initial={isReducedMotion ? false : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex-1 min-w-0 rounded-[16px] overflow-hidden bg-white"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 20px 50px rgba(30, 58, 138, 0.14)',
          }}
        >
          <div className="h-[46px] px-4 border-b border-[#EEF0F3] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AppsianIcon size={22} />
              <span className="font-semibold text-[13px] text-[#111827]">Calls</span>
            </div>
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6B7280]">
                <Filter size={12} />
                Filter
              </span>
              <div className="w-6 h-6 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold">
                AP
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="hidden lg:flex w-[170px] border-r border-[#EEF0F3] p-3 flex-col gap-3 shrink-0 bg-[#FBFCFD]">
              <div className="relative" aria-hidden="true">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <div className="w-full h-[28px] pl-7 pr-2 rounded-[6px] bg-white border border-[#E5E7EB] text-[11px] text-[#9CA3AF] flex items-center">
                  Search calls...
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                {['All calls', 'Booked', 'Needs callback', 'After hours'].map((label) => (
                  <div
                    key={label}
                    className={`px-2.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-colors duration-300 ${
                      story.filter === label ? 'bg-[#DBEAFE] text-[#1E3A8A]' : 'text-[#4B5563]'
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <table className="w-full table-fixed text-left border-collapse text-[12px]">
                <thead>
                  <tr className="h-[38px] border-b border-[#EEF0F3] text-[#6B7280]">
                    <th className="w-[24%] px-3 sm:px-4 font-medium">Caller</th>
                    <th className="w-[36%] sm:w-[30%] px-3 sm:px-4 font-medium">Job</th>
                    <th className="px-3 sm:px-4 font-medium">Status</th>
                    <th className="hidden sm:table-cell px-3 sm:px-4 font-medium">Booked for</th>
                  </tr>
                </thead>
                <tbody>
                  {CALLS_DATA.map((row, i) => {
                    const isFocus = story.rows.includes(i);
                    return (
                      <tr
                        key={row.id}
                        ref={(el) => {
                          rowRefs.current[i] = el;
                        }}
                        className={`h-[46px] border-b border-[#EEF0F3] last:border-b-0 transition-all duration-300 ${
                          isFocus ? 'bg-[#EFF6FF]' : 'opacity-45'
                        }`}
                      >
                        <td
                          className={`px-3 sm:px-4 font-medium text-[#111827] whitespace-nowrap transition-shadow duration-300 ${
                            isFocus ? 'shadow-[inset_3px_0_0_#3B82F6]' : ''
                          }`}
                        >
                          {row.caller}
                        </td>
                        <td className="px-3 sm:px-4 text-[#4B5563] whitespace-nowrap">{row.job}</td>
                        <td className="px-3 sm:px-4">{renderBadge(statusFor(row))}</td>
                        <td className="hidden sm:table-cell px-3 sm:px-4 text-[#4B5563] font-mono text-[11px] whitespace-nowrap">
                          {slotFor(row)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* APPSIAN'S WORK: checklist card + next-action chip (stacks under the dashboard on small screens) */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
          className="relative z-20 w-full max-w-[360px] self-center lg:self-start lg:max-w-none lg:w-[250px] shrink-0 lg:mt-6 flex flex-col items-center"
        >
          <motion.div
            animate={isReducedMotion ? {} : { y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex flex-col items-center"
          >
            <div
              ref={cardRef}
              className="w-full rounded-[14px] bg-white p-3.5"
              style={{ boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)', border: '1px solid #EEF0F3' }}
            >
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#EEF0F3]">
                <AppsianIcon size={28} />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-[14px] text-[#111827] leading-none">Appsian</span>
                  <span className="text-[12px] text-[#6B7280] leading-tight mt-0.5">Your AI receptionist</span>
                </div>
              </div>

              <div className="mt-3 min-h-[68px]">
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
                      <div key={item.label} className="flex items-center justify-between gap-3 text-[12px]">
                        <span className="text-[#374151] font-medium">{item.label}</span>
                        <StepIcon status={item.status} />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="h-6 border-l-2 border-dotted border-[#1E3A8A]/45" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full bg-white border border-[#E5E7EB] shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
              >
                <ChipIcon size={13} className="text-[#1E3A8A]" />
                <span className="text-[13px] font-semibold text-[#111827] whitespace-nowrap">{story.chip}</span>
                <div className="w-5 h-5 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white shrink-0">
                  <ArrowUpRight size={11} strokeWidth={2.5} />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {link && (
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
          aria-hidden="true"
          fill="none"
        >
          <motion.path
            initial={false}
            animate={{ d: linkPath }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            d={linkPath}
            stroke="rgba(30, 58, 138, 0.55)"
            strokeWidth="1.5"
            strokeDasharray="2 4"
            strokeLinecap="round"
          />
          <circle cx={link.x1} cy={link.y1} r="3" fill="#1E3A8A" />
          <circle cx={link.x2} cy={link.y2} r="3" fill="#1E3A8A" />
        </svg>
      )}
    </div>
  );
};
