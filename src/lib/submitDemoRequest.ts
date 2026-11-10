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
  } catch (err: any) {
    console.error('[lead] Network fetch error:', err);
    throw new Error('Network error: unable to reach the server. Please check your internet connection.');
  }

  // Attempt to parse JSON response
  let data: any = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      // ignore JSON parse failure
    }
  }

  // Success
  if (res.ok && data?.ok) {
    return { ok: true, success: true };
  }

  // If the server returned a specific error message, show it
  if (data?.error) {
    throw new Error(data.error);
  }

  // Handle common HTTP error codes when body is non-JSON or missing error field
  if (res.status === 429) {
    throw new Error('Too many requests, please try again in a few minutes.');
  }

  if (res.status === 404) {
    throw new Error('API route /api/lead was not found. Please verify that your Vercel project includes the /api directory.');
  }

  if (res.status === 500) {
    throw new Error('Server configuration error. Please ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set in Vercel environment variables.');
  }

  if (res.status === 502) {
    throw new Error('Could not deliver message to Telegram. Please check your Telegram bot token and chat ID.');
  }

  throw new Error('Something went wrong. Please try again.');
}
