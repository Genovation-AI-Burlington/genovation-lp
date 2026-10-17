'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * How a job moves, as a board of four stages. The steps are checked off one by
 * one as the board scrolls through the screen, and the stage being worked on is
 * filled in. This is the one moving part of the page that carries meaning: the
 * visitor watches a job go from the first call to running, at their own pace.
 *
 * The server renders every step as done, so a visitor whose script never runs,
 * or who asked their device for less motion, sees the finished board. Script
 * then resets it to the scroll position before the board is on screen.
 */

const STAGES = [
  {
    name: 'Free call',
    steps: [
      'You tell us the task that eats the time',
      'We look at how it runs today',
      'We tell you if it is worth automating',
    ],
  },
  {
    name: 'Map it',
    steps: [
      'We map every step of the task',
      'We pick the tools you already use',
      'You get a plan and a price',
    ],
  },
  {
    name: 'Build and test',
    steps: [
      'A named developer builds it',
      'It is connected to your tools',
      'We test it before it goes live',
    ],
  },
  {
    name: 'Live and looked after',
    steps: [
      'It runs every day',
      'Glitches fixed in 24 to 48 hours',
      'You get updates without asking',
    ],
  },
] as const;

const TOTAL = STAGES.reduce((n, s) => n + s.steps.length, 0);

export default function ProcessBoard() {
  const box = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(TOTAL);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts when the top of the board passes 85% of the screen. On a wide
      // screen the whole board is visible at once, so it completes when its top
      // reaches 25%: the checks run while the visitor scrolls it up the screen.
      // On a phone the stages are stacked and the board is taller than the
      // screen, so it completes when its bottom passes 85%, which checks each
      // step at about the moment it arrives.
      const start = vh * 0.85;
      const span = Math.max(vh * 0.6, r.height, 1);
      const p = Math.min(Math.max((start - r.top) / span, 0), 1);
      setDone(Math.round(p * TOTAL));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
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
    <div className="board" ref={box}>
      {STAGES.map((stage, i) => (
        <div key={stage.name} className={`stage${i === active ? ' is-active' : ''}${i < active || done === TOTAL ? ' is-past' : ''}`}>
          <h3 className="stage-name">{stage.name}</h3>
          <ol className="steps">
            {stage.steps.map((step) => {
              const isDone = n++ < done;
              return (
                <li key={step} className={`step${isDone ? ' is-done' : ''}`}>
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
