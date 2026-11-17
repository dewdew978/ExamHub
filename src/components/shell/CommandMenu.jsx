import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, CornerDownLeft, LibraryBig, CalendarDays, History as HistoryIcon, Newspaper, CircleHelp, Settings, Flag } from 'lucide-react';
import SubjectIcon from '../SubjectIcon';

const PAGES = [
  { view: 'home', label: 'คลังข้อสอบ', icon: LibraryBig },
  { view: 'schedule', label: 'ตารางสอบ', icon: CalendarDays },
  { view: 'history', label: 'ประวัติคะแนน', icon: HistoryIcon },
  { view: 'blog', label: 'ข่าวสาร & อัปเดต', icon: Newspaper },
  { view: 'faq', label: 'คำถามที่พบบ่อย', icon: CircleHelp },
  { view: 'settings', label: 'ข้อมูลส่วนตัว & ตั้งค่า', icon: Settings },
  { view: 'report', label: 'แจ้งข้อสอบผิด / ปัญหา', icon: Flag },
];

// Quick switcher: type to find an exam set or jump to a page.
export default function CommandMenu({ subjects, onClose, onSelectSubject, onNavigate }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (text) => !q || String(text || '').toLowerCase().includes(q);
    const exams = subjects
      .filter(s => match(s.name) || match(s.category) || match(s.desc) || match(s.type))
      .slice(0, q ? 30 : 8)
      .map(s => ({ kind: 'exam', id: s.id, label: s.name, sub: `${s.category} · ${s.questionCount} ข้อ${s.type ? ` · ${s.type}` : ''}`, subject: s }));
    const pages = PAGES.filter(p => match(p.label)).map(p => ({ kind: 'page', id: p.view, label: p.label, icon: p.icon }));
    return [...exams, ...pages];
  }, [query, subjects]);

  useEffect(() => { setActive(0); }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (item) => {
    if (!item) return;
    onClose();
    if (item.kind === 'exam') onSelectSubject(item.id);
    else onNavigate(item.id);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => Math.min(items.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => Math.max(0, i - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(items[active]); }
    else if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  };

  const examItems = items.filter(i => i.kind === 'exam');
  const pageItems = items.filter(i => i.kind === 'page');

  const renderItem = (item) => {
    const idx = items.indexOf(item);
    const Icon = item.icon;
    return (
      <button
        key={`${item.kind}-${item.id}`}
        type="button"
        data-idx={idx}
        className="menu-item"
        onMouseMove={() => setActive(idx)}
        onClick={() => choose(item)}
        style={{ height: item.sub ? 44 : 34, background: idx === active ? 'var(--surface-hover)' : undefined }}
      >
        {item.kind === 'exam'
          ? <span className="tile" style={{ width: 26, height: 26, background: item.subject.iconBg || undefined }}><SubjectIcon category={item.subject.category} size={14} color={item.subject.color || 'var(--accent)'} /></span>
          : <Icon size={15} />}
        <span style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
          <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
          {item.sub && <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sub}</span>}
        </span>
        {idx === active && <CornerDownLeft size={13} />}
      </button>
    );
  };

  return (
    <div className="modal-backdrop" style={{ alignItems: 'flex-start', paddingTop: '12vh' }} onMouseDown={onClose}>
      <div className="modal" style={{ maxWidth: 560 }} onMouseDown={e => e.stopPropagation()} role="dialog" aria-label="ค้นหา">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0 1rem', borderBottom: '1px solid var(--border-divider)' }}>
          <Search size={16} color="var(--text-subtle)" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="ค้นหาชุดข้อสอบ วิชา หรือหน้า…"
            aria-label="ค้นหา"
            style={{ flex: 1, height: 50, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9375rem' }}
          />
          <span className="kbd">Esc</span>
        </div>
        <div ref={listRef} style={{ maxHeight: '52vh', overflowY: 'auto', padding: 6 }}>
          {items.length === 0 && (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>ไม่พบผลลัพธ์สำหรับ “{query}”</div>
          )}
          {examItems.length > 0 && <div className="menu-label">ชุดข้อสอบ</div>}
          {examItems.map(renderItem)}
          {pageItems.length > 0 && <div className="menu-label" style={{ marginTop: 4 }}>หน้า</div>}
          {pageItems.map(renderItem)}
        </div>
        <div style={{ display: 'flex', gap: '1rem', padding: '0.55rem 1rem', borderTop: '1px solid var(--border-divider)', background: 'var(--bg-subtle)', fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
          <span><span className="kbd">↑</span> <span className="kbd">↓</span> เลือก</span>
          <span><span className="kbd">↵</span> เปิด</span>
        </div>
      </div>
    </div>
  );
}
