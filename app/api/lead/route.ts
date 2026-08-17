import { NextResponse } from 'next/server';
import { normalizePhone } from '@/lib/phone';

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

/**
 * Custom fields on the GoHighLevel contact.
 *
 * The gclid is the only piece of data here that cannot be reconstructed later.
 * It arrives once, on the landing URL, and is what ties a paying client back to
 * the exact search that produced them. Keeping it in a queryable field rather
 * than buried in a note is what makes offline conversion upload possible
 * without hand-parsing every record.
 */
const FIELD_GCLID = 'gyxW9O87KlIwMkVe44L6';
const FIELD_KEYWORD = '9a8rr9hm42i96V2u3xxl';

/**
 * Pipeline the lead is placed on, at the moment the form is submitted.
 *
 * Without this the first opportunity is only created when someone books a call,
 * so anyone who fills the form and never books sits on no board at all. On paid
 * traffic those are the majority, and they are exactly the people worth
 * following up. They were findable in Contacts by tag, which is not where anyone
 * looks.
 *
 * The GoHighLevel workflow moves this same card to Discovery Meeting on booking
 * rather than making a second one, because "Allow duplicate opportunities" is
 * off on that action. So the card travels:
 *   Form Submitted -> Discovery Meeting -> Meeting Done -> Proposal Sent -> Closed
 */
const PIPELINE_ID = 'REqE5nrYEM5dhsvhrW9P';                            // Form Pipeline
const STAGE_FORM_SUBMITTED = '9d242620-d53a-4d17-a8f5-263631543330';  // its first stage

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
  const phone = normalizePhone(clean(body.phone, 40));

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
        customFields: [
          ...(lead.gclid ? [{ id: FIELD_GCLID, value: lead.gclid }] : []),
          ...(lead.keyword ? [{ id: FIELD_KEYWORD, value: lead.keyword }] : []),
        ],
      }),
    });

    /**
     * A duplicate is not a failure.
     *
     * Deduplication was turned on in GoHighLevel on 14 August 2026, so creating
     * a contact whose email or phone already exists now returns 400 rather than
     * a second record. That happens for anyone Jamal has already met, anyone
     * who fills the form twice, and any existing client who clicks an ad.
     *
     * Treating it as a failure would drop the lead into the server log, and
     * with it the gclid, which is the one value in this whole system that
     * cannot be recovered later. The 400 body carries the existing contact's
     * id, so use it: attach this click's attribution to the record already
     * there, and carry on as if the create had worked.
     */
    let contactId: string | undefined;

    if (res.ok) {
      const created = await res.json();
      contactId = created?.contact?.id;
    } else {
      const detail = await res.text();
      let existing: string | undefined;
      try {
        existing = JSON.parse(detail)?.meta?.contactId;
      } catch {
        /* not JSON, fall through to the log */
      }

      if (!existing) {
        // still a 200 to the browser: the lead is in the log and recoverable
        console.error('[lead] GHL rejected the contact', res.status, detail, JSON.stringify(lead));
        return NextResponse.json({ ok: true, stored: 'log' });
      }

      contactId = existing;
      console.warn('[lead] contact already existed, updating it instead', existing);

      const fields = [
        ...(lead.gclid ? [{ id: FIELD_GCLID, value: lead.gclid }] : []),
        ...(lead.keyword ? [{ id: FIELD_KEYWORD, value: lead.keyword }] : []),
      ];

      const upd = await fetch(`${GHL}/contacts/${existing}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // no locationId on an update, the endpoint rejects it
        body: JSON.stringify({
          firstName,
          lastName: rest.join(' '),
          companyName: lead.company || undefined,
          source: `Google Ads: ${lead.keyword || lead.variant}`,
          tags: ['google-ads', `lp:${lead.variant}`].filter(Boolean),
          ...(fields.length ? { customFields: fields } : {}),
        }),
      });

      if (!upd.ok) {
        console.error('[lead] could not update the existing contact', upd.status, await upd.text());
      }
    }

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

    /**
     * Put them on the board.
     *
     * Deliberately last and deliberately non-fatal. The contact, its custom
     * fields and the note are what a sales call actually needs; the opportunity
     * is what makes the pipeline honest. Failing here should never downgrade a
     * lead that is already safely in the CRM.
     */
    if (contactId) {
      const oppRes = await fetch(`${GHL}/opportunities/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: API_VERSION,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          pipelineId: PIPELINE_ID,
          pipelineStageId: STAGE_FORM_SUBMITTED,
          locationId,
          contactId,
          name: lead.name,
          status: 'open',
          source: `Google Ads: ${lead.keyword || lead.variant}`,
        }),
      });

      if (!oppRes.ok) {
        console.error('[lead] opportunity failed', oppRes.status, await oppRes.text(), contactId);
      }
    }

    return NextResponse.json({ ok: true, stored: 'crm' });
  } catch (err) {
    console.error('[lead] GHL unreachable', err, JSON.stringify(lead));
    return NextResponse.json({ ok: true, stored: 'log' });
  }
}
