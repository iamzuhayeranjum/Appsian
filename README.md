# Appsian - AI Receptionist & Booking Marketing Site

A pixel-for-pixel recreation of the marketing website UI, UX, and animations, customized for Appsian.

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Animation**: Motion (`motion/react`)
- **Smooth Scroll**: Lenis
- **Typography**: "Instrument Sans" (Display) + "Inter" (Body/UI) via Google Fonts

---

## List of Placeholders & TODO Items

Below is the exhaustive index of all placeholders and TODO items:

1. **Integrations Strip Logos (`src/components/IntegrationsStrip.tsx`)**:
   - `TODO`: Swap in official SVG vector logos for Google Calendar, HubSpot, Calendly, Cal.com, Zoho CRM, and Salesforce.

2. **Testimonials Array (`src/content.ts` & `src/components/TestimonialsSection.tsx`)**:
   - `// PLACEHOLDER: replace with a real founding-client quote`:
     - Testimonial 1 (Marcus Vance, Vance Electrical Works)
     - Testimonial 2 (Sarah Mitchell, Apex Plumbing & Heating)
     - Testimonial 3 (David Chen, Precision Air HVAC)
     Stylized gradient avatars with initials are used to avoid fabricated photo identities.

3. **Lead Capture Integrations (`src/components/FinalCtaBand.tsx` & `src/components/DemoBar.tsx`)**:
   - `TODO`: Wire up the form submission to the production backend lead capture endpoint / CRM webhook (e.g., POST `/api/leads` or direct HubSpot API).

4. **Footer Logo Vector & Typography Mark (`src/components/Footer.tsx`)**:
   - `TODO`: Swap in the final production SVG brand emblem and approved vector wordmark asset.

5. **Voice Demo Modal (`src/components/VoiceDemoModal.tsx`)**:
   - "Live voice demo goes here": Placeholder interactive voice simulator with animated waveform, play/pause controls, and sample conversation snippet for prospective trade clients.

6. **Dashboard Sample Data (`src/components/DashboardMockup.tsx`)**:
   - Sample KPI figures and charts labeled as `Sample data` in the sidebar and UI footer notation.
