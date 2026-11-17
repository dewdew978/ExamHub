// Rounded avatar showing the first letter of the user's display name.
// The tint is derived from the name so each person keeps a stable color.
const TINTS = ['#6b47f5', '#2f6fe0', '#16935f', '#c2410c', '#be185d', '#0e7490', '#7c3aed', '#b45309'];

export default function UserAvatar({ name = '', size = 32 }) {
  const initial = [...name.trim()][0]?.toUpperCase() || '?';
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.codePointAt(0)) >>> 0;
  const tint = TINTS[hash % TINTS.length];
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: size >= 40 ? '50%' : Math.round(size * 0.3),
        background: tint,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.44),
        fontWeight: 600,
        flexShrink: 0,
        userSelect: 'none',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)',
      }}
    >
      {initial}
    </div>
  );
}
