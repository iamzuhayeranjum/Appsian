import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PhoneIncoming,
  CalendarCheck,
  Megaphone,
  ClipboardCheck,
  ChevronRight,
  ArrowRight,
  Play,
  ThumbsUp,
  Zap,
  Wrench,
  Droplets,
  Flame,
  Check,
  Sparkles,
  Search,
  MapPin,
  Users,
  Bell,
} from 'lucide-react';
import { SectionHeader } from './design-system';
import { SectionTag } from './SectionTag';
import { AppsianMark } from './AppsianLogo';
import { INTEGRATIONS, getLogoSrc } from './IntegrationsStrip';

interface ResultsSectionProps {
  onSuccessDemo?: () => void;
}

// ---------------------------------------------------------------------------
// Shared Logo Renderer (Reusing INTEGRATIONS & getLogoSrc)
// ---------------------------------------------------------------------------

interface SharedLogoProps {
  name: string;
  size?: number;
  className?: string;
}

const SharedLogo: React.FC<SharedLogoProps> = ({ name, size = 32, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const item = INTEGRATIONS.find((i) => i.name.toLowerCase() === name.toLowerCase());
  const file = item?.file || '';
  const src = file ? getLogoSrc(file) : '';

  if (failed || !file) {
    return (
      <span className="text-[10px] font-semibold text-[#475569] text-center leading-tight px-1">
        {name}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      draggable={false}
      onError={() => {
        console.warn(`[ResultsSection] Logo failed to load: ${src}`);
        setFailed(true);
      }}
      style={{
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        objectFit: 'contain',
        transform: `scale(${item?.scale ?? 1})`,
      }}
      className={`block select-none ${className}`}
    />
  );
};

// ---------------------------------------------------------------------------
// Scaled Design Area Container (520 x 248 px fixed canvas)
// ---------------------------------------------------------------------------

interface IllustrationContainerProps {
  panelGradient: string;
  lightDots?: boolean;
  glowBlob?: React.ReactNode;
  children: React.ReactNode;
}

const IllustrationContainer: React.FC<IllustrationContainerProps> = ({
  panelGradient,
  lightDots = false,
  glowBlob,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w <= 0 || h <= 0) return;
      const sX = w / 520;
      const sY = h / 248;
      const target = Math.min(1.15, Math.min(sX, sY));
      setScale(Math.max(0.58, target));
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden flex items-center justify-center select-none"
      style={{ background: panelGradient }}
    >
      {/* Light spot */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 55% at 15% 0%, rgba(255,255,255,0.18), rgba(255,255,255,0) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Optional Glow Blob */}
      {glowBlob}

      {/* Faint Dot Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          backgroundImage: lightDots
            ? 'radial-gradient(rgba(37,99,235,0.08) 1px, transparent 1px)'
            : 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
          maskImage: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 30%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      {/* Fixed 520 x 248 Design Canvas */}
      <div
        style={{
          width: '520px',
          height: '248px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative shrink-0 flex items-center justify-center pointer-events-none"
      >
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Glass Frame Wrapper for Cards (Types A, B, D)
// ---------------------------------------------------------------------------

const GlassFrame: React.FC<{
  widthPercent?: number;
  top?: number;
  children: React.ReactNode;
}> = ({ widthPercent = 78, top = 18, children }) => {
  return (
    <div
      className="absolute p-[7px] rounded-[28px] pointer-events-none"
      style={{
        width: `${widthPercent}%`,
        top: `${top}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.28)',
        border: '1px solid rgba(255, 255, 255, 0.55)',
      }}
    >
      <div
        className="bg-white rounded-[21px] p-3.5 relative"
        style={{
          boxShadow: '0 20px 50px -22px rgba(8, 20, 90, 0.6)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// TYPE A: "More opportunities captured"
// Chat-style message card with audio attachment & animated waveform
// ---------------------------------------------------------------------------

const BAR_HEIGHTS = [
  14, 24, 38, 48, 34, 20, 42, 54, 36, 18, 30, 46, 52, 38, 22, 40, 50, 44, 28, 16, 36, 48, 38, 24,
  32, 42, 30, 16,
];

const IllustrationTypeA: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  return (
    <IllustrationContainer
      panelGradient="linear-gradient(135deg, #1b1f8f 0%, #3a2fd0 45%, #6c7dff 100%)"
      glowBlob={
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(40% 60% at 12% 8%, rgba(150,130,255,0.65), rgba(150,130,255,0) 70%)',
          }}
          aria-hidden="true"
        />
      }
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <GlassFrame widthPercent={80} top={12}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-[11px] flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #6fa0ff 0%, #1d4ed8 100%)',
                }}
              >
                <AppsianMark size={18} fill="#ffffff" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[14px] font-bold text-[#0b1530] leading-none">Appsian</span>
                <span className="text-[12px] text-[#94a3b8] leading-none">11:42 PM</span>
              </div>
            </div>
            <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10.5px] font-semibold text-[#15803d]">
              Answered
            </span>
          </div>

          {/* Message */}
          <p className="mt-2 text-[13.5px] leading-[1.4] text-[#0b1530] font-normal text-left">
            Answered an after-hours call and saved it as a new enquiry.
          </p>

          {/* Audio Attachment Card */}
          <div className="mt-2.5 rounded-[14px] border border-[#e8ecf4] overflow-hidden bg-white">
            {/* Waveform Player Box */}
            <div
              className="h-[58px] px-3.5 flex items-center gap-3 relative"
              style={{
                background: 'linear-gradient(135deg, #eef4ff 0%, #dce8ff 100%)',
              }}
            >
              <div className="w-[32px] h-[32px] rounded-full bg-white shadow-xs flex items-center justify-center text-[#2563eb] shrink-0">
                <Play className="w-3.5 h-3.5 fill-[#2563eb] text-[#2563eb] ml-0.5" />
              </div>
              {/* Waveform Bars */}
              <div className="flex items-center gap-[3px] flex-1 h-[42px] overflow-hidden">
                {BAR_HEIGHTS.map((h, i) => (
                  <motion.span
                    key={i}
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            scaleY: [1, 0.35, 1.15, 0.65, 1],
                          }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 1.4,
                      ease: 'easeInOut',
                      delay: i * 0.045,
                    }}
                    style={{
                      height: `${h * 0.72}px`,
                      transformOrigin: 'center center',
                    }}
                    className="w-[3px] rounded-full bg-[#4f6bf0] inline-block shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Audio Meta Footer */}
            <div className="px-3 py-1.5 bg-white border-t border-[#e8ecf4] flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#0b1530]">After-hours-call.mp3</span>
              <span className="text-[11px] text-[#94a3b8]">0:54 · Saved with transcript</span>
            </div>
          </div>

          {/* Reactions Row */}
          <motion.div
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="mt-2 flex items-center gap-1.5"
          >
            <div className="h-[24px] px-2.5 rounded-full bg-white border border-[#e5e7eb] flex items-center gap-1.5 text-[11.5px] text-[#0b1530] shadow-xs">
              <ThumbsUp className="w-3 h-3 text-[#2563eb]" />
              <span className="font-medium">1</span>
            </div>
            <div className="h-[24px] px-2.5 rounded-full bg-white border border-[#e5e7eb] flex items-center gap-1.5 text-[11.5px] text-[#0b1530] shadow-xs">
              <Zap className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
              <span className="font-medium">2</span>
            </div>
          </motion.div>
        </GlassFrame>
      </motion.div>
    </IllustrationContainer>
  );
};

// ---------------------------------------------------------------------------
// TYPE B: "More jobs won"
// Chat-style message card with list of rows & status chips
// ---------------------------------------------------------------------------

const TYPE_B_ROWS = [
  {
    icon: Wrench,
    title: 'Water heater repair',
    status: 'Booked',
    chipClass: 'bg-[#dcfce7] text-[#15803d]',
  },
  {
    icon: Droplets,
    title: 'Burst pipe',
    status: 'Booked',
    chipClass: 'bg-[#dcfce7] text-[#15803d]',
  },
  {
    icon: Flame,
    title: 'Boiler service',
    status: 'Quote sent',
    chipClass: 'bg-[#fef3c7] text-[#b45309]',
  },
];

const IllustrationTypeB: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  return (
    <IllustrationContainer panelGradient="linear-gradient(160deg, #1e3a9e 0%, #2f6bf0 50%, #7cc4ff 100%)">
      {/* Blurred Faded UI Fragment in Top-Right Corner */}
      <div
        className="absolute -top-3 -right-3 w-[150px] h-[85px] rounded-[18px] pointer-events-none select-none flex flex-col gap-2 p-3"
        style={{
          background: 'rgba(255, 255, 255, 0.16)',
          filter: 'blur(2px)',
          transform: 'rotate(-4deg)',
        }}
        aria-hidden="true"
      >
        <div className="w-[65%] h-2.5 rounded-full bg-white/30" />
        <div className="flex gap-2 items-end h-8 mt-1">
          <div className="w-4 h-5 rounded-t bg-white/25" />
          <div className="w-4 h-8 rounded-t bg-white/40" />
          <div className="w-4 h-4 rounded-t bg-white/20" />
          <div className="w-4 h-7 rounded-t bg-white/30" />
        </div>
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <GlassFrame widthPercent={82} top={12}>
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-[11px] flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{
                background: 'linear-gradient(135deg, #6fa0ff 0%, #1d4ed8 100%)',
              }}
            >
              <AppsianMark size={18} fill="#ffffff" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[14px] font-bold text-[#0b1530] leading-none">Appsian</span>
              <span className="text-[12px] text-[#94a3b8] leading-none">7:00 AM</span>
            </div>
          </div>

          {/* Message */}
          <p className="mt-2 text-[13.5px] leading-tight text-[#0b1530] font-normal text-left">
            Here are the enquiries that turned into jobs.
          </p>

          {/* List of 3 Bordered Rows */}
          <div className="mt-2 flex flex-col gap-1.5">
            {TYPE_B_ROWS.map((row, i) => {
              const Icon = row.icon;
              return (
                <motion.div
                  key={row.title}
                  initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.12 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-[36px] rounded-[11px] border border-[#e8ecf4] px-2.5 flex items-center justify-between gap-2.5 bg-white shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-[22px] h-[22px] rounded-[6px] bg-[#eef4ff] text-[#1d4ed8] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[12.5px] font-medium text-[#0b1530] truncate">
                      {row.title}
                    </span>
                  </div>

                  <motion.span
                    initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.22 + i * 0.1 }}
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold shrink-0 ${row.chipClass}`}
                  >
                    {row.status}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>

          {/* Reactions Row */}
          <motion.div
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.48 }}
            className="mt-2 flex items-center gap-1.5"
          >
            <div className="h-[24px] px-2.5 rounded-full bg-white border border-[#e5e7eb] flex items-center gap-1.5 text-[11.5px] text-[#0b1530] shadow-xs">
              <Check className="w-3 h-3 text-[#10b981] stroke-[2.8]" />
              <span className="font-medium">3</span>
            </div>
            <div className="h-[24px] px-2.5 rounded-full bg-white border border-[#e5e7eb] flex items-center gap-1.5 text-[11.5px] text-[#0b1530] shadow-xs">
              <Sparkles className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
              <span className="font-medium">1</span>
            </div>
          </motion.div>
        </GlassFrame>
      </motion.div>
    </IllustrationContainer>
  );
};

// ---------------------------------------------------------------------------
// TYPE C: "More value from existing ad spend"
// Hub diagram with center Appsian tile, 3 ad source tiles, 3 CRM logo tiles
// ---------------------------------------------------------------------------

const IllustrationTypeC: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  return (
    <IllustrationContainer
      panelGradient="linear-gradient(135deg, #f1f7ff 0%, #dcebff 55%, #c6dcff 100%)"
      lightDots={true}
      glowBlob={
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(35% 50% at 50% 50%, rgba(255,255,255,0.9), rgba(255,255,255,0) 70%)',
          }}
          aria-hidden="true"
        />
      }
    >
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        {/* SVG Connecting Curves behind tiles */}
        <svg
          viewBox="0 0 520 248"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        >
          <defs>
            {/* Left to Center paths */}
            <path id="curve-l1" d="M 105 46 C 160 46, 175 100, 214 100" />
            <path id="curve-l2" d="M 105 120 C 160 120, 175 116, 214 116" />
            <path id="curve-l3" d="M 105 194 C 160 194, 175 132, 214 132" />
            {/* Center to Right paths */}
            <path id="curve-r1" d="M 306 100 C 345 100, 360 46, 415 46" />
            <path id="curve-r2" d="M 306 116 C 345 116, 360 120, 415 120" />
            <path id="curve-r3" d="M 306 132 C 345 132, 360 194, 415 194" />
          </defs>

          {/* Render dashed lines */}
          <use
            href="#curve-l1"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <use
            href="#curve-l2"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <use
            href="#curve-l3"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <use
            href="#curve-r1"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <use
            href="#curve-r2"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />
          <use
            href="#curve-r3"
            stroke="rgba(37,99,235,0.35)"
            strokeWidth="1.5"
            strokeDasharray="3 5"
            fill="none"
          />

          {/* Traveling blue dots along curves */}
          {!reduceMotion && (
            <>
              {/* Left dots traveling to center */}
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="0s">
                  <mpath href="#curve-l1" />
                </animateMotion>
              </circle>
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.8s">
                  <mpath href="#curve-l2" />
                </animateMotion>
              </circle>
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="1.6s">
                  <mpath href="#curve-l3" />
                </animateMotion>
              </circle>

              {/* Right dots traveling from center */}
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.4s">
                  <mpath href="#curve-r1" />
                </animateMotion>
              </circle>
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="1.2s">
                  <mpath href="#curve-r2" />
                </animateMotion>
              </circle>
              <circle r="3.2" fill="#2563eb">
                <animateMotion dur="2.8s" repeatCount="indefinite" begin="2.0s">
                  <mpath href="#curve-r3" />
                </animateMotion>
              </circle>
            </>
          )}
        </svg>

        {/* BACKGROUND DEPTH: 2 blurred drifted logo tiles */}
        {/* 1. Zendesk top-left */}
        <motion.div
          animate={reduceMotion ? {} : { y: [-3, 3, -3], x: [-2, 2, -2] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute w-[46px] h-[46px] rounded-[15px] bg-white p-2.5 shadow-sm flex items-center justify-center select-none pointer-events-none"
          style={{
            left: '166px',
            top: '34px',
            filter: 'blur(3px)',
            opacity: 0.45,
          }}
          aria-hidden="true"
        >
          <SharedLogo name="Zendesk" size={26} />
        </motion.div>

        {/* 2. Calendly bottom-right */}
        <motion.div
          animate={reduceMotion ? {} : { y: [3, -3, 3], x: [2, -2, 2] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute w-[46px] h-[46px] rounded-[15px] bg-white p-2.5 shadow-sm flex items-center justify-center select-none pointer-events-none"
          style={{
            left: '344px',
            top: '164px',
            filter: 'blur(3px)',
            opacity: 0.45,
          }}
          aria-hidden="true"
        >
          <SharedLogo name="Calendly" size={26} />
        </motion.div>

        {/* CENTER TILE: Big Glossy Appsian Tile (92px) */}
        <motion.div
          animate={reduceMotion ? {} : { y: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute w-[92px] h-[92px] rounded-[28px] flex items-center justify-center text-white select-none z-20"
          style={{
            left: '214px',
            top: '70px',
            background: 'linear-gradient(145deg, #7aa9ff 0%, #1d4ed8 100%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow:
              '0 22px 40px -16px rgba(29, 78, 216, 0.65), inset 0 2px 0 rgba(255, 255, 255, 0.55)',
          }}
        >
          <AppsianMark size={44} fill="#ffffff" />
        </motion.div>

        {/* Pill below center tile: "Qualified opportunity" */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="absolute h-[26px] px-3 rounded-full bg-white border border-[#e2e8f0] flex items-center gap-1.5 shadow-[0_8px_20px_-10px_rgba(30,60,160,0.5)] z-20"
          style={{
            left: '50%',
            top: '174px',
            transform: 'translateX(-50%)',
          }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#10b981] flex items-center justify-center text-white">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span className="text-[11.5px] font-semibold text-[#0b1530] whitespace-nowrap">
            Qualified opportunity
          </span>
        </motion.div>

        {/* LEFT COLUMN: 3 Sharp White Tiles (Search, MapPin, Megaphone) */}
        {/* Tile 1: Search ads */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex flex-col items-center justify-center z-10"
          style={{ left: '43px', top: '15px' }}
        >
          <Search className="w-6 h-6 text-[#2563eb] stroke-[1.75]" />
          <span className="text-[10px] text-[#64748b] font-medium mt-0.5 leading-none">Search ads</span>
        </div>

        {/* Tile 2: Local ads */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex flex-col items-center justify-center z-10"
          style={{ left: '43px', top: '89px' }}
        >
          <MapPin className="w-6 h-6 text-[#2563eb] stroke-[1.75]" />
          <span className="text-[10px] text-[#64748b] font-medium mt-0.5 leading-none">Local ads</span>
        </div>

        {/* Tile 3: Social ads */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex flex-col items-center justify-center z-10"
          style={{ left: '43px', top: '163px' }}
        >
          <Megaphone className="w-6 h-6 text-[#2563eb] stroke-[1.75]" />
          <span className="text-[10px] text-[#64748b] font-medium mt-0.5 leading-none">Social ads</span>
        </div>

        {/* RIGHT COLUMN: 3 Sharp White Logo Tiles (HubSpot, Salesforce, Google Calendar) */}
        {/* Tile 4: HubSpot */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex items-center justify-center p-3 z-10"
          style={{ left: '415px', top: '15px' }}
        >
          <SharedLogo name="HubSpot" size={38} />
        </div>

        {/* Tile 5: Salesforce */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex items-center justify-center p-3 z-10"
          style={{ left: '415px', top: '89px' }}
        >
          <SharedLogo name="Salesforce" size={38} />
        </div>

        {/* Tile 6: Google Calendar */}
        <div
          className="absolute w-[62px] h-[62px] rounded-[19px] bg-white shadow-[0_12px_28px_-14px_rgba(30,60,160,0.4)] flex items-center justify-center p-3 z-10"
          style={{ left: '415px', top: '163px' }}
        >
          <SharedLogo name="Google Calendar" size={36} />
        </div>
      </motion.div>
    </IllustrationContainer>
  );
};

// ---------------------------------------------------------------------------
// TYPE D: "Less administrative work"
// Automation checklist card with self-drawing animated checks & progress bar
// ---------------------------------------------------------------------------

const TYPE_D_CHECKS = [
  { text: 'Caller details collected', icon: Users, isLogo: false },
  { text: 'Address confirmed', icon: MapPin, isLogo: false },
  { text: 'Estimate booked in calendar', icon: null, isLogo: true, logoName: 'Google Calendar' },
  { text: 'Team alerted', icon: Bell, isLogo: false },
];

const IllustrationTypeD: React.FC<{ reduceMotion: boolean | null }> = ({ reduceMotion }) => {
  return (
    <IllustrationContainer panelGradient="linear-gradient(135deg, #0b1a5c 0%, #1d2f9e 50%, #3f5cf0 100%)">
      {/* Blurred Faded UI Fragment in Top-Right Corner */}
      <div
        className="absolute -top-3 -right-3 w-[140px] h-[75px] rounded-[18px] pointer-events-none select-none flex flex-col gap-2 p-3"
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          filter: 'blur(2px)',
          transform: 'rotate(3deg)',
        }}
        aria-hidden="true"
      >
        <div className="w-[70%] h-2.5 rounded-full bg-white/25" />
        <div className="w-[50%] h-2 rounded-full bg-white/20" />
        <div className="w-[60%] h-2 rounded-full bg-white/18" />
      </div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full relative"
      >
        <GlassFrame widthPercent={76} top={10}>
          {/* Title Row */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#eef1f6]">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{
                  background: 'linear-gradient(135deg, #5b8def 0%, #1d4ed8 100%)',
                }}
              >
                <ClipboardCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-[13.5px] font-bold text-[#0b1530]">
                Appsian handled this call
              </span>
            </div>
            <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10.5px] font-semibold text-[#15803d]">
              Done
            </span>
          </div>

          {/* 4 Checklist Rows with Animated Self-Drawing Checks */}
          <div className="mt-1.5 flex flex-col">
            {TYPE_D_CHECKS.map((item, i) => {
              const delay = 0.15 + i * 0.35;
              const Icon = item.icon;

              return (
                <div
                  key={item.text}
                  className="h-[31px] flex items-center justify-between border-b border-[#f1f4f9] last:border-b-0 px-1"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Animated Check Circle */}
                    <motion.div
                      initial={reduceMotion ? false : { scale: 0.7, backgroundColor: '#e2e8f0' }}
                      animate={{ scale: 1, backgroundColor: '#2563eb' }}
                      transition={{ duration: 0.25, delay }}
                      className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-white shrink-0"
                    >
                      <svg viewBox="0 0 16 16" className="w-2.5 h-2.5 text-white">
                        <motion.path
                          d="M 3.5 8.5 L 6.5 11.5 L 12.5 4.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.3, delay: delay + 0.05 }}
                        />
                      </svg>
                    </motion.div>

                    <span className="text-[12px] font-medium text-[#0b1530] truncate">
                      {item.text}
                    </span>
                  </div>

                  {/* Tool icon / logo tile */}
                  <div className="w-[20px] h-[20px] rounded-[5px] bg-[#f1f5f9] flex items-center justify-center shrink-0">
                    {item.isLogo && item.logoName ? (
                      <SharedLogo name={item.logoName} size={14} />
                    ) : Icon ? (
                      <Icon className="w-3 h-3 text-[#475569]" />
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar & Subtitle */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="w-full h-[5px] rounded-full bg-[#e8ecf7] overflow-hidden">
              <motion.div
                initial={reduceMotion ? { width: '100%' } : { width: '0%' }}
                animate={{ width: '100%' }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 1.8, ease: 'easeInOut', delay: 0.2 }
                }
                className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa]"
              />
            </div>
            <span className="text-[11px] text-[#64748b] text-left">
              No manual follow-up needed
            </span>
          </div>
        </GlassFrame>
      </motion.div>
    </IllustrationContainer>
  );
};

// ---------------------------------------------------------------------------
// Illustration Switcher for Active Row
// ---------------------------------------------------------------------------

const ActiveIllustration: React.FC<{
  index: number;
  reduceMotion: boolean | null;
}> = ({ index, reduceMotion }) => {
  switch (index) {
    case 0:
      return <IllustrationTypeA reduceMotion={reduceMotion} />;
    case 1:
      return <IllustrationTypeB reduceMotion={reduceMotion} />;
    case 2:
      return <IllustrationTypeC reduceMotion={reduceMotion} />;
    case 3:
      return <IllustrationTypeD reduceMotion={reduceMotion} />;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
// The 4 Results Data
// ---------------------------------------------------------------------------

interface ResultItem {
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const RESULTS: ResultItem[] = [
  {
    title: 'More opportunities captured',
    description: 'Enquiries that previously would have gone unanswered.',
    Icon: PhoneIncoming,
  },
  {
    title: 'More jobs won',
    description: 'Enquiries that actually convert into paying customers.',
    Icon: CalendarCheck,
  },
  {
    title: 'More value from existing ad spend',
    description: 'Turn more of the demand you already pay for into qualified opportunities.',
    Icon: Megaphone,
  },
  {
    title: 'Less administrative work',
    description: 'Fewer repetitive calls and less manual information gathering.',
    Icon: ClipboardCheck,
  },
];

// ---------------------------------------------------------------------------
// Main ResultsSection Component
// ---------------------------------------------------------------------------

export const ResultsSection: React.FC<ResultsSectionProps> = ({ onSuccessDemo }) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Screen width observer
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Intersection observer for section presence
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-advance loop: every 6s (desktop) or 7s (mobile) until first user interaction
  useEffect(() => {
    if (reduceMotion || hasInteracted || !isInView || isHovered || isFocused) {
      return;
    }
    const intervalTime = isDesktop ? 6000 : 7000;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % RESULTS.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [reduceMotion, hasInteracted, isInView, isHovered, isFocused, isDesktop]);

  // Keyboard navigation for WAI-ARIA radio group
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % RESULTS.length;
      setActive(next);
      setHasInteracted(true);
      buttonRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + RESULTS.length) % RESULTS.length;
      setActive(prev);
      setHasInteracted(true);
      buttonRefs.current[prev]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
      setHasInteracted(true);
      buttonRefs.current[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(RESULTS.length - 1);
      setHasInteracted(true);
      buttonRefs.current[RESULTS.length - 1]?.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(index);
      setHasInteracted(true);
    }
  };

  const handleCtaClick = () => {
    const demoInput = document.getElementById('demo-name') as HTMLInputElement | null;
    if (demoInput) {
      demoInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        demoInput.focus();
      }, 450);
    } else if (onSuccessDemo) {
      onSuccessDemo();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="results"
      ref={sectionRef}
      className="w-full bg-[var(--page-gray,#F5F6F8)] font-sans py-[100px]"
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">
        {/* Section Heading & Eyebrow */}
        <div className="px-2 sm:px-6">
          <SectionHeader
            eyebrow={<SectionTag label="Results" icon="trending-up" />}
            headline={[
              { text: 'What changes when', weight: 'light' },
              { text: 'every call is answered.', weight: 'strong' },
            ]}
            subline="The results you can expect from using an AI phone calling agent."
          />
        </div>

        {/* List Container Shell */}
        <div className="max-w-[1040px] mx-auto px-5 md:px-8 mt-14 md:mt-[72px]">
          <div
            className="w-full bg-[#FFFFFF] border border-[rgba(15,23,42,0.06)] rounded-[32px] p-3 md:px-7 md:py-4 shadow-[0_30px_70px_-40px_rgba(30,60,160,0.25)] relative"
            style={{ minHeight: isDesktop ? '696px' : undefined }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsFocused(false);
              }
            }}
          >
            <ul
              role="radiogroup"
              aria-label="What changes when every call is answered"
              className="flex flex-col relative w-full"
            >
              {RESULTS.map((result, index) => {
                const isActive = active === index;
                const { Icon } = result;

                return (
                  <React.Fragment key={result.title}>
                    <li className="relative w-full">
                      <button
                        ref={(el) => {
                          buttonRefs.current[index] = el;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          setActive(index);
                          setHasInteracted(true);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className={`group relative w-full rounded-[24px] text-left cursor-pointer transition-colors duration-200 outline-none select-none flex flex-col justify-center focus-visible:outline-2 focus-visible:outline-[#3b82f6] focus-visible:outline-offset-[3px] ${
                          !isActive ? 'hover:bg-[rgba(59,130,246,0.04)]' : ''
                        }`}
                      >
                        {/* Highlight Box with motion layout animation */}
                        {isActive && (
                          <motion.div
                            layoutId="result-highlight"
                            transition={
                              reduceMotion
                                ? { duration: 0 }
                                : { type: 'spring', stiffness: 260, damping: 30 }
                            }
                            className="absolute -inset-x-2 inset-y-0 rounded-[24px] pointer-events-none"
                            style={{
                              background: 'linear-gradient(135deg, #f6f9ff 0%, #eaf1ff 100%)',
                              boxShadow: '0 18px 44px -20px rgba(37,99,235,0.45)',
                            }}
                          >
                            {/* Radial glow in top-right corner */}
                            <div
                              className="absolute inset-0 rounded-[24px] pointer-events-none"
                              style={{
                                background:
                                  'radial-gradient(45% 90% at 100% 0%, rgba(59,130,246,0.22), rgba(59,130,246,0) 70%)',
                              }}
                            />
                            {/* Rotating 1px gradient border */}
                            <div className="result-highlight-border" />
                          </motion.div>
                        )}

                        {/* DESKTOP ROW CONTENT (>= 768px) */}
                        <div
                          className={`hidden md:flex items-center gap-5 py-6 px-2 w-full relative z-10 transition-[min-height] duration-450 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive ? 'min-h-[296px]' : 'min-h-[120px]'
                          }`}
                        >
                          {/* LEFT: Icon Tile (56px) */}
                          <div
                            className={`w-[56px] h-[56px] rounded-[16px] shrink-0 flex items-center justify-center relative transition-all duration-250 ${
                              isActive ? 'text-white' : 'text-[#1e3a8a]'
                            }`}
                            style={
                              isActive
                                ? {
                                    background: 'linear-gradient(135deg, #5b8def, #1d4ed8)',
                                    boxShadow:
                                      '0 10px 24px -10px rgba(29,78,216,0.6), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.45)',
                                  }
                                : {
                                    background: '#EAF1FF',
                                    border: '1px solid rgba(59,130,246,0.18)',
                                  }
                            }
                          >
                            <Icon className="w-6 h-6 stroke-[1.75]" />
                          </div>

                          {/* MIDDLE: Title & Description */}
                          <div className="flex flex-col text-left max-w-[420px] mr-auto">
                            <h3 className="font-display font-semibold text-[20px] lg:text-[22px] tracking-[-0.015em] text-[#0b1530] leading-snug">
                              {result.title}
                            </h3>
                            <p className="text-[14.5px] leading-[1.55] text-[#64748b] mt-1.5">
                              {result.description}
                            </p>
                          </div>

                          {/* RIGHT: Illustration (Active) or Arrow Button (Inactive) */}
                          {isActive ? (
                            <div
                              className="w-[54%] min-w-[460px] max-w-[600px] h-[248px] rounded-[24px] overflow-hidden shrink-0 ml-auto select-none relative"
                              aria-hidden="true"
                            >
                              <ActiveIllustration index={index} reduceMotion={reduceMotion} />
                            </div>
                          ) : (
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-[rgba(15,23,42,0.12)] text-[#64748b] group-hover:border-[rgba(59,130,246,0.4)] group-hover:text-[#1d4ed8] transition-all duration-200 shrink-0 ml-auto"
                              aria-hidden="true"
                            >
                              <ChevronRight className="w-4 h-4 text-current transition-transform duration-200 group-hover:translate-x-[3px]" />
                            </div>
                          )}
                        </div>

                        {/* MOBILE ROW CONTENT (< 768px) */}
                        <div className="flex md:hidden flex-col w-full py-4 px-2 relative z-10">
                          {/* Title line with Icon tile & Title on left, Arrow button on right */}
                          <div className="flex items-center justify-between gap-3 w-full">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-12 h-12 rounded-[14px] shrink-0 flex items-center justify-center relative transition-all duration-250 ${
                                  isActive ? 'text-white' : 'text-[#1e3a8a]'
                                }`}
                                style={
                                  isActive
                                    ? {
                                        background: 'linear-gradient(135deg, #5b8def, #1d4ed8)',
                                        boxShadow:
                                          '0 10px 24px -10px rgba(29,78,216,0.6), inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.45)',
                                      }
                                    : {
                                        background: '#EAF1FF',
                                        border: '1px solid rgba(59,130,246,0.18)',
                                      }
                                }
                              >
                                <Icon className="w-5 h-5 stroke-[1.75]" />
                              </div>
                              <h3 className="font-display font-semibold text-[17px] text-[#0b1530] tracking-[-0.015em] leading-snug">
                                {result.title}
                              </h3>
                            </div>

                            {!isActive && (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(15,23,42,0.12)] text-[#64748b] shrink-0"
                                aria-hidden="true"
                              >
                                <ChevronRight className="w-4 h-4 text-current" />
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[14px] leading-relaxed text-[#64748b] text-left mt-2.5 w-full">
                            {result.description}
                          </p>

                          {/* Expanded Illustration for Active row on mobile */}
                          {isActive && (
                            <div
                              className="w-full h-[230px] mt-3.5 rounded-[20px] overflow-hidden select-none relative"
                              aria-hidden="true"
                            >
                              <ActiveIllustration index={index} reduceMotion={reduceMotion} />
                            </div>
                          )}
                        </div>
                      </button>
                    </li>

                    {/* 1px Hairline divider between rows: hidden next to active row */}
                    {index < RESULTS.length - 1 && (
                      <div
                        className={`h-[1px] w-full transition-opacity duration-200 pointer-events-none ${
                          active === index || active === index + 1 ? 'opacity-0' : 'opacity-100'
                        }`}
                        style={{ backgroundColor: 'rgba(15,23,42,0.08)' }}
                        aria-hidden="true"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>

          {/* Centered "Get Free Demo" CTA button */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-premium btn-premium--dark btn-glitter group h-[52px] md:h-[48px] px-7 rounded-[12px] text-[16px] font-semibold text-white inline-flex items-center justify-center gap-[10px] cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-[rgba(124,92,255,0.6)] focus-visible:outline-offset-[2px]"
            >
              <span>Get Free Demo</span>
              <ArrowRight className="btn-arrow w-[18px] h-[18px]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
