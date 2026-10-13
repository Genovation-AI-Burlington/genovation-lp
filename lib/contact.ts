/**
 * The two direct lines and the office.
 *
 * One file, because the numbers appear in three places (beside the form, in the
 * office section, on the thank-you page) and a number that is right in two of
 * them and stale in the third is worse than no number at all.
 *
 * `event` is the GA4 event name for a tap on that line. One name per person,
 * rather than one event with a parameter, so the split reads straight off the
 * Events list without anybody registering a custom dimension first.
 */
export const LINES = [
  { who: 'Faisal', tel: '+12894555552', shown: '289 455 5552', event: 'call_faisal' },
  { who: 'Jamal', tel: '+12897003394', shown: '289 700 3394', event: 'call_jamal' },
] as const;

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
