import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Mail } from 'lucide-react';

// 1. Eyebrow Pill
export interface EyebrowPillProps {
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
  icon?: React.ReactNode;
}

export const EyebrowPill: React.FC<EyebrowPillProps> = ({
  children,
  theme = 'light',
  className = '',
  icon,
}) => {
  const isDark = theme === 'dark';
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[11px] font-medium tracking-[0.05em] uppercase font-sans mb-3 select-none ${
        isDark
          ? 'bg-white/10 text-white/90 border border-white/15'
          : 'bg-white text-[#0B0B0F] border border-[rgba(11,11,15,0.08)] shadow-xs'
      } ${className}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};

// 2. Headline with mixed weight segments
export interface HeadlineSegment {
  text: string;
  weight?: 'light' | 'strong' | string;
}

export interface HeadlineProps {
  as?: 'h1' | 'h2' | 'h3';
  theme?: 'light' | 'dark';
  segments?: HeadlineSegment[];
  className?: string;
}

export const Headline: React.FC<HeadlineProps> = ({
  as: Component = 'h2',
  theme = 'light',
  segments = [],
  className = '',
}) => {
  const isDark = theme === 'dark';
  return (
    <Component
      className={`font-display tracking-[-0.03em] leading-[1.15] text-[32px] sm:text-[40px] md:text-[44px] ${
        isDark ? 'text-white' : 'text-[#0B0B0F]'
      } ${className}`}
    >
      {segments.map((seg, idx) => {
        const isLight = seg.weight === 'light';
        return (
          <span
            key={idx}
            className={`${
              isLight
                ? 'font-normal opacity-70'
                : 'font-medium opacity-100'
            } ${idx > 0 ? ' ml-2' : ''}`}
          >
            {seg.text}
          </span>
        );
      })}
    </Component>
  );
};

// 3. Section Header
export interface SectionHeaderProps {
  theme?: 'light' | 'dark';
  eyebrow?: React.ReactNode;
  headline?: HeadlineSegment[];
  subline?: string;
  sub?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  theme = 'light',
  eyebrow,
  headline = [],
  subline,
  sub,
  className = '',
}) => {
  const subtitle = subline || sub;
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col items-center text-center mb-12 sm:mb-16 ${className}`}>
      {eyebrow && (
        <div className="mb-2">
          {typeof eyebrow === 'string' ? (
            <EyebrowPill theme={theme}>{eyebrow}</EyebrowPill>
          ) : (
            eyebrow
          )}
        </div>
      )}
      {headline.length > 0 && <Headline theme={theme} segments={headline} />}
      {subtitle && (
        <p
          className={`mt-4 max-w-xl text-[15px] sm:text-[17px] leading-[26px] ${
            isDark ? 'text-white/70' : 'text-[#5B5F68]'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 4. Section container primitive
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  className?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  theme = 'light',
  className = '',
  ...props
}) => {
  const isDark = theme === 'dark';
  return (
    <section
      className={`w-full py-16 md:py-24 px-4 sm:px-6 flex justify-center ${
        isDark ? 'bg-[#060608] text-white' : 'bg-[#F5F6F7] text-[#0B0B0F]'
      } ${className}`}
      {...props}
    >
      <div className="w-full max-w-[1200px]">{children}</div>
    </section>
  );
};

// 5. Card
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  theme?: 'light' | 'dark';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  theme = 'light',
  ...props
}) => {
  const isDark = theme === 'dark';
  return (
    <div
      className={`rounded-[20px] transition-all duration-300 ${
        isDark
          ? 'bg-[#060608] border border-white/10 text-white'
          : 'bg-white border border-[rgba(11,11,15,0.08)] text-[#0B0B0F] shadow-[0_2px_8px_rgba(11,11,15,0.04)] hover:shadow-[0_8px_24px_rgba(11,11,15,0.06)] hover:-translate-y-1'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 6. GlassCard
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-[20px] bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// 7. Chip
export interface ChipProps {
  children?: React.ReactNode;
  active?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  theme = 'light',
  className = '',
  onClick,
}) => {
  const isDark = theme === 'dark';

  let stateClasses = '';
  if (isDark) {
    stateClasses = active
      ? 'bg-[#6EEDC2]/20 text-[#6EEDC2] border border-[#6EEDC2]/40'
      : 'bg-white/5 text-[#9A9EA8] border border-white/8 hover:bg-white/10';
  } else {
    stateClasses = active
      ? 'bg-[#0B0B0F] text-white border border-[#0B0B0F]'
      : 'bg-[#EEF0F2] text-[#5B5F68] border border-[rgba(11,11,15,0.06)] hover:text-[#0B0B0F]';
  }

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-xs font-medium transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${stateClasses} ${className}`}
    >
      {children}
    </span>
  );
};

