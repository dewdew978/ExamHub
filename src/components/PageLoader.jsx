// Spinner shown while a lazily loaded page chunk downloads.
// `inline` fills the content area under the app navbar; otherwise it covers the full screen.
export default function PageLoader({ inline = false }) {
  return (
    <div
      role="status"
      aria-label="กำลังโหลด"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: inline ? '40vh' : '100vh',
        background: inline ? 'transparent' : 'var(--bg)',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'page-loader-spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes page-loader-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
