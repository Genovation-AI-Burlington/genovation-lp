/**
 * Click attribution.
 *
 * The gclid is what ties a booked call back to the exact keyword and ad that
 * paid for it. It arrives once, on the landing URL, and is gone the moment the
 * visitor navigates. Capture it immediately and persist it, because the form
 * submit can happen minutes and several page views later.
 */

const KEY = 'gv_attr';

export type Attribution = {
  gclid: string;
  gbraid: string;
  wbraid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landing_path: string;
  referrer: string;
  captured_at: string;
};

const EMPTY: Attribution = {
  gclid: '',
  gbraid: '',
  wbraid: '',
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_term: '',
  utm_content: '',
  landing_path: '',
  referrer: '',
  captured_at: '',
};

const FIELDS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

/**
 * Read the URL, merge over anything already stored, persist, return it.
 * First touch wins for a field that is already set, so an internal navigation
 * that drops the query string cannot wipe the original click.
 */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY;

  let stored: Partial<Attribution> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(KEY) || '{}');
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const next: Attribution = { ...EMPTY, ...stored };

  for (const f of FIELDS) {
    const fromUrl = params.get(f);
    if (fromUrl && !next[f]) next[f] = fromUrl.slice(0, 300);
  }

  if (!next.landing_path) next.landing_path = window.location.pathname;
  if (!next.referrer) next.referrer = document.referrer.slice(0, 300);
  if (!next.captured_at) next.captured_at = new Date().toISOString();

  try {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private browsing. the form still carries this submission's values. */
  }

  return next;
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return EMPTY;
  try {
    return { ...EMPTY, ...JSON.parse(sessionStorage.getItem(KEY) || '{}') };
  } catch {
    return EMPTY;
  }
}
