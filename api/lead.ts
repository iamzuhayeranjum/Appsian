// api/lead.ts
// Vercel Serverless Function (Node.js runtime)
// Telegram credentials are read strictly from server-side environment variables.

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory rate limiting map.
// Note: This is best effort because serverless instances do not share memory.
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= 5) {
    return false;
  }

  record.count += 1;
  return true;
}

function isAllowedOrigin(originHeader?: string): boolean {
  if (!originHeader) {
    // Missing origin/referer is accepted (e.g. certain browser privacy settings)
    return true;
  }
  try {
    const url = new URL(originHeader);
    const origin = url.origin.toLowerCase();
    const hostname = url.hostname.toLowerCase();

    if (origin === 'https://appsianai.digital' || origin === 'https://www.appsianai.digital') {
      return true;
    }
    if (hostname.endsWith('.vercel.app') && url.protocol === 'https:') {
      return true;
    }
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req: any, res: any) {
  // Set cache control header
  res.setHeader('Cache-Control', 'no-store');

  // 1. Method check: only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  // 2. Reject payloads larger than 20 KB (20,480 bytes)
  const contentLength = req.headers['content-length'];
  if (contentLength && parseInt(contentLength, 10) > 20480) {
    return res.status(413).json({ ok: false, error: 'Payload too large' });
  }

  let rawBody = req.body;
  if (typeof rawBody === 'string') {
    if (Buffer.byteLength(rawBody, 'utf8') > 20480) {
      return res.status(413).json({ ok: false, error: 'Payload too large' });
    }
    try {
      rawBody = JSON.parse(rawBody);
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
  } else if (rawBody && typeof rawBody === 'object') {
    if (Buffer.byteLength(JSON.stringify(rawBody), 'utf8') > 20480) {
      return res.status(413).json({ ok: false, error: 'Payload too large' });
    }
  } else {
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }

  const body = rawBody || {};

  // 3. Origin check
  const originHeader = (req.headers['origin'] || req.headers['referer']) as string | undefined;
  if (!isAllowedOrigin(originHeader)) {
    return res.status(403).json({ ok: false, error: 'Forbidden' });
  }

  // 4. Honeypot check: if non-empty string, silently return { ok: true } without sending anything
  if (typeof body.hp === 'string' && body.hp.trim().length > 0) {
    return res.status(200).json({ ok: true });
  }

  // 5. Validation
  const source = typeof body.source === 'string' ? body.source.trim() : '';
  if (!['hero', 'final-cta', 'booking-page'].includes(source)) {
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.length > 254 || !emailRegex.test(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  // Name is required for hero and booking-page; optional for final-cta
  if (source !== 'final-cta') {
    if (!name || name.length > 200) {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
  } else {
    if (name.length > 200) {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
  }

  // Optional string fields: max 500 chars (services max 1000)
  const validateOptionalStr = (val: any, max: number): string | null => {
    if (val === undefined || val === null || val === '') return '';
    if (typeof val !== 'string') return null;
    const trimmed = val.trim();
    if (trimmed.length > max) return null;
    return trimmed;
  };

  const business = validateOptionalStr(body.business, 500);
  const phone = validateOptionalStr(body.phone, 500);
  const trade = validateOptionalStr(body.trade, 500);
  const website = validateOptionalStr(body.website, 500);
  const services = validateOptionalStr(body.services, 1000);
  const monthlyCalls = validateOptionalStr(body.monthlyCalls, 500);
  const whenUnanswered = validateOptionalStr(body.whenUnanswered, 500);

  if (
    business === null ||
    phone === null ||
    trade === null ||
    website === null ||
    services === null ||
    monthlyCalls === null ||
    whenUnanswered === null
  ) {
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }

  // Optional handles array: max 12 items, each max 80 chars
  let handles: string[] = [];
  if (body.handles !== undefined && body.handles !== null) {
    if (!Array.isArray(body.handles) || body.handles.length > 12) {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
    for (const h of body.handles) {
      if (typeof h !== 'string' || h.trim().length > 80) {
        return res.status(400).json({ ok: false, error: 'Invalid request' });
      }
      if (h.trim()) handles.push(h.trim());
    }
  }

  // Optional pageUrl (max 300 chars)
  const pageUrl = validateOptionalStr(body.pageUrl, 300);
  if (pageUrl === null) {
    return res.status(400).json({ ok: false, error: 'Invalid request' });
  }

  // Optional utm object (max 6 keys, each key and value max 100)
  let utm: Record<string, string> = {};
  if (body.utm !== undefined && body.utm !== null) {
    if (typeof body.utm !== 'object' || Array.isArray(body.utm)) {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
    const keys = Object.keys(body.utm);
    if (keys.length > 6) {
      return res.status(400).json({ ok: false, error: 'Invalid request' });
    }
    for (const k of keys) {
      if (typeof k !== 'string' || k.length > 100) {
        return res.status(400).json({ ok: false, error: 'Invalid request' });
      }
      const v = body.utm[k];
      if (typeof v !== 'string' || v.length > 100) {
        return res.status(400).json({ ok: false, error: 'Invalid request' });
      }
      if (v.trim()) utm[k] = v.trim();
    }
  }

  // 6. Rate limit check (5 requests per 10 minutes per IP)
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  // Check required environment variables
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return res.status(500).json({ ok: false, error: 'Server is not configured' });
  }

  // 7. Build Telegram HTML message
  const sourceNameMap: Record<string, string> = {
    hero: 'Hero form',
    'final-cta': 'Final CTA form',
    'booking-page': 'Booking page',
  };

  const lines: string[] = ['🆕 <b>New demo request</b>'];
  lines.push(`<b>Source:</b> ${escapeHtml(sourceNameMap[source] || source)}`);

  if (name) lines.push(`<b>Name:</b> ${escapeHtml(name)}`);
  if (business) lines.push(`<b>Business:</b> ${escapeHtml(business)}`);
  if (email) lines.push(`<b>Email:</b> ${escapeHtml(email)}`);
  if (phone) lines.push(`<b>Phone:</b> ${escapeHtml(phone)}`);
  if (trade) lines.push(`<b>Trade:</b> ${escapeHtml(trade)}`);
  if (website) lines.push(`<b>Website:</b> ${escapeHtml(website)}`);
  if (services) lines.push(`<b>Services:</b> ${escapeHtml(services)}`);
  if (monthlyCalls) lines.push(`<b>Monthly calls:</b> ${escapeHtml(monthlyCalls)}`);
  if (whenUnanswered) lines.push(`<b>When unanswered:</b> ${escapeHtml(whenUnanswered)}`);
  if (handles.length > 0) {
    lines.push(`<b>AI should handle:</b> ${escapeHtml(handles.join(', '))}`);
  }
  if (pageUrl) lines.push(`<b>Page:</b> ${escapeHtml(pageUrl)}`);

  const utmEntries = Object.entries(utm);
  if (utmEntries.length > 0) {
    const utmStr = utmEntries.map(([k, v]) => `${k}=${v}`).join(', ');
    lines.push(`<b>UTM:</b> ${escapeHtml(utmStr)}`);
  }

  const timeUtc = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  lines.push(`<b>Time (UTC):</b> ${timeUtc}`);

  let text = lines.join('\n');
  if (text.length > 3900) {
    text = text.slice(0, 3900);
  }

  // 8. Send with fetch to Telegram
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!tgRes.ok) {
      let desc = 'Unknown Telegram error';
      try {
        const errJson = await tgRes.json();
        desc = errJson.description || desc;
      } catch {
        // ignore json parse error
      }
      console.error(`Telegram API error status: ${tgRes.status}, description: ${desc}`);
      return res.status(502).json({ ok: false, error: 'Could not deliver the message' });
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`Telegram request failed: ${err?.message || 'Network error'}`);
    return res.status(502).json({ ok: false, error: 'Could not deliver the message' });
  }
}
