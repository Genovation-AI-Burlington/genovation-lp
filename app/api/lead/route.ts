import { NextResponse } from 'next/server';

/**
 * Lead intake.
 *
 * Forwards to GoHighLevel, the CRM already in use at app.genovation.ai, using
 * API v2 and a private integration token.
 *
 * Env (set these in Vercel, not in the repo):
 *   GHL_PIT          private integration token
 *   GHL_LOCATION_ID  the sub-account the contact belongs to
 *
 * If either is missing the route still returns 200 and logs the lead in full.
 * That is deliberate: a paid click that produced a real enquiry must never be
 * lost because a token was not set. A lead in a log can be recovered by hand,
 * a lead rejected at the browser is gone forever.
 */

const GHL = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  task?: string;
  hours?: string;
  variant?: string;
  keyword?: string;
  attribution?: Record<string, string>;
};

const clean = (s: unknown, max = 500) => (typeof s === 'string' ? s.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);

  if (!name || !email || !phone) {
    return NextResponse.json({ error: 'missing required fields' }, { status: 422 });
  }

  const attr = body.attribution ?? {};
  const lead = {
    name,
    email,
    phone,
    company: clean(body.company, 160),
    task: clean(body.task, 1500),
    hours: clean(body.hours, 40),
    variant: clean(body.variant, 60),
    keyword: clean(body.keyword, 120),
    gclid: clean(attr.gclid, 300),
    utm_campaign: clean(attr.utm_campaign, 200),
    utm_term: clean(attr.utm_term, 200),
    received_at: new Date().toISOString(),
  };

  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.warn('[lead] GHL not configured, lead captured in logs only:', JSON.stringify(lead));
    return NextResponse.json({ ok: true, stored: 'log' });
  }

  const [firstName, ...rest] = name.split(/\s+/);

  try {
    const res = await fetch(`${GHL}/contacts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: API_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName: rest.join(' '),
        email,
        phone,
        companyName: lead.company || undefined,
        source: `Google Ads: ${lead.keyword || lead.variant}`,
        tags: ['google-ads', `lp:${lead.variant}`].filter(Boolean),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      // still a 200 to the browser: the lead is in the log and recoverable
      console.error('[lead] GHL rejected the contact', res.status, detail, JSON.stringify(lead));
      return NextResponse.json({ ok: true, stored: 'log' });
    }

    // The contact endpoint rejects a `notes` property, so the detail the sales
    // call actually needs goes on as a separate note. Failing here still leaves
    // a usable contact, so it never downgrades the result.
    const created = await res.json();
    const contactId = created?.contact?.id;

    if (contactId) {
      const note = [
        `Ad group keyword: ${lead.keyword}`,
        `Landing page: /${lead.variant}`,
        `Task: ${lead.task}`,
        `Hours a week: ${lead.hours || 'not given'}`,
        `gclid: ${lead.gclid || 'none'}`,
        `Campaign: ${lead.utm_campaign || 'none'}`,
      ].join('\n');

      const noteRes = await fetch(`${GHL}/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ body: note }),
      });

      if (!noteRes.ok) {
        console.error('[lead] note failed', noteRes.status, await noteRes.text(), contactId);
      }
    }

    return NextResponse.json({ ok: true, stored: 'crm' });
  } catch (err) {
    console.error('[lead] GHL unreachable', err, JSON.stringify(lead));
    return NextResponse.json({ ok: true, stored: 'log' });
  }
}
