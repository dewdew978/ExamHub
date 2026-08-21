import { useState, useEffect } from 'react';
import { Target, Lightbulb, Zap, ArrowRight, Heart, Users } from 'lucide-react';
import Aurora from './Aurora';
import Navbar from './Navbar';

export default function AboutUs({ onStart, onLogin, onHome, onNavigateFaq, user }) {
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

  const values = [
    {
      icon: <Target size={28} color="#0070f3" />,
      iconBg: 'rgba(0, 112, 243, 0.12)',
      title: 'ความแม่นยำตรงหลักสูตร',
      desc: 'รวบรวมข้อสอบที่ครอบคลุมเนื้อหาทั้ง Midterm และ Final อย่างเป็นระบบ เพื่อให้การเตรียมตัวสอบมีทิศทางที่ชัดเจน'
    },
    {
      icon: <Lightbulb size={28} color="#f59e0b" />,
      iconBg: 'rgba(245, 158, 11, 0.12)',
      title: 'เฉลยละเอียด เข้าใจง่าย',
      desc: 'ไม่ใช่แค่บอกข้อถูก แต่เราอธิบายวิธีคิด step-by-step พร้อมสูตรคณิตศาสตร์และบล็อกโค้ดเพื่อความเข้าใจที่แท้จริง'
    },
    {
      icon: <Zap size={28} color="#10b981" />,
      iconBg: 'rgba(16, 185, 129, 0.12)',
      title: 'ระบบวิเคราะห์ผลการเรียนรู้',
      desc: 'ติดตามคะแนนและแสดงเรดาร์ชาร์ตทักษะ ให้คุณเห็นจุดแข็งและจุดที่ต้องพัฒนาเพิ่มเติมได้อย่างแม่นยำ'
    },
    {
      icon: <Users size={28} color="#8b5cf6" />,
      iconBg: 'rgba(139, 92, 246, 0.12)',
      title: 'สร้างสรรค์เพื่อคอมมูนิตี้',
      desc: 'สนับสนุนการมีส่วนร่วมของนักศึกษาผ่านระบบรายงานข้อสอบผิดพลาด เพื่อร่วมกันพัฒนาคลังข้อสอบให้สมบูรณ์ยิ่งขึ้น'
    }
  ];

  return (
    <div className="about-page-root animate-fade-in">
      <style>{`
        .about-page-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          color: var(--text);
        }

        /* 2. Hero Section */
        .about-hero {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8.5rem 1.5rem 4.5rem;
          overflow: hidden;
          text-align: center;
        }
        .about-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          background: var(--surface-hover);
          box-shadow: var(--shadow-border);
          font-size: 0.84rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 1.5rem;
          cursor: default;
          backdrop-filter: blur(12px);
        }
        .about-title {
          font-size: clamp(2.2rem, 5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -1.75px;
          line-height: 1.15;
          margin: 0 0 1.25rem 0;
          color: var(--text);
          text-wrap: balance;
        }
        .about-title-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
        }
        .about-subtitle {
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: var(--text-muted);
          max-width: 680px;
          line-height: 1.7;
          margin: 0 0 2rem 0;
          text-wrap: balance;
        }

        /* 3. Mission & Vision Grid */
        .about-section {
          padding: 4rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
          width: 100%;
        }
        .about-section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .about-section-tag {
          color: var(--accent);
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          display: inline-block;
        }
        .about-section-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin: 0 0 0.75rem 0;
        }
        .about-section-desc {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 580px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .about-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
          margin-bottom: 4rem;
        }
        .about-card-large {
          padding: 2.25rem;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }
        .about-card-large h3 {
          font-size: 1.4rem;
          font-weight: 800;
          margin: 1rem 0 0.75rem 0;
          letter-spacing: -0.5px;
        }
        .about-card-large p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        .about-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .about-card-val {
          padding: 1.75rem;
          border-radius: 16px;
          background: var(--surface);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .about-card-val:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        .about-card-val-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .about-card-val h4 {
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.3px;
        }
        .about-card-val p {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        /* 4. Bottom CTA */
        .about-bottom-cta {
          margin: 3rem 1.5rem 5rem;
          max-width: 1000px;
          align-self: center;
          width: calc(100% - 3rem);
          border-radius: 24px;
          padding: 4rem 2rem;
          background: linear-gradient(135deg, rgba(0, 112, 243, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
          border: 1px solid var(--border-color);
          text-align: center;
        }
        .about-bottom-cta h2 {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          margin: 0 0 0.75rem 0;
        }
        .about-bottom-cta p {
          color: var(--text-muted);
          font-size: 1.05rem;
          max-width: 580px;
          margin: 0 auto 2rem auto;
        }

        /* 5. Footer */
        .about-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-divider);
          padding: 2rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        @media (max-width: 820px) {
          .about-hero { padding: 5.5rem 1rem 3rem; }
          .about-title { letter-spacing: -1px; font-size: clamp(1.85rem, 6.5vw, 2.75rem); }
          .about-subtitle { font-size: clamp(0.925rem, 3.5vw, 1.1rem); }
          .about-grid-2, .about-grid-4 { grid-template-columns: 1fr; gap: 1rem; }
          .about-section { padding: 3rem 1rem; }
          .about-bottom-cta { margin: 2rem 1rem 3rem; width: calc(100% - 2rem); padding: 2.5rem 1.25rem; }
          .about-bottom-cta h2 { font-size: 1.75rem; }
        }
        @media (max-width: 480px) {
          .about-hero { padding: 4.75rem 0.75rem 2.5rem; }
          .about-badge { padding: 0.35rem 0.85rem; font-size: 0.75rem; }
          .about-bottom-cta { padding: 2rem 1rem; }
          .about-bottom-cta h2 { font-size: 1.45rem; }
        }
      `}</style>

      <Navbar
        user={user}
        onBrand={onHome}
        onStart={onStart}
        onLogin={onLogin}
        onStartGuest={onStart}
        links={[
          { label: 'หน้าแรก', onClick: onHome },
          { label: 'คลังข้อสอบ', onClick: onStart },
          { label: 'คำถามที่พบบ่อย', onClick: onNavigateFaq },
          { label: 'เกี่ยวกับเรา', active: true },
        ]}
      />

      {/* 2. Hero Section */}
      <section className="about-hero">
        <Aurora
          colorStops={isDark ? ["#7cff67", "#B497CF", "#5227FF"] : ["#0070f3", "#a855f7", "#ec4899"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.6}
        />

        <div className="about-hero-inner">
          <div className="about-badge">
            <Heart size={15} color="var(--accent)" />
            <span>ABOUT EXAMHUB · เกี่ยวกับเรา</span>
          </div>

          <h1 className="about-title">
            ยกระดับการเตรียมสอบ
            <br />
            <span className="about-title-gradient">เพื่อความสำเร็จของนักศึกษาทุกคน</span>
          </h1>

          <p className="about-subtitle">
            ExamHub ก่อตั้งขึ้นด้วยเป้าหมายเพื่อเป็นแพลตฟอร์มคลังข้อสอบที่เข้าถึงง่าย รวดเร็ว และแม่นยำที่สุด พร้อมคำอธิบายและเฉลยละเอียด step-by-step ช่วยให้นักศึกษาเข้าใจบทเรียนและทำคะแนนได้ดียิ่งขึ้น
          </p>
        </div>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="about-section">
        <div className="about-grid-2">
          <div className="about-card-large">
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(0, 112, 243, 0.12)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--accent)'
            }}>
              <Target size={26} />
            </div>
            <h3>พันธกิจของเรา (Our Mission)</h3>
            <p>
              รวบรวม คัดสรร และจัดระเบียบข้อสอบจริงทั้ง Midterm และ Final ในแต่ละหมวดหมู่วิชา พร้อมจัดทำเฉลยอย่างละเอียดและถูกต้อง เพื่อให้นักศึกษาได้ฝึกฝนทักษะอย่างตรงจุดและมีประสิทธิภาพสูงสุด
            </p>
          </div>

          <div className="about-card-large">
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.12)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#8b5cf6'
            }}>
              <Lightbulb size={26} />
            </div>
            <h3>วิสัยทัศน์ของเรา (Our Vision)</h3>
            <p>
              สร้างสรรค์พื้นที่แห่งการเรียนรู้ที่ไร้พรมแดน ผสมผสานระบบทดสอบอัจฉริยะ การวิเคราะห์จุดอ่อน-จุดแข็ง และคอมมูนิตี้ที่ร่วมกันแบ่งปันความรู้ เพื่อยกระดับผลการเรียนรู้ของทุกคน
            </p>
          </div>
        </div>

        <div className="about-section-header">
          <span className="about-section-tag">Core Values</span>
          <h2 className="about-section-title">คุณค่าหลักที่เรายึดมั่น</h2>
          <p className="about-section-desc">
            สิ่งที่ทำให้ ExamHub เป็นเครื่องมือเตรียมสอบที่ตอบโจทย์และได้รับความไว้วางใจ
          </p>
        </div>

        <div className="about-grid-4">
          {values.map((v, i) => (
            <div key={i} className="about-card-val">
              <div className="about-card-val-icon" style={{ background: v.iconBg }}>
                {v.icon}
              </div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <div className="about-bottom-cta">
        <h2>พร้อมเริ่มต้นฝึกทำข้อสอบแล้วหรือยัง?</h2>
        <p>เข้าสู่คลังข้อสอบแล้วเริ่มฝึกซ้อมได้ทันที พัฒนาความรู้และยกระดับเกรดของคุณไปด้วยกัน</p>
        <button className="btn btn-primary about-nav-btn" onClick={onStart} style={{ margin: '0 auto', height: '46px', fontSize: '0.95rem', padding: '0 1.75rem' }}>
          <span>เข้าสู่คลังข้อสอบทันที</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* 5. Footer */}
      <footer className="about-footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onHome}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateFaq}>คำถามที่พบบ่อย (FAQ)</span>
          <span style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={onStart}>เริ่มทำข้อสอบ</span>
        </div>
        <p style={{ margin: '0 0 0.5rem 0' }}>ExamHub — แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา</p>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>© 2026 ExamHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
