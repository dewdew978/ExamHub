import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { validatePassword, PASSWORD_HINT } from '../lib/passwordPolicy';
import { Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import AuthLayout from './shell/AuthLayout';

export default function ResetPassword({ onSuccess, onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isInvalidLink, setIsInvalidLink] = useState(false);

  useEffect(() => {
    // 1. Check URL hash or search for Supabase error parameters (e.g. expired link)
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    const search = window.location.search ? window.location.search.substring(1) : '';
    const params = new URLSearchParams(hash || search);

    const errorDesc = params.get('error_description');
    const errorCode = params.get('error_code');

    if (errorDesc || errorCode) {
      setIsInvalidLink(true);
      if (errorCode === 'otp_expired' || (errorDesc && errorDesc.toLowerCase().includes('expired'))) {
        setError('ลิงก์สำหรับรีเซ็ตรหัสผ่านหมดอายุแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง');
      } else {
        setError(decodeURIComponent(errorDesc ? errorDesc.replace(/\+/g, ' ') : 'ลิงก์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุ'));
      }
      return;
    }

    // 2. Check if a recovery session exists or if code is being exchanged
    supabase.auth.getSession().then(({ data: { session } }) => {
      const hasTokenInUrl = params.get('code') || params.get('access_token');
      if (!session && !hasTokenInUrl) {
        setIsInvalidLink(true);
        setError('ไม่พบสิทธิ์การกู้คืนรหัสผ่าน หรือลิงก์หมดอายุแล้ว กรุณาขอลิงก์ใหม่อีกครั้ง');
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isInvalidLink) return;
    setError('');

    if (!password) {
      setError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }
    const policyError = validatePassword(password);
    if (policyError) {
      setError(policyError);
      return;
    }
    if (password !== confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
      return;
    }

    setLoading(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      if (onSuccess && data?.user) {
        setTimeout(() => {
          onSuccess(data.user);
        }, 2000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      const msg = err.message || '';
      if (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('auth')) {
        setIsInvalidLink(true);
        setError('เซสชันการกู้คืนรหัสผ่านหมดอายุแล้ว กรุณาขอลิงก์รีเซ็ตรหัสผ่านใหม่อีกครั้ง');
      } else {
        setError(msg || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่ ลิงก์อาจหมดอายุแล้ว กรุณาลองขอลิงก์ใหม่อีกครั้ง');
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({ id, label, value, onChange, show, onToggle, placeholder }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input id={id} className="input" type={show ? 'text' : 'password'} autoComplete="new-password" placeholder={placeholder} value={value} onChange={onChange} style={{ paddingRight: '2.25rem' }} required />
        <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={onToggle} aria-label={show ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'} style={{ position: 'absolute', right: 3 }}>
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <AuthLayout onBack={onBackToLogin} backLabel="เข้าสู่ระบบ">
      {success ? (
        <div className="animate-fade-in">
          <span className="tile" style={{ width: 40, height: 40, marginBottom: '1rem', background: 'var(--success-soft)', color: 'var(--success)', boxShadow: 'none' }}><CheckCircle2 size={18} /></span>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>เปลี่ยนรหัสผ่านสำเร็จ!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>รหัสผ่านใหม่ของคุณได้รับการอัปเดตเรียบร้อยแล้ว กำลังนำคุณเข้าสู่ระบบ...</p>
          <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => onSuccess && onSuccess()}>
            เข้าสู่หน้าหลัก <ArrowRight size={15} />
          </button>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <span className="workspace-logo" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: '1.1rem' }}><Lock size={16} /></span>
            <h1 style={{ fontSize: '1.375rem', letterSpacing: '-0.02em', fontWeight: 600 }}>ตั้งรหัสผ่านใหม่</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              {isInvalidLink ? 'ลิงก์การกู้คืนรหัสผ่านของคุณมีปัญหาหรือไม่ถูกต้อง' : 'กรุณากรอกรหัสผ่านใหม่ที่คุณต้องการใช้งานสำหรับ EXETIA'}
            </p>
          </div>

          {error && (
            <div role="alert" className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.8125rem', padding: '0.6rem 0.8rem', background: 'var(--error-soft)', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{error}</span>
            </div>
          )}

          {!isInvalidLink ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {PasswordField({ id: 'new-password', label: 'รหัสผ่านใหม่', value: password, onChange: (e) => setPassword(e.target.value), show: showPassword, onToggle: () => setShowPassword(!showPassword), placeholder: 'กรอกรหัสผ่านใหม่' })}
              <p className="hint" style={{ marginTop: -8 }}>{PASSWORD_HINT}</p>
              {PasswordField({ id: 'confirm-password', label: 'ยืนยันรหัสผ่านใหม่อีกครั้ง', value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), show: showConfirmPassword, onToggle: () => setShowConfirmPassword(!showConfirmPassword), placeholder: 'กรอกรหัสผ่านใหม่อีกครั้ง' })}
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%', marginTop: '0.25rem' }}>
                {loading ? 'กำลังบันทึกรหัสผ่าน...' : 'บันทึกรหัสผ่านใหม่'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={onBackToLogin} style={{ width: '100%' }}>กลับไปหน้าเข้าสู่ระบบ</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button type="button" className="btn btn-primary btn-lg" onClick={onBackToLogin} style={{ width: '100%' }}>
                <RotateCcw size={14} /> ไปหน้าขอลิงก์รีเซ็ตรหัสผ่านใหม่
              </button>
              <button type="button" className="btn btn-ghost" onClick={onBackToLogin} style={{ width: '100%' }}>กลับไปหน้าเข้าสู่ระบบ</button>
            </div>
          )}
        </div>
      )}
    </AuthLayout>
  );
}
