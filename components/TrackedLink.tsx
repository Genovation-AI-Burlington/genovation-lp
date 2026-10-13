'use client';

import { stamp, track } from '@/lib/analytics';

/**
 * A link that reports its own click.
 *
 * A phone call started from this page shows up nowhere else. Google Ads sees a
 * click and no lead, and GoHighLevel sees nothing at all, because no form was
 * sent. The tap on the number is the only trace there is, so it is counted
 * here. It is a count of taps, not of calls: on a laptop a tap on a number
 * often goes nowhere.
 *
 * Every tap carries the exact second, in Burlington time and in India time, so
 * the team's own test taps can be told apart from a visitor's.
 */
export default function TrackedLink({
  href,
  event,
  place,
  className,
  children,
  newTab,
  label,
}: {
  href: string;
  event: string;
  /** Where on the page the link sits, so the busy placement can be told apart. */
  place: string;
  className?: string;
  children: React.ReactNode;
  newTab?: boolean;
  label?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      onClick={() => track(event, { place, ...stamp() })}
      {...(newTab ? { target: '_blank', rel: 'noopener' } : {})}
    >
      {children}
    </a>
  );
}
