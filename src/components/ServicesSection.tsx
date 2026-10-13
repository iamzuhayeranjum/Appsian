import React from 'react';
import { PhoneForwarded, Clock, CalendarCheck, ShieldAlert, Cpu, MessageSquare } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: Clock,
      title: 'Instant 2-Ring Pickup',
      desc: 'Eliminates voicemail abandonments. Answers 100% of calls within 2 rings, day and night, holidays included.',
      badge: 'Zero Missed Calls',
    },
    {
      icon: ShieldAlert,
      title: 'Emergency Triage & Dispatch',
      desc: 'Detects high-urgency jobs (gas leaks, burst water lines, power outages) and immediately alerts on-call techs via SMS & phone.',
      badge: 'Priority Routing',
    },
    {
      icon: CalendarCheck,
      title: 'Live Calendar Booking',
      desc: 'Integrates straight with Jobber, ServiceTitan, and Google Calendar to book scheduled dispatch slots in real time.',
      badge: 'Zero Friction',
    },
    {
      icon: MessageSquare,
      title: 'Instant SMS Confirmations',
      desc: 'Texts the customer a confirmation with technician ETA, booking details, and payment authorization link.',
      badge: 'Automated SMS',
    },
    {
      icon: Cpu,
      title: 'Job Qualification & Estimates',
      desc: 'Asks custom diagnostic questions for your trade, collects job photos via text, and weeds out price shoppers.',
      badge: 'Custom Playbooks',
    },
    {
      icon: PhoneForwarded,
      title: 'VIP Call Escalation',
      desc: 'Knows when commercial general contractors or high-value builders are calling and transfers them straight to the owner.',
      badge: 'Smart Caller ID',
    },
  ];

  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#6EEDC2] text-xs font-semibold tracking-widest uppercase">
          Comprehensive Inbound Capabilities
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
          Everything your receptionist does,{' '}
          <span className="text-white/60">without breaks or missed calls.</span>
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-4 leading-relaxed">
          Built purposefully for busy trade professionals, contractors, and local service providers who cannot afford to answer phone calls on a ladder or under a sink.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="group p-7 rounded-[20px] bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-[12px] bg-[#6EEDC2]/10 border border-[#6EEDC2]/20 flex items-center justify-center text-[#6EEDC2] group-hover:scale-110 transition-transform">
                    <Icon size={22} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/60 px-2.5 py-1 rounded-full bg-white/5 border border-white/8">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#6EEDC2] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
