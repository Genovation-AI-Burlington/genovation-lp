import Script from 'next/script';

/**
 * Google tags: Ads conversion tracking and GA4 behaviour tracking.
 *
 * NEXT_PUBLIC_GOOGLE_ADS_ID is the AW-XXXXXXXXX conversion ID, created via the
 * Google Ads API in the conversion-tracking step. NEXT_PUBLIC_GA4_ID is the
 * G-XXXXXXXXXX measurement ID of the GA4 data stream for this domain.
 *
 * The two are independent. Either can be set without the other, and if neither
 * is set this renders nothing at all rather than shipping a broken tag: a
 * half-wired tag reports zero conversions and looks identical to a page nobody
 * converts on, which is the single most expensive way to be wrong here.
 *
 * gtag.js is loaded once and configured twice. The library is the same file
 * whichever ID requests it, so a second script tag would only cost a round trip
 * and risk a race between two copies defining the same global.
 */
export default function GoogleTags() {
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;

  const loader = ads || ga4;
  if (!loader) return null;

  const configs = [
    ads ? `gtag('config', '${ads}');` : '',
    // send_page_view stays on: this is a four-page site with no client routing
    // between variants, so the automatic pageview is the correct one.
    ga4 ? `gtag('config', '${ga4}');` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${loader}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${configs}`}
      </Script>
    </>
  );
}
