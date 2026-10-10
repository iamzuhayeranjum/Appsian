/**
 * Content file for Appsian Marketing Website
 * All copy, pricing data, testimonials, and FAQs are centralized here.
 */

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  minutesLabel: string;
  callsLabel: string;
  popular?: boolean;
  highlightCurtain?: boolean;
  features: string[];
  ctaLabel: string;
  pilotDescription: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  initials: string;
  avatarGradient: string;
  rating: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const content = {
  hero: {
    nav: {
      brand: 'Appsian',
      links: [
        { label: 'Product', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'How it works', href: '#how-it-works' },
      ],
      loginLabel: 'Log In',
      ctaLabel: 'Book a Demo',
    },
    h1: 'Plug In AI Phone Agents That Book More Quotes On Autopilot',
    subline: 'Appsian Answers Every Inbound Call, Qualifies The Enquiry And Books The Next Step, 24/7.',
    primaryCta: 'Book a Demo',
    secondaryCta: 'Get Started',
  },

  integrations: {
    caption: 'Works with the tools you already use',
    // TODO: Swap in verified brand SVG logos when available
    tools: [
      { name: 'Google Calendar' },
      { name: 'HubSpot' },
      { name: 'Calendly' },
      { name: 'Cal.com' },
      { name: 'Zoho CRM' },
      { name: 'Salesforce' },
    ],
  },

  features: {
    h2: 'Save hours and keep jobs moving',
    bigCard: {
      title: 'Never lose a lead to voicemail',
      blurb: 'Appsian picks up on your existing number, talks to callers naturally and captures every detail, even at 2am on a Sunday.',
    },
    card1: {
      title: 'Reclaim your time',
      blurb: 'Stop playing phone tag. Get a clear summary of every call.',
    },
    card2: {
      title: 'Stay on top of every call',
      blurb: 'Every call, booking and caller detail in one simple dashboard.',
    },
  },

  darkBand1: {
    h2Line1: 'Made for busy trades,',
    h2Line2: 'built for booked jobs',
    card1: {
      title: 'Qualifies every caller',
      blurb: 'Screens job requirements, urgency, and service zones before scheduling.',
    },
    card2: {
      title: 'Syncs with your calendar and CRM',
      blurb: 'Direct two-way calendar dispatch, CRM contact logging, and real-time transcripts.',
    },
  },

  trustRow: {
    h2Line1: 'Reliable. Human-friendly.',
    h2Line2: 'Built for local business.',
    columns: [
      {
        title: 'Always on',
        blurb: 'Nights, weekends and holidays are answered the same as a Tuesday afternoon.',
      },
      {
        title: 'A human, on demand',
        blurb: "Callers can say 'human' at any point and your team takes over.",
      },
      {
        title: 'Your rules',
        blurb: 'Qualification is scored against your own rules, services and service areas.',
      },
    ],
  },

  pricing: {
    h2: 'Plans to suit the way you work',
    toggleMonthly: 'Monthly plans',
    togglePilot: 'Founding pilot',
    pilotTagline: '30-day founding pilot: $0 setup fee, $0 management fee. You only cover actual AI + phone usage.',
    plans: [
      {
        id: 'starter',
        name: 'Starter',
        description: 'Perfect for trades and small contractors looking to capture every lead.',
        monthlyPrice: 299,
        minutesLabel: '300 minutes/month',
        callsLabel: '(60-75 calls)',
        ctaLabel: 'Get Started',
        features: [
          '24/7 AI call answering',
          'Natural customer conversations',
          'Lead qualification',
          'Customer detail capture',
          'Appointment & estimate booking',
          'Call recordings & AI summaries',
        ],
        pilotDescription: '$0 setup / $0 management fee for 30 days. You only cover actual AI + phone usage.',
      },
      {
        id: 'growth',
        name: 'Growth',
        description: 'Ideal for growing trade businesses that need higher volume and analytics.',
        monthlyPrice: 499,
        minutesLabel: '600 minutes/month',
        callsLabel: '(120-150 calls)',
        popular: true,
        highlightCurtain: true,
        ctaLabel: 'Book a Demo',
        features: [
          '24/7 AI call answering',
          'Natural customer conversations',
          'Lead qualification',
          'Customer detail capture',
          'Appointment & estimate booking',
          'Call recordings & AI summaries',
          'Call analytics',
        ],
        pilotDescription: '$0 setup / $0 management fee for 30 days. You only cover actual AI + phone usage.',
      },
      {
        id: 'scale',
        name: 'Scale',
        description: 'For multi-crew companies wanting custom workflow routing and sync.',
        monthlyPrice: 999,
        minutesLabel: '1,600 minutes/month',
        callsLabel: '(320-400 calls)',
        ctaLabel: 'Contact sales',
        features: [
          'Everything in Growth',
          'Advanced call analytics',
          'Advanced call workflows',
          'Custom integration triggers',
          'Dedicated account engineer',
        ],
        pilotDescription: '$0 setup / $0 management fee for 30 days. You only cover actual AI + phone usage.',
      },
    ] as PricingPlan[],
  },

  testimonials: [
    // PLACEHOLDER: replace with a real founding-client quote
    {
      id: 'testimonial-1',
      quote:
        'Appsian answers every after-hours emergency call and books jobs straight onto our calendar while our technicians sleep. We have seen zero missed inquiries since launch.',
      name: 'Marcus Vance',
      role: 'Owner & Master Electrician',
      company: 'Vance Electrical Works',
      initials: 'MV',
      avatarGradient: 'from-blue-600 via-indigo-600 to-cyan-400',
      rating: 5,
    },
    // PLACEHOLDER: replace with a real founding-client quote
    {
      id: 'testimonial-2',
      quote:
        'Our phones used to ring off the hook while we were on roofs and under sinks. Appsian handles the questions, weeds out spam, and captures the exact job scope every time.',
      name: 'Sarah Mitchell',
      role: 'Managing Director',
      company: 'Apex Plumbing & Heating',
      initials: 'SM',
      avatarGradient: 'from-indigo-600 via-purple-600 to-pink-400',
      rating: 5,
    },
    // PLACEHOLDER: replace with a real founding-client quote
    {
      id: 'testimonial-3',
      quote:
        'Callers genuinely believe they are speaking with our front-desk coordinator. The call summaries let our estimators prepare quotes in minutes instead of phone tag.',
      name: 'David Chen',
      role: 'Operations Head',
      company: 'Precision Air HVAC',
      initials: 'DC',
      avatarGradient: 'from-teal-600 via-emerald-600 to-cyan-400',
      rating: 5,
    },
  ] as Testimonial[],

  faq: {
    h2: 'Questions you may have',
    leftColumn: [
      {
        id: 'faq-1',
        question: 'Who is Appsian for?',
        answer:
          'Appsian is built specifically for trade businesses, field technicians, contractors, and local service companies where every missed inbound call is a lost customer and job.',
      },
      {
        id: 'faq-2',
        question: 'Will it sound robotic?',
        answer:
          'No. Appsian uses conversational voice intelligence tuned for natural pacing, everyday trade terminology, and back-and-forth clarification without awkward delays.',
      },
      {
        id: 'faq-3',
        question: 'Can a caller reach a real person?',
        answer:
          'Yes. Callers can say "human" or "speak with someone" at any moment during the call, and Appsian immediately rings your prioritized staff or emergency escalation phone.',
      },
      {
        id: 'faq-4',
        question: 'How does the 30-day founding program work?',
        answer:
          'Our founding pilot includes $0 setup fee and $0 software management fee for 30 days. You only cover actual underlying AI and telephony minutes while our team customizes your qualification rules.',
      },
    ] as FaqItem[],
    rightColumn: [
      {
        id: 'faq-5',
        question: 'Do I keep my business number?',
        answer:
          'Yes. You retain your existing business phone number. You simply set up call forwarding (either after hours, when busy, or full time) directly to your dedicated Appsian reception line.',
      },
      {
        id: 'faq-6',
        question: 'Which tools does it connect with?',
        answer:
          'Appsian integrates directly with Google Calendar, HubSpot, Calendly, Cal.com, Zoho CRM, Salesforce, and custom dispatch webhooks to place bookings and contacts automatically.',
      },
      {
        id: 'faq-7',
        question: 'How do minutes and pricing work?',
        answer:
          'Each plan comes with a bundled pool of active call minutes. There are no hidden fees or per-lead charges. If you exceed your tier, additional minutes are billed at straightforward per-minute rates.',
      },
      {
        id: 'faq-8',
        question: 'What happens after hours?',
        answer:
          'Appsian operates 24/7/365. After-hours calls are answered instantly, qualified according to your emergency protocols, and either booked into next-day time slots or escalated immediately.',
      },
      {
        id: 'faq-9',
        question: 'What do I need to get started?',
        answer:
          'You only need your business details, your service menu, and 15 minutes with our team to configure your calendar and forward your phone number.',
      },
    ] as FaqItem[],
  },

  finalCta: {
    h2: 'Answer every call. Book every job.',
    subline: 'Hear your AI receptionist take a real call for your business before you decide anything.',
    checks: ['Book a free demo', 'Hear it on your own calls', 'Start your 30-day pilot'],
    emailPlaceholder: 'Work email',
    buttonLabel: 'Book a Demo',
  },

  footer: {
    tagline: 'Every call answered. Every job booked.',
    backToTop: 'Back to top',
    brand: 'Appsian',
    legal: 'Privacy Policy · Terms of Service · ©2026 Appsian. All Rights Reserved.',
  },
};
