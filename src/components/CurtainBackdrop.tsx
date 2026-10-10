import React from 'react';

interface CurtainBackdropProps {
  variant?: 'violet' | 'sky' | 'card-violet' | 'final-cta';
  className?: string;
  children?: React.ReactNode;
}

export const CurtainBackdrop: React.FC<CurtainBackdropProps> = ({
  variant = 'violet',
  className = '',
  children,
}) => {
  // Gradients matching design tokens:
  // violet: black #010101 at top -> indigo #4A3FB5 -> violet #7C7DBE -> periwinkle #ACBDF5 -> pale sky #E8F4FF at bottom
  // sky: black #010101 -> deep blue #3A5FB0 -> cyan #AEF0FB at bottom edge (no white fade)
  // final-cta: near-black #08070D at top -> indigo in middle -> #9199D7 at bottom
  // card-violet: black #010101 top fading to deep indigo and violet at bottom
  const bgGradient =
    variant === 'sky'
      ? 'linear-gradient(180deg, #010101 0%, #162955 26%, #3A5FB0 54%, #6EBEF0 78%, #AEF0FB 100%)'
      : variant === 'final-cta'
      ? 'linear-gradient(180deg, #08070D 0%, #1C1945 28%, #473EB0 58%, #6B6FB8 82%, #9199D7 100%)'
      : variant === 'card-violet'
      ? 'linear-gradient(180deg, #010101 0%, #0d0c18 25%, #2a2254 60%, #4A3FB5 85%, #7C7DBE 100%)'
      : 'linear-gradient(180deg, #010101 0%, #161233 22%, #4A3FB5 52%, #7C7DBE 72%, #ACBDF5 89%, #E8F4FF 100%)';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: bgGradient }}
    >
      {/* Layered vertical curtain light streaks - contained strictly within bounds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen opacity-90">
        {/* Streak group 1 - drift left */}
        <div className="absolute inset-0 flex justify-around animate-curtain-left">
          <div
            className="w-16 h-full blur-2xl opacity-40 transform -skew-x-1"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(172, 189, 245, 0.25) 30%, rgba(255, 255, 255, 0.7) 65%, rgba(232, 244, 255, 0.4) 100%)',
            }}
          />
          <div
            className="w-24 h-full blur-3xl opacity-50 transform skew-x-2"
            style={{
              background:
                'linear-gradient(180deg, transparent 5%, rgba(124, 125, 190, 0.35) 35%, rgba(174, 240, 251, 0.75) 70%, rgba(255, 255, 255, 0.6) 100%)',
            }}
          />
          <div
            className="w-12 h-full blur-xl opacity-35"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(74, 63, 181, 0.3) 40%, rgba(172, 189, 245, 0.7) 75%, transparent 100%)',
            }}
          />
          <div
            className="w-28 h-full blur-3xl opacity-60 transform -skew-x-2"
            style={{
              background:
                'linear-gradient(180deg, transparent 10%, rgba(110, 237, 194, 0.2) 40%, rgba(174, 240, 251, 0.8) 75%, rgba(255, 255, 255, 0.5) 100%)',
            }}
          />
          <div
            className="w-20 h-full blur-2xl opacity-45"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(172, 189, 245, 0.3) 30%, rgba(255, 255, 255, 0.65) 68%, transparent 95%)',
            }}
          />
        </div>

        {/* Streak group 2 - drift right */}
        <div className="absolute inset-0 flex justify-evenly animate-curtain-right">
          <div
            className="w-20 h-full blur-2xl opacity-45 transform skew-x-1"
            style={{
              background:
                'linear-gradient(180deg, transparent 8%, rgba(74, 63, 181, 0.35) 35%, rgba(172, 189, 245, 0.7) 70%, rgba(232, 244, 255, 0.3) 100%)',
            }}
          />
          <div
            className="w-32 h-full blur-3xl opacity-55 transform -skew-x-1"
            style={{
              background:
                'linear-gradient(180deg, transparent 0%, rgba(124, 125, 190, 0.4) 38%, rgba(255, 255, 255, 0.85) 75%, rgba(255, 255, 255, 0.4) 100%)',
            }}
          />
          <div
            className="w-16 h-full blur-xl opacity-40 transform skew-x-2"
            style={{
              background:
                'linear-gradient(180deg, transparent 15%, rgba(58, 95, 176, 0.35) 45%, rgba(174, 240, 251, 0.6) 80%, transparent 100%)',
            }}
          />
          <div
            className="w-24 h-full blur-2xl opacity-50"
            style={{
              background:
                'linear-gradient(180deg, transparent 5%, rgba(172, 189, 245, 0.4) 40%, rgba(255, 255, 255, 0.8) 72%, rgba(232, 244, 255, 0.5) 100%)',
            }}
          />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
