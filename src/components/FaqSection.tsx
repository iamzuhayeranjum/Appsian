import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content, FaqItem } from '../content';
import { Plus, Minus } from 'lucide-react';
import { SectionHeader, EyebrowPill, Reveal } from './design-system';

export const FaqSection: React.FC = () => {
  const { faq } = content;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const renderFaqRow = (item: FaqItem) => {
    const isOpen = openId === item.id;

    return (
      <div
        key={item.id}
        className="w-full bg-white border border-[rgba(11,11,15,0.08)] rounded-[14px] transition-all duration-200 overflow-hidden shadow-1 hover:shadow-2"
      >
        <button
          type="button"
          onClick={() => toggleItem(item.id)}
          className="w-full min-h-[72px] px-6 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="text-[15px] sm:text-[16px] font-display font-[500] text-[#0B0B0F] pr-4 leading-snug">
            {item.question}
          </span>
          <div className="w-7 h-7 rounded-[8px] bg-[#EEF0F2] flex items-center justify-center shrink-0 text-[#0B0B0F] transition-all duration-200">
            {isOpen ? <Minus className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
          </div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-5 pt-1 text-[14px] leading-[23px] text-[#5B5F68] font-sans border-t border-[rgba(11,11,15,0.04)]">
                {item.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="faq" className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-[1187px]">
        {/* Section Header */}
        <SectionHeader
          eyebrow={<EyebrowPill>Common Inquiries</EyebrowPill>}
          headline={[
            { text: 'Questions', weight: 'light' },
            { text: 'You May Have', weight: 'strong' },
          ]}
        />

        {/* Two columns, about 580px each, rows with 14px gap */}
        <Reveal delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
            {/* Left column */}
            <div className="flex flex-col gap-3.5">
              {faq.leftColumn.map((item) => renderFaqRow(item))}
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-3.5">
              {faq.rightColumn.map((item) => renderFaqRow(item))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
