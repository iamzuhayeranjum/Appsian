import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronDown,
  Phone,
  PhoneOff,
  Clock,
  MessageSquare,
  Check,
  Mic,
  Grid3x3,
  Volume2,
  User,
  Play,
  AudioLines,
  ArrowDown,
  Wrench,
  MapPin,
  CalendarClock,
} from 'lucide-react';
import { AppsianMark } from './AppsianLogo';
import { useDemoCall } from '../hooks/useDemoCall';
import { lines, jobDetails, phases, TRANSCRIPT_OFFSET } from '../config/demoTranscript';

const WAVE_BARS = [
  { delay: '0s', height: 18 },
  { delay: '0.14s', height: 26 },
  { delay: '0.28s', height: 14 },
  { delay: '0.08s', height: 30 },
  { delay: '0.22s', height: 22 },
  { delay: '0.36s', height: 26 },
  { delay: '0.18s', height: 16 },
];

const formatCompactTime = (totalSec: number) => {
  const safe = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};

interface JobDetailsPanelProps {
  layout: 'sidebar' | 'compact';
  callState: 'ringing' | 'answered' | 'ended';
  revealedDetailsCount: number;
  showIssue: boolean;
  showCaller: boolean;
  showAddress: boolean;
  showAppointment: boolean;
  showBooked: boolean;
}

