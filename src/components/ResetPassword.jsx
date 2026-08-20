import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, EyeOff, Lock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ResetPassword({ onSuccess, onBackToLogin }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('กรุณากรอกรหัสผ่านใหม่');
      return;
    }
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
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
      setError(err.message || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่ ลิงก์อาจหมดอายุแล้ว กรุณาลองขอลิงก์ใหม่อีกครั้ง');
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
        .reset-card {
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
          .reset-card {
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

      <div className="card reset-card animate-fade-in">
        {success ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              เปลี่ยนรหัสผ่านสำเร็จ!
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              รหัสผ่านใหม่ของคุณได้รับการอัปเดตเรียบร้อยแล้ว กำลังนำคุณเข้าสู่ระบบ...
            </p>
            <button 
              className="btn btn-primary"
              style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => onSuccess && onSuccess()}
            >
              <span>เข้าสู่หน้าหลัก</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center' }}>
              <div style={{ 
                width: '42px', height: '42px', background: 'var(--text)', color: 'var(--bg)', 
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.4rem auto', boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}>
                <Lock size={20} />
              </div>
              <h2 style={{ fontSize: '1.25rem', letterSpacing: '-0.3px', margin: 0, fontWeight: 600 }}>
                ตั้งรหัสผ่านใหม่
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
                กรุณากรอกรหัสผ่านใหม่ที่คุณต้องการใช้งานสำหรับ ExamHub
              </p>
            </div>

            {error && (
              <div className="animate-fade-in" style={{ 
                color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', 
                padding: '0.75rem', background: 'rgba(255,0,0,0.1)', 
                borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center'
              }}>
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* New Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่านใหม่"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                      color: 'var(--text)', fontSize: '0.875rem', outline: 'none'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.5rem', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  ยืนยันรหัสผ่านใหม่อีกครั้ง
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%', padding: '0.65rem 2.5rem 0.65rem 0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border-color)', background: 'var(--surface-hover)',
                      color: 'var(--text)', fontSize: '0.875rem', outline: 'none'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute', right: '0.5rem', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', height: '44px', marginTop: '0.5rem', fontWeight: 600 }}
              >
                {loading ? 'กำลังบันทึกรหัสผ่าน...' : 'บันทึกรหัสผ่านใหม่'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={onBackToLogin}
                style={{ width: '100%', height: '40px', fontSize: '0.85rem' }}
              >
                กลับไปหน้าเข้าสู่ระบบ
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
