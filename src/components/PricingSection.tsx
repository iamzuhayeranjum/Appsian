import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, Check, Phone } from 'lucide-react';
import { SectionTag } from './SectionTag';
import { content, PricingPlan } from '../content';

interface PricingSectionProps {
  onPlanSelect: (planName: string) => void;
}

// Every colour in this section is mixed between a LIGHT value and a DARK value using one number, --d (0 = normal page, 1 = fully dark).
// --d is driven by scrolling: the page turns dark as the section scrolls into view and goes back to normal as it scrolls away.
const PRICING_CSS = `
.pr-sec {
  --d: 0;
  background: color-mix(in srgb, #050507 calc(var(--d) * 100%), #F5F6F8);
}
.pr-text { color: color-mix(in srgb, #FFFFFF calc(var(--d) * 100%), #2D283C); }
.pr-muted { color: color-mix(in srgb, rgba(255,255,255,0.58) calc(var(--d) * 100%), rgba(45,40,60,0.62)); }
.pr-faint { color: color-mix(in srgb, rgba(255,255,255,0.42) calc(var(--d) * 100%), rgba(45,40,60,0.5)); }
.pr-line { border-color: color-mix(in srgb, rgba(255,255,255,0.1) calc(var(--d) * 100%), rgba(11,11,15,0.09)); }
.pr-pill {
  color: color-mix(in srgb, #FFFFFF calc(var(--d) * 100%), #0B0B0F);
  background: color-mix(in srgb, rgba(255,255,255,0.05) calc(var(--d) * 100%), #FFFFFF);
  border-color: color-mix(in srgb, rgba(255,255,255,0.14) calc(var(--d) * 100%), rgba(11,11,15,0.08));
}
.pr-chip {
  color: color-mix(in srgb, rgba(255,255,255,0.86) calc(var(--d) * 100%), rgba(45,40,60,0.8));
  background: color-mix(in srgb, rgba(255,255,255,0.03) calc(var(--d) * 100%), rgba(255,255,255,0.7));
  border-color: color-mix(in srgb, rgba(255,255,255,0.12) calc(var(--d) * 100%), rgba(11,11,15,0.09));
}
.pr-chip-green {
  color: color-mix(in srgb, #6EEDC2 calc(var(--d) * 100%), #0F7A58);
  background: color-mix(in srgb, rgba(110,237,194,0.10) calc(var(--d) * 100%), rgba(15,122,88,0.09));
  border-color: color-mix(in srgb, rgba(110,237,194,0.22) calc(var(--d) * 100%), rgba(15,122,88,0.18));
}
.pr-price {
  background-image: linear-gradient(
    180deg,
    color-mix(in srgb, #FFFFFF calc(var(--d) * 100%), #2D283C) 0%,
    color-mix(in srgb, #8E8E99 calc(var(--d) * 100%), #5B5F68) 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Card wrapper holds the hover glow so it can sit behind the card */
.pr-wrap { position: relative; isolation: isolate; }
.pr-wrap::after {
  content: '';
  position: absolute;
  inset: -8px;
  z-index: -1;
  border-radius: 28px;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(110,237,194,0.6) 0%, rgba(110,237,194,0) 30%, rgba(90,120,255,0) 68%, rgba(120,140,255,0.6) 100%);
  filter: blur(18px);
  opacity: 0;
  transition: opacity 0.45s ease;
}
.pr-wrap:hover::after { opacity: calc(var(--d) * 0.85); }

.pr-card {
  position: relative;
  background: color-mix(in srgb, #0A0A0D calc(var(--d) * 100%), #FFFFFF);
  border: 1px solid color-mix(in srgb, rgba(255,255,255,0.1) calc(var(--d) * 100%), rgba(11,11,15,0.08));
  color: color-mix(in srgb, #FFFFFF calc(var(--d) * 100%), #2D283C);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.pr-wrap:hover .pr-card { transform: translateY(-3px); }

/* glowing gradient edge on hover: bright at the top-left and bottom-right corners */
.pr-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1.5px;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(170,255,230,1) 0%, rgba(110,237,194,0) 30%, rgba(90,120,255,0) 66%, rgba(150,165,255,1) 100%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.pr-wrap:hover .pr-card::before { opacity: var(--d); }

@media (prefers-reduced-motion: reduce) {
  .pr-card, .pr-wrap::after, .pr-card::before { transition: none; }
  .pr-wrap:hover .pr-card { transform: none; }
}
`;

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
  const { pricing } = content;
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Darkness 0 -> 1 while the top of the section scrolls up into the screen,
  // then 1 -> 0 while the bottom of the section scrolls out again.
  const { scrollYProgress: enterProgress } = useScroll({
    target: sectionRef,
    offset: ['start 88%', 'start 42%'],
  });
  const { scrollYProgress: leaveProgress } = useScroll({
    target: sectionRef,
    offset: ['end 62%', 'end 22%'],
  });
  const darkness = useTransform([enterProgress, leaveProgress], (values: number[]) => {
    const value = values[0] * (1 - values[1]);
    return Math.min(1, Math.max(0, value));
  });

  return (
    <motion.section
      ref={sectionRef}
      id="pricing"
      data-theme="dark"
      className="pr-sec w-full pt-[110px] pb-[110px] overflow-clip relative flex flex-col items-center px-4 sm:px-6"
      style={{ '--d': darkness } as any}
    >
      <style>{PRICING_CSS}</style>

      <div className="w-full max-w-[1180px] flex flex-col items-center">
        {/* SECTION HEADER */}
        <div className="flex flex-col items-center text-center pt-2 sm:pt-4 mb-[56px]">
          <SectionTag
            label="TRANSPARENT PRICING"
            icon="badge-dollar-sign"
            variant="dark"
            className="mb-4"
          />

          <h2 className="pr-text text-3xl sm:text-4xl md:text-[44px] leading-[1.1] font-display font-[300] tracking-[-0.02em] text-center">
            {pricing.h2 || 'Plans to suit the way you work'}
          </h2>
        </div>

        {/* PLAN CARDS */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch justify-items-center lg:justify-items-stretch">
          {pricing.plans.map((plan: PricingPlan, index: number) => {
            const approxCalls = plan.callsLabel ? plan.callsLabel.replace(/[()]/g, '') : '';

            return (
              <motion.div
                key={plan.id}
                initial={isReducedMotion ? {} : { opacity: 0, filter: 'blur(10px)', y: 14 }}
                whileInView={isReducedMotion ? {} : { opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="pr-wrap w-full max-w-[440px] lg:max-w-none flex flex-col"
              >
                <div className="pr-card flex h-full flex-col rounded-[18px] p-6 sm:p-7">
                  {/* Plan name + badge */}
                  <div className="flex items-center gap-3 min-h-[40px]">
                    <h3 className="pr-text text-[21px] font-display font-[500] leading-none tracking-[-0.01em]">
                      {plan.name}
                    </h3>
                    {plan.popular && (
                      <span className="pr-chip-green inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-[5px] text-[11.5px] font-medium leading-none">
                        <span className="w-1 h-1 rounded-full bg-current" />
                        Most popular
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline gap-2.5">
                    <span className="pr-muted text-[13px] font-sans">Monthly</span>
                    <span className="pr-price text-[44px] font-display font-[500] tracking-[-0.03em] leading-none tabular-nums">
                      ${plan.monthlyPrice}
                    </span>
                  </div>

                  {/* CTA (premium button, arrow chip on the right like the reference) */}
                  <button
                    type="button"
                    onClick={() => onPlanSelect(plan.name)}
                    className={`btn-premium ${
                      plan.popular ? 'btn-premium--mint btn-glitter' : 'btn-premium--light btn-glitter btn-glitter--light'
                    } group relative mt-6 w-full h-[46px] rounded-[10px] text-[14px] font-[500] flex items-center justify-center cursor-pointer`}
                  >
                    <span>{plan.ctaLabel}</span>
                    <span
                      aria-hidden="true"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-[7px] border border-black/10 flex items-center justify-center"
                    >
                      <ArrowUpRight className="btn-arrow-diag w-4 h-4" strokeWidth={2} />
                    </span>
                  </button>

                  <div className="pr-line mt-6 border-t" />

                  {/* Pilot badge + description */}
                  <div className="mt-6">
                    <span className="pr-chip-green inline-flex items-center gap-1.5 rounded-[6px] border px-2.5 py-[5px] text-[11.5px] font-medium leading-none">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      30-day founding pilot
                    </span>
                    <p className="pr-text mt-3.5 text-[14.5px] leading-[1.55]">{plan.description}</p>
                  </div>

                  {/* Package includes */}
                  <div className="mt-7">
                    <div className="pr-muted text-[13.5px] font-sans">Package includes</div>
                    <ul className="mt-3.5 flex flex-col gap-[13px]">
                      {plan.features.map((feat) => (
                        <li key={feat} className="pr-text flex items-start gap-3 text-[14px] leading-[1.4]">
                          <Check className="w-4 h-4 shrink-0 mt-[1px]" strokeWidth={1.8} aria-hidden="true" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Usage details pinned to the bottom so all cards line up */}
                  <div className="mt-auto pt-8 flex flex-col gap-5">
                    <div>
                      <div className="pr-muted text-[13.5px] font-sans">Included minutes</div>
                      <div className="pr-text mt-1.5 flex items-center gap-2 text-[14px]">
                        <Phone className="pr-faint w-3 h-3" aria-hidden="true" />
                        {plan.minutesLabel}
                      </div>
                    </div>
                    {approxCalls && (
                      <div>
                        <div className="pr-muted text-[13.5px] font-sans">Approx. calls</div>
                        <div className="pr-text mt-1.5 flex items-center gap-2 text-[14px]">
                          <Phone className="pr-faint w-3 h-3" aria-hidden="true" />
                          {approxCalls}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FOUNDING CLIENT PROGRAM (slim bar below the cards) */}
        <motion.div
          initial={isReducedMotion ? {} : { opacity: 0, filter: 'blur(10px)', y: 14 }}
          whileInView={isReducedMotion ? {} : { opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="pr-card pr-pilot w-full mt-6 rounded-[18px] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#6EEDC2] shrink-0" />
            <span className="pr-text text-[14px] leading-normal font-sans">{pricing.pilotTagline}</span>
          </div>
          <button
            type="button"
            onClick={() => onPlanSelect('Founding pilot')}
            className="btn-premium btn-premium--light btn-glitter btn-glitter--light shrink-0 h-[34px] px-4 rounded-[8px] text-[13px] font-medium cursor-pointer whitespace-nowrap"
          >
            <span>Claim pilot spot</span>
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};
