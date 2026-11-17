// Centered notice for pages that need sign-in or a specific role.
export default function GateState({ icon: Icon, title, text, primary, secondary, tone = 'accent' }) {
  const toneStyle = tone === 'error'
    ? { background: 'var(--error-soft)', color: 'var(--error)', boxShadow: 'none' }
    : undefined;
  return (
    <div className="page page-narrow animate-fade-in" style={{ paddingTop: '4rem' }}>
      <div className="empty-state" style={{ padding: '3rem 1.5rem' }}>
        {Icon && <span className="tile tile-accent" style={toneStyle}><Icon size={18} /></span>}
        <h3>{title}</h3>
        {text && <p>{text}</p>}
        {(primary || secondary) && (
          <div className="actions">
            {secondary && <button type="button" className="btn" onClick={secondary.onClick}>{secondary.label}</button>}
            {primary && <button type="button" className="btn btn-primary" onClick={primary.onClick}>{primary.label}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
