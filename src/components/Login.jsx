import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { validatePassword, PASSWORD_HINT } from '../lib/passwordPolicy';
import { EyeIcon, EyeOffIcon, Lock, Mail, ArrowLeft, CheckCircle2, RotateCw, BookOpen } from 'lucide-react';
import AuthLayout from './shell/AuthLayout';

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
    } else if (mode === 'signup') {
      const policyError = validatePassword(password);
      if (policyError) {
        setPasswordError(policyError);
        hasError = true;
      }
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
              nickname: nickname.trim()
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
      } else if (errorMessage.toLowerCase().includes('rate limit')) {
        errorMessage = 'ระบบส่งอีเมลถึงขีดจำกัดชั่วคราว (Rate Limit) กรุณารอสักครู่แล้วลองใหม่อีกครั้ง';
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
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        setError('ส่งอีเมลถึงขีดจำกัดชั่วคราว กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
      } else {
        setError(msg || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง');
      }
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
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        setError('ส่งอีเมลถึงขีดจำกัดชั่วคราว กรุณารอสักครู่แล้วลองใหม่อีกครั้ง');
      } else {
        setError(msg || 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = (hasError) => hasError ? { boxShadow: '0 0 0 1px var(--error)' } : undefined;

  const Notice = ({ tone, icon: Icon, title, children, resendLabel, onResend, backLabel }) => (
    <div className="animate-fade-in">
      <span className="tile" style={{ width: 40, height: 40, marginBottom: '1rem', ...(tone === 'success' ? { background: 'var(--success-soft)', color: 'var(--success)', boxShadow: 'none' } : { background: 'var(--accent-soft)', color: 'var(--accent-text)', boxShadow: 'none' }) }}>
        <Icon size={18} />
      </span>
      <h1 style={{ fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>{children}</p>
      {resendSuccess && (
        <div style={{ color: 'var(--success)', fontSize: '0.8125rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={14} /> <span>{resendSuccess}</span>
        </div>
      )}
      {error && <div role="alert" style={{ color: 'var(--error)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>{error}</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button type="button" className="btn btn-primary btn-lg" onClick={() => { setMode('signin'); setError(null); }} style={{ width: '100%' }}>
          {backLabel}
        </button>
        <button type="button" className="btn btn-lg" disabled={loading || resendCooldown > 0} onClick={onResend} style={{ width: '100%' }}>
          <RotateCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>{resendCooldown > 0 ? `ส่งใหม่อีกครั้งใน (${resendCooldown}s)` : resendLabel}</span>
        </button>
      </div>
    </div>
  );

  return (
    <AuthLayout onBack={onClose}>
      {mode === 'confirm_notice' && (
        <Notice
          icon={Mail}
          title="ตรวจสอบอีเมลของคุณ"
          resendLabel="ส่งอีเมลยืนยันใหม่อีกครั้ง"
          onResend={handleResendConfirmEmail}
          backLabel="ไปที่หน้าเข้าสู่ระบบ (Sign in)"
        >
          เราได้ส่งลิงก์ยืนยันตัวตนไปยัง <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{email}</strong> แล้ว
          กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี หากไม่พบ ลองตรวจสอบโฟลเดอร์ <strong style={{ fontWeight: 500 }}>Junk / Spam</strong>
        </Notice>
      )}

      {mode === 'reset_notice' && (
        <Notice
          tone="success"
          icon={CheckCircle2}
          title="ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว!"
          resendLabel="ส่งลิงก์ใหม่อีกครั้ง"
          onResend={handleResendResetPassword}
          backLabel="กลับไปหน้าเข้าสู่ระบบ (Sign in)"
        >
          ระบบได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยัง <strong style={{ color: 'var(--text)', fontWeight: 500 }}>{email}</strong> เรียบร้อยแล้ว
          เปิดอีเมลแล้วคลิก <strong style={{ fontWeight: 500 }}>"Reset Password"</strong> เพื่อกำหนดรหัสผ่านใหม่
        </Notice>
      )}

      {(mode === 'signin' || mode === 'signup' || mode === 'forgot') && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <span className="workspace-logo" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: '1.1rem' }}>
              {mode === 'forgot' ? <Lock size={16} /> : <BookOpen size={17} strokeWidth={2.4} />}
            </span>
            <h1 style={{ fontSize: '1.375rem', letterSpacing: '-0.02em', fontWeight: 600 }}>
              {mode === 'signup' && 'สร้างบัญชี EXETIA'}
              {mode === 'signin' && 'เข้าสู่ระบบ EXETIA'}
              {mode === 'forgot' && 'ลืมรหัสผ่าน'}
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {mode === 'signup' && 'กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้งาน EXETIA'}
              {mode === 'signin' && 'เข้าสู่ระบบเพื่อบันทึกประวัติคะแนนและผลการทดสอบของคุณ'}
              {mode === 'forgot' && 'กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้'}
            </p>
          </div>

          {authRequiredMessage && mode !== 'forgot' && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: 'var(--accent-text)', fontSize: '0.8125rem', padding: '0.6rem 0.8rem', background: 'var(--accent-soft)', borderRadius: 8 }}>
              <Lock size={14} style={{ flexShrink: 0 }} />
              <span>{authRequiredMessage}</span>
            </div>
          )}

          {error && (
            <div role="alert" className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.8125rem', padding: '0.6rem 0.8rem', background: 'var(--error-soft)', borderRadius: 8 }}>
              {error}
            </div>
          )}

          <form noValidate onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {mode === 'signup' && (
              <div className="animate-fade-in">
                <label htmlFor="nickname" className="label">ชื่อเล่น (Nickname) <span style={{ color: 'var(--accent)' }}>*</span></label>
                <input
                  id="nickname"
                  className="input"
                  type="text"
                  placeholder="เช่น เดว, โฟกัส, นัท"
                  value={nickname}
                  maxLength={30}
                  onChange={(e) => { setNickname(e.target.value); if (nicknameError) setNicknameError(''); }}
                  style={fieldStyle(nicknameError)}
                />
                {nicknameError && <p className="hint" style={{ color: 'var(--error)' }}>{nicknameError}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="label">อีเมล</label>
              <input
                id="email"
                className="input"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                style={fieldStyle(emailError)}
              />
              {emailError && <p className="hint" style={{ color: 'var(--error)' }}>{emailError}</p>}
            </div>

            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label htmlFor="password" className="label">รหัสผ่าน</label>
                  {mode === 'signin' && (
                    <button type="button" onClick={() => { setMode('forgot'); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontSize: '0.78rem', cursor: 'pointer', padding: 0, marginBottom: '0.35rem' }}>
                      ลืมรหัสผ่าน?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    id="password"
                    className="input"
                    placeholder="••••••••"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    type={isVisible ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                    style={{ paddingRight: '2.25rem', ...fieldStyle(passwordError) }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                    className="btn btn-ghost btn-icon btn-sm"
                    style={{ position: 'absolute', right: 3 }}
                  >
                    {isVisible ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                  </button>
                </div>
                {passwordError && <p className="hint" style={{ color: 'var(--error)' }}>{passwordError}</p>}
                {mode === 'signup' && !passwordError && <p className="hint">{PASSWORD_HINT}</p>}
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
              {loading ? 'กำลังดำเนินการ...' : (
                <>
                  {mode === 'signup' && 'สมัครสมาชิก (Sign up)'}
                  {mode === 'signin' && 'เข้าสู่ระบบ (Sign in)'}
                  {mode === 'forgot' && 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
                </>
              )}
            </button>

            {mode === 'forgot' ? (
              <button type="button" className="btn btn-ghost" onClick={() => { setMode('signin'); setError(null); }} style={{ width: '100%' }}>
                <ArrowLeft size={14} /> กลับไปหน้าเข้าสู่ระบบ
              </button>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-subtle)', fontSize: '0.72rem' }}>
                  <div className="divider" style={{ flex: 1 }} /> หรือ <div className="divider" style={{ flex: 1 }} />
                </div>
                <button type="button" className="btn btn-lg" onClick={onClose} style={{ width: '100%' }}>
                  ใช้งานแบบไม่เข้าสู่ระบบ (Guest)
                </button>
              </>
            )}
          </form>

          {mode !== 'forgot' && (
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {mode === 'signup' ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setError(null);
                  setEmailError('');
                  setPasswordError('');
                  setNicknameError('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-text)', fontWeight: 500, cursor: 'pointer', padding: 0 }}
              >
                {mode === 'signup' ? 'เข้าสู่ระบบ (Sign in)' : 'สมัครสมาชิก (Sign up)'}
              </button>
            </p>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
