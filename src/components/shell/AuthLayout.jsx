import { ArrowLeft, BookOpen, CheckCircle2, FileText, Sparkles } from 'lucide-react';

// Split-screen frame for sign-in / sign-up / password reset.
export default function AuthLayout({ children, onBack, backLabel = 'กลับ' }) {
  return (
    <div className="auth-shell">
      <div className="auth-form-col">
        <div className="auth-top">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, fontSize: '0.9rem' }}>
            <span className="workspace-logo" style={{ width: 22, height: 22, borderRadius: 6 }}><BookOpen size={12} strokeWidth={2.5} /></span>
            EXETIA
          </span>
          {onBack && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={onBack}>
              <ArrowLeft size={14} /> {backLabel}
            </button>
          )}
        </div>
        <div className="auth-form">{children}</div>
        <div className="auth-foot">© {new Date().getFullYear()} EXETIA · คลังข้อสอบออนไลน์</div>
      </div>

      <div className="auth-art" aria-hidden="true">
        <div className="auth-art-inner">
          <div className="auth-quote">
            <Sparkles size={16} color="var(--accent)" />
            <p>ฝึกทำข้อสอบพร้อมเฉลยละเอียดทุกข้อ<br />แล้วติดตามพัฒนาการของคุณในที่เดียว</p>
          </div>
          <div className="auth-mock card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="tile tile-accent" style={{ width: 26, height: 26 }}><FileText size={13} /></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>Data Warehousing · Final</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>50 ข้อ · ปี 3</div>
              </div>
              <span className="badge badge-success">86%</span>
            </div>
            {['Star schema ประกอบด้วย fact table และ dimension table', 'ETL ย่อมาจาก Extract, Transform, Load', 'OLAP เหมาะกับงานวิเคราะห์ข้อมูลเชิงสรุป'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 7, background: i === 0 ? 'var(--success-soft)' : 'var(--bg-subtle)', marginTop: 5, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={12} color={i === 0 ? 'var(--success)' : 'var(--text-subtle)'} /> {t}
              </div>
            ))}
          </div>
          <div className="auth-mock card auth-mock-2">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ค่าเฉลี่ยสัปดาห์นี้</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.02em' }}>78%</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 34, marginTop: 6 }}>
              {[40, 55, 48, 70, 62, 78, 84].map((h, i) => <span key={i} style={{ flex: 1, height: `${h}%`, borderRadius: 3, background: i === 6 ? 'var(--accent)' : 'var(--accent-soft)' }} />)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(380px, 1fr) 1.1fr; background: var(--bg); }
        .auth-form-col { display: flex; flex-direction: column; padding: 1.25rem 1.5rem; }
        .auth-top { display: flex; align-items: center; justify-content: space-between; }
        .auth-form { flex: 1; width: 100%; max-width: 360px; margin: 0 auto; display: flex; flex-direction: column; justify-content: center; padding: 2.5rem 0; }
        .auth-foot { font-size: 0.72rem; color: var(--text-subtle); text-align: center; }
        .auth-art { position: relative; overflow: hidden; background: var(--sidebar-bg); border-left: 1px solid var(--border-color);
          background-image: radial-gradient(circle at 1px 1px, color-mix(in srgb, var(--text) 9%, transparent) 1px, transparent 0); background-size: 18px 18px; }
        .auth-art::before { content: ''; position: absolute; width: 520px; height: 520px; right: -120px; top: -140px; border-radius: 50%;
          background: radial-gradient(circle, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 65%); }
        .auth-art-inner { position: relative; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 3rem; gap: 1rem; max-width: 520px; margin: 0 auto; }
        .auth-quote { display: flex; gap: 10px; align-items: flex-start; font-size: 1.05rem; font-weight: 500; line-height: 1.5; color: var(--text); margin-bottom: 0.75rem; letter-spacing: -0.01em; }
        .auth-quote svg { margin-top: 5px; flex-shrink: 0; }
        .auth-mock { padding: 0.9rem; box-shadow: var(--shadow-md); }
        .auth-mock-2 { width: 220px; align-self: flex-end; margin-top: -2.25rem; margin-right: -1rem; }
        @media (max-width: 900px) { .auth-shell { grid-template-columns: 1fr; } .auth-art { display: none; } }
      `}</style>
    </div>
  );
}
