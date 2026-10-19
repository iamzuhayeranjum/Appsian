import React from 'react';

const INTEGRATIONS = [
  { name: 'ServiceTitan', label: 'ServiceTitan' },
  { name: 'Jobber', label: 'Jobber' },
  { name: 'Housecall Pro', label: 'Housecall Pro' },
  { name: 'Google Calendar', label: 'Google Calendar' },
  { name: 'Zapier', label: 'Zapier' },
  { name: 'Twilio', label: 'Twilio' },
  { name: 'QuickBooks', label: 'QuickBooks' },
  { name: 'Stripe', label: 'Stripe' },
];

export const IntegrationsStrip: React.FC = () => {
  return (
    <section className="w-full bg-[#0B0F19] border-y border-white/[0.08] py-8 overflow-hidden">
      <div className="max-w-[1248px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="shrink-0 text-center md:text-left">
          <p className="text-[12px] uppercase tracking-[0.14em] font-semibold text-white/50">
            Works with your existing software
          </p>
          <p className="text-[14px] text-white/80 font-medium mt-0.5">
            Zero setup changes to your phone number or CRM
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
          {INTEGRATIONS.map((item) => (
            <div
              key={item.name}
              className="px-3.5 py-1.5 rounded-[10px] bg-white/[0.04] border border-white/[0.08] hover:border-white/20 transition-all text-white/70 hover:text-white text-[13px] font-medium tracking-tight select-none"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
