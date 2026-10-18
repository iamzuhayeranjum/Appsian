import React, { useEffect, useRef } from 'react';

interface HeroParticlesProps {
  containerRef?: React.RefObject<HTMLElement | null>;
}

interface DustParticle {
  type: 'dust';
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  baseAlpha: number;
  alphaPhase: number;
  alphaSpeed: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

interface BokehParticle {
  type: 'bokeh';
  x: number;
  y: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface SparkleParticle {
  type: 'sparkle';
  x: number;
  y: number;
  size: number;
  cycleDuration: number;
  timeAlive: number;
}

const ICE_WHITE_COLORS = ['#ffffff', '#ddeeff', '#a9d3ff', '#7db9f8'];
const pickDustColor = () =>
  Math.random() < 0.7
    ? ICE_WHITE_COLORS[Math.floor(Math.random() * ICE_WHITE_COLORS.length)]
    : '#4f9bf5';

export const HeroParticles: React.FC<HeroParticlesProps> = ({ containerRef }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId: number | null = null;
    let isVisible = true;
    let lastTime = performance.now();

    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
    };

    let dustParticles: DustParticle[] = [];
    let bokehParticles: BokehParticle[] = [];
    let sparkleParticles: SparkleParticle[] = [];

    const initParticles = () => {
      const isMobile = width < 768;
      const dustCount = isMobile ? 30 : 70;
      const bokehCount = isMobile ? 4 : 10;
      const sparkleCount = isMobile ? 3 : 6;

      dustParticles = Array.from({ length: dustCount }, () => ({
        type: 'dust',
        x: Math.random() * width,
        y: Math.random() * height,
        baseX: 0,
        baseY: 0,
        vx: 0,
        vy: 6 + Math.random() * 10, // 6 to 16 px/sec upward
        radius: 0.8 + Math.random() * 1.6, // 0.8 to 2.4px
        color: pickDustColor(),
        baseAlpha: 0.20 + Math.random() * 0.35, // 0.20 to 0.55
        alphaPhase: Math.random() * Math.PI * 2,
        alphaSpeed: 1.2 + Math.random() * 2.0,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.8 + Math.random() * 1.2,
        wobbleAmp: 8 + Math.random() * 16,
      }));

      bokehParticles = Array.from({ length: bokehCount }, () => ({
        type: 'bokeh',
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 3 + Math.random() * 5, // 3 to 8 px/sec
        radius: 6 + Math.random() * 12, // 6 to 18px
        alpha: 0.08,
      }));

      sparkleParticles = Array.from({ length: sparkleCount }, () => ({
        type: 'sparkle',
        x: Math.random() * width,
        y: Math.random() * height,
        size: 6 + Math.random() * 4, // 6 to 10px
        cycleDuration: 2 + Math.random() * 2, // 2 to 4 seconds
        timeAlive: Math.random() * 4,
      }));
    };

    const drawSparkle = (x: number, y: number, size: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.fillStyle = '#FFFFFF';

      const half = size / 2;

      ctx.beginPath();
      ctx.moveTo(x, y - half);
      ctx.quadraticCurveTo(x, y, x + half, y);
      ctx.quadraticCurveTo(x, y, x, y + half);
      ctx.quadraticCurveTo(x, y, x - half, y);
      ctx.quadraticCurveTo(x, y, x, y - half);
      ctx.closePath();
      ctx.fill();

      // Core tiny bright dot
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    };

    const renderFrame = (dt: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Bokeh (white, center alpha 0.08)
      for (const b of bokehParticles) {
        if (!reduceMotion) {
          b.y -= (b.vy * dt) / 1000;
          if (b.y < -b.radius) {
            b.y = height + b.radius;
            b.x = Math.random() * width;
          }
        }

        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.radius);
        grad.addColorStop(0, `rgba(255, 255, 255, ${b.alpha})`);
        grad.addColorStop(0.6, `rgba(255, 255, 255, ${b.alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 2. Draw Dust
      for (const d of dustParticles) {
        if (!reduceMotion) {
          d.y -= (d.vy * dt) / 1000;
          d.wobblePhase += (d.wobbleSpeed * dt) / 1000;
          d.alphaPhase += (d.alphaSpeed * dt) / 1000;

          if (d.y < -10) {
            d.y = height + 10;
            d.x = Math.random() * width;
            d.color = pickDustColor();
            d.baseAlpha = 0.20 + Math.random() * 0.35;
          }
        }

        const wobbleX = Math.sin(d.wobblePhase) * d.wobbleAmp * 0.3;
        let currentX = d.x + wobbleX;
        let currentY = d.y;
        let extraAlpha = 0;

        // Subtle mouse push if within 130px (desktop fine pointer only)
        if (isFinePointer && mouse.active && !reduceMotion) {
          const dx = currentX - mouse.x;
          const dy = currentY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130 && dist > 0) {
            const force = (1 - dist / 130) * 16;
            currentX += (dx / dist) * force;
            currentY += (dy / dist) * force;
            extraAlpha = (1 - dist / 130) * 0.3;
          }
        }

        const twinkle = Math.sin(d.alphaPhase) * 0.18;
        const currentAlpha = Math.max(0.1, Math.min(0.95, d.baseAlpha + twinkle + extraAlpha));

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, d.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Sparkles
      for (const s of sparkleParticles) {
        if (!reduceMotion) {
          s.timeAlive += dt / 1000;
          if (s.timeAlive >= s.cycleDuration) {
            s.timeAlive = 0;
            s.x = Math.random() * width;
            s.y = Math.random() * height;
            s.cycleDuration = 2 + Math.random() * 2;
          }
        }

        const progress = (s.timeAlive % s.cycleDuration) / s.cycleDuration;
        // Sinusoidal pulse between 0.2 and 0.95
        const pulse = 0.2 + 0.75 * Math.sin(progress * Math.PI);

        drawSparkle(s.x, s.y, s.size, pulse);
      }
    };

    const animate = (now: number) => {
      if (!isVisible) {
        rafId = null;
        return;
      }
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      renderFrame(dt);

      rafId = requestAnimationFrame(animate);
    };

    const resize = () => {
      const targetEl = containerRef?.current || canvas.parentElement;
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();

      if (reduceMotion) {
        renderFrame(16);
      }
    };

    resize();

    // Mouse listeners for fine pointer
    const handlePointerMove = (e: PointerEvent) => {
      if (!isFinePointer || e.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const targetEl = containerRef?.current || canvas.parentElement;
    if (targetEl && isFinePointer) {
      targetEl.addEventListener('pointermove', handlePointerMove, { passive: true });
      targetEl.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    // ResizeObserver
    const ro = new ResizeObserver(() => {
      resize();
    });
    if (targetEl) {
      ro.observe(targetEl);
    }

    // IntersectionObserver to pause when off-screen
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? true;
        if (isVisible && !rafId && !reduceMotion) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    if (targetEl) {
      io.observe(targetEl);
    }

    // Page Visibility API
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
        if (!rafId && !reduceMotion) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(animate);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial frame or start loop
    if (reduceMotion) {
      renderFrame(16);
    } else {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (targetEl && isFinePointer) {
        targetEl.removeEventListener('pointermove', handlePointerMove);
        targetEl.removeEventListener('pointerleave', handlePointerLeave);
      }
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-[3]"
      aria-hidden="true"
    />
  );
};
