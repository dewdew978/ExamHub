import { useState, useEffect } from 'react';
import Home from './components/Home';
import Exam from './components/Exam';
import ExamIntro from './components/ExamIntro';
import { Pattern } from './components/Pattern';
import Schedule from './components/Schedule';
import Login from './components/Login';
import ScoreHistory from './components/ScoreHistory';
import Report from './components/Report';
import { BookOpen, Star, Sun, Moon, CalendarDays, LogIn, LogOut, User, History as HistoryIcon, ChevronDown, AlertTriangle } from 'lucide-react';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [reportInitialData, setReportInitialData] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [showChart, setShowChart] = useState(false);
  
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authRequiredMessage, setAuthRequiredMessage] = useState('');
  
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch subjects from Supabase
        const { data: examsData, error: examsError } = await supabase
          .from('exams')
          .select('*');
          
        if (examsError) throw examsError;
        
        const localIndex = await import('./data/index.json');
        const mergedSubjects = (examsData || []).map(exam => {
          const local = localIndex.default.find(l => l.id === exam.id);
          return {
            ...exam,
            requiresAuth: local?.requiresAuth || exam.requiresAuth || false
          };
        });
        setSubjects(mergedSubjects);

        // 2. Check auth status
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadUserScores(session.user.id);
          setCurrentView('home');
        } else {
          setCurrentView('login');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        try {
          const localIndex = await import('./data/index.json');
          setSubjects(localIndex.default);
        } catch (localErr) {
          console.error("Failed to load fallback local index:", localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserScores(session.user.id);
        setCurrentView('home');
      } else {
        setUser(null);
        setTotalScore(0);
        setCategoryScores({});
        setCurrentView('login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserScores = async (userId) => {
    try {
      const { data: scores, error } = await supabase
        .from('user_scores')
        .select('score, exam_id, exams(category)')
        .eq('user_id', userId);

      if (error) throw error;
      
      let total = 0;
      let categories = {};
      
      if (scores) {
        scores.forEach(s => {
          total += s.score;
          const cat = s.exams?.category;
          if (cat) {
            categories[cat] = (categories[cat] || 0) + s.score;
          }
        });
      }
      
      setTotalScore(total);
      setCategoryScores(categories);
    } catch (err) {
      console.error("Error loading scores:", err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const startExam = async (subjectId) => {
    try {
      const subjectMeta = subjects.find(s => s.id === subjectId);
      const mod = await import(`./data/${subjectId}.json`);
      
      const fullSubject = {
        ...subjectMeta,
        ...mod.default
      };

      if (fullSubject.requiresAuth && !user) {
        setAuthRequiredMessage(`กรุณาเข้าสู่ระบบก่อนเพื่อทำข้อสอบชุด "${fullSubject.name}"`);
        setCurrentView('login');
        return;
      }
      
      setSelectedSubject(fullSubject);
      setCurrentView('examIntro');
    } catch (err) {
      console.error("Failed to load exam data:", err);
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
    setReportInitialData(null);
  };

  const openReport = (data = null) => {
    setReportInitialData(data);
    setCurrentView('report');
    setShowMenu(false);
  };

  const addScore = async (score) => {
    setTotalScore((prev) => prev + score);
    if (selectedSubject) {
      setCategoryScores(prev => ({
        ...prev,
        [selectedSubject.category]: (prev[selectedSubject.category] || 0) + score
      }));
    }

    if (user && selectedSubject) {
      try {
        const { error } = await supabase
          .from('user_scores')
          .insert([
            { user_id: user.id, exam_id: selectedSubject.id, score }
          ]);
        
        if (error) throw error;
      } catch (err) {
        console.error("Error saving score:", err);
      }
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const allCategories = [...new Set(subjects.map(s => s.category))];
  
  const chartData = allCategories.map(category => {
    let shortName = category;
    if (category.includes('Intelligent System')) shortName = 'ISD';
    else if (category.includes('Data Visualization')) shortName = 'Data Viz';
    else if (category.includes('Medical Image')) shortName = 'Med Image';
    else shortName = category.split(' ')[0];

    return {
      skill: shortName,
      score: (categoryScores[category] || 0) * 10
    };
  });

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Hide header on login view
  if (currentView === 'login') {
    return (
      <div className="app-container">
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Login 
            authRequiredMessage={authRequiredMessage}
            onLogin={(user) => {
              setUser(user);
              setAuthRequiredMessage('');
              setCurrentView('home');
            }} 
            onClose={() => {
              setAuthRequiredMessage('');
              setCurrentView('home');
            }} // Guest mode
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <div style={{ 
            width: '24px', height: '24px', background: 'var(--text)', 
            color: 'var(--bg)', borderRadius: '6px', display: 'flex', 
            alignItems: 'center', justifyContent: 'center' 
          }}>
            <BookOpen size={14} />
          </div>
          <span className="logo-text">ExamHub</span>
        </a>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={toggleTheme}
            style={{ width: '36px', height: '36px', padding: 0 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <div style={{ position: 'relative' }}>
            <button 
              className={`btn ${['schedule', 'history', 'report'].includes(currentView) ? 'btn-primary' : 'btn-outline'}`} 
              onClick={() => setShowMenu(!showMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>เมนู</span>
              <ChevronDown size={14} />
            </button>
            
            {showMenu && (
              <>
                <div 
                  style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} 
                  onClick={() => setShowMenu(false)} 
                />
                <div 
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    zIndex: 50,
                    minWidth: '160px'
                  }}
                >
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.75rem 1rem',
                      background: currentView === 'schedule' ? 'rgba(0,112,243,0.1)' : 'transparent',
                      color: currentView === 'schedule' ? 'var(--accent)' : 'var(--text)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid var(--border)',
                      width: '100%'
                    }}
                    onClick={() => {
                      setCurrentView('schedule');
                      setShowMenu(false);
                    }}
                    onMouseOver={(e) => {
                      if (currentView !== 'schedule') e.currentTarget.style.background = 'var(--card)';
                    }}
                    onMouseOut={(e) => {
                      if (currentView !== 'schedule') e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    ตารางสอบ
                  </button>
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.75rem 1rem',
                      background: currentView === 'history' ? 'rgba(0,112,243,0.1)' : 'transparent',
                      color: currentView === 'history' ? 'var(--accent)' : 'var(--text)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      borderBottom: '1px solid var(--border)',
                      width: '100%'
                    }}
                    onClick={() => {
                      setCurrentView('history');
                      setShowMenu(false);
                    }}
                    onMouseOver={(e) => {
                      if (currentView !== 'history') e.currentTarget.style.background = 'var(--card)';
                    }}
                    onMouseOut={(e) => {
                      if (currentView !== 'history') e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    ประวัติคะแนน
                  </button>
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.75rem 1rem',
                      background: currentView === 'report' ? 'rgba(0,112,243,0.1)' : 'transparent',
                      color: currentView === 'report' ? 'var(--accent)' : 'var(--text)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      width: '100%'
                    }}
                    onClick={() => openReport()}
                    onMouseOver={(e) => {
                      if (currentView !== 'report') e.currentTarget.style.background = 'var(--card)';
                    }}
                    onMouseOut={(e) => {
                      if (currentView !== 'report') e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    รายงานข้อสอบผิด / ปัญหา
                  </button>
                </div>
              </>
            )}
          </div>
          
          <button className={`btn ${currentView === 'home' ? 'btn-primary' : 'btn-outline'}`} onClick={goHome}>
            <span>หน้าหลัก</span>
          </button>
          
          <button 
            className="btn"
            onClick={() => setShowChart(true)}
            style={{ 
              fontSize: '0.875rem', fontWeight: 600, display: 'flex', 
              alignItems: 'center', color: 'var(--accent)',
              boxShadow: 'var(--shadow-border)', padding: '0.5rem 0.75rem',
              borderRadius: '6px', background: 'rgba(0, 112, 243, 0.1)'
            }}
          >
            <span>{totalScore} คะแนน</span>
          </button>
          
          {user ? (
            <button className="btn btn-outline" onClick={() => setShowLogoutConfirm(true)} title={user.email}>
              <LogOut size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentView('login')}>
              <LogIn size={16} />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {currentView === 'home' && (
          <Home 
            subjects={subjects} 
            onSelectSubject={startExam} 
            user={user}
            onRequireLogin={(subject) => {
              setAuthRequiredMessage(`กรุณาเข้าสู่ระบบก่อนเพื่อทำข้อสอบชุด "${subject?.name || ''}"`);
              setCurrentView('login');
            }}
            onOpenReport={openReport}
          />
        )}
        {currentView === 'examIntro' && selectedSubject && (
          <ExamIntro 
            subject={selectedSubject} 
            onBack={goHome} 
            onStart={() => setCurrentView('exam')} 
          />
        )}
        {currentView === 'exam' && selectedSubject && (
          <Exam 
            subject={selectedSubject} 
            onBack={goHome} 
            onComplete={addScore} 
            onReport={openReport}
          />
        )}
        {currentView === 'schedule' && (
          <Schedule />
        )}
        {currentView === 'history' && user && (
          <ScoreHistory user={user} />
        )}
        {currentView === 'history' && !user && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <p>กรุณาเข้าสู่ระบบเพื่อดูประวัติคะแนน</p>
            <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setCurrentView('login')}>เข้าสู่ระบบ</button>
          </div>
        )}
        {currentView === 'report' && (
          <Report 
            subjects={subjects} 
            initialData={reportInitialData} 
            user={user} 
            onBack={goHome} 
          />
        )}
      </main>
      
      {showChart && (
        <Pattern data={chartData} onClose={() => setShowChart(false)} />
      )}

      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card animate-fade-in" style={{ padding: '2.5rem', maxWidth: '400px', width: '90%', textAlign: 'center' }}>
            <LogOut size={48} style={{ color: 'var(--error)', margin: '0 auto 1.5rem', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>ยืนยันการออกจากระบบ</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ ExamHub?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-outline" onClick={() => setShowLogoutConfirm(false)}>
                ยกเลิก
              </button>
              <button 
                className="btn btn-primary" 
                style={{ background: 'var(--error)', color: 'white', borderColor: 'var(--error)' }}
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
