/**
 * The page's words that are the same on all four variants, in one place, so a
 * line, a step or an icon can be changed without touching the layout.
 *
 * Per-variant words (H1, sub line, form note) live in `lib/variants.ts`. The
 * phones, emails, address and rating live in `lib/contact.ts`.
 */

import type { JobIconName } from '@/components/JobIcon';

/** "What we take off your team". `icon` names a drawing in `components/JobIcon.tsx`. */
export const JOBS: { title: string; body: string; icon: JobIconName }[] = [
  {
    title: 'Calls and messages answered',
    body: 'A phone or chat agent answers, takes the details and books the call, day or night.',
    icon: 'calls',
  },
  {
    title: 'Every new lead followed up',
    body: 'New enquiries get a reply and a follow up, without anyone having to remember.',
    icon: 'follow-up',
  },
  {
    title: 'Paperwork done for you',
    body: 'Data entry, invoices and the weekly report, done without anyone retyping them.',
    icon: 'paperwork',
  },
  {
    title: 'Your tools connected',
    body: 'Your CRM, email and accounting software pass information to each other by themselves.',
    icon: 'connected',
  },
];

/**
 * "How it works". Any number of stages and steps works: the board lays itself
 * out from this list and counts the steps itself.
 */
export const STAGES: { name: string; steps: string[] }[] = [
  {
    name: 'Free call',
    steps: [
      'You tell us the task that eats the time',
      'We look at how it runs today',
      'We tell you if it is worth automating',
    ],
  },
  {
    name: 'Map it',
    steps: [
      'We map every step of the task',
      'We pick the tools you already use',
      'You get a plan and a price',
    ],
  },
  {
    name: 'Build and test',
    steps: [
      'A named developer builds it',
      'It is connected to your tools',
      'We test it before it goes live',
    ],
  },
  {
    name: 'Live and looked after',
    steps: [
      'It runs every day',
      'Glitches fixed in 24 to 48 hours',
      'You get updates without asking',
    ],
  },
];

/**
 * How fast the board follows the scroll. Nothing is pinned; the page scrolls
 * normally.
 *
 * Wide screens: a step is checked for every `pxPerStep` pixels scrolled after
 * the top of the board passes `startAt` of the screen height (0.85 = 85% down).
 * 12 steps x 64 = 768 px of scroll. Bigger is slower. (Was 80 while pinned;
 * Ali asked for a bit faster on 18 Oct 2026.)
 * Phones and tablets: a step is checked when its middle passes `line` of the
 * screen height (0.7 = 70% down). Smaller is later.
 */
export const BOARD_PACE = { pxPerStep: 64, startAt: 0.85, line: 0.7 };

/** "Why owners pick Genovation". Each one is already promised in the live ads. */
export const REASONS: { title: string; body: string }[] = [
  { title: 'Fixed in 24 to 48 hours', body: 'Tell us something broke. It is fixed within 24 to 48 hours.' },
  { title: 'Hours back in week one', body: 'Most teams notice hours coming back inside the first week.' },
  { title: 'Built around your business', body: 'Custom built and connected to the tools you already use. Not a template.' },
  { title: 'One named developer', body: 'The same person owns your job from start to finish.' },
  { title: 'Updates without asking', body: 'Regular updates, whether or not there is good news that week.' },
  { title: 'Based in Burlington', body: 'A real office at 1440 Grahams Lane, Burlington, Ontario.' },
];

/**
 * The closing panel, the same on every variant. Plain on purpose: it says what
 * we do for them, not a comparison the visitor has to decode.
 */
export const CLOSE = {
  h: 'Less on your plate. More time to grow.',
  p: 'Bring one repetitive job to a free 30 minute call. We tell you honestly if it is worth automating.',
};
