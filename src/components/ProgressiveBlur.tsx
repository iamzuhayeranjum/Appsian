import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// Nudge the top edge of the blur: positive = higher, negative = lower (in px).
export const BLUR_EXTRA_PX = 0;

// Overall strength multiplier for every layer. 1 = default, 1.5 = stronger, 0.75 = softer.
export const BLUR_STRENGTH = 1;

type Layer = { blur: number; a: number; b: number; c: number; d: number };

// Bands are measured from the BOTTOM edge of the strip (gradient goes "to top").
// The strong blur stays clearly visible almost all the way up and then ends in the last
// ~10% of the strip, so the visible top edge of the blur lines up with the top edge of the dock.
const LAYERS: Layer[] = [
  { blur: 20,   a: 0, b: 0, c: 22, d: 50 },
  { blur: 10,   a: 0, b: 0, c: 40, d: 68 },
  { blur: 5,    a: 0, b: 0, c: 60, d: 82 },
  { blur: 2.5,  a: 0, b: 0, c: 78, d: 92 },
  { blur: 1.25, a: 0, b: 0, c: 90, d: 100 },
];

const mask = (l: Layer) =>
  `linear-gradient(to top, transparent ${l.a}%, #000 ${l.b}%, #000 ${l.c}%, transparent ${l.d}%)`;

const DOCK_SELECTOR = 'nav[aria-label="Floating Navigation"]';

export default function ProgressiveBlur({
  visible,
  dockTopFromBottom,
}: {
  visible: boolean;
  dockTopFromBottom: number;
}) {
  const [mounted, setMounted] = useState(false);
  const [debug, setDebug] = useState(false);
  // Real distance from the viewport bottom to the dock's top edge, measured from the DOM
  // once the dock is at rest. It overrides the prop if the two ever disagree.
  const [measured, setMeasured] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      setDebug(new URLSearchParams(window.location.search).has('pbdebug'));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    const measure = () => {
      const nav = document.querySelector(DOCK_SELECTOR) as HTMLElement | null;
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      if (rect.height <= 0) return;
      const actual = Math.round(window.innerHeight - rect.top);
      if (actual > 0) setMeasured(actual);
    };
    // Wait until the dock's slide-in animation has finished so the measurement is the resting position.
    const timer = window.setTimeout(measure, 900);
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
    };
  }, [visible, dockTopFromBottom]);

  const base = measured !== null ? measured : dockTopFromBottom;
  const totalHeight = Math.max(0, base + BLUR_EXTRA_PX);

  useEffect(() => {
    if (debug && visible) {
      // eslint-disable-next-line no-console
      console.info('[ProgressiveBlur]', { prop: dockTopFromBottom, measured, using: totalHeight });
    }
  }, [debug, visible, dockTopFromBottom, measured, totalHeight]);

  if (!mounted || typeof document === 'undefined') return null;

  const boost = (debug ? 2 : 1) * BLUR_STRENGTH; // ?pbdebug=1 doubles the blur and outlines the strip

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
