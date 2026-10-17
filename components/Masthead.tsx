import Mark from '@/components/Mark';
import TrackedLink from '@/components/TrackedLink';
import { MAIN_SITE } from '@/lib/contact';

/**
 * The top bar on every page.
 *
 * The logo and the name link to genovation.ai, and so does a written link,
 * because a logo that happens to be clickable is not a link most visitors
 * think to try. Both open in a new tab: this is a paid landing page, and a
 * visitor who goes to check the company should find their half-filled form
 * still here when they come back.
 *
 * Both count as `site_open`, with where they were tapped, so it shows how many
 * visitors leave to check Genovation before deciding.
 */
export default function Masthead() {
  return (
    <header className="masthead">
      <div className="shell masthead-in">
        <TrackedLink href={MAIN_SITE} event="site_open" place="logo" className="brand" newTab>
          <Mark />
          <span className="brand-name">Genovation AI</span>
        </TrackedLink>
        <div className="masthead-side">
          <span className="masthead-note">Burlington, Ontario</span>
          <TrackedLink
            href={MAIN_SITE}
            event="site_open"
            place="top_link"
            className="masthead-site"
            newTab
          >
            Visit genovation.ai
          </TrackedLink>
        </div>
      </div>
    </header>
  );
}
