import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { content, PricingPlan } from '../content';
import { CurtainBackground } from './CurtainBackground';

interface PricingSectionProps {
  onPlanSelect: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
  const { pricing } = content;
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section
      id="pricing"
      className="w-full pt-[110px] pb-[110px] overflow-clip relative flex flex-col items-center px-4 sm:px-6"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 68%, #F7F7FA 100%)',
      }}
    >
      <div className="w-full max-w-[1100px] flex flex-col items-center">
        {/* ========================================================= */}
        {/* SECTION HEADER                                            */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center pt-2 sm:pt-4 mb-[56px]">
          {/* Eyebrow pill with upper padding */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[10px] bg-white border border-[rgba(11,11,15,0.08)] shadow-xs uppercase text-[11px] font-sans font-medium tracking-[0.08em] text-[#0B0B0F] mb-4 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6EEDC2]" />
            <span>TRANSPARENT PRICING</span>
          </div>

          {/* Heading: ONE line, 44px / 1.1, Instrument Sans, light weight (300), color #2D283C */}
          <h2 className="text-3xl sm:text-4xl md:text-[44px] leading-[1.1] font-display font-[300] text-[#2D283C] tracking-[-0.02em] text-center">
            {pricing.h2 || 'Plans to suit the way you work'}
          </h2>
        </div>

        {/* ========================================================= */}
        {/* THREE CARDS (3 equal-width cards in a row, 24px gap)       */}
        {/* ========================================================= */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-[24px] items-stretch justify-items-center lg:justify-items-stretch">
          {pricing.plans.map((plan: PricingPlan, index: number) => {
            const isMiddle = plan.highlightCurtain;

            return (
              <motion.div
                key={plan.id}
                initial={isReducedMotion ? {} : { opacity: 0, filter: 'blur(10px)', y: 14 }}
                whileInView={isReducedMotion ? {} : { opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full max-w-[420px] lg:max-w-none flex flex-col"
              >
                {isMiddle ? (
                  /* ===================================================== */
                  /* FEATURED CARD: #08070D with bottom ~65% violet curtain */
                  /* ===================================================== */
                  <div className="relative w-full h-full rounded-[32px] p-[28px] overflow-clip bg-[#08070D] text-white flex flex-col justify-start">
                    {/* Drifting violet curtain occupying bottom ~65% */}
                    <div className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none overflow-hidden z-0">
                      <CurtainBackground variant="violet" />
                      {/* Black fade at top edge of curtain */}
                      <div
                        className="absolute inset-x-0 top-0 h-[70px] pointer-events-none"
                        style={{
                          background: 'linear-gradient(180deg, #08070D 0%, rgba(8,7,13,0) 100%)',
                        }}
                      />
                    </div>

                    {/* Card Content (z-10) */}
                    <div className="relative z-10 flex flex-col h-full">
                      {/* Plan Name */}
                      <div className="h-[20px] flex items-center">
                        <h3 className="text-[16px] font-[500] text-white leading-none">
                          {plan.name}
                        </h3>
                      </div>

                      {/* Description: 14px/1.5, ~60% opacity, max 3 lines */}
                      <p className="text-[14px] leading-[1.5] text-white/60 line-clamp-3 h-[63px] mt-2">
                        {plan.description}
                      </p>

                      {/* Price: 44px, Instrument Sans light (300) */}
                      <div className="h-[52px] flex items-baseline gap-1 mt-4">
                        <span className="text-[44px] font-display font-[300] tracking-[-0.02em] text-white leading-none tabular-nums">
                          ${plan.monthlyPrice}
                        </span>
                        <span className="text-[14px] font-normal text-white/55 leading-none">
                          /month
                        </span>
                      </div>

                      {/* Mint Button: 44px tall, radius 12px, mint #6EEDC2, text #062B20 */}
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => onPlanSelect(plan.name)}
                          className="btn-premium btn-premium--mint group relative w-full h-[44px] rounded-[12px] text-[14px] font-[500] flex items-center justify-center cursor-pointer overflow-hidden gap-3"
                        >
                          <span>{plan.ctaLabel}</span>
                          <ArrowRight className="btn-arrow w-3.5 h-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      {/* Feature list: 13.5px/1.4, 20px gap below button, items spaced 14px apart */}
                      <ul className="mt-[20px] flex flex-col gap-[14px] pb-2">
                        {plan.features.map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-[12px] text-[13.5px] leading-[1.4] text-white [text-shadow:0_1px_8px_rgba(8,7,13,0.35)]"
                          >
                            <span className="w-1 h-1 rounded-full shrink-0 mt-[7.5px] bg-white/75" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* ===================================================== */
                  /* SIDE CARD: #F4F4F9, no border, inset top highlight   */
                  /* ===================================================== */
                  <div className="w-full h-full rounded-[32px] p-[28px] bg-[#F4F4F9] border-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] text-[#2D283C] flex flex-col justify-start transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_40px_-12px_rgba(30,30,60,0.12)]">
                    {/* Plan Name */}
                    <div className="h-[20px] flex items-center">
                      <h3 className="text-[16px] font-[500] text-[#2D283C] leading-none">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Description: 14px/1.5, ~60% opacity, max 3 lines */}
                    <p className="text-[14px] leading-[1.5] text-[#2D283C]/60 line-clamp-3 h-[63px] mt-2">
                      {plan.description}
                    </p>

                    {/* Price: 44px, Instrument Sans light (300) */}
                    <div className="h-[52px] flex items-baseline gap-1 mt-4">
                      <span className="text-[44px] font-display font-[300] tracking-[-0.02em] text-[#2D283C] leading-none tabular-nums">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-[14px] font-normal text-[#2D283C]/55 leading-none">
                        /month
                      </span>
                    </div>

                    {/* White Button: 44px tall, radius 12px, white #FFFFFF, text #1A1A24 */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => onPlanSelect(plan.name)}
                        className="btn-premium btn-premium--light group relative w-full h-[44px] rounded-[12px] text-[14px] font-[500] flex items-center justify-center cursor-pointer overflow-hidden gap-3"
                      >
                        <span>{plan.ctaLabel}</span>
                        <ArrowRight className="btn-arrow w-3.5 h-3.5" strokeWidth={2} />
                      </button>
                    </div>

                    {/* Feature list: 13.5px/1.4, 20px gap below button, items spaced 14px apart */}
                    <ul className="mt-[20px] flex flex-col gap-[14px] pb-2">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-[12px] text-[13.5px] leading-[1.4] text-[#2D283C]"
                        >
                          <span className="w-1 h-1 rounded-full shrink-0 mt-[7.5px] bg-[#2D283C]/55" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* FOUNDING CLIENT PROGRAM (Slim full-width bar below cards)  */}
        {/* ========================================================= */}
        <motion.div
          initial={isReducedMotion ? {} : { opacity: 0, filter: 'blur(10px)', y: 14 }}
          whileInView={isReducedMotion ? {} : { opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[1100px] mt-[24px] bg-[#F4F4F9] rounded-[20px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#6EEDC2] shrink-0" />
            <span className="text-[14px] text-[#2D283C] leading-normal font-sans">
              {pricing.pilotTagline}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onPlanSelect('Founding pilot')}
            className="btn-premium btn-premium--light shrink-0 h-[32px] px-4 rounded-full text-[13px] font-medium cursor-pointer whitespace-nowrap"
          >
            Claim pilot spot
          </button>
        </motion.div>
      </div>
    </section>
  );
};
