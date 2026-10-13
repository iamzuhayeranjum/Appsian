import React from 'react';
import { Star, Quote, TrendingUp } from 'lucide-react';

export const CustomersSection: React.FC = () => {
  const testimonials = [
    {
      quote:
        'We were missing 20–30 calls a week while on job sites or after 5 PM. In our first 30 days with Appsian, we booked an extra $24,500 in plumbing jobs that previously would have gone to our competitors.',
      author: 'Marcus Vance',
      role: 'Owner, Vance Premier Plumbing',
      location: 'Austin, TX',
      metric: '+$24.5k / mo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces',
    },
    {
      quote:
        'Our emergency dispatch is finally automated. Appsian wakes up our on-call HVAC technicians only when a real furnace failure or leak is confirmed. Our tech burnout dropped to zero.',
      author: 'Elena Rostova',
      role: 'Operations Director, Apex Heating & Air',
      location: 'Denver, CO',
      metric: '100% emergency pickup',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces',
    },
    {
      quote:
        'Callers genuinely believe they are speaking with our top front-desk receptionist. The voice quality and immediate SMS booking link has made us the most responsive electrical company in town.',
      author: 'Devon Clarke',
      role: 'Founder, Clarke Electric Group',
      location: 'Seattle, WA',
      metric: '3.4x faster booking',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=faces',
    },
  ];

  return (
    <section id="customers" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-[#6EEDC2] text-xs font-semibold tracking-widest uppercase">
          Proven Trade Success
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-3 tracking-tight">
          Loved by contractors who value their time.
        </h2>
        <p className="text-white/70 text-base sm:text-lg mt-4 leading-relaxed">
          See how commercial & residential service contractors capture revenue they used to leave on the table.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="p-7 rounded-[22px] bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-[#6EEDC2]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-[#6EEDC2]" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6EEDC2] bg-[#6EEDC2]/10 px-2.5 py-1 rounded-full border border-[#6EEDC2]/20">
                  <TrendingUp size={12} />
                  <span>{t.metric}</span>
                </span>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/8">
              <img
                src={t.avatar}
                alt={t.author}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <h4 className="text-sm font-semibold text-white">{t.author}</h4>
                <p className="text-xs text-white/50">{t.role} • {t.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
