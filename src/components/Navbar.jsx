import { useState } from "react";
import { BookOpen, ArrowRight, LogIn, Menu, X } from "lucide-react";

/**
 * Shared floating island Navbar — used across Landing, AboutUs, FAQ
 *
 * Props:
 *  user         – Supabase user object (or null)
 *  links        – array of { label, onClick, active? } rendered as center nav links
 *  onBrand      – click handler for the EXETIA logo
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
  const [menuOpen, setMenuOpen] = useState(false);
  const runAndClose = (fn) => () => {
    setMenuOpen(false);
    fn?.();
  };

  return (
    <>
      <style>{`
        .snav-wrapper {
          position: fixed;
          top: 1.25rem;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0 1.25rem;
          pointer-events: none;
        }
        .snav {
          pointer-events: auto;
          width: 100%;
          max-width: 1100px;
          background: color-mix(in srgb, var(--surface) 86%, transparent);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
          padding: 0.45rem 0.65rem 0.45rem 1.25rem;
          transition: all 0.25s ease;
          box-sizing: border-box;
        }
        .snav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
        }
        .snav-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          color: var(--text);
          font-weight: 700;
          font-size: 1.2rem;
          letter-spacing: -0.4px;
          cursor: pointer;
          user-select: none;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
          flex-shrink: 0;
          white-space: nowrap;
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
        .snav-center { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          flex: 1; 
          min-width: 0; 
        }
        .snav-links { display: flex; align-items: center; gap: 0.25rem; flex-wrap: nowrap; }
        .snav-link {
          color: var(--text-muted);
          font-size: 0.925rem;
          font-weight: 500;
          background: transparent;
          border: none;
          padding: 0.45rem 0.85rem;
          border-radius: 999px;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
          font-family: inherit;
          white-space: nowrap;
        }
        .snav-link:hover { color: var(--text); background: var(--surface-hover); }
        .snav-link.active { color: var(--text); background: var(--surface-hover); font-weight: 700; box-shadow: inset 0 0 0 1px var(--border-color); }
        .snav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.45rem; flex-shrink: 0; }
        .snav-btn {
          height: 38px !important;
          padding: 0 1.15rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.4rem !important;
          font-size: 0.875rem !important;
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
        .snav-menu-toggle {
          display: none;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: transparent;
          color: var(--text);
          cursor: pointer;
          flex-shrink: 0;
        }
        .snav-menu-panel {
          display: none;
          flex-direction: column;
          gap: 0.25rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          border-radius: 20px;
          background: color-mix(in srgb, var(--surface) 94%, transparent);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          box-shadow: 0 16px 40px rgba(0,0,0,0.12);
          pointer-events: auto;
        }
        .snav-menu-panel .snav-link { text-align: left; padding: 0.75rem 1rem; font-size: 0.95rem; }
        .snav-menu-login { display: none !important; }
        @media (max-width: 920px) {
          .snav-wrapper { top: 0.75rem; padding: 0 0.75rem; flex-direction: column; align-items: center; }
          .snav, .snav-menu-panel { width: 100%; max-width: 1100px; box-sizing: border-box; }
          .snav { padding: 0.35rem 0.6rem 0.35rem 0.85rem; }
          .snav-inner { display: flex; justify-content: space-between; }
          .snav-center { display: none !important; }
          .snav-menu-toggle { display: inline-flex; }
          .snav-menu-panel.open { display: flex; }
        }
        @media (max-width: 480px) {
          .snav-wrapper { top: 0.5rem; padding: 0 0.5rem; }
          .snav { padding: 0.3rem 0.5rem 0.3rem 0.75rem; }
          .snav-brand { font-size: 1.1rem; gap: 0.5rem; }
          .snav-brand-icon { width: 30px; height: 30px; border-radius: 8px; }
          .snav-actions { gap: 0.35rem; }
          .snav-btn { padding: 0 0.9rem !important; }
          /* Login moves into the menu panel so the bar fits 320px phones */
          .snav-actions .snav-btn-ghost { display: none !important; }
          .snav-menu-login { display: flex !important; }
        }
      `}</style>

      <div className="snav-wrapper">
        <header className="snav">
          <div className="snav-inner">
            <button className="snav-brand" onClick={onBrand}>
              <div className="snav-brand-icon">
                <BookOpen size={19} />
              </div>
              <span>EXETIA</span>
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
              {links.length > 0 && (
                <button
                  className="snav-menu-toggle"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"}
                  aria-expanded={menuOpen}
                  aria-controls="snav-menu-panel"
                >
                  {menuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              )}
            </div>
          </div>
        </header>

        {links.length > 0 && (
          <nav
            id="snav-menu-panel"
            className={`snav-menu-panel${menuOpen ? " open" : ""}`}
          >
            {links.map((link, i) => (
              <button
                key={i}
                className={`snav-link${link.active ? " active" : ""}`}
                onClick={runAndClose(link.onClick)}
              >
                {link.label}
              </button>
            ))}
            {!user && showLogin && (
              <button
                className="snav-link snav-menu-login"
                onClick={runAndClose(onLogin)}
                style={{ alignItems: "center", gap: "0.5rem" }}
              >
                <LogIn size={16} />
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
