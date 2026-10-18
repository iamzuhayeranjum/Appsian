import React, { useState } from 'react';
import { content } from '../content';
import { Mail, Check, CheckCircle2 } from 'lucide-react';
import { Headline, Reveal } from './design-system';
import { SectionTag } from './SectionTag';
import { submitDemoRequest } from '../lib/submitDemoRequest';

interface FinalCtaBandProps {
  onSuccessDemo?: () => void;
}

export const FinalCtaBand: React.FC<FinalCtaBandProps> = ({ onSuccessDemo }) => {
  const { finalCta } = content;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid work email.');
      return;
    }
    setError('');
    submitDemoRequest({ email });
    setSubmitted(true);
    if (onSuccessDemo) onSuccessDemo();
  };

  return (
    <section
      data-theme="dark"
      className="relative w-full bg-[#000000] overflow-hidden min-h-[min(100svh,820px)] py-[120px] px-6 flex flex-col items-center justify-center text-center select-none"
      style={{
        width: '100%',
        margin: 0,
        borderRadius: 0,
      }}
    >
      {/* ── BACKGROUND LAYER 1: Very faint indigo glow behind headline ── */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 45%, rgba(79, 70, 229, 0.16), transparent 70%)',
        }}
      />

      {/* ── BACKGROUND LAYER 2: Faint grid of rounded tiles with radial mask fade ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="cta-tile-grid"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <rect
                x="4"
                y="4"
                width="64"
                height="64"
                rx="12"
                fill="none"
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
              />
            </pattern>
            <radialGradient id="cta-grid-mask" cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="85%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <mask id="cta-mask">
              <rect width="100%" height="100%" fill="url(#cta-grid-mask)" />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#cta-tile-grid)"
            mask="url(#cta-mask)"
          />
        </svg>
      </div>

      {/* Subtle bottom blend into near-black footer (#050608) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #050608 100%)',
        }}
      />

      {/* ── CONTENT CONTAINER (z-10) ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Glass Tag on Top */}
        <Reveal delay={0.05}>
          <SectionTag
            label="GET STARTED"
            icon="sparkles"
            variant="dark"
            className="mb-6"
          />
        </Reveal>

        {/* Centered headline with mixed weights */}
        <Reveal delay={0.15}>
          <Headline
            as="h2"
            theme="dark"
            segments={[
              { text: 'Answer Every Call.', weight: 'light' },
              { text: 'Book Every Job.', weight: 'strong' },
            ]}
            className="max-w-3xl mx-auto text-[36px] sm:text-[46px] md:text-[52px] tracking-tight leading-[1.12]"
          />
        </Reveal>

        {/* Gray subline */}
        <Reveal delay={0.25}>
          <p className="text-white/60 text-[15px] sm:text-[17px] leading-[26px] sm:leading-[28px] max-w-xl mx-auto mt-4 font-normal">
            {finalCta.subline}
          </p>
        </Reveal>

        {/* Three checkmark items */}
        <Reveal delay={0.35}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-7 max-w-2xl mx-auto">
            {finalCta.checks.map((item, idx) => (
              <React.Fragment key={item}>
                <div className="flex items-center gap-2 text-[14px] sm:text-[15px] text-white/85 font-normal whitespace-nowrap">
                  <div className="w-[18px] h-[18px] rounded-[6px] bg-white/10 border border-white/20 flex items-center justify-center text-[#6EEDC2] shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </div>
                {idx < finalCta.checks.length - 1 && (
                  <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/25" />
                )}
              </React.Fragment>
            ))}
          </div>
        </Reveal>

        {/* Glass Form with glowing line along top and bottom edges */}
        <Reveal delay={0.45}>
          <div className="mt-9 flex flex-col items-center w-full max-w-[480px] mx-auto">
            {!submitted ? (
              <form
                onSubmit={handleSubmit}
                className="relative w-full rounded-[16px] p-1.5 flex items-center gap-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow:
                    '0 20px 40px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Glowing line along TOP edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none rounded-t-[16px]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 15%, rgba(255,255,255,0.7) 40%, rgba(110,237,194,0.9) 50%, rgba(255,255,255,0.7) 60%, rgba(255,255,255,0.15) 85%, transparent 100%)',
                    filter: 'drop-shadow(0 0 4px rgba(110, 237, 194, 0.5))',
                  }}
                />

                {/* Glowing line along BOTTOM edge */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none rounded-b-[16px]"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.08) 80%, transparent 100%)',
                  }}
                />

                {/* Email input field */}
                <div className="relative flex-1 h-[46px] flex items-center">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder={finalCta.emailPlaceholder}
                    className="w-full h-full pl-10 pr-3 text-[14px] text-white placeholder-white/40 bg-transparent focus:outline-none"
                  />
                </div>

                {/* Button in mint token */}
                <button
                  type="submit"
                  className="btn-premium btn-premium--mint group relative h-[46px] px-6 rounded-[12px] font-sans font-semibold text-[14px] shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-transform duration-150 active:scale-[0.98]"
                >
                  <span>{finalCta.buttonLabel}</span>
                </button>
              </form>
            ) : (
              <div
                className="h-[52px] rounded-[14px] px-6 flex items-center gap-2.5 text-sm text-[#6EEDC2] border border-[#6EEDC2]/40"
                style={{
                  background: 'rgba(110, 237, 194, 0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Demo requested! Our team will contact {email} shortly.</span>
              </div>
            )}

            {error && (
              <p className="mt-2 text-xs text-rose-400 font-medium">{error}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
};
