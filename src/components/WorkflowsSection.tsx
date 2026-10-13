import React from 'react';
import { PhoneIncoming, Bot, Calendar, CheckCheck, ArrowRight } from 'lucide-react';

export const WorkflowsSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Call Comes In',
      subtitle: '< 2-Second Pickup',
      desc: 'When an inbound caller rings your business line, Appsian answers immediately with your customized business greeting.',
      icon: PhoneIncoming,
    },
    {
      step: '02',
      title: 'Enquiry Qualified',
      subtitle: 'Natural AI Dialogue',
      desc: 'Ava asks the right trade questions: issue type, address, emergency status, preferred time, and job urgency.',
      icon: Bot,
    },
    {
      step: '03',
      title: 'Slot Booked Directly',
      subtitle: 'Calendar & CRM Sync',
      desc: 'Checks your live technician dispatch schedule and books the customer into an open slot without double booking.',
      icon: Calendar,
    },
    {
      step: '04',
      title: 'Dispatch & Follow-Up',
      subtitle: 'Instant SMS & Alert',
      desc: 'Sends the caller an SMS confirmation with technician bio & arrival window, and pings your crew via Slack or SMS.',
      icon: CheckCheck,
    },
  ];

  return (
    <section id="workflows" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#6EEDC2] text-xs font-semibold tracking-widest uppercase">
          Autonomous Inbound Engine
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
          How every phone call is turned into cash.
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-4 leading-relaxed">
          From first ring to booked appointment in under 90 seconds, without you ever touching your phone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="p-6 rounded-[20px] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-mono font-bold text-[#6EEDC2]/80">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-[10px] bg-white/5 flex items-center justify-center text-white/90 group-hover:text-[#6EEDC2] transition-colors">
                    <Icon size={20} />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <span className="text-xs text-[#6EEDC2] font-medium block mb-3">
                  {item.subtitle}
                </span>
                <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/20">
                  <ArrowRight size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
