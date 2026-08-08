import { useState, useEffect } from 'react';
import Home from './components/Home';
import Exam from './components/Exam';
import { BookOpen, Star } from 'lucide-react';
import './index.css';
import indexData from './data/index.json';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

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
      <header className="header glass">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); goHome(); }}>
          <BookOpen className="text-blue-500" />
          <span>Exam<span className="text-gradient">Hub</span></span>
        </a>
        
        <div className="flex items-center gap-4">
          <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }} onClick={goHome}>
            หน้าหลัก
          </button>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontWeight: '600' }}>
            <Star size={18} fill="currentColor" />
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
    </div>
  );
}

export default App;
