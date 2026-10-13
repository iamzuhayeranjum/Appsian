import React, { useState } from 'react';
import { Calculator, Download, FileText, ArrowUpRight, DollarSign } from 'lucide-react';

interface ResourcesSectionProps {
  onCtaClick: () => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({ onCtaClick }) => {
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(15);
  const [avgTicketValue, setAvgTicketValue] = useState(450);
  const [conversionRate, setConversionRate] = useState(40); // 40%

  // Calculate annual recovered revenue
  const monthlyRecoveredCalls = Math.round(missedCallsPerWeek * 4.33 * (conversionRate / 100));
  const monthlyRevenue = monthlyRecoveredCalls * avgTicketValue;
  const annualRevenue = monthlyRevenue * 12;

  return (
    <section id="resources" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#6EEDC2] text-xs font-semibold tracking-widest uppercase">
          Free Tools & Playbooks
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
          Contractor Revenue & Missed-Call Calculator
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-4 leading-relaxed">
          See exactly how much revenue escapes your voicemail box each month, and calculate your ROI with Appsian.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Interactive Calculator */}
        <div className="lg:col-span-7 p-8 rounded-[24px] bg-white/[0.04] border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#6EEDC2]/10 border border-[#6EEDC2]/30 flex items-center justify-center text-[#6EEDC2]">
                <Calculator size={20} />
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Missed-Call Calculator</h3>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Missed calls */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <span className="text-white/80">Estimated missed / after-hours calls per week</span>
                  <span className="text-[#6EEDC2] font-mono text-base font-semibold">
                    {missedCallsPerWeek} calls
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(Number(e.target.value))}
                  className="w-full accent-[#6EEDC2] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 2: Average ticket value */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <span className="text-white/80">Average job invoice / ticket value</span>
                  <span className="text-[#6EEDC2] font-mono text-base font-semibold">
                    ${avgTicketValue.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="3500"
                  step="50"
                  value={avgTicketValue}
                  onChange={(e) => setAvgTicketValue(Number(e.target.value))}
                  className="w-full accent-[#6EEDC2] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Slider 3: Conversion Rate */}
              <div>
                <div className="flex justify-between items-center text-sm font-medium mb-2">
                  <span className="text-white/80">Booking conversion rate with instant answer</span>
                  <span className="text-[#6EEDC2] font-mono text-base font-semibold">
                    {conversionRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full accent-[#6EEDC2] h-2 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="mt-8 p-6 rounded-[18px] bg-gradient-to-r from-white/[0.06] to-[#6EEDC2]/[0.08] border border-[#6EEDC2]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-white/50 font-medium">
                Annual Recoverable Revenue
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#6EEDC2] font-mono mt-1">
                +${annualRevenue.toLocaleString()}
                <span className="text-xs text-white/60 font-sans ml-1">/year</span>
              </div>
              <p className="text-xs text-white/60 mt-1">
                Based on ~{monthlyRecoveredCalls} extra booked jobs/month
              </p>
            </div>

            <button
              type="button"
              onClick={onCtaClick}
              className="px-5 py-3 rounded-[12px] bg-[#6EEDC2] hover:bg-[#85f5cd] text-[#062B20] font-semibold text-sm flex items-center gap-1.5 transition-all shadow-[0_4px_16px_rgba(110,237,194,0.3)] cursor-pointer select-none shrink-0"
            >
              <span>Capture This Revenue</span>
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Playbooks & Guides */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="p-6 rounded-[22px] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">
                  The 2026 Trade Missed-Call Benchmark Report
                </h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Data from 1.2M home service calls revealing peak abandonment hours and weekend lost revenue.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#6EEDC2] font-medium cursor-pointer hover:underline">
                  <Download size={14} />
                  <span>Download Free PDF (2.4 MB)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[22px] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">
                  Emergency Dispatch Scripting Guide
                </h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Standard Operating Procedures (SOP) for triage questions used by multi-million dollar HVAC & plumbing firms.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-[#6EEDC2] font-medium cursor-pointer hover:underline">
                  <Download size={14} />
                  <span>Download Free Playbook</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[22px] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <DollarSign size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">
                  Pricing & ROI Guarantee
                </h4>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  Flat monthly subscription with unlimited inbound minutes. If Appsian doesn't recover 3x its cost in 30 days, your month is free.
                </p>
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-[#6EEDC2] font-semibold hover:underline"
                >
                  <span>Explore Pricing Plans</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