const JobDetailsPanel: React.FC<JobDetailsPanelProps> = ({
  layout,
  callState,
  revealedDetailsCount,
  showIssue,
  showCaller,
  showAddress,
  showAppointment,
  showBooked,
}) => {
  const detailRows = [
    {
      key: 'issue',
      label: 'ISSUE',
      value: jobDetails.issue?.value || '',
      revealed: showIssue,
      icon: Wrench,
    },
    {
      key: 'caller',
      label: 'CALLER',
      value: jobDetails.callerName?.value || '',
      revealed: showCaller,
      icon: User,
    },
    {
      key: 'address',
      label: 'ADDRESS',
      value: jobDetails.address?.value || '',
      revealed: showAddress,
      icon: MapPin,
    },
    {
      key: 'appointment',
      label: 'APPOINTMENT',
      value: jobDetails.appointment?.value || '',
      revealed: showAppointment,
      icon: CalendarClock,
    },
  ];

  const isSidebar = layout === 'sidebar';

  return (
    <div
      className={
        isSidebar
          ? 'flex flex-col h-full bg-[#fafbff] border-l border-[#eceff5] text-left'
          : 'flex flex-col bg-[#fafbff] border border-[#e3e9f6] rounded-[18px] px-[20px] py-[18px] text-left'
      }
      style={isSidebar ? { padding: 'var(--cw-details-pad)' } : undefined}
      aria-label="Job details"
    >
      {/* Top Header + Pill */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[15px] font-bold text-[#0b1530] tracking-[-0.01em]">
          Job details
        </span>
        <span className="bg-[#e8f0ff] text-[#1d4ed8] text-[11.5px] font-semibold rounded-[8px] px-[9px] py-[4px] whitespace-nowrap leading-none">
          Captured automatically
        </span>
      </div>

      {/* Counter & Progress Bar */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-[12.5px] text-[#64748b] tabular-nums mb-1.5">
          <span>{revealedDetailsCount} of 4 captured</span>
          {!isSidebar && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold ${
                showBooked
                  ? 'bg-[#dcfce7] text-[#15803d]'
                  : 'bg-[#f1f5f9] text-[#64748b]'
              }`}
            >
              {showBooked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{showBooked ? 'Booked' : 'Waiting'}</span>
            </span>
          )}
        </div>
        <div className="w-full h-[5px] rounded-full bg-[#e8ecf7] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#2563eb] transition-[width] duration-300 ease-out"
            style={{ width: `${(revealedDetailsCount / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* 4 Detail Rows */}
      <div
        className={
          isSidebar
            ? 'mt-[12px] flex flex-col gap-[12px]'
            : 'mt-[12px] grid grid-cols-1 sm:grid-cols-2 gap-[12px]'
        }
      >
        {detailRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.key}
              className="rounded-[14px] px-[var(--cw-pad-sm)] py-[14px] border border-[#eef1f7] bg-white flex items-center gap-3 min-w-0"
            >
              {row.revealed ? (
                <div className="job-detail-reveal flex items-center gap-3 w-full min-w-0">
                  <span className="w-[38px] h-[38px] rounded-[11px] bg-[#eef4ff] text-[#2563eb] flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] stroke-[2]" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-semibold uppercase tracking-[0.06em] text-[#94a3b8] leading-none">
                      {row.label}
                    </div>
                    <div
                      className="text-[15px] font-semibold text-[#0b1530] leading-[1.3] mt-0.5 break-words line-clamp-2"
                      title={row.value}
                    >
                      {row.value}
                    </div>
                  </div>
                  <span
                    className="w-[18px] h-[18px] rounded-full bg-[#dcfce7] text-[#15803d] flex items-center justify-center shrink-0"
                    aria-hidden="true"
                  >
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3 w-full min-w-0" aria-label={`${row.label} pending`}>
                  <span className="w-[38px] h-[38px] rounded-[11px] bg-[#f1f5f9] text-[#94a3b8] flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] stroke-[1.9]" />
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className="sr-only">{row.label}</span>
                    <div className="h-[13px] w-[70%] rounded-[6px] job-skeleton-bar" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Status Row (Sidebar) + Idle Caption */}
      {isSidebar && (
        <div className="mt-[16px] pt-3.5 border-t border-[#eceff5]">
          <div className="flex items-center justify-between">
            <span className="text-[12.5px] font-semibold text-[#64748b]">Status</span>
            {showBooked ? (
              <span className="job-detail-reveal inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[#dcfce7] text-[#15803d]">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Booked</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-[8px] text-[12px] font-semibold bg-[#f1f5f9] text-[#64748b]">
                Waiting
              </span>
            )}
          </div>
          {callState === 'ringing' && (
            <p className="text-[12px] text-[#94a3b8] mt-2.5 text-center">
              Details appear as the caller speaks
            </p>
          )}
        </div>
      )}

      {!isSidebar && callState === 'ringing' && (
        <p className="text-[12px] text-[#94a3b8] mt-2.5 text-center">
          Details appear as the caller speaks
        </p>
      )}
    </div>
  );
};

export const HeroCallConsole: React.FC = () => {
  const consoleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingTimeline, setIsDraggingTimeline] = useState(false);

  const {
    transcriptListRef,
    acceptBtnRef,
    hangUpBtnRef,
    callState,
    callTime,
    duration,
    finalDuration,
    isDeclined,
    acceptPulse,
    notAllowedHint,
    audioPlayFailed,
    audioStatus,
    reduceMotion,
    isScrolled,
    isUserScrolledUp,
    isDebugTime,
    visibleLines,
    activeLineIndex,
    upcomingLineIndex,
    timeUntilNextLine,
    isAnswered,
    isQualified,
    isBooked,
    showIssue,
    showCaller,
    showAddress,
    showAppointment,
    showBooked,
    revealedDetailsCount,
    latestVisibleLineIdx,
    handleAcceptCall,
    handleDecline,
    handleEndCall,
    handleRemindOrMessage,
    handleSeek,
    handleListScroll,
    jumpToLive,
  } = useDemoCall({ containerRef: consoleRef });

  const safeDuration = Math.max(1, duration || 53.9);
  const progressPct =
    callState === 'answered'
      ? Math.min(100, Math.max(0, (callTime / safeDuration) * 100))
      : 0;

  const phaseTiles = [
    {
      time: formatCompactTime(phases.answered),
      timeSec: phases.answered + TRANSCRIPT_OFFSET,
      label: 'Answered',
      active: isAnswered,
      markerPct: Math.min(98.2, Math.max(2, ((phases.answered + TRANSCRIPT_OFFSET) / safeDuration) * 100)),
      alignRight: false,
    },
    {
      time: formatCompactTime(phases.qualified),
      timeSec: phases.qualified + TRANSCRIPT_OFFSET,
      label: 'Qualified',
      active: isQualified,
      markerPct: Math.min(98.2, Math.max(2, ((phases.qualified + TRANSCRIPT_OFFSET) / safeDuration) * 100)),
      alignRight: false,
    },
    {
      time: formatCompactTime(phases.booked),
      timeSec: phases.booked + TRANSCRIPT_OFFSET,
      label: 'Booked',
      active: isBooked,
      markerPct: Math.min(98.2, Math.max(2, ((phases.booked + TRANSCRIPT_OFFSET) / safeDuration) * 100)),
      alignRight: true,
    },
  ];

  const seekFromClientX = (clientX: number) => {
    const track = timelineRef.current;
    if (!track || callState !== 'answered') return;
    const rect = track.getBoundingClientRect();
    if (rect.width <= 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    handleSeek(ratio * safeDuration);
  };

  const handleTimelinePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (callState !== 'answered') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingTimeline(true);
    seekFromClientX(e.clientX);
  };

  const handleTimelinePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTimeline || callState !== 'answered') return;
    seekFromClientX(e.clientX);
  };

  const handleTimelinePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTimeline) return;
    setIsDraggingTimeline(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleTimelineKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (callState !== 'answered') return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleSeek(callTime + 5);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleSeek(callTime - 5);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleSeek(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleSeek(safeDuration);
    }
  };

  const showTypingCue =
    callState === 'answered' &&
    activeLineIndex === -1 &&
    upcomingLineIndex >= 0 &&
    timeUntilNextLine > 0 &&
    timeUntilNextLine <= 0.8 &&
    !reduceMotion;

  const typingSpeakerIsAi =
    upcomingLineIndex >= 0 ? lines[upcomingLineIndex].speaker === 'ai' : true;

  return (
    <div ref={consoleRef} className="cw-root w-full relative z-20">
      {/* Frosted glass outer frame (must stay free of opacity<1 / filter / mask on ancestors) */}
      <div
        className="w-full rounded-[var(--cw-frame-radius)] p-[var(--cw-frame-pad)] select-none"
        style={{
          background: 'rgba(255, 255, 255, 0.42)',
          backdropFilter: 'blur(22px) saturate(160%)',
          WebkitBackdropFilter: 'blur(22px) saturate(160%)',
          border: '1px solid rgba(255, 255, 255, 0.72)',
          boxShadow:
            '0 36px 90px -28px rgba(4, 30, 100, 0.42), 0 8px 24px -12px rgba(4, 30, 100, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        }}
      >
        {/* Main White Call Window (Sidebar-free) */}
        <div
          className="w-full rounded-[var(--cw-radius)] border border-[rgba(11,21,48,0.08)] overflow-hidden flex flex-col"
          style={{
            backgroundColor: '#ffffff',
            backgroundImage:
              'radial-gradient(60% 40% at 0% 0%, rgba(59,130,246,0.05), rgba(59,130,246,0) 70%)',
          }}
        >
          {/* 1. HEADER */}
          <div className="min-h-[var(--cw-header-h)] py-3 md:py-0 md:h-[var(--cw-header-h)] px-[var(--cw-header-px)] border-b border-[#eceff5] flex flex-col md:flex-row md:items-center md:justify-between gap-3 shrink-0">
            {/* Left: Blue gradient logo tile + 2-line title */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(145deg, #7aa9ff, #1d4ed8)',
                  border: '1px solid rgba(255, 255, 255, 0.45)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 6px 14px -6px rgba(29, 78, 216, 0.4)',
                }}
              >
                <AppsianMark size={20} fill="#ffffff" />
              </div>

              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[17px] font-bold text-[#0b1530] tracking-[-0.01em] leading-tight">
                    Incoming call
                  </span>
                  <span
                    className={`h-[24px] px-[10px] rounded-[8px] text-[12px] font-semibold inline-flex items-center gap-1.5 leading-none ${
                      callState === 'answered'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : callState === 'ended'
                        ? 'bg-[#f1f5f9] text-[#64748b]'
                        : 'bg-[#fef3c7] text-[#b45309]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        callState === 'answered'
                          ? `bg-[#22c55e] ${!reduceMotion ? 'animate-pulse' : ''}`
                          : callState === 'ended'
                          ? 'bg-[#94a3b8]'
                          : `bg-[#f59e0b] ${!reduceMotion ? 'animate-pulse' : ''}`
                      }`}
                    />
                    <span>
                      {callState === 'answered'
                        ? 'Live'
                        : callState === 'ended'
                        ? 'Ended'
                        : 'Ringing'}
                    </span>
                  </span>
                </div>
                <p className="text-[13px] text-[#64748b] leading-tight mt-0.5 truncate">
                  New York Plumbing · Sample inbound call
                </p>
              </div>
            </div>

            {/* Right: 3-Segment Phase Control */}
            <div
              className="bg-[#f3f5fa] rounded-[14px] p-[5px] grid grid-cols-3 md:inline-flex items-center gap-[6px] shrink-0"
              role="group"
              aria-label="Call progression phases"
            >
              {phaseTiles.map((tile) => {
                const isInteractive = callState === 'answered';
                return (
                  <button
                    key={tile.label}
                    type="button"
                    onClick={() => handleSeek(tile.timeSec)}
                    disabled={!isInteractive}
                    title={
                      isInteractive
                        ? `Jump to ${tile.label} (${tile.time})`
                        : `${tile.label} at ${tile.time}`
                    }
                    className={`h-[48px] md:h-[38px] px-2 md:px-[16px] rounded-[10px] text-[12px] md:text-[13.5px] font-semibold leading-none inline-flex items-center justify-center gap-1.5 transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px] ${
                      callState === 'ringing'
                        ? 'text-[#64748b] opacity-60 cursor-default'
                        : tile.active
                        ? 'bg-white text-[#0b1530] shadow-[0_2px_8px_rgba(30,60,160,0.12)] cursor-pointer'
                        : isInteractive
                        ? 'text-[#64748b] hover:text-[#0b1530] cursor-pointer'
                        : 'text-[#64748b] cursor-default'
                    }`}
                  >
                    {tile.active && (
                      <span
                        className="w-3.5 h-3.5 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0"
                        aria-hidden="true"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <span className="tabular-nums text-[#94a3b8] font-medium">{tile.time}</span>
                    <span>{tile.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. FULL-WIDTH PROGRESS TIMELINE */}
          <div
            ref={timelineRef}
            role="slider"
            tabIndex={callState === 'answered' ? 0 : -1}
            aria-label="Call progress"
            aria-valuemin={0}
            aria-valuemax={Math.round(safeDuration)}
            aria-valuenow={Math.round(callTime)}
            aria-valuetext={`${formatCompactTime(callTime)} of ${formatCompactTime(safeDuration)}`}
            aria-disabled={callState !== 'answered'}
            onPointerDown={handleTimelinePointerDown}
            onPointerMove={handleTimelinePointerMove}
            onPointerUp={handleTimelinePointerUp}
            onPointerCancel={handleTimelinePointerUp}
            onKeyDown={handleTimelineKeyDown}
            className={`relative w-full h-[var(--cw-timeline-h)] bg-[#eef1f7] transition-[height] duration-150 shrink-0 touch-none select-none focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[-2px] ${
              callState === 'answered'
                ? `cursor-pointer hover:h-[var(--cw-timeline-hover-h)] focus-visible:h-[var(--cw-timeline-hover-h)] ${
                    isDraggingTimeline ? 'h-[var(--cw-timeline-hover-h)]' : ''
                  }`
                : 'cursor-default'
            }`}
          >
            {/* Active Progress Fill (zero CSS transition on width so it stays frame-exact) */}
            <div
              className="h-full pointer-events-none"
              style={{
                width: `${progressPct}%`,
                background: 'linear-gradient(90deg, #3b82f6, #6aa8ff)',
              }}
            />

            {/* Three Phase Markers */}
            {phaseTiles.map((tile) => (
              <div
                key={tile.label}
                style={{ left: `${tile.markerPct}%` }}
                className="group/marker absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 pointer-events-auto"
              >
                <span
                  className={`w-[12px] h-[12px] rounded-full flex items-center justify-center transition-colors ${
                    tile.active
                      ? 'bg-[#2563eb] border-2 border-[#2563eb] text-white'
                      : 'bg-white border-2 border-[#3b82f6]'
                  }`}
                >
                  {tile.active && <Check className="w-[8px] h-[8px] stroke-[3.5]" />}
                </span>

                <span
                  className={`pointer-events-none absolute bottom-full mb-2 px-2 py-0.5 rounded-[7px] bg-white border border-[#e2e8f0] text-[#0b1530] text-[11px] font-semibold whitespace-nowrap shadow-[0_6px_16px_rgba(11,21,48,0.12)] opacity-0 group-hover/marker:opacity-100 transition-opacity duration-150 ${
                    tile.alignRight ? 'right-0 translate-x-1' : 'left-1/2 -translate-x-1/2'
                  }`}
                >
                  {tile.label} {tile.time}
                </span>
              </div>
            ))}
          </div>

          {/* 3. BODY COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-[304px_minmax(0,1fr)] xl:grid-cols-[304px_minmax(0,1fr)_288px] lg:min-h-[var(--cw-height)] xl:h-[var(--cw-height)] min-h-0">
            {/* COLUMN 1: CALL PANE */}
            <div
              className="border-b lg:border-b-0 lg:border-r border-[#eceff5] flex flex-col items-center text-center min-h-0"
              style={{
                padding: 'var(--cw-pad)',
                background: 'linear-gradient(180deg, #f8faff 0%, #eef3ff 100%)',
              }}
            >
              {/* MOBILE COMPACT ROW (< 768px) */}
              <div className="w-full flex md:hidden items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shrink-0">
                    {callState === 'ringing' && !reduceMotion && (
                      <>
                        <span className="avatar-ripple-1 absolute inset-0 rounded-full border border-[#3b82f6]/50 pointer-events-none" />
                        <span className="avatar-ripple-2 absolute inset-0 rounded-full border border-[#3b82f6]/50 pointer-events-none" />
                      </>
                    )}
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center relative z-10"
                      style={{
                        background: 'linear-gradient(145deg, #7aa9ff, #1d4ed8)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow:
                          '0 14px 28px -12px rgba(29, 78, 216, 0.55), inset 0 2px 0 rgba(255, 255, 255, 0.45)',
                      }}
                    >
                      <AppsianMark size={22} fill="#ffffff" />
                    </div>
                  </div>

                  <div className="text-left min-w-0 pr-1">
                    <h3 className="text-[14px] sm:text-[16px] font-bold text-[#0b1530] leading-tight tracking-[-0.015em] truncate">
                      AI Sales Receptionist
                    </h3>
                    <div className="mt-0.5 text-[12px] sm:text-[12.5px] font-medium text-[#64748b] tabular-nums flex items-center gap-1.5 whitespace-nowrap">
                      {callState === 'answered' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                          <span className="text-[#0b1530] font-semibold">
                            {formatCompactTime(callTime)}
                          </span>
                          <span className="text-[#15803d]">Connected</span>
                        </>
                      ) : callState === 'ended' ? (
                        <span>Call ended {formatCompactTime(finalDuration || callTime || 54)}</span>
                      ) : isDeclined ? (
                        <span className="text-[#EF4444] font-semibold">Call declined</span>
                      ) : (
                        <span>Incoming demo call</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile quick actions >= 48px touch targets */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {callState === 'answered' ? (
                    <button
                      type="button"
                      onClick={() => handleEndCall('hang-up')}
                      className="w-12 h-12 rounded-full bg-[#FF4B4B] flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px]"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="End call"
                    >
                      <PhoneOff className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleDecline}
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] ${
                          callState === 'ended' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
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
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] ${
                          callState === 'ended' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                        }`}
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

              {/* DESKTOP/TABLET CALL LAYOUT (md: 768px+) */}
              <div className="hidden md:flex flex-col items-center w-full h-full">
                {/* 104px Avatar + Concentric Rings while Ringing */}
                <div className="relative w-[104px] h-[104px] flex items-center justify-center shrink-0">
                  {callState === 'ringing' && !reduceMotion && (
                    <>
                      <span className="avatar-ripple-1 absolute inset-0 rounded-full border border-[#3b82f6]/55 pointer-events-none" />
                      <span className="avatar-ripple-2 absolute inset-0 rounded-full border border-[#3b82f6]/55 pointer-events-none" />
                      <span className="avatar-ripple-3 absolute inset-0 rounded-full border border-[#3b82f6]/55 pointer-events-none" />
                    </>
                  )}
                  <div
                    className="w-[104px] h-[104px] rounded-full flex items-center justify-center relative z-10"
                    style={{
                      background: 'linear-gradient(145deg, #7aa9ff, #1d4ed8)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      boxShadow:
                        '0 22px 40px -18px rgba(29, 78, 216, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.45)',
                    }}
                  >
                    <AppsianMark size={46} fill="#ffffff" />
                  </div>
                </div>

                {/* Caller Title */}
                <h3 className="mt-[20px] text-[19px] font-bold text-[#0b1530] leading-tight tracking-[-0.015em]">
                  AI Sales Receptionist
                </h3>

                {/* Sub-status / Live Timer + Waveform */}
                {callState === 'answered' ? (
                  <div className="flex flex-col items-center mt-[6px]">
                    {/* 7-bar Indigo Waveform */}
                    <div className="h-[30px] flex items-center justify-center gap-1" aria-hidden="true">
                      {WAVE_BARS.map((bar, idx) => (
                        <span
                          key={idx}
                          className="hero-wave-bar w-[3px] rounded-full bg-[#4f6bf0]"
                          style={{
                            height: `${bar.height}px`,
                            animationDelay: bar.delay,
                          }}
                        />
                      ))}
                    </div>

                    <div className="mt-1.5 text-[30px] font-semibold text-[#0b1530] tabular-nums leading-none">
                      {formatCompactTime(callTime)}
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#15803d]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                      <span>Connected</span>
                    </div>
                  </div>
                ) : callState === 'ended' ? (
                  <p className="mt-[6px] text-[13.5px] font-medium text-[#64748b] tabular-nums">
                    Call ended · {formatCompactTime(finalDuration || callTime || 54)}
                  </p>
                ) : isDeclined ? (
                  <p className="mt-[6px] text-[13.5px] font-semibold text-[#EF4444]">
                    Call declined
                  </p>
                ) : (
                  <p className="mt-[6px] text-[13.5px] font-medium text-[#64748b]">
                    Incoming demo call
                  </p>
                )}

                {/* Audio permission / failure notice */}
                {(notAllowedHint || (audioPlayFailed && callState === 'answered')) && (
                  <div className="mt-2 w-full text-center">
                    {notAllowedHint && callState === 'ringing' && (
                      <span className="text-[12px] text-[#2563eb] font-medium block leading-tight">
                        Tap Accept again to enable sound
                      </span>
                    )}
                    {audioPlayFailed && callState === 'answered' && (
                      <span className="text-[12px] text-[#EF4444] block leading-tight">
                        {audioStatus === 'missing' || audioStatus === 'wrong-type'
                          ? 'Audio file not found — playing live transcript'
                          : 'Audio unavailable — playing live transcript'}
                      </span>
                    )}
                  </div>
                )}

                {/* RINGING Hint Chip & Ghost Buttons */}
                {callState === 'ringing' && (
                  <>
                    <div className="console-compact-hide mt-[18px] inline-flex items-center gap-1.5 bg-[#e8f0ff] text-[#1d4ed8] text-[12.5px] font-semibold rounded-[10px] px-[13px] py-[6px]">
                      <span>Tap Accept to hear a real call</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 shrink-0 ${
                          !reduceMotion ? 'hint-chevron-nudge' : ''
                        }`}
                      />
                    </div>

                    <div className="console-compact-hide mt-[26px] flex items-center justify-center gap-[var(--cw-gap)]">
                      <button
                        type="button"
                        onClick={handleRemindOrMessage}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-[0.96] transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-[13px] px-1"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Remind Me"
                      >
                        <div className="w-12 h-12 rounded-[13px] bg-white border border-[#e2e8f0] flex items-center justify-center text-[#334155] group-hover:border-[#cbd5e1] transition-colors">
                          <Clock className="w-[19px] h-[19px] stroke-[1.9]" />
                        </div>
                        <span className="text-[12.5px] text-[#475569] font-medium leading-none">
                          Remind Me
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemindOrMessage}
                        className="flex flex-col items-center gap-1.5 cursor-pointer group select-none active:scale-[0.96] transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-[13px] px-1"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Message"
                      >
                        <div className="w-12 h-12 rounded-[13px] bg-white border border-[#e2e8f0] flex items-center justify-center text-[#334155] group-hover:border-[#cbd5e1] transition-colors">
                          <MessageSquare className="w-[19px] h-[19px] stroke-[1.9]" />
                        </div>
                        <span className="text-[12.5px] text-[#475569] font-medium leading-none">
                          Message
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {/* LIVE: 3 Small Decorative Ghost Controls */}
                {callState === 'answered' && (
                  <div
                    className="console-compact-hide mt-[18px] flex items-center justify-center gap-[14px] opacity-80 pointer-events-none"
                    aria-hidden="true"
                  >
                    {[Mic, Grid3x3, Volume2].map((Icon, idx) => (
                      <div
                        key={idx}
                        className="w-11 h-11 rounded-[13px] bg-white border border-[#e2e8f0] flex items-center justify-center text-[#475569]"
                      >
                        <Icon className="w-[18px] h-[18px] stroke-[1.9]" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Main Action Buttons */}
                <div
                  className={`mt-auto pt-4 w-full flex items-center justify-center shrink-0 transition-opacity duration-300 ${
                    callState === 'ended' ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {callState === 'answered' ? (
                    <button
                      ref={hangUpBtnRef}
                      type="button"
                      onClick={() => handleEndCall('hang-up')}
                      className="flex flex-col items-center gap-[10px] cursor-pointer group select-none active:scale-[0.96] transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-full"
                      style={{ touchAction: 'manipulation' }}
                      aria-label="End call"
                    >
                      <div
                        className="w-[72px] h-[72px] rounded-full bg-[#FF4B4B] flex items-center justify-center text-white group-hover:brightness-105 transition-all"
                        style={{ boxShadow: '0 14px 30px -10px rgba(255, 75, 75, 0.55)' }}
                      >
                        <PhoneOff className="w-[26px] h-[26px] stroke-[2.2]" />
                      </div>
                      <span className="text-[12.5px] text-[#475569] font-medium leading-none">
                        End call
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-[28px]">
                      <button
                        type="button"
                        onClick={handleDecline}
                        className="flex flex-col items-center gap-[10px] cursor-pointer group select-none active:scale-[0.96] transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-full"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Decline call"
                      >
                        <div
                          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white group-hover:brightness-105 transition-all"
                          style={{
                            background: 'linear-gradient(135deg, #ff5a52 0%, #ff3b30 100%)',
                            boxShadow: '0 14px 30px -10px rgba(255, 59, 48, 0.5)',
                          }}
                        >
                          <PhoneOff className="w-[26px] h-[26px] stroke-[2.2]" />
                        </div>
                        <span className="text-[12.5px] text-[#475569] font-medium leading-none">
                          Decline
                        </span>
                      </button>

                      <button
                        ref={acceptBtnRef}
                        type="button"
                        onClick={handleAcceptCall}
                        className="flex flex-col items-center gap-[10px] cursor-pointer group select-none active:scale-[0.96] transition-transform focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[3px] rounded-full relative"
                        style={{ touchAction: 'manipulation' }}
                        aria-label="Accept call"
                      >
                        <motion.div
                          animate={acceptPulse ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                          transition={{ duration: 0.45 }}
                          className="relative w-[72px] h-[72px]"
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
                            className="w-full h-full rounded-full flex items-center justify-center text-white group-hover:brightness-105 transition-all relative z-10"
                            style={{
                              background: 'linear-gradient(135deg, #46d36e 0%, #28b84f 100%)',
                              boxShadow: '0 14px 30px -10px rgba(40, 184, 79, 0.5)',
                            }}
                          >
                            <Phone className="w-[26px] h-[26px] stroke-[2.2]" />
                          </div>
                        </motion.div>
                        <span className="text-[12.5px] text-[#475569] font-medium leading-none">
                          Accept
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: TRANSCRIPT PANE */}
            <div className="bg-white flex flex-col min-w-0 min-h-0 overflow-hidden">
              {/* Sub-header */}
              <div
                className="min-h-[var(--cw-transcript-header-h)] py-2.5 sm:py-0 sm:h-[var(--cw-transcript-header-h)] border-b border-[#eceff5] flex items-center justify-between gap-2 shrink-0"
                style={{ paddingLeft: 'var(--cw-transcript-px)', paddingRight: 'var(--cw-transcript-px)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2.5 min-w-0 text-left">
                  <span className="text-[14.5px] font-bold text-[#0b1530] shrink-0 leading-tight">
                    Live transcript
                  </span>
                  <span className="text-[12.5px] text-[#94a3b8] sm:truncate leading-tight">
                    {callState === 'answered'
                      ? 'Live audio stream'
                      : 'Sample call · Tap Accept to listen'}
                  </span>
                </div>

                {/* Compact timer chip */}
                <span className="h-[28px] px-3 rounded-[9px] bg-[#f3f5fa] text-[12.5px] font-medium text-[#64748b] tabular-nums inline-flex items-center gap-1.5 shrink-0">
                  {callState === 'answered' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shrink-0" />
                  )}
                  <span>
                    {callState === 'answered'
                      ? `${formatCompactTime(callTime)} / ${formatCompactTime(safeDuration)}`
                      : formatCompactTime(safeDuration)}
                  </span>
                </span>
              </div>

              {/* Subtle interactive hint when live */}
              {callState === 'answered' && (
                <div
                  className="pt-2.5 pb-0.5 text-[12px] text-[#94a3b8] shrink-0 text-left"
                  style={{ paddingLeft: 'var(--cw-transcript-px)', paddingRight: 'var(--cw-transcript-px)' }}
                >
                  Click any line to jump
                </div>
              )}

              {/* Scrollable Feed Wrapper */}
              <div className="relative flex-1 min-h-0 flex flex-col">
                <div
                  ref={transcriptListRef}
                  onScroll={handleListScroll}
                  aria-live="polite"
                  className="h-[var(--cw-transcript-h)] lg:h-[340px] lg:flex-none xl:h-auto xl:flex-[1_1_0%] min-h-0 overflow-y-auto flex flex-col gap-[var(--cw-row-gap)] no-scrollbar select-text"
                  style={{
                    padding: 'var(--cw-transcript-pad)',
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
                    <div className="my-auto w-full max-w-[490px] mx-auto flex flex-col items-center text-center py-2">
                      {/* 52px Waveform Icon Tile */}
                      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#eef4ff] text-[#2563eb] flex items-center justify-center shrink-0">
                        <AudioLines className="w-6 h-6 stroke-[2]" />
                      </div>

                      <div className="mt-[20px] mb-[20px] flex flex-col items-center">
                        <div className="text-[13.5px] font-semibold text-[#64748b]">
                          Allison · AI Receptionist
                        </div>

                        <p
                          className="mt-2 leading-[1.55] text-[#0b1530] font-medium max-w-[440px]"
                          style={{ fontSize: 'var(--cw-font)' }}
                        >
                          {callState === 'ended'
                            ? 'Call completed and booked to the calendar. Tap Accept to replay the live call.'
                            : 'Ready to answer an incoming plumbing call. Tap Accept to hear the audio and follow the live transcript.'}
                        </p>
                      </div>

                      {/* Sample Inbound Call Card */}
                      <div
                        className="w-full rounded-[18px] p-[18px_20px] border border-[#e3e9f6] flex items-center justify-between gap-3.5 text-left"
                        style={{
                          background: 'linear-gradient(180deg, #fbfcff, #f4f7ff)',
                        }}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div
                            className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-white shrink-0"
                            style={{
                              background: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
                            }}
                          >
                            <Play className="w-[18px] h-[18px] fill-white ml-0.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13.5px] font-bold text-[#0b1530] leading-snug">
                              New York Plumbing · Sample Inbound Call
                            </div>
                            <div className="text-[12.5px] text-[#64748b] mt-0.5 leading-snug">
                              Answers, qualifies issue &amp; address, books tomorrow 10:00 AM
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAcceptCall}
                          className="shrink-0 h-[48px] md:h-[38px] px-[18px] rounded-[10px] text-white text-[13.5px] font-semibold cursor-pointer hover:brightness-105 active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px]"
                          style={{
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                            boxShadow: '0 6px 14px -6px rgba(37, 99, 235, 0.5)',
                          }}
                        >
                          Listen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {visibleLines.map((line, idx) => {
                        const isAi = line.speaker === 'ai';
                        const isActiveLine = idx === activeLineIndex;
                        const lineTimeLabel = formatCompactTime(line.start);

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSeek(line.start + TRANSCRIPT_OFFSET)}
                            className={`group/row w-full text-left flex items-start gap-3.5 rounded-[16px] px-[12px] py-[10px] -mx-[12px] -my-[10px] cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px] ${
                              isActiveLine
                                ? 'bg-[rgba(59,130,246,0.06)]'
                                : 'hover:bg-[rgba(15,23,42,0.03)]'
                            }`}
                          >
                            {/* 40px Avatar */}
                            {isAi ? (
                              <div
                                className={`w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0 mt-0.5 ${
                                  isActiveLine ? 'ring-2 ring-[#3b82f6] ring-offset-2' : ''
                                }`}
                                style={{
                                  background: 'linear-gradient(145deg, #7aa9ff, #1d4ed8)',
                                }}
                              >
                                <AppsianMark size={19} fill="#ffffff" />
                              </div>
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0 mt-0.5 ${
                                  isActiveLine ? 'ring-2 ring-[#3b82f6] ring-offset-2' : ''
                                }`}
                              >
                                <User className="w-[18px] h-[18px] stroke-[2.2]" />
                              </div>
                            )}

                            {/* Speaker + Timestamp + Word-by-word body */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[14.5px] font-bold text-[#0b1530]">
                                  {isAi
                                    ? 'Allison · AI Receptionist'
                                    : showCaller
                                    ? 'Zach Phillips'
                                    : 'Incoming Caller'}
                                </span>
                                <span className="text-[12.5px] font-medium text-[#94a3b8] group-hover/row:text-[#2563eb] tabular-nums transition-colors">
                                  {lineTimeLabel}
                                </span>
                                <span className="text-[11.5px] font-semibold text-[#2563eb] opacity-0 group-hover/row:opacity-100 transition-opacity">
                                  Jump
                                </span>

                                {isActiveLine && (
                                  <span
                                    className="inline-flex items-end gap-[2px] h-3.5 ml-0.5"
                                    aria-hidden="true"
                                  >
                                    <span
                                      className="transcript-eq-bar w-[2.5px] h-2.5 rounded-full bg-[#2563eb]"
                                      style={{ animationDelay: '0s' }}
                                    />
                                    <span
                                      className="transcript-eq-bar w-[2.5px] h-3.5 rounded-full bg-[#2563eb]"
                                      style={{ animationDelay: '0.2s' }}
                                    />
                                    <span
                                      className="transcript-eq-bar w-[2.5px] h-2 rounded-full bg-[#2563eb]"
                                      style={{ animationDelay: '0.4s' }}
                                    />
                                  </span>
                                )}
                              </div>

                              <p className="mt-1 leading-[1.65]" style={{ fontSize: 'var(--cw-font)' }}>
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
                          </button>
                        );
                      })}

                      {/* Typing Cue (<= 0.8s before next speaker starts) */}
                      {showTypingCue && (
                        <div className="flex items-start gap-3.5 text-left py-1" aria-hidden="true">
                          {typingSpeakerIsAi ? (
                            <div
                              className="w-10 h-10 rounded-[11px] flex items-center justify-center shrink-0"
                              style={{
                                background: 'linear-gradient(145deg, #7aa9ff, #1d4ed8)',
                              }}
                            >
                              <AppsianMark size={19} fill="#ffffff" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#cbd5e1] flex items-center justify-center text-white shrink-0">
                              <User className="w-[18px] h-[18px] stroke-[2.2]" />
                            </div>
                          )}

                          <div className="flex flex-col items-start">
                            <span className="text-[13px] font-semibold text-[#64748b]">
                              {typingSpeakerIsAi
                                ? 'Allison · AI Receptionist'
                                : showCaller
                                ? 'Zach Phillips'
                                : 'Incoming Caller'}
                            </span>
                            <div className="mt-1.5 bg-[#f1f5f9] rounded-[13px] px-3.5 py-2.5 inline-flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#64748b] typing-dot-1" />
                              <span className="w-2 h-2 rounded-full bg-[#64748b] typing-dot-2" />
                              <span className="w-2 h-2 rounded-full bg-[#64748b] typing-dot-3" />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Floating "Jump to live" Pill when user scrolled up during playback */}
                {callState === 'answered' && isUserScrolledUp && (
                  <button
                    type="button"
                    onClick={jumpToLive}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 h-[48px] md:h-[36px] px-[16px] rounded-[11px] bg-[#0b1530] text-white text-[13px] font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#1e293b] active:scale-[0.97] transition-all focus-visible:outline-2 focus-visible:outline-[#2563eb] focus-visible:outline-offset-[2px]"
                    style={{
                      boxShadow: '0 10px 24px -10px rgba(11, 21, 48, 0.5)',
                    }}
                  >
                    <ArrowDown className="w-4 h-4 stroke-[2.2]" />
                    <span>Jump to live</span>
                  </button>
                )}
              </div>

              {/* Compact Bottom-Docked Job Details for 1024px–1279px & Mobile (< 1280px) */}
              <div className="xl:hidden p-[22px_18px] lg:p-0 lg:mx-[28px] lg:mb-[22px] shrink-0 border-t border-[#eceff5] lg:border-t-0">
                <JobDetailsPanel
                  layout="compact"
                  callState={callState}
                  revealedDetailsCount={revealedDetailsCount}
                  showIssue={showIssue}
                  showCaller={showCaller}
                  showAddress={showAddress}
                  showAppointment={showAppointment}
                  showBooked={showBooked}
                />
              </div>
            </div>

            {/* COLUMN 3: DEDICATED JOB DETAILS PANEL (Desktop 1280px+) */}
            <div className="hidden xl:block h-full min-h-0 overflow-y-auto no-scrollbar">
              <JobDetailsPanel
                layout="sidebar"
                callState={callState}
                revealedDetailsCount={revealedDetailsCount}
                showIssue={showIssue}
                showCaller={showCaller}
                showAddress={showAddress}
                showAppointment={showAppointment}
                showBooked={showBooked}
              />
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
