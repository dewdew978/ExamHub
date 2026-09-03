import { useState, useEffect } from 'react';
import { Shield, Lock, Scale, BookOpen, CheckCircle, AlertCircle, UserCheck, Eye, Database, HelpCircle } from 'lucide-react';
import Aurora from './Aurora';
import Navbar from './Navbar';

export default function TermsOfService({ onStart, onLogin, onHome, onNavigateAbout, onNavigateFaq, user }) {
  const [activeTab, setActiveTab] = useState('terms'); // 'terms' | 'privacy'
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

  return (
    <div className="terms-page-root animate-fade-in">
      <style>{`
        .terms-page-root {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg);
          color: var(--text);
        }

        .terms-hero {
          position: relative;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 7rem 1.5rem 3rem 1.5rem;
          overflow: hidden;
        }

        .terms-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .terms-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          background: color-mix(in srgb, var(--surface) 80%, transparent);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          font-size: 0.8125rem;
          color: var(--text-muted);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .terms-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #8b5cf6;
          box-shadow: 0 0 8px #8b5cf6;
        }

        .terms-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin: 0;
        }

        .terms-title-gradient {
          background: linear-gradient(135deg, #0070f3 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .terms-subtitle {
          font-size: 1.05rem;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.6;
          margin: 0;
        }

        .terms-content-section {
          max-width: 960px;
          width: 100%;
          margin: 0 auto;
          padding: 1.5rem 1.5rem 6rem 1.5rem;
          flex: 1;
        }

        /* Tab Controls */
        .terms-tabs-bar {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .terms-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          border: 1px solid var(--border-color);
          background: var(--surface);
          color: var(--text-muted);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .terms-tab-btn:hover {
          color: var(--text);
          border-color: var(--border-hover);
          background: var(--surface-hover);
        }

        .terms-tab-btn.active {
          background: linear-gradient(135deg, #0070f3, #8b5cf6);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
        }

        /* Card Document Styles */
        .terms-doc-card {
          background: var(--surface);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 8px 32px rgba(0,0,0,0.03);
          line-height: 1.75;
          font-size: 0.95rem;
        }

        @media (max-width: 640px) {
          .terms-doc-card {
            padding: 1.5rem;
          }
        }

        .terms-last-updated {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          padding: 0.3rem 0.8rem;
          background: var(--surface-hover);
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid var(--border-color);
        }

        .terms-block {
          margin-bottom: 2.5rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .terms-block:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .terms-block-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .terms-block-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .terms-block-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .terms-block-text {
          color: var(--text);
          opacity: 0.9;
          margin-bottom: 0.85rem;
        }

        .terms-list {
          padding-left: 1.25rem;
          margin: 0.5rem 0 1rem 0;
          color: var(--text-muted);
        }

        .terms-list li {
          margin-bottom: 0.4rem;
        }

        .terms-callout {
          background: color-mix(in srgb, var(--accent) 8%, transparent);
          border-left: 4px solid var(--accent);
          border-radius: 0 12px 12px 0;
          padding: 1rem 1.25rem;
          margin: 1.25rem 0;
          font-size: 0.9rem;
          color: var(--text);
        }

        .terms-footer {
          border-top: 1px solid var(--border-color);
          padding: 2.5rem 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted);
          background: var(--surface);
        }
      `}</style>

      {/* Navbar */}
      <Navbar
        user={user}
        onBrand={onHome}
        onStart={onStart}
        onLogin={onLogin}
        onStartGuest={onStart}
        showLogin={!user}
        links={[
          { label: 'หน้าแรก', onClick: onHome },
          { label: 'เกี่ยวกับเรา', onClick: onNavigateAbout },
          { label: 'คำถามที่พบบ่อย (FAQ)', onClick: onNavigateFaq },
        ]}
      />

      {/* Hero Header */}
      <section className="terms-hero">
        <Aurora 
          colorStops={isDark ? ["#7cff67", "#B497CF", "#5227FF"] : ["#0070f3", "#a855f7", "#ec4899"]} 
          blend={0.5} 
          amplitude={1.0} 
          speed={0.6} 
        />
        <div className="terms-hero-inner">
          <div className="terms-badge">
            <span className="terms-badge-dot" />
            <span>Legal & Privacy Standards · ข้อกำหนดและนโยบายสากล</span>
          </div>
          <h1 className="terms-title">
            ข้อกำหนดและ<span className="terms-title-gradient">ความเป็นส่วนตัว</span>
          </h1>
          <p className="terms-subtitle">
            ความโปร่งใสและมาตรฐานความปลอดภัยในการให้บริการคลังข้อสอบออนไลน์ของ ExamHub
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="terms-content-section">
        {/* Switch Tabs */}
        <div className="terms-tabs-bar">
          <button 
            className={`terms-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            <Scale size={18} />
            <span>ข้อกำหนดการให้บริการ (Terms of Service)</span>
          </button>
          <button 
            className={`terms-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <Lock size={18} />
            <span>นโยบายความเป็นส่วนตัว (Privacy Policy)</span>
          </button>
        </div>

        {/* Tab 1: Terms of Service */}
        {activeTab === 'terms' && (
          <div className="terms-doc-card animate-fade-in">
            <div className="terms-last-updated">
              <CheckCircle size={14} color="var(--success)" />
              <span>ปรับปรุงล่าสุด: 26 สิงหาคม 2026 (Version 2.1)</span>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(0, 112, 243, 0.12)', color: '#0070f3' }}>
                  <BookOpen size={20} />
                </div>
                <h2 className="terms-block-title">1. บทนำและวัตถุประสงค์ในการให้บริการ</h2>
              </div>
              <p className="terms-block-text">
                ยินดีต้อนรับสู่ <strong>ExamHub</strong> แพลตฟอร์มคลังข้อสอบและแบบฝึกหัดออนไลน์ที่สร้างขึ้นเพื่อสนับสนุนการเรียนรู้ ทบทวนความรู้ และพัฒนาทักษะทางวิชาการของนักศึกษาและผู้สนใจในสาขา Data Science, Artificial Intelligence (AI), Cloud Computing, MIS และ Data Warehouse
              </p>
              <p className="terms-block-text">
                การเข้าถึงและใช้งานแพลตฟอร์ม ExamHub ถือว่าคุณได้อ่าน เข้าใจ และยอมรับข้อตกลงและเงื่อนไขการใช้บริการเหล่านี้ทั้งหมด หากคุณไม่ยอมรับข้อตกลงใดๆ โปรดยุติการใช้งานแพลตฟอร์มทันที
              </p>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                  <UserCheck size={20} />
                </div>
                <h2 className="terms-block-title">2. บัญชีผู้ใช้งานและความปลอดภัย</h2>
              </div>
              <p className="terms-block-text">
                ผู้ใช้สามารถฝึกทำข้อสอบได้ทั้งในฐานะผู้เยี่ยมชม (Guest) และสมาชิกที่ลงทะเบียนเข้าสู่ระบบ โดยเมื่อคุณลงทะเบียนบัญชี:
              </p>
              <ul className="terms-list">
                <li>คุณต้องให้ข้อมูลที่ถูกต้องในการสมัคร (เช่น อีเมลที่ใช้งานได้จริง และชื่อเล่นที่เหมาะสม)</li>
                <li>คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของรหัสผ่านและข้อมูลบัญชีของคุณ</li>
                <li>ห้ามมิให้แชร์หรือส่งต่อสิทธิ์การเข้าถึงบัญชีที่มีสิทธิ์ระดับผู้ดูแล (Admin) แก่บุคคลภายนอก</li>
                <li>ExamHub ขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีที่มีพฤติกรรมละเมิดกฎ หรือพยายามเจาะระบบ</li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                  <Shield size={20} />
                </div>
                <h2 className="terms-block-title">3. ทรัพย์สินทางปัญญาและลิขสิทธิ์เนื้อหา</h2>
              </div>
              <p className="terms-block-text">
                ชุดข้อสอบ คำอธิบายเฉลย โครงสร้างระบบ และซอร์สโค้ดของ ExamHub ได้รับการคุ้มครองตามกฎหมายทรัพย์สินทางปัญญา:
              </p>
              <ul className="terms-list">
                <li>เนื้อหาทั้งหมดมีวัตถุประสงค์เพื่อการศึกษาและการเตรียมสอบส่วนบุคคลโดยไม่แสวงหาผลกำไร (Non-commercial Educational Use)</li>
                <li>ห้ามมิให้ทำซ้ำ ดัดแปลง คัดลอก หรือแจกจ่ายเนื้อหาข้อสอบเพื่อการพาณิชย์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร</li>
                <li>ผู้ใช้สามารถแชร์ลิงก์ชุดข้อสอบหรือสรุปคะแนนของตนเองสู่สาธารณะได้ตามอิสระ</li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' }}>
                  <AlertCircle size={20} />
                </div>
                <h2 className="terms-block-title">4. ข้อห้ามและมารยาทในการใช้งาน (Acceptable Use)</h2>
              </div>
              <p className="terms-block-text">ในการใช้งาน ExamHub ผู้ใช้ตกลงว่าจะไม่กระทำการดังต่อไปนี้:</p>
              <ul className="terms-list">
                <li>ใช้ระบบอัตโนมัติ (Bot / Scraper) ยิงคำขอในปริมาณมากจนทำให้เซิร์ฟเวอร์ขัดข้อง (DDoS)</li>
                <li>ส่งรายงานปัญหาเท็จ (Spam Report) หรือส่งข้อความก่อกวนผ่านระบบแจ้งปัญหาข้อสอบ</li>
                <li>พยายามแก้ไขหรือแทรกแซงฐานข้อมูลคะแนนสอบของผู้อื่นในระบบ Supabase</li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                  <Scale size={20} />
                </div>
                <h2 className="terms-block-title">5. ข้อจำกัดความรับผิดชอบ (Disclaimer)</h2>
              </div>
              <p className="terms-block-text">
                แบบฝึกหัดและข้อสอบใน ExamHub ถูกจัดทำขึ้นเพื่อการทบทวนและฝึกฝนความเข้าใจเท่านั้น แม้ทีมงานจะพยายามตรวจสอบความถูกต้องอย่างเต็มที่ แต่ไม่รับประกันว่าข้อสอบจะตรงกับข้อสอบจริงในห้องสอบ 100% ทั้งนี้ผลคะแนนในระบบไม่สามารถนำไปอ้างอิงเป็นเกรดทางการของสถาบันการศึกษาได้
              </p>
              <div className="terms-callout">
                💡 หากคุณพบข้อสอบที่มีข้อผิดพลาด เฉลยไม่ชัดเจน หรือคำถามกำกวม สามารถใช้ฟังก์ชัน <strong>"แจ้งปัญหาข้อสอบ" (Report)</strong> เพื่อให้แอดมินตรวจสอบและแก้ไขได้ตลอดเวลา
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="terms-doc-card animate-fade-in">
            <div className="terms-last-updated">
              <CheckCircle size={14} color="var(--success)" />
              <span>คุ้มครองตามหลักการ PDPA และ GDPR · ปรับปรุงเมื่อ 26 สิงหาคม 2026</span>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(0, 112, 243, 0.12)', color: '#0070f3' }}>
                  <Database size={20} />
                </div>
                <h2 className="terms-block-title">1. ข้อมูลที่เราเก็บรวบรวม (Data Collection)</h2>
              </div>
              <p className="terms-block-text">
                ExamHub ให้ความสำคัญสูงสุดกับความเป็นส่วนตัวของคุณ เราจัดเก็บเฉพาะข้อมูลที่จำเป็นต่อการให้บริการ ดังนี้:
              </p>
              <ul className="terms-list">
                <li><strong>ข้อมูลบัญชี:</strong> อีเมล, รหัสผ่าน (เข้ารหัสผ่าน Supabase Auth), ชื่อเล่น (Nickname), รูป Avatar และ Bio สั้นๆ</li>
                <li><strong>ข้อมูลการสอบและผลการเรียนรู้:</strong> ประวัติคะแนนสอบ (Score History), วันที่สอบ, เปอร์เซ็นต์ความถูกต้อง และข้อที่ทำผิด เพื่อใช้วิเคราะห์จุดอ่อน</li>
                <li><strong>การตั้งค่าระบบ:</strong> โหมดธีม (Light/Dark), การเปิด-ปิดตัวจับเวลา, การสลับช้อยส์ (บันทึกใน LocalStorage ของอุปกรณ์คุณ)</li>
                <li><strong>ข้อมูลการรายงานปัญหา:</strong> ข้อความอธิบายปัญหาและรหัสข้อสอบที่คุณแจ้งเข้ามาเพื่อการปรับปรุงระบบ</li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                  <Eye size={20} />
                </div>
                <h2 className="terms-block-title">2. วัตถุประสงค์ในการนำข้อมูลไปใช้</h2>
              </div>
              <p className="terms-block-text">ข้อมูลของคุณจะถูกนำไปใช้เพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:</p>
              <ul className="terms-list">
                <li>เพื่อแสดงประวัติและกราฟพัฒนาการคะแนนสอบส่วนตัวของคุณ</li>
                <li>เพื่อแสดงผลสถิติภาพรวม เช่น จำนวนครั้งที่ข้อสอบแต่ละชุดถูกฝึกทำ</li>
                <li>เพื่อตรวจสอบและแก้ไขข้อสอบที่ได้รับรายงานว่ามีข้อผิดพลาด</li>
                <li><strong>ไม่มีการขายหรือส่งต่อข้อมูลส่วนบุคคลของคุณให้แก่บุคคลภายนอกหรือนายหน้าโฆษณาโดยเด็ดขาด</strong></li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                  <Lock size={20} />
                </div>
                <h2 className="terms-block-title">3. ความปลอดภัยของข้อมูล (Data Security)</h2>
              </div>
              <p className="terms-block-text">
                เราใช้โครงสร้างพื้นฐานระดับองค์กรผ่าน <strong>Supabase (PostgreSQL)</strong> ซึ่งมีระบบรักษาความปลอดภัย:
              </p>
              <ul className="terms-list">
                <li>การเข้ารหัสข้อมูลขณะส่งผ่านเครือข่ายด้วยโปรโตคอล HTTPS / TLS 1.3</li>
                <li>ระบบ <strong>Row Level Security (RLS)</strong> ป้องกันไม่ให้ผู้ใช้อื่นเข้าถึงหรือดูข้อมูลประวัติคะแนนของบุคคลอื่นได้</li>
                <li>รหัสผ่านทั้งหมดถูก Hash ด้วยอัลกอริทึมมาตรฐานที่ปลอดภัย ไม่มีการจัดเก็บรหัสผ่านดิบ</li>
              </ul>
            </div>

            <div className="terms-block">
              <div className="terms-block-header">
                <div className="terms-block-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                  <HelpCircle size={20} />
                </div>
                <h2 className="terms-block-title">4. สิทธิ์ของคุณในฐานะเจ้าของข้อมูล</h2>
              </div>
              <p className="terms-block-text">คุณมีสิทธิ์ในการควบคุมข้อมูลส่วนบุคคลของคุณอย่างเต็มที่:</p>
              <ul className="terms-list">
                <li>สิทธิ์ในการเข้าถึงและแก้ไขข้อมูลโปรไฟล์ผ่านหน้า <strong>ตั้งค่าบัญชี (User Settings)</strong></li>
                <li>สิทธิ์ในการเปลี่ยนรหัสผ่านหรือลบประวัติคะแนนสอบ</li>
                <li>สิทธิ์ในการขอยกเลิกบัญชีและลบข้อมูลทั้งหมดออกจากฐานข้อมูลอย่างถาวร</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="terms-footer">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onHome}>หน้าแรก</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateAbout}>เกี่ยวกับเรา</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onNavigateFaq}>คำถามที่พบบ่อย (FAQ)</span>
          <span style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 600 }} onClick={onStart}>เริ่มทำข้อสอบ</span>
        </div>
        <p style={{ margin: '0 0 0.25rem 0' }}>ExamHub — แพลตฟอร์มฝึกทำข้อสอบออนไลน์สำหรับนักศึกษา</p>
        <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8125rem' }}>
          พัฒนาโดย <a href="https://dewdew978.github.io/portfolio/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Pawarit</a>
        </p>
        <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>© 2026 ExamHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
