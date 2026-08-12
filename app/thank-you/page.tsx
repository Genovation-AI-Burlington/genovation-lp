import type { Metadata } from 'next';
import Script from 'next/script';
import Mark from '@/components/Mark';

export const metadata: Metadata = {
  title: 'Pick a time | Genovation AI',
  robots: { index: false, follow: false },
};

/**
 * Step two of the hybrid. The lead is already captured, so nothing is lost if
 * they close this tab. Everything here is upside.
 *
 * NEXT_PUBLIC_GHL_CALENDAR_URL is the GoHighLevel calendar embed link. Without
 * it the page still works and says plainly what happens next.
 *
 * The booking widget changes height between choosing a slot and entering
 * details, and the details step is much taller. A fixed frame height hides the
 * confirm button, which silently kills every booking. Their form_embed.js
 * listens for the widget's own resize messages and sets the height inline,
 * which beats the stylesheet. The CSS height is the fallback if that script
 * ever fails to load, so it is deliberately taller than the tallest step.
 *
 * This is the only third-party script on the site, and it is only here. This
 * page is post-conversion, so its weight cannot affect Quality Score.
 */
export default async function ThankYou({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const base = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;
  const sp = await searchParams;
  const one = (k: string) => {
    const v = sp[k];
    return (Array.isArray(v) ? v[0] : v)?.trim() || '';
  };

  /**
   * Prefill the booking widget from what they already typed.
   *
   * Without this the visitor types name, email and phone a second time, and
   * GoHighLevel creates a SECOND contact when the two do not match character
   * for character. Ali's own test produced exactly that: two records for the
   * same person, one with the form answers and one with the booking.
   */
  let calendar = base;
  if (base) {
    const name = one('n');
    const first = name.split(/\s+/)[0] ?? '';
    const last = name.split(/\s+/).slice(1).join(' ');
    const params = new URLSearchParams();
    if (first) params.set('first_name', first);
    if (last) params.set('last_name', last);
    if (one('e')) params.set('email', one('e'));
    if (one('p')) params.set('phone', one('p'));
    const qs = params.toString();
    if (qs) calendar = `${base}${base.includes('?') ? '&' : '?'}${qs}`;
  }

  return (
    <>
      <header className="masthead">
        <div className="shell masthead-in">
          <div className="brand">
            <Mark />
            <span className="brand-name">Genovation AI</span>
          </div>
          <span className="masthead-note">Burlington, Ontario</span>
        </div>
      </header>

      <main className="booked">
        <div className="shell">
          <p className="stencil booked-tag">On the board</p>
          <h1 className="display booked-h">Your card is up. Now pick a time.</h1>
          <p className="booked-p">
            We have your details, so the call happens either way. Choosing a slot below just means
            you get it on your terms instead of ours. Thirty minutes, no pitch deck.
          </p>

          <div className="cal-frame">
            {calendar ? (
              <>
                <iframe
                  src={calendar}
                  id="ghl-booking"
                  title="Choose a time for your free 30 minute call"
                  scrolling="no"
                />
                <Script
                  src="https://link.msgsndr.com/js/form_embed.js"
                  strategy="afterInteractive"
                />
              </>
            ) : (
              <div className="cal-fallback">
                <h3>We will be in touch within one business day</h3>
                <p>
                  Booking is not switched on yet, so one of us will reach out directly to arrange a
                  time that suits you.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="foot">
        <div className="shell foot-in">
          <span>Genovation AI, Burlington, Ontario</span>
        </div>
      </footer>
    </>
  );
}
