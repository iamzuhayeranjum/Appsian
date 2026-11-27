import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAppReady } from './Preloader';
import { navigate } from '../lib/navigate';
import { HeroParticles } from './HeroParticles';
import { HeroCurtainBackground } from './HeroCurtainBackground';
import { HeroCallConsole } from './HeroCallConsole';
import { AppsianMark } from './AppsianLogo';
import { initGlitterTiles } from '../lib/glitterTiles';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface HeroProps {
  onBookDemoClick?: () => void;
  onPlayClick?: () => void;
}

// 4-point blue star sparkle for light hero background
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
        fill="#2563eb"
      />
    </svg>
  </span>
);

export const Hero: React.FC<HeroProps> = () => {
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
  const [status] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    // Redirect to booking page with name and email pre-filled
    const params = new URLSearchParams({
      name: trimmedName,
      email: trimmedEmail,
    });
    navigate(`/book?${params.toString()}`);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`relative z-20 w-full overflow-hidden rounded-b-[28px] md:rounded-b-[48px] min-h-[100svh] h-auto flex flex-col justify-start select-none ${
        !isHeroIntersecting ? 'hero-paused' : ''
      }`}
      style={{
        backgroundColor: '#F5F6F8',
      }}
    >
      {/* 1. FLIPPED LUMINOUS BLUE CURTAIN (#F5F6F8 top 42% -> blue waves at bottom) */}
      <HeroCurtainBackground flip />

      {/* 2. UI Particles Canvas (fades in over 1.2s without wrapping glass elements) */}
      <div
        className="absolute inset-0 pointer-events-none z-[3] transition-opacity duration-1200 ease-out"
        style={{ opacity: appReady ? 1 : 0 }}
        aria-hidden="true"
      >
        <HeroParticles containerRef={heroRef} />
      </div>

      {/* MAIN CONTENT CONTAINER (max-w 1180px, top row + console window below) */}
      <div
        id="hero-box"
        className="w-full max-w-[1180px] mx-auto px-5 md:px-10 pt-[92px] md:pt-[112px] pb-[44px] md:pb-[56px] relative z-10 flex flex-col"
      >
        {/* TOP 2-COLUMN ROW */}
        <div className="grid grid-cols-1 md:grid-cols-[1.08fr_0.92fr] lg:grid-cols-[1.12fr_0.88fr] gap-y-7 md:gap-x-[40px] lg:gap-x-[48px] md:items-end">
          {/* LEFT: Badge + 2-Line Glitter Headline */}
          <div className="flex flex-col text-left">
            {/* FOR LOCAL TRADES Badge (light glass, clean, no glitter or sheen) */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={
                appReady
                  ? { opacity: 1, y: 0 }
                  : reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 14 }
              }
              transition={{
                duration: reduceMotion ? 0.3 : 0.5,
                delay: reduceMotion ? 0 : 0.08,
                ease: EASE,
              }}
              className="inline-flex items-center gap-[8px] h-[30px] pl-[6px] pr-[12px] rounded-[10px] w-fit bg-white/85 backdrop-blur-md border border-[rgba(11,21,48,0.08)] shadow-[0_2px_8px_rgba(11,21,48,0.06)]"
            >
              <span className="w-[20px] h-[20px] rounded-[6px] bg-[#0b1530] flex items-center justify-center shrink-0">
                <AppsianMark size={11} fill="#ffffff" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#475569] leading-none">
                FOR LOCAL TRADES
              </span>
            </motion.div>

            {/* 2-line glitter headline */}
            <h1 className="mt-4 font-display font-medium text-[clamp(27px,8.0vw,42px)] md:text-[clamp(34px,3.8vw,54px)] leading-[1.06] tracking-[-0.035em] text-left select-text">
              {/* Line 1 */}
              <motion.span
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={
                  appReady
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: 'blur(8px)' }
                }
                transition={{
                  duration: reduceMotion ? 0.3 : 0.65,
                  delay: reduceMotion ? 0 : 0.14,
                  ease: EASE,
                }}
                className="block"
              >
                <span className="glitter-text inline-block whitespace-nowrap">
                  AI
                  {/* Inline Appsian logo mark (blue gradient) with surrounding blue stars */}
                  <span
                    className="relative inline-block align-[-0.04em] w-[0.82em] h-[0.82em] mx-[0.18em]"
                    aria-hidden="true"
                  >
                    <GlitterStar size={14} style={{ right: -7, top: -5 }} delay="0.8s" />
                    <GlitterStar size={10} style={{ left: -5, bottom: -3 }} delay="2.4s" />
                    <svg
                      viewBox="260 296 694 569"
                      fill="none"
                      className="w-full h-full block"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="appsian-hero-logo-blue-grad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#1d4ed8" />
                          <stop offset="55%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                      <path
                        fill="url(#appsian-hero-logo-blue-grad)"
                        d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
                      />
                      <path
                        fill="url(#appsian-hero-logo-blue-grad)"
                        d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
                      />
                    </svg>
                  </span>
                  Phone Agents That
                </span>
              </motion.span>

              {/* Line 2 */}
              <motion.span
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={
                  appReady
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, y: 20, filter: 'blur(8px)' }
                }
                transition={{
                  duration: reduceMotion ? 0.3 : 0.65,
                  delay: reduceMotion ? 0 : 0.22,
                  ease: EASE,
                }}
                className="block"
              >
                <span className="inline-block whitespace-nowrap">
                  <span className="glitter-text inline-block">Bring Extra&nbsp;</span>
                  <span className="relative inline-block">
                    <GlitterStar size={18} style={{ right: -9, top: -6 }} delay="0s" />
                    <GlitterStar size={12} style={{ left: 4, top: -12 }} delay="1.6s" />
                    <GlitterStar size={14} style={{ right: -5, bottom: 2 }} delay="3.2s" />
                    <span className="glitter-blue inline-block pb-[0.08em]">
                      Revenue.
                    </span>
                  </span>
                </span>
              </motion.span>
            </h1>
          </div>

          {/* RIGHT: Subline + White Form Bar + Microcopy (bottom-aligned with headline) */}
          <div className="flex flex-col justify-end text-left">
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
                duration: reduceMotion ? 0.3 : 0.55,
                delay: reduceMotion ? 0 : 0.28,
                ease: EASE,
              }}
              className="text-[15.5px] md:text-[16.5px] leading-[1.55] font-normal text-[#475569] text-left select-text"
            >
              Your AI receptionist answers every call, qualifies the caller and books the job, day or night.{' '}
              <a
                href="#how-it-works"
                onClick={handleSeeHowItWorks}
                className="underline underline-offset-4 decoration-[1.5px] decoration-[#2563eb] text-[#0b1530] hover:text-[#2563eb] transition-colors cursor-pointer font-medium"
              >
                See how it works
              </a>
            </motion.p>

            {/* White Form Bar */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.985 }}
              animate={
                appReady
                  ? { opacity: 1, y: 0, scale: 1 }
                  : reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: 20, scale: 0.985 }
              }
              transition={{
                duration: reduceMotion ? 0.3 : 0.6,
                delay: reduceMotion ? 0 : 0.35,
                ease: EASE,
              }}
              className="group/form mt-4 w-full"
            >
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="w-full min-h-[62px] rounded-[20px] bg-white border border-[rgba(11,21,48,0.10)] shadow-[0_14px_34px_-12px_rgba(11,21,48,0.12),0_2px_6px_rgba(11,21,48,0.04)] p-3.5 px-5 flex items-center gap-3.5 text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #38bdf8 100%)',
                      }}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-tight text-[#0b1530]">
                        Thanks, {name.trim().split(' ')[0] || 'there'}! We&apos;ll be in touch shortly.
                      </p>
                      <p className="text-[12.5px] mt-0.5 leading-tight text-[#64748b]">
                        We&apos;ll email you at{' '}
                        <span className="font-medium text-[#0b1530]">{email.trim()}</span>.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    noValidate
                    onSubmit={handleSubmit}
                    className="relative w-full flex flex-col lg:flex-row lg:h-[62px] rounded-[20px] bg-white border border-[rgba(11,21,48,0.10)] shadow-[0_14px_34px_-12px_rgba(11,21,48,0.12),0_2px_6px_rgba(11,21,48,0.04)] p-2 lg:p-[6px] gap-2 lg:gap-0 transition-all duration-300 focus-within:ring-2 focus-within:ring-[rgba(37,99,235,0.45)] focus-within:ring-inset"
                  >
                    {/* Border Beam Light travelling on hover or focus-within */}
                    <span
                      className="absolute inset-0 rounded-[20px] pointer-events-none p-[1px] opacity-0 group-hover/form:opacity-100 group-focus-within/form:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          'conic-gradient(from var(--beam-angle, 0deg), rgba(56,189,248,0) 0%, rgba(59,130,246,0.95) 12%, rgba(56,189,248,0) 26%)',
                        mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                        WebkitMask:
                          'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                        animation: reduceMotion ? 'none' : 'heroBeamSpin 5s linear infinite',
                      }}
                      aria-hidden="true"
                    />

                    {/* Hidden Spam Honeypot */}
                    <input
                      type="text"
                      name="contact_hp"
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
                        className="w-full h-[46px] lg:h-full rounded-[12px] bg-transparent px-3.5 text-[15px] text-[#0b1530] placeholder-[#64748b] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    {/* Vertical Divider (Desktop only) */}
                    <div
                      className="hidden lg:block w-[1px] h-6 bg-[rgba(11,21,48,0.10)] my-auto mx-0.5 shrink-0"
                      aria-hidden="true"
                    />

                    {/* Email Input */}
                    <div className="flex-[1.2] min-w-0 flex items-center">
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
                        className="w-full h-[46px] lg:h-full rounded-[12px] bg-transparent px-3.5 text-[15px] text-[#0b1530] placeholder-[#64748b] border-0 outline-none focus:outline-none transition-colors disabled:opacity-50"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="w-full lg:w-auto shrink-0 flex items-center">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="btn-premium btn-premium--blue btn-glitter w-full lg:w-auto h-[48px] rounded-[14px] px-[18px] text-[14px] font-semibold text-white flex items-center justify-center gap-2 cursor-pointer select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px] disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                      >
                        {status === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <span>Get Free Demo</span>
                            <ArrowRight
                              className="btn-arrow w-[16px] h-[16px] text-white"
                              strokeWidth={2}
                            />
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

              {/* Microcopy below form */}
              <motion.p
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
                  delay: reduceMotion ? 0 : 0.4,
                  ease: EASE,
                }}
                className="mt-2.5 text-[12.5px] flex items-center justify-start gap-1.5 select-text font-normal text-[#64748b]"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5] text-[#2563eb]" />
                <span>Free personalized demo · No commitment</span>
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* FULL-WIDTH FROSTED CALL CONSOLE WINDOW */}
        <motion.div
          initial={reduceMotion ? false : { y: 28 }}
          animate={appReady || reduceMotion ? { y: 0 } : { y: 28 }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.75,
            delay: reduceMotion ? 0 : 0.22,
            ease: EASE,
          }}
          className="mt-9 md:mt-12 w-full"
        >
          <HeroCallConsole />
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
