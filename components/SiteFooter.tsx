import TrackedLink from '@/components/TrackedLink';
import { GENERAL, MAIN_SITE, OFFICE } from '@/lib/contact';

/** The footer on every page: the name, the address, the general email, the main site. */
export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="shell foot-in">
        <span className="foot-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/genovation-g.png" alt="" width={20} height={21} />
          Genovation AI
        </span>
        <span>
          {OFFICE.street}, {OFFICE.city}
        </span>
        <TrackedLink
          href={`mailto:${GENERAL.email}`}
          event={GENERAL.event}
          place="footer"
          className="foot-link"
          label={`Email Genovation AI at ${GENERAL.email}`}
        >
          {GENERAL.email}
        </TrackedLink>
        <TrackedLink href={MAIN_SITE} event="site_open" place="footer" className="foot-link" newTab>
          genovation.ai
        </TrackedLink>
      </div>
    </footer>
  );
}
