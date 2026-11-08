import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { BookingForm } from './BookingForm';
import { HeroCurtainBackground } from './HeroCurtainBackground';
import { SectionTag } from './SectionTag';
import { navigate } from '../lib/navigate';

export const BookingPage: React.FC = () => {
  const [submittedInfo, setSubmittedInfo] = useState<{ firstName: string; business: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [submittedInfo]);

  return (
    <div className="min-h-screen bg-[#F5F6F8] text-[#2D283C] flex flex-col relative overflow-x-clip">
      {/* Top Navigation Bar */}
      <header className="relative z-30 w-full max-w-[1280px] mx-auto px-5 md:px-10 py-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group text-left outline-none"
          aria-label="Appsian Home"
        >
          <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#2f6bff] to-[#1241c2] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <AppsianMark size={18} fill="#ffffff" />
          </div>
          <span className="text-[20px] font-bold text-white tracking-tight drop-shadow-xs">
            Appsian
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[14px] font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </header>

      {/* Main Hero & Form Section */}
      <main className="relative flex-1 w-full flex flex-col justify-center">
        {/* Blue Curtain Background */}
        <HeroCurtainBackground />

        <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-10 py-8 lg:py-14 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, Subtitle & Dark Glass Explainer Card */}
          <div className="flex flex-col text-left">
            <SectionTag label="Free Demo" icon="sparkles" variant="dark" />

            <h1 className="mt-5 font-display font-medium text-[36px] sm:text-[44px] lg:text-[50px] leading-[1.08] tracking-[-0.035em] text-white">
              <span className="glitter-text">Get Your Free AI Demo</span>
            </h1>

            <p className="mt-3.5 text-[16px] sm:text-[17px] leading-[1.55] text-[#bfe0ff] max-w-[520px]">
              See how Appsian answers your calls, qualifies leads, and books jobs directly into your schedule — customized for your exact trade and services.
            </p>

            {/* Dark Glass Card: What happens after you submit */}
            <div className="mt-8 glass-dark rounded-[24px] p-6 sm:p-7 relative overflow-hidden text-white flex flex-col gap-5">
              <div>
                <h3 className="text-[17px] font-semibold text-white tracking-tight">
                  What happens after you submit
                </h3>
                <p className="text-[13.5px] text-[#b4c6e7] mt-1 leading-relaxed">
                  Here is our exact 3-step process to get your AI receptionist ready:
                </p>
              </div>

              <div className="flex flex-col gap-4.5">
                {/* Step 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center font-bold text-[12px] text-white shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-white leading-snug">
                      We build your custom AI receptionist
                    </h4>
                    <p className="text-[13px] text-[#b4c6e7] mt-0.5 leading-relaxed">
                      Trained on your specific trade, service area, emergency rules, and calendar availability.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center font-bold text-[12px] text-white shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-white leading-snug">
                      You test it with real phone calls
                    </h4>
                    <p className="text-[13px] text-[#b4c6e7] mt-0.5 leading-relaxed">
                      We give you a private demo number to call. Test after-hours scenarios, tricky customers, and appointment bookings live.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-white/15 border border-white/25 flex items-center justify-center font-bold text-[12px] text-white shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-white leading-snug">
                      Go live in minutes with zero disruption
                    </h4>
                    <p className="text-[13px] text-[#b4c6e7] mt-0.5 leading-relaxed">
                      Forward your missed calls or existing number. Integrates seamlessly with your CRM and calendar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust & Guarantee Checks */}
              <div className="pt-4 border-t border-white/15 flex flex-col gap-2 text-[12.5px] text-[#c5d7f7]">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#46d36e] shrink-0" strokeWidth={2.6} />
                  <span>100% free personalized demo &middot; No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#46d36e] shrink-0" strokeWidth={2.6} />
                  <span>Ready to test within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#46d36e] shrink-0" strokeWidth={2.6} />
                  <span>Zero changes to your existing phone carrier</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: White Form Card OR Thank You Card */}
          <div className="w-full bg-white rounded-[28px] border border-[#d9e2f3] p-6 sm:p-9 shadow-[0_24px_60px_-18px_rgba(8,20,90,0.35)] relative">
            {!submittedInfo ? (
              <>
                <div className="mb-6 text-left">
                  <h2 className="text-[22px] font-bold text-[#0b1530] tracking-tight">
                    Tell us about your business
                  </h2>
                  <p className="text-[14px] text-[#64748b] mt-1 leading-relaxed">
                    Fill in your details below and we’ll prepare a working voice demo tailored to your company.
                  </p>
                </div>
                <BookingForm onSuccess={(info) => setSubmittedInfo(info)} />
              </>
            ) : (
              <div className="py-8 px-2 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#e3faf1] border border-[#a6f2d6] flex items-center justify-center text-[#0f7a58] mb-5 shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <h2 className="text-[26px] font-bold text-[#0b1530] tracking-tight">
                  You're all set{submittedInfo.firstName ? `, ${submittedInfo.firstName}` : ''}!
                </h2>

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
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-[12.5px] text-[#64748b] border-t border-[#e2e8f0] bg-white">
        <p>&copy; {new Date().getFullYear()} Appsian Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
