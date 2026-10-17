'use client';

import { useEffect, useRef, useState } from 'react';
import { BOARD_PACE, STAGES } from '@/lib/content';

/**
 * How a job moves, as a board of stages. The steps are checked off one at a
 * time, in order, and the stage being worked on is filled in. This is the one
 * moving part of the page that carries meaning: the visitor watches a job go
 * from the first call to running.
 *
 * A step is checked only when it is on screen and its turn has come, and never
 * sooner than `BOARD_PACE.stepMs` after the one before. On a wide screen the
 * whole board is in view, so it plays at that pace; on a phone it follows the
 * scroll, no faster than that. Stages and steps come from `lib/content.ts`.
 *
 * The server renders every step as done, so a visitor whose script never runs,
 * or who asked their device for less motion, sees the finished board. Script
 * then resets it before the board is on screen.
 */

const TOTAL = STAGES.reduce((n, s) => n + s.steps.length, 0);

export default function ProcessBoard() {
  const steps = useRef<(HTMLLIElement | null)[]>([]);
  const [done, setDone] = useState(TOTAL);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let count = 0;
    setDone(0);
    const timer = window.setInterval(() => {
      if (count >= TOTAL) {
        window.clearInterval(timer);
        return;
      }
      const next = steps.current[count];
      if (!next) return;
      if (next.getBoundingClientRect().top < window.innerHeight * BOARD_PACE.startAt) {
        count += 1;
        setDone(count);
      }
    }, BOARD_PACE.stepMs);
    return () => window.clearInterval(timer);
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
  );
}
