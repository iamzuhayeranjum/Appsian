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
import { HeroParticles } from './HeroParticles';
import { HeroFloatingCards } from './HeroFloatingCards';
import { HeroCurtainBackground } from './HeroCurtainBackground';
import { initGlitterTiles } from '../lib/glitterTiles';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const TRADES = ['Roofing', 'Plumbing', 'HVAC', 'Electrical'];

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
      className={`relative w-full overflow-hidden min-h-[100svh] flex flex-col justify-center items-center select-none ${
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

      {/* 3. Floating Glass Info Cards (xl 1280px+ desktop only, outside text column) */}
      <HeroFloatingCards appReady={appReady} containerRef={heroRef} />

      {/* =================================================================
          MAIN CONTENT BLOCK (z-10 and above)
         ================================================================= */}
      <div
        id="hero-box"
        className="w-full max-w-[1240px] mx-auto px-5 md:px-10 pt-[112px] md:pt-[128px] pb-[124px] md:pb-[140px] flex flex-col items-center text-center relative z-10"
      >
        {/* Glass Tag Above Headline (Frosted glass for dark backgrounds) */}
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
          className="mb-7 cursor-default select-none"
        >
          <div
            className="rounded-[10px] px-3 py-1 flex items-center gap-2"
            style={{
              background: 'rgba(255, 255, 255, 0.14)',
              border: '1px solid rgba(255, 255, 255, 0.28)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
            }}
          >
            <SectionTag label="FOR LOCAL TRADES" icon="appsian" className="!bg-transparent !border-0 !shadow-none !text-white" />
          </div>
        </motion.div>

        {/* Centered Headline: 2 lines with calm white shimmer inside letters, and soft white stars */}
        <h1
          className="font-display font-normal md:font-medium text-[34px] sm:text-[44px] md:text-[clamp(40px,5vw,72px)] leading-[1.08] tracking-[-0.035em] text-center max-w-[1000px] mx-auto select-text"
          style={{ textWrap: 'balance' }}
        >
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
            className="inline-block"
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
          </motion.span>{' '}
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
            className="inline-block"
          >
            <span className="glitter-text inline-block">
              Bring Extra{' '}
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

        {/* Centered Subline: white, weight 500, max-w 640px */}
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
          className="mt-6 max-w-[640px] mx-auto text-[17px] md:text-[20px] leading-[1.5] font-medium text-center select-text"
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

        {/* Centered Raised Glass Form Bar: frosted glass with navy inputs */}
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
          className="group/form mt-9 w-full max-w-[680px] mx-auto"
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
                className="w-full min-h-[74px] rounded-[22px] p-4 lg:px-6 flex items-center gap-3.5 text-left"
                style={{
                  background: 'rgba(255, 255, 255, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(26px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(26px) saturate(180%)',
                  boxShadow: 'inset 0 1px 0 #ffffff, 0 30px 70px -28px rgba(4, 30, 100, 0.55)',
                }}
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
                  <p
                    className="text-[15px] font-semibold leading-tight text-[#0b1530]"
                  >
                    Thanks, {name.trim().split(' ')[0] || 'there'}! We&apos;ll be in touch shortly.
                  </p>
                  <p
                    className="text-[13px] mt-0.5 leading-tight text-[#51607f]"
                  >
                    We&apos;ll email you at{' '}
                    <span className="font-medium text-[#0b1530]">
                      {email.trim()}
                    </span>
                    .
                  </p>
                </div>
              </motion.div>
            ) : (
              /* The Centered Raised Glass Form Bar with Animated Border Beam & Blue Focus Ring */
              <motion.form
                key="form"
                noValidate
                onSubmit={handleSubmit}
                className="relative w-full flex flex-col lg:flex-row lg:h-[74px] rounded-[22px] p-2.5 lg:p-[8px] gap-2 lg:gap-0 transition-all duration-300 focus-within:border-[rgba(59,130,246,0.65)] focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.2)]"
                style={{
                  background: 'rgba(255, 255, 255, 0.55)',
                  border: '1px solid rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(26px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(26px) saturate(180%)',
                  boxShadow: 'inset 0 1px 0 #ffffff, 0 30px 70px -28px rgba(4, 30, 100, 0.55)',
                }}
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
                  className="hidden lg:block w-[1px] h-7 bg-[rgba(11,21,48,0.15)] my-auto mx-1 shrink-0"
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
                    className="btn-premium btn-premium--blue group/btn w-full lg:w-auto h-[58px] rounded-[16px] px-[30px] text-[16px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px] disabled:opacity-75 disabled:cursor-not-allowed shadow-md"
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
              className="text-[13px] text-[#E11D48] flex items-center justify-center gap-1.5 mt-2 font-medium"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </p>
          )}

          {/* Microcopy below the form: #0b1530 at 78% opacity */}
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
            className="mt-[14px] text-[13px] flex items-center justify-center gap-1.5 select-text font-normal"
            style={{ color: 'rgba(11, 21, 48, 0.78)' }}
          >
            <Check className="w-3.5 h-3.5 stroke-[2.5]" style={{ color: 'rgba(11, 21, 48, 0.85)' }} />
            <span>Free personalized demo · No commitment</span>
          </motion.p>
        </motion.div>
      </div>

      {/* =================================================================
          BOTTOM ROW: Anchored to Hero Bottom (Light glass on near-white base)
         ================================================================= */}
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
          delay: reduceMotion ? 0 : 0.52,
          ease: EASE,
        }}
        className="absolute bottom-6 md:bottom-10 left-0 right-0 z-20 pointer-events-auto px-[clamp(24px,8vw,160px)]"
      >
        {/* Desktop (1024px+) & Tablet (768px-1023px) layout */}
        <div className="hidden md:flex items-center justify-between gap-6 w-full">
          {/* Left: 4 glass-blue chips with stagger and 2px lift hover */}
          <div className="flex items-center gap-2.5">
            {TRADES.map((trade, idx) => (
              <motion.button
                type="button"
                key={trade}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={appReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.52 + idx * 0.06,
                  ease: 'easeOut',
                }}
                className="glass-blue h-[36px] px-4 rounded-[10px] text-[14px] font-medium transition-all duration-200 cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_10px_24px_-6px_rgba(37,99,235,0.22)] active:scale-95"
                style={{ color: '#0b1530' }}
              >
                {trade}
              </motion.button>
            ))}
          </div>

          {/* Center: "See how it works" text + 40px square blue premium button (bobs down 3px in loop) */}
          <div className="group/see flex items-center gap-3">
            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="text-[15px] font-medium underline underline-offset-4 decoration-1 decoration-[#2563eb] group-hover/see:decoration-2 transition-all cursor-pointer select-none"
              style={{ color: '#0b1530' }}
            >
              See how it works
            </a>
            <button
              type="button"
              onClick={handleSeeHowItWorks}
              className="btn-premium btn-premium--blue w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer shadow-xs border-0 text-white active:scale-95 animate-hero-bob group-hover/see:animate-none"
              aria-label="Scroll to how it works"
            >
              <ArrowDown className="btn-arrow w-4 h-4 stroke-[2.2] text-white" />
            </button>
          </div>

          {/* Right: blue indicator dot + 2 lines of text + glass right arrow button */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="glass-blue px-3.5 py-2 rounded-[12px] flex items-center gap-2.5 shadow-sm">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: 'var(--b-500)',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.18)',
                }}
                aria-hidden="true"
              />
              <div
                className="text-[13.5px] leading-[1.3] text-left select-none font-normal"
                style={{ color: '#51607f' }}
              >
                Answers every call,<br />day or night
              </div>
            </div>
            <button
              type="button"
              onClick={handleNextSection}
              className="glass-blue group/arrow w-10 h-10 rounded-[10px] flex items-center justify-center cursor-pointer hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(37,99,235,0.20)] active:scale-95 transition-all duration-180 ease-out"
              style={{ color: '#0b1530' }}
              aria-label="Scroll to next section"
            >
              <ArrowRight className="w-4 h-4 stroke-[2] transition-transform duration-180 ease-out group-hover/arrow:translate-x-[2px]" />
            </button>
          </div>
        </div>

        {/* Mobile (below 768px) layout: centered wrapping group of glass chips with link below */}
        <div className="flex md:hidden flex-col items-center gap-3.5 w-full">
          <div className="flex flex-wrap justify-center items-center gap-2">
            {TRADES.map((trade) => (
              <button
                type="button"
                key={trade}
                className="glass-blue h-[32px] px-3.5 rounded-[9px] text-[13px] font-medium transition-all duration-200"
                style={{ color: '#0b1530' }}
              >
                {trade}
              </button>
            ))}
          </div>

          <div className="group/see flex items-center gap-2 mt-0.5">
            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="text-[14px] font-medium underline underline-offset-4 decoration-1 decoration-[#2563eb] group-hover/see:decoration-2 transition-all cursor-pointer"
              style={{ color: '#0b1530' }}
            >
              See how it works
            </a>
            <button
              type="button"
              onClick={handleSeeHowItWorks}
              className="btn-premium btn-premium--blue w-8 h-8 rounded-[8px] flex items-center justify-center cursor-pointer shadow-xs border-0 text-white active:scale-95"
              aria-label="Scroll to how it works"
            >
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.2] text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 1px sentinel element at the very bottom of the hero for useHeroPast IntersectionObserver */}
      <div
        id="hero-sentinel"
        className="absolute bottom-0 left-0 w-full h-[1px] pointer-events-none opacity-0"
        aria-hidden="true"
      />
    </section>
  );
};
