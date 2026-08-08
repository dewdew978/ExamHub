import { Layout, CheckCircle, FileText } from 'lucide-react';

export default function Home({ subjects, onSelectSubject }) {
  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

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

      <div style={{ marginTop: '4rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1rem' }}>
          <Layout size={20} />
          เลือกวิชา
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {subjects.map(sub => (
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
    </div>
  );
}
