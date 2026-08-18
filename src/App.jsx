import { useState, useEffect } from 'react';
import Home from './components/Home';
import Exam from './components/Exam';
import { Pattern } from './components/Pattern';
import Schedule from './components/Schedule';
import Login from './components/Login';
import ScoreHistory from './components/ScoreHistory';
import { BookOpen, Star, Sun, Moon, CalendarDays, LogIn, LogOut, User, History as HistoryIcon } from 'lucide-react';
import { supabase } from './lib/supabase';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [categoryScores, setCategoryScores] = useState({});
  const [showChart, setShowChart] = useState(false);
  
  const [subjects, setSubjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
        setSubjects(examsData || []);

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
      const mod = await import(`./data/${subjectId}.json`);
      const subjectMeta = subjects.find(s => s.id === subjectId);
      
      setSelectedSubject({
        ...subjectMeta,
        ...mod.default
      });
      setCurrentView('exam');
    } catch (err) {
      console.error("Failed to load exam data:", err);
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
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
            onLogin={(user) => {
              setUser(user);
              setCurrentView('home');
            }} 
            onClose={() => setCurrentView('home')} // Guest mode
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
          
          <button className={`btn ${currentView === 'schedule' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCurrentView('schedule')}>
            <span>ตารางสอบ</span>
          </button>

          <button className={`btn ${currentView === 'history' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCurrentView('history')}>
            <span>ประวัติคะแนน</span>
          </button>
          
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
            <button className="btn btn-outline" onClick={handleLogout} title={user.email}>
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
          <Home subjects={subjects} onSelectSubject={startExam} />
        )}
        {currentView === 'exam' && selectedSubject && (
          <Exam 
            subject={selectedSubject} 
            onBack={goHome} 
            onComplete={addScore} 
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
      </main>
      
      {showChart && (
        <Pattern data={chartData} onClose={() => setShowChart(false)} />
      )}
    </div>
  );
}

export default App;
