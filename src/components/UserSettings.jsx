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
  Award, 
  Shuffle
} from 'lucide-react';
import { supabase, checkIsAdmin } from '../lib/supabase';

const AVATAR_EMOJIS = [
  '🎓', '🦊', '🚀', '🐼', '🦁', '⚡', '🦉', '💻', 
  '🎯', '🌟', '🐱', '🤖', '🏆', '🔥', '🧠', '☕'
];

export default function UserSettings({ user, onBack, onUserUpdated, totalScore = 0, theme, onToggleTheme }) {
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

  // Get user display name for live card preview
  const displayNickname = nickname.trim() || user?.email?.split('@')[0] || 'ผู้เรียน';

  const NAV_ITEMS = [
    {
      id: 'profile',
      label: 'ข้อมูลโปรไฟล์ส่วนตัว',
      sublabel: 'ชื่อเล่น, Avatar, คำคม',
      icon: User,
    },
    {
      id: 'preferences',
      label: 'การตั้งค่าระบบ & ข้อสอบ',
      sublabel: 'ธีม, ตัวจับเวลา, KaTeX',
      icon: Settings,
    },
    {
      id: 'security',
      label: 'ความปลอดภัย & รหัสผ่าน',
      sublabel: 'เปลี่ยนรหัสผ่าน, บัญชี',
      icon: Key,
    }
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1020px', margin: '1.5rem auto 3.5rem', padding: '0 1rem' }}>
      
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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--border-divider)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.875rem' }}
          >
            <ArrowLeft size={16} /> ย้อนกลับ
          </button>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
              การตั้งค่าบัญชี & โปรไฟล์
            </h1>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              จัดการข้อมูลส่วนตัว การตั้งค่าระบบ และความปลอดภัย
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ 
            fontSize: '0.75rem', 
            fontWeight: 600, 
            padding: '0.3rem 0.75rem', 
            borderRadius: '999px',
            background: isAdmin ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: isAdmin ? '#6366f1' : 'var(--success)',
            border: isAdmin ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem'
          }}>
            {isAdmin ? <ShieldCheck size={13} /> : <User size={13} />}
            {isAdmin ? 'Super Admin' : 'ผู้เรียน (Student)'}
          </span>
        </div>
      </div>

      {/* Main Layout Container (Sidebar + Content Area) */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR NAVIGATION RAIL                                              */}
        {/* ========================================================================= */}
        <div style={{
          width: '280px',
          minWidth: '260px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          {/* User Mini Profile Card */}
          <div className="card" style={{
            padding: '1.25rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--card) 0%, var(--surface-hover) 100%)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--surface)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.1rem',
              border: '2px solid var(--border-color)'
            }}>
              {avatarEmoji}
            </div>

            <div style={{ width: '100%' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.3px', wordBreak: 'break-word' }}>
                {displayNickname}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', wordBreak: 'break-all' }}>
                {user?.email}
              </div>
              {bio && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)', 
                  fontStyle: 'italic', 
                  marginTop: '0.5rem',
                  padding: '0.35rem 0.6rem',
                  background: 'var(--surface)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-divider)'
                }}>
                  "{bio}"
                </div>
              )}
            </div>

            {/* Score Pill */}
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              background: 'rgba(0, 112, 243, 0.08)',
              border: '1px solid rgba(0, 112, 243, 0.2)',
              marginTop: '0.25rem'
            }}>
              <Award size={16} color="var(--accent)" />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>คะแนนสะสม:</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>{totalScore} คะแนน</span>
            </div>
          </div>

          {/* Navigation Links Menu */}
          <div className="card" style={{
            padding: '0.5rem',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 0.875rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'var(--surface-hover)' : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    fontFamily: 'inherit',
                    boxShadow: isActive ? 'inset 3px 0 0 0 var(--accent)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'var(--surface)';
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(0, 112, 243, 0.12)' : 'var(--surface)',
                    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {item.sublabel}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT MAIN CONTENT AREA                                                   */}
        {/* ========================================================================= */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="card animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
              
              <div style={{ borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--accent)" />
                  ข้อมูลโปรไฟล์ส่วนตัว
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  ปรับแต่งชื่อเล่นและไอคอนประจำตัวที่ใช้แสดงผลในระบบ
                </p>
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
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        fontSize: '1.4rem',
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

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
                >
                  <Save size={16} />
                  <span>{saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลโปรไฟล์'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: System & Exam Preferences */}
          {activeTab === 'preferences' && (
            <div className="card animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={18} color="var(--accent)" />
                  การตั้งค่าระบบและประสบการณ์การทำข้อสอบ
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  ปรับแต่งตัวช่วยในการสอบและการแสดงผลของเว็บไซต์
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                
                {/* Theme Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)'
                }}>
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    {theme === 'dark' ? '🌙 โหมดมืด' : '☀️ โหมดสว่าง'}
                  </button>
                </div>

                {/* KaTeX Formula Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)'
                }}>
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
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                  />
                </div>

                {/* Timer Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)'
                }}>
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
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                  />
                </div>

                {/* Auto Shuffle Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)'
                }}>
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
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSavePreferences}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
                >
                  <Save size={16} /> บันทึกการตั้งค่า
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="card animate-fade-in" style={{ padding: '2rem', borderRadius: '16px' }}>
              <div style={{ borderBottom: '1px solid var(--border-divider)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={18} color="var(--accent)" />
                  ความปลอดภัยและเปลี่ยนรหัสผ่าน
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                  จัดการความปลอดภัยของบัญชีและอัปเดตรหัสผ่านใหม่
                </p>
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
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem' }}
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

        </div>
      </div>

    </div>
  );
}

