import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { submitBooking } from '../lib/submitBooking';

const BUSINESS_TYPES = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Roofing',
  'Solar',
  'Construction',
  'Landscaping',
  'Automotive',
  'Cleaning',
  'Other',
];

const CALL_VOLUMES = [
  'Under 50',
  '50–150',
  '150–250',
  '250–400',
  '400+',
];

const MISSED_CALLS = [
  'Calls go to voicemail',
  'I call people back later',
  'Someone else answers',
  'We have an existing receptionist',
  'We already use an AI receptionist',
  'Other',
];

const TASKS = [
  'Answer customer questions',
  'Qualify new enquiries',
  'Capture customer details',
  'Book appointments or estimates',
  'Handle after-hours calls',
  'Transfer calls to my team',
];

interface FormValues {
  name: string;
  business_name: string;
  email: string;
  phone: string;
  business_type: string;
  website_url: string;
  services: string;
  monthly_calls: string;
  missed_call_handling: string;
  receptionist_tasks: string[];
}

const EMPTY: FormValues = {
  name: '',
  business_name: '',
  email: '',
  phone: '',
  business_type: '',
  website_url: '',
  services: '',
  monthly_calls: '',
  missed_call_handling: '',
  receptionist_tasks: [],
};

const FIELD_ORDER = [
  'name',
  'business_name',
  'email',
  'phone',
  'business_type',
  'website_url',
] as const;

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

