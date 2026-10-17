'use client';

import { useEffect, useRef, useState } from 'react';
import { BOARD_PACE, STAGES } from '@/lib/content';

/**
 * How a job moves, as a board of stages, driven by the visitor's scroll.
 *
 * On a wide screen the section stays on screen (it is pinned) while the
 * visitor scrolls through `BOARD_PACE.pxPerStep` pixels per step. Scrolling
 * down checks the steps off one by one and fills the stage being worked on;
 * scrolling up takes them off again. When the board is finished it lets go and
 * the page moves on. On a phone or a short screen nothing is pinned: a step is
 * checked as its middle passes `BOARD_PACE.line` of the screen height.
 *
 * The heading (`head`) and the button under the board (`foot`) are passed in,
 * so they stay on screen with it. Stages and steps come from `lib/content.ts`.
 *
 * The server renders every step as done, so a visitor whose script never runs,
 * or who asked their device for less motion, sees the finished board. The pin
 * is set in CSS (`.how-track`) under the same conditions as `PINNED` below.
 */

const TOTAL = STAGES.reduce((n, s) => n + s.steps.length, 0);

/** Must match the media query on `.how-pin` in globals.css. */
const PINNED = '(min-width: 981px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)';

export default function ProcessBoard({ head, foot }: { head: React.ReactNode; foot: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const room = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const [done, setDone] = useState(TOTAL);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pinned = window.matchMedia(PINNED);

    let frame = 0;
    const update = () => {
      frame = 0;
      if (pinned.matches && track.current && pin.current && room.current) {
        const top = parseFloat(getComputedStyle(pin.current).top) || 0;
        const span = Math.max(room.current.offsetHeight, 1);
        const p = Math.min(Math.max((top - track.current.getBoundingClientRect().top) / span, 0), 1);
        // TOTAL + 1 bands, so the last step lands a little before the pin
        // lets go and the finished board holds for a moment.
        setDone(Math.min(TOTAL, Math.floor(p * (TOTAL + 1))));
        return;
      }
      const line = window.innerHeight * BOARD_PACE.line;
      let n = 0;
      for (const el of steps.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 < line) n += 1;
      }
      setDone(n);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    pinned.addEventListener('change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      pinned.removeEventListener('change', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // The stage being worked on: the one holding the next unchecked step.
  let seen = 0;
  const current = STAGES.findIndex((s) => {
    seen += s.steps.length;
    return done < seen;
  });
  const active = current === -1 ? STAGES.length - 1 : current;

  let n = 0;
  return (
    <div
      className="how-track"
      ref={track}
      style={{ ['--steps' as string]: TOTAL, ['--px-per-step' as string]: `${BOARD_PACE.pxPerStep}px` }}
    >
      <div className="how-pin" ref={pin}>
        {head}
        <div className="board" style={{ ['--stages' as string]: STAGES.length }}>
          {STAGES.map((stage, i) => (
            <div
              key={stage.name}
              className={`stage${i === active ? ' is-active' : ''}${i < active || done === TOTAL ? ' is-past' : ''}`}
            >
              <h3 className="stage-name">{stage.name}</h3>
              <ol className="steps">
                {stage.steps.map((step) => {
                  const index = n++;
                  return (
                    <li
                      key={step}
                      ref={(el) => {
                        steps.current[index] = el;
                      }}
                      className={`step${index < done ? ' is-done' : ''}`}
                    >
                      <span className="tick" aria-hidden="true">
                        <svg viewBox="0 0 16 16" width="16" height="16">
                          <path d="M4 8.5l2.6 2.6L12 5.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="step-text">{step}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        {foot}
      </div>
      {/* The scroll room the pinned section travels through. Zero height
          wherever the section is not pinned. */}
      <div className="how-room" ref={room} aria-hidden="true" />
    </div>
  );
}
