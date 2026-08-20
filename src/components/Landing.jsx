import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  GraduationCap, 
  ChevronRight, 
  Layers, 
  Target,
  FileCheck2
} from 'lucide-react';
import Aurora from './Aurora';
import BorderGlow from './BorderGlow';

export default function Landing({ subjects = [], totalQuestions = 0, onStart, onLogin, onNavigateAbout, onNavigateFaq, user }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureList = [
    {
      title: 'คลังข้อสอบครบทุกชั้นปี',
      desc: 'รวบรวมข้อสอบทั้ง Midterm และ Final แยกตามรายวิชาและระดับชั้นปี เพื่อการทบทวนที่ตรงจุดและมีประสิทธิภาพ'
    },
    {
      title: 'เฉลยละเอียด Step-by-Step',
      desc: 'ระบบตรวจคำตอบทันทีพร้อมเฉลยและคำอธิบายวิธีคิด รองรับสูตรคณิตศาสตร์ KaTeX และบล็อกโค้ดชัดเจน'
    },
    {
      title: 'วิเคราะห์ทักษะ & ประวัติคะแนน',
      desc: 'บันทึกคะแนนสะสมและแสดงเรดาร์ชาร์ตวิเคราะห์ความถนัดในแต่ละหมวดหมู่วิชา ช่วยปิดจุดอ่อนได้อย่างแม่นยำ'
    },
    {
      title: 'ระบบแจ้งข้อสอบผิด & แอดมิน',
      desc: 'ผู้ใช้งานสามารถส่งรายงานข้อผิดพลาดได้ทันที พร้อมระบบตรวจสอบและอัปเดตแบบเรียลไทม์เพื่อความถูกต้องสูงสุด'
    }
  ];

  return (
    <div className="landing-page-root animate-fade-in">
      <style>{`
        .landing-page-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }
        .landing-navbar-wrapper {
          position: fixed;
          top: 1.5rem;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          justify-content: center;
          padding: 0 1.5rem;
          pointer-events: none;
        }
        .landing-navbar {
          pointer-events: auto;
          width: 100%;
          max-width: 1100px;
          background: var(--surface);
          background: color-mix(in srgb, var(--surface) 82%, transparent);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid var(--border-color);
          border-radius: 999px;
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.09), 0 2px 10px rgba(0, 0, 0, 0.04);
          padding: 0.55rem 0.65rem 0.55rem 1.4rem;
          transition: all 0.25s ease;
        }
        .landing-navbar-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.25rem;
        }
        .landing-brand {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--text);
          font-weight: 700;
          font-size: 1.25rem;
          letter-spacing: -0.4px;
          cursor: pointer;
        }
        .landing-brand-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--accent);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .landing-nav-center { display: flex; align-items: center; justify-content: center; }
        .landing-nav-links { display: flex; align-items: center; gap: 0.35rem; }
        .landing-nav-link {
          color: var(--text-muted);
          font-size: 0.925rem;
          font-weight: 500;
          background: transparent;
          border: none;
          padding: 0.5rem 1.1rem;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .landing-nav-link:hover { color: var(--text); background: var(--surface-hover); }
        .landing-nav-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
        .landing-nav-btn {
          height: 42px !important;
          padding: 0 1.35rem !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          border-radius: 999px !important;
          cursor: pointer !important;
          transition: transform 0.2s ease !important;
        }
        .landing-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8.5rem 1.5rem 4.5rem;
          overflow: hidden;
          text-align: center;
        }
        .landing-hero-inner { position: relative; z-index: 2; max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; }
        .landing-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.15rem;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid var(--border-color);
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 1.75rem;
        }
        .landing-badge-dot {
          width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
          animation: landingPulse 2s infinite ease-in-out;
        }
        @keyframes landingPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } }
        .landing-title {
          font-size: clamp(2.35rem, 5.8vw, 4rem);
          font-weight: 800;
          letter-spacing: -2.2px;
          line-height: 1.12;
          margin: 0 0 1.35rem 0;
          color: var(--text);
        }
        .landing-title-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .landing-subtitle { font-size: clamp(1rem, 2.2vw, 1.18rem); color: var(--text-muted); max-width: 680px; line-height: 1.7; margin: 0 0 2.25rem 0; }
        .landing-cta-row { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
        .landing-btn-primary { background: var(--btn-primary-bg) !important; color: var(--btn-primary-text) !important; height: 48px !important; padding: 0 1.85rem !important; border-radius: 999px !important; border: none !important; cursor: pointer !important; }
        .landing-btn-secondary { background: var(--surface) !important; color: var(--text) !important; height: 48px !important; padding: 0 1.65rem !important; border-radius: 999px !important; border: 1px solid var(--border-color) !important; cursor: pointer !important; }
        .landing-stats-bar { display: flex; align-items: center; justify-content: center; gap: 3rem; padding: 1.25rem 2.75rem; border-radius: 20px; background: var(--surface); border: 1px solid var(--border-color); backdrop-filter: blur(16px); }
        .landing-stat-number { font-size: 1.75rem; font-weight: 800; color: var(--text); }
        .landing-stat-label { color: var(--text-muted); font-size: 0.8125rem; margin-top: 0.25rem; }
        .landing-demo-wrapper { width: 100%; max-width: 760px; margin: 3.5rem auto 0; text-align: left; }
        .landing-demo-card { background: var(--surface); border: 1px solid var(--border-color); border-radius: 24px; padding: 1.75rem 2rem; }
        .landing-demo-choice { padding: 0.85rem 1.1rem; border-radius: 12px; border: 1px solid var(--border-color); background: var(--surface); cursor: pointer; display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem; width: 100%; font-family: inherit; }
        .landing-steps-section { padding: 5.5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .landing-section-header { text-align: center; margin-bottom: 3.5rem; }
        .landing-section-tag { color: var(--accent); font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 0.5rem; display: inline-block; }
        .landing-section-title { font-size: 2.35rem; font-weight: 800; letter-spacing: -1.2px; margin-bottom: 0.75rem; }
        .landing-section-desc { color: var(--text-muted); font-size: 1.05rem; max-width: 560px; margin: 0 auto; }
        .landing-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.75rem; }
        .landing-step-card { padding: 2rem 1.75rem; border-radius: 20px; background: var(--surface); border: 1px solid var(--border-color); position: relative; }
        .landing-step-num { font-size: 3.25rem; font-weight: 800; color: var(--border-divider); position: absolute; top: 1.25rem; right: 1.5rem; }
        .landing-features-section { padding: 5.5rem 1.5rem; max-width: 1100px; margin: 0 auto; }
        .landing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
        .landing-feature-glow-card { border-radius: 20px; height: 100%; }
        .landing-feature-content { padding: 1.85rem; height: 100%; }
        .landing-pills-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; max-width: 900px; margin: 0 auto 3rem; }
        .landing-subject-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.55rem 1.1rem; border-radius: 999px; background: var(--surface); border: 1px solid var(--border-color); cursor: pointer; }
        .landing-faq-section { padding: 5rem 1.5rem; max-width: 860px; margin: 0 auto; }
        .landing-faq-item { border: 1px solid var(--border-color); border-radius: 16px; margin-bottom: 1rem; background: var(--surface); }
        .landing-faq-q { padding: 1.25rem 1.5rem; display: flex; align-items: center; justify-content: space-between; font-weight: 600; cursor: pointer; }
        .landing-faq-a { padding: 0 1.5rem 1.25rem 1.5rem; color: var(--text-muted); font-size: 0.925rem; }
        .landing-bottom-cta-wrapper { margin: 3rem 1.5rem 5.5rem; max-width: 1050px; margin-left: auto; margin-right: auto; }
        .landing-bottom-cta { padding: 4.5rem 2rem; text-align: center; }
        .landing-footer { border-top: 1px solid var(--border-divider); padding: 2.5rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.875rem; }

        @media (max-width: 820px) {
          .landing-nav-center { display: none; }
          .landing-steps-grid { grid-template-columns: 1fr; }
          .landing-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="landing-navbar-wrapper">
        <header className="landing-navbar">
          <div className="landing-navbar-inner">
            <div className="landing-brand" onClick={() => scrollToSection('top')}>
              <div className="landing-brand-icon"><BookOpen size={19} /></div>
              <span>ExamHub</span>
            </div>
            <div className="landing-nav-center">
              <nav className="landing-nav-links">
                <button className="landing-nav-link" onClick={() => scrollToSection('landing-steps')}>ขั้นตอน</button>
                <button className="landing-nav-link" onClick={() => scrollToSection('landing-features')}>ฟีเจอร์เด่น</button>
                <button className="landing-nav-link" onClick={() => scrollToSection('landing-preview')}>รายวิชาทั้งหมด</button>
                <button className="landing-nav-link" onClick={onNavigateFaq}>คำถามที่พบบ่อย</button>
                <button className="landing-nav-link" onClick={onNavigateAbout}>เกี่ยวกับเรา</button>
              </nav>
            </div>
            <div className="landing-nav-actions">
              {user ? (
                <button className="btn btn-primary landing-nav-btn" onClick={onStart}><span>เข้าคลังข้อสอบ</span></button>
              ) : (
                <button className="btn btn-primary landing-nav-btn" onClick={onStart}><span>เริ่มทำข้อสอบ</span></button>
              )}
            </div>
          </div>
        </header>
      </div>

      <section className="landing-hero" id="top">
        <Aurora colorStops={isDark ? ["#7cff67", "#B497CF", "#5227FF"] : ["#0070f3", "#a855f7", "#ec4899"]} blend={0.5} amplitude={1.0} speed={0.6} />
        <div className="landing-hero-inner">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            <span><strong style={{ color: 'var(--accent)' }}>NEW</strong> · Just shipped v2.0 · อัปเดตคลังข้อสอบ & เฉลยละเอียด</span>
          </div>
          <h1 className="landing-title">ฝึกทำข้อสอบทุกวิชาในที่เดียว<br /><span className="landing-title-gradient">ยกระดับคะแนนสู่เกรด A</span></h1>
          <p className="landing-subtitle">แพลตฟอร์มฝึกทำข้อสอบออนไลน์ครบทุกวิชา ทุกชั้นปี พร้อมเฉลยละเอียดและคำอธิบาย step-by-step วิเคราะห์จุดอ่อน และพัฒนาความรู้อย่างมีประสิทธิภาพ</p>
          <div className="landing-cta-row">
            <button className="landing-btn-primary" onClick={onStart}><span>เริ่มฝึกทำข้อสอบ</span><ArrowRight size={18} /></button>
            <button className="landing-btn-secondary" onClick={() => scrollToSection('landing-steps')}><span>วิธีใช้งาน</span></button>
          </div>
          <div className="landing-stats-bar" id="landing-stats">
            <div className="landing-stat-item"><div className="landing-stat-number">2</div><div className="landing-stat-label">ระดับชั้นปี</div></div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item"><div className="landing-stat-number">{subjects.length || 0}</div><div className="landing-stat-label">ชุดข้อสอบ</div></div>
            <div className="landing-stat-divider" />
            <div className="landing-stat-item"><div className="landing-stat-number">{totalQuestions || 0}</div><div className="landing-stat-label">ข้อสอบทั้งหมด</div></div>
          </div>
        </div>
      </section>

      <section className="landing-steps-section" id="landing-steps">
        <div className="landing-section-header">
          <span className="landing-section-tag">How It Works</span>
          <h2 className="landing-section-title">3 ขั้นตอนง่ายๆ ในการเตรียมพร้อมสอบ</h2>
        </div>
        <div className="landing-steps-grid">
          <div className="landing-step-card"><div className="landing-step-num">01</div><Layers size={24} style={{ marginBottom: '1rem', color: 'var(--accent)' }} /><h3>เลือกวิชา</h3><p>เลือกรายวิชาตามชั้นปีที่คุณต้องการฝึก</p></div>
          <div className="landing-step-card"><div className="landing-step-num">02</div><Target size={24} style={{ marginBottom: '1rem', color: '#f59e0b' }} /><h3>จับเวลา</h3><p>ฝึกทำข้อสอบพร้อมระบบจับเวลานับถอยหลัง</p></div>
          <div className="landing-step-card"><div className="landing-step-num">03</div><FileCheck2 size={24} style={{ marginBottom: '1rem', color: 'var(--success)' }} /><h3>วิเคราะห์</h3><p>ดูเฉลยละเอียดและเรดาร์ชาร์ตวิเคราะห์ทักษะ</p></div>
        </div>
      </section>

      <section className="landing-features-section" id="landing-features">
        <div className="landing-section-header"><h2 className="landing-section-title">ฟีเจอร์เด่น</h2></div>
        <div className="landing-grid">
          {featureList.map((feat, idx) => (
            <BorderGlow key={idx} className="landing-feature-glow-card" borderRadius={20} backgroundColor="var(--surface)" colors={['#0070f3', '#8b5cf6', '#ec4899']}>
              <div className="landing-feature-content">
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text)' }}>{feat.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8875rem', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
              </div>
            </BorderGlow>
          ))}
        </div>
      </section>

      <section className="landing-features-section" id="landing-preview">
        <div className="landing-section-header">
          <span className="landing-section-tag">Curriculum Ready</span>
          <h2 className="landing-section-title">ครอบคลุมทุกหมวดหมู่วิชา</h2>
          <p className="landing-section-desc">
            เลือกระดับชั้นปีที่ต้องการแล้วเริ่มฝึกซ้อมทำข้อสอบได้ทันที
          </p>
        </div>

        {/* Year Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[2, 3].map(year => {
            const yearSubs = subjects.filter(s => s.year === year);
            return (
              <BorderGlow
                key={year}
                className="landing-feature-glow-card"
                borderRadius={20}
                glowRadius={36}
                edgeSensitivity={30}
                glowColor={isDark ? "260 100 70" : "260 90 60"}
                backgroundColor="var(--surface)"
                colors={['#8b5cf6', '#3b82f6', '#06b6d4']}
              >
                <div 
                  className="landing-feature-content"
                  onClick={onStart}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '10px',
                      background: 'rgba(0, 112, 243, 0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
                    }}>
                      <GraduationCap size={22} />
                    </div>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                      borderRadius: '999px', background: 'var(--surface-hover)',
                      boxShadow: 'var(--shadow-border)', color: 'var(--text)'
                    }}>
                      {yearSubs.length} ชุดข้อสอบ
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    รายวิชาชั้นปีที่ {year}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    รวมข้อสอบ Midterm และ Final ของวิชาปีที่ {year} พร้อมเฉลยละเอียดและคำอธิบาย
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.875rem', fontWeight: 600 }}>
                    <span>เข้าสู่ห้องสอบปี {year}</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </BorderGlow>
            );
          })}
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="landing-footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => scrollToSection('top')}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => scrollToSection('landing-steps')}>ขั้นตอนการใช้งาน</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => scrollToSection('landing-features')}>ฟีเจอร์เด่น</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateFaq}>คำถามที่พบบ่อย (FAQ)</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateAbout}>เกี่ยวกับเรา</span>
          <span style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={onStart}>เริ่มทำข้อสอบ</span>
        </div>
        <p style={{ margin: '0 0 0.25rem 0' }}>ExamHub — แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา</p>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>© 2026 ExamHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
