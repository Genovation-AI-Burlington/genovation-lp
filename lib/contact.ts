/**
 * The two direct lines, the general address, the office, and the main site.
 *
 * One file, because these appear in several places (the top bar, beside the
 * form, in the office section, on the thank-you page, in the footer) and a
 * number or address that is right in two of them and stale in a third is worse
 * than none at all.
 *
 * `event` and `emailEvent` are the GA4 event names for a tap on that line. One
 * name per person and per channel, rather than one event with a parameter, so
 * the split reads straight off the Events list without anybody registering a
 * custom dimension first. The phone event names are unchanged from 13 Oct 2026,
 * so the counts carry on from before the format changed.
 */
export const LINES = [
  {
    who: 'Faisal',
    tel: '+12894555552',
    shown: '+1 (289) 455-5552',
    event: 'call_faisal',
    email: 'faisal.a@genovation.ai',
    emailEvent: 'email_faisal',
  },
  {
    who: 'Jamal',
    tel: '+12897003394',
    shown: '+1 (289) 700-3394',
    event: 'call_jamal',
    email: 'jamal.h@genovation.ai',
    emailEvent: 'email_jamal',
  },
] as const;

/** For anyone who would rather not write to one named person. */
export const GENERAL = { email: 'contact@genovation.ai', event: 'email_contact' } as const;

/**
 * The company's own site. The landing page read as a stranger's page with no
 * way back to Genovation (Jamal, 16 Oct 2026), so the top bar links here.
 */
export const MAIN_SITE = 'https://genovation.ai';

/**
 * The Google Business Profile rating, shown as proof above the H1 and in the
 * "why owners pick us" section. Read by hand from the listing on 17 Oct 2026:
 * 5.0 stars from 8 reviews. It is typed here, not fetched, so it has to be
 * checked against the listing again whenever a review comes in. A rating on
 * this page that the listing contradicts is worse than no rating at all.
 *
 * The link is the same listing as the office map. It shows the rating and the
 * reviews under it.
 */
export const REVIEWS = {
  rating: '5.0',
  link: 'https://maps.app.goo.gl/3ZhQy1bdu8TCR9b4A',
  event: 'reviews_open',
} as const;

/** How a line is written wherever it is shown: the name, a hyphen, the number. */
export const lineText = (l: { who: string; shown: string }) => `${l.who} - ${l.shown}`;

export const OFFICE = {
  street: '1440 Grahams Ln, Unit 4',
  city: 'Burlington, ON L7S 1W3',
  /** The share link Google gave for the listing. Opens the app on a phone. */
  mapLink: 'https://maps.app.goo.gl/3ZhQy1bdu8TCR9b4A',
  /**
   * The embed for the same listing. The `!2sca` pairs set the region to Canada:
   * the code as first copied carried `!2sin`, which labels and biases the map
   * for India because of where it was copied from, not where the office is.
   */
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2902.1130201561255!2d-79.8110262!3d43.332823999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882c9fb1e9cbbc03%3A0x19f1d0e4ab7fb5c0!2sGenovation%20AI!5e0!3m2!1sen!2sca!4v1791911777351!5m2!1sen!2sca',
} as const;
