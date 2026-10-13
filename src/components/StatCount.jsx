// Count-up number whose DOM text is always the real value, so crawlers and screen readers
// read the true figure. The counting is drawn by CSS on top (an animated @property integer
// rendered through a CSS counter); browsers without @property just show the real number.

let supported = false;
if (typeof window !== 'undefined' && window.CSS?.registerProperty) {
  try {
    window.CSS.registerProperty({ name: '--stat-count', syntax: '<integer>', inherits: false, initialValue: '0' });
    supported = true;
  } catch {
    // Already registered (e.g. after a hot reload)
    supported = true;
  }
}

export const statCountStyles = `
  .stat-count { display: inline-block; font-variant-numeric: tabular-nums; }
  .stat-count.is-animated {
    --stat-count: var(--stat-target);
    counter-reset: stat-count var(--stat-count);
    animation: stat-count-up 1.8s cubic-bezier(.16, 1, .3, 1) var(--stat-delay, 0s) both;
  }
  .stat-count.is-animated::after { content: counter(stat-count); }
  .stat-count.is-animated .stat-count-value {
    position: absolute; width: 1px; height: 1px; overflow: hidden;
    clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
  }
  @keyframes stat-count-up { from { --stat-count: 0; } }
  @media (prefers-reduced-motion: reduce) {
    .stat-count.is-animated { animation: none; }
  }
`;

export default function StatCount({ value, delay = 0 }) {
  const n = Math.round(Number(value) || 0);
  return (
    <span
      className={`stat-count${supported ? ' is-animated' : ''}`}
      style={{ '--stat-target': n, '--stat-delay': `${delay}s`, minWidth: `${String(n).length}ch` }}
    >
      <span className="stat-count-value">{n}</span>
    </span>
  );
}
