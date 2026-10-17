/**
 * The drawings beside "What we take off your team". One function per job, so
 * any one of them can be redrawn without touching the page. All are plain SVG
 * drawn for this page, coloured from the page's own tokens.
 */

export type JobIconName = 'calls' | 'follow-up' | 'paperwork' | 'connected';

const PATHS: Record<JobIconName, React.ReactNode> = {
  calls: (
    <path d="M6.6 3.5h2.6l1.4 3.6-1.9 1.2a9 9 0 0 0 4.9 4.9l1.2-1.9 3.6 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6A13.4 13.4 0 0 1 5 4.9a1.6 1.6 0 0 1 1.6-1.4z" />
  ),
  'follow-up': (
    <>
      <path d="M4 5.5h14v9H9l-4 3.2v-3.2H4z" />
      <path d="M8 9.2h6M8 11.6h4" />
    </>
  ),
  paperwork: (
    <>
      <path d="M6 3.5h7l3.5 3.5v11.5H6z" />
      <path d="M13 3.5V7h3.5M8.6 11h5.8M8.6 14h5.8" />
    </>
  ),
  connected: (
    <>
      <path d="M9.5 12.5l3-3" />
      <path d="M8.2 8.8l-2 2a2.9 2.9 0 0 0 4.1 4.1l2-2" />
      <path d="M13.8 13.2l2-2a2.9 2.9 0 0 0-4.1-4.1l-2 2" />
    </>
  ),
};

export default function JobIcon({ name }: { name: JobIconName }) {
  return (
    <span className="job-icon" aria-hidden="true">
      <svg viewBox="0 0 22 22" width="22" height="22">
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {PATHS[name]}
        </g>
      </svg>
    </span>
  );
}
