import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export const ToolverseSection: React.FC = () => {
  const tools = [
    { name: 'Jobber', category: 'Field Service CRM', status: 'Live 2-Way Sync' },
    { name: 'ServiceTitan', category: 'Enterprise Trade Platform', status: 'Direct API' },
    { name: 'Housecall Pro', category: 'Dispatch & Scheduling', status: 'Native Addon' },
    { name: 'Google Calendar', category: 'Availability & Booking', status: 'Real-time Sync' },
    { name: 'Zapier & Make', category: '5,000+ Automation Webhooks', status: 'Instant Connect' },
    { name: 'Twilio & SIP', category: 'Telephony & Trunking', status: 'Number Porting' },
    { name: 'HubSpot', category: 'Sales & Contact Records', status: 'Contact Sync' },
    { name: 'Stripe', category: 'Pre-authorizations & Deposits', status: 'Payment Links' },
  ];

  return (
    <section id="toolverse" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#6EEDC2] text-xs font-semibold tracking-widest uppercase">
          Ecosystem & Connectors
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
          The Toolverse.{' '}
          <span className="text-white/60">Works seamlessly with your current software.</span>
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-4 leading-relaxed">
          No need to change your existing phone number or train your staff on a new CRM. Appsian plugs into your current stack in minutes.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <div
            key={index}
            className="p-5 rounded-[16px] bg-white/[0.04] border border-white/8 hover:border-[#6EEDC2]/40 hover:bg-white/[0.07] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-[#6EEDC2]">
                  {tool.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="text-[10px] text-[#6EEDC2] flex items-center gap-1 font-medium">
                  <CheckCircle2 size={12} />
                  <span>{tool.status}</span>
                </span>
              </div>
              <h3 className="font-semibold text-white text-[16px] group-hover:text-[#6EEDC2] transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-white/50 mt-1">{tool.category}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
