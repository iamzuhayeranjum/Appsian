import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronRight, CheckCircle2, Check, ArrowRight } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { HeroCurtainBackground } from './HeroCurtainBackground';
import { navigate } from '../lib/navigate';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const BookingPage: React.FC = () => {
  const [submittedInfo, setSubmittedInfo] = useState<{ firstName: string; business: string } | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submittedInfo]);

  // Reusable simplified 3-step explainer card
  const stepsCard = (
    <div className="rounded-[22px] p-5 sm:p-5.5 relative overflow-hidden text-white shadow-md bg-gradient-to-br from-[#1b2a9e] via-[#2f6bf0] to-[#6aa8ff]">
      {/* Soft light highlight in top-left */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(60% 50% at 10% 0%, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-3.5">
        <h3 className="text-[15px] font-semibold text-white tracking-tight">
          What happens after you submit
        </h3>

        <div className="flex flex-col gap-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-[11px] text-white shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white leading-tight">
                We build your custom AI receptionist
              </h4>
              <p className="text-[12px] text-white/80 mt-0.5 leading-snug">
                Customized for your trades, services, and schedule.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-[11px] text-white shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white leading-tight">
                You test it with live calls
              </h4>
              <p className="text-[12px] text-white/80 mt-0.5 leading-snug">
                Call your private demo number to test bookings and questions.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-bold text-[11px] text-white shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-white leading-tight">
                Go live with zero disruption
              </h4>
              <p className="text-[12px] text-white/80 mt-0.5 leading-snug">
                Forward your calls whenever you&apos;re ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#2D283C] flex flex-col relative overflow-x-clip font-sans">
      {/* =================================================================
          1. BLUE CURTAIN TOP BANNER (560px on md+, auto on mobile)
         ================================================================= */}
      <section
        className="relative w-full h-auto md:h-[560px] pt-6 pb-[160px] md:pb-0 px-5 overflow-hidden flex flex-col items-center justify-start select-none"
        style={{
          background:
            'linear-gradient(180deg, #082a6b 0%, #0b3d99 16%, #1263d6 38%, #2e86f0 60%, #7db9f8 76%, #cfe8ff 88%, #f4faff 96%, #f5f6f8 100%)',
        }}
      >
        {/* Animated WebGL Blue Curtain Background */}
        <HeroCurtainBackground />

        {/* Content Container (z-10) */}
        <div className="relative z-10 w-full max-w-[1280px] mx-auto flex flex-col items-center text-center">
          {/* Centered Appsian Logo (24px from top) */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: 0.05, ease: EASE }}
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group text-left outline-none select-none border-0 bg-transparent p-0"
              aria-label="Appsian Home"
            >
              <div className="transition-transform duration-200 group-hover:scale-105">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="260 296 694 569"
                  fill="none"
                  aria-label="Appsian"
                  width={28}
                  height={23}
                  className="block shrink-0"
                >
                  <defs>
                    <linearGradient id="booking-nav-logo-white-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#bfe0ff" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#booking-nav-logo-white-grad)"
                    d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
                  />
                  <path
                    fill="url(#booking-nav-logo-white-grad)"
                    d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
                  />
                </svg>
              </div>
              <span className="text-[20px] font-semibold tracking-[-0.01em] text-white leading-none">
                Appsian
              </span>
            </button>
          </motion.div>

          {/* Breadcrumb Pill (centered, 22px under the logo) */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: 0.13, ease: EASE }}
            className="mt-[22px]"
          >
            <div
              className="h-[26px] px-3 rounded-full inline-flex items-center gap-1.5 text-[11.5px] font-sans"
              style={{
                background: 'rgba(255, 255, 255, 0.14)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-white/75 hover:text-white transition-colors cursor-pointer font-medium select-none"
              >
                Home
              </button>
              <ChevronRight className="w-2.5 h-2.5 text-white/60" strokeWidth={2.2} aria-hidden="true" />
              <span className="text-white font-semibold">Free demo</span>
            </div>
          </motion.div>

          {/* Centered Headline (margin-top 22px) */}
          <motion.h1
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: 0.21, ease: EASE }}
            className="mt-[22px] font-display font-semibold text-[clamp(36px,4.6vw,56px)] leading-[1.08] tracking-[-0.03em] text-white text-center"
          >
            <span className="block">Get Your Free</span>
            <span className="block text-white mt-1">
              AI Demo
            </span>
          </motion.h1>

          {/* Centered Subline (margin-top 14px) */}
          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: 0.29, ease: EASE }}
            className="mt-3.5 text-[16px] lg:text-[17px] leading-[1.55] text-white/90 font-medium max-w-[640px] px-4"
          >
            See how Appsian answers your calls, qualifies leads, and books jobs directly into your schedule — customized for your exact trade and services.
          </motion.p>
        </div>
      </section>

      {/* =================================================================
          2. THE WHITE CARD (Overlaps the banner by 150px on desktop)
         ================================================================= */}
      <main className="relative z-10 w-full max-w-[1120px] mx-auto px-5 md:px-8 -mt-[110px] md:-mt-[150px] mb-8">
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: reduceMotion ? 0.3 : 0.8,
            delay: reduceMotion ? 0 : 0.25,
            ease: EASE,
          }}
          className="bg-white rounded-[32px] border border-[rgba(15,23,42,0.04)] shadow-[0_50px_100px_-50px_rgba(20,40,120,0.45),0_10px_30px_-18px_rgba(20,40,120,0.18)] p-6 sm:p-9 md:p-[44px_48px]"
        >
          <div className="grid grid-cols-1 md:grid-cols-[0.84fr_1.16fr] gap-10 md:gap-14 items-start">
            {/* LEFT COLUMN: Badge, Heading, Helper text, Checklist, Steps Card */}
            <div className="flex flex-col text-left">
              {/* 1. Mint Outlined Badge */}
              <div className="self-start h-[26px] px-3 rounded-full border border-[#6eedc2] bg-white flex items-center justify-center text-[12px] font-medium text-[#0f7a5a] select-none">
                Free Demo
              </div>

              {/* 2. Heading */}
              <h2 className="mt-4 font-display font-semibold text-[clamp(26px,2.8vw,34px)] text-[#0b1530] tracking-[-0.025em] leading-[1.12]">
                <span className="block">Tell Us About</span>
                <span className="block text-[#0b1530] mt-0.5">
                  Your Business
                </span>
              </h2>

              {/* 3. Helper Text */}
              <p className="mt-3 text-[14.5px] leading-[1.6] text-[#64748b] max-w-[400px]">
                Fill in your details below and we'll prepare a working voice demo tailored to your company.
              </p>

              {/* 4. Checklist (3 items, 18px circle icons) */}
              <div className="mt-5.5 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#2563eb] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[13.5px] text-[#475569] leading-[1.5]">
                    100% free personalized demo &middot; No credit card required
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#2563eb] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[13.5px] text-[#475569] leading-[1.5]">
                    Ready to test within 24 hours
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-[18px] h-[18px] text-[#2563eb] shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-[13.5px] text-[#475569] leading-[1.5]">
                    Zero changes to your existing phone carrier
                  </span>
                </div>
              </div>

              {/* 5. Steps Card (Desktop view: sits at the bottom of left column) */}
              <div className="hidden md:block mt-7">
                {stepsCard}
              </div>
            </div>

            {/* RIGHT COLUMN: The Form or Success State */}
            <div className="w-full flex flex-col">
              {!submittedInfo ? (
                <BookingForm onSuccess={(info) => setSubmittedInfo(info)} />
              ) : (
                /* Success Celebration Panel */
                <div className="py-10 px-4 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#38bdf8] flex items-center justify-center text-white mb-5 shadow-md">
                    <Check className="w-8 h-8 stroke-[2.8]" aria-hidden="true" />
                  </div>

                  <h3 className="text-[26px] font-bold text-[#0b1530] tracking-tight">
                    You're all set{submittedInfo.firstName ? `, ${submittedInfo.firstName}` : ''}!
                  </h3>

                  <p className="text-[15px] text-[#475569] mt-2.5 max-w-[420px] leading-relaxed">
                    We received your details{submittedInfo.business ? ` for ${submittedInfo.business}` : ''}. Our team is configuring your custom AI receptionist demo now.
                  </p>

                  <div className="mt-6 p-4 rounded-[16px] bg-[#f5f8ff] border border-[#dce8ff] text-left max-w-[420px] w-full">
                    <span className="text-[12px] font-semibold text-[#1d4ed8] uppercase tracking-wider block">
                      What to expect
                    </span>
                    <p className="text-[13px] text-[#475569] mt-1 leading-relaxed">
                      We'll email you a private demo link and phone number within 24 hours so you can test calling it yourself.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="mt-8 btn-premium btn-premium--blue btn-glitter h-[48px] px-7 rounded-[14px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <span>Return to Home</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Steps Card on Mobile: sits directly below the form/success card */}
              <div className="block md:hidden mt-10 pt-6 border-t border-slate-100">
                {stepsCard}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* =================================================================
          3. FOOTER (Clean, sits directly on #F5F6F8 with 64px top, 40px bottom)
         ================================================================= */}
      <footer className="mt-16 mb-10 w-full text-center text-[13px] text-[#64748b]">
        <p>&copy; 2026 Appsian Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
