import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, Sparkles, CheckCircle2, X } from 'lucide-react';

interface CallSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  callerName: string;
  callerTrade: string;
  callerPhone: string;
}

interface DialogueLine {
  speaker: 'receptionist' | 'caller';
  text: string;
  time: string;
}

export const CallSimulatorModal: React.FC<CallSimulatorModalProps> = ({
  isOpen,
  onClose,
  callerName,
  callerTrade,
  callerPhone,
}) => {
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<DialogueLine[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const displayName = callerName || 'Alex Morgan';
  const displayTrade = callerTrade || 'Plumbing & Drainage';

  // Scripted simulation dialogue sequence
  const script: DialogueLine[] = [
    {
      speaker: 'receptionist',
      text: `Thanks for calling ${displayTrade}! This is Ava, your automated dispatcher. How can I help you today?`,
      time: '0:02',
    },
    {
      speaker: 'caller',
      text: `Hi Ava, I have a burst pipe in the basement that started leaking 20 minutes ago. Can someone come out today?`,
      time: '0:07',
    },
    {
      speaker: 'receptionist',
      text: `I completely understand, that's urgent. Let me prioritize this for our emergency team. May I confirm your address and best contact number?`,
      time: '0:14',
    },
    {
      speaker: 'caller',
      text: `Sure, it's 742 Evergreen Terrace, and my number is ${callerPhone || '(555) 019-2834'}.`,
      time: '0:21',
    },
    {
      speaker: 'receptionist',
      text: `Got it, ${displayName}. I've logged the emergency dispatch for 742 Evergreen Terrace. Master tech Dave is 18 minutes away and will call ahead. I've sent a live tracker link via SMS right now.`,
      time: '0:28',
    },
    {
      speaker: 'caller',
      text: `Awesome, thank you so much!`,
      time: '0:32',
    },
    {
      speaker: 'receptionist',
      text: `You're welcome! Help is on the way. Have a safe day!`,
      time: '0:35',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCallActive(false);
      setCallDuration(0);
      setTranscript([]);
      return;
    }

    // Auto start call when opened
    setCallActive(true);
    setTranscript([script[0]]);
    setAudioPlaying(true);
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (callActive) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callActive]);

  useEffect(() => {
    if (!callActive) return;

    // Advance script based on duration
    const steps = [
      { at: 3, idx: 1 },
      { at: 9, idx: 2 },
      { at: 16, idx: 3 },
      { at: 23, idx: 4 },
      { at: 30, idx: 5 },
      { at: 34, idx: 6 },
    ];

    steps.forEach(({ at, idx }) => {
      if (callDuration === at && script[idx]) {
        setTranscript((prev) => [...prev, script[idx]]);
      }
    });

    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [callDuration, callActive]);

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-[24px] border border-white/16 bg-[#0f131d]/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6EEDC2] animate-pulse" />
            <h3 className="font-semibold text-white text-[16px]">Appsian Voice Simulation</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Call Canvas */}
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#6EEDC2]/20 to-[#38bdf8]/20 border border-[#6EEDC2]/40 flex items-center justify-center mb-3">
              <Sparkles size={32} className="text-[#6EEDC2]" />
              {callActive && (
                <div className="absolute inset-0 rounded-full border-2 border-[#6EEDC2] animate-ping opacity-25" />
              )}
            </div>

            <h4 className="text-white text-lg font-medium">Ava (AI Receptionist)</h4>
            <p className="text-xs text-[#6EEDC2] font-mono tracking-wider mt-1">
              {callActive ? `CONNECTED • ${formatSeconds(callDuration)}` : 'CALL ENDED'}
            </p>
          </div>

          {/* Transcript Log */}
          <div className="h-56 overflow-y-auto space-y-3 p-3 rounded-xl bg-black/40 border border-white/6 text-sm mb-6">
            {transcript.map((line, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  line.speaker === 'receptionist' ? 'items-start' : 'items-end'
                }`}
              >
                <span className="text-[10px] text-white/40 mb-1 px-1">
                  {line.speaker === 'receptionist' ? 'Ava (AI)' : displayName}
                </span>
                <div
                  className={`p-3 rounded-[14px] max-w-[85%] text-left text-[13px] leading-relaxed ${
                    line.speaker === 'receptionist'
                      ? 'bg-white/10 text-white border border-white/10 rounded-tl-sm'
                      : 'bg-[#6EEDC2]/20 text-[#6EEDC2] border border-[#6EEDC2]/30 rounded-tr-sm'
                  }`}
                >
                  {line.text}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsMuted((p) => !p)}
              className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-red-500/20 border-red-500/40 text-red-400'
                  : 'bg-white/10 border-white/14 text-white hover:bg-white/16'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCallActive(false);
                setTimeout(onClose, 500);
              }}
              className="px-6 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium flex items-center gap-2 shadow-[0_4px_16px_rgba(239,68,68,0.35)] transition-all cursor-pointer active:scale-95"
            >
              <PhoneOff size={18} />
              <span>End Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
