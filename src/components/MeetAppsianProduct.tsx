import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, CheckCircle2, Phone, Clock, FileText, AlertTriangle, ShieldCheck } from 'lucide-react';

export const TABS = [
  'Books the estimate',
  'Collects the job details',
  'Dispatches emergency calls',
  'Syncs with your CRM',
] as const;

export type TabType = (typeof TABS)[number];

interface MeetAppsianProductProps {
  activeTab: TabType;
  isReducedMotion?: boolean;
  onHover?: (hovered: boolean) => void;
}

const CALLS_DATA = [
  {
    caller: 'James Peterson',
    phone: '(512) 489-0124',
    trade: 'Roofing Repair',
    time: '2 mins ago',
    status: 'Booked',
    slot: 'Tomorrow, 10:00 AM',
    urgency: 'Medium',
  },
  {
    caller: 'Sarah Jenkins',
    phone: '(512) 671-8820',
    trade: 'Burst Pipe Emergency',
    time: '14 mins ago',
    status: 'Dispatched',
    slot: 'Urgent Tech En Route',
    urgency: 'High',
  },
  {
    caller: 'David Martinez',
    phone: '(512) 349-9021',
    trade: 'HVAC Seasonal Tune-up',
    time: '42 mins ago',
    status: 'Booked',
    slot: 'Friday, 2:00 PM',
    urgency: 'Routine',
  },
  {
    caller: 'Lisa Montgomery',
    phone: '(512) 802-5519',
    trade: 'Electrical Panel Upgrade',
    time: '1 hour ago',
    status: 'Qualified',
    slot: 'Estimate Sent via SMS',
    urgency: 'Medium',
  },
];

export const MeetAppsianProduct: React.FC<MeetAppsianProductProps> = ({
  activeTab,
  onHover,
}) => {
  return (
    <div
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className="mt-8 max-w-[1180px] mx-auto p-4 sm:p-6 lg:p-8 rounded-[32px] bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm flex flex-col lg:flex-row gap-6 items-stretch"
    >
      {/* LEFT: Live Calls Table */}
      <div className="flex-1 bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
              <h4 className="text-[15px] font-semibold text-[#0F172A]">
                Recent Inbound Calls
              </h4>
            </div>
            <span className="text-[12px] font-medium text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-full">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[#64748B] border-b border-[#F8FAFC] text-[11.5px] uppercase tracking-wider">
                  <th className="pb-2 font-medium">Caller</th>
                  <th className="pb-2 font-medium">Scope</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {CALLS_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 font-medium text-[#0F172A]">
                      <div>{row.caller}</div>
                      <div className="text-[11px] text-[#94A3B8]">{row.phone}</div>
                    </td>
                    <td className="py-3 text-[#475569]">{row.trade}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          row.status === 'Booked'
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : row.status === 'Dispatched'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#F0FDF4] text-[#16A34A]'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-[12px] text-[#0F172A] font-medium">
                      {row.slot}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[12px] text-[#64748B]">
          <span>4 calls answered today · 100% pickup</span>
          <span className="text-[#2563EB] font-medium">Synced with Jobber</span>
        </div>
      </div>

      {/* RIGHT: Tab Action Highlight Panel */}
      <div className="w-full lg:w-[380px] bg-gradient-to-b from-[#1E3A8A] to-[#0B1530] text-white rounded-[24px] p-6 flex flex-col justify-between shadow-md">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#93C5FD]">
              Automated Action
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-medium text-white/90">
              Appsian Agent
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mt-4"
            >
              <h3 className="text-[20px] font-bold text-white tracking-tight leading-snug">
                {activeTab}
              </h3>

              <p className="text-[13.5px] text-white/80 mt-2 leading-relaxed">
                {activeTab === 'Books the estimate' &&
                  'Checks your live calendar for open technician availability, confirms the caller address, and locks in the estimate slot.'}
                {activeTab === 'Collects the job details' &&
                  'Asks the right trade-specific questions: what is leaking, how high is the roof, when did the power go out, and is anyone home.'}
                {activeTab === 'Dispatches emergency calls' &&
                  'Identifies urgent situations instantly, pages on-call staff via SMS/call, and dispatches the closest truck without delay.'}
                {activeTab === 'Syncs with your CRM' &&
                  'Creates or updates the customer profile, uploads the full call transcript and recording, and triggers your standard invoice or quote workflow.'}
              </p>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2.5 p-3 rounded-[12px] bg-white/[0.08] text-[13px]">
                  <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
                  <span>
                    {activeTab === 'Books the estimate' && 'Calendar sync in 0.4 seconds'}
                    {activeTab === 'Collects the job details' && 'Accurate caller address validation'}
                    {activeTab === 'Dispatches emergency calls' && 'Under 60-second dispatch alert'}
                    {activeTab === 'Syncs with your CRM' && 'ServiceTitan & Jobber 2-way sync'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-[12px] bg-white/[0.08] text-[13px]">
                  <CheckCircle2 className="w-4 h-4 text-[#60A5FA] shrink-0" />
                  <span>
                    {activeTab === 'Books the estimate' && 'SMS confirmation sent to customer'}
                    {activeTab === 'Collects the job details' && 'Full audio recording & text summary'}
                    {activeTab === 'Dispatches emergency calls' && 'Emergency protocol override rules'}
                    {activeTab === 'Syncs with your CRM' && 'No duplicate contacts created'}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[12px] text-white/60">
          <span>Active 24 hours a day</span>
          <span className="text-[#93C5FD]">No human delay</span>
        </div>
      </div>
    </div>
  );
};
