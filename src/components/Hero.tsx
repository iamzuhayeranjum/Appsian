import React, { useState, forwardRef } from 'react';
import { PhoneCall, Play, Sparkles, CheckCircle2, ShieldCheck, Zap, Volume2, Star } from 'lucide-react';

interface HeroProps {
  nameInputRef: React.RefObject<HTMLInputElement | null>;
  onOpenCallSimulator: (name: string, trade: string, phone: string) => void;
}

export const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ nameInputRef, onOpenCallSimulator }, ref) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [trade, setTrade] = useState('Plumbing & Drainage');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmitDemo = (e: React.FormEvent) => {
      e.preventDefault();
      onOpenCallSimulator(name || 'Alex Morgan', trade, phone || '+1 (555) 234-5678');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    };

    return (
      <section
        ref={ref}
        id="hero-section"
        className="relative min-h-[920px] w-full pt-[130px] pb-[100px] px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-start overflow-hidden bg-[#07090e]"
      >
        {/* ========================================================
            THE CURTAIN: Moving silky dark mesh curtain background
            Softly blurred through the glass pills at the top
            ======================================================== */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          {/* Base dark backdrop gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080d] via-[#0b0f19] to-[#07090e]" />

          {/* Flowing curtain fold 1 - emerald/mint glow */}
          <div
            className="absolute -top-[25%] -left-[10%] w-[120%] h-[90%] opacity-45 blur-[85px] animate-curtain-wave"
            style={{
              background:
                'radial-gradient(ellipse 65% 55% at 30% 40%, rgba(110,237,194,0.35) 0%, rgba(16,185,129,0.18) 35%, rgba(6,182,212,0.08) 60%, transparent 80%)',
            }}
          />

          {/* Flowing curtain fold 2 - deep cyan/indigo drape */}
          <div
            className="absolute -top-[15%] right-[-15%] w-[95%] h-[85%] opacity-40 blur-[95px] animate-curtain-wave-2"
            style={{
              background:
                'radial-gradient(ellipse 55% 65% at 60% 30%, rgba(56,189,248,0.28) 0%, rgba(99,102,241,0.20) 45%, rgba(13,148,136,0.05) 75%, transparent 85%)',
            }}
          />

          {/* Silky curtain fabric ridges & vertical light shimmers */}
          <div
            className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
            style={{
              backgroundImage: `repeating-linear-gradient(
                95deg,
                rgba(255, 255, 255, 0.08) 0px,
                rgba(255, 255, 255, 0.08) 1px,
                transparent 1px,
                transparent 72px
              )`,
            }}
          />

          {/* Subtle noise grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Soft vignette at bottom */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/12 bg-white/[0.05] backdrop-blur-md text-[13px] font-medium text-[#6EEDC2] mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#6EEDC2] animate-pulse" />
            <Sparkles size={14} className="text-[#6EEDC2]" />
            <span>24/7 AI Receptionist & Call Dispatcher for Trades</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-white leading-[1.08] max-w-4xl mb-6">
            Never miss another customer call{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#b8ffe2] to-[#6EEDC2]">
              or 5-figure booking.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed font-normal">
            Appsian answers incoming calls within 2 rings, qualifies emergency and routine enquiries,
            captures caller details, and syncs directly to your calendar & CRM — 24/7.
          </p>

          {/* ========================================================
              HERO DEMO BAR (Target for "Get Free Demo" CTA)
              id="hero-demo-bar" with Name field inputRef
              ======================================================== */}
          <div
            id="hero-demo-bar"
            className="w-full max-w-3xl rounded-[20px] p-2 sm:p-2.5 border border-white/16 bg-white/[0.07] backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] transition-all duration-300 focus-within:border-[#6EEDC2]/50 focus-within:shadow-[0_20px_60px_-15px_rgba(110,237,194,0.18)]"
          >
            <form
              onSubmit={handleSubmitDemo}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              {/* Name field */}
              <div className="flex-1 text-left px-3 py-2 rounded-[12px] bg-black/30 border border-white/8 transition-colors focus-within:border-white/20">
                <label
                  htmlFor="demo-name-input"
                  className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-0.5"
                >
                  Your Name
                </label>
                <input
                  ref={nameInputRef}
                  id="demo-name-input"
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-white text-[15px] placeholder:text-white/35 outline-none font-medium"
                />
              </div>

              {/* Trade field */}
              <div className="sm:w-[220px] text-left px-3 py-2 rounded-[12px] bg-black/30 border border-white/8 transition-colors focus-within:border-white/20">
                <label
                  htmlFor="demo-trade-select"
                  className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-0.5"
                >
                  Business / Trade
                </label>
                <select
                  id="demo-trade-select"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                  className="w-full bg-transparent text-white text-[15px] outline-none font-medium cursor-pointer [&>option]:bg-[#121620] [&>option]:text-white"
                >
                  <option value="Plumbing & Drainage">Plumbing & Drainage</option>
                  <option value="HVAC & Climate">HVAC & Climate</option>
                  <option value="Electrical Services">Electrical Services</option>
                  <option value="Roofing & Restoration">Roofing & Restoration</option>
                  <option value="Auto Mechanics & Towing">Auto Mechanics</option>
                  <option value="Home Renovation">Home Renovation</option>
                </select>
              </div>

              {/* Phone / simulation input */}
              <div className="sm:w-[190px] text-left px-3 py-2 rounded-[12px] bg-black/30 border border-white/8 transition-colors focus-within:border-white/20">
                <label
                  htmlFor="demo-phone-input"
                  className="block text-[11px] font-medium uppercase tracking-wider text-white/50 mb-0.5"
                >
                  Direct Phone
                </label>
                <input
                  id="demo-phone-input"
                  type="tel"
                  placeholder="(555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent text-white text-[15px] placeholder:text-white/35 outline-none font-medium"
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                className="h-[56px] px-6 rounded-[14px] bg-[#6EEDC2] hover:bg-[#85f5cd] text-[#062B20] font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(110,237,194,0.35)] transition-all duration-180 active:scale-[0.98] select-none shrink-0"
              >
                <Play size={16} className="fill-[#062B20]" />
                <span>Simulate Call</span>
              </button>
            </form>
          </div>

          {/* Micro confirmation & guarantee */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[13px] text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#6EEDC2]" />
              <span>Instant live audio demo</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#6EEDC2]" />
              <span>No credit card required</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap size={15} className="text-[#6EEDC2]" />
              <span>Integrates in 3 minutes</span>
            </span>
          </div>

          {/* Social Proof strip */}
          <div className="mt-14 pt-8 border-t border-white/8 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Customer avatar"
                    className="w-9 h-9 rounded-full border-2 border-[#07090e] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#6EEDC2]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-[#6EEDC2]" />
                  ))}
                  <span className="text-white font-semibold text-xs ml-1">4.9 / 5.0</span>
                </div>
                <p className="text-[12px] text-white/60">Over 320,000 inbound calls handled</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-white/40 text-xs font-medium tracking-wider uppercase">
              <span>Trusted by 450+ trades</span>
              <span className="h-3 w-px bg-white/15" />
              <span>99.98% uptime SLA</span>
              <span className="h-3 w-px bg-white/15" />
              <span>HIPAA & SOC-2 ready</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
);

Hero.displayName = 'Hero';
