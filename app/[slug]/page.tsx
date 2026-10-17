import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DirectLines from '@/components/DirectLines';
import JobIcon from '@/components/JobIcon';
import LeadForm from '@/components/LeadForm';
import Masthead from '@/components/Masthead';
import OfficeMap from '@/components/OfficeMap';
import ProcessBoard from '@/components/ProcessBoard';
import SiteFooter from '@/components/SiteFooter';
import TrackedLink from '@/components/TrackedLink';
import { GENERAL, LINES, OFFICE, REVIEWS } from '@/lib/contact';
import { CLOSE, JOBS, REASONS } from '@/lib/content';
import { bySlug, CTA, CTA_NOTE, SLUGS } from '@/lib/variants';

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = bySlug(slug);
  if (!v) return {};
  return {
    title: v.title,
    description: v.description,
    alternates: { canonical: `/${v.slug}` },
  };
}

/** The H1 with its result words in the accent colour. */
function Headline({ text, accent }: { text: string; accent: string }) {
  const at = text.indexOf(accent);
  if (at === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="accent">{accent}</span>
      {text.slice(at + accent.length)}
    </>
  );
}

function Stars() {
  return (
    <span className="stars" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 20 20" width="15" height="15">
          <path d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export default async function VariantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = bySlug(slug);
  if (!v) notFound();

  return (
    <>
      <Masthead />

      <main>
        {/* ---------- hero ---------- */}
        <section className="hero">
          <div className="shell hero-in">
            <TrackedLink href={REVIEWS.link} event={REVIEWS.event} place="hero" className="proof" newTab>
              <Stars />
              <span>
                <b>{REVIEWS.rating}</b> on Google
              </span>
              <span className="proof-dot" aria-hidden="true">
                ·
              </span>
              <span>Burlington, Ontario</span>
            </TrackedLink>
            <h1 className="hero-h">
              <Headline text={v.h1} accent={v.accent} />
            </h1>
            <p className="hero-sub">{v.sub}</p>
            <div className="cta-block">
              <TrackedLink href="#board" event="cta_click" place="hero" className="btn btn-lg">
                {CTA}
              </TrackedLink>
              <p className="cta-note">{CTA_NOTE}</p>
            </div>
          </div>

          {/* ---------- what we take off your team ---------- */}
          <div className="shell">
            <div className="jobs-panel" id="what">
              <h2 className="jobs-h" data-reveal>
                What we take off your team
              </h2>
              <ul className="jobs">
                {JOBS.map((j) => (
                  <li key={j.title} className="job">
                    <JobIcon name={j.icon} />
                    <div>
                      <h3 className="job-h">{j.title}</h3>
                      <p className="job-p">{j.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* The section ids are ad sitelink targets (#how, #promise, #questions,
            #board). Renaming one breaks a sitelink silently: the page still
            loads, it just stops scrolling. */}

        {/* ---------- how it works ---------- */}
        <section className="band" id="how">
          <div className="shell">
            <h2 className="band-h" data-reveal>
              How it works
            </h2>
            <p className="band-lede">Four stages. You can see which one your job is in at any point.</p>
            <ProcessBoard />
            <div className="cta-block cta-left">
              <TrackedLink href="#board" event="cta_click" place="how" className="btn">
                {CTA}
              </TrackedLink>
              <p className="cta-note">{CTA_NOTE}</p>
            </div>
          </div>
        </section>

        {/* ---------- why owners pick us ---------- */}
        <section className="band soft" id="promise">
          <div className="shell">
            <h2 className="band-h" data-reveal>
              Why owners pick Genovation
            </h2>
            <p className="band-lede">
              A small team in Burlington, Ontario. We build around how your business works, then we
              stay to look after it.
            </p>
            <div className="reasons">
              <TrackedLink
                href={REVIEWS.link}
                event={REVIEWS.event}
                place="promise"
                className="reason reason-google"
                newTab
              >
                <Stars />
                <span className="reason-big">{REVIEWS.rating}</span>
                <span className="reason-h">on Google</span>
                <span className="reason-link">Read our reviews</span>
              </TrackedLink>
              {REASONS.map((r) => (
                <div key={r.title} className="reason">
                  <h3 className="reason-h">{r.title}</h3>
                  <p className="reason-p">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- the form ---------- */}
        <section className="band" id="board">
          <div className="shell">
            <div className="form-panel form-grid">
              <div className="form-side">
                <h2 className="band-h" data-reveal>
                  Tell us one task that eats your team’s time
                </h2>
                <p className="band-lede">{v.formNote}</p>
                {/* For the visitor who will not fill in a form. Kept quiet, so
                    the form is still the ask. */}
                <DirectLines place="form" ask="Rather talk than type? Call or email one of us." />
              </div>
              <div className="form-card">
                <LeadForm variant={v} />
              </div>
            </div>
          </div>
        </section>

        {/* ---------- questions ---------- */}
        <section className="band soft" id="questions">
          <div className="shell">
            <h2 className="band-h" data-reveal>
              The four questions everybody asks
            </h2>
            <div className="qa">
              <div>
                <h3 className="qa-q">Will this work for my business?</h3>
                <p className="qa-a">
                  That is what the free call is for. We look at how the task runs today before we
                  quote anything. If it is not worth automating, we tell you on the call, not after
                  an invoice.
                </p>
              </div>
              <div>
                <h3 className="qa-q">What happens when something breaks?</h3>
                <p className="qa-a">
                  Things change: a supplier alters a form, a system updates. Tell us and it is fixed
                  within 24 to 48 hours, by the person who built it.
                </p>
              </div>
              <div>
                <h3 className="qa-q">Will you disappear once you have been paid?</h3>
                <p className="qa-a">
                  No. The team who built it looks after it, and you get updates without asking. The
                  work is documented as it is built, so nothing depends on one person.
                </p>
              </div>
              <div>
                <h3 className="qa-q">What does it cost?</h3>
                <p className="qa-a">
                  It depends on the job, so there is no price on this page. You get a price after the
                  call, once there is something real to price. The call itself costs nothing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- where we are ---------- */}
        <section className="band" id="find">
          <div className="shell">
            <h2 className="band-h" data-reveal>
              Where to find us
            </h2>
            <p className="band-lede">
              One office in Burlington, and two phones. Each number rings a founder directly, not a
              call centre.
            </p>
            <div className="find">
              <ul className="find-list">
                {LINES.map((l) => (
                  <li key={l.who}>
                    <TrackedLink
                      href={`tel:${l.tel}`}
                      event={l.event}
                      place="office"
                      className="find-line"
                      label={`Call ${l.who} at ${l.shown}`}
                    >
                      <span className="find-who">{l.who}</span>
                      <span className="find-dash" aria-hidden="true">
                        -
                      </span>
                      <span className="find-num">{l.shown}</span>
                    </TrackedLink>
                    <TrackedLink
                      href={`mailto:${l.email}`}
                      event={l.emailEvent}
                      place="office"
                      className="find-mail"
                      label={`Email ${l.who} at ${l.email}`}
                    >
                      {l.email}
                    </TrackedLink>
                  </li>
                ))}
                <li className="find-general">
                  <span className="find-who">General enquiries</span>
                  <span className="find-dash" aria-hidden="true">
                    -
                  </span>
                  <TrackedLink
                    href={`mailto:${GENERAL.email}`}
                    event={GENERAL.event}
                    place="office"
                    className="find-general-mail"
                    label={`Email Genovation AI at ${GENERAL.email}`}
                  >
                    {GENERAL.email}
                  </TrackedLink>
                </li>
                <li>
                  <span className="find-addr">
                    {OFFICE.street}
                    <br />
                    {OFFICE.city}
                    <TrackedLink
                      href={OFFICE.mapLink}
                      event="map_open"
                      place="office"
                      className="find-open"
                      newTab
                    >
                      Open in Google Maps
                    </TrackedLink>
                  </span>
                </li>
              </ul>
              <OfficeMap />
            </div>
          </div>
        </section>

        {/* ---------- close ---------- */}
        <section className="close-band">
          <div className="shell">
            <div className="close-panel">
              <h2 className="close-h" data-reveal>
                {CLOSE.h}
              </h2>
              <p className="close-p">{CLOSE.p}</p>
              <div className="cta-block">
                <TrackedLink href="#board" event="cta_click" place="close" className="close-btn">
                  {CTA}
                </TrackedLink>
                <p className="cta-note">{CTA_NOTE}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
