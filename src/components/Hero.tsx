import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import {
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { HeroCallDemo } from './HeroCallDemo';
import { useAppReady } from './Preloader';
import { submitDemoRequest } from '../lib/submitDemoRequest';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface HeroProps {
  onBookDemoClick?: () => void;
  onPlayClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookDemoClick }) => {
  const appReady = useAppReady();

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

  // Entrance animation variants
  const lineVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reduceMotion ? 0.3 : 0.7,
        delay: reduceMotion ? 0 : 0.1 + i * 0.08,
        ease: EASE,
      },
    }),
  };

  return (
    <section
      id="hero"
      className="relative w-full bg-[#FFFFFF] overflow-x-clip min-h-[100svh] flex flex-col justify-between"
    >
      {/* Background Atmosphere Light Blobs */}
      <div
        className="absolute -top-[120px] -right-[120px] w-[720px] h-[720px] pointer-events-none select-none -z-0"
        style={{
          background: 'radial-gradient(closest-side, rgba(124,140,255,0.14), rgba(124,140,255,0))',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-[80px] -left-[80px] w-[560px] h-[560px] pointer-events-none select-none -z-0"
        style={{
          background: 'radial-gradient(closest-side, rgba(110,237,194,0.12), rgba(110,237,194,0))',
        }}
        aria-hidden="true"
      />

      {/* Compatibility container keeping hero-box id for any legacy selectors */}
      <div id="hero-box" className="w-full flex-1 flex flex-col justify-center relative z-10">
        {/* Inner container: max-width 1280px, centered */}
        <div className="w-full max-w-[1280px] mx-auto px-5 md:px-10 pt-[120px] md:pt-[132px] pb-[64px] md:pb-[96px]">
          {/* Desktop Two Column [1.25fr 0.75fr], gap 32px */}
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr] gap-10 md:gap-8 items-center">
            
            {/* LEFT COLUMN: Headline, Subline, Demo Form */}
            <div className="flex flex-col items-start text-left z-10 w-full">
              {/* 3-line headline with whitespace-nowrap preventing awkward wrapping */}
              <h1 className="font-display font-normal md:font-medium text-[clamp(34px,9.6vw,44px)] md:text-[clamp(44px,5.6vw,84px)] leading-[1.0] tracking-[-0.04em] text-[#0B0B0F] text-left">
                {/* Line 1: AI [logo] Phone Agents */}
                <motion.span
                  custom={0}
                  initial="hidden"
                  animate={appReady ? 'visible' : 'hidden'}
                  variants={lineVariants}
                  className="block whitespace-nowrap"
                >
                  AI
                  {/* Inline Appsian bluish logo mark */}
                  <motion.span
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                    animate={
                      appReady
                        ? (reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 })
                        : (reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6 })
                    }
                    transition={{
                      type: reduceMotion ? 'tween' : 'spring',
                      duration: 0.5,
                      delay: reduceMotion ? 0.05 : 0.32,
                      bounce: 0.35,
                    }}
                    className="inline-block"
                    style={{
                      width: '0.82em',
                      height: '0.82em',
                      marginLeft: '0.16em',
                      marginRight: '0.2em',
                      verticalAlign: '-0.04em',
                    }}
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
                  </motion.span>
                  Phone Agents
                </motion.span>

                {/* Line 2: That Bring Extra */}
                <motion.span
                  custom={1}
                  initial="hidden"
                  animate={appReady ? 'visible' : 'hidden'}
                  variants={lineVariants}
                  className="block whitespace-nowrap"
                >
                  That Bring Extra
                </motion.span>

                {/* Line 3: Revenue. (gradient) */}
                <motion.span
                  custom={2}
                  initial="hidden"
                  animate={appReady ? 'visible' : 'hidden'}
                  variants={lineVariants}
                  className="block whitespace-nowrap"
                >
                  <span className="hero-gradient-text inline-block pb-[0.08em]">
                    Revenue.
                  </span>
                </motion.span>
              </h1>

              {/* Subline: max-w 560px */}
              <motion.p
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={
                  appReady
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 18, filter: 'blur(6px)' }
                }
                transition={{
                  duration: reduceMotion ? 0.3 : 0.7,
                  delay: reduceMotion ? 0 : 0.38,
                  ease: EASE,
                }}
                className="mt-6 max-w-[560px] text-[17px] md:text-[19px] leading-[1.5] text-[#64748B] font-normal"
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

              {/* THE DEMO FORM (replaces old buttons, max-w 640px) */}
              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={
                  appReady
                    ? { opacity: 1, y: 0 }
                    : reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 24 }
                }
                transition={{
                  duration: reduceMotion ? 0.3 : 0.7,
                  delay: reduceMotion ? 0 : 0.48,
                  ease: EASE,
                }}
                className="mt-9 w-full max-w-[700px]"
              >
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    /* Success Card with same footprint */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="w-full min-h-[74px] rounded-[22px] bg-white border border-[rgba(15,16,32,0.10)] p-4 lg:px-6 shadow-[0_18px_50px_-18px_rgba(40,40,110,0.30),0_2px_6px_rgba(20,20,50,0.06)] flex items-center gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#6EEDC2] flex items-center justify-center text-[#062B20] shrink-0 shadow-xs">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <div className="text-left">
                        <p className="text-[15px] font-semibold text-[#0B0B0F] leading-tight">
                          Thanks, {name.trim().split(' ')[0] || 'there'}! We&apos;ll be in touch shortly.
                        </p>
                        <p className="text-[13px] text-[#64748B] mt-0.5 leading-tight">
                          We&apos;ll email you at <span className="text-[#0B0B0F] font-medium">{email.trim()}</span>.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    /* The Form Bar */
                    <motion.form
                      key="form"
                      noValidate
                      onSubmit={handleSubmit}
                      className="relative w-full flex flex-col lg:flex-row lg:h-[74px] rounded-[22px] bg-white border border-[rgba(15,16,32,0.10)] p-2.5 lg:p-[8px] gap-2 lg:gap-0 shadow-[0_18px_50px_-18px_rgba(40,40,110,0.30),0_2px_6px_rgba(20,20,50,0.06)] focus-within:border-[rgba(74,127,240,0.55)] focus-within:ring-4 focus-within:ring-[rgba(74,127,240,0.14)] transition-all"
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
                          className="w-full h-[54px] lg:h-full rounded-[14px] lg:rounded-none bg-[#F5F6FA] lg:bg-transparent px-4 lg:px-[20px] text-[16px] text-[#0B0F19] placeholder-[#8A91A5] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>

                      {/* Vertical Divider (Desktop only) */}
                      <div
                        className="hidden lg:block w-[1px] h-7 bg-[#E2E5EE] my-auto shrink-0"
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
                          className="w-full h-[54px] lg:h-full rounded-[14px] lg:rounded-none bg-[#F5F6FA] lg:bg-transparent px-4 lg:px-[20px] text-[16px] text-[#0B0F19] placeholder-[#8A91A5] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
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
                    className="text-[13px] text-[#E11D48] flex items-center gap-1.5 mt-2 font-medium"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                {/* Microcopy below the form */}
                <p className="mt-[14px] text-[13px] text-[#64748B] font-normal text-left">
                  Free personalized demo · No commitment
                </p>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: iPhone Call Screen */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32 }}
              animate={
                appReady
                  ? { opacity: 1, y: 0 }
                  : reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 32 }
              }
              transition={{
                duration: reduceMotion ? 0.4 : 0.8,
                delay: reduceMotion ? 0 : 0.35,
                ease: EASE,
              }}
              className="relative flex justify-center md:justify-end w-full mt-6 md:mt-0"
            >
              <HeroCallDemo />
            </motion.div>

          </div>
        </div>
      </div>

      {/* Soft seam so the white hero melts into the next section's page colour (#F5F6F8) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none bg-gradient-to-b from-transparent to-[#F5F6F8]"
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
