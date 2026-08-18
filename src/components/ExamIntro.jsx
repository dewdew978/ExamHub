import { FileText, ArrowLeft, PlayCircle, Info } from 'lucide-react';

export default function ExamIntro({ subject, onStart, onBack }) {
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
            <p style={{ marginBottom: '1rem' }}>ข้อสอบมี 3 รูปแบบคือ:</p>
            <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem' }}>
              <li>1.1 ปรนัย 4 ตัวเลือก 1 คำตอบ</li>
              <li>1.2 ปรนัย 5 ตัวเลือก 1 คำตอบ</li>
              <li>1.3 ปรนัย 4 ตัวเลือก 1 คำตอบ (คะแนนต่างกัน)</li>
            </ul>
            <p style={{ marginBottom: '1rem' }}>โปรแกรมนี้จะใช้เป็นกระดาษคำตอบเท่านั้น ให้ใช้โจทย์ที่ปรากฎภายในเล่ม โดยเช็คให้เลข Ref ของชุดข้อสอบให้ตรงกัน</p>
            <p style={{ marginBottom: '1rem' }}>เวลาจะเริ่มจับหลังจากกดปุ่ม <strong>“เริ่มทำข้อสอบ”</strong></p>
            <p>เมื่อต้องการจะส่งข้อสอบให้กดปุ่ม <strong>“ตรวจทานข้อสอบ”</strong> เพื่อตรวจทานก่อนส่งและหากต้องการแก้ไขให้กดไปที่ข้อที่ต้องการ เพื่อเลือกคำตอบใหม่ ตัวอย่าง</p>
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
