import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, PlayCircle, Info, Sparkles, RotateCcw, BookOpen, ExternalLink, Shield } from 'lucide-react';
import { getSubjectReferenceData } from '../data/examReferences';

export default function ExamIntro({ subject, onStart, onResume, onBack }) {
  const [inProgress, setInProgress] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('examhub_in_progress_exam');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.subjectId === subject.id) {
          setInProgress(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to check in-progress exam:", e);
    }
  }, [subject.id]);

  const choiceTypes = new Set(subject.questions.map(q => q.choices?.length || 4));
  const typesArray = Array.from(choiceTypes).sort((a, b) => a - b);
  const refData = getSubjectReferenceData(subject);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '1rem auto 2.5rem' }}>
      <button 
        className="btn btn-outline"
        onClick={onBack}
        style={{ marginBottom: '1.25rem' }}
      >
        <ArrowLeft size={15} /> ย้อนกลับ
      </button>

      <div className="card" style={{ padding: '2rem 1.5rem', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '52px', height: '52px', background: 'var(--surface-hover)', 
            borderRadius: '14px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 1rem',
            color: 'var(--accent)'
          }}>
            <FileText size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.5px', marginBottom: '0.35rem' }}>รายละเอียดการสอบ</h1>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}>{subject.name}</h2>
          {subject.desc && (
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.5 }}>
              {subject.desc}
            </p>
          )}
        </div>

        {inProgress && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(134, 59, 255, 0.12) 0%, rgba(0, 112, 243, 0.08) 100%)',
            border: '1px solid var(--accent)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1.75rem',
            textAlign: 'left',
            boxShadow: '0 4px 20px rgba(134, 59, 255, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.35rem' }}>
              <Sparkles size={16} />
              <span>คุณมีข้อสอบชุดนี้ที่ทำค้างไว้</span>
            </div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ตอบไปแล้ว <strong>{inProgress.answeredCount}</strong> จาก {subject.questions.length} ข้อ (ข้อล่าสุด: ข้อที่ {inProgress.currentQ + 1}) • เวลาคงเหลือ <strong>{Math.floor(inProgress.timeLeft / 60)}:{(inProgress.timeLeft % 60).toString().padStart(2, '0')} นาที</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                className="btn btn-primary"
                onClick={() => onResume && onResume(inProgress)}
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.35rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <PlayCircle size={16} />
                ทำต่อจากข้อที่ {inProgress.currentQ + 1}
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  try {
                    localStorage.removeItem('examhub_in_progress_exam');
                  } catch (e) {
                    console.warn(e);
                  }
                  setInProgress(null);
                  onStart();
                }}
                style={{ fontSize: '0.9rem', padding: '0.6rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <RotateCcw size={15} />
                เริ่มทำใหม่ตั้งแต่ต้น
              </button>
            </div>
          </div>
        )}

        <div style={{ 
          background: 'var(--surface-hover)', 
          padding: '1.25rem', 
          borderRadius: '8px',
          borderLeft: '4px solid var(--accent)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            <Info size={18} color="var(--accent)" />
            คำชี้แจงการทำข้อสอบ
          </h3>
          <div style={{ lineHeight: 1.6, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <p style={{ marginBottom: '0.75rem' }}>ข้อสอบชุดนี้มีรายละเอียดดังนี้:</p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>จำนวนข้อสอบทั้งหมด <strong>{subject.questions.length} ข้อ</strong></li>
              {typesArray.map(type => (
                <li key={type}>รูปแบบ: ปรนัย {type} ตัวเลือก 1 คำตอบ</li>
              ))}
              <li>เวลาในการทำข้อสอบ <strong>{subject.questions.length} นาที</strong> (เฉลี่ยข้อละ 1 นาที)</li>
            </ul>
            <p style={{ marginBottom: '0.75rem' }}>ตัวจับเวลาจะเริ่มเดินหลังจากที่คุณกดปุ่ม <strong>“เริ่มทำข้อสอบ”</strong> ด้านล่าง</p>
            <p style={{ margin: 0 }}>เมื่อทำถึงข้อสุดท้าย ให้กดปุ่ม <strong>“ดูผลคะแนน”</strong> เพื่อส่งข้อสอบและดูเฉลย <br/>สามารถใช้ <strong>"ตัวนำทางข้อสอบ"</strong> (ไอคอนตารางมุมขวาบน) เพื่อกระโดดไปยังข้อที่ต้องการได้ทันที</p>
          </div>
        </div>

        {/* แหล่งที่มาและเอกสารอ้างอิง (Sources & References) */}
        {refData && (
          <div style={{
            background: 'var(--surface-hover)',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid #10b981',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 600, margin: 0, color: 'var(--text)' }}>
                <BookOpen size={18} color="#10b981" />
                <span>แหล่งที่มาและเอกสารอ้างอิง (References)</span>
              </h3>
              {refData.organization && (
                <span style={{ 
                  fontSize: '0.75rem', 
                  padding: '0.2rem 0.65rem', 
                  borderRadius: '999px', 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  color: '#10b981', 
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <Shield size={12} />
                  {refData.organization}
                </span>
              )}
            </div>

            {refData.primarySource && (
              <div style={{ marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>แหล่งข้อมูลหลัก: </span>
                <strong style={{ color: 'var(--text)' }}>{refData.primarySource}</strong>
                {refData.curatedBy && (
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    (เรียบเรียงโดย: <strong style={{ color: 'var(--accent)' }}>{refData.curatedBy}</strong>)
                  </span>
                )}
              </div>
            )}

            {refData.references && refData.references.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.5rem' }}>
                {refData.references.map((item, idx) => (
                  <div 
                    key={idx} 
                    style={{ 
                      padding: '0.75rem 0.9rem', 
                      borderRadius: '8px', 
                      background: 'var(--surface)', 
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                          {item.title}
                        </div>
                        {item.author && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                            โดย: {item.author}
                          </div>
                        )}
                        {item.desc && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem', lineHeight: 1.5 }}>
                            {item.desc}
                          </div>
                        )}
                      </div>
                      {item.url && (
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--accent)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            background: 'var(--surface-hover)',
                            textDecoration: 'none',
                            border: '1px solid var(--border-color)'
                          }}
                          title="เปิดเอกสารอ้างอิงภายนอก"
                        >
                          <span>ดูข้อมูล</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ 
              marginTop: '0.85rem', 
              paddingTop: '0.65rem', 
              borderTop: '1px dashed var(--border-color)', 
              fontSize: '0.78rem', 
              color: 'var(--text-muted)',
              lineHeight: 1.5
            }}>
              💡 <strong>หมายเหตุทางวิชาการ:</strong> ชุดข้อสอบนี้จัดทำและเรียบเรียงขึ้นเพื่อวัตถุประสงค์ในการทบทวนความรู้ การฝึกคิดวิเคราะห์ และเตรียมความพร้อมก่อนลงสนามสอบจริง โดยอ้างอิงตามมาตรฐานหลักสูตรวิชาการที่เกี่ยวข้อง
            </div>
          </div>
        )}

        {!inProgress && (
          <div style={{ textAlign: 'center' }}>
            <button 
              className="btn btn-primary"
              onClick={onStart}
              style={{ fontSize: '1rem', padding: '0.75rem 2.25rem' }}
            >
              <PlayCircle size={18} />
              เริ่มทำข้อสอบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
