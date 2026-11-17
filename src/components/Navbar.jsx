import { useState } from "react";
import { BookOpen, ArrowRight, LogIn, Menu, X } from "lucide-react";

/**
 * Shared top bar for the public pages — Landing, Blog, About, FAQ, Terms.
 *
 * Props:
 *  user         – Supabase user object (or null)
 *  links        – array of { label, onClick, active? } rendered as nav links
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
      <header className="site-header" style={{ position: 'fixed', left: 0, right: 0, top: 0 }}>
        <div className="site-header-inner">
          <button type="button" className="site-brand" onClick={onBrand}>
            <span className="workspace-logo" style={{ width: 26, height: 26 }}><BookOpen size={14} strokeWidth={2.4} /></span>
            EXETIA
          </button>

          <nav className="site-nav" aria-label="เมนูเว็บไซต์">
            {links.map((link, i) => (
              <button key={i} type="button" className={link.active ? 'active' : ''} onClick={link.onClick} aria-current={link.active ? 'page' : undefined}>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="site-actions">
            {user ? (
              <button type="button" className="btn btn-primary" onClick={onStart}>
                เข้าคลังข้อสอบ <ArrowRight size={14} />
              </button>
            ) : (
              <>
                {showLogin && onLogin && (
                  <button type="button" className="btn btn-ghost hide-sm" onClick={onLogin}>
                    <LogIn size={14} /> เข้าสู่ระบบ
                  </button>
                )}
                <button type="button" className="btn btn-primary" onClick={onStartGuest ?? onStart}>
                  เริ่มทำข้อสอบ
                </button>
              </>
            )}
            {links.length > 0 && (
              <button
                type="button"
                className="btn btn-ghost btn-icon site-mobile-toggle"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>

        {menuOpen && links.length > 0 && (
          <nav className="site-mobile-panel animate-fade-in" aria-label="เมนูเว็บไซต์ (มือถือ)">
            {links.map((link, i) => (
              <button key={i} type="button" className={`nav-item${link.active ? ' active' : ''}`} style={{ height: 38 }} onClick={runAndClose(link.onClick)}>
                <span className="nav-label">{link.label}</span>
              </button>
            ))}
            {!user && showLogin && onLogin && (
              <button type="button" className="nav-item" style={{ height: 38 }} onClick={runAndClose(onLogin)}>
                <LogIn size={16} /> <span className="nav-label">เข้าสู่ระบบ</span>
              </button>
            )}
          </nav>
        )}
      </header>
    </>
  );
}
