import React from 'react';

export const HeroCallDemo: React.FC = () => {
  return (
    <div className="hcd-root relative flex flex-col items-center justify-center select-none pointer-events-none">
      {/* Scoped CSS block strictly isolated to .hcd-root */}
      <style>{`
        .hcd-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .hcd-phone {
          --u: calc(244.5px / 852);
          width: 244.5px;
          height: 530px;
          aspect-ratio: 852 / 1847;
          position: relative;
          overflow: hidden;
          color: #fff;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          border-radius: 13% / 6%;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1), 0 30px 80px rgba(20, 20, 50, 0.14);
          flex: none;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 55%, rgba(0, 0, 0, 0.45) 86%, transparent 100%);
          mask-image: linear-gradient(to bottom, #000 0%, #000 55%, rgba(0, 0, 0, 0.45) 86%, transparent 100%);
          background:
            radial-gradient(ellipse 75% 7% at 8% 56.5%, rgba(32, 92, 140, 0.55), transparent),
            radial-gradient(ellipse 90% 9% at 50% 70%, rgba(86, 88, 90, 0.5), transparent),
            radial-gradient(ellipse 70% 8% at 62% 91.5%, rgba(130, 86, 44, 0.85), transparent),
            radial-gradient(ellipse 45% 6% at 12% 96%, rgba(70, 86, 40, 0.45), transparent),
            linear-gradient(180deg, #101010 0%, #121212 42%, #17222c 56%, #252a2e 68%, #32312f 82%, #43382d 100%);
        }
        @media (max-width: 600px) {
          .hcd-phone {
            width: 220px;
            height: 477px;
            --u: calc(220px / 852);
          }
        }
        .hcd-a {
          position: absolute;
          left: calc(var(--x) * var(--u));
          top: calc(var(--y) * var(--u));
          width: calc(var(--w) * var(--u));
          height: calc(var(--h) * var(--u));
        }
        .hcd-island {
          background: #000;
          border-radius: 999px;
        }
        .hcd-island i {
          position: absolute;
          left: calc(174 * var(--u));
          top: calc(33 * var(--u));
          width: calc(13 * var(--u));
          height: calc(13 * var(--u));
          border-radius: 50%;
          background: #ff9500;
        }
        .hcd-status {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 calc(72 * var(--u)) 0 calc(95 * var(--u));
        }
        .hcd-sl, .hcd-sr {
          display: flex;
          align-items: center;
        }
        .hcd-sl {
          gap: calc(12 * var(--u));
        }
        .hcd-sr {
          gap: calc(16 * var(--u));
        }
        .hcd-time {
          font-size: calc(40 * var(--u));
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #fff;
        }
        .hcd-bat {
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(53 * var(--u));
          height: calc(29 * var(--u));
          border-radius: calc(9 * var(--u));
          background: #cfcfd1;
          position: relative;
          margin-right: calc(5 * var(--u));
        }
        .hcd-bat::after {
          content: "";
          position: absolute;
          right: calc(-5 * var(--u));
          top: calc(9.5 * var(--u));
          width: calc(3 * var(--u));
          height: calc(10 * var(--u));
          border-radius: 0 calc(2 * var(--u)) calc(2 * var(--u)) 0;
          background: rgba(255, 255, 255, 0.4);
        }
        .hcd-bat b {
          font-size: calc(26 * var(--u));
          font-weight: 700;
          color: #1c1c1e;
          letter-spacing: -0.02em;
        }
        .hcd-name, .hcd-timer {
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }
        .hcd-name {
          font-size: calc(66 * var(--u));
          font-weight: 500;
          letter-spacing: -0.015em;
          color: #fff;
        }
        .hcd-timer {
          font-size: calc(46 * var(--u));
          font-weight: 400;
          color: rgba(255, 255, 255, 0.55);
          font-variant-numeric: tabular-nums;
        }
        .hcd-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: calc(10 * var(--u));
          background: none;
          border: 0;
          padding: 0;
          color: inherit;
          font: inherit;
          cursor: default;
          pointer-events: none;
        }
        .hcd-c {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.14);
          -webkit-backdrop-filter: blur(20px);
          backdrop-filter: blur(20px);
          color: #fff;
        }
        .hcd-c svg {
          width: calc(var(--sw, 72) * var(--u));
          height: calc(var(--sh, 72) * var(--u));
          overflow: visible;
        }
        .hcd-l {
          font-size: calc(36 * var(--u));
          height: calc(50 * var(--u));
          line-height: calc(50 * var(--u));
          white-space: nowrap;
          color: #fff;
        }
        .hcd-home {
          background: rgba(235, 235, 240, 0.92);
          border-radius: 999px;
        }
        .hcd-layer {
          position: absolute;
          inset: 0;
        }
        .hcd-sm {
          --sw: 54;
          --sh: 54;
        }
        .hcd-sm .hcd-l {
          font-size: calc(34 * var(--u));
        }
        .hcd-c.red {
          background: #ff453a;
        }
        .hcd-c.green {
          background: #30d158;
        }
      `}</style>

      {/* iPhone Screen Frame with Soft Fade Mask */}
      <div
        className="hcd-phone"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.45) 86%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, #000 0%, #000 55%, rgba(0,0,0,0.45) 86%, transparent 100%)',
        }}
        aria-label="Phone call screen"
      >
        {/* Dynamic Island */}
        <div className="hcd-island hcd-a" style={{ '--x': 291, '--y': 25, '--w': 270, '--h': 79 } as React.CSSProperties}>
          <i />
        </div>

        {/* Status Bar */}
        <header className="hcd-status hcd-a" style={{ '--x': 0, '--y': 25, '--w': 852, '--h': 79 } as React.CSSProperties}>
          <div className="hcd-sl">
            <span className="hcd-time">9:58</span>
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              aria-hidden="true"
              style={{ width: 'calc(27 * var(--u))', height: 'calc(27 * var(--u))' }}
            >
              <polygon points="25,2 3,11.5 13,14 15.5,25" fill="#fff" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="hcd-sr">
            <svg
              viewBox="0 0 44 28"
              aria-hidden="true"
              style={{ width: 'calc(43 * var(--u))', height: 'calc(28 * var(--u))' }}
              fill="#fff"
            >
              <rect x="0" y="18" width="8" height="10" rx="2.5" />
              <rect x="12" y="12" width="8" height="16" rx="2.5" />
              <rect x="24" y="6" width="8" height="22" rx="2.5" />
              <rect x="36" y="0" width="8" height="28" rx="2.5" opacity=".35" />
            </svg>
            <svg
              viewBox="0 0 37 27"
              aria-hidden="true"
              style={{ width: 'calc(37 * var(--u))', height: 'calc(27 * var(--u))' }}
            >
              <defs>
                <clipPath id="hcd-wifi-clip">
                  <polygon points="18.5,25 -6.5,0 43.5,0" />
                </clipPath>
              </defs>
              <g clipPath="url(#hcd-wifi-clip)" fill="none" stroke="#fff" strokeWidth="4.6">
                <circle cx="18.5" cy="25" r="22" />
                <circle cx="18.5" cy="25" r="14" />
                <circle cx="18.5" cy="25" r="6.2" />
              </g>
              <circle cx="18.5" cy="25" r="2.6" fill="#fff" />
            </svg>
            <span className="hcd-bat">
              <b>39</b>
            </span>
          </div>
        </header>

        {/* Contact Name */}
        <h1 className="hcd-name hcd-a" style={{ '--x': 0, '--y': 243, '--w': 852, '--h': 80 } as React.CSSProperties}>
          AI Sales Receptionist
        </h1>

        {/* Timer / Status Tag */}
        <p className="hcd-timer hcd-a" style={{ '--x': 0, '--y': 330, '--w': 852, '--h': 56 } as React.CSSProperties}>
          mobile
        </p>

        {/* INCOMING CALL SCREEN */}
        <div className="hcd-layer">
          <div
            className="hcd-btn hcd-sm hcd-a"
            style={{ '--x': 135, '--y': 1120, '--w': 130 } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 54 54" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="27" cy="27" r="22" />
                <path d="M27 14v14l10 7" />
              </svg>
            </span>
            <span className="hcd-l">Remind Me</span>
          </div>

          <div
            className="hcd-btn hcd-sm hcd-a"
            style={{ '--x': 587, '--y': 1120, '--w': 130 } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className="hcd-c">
              <svg viewBox="0 0 54 54" fill="currentColor">
                <path d="M27 6C14.5 6 5 14 5 24c0 5.2 2.6 9.8 6.8 13-.4 3.3-1.8 6.2-4.3 8.4 5.2.1 9.2-1.8 11.9-4.2 2.3.6 4.5.8 7.6.8 12.5 0 22-8 22-18S39.5 6 27 6z" />
              </svg>
            </span>
            <span className="hcd-l">Message</span>
          </div>

          <div
            className="hcd-btn hcd-a"
            style={{ '--x': 118, '--y': 1411, '--w': 163 } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className="hcd-c red">
              <svg viewBox="0 0 88 32" style={{ '--sw': 80, '--sh': 29 } as React.CSSProperties} fill="currentColor">
                <path d="M2 22C2 12 14 7 44 7s42 5 42 15v4q0 4-4 4H70q-4 0-4-4v-4q0-3-4-3.5-18-2.5-36 0-4 .5-4 3.5v4q0 4-4 4H6q-4 0-4-4z" />
              </svg>
            </span>
            <span className="hcd-l">Decline</span>
          </div>

          <div
            className="hcd-btn hcd-a"
            style={{ '--x': 571, '--y': 1411, '--w': 163 } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className="hcd-c green">
              <svg
                viewBox="0 0 88 32"
                style={{ '--sw': 80, '--sh': 29, transform: 'rotate(-135deg)' } as React.CSSProperties}
                fill="currentColor"
              >
                <path d="M2 22C2 12 14 7 44 7s42 5 42 15v4q0 4-4 4H70q-4 0-4-4v-4q0-3-4-3.5-18-2.5-36 0-4 .5-4 3.5v4q0 4-4 4H6q-4 0-4-4z" />
              </svg>
            </span>
            <span className="hcd-l">Accept</span>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="hcd-home hcd-a" style={{ '--x': 275, '--y': 1819, '--w': 303, '--h': 10 } as React.CSSProperties} />
      </div>
    </div>
  );
};
