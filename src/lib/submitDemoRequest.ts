/**
 * Shared client helper for demo request submissions across all forms.
 * Sends payload to serverless endpoint /api/lead which safely forwards to Telegram.
 */

export interface SubmitDemoRequestPayload {
  source: 'hero' | 'final-cta' | 'booking-page';
  name?: string;
  email: string;
  business?: string;
  phone?: string;
  trade?: string;
  website?: string;
  services?: string;
  monthlyCalls?: string;
  whenUnanswered?: string;
  handles?: string[];
  hp?: string;
  pageUrl?: string;
  utm?: Record<string, string>;
}

// Backwards-compatible interface alias
export type DemoRequestPayload = SubmitDemoRequestPayload;

export async function submitDemoRequest(
  payload: SubmitDemoRequestPayload
): Promise<{ ok: boolean; success?: boolean }> {
  // Extract UTM parameters from window.location if not explicitly passed
  let utm: Record<string, string> = { ...(payload.utm || {}) };
  if (typeof window !== 'undefined' && (!payload.utm || Object.keys(payload.utm).length === 0)) {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
      for (const k of utmKeys) {
        const val = params.get(k);
        if (val && val.trim()) {
          utm[k] = val.trim();
        }
      }
    } catch {
      // ignore query parsing errors
    }
  }

  const pageUrl =
    payload.pageUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Build clean payload with only non-empty fields
  const body: Record<string, any> = {
    source: payload.source,
    email: payload.email.trim(),
  };

  if (payload.name && payload.name.trim()) body.name = payload.name.trim();
  if (payload.business && payload.business.trim()) body.business = payload.business.trim();
  if (payload.phone && payload.phone.trim()) body.phone = payload.phone.trim();
  if (payload.trade && payload.trade.trim()) body.trade = payload.trade.trim();
  if (payload.website && payload.website.trim()) body.website = payload.website.trim();
  if (payload.services && payload.services.trim()) body.services = payload.services.trim();
  if (payload.monthlyCalls && payload.monthlyCalls.trim()) body.monthlyCalls = payload.monthlyCalls.trim();
  if (payload.whenUnanswered && payload.whenUnanswered.trim()) body.whenUnanswered = payload.whenUnanswered.trim();
  if (payload.handles && payload.handles.length > 0) body.handles = payload.handles;
  if (payload.hp !== undefined) body.hp = payload.hp;
  if (pageUrl) body.pageUrl = pageUrl;
  if (Object.keys(utm).length > 0) body.utm = utm;

  let res: Response;
  try {
    res = await fetch('/api/lead', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch {
    console.warn('[lead] /api/lead is not available (it only works on the deployed Vercel site)');
    throw new Error('Something went wrong. Please try again.');
  }

  // If response is HTML or 404 (e.g. AI Studio dev server where /api/lead is not mounted)
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    console.warn('[lead] /api/lead is not available (it only works on the deployed Vercel site)');
    throw new Error('Something went wrong. Please try again.');
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error('Something went wrong. Please try again.');
  }

  if (res.ok && data?.ok) {
    return { ok: true, success: true };
  }

  if (res.status === 429) {
    throw new Error('Too many requests, please try again in a few minutes.');
  }

  if (res.status === 400) {
    throw new Error(data?.error || 'Invalid request. Please check your information.');
  }

  throw new Error('Something went wrong. Please try again.');
}
