import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ButtonVariant, ButtonSize } from './types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  theme?: 'light' | 'dark';
  icon?: React.ReactNode;
  forceHover?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  theme = 'light',
  icon,
  className = '',
  disabled = false,
  forceHover = false,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [canMagnetic, setCanMagnetic] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setCanMagnetic(!isTouch && !isReduced);
    }
  }, []);

  const activeHover = forceHover || isHovered;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!canMagnetic || disabled || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    const clampedX = Math.max(-6, Math.min(6, deltaX));
    const clampedY = Math.max(-6, Math.min(6, deltaY));
    setMagneticOffset({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMagneticOffset({ x: 0, y: 0 });
  };

  // Base focus ring styling for accessibility
  const focusRingClasses =
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0F]/30 focus-visible:ring-offset-2';

  // 1. PRIMARY VARIANT (Mint)
  if (variant === 'primary') {
    return (
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
          transition: isHovered
            ? 'transform 100ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 300ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
        className={`relative h-[44px] px-[18px] rounded-[8px] bg-[#6EEDC2] text-[#062B20] text-[14px] font-[500] tracking-[-0.01em] overflow-hidden select-none cursor-pointer flex items-center justify-center gap-2 mint-btn-highlight active:scale-[0.98] transition-all duration-200 ${
          activeHover ? '-translate-y-[1px] shadow-[0_8px_30px_rgba(110,237,194,0.35)]' : ''
        } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${focusRingClasses} ${className}`}
        {...props}
      >
        {/* Diagonal light sweep */}
        {activeHover && (
          <span className="pointer-events-none absolute inset-0 w-[40px] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sweep" />
        )}

        <span className="relative z-10">{children}</span>

        {/* Trailing arrow with exit right & clone enter from left animation */}
        <span className="relative w-4 h-4 overflow-hidden inline-flex items-center justify-center shrink-0">
          {/* Default arrow exiting right */}
          <motion.span
            initial={false}
            animate={{
              x: activeHover ? 20 : 0,
              opacity: activeHover ? 0 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon || <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />}
          </motion.span>

          {/* Clone arrow entering from left */}
          <motion.span
            initial={false}
            animate={{
              x: activeHover ? 0 : -20,
              opacity: activeHover ? 1 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon || <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />}
          </motion.span>
        </span>
      </button>
    );
  }

  // 2. LINK-ICON VARIANT
  if (variant === 'link-icon') {
    return (
      <button
        ref={buttonRef}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group inline-flex items-center gap-2.5 text-[14px] font-[500] cursor-pointer py-1 select-none ${
          theme === 'dark' ? 'text-[#F4F5F7]' : 'text-[#0B0B0F]'
        } ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${focusRingClasses} ${className}`}
        {...props}
      >
        {/* Text with redraw underline on hover */}
        <span className="relative py-0.5">
          <span>{children}</span>
          <span
            className={`absolute bottom-0 left-0 w-full h-[1px] origin-left transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              theme === 'dark' ? 'bg-[#F4F5F7]' : 'bg-[#0B0B0F]'
            } ${activeHover ? 'scale-x-100' : 'scale-x-0'}`}
          />
        </span>

        {/* 28px mint rounded square holding an icon with diagonal swap */}
        <span className="relative w-[28px] h-[28px] rounded-[8px] bg-[#6EEDC2] text-[#062B20] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
          {/* Exiting up-right */}
          <motion.span
            initial={false}
            animate={{
              x: activeHover ? 16 : 0,
              y: activeHover ? -16 : 0,
              opacity: activeHover ? 0 : 1,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon || <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />}
          </motion.span>

          {/* Entering from bottom-left */}
          <motion.span
            initial={false}
            animate={{
              x: activeHover ? 0 : -16,
              y: activeHover ? 0 : 16,
              opacity: activeHover ? 1 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon || <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />}
          </motion.span>
        </span>
      </button>
    );
  }

  // 3. GLASS / SECONDARY VARIANT
  const isDark = theme === 'dark';
  const lightStyles =
    'bg-[#FFFFFF] border border-[rgba(11,11,15,0.08)] text-[#0B0B0F] shadow-1 hover:border-[rgba(11,11,15,0.18)] hover:bg-[#FAFAFB]';
  const darkStyles =
    'bg-white/6 border border-white/12 text-[#F4F5F7] hover:border-white/22 hover:bg-white/10';

  return (
    <button
      ref={buttonRef}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-[44px] px-[18px] rounded-[8px] text-[14px] font-[500] tracking-[-0.01em] select-none cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 ${
        isDark ? darkStyles : lightStyles
      } ${activeHover ? '-translate-y-[1px]' : ''} ${
        disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
      } ${focusRingClasses} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
    </button>
  );
};
