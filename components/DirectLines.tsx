import TrackedLink from '@/components/TrackedLink';
import { LINES } from '@/lib/contact';

/**
 * Both founders, each with a number and an email, as a short ruled list.
 *
 * Used beside the form and on the thank-you page, so the two never drift.
 * Kept quiet on purpose, with no orange block: in both places something else
 * is the main ask, the form on one page and the calendar on the other.
 *
 * `place` goes out with every tap so the busy spot can be told apart.
 */
export default function DirectLines({ place, ask }: { place: string; ask: string }) {
  return (
    <div className="lines-strip">
      <p className="lines-ask">{ask}</p>
      <ul className="lines-row">
        {LINES.map((l) => (
          <li key={l.who} className="person">
            <TrackedLink
              href={`tel:${l.tel}`}
              event={l.event}
              place={place}
              className="line"
              label={`Call ${l.who} at ${l.shown}`}
            >
              <span className="line-who">{l.who}</span>
              <span className="line-dash" aria-hidden="true">
                -
              </span>
              <span className="line-num">{l.shown}</span>
            </TrackedLink>
            <TrackedLink
              href={`mailto:${l.email}`}
              event={l.emailEvent}
              place={place}
              className="line-mail"
              label={`Email ${l.who} at ${l.email}`}
            >
              {l.email}
            </TrackedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
