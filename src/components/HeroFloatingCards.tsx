import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { PhoneIncoming, CalendarCheck, UserPlus } from 'lucide-react';

interface HeroFloatingCardsProps {
  appReady?: boolean;
  containerRef?: React.RefObject<HTMLElement | null>;
}

export const HeroFloatingCards: React.FC<HeroFloatingCardsProps> = ({
  appReady = true,
  containerRef,
}) => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mouse parallax motion values (normalized -1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (reduceMotion) return;
    const isFine = window.matchMedia('(pointer: fine)').matches;
    if (!isFine) return;

    const target = containerRef?.current || window;

    const handlePointerMove = (e: Event) => {
      const pe = e as PointerEvent;
      let cx = window.innerWidth / 2;
      let cy = window.innerHeight / 2;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
      }

      const dx = (pe.clientX - cx) / (window.innerWidth / 2);
      const dy = (pe.clientY - cy) / (window.innerHeight / 2);

      // Clamp between -1 and 1
      mouseX.set(Math.max(-1, Math.min(1, dx)));
      mouseY.set(Math.max(-1, Math.min(1, dy)));
    };

    const handlePointerLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    target.addEventListener('pointermove', handlePointerMove, { passive: true });
    target.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      target.removeEventListener('pointermove', handlePointerMove);
      target.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [containerRef, reduceMotion, mouseX, mouseY]);

  const cardGlassStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.16)',
    border: '1px solid rgba(255, 255, 255, 0.32)',
    backdropFilter: 'blur(20px) saturate(170%)',
    WebkitBackdropFilter: 'blur(20px) saturate(170%)',
    boxShadow:
      'inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 18px 50px -20px rgba(4, 30, 100, 0.55)',
  };

  const iconGradientStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #5aa9ff 0%, #8fd8ff 100%)',
  };

  return (
    <div
      className="hidden xl:block absolute inset-0 pointer-events-none select-none z-15 overflow-hidden"
      aria-hidden="true"
    >
      {/* Card 1 (left side, ~24% from top, ~9% from left edge) */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        animate={
          appReady
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.92, y: 20 }
        }
        transition={{
          duration: reduceMotion ? 0.3 : 0.6,
          delay: reduceMotion ? 0 : 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'absolute',
          top: '24%',
          left: '9%',
        }}
        className="pointer-events-none"
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  y: [-6, 6, -6],
                }
          }
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            style={{
              ...cardGlassStyle,
              x: reduceMotion ? 0 : smoothX ? -12 * (smoothX.get() || 0) : 0,
              y: reduceMotion ? 0 : smoothY ? -10 * (smoothY.get() || 0) : 0,
            }}
            className="rounded-[16px] px-[14px] py-[10px] flex items-center gap-3"
          >
            <div
              className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-xs"
              style={iconGradientStyle}
            >
              <PhoneIncoming className="w-[15px] h-[15px] stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold leading-tight text-white">
                Call answered
              </span>
              <span
                className="text-[11.5px] leading-tight mt-0.5"
                style={{ color: 'rgba(255, 255, 255, 0.78)' }}
              >
                11:42 PM · After hours
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Card 2 (right side, ~38% from top, ~8% from right edge) */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        animate={
          appReady
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.92, y: 20 }
        }
        transition={{
          duration: reduceMotion ? 0.3 : 0.6,
          delay: reduceMotion ? 0 : 0.47,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'absolute',
          top: '38%',
          right: '8%',
        }}
        className="pointer-events-none"
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  y: [5, -5, 5],
                }
          }
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.8,
          }}
        >
          <motion.div
            style={{
              ...cardGlassStyle,
              x: reduceMotion ? 0 : smoothX ? -14 * (smoothX.get() || 0) : 0,
              y: reduceMotion ? 0 : smoothY ? -12 * (smoothY.get() || 0) : 0,
            }}
            className="rounded-[16px] px-[14px] py-[10px] flex items-center gap-3"
          >
            <div
              className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-xs"
              style={iconGradientStyle}
            >
              <CalendarCheck className="w-[15px] h-[15px] stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold leading-tight text-white">
                Job booked
              </span>
              <span
                className="text-[11.5px] leading-tight mt-0.5"
                style={{ color: 'rgba(255, 255, 255, 0.78)' }}
              >
                Tomorrow, 10:00 AM
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Card 3 (left side, ~58% from top, ~13% from left edge) */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
        animate={
          appReady
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.92, y: 20 }
        }
        transition={{
          duration: reduceMotion ? 0.3 : 0.6,
          delay: reduceMotion ? 0 : 0.59,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          position: 'absolute',
          top: '58%',
          left: '13%',
        }}
        className="pointer-events-none"
      >
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  y: [-4, 6, -4],
                }
          }
          transition={{
            duration: 7.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1.5,
          }}
        >
          <motion.div
            style={{
              ...cardGlassStyle,
              x: reduceMotion ? 0 : smoothX ? -10 * (smoothX.get() || 0) : 0,
              y: reduceMotion ? 0 : smoothY ? -8 * (smoothY.get() || 0) : 0,
            }}
            className="rounded-[16px] px-[14px] py-[10px] flex items-center gap-3"
          >
            <div
              className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-xs"
              style={iconGradientStyle}
            >
              <UserPlus className="w-[15px] h-[15px] stroke-[2.2]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold leading-tight text-white">
                New lead captured
              </span>
              <span
                className="text-[11.5px] leading-tight mt-0.5"
                style={{ color: 'rgba(255, 255, 255, 0.78)' }}
              >
                Leaky pipe · Zach P.
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
