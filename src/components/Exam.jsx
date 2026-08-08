import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, RotateCcw, Home as HomeIcon, Check } from 'lucide-react';

export default function Exam({ subject, onBack, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(subject.questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const q = subject.questions[currentQ];
  const answered = answers[currentQ] !== null;
  const isCorrect = answered && answers[currentQ] === q.answer;

  const handleSelect = (idx) => {
    if (answered) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < subject.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Complete exam
      const score = answers.reduce((sum, ans, idx) => {
        return sum + (ans === subject.questions[idx].answer ? 1 : 0);
      }, 0);
      onComplete(score);
      setShowResult(true);
    }
  };

  const getChoiceClass = (idx) => {
    if (!answered) return 'choice-btn';
    if (idx === q.answer) return 'choice-btn correct';
    if (answers[currentQ] === idx && idx !== q.answer) return 'choice-btn wrong';
    return 'choice-btn disabled';
  };

  if (showResult) {
    const total = subject.questions.length;
    const score = answers.reduce((sum, ans, idx) => sum + (ans === subject.questions[idx].answer ? 1 : 0), 0);
    const pct = Math.round((score / total) * 100);
    const wrong = answers.filter((a, i) => a !== null && a !== subject.questions[i].answer).length;
    const skipped = answers.filter(a => a === null).length;

    let emoji = '🎉';
    if (pct < 80) emoji = '😊';
    if (pct < 60) emoji = '😅';
    if (pct < 40) emoji = '😓';

    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{emoji}</div>
          <div className="text-gradient" style={{ fontSize: '4rem', fontFamily: 'var(--font-serif)', fontWeight: '900', lineHeight: 1 }}>
            {score}/{total}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginTop: '1rem', marginBottom: '2rem' }}>คะแนนที่คุณทำได้</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '16px', marginBottom: '3rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--success)' }}>{score}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ถูก</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--error)' }}>{wrong}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ผิด</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>{skipped}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ข้าม</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>{pct}%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>เปอร์เซ็นต์</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => {
              setAnswers(Array(subject.questions.length).fill(null));
              setCurrentQ(0);
              setShowResult(false);
            }}>
              <RotateCcw size={18} />
              ลองใหม่
            </button>
            <button className="btn btn-primary" onClick={onBack}>
              <HomeIcon size={18} />
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            width: '48px', height: '48px',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{subject.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subject.desc}</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface-hover)', height: '6px', borderRadius: '3px', marginBottom: '0.5rem', overflow: 'hidden' }}>
        <div style={{ 
          height: '100%', 
          background: 'var(--accent-gradient)', 
          width: `${((currentQ) / subject.questions.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        <span>ข้อที่ {currentQ + 1} จาก {subject.questions.length}</span>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
        <div style={{ color: 'var(--accent)', fontSize: '0.875rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Question {currentQ + 1}
        </div>
        <h3 style={{ fontSize: '1.25rem', lineHeight: '1.8', marginBottom: '2rem', fontWeight: '500' }}>
          {q.q}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {q.choices.map((choice, idx) => {
            const isSelected = answers[currentQ] === idx;
            const isRight = answered && idx === q.answer;
            const isWrong = answered && isSelected && !isRight;

            let btnStyle = {
              background: 'var(--surface-hover)',
              border: '2px solid var(--border)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              cursor: answered ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              color: 'var(--text)',
              fontSize: '1rem',
              opacity: (answered && !isSelected && !isRight) ? 0.5 : 1
            };

            if (isRight) {
              btnStyle.borderColor = 'var(--success)';
              btnStyle.background = 'rgba(16, 185, 129, 0.1)';
            } else if (isWrong) {
              btnStyle.borderColor = 'var(--error)';
              btnStyle.background = 'rgba(239, 68, 68, 0.1)';
            } else if (!answered) {
              // hover effect handled by css class or inline
            }

            return (
              <button 
                key={idx} 
                style={btnStyle}
                onClick={() => handleSelect(idx)}
                onMouseEnter={!answered ? e => e.currentTarget.style.borderColor = 'var(--accent)' : null}
                onMouseLeave={!answered ? e => e.currentTarget.style.borderColor = 'var(--border)' : null}
              >
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : 'rgba(255,255,255,0.1)',
                  color: (isRight || isWrong) ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '1rem'
                }}>
                  {isRight ? <CheckCircle size={18} /> : isWrong ? <XCircle size={18} /> : String.fromCharCode(65 + idx)}
                </div>
                <span style={{ lineHeight: '1.6' }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-in" style={{ 
            marginTop: '2rem', 
            padding: '1.5rem', 
            background: 'rgba(16, 185, 129, 0.05)', 
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '16px' 
          }}>
            <div style={{ color: 'var(--success)', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={18} /> เฉลยและคำอธิบาย
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7' }}>
              {q.explain}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={nextQuestion}
        >
          {currentQ < subject.questions.length - 1 ? 'ข้อถัดไป' : 'ดูผลคะแนน'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
