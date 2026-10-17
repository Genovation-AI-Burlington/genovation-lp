'use client';

import { useEffect, useRef, useState } from 'react';
import { BOARD_PACE, STAGES } from '@/lib/content';

/**
 * How a job moves, as a board of stages, driven by the visitor's scroll. The
 * page scrolls normally; nothing is pinned.
 *
 * On a wide screen (four columns) the steps are checked one by one, in order,
 * for every `BOARD_PACE.pxPerStep` pixels the visitor scrolls after the top of
 * the board passes `BOARD_PACE.startAt` of the screen. It keeps going while the
 * next section comes into view. Scrolling back up takes them off again.
 * On a phone or tablet, where the stages are stacked, a step is checked when
 * its middle passes `BOARD_PACE.line` of the screen, and unchecked when it goes
 * back below it. Stages and steps come from `lib/content.ts`.
 *
 * The server renders every step as done, so a visitor whose script never runs,
 * or who asked their device for less motion, sees the finished board. Script
 * then resets it before the board is on screen.
 */

const TOTAL = STAGES.reduce((n, s) => n + s.steps.length, 0);

/** Four columns side by side. Must match the board's grid breakpoint in globals.css. */
const WIDE = '(min-width: 981px)';

export default function ProcessBoard() {
  const box = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const [done, setDone] = useState(TOTAL);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wide = window.matchMedia(WIDE);

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      if (wide.matches && box.current) {
        const scrolled = vh * BOARD_PACE.startAt - box.current.getBoundingClientRect().top;
        setDone(Math.min(Math.max(Math.floor(scrolled / BOARD_PACE.pxPerStep), 0), TOTAL));
        return;
      }
      const line = vh * BOARD_PACE.line;
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
    wide.addEventListener('change', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      wide.removeEventListener('change', onScroll);
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
    <div className="board" ref={box} style={{ ['--stages' as string]: STAGES.length }}>
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
  );
}
