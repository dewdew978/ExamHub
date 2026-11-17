// Shown while a lazily loaded page chunk downloads.
// `inline` fills the content area beside the sidebar; otherwise it covers the full screen.
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
      <div style={{ width: 120, height: 3, borderRadius: 3, background: 'var(--surface-active)', overflow: 'hidden' }}>
        <div style={{ width: '40%', height: '100%', borderRadius: 3, background: 'var(--accent)', animation: 'page-loader-slide 1s ease-in-out infinite' }} />
      </div>
      <style>{`@keyframes page-loader-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }`}</style>
    </div>
  );
}
