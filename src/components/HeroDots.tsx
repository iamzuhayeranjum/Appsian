import React, { useEffect, useRef } from 'react';

interface HeroDotsProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const HeroDots: React.FC<HeroDotsProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarse =
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      'ontouchstart' in window;

    if (reduceMotion || isCoarse) {
      return;
    }

    const SPACING = 10;
    const R = 110;
    const R_SQ = R * R;
    const HALF_LIFE = 0.55;
    const DECAY_CONSTANT = Math.LN2 / HALF_LIFE;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let totalDots = 0;
    let offsetX = 0;
    let offsetY = 0;

    let energies = new Float32Array(0);
    let isActive = new Uint8Array(0);
    const activeList: number[] = [];

    let rafId: number | null = null;
    let isVisible = true;
    let lastFrameTime = performance.now();

    const lastPointer = {
      x: -9999,
      y: -9999,
    };

    const initGrid = () => {
      cols = Math.floor(width / SPACING);
      rows = Math.floor(height / SPACING);
      totalDots = cols * rows;
      offsetX = (width - cols * SPACING) / 2;
      offsetY = (height - rows * SPACING) / 2;

      energies = new Float32Array(totalDots);
      isActive = new Uint8Array(totalDots);
      activeList.length = 0;
    };

    const resize = () => {
      const targetEl = containerRef?.current || canvas.parentElement;
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initGrid();
    };

    const injectAt = (px: number, py: number) => {
      if (cols === 0 || rows === 0) return;

      const minCol = Math.max(0, Math.floor((px - R - offsetX) / SPACING));
      const maxCol = Math.min(cols - 1, Math.ceil((px + R - offsetX) / SPACING));
      const minRow = Math.max(0, Math.floor((py - R - offsetY) / SPACING));
      const maxRow = Math.min(rows - 1, Math.ceil((py + R - offsetY) / SPACING));

      for (let r = minRow; r <= maxRow; r++) {
        const dotY = r * SPACING + offsetY;
        const dy = dotY - py;
        const rowOffset = r * cols;

        for (let c = minCol; c <= maxCol; c++) {
          const dotX = c * SPACING + offsetX;
          const dx = dotX - px;
          const distSq = dx * dx + dy * dy;

          if (distSq < R_SQ) {
            const e = 1 - distSq / R_SQ;
            const idx = rowOffset + c;

            if (e > energies[idx]) {
              energies[idx] = e;
              if (!isActive[idx]) {
                isActive[idx] = 1;
                activeList.push(idx);
              }
            }
          }
        }
      }
    };

    const render = (now: number) => {
      if (!ctx || width === 0 || height === 0) return;

      const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      const decayFactor = Math.exp(-dt * DECAY_CONSTANT);
      let writeIdx = 0;

      for (let i = 0; i < activeList.length; i++) {
        const idx = activeList[i];
        const newEnergy = energies[idx] * decayFactor;

        if (newEnergy >= 0.01) {
          energies[idx] = newEnergy;
          activeList[writeIdx++] = idx;

          const c = idx % cols;
          const r = Math.floor(idx / cols);
          const dotX = c * SPACING + offsetX;
          const dotY = r * SPACING + offsetY;
          const size = 1.1 + newEnergy * 0.9;
          const alpha = newEnergy * 0.55;

          ctx.beginPath();
          ctx.arc(dotX, dotY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(100, 116, 139, ${alpha})`;
          ctx.fill();
        } else {
          energies[idx] = 0;
          isActive[idx] = 0;
        }
      }

      activeList.length = writeIdx;

      if (activeList.length > 0 && isVisible) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId && isVisible) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const targetEl = containerRef?.current;
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (lastPointer.x === -9999) {
        injectAt(currentX, currentY);
      } else {
        const dx = currentX - lastPointer.x;
        const dy = currentY - lastPointer.y;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.ceil(dist / 8));

        for (let s = 1; s <= steps; s++) {
          const ix = lastPointer.x + dx * (s / steps);
          const iy = lastPointer.y + dy * (s / steps);
          injectAt(ix, iy);
        }
      }

      lastPointer.x = currentX;
      lastPointer.y = currentY;
      startLoop();
    };

    const handlePointerLeave = () => {
      lastPointer.x = -9999;
      lastPointer.y = -9999;
    };

    const targetElement = containerRef?.current || canvas.parentElement;
    if (targetElement) {
      targetElement.addEventListener('pointermove', handlePointerMove, { passive: true });
      targetElement.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (targetElement) {
      resizeObserver.observe(targetElement);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            if (activeList.length > 0) {
              startLoop();
            }
          } else if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0.05 }
    );

    if (targetElement) {
      io.observe(targetElement);
    }

    resize();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      if (targetElement) {
        targetElement.removeEventListener('pointermove', handlePointerMove);
        targetElement.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-2"
      aria-hidden="true"
    />
  );
};
