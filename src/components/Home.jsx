import { useState } from 'react';
import { FileText, Folder, ArrowLeft, Clock, GraduationCap } from 'lucide-react';

export default function Home({ subjects, onSelectSubject }) {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExamType, setSelectedExamType] = useState('All');

  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionCount, 0);

  // 1. Render Year Selection
  const renderYearSelection = () => (
    <div style={{ marginTop: '4rem' }} className="animate-fade-in">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0px' }}>
        <GraduationCap size={16} />
        เลือกระดับชั้นปี
      </h2>

      <div className="card-grid">
        {[2, 3].map(year => {
          const yearSubjects = subjects.filter(s => s.year === year);
          return (
            <div 
              key={year}
              className="card"
              onClick={() => setSelectedYear(year)}
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
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', letterSpacing: '-0.5px' }}>วิชาชั้นปีที่ {year}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>รวมข้อสอบรายวิชาของนักศึกษาปีที่ {year}</p>
              </div>
              <div style={{ 
                marginTop: '0.5rem',
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>เตรียมพบกับข้อสอบปี {selectedYear} เร็วๆ นี้!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
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
      <div style={{ marginTop: '3rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
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
          <h2 style={{ color: 'var(--text)', fontSize: '1.25rem', margin: 0, letterSpacing: '-0.5px', fontWeight: 600 }}>
            หมวดหมู่วิชาปีที่ {selectedYear}
          </h2>
        </div>

        <div className="card-grid">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className="card"
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                padding: '2rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  background: cat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', letterSpacing: '-0.25px', margin: 0, fontWeight: 600 }}>{cat.name}</h3>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <div style={{ 
                  background: 'var(--surface-hover)',
                  padding: '0.25rem 0.5rem',
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
                  padding: '0.25rem 0.5rem',
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
      <div style={{ marginTop: '3rem' }} className="animate-fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setSelectedCategory(null)}
            className="btn btn-outline"
            style={{ width: '32px', height: '32px', padding: 0 }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ color: 'var(--text)', fontSize: '1.25rem', margin: 0, letterSpacing: '-0.5px', fontWeight: 600 }}>
            {selectedCategory}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
          <button 
            className={`btn ${selectedExamType === 'All' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('All')}
            style={{ padding: '0.375rem 1rem', fontSize: '0.875rem' }}
          >
            ทั้งหมด
          </button>
          <button 
            className={`btn ${selectedExamType === 'Midterm' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('Midterm')}
            style={{ padding: '0.375rem 1rem', fontSize: '0.875rem' }}
          >
            Midterm
          </button>
          <button 
            className={`btn ${selectedExamType === 'Final' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setSelectedExamType('Final')}
            style={{ padding: '0.375rem 1rem', fontSize: '0.875rem' }}
          >
            Final
          </button>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
            <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>ไม่มีข้อสอบหมวด {selectedExamType} ในวิชานี้</p>
          </div>
        ) : (
          <div className="card-grid">
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
                  borderRadius: '12px',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', letterSpacing: '-0.25px', fontWeight: 600, paddingRight: '1rem' }}>{sub.name}</h3>
                    {sub.type && (
                      <span style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: 600, 
                        padding: '0.125rem 0.375rem', 
                        borderRadius: '4px',
                        background: sub.type === 'Midterm' ? 'rgba(245, 166, 35, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: sub.type === 'Midterm' ? 'var(--warning)' : 'var(--success)',
                        textTransform: 'uppercase',
                        flexShrink: 0
                      }}>
                        {sub.type}
                      </span>
                    )}
                  </div>
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
        )}
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
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>2</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ระดับชั้นปี</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>{subjects.length}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ชุดข้อสอบ</div>
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-1px' }}>{totalQuestions}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ข้อทั้งหมด</div>
          </div>
        </div>
      </div>

      {selectedYear === null 
        ? renderYearSelection() 
        : selectedCategory === null 
          ? renderCategorySelection() 
          : renderSubjectList()
      }
    </div>
  );
}
