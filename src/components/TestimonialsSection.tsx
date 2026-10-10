import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { content } from '../content';
import { Star } from 'lucide-react';
import { SectionHeader, EyebrowPill, BackgroundTexture } from './design-system';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = content;
  const [currentIndex, setCurrentIndex] = useState(1);

  // Auto-advance every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  const nextIndex = (currentIndex + 1) % testimonials.length;

  const currentTestimonial = testimonials[currentIndex];
  const prevTestimonial = testimonials[prevIndex];
  const nextTestimonial = testimonials[nextIndex];

  // Duotone portrait gradients
  const duotoneGradients = [
    'linear-gradient(135deg, #092c3e 0%, #115e75 45%, #67e8f9 100%)',
    'linear-gradient(135deg, #2e1065 0%, #581c87 45%, #f472b6 100%)',
    'linear-gradient(135deg, #0f172a 0%, #312e81 48%, #818cf8 100%)',
  ];

  return (
    <section className="w-full pb-[120px] bg-[#F5F6F7] flex justify-center px-4 sm:px-6">
      {/* 28px-radius dark container inset 24px from viewport edges */}
      <div className="w-full max-w-[1248px] rounded-[28px] bg-[#060608] border border-[rgba(255,255,255,0.08)] py-16 md:py-20 px-6 sm:px-10 relative overflow-hidden text-[#F4F5F7]">
        <BackgroundTexture theme="dark" />

        <div className="relative z-10 max-w-[1187px] mx-auto">
          {/* Headline */}
          <SectionHeader
            theme="dark"
            eyebrow={<EyebrowPill theme="dark">Track Record</EyebrowPill>}
            headline={[
              { text: 'Proof', weight: 'light' },
              { text: "It's Working", weight: 'strong' },
            ]}
          />

          {/* Cards carousel */}
          <div className="flex items-center justify-center gap-[24px] max-w-[968px] mx-auto min-h-[350px]">
            {/* Left side card */}
            <motion.div
              onClick={() => setCurrentIndex(prevIndex)}
              whileHover={{ scale: 0.98, opacity: 0.85 }}
              className="hidden md:flex w-[198px] h-[350px] rounded-[20px] overflow-hidden opacity-60 scale-95 cursor-pointer shrink-0 relative items-center justify-center shadow-lg border border-white/10"
            >
              {/* PLACEHOLDER: replace with a real founding-client quote */}
              <div
                className="w-full h-full flex flex-col justify-end p-5 text-white relative"
                style={{ background: duotoneGradients[prevIndex % duotoneGradients.length] }}
              >
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-[8px] bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-semibold mb-2">
                    {prevTestimonial.initials}
                  </div>
                  <div className="text-xs font-semibold">{prevTestimonial.name}</div>
                  <div className="text-[10px] text-white/70 truncate">{prevTestimonial.company}</div>
                </div>
              </div>
            </motion.div>

            {/* Center card: 480x350, 20px radius */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full sm:w-[480px] h-[350px] bg-white rounded-[20px] overflow-hidden flex flex-row shadow-2 shrink-0 z-20 text-[#0B0B0F]"
              >
                {/* PLACEHOLDER: replace with a real founding-client quote */}
                {/* 180px image panel on left with duotone gradient */}
                <div
                  className="w-[180px] h-full shrink-0 flex flex-col justify-end p-5 text-white relative overflow-hidden"
                  style={{ background: duotoneGradients[currentIndex % duotoneGradients.length] }}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-[8px] bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-sm font-bold mb-2.5 shadow-md">
                      {currentTestimonial.initials}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.06em] font-[500] bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-[4px] inline-block">
                      Founding Client
                    </span>
                  </div>
                </div>

                {/* Quote, name, role and 5 stars on right */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* 5 gold stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-[13px] leading-[22px] text-[#5B5F68] italic">
                      &ldquo;{currentTestimonial.quote}&rdquo;
                    </p>
                  </div>

                  {/* Author attribution */}
                  <div className="pt-2 border-t border-[rgba(11,11,15,0.08)]">
                    <div className="text-xs font-semibold text-[#0B0B0F]">
                      {currentTestimonial.name}
                    </div>
                    <div className="text-[11px] text-[#5B5F68]">
                      {currentTestimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Right side card */}
            <motion.div
              onClick={() => setCurrentIndex(nextIndex)}
              whileHover={{ scale: 0.98, opacity: 0.85 }}
              className="hidden md:flex w-[198px] h-[350px] rounded-[20px] overflow-hidden opacity-60 scale-95 cursor-pointer shrink-0 relative items-center justify-center shadow-lg border border-white/10"
            >
              {/* PLACEHOLDER: replace with a real founding-client quote */}
              <div
                className="w-full h-full flex flex-col justify-end p-5 text-white relative"
                style={{ background: duotoneGradients[nextIndex % duotoneGradients.length] }}
              >
                <div className="absolute inset-0 bg-black/25" />
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-[8px] bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-semibold mb-2">
                    {nextTestimonial.initials}
                  </div>
                  <div className="text-xs font-semibold">{nextTestimonial.name}</div>
                  <div className="text-[10px] text-white/70 truncate">{nextTestimonial.company}</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
