import { useState, useEffect } from 'react';
import {
  FileText, ArrowLeft, Play, RotateCcw, BookOpen, ExternalLink, Shield, Timer, ListChecks, Layers, GraduationCap, Tag, Info, CheckSquare, Navigation,
} from 'lucide-react';
import { getSubjectReferenceData } from '../data/examReferences';
import { readExamPreferences } from '../lib/examPreferences';
import SubjectIcon from './SubjectIcon';

function Property({ icon: Icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minHeight: 32, fontSize: '0.8125rem' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', width: 120, flexShrink: 0, color: 'var(--text-muted)' }}>
        <Icon size={14} /> {label}
      </span>
      <span style={{ color: 'var(--text)', minWidth: 0 }}>{children}</span>
    </div>
  );
}

export default function ExamIntro({ subject, onStart, onResume, onBack }) {
  const [inProgress, setInProgress] = useState(null);
  const [{ timerEnabled }] = useState(readExamPreferences);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('examhub_in_progress_exam');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.subjectId === subject.id) setInProgress(parsed);
      }
    } catch (e) {
      console.warn('Failed to check in-progress exam:', e);
    }
  }, [subject.id]);

  const total = subject.questions.length;
  const typesArray = Array.from(new Set(subject.questions.map(q => q.choices?.length || 4))).sort((a, b) => a - b);
  const hasMultipleAnswers = subject.questions.some(q => Array.isArray(q.answer));
  const refData = getSubjectReferenceData(subject);
  const color = subject.color || '#6b47f5';

  const restart = () => {
    try { localStorage.removeItem('examhub_in_progress_exam'); } catch (e) { console.warn(e); }
    setInProgress(null);
    onStart();
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 1040 }}>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: '1rem', marginLeft: '-0.5rem' }}>
        <ArrowLeft size={14} /> คลังข้อสอบ
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.75rem' }}>
        <span className="tile" style={{ width: 48, height: 48, borderRadius: 12, background: `color-mix(in srgb, ${color} 12%, var(--surface))`, boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 22%, transparent)` }}>
          <SubjectIcon category={subject.category} size={22} color={color} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div className="page-eyebrow">{subject.category}</div>
          <h1 className="page-title">{subject.name}</h1>
          {subject.desc && <p className="page-subtitle">{subject.desc}</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem', alignItems: 'start' }} className="intro-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          <section>
            <div className="section-title"><Info size={14} /> คำชี้แจงการทำข้อสอบ</div>
            <div className="card" style={{ padding: '0.25rem 0' }}>
              {[
                { icon: ListChecks, text: <>ข้อสอบทั้งหมด <strong>{total} ข้อ</strong> แบบปรนัย {typesArray.join(' / ')} ตัวเลือก</> },
                hasMultipleAnswers && { icon: CheckSquare, text: <>บางข้อเลือกได้หลายคำตอบ ให้เลือกให้ครบตามจำนวนที่ระบุ แล้วกด <strong>“ยืนยันคำตอบ”</strong></> },
                { icon: Timer, text: timerEnabled ? <>มีเวลา <strong>{total} นาที</strong> (เฉลี่ยข้อละ 1 นาที) ตัวจับเวลาจะเริ่มเมื่อกด <strong>“เริ่มทำข้อสอบ”</strong></> : <>ไม่จำกัดเวลา ทำได้ตามจังหวะของคุณ</> },
                { icon: Navigation, text: <>ใช้ <strong>ตัวนำทางข้อสอบ</strong> เพื่อข้ามไปยังข้อที่ต้องการได้ทุกเมื่อ</> },
                { icon: FileText, text: <>เมื่อถึงข้อสุดท้าย กด <strong>“ดูผลคะแนน”</strong> เพื่อส่งข้อสอบและดูเฉลยพร้อมคำอธิบาย</> },
              ].filter(Boolean).map((row, i, arr) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < arr.length - 1 ? '1px solid var(--border-divider)' : 'none', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                  <row.icon size={16} style={{ flexShrink: 0, marginTop: 2, color: 'var(--text-subtle)' }} />
                  <span>{row.text}</span>
                </div>
              ))}
            </div>
          </section>

          {refData && (
            <section>
              <div className="section-title" style={{ justifyContent: 'space-between' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}><BookOpen size={14} /> แหล่งที่มาและเอกสารอ้างอิง</span>
                {refData.organization && <span className="badge badge-success"><Shield size={10} /> {refData.organization}</span>}
              </div>
              {refData.primarySource && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                  แหล่งข้อมูลหลัก: <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{refData.primarySource}</strong>
                  {refData.curatedBy && <> · เรียบเรียงโดย <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{refData.curatedBy}</strong></>}
                </p>
              )}
              {refData.references?.length > 0 && (
                <div className="ds-table-wrap">
                  {refData.references.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.8rem 1rem', borderBottom: idx < refData.references.length - 1 ? '1px solid var(--border-divider)' : 'none' }}>
                      <span className="tile" style={{ width: 28, height: 28 }}><BookOpen size={13} /></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, fontSize: '0.84rem', lineHeight: 1.4 }}>{item.title}</div>
                        {item.author && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.author}</div>}
                        {item.desc && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>}
                      </div>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm" style={{ textDecoration: 'none' }} title="เปิดเอกสารอ้างอิงภายนอก">
                          เปิด <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '0.65rem', lineHeight: 1.55 }}>
                ชุดข้อสอบนี้เรียบเรียงขึ้นเพื่อการทบทวนความรู้และเตรียมความพร้อมก่อนสอบจริง โดยอ้างอิงตามมาตรฐานหลักสูตรที่เกี่ยวข้อง
              </p>
            </section>
          )}
        </div>

        <aside className="card" style={{ position: 'sticky', top: 'calc(var(--topbar-h) + 1rem)', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem' }}>
            <Property icon={ListChecks} label="จำนวนข้อ">{total} ข้อ</Property>
            <Property icon={Timer} label="เวลา">{timerEnabled ? `${total} นาที` : 'ไม่จำกัด'}</Property>
            <Property icon={Layers} label="หมวดวิชา">{subject.category}</Property>
            {subject.type && <Property icon={Tag} label="ประเภท"><span className={`badge ${subject.type === 'Midterm' ? 'badge-warning' : 'badge-success'}`}>{subject.type}</span></Property>}
            {subject.year && <Property icon={GraduationCap} label="ชั้นปี">ปี {subject.year}</Property>}
          </div>

          <div style={{ padding: '0.9rem 1rem', borderTop: '1px solid var(--border-divider)', background: 'var(--bg-subtle)' }}>
            {inProgress ? (
              <>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500, marginBottom: 6 }}>คุณทำชุดนี้ค้างไว้</div>
                <div className="progress" style={{ marginBottom: 6 }}><span style={{ width: `${Math.min(100, Math.round((inProgress.answeredCount / total) * 100))}%` }} /></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                  ตอบแล้ว {inProgress.answeredCount}/{total} ข้อ · ล่าสุดข้อที่ {inProgress.currentQ + 1}
                  {timerEnabled && <> · เหลือ {Math.floor(inProgress.timeLeft / 60)}:{String(inProgress.timeLeft % 60).padStart(2, '0')} นาที</>}
                </div>
                <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => onResume && onResume(inProgress)}>
                  <Play size={15} /> ทำต่อจากข้อที่ {inProgress.currentQ + 1}
                </button>
                <button type="button" className="btn btn-ghost" style={{ width: '100%', marginTop: 6 }} onClick={restart}>
                  <RotateCcw size={14} /> เริ่มใหม่ตั้งแต่ต้น
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onStart}>
                <Play size={15} /> เริ่มทำข้อสอบ
              </button>
            )}
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .intro-grid { grid-template-columns: 1fr !important; }
          .intro-grid > aside { position: static !important; order: -1; }
        }
      `}</style>
    </div>
  );
}
