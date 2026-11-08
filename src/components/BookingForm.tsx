import React, { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Loader2 } from 'lucide-react';
import { submitBooking } from '../lib/submitBooking';

const BUSINESS_TYPES = ['Plumbing', 'Electrical', 'HVAC', 'Roofing', 'Solar', 'Construction', 'Landscaping', 'Automotive', 'Cleaning', 'Other'];
const CALL_VOLUMES = ['Under 50', '50–150', '150–250', '250–400', '400+'];
const MISSED_CALLS = ['Calls go to voicemail', 'I call people back later', 'Someone else answers', 'We have an existing receptionist', 'We already use an AI receptionist', 'Other'];
const TASKS = ['Answer customer questions', 'Qualify new enquiries', 'Capture customer details', 'Book appointments or estimates', 'Handle after-hours calls', 'Transfer calls to my team'];

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
  name: '', business_name: '', email: '', phone: '', business_type: '', website_url: '',
  services: '', monthly_calls: '', missed_call_handling: '', receptionist_tasks: [],
};

const FIELD_ORDER = ['name', 'business_name', 'email', 'phone', 'business_type', 'website_url'] as const;

const inputCls = (hasError: boolean) =>
  `w-full h-[48px] rounded-[12px] bg-white border px-4 text-[15px] text-[#0b1530] placeholder-[#8a96b0] outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#3b82f6] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.22)] disabled:opacity-60 ${
    hasError ? 'border-[#e5484d]' : 'border-[#d9e2f3]'
  }`;

const Field: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, label, required, error, className = '', children }) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={id} className="text-[13px] font-medium text-[#0b1530]">
      {label}
      {required && <span className="text-[#2f6bff]"> *</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} role="alert" className="text-[12.5px] text-[#d6336c]">
        {error}
      </p>
    )}
  </div>
);

const SelectBox: React.FC<{
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
      className={`${inputCls(hasError)} appearance-none pr-10 cursor-pointer ${value ? '' : 'text-[#8a96b0]'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} className="text-[#0b1530]">
          {o}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#51607f]" aria-hidden="true" />
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
        onSuccess({ firstName: values.name.trim().split(' ')[0], business: values.business_name.trim() });
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

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="book-name" label="Your name" required error={err('name')}>
          <input id="book-name" type="text" autoComplete="name" placeholder="Jane Smith" value={values.name} disabled={loading} onChange={(e) => set('name', e.target.value)} className={inputCls(!!errors.name)} {...aria('name')} />
        </Field>
        <Field id="book-business_name" label="Business name" required error={err('business_name')}>
          <input id="book-business_name" type="text" autoComplete="organization" placeholder="Your business" value={values.business_name} disabled={loading} onChange={(e) => set('business_name', e.target.value)} className={inputCls(!!errors.business_name)} {...aria('business_name')} />
        </Field>
        <Field id="book-email" label="Business email" required error={err('email')}>
          <input id="book-email" type="email" inputMode="email" autoComplete="email" placeholder="you@yourbusiness.com" value={values.email} disabled={loading} onChange={(e) => set('email', e.target.value)} className={inputCls(!!errors.email)} {...aria('email')} />
        </Field>
        <Field id="book-phone" label="Phone number" required error={err('phone')}>
          <input id="book-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Best number to reach you" value={values.phone} disabled={loading} onChange={(e) => set('phone', e.target.value)} className={inputCls(!!errors.phone)} {...aria('phone')} />
        </Field>
        <Field id="book-business_type" label="What type of business do you run?" required error={err('business_type')}>
          <SelectBox id="book-business_type" value={values.business_type} placeholder="Select your trade" options={BUSINESS_TYPES} onChange={(v) => set('business_type', v)} hasError={!!errors.business_type} disabled={loading} />
        </Field>
        <Field id="book-website_url" label="Website URL" error={err('website_url')}>
          <input id="book-website_url" type="text" inputMode="url" autoComplete="url" placeholder="yourbusiness.com" value={values.website_url} disabled={loading} onChange={(e) => set('website_url', e.target.value)} className={inputCls(!!errors.website_url)} {...aria('website_url')} />
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#51607f]">A couple more questions (optional)</span>
        <span className="h-px flex-1 bg-[#e3eaf7]" aria-hidden="true" />
      </div>

      <Field id="book-services" label="What services do you offer?">
        <input id="book-services" type="text" placeholder="For example: repairs, installs, emergency call-outs" value={values.services} disabled={loading} onChange={(e) => set('services', e.target.value)} className={inputCls(false)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="book-monthly_calls" label="How many calls do you receive monthly?">
          <SelectBox id="book-monthly_calls" value={values.monthly_calls} placeholder="Select a range" options={CALL_VOLUMES} onChange={(v) => set('monthly_calls', v)} disabled={loading} />
        </Field>
        <Field id="book-missed_call_handling" label="What happens when you can't answer?">
          <SelectBox id="book-missed_call_handling" value={values.missed_call_handling} placeholder="Select an option" options={MISSED_CALLS} onChange={(v) => set('missed_call_handling', v)} disabled={loading} />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2.5 min-w-0">
        <legend className="text-[13px] font-medium text-[#0b1530] mb-2.5">What should your AI receptionist handle?</legend>
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
                className={`inline-flex items-center gap-1.5 h-[38px] px-3.5 rounded-full border text-[13.5px] font-medium cursor-pointer transition-colors duration-200 ${
                  on ? 'bg-[#eaf2ff] border-[#3b82f6] text-[#1d4ed8]' : 'bg-white border-[#d9e2f3] text-[#2b3a5c] hover:border-[#9db8ee]'
                }`}
              >
                {on && <Check className="w-3.5 h-3.5" strokeWidth={2.6} aria-hidden="true" />}
                {task}
              </button>
            );
          })}
        </div>
      </fieldset>

      {serverError && (
        <p role="alert" className="text-[13.5px] text-[#d6336c]">
          {serverError}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="btn-premium btn-premium--blue btn-glitter group w-full h-[58px] rounded-[16px] px-[30px] text-[16px] font-semibold text-white flex items-center justify-center gap-2.5 cursor-pointer select-none disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Get My Free Demo</span>
              <ArrowRight className="btn-arrow w-[18px] h-[18px]" strokeWidth={2} />
            </>
          )}
        </button>
        <p className="flex items-center gap-2 text-[13px] text-[#51607f]">
          <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
          No obligation. No commitment. Just a personalized demo for your business.
        </p>
      </div>
    </form>
  );
};
