import { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if dismissed recently in this session
    const isDismissed = sessionStorage.getItem('examhub_pwa_dismissed');
    if (isDismissed) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Wait 3 seconds before showing so it doesn't interrupt the initial page experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('examhub_pwa_dismissed', 'installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSTip(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('examhub_pwa_dismissed', 'true');
  };

  if (!isVisible && !showIOSTip) return null;

  return (
    <>
      {isVisible && (
        <aside 
          aria-label="ติดตั้งแอปพลิเคชัน ExamHub"
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            right: '1.25rem',
            zIndex: 9999,
            maxWidth: '380px',
            width: 'calc(100% - 2.5rem)',
            background: 'var(--surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(134, 59, 255, 0.2)',
            padding: '1rem 1.15rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 14px rgba(134, 59, 255, 0.4)'
            }}>
              <Smartphone size={22} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  ติดตั้งแอป ExamHub
                  <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                </h4>
                <button
                  onClick={handleDismiss}
                  aria-label="ปิดหน้าต่างแนะนำการติดตั้ง"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <p style={{
                margin: '0 0 0.85rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                lineHeight: 1.45
              }}>
                ฝึกทำข้อสอบได้รวดเร็วทันใจ พร้อมรองรับการใช้งานแบบออฟไลน์ เสมือนแอปบนมือถือของคุณ
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={handleInstallClick}
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <Download size={14} />
                  ติดตั้งทันที
                </button>
                <button
                  onClick={handleDismiss}
                  className="btn btn-outline"
                  style={{
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.825rem',
                    borderRadius: '8px'
                  }}
                >
                  ไว้คราวหน้า
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {showIOSTip && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.25rem'
          }}
          onClick={() => setShowIOSTip(false)}
        >
          <div 
            className="card animate-fade-in"
            style={{
              maxWidth: '380px',
              width: '100%',
              padding: '1.75rem 1.5rem',
              borderRadius: '16px',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'var(--accent)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Smartphone size={28} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              วิธีติดตั้งบน iPhone / iPad
            </h3>
            <div style={{ 
              textAlign: 'left', 
              fontSize: '0.875rem', 
              color: 'var(--text-muted)', 
              lineHeight: 1.6,
              background: 'var(--surface-hover)',
              padding: '1rem',
              borderRadius: '10px',
              margin: '1rem 0 1.25rem'
            }}>
              <p style={{ margin: '0 0 0.5rem' }}>1. กดปุ่ม <strong>แชร์ (Share / ⎋)</strong> ที่แถบเมนู Safari</p>
              <p style={{ margin: '0 0 0.5rem' }}>2. เลื่อนลงมาแล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong></p>
              <p style={{ margin: 0 }}>3. กด <strong>"เพิ่ม" (Add)</strong> มุมขวาบน เพื่อเริ่มใช้งาน</p>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowIOSTip(false)}
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      )}
    </>
  );
}
