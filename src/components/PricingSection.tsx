import React, { useState } from 'react';
import { content, PricingPlan } from '../content';
import { Check } from 'lucide-react';
import { Card, GlassCard, Button, Chip, SectionHeader, Reveal, EyebrowPill } from './design-system';

interface PricingSectionProps {
  onPlanSelect: (planName: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onPlanSelect }) => {
  const { pricing } = content;
  const [isPilot, setIsPilot] = useState(false);

  return (
    <section id="pricing" className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-[1200px]">
        {/* Section Header */}
        <SectionHeader
          eyebrow={<EyebrowPill>Transparent Pricing</EyebrowPill>}
          headline={[
            { text: 'Plans To Suit', weight: 'light' },
            { text: 'The Way You Work', weight: 'strong' },
          ]}
        />

        {/* 8px Radius Segmented Toggle (No large pill) */}
        <div className="flex justify-center mb-12">
          <div className="h-[38px] p-1 bg-[#EEF0F2] rounded-[8px] border border-[rgba(11,11,15,0.06)] flex items-center">
            <button
              type="button"
              onClick={() => setIsPilot(false)}
              className={`h-full px-4 rounded-[6px] text-xs font-[500] transition-all duration-200 cursor-pointer ${
                !isPilot
                  ? 'bg-white text-[#0B0B0F] shadow-xs'
                  : 'text-[#5B5F68] hover:text-[#0B0B0F]'
              }`}
            >
              {pricing.toggleMonthly}
            </button>
            <button
              type="button"
              onClick={() => setIsPilot(true)}
              className={`h-full px-4 rounded-[6px] text-xs font-[500] transition-all duration-200 cursor-pointer ${
                isPilot
                  ? 'bg-white text-[#0B0B0F] shadow-xs'
                  : 'text-[#5B5F68] hover:text-[#0B0B0F]'
              }`}
            >
              {pricing.togglePilot}
            </button>
          </div>
        </div>

        {/* Three 20px-Radius Cards (385px wide, 491px tall, 15px gap) */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-[15px]">
          {pricing.plans.map((plan: PricingPlan, index: number) => {
            const isMiddle = plan.highlightCurtain;

            if (isMiddle) {
              return (
                <Reveal key={plan.id} delay={0.05}>
                  <div className="w-full max-w-[385px] lg:w-[385px] h-[491px] rounded-[20px] bg-[#060608] border border-[rgba(255,255,255,0.12)] p-[40px] flex flex-col justify-start relative shadow-2 shrink-0 text-[#F4F5F7]">
                    {/* Top: Plan Name & Most Popular Chip */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-[20px] font-display font-[500] text-white tracking-tight">
                        {plan.name}
                      </h3>
                      <Chip active theme="dark">Most popular</Chip>
                    </div>

                    {/* Description: 16px, 2 lines */}
                    <p className="text-[15px] leading-[22px] text-[#9A9EA8] h-[44px] line-clamp-2 mt-2">
                      {plan.description}
                    </p>

                    {/* Price: 40px */}
                    <div className="h-[48px] flex items-baseline gap-1 mt-3">
                      {!isPilot ? (
                        <>
                          <span className="text-[40px] font-display font-[400] text-white tracking-tight tabular-nums leading-none">
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-xs text-[#9A9EA8]">/ month</span>
                        </>
                      ) : (
                        <>
                          <span className="text-[40px] font-display font-[400] text-[#6EEDC2] tracking-tight leading-none">
                            $0
                          </span>
                          <span className="text-xs text-[#9A9EA8]">/ 30-day pilot</span>
                        </>
                      )}
                    </div>

                    {/* Primary Button directly below price */}
                    <div className="mt-[16px]">
                      <Button
                        variant="primary"
                        onClick={() => onPlanSelect(plan.name)}
                        className="w-full"
                      >
                        {plan.ctaLabel}
                      </Button>
                    </div>

                    {/* Feature list: starts 34px below the button */}
                    <ul className="mt-[34px] space-y-2 text-xs text-white/85">
                      {plan.features.slice(0, 4).map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-[#6EEDC2] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            }

            // Left / Right cards (Starter, Scale) with Card component
            return (
              <Reveal key={plan.id} delay={index === 0 ? 0.15 : 0.25}>
                <Card className="w-full max-w-[385px] lg:w-[385px] h-[491px] p-[40px] flex flex-col justify-start shrink-0">
                  {/* Top: Plan Name */}
                  <h3 className="text-[20px] font-display font-[500] text-[#0B0B0F] tracking-tight">
                    {plan.name}
                  </h3>

                  {/* Description: 16px, 2 lines */}
                  <p className="text-[15px] leading-[22px] text-[#5B5F68] h-[44px] line-clamp-2 mt-2">
                    {plan.description}
                  </p>

                  {/* Price: 40px */}
                  <div className="h-[48px] flex items-baseline gap-1 mt-3">
                    {!isPilot ? (
                      <>
                        <span className="text-[40px] font-display font-[400] text-[#0B0B0F] tracking-tight tabular-nums leading-none">
                          ${plan.monthlyPrice}
                        </span>
                        <span className="text-xs text-[#5B5F68]">/ month</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[40px] font-display font-[400] text-[#0B0B0F] tracking-tight leading-none">
                          $0
                        </span>
                        <span className="text-xs text-[#5B5F68]">/ 30-day pilot</span>
                      </>
                    )}
                  </div>

                  {/* Button directly below price */}
                  <div className="mt-[16px]">
                    <Button
                      variant="glass"
                      onClick={() => onPlanSelect(plan.name)}
                      className="w-full"
                    >
                      {plan.ctaLabel}
                    </Button>
                  </div>

                  {/* Feature list: starts 34px below the button */}
                  <ul className="mt-[34px] space-y-2 text-xs text-[#0B0B0F]/85">
                    {plan.features.slice(0, 4).map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
