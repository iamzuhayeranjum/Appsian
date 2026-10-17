import React, { useEffect, useRef } from 'react';

interface HeroDotsProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface Dot {
  x: number;
  y: number;
  baseRadius: number;
  currentRadius: number;
  targetRadius: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  currentAlpha: number;
  targetAlpha: number;
  colorR: number;
  colorG: number;
  colorB: number;
  distFromCenter: number;
  spawnTime: number;
}

export const HeroDots: React.FC<HeroDotsProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Check touch devices
    const isTouch = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let rafId: number | null = null;
    let isVisible = true;
    let lastMouseMoveTime = 0;

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const startTime = performance.now();

    const initDots = () => {
      const isMobile = width < 768;
      const spacing = isMobile ? 28 : 24;
      const baseRadius = 1.1;

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);
      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxDist = Math.hypot(centerX, centerY) || 1;

      dots = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const x = offsetX + c * spacing;
          const y = offsetY + r * spacing;
          const dist = Math.hypot(x - centerX, y - centerY);
          const normalizedDist = dist / maxDist;

          dots.push({
            x,
            y,
            baseRadius,
            currentRadius: reduceMotion ? baseRadius : 0,
            targetRadius: baseRadius,
            currentX: x,
            currentY: y,
            targetX: x,
            targetY: y,
            currentAlpha: reduceMotion ? 0.28 : 0,
            targetAlpha: 0.28,
            colorR: 100,
            colorG: 116,
            colorB: 139,
            distFromCenter: dist,
            spawnTime: startTime + normalizedDist * 500,
          });
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initDots();
      draw(performance.now());
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = (now: number) => {
      if (!ctx || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      let needsMoreFrames = false;
      const lerpFactor = 0.12;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Entrance stagger fade
        if (!reduceMotion && now < d.spawnTime + 400) {
          if (now >= d.spawnTime) {
            const progress = Math.min(1, (now - d.spawnTime) / 400);
            d.currentAlpha = 0.28 * progress;
            d.currentRadius = d.baseRadius * progress;
            needsMoreFrames = true;
          } else {
            d.currentAlpha = 0;
            d.currentRadius = 0;
            needsMoreFrames = true;
          }
        }

        // Hover physics
        if (!isTouch && !reduceMotion && mouse.active) {
          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            const factor = 1 - dist / 150;
            d.targetRadius = d.baseRadius + (2.8 - d.baseRadius) * factor;
            d.targetAlpha = 0.28 + (0.85 - 0.28) * factor;

            // Push away by up to 8px
            const angle = Math.atan2(dy, dx);
            d.targetX = d.x - Math.cos(angle) * (8 * factor);
            d.targetY = d.y - Math.sin(angle) * (8 * factor);

            // Interpolate toward purple #7C41F9 (124, 65, 249)
            d.colorR = Math.round(100 + (124 - 100) * factor);
            d.colorG = Math.round(116 + (65 - 116) * factor);
            d.colorB = Math.round(139 + (249 - 139) * factor);
          } else {
            d.targetRadius = d.baseRadius;
            d.targetAlpha = 0.28;
            d.targetX = d.x;
            d.targetY = d.y;
            d.colorR = 100;
            d.colorG = 116;
            d.colorB = 139;
          }
        } else if (!reduceMotion) {
          d.targetRadius = d.baseRadius;
          d.targetAlpha = 0.28;
          d.targetX = d.x;
          d.targetY = d.y;
          d.colorR = 100;
          d.colorG = 116;
          d.colorB = 139;
        }

        // Smooth glide with lerp
        if (!reduceMotion) {
          const deltaX = d.targetX - d.currentX;
          const deltaY = d.targetY - d.currentY;
          const deltaR = d.targetRadius - d.currentRadius;
          const deltaA = d.targetAlpha - d.currentAlpha;

          d.currentX += deltaX * lerpFactor;
          d.currentY += deltaY * lerpFactor;
          d.currentRadius += deltaR * lerpFactor;
          d.currentAlpha += deltaA * lerpFactor;

          if (
            Math.abs(deltaX) > 0.05 ||
            Math.abs(deltaY) > 0.05 ||
            Math.abs(deltaR) > 0.02 ||
            Math.abs(deltaA) > 0.01
          ) {
            needsMoreFrames = true;
          }
        }

        if (d.currentAlpha > 0.01 && d.currentRadius > 0.1) {
          ctx.beginPath();
          ctx.arc(d.currentX, d.currentY, d.currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${d.colorR}, ${d.colorG}, ${d.colorB}, ${d.currentAlpha})`;
          ctx.fill();
        }
      }

      // Check if mouse moved recently
      if (now - lastMouseMoveTime < 1500) {
        needsMoreFrames = true;
      }

      if (needsMoreFrames && isVisible && !reduceMotion) {
        rafId = requestAnimationFrame(draw);
      } else {
        rafId = null;
      }
    };

    const requestFrame = () => {
      if (!rafId && isVisible && !reduceMotion) {
        rafId = requestAnimationFrame(draw);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const targetEl = containerRef?.current || canvas.parentElement;
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();

      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
      lastMouseMoveTime = performance.now();
      requestFrame();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      lastMouseMoveTime = performance.now();
      requestFrame();
    };

    const targetElement = containerRef?.current || canvas.parentElement;
    if (targetElement && !isTouch) {
      targetElement.addEventListener('mousemove', handleMouseMove, { passive: true });
      targetElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    // IntersectionObserver to pause when off-screen
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            requestFrame();
          } else if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      },
      { threshold: 0.05 }
    );

    if (canvas.parentElement) {
      io.observe(canvas.parentElement);
    }

    // Initial setup
    resize();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      if (targetElement) {
        targetElement.removeEventListener('mousemove', handleMouseMove);
        targetElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-0"
      style={{
        WebkitMaskImage:
          'radial-gradient(ellipse 62% 58% at 50% 46%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, #000 100%)',
        maskImage:
          'radial-gradient(ellipse 62% 58% at 50% 46%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.35) 50%, #000 100%)',
      }}
      aria-hidden="true"
    />
  );
};
