import { useState } from 'react';
import { Layout, FileText, GraduationCap, ArrowLeft, Clock } from 'lucide-react';

export default function Home({ subjects, onSelectSubject }) {
  const [selectedYear, setSelectedYear] = useState(null);

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  const renderYearSelection = () => (
    <div style={{ marginTop: '4rem' }} className="animate-fade-in">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1rem' }}>
        <GraduationCap size={20} />
        เลือกระดับชั้นปี
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem' 
      }}>
        {/* Year 2 Card */}
        <div 
          className="glass-panel"
          onClick={() => setSelectedYear(2)}
          style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.boxShadow = '0 10px 30px var(--accent-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: 'var(--accent-glow)', color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            📚
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>วิชาชั้นปีที่ 2</h3>
            <p style={{ color: 'var(--text-muted)' }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ 2</p>
          </div>
          <div style={{ 
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            fontSize: '0.875rem',
            color: 'var(--text)',
            display: 'inline-block'
          }}>
            {subjects.filter(s => s.year === 2).length} วิชา
          </div>
        </div>

        {/* Year 3 Card */}
        <div 
          className="glass-panel"
          onClick={() => setSelectedYear(3)}
          style={{
            padding: '3rem 2rem',
            borderRadius: '24px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'var(--warning)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(245, 158, 11, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
          }}
        >
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '24px', 
            background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            🎓
          </div>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>วิชาชั้นปีที่ 3</h3>
            <p style={{ color: 'var(--text-muted)' }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ 3</p>
          </div>
          <div style={{ 
            marginTop: '1rem',
            background: 'rgba(255,255,255,0.05)',
            padding: '0.5rem 1rem',
            borderRadius: '999px',
            fontSize: '0.875rem',
            color: 'var(--warning)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {subjects.filter(s => s.year === 3).length > 0 
              ? `${subjects.filter(s => s.year === 3).length} วิชา` 
              : <><Clock size={16} /> Coming Soon</>
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
            <ArrowLeft size={18} /> ย้อนกลับ
          </button>
          
          <div className="glass-panel" style={{ padding: '5rem 2rem', textAlign: 'center', borderRadius: '24px' }}>
            <Clock size={64} style={{ color: 'var(--warning)', margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>เตรียมพบกับข้อสอบปี {year} เร็วๆ นี้!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              เรากำลังรวบรวมข้อสอบและจัดทำเฉลยสำหรับรายวิชาชั้นปีที่ {year} โปรดติดตามการอัปเดต
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ marginTop: '4rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setSelectedYear(null)}
            style={{
              background: 'var(--surface-hover)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              width: '48px', height: '48px',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text)', fontSize: '1.5rem', margin: 0 }}>
            <Layout size={24} className="text-gradient" />
            รายวิชาชั้นปีที่ {year}
          </h2>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredSubjects.map(sub => (
            <div 
              key={sub.id} 
              className="glass-panel"
              onClick={() => onSelectSubject(sub.id)}
              style={{
                padding: '2rem',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = sub.color;
                e.currentTarget.style.boxShadow = `0 10px 30px ${sub.color}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '16px', 
                background: sub.iconBg, color: sub.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem'
              }}>
                {sub.icon}
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{sub.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{sub.desc}</p>
              </div>

              <div style={{ 
                marginTop: 'auto', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                width: 'fit-content'
              }}>
                <FileText size={16} />
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
      <div className="text-center max-w-3xl mx-auto py-12">
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.5rem',
          borderRadius: '999px',
          background: 'rgba(59,130,246,0.1)',
          border: '1px solid rgba(59,130,246,0.3)',
          color: 'var(--accent)',
          fontSize: '0.875rem',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '2rem'
        }}>
          ระบบข้อสอบออนไลน์
        </div>
        
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1.5rem' }}>
          ฝึกทำข้อสอบ<br />
          <span className="text-gradient">ทุกวิชาในที่เดียว</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '600px', mx: 'auto' }}>
          เลือกวิชาที่ต้องการฝึกซ้อม ทำข้อสอบพร้อมดูเฉลยและคำอธิบาย<br />พัฒนาความรู้อย่างมีประสิทธิภาพ
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '3rem',
          paddingTop: '3rem',
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{subjects.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>วิชาทั้งหมด</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800' }}>{totalQuestions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>ข้อสอบ</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '800' }}>100%</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>มีเฉลยพร้อมอธิบาย</div>
          </div>
        </div>
      </div>

      {selectedYear === null ? renderYearSelection() : renderSubjectList(selectedYear)}
    </div>
  );
}
