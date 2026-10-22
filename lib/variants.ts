/**
 * One entry per landing page variant. The slug is the page's public path and
 * is referenced elsewhere, so changing one is a breaking change.
 *
 * Every H1 carries its ad group's keyword inside a real sentence, because
 * Google scores the page against the keyword the ad bid on. Since 22 Oct 2026
 * the H1 sits under the big shared headline (`HERO` in lib/content.ts) as the
 * smaller line; it is still the page's only H1.
 */

export type Variant = {
  slug: string;
  /** the search phrase this page answers */
  keyword: string;
  title: string;
  description: string;
  /** the H1: shown as the smaller line under the big headline, carrying the ad group's keyword */
  h1: string;
  /** the line under the form heading */
  formNote: string;
  /** what the visitor is asked to describe, phrased in their own words */
  taskLabel: string;
  taskPlaceholder: string;
};

export const VARIANTS: Variant[] = [
  {
    slug: 'automation-company',
    keyword: 'automation companies near me',
    title: 'Automation company near you | Genovation AI, Burlington Ontario',
    description:
      'An automation company near you that saves your team hours every week. Custom built, glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'An automation company near you that saves your team hours every week',
    formNote: 'We will talk it through with you on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. someone rekeys every order into two systems by hand',
  },
  {
    slug: 'business-automation',
    keyword: 'business automation',
    title: 'Business automation that saves hours every week | Genovation AI',
    description:
      'Business automation built around how your business actually works. Not off the shelf. Glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'Business automation that saves your team hours every week',
    formNote: 'We will talk it through with you on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. the same report rebuilt by hand every Monday morning',
  },
  {
    slug: 'business-process-automation',
    keyword: 'business process automation',
    title: 'Business process automation, mapped then built | Genovation AI',
    description:
      'Business process automation: your process mapped first, then automated around how the work actually runs. Book a free 30 minute call.',
    h1: 'Business process automation that gives your team hours back every week',
    formNote: 'We will map it with you on a free 30 minute call.',
    taskLabel: 'Which process has the most manual steps in it?',
    taskPlaceholder: 'e.g. order comes in, gets rekeyed, approved, then rekeyed again',
  },
  {
    slug: 'ai-automation-agency',
    keyword: 'ai automation agency',
    title: 'AI automation agency in Burlington, Ontario | Genovation AI',
    description:
      'An AI automation agency that builds around how your business works, then stays to maintain it. Glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'An AI automation agency that stays after the work is delivered',
    formNote: 'We will talk it through with you on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. the same list of customers followed up by hand every month',
  },
];

export const bySlug = (slug: string) => VARIANTS.find((v) => v.slug === slug);

export const SLUGS = VARIANTS.map((v) => v.slug);

/** the offer, in one place, because the ads promise it word for word */
export const OFFER = 'free 30 minute call';

/** The one label for every button that leads to the form, and for the form's own button. */
export const CTA = 'Book my free call';

/** The line under each of those buttons: what the call costs, which is nothing. */
export const CTA_NOTE = 'Free 30 minute call. No payment, no obligation.';
