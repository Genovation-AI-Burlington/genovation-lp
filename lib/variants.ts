/**
 * One entry per landing page variant. The slug is the page's public path and
 * is referenced elsewhere, so changing one is a breaking change.
 */

export type JobCard = {
  title: string;
  body: string;
  owner: string;
  stat: string;
  /** held back from production until the figure is confirmed */
  placeholder?: boolean;
};

export type Variant = {
  slug: string;
  /** the search phrase this page answers */
  keyword: string;
  title: string;
  description: string;
  h1: string;
  sub: string;
  slotTitle: string;
  slotNote: string;
  /** what the visitor is asked to describe, phrased in their own words */
  taskLabel: string;
  taskPlaceholder: string;
  inHand: JobCard[];
  fixed: JobCard[];
  closeH: string;
};

const FIXED_SHARED: JobCard[] = [
  {
    title: 'Dormant customer list',
    body: '10,000 idle leads in an optical store database, called and texted automatically about offers and expiring insurance.',
    owner: 'Closed',
    stat: '+15% revenue',
  },
  {
    title: 'Client onboarding',
    body: 'Same six documents collected by hand for every new client.',
    owner: 'Closed',
    stat: 'Week one',
  },
];

export const VARIANTS: Variant[] = [
  {
    slug: 'automation-company',
    keyword: 'automation companies near me',
    title: 'Automation company near you | Genovation AI, Burlington Ontario',
    description:
      'An automation company near you that saves your team hours every week. Custom built, glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'An automation company near you that saves your team hours every week',
    sub: 'Based in Burlington, Ontario. Custom built around your business, and glitches fixed within 48 hours of you flagging them. <b>Every job on this board has a name against it.</b>',
    slotTitle: 'Your repetitive task',
    slotNote: 'Put it on the board and we will talk it through on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. someone rekeys every order into two systems by hand',
    inHand: [
      {
        title: 'Invoice reminders',
        body: 'Overdue invoices found and followed up without anyone remembering to.',
        owner: 'Faisal',
        stat: 'Day 1',
      },
      {
        title: 'Quote follow up',
        body: 'Quotes that went quiet, picked back up on a schedule.',
        owner: 'Sai',
        stat: 'Day 2',
      },
    ],
    fixed: FIXED_SHARED,
    closeH: 'The nearest automation company is not the point. The one still answering in month six is.',
  },
  {
    slug: 'business-automation',
    keyword: 'business automation',
    title: 'Business automation that saves hours every week | Genovation AI',
    description:
      'Business automation built around how your business actually works. Not off the shelf. Glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'Business automation that saves your team hours every week',
    sub: 'Custom built around how your business actually works, not off the shelf. Glitches fixed within 48 hours of you flagging them. <b>Every job on this board has a name against it.</b>',
    slotTitle: 'Your repetitive task',
    slotNote: 'Put it on the board and we will talk it through on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. the same report rebuilt by hand every Monday morning',
    inHand: [
      {
        title: 'Report building',
        body: 'The Monday report assembled from four places, built by hand every week.',
        owner: 'Faisal',
        stat: 'Day 1',
      },
      {
        title: 'Lead routing',
        body: 'Enquiries sorted and passed to the right person without a middle step.',
        owner: 'Barkan',
        stat: 'Day 2',
      },
    ],
    fixed: FIXED_SHARED,
    closeH: 'Automation is easy to buy. Automation somebody still maintains is not.',
  },
  {
    slug: 'business-process-automation',
    keyword: 'business process automation',
    title: 'Business process automation, mapped then built | Genovation AI',
    description:
      'Business process automation: your process mapped first, then automated around how the work actually runs. Book a free 30 minute call.',
    h1: 'Business process automation that gives your team hours back every week',
    sub: 'Your process gets mapped first, then automated around how the work actually runs. Glitches fixed within 48 hours of you flagging them. <b>Every job on this board has a name against it.</b>',
    slotTitle: 'Your process',
    slotNote: 'Put it on the board and we will map it together on a free 30 minute call.',
    taskLabel: 'Which process has the most manual steps in it?',
    taskPlaceholder: 'e.g. order comes in, gets rekeyed, approved, then rekeyed again',
    inHand: [
      {
        title: 'Order to invoice',
        body: 'Five steps between an order arriving and an invoice going out. Two of them manual.',
        owner: 'Faisal',
        stat: 'Day 1',
      },
      {
        title: 'Approval chain',
        body: 'Sign off that waits in an inbox because nobody can see it is waiting.',
        owner: 'Sai',
        stat: 'Day 2',
      },
    ],
    fixed: FIXED_SHARED,
    closeH: 'A process you cannot see is a process nobody can fix.',
  },
  {
    slug: 'ai-automation-agency',
    keyword: 'ai automation agency',
    title: 'AI automation agency in Burlington, Ontario | Genovation AI',
    description:
      'An AI automation agency that builds around how your business works, then stays to maintain it. Glitches fixed within 48 hours. Book a free 30 minute call.',
    h1: 'An AI automation agency that stays after the work is delivered',
    sub: 'Custom built around how your business actually works, then maintained. Glitches fixed within 48 hours of you flagging them. <b>Every job on this board has a name against it.</b>',
    slotTitle: 'Your repetitive task',
    slotNote: 'Put it on the board and we will talk it through on a free 30 minute call.',
    taskLabel: 'What repetitive job eats the most time?',
    taskPlaceholder: 'e.g. the same list of customers followed up by hand every month',
    inHand: [
      {
        title: 'Invoice reminders',
        body: 'Overdue invoices found and followed up without anyone remembering to.',
        owner: 'Faisal',
        stat: 'Day 1',
      },
      {
        title: 'Lead routing',
        body: 'Enquiries sorted and passed to the right person without a middle step.',
        owner: 'Barkan',
        stat: 'Day 2',
      },
    ],
    fixed: FIXED_SHARED,
    closeH: 'Plenty of agencies will build it. Fewer will still be answering in month six.',
  },
];

export const bySlug = (slug: string) => VARIANTS.find((v) => v.slug === slug);

export const SLUGS = VARIANTS.map((v) => v.slug);

/** the offer, in one place, because the ads promise it word for word */
export const OFFER = 'free 30 minute call';
