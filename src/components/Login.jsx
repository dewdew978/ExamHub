import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { EyeIcon, EyeOffIcon, Lock, Mail, ArrowLeft, CheckCircle2, RotateCw } from 'lucide-react';

export default function Login({ onLogin, onClose, authRequiredMessage }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot' | 'confirm_notice' | 'reset_notice'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState('');

  const startCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError('');
    setPasswordError('');
    setNicknameError('');
    setResendSuccess('');

    let hasError = false;
    if (mode === 'signup' && !nickname.trim()) {
      setNicknameError('กรุณากรอกชื่อเล่น');
      hasError = true;
    }
    if (!email) {
      setEmailError('กรุณากรอกอีเมล');
      hasError = true;
    }
    if (mode !== 'forgot' && !password) {
      setPasswordError('กรุณากรอกรหัสผ่าน');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    const trimmedEmail = email.trim();

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              nickname: nickname.trim(),
              avatar_emoji: '🎓'
            },
            emailRedirectTo: `${window.location.origin}/home`
          }
        });

        if (signUpError) throw signUpError;

        if (data?.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            throw new Error('User already registered');
          }

          // If email confirmation is enabled in Supabase, data.session will be null
          if (!data.session) {
            setMode('confirm_notice');
            startCooldown();
            return;
          }

          // If email confirmation is disabled, user is logged in immediately
          onLogin(data.user);
        }
      } else if (mode === 'signin') {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) throw signInError;
        if (data?.user) {
          onLogin(data.user);
        }
      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/reset-password`
        });

        if (resetError) throw resetError;

        setMode('reset_notice');
        startCooldown();
      }
    } catch (err) {
      let errorMessage = err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      if (mode === 'signup' && errorMessage.toLowerCase().includes('already registered')) {
        errorMessage = 'มีบัญชีนี้อยู่ในระบบแล้ว กรุณากด เข้าสู่ระบบ (Sign in)';
      } else if (mode === 'signin' && errorMessage.toLowerCase().includes('invalid login credentials')) {
        errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      } else if (errorMessage.toLowerCase().includes('email not confirmed')) {
        errorMessage = 'อีเมลนี้ยังไม่ได้ยืนยันตัวตน กรุณาตรวจสอบลิงก์ในอีเมลของคุณ';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmEmail = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    setResendSuccess('');
    setError(null);

    try {
      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/home`
        }
      });
      if (resendErr) throw resendErr;
      setResendSuccess('ส่งลิงก์ยืนยันใหม่อีกครั้งเรียบร้อยแล้ว!');
      startCooldown();
    } catch (err) {
      setError(err.message || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleResendResetPassword = async () => {
    if (resendCooldown > 0 || !email) return;
    setLoading(true);
    setResendSuccess('');
    setError(null);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (resetErr) throw resetErr;
      setResendSuccess('ส่งลิงก์รีเซ็ตรหัสผ่านใหม่เรียบร้อยแล้ว!');
      startCooldown();
    } catch (err) {
      setError(err.message || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '75vh', width: '100%', position: 'relative', padding: '1rem 0'
    }}>
      <style>{`
        .login-card {
          padding: 2.25rem 1.75rem;
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          z-index: 1;
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          box-shadow: 0 8px 30px rgba(0,0,0,0.06);
          border-radius: 16px;
          background: var(--surface);
        }
        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem 1.15rem !important;
            gap: 1rem !important;
          }
        }
      `}</style>

      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '600px', height: '400px',
        background: 'radial-gradient(circle, rgba(0, 112, 243, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div className="card login-card animate-fade-in">
        {/* ========================================================= */}
        {/* CASE 1: NOTICE - EMAIL CONFIRMATION SENT                  */}
        {/* ========================================================= */}
        {mode === 'confirm_notice' && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }} className="animate-fade-in">
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(0, 112, 243, 0.12)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Mail size={30} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ตรวจสอบอีเมลของคุณ
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              เราได้ส่งลิงก์ยืนยันตัวตนไปยังอีเมล<br />
              <strong style={{ color: 'var(--text)' }}>{email}</strong> แล้ว
            </p>

            <div style={{
              background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '0.875rem 1rem', fontSize: '0.8125rem',
              color: 'var(--text-muted)', textAlign: 'left', lineHeight: 1.6, marginBottom: '1.5rem'
            }}>
              💡 <strong>คำแนะนำ:</strong> กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี (หากไม่พบอีเมลในกล่องข้อความหลัก ลองตรวจสอบในโฟลเดอร์ <strong>Junk / Spam / เมลขยะ</strong>)
            </div>

            {resendSuccess && (
              <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
                <span>{resendSuccess}</span>
              </div>
            )}
            {error && (
              <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline"
              disabled={loading || resendCooldown > 0}
              onClick={handleResendConfirmEmail}
              style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>{resendCooldown > 0 ? `ส่งใหม่อีกครั้งใน (${resendCooldown}s)` : 'ส่งอีเมลยืนยันใหม่อีกครั้ง'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setMode('signin'); setError(null); }}
              style={{ width: '100%', height: '42px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              ไปที่หน้าเข้าสู่ระบบ (Sign in)
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 2: NOTICE - PASSWORD RESET LINK SENT                 */}
        {/* ========================================================= */}
        {mode === 'reset_notice' && (
          <div style={{ textAlign: 'center', padding: '0.5rem 0' }} className="animate-fade-in">
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยัง<br />
              <strong style={{ color: 'var(--text)' }}>{email}</strong> เรียบร้อยแล้ว
            </p>

            <div style={{
              background: 'var(--surface-hover)', border: '1px solid var(--border-color)',
              borderRadius: '12px', padding: '0.875rem 1rem', fontSize: '0.8125rem',
              color: 'var(--text-muted)', textAlign: 'left', lineHeight: 1.6, marginBottom: '1.5rem'
            }}>
              💡 <strong>ขั้นตอนถัดไป:</strong> เปิดอีเมลของคุณแล้วคลิกปุ่ม <strong>"Reset Password"</strong> เพื่อกำหนดรหัสผ่านใหม่
            </div>

            {resendSuccess && (
              <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                <CheckCircle2 size={16} />
                <span>{resendSuccess}</span>
              </div>
            )}
            {error && (
              <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <button
              type="button"
              className="btn btn-outline"
              disabled={loading || resendCooldown > 0}
              onClick={handleResendResetPassword}
              style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem' }}
            >
              <RotateCw size={15} className={loading ? 'animate-spin' : ''} />
              <span>{resendCooldown > 0 ? `ส่งใหม่อีกครั้งใน (${resendCooldown}s)` : 'ส่งลิงก์ใหม่อีกครั้ง'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => { setMode('signin'); setError(null); }}
              style={{ width: '100%', height: '42px', fontSize: '0.875rem', fontWeight: 600 }}
            >
              กลับไปหน้าเข้าสู่ระบบ (Sign in)
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 3: FORMS (SIGN IN / SIGN UP / FORGOT PASSWORD)       */}
        {/* ========================================================= */}
        {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
              <div style={{ 
                width: '42px', height: '42px', background: 'var(--text)', color: 'var(--bg)', 
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.4rem auto', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                transform: 'scale(1)', transition: 'transform 0.2s ease'
              }}>
                {mode === 'forgot' ? <Lock size={20} /> : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                )}
              </div>

              <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.3px', margin: 0, fontWeight: 600 }}>
                {mode === 'signup' && 'Create an account'}
                {mode === 'signin' && 'Welcome to ExamHub'}
                {mode === 'forgot' && 'ลืมรหัสผ่าน (Forgot Password)'}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                {mode === 'signup' && 'กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้งาน ExamHub'}
                {mode === 'signin' && 'เข้าสู่ระบบเพื่อบันทึกประวัติคะแนนและผลการทดสอบของคุณ'}
                {mode === 'forgot' && 'กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้'}
              </p>
            </div>
            
            {authRequiredMessage && mode !== 'forgot' && (
              <div className="animate-fade-in" style={{ 
                display: 'flex', alignItems: 'center', gap: '0.625rem', 
                color: 'var(--accent)', fontSize: '0.875rem', textAlign: 'left', 
                padding: '0.75rem 1rem', background: 'rgba(0, 112, 243, 0.1)', 
                borderRadius: '8px', border: '1px solid rgba(0, 112, 243, 0.2)' 
              }}>
                <Lock size={16} style={{ flexShrink: 0 }} />
                <span>{authRequiredMessage}</span>
              </div>
            )}
            
            {error && (
              <div className="animate-fade-in" style={{ 
                color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', 
                padding: '0.75rem', background: 'rgba(255,0,0,0.1)', 
                borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' 
              }}>
                {error}
              </div>
            )}
            
            <form noValidate onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                
                {/* Nickname Input Field for Sign Up */}
                {mode === 'signup' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label htmlFor="nickname" style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      ชื่อเล่น (Nickname) <span style={{ color: 'var(--accent)' }}>*</span>
                    </label>
                    <input 
                      id="nickname"
                      type="text" 
                      placeholder="เช่น เดว, โฟกัส, นัท"
                      value={nickname} 
                      maxLength={30}
                      onChange={(e) => {
                        setNickname(e.target.value);
                        if (nicknameError) setNicknameError('');
                      }}
                      style={{ 
                        width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', 
                        border: `1px solid ${nicknameError ? 'var(--error)' : 'var(--border-color)'}`, 
                        background: 'var(--surface-hover)', color: 'var(--text)',
                        fontSize: '0.875rem', outline: 'none'
                      }}
                    />
                    {nicknameError && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{nicknameError}</span>}
                  </div>
                )}

                {/* Email Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email address</label>
                  <input 
                    id="email"
                    type="email" 
                    placeholder="name@example.com"
                    value={email} 
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    style={{ 
                      width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', 
                      border: `1px solid ${emailError ? 'var(--error)' : 'var(--border-color)'}`, 
                      background: 'var(--surface-hover)', color: 'var(--text)',
                      fontSize: '0.875rem', outline: 'none'
                    }}
                  />
                  {emailError && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{emailError}</span>}
                </div>

                {/* Password Field (only for Sign In & Sign Up) */}
                {mode !== 'forgot' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => { setMode('forgot'); setError(null); }}
                          style={{
                            background: 'none', border: 'none', color: 'var(--accent)',
                            fontSize: '0.8125rem', cursor: 'pointer', padding: 0
                          }}
                        >
                          ลืมรหัสผ่าน?
                        </button>
                      )}
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input 
                        id="password"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        value={password} 
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError('');
                        }}
                        style={{ 
                          width: '100%', padding: '0.6rem 2.5rem 0.6rem 0.75rem', borderRadius: '8px', 
                          border: `1px solid ${passwordError ? 'var(--error)' : 'var(--border-color)'}`, 
                          background: 'var(--surface-hover)', color: 'var(--text)',
                          fontSize: '0.875rem', outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setIsVisible(!isVisible)}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                        style={{
                          position: 'absolute', right: '0.5rem', background: 'none', border: 'none', 
                          cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                        }}
                      >
                        {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                      </button>
                    </div>
                    {passwordError && <span style={{ color: 'var(--error)', fontSize: '0.75rem' }}>{passwordError}</span>}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', height: '44px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {loading ? (
                    <span>กำลังดำเนินการ...</span>
                  ) : (
                    <>
                      {mode === 'signup' && 'สมัครสมาชิก (Sign up)'}
                      {mode === 'signin' && 'เข้าสู่ระบบ (Sign in)'}
                      {mode === 'forgot' && 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                    </>
                  )}
                </button>
                
                {mode === 'forgot' ? (
                  <button 
                    type="button"
                    className="btn btn-outline"
                    onClick={() => { setMode('signin'); setError(null); }}
                    style={{ width: '100%', height: '40px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                  >
                    <ArrowLeft size={14} />
                    <span>กลับไปหน้าเข้าสู่ระบบ</span>
                  </button>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.15rem 0' }}>
                      <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>หรือ</span>
                      <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
                    </div>
                    
                    <button 
                      type="button"
                      className="btn"
                      onClick={onClose}
                      style={{ width: '100%', height: '40px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.875rem' }}
                    >
                      เข้าสู่ระบบแบบไม่ระบุตัวตน (Guest)
                    </button>
                  </>
                )}
              </div>
            </form>

            {mode !== 'forgot' && (
              <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {mode === 'signup' ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
                </span>
                <button 
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'signin' : 'signup');
                    setError(null);
                    setEmailError('');
                    setPasswordError('');
                    setNicknameError('');
                  }}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--accent)', 
                    fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  {mode === 'signup' ? 'เข้าสู่ระบบ (Sign in)' : 'สมัครสมาชิก (Sign up)'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
