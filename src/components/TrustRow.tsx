import React from 'react';
import { PhoneCall, ShieldCheck, CalendarCheck2 } from 'lucide-react';

export const TrustRow: React.FC = () => {
  const points = [
    {
      icon: PhoneCall,
      title: 'Instant 24/7 Pickup',
      desc: 'Answers every inbound lead in under 2 rings. No hold times, no voicemails left unreturned.',
    },
    {
      icon: ShieldCheck,
      title: '99.4% Qualification Accuracy',
      desc: 'Accurately captures caller address, urgency level, timeline, and job details tailored to your trade.',
    },
    {
      icon: CalendarCheck2,
      title: 'Direct Dispatch & Booking',
      desc: 'Books directly into your ServiceTitan, Jobber, or Google Calendar without double bookings.',
    },
  ];

  return (
    <section className="w-full bg-[#F5F6F8] py-14 px-5 md:px-8">
      <div className="max-w-[1187px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {points.map((pt, idx) => {
          const Icon = pt.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-[20px] bg-white border border-[#E2E8F0] shadow-xs flex items-start gap-4"
            >
              <div className="w-11 h-11 rounded-[12px] bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0 text-[#2563EB]">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-[16px] font-semibold text-[#0B0F19] leading-tight">
                  {pt.title}
                </h4>
                <p className="text-[13.5px] text-[#64748B] mt-1.5 leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
