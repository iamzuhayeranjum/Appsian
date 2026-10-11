import React, { useState } from 'react';
import { motion } from 'motion/react';
import { content } from '../content';
import { Mail, Check, CheckCircle2 } from 'lucide-react';
import { Headline, Button, Reveal } from './design-system';
import { CurtainBackground } from './CurtainBackground';
import { SectionFade } from './SectionFade';

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
    // Lead capture simulation
    setSubmitted(true);
    if (onSuccessDemo) onSuccessDemo();
  };

  return (
    <section className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      {/* 56px radius dark container with open dissolving bottom edge and violet moving curtain background */}
      <div
        className="w-full max-w-[1248px] min-h-[440px] rounded-t-[56px] rounded-b-none border-t border-x border-b-0 border-[rgba(255,255,255,0.08)] relative overflow-clip flex flex-col items-center justify-center pt-16 sm:pt-20 pb-[120px] px-6 text-center"
        style={{
          borderRadius: '56px 56px 0 0',
          background: 'transparent',
        }}
      >
        {/* Violet curtain background layer (z-0) */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ zIndex: 0, borderRadius: '56px 56px 0 0' }}
        >
          <CurtainBackground variant="violet" offset={420} />
        </div>

        {/* FADE OVERLAY: smooth ease-in gradient dissolving to #F5F6F7 (height: 150px; z-index: 1) */}
        <SectionFade fadeTo="#F5F6F7" height={150} zIndex={1} />

        <div className="relative z-10 w-full flex flex-col items-center">
          {/* Mixed-weight signature headline */}
          <Reveal delay={0.1}>
            <Headline
              as="h2"
              theme="dark"
              segments={[
                { text: 'Answer Every Call.', weight: 'light' },
                { text: 'Book Every Job.', weight: 'strong' },
              ]}
              className="max-w-2xl mx-auto"
            />
          </Reveal>

          {/* Subline */}
          <Reveal delay={0.2}>
            <p className="text-white/75 text-[15px] sm:text-[17px] leading-[26px] sm:leading-[28px] max-w-xl mx-auto mt-4 font-normal">
              Hear your AI receptionist take a real call for your business before you decide anything.
            </p>
          </Reveal>

          {/* Steps row: three items with 8px check icon badge */}
          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-7 max-w-2xl mx-auto">
              {finalCta.checks.map((item, idx) => (
                <React.Fragment key={item}>
                  <div className="flex items-center gap-2 text-[14px] sm:text-[15px] text-white font-normal whitespace-nowrap">
                    <div className="w-[18px] h-[18px] rounded-[6px] bg-white flex items-center justify-center text-[#062B20] shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                  {idx < finalCta.checks.length - 1 && (
                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/40" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </Reveal>

          {/* Form Bar: 10px input, 8px button */}
          <Reveal delay={0.4}>
            <div className="mt-8 flex justify-center w-full max-w-md mx-auto">
              {!submitted ? (
                <form
                  onSubmit={handleSubmit}
                  className="w-full h-[48px] rounded-[14px] p-1 glass-panel flex items-center gap-2 border border-white/15"
                >
                  <div className="relative flex-1 h-full flex items-center">
                    <Mail className="w-4 h-4 text-white/50 absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder={finalCta.emailPlaceholder}
                      className="w-full h-full pl-10 pr-3 text-xs sm:text-[13px] text-white placeholder-white/50 bg-transparent focus:outline-none"
                    />
                  </div>

                  <Button
                    variant="primary"
                    type="submit"
                    className="!h-[40px] !px-4 !text-xs shrink-0"
                  >
                    {finalCta.buttonLabel}
                  </Button>
                </form>
              ) : (
                <div className="h-[48px] glass-panel rounded-[14px] px-5 flex items-center gap-2 text-xs sm:text-sm text-[#6EEDC2] border border-[#6EEDC2]/30">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Demo requested! Our team will contact {email} shortly.</span>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
