/**
 * The drawings beside "What we take off your team": white doodle drawings on a
 * navy tile. The tile is the page's navy banner (`.job-icon` in globals.css),
 * so it changes with it. One drawing per job, so any one of them can be
 * redrawn without touching the page. Approved by Ali on 18 Oct 2026.
 */

export type JobIconName = 'calls' | 'follow-up' | 'paperwork' | 'connected';

const W = '#FFFFFF';
const L = '#9FC0F5';
const N = '#0F1A3D';

const DRAWINGS: Record<JobIconName, React.ReactNode> = {
  // a desk phone ringing
  calls: (
    <>
      <path d="M9.5 31c-1.8-3.4-1.8-7.2 0-10.6M54.5 31c1.8-3.4 1.8-7.2 0-10.6" fill="none" stroke={L} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="2 3.4" />
      <path d="M23 13.5l1.8 3M32 11v4.4M41 13.5l-1.8 3" stroke={L} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M15.5 29.5c0-5 6.5-8 16.5-8s16.5 3 16.5 8c0 2-1.5 3.2-3.5 3.2h-3.2c-2 0-3.1-1.1-3.1-3.1v-1.2H25.3v1.2c0 2-1.1 3.1-3.1 3.1H19c-2 0-3.5-1.2-3.5-3.2z" fill={L} stroke={W} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M14 47c0-6 3-10 8-12h20c5 2 8 6 8 12v3a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2z" fill="none" stroke={W} strokeWidth="2.4" strokeLinejoin="round" />
      {[26, 32, 38].map((x) => (
        <g key={x} fill={W}>
          <circle cx={x} cy="42" r="1.6" />
          <circle cx={x} cy="47" r="1.6" />
        </g>
      ))}
    </>
  ),
  // a paper plane with a dashed trail
  'follow-up': (
    <>
      <path d="M13 32.5l36-15-9.5 29.5-8-10.5z" fill={L} stroke={W} strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M31.5 36.5L49 17.5M31.5 36.5V46l4.6-4.4" fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 46c3.6 2.2 8 3 12.5 2" fill="none" stroke={L} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 4" />
    </>
  ),
  // a clipboard with checks and a pencil
  paperwork: (
    <>
      <rect x="15" y="14" width="26" height="37" rx="4" fill="none" stroke={W} strokeWidth="2.4" />
      <rect x="22" y="10.5" width="12" height="7" rx="2.5" fill={L} stroke={W} strokeWidth="2.2" />
      <path d="M20 26.5l2.5 2.5 4-4M20 36l2.5 2.5 4-4" fill="none" stroke={L} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29.5 27.5h6.5M29.5 37h6.5" stroke={W} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 45.5c1.6-2.4 2.8 1.6 4.4-.4s2.8 1.6 4.4 0" fill="none" stroke={W} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M37 52l13.5-13.5 3.5 3.5L40.5 55.5H37z" fill={L} stroke={W} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M31 54h3M32.5 57.5h2" stroke={L} strokeWidth="2.2" strokeLinecap="round" />
    </>
  ),
  // two apps passing information to each other
  connected: (
    <>
      <rect x="8" y="19" width="16" height="26" rx="5" fill="none" stroke={W} strokeWidth="2.4" />
      <path d="M12.5 27h7M12.5 32h7M12.5 37h4.5" stroke={L} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="40" y="19" width="16" height="26" rx="5" fill={L} stroke={W} strokeWidth="2.4" />
      <path d="M44.5 27h7M44.5 32h7M44.5 37h4.5" stroke={N} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M27 27.5h9.5M33.5 24.5l3 3-3 3" fill="none" stroke={W} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37 37.5h-9.5" fill="none" stroke={L} strokeWidth="2.4" strokeLinecap="round" strokeDasharray="2 3" />
      <path d="M30.5 34.5l-3 3 3 3" fill="none" stroke={L} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export default function JobIcon({ name }: { name: JobIconName }) {
  return (
    <span className="job-icon" aria-hidden="true">
      <svg viewBox="4 4 56 56" width="48" height="48">
        {DRAWINGS[name]}
      </svg>
    </span>
  );
}
