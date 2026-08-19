import { FileText, ArrowLeft, PlayCircle, Info } from 'lucide-react';

export default function ExamIntro({ subject, onStart, onBack }) {
  const choiceTypes = new Set(subject.questions.map(q => q.choices?.length || 4));
  const typesArray = Array.from(choiceTypes).sort((a, b) => a - b);

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
      </div>
    </div>
  );
}
