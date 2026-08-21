import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  Send, 
  MessageSquare, 
  Lightbulb, 
  Bug, 
  Search,
  BookOpen
} from 'lucide-react';
import Aurora from './Aurora';
import BorderGlow from './BorderGlow';
import { supabase } from '../lib/supabase';
import Navbar from './Navbar';

const FAQ_DATA = [
  {
    category: 'general',
    categoryName: 'ทั่วไป & การใช้งาน',
    items: [
      {
        q: "ExamHub คืออะไร และใช้งานฟรีหรือไม่?",
        a: "ExamHub คือแพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา ที่รวบรวมข้อสอบทั้ง Midterm และ Final ตรงตามหลักสูตรมหาวิทยาลัย ใช้งานได้ฟรี ทุกคนสามารถฝึกทำข้อสอบและดูเฉลยละเอียดได้ทันที"
      },
      {
        q: "ต้องสมัครสมาชิกก่อนทำข้อสอบหรือไม่?",
        a: "คุณสามารถทดลองทำข้อสอบบางชุดได้โดยไม่ต้องเข้าสู่ระบบ แต่หากสมัครสมาชิกและเข้าสู่ระบบ (Sign in) คุณจะสามารถบันทึกประวัติคะแนน ดูเรดาร์ชาร์ตวิเคราะห์ทักษะ ติดดาวข้อสอบ และใช้งานได้ครบทุกวิชา"
      },
      {
        q: "ระบบจับเวลาและการคิดคะแนนทำงานอย่างไร?",
        a: "ระบบจะกำหนดเวลาเฉลี่ยข้อละ 1 นาที (สามารถเลือกเปิด/ปิดตัวจับเวลาได้ในการตั้งค่า) เมื่อทำเสร็จและกดส่ง ระบบจะตรวจคำตอบและคิดคะแนนแบบเรียลไทม์ พร้อมบันทึกสถิติเพื่อนำไปวิเคราะห์จุดแข็ง-จุดอ่อน"
      }
    ]
  },
  {
    category: 'exams',
    categoryName: 'คลังข้อสอบ & หลักสูตร',
    items: [
      {
        q: "มีข้อสอบวิชาอะไรบ้าง และครอบคลุมชั้นปีไหนบ้าง?",
        a: "ปัจจุบันมีข้อสอบครอบคลุมวิชาสำคัญในหลักสูตร เช่น Intelligent System Development (ISD), Applied Machine Learning, Cloud Technology Infrastructure (AWS), Data Warehousing (DW), Deep Learning in Medical Image, MIS และ Data Visualization ทั้งระดับชั้นปีที่ 2 และชั้นปีที่ 3"
      },
      {
        q: "มีเฉลยและวิธีคิดละเอียดทุกข้อหรือไม่?",
        a: "มีเฉลยละเอียดแบบ Step-by-Step ทุกข้อ พร้อมทั้งรองรับการแสดงผลสูตรคณิตศาสตร์ KaTeX และบล็อกคำสั่งโค้ด (Code Blocks) เพื่อให้เข้าใจหลักการคิดได้อย่างถ่องแท้"
      },
      {
        q: "สามารถกลับมาแก้ไขคำตอบก่อนส่งได้หรือไม่?",
        a: "ได้แน่นอน ในระหว่างทำข้อสอบจะมีแถบเมนู Question Navigator ให้คุณคลิกข้ามไปยังข้อต่างๆ รวมถึงมีปุ่มติดดาว (Bookmark) ข้อที่ยังไม่มั่นใจเพื่อย้อนกลับมาทบทวนก่อนกดส่งข้อสอบ"
      }
    ]
  },
  {
    category: 'account',
    categoryName: 'บัญชี & การแจ้งปัญหา',
    items: [
      {
        q: "หากพบข้อสอบที่มีเฉลยผิดพลาด สามารถแจ้งได้อย่างไร?",
        a: "ในหน้าทำข้อสอบและหน้าเฉลย จะมีปุ่ม 'รายงานปัญหา / ข้อสอบผิด' ให้คุณสามารถกดส่งข้อสงสัยหรือข้อผิดพลาดได้ทันที ทีมงานจะได้รับแจ้งเตือนและดำเนินการตรวจสอบแก้ไขอย่างรวดเร็ว"
      },
      {
        q: "เรดาร์ชาร์ตวิเคราะห์ทักษะ (Skill Assessment) คำนวณจากอะไร?",
        a: "ระบบจะนำคะแนนจากการทำข้อสอบในแต่ละหมวดหมู่วิชามาคำนวณเป็นเปอร์เซ็นต์ความเชี่ยวชาญ และวาดเป็นกราฟเรดาร์ชาร์ต เพื่อช่วยให้คุณเห็นภาพรวมว่าวิชาใดมีความถนัดสูง และวิชาใดที่ควรทบทวนเพิ่มเติม"
      },
      {
        q: "สามารถเปลี่ยนชื่อเล่น หรือไอคอนประจำตัว (Avatar) ได้ที่ไหน?",
        a: "เมื่อเข้าสู่ระบบแล้ว สามารถคลิกที่เมนูโปรไฟล์มุมขวาบน > เลือก 'ข้อมูลส่วนตัว & ตั้งค่า' เพื่อเปลี่ยนชื่อเล่น เลือกไอคอน Avatar หรือเปลี่ยนรหัสผ่านได้ตลอดเวลา"
      }
    ]
  }
];

