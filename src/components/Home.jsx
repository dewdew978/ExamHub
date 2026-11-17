import { useState, useEffect, useMemo } from 'react';
import SubjectIcon from './SubjectIcon';
import { readExamPreferences } from '../lib/examPreferences';
import { isAdminPractice } from '../lib/adminPractice';
import {
  FileText, Clock, Lock, Flag, Play, Trash2, Search, LayoutGrid, List, LibraryBig, Layers, GraduationCap, ArrowUpRight, X,
} from 'lucide-react';

const YEARS = [2, 3];

function formatTime(seconds = 0) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Soft, deterministic cover art for each exam set, tinted with the subject's color.
function Cover({ subject, height = 92 }) {
  const color = subject.color || '#6b47f5';
  let seed = 0;
  for (const ch of String(subject.id || subject.name)) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const variant = seed % 3;
  return (
    <div className="project-cover" style={{ height, background: `color-mix(in srgb, ${color} 9%, var(--surface))` }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={`dots-${subject.id}`} width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill={color} opacity="0.18" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${subject.id})`} />
      </svg>
      <div aria-hidden="true" style={{
        position: 'absolute',
        width: 160, height: 160, borderRadius: '50%',
        right: variant === 0 ? -40 : variant === 1 ? 40 : -10,
        top: variant === 2 ? -110 : 20,
        background: `radial-gradient(circle at center, color-mix(in srgb, ${color} 28%, transparent) 0%, transparent 70%)`,
      }} />
      <span className="tile" style={{
        position: 'absolute', left: 14, bottom: 12, width: 34, height: 34,
        background: 'var(--surface)', boxShadow: `0 0 0 1px color-mix(in srgb, ${color} 22%, var(--border-color)), var(--shadow-xs)`,
      }}>
        <SubjectIcon category={subject.category} size={17} color={color} />
      </span>
    </div>
  );
}

function TypeBadge({ type }) {
  if (!type) return null;
  return <span className={`badge ${type === 'Midterm' ? 'badge-warning' : 'badge-success'}`}>{type}</span>;
}

function AccessBadge({ subject, locked }) {
  if (subject.adminOnly) return <span className="badge badge-accent"><Lock size={10} /> เฉพาะแอดมิน</span>;
  if (subject.requiresAuth) return locked
    ? <span className="badge badge-error"><Lock size={10} /> ต้องเข้าสู่ระบบ</span>
    : <span className="badge"><Lock size={10} /> สมาชิก</span>;
  return null;
}

export default function Home({ subjects, onSelectSubject, user, onRequireLogin, onOpenReport, onResumeExam }) {
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');
  const [examType, setExamType] = useState('All');
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState(() => {
    try { return localStorage.getItem('exetia_library_layout') || 'grid'; } catch { return 'grid'; }
  });
  const [inProgressExam, setInProgressExam] = useState(null);
  const [{ timerEnabled }] = useState(readExamPreferences);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('exetia_library_layout', layout); } catch { /* storage unavailable */ }
  }, [layout]);

  useEffect(() => {
    const checkInProgress = () => {
      try {
        const saved = localStorage.getItem('examhub_in_progress_exam');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.subjectId && parsed.totalQuestions && !isAdminPractice(parsed.subjectId)) {
            setInProgressExam(parsed);
            return;
          }
        }
        setInProgressExam(null);
      } catch (e) {
        console.warn('Failed to read in-progress exam:', e);
      }
    };
    checkInProgress();
    window.addEventListener('focus', checkInProgress);
    return () => window.removeEventListener('focus', checkInProgress);
  }, []);

  const handleConfirmDiscard = () => {
    try { localStorage.removeItem('examhub_in_progress_exam'); } catch (err) { console.warn(err); }
    setInProgressExam(null);
    setShowDiscardConfirm(false);
  };

  const totalQuestions = subjects.reduce((sum, s) => sum + (s.questionCount || 0), 0);
  const categoriesAll = useMemo(() => [...new Set(subjects.map(s => s.category))], [subjects]);

  const inYear = useMemo(() => subjects.filter(s => year === 'all' || s.year === year), [subjects, year]);
  const categoryTabs = useMemo(() => {
    const map = new Map();
    for (const s of inYear) map.set(s.category, (map.get(s.category) || 0) + 1);
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, [inYear]);

  useEffect(() => {
    if (category !== 'all' && !categoryTabs.some(c => c.name === category)) setCategory('all');
  }, [categoryTabs, category]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inYear.filter(s =>
      (category === 'all' || s.category === category) &&
      (examType === 'All' || s.type === examType) &&
      (!q || [s.name, s.category, s.desc, s.type].some(v => String(v || '').toLowerCase().includes(q)))
    );
  }, [inYear, category, examType, query]);

  const open = (sub) => {
    const isLocked = sub.requiresAuth && !user;
    if (isLocked && onRequireLogin) onRequireLogin(sub);
    else onSelectSubject(sub.id);
  };

  const greetingName = user?.user_metadata?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  const resumePct = inProgressExam ? Math.min(100, Math.round((inProgressExam.answeredCount / inProgressExam.totalQuestions) * 100)) : 0;
  const hasFilters = year !== 'all' || category !== 'all' || examType !== 'All' || query;

  return (
    <div className="page animate-fade-in">
      <div className="page-header">
        <div>
          {greetingName && <div className="page-eyebrow">สวัสดี, {greetingName}</div>}
          <h1 className="page-title">คลังข้อสอบ</h1>
          <p className="page-subtitle">เลือกชุดข้อสอบที่ต้องการฝึก ทำพร้อมดูเฉลยและคำอธิบายรายข้อ</p>
        </div>
        <div className="page-actions">
          <button type="button" className="btn" onClick={() => onOpenReport && onOpenReport()}>
            <Flag size={14} /> แจ้งข้อสอบผิด
          </button>
        </div>
      </div>

      <div className="stat-grid stagger" style={{ marginBottom: '1.25rem' }}>
        <div className="stat">
          <div className="stat-label"><LibraryBig size={13} /> ชุดข้อสอบ</div>
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-foot">พร้อมให้ฝึกทันที</div>
        </div>
        <div className="stat">
          <div className="stat-label"><FileText size={13} /> ข้อสอบทั้งหมด</div>
          <div className="stat-value">{totalQuestions.toLocaleString()}</div>
          <div className="stat-foot">พร้อมเฉลยละเอียด</div>
        </div>
        <div className="stat">
          <div className="stat-label"><Layers size={13} /> หมวดวิชา</div>
          <div className="stat-value">{categoriesAll.length}</div>
          <div className="stat-foot">ครอบคลุม Data, Cloud, AI, MIS</div>
        </div>
        <div className="stat">
          <div className="stat-label"><GraduationCap size={13} /> ระดับชั้นปี</div>
          <div className="stat-value">{YEARS.length}</div>
          <div className="stat-foot">ปี 2 และ ปี 3</div>
        </div>
      </div>

      {inProgressExam && (
        <div className="card animate-fade-in" style={{ padding: '0.9rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="tile tile-accent"><Play size={15} /></span>
          <div style={{ flex: '1 1 260px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inProgressExam.subjectName}</span>
              <span className="badge badge-accent">ทำค้างไว้</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <div className="progress" style={{ width: 160 }}><span className="grow-x" style={{ width: `${resumePct}%` }} /></div>
              <span>{inProgressExam.answeredCount}/{inProgressExam.totalQuestions} ข้อ</span>
              <span>· ข้อที่ {inProgressExam.currentQ + 1}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                · <Clock size={12} /> {timerEnabled ? `เหลือ ${formatTime(inProgressExam.timeLeft)} นาที` : 'ไม่จำกัดเวลา'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowDiscardConfirm(true)} title="ยกเลิกข้อสอบนี้" aria-label="ยกเลิกข้อสอบที่ทำค้างไว้">
              <Trash2 size={15} />
            </button>
            <button type="button" className="btn btn-primary" onClick={() => onResumeExam && onResumeExam(inProgressExam)}>
              <Play size={14} /> ทำต่อ
            </button>
          </div>
        </div>
      )}

      <div className="tabs" style={{ marginBottom: '0.9rem' }}>
        <button type="button" className={`tab${category === 'all' ? ' active' : ''}`} onClick={() => setCategory('all')}>
          ทั้งหมด <span className="count">{inYear.length}</span>
        </button>
        {categoryTabs.map(c => (
          <button key={c.name} type="button" className={`tab${category === c.name ? ' active' : ''}`} onClick={() => setCategory(c.name)}>
            {c.name} <span className="count">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <div className="search" style={{ width: 260, maxWidth: '100%' }}>
          <Search size={14} />
          <input className="input" value={query} onChange={e => setQuery(e.target.value)} placeholder="ค้นหาชุดข้อสอบ…" aria-label="ค้นหาชุดข้อสอบ" />
        </div>
        <div className="seg" role="group" aria-label="ชั้นปี">
          <button type="button" className={`seg-item${year === 'all' ? ' active' : ''}`} onClick={() => setYear('all')}>ทุกชั้นปี</button>
          {YEARS.map(y => (
            <button key={y} type="button" className={`seg-item${year === y ? ' active' : ''}`} onClick={() => setYear(y)}>ปี {y}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['All', 'Midterm', 'Final'].map(t => (
            <button key={t} type="button" className={`chip${examType === t ? ' active' : ''}`} onClick={() => setExamType(t)}>
              {t === 'All' ? 'ทุกประเภท' : t}
            </button>
          ))}
        </div>
        {hasFilters && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setYear('all'); setCategory('all'); setExamType('All'); setQuery(''); }}>
            <X size={13} /> ล้างตัวกรอง
          </button>
        )}
        <div className="spacer" />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>{filtered.length} ชุด</span>
        <div className="seg" role="group" aria-label="รูปแบบการแสดงผล">
          <button type="button" className={`seg-item${layout === 'grid' ? ' active' : ''}`} onClick={() => setLayout('grid')} aria-label="แบบการ์ด" title="แบบการ์ด"><LayoutGrid size={14} /></button>
          <button type="button" className={`seg-item${layout === 'list' ? ' active' : ''}`} onClick={() => setLayout('list')} aria-label="แบบตาราง" title="แบบตาราง"><List size={14} /></button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="tile"><Search size={18} /></span>
          <h3>{subjects.length === 0 ? 'ยังไม่มีชุดข้อสอบ' : 'ไม่พบชุดข้อสอบที่ตรงกับตัวกรอง'}</h3>
          <p>{subjects.length === 0 ? 'เรากำลังรวบรวมข้อสอบและจัดทำเฉลย โปรดติดตามการอัปเดต' : 'ลองเปลี่ยนชั้นปี ประเภทข้อสอบ หรือคำค้นหา'}</p>
        </div>
      ) : layout === 'grid' ? (
        <div className="card-grid" key={`${year}-${category}-${examType}`}>
          {filtered.map((sub, i) => {
            const locked = sub.requiresAuth && !user;
            return (
              <button key={sub.id} type="button" className="project-card stagger-item" onClick={() => open(sub)} style={{ '--i': Math.min(i, 12), ...(locked ? { opacity: 0.85 } : null) }}>
                <Cover subject={sub} />
                <div className="project-body">
                  <div className="project-title">{sub.name}</div>
                  <div className="project-desc">{sub.desc}</div>
                  <div className="project-meta">
                    <TypeBadge type={sub.type} />
                    <AccessBadge subject={sub} locked={locked} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><FileText size={12} /> {sub.questionCount} ข้อ</span>
                    {sub.year && <span>· ปี {sub.year}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="ds-table-wrap">
          <div className="ds-table-scroll">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>ชุดข้อสอบ</th>
                  <th>หมวดวิชา</th>
                  <th>ประเภท</th>
                  <th style={{ textAlign: 'right' }}>จำนวนข้อ</th>
                  <th>ชั้นปี</th>
                  <th aria-label="เปิด" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub, i) => {
                  const locked = sub.requiresAuth && !user;
                  return (
                    <tr key={sub.id} className="clickable stagger-item" style={{ '--i': Math.min(i, 14) }} onClick={() => open(sub)}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 240 }}>
                          <span className="tile" style={{ width: 28, height: 28, background: sub.iconBg || undefined, boxShadow: 'none' }}>
                            <SubjectIcon category={sub.category} size={14} color={sub.color || 'var(--accent)'} />
                          </span>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                              {sub.name} <AccessBadge subject={sub} locked={locked} />
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 420 }}>{sub.desc}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{sub.category}</td>
                      <td><TypeBadge type={sub.type} /></td>
                      <td style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{sub.questionCount}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{sub.year ? `ปี ${sub.year}` : '—'}</td>
                      <td style={{ width: 40, color: 'var(--text-subtle)' }}><ArrowUpRight size={15} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDiscardConfirm && inProgressExam && (
        <div className="modal-backdrop" onClick={() => setShowDiscardConfirm(false)}>
          <div className="modal" role="alertdialog" aria-label="ยกเลิกข้อสอบที่ทำค้างไว้" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="tile" style={{ background: 'var(--error-soft)', color: 'var(--error)', boxShadow: 'none' }}><Trash2 size={16} /></span>
              <div>
                <div className="modal-title">ยกเลิกข้อสอบที่ทำค้างไว้?</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>คำตอบที่บันทึกไว้จะถูกลบและกู้คืนไม่ได้</div>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ padding: '0.7rem 0.85rem', borderRadius: 8, background: 'var(--bg-subtle)', boxShadow: 'inset 0 0 0 1px var(--border-divider)', marginTop: '0.5rem' }}>
                <div style={{ fontWeight: 500, color: 'var(--text)' }}>{inProgressExam.subjectName}</div>
                <div style={{ fontSize: '0.78rem', marginTop: 2 }}>
                  ทำไปแล้ว {inProgressExam.answeredCount}/{inProgressExam.totalQuestions} ข้อ · {timerEnabled ? `เหลือ ${formatTime(inProgressExam.timeLeft)} นาที` : 'ไม่จำกัดเวลา'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => setShowDiscardConfirm(false)}>เก็บไว้</button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmDiscard}>ลบความคืบหน้า</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
