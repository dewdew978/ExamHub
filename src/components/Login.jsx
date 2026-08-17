import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export default function Login({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError('');
    setPasswordError('');

    let hasError = false;
    if (!email) {
      setEmailError('กรุณากรอกอีเมล');
      hasError = true;
    }
    if (!password) {
      setPasswordError('กรุณากรอกรหัสผ่าน');
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        if (data?.user) {
          if (data.user.identities && data.user.identities.length === 0) {
            throw new Error('User already registered');
          }
          onLogin(data.user);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        if (data?.user) {
          onLogin(data.user);
        }
      }
    } catch (err) {
      let errorMessage = err.message || 'An error occurred during authentication';
      if (isSignUp && errorMessage.toLowerCase().includes('already registered')) {
        errorMessage = 'มีบัญชีนี้อยู่ในระบบแล้ว กรุณากด Sign in';
      } else if (!isSignUp && errorMessage.toLowerCase().includes('invalid login credentials')) {
        errorMessage = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '80vh', width: '100%', position: 'relative'
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '600px', height: '400px',
        background: 'radial-gradient(circle, rgba(0, 112, 243, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }}></div>

      <div className="card animate-fade-in" style={{
        padding: '2.5rem 2rem', width: '100%', maxWidth: '380px', 
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        zIndex: 1, backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
          <div style={{ 
            width: '48px', height: '48px', background: 'var(--text)', color: 'var(--bg)', 
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 0.5rem auto', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            transform: 'scale(1)', transition: 'transform 0.2s ease'
          }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </div>
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px', transition: 'all 0.3s ease' }}>{isSignUp ? 'Create an account' : 'Welcome to ExamHub'}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {isSignUp ? 'Enter your email below to create your account' : 'Sign in to save your scores and track your progress'}
          </p>
        </div>
        
        {error && <div className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', padding: '0.75rem', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}
        
        <form noValidate onSubmit={handleAuth} className="grid gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                  fontSize: '0.875rem', transition: 'all 0.2s ease',
                  outline: 'none', boxShadow: emailError ? '0 0 0 2px rgba(255,0,0,0.1)' : 'none'
                }}
                onFocus={(e) => !emailError && (e.target.style.boxShadow = 'var(--focus-ring)', e.target.style.borderColor = 'var(--accent)')}
                onBlur={(e) => !emailError && (e.target.style.boxShadow = 'none', e.target.style.borderColor = 'var(--border-color)')}
              />
              {emailError && <span className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '2px' }}>{emailError}</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
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
                    fontSize: '0.875rem', transition: 'all 0.2s ease',
                    outline: 'none', boxShadow: passwordError ? '0 0 0 2px rgba(255,0,0,0.1)' : 'none'
                  }}
                  onFocus={(e) => !passwordError && (e.target.style.boxShadow = 'var(--focus-ring)', e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => !passwordError && (e.target.style.boxShadow = 'none', e.target.style.borderColor = 'var(--border-color)')}
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute', right: '0.5rem', background: 'none', border: 'none', 
                    cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0.25rem', borderRadius: '4px', transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              {passwordError && <span className="animate-fade-in" style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '2px' }}>{passwordError}</span>}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', transition: 'transform 0.1s ease', transform: loading ? 'scale(0.98)' : 'scale(1)' }}
              onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                  Processing...
                </span>
              ) : (isSignUp ? 'สมัครสมาชิก (Sign up)' : 'เข้าสู่ระบบ (Sign in)')}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
              <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>หรือ</span>
              <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
            </div>
            
            <button 
              type="button"
              className="btn"
              onClick={onClose}
              style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'all 0.2s ease' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              เข้าสู่ระบบแบบไม่ระบุตัวตน (Guest)
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
          </span>
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            style={{ 
              background: 'none', border: 'none', color: 'var(--accent)', 
              fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'opacity 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
          >
            {isSignUp ? 'เข้าสู่ระบบ (Sign in)' : 'สมัครสมาชิก (Sign up)'}
          </button>
        </div>
      </div>
    </div>
  );
}
