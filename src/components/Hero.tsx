import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowDown,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { HeroDots } from './HeroDots';
import { useAppReady } from './Preloader';
import { submitDemoRequest } from '../lib/submitDemoRequest';
import { SectionTag } from './SectionTag';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TRADES = ['Roofing', 'Plumbing', 'HVAC', 'Electrical'];

interface HeroProps {
  onBookDemoClick?: () => void;
  onPlayClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookDemoClick }) => {
  const appReady = useAppReady();
  const heroRef = useRef<HTMLElement | null>(null);

  // Prefers reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorField, setErrorField] = useState<'name' | 'email' | ''>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSeeHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const howItWorksEl = document.getElementById('how-it-works');
    if (howItWorksEl) {
      howItWorksEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextSection = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetEl = document.getElementById('benefits') || document.getElementById('how-it-works');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (errorField === 'name') {
      setErrorField('');
      setErrorMessage('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errorField === 'email') {
      setErrorField('');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot protection: if filled, silently pretend success
    if (honeypot.trim()) {
      setStatus('success');
      return;
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorField('name');
      setErrorMessage('Please enter your name.');
      nameInputRef.current?.focus();
      return;
    }

    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setErrorField('email');
      setErrorMessage('Please enter a valid work email.');
      emailInputRef.current?.focus();
      return;
    }

    setErrorField('');
    setErrorMessage('');
    setStatus('loading');

    try {
      const res = await submitDemoRequest({ name: trimmedName, email: trimmedEmail });
      if (res.success) {
        setStatus('success');
        if (onBookDemoClick) {
          onBookDemoClick();
        }
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative w-full bg-[#FFFFFF] overflow-hidden min-h-[100svh] flex flex-col justify-center items-center select-none"
    >
      {/* Custom Styles for Raised Glass Form, Tag, and Chips */}
      <style>{`
        .hero-form-glass {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px) saturate(1.2);
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 6px 18px rgba(15, 23, 42, 0.06),
            0 0 0 6px rgba(255, 255, 255, 0.45),
            0 0 0 7px rgba(15, 23, 42, 0.04);
          transition: transform 220ms ease, box-shadow 220ms ease, background 220ms ease;
        }
        .hero-form-glass:hover,
        .hero-form-glass:focus-within {
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 6px 18px rgba(15, 23, 42, 0.06),
            0 0 0 6px rgba(255, 255, 255, 0.8),
            0 0 0 7px rgba(124, 92, 255, 0.14),
            0 14px 44px rgba(124, 92, 255, 0.16);
        }
        .hero-tag-glass {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(14px) saturate(1.2);
          -webkit-backdrop-filter: blur(14px) saturate(1.2);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 4px 14px rgba(15, 23, 42, 0.07),
            0 1px 2px rgba(15, 23, 42, 0.04);
          transition: transform 200ms ease, box-shadow 200ms ease;
        }
        .hero-tag-glass:hover {
          transform: translateY(-1px);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 8px 20px rgba(15, 23, 42, 0.10),
            0 2px 4px rgba(15, 23, 42, 0.05);
        }
        .hero-chip-glass {
          height: 36px;
          padding: 0 16px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 1),
            0 2px 8px rgba(15, 23, 42, 0.06);
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          transition: all 180ms ease;
          cursor: pointer;
        }
        .hero-chip-glass:hover,
        .hero-chip-glass:focus-visible {
          background: #0B0F19;
          color: #FFFFFF;
          border-color: transparent;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(11, 15, 25, 0.18);
          outline: none;
        }
      `}</style>

      {/* 1. Background Atmosphere Pastel Glows (staying visible behind the arc) */}
      <div
        className="absolute -top-[120px] -right-[120px] w-[720px] h-[720px] pointer-events-none select-none z-0"
        style={{
          background: 'radial-gradient(closest-side, rgba(124,140,255,0.18), rgba(124,140,255,0))',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[80px] -left-[80px] w-[560px] h-[560px] pointer-events-none select-none z-0"
        style={{
          background: 'radial-gradient(closest-side, rgba(110,237,194,0.16), rgba(110,237,194,0))',
        }}
        aria-hidden="true"
      />

      {/* 2. The Big Soft Arc (above dots at z-0, behind content at z-10) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[100px] md:top-[120px] w-[220%] md:w-[170%] h-[700px] md:h-[1000px] rounded-[50%] pointer-events-none z-1"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(244,245,251,0.6) 55%, rgba(244,245,251,0) 100%)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,1), 0 -20px 60px rgba(124,92,255,0.06), 0 -1px 0 rgba(15,23,42,0.04)',
        }}
        aria-hidden="true"
      />

      {/* 3. Animated Cursor Dot Trail Canvas (z-index 2: above arc, below content) */}
      <HeroDots containerRef={heroRef} />

      {/* 4. Centered Main Content Block (z-index 10: above dot canvas) */}
      <div
        id="hero-box"
        className="w-full max-w-[1240px] mx-auto px-5 md:px-10 pt-[112px] md:pt-[128px] pb-[124px] md:pb-[140px] flex flex-col items-center text-center relative z-10"
      >
        {/* Glass Tag Above Headline */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          animate={
            appReady
              ? { opacity: 1, y: 0 }
              : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: -8 }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.5,
            delay: reduceMotion ? 0 : 0.05,
            ease: EASE,
          }}
          className="mb-7 cursor-default select-none"
        >
          <SectionTag label="FOR LOCAL TRADES" icon="appsian" />
        </motion.div>

        {/* Centered Headline */}
        <motion.h1
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={
            appReady
              ? { opacity: 1, y: 0 }
              : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.7,
            delay: reduceMotion ? 0 : 0.13,
            ease: EASE,
          }}
          className="font-display font-normal md:font-medium text-[34px] sm:text-[44px] md:text-[clamp(40px,5vw,72px)] leading-[1.08] tracking-[-0.035em] text-[#0B0B0F] text-center max-w-[1000px] mx-auto select-text"
          style={{ textWrap: 'balance' }}
        >
          <span className="inline-block">
            AI
            {/* Inline Appsian bluish logo mark */}
            <span
              className="inline-block align-[-0.04em] w-[0.82em] h-[0.82em] mx-[0.18em]"
              aria-hidden="true"
            >
              <svg
                viewBox="260 296 694 569"
                fill="none"
                className="w-full h-full block"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="appsian-hero-logo-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#3B6FF0" />
                    <stop offset="100%" stopColor="#6EA8FF" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#appsian-hero-logo-grad)"
                  d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
                />
                <path
                  fill="url(#appsian-hero-logo-grad)"
                  d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
                />
              </svg>
            </span>
            Phone Agents That
          </span>{' '}
          <span className="inline-block">
            Bring Extra{' '}
            <span className="hero-gradient-text inline-block pb-[0.08em]">
              Revenue.
            </span>
          </span>
        </motion.h1>

        {/* Centered Subline: max-w 640px */}
        <motion.p
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={
            appReady
              ? { opacity: 1, y: 0 }
              : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.7,
            delay: reduceMotion ? 0 : 0.21,
            ease: EASE,
          }}
          className="mt-6 max-w-[640px] mx-auto text-[17px] md:text-[20px] leading-[1.5] text-[#64748B] font-normal text-center select-text"
        >
          Your AI receptionist answers every call, qualifies the caller and books the job, day or night.{' '}
          <a
            href="#how-it-works"
            onClick={handleSeeHowItWorks}
            className="underline underline-offset-4 decoration-1 decoration-slate-700 hover:text-[#0B0B0F] transition-colors cursor-pointer text-[#0B0B0F] font-medium"
          >
            See how it works
          </a>
        </motion.p>

        {/* Centered Raised Glass Form: width min(680px, 100%) */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={
            appReady
              ? { opacity: 1, y: 0 }
              : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 16 }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.7,
            delay: reduceMotion ? 0 : 0.29,
            ease: EASE,
          }}
          className="mt-9 w-full max-w-[680px] mx-auto"
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              /* Success Card with raised double-ring glass styling */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                className="hero-form-glass w-full min-h-[74px] rounded-[22px] p-4 lg:px-6 flex items-center gap-3.5 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-[#6EEDC2] flex items-center justify-center text-[#062B20] shrink-0 shadow-xs">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <p className="text-[15px] font-semibold text-[#0B0B0F] leading-tight">
                    Thanks, {name.trim().split(' ')[0] || 'there'}! We&apos;ll be in touch shortly.
                  </p>
                  <p className="text-[13px] text-[#64748B] mt-0.5 leading-tight">
                    We&apos;ll email you at <span className="text-[#0B0F19] font-medium">{email.trim()}</span>.
                  </p>
                </div>
              </motion.div>
            ) : (
              /* The Centered Raised Glass Form Bar with Double Ring & Soft Purple Halo */
              <motion.form
                key="form"
                noValidate
                onSubmit={handleSubmit}
                className="hero-form-glass relative w-full flex flex-col lg:flex-row lg:h-[74px] rounded-[22px] p-2.5 lg:p-[8px] gap-2 lg:gap-0 focus-within:border-[rgba(74,127,240,0.55)]"
              >
                {/* Hidden Spam Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  aria-hidden="true"
                  autoComplete="off"
                  className="sr-only hidden"
                />

                {/* Name Input */}
                <div className="flex-1 min-w-0 flex items-center">
                  <input
                    ref={nameInputRef}
                    id="hero-demo-name"
                    type="text"
                    required
                    disabled={status === 'loading'}
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Your name"
                    autoComplete="name"
                    aria-label="Your name"
                    aria-invalid={errorField === 'name'}
                    aria-describedby={errorField ? 'hero-demo-error' : undefined}
                    className="w-full h-[54px] lg:h-full rounded-[14px] bg-[rgba(255,255,255,0.8)] lg:bg-[rgba(255,255,255,0.8)] px-4 lg:px-[20px] text-[16px] text-[#0B0F19] placeholder-[#8A91A5] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Vertical Divider (Desktop only) */}
                <div
                  className="hidden lg:block w-[1px] h-7 bg-[#E2E5EE] my-auto mx-1 shrink-0"
                  aria-hidden="true"
                />

                {/* Email Input */}
                <div className="flex-[1.3] min-w-0 flex items-center">
                  <input
                    ref={emailInputRef}
                    id="hero-demo-email"
                    type="email"
                    inputMode="email"
                    required
                    disabled={status === 'loading'}
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Work email"
                    autoComplete="email"
                    aria-label="Work email"
                    aria-invalid={errorField === 'email'}
                    aria-describedby={errorField ? 'hero-demo-error' : undefined}
                    className="w-full h-[54px] lg:h-full rounded-[14px] bg-[rgba(255,255,255,0.8)] lg:bg-[rgba(255,255,255,0.8)] px-4 lg:px-[20px] text-[16px] text-[#0B0F19] placeholder-[#8A91A5] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                  />
                </div>

                {/* Submit Button */}
                <div className="w-full lg:w-auto shrink-0 flex items-center">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-premium group w-full lg:w-auto h-[58px] rounded-[16px] px-[30px] text-[16px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[#4A7FF0] focus-visible:outline-offset-[2px] disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Get Free Demo</span>
                        <ArrowRight className="btn-arrow w-[18px] h-[18px]" strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Validation / Submission Error Message */}
          {errorMessage && (
            <p
              id="hero-demo-error"
              role="alert"
              className="text-[13px] text-[#E11D48] flex items-center justify-center gap-1.5 mt-2 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Microcopy below the form */}
          <motion.p
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={
              appReady
                ? { opacity: 1, y: 0 }
                : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 16 }
            }
            transition={{
              duration: reduceMotion ? 0.3 : 0.7,
              delay: reduceMotion ? 0 : 0.37,
              ease: EASE,
            }}
            className="mt-[14px] text-[13px] text-[#64748B] font-normal text-center select-text"
          >
            Free personalized demo · No commitment
          </motion.p>
        </motion.div>
      </div>

      {/* 5. Bottom Row: Anchored to Hero Bottom */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={
          appReady
            ? { opacity: 1, y: 0 }
            : reduceMotion
            ? { opacity: 0 }
            : { opacity: 0, y: 12 }
        }
        transition={{
          duration: reduceMotion ? 0.4 : 0.6,
          delay: reduceMotion ? 0 : 0.45,
          ease: EASE,
        }}
        className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 pointer-events-auto px-[clamp(24px,8vw,160px)]"
      >
        {/* Desktop (1024px+) & Tablet (768px-1023px) layout */}
        <div className="hidden md:flex items-center justify-between gap-6 w-full">
          {/* Left: 4 glass chips in a row (turns near-black #0B0F19 on hover) */}
          <div className="flex items-center gap-2.5">
            {TRADES.map((trade) => (
              <button
                type="button"
                key={trade}
                className="hero-chip-glass"
              >
                {trade}
              </button>
            ))}
          </div>

          {/* Center: "See how it works" text + 40px square mint button */}
          <div className="group/see flex items-center gap-3">
            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="text-[15px] font-medium text-[#0B0F19] underline underline-offset-4 decoration-1 group-hover/see:decoration-2 transition-all cursor-pointer select-none"
            >
              See how it works
            </a>
            <button
              type="button"
              onClick={handleSeeHowItWorks}
              className="w-10 h-10 rounded-[10px] bg-[#6EEDC2] group-hover/see:translate-y-[2px] transition-transform duration-160 ease-out flex items-center justify-center cursor-pointer shadow-xs border-0 text-[#0B0F19] active:scale-95"
              aria-label="Scroll to how it works"
            >
              <ArrowDown className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Right: mint pulse dot + 2 lines of text + glass right arrow button (Hidden on tablet, shown on lg+) */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full bg-[#6EEDC2] shadow-[0_0_8px_rgba(110,237,194,0.8)] animate-pulse shrink-0"
                aria-hidden="true"
              />
              <div className="text-[14px] text-[#334155] leading-[1.35] text-left select-none">
                Answers every call,<br />day or night
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextSection}
              className="group/arrow w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer border border-[rgba(255,255,255,0.9)] bg-[rgba(255,255,255,0.75)] backdrop-blur-[12px] shadow-[0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-white hover:-translate-y-[1px] hover:shadow-[0_6px_16px_rgba(15,23,42,0.10)] active:scale-95 transition-all duration-180 ease-out text-[#0B0F19]"
              aria-label="Scroll to next section"
            >
              <ArrowRight className="w-4 h-4 stroke-[2] transition-transform duration-180 ease-out group-hover/arrow:translate-x-[2px]" />
            </button>
          </div>
        </div>

        {/* Mobile (below 768px) layout: centered wrapping group of chips with link below it */}
        <div className="flex md:hidden flex-col items-center gap-3.5 w-full">
          <div className="flex flex-wrap justify-center items-center gap-2">
            {TRADES.map((trade) => (
              <button
                type="button"
                key={trade}
                className="hero-chip-glass h-[32px] px-3.5 text-[13px]"
              >
                {trade}
              </button>
            ))}
          </div>

          <div className="group/see flex items-center gap-2 mt-0.5">
            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="text-[14px] font-medium text-[#0B0F19] underline underline-offset-4 decoration-1 group-hover/see:decoration-2 transition-all cursor-pointer"
            >
              See how it works
            </a>
            <button
              type="button"
              onClick={handleSeeHowItWorks}
              className="w-8 h-8 rounded-[8px] bg-[#6EEDC2] group-hover/see:translate-y-[2px] transition-transform duration-160 ease-out flex items-center justify-center cursor-pointer shadow-xs border-0 text-[#0B0F19] active:scale-95"
              aria-label="Scroll to how it works"
            >
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Soft seam so the white hero melts into the next section's page colour (#F5F6F8) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none bg-gradient-to-b from-transparent to-[#F5F6F8] z-5"
        aria-hidden="true"
      />

      {/* 1px sentinel element at the very bottom of the hero for useHeroPast IntersectionObserver */}
      <div
        id="hero-sentinel"
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </section>
  );
};