// 8. Button
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'glass' | 'secondary' | 'link-icon';
  theme?: 'light' | 'dark' | string;
  size?: 'sm' | 'md' | 'lg' | string;
  forceHover?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  theme = 'light',
  size = 'md',
  forceHover = false,
  children,
  className = '',
  ...props
}) => {
  const isDark = theme === 'dark';

  let sizeClasses = 'px-5 py-2.5 text-sm';
  if (size === 'sm') {
    sizeClasses = 'px-3 py-1.5 text-xs';
  } else if (size === 'lg') {
    sizeClasses = 'px-6 py-3 text-base';
  }

  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = 'btn-premium btn-premium--mint rounded-[10px]';
  } else if (variant === 'glass') {
    if (isDark) {
      variantClasses = 'btn-premium btn-premium--dark rounded-[10px]';
    } else {
      variantClasses = 'btn-premium btn-premium--light rounded-[10px]';
    }
  } else if (variant === 'secondary') {
    variantClasses = 'btn-premium btn-premium--light rounded-[10px]';
  } else if (variant === 'link-icon') {
    return (
      <button
        className={`group inline-flex items-center gap-1.5 font-medium text-sm transition-all cursor-pointer ${
          isDark ? 'text-white hover:text-[#6EEDC2]' : 'text-[#0B0B0F] hover:text-[#062B20]'
        } ${className}`}
        {...props}
      >
        <span className="relative">
          {children}
          <span
            className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ${
              isDark ? 'bg-[#6EEDC2]' : 'bg-[#0B0B0F]'
            } ${forceHover ? 'w-full' : 'w-0 group-hover:w-full'}`}
          />
        </span>
        <ArrowUpRight
          className={`w-4 h-4 transition-transform duration-200 ${
            forceHover ? 'translate-x-0.5 -translate-y-0.5' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
          } ${isDark ? 'text-[#6EEDC2]' : 'text-[#0B0B0F]'}`}
        />
      </button>
    );
  }

  return (
    <button
      className={`inline-flex items-center justify-center font-sans cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// 9. IconSquareLink
export interface IconSquareLinkProps {
  href?: string;
  className?: string;
}

export const IconSquareLink: React.FC<IconSquareLinkProps> = ({
  href = '#',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`w-8 h-8 rounded-[8px] bg-[#EEF0F2] border border-[rgba(11,11,15,0.08)] flex items-center justify-center text-[#0B0B0F] hover:bg-[#E2E4E8] transition-colors shadow-xs ${className}`}
    >
      <ArrowUpRight className="w-3.5 h-3.5" />
    </a>
  );
};

// 10. FormBar
export interface FormBarProps {
  theme?: 'light' | 'dark';
  buttonText?: string;
  placeholder?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export const FormBar: React.FC<FormBarProps> = ({
  theme = 'light',
  buttonText = 'Book a Demo',
  placeholder = 'Work email',
  onSubmit,
  className = '',
}) => {
  const [email, setEmail] = React.useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full h-[52px] rounded-[14px] p-1.5 flex items-center gap-2 border transition-all ${
        isDark
          ? 'bg-white/5 border-white/15'
          : 'bg-white border-[rgba(11,11,15,0.1)] shadow-sm'
      } ${className}`}
    >
      <div className="relative flex-1 h-full flex items-center">
        <Mail
          className={`w-4 h-4 absolute left-3.5 pointer-events-none ${
            isDark ? 'text-white/40' : 'text-[#9A9EA8]'
          }`}
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-full pl-10 pr-3 text-xs sm:text-sm bg-transparent focus:outline-none ${
            isDark
              ? 'text-white placeholder-white/40'
              : 'text-[#0B0B0F] placeholder-[#9A9EA8]'
          }`}
        />
      </div>
      <Button variant="primary" type="submit" size="sm" className="!h-[40px] shrink-0">
        {buttonText}
      </Button>
    </form>
  );
};

// 11. Reveal
export interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 12. BackgroundTexture
export interface BackgroundTextureProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export const BackgroundTexture: React.FC<BackgroundTextureProps> = ({
  theme = 'dark',
  className = '',
}) => {
  if (theme === 'dark') {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(110,237,194,0.06), transparent 70%), radial-gradient(circle at 80% 100%, rgba(99,102,241,0.08), transparent 60%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(11,11,15,0.02), transparent 70%)',
        }}
      />
    </div>
  );
};
