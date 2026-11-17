import { useState } from 'react';
import { AlertTriangle, Send, CheckCircle2, HelpCircle, FileText, Bug, Sparkles, Clock, Inbox } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ISSUE_TYPES = [
  { id: 'wrong_answer', label: 'เฉลยผิด / คำตอบไม่ถูกต้อง', icon: AlertTriangle, color: 'var(--error)' },
  { id: 'wrong_translation', label: 'คำแปล / ภาษาไทยผิดพลาด', icon: FileText, color: 'var(--warning)' },
  { id: 'bug_system', label: 'บั๊ก / ระบบแสดงผลผิดพลาด', icon: Bug, color: 'var(--info)' },
  { id: 'suggestion', label: 'ข้อเสนอแนะ / ปรับปรุง', icon: Sparkles, color: 'var(--success)' },
  { id: 'other', label: 'อื่นๆ', icon: HelpCircle, color: 'var(--text-muted)' }
];

export default function Report({ subjects = [], initialData = null, user = null, onBack, onSuccess, onOpenAdminReports }) {
  const [issueType, setIssueType] = useState(initialData?.issueType || 'wrong_answer');
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialData?.subjectId || (subjects[0]?.id || ''));
  const [questionNumber, setQuestionNumber] = useState(initialData?.questionNumber || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [myReports, setMyReports] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('examhub_user_reports') || '[]');
    } catch {
      return [];
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('กรุณาระบุรายละเอียดปัญหาที่พบ');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const subjectObj = subjects.find(s => s.id === selectedSubjectId);
    const reportData = {
      id: 'rep_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      issue_type: issueType,
      subject_id: selectedSubjectId || null,
      subject_name: subjectObj?.name || (selectedSubjectId === 'general' ? 'ระบบทั่วไป' : 'ไม่ได้ระบุ'),
      question_number: questionNumber ? parseInt(questionNumber, 10) || questionNumber : null,
      description: description.trim(),
      contact_email: contactEmail.trim() || null,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // 1. Try to save in Supabase if reports table is available
      try {
        const { error: dbError } = await supabase
          .from('reports')
          .insert([reportData]);
        if (dbError) {
          console.warn("Supabase reports insert notice:", dbError.message);
        }
      } catch (dbErr) {
        console.warn("Supabase reports table not configured, falling back to local store:", dbErr);
      }

      // 2. Save locally so user can always see their submitted reports
      const updatedReports = [reportData, ...myReports];
      setMyReports(updatedReports);
      localStorage.setItem('examhub_user_reports', JSON.stringify(updatedReports));

      setSubmittedReport(reportData);
      if (onSuccess) onSuccess(reportData);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setErrorMessage('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedReport(null);
    setDescription('');
    setQuestionNumber('');
    setErrorMessage('');
  };

  return (
    <div className="page animate-fade-in" style={{ maxWidth: 1040 }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">แจ้งข้อสอบผิด / ปัญหา</h1>
          <p className="page-subtitle">ช่วยเราพัฒนา EXETIA ให้ดียิ่งขึ้น หากพบข้อสอบผิด เฉลยไม่ตรง หรือบั๊กในระบบ</p>
        </div>
        {onOpenAdminReports && (
          <div className="page-actions">
            <button type="button" className="btn" onClick={onOpenAdminReports}>
              <Inbox size={14} /> กล่องรายงานปัญหา
            </button>
          </div>
        )}
      </div>

      <div className="report-grid">
        {submittedReport ? (
          <div className="card animate-fade-in" style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
            <span className="tile" style={{ width: 44, height: 44, background: 'var(--success-soft)', color: 'var(--success)', boxShadow: 'none', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={22} />
            </span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.35rem' }}>ส่งรายงานเรียบร้อยแล้ว</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 460, margin: '0 auto 1.25rem', lineHeight: 1.6 }}>
              ขอบคุณสำหรับการแจ้งปัญหา ทีมงานจะนำไปตรวจสอบและปรับปรุงให้ดียิ่งขึ้น
              <br />รหัสรายงาน <code style={{ background: 'var(--surface-hover)', padding: '0.1rem 0.35rem', borderRadius: 4, fontSize: '0.8rem' }}>{submittedReport.id}</code>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={onBack}>กลับคลังข้อสอบ</button>
              <button type="button" className="btn btn-primary" onClick={handleResetForm}><Send size={14} /> แจ้งเรื่องอื่นเพิ่มเติม</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMessage && (
                <div role="alert" className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--error)', fontSize: '0.8125rem', padding: '0.6rem 0.8rem', background: 'var(--error-soft)', borderRadius: 8 }}>
                  <AlertTriangle size={14} /> {errorMessage}
                </div>
              )}

              <fieldset style={{ border: 'none' }}>
                <legend className="label">ประเภทปัญหาที่พบ <span style={{ color: 'var(--error)' }}>*</span></legend>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '0.4rem' }}>
                  {ISSUE_TYPES.map(type => {
                    const Icon = type.icon;
                    const isSelected = issueType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setIssueType(type.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.55rem', height: 38, padding: '0 0.7rem',
                          borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.8125rem',
                          background: isSelected ? 'var(--accent-softer)' : 'var(--surface)',
                          boxShadow: isSelected ? '0 0 0 1.5px var(--accent)' : '0 0 0 1px var(--border-color)',
                          color: isSelected ? 'var(--text)' : 'var(--text-muted)', fontWeight: isSelected ? 500 : 400,
                        }}
                      >
                        <Icon size={15} color={type.color} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="report-subject-grid">
                <div>
                  <label htmlFor="subject-select" className="label">ชุดข้อสอบที่พบปัญหา</label>
                  <select id="subject-select" className="select" value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}>
                    <option value="general">ปัญหาทั่วไป / ไม่เกี่ยวกับข้อสอบ</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.questionCount} ข้อ)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="question-number" className="label">ข้อที่ (ถ้ามี)</label>
                  <input id="question-number" className="input" type="number" min="1" placeholder="เช่น 12" value={questionNumber} onChange={(e) => setQuestionNumber(e.target.value)} />
                </div>
              </div>

              <div>
                <label htmlFor="report-desc" className="label">รายละเอียดปัญหา <span style={{ color: 'var(--error)' }}>*</span></label>
                <textarea
                  id="report-desc"
                  className="textarea"
                  rows={5}
                  required
                  placeholder="เช่น คำถามข้อนี้เฉลยผิด คำตอบที่ถูกต้องควรเป็น... เพราะว่า..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="label">อีเมลของคุณ <span style={{ color: 'var(--text-subtle)', fontWeight: 400 }}>(ไม่บังคับ)</span></label>
                <input id="contact-email" className="input" type="email" placeholder="your-email@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                <p className="hint">ใช้สำหรับติดต่อกลับเมื่อแก้ไขเรียบร้อย</p>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn" onClick={onBack}>ยกเลิก</button>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 120 }}>
                {loading ? 'กำลังส่ง...' : <><Send size={14} /> ส่งรายงาน</>}
              </button>
            </div>
          </form>
        )}

        <aside>
          <div className="section-title"><Clock size={14} /> รายงานที่คุณเคยส่ง <span className="muted">{myReports.length}</span></div>
          {myReports.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.75rem 1rem', fontSize: '0.8125rem' }}>
              ยังไม่มีรายงานจากอุปกรณ์นี้
            </div>
          ) : (
            <div className="ds-table-wrap">
              {myReports.slice(0, 6).map((rep, i) => (
                <div key={rep.id} style={{ padding: '0.7rem 0.85rem', borderTop: i ? '1px solid var(--border-divider)' : 'none', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.subject_name} {rep.question_number ? `· ข้อ ${rep.question_number}` : ''}
                    </span>
                    <span className="badge badge-success">บันทึกแล้ว</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', margin: '2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.description}</p>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{new Date(rep.created_at).toLocaleString('th-TH')}</div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <style>{`
        .report-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 1.5rem; align-items: start; }
        .report-subject-grid { display: grid; grid-template-columns: 1fr 140px; gap: 0.75rem; }
        @media (max-width: 900px) { .report-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .report-subject-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
