import React from 'react';

interface BackgroundTextureProps {
  theme?: 'light' | 'dark';
  className?: string;
  showDomeArc?: boolean;
}

export const BackgroundTexture: React.FC<BackgroundTextureProps> = ({
  theme = 'light',
  className = '',
  showDomeArc = true,
}) => {
  if (theme === 'dark') {
    return (
      <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
        {/* Faint top spotlight: radial gradient rgba(255,255,255,0.06) */}
        <div
          className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* 1. Faint large dome arc: huge ellipse about 2400px wide, 1px light-gray stroke, soft white-to-transparent fill */}
      {showDomeArc && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2400px] h-[1200px] pointer-events-none">
          <svg viewBox="0 0 2400 1200" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="domeStrokeGrad" x1="0" y1="0" x2="2400" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(11,11,15,0)" />
                <stop offset="20%" stopColor="rgba(11,11,15,0.06)" />
                <stop offset="50%" stopColor="rgba(11,11,15,0.12)" />
                <stop offset="80%" stopColor="rgba(11,11,15,0.06)" />
                <stop offset="100%" stopColor="rgba(11,11,15,0)" />
              </linearGradient>
              <linearGradient id="domeFillGrad" x1="1200" y1="0" x2="1200" y2="1200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.85)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
              </linearGradient>
            </defs>
            <ellipse
              cx="1200"
              cy="1200"
              rx="1180"
              ry="1100"
              fill="url(#domeFillGrad)"
              stroke="url(#domeStrokeGrad)"
              strokeWidth="1"
            />
          </svg>
        </div>
      )}

      {/* 2. 1px dot grid at 14px spacing, 6% opacity, with a radial mask fading it out toward edges */}
      <div
        className="absolute inset-0 dot-grid-pattern"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)',
        }}
      />

      {/* 3. 3% noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
