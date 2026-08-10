import type { Metadata } from 'next';
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
 */
export default function ThankYou() {
  const calendar = process.env.NEXT_PUBLIC_GHL_CALENDAR_URL;

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
              <iframe
                src={calendar}
                title="Choose a time for your free 30 minute call"
                loading="lazy"
                scrolling="no"
              />
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
