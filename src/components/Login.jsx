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
      minHeight: '80vh', width: '100%'
    }}>
      <div className="card" style={{
        padding: '2rem', width: '100%', maxWidth: '380px', 
        display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.5px' }}>{isSignUp ? 'Create an account' : 'ExamHub'}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {isSignUp ? 'Enter your email below to create your account' : 'Sign in to save your scores and track your progress'}
          </p>
        </div>
        
        {error && <div style={{ color: 'var(--error)', fontSize: '0.875rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(255,0,0,0.1)', borderRadius: '6px' }}>{error}</div>}
        
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
                  width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', 
                  border: `1px solid ${emailError ? 'var(--error)' : 'var(--border-color)'}`, 
                  background: 'transparent', color: 'var(--text)',
                  fontSize: '0.875rem'
                }}
              />
              {emailError && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '2px' }}>{emailError}</span>}
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
                    width: '100%', padding: '0.5rem 2.5rem 0.5rem 0.75rem', borderRadius: '6px', 
                    border: `1px solid ${passwordError ? 'var(--error)' : 'var(--border-color)'}`, 
                    background: 'transparent', color: 'var(--text)',
                    fontSize: '0.875rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute', right: '0.5rem', background: 'none', border: 'none', 
                    cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
              {passwordError && <span style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '2px' }}>{passwordError}</span>}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {loading ? 'Processing...' : (isSignUp ? 'สมัครสมาชิก (Sign up)' : 'เข้าสู่ระบบ (Sign in)')}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
              <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>หรือ</span>
              <div style={{ height: '1px', background: 'var(--border-divider)', flex: 1 }}></div>
            </div>
            
            <button 
              type="button"
              className="btn"
              onClick={onClose}
              style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)' }}
            >
              เข้าสู่ระบบแบบไม่ระบุตัวตน (Guest)
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isSignUp ? 'มีบัญชีอยู่แล้ว? ' : 'ยังไม่มีบัญชี? '}
          </span>
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null); // Clear errors on toggle
            }}
            style={{ 
              background: 'none', border: 'none', color: 'var(--text)', 
              fontWeight: 500, cursor: 'pointer', textDecoration: 'underline',
              fontFamily: 'inherit'
            }}
          >
            {isSignUp ? 'เข้าสู่ระบบ (Sign in)' : 'สมัครสมาชิก (Sign up)'}
          </button>
        </div>
      </div>
    </div>
  );
}
