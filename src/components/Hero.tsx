import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowDown,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAppReady } from './Preloader';
import { submitDemoRequest } from '../lib/submitDemoRequest';
import { SectionTag } from './SectionTag';
import { AppsianMark } from './AppsianLogo';
import { HeroParticles } from './HeroParticles';
import { HeroCurtainBackground } from './HeroCurtainBackground';
import { HeroPhoneStage } from './HeroPhoneStage';
import { initGlitterTiles } from '../lib/glitterTiles';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface HeroProps {
  onBookDemoClick?: () => void;
  onPlayClick?: () => void;
}

// 4-point white star sparkle (fill #ffffff, no blue core)
const GlitterStar: React.FC<{
  size: number;
  style?: React.CSSProperties;
  delay?: string;
}> = ({ size, style, delay = '0s' }) => (
  <span
    className="gl-star"
    style={{
      width: size,
      height: size,
      animationDelay: delay,
      ...style,
    }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full block">
      <path
        d="M12 0 C12.8 7 17 11.2 24 12 C17 12.8 12.8 17 12 24 C11.2 17 7 12.8 0 12 C7 11.2 11.2 7 12 0 Z"
        fill="#ffffff"
      />
    </svg>
  </span>
);

export const Hero: React.FC<HeroProps> = ({ onBookDemoClick }) => {
  const appReady = useAppReady();
  const heroRef = useRef<HTMLElement | null>(null);

  const [isHeroIntersecting, setIsHeroIntersecting] = useState(true);

  // Initialize glitter sparkle tiles on client mount
  useEffect(() => {
    initGlitterTiles();
  }, []);

  // Pause animations when hero is off screen
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setIsHeroIntersecting(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(heroEl);
    return () => io.disconnect();
  }, []);

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

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`relative w-full overflow-hidden h-auto md:h-[100svh] min-h-[640px] max-h-none md:max-h-[1100px] flex flex-col justify-center select-none ${
        !isHeroIntersecting ? 'hero-paused' : ''
      }`}
      style={{
        backgroundColor: '#F5F6F8',
      }}
    >
      {/* =================================================================
          1. LUMINOUS BLUE VERTICAL CURTAIN (Drifting + Vertical Wave WebGL)
         ================================================================= */}
      <HeroCurtainBackground />

      {/* 2. UI Particles Canvas (fades in over 1.2s without wrapping glass elements) */}
      <div
        className="absolute inset-0 pointer-events-none z-[3] transition-opacity duration-1200 ease-out"
        style={{ opacity: appReady ? 1 : 0 }}
        aria-hidden="true"
      >
        <HeroParticles containerRef={heroRef} />
      </div>

      {/* =================================================================
          MAIN 2-COLUMN CONTENT CONTAINER (z-10, no bottom padding)
         ================================================================= */}
      <div
        id="hero-box"
        className="w-full max-w-[1280px] mx-auto px-5 md:px-10 h-full relative z-10 flex flex-col md:grid md:grid-cols-[1.08fr_0.92fr] gap-6"
      >
        {/* LEFT COLUMN: text + form + chips (all left-aligned) */}
        <div className="flex flex-col justify-center text-left pt-[88px] pb-10">
          {/* 1. Badge "FOR LOCAL TRADES", left-aligned */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={
              appReady
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, filter: 'blur(6px)' }
            }
            transition={{
              duration: reduceMotion ? 0.3 : 0.6,
              delay: reduceMotion ? 0 : 0.05,
              ease: EASE,
            }}
            className="self-start cursor-default select-none"
          >
            <div className="glass-dark glass-dark--hover h-[34px] pl-[6px] pr-[14px] rounded-[10px] inline-flex items-center gap-[8px] relative overflow-hidden">
              <div
                className="w-[22px] h-[22px] rounded-[6px] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: '#0b1a4a',
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.45)',
                }}
                aria-hidden="true"
              >
                <AppsianMark size={12} className="text-white" />
              </div>
              <span
                className="text-[12px] font-semibold tracking-[0.08em] uppercase select-none leading-none"
                style={{
                  color: '#ffffff',
                  WebkitTextFillColor: 'currentColor',
                  textShadow: 'none',
                }}
              >
                FOR LOCAL TRADES
              </span>
            </div>
          </motion.div>

          {/* 2. Headline (margin-top 22px): left-aligned */}
          <h1 className="mt-[22px] font-display font-normal md:font-medium text-[clamp(34px,9vw,44px)] md:text-[clamp(36px,min(4.6vw,8.4vh),68px)] leading-[1.08] tracking-[-0.035em] text-left select-text">
            {/* Line 1 */}
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={
                appReady
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, filter: 'blur(8px)' }
              }
              transition={{
                duration: reduceMotion ? 0.3 : 0.7,
                delay: reduceMotion ? 0 : 0.15,
                ease: EASE,
              }}
              className="block"
            >
              <span className="glitter-text inline-block whitespace-nowrap">
                AI
                {/* Inline Appsian logo mark (white/bfe0ff gradient) with surrounding white stars */}
                <span
                  className="relative inline-block align-[-0.04em] w-[0.82em] h-[0.82em] mx-[0.18em]"
                  aria-hidden="true"
                >
                  <GlitterStar size={16} style={{ right: -8, top: -6 }} delay="0.8s" />
                  <GlitterStar size={12} style={{ left: -6, bottom: -4 }} delay="2.4s" />
                  <svg
                    viewBox="260 296 694 569"
                    fill="none"
                    className="w-full h-full block"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="appsian-hero-logo-white-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#bfe0ff" />
                      </linearGradient>
                    </defs>
                    <path
                      fill="url(#appsian-hero-logo-white-grad)"
                      d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
                    />
                    <path
                      fill="url(#appsian-hero-logo-white-grad)"
                      d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
                    />
                  </svg>
                </span>
                Phone Agents That
              </span>
            </motion.span>
            {/* Line 2 */}
            <motion.span
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={
                appReady
                  ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                  : reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 24, filter: 'blur(8px)' }
              }
              transition={{
                duration: reduceMotion ? 0.3 : 0.7,
                delay: reduceMotion ? 0 : 0.23,
                ease: EASE,
              }}
              className="block"
            >
              <span className="inline-block whitespace-nowrap">
                <span className="glitter-text inline-block">Bring Extra&nbsp;</span>
                <span className="relative inline-block">
                  <GlitterStar size={20} style={{ right: -10, top: -8 }} delay="0s" />
                  <GlitterStar size={14} style={{ left: 4, top: -16 }} delay="1.6s" />
                  <GlitterStar size={16} style={{ right: -6, bottom: 2 }} delay="3.2s" />
                  <span className="glitter-blue inline-block pb-[0.08em]">
                    Revenue.
                  </span>
                </span>
              </span>
            </motion.span>
          </h1>

          {/* 3. Subline (margin-top 20px, max-w 520px, left-aligned) */}
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
              duration: reduceMotion ? 0.3 : 0.6,
              delay: reduceMotion ? 0 : 0.32,
              ease: EASE,
            }}
            className="mt-5 max-w-[520px] text-[16px] md:text-[18px] leading-[1.5] font-medium text-left select-text"
            style={{ color: 'rgba(255, 255, 255, 0.94)' }}
          >
            Your AI receptionist answers every call, qualifies the caller and books the job, day or night.{' '}
            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="underline underline-offset-4 decoration-[1.5px] decoration-white text-white hover:text-white transition-colors cursor-pointer font-medium"
            >
              See how it works
            </a>
          </motion.p>

          {/* 4. Form bar (margin-top 28px, max-w 600px, left-aligned) */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={
              appReady
                ? { opacity: 1, y: 0, scale: 1 }
                : reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 24, scale: 0.98 }
            }
            transition={{
              duration: reduceMotion ? 0.3 : 0.65,
              delay: reduceMotion ? 0 : 0.4,
              ease: EASE,
            }}
            className="group/form mt-7 w-full max-w-[600px]"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                /* Success Card */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  className="glass-form w-full min-h-[74px] rounded-[22px] p-4 lg:px-6 flex items-center gap-3.5 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #38bdf8 100%)',
                    }}
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-semibold leading-tight text-[#0b1530]">
                      Thanks, {name.trim().split(' ')[0] || 'there'}! We&apos;ll be in touch shortly.
                    </p>
                    <p className="text-[13px] mt-0.5 leading-tight text-[#51607f]">
                      We&apos;ll email you at{' '}
                      <span className="font-medium text-[#0b1530]">
                        {email.trim()}
                      </span>
                      .
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* The Centered Raised Glass Form Bar with Animated Border Beam */
                <motion.form
                  key="form"
                  noValidate
                  onSubmit={handleSubmit}
                  className="glass-form relative w-full flex flex-col lg:flex-row lg:h-[74px] rounded-[22px] p-2.5 lg:p-[8px] gap-2 lg:gap-0 transition-all duration-300 focus-within:ring-2 focus-within:ring-[rgba(59,130,246,0.6)] focus-within:ring-inset"
                >
                  {/* Border Beam Light travelling on hover or focus-within */}
                  <span
                    className="absolute inset-0 rounded-[22px] pointer-events-none p-[1px] opacity-0 group-hover/form:opacity-100 group-focus-within/form:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        'conic-gradient(from var(--beam-angle, 0deg), rgba(56,189,248,0) 0%, rgba(59,130,246,0.95) 12%, rgba(56,189,248,0) 26%)',
                      mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'xor',
                      animation: reduceMotion ? 'none' : 'heroBeamSpin 5s linear infinite',
                    }}
                    aria-hidden="true"
                  />

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
                      className="w-full h-[54px] lg:h-full rounded-[14px] bg-transparent px-4 lg:px-[20px] text-[16px] text-[#0b1530] placeholder-[#51607f] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Vertical Divider (Desktop only) */}
                  <div
                    className="hidden lg:block w-[1px] h-7 bg-[rgba(11,21,48,0.12)] my-auto mx-1 shrink-0"
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
                      className="w-full h-[54px] lg:h-full rounded-[14px] bg-transparent px-4 lg:px-[20px] text-[16px] text-[#0b1530] placeholder-[#51607f] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Submit Button (Blue glossy premium style) */}
                  <div className="w-full lg:w-auto shrink-0 flex items-center">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-premium btn-premium--blue btn-glitter group/btn w-full lg:w-auto h-[58px] rounded-[16px] px-[30px] text-[16px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px] disabled:opacity-75 disabled:cursor-not-allowed shadow-md"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Free Demo</span>
                          <ArrowRight className="btn-arrow w-[18px] h-[18px] text-white" strokeWidth={2} />
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
                className="text-[13px] text-[#E11D48] flex items-center justify-start gap-1.5 mt-2 font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </p>
            )}

            {/* Microcopy below the form: #0b1530 at 78% opacity (left aligned) */}
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
                duration: reduceMotion ? 0.3 : 0.6,
                delay: reduceMotion ? 0 : 0.44,
                ease: EASE,
              }}
              className="mt-[12px] text-[13px] flex items-center justify-start gap-1.5 select-text font-normal"
              style={{ color: 'rgba(11, 21, 48, 0.78)' }}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: 'rgba(11, 21, 48, 0.85)' }} />
              <span>Free personalized demo · No commitment</span>
            </motion.p>
          </motion.div>

          {/* 5. Bottom: "See how it works" secondary link with arrow button */}
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
              duration: reduceMotion ? 0.3 : 0.5,
              delay: reduceMotion ? 0 : 0.5,
              ease: EASE,
            }}
            className="mt-6 flex items-center gap-2.5"
          >
            <div className="group/see flex items-center gap-2.5">
              <a
                href="#how-it-works"
                onClick={handleSeeHowItWorks}
                className="text-[14px] font-medium underline underline-offset-4 decoration-1 decoration-white/70 group-hover:decoration-white transition-all cursor-pointer select-none text-white"
              >
                See how it works
              </a>
              <button
                type="button"
                onClick={handleSeeHowItWorks}
                className="btn-premium btn-premium--light btn-glitter btn-glitter--light w-8 h-8 rounded-[8px] flex items-center justify-center cursor-pointer shadow-xs border-0 text-[#2f6bff] active:scale-95 animate-hero-bob group-hover/see:animate-none"
                style={{ '--btn-fg': '#2f6bff' } as React.CSSProperties}
                aria-label="Scroll to how it works"
              >
                <ArrowDown className="btn-arrow w-3.5 h-3.5 stroke-[2.2] text-[#2f6bff]" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: The Phone Stage (spans from 84px below top to bottom edge) */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={
            appReady
              ? { opacity: 1, y: 0 }
              : reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 40 }
          }
          transition={{
            duration: reduceMotion ? 0.3 : 0.9,
            delay: reduceMotion ? 0 : 0.25,
            ease: EASE,
          }}
          className="relative w-full h-[560px] md:h-full md:pt-[84px] flex items-start justify-center xl:justify-end"
        >
          <HeroPhoneStage appReady={appReady} />
        </motion.div>
      </div>

      {/* 1px sentinel element at the very bottom of the hero for useHeroPast IntersectionObserver */}
      <div
        id="hero-sentinel"
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </section>
  );
};
