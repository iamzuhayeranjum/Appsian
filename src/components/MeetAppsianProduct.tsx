import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  MessageSquare,
  AlertTriangle,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
} from 'lucide-react';
import { INTEGRATIONS, getLogoSrc, type IntegrationItem } from './IntegrationsStrip';

interface MeetAppsianProductProps {
  isReducedMotion?: boolean;
}

// -----------------------------------------------------------------------------
// Helper: Shared Logo Renderer with Fallback & Console Warning
// -----------------------------------------------------------------------------
interface LogoTileProps {
  name: string;
  size?: number;
  className?: string;
  imgClassName?: string;
}

const LogoTile: React.FC<LogoTileProps> = ({
  name,
  size = 32,
  className = '',
  imgClassName = '',
}) => {
  const [failed, setFailed] = useState(false);
  const item = INTEGRATIONS.find((i) => i.name.toLowerCase() === name.toLowerCase());

  if (!item || failed) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-[#374151] select-none text-center ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-[11px] leading-tight font-semibold">
          {item ? item.name.slice(0, 3) : name.slice(0, 1)}
        </span>
      </div>
    );
  }

  const src = getLogoSrc(item.file);

  return (
    <img
      src={src}
      alt={item.name}
      loading="lazy"
      draggable={false}
      width={size}
      height={size}
      onError={() => {
        console.warn(`[MeetAppsian] Logo failed to load: ${src}`);
        setFailed(true);
      }}
      style={{
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
        objectFit: 'contain',
      }}
      className={`select-none pointer-events-none ${imgClassName}`}
    />
  );
};

