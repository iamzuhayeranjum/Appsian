import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Push the blur higher or lower with one number. Positive extends the strip above the dock top.
export const BLUR_EXTRA_PX = 0;

// Overall strength multiplier for every layer. 1 = soft, 2 = strong (default), 3 = very strong.
export const BLUR_STRENGTH = 2;

type Layer = { blur: number; a: number; b: number; c: number; d: number };

// Bands are measured from the BOTTOM edge of the strip (gradient goes "to top").
// The strongest blur sits at the very bottom and every layer fades out so that the
// blur reaches zero exactly at the top edge of the strip (= the top edge of the dock).
const LAYERS: Layer[] = [
  { blur: 16, a: 0,  b: 0,  c: 18, d: 45 },
  { blur: 8,  a: 0,  b: 0,  c: 30, d: 58 },
  { blur: 4,  a: 0,  b: 10, c: 42, d: 70 },
  { blur: 2,  a: 10, b: 25, c: 55, d: 82 },
  { blur: 1,  a: 25, b: 40, c: 68, d: 92 },
  { blur: 0.5, a: 40, b: 55, c: 80, d: 100 },
];

const mask = (l: Layer) =>
  `linear-gradient(to top, transparent ${l.a}%, #000 ${l.b}%, #000 ${l.c}%, transparent ${l.d}%)`;

export default function ProgressiveBlur({
  visible,
  dockTopFromBottom,
}: {
  visible: boolean;
  dockTopFromBottom: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      setDebug(new URLSearchParams(window.location.search).has('pbdebug'));
    } catch {
      // ignore
    }
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  const boost = (debug ? 3 : 1) * BLUR_STRENGTH; // ?pbdebug=1 makes the blur 3x stronger and outlines the strip
  const totalHeight = Math.max(0, dockTopFromBottom + BLUR_EXTRA_PX);

  return createPortal(
    <div
      aria-hidden="true"
      data-progressive-blur
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        height: `${totalHeight}px`,
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
