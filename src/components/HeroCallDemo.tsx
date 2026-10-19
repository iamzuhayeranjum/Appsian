import React, { useState, useEffect } from 'react';
import { Phone, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';

export const HeroCallDemo: React.FC = () => {
  const [activeSeconds, setActiveSeconds] = useState(38);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSeconds((s) => (s >= 59 ? 12 : s + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-[860px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8 rounded-[24px] bg-[#F8FAFC] border border-[#E2E8F0]">
      {/* Left: Active Live Call Info */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#10B981]/15 text-[#10B981] flex items-center justify-center animate-pulse">
            <Phone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#0F172A]">
                Inbound Emergency Call
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#10B981]/15 text-[#059669]">
                Live 00:{formatTime(activeSeconds)}
              </span>
            </div>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Caller: Robert M. · Water heater leaking in basement
            </p>
          </div>
        </div>

        {/* Live Audio Transcript Box */}
        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-xs space-y-2.5">
          <div className="flex items-start gap-2.5 text-[13px]">
            <span className="font-semibold text-[#2563EB] shrink-0">Appsian:</span>
            <span className="text-[#334155]">
              &ldquo;I understand water is pooling right now. I have dispatched technician Dave on high priority.&rdquo;
            </span>
          </div>
          <div className="flex items-start gap-2.5 text-[13px]">
            <span className="font-semibold text-[#64748B] shrink-0">Caller:</span>
            <span className="text-[#334155]">
              &ldquo;Thank you so much! Will he arrive before noon?&rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* Right: Automated Outcome */}
      <div className="w-full md:w-[280px] p-5 rounded-[20px] bg-white border border-[#E2E8F0] shadow-xs shrink-0 space-y-3">
        <div className="text-[12px] uppercase font-semibold tracking-wider text-[#64748B]">
          Automated Dispatch
        </div>
        <div className="flex items-center gap-2 text-[14px] font-medium text-[#0F172A]">
          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          <span>Job Booked & Assigned</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
          <Calendar className="w-4 h-4 text-[#3B82F6]" />
          <span>Today, 11:30 AM Slot</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
          <Clock className="w-4 h-4 text-[#8B5CF6]" />
          <span>CRM Synchronized (Jobber)</span>
        </div>
        <div className="pt-2 border-t border-[#F1F5F9]">
          <span className="text-[12px] font-semibold text-[#2563EB] inline-flex items-center gap-1">
            <span>View Full Audio Log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
