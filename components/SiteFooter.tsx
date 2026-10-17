import TrackedLink from '@/components/TrackedLink';
import { GENERAL, OFFICE } from '@/lib/contact';

/** The footer on every page: the address, the general email, what we do. */
export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="shell foot-in">
        <span>
          Genovation AI, {OFFICE.street}, {OFFICE.city}
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
        <span>Custom automation, voice agents, and internal tools.</span>
      </div>
    </footer>
  );
}
