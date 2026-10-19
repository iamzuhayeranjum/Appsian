import React, { forwardRef } from 'react';
import { motion } from 'motion/react';
import { Phone, Sparkles, HelpCircle, DollarSign, Award, Layers } from 'lucide-react';

interface MorePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: (href: string) => void;
  activeSection?: string;
}

export const MorePanel = forwardRef<HTMLDivElement, MorePanelProps>(
  ({ onMouseEnter, onMouseLeave, onNavigate, onClose }, ref) => {
    const items = [
      {
        title: 'Meet Appsian',
        desc: 'Interactive phone agent breakdown',
        href: '#meet-appsian',
        icon: Phone,
      },
      {
        title: 'Features',
        desc: 'Real-time booking & call flow',
        href: '#features',
        icon: Sparkles,
      },
      {
        title: 'Toolverse',
        desc: 'Sync with ServiceTitan, Jobber & more',
        href: '#toolverse',
        icon: Layers,
      },
      {
        title: 'Results',
        desc: 'Customer stories & ROI proof',
        href: '#results',
        icon: Award,
      },
      {
        title: 'Pricing',
        desc: 'Simple monthly plans for any trade',
        href: '#pricing',
        icon: DollarSign,
      },
      {
        title: 'FAQ',
        desc: 'Setup time, porting & guarantees',
        href: '#faq',
        icon: HelpCircle,
      },
    ];

    const handleClick = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      onClose();
    };

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-[580px] p-4 rounded-[22px] bg-[#0E131F]/95 backdrop-blur-xl border border-white/10 shadow-2xl z-50 text-white"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <a
                key={it.href}
                href={it.href}
                onClick={(e) => handleClick(e, it.href)}
                className="flex items-start gap-3 p-3 rounded-[14px] hover:bg-white/[0.06] transition-colors group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[8px] bg-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-[#2F6BFF] transition-colors text-white">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-white group-hover:text-[#6FB1FF] transition-colors">
                    {it.title}
                  </div>
                  <div className="text-[12px] text-white/50 leading-tight mt-0.5">
                    {it.desc}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </motion.div>
    );
  }
);

MorePanel.displayName = 'MorePanel';
