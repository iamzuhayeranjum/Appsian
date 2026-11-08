import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface GlassIconProps {
  variant: 'pickup' | 'accuracy' | 'booking';
  className?: string;
}

export const GlassIcon: React.FC<GlassIconProps> = ({ variant, className = '' }) => {
  const reduceMotion = useReducedMotion();

  const config = {
    pickup: {
      duration: 6,
      delay: 0,
      dropColor: 'rgba(59, 130, 246, 0.30)',
    },
    accuracy: {
      duration: 6.8,
      delay: 0.8,
      dropColor: 'rgba(245, 158, 11, 0.28)',
    },
    booking: {
      duration: 5.4,
      delay: 1.6,
      dropColor: 'rgba(34, 197, 94, 0.26)',
    },
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        filter: `drop-shadow(0 12px 14px ${config.dropColor})`,
      }}
    >
      <svg
        viewBox="0 0 96 96"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Pickup gradients & filters */}
          <linearGradient id="pickup-back-grad" x1="48" y1="12" x2="48" y2="84" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8fc4ff" />
            <stop offset="100%" stopColor="#2f6bff" />
          </linearGradient>
          <linearGradient id="pickup-frost-grad" x1="48" y1="25" x2="48" y2="71" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
          <filter id="pickup-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          {/* Accuracy gradients & filters */}
          <linearGradient id="accuracy-back-grad" x1="53" y1="16" x2="53" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffd29a" />
            <stop offset="100%" stopColor="#ff8a3d" />
          </linearGradient>
          <linearGradient id="accuracy-frost-grad" x1="43" y1="22" x2="43" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.58" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
          <filter id="accuracy-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          {/* Booking gradients & filters */}
          <linearGradient id="booking-back-grad" x1="46" y1="18" x2="46" y2="74" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a8f5cf" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id="booking-frost-grad" x1="62" y1="41" x2="62" y2="83" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.60" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
          </linearGradient>
          <filter id="booking-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {variant === 'pickup' && (
          <>
            {/* Back shape: 12-point scalloped rosette badge (76px) */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay,
              }}
            >
              <path
                d="M 48.00 16.00 C 53.21 8.44 63.27 11.14 64.00 20.29 C 72.29 16.35 79.65 23.71 75.71 32.00 C 84.86 32.73 87.56 42.79 80.00 48.00 C 87.56 53.21 84.86 63.27 75.71 64.00 C 79.65 72.29 72.29 79.65 64.00 75.71 C 63.27 84.86 53.21 87.56 48.00 80.00 C 42.79 87.56 32.73 84.86 32.00 75.71 C 23.71 79.65 16.35 72.29 20.29 64.00 C 11.14 63.27 8.44 53.21 16.00 48.00 C 8.44 42.79 11.14 32.73 20.29 32.00 C 16.35 23.71 23.71 16.35 32.00 20.29 C 32.73 11.14 42.79 8.44 48.00 16.00 Z"
                fill="url(#pickup-back-grad)"
              />
              {/* Specular highlight on back rosette */}
              <ellipse cx="48" cy="22" rx="14" ry="4" fill="#ffffff" opacity="0.45" filter="url(#pickup-blur)" />
              {/* Glossy white dot 6px at top-left of rosette */}
              <circle cx="28" cy="24" r="3" fill="#ffffff" opacity="0.9" />
            </motion.g>

            {/* Front shape: Frosted circle 46px with handset and soundwaves */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-6, 2, -6], x: [-1, 1, -1] }}
              transition={{
                duration: config.duration - 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay + 0.3,
              }}
            >
              <circle
                cx="48"
                cy="48"
                r="23"
                fill="url(#pickup-frost-grad)"
                stroke="#ffffff"
                strokeOpacity="0.80"
                strokeWidth="1.2"
              />
              {/* Inner top highlight */}
              <path
                d="M 32 40 A 18 18 0 0 1 64 40"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.6"
                fill="none"
              />
              {/* Phone handset glyph in dark navy #0b1530 */}
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                transform="translate(37, 37) scale(0.92)"
                fill="#0b1530"
                stroke="#0b1530"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Two sound-wave arcs at upper right of handset */}
              <path
                d="M 57 41 A 6 6 0 0 1 60 46"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />
              <path
                d="M 61 38 A 11 11 0 0 1 65 47"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                opacity="0.75"
              />
            </motion.g>
          </>
        )}

        {variant === 'accuracy' && (
          <>
            {/* Back shape: Amber shield 64px */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay,
              }}
            >
              <path
                d="M 38 16 L 68 16 Q 78 16 78 26 L 78 46 C 78 64 55.5 73 53 76 C 50.5 73 28 64 28 46 L 28 26 Q 28 16 38 16 Z"
                fill="url(#accuracy-back-grad)"
              />
              {/* Specular highlight on back shield */}
              <ellipse cx="53" cy="22" rx="14" ry="3.5" fill="#ffffff" opacity="0.45" filter="url(#accuracy-blur)" />
              <circle cx="70" cy="24" r="2.5" fill="#ffffff" opacity="0.8" />
            </motion.g>

            {/* Front shape: Frosted shield offset 10px left and 6px down */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-6, 2, -6], x: [-1, 1, -1] }}
              transition={{
                duration: config.duration - 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay + 0.3,
              }}
            >
              <path
                d="M 28 22 L 58 22 Q 68 22 68 32 L 68 52 C 68 70 45.5 79 43 82 C 40.5 79 18 70 18 52 L 18 32 Q 18 22 28 22 Z"
                fill="url(#accuracy-frost-grad)"
                stroke="#ffffff"
                strokeOpacity="0.80"
                strokeWidth="1.2"
              />
              {/* Inner top highlight */}
              <path
                d="M 24 26 L 62 26"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.6"
              />
              <ellipse cx="43" cy="28" rx="13" ry="3.5" fill="#ffffff" opacity="0.5" filter="url(#accuracy-blur)" />
              {/* Dark navy check mark */}
              <path
                d="M 33 50 L 40 57 L 54 42"
                fill="none"
                stroke="#0b1530"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </>
        )}

        {variant === 'booking' && (
          <>
            {/* Back shape: Green calendar page 66px with binder rings & header */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
              transition={{
                duration: config.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay,
              }}
            >
              <rect x="18" y="18" width="56" height="56" rx="14" fill="url(#booking-back-grad)" />
              {/* Header band */}
              <path d="M 18 32 Q 18 18 32 18 L 60 18 Q 74 18 74 32 L 74 33 L 18 33 Z" fill="#059669" opacity="0.50" />
              {/* Two binder rings */}
              <rect x="29" y="14" width="5" height="9" rx="2.5" fill="#ffffff" stroke="#059669" strokeWidth="0.8" />
              <rect x="58" y="14" width="5" height="9" rx="2.5" fill="#ffffff" stroke="#059669" strokeWidth="0.8" />
              {/* Specular highlight */}
              <ellipse cx="46" cy="24" rx="14" ry="3" fill="#ffffff" opacity="0.45" filter="url(#booking-blur)" />
              {/* Calendar grid dots */}
              <circle cx="28" cy="44" r="2.5" fill="#ffffff" opacity="0.75" />
              <circle cx="40" cy="44" r="2.5" fill="#ffffff" opacity="0.75" />
              <circle cx="52" cy="44" r="2.5" fill="#ffffff" opacity="0.75" />
              <circle cx="28" cy="56" r="2.5" fill="#ffffff" opacity="0.75" />
              <circle cx="40" cy="56" r="2.5" fill="#ffffff" opacity="0.75" />
            </motion.g>

            {/* Front shape: Frosted circle 42px at bottom-right holding check mark */}
            <motion.g
              animate={reduceMotion ? {} : { y: [-6, 2, -6], x: [-1, 1, -1] }}
              transition={{
                duration: config.duration - 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: config.delay + 0.3,
              }}
            >
              <circle
                cx="62"
                cy="62"
                r="21"
                fill="url(#booking-frost-grad)"
                stroke="#ffffff"
                strokeOpacity="0.80"
                strokeWidth="1.2"
              />
              {/* Inner top highlight */}
              <path
                d="M 47 55 A 16 16 0 0 1 77 55"
                stroke="#ffffff"
                strokeWidth="1.4"
                strokeLinecap="round"
                opacity="0.55"
                fill="none"
              />
              <ellipse cx="62" cy="48" rx="10" ry="3.5" fill="#ffffff" opacity="0.5" filter="url(#booking-blur)" />
              {/* Dark navy check mark */}
              <path
                d="M 53 62 L 59 68 L 71 55"
                fill="none"
                stroke="#0b1530"
                strokeWidth="3.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.g>
          </>
        )}
      </svg>
    </div>
  );
};

