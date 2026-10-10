import React, { useState } from 'react';
import {
  Headline,
  Button,
  IconSquareLink,
  FormBar,
  EyebrowPill,
  Chip,
  Card,
  GlassCard,
  Section,
  SectionHeader,
  Reveal,
} from './design-system';
import { RotateCcw, ArrowLeft, PhoneCall } from 'lucide-react';

export const StyleGuide: React.FC = () => {
  const [replayKey, setReplayKey] = useState(0);
  const [activeChip, setActiveChip] = useState('Emergency');

  return (
    <div className="w-full min-h-screen bg-[#F5F6F7] text-[#0B0B0F]">
      {/* Sticky top control bar */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[rgba(11,11,15,0.08)] py-3 px-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-[#5B5F68] hover:text-[#0B0B0F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to site</span>
          </a>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0B0B0F]">
            Design System Foundation (Phase 1)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-[#EEF0F2] hover:bg-slate-200 text-xs font-medium text-[#0B0B0F] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Reveals</span>
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. LIGHT SECTION SPECIFICATION */}
      {/* ========================================================= */}
      <Section theme="light">
        <div key={`light-${replayKey}`}>
          <SectionHeader
            eyebrow="Light Foundation"
            headline={[
              { text: 'Restrained, Premium', weight: 'light' },
              { text: 'Light System', weight: 'strong' },
            ]}
            sub="Lots of whitespace, hairline borders, layered soft shadows, and refined small type scale."
          />

          {/* Color Tokens Palette */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5B5F68] mb-4">
              Color Tokens (Light + Accent)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#F5F6F7] border border-[rgba(11,11,15,0.08)] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">bg</div>
                <div className="text-[11px] text-[#5B5F68]">#F5F6F7</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#FFFFFF] border border-[rgba(11,11,15,0.08)] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">surface</div>
                <div className="text-[11px] text-[#5B5F68]">#FFFFFF</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#EEF0F2] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">subtle</div>
                <div className="text-[11px] text-[#5B5F68]">#EEF0F2</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#0B0B0F] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">ink</div>
                <div className="text-[11px] text-[#5B5F68]">#0B0B0F</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#5B5F68] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">muted</div>
                <div className="text-[11px] text-[#5B5F68]">#5B5F68</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#6EEDC2] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">accent mint</div>
                <div className="text-[11px] text-[#5B5F68]">#6EEDC2</div>
              </div>
              <div className="p-3 bg-white border border-[rgba(11,11,15,0.08)] rounded-[10px] shadow-xs">
                <div className="w-full h-10 rounded-[6px] bg-[#062B20] mb-2" />
                <div className="text-xs font-medium text-[#0B0B0F]">ink-on-mint</div>
                <div className="text-[11px] text-[#5B5F68]">#062B20</div>
              </div>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5B5F68] mb-4">
              Typography Scale (Hanken Grotesk &amp; Inter)
            </h3>
            <div className="bg-white rounded-[20px] p-6 border border-[rgba(11,11,15,0.08)] shadow-1 space-y-5">
              <div>
                <span className="text-[11px] font-mono text-[#9A9EA8]">H1 (48px / 1.08) · Mixed Weight</span>
                <Headline
                  as="h1"
                  segments={[
                    { text: 'Never Miss A Call.', weight: 'light' },
                    { text: 'Book More Jobs.', weight: 'strong' },
                  ]}
                />
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#9A9EA8]">H2 (40px / 1.1)</span>
                <Headline
                  as="h2"
                  segments={[
                    { text: 'Plans To Suit', weight: 'light' },
                    { text: 'The Way You Work', weight: 'strong' },
                  ]}
                />
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#9A9EA8]">H3 (22px / 1.25)</span>
                <h3 className="text-[22px] leading-[1.25] font-display font-[500] text-[#0B0B0F]">
                  Reclaim Your Time With Automated Voice Intelligence
                </h3>
              </div>

              <div>
                <span className="text-[11px] font-mono text-[#9A9EA8]">Body (15px / 24px) &amp; Eyebrow (10.5px)</span>
                <div className="mt-1 flex items-center gap-3">
                  <EyebrowPill>Operational Status</EyebrowPill>
                  <p className="text-[15px] leading-[24px] text-[#5B5F68]">
                    Appsian answers every inbound call, qualifies the enquiry and books the next step, 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Button Variants & States */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5B5F68] mb-4">
              Button System (Primary Mint, Link-Icon, Glass/Secondary)
            </h3>
            <div className="bg-white rounded-[20px] p-6 border border-[rgba(11,11,15,0.08)] shadow-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Default states */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5B5F68]">Default State</div>
                  <Button variant="primary">Book a Demo</Button>
                  <Button variant="glass">Get Started</Button>
                  <div>
                    <Button variant="link-icon">Get In Touch</Button>
                  </div>
                </div>

                {/* Forced Hover states */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5B5F68]">Hovered (Forced Active)</div>
                  <Button variant="primary" forceHover>Book a Demo</Button>
                  <Button variant="glass" forceHover>Get Started</Button>
                  <div>
                    <Button variant="link-icon" forceHover>Get In Touch</Button>
                  </div>
                </div>

                {/* Disabled states */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-[#5B5F68]">Disabled State</div>
                  <Button variant="primary" disabled>Book a Demo</Button>
                  <Button variant="glass" disabled>Get Started</Button>
                  <div>
                    <Button variant="link-icon" disabled>Get In Touch</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FormBar & Primitives */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5B5F68] mb-4">
              FormBar &amp; Primitives
            </h3>
            <div className="space-y-6">
              <div className="max-w-2xl">
                <FormBar buttonText="Book a Demo" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <EyebrowPill icon={<PhoneCall className="w-2.5 h-2.5 text-[#6EEDC2]" />}>
                  24/7 Answering
                </EyebrowPill>
                <Chip
                  active={activeChip === 'Emergency'}
                  onClick={() => setActiveChip('Emergency')}
                >
                  Emergency
                </Chip>
                <Chip
                  active={activeChip === 'Repair'}
                  onClick={() => setActiveChip('Repair')}
                >
                  Repair
                </Chip>
                <Chip
                  active={activeChip === 'Install'}
                  onClick={() => setActiveChip('Install')}
                >
                  Install
                </Chip>
                <IconSquareLink />
              </div>
            </div>
          </div>

          {/* Card Component with shadow-1 & hover lift */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5B5F68] mb-4">
              Card Primitive (20px Radius, Shadow-1, 4px Lift on Hover)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <EyebrowPill className="mb-3">Live Qualification</EyebrowPill>
                <h4 className="text-[18px] font-display font-[500] text-[#0B0B0F] mb-1">
                  Screens Urgency &amp; Service Zones
                </h4>
                <p className="text-[14px] leading-[22px] text-[#5B5F68]">
                  Hover over this card to observe the smooth 4px lift, subtle shadow deepening, and refined boundary.
                </p>
              </Card>

              <Card className="p-6">
                <EyebrowPill className="mb-3">Calendar Dispatch</EyebrowPill>
                <h4 className="text-[18px] font-display font-[500] text-[#0B0B0F] mb-1">
                  Automatic Two-Way Sync
                </h4>
                <p className="text-[14px] leading-[22px] text-[#5B5F68]">
                  Integrates cleanly with Google Calendar, ServiceTitan, Jobber, and custom webhooks.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>

      {/* ========================================================= */}
      {/* 2. DARK SECTION SPECIFICATION */}
      {/* ========================================================= */}
      <Section theme="dark">
        <div key={`dark-${replayKey}`}>
          <SectionHeader
            theme="dark"
            eyebrow={<EyebrowPill theme="dark">Dark Foundation</EyebrowPill>}
            headline={[
              { text: 'Restrained, Glass', weight: 'light' },
              { text: 'Dark Container', weight: 'strong' },
            ]}
            sub="28px radius container inset 24px, faint top spotlight, glass panels with backdrop blur, and hairline borders."
          />

          {/* Dark Color Tokens */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9A9EA8] mb-4">
              Color Tokens (Dark Theme)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-[#060608] border border-white/10 mb-2" />
                <div className="text-xs font-medium text-white">bg</div>
                <div className="text-[11px] text-[#9A9EA8]">#060608</div>
              </div>
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-[#0E0F13] border border-white/10 mb-2" />
                <div className="text-xs font-medium text-white">panel</div>
                <div className="text-[11px] text-[#9A9EA8]">#0E0F13</div>
              </div>
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-[#F4F5F7] mb-2" />
                <div className="text-xs font-medium text-white">ink</div>
                <div className="text-[11px] text-[#9A9EA8]">#F4F5F7</div>
              </div>
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-[#9A9EA8] mb-2" />
                <div className="text-xs font-medium text-white">muted</div>
                <div className="text-[11px] text-[#9A9EA8]">#9A9EA8</div>
              </div>
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-gradient-to-r from-[#4A3FB5] via-[#7C7DBE] to-[#ACBDF5] mb-2" />
                <div className="text-xs font-medium text-white">curtain stops</div>
                <div className="text-[11px] text-[#9A9EA8]">Signature Hero</div>
              </div>
              <div className="p-3 bg-white/4 border border-white/8 rounded-[10px]">
                <div className="w-full h-10 rounded-[6px] bg-[#6EEDC2] mb-2" />
                <div className="text-xs font-medium text-white">mint accent</div>
                <div className="text-[11px] text-[#9A9EA8]">#6EEDC2</div>
              </div>
            </div>
          </div>

          {/* Dark GlassCard & Components */}
          <div className="mb-14">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9A9EA8] mb-4">
              GlassCard &amp; Dark Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <EyebrowPill theme="dark" className="mb-3">
                  Glass Panel
                </EyebrowPill>
                <h4 className="text-[18px] font-display font-[500] text-white mb-2">
                  12px Backdrop Blur &amp; Inset Highlight
                </h4>
                <p className="text-[14px] leading-[22px] text-[#9A9EA8] mb-5">
                  Styled with a 1px white/10 border, inset highlight, and restrained dark opacity.
                </p>
                <div className="flex items-center gap-3">
                  <Button variant="primary" size="sm">
                    Book a Demo
                  </Button>
                  <Button variant="glass" theme="dark" size="sm">
                    Secondary
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="p-6 flex flex-col justify-between">
                <div>
                  <EyebrowPill theme="dark" className="mb-3">
                    Link-Icon Dark
                  </EyebrowPill>
                  <h4 className="text-[18px] font-display font-[500] text-white mb-2">
                    Animated Diagonal Icon Micro-interaction
                  </h4>
                  <p className="text-[14px] leading-[22px] text-[#9A9EA8] mb-4">
                    The underline draws from left to right while the mint arrow swaps diagonally.
                  </p>
                </div>
                <div>
                  <Button variant="link-icon" theme="dark">
                    Watch Live Walkthrough
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* FormBar in dark mode */}
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[#9A9EA8] mb-4">
              Dark FormBar
            </h3>
            <div className="max-w-2xl">
              <FormBar theme="dark" buttonText="Start 30-Day Pilot" />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};
