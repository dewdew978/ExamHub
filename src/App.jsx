import { useState, useEffect } from 'react';
import Home from './components/Home';
import Exam from './components/Exam';
import Calculator from './components/Calculator';
import Scratchpad from './components/Scratchpad';
import { BookOpen, Star, Sun, Moon } from 'lucide-react';
import './index.css';
import indexData from './data/index.json';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const startExam = async (subjectId) => {
    // Dynamic import the json data
    const mod = await import(`./data/${subjectId}.json`);
    setSelectedSubject(mod.default);
    setCurrentView('exam');
  };

  const goHome = () => {
    setCurrentView('home');
    setSelectedSubject(null);
  };

  const addScore = (score) => {
    setTotalScore((prev) => prev + score);
  };

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
          <span>ExamHub</span>
        </a>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={toggleTheme}
            style={{ width: '36px', height: '36px', padding: 0 }}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className="btn btn-outline" onClick={goHome}>
            หน้าหลัก
          </button>
          <div style={{ 
            fontSize: '0.875rem', fontWeight: 500, display: 'flex', 
            alignItems: 'center', gap: '0.375rem', color: 'var(--text-muted)',
            boxShadow: 'var(--shadow-border)', padding: '0.5rem 0.75rem',
            borderRadius: '6px', background: 'var(--surface)'
          }}>
            <Star size={14} />
            <span>{totalScore} คะแนน</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {currentView === 'home' && (
          <Home subjects={indexData} onSelectSubject={startExam} />
        )}
        {currentView === 'exam' && selectedSubject && (
          <Exam 
            subject={selectedSubject} 
            onBack={goHome} 
            onComplete={addScore} 
          />
        )}
      </main>
      <Calculator />
      <Scratchpad />
    </div>
  );
}

export default App;
