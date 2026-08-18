import { FileText, ArrowLeft, PlayCircle, Info } from 'lucide-react';

export default function ExamIntro({ subject, onStart, onBack }) {
  const choiceTypes = new Set(subject.questions.map(q => q.choices?.length || 4));
  const typesArray = Array.from(choiceTypes).sort((a, b) => a - b);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <button 
        className="btn btn-outline"
        onClick={onBack}
        style={{ marginBottom: '2rem' }}
      >
        <ArrowLeft size={16} /> ย้อนกลับ
      </button>

      <div className="card" style={{ padding: '3rem', borderRadius: '12px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ 
            width: '64px', height: '64px', background: 'var(--surface-hover)', 
            borderRadius: '16px', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', margin: '0 auto 1.5rem',
            color: 'var(--accent)'
          }}>
            <FileText size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-1px', marginBottom: '0.5rem' }}>รายละเอียดการสอบ</h1>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 500 }}>{subject.name}</h2>
        </div>

        <div style={{ 
          background: 'var(--surface-hover)', 
          padding: '2rem', 
          borderRadius: '8px',
          borderLeft: '4px solid var(--accent)',
          marginBottom: '3rem'
        }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>
            <Info size={20} color="var(--accent)" />
            คำชี้แจงการทำข้อสอบ
          </h3>
          <div style={{ lineHeight: 1.8, color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '1rem' }}>ข้อสอบชุดนี้มีรายละเอียดดังนี้:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li>จำนวนข้อสอบทั้งหมด <strong>{subject.questions.length} ข้อ</strong></li>
              {typesArray.map(type => (
                <li key={type}>รูปแบบ: ปรนัย {type} ตัวเลือก 1 คำตอบ</li>
              ))}
              <li>เวลาในการทำข้อสอบ <strong>{subject.questions.length} นาที</strong> (เฉลี่ยข้อละ 1 นาที)</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>ตัวจับเวลาจะเริ่มเดินหลังจากที่คุณกดปุ่ม <strong>“เริ่มทำข้อสอบ”</strong> ด้านล่าง</p>
            <p>เมื่อทำถึงข้อสุดท้าย ให้กดปุ่ม <strong>“ดูผลคะแนน”</strong> เพื่อส่งข้อสอบและดูเฉลย <br/>หากต้องการตรวจทานหรือแก้ไขก่อนส่ง สามารถใช้ปุ่ม <strong>"ตัวนำทางข้อสอบ"</strong> (ไอคอนตารางมุมขวาบน) เพื่อกระโดดไปยังข้อที่ต้องการแก้ไขได้ทันที</p>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button 
            className="btn btn-primary"
            onClick={onStart}
            style={{ fontSize: '1.125rem', padding: '1rem 3rem' }}
          >
            <PlayCircle size={20} />
            เริ่มทำข้อสอบ
          </button>
        </div>
      </div>
    </div>
  );
}
