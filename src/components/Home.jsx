import { useState } from 'react';
import { Layout, FileText, GraduationCap, ArrowLeft, Clock } from 'lucide-react';

export default function Home({ subjects, onSelectSubject }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  const renderYearSelection = () => (
    <div style={{ marginTop: '4rem' }} className="animate-fade-in">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0px' }}>
        <GraduationCap size={16} />
        เลือกระดับชั้นปี
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <div 
          className="card"
          onClick={() => setSelectedYear(2)}
          style={{
            padding: '2rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRadius: '12px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>วิชาชั้นปีที่ 2</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ 2</p>
          </div>
          <div style={{ 
            marginTop: '0.5rem',
            background: 'var(--surface-hover)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: 'var(--text)',
            display: 'inline-block',
            width: 'fit-content',
            fontWeight: 500,
            boxShadow: 'var(--shadow-border)'
          }}>
            {subjects.filter(s => s.year === 2).length} วิชา
          </div>
        </div>

        <div 
          className="card"
          onClick={() => setSelectedYear(3)}
          style={{
            padding: '2rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            borderRadius: '12px'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>วิชาชั้นปีที่ 3</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ 3</p>
          </div>
          <div style={{ 
            marginTop: '0.5rem',
            background: 'var(--surface-hover)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            width: 'fit-content',
            fontWeight: 500,
            boxShadow: 'var(--shadow-border)'
          }}>
            {subjects.filter(s => s.year === 3).length > 0 
              ? `${subjects.filter(s => s.year === 3).length} วิชา` 
              : <><Clock size={12} /> Coming Soon</>
            }
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubjectList = (year) => {
    const filteredSubjects = subjects.filter(sub => sub.year === year);

    if (filteredSubjects.length === 0) {
      return (
        <div style={{ marginTop: '4rem' }} className="animate-fade-in">
          <button 
            onClick={() => setSelectedYear(null)}
            className="btn btn-outline"
            style={{ marginBottom: '2rem' }}
          >
            <ArrowLeft size={16} /> ย้อนกลับ
          </button>
          
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '12px' }}>
            <Clock size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>เตรียมพบกับข้อสอบปี {year} เร็วๆ นี้!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              เรากำลังรวบรวมข้อสอบและจัดทำเฉลยสำหรับรายวิชาชั้นปีที่ {year} โปรดติดตามการอัปเดต
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '3rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setSelectedYear(null)}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ color: 'var(--text)', fontSize: '1.25rem', margin: 0, letterSpacing: '-0.5px', fontWeight: 600 }}>
            รายวิชาชั้นปีที่ {year}
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredSubjects.map(sub => (
            <div 
              key={sub.id} 
              className="card"
              onClick={() => onSelectSubject(sub.id)}
              style={{
                padding: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderRadius: '12px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', letterSpacing: '-0.25px', fontWeight: 600 }}>{sub.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sub.desc}</p>
              </div>

              <div style={{ 
                marginTop: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.375rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'var(--surface-hover)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                width: 'fit-content',
                fontWeight: 500,
                boxShadow: 'var(--shadow-border)'
              }}>
                <FileText size={12} />
                {sub.questionCount} ข้อ
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto', padding: '4rem 0 2rem' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 600, letterSpacing: '-2.4px', margin: '0 0 1rem 0', textWrap: 'balance' }}>
          ฝึกทำข้อสอบทุกวิชาในที่เดียว
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
          เลือกวิชาที่ต้องการฝึกซ้อม ทำข้อสอบพร้อมดูเฉลยและคำอธิบาย พัฒนาความรู้อย่างมีประสิทธิภาพ
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid var(--border-divider)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>{subjects.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>วิชาทั้งหมด</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>{totalQuestions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ข้อสอบ</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>100%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>มีเฉลยอธิบาย</div>
          </div>
        </div>
      </div>

      {selectedYear === null ? renderYearSelection() : renderSubjectList(selectedYear)}
    </div>
  );
}
