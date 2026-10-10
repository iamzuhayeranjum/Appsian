import React from 'react';
import { motion } from 'motion/react';
import { content } from '../content';

export const IntegrationsStrip: React.FC = () => {
  const { caption, tools } = content.integrations;

  return (
    <section className="w-full bg-[#F5F6F7] overflow-hidden pt-[130px] pb-[150px]">
      <div className="max-w-[1187px] mx-auto px-4 text-center">
        {/* Caption starts 130px below the hero bottom edge */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-[13px] uppercase tracking-[0.06em] text-[#5B5F68] font-[500] mb-[56px]"
        >
          {caption}
        </motion.p>

        {/* Logo row sits 56px below caption */}
        {/* TODO: Swap in verified brand SVG logos when available */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 16 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-y-4 gap-x-2 sm:gap-x-0 max-w-4xl mx-auto"
        >
          {tools.map((tool, idx) => (
            <React.Fragment key={tool.name}>
              <div className="px-4 sm:px-6 md:px-7 py-1 text-[#9A9EA8] hover:text-[#0B0B0F] transition-colors duration-200">
                <span className="text-sm sm:text-base md:text-lg font-normal tracking-tight font-display select-none">
                  {tool.name}
                </span>
              </div>
              {idx < tools.length - 1 && (
                <div className="hidden sm:block w-[1px] h-4 bg-[rgba(11,11,15,0.08)] shrink-0" />
              )}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
