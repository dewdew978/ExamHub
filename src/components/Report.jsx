import { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  HelpCircle, 
  FileText, 
  Bug, 
  Sparkles, 
  Clock,
  Inbox
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const ISSUE_TYPES = [
  { id: 'wrong_answer', label: 'เฉลยผิด / คำตอบไม่ถูกต้อง', icon: AlertTriangle, color: 'var(--error)' },
  { id: 'wrong_translation', label: 'คำแปล / ภาษาไทยผิดพลาด', icon: FileText, color: 'var(--warning)' },
  { id: 'bug_system', label: 'บั๊ก / ระบบแสดงผลผิดพลาด', icon: Bug, color: '#3b82f6' },
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
    <div className="animate-fade-in report-page-wrapper" style={{ maxWidth: '760px', margin: '1rem auto 3rem', padding: '0 0.5rem' }}>
      <style>{`
        .report-card {
          padding: 2rem;
        }
        .report-subject-grid {
          display: grid;
          grid-template-columns: 1fr 140px;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .report-card {
            padding: 1.25rem 1rem !important;
          }
          .report-subject-grid {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button 
          className="btn btn-outline"
          onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
        >
          <ArrowLeft size={15} /> ย้อนกลับ
        </button>

        {onOpenAdminReports && (
          <button
            className="btn btn-outline"
            onClick={onOpenAdminReports}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.8125rem', padding: '0.45rem 0.85rem' }}
          >
            <Inbox size={15} />
            <span>กล่องรายงานปัญหา (Inbox)</span>
          </button>
        )}
      </div>

      {submittedReport ? (
        <div className="card report-card animate-fade-in" style={{ textAlign: 'center', borderRadius: '14px' }}>
          <div style={{ 
            width: '52px', height: '52px', borderRadius: '50%', 
            background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1.25rem'
          }}>
            <CheckCircle2 size={30} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '0.35rem', letterSpacing: '-0.4px' }}>
            ส่งรายงานเรียบร้อยแล้ว
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0 auto 1.25rem', lineHeight: 1.5 }}>
            ขอบคุณสำหรับการแจ้งปัญหา ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว (รหัส: <code style={{ background: 'var(--surface-hover)', padding: '0.15rem 0.35rem', borderRadius: '4px' }}>{submittedReport.id}</code>) ทีมงานจะนำไปตรวจสอบและปรับปรุงให้ดียิ่งขึ้นครับ
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleResetForm} style={{ padding: '0.55rem 1.15rem' }}>
              <Send size={15} /> แจ้งเรื่องอื่นเพิ่มเติม
            </button>
            <button className="btn btn-outline" onClick={onBack} style={{ padding: '0.55rem 1.15rem' }}>
              กลับสู่หน้าหลัก
            </button>
          </div>
        </div>
      ) : (
        <div className="card report-card" style={{ borderRadius: '14px' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '8px', 
                background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.3px', margin: 0 }}>
                  รายงานข้อสอบผิดพลาด / แจ้งปัญหา
                </h1>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  ช่วยเราพัฒนา ExamHub ให้ดียิ่งขึ้น หากพบข้อสอบผิด เฉลยไม่ตรง หรือบั๊กในระบบ
                </p>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="animate-fade-in" style={{ 
              color: 'var(--error)', fontSize: '0.875rem', padding: '0.75rem 1rem', 
              background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', 
              border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem' 
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Issue Type Selection */}
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                ประเภทปัญหาที่พบ <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                {ISSUE_TYPES.map(type => {
                  const Icon = type.icon;
                  const isSelected = issueType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setIssueType(type.id)}
                      style={{
                        padding: '0.75rem 0.875rem',
                        borderRadius: '8px',
                        border: isSelected ? `2px solid ${type.color}` : '1px solid var(--border)',
                        background: isSelected ? 'var(--surface-hover)' : 'transparent',
                        color: isSelected ? 'var(--text)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '0.375rem',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Icon size={18} color={type.color} />
                      <span style={{ fontSize: '0.8125rem', fontWeight: isSelected ? 600 : 400 }}>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Subject & Question Selection */}
            <div className="report-subject-grid">
              <div>
                <label htmlFor="subject-select" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  ชุดข้อสอบที่พบปัญหา
                </label>
                <select
                  id="subject-select"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-hover)',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                >
                  <option value="general">🌐 ปัญหาทั่วไป / ไม่เกี่ยวกับข้อสอบ</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.questionCount} ข้อ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="question-number" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  ข้อที่ (ถ้ามี)
                </label>
                <input
                  id="question-number"
                  type="number"
                  min="1"
                  placeholder="เช่น 12"
                  value={questionNumber}
                  onChange={(e) => setQuestionNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-hover)',
                    color: 'var(--text)',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* 3. Description */}
            <div>
              <label htmlFor="report-desc" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                รายละเอียดปัญหา <span style={{ color: 'var(--error)' }}>*</span>
              </label>
              <textarea
                id="report-desc"
                rows={5}
                required
                placeholder="กรุณาระบุรายละเอียด เช่น คำถามข้อนี้เฉลยผิด คำตอบที่ถูกต้องควรเป็น... เพราะว่า..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-hover)',
                  color: 'var(--text)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  outline: 'none'
                }}
              />
            </div>

            {/* 4. Contact Email (Optional) */}
            <div>
              <label htmlFor="contact-email" style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                อีเมลของคุณ <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(ไม่บังคับ - สำหรับติดตามผล)</span>
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="your-email@example.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'var(--surface-hover)',
                  color: 'var(--text)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline" onClick={onBack}>
                ยกเลิก
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ minWidth: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {loading ? 'กำลังส่ง...' : <><Send size={16} /> ส่งรายงาน</>}
              </button>
            </div>
          </form>

          {/* User's recent reports on this device */}
          {myReports.length > 0 && (
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-divider)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--accent)" />
                ประวัติรายงานที่คุณเคยส่ง ({myReports.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {myReports.slice(0, 5).map(rep => (
                  <div 
                    key={rep.id}
                    style={{
                      padding: '0.875rem 1rem',
                      borderRadius: '8px',
                      background: 'var(--surface-hover)',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                        {rep.subject_name} {rep.question_number ? `(ข้อ ${rep.question_number})` : ''}
                      </span>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.125rem 0.375rem', 
                        borderRadius: '4px', 
                        background: 'rgba(16, 185, 129, 0.15)', 
                        color: 'var(--success)' 
                      }}>
                        บันทึกแล้ว
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.description}
                    </p>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {new Date(rep.created_at).toLocaleString('th-TH')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
