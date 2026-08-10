import type { MetadataRoute } from 'next';

/**
 * Paid landing pages stay out of the organic index so they cannot compete with
 * genovation.ai for the same terms.
 *
 * AdsBot is allowed explicitly and deliberately. AdsBot-Google ignores the
 * wildcard user-agent block by design, so a bare `User-agent: * / Disallow: /`
 * would be fine in theory, but naming it removes any chance of a landing page
 * being disapproved for being uncrawlable. That disapproval stops the ads, not
 * just the crawl.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: 'AdsBot-Google', allow: '/' },
      { userAgent: 'AdsBot-Google-Mobile', allow: '/' },
      { userAgent: '*', disallow: '/' },
    ],
  };
}
