import Script from 'next/script';

/**
 * Google Ads global site tag.
 *
 * NEXT_PUBLIC_GOOGLE_ADS_ID is the AW-XXXXXXXXX conversion ID, created via the
 * Google Ads API in the conversion-tracking step. Until it is set, this renders
 * nothing at all rather than shipping a broken tag: a half-wired tag reports
 * zero conversions and looks identical to a page nobody converts on, which is
 * the single most expensive way to be wrong here.
 */
export default function GoogleTags() {
  const id = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!id) return null;

  return (
    <>
      <Script
        id="gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
