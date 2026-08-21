import { BookOpen, ArrowRight, LogIn } from "lucide-react";

/**
 * Shared floating island Navbar — used across Landing, AboutUs, FAQ
 *
 * Props:
 *  user         – Supabase user object (or null)
 *  links        – array of { label, onClick, active? } rendered as center nav links
 *  onBrand      – click handler for the ExamHub logo
 *  onStart      – CTA button when logged in ("เข้าคลังข้อสอบ")
 *  onLogin      – ghost button when logged out ("เข้าสู่ระบบ")
 *  onStartGuest – primary button when logged out ("เริ่มทำข้อสอบ"), falls back to onStart
 *  showLogin    – whether to show Login ghost button when logged out (default true)
 */
export default function Navbar({
  user,
  links = [],
  onBrand,
  onStart,
  onLogin,
  onStartGuest,
  showLogin = true,
}) {
  return (
    <>
      <style>{`
        .snav-wrapper {
          position: fixed;
          top: 1.5rem;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
          pointer-events: none;
        }
        .snav {
          pointer-events: auto;
          width: 100%;
          max-width: 1100px;
          background: color-mix(in srgb, var(--surface) 82%, transparent);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          box-shadow: 0 16px 42px rgba(0,0,0,0.09), 0 2px 10px rgba(0,0,0,0.04);
          padding: 0.55rem 0.65rem 0.55rem 1.4rem;
          transition: all 0.25s ease;
        }
        .snav-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.25rem;
        }
        .snav-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.4px;
          cursor: pointer;
          user-select: none;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
        }
        .snav-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 12px rgba(0,112,243,0.35);
          flex-shrink: 0;
        }
        .snav-center { display: flex; align-items: center; justify-content: center; }
        .snav-links { display: flex; align-items: center; gap: 0.35rem; }
        .snav-link {
          color: var(--text-muted);
          font-size: 0.925rem;
          font-weight: 500;
          background: transparent;
          border: none;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .snav-link:hover { color: var(--text); background: var(--surface-hover); }
        .snav-link.active { color: var(--accent); background: var(--surface-hover); font-weight: 600; }
        .snav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
        .snav-btn {
          height: 42px !important;
          padding: 0 1.35rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          border-radius: 999px !important;
          white-space: nowrap !important;
          cursor: pointer !important;
          transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        }
        .snav-btn:hover { transform: translateY(-1.5px); }
        .snav-btn-ghost {
          background: transparent !important;
          border: none !important;
          color: var(--text-muted) !important;
          box-shadow: none !important;
        }
        .snav-btn-ghost:hover {
          color: var(--text) !important;
          background: var(--surface-hover) !important;
          transform: none !important;
        }
        @media (max-width: 820px) {
          .snav-wrapper { top: 0.75rem; padding: 0 0.75rem; }
          .snav { padding: 0.35rem 0.6rem 0.35rem 0.85rem; }
          .snav-inner { display: flex; justify-content: space-between; }
          .snav-center { display: none; }
        }
        @media (max-width: 480px) {
          .snav-wrapper { top: 0.5rem; padding: 0 0.5rem; }
          .snav { padding: 0.3rem 0.5rem 0.3rem 0.75rem; }
          .snav-brand { font-size: 1.1rem; gap: 0.5rem; }
          .snav-brand-icon { width: 30px; height: 30px; border-radius: 8px; }
        }
      `}</style>

      <div className="snav-wrapper">
        <header className="snav">
          <div className="snav-inner">
            <button className="snav-brand" onClick={onBrand}>
              <div className="snav-brand-icon">
                <BookOpen size={19} />
              </div>
              <span>ExamHub</span>
            </button>

            <div className="snav-center">
              <nav className="snav-links">
                {links.map((link, i) => (
                  <button
                    key={i}
                    className={`snav-link${link.active ? " active" : ""}`}
                    onClick={link.onClick}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="snav-actions">
              {user ? (
                <button className="btn btn-primary snav-btn" onClick={onStart}>
                  <span>เข้าคลังข้อสอบ</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  {showLogin && (
                    <button
                      className="btn snav-btn snav-btn-ghost"
                      onClick={onLogin}
                    >
                      <LogIn size={16} />
                      <span>เข้าสู่ระบบ</span>
                    </button>
                  )}
                  <button
                    className="btn btn-primary snav-btn"
                    onClick={onStartGuest ?? onStart}
                  >
                    <span>เริ่มทำข้อสอบ</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
