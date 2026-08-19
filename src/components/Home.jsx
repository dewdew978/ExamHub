import { useState, useEffect } from 'react';
import { FileText, ArrowLeft, Clock, GraduationCap, Lock, AlertTriangle } from 'lucide-react';

export default function Home({ subjects, onSelectSubject, user, onRequireLogin, onOpenReport }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('All');
  
  const [showGreeting, setShowGreeting] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 4000);

    const removeTimer = setTimeout(() => {
      setShowGreeting(false);
    }, 4600);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [user]);

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  // 1. Render Year Selection
  const renderYearSelection = () => (
    <div className="home-section animate-fade-in">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0px' }}>
        <GraduationCap size={16} />
        เลือกระดับชั้นปี
      </h2>

      <div className="card-grid">
        {[2, 3].map(year => {
          const yearSubjects = subjects.filter(s => s.year === year);
          return (
            <div 
              key={year}
              className="card home-card"
              onClick={() => setSelectedYear(year)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderRadius: '12px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', letterSpacing: '-0.3px' }}>วิชาชั้นปีที่ {year}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ {year}</p>
              </div>
              <div style={{ 
                marginTop: 'auto',
                background: 'var(--surface-hover)',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                color: 'var(--text)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                width: 'fit-content',
                fontWeight: 500,
                boxShadow: 'var(--shadow-border)'
              }}>
                {yearSubjects.length > 0 
                  ? `${yearSubjects.length} ชุดข้อสอบ` 
                  : <><Clock size={12} /> Coming Soon</>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 2. Render Category Selection for a Specific Year
  const renderCategorySelection = () => {
    const yearSubjects = subjects.filter(sub => sub.year === selectedYear);

    if (yearSubjects.length === 0) {
      return (
        <div className="home-section animate-fade-in">
          <button 
            onClick={() => setSelectedYear(null)}
            className="btn btn-outline"
            style={{ marginBottom: '1.25rem' }}
          >
            <ArrowLeft size={16} /> ย้อนกลับ
          </button>
          
          <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderRadius: '12px' }}>
            <Clock size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', letterSpacing: '-0.3px' }}>เตรียมพบกับข้อสอบปี {selectedYear} เร็วๆ นี้!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>
              เรากำลังรวบรวมข้อสอบและจัดทำเฉลยสำหรับรายวิชาชั้นปีที่ {selectedYear} โปรดติดตามการอัปเดต
            </p>
          </div>
        </div>
      );
    }

    // Get unique categories and compute metadata for this year
    const categoryMap = yearSubjects.reduce((acc, sub) => {
      if (!acc[sub.category]) {
        acc[sub.category] = {
          name: sub.category,
          count: 0,
          questionCount: 0,
          icon: sub.icon || '📚',
          color: sub.color || '#0ea5e9',
          iconBg: sub.iconBg || 'rgba(14,165,233,0.15)'
        };
      }
      acc[sub.category].count += 1;
      acc[sub.category].questionCount += sub.questionCount;
      return acc;
    }, {});

    const categories = Object.values(categoryMap);

    return (
      <div className="home-section animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button 
            onClick={() => {
              setSelectedYear(null);
              setSelectedExamType('All');
            }}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ color: 'var(--text)', fontSize: '1.15rem', margin: 0, letterSpacing: '-0.3px', fontWeight: 600 }}>
            หมวดหมู่วิชาปีที่ {selectedYear}
          </h2>
        </div>

        <div className="card-grid">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="card home-card"
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.15rem', flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', letterSpacing: '-0.25px', margin: 0, fontWeight: 600 }}>{cat.name}</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <div style={{ 
                  background: 'var(--surface-hover)',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text)',
                  fontWeight: 500,
                  boxShadow: 'var(--shadow-border)'
                }}>
                  {cat.count} ชุดข้อสอบ
                </div>
                <div style={{ 
                  background: 'var(--surface-hover)',
                  padding: '0.2rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  boxShadow: 'var(--shadow-border)'
                }}>
                  {cat.questionCount} ข้อ
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 3. Render Subject (Quiz) List for a Specific Category
  const renderSubjectList = () => {
    const filteredSubjects = subjects.filter(sub => 
      sub.year === selectedYear && 
      sub.category === selectedCategory &&
      (selectedExamType === 'All' || sub.type === selectedExamType)
    );

    return (
      <div className="home-section animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ color: 'var(--text)', fontSize: '1.15rem', margin: 0, letterSpacing: '-0.3px', fontWeight: 600 }}>
            {selectedCategory}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${selectedExamType === 'All' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('All')}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
          >
            ทั้งหมด
          </button>
          <button 
            className={`btn ${selectedExamType === 'Midterm' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('Midterm')}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
          >
            Midterm
          </button>
          <button 
            className={`btn ${selectedExamType === 'Final' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('Final')}
            style={{ padding: '0.35rem 0.85rem', fontSize: '0.8125rem' }}
          >
            Final
          </button>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={36} style={{ margin: '0 auto 0.75rem auto', opacity: 0.2 }} />
            <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>ไม่มีข้อสอบหมวด {selectedExamType} ในวิชานี้</p>
          </div>
        ) : (
          <div className="card-grid">
            {filteredSubjects.map(sub => {
              const isLocked = sub.requiresAuth && !user;
              return (
                <div 
                  key={sub.id} 
                  className="card home-card"
                  onClick={() => {
                    if (isLocked && onRequireLogin) {
                      onRequireLogin(sub);
                    } else {
                      onSelectSubject(sub.id);
                    }
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.625rem',
                    borderRadius: '12px',
                    position: 'relative',
                    border: isLocked ? '1px dashed var(--border-color)' : undefined
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.95rem', letterSpacing: '-0.25px', fontWeight: 600 }}>{sub.name}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
                        {sub.requiresAuth && (
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 600, 
                            padding: '0.125rem 0.375rem', 
                            borderRadius: '4px',
                            background: isLocked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: isLocked ? 'var(--error)' : 'var(--success)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <Lock size={10} /> {isLocked ? 'ต้อง Login' : 'ปลดล็อกแล้ว'}
                          </span>
                        )}
                        {sub.type && (
                          <span style={{ 
                            fontSize: '0.65rem', 
                            fontWeight: 600, 
                            padding: '0.125rem 0.375rem', 
                            borderRadius: '4px',
                            background: sub.type === 'Midterm' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                            color: sub.type === 'Midterm' ? 'var(--warning)' : 'var(--success)',
                            textTransform: 'uppercase'
                          }}>
                            {sub.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>{sub.desc}</p>
                  </div>

                  <div style={{ 
                    marginTop: 'auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.375rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    background: 'var(--surface-hover)',
                    padding: '0.2rem 0.45rem',
                    borderRadius: '4px',
                    width: 'fit-content',
                    fontWeight: 500,
                    boxShadow: 'var(--shadow-border)'
                  }}>
                    <FileText size={12} />
                    {sub.questionCount} ข้อ
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in home-wrapper">
      <style>{`
        .home-wrapper {
          width: 100%;
        }
        .home-hero {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
          padding: 2.5rem 0 1.5rem;
          position: relative;
        }
        .home-hero-title {
          font-size: 2.25rem;
          font-weight: 700;
          letter-spacing: -1.2px;
          margin: 0 0 0.75rem 0;
          text-wrap: balance;
          line-height: 1.2;
        }
        .home-hero-subtitle {
          color: var(--text-muted);
          font-size: 0.9375rem;
          margin-bottom: 1.75rem;
          line-height: 1.5;
        }
        .home-stats-row {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border-divider);
        }
        .home-stat-number {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .home-stat-label {
          color: var(--text-muted);
          font-size: 0.8125rem;
        }
        .home-section {
          margin-top: 2.5rem;
        }
        .home-card {
          padding: 1.25rem;
        }

        @media (max-width: 768px) {
          .home-hero {
            padding: 1.5rem 0 1rem;
          }
          .home-hero-title {
            font-size: 1.65rem;
            letter-spacing: -0.6px;
            margin-bottom: 0.5rem;
          }
          .home-hero-subtitle {
            font-size: 0.8125rem;
            margin-bottom: 1.25rem;
          }
          .home-stats-row {
            gap: 1.25rem;
            padding-top: 1.25rem;
            justify-content: space-around;
          }
          .home-stat-number {
            font-size: 1.15rem;
          }
          .home-section {
            margin-top: 1.5rem;
          }
          .home-card {
            padding: 1rem;
          }
        }
      `}</style>

      <div className="home-hero">
        {user && showGreeting && (
          <div style={{
            position: 'absolute',
            top: '0.25rem',
            left: '50%',
            transform: isFadingOut ? 'translate(-50%, -6px)' : 'translate(-50%, 0)',
            opacity: isFadingOut ? 0 : 1,
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            pointerEvents: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.3rem 0.8rem',
            borderRadius: '999px',
            background: 'var(--surface-hover)',
            boxShadow: 'var(--shadow-border)',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            zIndex: 10
          }}>
            <span>ยินดีต้อนรับคุณ <strong style={{ color: 'var(--accent)' }}>{user?.user_metadata?.nickname || user?.user_metadata?.full_name || user?.email?.split('@')[0]}</strong></span>
          </div>
        )}

        <h1 className="home-hero-title">
          ฝึกทำข้อสอบทุกวิชาในที่เดียว
        </h1>
        
        <p className="home-hero-subtitle">
          เลือกวิชาที่ต้องการฝึกซ้อม ทำข้อสอบพร้อมดูเฉลยและคำอธิบาย พัฒนาความรู้อย่างมีประสิทธิภาพ
        </p>

        <div className="home-stats-row">
          <div style={{ textAlign: 'center' }}>
            <div className="home-stat-number">2</div>
            <div className="home-stat-label">ระดับชั้นปี</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="home-stat-number">{subjects.length}</div>
            <div className="home-stat-label">ชุดข้อสอบ</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="home-stat-number">{totalQuestions}</div>
            <div className="home-stat-label">ข้อทั้งหมด</div>
          </div>
        </div>
      </div>

      {selectedYear === null 
        ? renderYearSelection() 
        : selectedCategory === null 
          ? renderCategorySelection() 
          : renderSubjectList()
      }

      <div style={{ marginTop: '3rem', padding: '1.75rem 0', textAlign: 'center', borderTop: '1px solid var(--border-divider)', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>พบข้อสอบผิดพลาด เฉลยไม่ตรง หรือมีข้อเสนอแนะ?</p>
        <button 
          type="button"
          className="btn btn-outline"
          onClick={() => onOpenReport && onOpenReport()}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <AlertTriangle size={13} color="var(--error)" /> แจ้งข้อสอบผิด / รายงานปัญหา
        </button>
      </div>
    </div>
  );
}