export const TrustRow: React.FC = () => {
  const reduceMotion = useReducedMotion();

  const points = [
    {
      variant: 'pickup' as const,
      title: 'Instant 24/7 Pickup',
      desc: 'Answers every inbound lead in under 2 rings. No hold times, no voicemails left unreturned.',
      accent: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.30)',
      topTint: 'rgba(59, 130, 246, 0.55)',
    },
    {
      variant: 'accuracy' as const,
      title: '99.4% Qualification Accuracy',
      desc: 'Accurately captures caller address, urgency level, timeline, and job details tailored to your trade.',
      accent: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.28)',
      topTint: 'rgba(245, 158, 11, 0.55)',
    },
    {
      variant: 'booking' as const,
      title: 'Direct Dispatch & Booking',
      desc: 'Books directly into your ServiceTitan, Jobber, or Google Calendar without double bookings.',
      accent: '#22c55e',
      glow: 'rgba(34, 197, 94, 0.26)',
      topTint: 'rgba(34, 197, 94, 0.55)',
    },
  ];

  return (
    <section className="w-full bg-[#F5F6F8] pt-14 pb-14 md:pt-[88px] md:pb-14 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
        {points.map((pt, idx) => {
          const isMiddle = idx === 1;
          return (
            <motion.div
              key={pt.variant}
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.7,
                delay: reduceMotion ? 0 : idx * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full max-w-[420px] md:max-w-none mx-auto h-full"
            >
              <article
                className={`group relative w-full h-full min-h-[300px] rounded-[28px] p-[28px_22px_26px] md:p-[32px_28px_30px] flex flex-col items-center text-center overflow-hidden transition-all duration-300 ease-out ${
                  isMiddle
                    ? 'md:-translate-y-8 md:hover:-translate-y-[38px]'
                    : 'md:translate-y-0 md:hover:-translate-y-[6px]'
                }`}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.62) 100%)',
                  border: '1px solid rgba(15,23,42,0.07)',
                  boxShadow:
                    'inset 0 1px 0 #ffffff, 0 30px 70px -40px rgba(30,60,160,0.30), 0 2px 6px rgba(15,23,42,0.04)',
                }}
              >
                {/* Luminous Top hairline */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-[14%] right-[14%] h-[1px] pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)',
                  }}
                />
                {/* Luminous Top accent tint */}
                <div
                  aria-hidden="true"
                  className="absolute -top-[1px] left-[14%] right-[14%] h-[1px] pointer-events-none opacity-60"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${pt.topTint}, transparent)`,
                  }}
                />
                {/* Top light sweep */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-[14%] right-[14%] h-[1px] overflow-hidden pointer-events-none"
                >
                  <div
                    className="card-sweep-line w-[60px] h-full pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)',
                    }}
                  />
                </div>

                {/* Glossy diagonal sheen */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(115deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%)',
                  }}
                />

                {/* Coloured glow rising from bottom */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-[1.35]"
                  style={{
                    background: `radial-gradient(60% 55% at 50% 108%, ${pt.glow}, rgba(255,255,255,0) 72%)`,
                  }}
                />

                {/* Luminous Bottom hairline */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-[10%] right-[10%] h-[1px] pointer-events-none transition-opacity duration-300 opacity-85 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${pt.accent}, transparent)`,
                  }}
                />

                {/* Glass Icon */}
                <div className="relative z-10 transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:rotate-3 motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0">
                  <GlassIcon
                    variant={pt.variant}
                    className="w-[80px] h-[80px] md:w-[88px] md:h-[88px]"
                  />
                </div>

                {/* Text Block */}
                <div className="relative z-10 mt-[26px] mt-auto flex flex-col items-center">
                  <h3 className="font-display font-semibold text-[19px] lg:text-[20px] text-[#0b1530] tracking-[-0.015em] mb-2 leading-snug">
                    {pt.title}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#64748b] max-w-[300px]">
                    {pt.desc}
                  </p>
                </div>
              </article>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
