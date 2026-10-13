// Circle avatar showing the first letter of the user's display name.
export default function UserAvatar({ name = '', size = 32 }) {
  const initial = [...name.trim()][0]?.toUpperCase() || '?';
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--accent)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 700,
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  );
}
