import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronDown,
  Phone,
  PhoneOff,
  Clock,
  MessageSquare,
  Check,
  Mic,
  Grid,
  Volume2,
  Plus,
  Video,
  Users,
  Hash,
  User,
} from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { useDemoCall, formatTimer } from '../hooks/useDemoCall';
import { lines, jobDetails, phases, TRANSCRIPT_OFFSET } from '../config/demoTranscript';

const SIDEBAR_CHANNELS = [
  { name: 'incoming-calls', active: true },
  { name: 'booked-jobs', active: false },
  { name: 'emergency-dispatch', active: false },
  { name: 'after-hours', active: false },
  { name: 'follow-ups', active: false },
  { name: 'missed-recovered', active: false },
];

const SKELETON_ROWS = ['68%', '52%', '74%', '46%'];

const WAVE_BARS = [
  { delay: '0s', height: 20 },
  { delay: '0.15s', height: 28 },
  { delay: '0.3s', height: 16 },
  { delay: '0.1s', height: 32 },
  { delay: '0.25s', height: 24 },
  { delay: '0.4s', height: 28 },
  { delay: '0.2s', height: 18 },
];

export const HeroCallConsole: React.FC = () => {
  const consoleRef = useRef<HTMLDivElement>(null);

  const {
    transcriptListRef,
    acceptBtnRef,
    hangUpBtnRef,
    callState,
    callTime,
    finalDuration,
    isDeclined,
    acceptPulse,
    notAllowedHint,
    audioPlayFailed,
    audioStatus,
    reduceMotion,
    isScrolled,
    isDebugTime,
    visibleLines,
    isAnswered,
    isQualified,
    isBooked,
    showIssue,
    showCaller,
    showAddress,
    showAppointment,
    showBooked,
    hasVisibleJobDetails,
    latestVisibleLineIdx,
    handleAcceptCall,
    handleDecline,
    handleEndCall,
    handleRemindOrMessage,
    handleSeek,
    handleListScroll,
  } = useDemoCall({ containerRef: consoleRef });

  const phaseTiles = [
    {
      time: formatTimer(Math.floor(phases.answered)),
      timeSec: phases.answered + TRANSCRIPT_OFFSET,
      label: 'Answered',
      active: isAnswered,
    },
    {
      time: formatTimer(Math.floor(phases.qualified)),
      timeSec: phases.qualified + TRANSCRIPT_OFFSET,
      label: 'Qualified',
      active: isQualified,
    },
    {
      time: formatTimer(Math.floor(phases.booked)),
      timeSec: phases.booked + TRANSCRIPT_OFFSET,
      label: 'Booked',
      active: isBooked,
    },
  ];

  return (
    <div ref={consoleRef} className="w-full relative z-20">
      {/* Frosted glass outer frame (must stay free of opacity<1 / filter / mask on ancestors) */}
      <div
        className="w-full rounded-[26px] p-[8px] md:p-[10px] select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.42)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.72)',
          boxShadow:
            '0 36px 90px -28px rgba(4, 30, 100, 0.42), 0 8px 24px -12px rgba(4, 30, 100, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Crisp White Console Window */}
        <div className="w-full rounded-[18px] bg-white border border-[rgba(11,21,48,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-[248px_1fr] min-h-[460px]">
          {/* LEFT SIDEBAR (Desktop 1024px+ only) */}
          <aside
            className="hidden lg:flex flex-col bg-[#f8fafc] border-r border-[rgba(11,21,48,0.07)] p-4 text-left"
            aria-label="Console Queues"
          >
            {/* Workspace title */}
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-[6px] bg-[#0b1530] flex items-center justify-center shrink-0">
                  <AppsianMark size={11} fill="#ffffff" />
                </span>
                <span className="text-[13.5px] font-bold text-[#0b1530] tracking-[-0.015em] truncate">
                  Appsian Console
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748b] shrink-0" />
            </div>

            {/* Section 1: Call queues */}
            <div className="mt-5">
              <div className="px-2 mb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#64748b]">
                Call queues
              </div>
              <ul className="flex flex-col gap-0.5">
                {SIDEBAR_CHANNELS.map((channel) => (
                  <li key={channel.name}>
                    <div
                      className={`flex items-center gap-2 px-2.5 py-[6px] rounded-[8px] text-[13px] leading-tight ${
                        channel.active
                          ? 'text-[#1d4ed8] font-semibold'
                          : 'text-[#475569] font-medium'
                      }`}
                      style={
                        channel.active
                          ? {
                              background:
                                'linear-gradient(90deg, rgba(37,99,235,0.12), rgba(59,130,246,0.06))',
                            }
                          : undefined
                      }
                    >
                      <Hash
                        className={`w-3.5 h-3.5 shrink-0 ${
                          channel.active ? 'text-[#2563eb]' : 'text-[#94a3b8]'
                        }`}
                      />
                      <span className="truncate">{channel.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 2: Connected tools (decorative skeleton placeholders) */}
            <div className="mt-[14px] pt-3 border-t border-[rgba(11,21,48,0.06)]" aria-hidden="true">
              <div className="px-2 mb-2 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8]">
                Connected tools
              </div>
              <div className="flex flex-col gap-2.5 px-2">
                {SKELETON_ROWS.map((width, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-[5px] shrink-0"
                      style={{ background: 'rgba(11, 21, 48, 0.06)' }}
                    />
                    <span
                      className="h-[11px] rounded-[6px]"
                      style={{ width, background: 'rgba(11, 21, 48, 0.06)' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN AREA */}
          <div className="flex flex-col min-w-0 bg-white">
            {/* Window Top Header Bar */}
            <div className="min-h-[56px] md:h-[64px] px-4 md:px-5 py-2.5 md:py-0 border-b border-[rgba(11,21,48,0.07)] flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 shrink-0">
              {/* Channel Title */}
              <div className="flex items-center justify-between md:justify-start gap-2">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-[#64748b] stroke-[2.2]" />
                  <span className="text-[15.5px] font-bold text-[#0b1530] tracking-[-0.015em]">
                    incoming-calls
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#64748b]" />
                </div>

                {/* Status pill on mobile / desktop */}
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    callState === 'answered'
                      ? 'bg-[#eff6ff] text-[#1d4ed8]'
                      : 'bg-[#f1f5f9] text-[#64748b]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      callState === 'answered' ? 'bg-[#2563eb] animate-pulse' : 'bg-[#94a3b8]'
                    }`}
                  />
                  <span>
                    {callState === 'answered'
                      ? 'Live call'
                      : callState === 'ended'
                      ? 'Ended'
                      : 'Ready'}
                  </span>
                </span>
              </div>

              {/* 3-Phase Segmented Control */}
              <div
                className="p-[3px] rounded-[12px] grid grid-cols-3 md:inline-flex items-center gap-0.5 border border-[rgba(11,21,48,0.07)]"
                style={{ background: 'rgba(11, 21, 48, 0.04)' }}
                role="group"
                aria-label="Call progression phases"
              >
                {phaseTiles.map((tile) => (
                  <button
                    key={tile.label}
                    type="button"
                    onClick={() => handleSeek(tile.timeSec)}
                    disabled={callState !== 'answered'}
                    title={
                      callState === 'answered'
                        ? `Jump to ${tile.label} (${tile.time})`
                        : `${tile.label} at ${tile.time}`
                    }
                    className={`px-2 md:px-3 py-[5px] rounded-[9px] text-[11.5px] md:text-[12px] leading-none flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                      tile.active
                        ? 'bg-white text-[#0b1530] font-semibold shadow-[0_1px_4px_rgba(11,21,48,0.08)]'
                        : 'bg-transparent text-[#64748b] font-medium'
                    } ${
                      callState === 'answered'
                        ? 'cursor-pointer hover:text-[#0b1530]'
                        : 'cursor-default'
                    }`}
                  >
                    {tile.active && (
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${
                          tile.label === 'Booked'
                            ? 'bg-[#10b981] text-white'
                            : 'bg-[#2563eb] text-white'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <span className="tabular-nums opacity-75">{tile.time}</span>
                    <span>{tile.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Split: Left Call Controls Pane + Right Transcript Pane */}
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[320px_1fr] flex-1 min-h-0">
              {/* LEFT PANE: Call Controls */}
              <div className="bg-[#fafbff] border-b md:border-b-0 md:border-r border-[rgba(11,21,48,0.07)] px-4 py-4 md:p-6 flex flex-col justify-between items-center text-center">
                {/* Caller Info Header (compact horizontal row on mobile, centered stack on desktop) */}
                <div className="w-full flex md:flex-col items-center justify-between md:justify-center gap-3 md:gap-0">
                  <div className="flex md:flex-col items-center gap-3 md:gap-0 min-w-0">
                    <div
                      className="w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 md:mb-3"
                      style={{
                        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                        border: '1px solid #bfdbfe',
                        boxShadow: '0 6px 16px -6px rgba(37, 99, 235, 0.22)',
                      }}
                    >
                      <AppsianMark size={20} fill="#2563eb" />
                    </div>
                    <div className="text-left md:text-center min-w-0">
                      <h3 className="text-[15px] md:text-[17px] font-bold text-[#0b1530] leading-tight tracking-[-0.015em] truncate">
                        AI Sales Receptionist
                      </h3>
                      <p
                        className="text-[12.5px] md:text-[13px] font-medium text-[#64748b] tabular-nums mt-0.5 flex items-center md:justify-center gap-1.5"
                        aria-hidden="true"
                      >
                        {callState === 'answered' ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block" />
                            <span className="text-[#0b1530] font-semibold">
                              {formatTimer(callTime)}
                            </span>
                          </>
                        ) : callState === 'ended' ? (
                          <span>Call ended {formatTimer(finalDuration || callTime || 54)}</span>
                        ) : isDeclined ? (
                          <span className="text-[#EF4444] font-semibold">Call declined</span>
                        ) : (
                          <span>Incoming demo call</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Mobile quick action buttons inline on right when screen < 768px */}
                  <div className="flex md:hidden items-center gap-2.5 shrink-0">
                    {callState === 'answered' ? (
                      <button
                        type="button"
                        onClick={() => handleEndCall('hang-up')}
                        className="w-[44px] h-[44px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-transform"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Hang up call"
                      >
                        <PhoneOff className="w-5 h-5 stroke-[2.2]" />
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleDecline}
                          className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-transform"
                          style={{
                            background: 'linear-gradient(135deg, #ff5a52 0%, #ff3b30 100%)',
                            touchAction: 'manipulation',
                          }}
                          aria-label="Decline call"
                        >
                          <PhoneOff className="w-4 h-4 stroke-[2.2]" />
                        </button>
                        <button
                          type="button"
                          onClick={handleAcceptCall}
                          className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-transform relative"
                          style={{
                            background: 'linear-gradient(135deg, #46d36e 0%, #28b84f 100%)',
                            touchAction: 'manipulation',
                          }}
                          aria-label="Accept call"
                        >
                          <Phone className="w-4 h-4 stroke-[2.2]" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Audio permission / failure notice */}
                {(notAllowedHint || (audioPlayFailed && callState === 'answered')) && (
                  <div className="mt-2 w-full text-center">
                    {notAllowedHint && callState === 'ringing' && (
                      <span className="text-[11.5px] text-[#2563eb] font-medium block leading-tight">
                        Tap Accept again to enable sound
                      </span>
                    )}
                    {audioPlayFailed && callState === 'answered' && (
                      <span className="text-[11.5px] text-[#EF4444] block leading-tight">
                        {audioStatus === 'missing' || audioStatus === 'wrong-type'
                          ? 'Audio file not found — playing live transcript'
                          : 'Audio unavailable — playing live transcript'}
                      </span>
                    )}
                  </div>
                )}

                {/* DESKTOP MIDDLE CONTENT (hidden on compact mobile top bar) */}
                {callState === 'answered' ? (
                  <div className="hidden md:flex flex-col items-center gap-5 my-4 w-full">
                    {/* Subtle animated waveform bars */}
                    <div className="h-[34px] flex items-center justify-center gap-1.5" aria-hidden="true">
                      {WAVE_BARS.map((bar, idx) => (
                        <span
                          key={idx}
                          className="hero-wave-bar w-[4px] rounded-full bg-[#2563eb]"
                          style={{
                            height: `${bar.height}px`,
                            animationDelay: bar.delay,
                          }}
                        />
                      ))}
                    </div>

                    {/* Decorative 3x2 quick-action grid */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-full max-w-[228px] opacity-70 pointer-events-none select-none">
                      {[
                        { label: 'mute', icon: Mic },
                        { label: 'keypad', icon: Grid },
                        { label: 'audio', icon: Volume2 },
                        { label: 'add call', icon: Plus },
                        { label: 'video', icon: Video },
                        { label: 'contacts', icon: Users },
                      ].map((btn) => {
                        const Icon = btn.icon;
                        return (
                          <div key={btn.label} className="flex flex-col items-center gap-1">
                            <div className="w-[42px] h-[42px] rounded-full bg-white border border-[rgba(11,21,48,0.08)] flex items-center justify-center text-[#334155] shadow-2xs">
                              <Icon className="w-4 h-4 stroke-[1.8]" />
                            </div>
                            <span className="text-[10px] text-[#64748b] font-medium leading-none">
                              {btn.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center justify-center gap-8 my-6">
                    <button
                      type="button"
                      onClick={handleRemindOrMessage}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 rounded-lg p-1"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Remind Me"
                    >
                      <div className="w-[42px] h-[42px] rounded-full bg-white border border-[rgba(11,21,48,0.10)] flex items-center justify-center text-[#1e293b] shadow-2xs group-hover:border-[rgba(37,99,235,0.35)] transition-colors">
                        <Clock className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Remind Me
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRemindOrMessage}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 rounded-lg p-1"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Message"
                    >
                      <div className="w-[42px] h-[42px] rounded-full bg-white border border-[rgba(11,21,48,0.10)] flex items-center justify-center text-[#1e293b] shadow-2xs group-hover:border-[rgba(37,99,235,0.35)] transition-colors">
                        <MessageSquare className="w-4 h-4 stroke-[1.8]" />
                      </div>
                      <span className="text-[11px] text-[#475569] font-medium leading-none">
                        Message
                      </span>
                    </button>
                  </div>
                )}

                {/* DESKTOP BOTTOM CALL ACTION BUTTONS */}
                <div className="hidden md:flex w-full items-center justify-center shrink-0">
                  {callState === 'answered' ? (
                    <button
                      ref={hangUpBtnRef}
                      type="button"
                      onClick={() => handleEndCall('hang-up')}
                      className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 rounded-full"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="Hang up call"
                    >
                      <div
                        className="w-[56px] h-[56px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-md group-hover:brightness-105 transition-all"
                        style={{ boxShadow: '0 10px 22px -8px rgba(255, 75, 75, 0.55)' }}
                      >
                        <PhoneOff className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[11px] text-[#64748b] font-medium leading-none">
                        Hang up
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-9">
                      {/* Decline */}
                      <button
                        type="button"
                        onClick={handleDecline}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 rounded-full"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Decline call"
                      >
                        <div
                          className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-white shadow-md group-hover:brightness-105 transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #ff5a52 0%, #ff3b30 100%)',
                            boxShadow: '0 10px 22px -8px rgba(255, 59, 48, 0.5)',
                          }}
                        >
                          <PhoneOff className="w-6 h-6 stroke-[2.2]" />
                        </div>
                        <span className="text-[11px] text-[#475569] font-medium leading-none">
                          Decline
                        </span>
                      </button>

                      {/* Accept with pulse rings */}
                      <button
                        ref={acceptBtnRef}
                        type="button"
                        onClick={handleAcceptCall}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-2 rounded-full relative"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Accept call"
                      >
                        <motion.div
                          animate={acceptPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                          transition={{ duration: 0.45 }}
                          className="relative w-[58px] h-[58px]"
                        >
                          {!reduceMotion && (
                            <>
                              <span
                                className="ring-pulse-ring-1 absolute inset-0 rounded-full pointer-events-none"
                                style={{ border: '2px solid rgba(70, 211, 110, 0.75)' }}
                              />
                              <span
                                className="ring-pulse-ring-2 absolute inset-0 rounded-full pointer-events-none"
                                style={{ border: '2px solid rgba(70, 211, 110, 0.75)' }}
                              />
                            </>
                          )}
                          <div
                            className="w-full h-full rounded-full flex items-center justify-center text-white shadow-md group-hover:brightness-105 transition-all relative z-10"
                            style={{
                              background: 'linear-gradient(135deg, #46d36e 0%, #28b84f 100%)',
                              boxShadow: '0 10px 22px -8px rgba(40, 184, 79, 0.5)',
                            }}
                          >
                            <Phone className="w-6 h-6 stroke-[2.2]" />
                          </div>
                        </motion.div>
                        <span className="text-[11px] text-[#475569] font-medium leading-none">
                          Accept
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANE: Slack-Style Live Transcript + Job Details */}
              <div className="bg-white flex flex-col h-[320px] md:h-[430px] min-w-0 overflow-hidden">
                {/* Pane Sub-header */}
                <div className="px-4 md:px-5 py-3 border-b border-[rgba(11,21,48,0.06)] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[12.5px] font-semibold text-[#0b1530]">
                      Live transcript
                    </span>
                    <span className="text-[11.5px] text-[#64748b] truncate">
                      {callState === 'answered'
                        ? 'Live audio stream'
                        : 'Sample call · Tap Accept to listen'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {callState === 'answered' ? (
                      <span className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                    ) : (
                      <span className="text-[11px] font-medium text-[#64748b] tabular-nums">
                        00:54
                      </span>
                    )}
                  </div>
                </div>

                {/* Scrollable Messages Feed */}
                <div
                  ref={transcriptListRef}
                  onScroll={handleListScroll}
                  aria-live="polite"
                  className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-3.5 relative no-scrollbar select-text"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    maskImage: isScrolled
                      ? 'linear-gradient(to bottom, transparent 0, #000 22px)'
                      : 'none',
                    WebkitMaskImage: isScrolled
                      ? 'linear-gradient(to bottom, transparent 0, #000 22px)'
                      : 'none',
                  }}
                >
                  {callState !== 'answered' ? (
                    <div className="flex flex-col gap-4 text-left">
                      {/* Idle Slack-style row */}
                      <div className="flex items-start gap-3">
                        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0">
                          <AppsianMark size={16} fill="#2563eb" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-[13.5px] font-bold text-[#0b1530]">
                              Allison · AI Receptionist
                            </span>
                            <span className="text-[11px] font-medium text-[#94a3b8] tabular-nums">
                              00:00
                            </span>
                          </div>
                          <p className="mt-1 text-[13.5px] leading-[1.5] text-[#475569]">
                            {callState === 'ended'
                              ? 'Call completed and booked to the calendar. Tap Accept to replay the live call.'
                              : 'Ready to answer an incoming plumbing call. Tap Accept to hear the audio and follow the live transcript.'}
                          </p>
                        </div>
                      </div>

                      {/* Subtle preview call info box */}
                      <div className="ml-[46px] rounded-[12px] border border-[rgba(11,21,48,0.08)] bg-[#f8fafc] p-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[12px] font-semibold text-[#0b1530] truncate">
                            New York Plumbing · Sample Inbound Call
                          </div>
                          <div className="text-[11.5px] text-[#64748b] mt-0.5">
                            Answers, qualifies issue &amp; address, books tomorrow 10:00 AM
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleAcceptCall}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-[#2563eb] text-white text-[12px] font-semibold cursor-pointer hover:bg-[#1d4ed8] transition-colors shadow-2xs"
                        >
                          Listen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {visibleLines.map((line, idx) => {
                        const isAi = line.speaker === 'ai';
                        const lineTimeLabel = formatTimer(line.start);
                        return (
                          <motion.div
                            key={idx}
                            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="flex items-start gap-3 text-left"
                          >
                            {/* Avatar */}
                            {isAi ? (
                              <div className="w-[34px] h-[34px] rounded-[10px] bg-[#eff6ff] border border-[#bfdbfe] flex items-center justify-center shrink-0 mt-0.5">
                                <AppsianMark size={16} fill="#2563eb" />
                              </div>
                            ) : (
                              <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f1f5f9] border border-[rgba(11,21,48,0.08)] flex items-center justify-center text-[#334155] shrink-0 mt-0.5">
                                <User className="w-4 h-4 stroke-[2]" />
                              </div>
                            )}

                            {/* Speaker + Timestamp + Word-by-word body */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2">
                                <span className="text-[13.5px] font-bold text-[#0b1530]">
                                  {isAi
                                    ? 'Allison · AI Receptionist'
                                    : showCaller
                                    ? 'Zach Phillips'
                                    : 'Incoming Caller'}
                                </span>
                                <span className="text-[11px] font-medium text-[#94a3b8] tabular-nums">
                                  {lineTimeLabel}
                                </span>
                              </div>

                              <p className="mt-0.5 text-[14px] leading-[1.5]">
                                <span className="sr-only">{line.text}</span>
                                <span aria-hidden="true">
                                  {line.words && line.words.length > 0 ? (
                                    line.words.map(([word, wStart], wIdx) => {
                                      const isLit =
                                        callTime >= wStart + TRANSCRIPT_OFFSET || reduceMotion;
                                      return (
                                        <React.Fragment key={wIdx}>
                                          {wIdx > 0 && ' '}
                                          <span
                                            className="transition-colors duration-[120ms] inline"
                                            style={{ color: isLit ? '#0b1530' : '#94a3b8' }}
                                          >
                                            {word}
                                          </span>
                                        </React.Fragment>
                                      );
                                    })
                                  ) : (
                                    (() => {
                                      const wordsArr = line.text.split(' ');
                                      const totalChars = Math.max(1, line.text.length);
                                      let runningChars = 0;
                                      return wordsArr.map((word, wIdx) => {
                                        const wordCharStart = runningChars;
                                        runningChars += word.length + 1;
                                        const wordStartTime =
                                          line.start +
                                          (wordCharStart / totalChars) * (line.end - line.start);
                                        const isLit =
                                          callTime >= wordStartTime + TRANSCRIPT_OFFSET ||
                                          reduceMotion;
                                        return (
                                          <React.Fragment key={wIdx}>
                                            {wIdx > 0 && ' '}
                                            <span
                                              className="transition-colors duration-[120ms] inline"
                                              style={{ color: isLit ? '#0b1530' : '#94a3b8' }}
                                            >
                                              {word}
                                            </span>
                                          </React.Fragment>
                                        );
                                      });
                                    })()
                                  )}
                                </span>
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}

                      {/* Job Details Attachment Card */}
                      <AnimatePresence>
                        {hasVisibleJobDetails && (
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="ml-[46px] mt-1 p-3.5 rounded-[14px] bg-[#f8faff] border border-[rgba(37,99,235,0.24)] shadow-2xs flex flex-col gap-2 text-left shrink-0"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(11,21,48,0.06)]">
                              <span className="text-[12px] font-bold text-[#0b1530]">
                                Job details
                              </span>
                              {showBooked ? (
                                <motion.span
                                  initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#10B981]/15 text-[#059669]"
                                >
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  <span>{jobDetails.booked?.value || 'Booked'}</span>
                                </motion.span>
                              ) : (
                                <span className="text-[10.5px] font-medium text-[#2563eb]">
                                  Qualifying...
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                              {showIssue && (
                                <motion.div
                                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex flex-col text-[11.5px]"
                                >
                                  <span className="text-[#64748b] text-[10.5px]">Issue</span>
                                  <span className="font-semibold text-[#0b1530] truncate">
                                    {jobDetails.issue?.value}
                                  </span>
                                </motion.div>
                              )}
                              {showCaller && (
                                <motion.div
                                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex flex-col text-[11.5px]"
                                >
                                  <span className="text-[#64748b] text-[10.5px]">Caller</span>
                                  <span className="font-semibold text-[#0b1530] truncate">
                                    {jobDetails.callerName?.value}
                                  </span>
                                </motion.div>
                              )}
                              {showAddress && (
                                <motion.div
                                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex flex-col text-[11.5px]"
                                >
                                  <span className="text-[#64748b] text-[10.5px]">Address</span>
                                  <span className="font-semibold text-[#0b1530] truncate">
                                    {jobDetails.address?.value}
                                  </span>
                                </motion.div>
                              )}
                              {showAppointment && (
                                <motion.div
                                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="flex flex-col text-[11.5px]"
                                >
                                  <span className="text-[#64748b] text-[10.5px]">Appointment</span>
                                  <span className="font-semibold text-[#0b1530] truncate">
                                    {jobDetails.appointment?.value}
                                  </span>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Development Tuning Aid: Fixed HUD at bottom-left corner of viewport (?debugtime=1) */}
      {isDebugTime && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            zIndex: 999999,
          }}
          className="bg-black/90 text-white font-mono text-[11px] px-3 py-2 rounded-lg pointer-events-none shadow-2xl border border-white/20 tabular-nums flex flex-col gap-0.5 select-none"
        >
          <div className="font-bold text-emerald-400">DEBUG TIME HUD</div>
          <div>Audio currentTime: {callTime.toFixed(1)}s</div>
          <div>
            Latest line:{' '}
            {latestVisibleLineIdx >= 0
              ? `#${latestVisibleLineIdx} [${lines[latestVisibleLineIdx].speaker}] start=${lines[latestVisibleLineIdx].start.toFixed(2)}s`
              : 'None'}
          </div>
          <div>
            TRANSCRIPT_OFFSET: {TRANSCRIPT_OFFSET >= 0 ? `+${TRANSCRIPT_OFFSET}` : TRANSCRIPT_OFFSET}s
          </div>
        </div>
      )}
    </div>
  );
};
