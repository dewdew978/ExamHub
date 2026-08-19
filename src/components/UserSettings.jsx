import { useState } from 'react';
import { 
  User, 
  ArrowLeft, 
  Save, 
  CheckCircle2, 
  Lock, 
  Calendar, 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Eye, 
  EyeOff, 
  Settings, 
  Palette, 
  BookOpen, 
  Shuffle
} from 'lucide-react';
import { supabase, checkIsAdmin } from '../lib/supabase';

const AVATAR_EMOJIS = [
  '🎓', '🦊', '🚀', '🐼', '🦁', '⚡', '🦉', '💻', 
  '🎯', '🌟', '🐱', '🤖', '🏆', '🔥', '🧠', '☕'
];

export default function UserSettings({ user, onBack, onUserUpdated, theme, onToggleTheme }) {
  const metadata = user?.user_metadata || {};
  const isAdmin = checkIsAdmin(user);

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'preferences' | 'security'
  
  // Profile Form States (Only Avatar, Nickname, and Bio)
  const [nickname, setNickname] = useState(metadata.nickname || '');
  const [avatarEmoji, setAvatarEmoji] = useState(metadata.avatar_emoji || '🎓');
  const [bio, setBio] = useState(metadata.bio || '');

  // Preferences Form States
  const [mathRendering, setMathRendering] = useState(() => {
    return localStorage.getItem('examhub_pref_math') !== 'false';
  });
  const [timerEnabled, setTimerEnabled] = useState(() => {
    return localStorage.getItem('examhub_pref_timer') !== 'false';
  });
  const [autoShuffle, setAutoShuffle] = useState(() => {
    return localStorage.getItem('examhub_pref_shuffle') === 'true';
  });

  // Security Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // UI Feedback States
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const updatedMetadata = {
        ...metadata,
        nickname: nickname.trim(),
        avatar_emoji: avatarEmoji,
        bio: bio.trim(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase.auth.updateUser({
        data: updatedMetadata
      });

      if (error) throw error;

      if (onUserUpdated && data?.user) {
        onUserUpdated(data.user);
      }

      showToast('บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!');
    } catch (err) {
      console.error('Error updating profile:', err);
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('examhub_pref_math', String(mathRendering));
    localStorage.setItem('examhub_pref_timer', String(timerEnabled));
    localStorage.setItem('examhub_pref_shuffle', String(autoShuffle));
    showToast('บันทึกการตั้งค่าการใช้งานเรียบร้อยแล้ว!');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('รหัสผ่านยืนยันไม่ตรงกับรหัสผ่านใหม่');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setNewPassword('');
      setConfirmPassword('');
      showToast('เปลี่ยนรหัสผ่านใหม่สำเร็จเรียบร้อยแล้ว!');
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError(err.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="user-settings-page animate-fade-in">
      
      {/* Scoped CSS for clean responsive layout */}
      <style>{`
        .user-settings-page {
          max-width: 960px;
          margin: 1.5rem auto 3.5rem;
          padding: 0 1rem;
        }
        .settings-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-divider);
          gap: 1rem;
        }
        .settings-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .settings-header-left h1 {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.3px;
        }
        .settings-header-left p {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin: 0.15rem 0 0 0;
        }
        .settings-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          flex-shrink: 0;
        }

        /* Desktop Layout: 2 Columns (Sidebar + Content) */
        .settings-grid {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .settings-nav {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          background: var(--surface);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }
        .settings-tab-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .settings-tab-btn:hover {
          background: var(--surface-hover);
        }
        .settings-tab-btn.active {
          background: var(--card);
          color: var(--accent);
          font-weight: 600;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          border-left: 3px solid var(--accent);
        }
        .settings-content {
          flex: 1;
          min-width: 0;
          width: 100%;
        }
        .settings-card {
          padding: 2rem;
          border-radius: 14px;
          border: 1px solid var(--border-color);
        }
        .settings-card-header {
          border-bottom: 1px solid var(--border-divider);
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }
        .settings-card-header h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .settings-card-header p {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin: 0;
        }
        .pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.15rem;
          border-radius: 10px;
          background: var(--surface);
          border: 1px solid var(--border-color);
          gap: 1rem;
        }
        .settings-submit-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
        }

        /* Mobile Responsive (< 768px) */
        @media (max-width: 768px) {
          .user-settings-page {
            margin: 1rem auto 2.5rem;
            padding: 0 0.75rem;
          }
          .settings-header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .settings-header-left {
            gap: 0.75rem;
          }
          .settings-grid {
            flex-direction: column;
            gap: 1rem;
          }
          .settings-nav {
            width: 100%;
            flex-direction: row;
            padding: 0.35rem;
            gap: 0.35rem;
            border-radius: 10px;
            overflow-x: auto;
          }
          .settings-tab-btn {
            flex: 1;
            justify-content: center;
            padding: 0.65rem 0.5rem;
            font-size: 0.8125rem;
            white-space: nowrap;
            text-align: center;
            border-left: none !important;
            border-radius: 6px;
            gap: 0.35rem;
          }
          .settings-tab-btn.active {
            background: var(--card);
            border-bottom: 2px solid var(--accent);
          }
          .settings-card {
            padding: 1.25rem 1rem;
            border-radius: 12px;
          }
          .pref-row {
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
            gap: 0.75rem;
          }
          .settings-submit-btn {
            width: 100%;
          }
        }
      `}</style>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: toastType === 'error' ? 'var(--error)' : 'var(--success)',
          color: 'white',
          padding: '0.875rem 1.5rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 1000,
          fontWeight: 500,
          fontSize: '0.875rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="settings-header">
        <div className="settings-header-left">
          <button 
            className="btn btn-outline" 
            onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.45rem 0.75rem', fontSize: '0.8125rem' }}
          >
            <ArrowLeft size={15} /> ย้อนกลับ
          </button>
          <div>
            <h1>การตั้งค่าบัญชี & โปรไฟล์</h1>
            <p>จัดการข้อมูลส่วนตัว การตั้งค่าระบบ และความปลอดภัย</p>
          </div>
        </div>

        <div>
          <span 
            className="settings-badge"
            style={{
              background: isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: isAdmin ? '#6366f1' : 'var(--success)',
              border: isAdmin ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            {isAdmin ? <ShieldCheck size={13} /> : <User size={13} />}
            {isAdmin ? 'Super Admin' : 'ผู้เรียน (Student)'}
          </span>
        </div>
      </div>

      {/* Main Grid Container (Sidebar + Content Area) */}
      <div className="settings-grid">
        
        {/* Navigation Rail / Mobile Segmented Tabs */}
        <nav className="settings-nav">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={17} />
            <span>ข้อมูลส่วนตัว</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <Settings size={17} />
            <span>การตั้งค่าระบบ</span>
          </button>

          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Key size={17} />
            <span>ความปลอดภัย</span>
          </button>
        </nav>

        {/* Content Area */}
        <main className="settings-content">
          
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="card animate-fade-in settings-card">
              
              <div className="settings-card-header">
                <h2>
                  <User size={18} color="var(--accent)" />
                  ข้อมูลโปรไฟล์ส่วนตัว
                </h2>
                <p>ปรับแต่งชื่อเล่นและไอคอนประจำตัวที่ใช้แสดงผลในระบบ</p>
              </div>

              {/* Avatar Emoji Selector */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.625rem' }}>
                  เลือกไอคอนประจำตัว (Avatar)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {AVATAR_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setAvatarEmoji(emoji)}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        fontSize: '1.35rem',
                        border: avatarEmoji === emoji ? '2px solid var(--accent)' : '1px solid var(--border-color)',
                        background: avatarEmoji === emoji ? 'rgba(0, 112, 243, 0.12)' : 'var(--surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: avatarEmoji === emoji ? 'scale(1.08)' : 'none',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nickname */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  ชื่อเล่น (Nickname / Display Name) <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="input" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="เช่น เดว, โฟกัส, นัท"
                  maxLength={30}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  ชื่อนี้จะถูกนำไปใช้แสดงผลทักทายและในระบบ
                </span>
              </div>

              {/* Bio / Motto */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  เป้าหมายการเรียนหรือคำคมสั้นๆ (Bio / Motto)
                </label>
                <textarea 
                  className="input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="เช่น มุ่งมั่นเตรียมสอบ Midterm และคว้าเกรด A ทุกวิชา 🚀"
                  rows={3}
                  maxLength={150}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', resize: 'vertical' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
                  ข้อความสั้นๆ แสดงในหน้าโปรไฟล์ส่วนตัว (ความยาวไม่เกิน 150 ตัวอักษร)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary settings-submit-btn"
                  disabled={saving}
                >
                  <Save size={16} />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลโปรไฟล์'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: System & Exam Preferences */}
          {activeTab === 'preferences' && (
            <div className="card animate-fade-in settings-card">
              <div className="settings-card-header">
                <h2>
                  <Settings size={18} color="var(--accent)" />
                  การตั้งค่าระบบและประสบการณ์การทำข้อสอบ
                </h2>
                <p>ปรับแต่งตัวช่วยในการสอบและการแสดงผลของเว็บไซต์</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                
                {/* Theme Toggle */}
                <div className="pref-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Palette size={16} color="var(--accent)" /> ธีมการแสดงผล (Theme)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      สลับโหมดมืด (Dark Mode) หรือโหมดสว่าง (Light Mode) ตามความสบายตา
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={onToggleTheme}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
                  >
                    {theme === 'dark' ? '🌙 โหมดมืด' : '☀️ โหมดสว่าง'}
                  </button>
                </div>

                {/* KaTeX Formula Toggle */}
                <div className="pref-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={16} color="var(--accent)" /> แสดงสูตรคณิตศาสตร์ (KaTeX Formula Render)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      แปลงสัญลักษณ์สมการคณิตศาสตร์และสูตรคำนวณให้อ่านง่ายอัตโนมัติ
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={mathRendering}
                    onChange={(e) => setMathRendering(e.target.checked)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }}
                  />
                </div>

                {/* Timer Toggle */}
                <div className="pref-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} color="var(--accent)" /> ตัวจับเวลานับถอยหลังในการสอบ (Exam Timer)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      เปิดตัวจับเวลาจริงขณะฝึกทำข้อสอบเพื่อจำลองบรรยากาศในห้องสอบ
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(e) => setTimerEnabled(e.target.checked)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }}
                  />
                </div>

                {/* Auto Shuffle Toggle */}
                <div className="pref-row">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Shuffle size={16} color="var(--accent)" /> สลับลำดับข้อสอบอัตโนมัติ (Auto Shuffle Questions)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      สุ่มลำดับข้อสอบทุกครั้งที่เริ่มทำชุดข้อสอบใหม่
                    </div>
                  </div>
                  <input 
                    type="checkbox"
                    checked={autoShuffle}
                    onChange={(e) => setAutoShuffle(e.target.checked)}
                    style={{ width: '22px', height: '22px', cursor: 'pointer', accentColor: 'var(--accent)', flexShrink: 0 }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-primary settings-submit-btn"
                  onClick={handleSavePreferences}
                >
                  <Save size={16} /> บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="card animate-fade-in settings-card">
              <div className="settings-card-header">
                <h2>
                  <Key size={18} color="var(--accent)" />
                  ความปลอดภัยและเปลี่ยนรหัสผ่าน
                </h2>
                <p>จัดการความปลอดภัยของบัญชีและอัปเดตรหัสผ่านใหม่</p>
              </div>

              <form onSubmit={handleChangePassword} style={{ maxWidth: '480px' }}>
                {passwordError && (
                  <div style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    color: 'var(--error)',
                    marginBottom: '1.25rem',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <ShieldAlert size={16} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    รหัสผ่านใหม่ (New Password)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
                      style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    ยืนยันรหัสผ่านใหม่ (Confirm Password)
                  </label>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    className="input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary settings-submit-btn"
                  disabled={saving}
                >
                  <Lock size={16} />
                  <span>{saving ? 'กำลังดำเนินการ...' : 'อัปเดตรหัสผ่านใหม่'}</span>
                </button>
              </form>

              {/* Account Details Box */}
              <div style={{
                marginTop: '2.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-divider)',
                color: 'var(--text-muted)',
                fontSize: '0.8125rem'
              }}>
                <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>ข้อมูลบัญชีผู้ใช้งาน:</div>
                <div>• บัญชีอีเมล: <span style={{ color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>{user?.email}</span></div>
                <div>• เข้าสู่ระบบล่าสุด: <span style={{ color: 'var(--text)' }}>{new Date(user?.last_sign_in_at || user?.created_at).toLocaleString('th-TH')}</span></div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