// -----------------------------------------------------------------------------
// CARD 1 MINI-UI: Books the estimate (Stacked white pills with drawn checkmarks)
// -----------------------------------------------------------------------------
const Card1MiniUI: React.FC<{ isInView: boolean; isReducedMotion: boolean }> = ({
  isInView,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4">
      <div className="relative w-[92%] sm:w-[84%] max-w-[400px] flex flex-col items-center gap-[22px]">
        {/* PILL A: Calendar Sync */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView || isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, delay: isReducedMotion ? 0 : 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[76px] sm:h-[84px] rounded-full bg-[rgba(255,255,255,0.94)] border border-[rgba(255,255,255,0.85)] shadow-[0_18px_40px_-18px_rgba(8,20,90,0.55)] pl-[14px] sm:pl-[18px] pr-[16px] sm:pr-[22px] flex items-center justify-between"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Google Calendar Logo Tile */}
            <div className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-[13px] bg-white border border-slate-100/80 shadow-xs flex items-center justify-center p-2 shrink-0">
              <LogoTile name="Google Calendar" size={28} />
            </div>
            <div className="truncate">
              <div className="text-[14px] sm:text-[15.5px] font-semibold text-[#0b1530] leading-tight truncate">
                Calendar sync in 0.4 seconds
              </div>
              <div className="text-[11.5px] sm:text-[12.5px] text-[#6b7280] mt-0.5 truncate">
                Open slot found · Tomorrow, 10:00 AM
              </div>
            </div>
          </div>

          {/* Green Drawn Checkmark */}
          <div className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 shadow-xs ml-2">
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" className="overflow-visible">
              <motion.path
                d="M1.5 5L4.5 8L11.5 1.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isReducedMotion ? false : { pathLength: 0 }}
                animate={isInView || isReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: isReducedMotion ? 0 : 0.5,
                  delay: isReducedMotion ? 0 : 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Central Dotted Connector Line & Sliding Pulse Dot */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[72px] sm:top-[78px] h-[26px] sm:h-[28px] w-[2px] flex items-center justify-center pointer-events-none z-10">
          <div className="w-[1.5px] h-full border-l-2 border-dotted border-white/60" />
          {!isReducedMotion && (
            <motion.div
              animate={{ y: [-11, 11, -11] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] -translate-x-[1px]"
            />
          )}
        </div>

        {/* PILL B: SMS Confirmation */}
        <motion.div
          initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView || isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, delay: isReducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-[76px] sm:h-[84px] rounded-full bg-[rgba(255,255,255,0.94)] border border-[rgba(255,255,255,0.85)] shadow-[0_18px_40px_-18px_rgba(8,20,90,0.55)] pl-[14px] sm:pl-[18px] pr-[16px] sm:pr-[22px] flex items-center justify-between"
        >
          <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
            {/* Blue Gradient MessageSquare Icon Tile */}
            <div className="w-[42px] h-[42px] sm:w-[44px] sm:h-[44px] rounded-[13px] bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-white shadow-xs flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="truncate">
              <div className="text-[14px] sm:text-[15.5px] font-semibold text-[#0b1530] leading-tight truncate">
                SMS confirmation sent to customer
              </div>
              <div className="text-[11.5px] sm:text-[12.5px] text-[#6b7280] mt-0.5 truncate">
                Delivered to the caller
              </div>
            </div>
          </div>

          {/* Green Drawn Checkmark */}
          <div className="w-[24px] h-[24px] sm:w-[26px] sm:h-[26px] rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 shadow-xs ml-2">
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none" className="overflow-visible">
              <motion.path
                d="M1.5 5L4.5 8L11.5 1.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isReducedMotion ? false : { pathLength: 0 }}
                animate={isInView || isReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{
                  duration: isReducedMotion ? 0 : 0.5,
                  delay: isReducedMotion ? 0 : 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Bottom Frosted Pill */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white/[0.18] border border-white/40 backdrop-blur-sm text-white text-[12px] font-medium tracking-wide shadow-xs whitespace-nowrap select-none">
        Active 24 hours a day · No human delay
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// CARD 2 MINI-UI: Collects the job details (Cropped Live Table)
// -----------------------------------------------------------------------------
const CALLS_TABLE_ROWS = [
  {
    caller: 'James Peterson',
    phone: '(512) 489-0124',
    scope: 'Roofing Repair',
    status: 'Booked',
    outcome: 'Tomorrow, 10:00 AM',
    statusClass: 'bg-[#EFF6FF] text-[#2563EB]',
  },
  {
    caller: 'Sarah Jenkins',
    phone: '(512) 671-8820',
    scope: 'Burst Pipe Emergency',
    status: 'Dispatched',
    outcome: 'Urgent Tech En Route',
    statusClass: 'bg-[#FEF2F2] text-[#DC2626]',
  },
  {
    caller: 'David Martinez',
    phone: '(512) 349-9021',
    scope: 'HVAC Seasonal Tune-up',
    status: 'Booked',
    outcome: 'Friday, 2:00 PM',
    statusClass: 'bg-[#EFF6FF] text-[#2563EB]',
  },
  {
    caller: 'Lisa Montgomery',
    phone: '(512) 802-5519',
    scope: 'Electrical Panel Upgrade',
    status: 'Qualified',
    outcome: 'Estimate Sent via SMS',
    statusClass: 'bg-[#F0FDF4] text-[#16A34A]',
  },
];

const Card2MiniUI: React.FC<{ isInView: boolean; isReducedMotion: boolean }> = ({
  isInView,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        initial={isReducedMotion ? false : { y: 40, opacity: 0 }}
        animate={isInView || isReducedMotion ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-[7%] top-[24px] md:top-[28px] w-[124%] md:w-[118%] bg-white rounded-[20px] p-4 sm:p-[18px] border border-white/90 shadow-[0_22px_45px_-14px_rgba(8,20,90,0.55)]"
      >
        {/* Table Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <h4 className="text-[13.5px] font-semibold text-[#0F172A]">
              Recent Inbound Calls
            </h4>
          </div>
          <span className="text-[11px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-full">
            Live Feed
          </span>
        </div>

        {/* Table Content */}
        <div className="mt-2 text-[10.5px] sm:text-[11.5px]">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#94A3B8] border-b border-[#F8FAFC] text-[10px] sm:text-[10.5px] uppercase tracking-wider font-semibold">
                <th className="pb-1.5 font-medium">Caller</th>
                <th className="pb-1.5 font-medium">Scope</th>
                <th className="pb-1.5 font-medium">Status</th>
                <th className="pb-1.5 font-medium text-right pr-4">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8FAFC]">
              {CALLS_TABLE_ROWS.map((row, idx) => (
                <motion.tr
                  key={row.caller}
                  initial={isReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={isInView || isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.45,
                    delay: isReducedMotion ? 0 : 0.3 + idx * 0.14,
                    ease: 'easeOut',
                  }}
                  className="hover:bg-[#F8FAFC]/80 transition-colors"
                >
                  <td className="py-2.5 font-medium text-[#0F172A]">
                    <div>{row.caller}</div>
                    <div className="text-[9.5px] sm:text-[10px] text-[#94A3B8]">{row.phone}</div>
                  </td>
                  <td className="py-2.5 text-[#475569]">{row.scope}</td>
                  <td className="py-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[10.5px] font-medium ${row.statusClass}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-[#0F172A] text-[11px] pr-4">
                    {row.outcome}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Card Footer */}
        <div className="pt-2.5 mt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>4 calls answered today · 100% pickup</span>
          <span className="text-[#2563EB] font-semibold pr-4">Synced with Jobber</span>
        </div>
      </motion.div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// CARD 3 MINI-UI: Dispatches emergency calls (Status timeline & Traveling truck)
// -----------------------------------------------------------------------------
const Card3MiniUI: React.FC<{ isInView: boolean; isReducedMotion: boolean }> = ({
  isInView,
  isReducedMotion,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between pt-5 pb-4 px-4 overflow-hidden">
      {/* Centered White Glass Card */}
      <motion.div
        initial={isReducedMotion ? false : { opacity: 0, y: 16 }}
        animate={isInView || isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-[92%] sm:w-[86%] max-w-[400px] bg-[rgba(255,255,255,0.94)] border border-[rgba(255,255,255,0.85)] rounded-[22px] p-4 sm:p-[18px] shadow-[0_18px_40px_-18px_rgba(8,20,90,0.55)]"
      >
        {/* Top Meta Row */}
        <div className="flex items-center justify-between">
          <span className="bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Emergency
          </span>
          <span className="text-[12px] text-[#6B7280] font-medium">
            Sarah Jenkins · (512) 671-8820
          </span>
        </div>

        {/* Title */}
        <h4 className="text-[15.5px] sm:text-[16px] font-semibold text-[#0B1530] mt-2">
          Burst Pipe Emergency
        </h4>

        {/* 3-Step Timeline */}
        <div className="mt-3.5 space-y-2 relative">
          {/* STEP 1: Call Answered */}
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, x: -8 }}
            animate={isInView || isReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, delay: isReducedMotion ? 0 : 0.2 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-[18px] h-[18px] rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1.5 4L3.8 6.5L8.5 1.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[12.5px] font-medium text-[#374151]">Call answered</span>
          </motion.div>

          {/* Connector Line 1-2 */}
          <div className="w-[2px] h-[10px] bg-[#22C55E]/80 ml-[8px]" />

          {/* STEP 2: Dispatched */}
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, x: -8 }}
            animate={isInView || isReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, delay: isReducedMotion ? 0 : 0.55 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-[18px] h-[18px] rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1.5 4L3.8 6.5L8.5 1.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-[12.5px] font-medium text-[#374151]">Dispatched</span>
          </motion.div>

          {/* Connector Line 2-3 */}
          <div className="w-[2px] h-[10px] bg-[#3B82F6] ml-[8px]" />

          {/* STEP 3: Urgent Tech En Route */}
          <motion.div
            initial={isReducedMotion ? false : { opacity: 0, x: -8 }}
            animate={isInView || isReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.4, delay: isReducedMotion ? 0 : 0.9 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-[18px] h-[18px] rounded-full bg-[#EFF6FF] border border-[#3B82F6] flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
            </div>
            <span className="text-[12.5px] font-semibold text-[#1D4ED8]">
              Urgent Tech En Route
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Route with Traveling Truck */}
      <div className="w-full relative h-[48px] flex items-center justify-center">
        {/* Dotted Curved Path */}
        <svg
          viewBox="0 0 400 60"
          fill="none"
          className="w-full h-full overflow-visible pointer-events-none"
        >
          <path
            d="M -30 35 Q 100 55 200 30 T 430 35"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            strokeDasharray="4 4"
            fill="none"
          />
        </svg>

        {/* Traveling Truck Tile */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="truck-travel-runner w-[32px] h-[32px] rounded-full bg-white shadow-md border border-white flex items-center justify-center text-[#2563eb]">
            <Truck className="w-4 h-4 stroke-[2.2]" />
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// CARD 4 MINI-UI: Syncs with your CRM (Hub Diagram with Center Appsian Logo)
// -----------------------------------------------------------------------------
const APP_TILES = [
  // 3 Big Sharp Tiles (64px)
  { name: 'Salesforce', size: 64, x: 50, y: 38, radius: 20, opacity: 1, sharp: true, delay: 0 },
  { name: 'HubSpot', size: 64, x: 326, y: 44, radius: 20, opacity: 1, sharp: true, delay: 0.6 },
  { name: 'Google Calendar', size: 64, x: 60, y: 204, radius: 20, opacity: 1, sharp: true, delay: 1.2 },
  // 2 Medium Tiles (48px)
  { name: 'Calendly', size: 48, x: 330, y: 208, radius: 16, opacity: 0.85, sharp: true, delay: 1.8 },
  { name: 'GoHighLevel', size: 48, x: 236, y: 22, radius: 16, opacity: 0.85, sharp: true, delay: 2.2 },
  // 2 Small Blurred Tiles (36px, filter blur 3px)
  { name: 'Zoho CRM', size: 36, x: 16, y: 136, radius: 12, opacity: 0.55, blur: true, delay: 0.3 },
  { name: 'Zendesk', size: 36, x: 198, y: 258, radius: 12, opacity: 0.55, blur: true, delay: 1.5 },
];

const Card4MiniUI: React.FC<{ isInView: boolean; isReducedMotion: boolean }> = ({
  isInView,
  isReducedMotion,
}) => {
  const centerX = 220;
  const centerY = 160;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* 440 x 320 fixed coordinate canvas scaled to fit the panel */}
      <div className="relative w-[440px] h-[320px] shrink-0 scale-[0.74] sm:scale-[0.88] md:scale-100 transform-gpu">
        {/* Background Connecting Lines & Traveling Light Pulses */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 440 320"
          fill="none"
        >
          {APP_TILES.map((tile) => {
            const tileCenterX = tile.x + tile.size / 2;
            const tileCenterY = tile.y + tile.size / 2;
            return (
              <g key={tile.name}>
                {/* Thin connection line */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={tileCenterX}
                  y2={tileCenterY}
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                />
                {/* Traveling light pulse line */}
                {!isReducedMotion && isInView && (
                  <line
                    x1={centerX}
                    y1={centerY}
                    x2={tileCenterX}
                    y2={tileCenterY}
                    stroke="rgba(255,255,255,0.95)"
                    strokeWidth="2.2"
                    strokeDasharray="16 160"
                    className="hub-pulse-line"
                    style={{ animationDelay: `${tile.delay}s` }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* CENTER: Big Frosted 96px Appsian Tile */}
        <div
          className="absolute left-[172px] top-[112px] w-[96px] h-[96px] rounded-[28px] bg-[rgba(255,255,255,0.22)] border border-[rgba(255,255,255,0.6)] backdrop-blur-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_18px_40px_-16px_rgba(8,20,90,0.55)] flex items-center justify-center z-20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="260 296 694 569"
            fill="none"
            width={48}
            height={39}
            className="block shrink-0"
          >
            <defs>
              <linearGradient id="hub-appsian-logo-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <path
              fill="url(#hub-appsian-logo-grad)"
              d="M633 301 949 860H698L536 568C516 532 510 497 523 468 530 452 538 442 546 431Z"
            />
            <path
              fill="url(#hub-appsian-logo-grad)"
              d="M265 860 323 766C345 732 366 708 395 690 430 666 490 656 534 687 562 708 574 732 576 752 579 780 575 797 567 815 562 826 556 834 552 842 548 852 544 857 538 860Z"
            />
          </svg>
        </div>

        {/* 7 Floating App Tiles */}
        {APP_TILES.map((tile) => (
          <motion.div
            key={tile.name}
            animate={
              isReducedMotion
                ? false
                : {
                    y: [-4, 4, -4],
                  }
            }
            transition={{
              duration: 5.5 + tile.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${tile.x}px`,
              top: `${tile.y}px`,
              width: `${tile.size}px`,
              height: `${tile.size}px`,
              borderRadius: `${tile.radius}px`,
              opacity: tile.opacity,
              filter: tile.blur ? 'blur(3px)' : 'none',
            }}
            className="bg-[rgba(255,255,255,0.92)] border border-[rgba(255,255,255,0.7)] shadow-[0_16px_36px_-14px_rgba(8,20,90,0.55)] flex items-center justify-center p-2 z-10"
          >
            <LogoTile
              name={tile.name}
              size={Math.round(tile.size * 0.62)}
              imgClassName="w-auto h-auto"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN COMPONENT: 4-Card Grid
// -----------------------------------------------------------------------------
export const MeetAppsianProduct: React.FC<MeetAppsianProductProps> = ({
  isReducedMotion = false,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, margin: '-80px' });

  const FEATURES = [
    {
      id: 1,
      number: 1,
      title: 'Books the estimate',
      description:
        'Checks your live calendar for open technician availability, confirms the caller address, and locks in the estimate slot.',
      renderMiniUI: () => (
        <Card1MiniUI isInView={isInView} isReducedMotion={isReducedMotion} />
      ),
    },
    {
      id: 2,
      number: 2,
      title: 'Collects the job details',
      description:
        'Asks the right trade-specific questions: what is leaking, how high is the roof, when did the power go out, and is anyone home.',
      renderMiniUI: () => (
        <Card2MiniUI isInView={isInView} isReducedMotion={isReducedMotion} />
      ),
    },
    {
      id: 3,
      number: 3,
      title: 'Dispatches emergency calls',
      description:
        'Identifies urgent situations instantly, pages on-call staff via SMS/call, and dispatches the closest truck without delay.',
      renderMiniUI: () => (
        <Card3MiniUI isInView={isInView} isReducedMotion={isReducedMotion} />
      ),
    },
    {
      id: 4,
      number: 4,
      title: 'Syncs with your CRM',
      description:
        'Creates or updates the customer profile, uploads the full call transcript and recording, and triggers your standard invoice or quote workflow.',
      renderMiniUI: () => (
        <Card4MiniUI isInView={isInView} isReducedMotion={isReducedMotion} />
      ),
    },
  ];

  return (
    <div ref={gridRef} className="mt-12 md:mt-16 w-full max-w-[1120px] mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {FEATURES.map((feature, idx) => (
          <motion.article
            key={feature.id}
            initial={isReducedMotion ? false : { opacity: 0, y: 28 }}
            animate={isInView || isReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
            transition={{
              duration: isReducedMotion ? 0.2 : 0.7,
              delay: isReducedMotion ? 0 : idx * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="group bg-[#FCFCFD] border border-[rgba(15,23,42,0.05)] rounded-[32px] relative overflow-visible shadow-[0_24px_60px_-34px_rgba(30,42,120,0.28)] transition-all duration-250 ease-out hover:-translate-y-1 hover:shadow-[0_28px_68px_-30px_rgba(30,42,120,0.36)] flex flex-col justify-between"
          >
            {/* Top Illustration Panel */}
            <div
              className="w-full h-[260px] md:h-[320px] rounded-[32px] overflow-hidden relative transition-transform duration-250 ease-out group-hover:-translate-y-1"
              style={{
                background:
                  'linear-gradient(180deg, #1b2a9e 0%, #2f49d8 38%, #6c8bff 72%, #b9c8ff 100%)',
              }}
            >
              {/* Soft light spot at top-left */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(60% 50% at 18% 0%, rgba(255,255,255,0.16), rgba(255,255,255,0) 70%)',
                }}
              />

              {/* Faint dot texture masked to fade out toward bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                  maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
                }}
              />

              {/* Interactive Illustration Area (aria-hidden) */}
              <div aria-hidden="true" className="absolute inset-0">
                {feature.renderMiniUI()}
              </div>
            </div>

            {/* Text Area (below panel) */}
            <div className="p-7 md:p-8 pt-7">
              {/* Row 1: Number Badge + Title */}
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="w-[28px] h-[28px] min-w-[28px] rounded-[9px] flex items-center justify-center text-white text-[13px] font-bold select-none shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #7ba0ff, #3b5bdb)',
                    boxShadow:
                      'inset 0 0 0 1px rgba(255,255,255,0.5), inset 0 1px 0 rgba(255,255,255,0.55), 0 2px 6px rgba(59,91,219,0.25)',
                  }}
                >
                  {feature.number}
                </div>

                <h3 className="font-display font-semibold text-[clamp(22px,2.2vw,28px)] tracking-[-0.02em] text-[#0b1530] leading-snug">
                  {feature.title}
                </h3>
              </div>

              {/* Row 2: Description */}
              <p className="mt-3 text-[15px] leading-[1.6] text-[#6b7280] max-w-[460px]">
                {feature.description}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