const UnderlineField: React.FC<FieldProps> = ({
  id,
  label,
  required,
  error,
  className = '',
  children,
}) => (
  <div className={`relative group/field flex flex-col ${className}`}>
    <label
      htmlFor={id}
      className={`text-[13px] font-semibold transition-colors duration-200 select-none ${
        error
          ? 'text-[#dc2626]'
          : 'text-[#0b1530] group-focus-within/field:text-[#2563eb]'
      }`}
    >
      {label}
      {required && <span className="text-[#2563eb]"> *</span>}
    </label>
    <div className="relative mt-0.5">
      {children}
      {/* Animated Focus Underline */}
      <span
        className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none transition-transform duration-[250ms] ease-out origin-left ${
          error
            ? 'bg-[#dc2626] scale-x-100'
            : 'bg-[#2563eb] scale-x-0 group-focus-within/field:scale-x-100'
        }`}
        aria-hidden="true"
      />
    </div>
    {error && (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-[12px] text-[#dc2626] flex items-center gap-1 mt-1.5 font-medium leading-tight"
      >
        <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>{error}</span>
      </p>
    )}
  </div>
);

const UnderlineSelect: React.FC<{
  id: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}> = ({ id, value, placeholder, options, onChange, hasError = false, disabled }) => (
  <div className="relative">
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      className={`w-full h-[44px] bg-transparent border-0 border-b ${
        hasError ? 'border-[#dc2626]' : 'border-[#d9dee8]'
      } rounded-none px-0.5 pr-8 text-[14.5px] outline-none cursor-pointer transition-[background-color,border-color] duration-200 focus:bg-[rgba(37,99,235,0.04)] appearance-none ${
        value ? 'text-[#0b1530]' : 'text-[#94a3b8]'
      }`}
    >
      <option value="" className="text-[#94a3b8]">
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="text-[#0b1530]">
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"
      aria-hidden="true"
    />
    <span
      className={`absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none transition-transform duration-[250ms] ease-out origin-left ${
        hasError
          ? 'bg-[#dc2626] scale-x-100'
          : 'bg-[#2563eb] scale-x-0 group-focus-within/field:scale-x-100'
      }`}
      aria-hidden="true"
    />
  </div>
);

interface BookingFormProps {
  onSuccess: (info: { firstName: string; business: string }) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onSuccess }) => {
  const [values, setValues] = useState<FormValues>(() => {
    const q = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    return { ...EMPTY, name: q.get('name') || '', email: q.get('email') || '' };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [serverError, setServerError] = useState('');

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const toggleTask = (task: string) =>
    set(
      'receptionist_tasks',
      values.receptionist_tasks.includes(task)
        ? values.receptionist_tasks.filter((t) => t !== task)
        : [...values.receptionist_tasks, task]
    );

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (values.name.trim().length < 2) e.name = 'Please enter your name.';
    if (values.business_name.trim().length < 2) e.business_name = 'Please enter your business name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = 'Please enter a valid work email.';
    if (values.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number.';
    if (!values.business_type) e.business_type = 'Please choose your type of business.';
    const site = values.website_url.trim();
    if (site && !/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(site)) {
      e.website_url = 'Please enter a valid website, like yourbusiness.com.';
    }
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (status === 'loading') return;

    // Spam honeypot: bots fill the hidden field, so quietly pretend it worked
    if (honeypot.trim()) {
      onSuccess({ firstName: '', business: '' });
      return;
    }

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      const first = FIELD_ORDER.find((k) => found[k]);
      if (first) document.getElementById(`book-${first}`)?.focus();
      return;
    }

    setServerError('');
    setStatus('loading');
    const site = values.website_url.trim();
    try {
      const res = await submitBooking({
        ...values,
        name: values.name.trim(),
        business_name: values.business_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        services: values.services.trim(),
        website_url: site && !/^https?:\/\//i.test(site) ? `https://${site}` : site,
      });
      if (res.success) {
        onSuccess({
          firstName: values.name.trim().split(' ')[0],
          business: values.business_name.trim(),
        });
      } else {
        setStatus('error');
        setServerError(res.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setServerError('Something went wrong. Please try again.');
    }
  };

  const loading = status === 'loading';
  const err = (k: string) => errors[k] || undefined;
  const aria = (k: string) => ({
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `book-${k}-error` : undefined,
  });

  const inputUnderlineCls = (hasErr: boolean) =>
    `w-full h-[44px] bg-transparent border-0 border-b ${
      hasErr ? 'border-[#dc2626]' : 'border-[#d9dee8]'
    } rounded-none px-0.5 text-[14.5px] text-[#0b1530] placeholder-[#94a3b8] outline-none transition-[background-color,border-color] duration-200 focus:bg-[rgba(37,99,235,0.04)] disabled:opacity-60`;

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
      {/* Honeypot Spam Protection */}
      <input
        type="text"
        name="website_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        className="sr-only hidden"
      />

      {/* Primary Grid: Two columns with 28px horizontal gap and 22px vertical gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[28px] gap-y-[22px]">
        {/* Row 1: Your name / Business name */}
        <UnderlineField id="book-name" label="Your name" required error={err('name')}>
          <input
            id="book-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={values.name}
            disabled={loading}
            onChange={(e) => set('name', e.target.value)}
            className={inputUnderlineCls(!!errors.name)}
            {...aria('name')}
          />
        </UnderlineField>

        <UnderlineField id="book-business_name" label="Business name" required error={err('business_name')}>
          <input
            id="book-business_name"
            type="text"
            autoComplete="organization"
            placeholder="Your business"
            value={values.business_name}
            disabled={loading}
            onChange={(e) => set('business_name', e.target.value)}
            className={inputUnderlineCls(!!errors.business_name)}
            {...aria('business_name')}
          />
        </UnderlineField>

        {/* Row 2: Business email / Phone number */}
        <UnderlineField id="book-email" label="Business email" required error={err('email')}>
          <input
            id="book-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@yourbusiness.com"
            value={values.email}
            disabled={loading}
            onChange={(e) => set('email', e.target.value)}
            className={inputUnderlineCls(!!errors.email)}
            {...aria('email')}
          />
        </UnderlineField>

        <UnderlineField id="book-phone" label="Phone number" required error={err('phone')}>
          <input
            id="book-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Best number to reach you"
            value={values.phone}
            disabled={loading}
            onChange={(e) => set('phone', e.target.value)}
            className={inputUnderlineCls(!!errors.phone)}
            {...aria('phone')}
          />
        </UnderlineField>

        {/* Row 3: Business type / Website URL */}
        <UnderlineField id="book-business_type" label="What type of business do you run?" required error={err('business_type')}>
          <UnderlineSelect
            id="book-business_type"
            value={values.business_type}
            placeholder="Select your trade"
            options={BUSINESS_TYPES}
            onChange={(v) => set('business_type', v)}
            hasError={!!errors.business_type}
            disabled={loading}
          />
        </UnderlineField>

        <UnderlineField id="book-website_url" label="Website URL" error={err('website_url')}>
          <input
            id="book-website_url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="yourbusiness.com"
            value={values.website_url}
            disabled={loading}
            onChange={(e) => set('website_url', e.target.value)}
            className={inputUnderlineCls(!!errors.website_url)}
            {...aria('website_url')}
          />
        </UnderlineField>
      </div>

      {/* Optional Questions Divider */}
      <div className="flex items-center gap-3 my-1 pt-1">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          A couple more questions (optional)
        </span>
        <span className="h-px flex-1 bg-[rgba(15,23,42,0.1)]" aria-hidden="true" />
      </div>

      {/* Row 4: Services (Full width) */}
      <UnderlineField id="book-services" label="What services do you offer?">
        <input
          id="book-services"
          type="text"
          placeholder="For example: repairs, installs, emergency call-outs"
          value={values.services}
          disabled={loading}
          onChange={(e) => set('services', e.target.value)}
          className={inputUnderlineCls(false)}
        />
      </UnderlineField>

      {/* Row 5: Call volumes & Missed calls (Side-by-side with 28px gap) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[28px] gap-y-[22px]">
        <UnderlineField id="book-monthly_calls" label="How many calls do you receive monthly?">
          <UnderlineSelect
            id="book-monthly_calls"
            value={values.monthly_calls}
            placeholder="Select a range"
            options={CALL_VOLUMES}
            onChange={(v) => set('monthly_calls', v)}
            disabled={loading}
          />
        </UnderlineField>

        <UnderlineField id="book-missed_call_handling" label="What happens when you can't answer?">
          <UnderlineSelect
            id="book-missed_call_handling"
            value={values.missed_call_handling}
            placeholder="Select an option"
            options={MISSED_CALLS}
            onChange={(v) => set('missed_call_handling', v)}
            disabled={loading}
          />
        </UnderlineField>
      </div>

      {/* Row 6: Receptionist Tasks Chips */}
      <fieldset className="flex flex-col gap-2 min-w-0 pt-1">
        <legend className="text-[13px] font-semibold text-[#0b1530] mb-1.5 block">
          What should your AI receptionist handle?
        </legend>
        <div className="flex flex-wrap gap-2">
          {TASKS.map((task) => {
            const on = values.receptionist_tasks.includes(task);
            return (
              <button
                key={task}
                type="button"
                aria-pressed={on}
                disabled={loading}
                onClick={() => toggleTask(task)}
                className={`inline-flex items-center gap-1.5 h-[36px] px-3.5 rounded-full border text-[13px] transition-all duration-150 cursor-pointer select-none ${
                  on
                    ? 'bg-[#eaf1ff] border-[#2563eb] text-[#1d4ed8] font-semibold shadow-xs'
                    : 'bg-white border-[#d9dee8] text-[#334155] font-medium hover:border-[#93b4f8] hover:bg-[#f4f8ff]'
                }`}
              >
                {on && (
                  <Check
                    className="w-3.5 h-3.5 text-[#1d4ed8] shrink-0 animate-in fade-in zoom-in-75 duration-150"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />
                )}
                <span>{task}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Server Error Message */}
      {serverError && (
        <p role="alert" className="text-[13px] text-[#dc2626] font-medium flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{serverError}</span>
        </p>
      )}

      {/* Submit Button & Microcopy note */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-start">
          <button
            type="submit"
            disabled={loading}
            className="btn-premium btn-premium--blue btn-glitter group w-full sm:w-auto min-w-[220px] h-[52px] rounded-[14px] px-7 text-[15px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed shadow-md transition-transform duration-150 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" aria-hidden="true" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>Get My Free Demo</span>
                <ArrowRight className="btn-arrow w-4 h-4 text-white" strokeWidth={2} />
              </>
            )}
          </button>
        </div>

        <p className="flex items-center gap-2 text-[13px] text-[#64748b] mt-1">
          <Check className="w-3.5 h-3.5 text-[#2563eb] shrink-0" strokeWidth={2.4} aria-hidden="true" />
          <span>No obligation. No commitment. Just a personalized demo for your business.</span>
        </p>
      </div>
    </form>
  );
};
