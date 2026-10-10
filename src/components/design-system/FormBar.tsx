import React, { useState } from 'react';
import { Button } from './Button';
import { Check } from 'lucide-react';

interface FormBarProps {
  onSubmit?: (data: { name: string; email: string }) => void;
  buttonText?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export const FormBar: React.FC<FormBarProps> = ({
  onSubmit,
  buttonText = 'Book a Demo',
  className = '',
  theme = 'light',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isFocused = nameFocused || emailFocused;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    if (onSubmit) onSubmit({ name, email });
  };

  if (submitted) {
    return (
      <div
        className={`h-[56px] rounded-[14px] px-6 flex items-center justify-center gap-2 text-sm font-medium transition-all ${
          theme === 'dark'
            ? 'glass-panel text-[#6EEDC2]'
            : 'bg-white shadow-1 text-[#062B20] border border-[rgba(11,11,15,0.08)]'
        } ${className}`}
      >
        <span className="w-5 h-5 rounded-full bg-[#6EEDC2] text-[#062B20] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
        </span>
        <span>Thank you! We will reach out to {email} shortly.</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative h-[56px] rounded-[14px] flex items-center transition-all duration-300 ${
        theme === 'dark'
          ? 'glass-panel text-[#F4F5F7]'
          : 'bg-white text-[#0B0B0F] border border-[rgba(11,11,15,0.08)]'
      } ${
        isFocused
          ? 'shadow-2 ring-[1.5px] ring-[#0B0B0F]/20 border-transparent'
          : 'shadow-1'
      } ${className}`}
    >
      {/* Field 1: Name */}
      <div className="relative flex-1 h-full flex flex-col justify-center px-4 border-r border-[rgba(11,11,15,0.08)]">
        <label
          htmlFor="formbar-name"
          className={`text-[10.5px] uppercase tracking-[0.06em] font-medium transition-all duration-200 pointer-events-none select-none ${
            nameFocused || name
              ? 'text-[#5B5F68] -translate-y-0.5'
              : 'text-[#9A9EA8] translate-y-1'
          }`}
        >
          Name*
        </label>
        <input
          id="formbar-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setNameFocused(true)}
          onBlur={() => setNameFocused(false)}
          className="w-full bg-transparent text-[13px] text-[#0B0B0F] dark:text-[#F4F5F7] focus:outline-none placeholder-transparent leading-tight"
          placeholder="John Doe"
        />
      </div>

      {/* Field 2: Email */}
      <div className="relative flex-1 h-full flex flex-col justify-center px-4">
        <label
          htmlFor="formbar-email"
          className={`text-[10.5px] uppercase tracking-[0.06em] font-medium transition-all duration-200 pointer-events-none select-none ${
            emailFocused || email
              ? 'text-[#5B5F68] -translate-y-0.5'
              : 'text-[#9A9EA8] translate-y-1'
          }`}
        >
          Email*
        </label>
        <input
          id="formbar-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          className="w-full bg-transparent text-[13px] text-[#0B0B0F] dark:text-[#F4F5F7] focus:outline-none placeholder-transparent leading-tight"
          placeholder="john@example.com"
        />
      </div>

      {/* Primary button inset 6px at the right */}
      <div className="pr-[6px]">
        <Button variant="primary" type="submit">
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
