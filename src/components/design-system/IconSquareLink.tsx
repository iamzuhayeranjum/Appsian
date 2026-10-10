import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface IconSquareLinkProps {
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}

export const IconSquareLink: React.FC<IconSquareLinkProps> = ({
  href,
  onClick,
  icon,
  ariaLabel = 'Open link',
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <span
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-[28px] h-[28px] rounded-[8px] bg-[#6EEDC2] text-[#062B20] flex items-center justify-center overflow-hidden shrink-0 shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0B0F]/30 focus-visible:ring-offset-2 ${className}`}
      aria-label={ariaLabel}
    >
      <motion.span
        initial={false}
        animate={{
          x: isHovered ? 16 : 0,
          y: isHovered ? -16 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {icon || <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />}
      </motion.span>

      <motion.span
        initial={false}
        animate={{
          x: isHovered ? 0 : -16,
          y: isHovered ? 0 : 16,
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {icon || <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.2]" />}
      </motion.span>
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-block bg-transparent p-0 border-0">
      {content}
    </button>
  );
};
