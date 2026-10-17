import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import GoogleTags from '@/components/GoogleTags';
import PageAnalytics from '@/components/PageAnalytics';
import './globals.css';

/**
 * One family for headings and text. Geist is a plain, even grotesque: it reads
 * as a working company rather than a costume. Self-hosted by next/font, so no
 * third-party font request on a page whose speed Google scores directly.
 */
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

/** Direction contract. Emitted into the built HTML so it can be audited. */
const CONTRACT = `
<!--
DIRECTION CONTRACT  ·  revamp of 17 Oct 2026  ·  persuade
THESIS: A business owner who clicked an ad decides in seconds whether this is a
  real company. The page proves that before it asks for anything: a real rating,
  a real office, real names and numbers, and the work shown as a process.
FIRST VIEWPORT: proof line, the H1 carrying the ad group's keyword inside a real
  sentence, one line on what we do, one button and what the call costs.
PEAK: the process board. Four stages, and each step is checked off as you scroll.
RULES: real facts only, no invented numbers, no client stories, one accent (the
  blue of the Genovation logo), light motion that stops when the device asks.
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
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA" className={geist.variable}>
      <body>
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        <GoogleTags />
        <PageAnalytics />
        {children}
      </body>
    </html>
  );
}
