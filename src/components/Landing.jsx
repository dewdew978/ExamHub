import { useMemo } from 'react';
import {
  ArrowRight, Layers, Timer, FileCheck2, Lightbulb, Radar, History as HistoryIcon, Search, Smartphone,
  LibraryBig, CalendarDays, Check, FileText, PlayCircle,
} from 'lucide-react';
import Navbar from './Navbar';
import SubjectIcon from './SubjectIcon';
import StatCount, { statCountStyles } from './StatCount';

// Tutorial video lives in the public "media" bucket of Supabase Storage
const TUTORIAL_VIDEO_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/exetia-tutorial.mp4`;

const FEATURES = [
  { icon: LibraryBig, title: 'คลังข้อสอบครบทุกชั้นปี', desc: 'ข้อสอบ Midterm และ Final แยกตามรายวิชาและชั้นปี ทบทวนได้ตรงจุด' },
  { icon: Lightbulb, title: 'เฉลยละเอียดทุกข้อ', desc: 'ตรวจคำตอบทันทีพร้อมคำอธิบายวิธีคิด รองรับสูตร KaTeX และโค้ด' },
  { icon: Radar, title: 'วิเคราะห์ทักษะ', desc: 'เรดาร์ชาร์ตแสดงความถนัดแต่ละหมวด ช่วยปิดจุดอ่อนได้แม่นยำ' },
  { icon: HistoryIcon, title: 'ประวัติคะแนน', desc: 'บันทึกผลทุกครั้งที่สอบ ดูพัฒนาการย้อนหลังเป็นกราฟ' },
  { icon: Timer, title: 'จำลองห้องสอบจริง', desc: 'จับเวลานับถอยหลัง พักสอบได้ และทำต่อจากข้อเดิม' },
  { icon: Smartphone, title: 'ติดตั้งเป็นแอป', desc: 'รองรับ PWA ใช้งานได้ทั้งคอม แท็บเล็ต และมือถือ' },
];

export default function Landing({ subjects = [], totalQuestions = 0, onStart, onNavigateAbout, onNavigateFaq, onNavigateTerms, onNavigateBlog, user }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = useMemo(() => {
    const map = new Map();
    for (const s of subjects) {
      const c = map.get(s.category) || { name: s.category, color: s.color, sets: 0, questions: 0 };
      c.sets += 1;
      c.questions += s.questionCount || 0;
      map.set(s.category, c);
    }
    return [...map.values()];
  }, [subjects]);

  const preview = subjects.slice(0, 6);

  return (
    <div className="landing-root">
      <style>{`
        .landing-root { min-height: 100vh; background: var(--bg); color: var(--text); overflow-x: hidden; }
        .lp-container { max-width: 1120px; margin: 0 auto; padding: 0 1.5rem; }
        .lp-hero { position: relative; padding: 8.5rem 0 0; text-align: center; }
        .lp-hero::before { content: ''; position: absolute; inset: 0 0 30% 0; pointer-events: none;
          background-image: linear-gradient(var(--border-divider) 1px, transparent 1px), linear-gradient(90deg, var(--border-divider) 1px, transparent 1px);
          background-size: 48px 48px; mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%); -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 75%); }
        .lp-hero::after { content: ''; position: absolute; width: 760px; height: 420px; left: 50%; top: 40px; transform: translateX(-50%); pointer-events: none;
          background: radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 16%, transparent) 0%, transparent 65%); }
        .lp-hero-inner { position: relative; z-index: 1; }
        .lp-pill { display: inline-flex; align-items: center; gap: 0.5rem; height: 30px; padding: 0 0.4rem 0 0.75rem; border-radius: 999px; background: var(--surface); box-shadow: 0 0 0 1px var(--border-color), var(--shadow-xs); font-size: 0.78rem; color: var(--text-muted); border: none; cursor: pointer; margin-bottom: 1.5rem; }
        .lp-pill b { color: var(--accent-text); font-weight: 600; }
        .lp-pill span.arrow { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 999px; background: var(--surface-hover); }
        .lp-title { font-size: clamp(2.25rem, 5.4vw, 3.75rem); font-weight: 600; letter-spacing: -0.035em; line-height: 1.12; max-width: 820px; margin: 0 auto; }
        .lp-title em { font-style: normal; color: var(--accent); }
        .lp-line { display: inline-block; white-space: nowrap; }
        @media (max-width: 520px) { .lp-line { white-space: normal; } }
        .lp-sub { font-size: clamp(1rem, 2vw, 1.125rem); color: var(--text-muted); max-width: 600px; margin: 1.1rem auto 0; line-height: 1.65; }
        .lp-cta { display: flex; gap: 0.6rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
        .lp-cta .btn { height: 42px; padding: 0 1.15rem; font-size: 0.9rem; border-radius: 8px; }
        .lp-stats { display: flex; justify-content: center; gap: 2.5rem; margin-top: 2.25rem; color: var(--text-muted); font-size: 0.8125rem; flex-wrap: wrap; }
        .lp-stats strong { display: block; font-size: 1.35rem; font-weight: 600; color: var(--text); letter-spacing: -0.02em; }

        .lp-frame { position: relative; z-index: 1; margin: 3.5rem auto 0; max-width: 1040px; border-radius: 14px; background: var(--surface); box-shadow: 0 0 0 1px var(--border-color), 0 30px 80px -20px rgba(40, 20, 120, 0.25); overflow: hidden; text-align: left; }
        .lp-frame-bar { height: 36px; display: flex; align-items: center; gap: 6px; padding: 0 12px; border-bottom: 1px solid var(--border-divider); background: var(--bg-subtle); }
        .lp-frame-bar i { width: 10px; height: 10px; border-radius: 50%; background: var(--surface-active); }
        .lp-frame-body { display: grid; grid-template-columns: 200px 1fr; min-height: 380px; }
        .lp-frame-side { background: var(--sidebar-bg); border-right: 1px solid var(--border-color); padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .lp-frame-side .nav-item { pointer-events: none; height: 28px; font-size: 0.75rem; }
        .lp-frame-main { padding: 18px 20px; overflow: hidden; }
        .lp-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 12px; }
        .lp-mini-card { border-radius: 10px; box-shadow: 0 0 0 1px var(--border-color); overflow: hidden; background: var(--surface); }
        .lp-mini-cover { height: 46px; position: relative; }
        .lp-mini-body { padding: 8px 10px 10px; }
        .lp-mini-body b { display: block; font-size: 0.75rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .lp-mini-body span { font-size: 0.66rem; color: var(--text-muted); }

        .lp-section { padding: 6rem 0 0; }
        .lp-eyebrow { font-size: 0.78rem; font-weight: 500; color: var(--accent-text); margin-bottom: 0.6rem; display: inline-flex; align-items: center; gap: 0.4rem; }
        .lp-h2 { font-size: clamp(1.6rem, 3.4vw, 2.25rem); font-weight: 600; letter-spacing: -0.025em; line-height: 1.2; max-width: 640px; }
        .lp-lead { color: var(--text-muted); font-size: 1rem; max-width: 560px; margin-top: 0.6rem; line-height: 1.65; }

        .lp-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; margin-top: 2.25rem; border-radius: 14px; box-shadow: var(--shadow-sm); background: var(--surface); overflow: hidden; }
        .lp-step { padding: 1.5rem 1.4rem; border-left: 1px solid var(--border-divider); }
        .lp-step:first-child { border-left: none; }
        .lp-step-n { font-size: 0.72rem; color: var(--text-subtle); font-variant-numeric: tabular-nums; }
        .lp-step h3 { font-size: 1rem; margin: 0.9rem 0 0.3rem; }
        .lp-step p { font-size: 0.875rem; color: var(--text-muted); line-height: 1.6; }

        .lp-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.9rem; margin-top: 2.25rem; }
        .lp-feature { padding: 1.25rem; border-radius: 12px; background: var(--surface); box-shadow: var(--shadow-sm); }
        .lp-feature h3 { font-size: 0.95rem; margin: 0.85rem 0 0.25rem; }
        .lp-feature p { font-size: 0.84rem; color: var(--text-muted); line-height: 1.6; }

        .lp-cats { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.6rem; margin-top: 2rem; }
        .lp-cat { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 0.9rem; border-radius: 10px; background: var(--surface); box-shadow: var(--shadow-sm); border: none; text-align: left; cursor: pointer; color: inherit; }
        .lp-cat:hover { box-shadow: var(--shadow-md); }
        .lp-cat b { font-size: 0.86rem; font-weight: 500; display: block; }
        .lp-cat span { font-size: 0.75rem; color: var(--text-muted); }

        .lp-video { margin-top: 2rem; border-radius: 14px; overflow: hidden; box-shadow: var(--shadow-md); background: #111; }
        .lp-video video { width: 100%; aspect-ratio: 16 / 9; display: block; }
        .lp-video-cap { font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.75rem; display: flex; align-items: center; gap: 0.4rem; }

        .lp-band { margin: 6rem auto 5rem; border-radius: 18px; padding: 3.25rem 2rem; text-align: center; position: relative; overflow: hidden;
          background: var(--sidebar-bg); box-shadow: inset 0 0 0 1px var(--border-color); }
        .lp-band::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 120%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 70%); pointer-events: none; }
        .lp-band > * { position: relative; }

        @media (max-width: 900px) {
          .lp-frame-body { grid-template-columns: 1fr; }
          .lp-frame-side { display: none; }
          .lp-mini-grid { grid-template-columns: repeat(2, 1fr); }
          .lp-steps { grid-template-columns: 1fr; }
          .lp-step { border-left: none; border-top: 1px solid var(--border-divider); }
          .lp-step:first-child { border-top: none; }
          .lp-features { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 560px) {
          .lp-features { grid-template-columns: 1fr; }
          .lp-hero { padding-top: 6.5rem; }
          .lp-stats { gap: 1.5rem; }
        }
        ${statCountStyles}
      `}</style>

      <Navbar
        user={user}
        onBrand={() => scrollToSection('top')}
        onStart={onStart}
        onStartGuest={onStart}
        showLogin={false}
        links={[
          { label: 'หน้าแรก', onClick: () => scrollToSection('top'), active: true },
          { label: 'คลังข้อสอบ', onClick: onStart },
          { label: 'ข่าวสาร & อัปเดต', onClick: onNavigateBlog },
          { label: 'คำถามที่พบบ่อย', onClick: onNavigateFaq },
          { label: 'เกี่ยวกับเรา', onClick: onNavigateAbout },
        ]}
      />

      <main id="main-content">
        <section className="lp-hero" id="top">
          <div className="lp-container lp-hero-inner">
            <button type="button" className="lp-pill" onClick={onNavigateBlog}>
              <b>ใหม่</b> อัปเดตคลังข้อสอบ & เฉลยละเอียด <span className="arrow"><ArrowRight size={12} /></span>
            </button>
            <h1 className="lp-title"><span className="lp-line">ฝึกทำข้อสอบทุกวิชาในที่เดียว</span> <em className="lp-line">ยกระดับคะแนนสู่เกรด A</em></h1>
            <p className="lp-sub">คลังข้อสอบ Data Science, Machine Learning, AWS Cloud, ISD และ MIS พร้อมเฉลยละเอียดทุกข้อ ติดตามพัฒนาการได้ในที่เดียว</p>
            <div className="lp-cta">
              <button type="button" className="btn btn-primary" onClick={onStart}>เริ่มฝึกทำข้อสอบ <ArrowRight size={15} /></button>
              <button type="button" className="btn" onClick={() => scrollToSection('landing-steps')}><PlayCircle size={15} /> ดูวิธีใช้งาน</button>
            </div>
            <div className="lp-stats" id="landing-stats">
              <div><strong><StatCount value={subjects.length || 0} delay={0.3} /></strong>ชุดข้อสอบ</div>
              <div><strong><StatCount value={totalQuestions || 0} delay={0.45} /></strong>ข้อสอบพร้อมเฉลย</div>
              <div><strong><StatCount value={categories.length || 0} delay={0.6} /></strong>หมวดวิชา</div>
            </div>

            <div className="lp-frame" aria-hidden="true">
              <div className="lp-frame-bar"><i /><i /><i /></div>
              <div className="lp-frame-body">
                <div className="lp-frame-side">
                  <div className="nav-item active"><LibraryBig size={14} /><span className="nav-label">คลังข้อสอบ</span></div>
                  <div className="nav-item"><CalendarDays size={14} /><span className="nav-label">ตารางสอบ</span></div>
                  <div className="nav-item"><HistoryIcon size={14} /><span className="nav-label">ประวัติคะแนน</span></div>
                  <div className="nav-item"><Radar size={14} /><span className="nav-label">ทักษะ</span></div>
                </div>
                <div className="lp-frame-main">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>คลังข้อสอบ</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>เลือกชุดข้อสอบที่ต้องการฝึก</div>
                    </div>
                    <div className="input" style={{ width: 180, height: 28, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', color: 'var(--text-subtle)' }}><Search size={12} /> ค้นหาชุดข้อสอบ…</div>
                  </div>
                  <div className="lp-mini-grid">
                    {(preview.length ? preview : Array.from({ length: 6 }, (_, i) => ({ id: i, name: 'ชุดข้อสอบ', category: '', questionCount: 20 }))).map(s => (
                      <div key={s.id} className="lp-mini-card">
                        <div className="lp-mini-cover" style={{ background: `color-mix(in srgb, ${s.color || '#6b47f5'} 12%, var(--surface))` }}>
                          <span className="tile" style={{ position: 'absolute', left: 8, bottom: 6, width: 22, height: 22, background: 'var(--surface)' }}>
                            <SubjectIcon category={s.category} size={12} color={s.color || 'var(--accent)'} />
                          </span>
                        </div>
                        <div className="lp-mini-body"><b>{s.name}</b><span>{s.questionCount} ข้อ{s.type ? ` · ${s.type}` : ''}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section" id="landing-steps">
          <div className="lp-container">
            <div className="lp-eyebrow"><Layers size={14} /> วิธีใช้งาน</div>
            <h2 className="lp-h2">3 ขั้นตอนง่ายๆ ในการเตรียมพร้อมสอบ</h2>
            <div className="lp-steps">
              {[
                { icon: Layers, title: 'เลือกวิชา', desc: 'เลือกรายวิชาตามชั้นปีหรือค้นหาชุดข้อสอบที่ต้องการฝึก' },
                { icon: Timer, title: 'ทำข้อสอบ', desc: 'ฝึกพร้อมระบบจับเวลา ติดดาวข้อที่ไม่มั่นใจ และพักสอบได้' },
                { icon: FileCheck2, title: 'ทบทวน', desc: 'ดูเฉลยละเอียด กรองเฉพาะข้อที่ผิด และติดตามทักษะของคุณ' },
              ].map((step, i) => (
                <div key={step.title} className="lp-step">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="tile tile-accent"><step.icon size={16} /></span>
                    <span className="lp-step-n">0{i + 1}</span>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
            <figure style={{ marginTop: 0 }}>
              <div className="lp-video">
                {/* preload="none": the video downloads only when the visitor presses play */}
                <video controls preload="none" playsInline poster="/exetia-tutorial-poster.jpg" src={TUTORIAL_VIDEO_URL} aria-label="วิดีโอสอนใช้งาน EXETIA" />
              </div>
              <figcaption className="lp-video-cap"><PlayCircle size={14} /> วิดีโอสอนใช้งาน · 1:53 นาที · เลือกวิชา ทำข้อสอบ ดูเฉลย สมัครสมาชิก และแจ้งข้อสอบผิด</figcaption>
            </figure>
          </div>
        </section>

        <section className="lp-section" id="landing-features">
          <div className="lp-container">
            <div className="lp-eyebrow"><Check size={14} /> ฟีเจอร์เด่น</div>
            <h2 className="lp-h2">ทุกอย่างที่ต้องใช้ก่อนลงสนามสอบจริง</h2>
            <div className="lp-features">
              {FEATURES.map(f => (
                <div key={f.title} className="lp-feature">
                  <span className="tile"><f.icon size={16} /></span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {categories.length > 0 && (
          <section className="lp-section" id="landing-preview">
            <div className="lp-container">
              <div className="lp-eyebrow"><FileText size={14} /> หมวดวิชา</div>
              <h2 className="lp-h2">ครอบคลุมทุกหมวดหมู่วิชา</h2>
              <p className="lp-lead">เลือกหมวดที่ต้องการแล้วเริ่มฝึกซ้อมได้ทันที ไม่ต้องสมัครสมาชิกก็ใช้งานได้</p>
              <div className="lp-cats">
                {categories.map(c => (
                  <button key={c.name} type="button" className="lp-cat" onClick={onStart}>
                    <span className="tile" style={{ background: `color-mix(in srgb, ${c.color || '#6b47f5'} 12%, var(--surface))`, boxShadow: 'none' }}>
                      <SubjectIcon category={c.name} size={16} color={c.color || 'var(--accent)'} />
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <b>{c.name}</b>
                      <span>{c.sets} ชุด · {c.questions.toLocaleString()} ข้อ</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="lp-container">
          <div className="lp-band">
            <h2 className="lp-h2" style={{ margin: '0 auto' }}>พร้อมเริ่มฝึกแล้วหรือยัง?</h2>
            <p className="lp-lead" style={{ margin: '0.6rem auto 0' }}>ฟรี ไม่ต้องติดตั้ง เปิดเว็บแล้วเริ่มทำข้อสอบได้เลย</p>
            <div className="lp-cta"><button type="button" className="btn btn-primary" onClick={onStart}>เข้าคลังข้อสอบ <ArrowRight size={15} /></button></div>
          </div>
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div style={{ maxWidth: 320 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>
              <span className="workspace-logo" style={{ width: 22, height: 22, borderRadius: 6 }}><LibraryBig size={12} /></span> EXETIA
            </div>
            <p>แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา</p>
            <p style={{ marginTop: 6 }}>
              พัฒนาโดย <a href="https://dewdew978.github.io/portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}>ปวริศ ปัญสิงห์ (Pawarit Pansing - ดิว)</a>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <h4>ผลิตภัณฑ์</h4>
              <button type="button" onClick={onStart}>คลังข้อสอบ</button>
              <button type="button" onClick={() => scrollToSection('landing-steps')}>ขั้นตอนการใช้งาน</button>
              <button type="button" onClick={() => scrollToSection('landing-features')}>ฟีเจอร์เด่น</button>
            </div>
            <div>
              <h4>ข้อมูล</h4>
              <button type="button" onClick={onNavigateBlog}>ข่าวสาร & อัปเดต</button>
              <button type="button" onClick={onNavigateFaq}>คำถามที่พบบ่อย</button>
              <button type="button" onClick={onNavigateAbout}>เกี่ยวกับเรา</button>
              <button type="button" onClick={onNavigateTerms}>ข้อกำหนด & ความเป็นส่วนตัว</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border-divider)', padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          © {new Date().getFullYear()} EXETIA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
