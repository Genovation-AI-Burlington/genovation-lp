import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/LeadForm';
import Mark from '@/components/Mark';
import { bySlug, SLUGS, type JobCard } from '@/lib/variants';

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

function Card({ card, closed }: { card: JobCard; closed?: boolean }) {
  const cls = ['card', closed ? 'is-closed' : '', card.placeholder ? 'is-placeholder' : '']
    .filter(Boolean)
    .join(' ');
  return (
    <article className={cls}>
      {card.placeholder && <span className="placeholder-flag">Real number needed</span>}
      <h3 className="card-title">{card.title}</h3>
      <p className="card-body">{card.body}</p>
      <p className="card-foot">
        <span className="owner">{card.owner}</span>
        <span>{card.stat}</span>
      </p>
    </article>
  );
}

export default async function VariantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const v = bySlug(slug);
  if (!v) notFound();

  return (
    <>
      <header className="masthead">
        <div className="shell masthead-in">
          <div className="brand">
            <Mark />
            <span className="brand-name">Genovation AI</span>
          </div>
          <span className="masthead-note">Burlington, Ontario</span>
        </div>
      </header>

      <main>
        {/* ---------- the board ---------- */}
        <section className="board">
          <div className="shell">
            <div className="board-head">
              <h1 className="display board-h1">{v.h1}</h1>
              <p className="board-sub" dangerouslySetInnerHTML={{ __html: v.sub }} />
            </div>

            <div className="cols">
              <div className="col">
                <div className="col-head">
                  <span className="stencil">Flagged</span>
                  <span className="stencil count">Yours</span>
                </div>
                <div className="slot place" id="board">
                  <h2 className="slot-title">{v.slotTitle}</h2>
                  <p className="slot-note">{v.slotNote}</p>
                  <LeadForm variant={v} />
                </div>
              </div>

              <div className="col">
                <div className="col-head">
                  <span className="stencil">In hand</span>
                  <span className="stencil count">{v.inHand.length}</span>
                </div>
                {v.inHand.map((c) => (
                  <Card key={c.title} card={c} />
                ))}
              </div>

              <div className="col">
                <div className="col-head">
                  <span className="stencil">Fixed</span>
                  <span className="stencil count">
                    {v.fixed.filter((c) => !c.placeholder || process.env.NODE_ENV !== 'production')
                      .length}
                  </span>
                </div>
                {/* A card whose figure has not been supplied yet is visible while
                    developing and never in production. A visitor should see one
                    fewer card, never a flag telling them a number is missing. */}
                {v.fixed
                  .filter((c) => !c.placeholder || process.env.NODE_ENV !== 'production')
                  .map((c) => (
                    <Card key={c.title} card={c} closed />
                  ))}
              </div>
            </div>

            <p className="rule-line">
              <span>Nothing sits in Flagged longer than</span> <b>48 hours.</b>
            </p>
          </div>
        </section>

        {/* ---------- how a job moves ---------- */}
        {/* The section ids are ad sitelink targets. Renaming one breaks a
            sitelink silently: the page still loads, it just stops scrolling. */}
        <section className="band" id="how">
          <div className="shell">
            <h2 className="band-h">How a job moves across the board</h2>
            <p className="band-lede">
              Three states, and you can see which one your work is in at any point. That is the whole
              method, and it is the part most agencies leave out.
            </p>
            <div className="stages">
              <div className="stage">
                <p className="stencil stage-k">Flagged</p>
                <h3 className="stage-h">You tell us what is eating the time</h3>
                <p className="stage-p">
                  A 30 minute call, free, no pitch deck. We work out whether the job is worth
                  automating at all. Sometimes the answer is no, and we say so.
                </p>
              </div>
              <div className="stage">
                <p className="stencil stage-k">In hand</p>
                <h3 className="stage-h">It gets built, with a name against it</h3>
                <p className="stage-p">
                  One of four developers owns it start to finish. Custom, integrated with the tools
                  you already run. You get updates without asking for them.
                </p>
              </div>
              <div className="stage">
                <p className="stencil stage-k">Fixed</p>
                <h3 className="stage-h">It keeps running, and we keep answering</h3>
                <p className="stage-p">
                  Flag a glitch and it is addressed within 48 hours. Not a ticket number, not a
                  different person each time. The same team who built it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- what we commit to ---------- */}
        <section className="band alt" id="promise">
          <div className="shell">
            <h2 className="band-h">What is actually promised</h2>
            <p className="band-lede">
              Four things, in writing, all of them beatable in practice. We would rather promise less
              and hand over more.
            </p>
            <ul className="spec">
              <li>
                <span className="stencil k">Built custom</span>
                <span className="v">
                  Built around your business, integrated with the tools you already run.
                  <span>
                    No templated bot, and nothing you are locked out of later. If you ever want to
                    take it in house, you can see how all of it works.
                  </span>
                </span>
              </li>
              <li>
                <span className="stencil k">48 hours</span>
                <span className="v">
                  Glitches addressed within 24 to 48 hours of you flagging them.
                  <span>
                    Measured from when you flag it, not from when we get round to reading it.
                  </span>
                </span>
              </li>
              <li>
                <span className="stencil k">Week one</span>
                <span className="v">
                  Most teams notice hours coming back inside the first week.
                  <span>
                    Not the whole project finished in a week. The first noticeable difference, in a
                    week.
                  </span>
                </span>
              </li>
              <li>
                <span className="stencil k">No silence</span>
                <span className="v">
                  Regular updates, whether or not there is good news that week.
                  <span>
                    You will not have to ask where things are. This is the commitment we are most
                    often hired over.
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ---------- objections ---------- */}
        <section className="band" id="questions">
          <div className="shell">
            <h2 className="band-h">The four questions everybody asks</h2>
            <div className="qa">
              <div>
                <h3 className="qa-q">Will this actually work for my specific workflow?</h3>
                <p className="qa-a">
                  That is what the call is for. Your process gets looked at before anything is
                  quoted, because a workflow nobody understood yet cannot be priced honestly. If it
                  is not worth automating, you will hear that on the call rather than after an
                  invoice.
                </p>
              </div>
              <div>
                <h3 className="qa-q">What happens when it breaks?</h3>
                <p className="qa-a">
                  Things do break. Integrations change, a supplier alters a form, a system updates.
                  Flag it and it is addressed within 24 to 48 hours by the person who built it. That
                  is the whole reason the board has a Fixed column instead of an end date.
                </p>
              </div>
              <div>
                <h3 className="qa-q">Will you disappear once you have been paid?</h3>
                <p className="qa-a">
                  It is the fair question, and most people asking it have been burned before. There
                  are six of us and we are in Burlington. The work is documented as it is built, so
                  nothing depends on one person staying reachable.
                </p>
              </div>
              <div>
                <h3 className="qa-q">What does it cost?</h3>
                <p className="qa-a">
                  It depends entirely on the job, which is why there is no price on this page. You
                  will get a number after the call, once there is something real to price. The call
                  itself costs nothing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- close ---------- */}
        <section className="close-band">
          <div className="shell">
            <h2 className="display close-h">{v.closeH}</h2>
            <p className="close-p">
              Book a free 30 minute call. Bring one repetitive job that annoys you. That is enough to
              work out whether there is anything here worth doing.
            </p>
            <a className="close-btn" href="#board">
              Put it on the board
            </a>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="shell foot-in">
          <span>Genovation AI, Burlington, Ontario</span>
          <span>Custom automation, voice agents, and internal tools.</span>
        </div>
      </footer>
    </>
  );
}
