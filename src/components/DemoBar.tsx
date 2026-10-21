import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';
import { useAppReady } from './Preloader';

interface DemoBarProps {
  onSuccess?: () => void;
}

export const DemoBar: React.FC<DemoBarProps> = ({ onSuccess }) => {
  const appReady = useAppReady();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    let message = '';

    if (!name.trim()) {
      setNameError(true);
      hasError = true;
      message = 'Please provide your name to request a demo.';
    } else {
      setNameError(false);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setEmailError(true);
      hasError = true;
      message = message || 'Please enter a valid work email address.';
    } else {
      setEmailError(false);
    }

    if (hasError) {
      setErrorMessage(message);
      return;
    }

    setErrorMessage('');
    // TODO: connect to backend/CRM
    setIsSuccess(true);
    setName('');
    setEmail('');
    setNameFocused(false);
    setEmailFocused(false);

    if (onSuccess) {
      onSuccess();
    }
  };

  const isAnyFieldFocused = nameFocused || emailFocused;

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 14 }}
      animate={
        appReady
          ? { opacity: 1, filter: 'blur(0px)', y: 0 }
          : { opacity: 0, filter: 'blur(10px)', y: 14 }
      }
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[652px] px-4 sm:px-0 mt-8 z-30 relative flex flex-col items-center"
    >
      {/* Outer Rim: 6px translucent halo around the bar */}
      <div
        className="w-full p-[6px] rounded-[18px] transition-all duration-300"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
        }}
      >
        {/* Inner Bar: 640px wide, 64px tall, radius 12px */}
        <form
          onSubmit={handleSubmit}
          className={`w-full sm:h-[64px] rounded-[12px] p-2 sm:p-0 sm:pr-[6px] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 transition-all duration-300 ${
            isAnyFieldFocused
              ? 'ring-[1.5px] ring-[rgba(110,237,194,0.7)]'
              : 'ring-0'
          }`}
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.08) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            boxShadow:
              'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 10px 40px rgba(20, 10, 60, 0.35)',
          }}
        >
          {/* Inputs Container */}
          <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-0 h-full items-center">
            {/* Field 1: Name* */}
            <div
              className={`relative h-12 sm:h-full flex flex-col justify-center pl-[20px] pr-3 rounded-lg transition-all ${
                nameError
                  ? 'ring-1 ring-rose-400/80 bg-rose-500/10'
                  : ''
              }`}
            >
              <label
                htmlFor="demo-name"
                className={`absolute left-[20px] font-sans pointer-events-none transition-all duration-200 ${
                  nameFocused || name.length > 0
                    ? 'top-2 text-[11px] text-white/90 font-medium'
                    : 'top-1/2 -translate-y-1/2 text-[15px] text-white/80'
                }`}
              >
                Name*
              </label>
              <input
                id="demo-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) {
                    setNameError(false);
                    setErrorMessage('');
                  }
                }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className={`w-full bg-transparent text-white text-[15px] font-sans focus:outline-none ${
                  nameFocused || name.length > 0 ? 'pt-3.5 pb-0.5' : 'py-2'
                }`}
              />
            </div>

            {/* Field 2: Email* */}
            <div
              className={`relative h-12 sm:h-full flex flex-col justify-center pl-[20px] pr-3 rounded-lg transition-all ${
                emailError
                  ? 'ring-1 ring-rose-400/80 bg-rose-500/10'
                  : ''
              }`}
            >
              <label
                htmlFor="demo-email"
                className={`absolute left-[20px] font-sans pointer-events-none transition-all duration-200 ${
                  emailFocused || email.length > 0
                    ? 'top-2 text-[11px] text-white/90 font-medium'
                    : 'top-1/2 -translate-y-1/2 text-[15px] text-white/80'
                }`}
              >
                Email*
              </label>
              <input
                id="demo-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) {
                    setEmailError(false);
                    setErrorMessage('');
                  }
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                className={`w-full bg-transparent text-white text-[15px] font-sans focus:outline-none ${
                  emailFocused || email.length > 0 ? 'pt-3.5 pb-0.5' : 'py-2'
                }`}
              />
            </div>
          </div>

          {/* Button on the right, inset 6px */}
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSuccess}
              className={`btn-premium btn-premium--mint btn-glitter group w-full sm:w-auto h-[52px] rounded-[10px] px-[22px] font-sans font-medium text-[15px] flex items-center justify-center gap-3 cursor-pointer ${
                isSuccess ? 'opacity-95 cursor-default' : ''
              }`}
            >
              {isSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Request Received</span>
                </>
              ) : (
                <>
                  <span>Get Free Demo</span>
                  <ArrowRight className="btn-arrow w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Inline validation message under the bar */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-[13px] text-white/85 bg-rose-950/60 border border-rose-500/40 rounded-full px-4 py-1 mt-2.5 shadow-sm"
          >
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
