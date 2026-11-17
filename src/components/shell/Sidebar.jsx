import { useState } from 'react';
import {
  BookOpen, LibraryBig, CalendarDays, History as HistoryIcon, Radar, Flag, Newspaper,
  CircleHelp, Info, Sparkles, ShieldCheck, Search, Sun, Moon, Settings, LogOut, LogIn,
  ChevronsUpDown, X,
} from 'lucide-react';
import UserAvatar from '../UserAvatar';

function NavItem({ icon: Icon, label, active, onClick, count }) {
  return (
    <button type="button" className={`nav-item${active ? ' active' : ''}`} onClick={onClick} aria-current={active ? 'page' : undefined}>
      <Icon size={16} strokeWidth={1.9} />
      <span className="nav-label">{label}</span>
      {count !== undefined && count !== null && <span className="nav-count">{count}</span>}
    </button>
  );
}

export default function Sidebar({
  currentView, user, isAdmin, theme, totalScore, examCount,
  onNavigate, onOpenChart, onOpenReport, onOpenSearch, onToggleTheme, onLogout, onLogin, onClose,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const displayName = user?.user_metadata?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';
  const go = (view) => { onNavigate(view); onClose?.(); };
  const isExamFlow = ['home', 'examIntro', 'exam'].includes(currentView);

  return (
    <aside className="sidebar" aria-label="เมนูหลัก">
      <div className="sidebar-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button type="button" className="workspace-btn" onClick={() => go('landing')} title="หน้าแนะนำ EXETIA">
            <span className="workspace-logo"><BookOpen size={14} strokeWidth={2.4} /></span>
            <span className="workspace-name">
              EXETIA
              <span className="workspace-sub">คลังข้อสอบออนไลน์</span>
            </span>
          </button>
          {onClose && (
            <button type="button" className="btn btn-ghost btn-icon btn-sm topbar-menu" onClick={onClose} aria-label="ปิดเมนู">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <button type="button" className="sidebar-search" onClick={() => { onOpenSearch(); onClose?.(); }}>
        <Search size={14} />
        <span>ค้นหาข้อสอบ…</span>
        <span className="kbd">⌘K</span>
      </button>

      <nav className="sidebar-scroll">
        <div className="nav-group">
          <NavItem icon={LibraryBig} label="คลังข้อสอบ" active={isExamFlow} onClick={() => go('home')} count={examCount || undefined} />
          <NavItem icon={CalendarDays} label="ตารางสอบ" active={currentView === 'schedule'} onClick={() => go('schedule')} />
          <NavItem icon={HistoryIcon} label="ประวัติคะแนน" active={currentView === 'history'} onClick={() => go('history')} />
          <NavItem icon={Radar} label="คะแนนสะสม & ทักษะ" onClick={() => { onOpenChart(); onClose?.(); }} count={user ? totalScore : undefined} />
        </div>

        <div className="nav-group">
          <div className="nav-group-label">ทั่วไป</div>
          <NavItem icon={Newspaper} label="ข่าวสาร & อัปเดต" active={currentView === 'blog'} onClick={() => go('blog')} />
          <NavItem icon={CircleHelp} label="คำถามที่พบบ่อย" active={currentView === 'faq'} onClick={() => go('faq')} />
          <NavItem icon={Info} label="เกี่ยวกับเรา" active={currentView === 'about'} onClick={() => go('about')} />
          <NavItem icon={Sparkles} label="หน้าแนะนำ" active={currentView === 'landing'} onClick={() => go('landing')} />
        </div>

        <div className="nav-group">
          <div className="nav-group-label">ช่วยเหลือ</div>
          <NavItem icon={Flag} label="แจ้งข้อสอบผิด / ปัญหา" active={currentView === 'report'} onClick={() => { onOpenReport(); onClose?.(); }} />
          {isAdmin && (
            <NavItem icon={ShieldCheck} label="แดชบอร์ดผู้ดูแล" active={currentView === 'admin_reports'} onClick={() => go('admin_reports')} />
          )}
        </div>
      </nav>

      <div className="sidebar-foot" style={{ position: 'relative' }}>
        <button type="button" className="nav-item" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={16} strokeWidth={1.9} /> : <Moon size={16} strokeWidth={1.9} />}
          <span className="nav-label">{theme === 'dark' ? 'โหมดสว่าง' : 'โหมดมืด'}</span>
        </button>

        {user ? (
          <>
            <button type="button" className="user-btn" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen}>
              <UserAvatar name={displayName || user.email || ''} size={26} />
              <span className="meta">
                <span className="name">{displayName}</span>
                <span className="email">{user.email}</span>
              </span>
              <ChevronsUpDown size={14} color="var(--text-subtle)" />
            </button>
            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setMenuOpen(false)} />
                <div className="popover" style={{ bottom: 'calc(100% - 4px)', left: 8, right: 8 }}>
                  <div className="menu-label">{user.email}</div>
                  <button type="button" className="menu-item" onClick={() => { setMenuOpen(false); go('settings'); }}>
                    <Settings size={15} /> ข้อมูลส่วนตัว & ตั้งค่า
                  </button>
                  <button type="button" className="menu-item" onClick={() => { setMenuOpen(false); go('history'); }}>
                    <HistoryIcon size={15} /> ประวัติคะแนน
                  </button>
                  <div className="menu-sep" />
                  <button type="button" className="menu-item danger" onClick={() => { setMenuOpen(false); onLogout(); onClose?.(); }}>
                    <LogOut size={15} /> ออกจากระบบ
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={() => { onLogin(); onClose?.(); }}>
            <LogIn size={15} /> เข้าสู่ระบบ
          </button>
        )}
      </div>
    </aside>
  );
}
