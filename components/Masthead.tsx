import TrackedLink from '@/components/TrackedLink';
import { MAIN_SITE } from '@/lib/contact';
import { CTA } from '@/lib/variants';

/**
 * The top bar on every page. It stays at the top while the page scrolls.
 *
 * The logo and the name link to genovation.ai, and so does a written link,
 * because a logo that happens to be clickable is not a link most visitors
 * think to try. Both open in a new tab: this is a paid landing page, and a
 * visitor who goes to check the company should find their half-filled form
 * still here when they come back.
 *
 * Both count as `site_open`, with where they were tapped, so it shows how many
 * visitors leave to check Genovation before deciding. The button counts as
 * `cta_click`. The thank-you page has no form, so it passes `cta={false}`.
 */
export default function Masthead({ cta = true }: { cta?: boolean }) {
  return (
    <header className="masthead">
      <div className="shell masthead-in">
        <TrackedLink href={MAIN_SITE} event="site_open" place="logo" className="brand" newTab>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/genovation-g.png" alt="" width={30} height={32} className="brand-mark" />
          <span className="brand-name">Genovation AI</span>
        </TrackedLink>
        <nav className="masthead-side" aria-label="Genovation">
          <TrackedLink
            href={MAIN_SITE}
            event="site_open"
            place="top_link"
            className="masthead-site"
            newTab
          >
            Visit genovation.ai
          </TrackedLink>
          {cta && (
            <TrackedLink href="#board" event="cta_click" place="topbar" className="btn btn-sm masthead-cta">
              {CTA}
            </TrackedLink>
          )}
        </nav>
      </div>
    </header>
  );
}