const NEED_TYPES = [
  { id: 'request_exam', label: 'ขอเพิ่มวิชา / ข้อสอบใหม่', icon: BookOpen, color: 'var(--accent)' },
  { id: 'suggest_feature', label: 'เสนอแนะฟีเจอร์ใหม่', icon: Lightbulb, color: '#f59e0b' },
  { id: 'report_bug', label: 'แจ้งปัญหาการใช้งาน / บั๊ก', icon: Bug, color: 'var(--error)' },
  { id: 'general_feedback', label: 'ข้อเสนอแนะทั่วไป / อื่นๆ', icon: MessageSquare, color: 'var(--success)' }
];

export default function FAQ({ onHome, onNavigateLanding, onNavigateAbout, onLogin, user }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // FAQ Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState({});

  // Needs Form State
  const [needType, setNeedType] = useState('request_exam');
  const [name, setName] = useState(user?.user_metadata?.nickname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subjectTitle, setSubjectTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggleItem = (catIdx, itemIdx) => {
    const key = `${catIdx}_${itemIdx}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNeedsSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setFormError('กรุณากรอกรายละเอียดความต้องการของคุณ');
      return;
    }

    setSubmitting(true);
    setFormError('');

    const payload = {
      id: 'need_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      issue_type: needType,
      subject_name: subjectTitle.trim() || 'ความต้องการของผู้เรียน (Needs & Feedback)',
      description: `[${NEED_TYPES.find(t => t.id === needType)?.label}] ${subjectTitle.trim() ? `หัวข้อ: ${subjectTitle.trim()}\n` : ''}${message.trim()}`,
      contact_email: email.trim() || null,
      user_id: user?.id || null,
      created_at: new Date().toISOString(),
      status: 'pending'
    };

    try {
      // 1. Try Supabase reports table
      try {
        const { error: dbError } = await supabase
          .from('reports')
          .insert([payload]);
        if (dbError) console.warn("Supabase feedback notice:", dbError.message);
      } catch (err) {
        console.warn("Supabase insert error (fallback locally):", err);
      }

      // 2. Save locally
      try {
        const existing = JSON.parse(localStorage.getItem('examhub_user_needs') || '[]');
        localStorage.setItem('examhub_user_needs', JSON.stringify([payload, ...existing]));
      } catch (e) {
        console.warn(e);
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setFormError('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter FAQs based on category & search query
  const filteredFaqs = FAQ_DATA.filter(cat => {
    if (activeCategory !== 'all' && cat.category !== activeCategory) return false;
    return true;
  }).map(cat => {
    const qLower = searchQuery.toLowerCase().trim();
    if (!qLower) return cat;
    const matchedItems = cat.items.filter(item => 
      item.q.toLowerCase().includes(qLower) || 
      item.a.toLowerCase().includes(qLower)
    );
    return { ...cat, items: matchedItems };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="faq-page-root animate-fade-in">
      <style>{`
        .faq-page-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        /* Hero Section */
        .faq-hero {
          position: relative;
          min-height: 52vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8.5rem 1.5rem 3.5rem;
          overflow: hidden;
          text-align: center;
        }
        .faq-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .faq-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.15rem;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid var(--border-color);
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }
        .faq-title {
          font-size: clamp(2.2rem, 5.5vw, 3.6rem);
          font-weight: 800;
          letter-spacing: -1.8px;
          line-height: 1.15;
          margin: 0 0 1.25rem 0;
          color: var(--text);
        }
        .faq-title-gradient {
          background: linear-gradient(135deg, var(--accent) 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .faq-subtitle {
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: var(--text-muted);
          max-width: 620px;
          line-height: 1.65;
          margin: 0 0 2rem 0;
        }

        /* Search & Filter Bar */
        .faq-search-wrapper {
          width: 100%;
          max-width: 580px;
          position: relative;
          margin-bottom: 1.5rem;
        }
        .faq-search-input {
          width: 100%;
          height: 48px;
          padding: 0 1.25rem 0 3rem;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text);
          font-size: 0.95rem;
          box-shadow: var(--shadow-sm);
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .faq-search-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.15);
        }
        .faq-search-icon {
          position: absolute;
          left: 1.15rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }

        /* Filter Chips */
        .faq-chips-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }
        .faq-chip {
          padding: 0.45rem 1.1rem;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text-muted);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .faq-chip:hover {
          color: var(--text);
          border-color: var(--accent);
        }
        .faq-chip.active {
          background: var(--accent);
          color: #ffffff;
          border-color: var(--accent);
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0, 112, 243, 0.3);
        }

        /* FAQ Content Container */
        .faq-container {
          max-width: 860px;
          margin: 0 auto 5rem;
          padding: 0 1.5rem;
          width: 100%;
        }
        .faq-category-block {
          margin-bottom: 2.75rem;
        }
        .faq-category-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
          letter-spacing: -0.3px;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text);
        }
        .faq-item-card {
          border: 1px solid var(--border-color);
          border-radius: 16px;
          margin-bottom: 0.875rem;
          background: var(--surface);
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .faq-item-card.open {
          border-color: var(--accent);
          box-shadow: 0 4px 18px rgba(0,0,0,0.04);
        }
        .faq-item-head {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 1.02rem;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
          color: var(--text);
          gap: 1rem;
        }
        .faq-item-body {
          padding: 0 1.5rem 1.35rem 1.5rem;
          color: var(--text-muted);
          font-size: 0.925rem;
          line-height: 1.7;
        }

        /* "Tell Us About Your Needs" Section */
        .needs-section {
          padding: 5rem 1.5rem 6rem;
          background: var(--surface-hover);
          border-top: 1px solid var(--border-divider);
          position: relative;
        }
        .needs-inner {
          max-width: 820px;
          margin: 0 auto;
        }
        .needs-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .needs-form-card {
          background: var(--surface);
          border-radius: 24px;
          padding: 2.5rem 2.25rem;
          box-shadow: 0 18px 45px rgba(0,0,0,0.06);
        }
        .needs-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .needs-type-btn {
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text);
          transition: all 0.2s ease;
          font-family: inherit;
          text-align: left;
        }
        .needs-type-btn:hover {
          border-color: var(--accent);
          background: var(--surface-hover);
        }
        .needs-type-btn.active {
          border-color: var(--accent);
          background: rgba(0, 112, 243, 0.08);
          color: var(--accent);
        }
        .needs-input-group {
          margin-bottom: 1.25rem;
        }
        .needs-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text);
        }
        .needs-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text);
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .needs-input:focus {
          border-color: var(--accent);
        }
        .needs-textarea {
          width: 100%;
          padding: 0.85rem 1rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text);
          font-size: 0.9rem;
          font-family: inherit;
          min-height: 120px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .needs-textarea:focus {
          border-color: var(--accent);
        }

        /* Footer */
        .faq-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-divider);
          padding: 2.5rem 1.5rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        @media (max-width: 820px) {
          .faq-hero { padding: 5.5rem 1rem 2.5rem; }
          .faq-title { font-size: clamp(1.85rem, 6.5vw, 2.75rem); letter-spacing: -1px; }
          .needs-form-card { padding: 1.5rem 1.25rem; }
          .needs-type-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .faq-hero { padding: 4.75rem 0.75rem 2rem; }
        }
      `}</style>

      <Navbar
        user={user}
        onBrand={onNavigateLanding ?? onHome}
        onStart={onHome}
        onLogin={onLogin}
        onStartGuest={onHome}
        links={[
          { label: 'หน้าแรก', onClick: onNavigateLanding ?? onHome },
          { label: 'คำถามที่พบบ่อย', onClick: () => scrollToSection('faq-list'), active: true },
          { label: 'Tell Us Your Needs', onClick: () => scrollToSection('tell-us-needs') },
          { label: 'เกี่ยวกับเรา', onClick: onNavigateAbout },
        ]}
      />

      {/* 2. Hero Section */}
      <section className="faq-hero">
        <Aurora 
          colorStops={isDark ? ["#7cff67", "#B497CF", "#5227FF"] : ["#0070f3", "#a855f7", "#ec4899"]} 
          blend={0.5} 
          amplitude={1.0} 
          speed={0.6} 
        />
        <div className="faq-hero-inner">
          <div className="faq-badge">
            <HelpCircle size={15} color="var(--accent)" />
            <span>Help Center & FAQ</span>
          </div>

          <h1 className="faq-title">
            ศูนย์ช่วยเหลือ & <span className="faq-title-gradient">คำถามที่พบบ่อย</span>
          </h1>
          <p className="faq-subtitle">
            รวบรวมคำตอบทุกข้อสงสัยเกี่ยวกับการฝึกทำข้อสอบ ระบบคะแนน และการใช้งาน ExamHub พร้อมเปิดรับทุกข้อเสนอแนะ
          </p>

          {/* Search Box */}
          <div className="faq-search-wrapper">
            <Search size={18} className="faq-search-icon" />
            <input
              type="text"
              className="faq-search-input"
              placeholder="ค้นหาคำถาม หรือข้อสงสัย (เช่น สมัครสมาชิก, คะแนน, ข้อสอบผิด)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Chips */}
          <div className="faq-chips-row">
            <button 
              className={`faq-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              ทั้งหมด (All)
            </button>
            <button 
              className={`faq-chip ${activeCategory === 'general' ? 'active' : ''}`}
              onClick={() => setActiveCategory('general')}
            >
              ทั่วไป & การใช้งาน
            </button>
            <button 
              className={`faq-chip ${activeCategory === 'exams' ? 'active' : ''}`}
              onClick={() => setActiveCategory('exams')}
            >
              คลังข้อสอบ & หลักสูตร
            </button>
            <button 
              className={`faq-chip ${activeCategory === 'account' ? 'active' : ''}`}
              onClick={() => setActiveCategory('account')}
            >
              บัญชี & การแจ้งปัญหา
            </button>
          </div>
        </div>
      </section>

      {/* 3. FAQ Questions List */}
      <section className="faq-container" id="faq-list">
        {filteredFaqs.length === 0 ? (
          <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', borderRadius: '16px' }}>
            <HelpCircle size={40} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>ไม่พบคำถามที่ตรงกับการค้นหา</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              ลองเปลี่ยนคำค้นหา หรือส่งคำถามโดยตรงถึงเราที่ส่วนด้านล่าง
            </p>
            <button className="btn btn-outline" onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>
              ล้างการค้นหา
            </button>
          </div>
        ) : (
          filteredFaqs.map((cat, catIdx) => (
            <div key={cat.category} className="faq-category-block">
              <h2 className="faq-category-title">
                <Sparkles size={18} color="var(--accent)" />
                <span>{cat.categoryName}</span>
              </h2>

              <div>
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}_${itemIdx}`;
                  const isOpen = !!openItems[key];
                  return (
                    <div key={itemIdx} className={`faq-item-card ${isOpen ? 'open' : ''}`}>
                      <div 
                        className="faq-item-head"
                        onClick={() => toggleItem(catIdx, itemIdx)}
                      >
                        <span>{item.q}</span>
                        <ChevronDown 
                          size={18} 
                          style={{ 
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', 
                            transition: 'transform 0.2s ease',
                            flexShrink: 0,
                            color: isOpen ? 'var(--accent)' : 'var(--text-muted)'
                          }} 
                        />
                      </div>
                      {isOpen && (
                        <div className="faq-item-body animate-fade-in">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 4. "Tell Us About Your Needs" Contact & Inquiry Section */}
      <section className="needs-section" id="tell-us-needs">
        <div className="needs-inner">
          <div className="needs-header">
            <span style={{ 
              color: 'var(--accent)', fontSize: '0.8125rem', fontWeight: 700, 
              textTransform: 'uppercase', letterSpacing: '1.2px', display: 'inline-block', marginBottom: '0.5rem' 
            }}>
              Voice of Learner
            </span>
            <h2 style={{ fontSize: 'clamp(1.85rem, 5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 0.75rem 0' }}>
              Tell Us About Your Needs
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
              บอกสิ่งที่คุณอยากให้ ExamHub พัฒนาเพิ่มเติม ไม่ว่าจะเป็นรายวิชาใหม่ ฟีเจอร์ที่ต้องการ หรือข้อเสนอแนะในการใช้งาน
            </p>
          </div>

          <BorderGlow
            borderRadius={24}
            glowRadius={40}
            edgeSensitivity={30}
            glowColor={isDark ? "210 100 70" : "210 90 60"}
            backgroundColor="var(--surface)"
            colors={['#0070f3', '#8b5cf6', '#ec4899']}
          >
            <div className="needs-form-card">
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }} className="animate-fade-in">
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    ขอบคุณสำหรับข้อเสนอแนะ!
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
                    ทีมงาน ExamHub ได้รับข้อมูลความต้องการของคุณเรียบร้อยแล้ว เราจะนำไปพัฒนาและปรับปรุงระบบให้ดียิ่งขึ้นครับ
                  </p>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                      setSubjectTitle('');
                    }}
                  >
                    ส่งข้อเสนอแนะเพิ่มเติม
                  </button>
                </div>
              ) : (
                <form onSubmit={handleNeedsSubmit}>
                  {/* Category Selection */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="needs-label">เลือกประเภทความต้องการ / ข้อเสนอแนะ</label>
                    <div className="needs-type-grid">
                      {NEED_TYPES.map(type => {
                        const Icon = type.icon;
                        const isActive = needType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            className={`needs-type-btn ${isActive ? 'active' : ''}`}
                            onClick={() => setNeedType(type.id)}
                          >
                            <Icon size={18} style={{ color: isActive ? 'var(--accent)' : type.color }} />
                            <span>{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Email Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="needs-input-group">
                      <label className="needs-label">ชื่อ หรือ ชื่อเล่น</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          className="needs-input"
                          placeholder="เช่น ก้อง, นัท"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="needs-input-group">
                      <label className="needs-label">อีเมลติดต่อกลับ (ไม่บังคับ)</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          className="needs-input"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject Title */}
                  <div className="needs-input-group">
                    <label className="needs-label">หัวข้อความต้องการ</label>
                    <input
                      type="text"
                      className="needs-input"
                      placeholder="เช่น อยากให้เพิ่มข้อสอบวิชา Network Security, อยากได้โหมดสุ่มข้อสอบ..."
                      value={subjectTitle}
                      onChange={(e) => setSubjectTitle(e.target.value)}
                    />
                  </div>

                  {/* Message / Needs Details */}
                  <div className="needs-input-group">
                    <label className="needs-label">รายละเอียดความต้องการ (Your Needs) *</label>
                    <textarea
                      className="needs-textarea"
                      placeholder="เล่าสิ่งที่คุณอยากให้มี รายละเอียดเนื้อหา หรือสิ่งที่คิดว่าถ้าเพิ่มแล้วจะช่วยให้นักศึกษาเตรียมสอบได้ดียิ่งขึ้น..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {formError && (
                    <div style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {formError}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', height: '48px', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span>กำลังส่งข้อมูล...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>ส่งข้อเสนอแนะ (Submit Needs)</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </BorderGlow>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="faq-footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateLanding}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => scrollToSection('faq-list')}>คำถามที่พบบ่อย</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => scrollToSection('tell-us-needs')}>Tell Us Your Needs</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateAbout}>เกี่ยวกับเรา</span>
          <span style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={onHome}>เริ่มทำข้อสอบ</span>
        </div>
        <p style={{ margin: '0 0 0.25rem 0' }}>ExamHub — แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา</p>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>© 2026 ExamHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
