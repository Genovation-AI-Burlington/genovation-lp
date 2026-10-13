/**
 * Behaviour tracking, GA4.
 *
 * The Google Ads tag answers one question: did this click become a lead. It
 * says nothing about the clicks that did not, which at this budget is roughly
 * 47 out of every 50. This module covers that gap.
 *
 * Four questions, in the order they matter:
 *
 *   1. Do people reach the form at all, or do they leave above it
 *   2. Do they start filling it and then stop
 *   3. How far down the page do they read
 *   4. How long were they here before any of the above
 *
 * Everything fires through gtag, so nothing here works or breaks independently
 * of the tag already on the page. If GA4 is not configured, `track` is a no-op
 * rather than an error, which keeps a missing env var from breaking the form.
 */

type Params = Record<string, string | number | boolean>;

/** Milliseconds since this page began, rounded to the second. */
function secondsOnPage(): number {
  if (typeof performance === 'undefined') return 0;
  return Math.round(performance.now() / 1000);
}

export function track(event: string, params: Params = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  if (typeof w.gtag !== 'function') return;
  w.gtag('event', event, { ...params, seconds: secondsOnPage() });
}

/**
 * The moment something happened, written out in both of the team's time zones.
 *
 * A tap on a phone number is counted, but a count alone cannot say whose tap
 * it was. The team taps these numbers too, while testing. With the exact second
 * attached, a tap can be matched against "that was me, at 2:14" and set aside,
 * and whatever is left is a real visitor.
 *
 * Both zones are written on every event, Burlington and India, so nobody has
 * to convert one into the other to check. The zones are fixed by name, so the
 * visitor's own clock setting has no say in what is recorded.
 */
function clock(d: Date, timeZone: string, fixedLabel?: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZoneName: 'short',
    }).formatToParts(d);
    const p: Record<string, string> = {};
    for (const part of parts) p[part.type] = part.value;
    // Burlington switches between EST and EDT, so its label is read from the
    // date. India has one zone all year and browsers print it as "GMT+5:30".
    const zone = fixedLabel ?? p.timeZoneName;
    return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${zone}`;
  } catch {
    return d.toISOString();
  }
}

export function stamp(now: Date = new Date()): { time_toronto: string; time_india: string } {
  return {
    time_toronto: clock(now, 'America/Toronto'),
    time_india: clock(now, 'Asia/Kolkata', 'IST'),
  };
}

/**
 * Scroll milestones and form visibility.
 *
 * Returns a cleanup function. Both observers are one-shot per milestone: a
 * visitor who scrolls up and back down reports 50% once, not three times,
 * because the question is how far they got, not how much they moved.
 */
export function startPageTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const MILESTONES = [25, 50, 75, 100] as const;
  const seen = new Set<number>();

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;

    // A page shorter than the viewport has nothing to measure. Reporting 100%
    // there would read as "everyone finished" when nobody scrolled at all.
    if (scrollable <= 0) return;

    const pct = ((window.scrollY + window.innerHeight) / doc.scrollHeight) * 100;

    for (const m of MILESTONES) {
      if (pct >= m && !seen.has(m)) {
        seen.add(m);
        track('scroll_depth', { percent: m });
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // a visitor who lands mid-page, or on a short viewport

  // The form sits high on this layout, so a low form_view rate means something
  // is wrong with the page rather than with the offer.
  let io: IntersectionObserver | undefined;
  const form = document.querySelector('form');

  if (form && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            track('form_view');
            io?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(form);
  }

  return () => {
    window.removeEventListener('scroll', onScroll);
    io?.disconnect();
  };
}
