import { useState, useEffect } from 'react';
import Home from './components/Home';
import Exam from './components/Exam';
import ExamIntro from './components/ExamIntro';
import { Pattern } from './components/Pattern';
import Schedule from './components/Schedule';
import Login from './components/Login';
import ScoreHistory from './components/ScoreHistory';
import Report from './components/Report';
import AdminDashboard from './components/AdminDashboard';
import UserSettings from './components/UserSettings';
import { BookOpen, Star, Sun, Moon, CalendarDays, LogIn, LogOut, History as HistoryIcon, ChevronDown, AlertTriangle, Menu, X, ShieldAlert, ShieldCheck, User } from 'lucide-react';
import { supabase, checkIsAdmin } from './lib/supabase';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [showMenu, setShowMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        let mergedSubjects = (examsData || []).map(exam => {
          const local = localIndex.default.find(l => l.id === exam.id);
          const customKey = `examhub_custom_exam_${exam.id}`;
          const savedCustom = localStorage.getItem(customKey);
          let customQuestionCount = exam.questionCount;
          if (savedCustom) {
            try {
              const parsed = JSON.parse(savedCustom);
              if (parsed.questions) customQuestionCount = parsed.questions.length;
            } catch (e) {
              console.warn(e);
            }
          }
          return {
            ...exam,
            questionCount: customQuestionCount,
            requiresAuth: local?.requiresAuth || exam.requiresAuth || false
          };
        });

        // Add newly created exams from localStorage if any
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('examhub_custom_exam_')) {
            try {
              const customExam = JSON.parse(localStorage.getItem(key));
              if (customExam && customExam.id && !mergedSubjects.some(s => s.id === customExam.id)) {
                mergedSubjects.push({
                  id: customExam.id,
                  name: customExam.name,
                  category: customExam.category || 'General',
                  icon: customExam.icon || '📝',
                  color: customExam.color || '#0070f3',
                  iconBg: customExam.iconBg || 'rgba(0, 112, 243, 0.15)',
                  desc: customExam.desc || '',
                  questionCount: customExam.questions?.length || 0,
                  year: customExam.year || 3,
                  type: customExam.type || 'Midterm'
                });
              }
            } catch (e) {
              console.warn(e);
            }
          }
        }
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
      const subjectMeta = subjects.find(s => s.id === subjectId) || {};
      let examData = null;

      // 1. Check custom saved exam in localStorage first
      const customKey = `examhub_custom_exam_${subjectId}`;
      const savedCustom = localStorage.getItem(customKey);
      if (savedCustom) {
        try {
          examData = JSON.parse(savedCustom);
        } catch (e) {
          console.warn("Failed to parse custom exam:", e);
        }
      }

      // 2. Fallback to bundled JSON file
      if (!examData) {
        try {
          const mod = await import(`./data/${subjectId}.json`);
          examData = mod.default;
        } catch (err) {
          console.warn("Could not load local json file:", err);
          examData = { questions: [] };
        }
      }
      
      const fullSubject = {
        ...subjectMeta,
        ...examData
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
    setShowMobileMenu(false);
  };

  const openReport = (data = null) => {
    setReportInitialData(data);
    setCurrentView('report');
    setShowMenu(false);
    setShowMobileMenu(false);
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

  const isAdmin = checkIsAdmin(user);

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

  // Full-Screen Flux-AgentOps Style Admin Dashboard
  if (currentView === 'admin_reports' && isAdmin) {
    return (
      <AdminDashboard 
        subjects={subjects} 
        user={user} 
        onBack={goHome} 
      />
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
        
        {/* Desktop / Laptop / iPad Navigation (screens > 768px) */}
        <div className="nav-desktop">
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
              className={`btn ${['schedule', 'history', 'report', 'admin_reports', 'settings'].includes(currentView) ? 'btn-primary' : 'btn-outline'}`} 
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
                    minWidth: '200px'
                  }}
                >
                  {user && (
                    <button 
                      style={{
                        fontFamily: 'inherit',
                        padding: '0.75rem 1rem',
                        background: currentView === 'settings' ? 'rgba(0,112,243,0.1)' : 'transparent',
                        color: currentView === 'settings' ? 'var(--accent)' : 'var(--text)',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        borderBottom: '1px solid var(--border)',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={() => {
                        setCurrentView('settings');
                        setShowMenu(false);
                      }}
                      onMouseOver={(e) => {
                        if (currentView !== 'settings') e.currentTarget.style.background = 'var(--card)';
                      }}
                      onMouseOut={(e) => {
                        if (currentView !== 'settings') e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <User size={14} color="var(--accent)" />
                      <span>ข้อมูลส่วนตัว & ตั้งค่า</span>
                    </button>
                  )}
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
                      borderBottom: isAdmin ? '1px solid var(--border)' : 'none',
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
                  {isAdmin && (
                    <button 
                      style={{
                        fontFamily: 'inherit',
                        padding: '0.75rem 1rem',
                        background: currentView === 'admin_reports' ? 'rgba(0,112,243,0.1)' : 'transparent',
                        color: currentView === 'admin_reports' ? 'var(--accent)' : 'var(--text)',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onClick={() => {
                        setCurrentView('admin_reports');
                        setShowMenu(false);
                      }}
                      onMouseOver={(e) => {
                        if (currentView !== 'admin_reports') e.currentTarget.style.background = 'var(--card)';
                      }}
                      onMouseOut={(e) => {
                        if (currentView !== 'admin_reports') e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <ShieldCheck size={14} color="var(--accent)" />
                      <span>แดชบอร์ดจัดการ (Admin)</span>
                    </button>
                  )}
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
            <button className="btn btn-outline" onClick={() => setShowLogoutConfirm(true)} title={`ออกจากระบบ (${user.email})`}>
              <LogOut size={16} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => setCurrentView('login')}>
              <LogIn size={16} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Navigation (<= 768px): All options in a Single Dropdown */}
        <div className="nav-mobile" style={{ position: 'relative' }}>
          <button 
            className={`btn ${showMobileMenu ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.45rem 0.75rem' }}
            aria-label="เปิดเมนู"
          >
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>เมนู</span>
          </button>

          {showMobileMenu && (
            <>
              <div 
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 60 }} 
                onClick={() => setShowMobileMenu(false)} 
              />
              <div 
                className="card animate-fade-in"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  zIndex: 70,
                  minWidth: '240px',
                  maxWidth: 'calc(100vw - 2rem)'
                }}
              >
                {/* 0. ข้อมูลผู้ใช้ & ตั้งค่าโปรไฟล์ */}
                {user && (
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.875rem 1rem',
                      background: currentView === 'settings' ? 'var(--surface-hover)' : 'rgba(0, 112, 243, 0.05)',
                      color: currentView === 'settings' ? 'var(--accent)' : 'var(--text)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      borderBottom: '1px solid var(--border-divider)'
                    }}
                    onClick={() => {
                      setCurrentView('settings');
                      setShowMobileMenu(false);
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {user?.user_metadata?.avatar_emoji || '🎓'}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.user_metadata?.nickname || user?.email?.split('@')[0]}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>
                        ตั้งค่าโปรไฟล์ส่วนตัว & รหัสผ่าน
                      </span>
                    </div>
                  </button>
                )}

                {/* 1. หน้าหลัก */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: currentView === 'home' ? 'var(--surface-hover)' : 'transparent',
                    color: currentView === 'home' ? 'var(--accent)' : 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    fontWeight: currentView === 'home' ? 600 : 400
                  }}
                  onClick={() => {
                    goHome();
                    setShowMobileMenu(false);
                  }}
                >
                  <BookOpen size={16} />
                  <span>หน้าหลัก (Home)</span>
                </button>

                {/* 2. ตารางสอบ */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: currentView === 'schedule' ? 'var(--surface-hover)' : 'transparent',
                    color: currentView === 'schedule' ? 'var(--accent)' : 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    fontWeight: currentView === 'schedule' ? 600 : 400
                  }}
                  onClick={() => {
                    setCurrentView('schedule');
                    setShowMobileMenu(false);
                  }}
                >
                  <CalendarDays size={16} />
                  <span>ตารางสอบ</span>
                </button>

                {/* 3. ประวัติคะแนน */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: currentView === 'history' ? 'var(--surface-hover)' : 'transparent',
                    color: currentView === 'history' ? 'var(--accent)' : 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    fontWeight: currentView === 'history' ? 600 : 400
                  }}
                  onClick={() => {
                    setCurrentView('history');
                    setShowMobileMenu(false);
                  }}
                >
                  <HistoryIcon size={16} />
                  <span>ประวัติคะแนน</span>
                </button>

                {/* 4. คะแนนสะสม & เรดาร์ทักษะ */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: 'transparent',
                    color: 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                  onClick={() => {
                    setShowChart(true);
                    setShowMobileMenu(false);
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Star size={16} color="var(--accent)" />
                    <span>คะแนนสะสม & ทักษะ</span>
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.125rem 0.5rem', 
                    borderRadius: '999px', 
                    background: 'rgba(0,112,243,0.1)', 
                    color: 'var(--accent)', 
                    fontWeight: 600 
                  }}>
                    {totalScore}
                  </span>
                </button>

                {/* 5. รายงานข้อสอบผิด */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: currentView === 'report' ? 'var(--surface-hover)' : 'transparent',
                    color: currentView === 'report' ? 'var(--accent)' : 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    fontWeight: currentView === 'report' ? 600 : 400
                  }}
                  onClick={() => {
                    openReport();
                    setShowMobileMenu(false);
                  }}
                >
                  <AlertTriangle size={16} />
                  <span>รายงานข้อสอบผิด / ปัญหา</span>
                </button>

                {/* 6. แดชบอร์ดจัดการ (Admin Hub) */}
                {isAdmin && (
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.875rem 1rem',
                      background: currentView === 'admin_reports' ? 'var(--surface-hover)' : 'transparent',
                      color: currentView === 'admin_reports' ? 'var(--accent)' : 'var(--text)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      fontWeight: currentView === 'admin_reports' ? 600 : 400
                    }}
                    onClick={() => {
                      setCurrentView('admin_reports');
                      setShowMobileMenu(false);
                    }}
                  >
                    <ShieldCheck size={16} color="var(--accent)" />
                    <span>แดชบอร์ดจัดการ (Admin)</span>
                  </button>
                )}

                <div style={{ height: '1px', background: 'var(--border-divider)', margin: '0.25rem 0' }} />

                {/* 6. สลับธีม */}
                <button 
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.875rem 1rem',
                    background: 'transparent',
                    color: 'var(--text)',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                  onClick={() => {
                    toggleTheme();
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>ธีม (Theme)</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {theme === 'dark' ? 'มืด (Dark)' : 'สว่าง (Light)'}
                  </span>
                </button>

                <div style={{ height: '1px', background: 'var(--border-divider)', margin: '0.25rem 0' }} />

                {/* 7. Login / Logout */}
                {user ? (
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.875rem 1rem',
                      background: 'transparent',
                      color: 'var(--error)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%'
                    }}
                    onClick={() => {
                      setShowMobileMenu(false);
                      setShowLogoutConfirm(true);
                    }}
                  >
                    <LogOut size={16} />
                    <span>ออกจากระบบ ({user.email?.split('@')[0]})</span>
                  </button>
                ) : (
                  <button 
                    style={{
                      fontFamily: 'inherit',
                      padding: '0.875rem 1rem',
                      background: 'var(--surface-hover)',
                      color: 'var(--accent)',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      width: '100%',
                      fontWeight: 600
                    }}
                    onClick={() => {
                      setShowMobileMenu(false);
                      setCurrentView('login');
                    }}
                  >
                    <LogIn size={16} />
                    <span>เข้าสู่ระบบ (Login)</span>
                  </button>
                )}
              </div>
            </>
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
            onOpenAdminReports={isAdmin ? () => setCurrentView('admin_reports') : null}
          />
        )}
        {currentView === 'admin_reports' && isAdmin && (
          <AdminDashboard 
            subjects={subjects} 
            user={user} 
            onBack={goHome} 
          />
        )}
        {currentView === 'admin_reports' && !user && (
          <div className="card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '3rem auto', borderRadius: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldAlert size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              เฉพาะผู้ดูแลระบบ (Admin Only)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              หน้านี้จำกัดสิทธิ์เฉพาะผู้ดูแลระบบ กรุณาเข้าสู่ระบบด้วยบัญชี Admin เพื่อเข้าถึงข้อมูล
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-outline" onClick={goHome}>กลับสู่หน้าหลัก</button>
              <button className="btn btn-primary" onClick={() => setCurrentView('login')}>เข้าสู่ระบบ</button>
            </div>
          </div>
        )}
        {currentView === 'admin_reports' && user && !isAdmin && (
          <div className="card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '3rem auto', borderRadius: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)', color: 'var(--error)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldAlert size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              คุณไม่มีสิทธิ์เข้าถึงหน้านี้
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              บัญชีของคุณ ({user.email}) ไม่ใช่บัญชีผู้ดูแลระบบ (Admin) ไม่สามารถดูรายการรายงานปัญหาได้
            </p>
            <button className="btn btn-primary" onClick={goHome}>กลับสู่หน้าหลัก</button>
          </div>
        )}
        {currentView === 'settings' && user && (
          <UserSettings 
            user={user} 
            onBack={goHome} 
            onUserUpdated={(updatedUser) => setUser(updatedUser)} 
            totalScore={totalScore}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        )}
        {currentView === 'settings' && !user && (
          <div className="card animate-fade-in" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '500px', margin: '3rem auto', borderRadius: '16px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(0, 112, 243, 0.12)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <User size={36} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
              กรุณาเข้าสู่ระบบ
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลส่วนตัวและตั้งค่าการใช้งาน
            </p>
            <button className="btn btn-primary" onClick={() => setCurrentView('login')}>เข้าสู่ระบบ</button>
          </div>
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
