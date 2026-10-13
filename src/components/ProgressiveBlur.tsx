import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Layer = { blur: number; a: number; b: number; c: number; d: number };

// Bands measured from the BOTTOM edge of the strip (gradient goes "to top").
// Strongest blur lives at the very bottom, weakest blur fades out at the top.
const LAYERS: Layer[] = [
  { blur: 16,  a: 0,  b: 0,  c: 10, d: 30 },
  { blur: 8,   a: 0,  b: 0,  c: 20, d: 45 },
  { blur: 4,   a: 0,  b: 10, c: 35, d: 60 },
  { blur: 2,   a: 10, b: 25, c: 50, d: 75 },
  { blur: 1,   a: 25, b: 40, c: 65, d: 90 },
  { blur: 0.5, a: 40, b: 55, c: 80, d: 100 },
];

const mask = (l: Layer) =>
  `linear-gradient(to top, transparent ${l.a}%, #000 ${l.b}%, #000 ${l.c}%, transparent ${l.d}%)`;

export default function ProgressiveBlur({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setDebug(new URLSearchParams(window.location.search).has('pbdebug'));
    } catch {}
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const boost = debug ? 3 : 1; // ?pbdebug=1 makes the blur 3x stronger and outlines the strip

  return createPortal(
    <div
      aria-hidden="true"
      data-progressive-blur
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: 'clamp(100px, 15vh, 140px)',
        pointerEvents: 'none',
        zIndex: 90, // above page content, below the dock (dock is z-100)
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
        outline: debug ? '1px dashed red' : 'none',
        // NO opacity, NO filter, NO mask, NO clip-path, NO will-change, NO isolation here.
      }}
    >
      {LAYERS.map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: `blur(${l.blur * boost}px)`,
            WebkitBackdropFilter: `blur(${l.blur * boost}px)`,
            maskImage: mask(l),
            WebkitMaskImage: mask(l),
          }}
        />
      ))}
    </div>,
    document.body
  );
}
