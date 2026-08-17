import type { Metadata, Viewport } from 'next';
import { Archivo } from 'next/font/google';
import GoogleTags from '@/components/GoogleTags';
import PageAnalytics from '@/components/PageAnalytics';
import './globals.css';

/**
 * One family, two widths. Archivo descends from American gothic signage, which
 * is the lettering this world is actually made of: painted column heads and
 * stamped card labels. Self-hosted by next/font, so no third-party font request
 * on a page whose speed Google scores directly.
 */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  display: 'swap',
  variable: '--font-archivo',
});

/** Direction contract. Emitted into the built HTML so it can be audited. */
const CONTRACT = `
<!--
IMPECCABLE DIRECTION CONTRACT  ·  seed 690a21b3  ·  persuade
THESIS: A visitor's fear here is not "will it work", it is "will they vanish once
  they are paid". This page answers that with its structure, not a sentence
  claiming reliability. It refuses the category default: centred hero, three icon
  cards, a form at the bottom.
OWN-WORLD: The steel job board in a service company's back office. Painted navy
  ground, cream enamel job cards with hard keylines, stencilled condensed column
  heads, one signal orange used only where something can be done.
STORY: Every job on this board has an owner and a state. Mine would too. I write
  my task on the blank card and it joins the board.
FIRST VIEWPORT: Masthead, then an H1 carrying the ad group's keyword inside a real
  sentence, then three columns, FLAGGED / IN HAND / FIXED. The blank card and its
  form sit first in FLAGGED, top left, where reading starts. The 48 hour rule
  closes the board.
FORM: Dispatch board. Candidate 5 of 7 on the grounded list, assigned by seed 690a21b3.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->
`;

export const metadata: Metadata = {
  metadataBase: new URL('https://automation.genovation.ai'),
  title: 'Genovation AI',
  description: 'Custom automation, built around your business. Burlington, Ontario.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = {
  themeColor: '#1A2331',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={archivo.variable}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <GoogleTags />
        <PageAnalytics />
        {children}
      </body>
    </html>
  );
}
