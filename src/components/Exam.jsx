import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, ChevronLeft, RotateCcw, Home as HomeIcon, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

const renderTextWithMath = (text) => {
  if (typeof text !== 'string') return text;
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

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
      const score = answers.reduce((sum, ans, idx) => {
        return sum + (ans === subject.questions[idx].answer ? 1 : 0);
      }, 0);
      onComplete(score);
      setShowResult(true);
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  if (showResult) {
    const total = subject.questions.length;
    const score = answers.reduce((sum, ans, idx) => sum + (ans === subject.questions[idx].answer ? 1 : 0), 0);
    const pct = Math.round((score / total) * 100);
    const wrong = answers.filter((a, i) => a !== null && a !== subject.questions[i].answer).length;
    const skipped = answers.filter(a => a === null).length;

    return (
      <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className="card" style={{ padding: '4rem 2rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', fontWeight: 600, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>
            {score}/{total}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '3rem' }}>คะแนนที่คุณทำได้</p>
          
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', 
            padding: '1.5rem', borderRadius: '8px', boxShadow: 'var(--shadow-border)',
            marginBottom: '3rem', background: 'var(--surface-hover)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{score}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ถูก</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{wrong}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ผิด</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{skipped}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ข้าม</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)' }}>{pct}%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>เปอร์เซ็นต์</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => {
              setAnswers(Array(subject.questions.length).fill(null));
              setCurrentQ(0);
              setShowResult(false);
            }}>
              <RotateCcw size={16} />
              ลองใหม่
            </button>
            <button className="btn btn-primary" onClick={onBack}>
              <HomeIcon size={16} />
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          className="btn btn-outline"
          onClick={onBack}
          style={{ width: '36px', height: '36px', padding: 0 }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.125rem', letterSpacing: '-0.5px' }}>{subject.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{subject.desc}</p>
        </div>
      </div>

      <div style={{ 
        background: 'var(--border-divider)', height: '4px', borderRadius: '2px', 
        marginBottom: '0.75rem', overflow: 'hidden' 
      }}>
        <div style={{ 
          height: '100%', 
          background: 'var(--text)', 
          width: `${((currentQ) / subject.questions.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '2.5rem', fontWeight: 500 }}>
        <span>ข้อที่ {currentQ + 1} จาก {subject.questions.length}</span>
      </div>

      <div className="card" style={{ padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Question {currentQ + 1}
        </div>
        <h3 style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem', fontWeight: 500 }}>
          {renderTextWithMath(q.q)}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {q.choices.map((choice, idx) => {
            const isSelected = answers[currentQ] === idx;
            const isRight = answered && idx === q.answer;
            const isWrong = answered && isSelected && !isRight;

            let boxShadow = 'var(--shadow-border)';
            let bg = 'var(--surface)';
            let color = 'var(--text)';

            if (isRight) {
              boxShadow = '0px 0px 0px 1px var(--success)';
              bg = 'rgba(16, 185, 129, 0.1)';
            } else if (isWrong) {
              boxShadow = '0px 0px 0px 1px var(--error)';
              bg = 'rgba(238, 0, 0, 0.1)';
            } else if (answered) {
              color = 'var(--text-muted)';
            }

            return (
              <button 
                key={idx} 
                className="btn"
                style={{
                  background: bg,
                  boxShadow: boxShadow,
                  borderRadius: '8px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  color: color,
                  fontSize: '0.9375rem',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() => handleSelect(idx)}
              >
                <div style={{
                  width: '24px', height: '24px', borderRadius: '4px', flexShrink: 0,
                  background: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--surface-active)',
                  color: (isRight || isWrong) ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '0.75rem'
                }}>
                  {isRight ? <CheckCircle size={14} /> : isWrong ? <XCircle size={14} /> : String.fromCharCode(65 + idx)}
                </div>
                <span style={{ lineHeight: 1.5 }}>{renderTextWithMath(choice)}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-in" style={{ 
            marginTop: '2rem', 
            padding: '1.25rem', 
            background: 'var(--surface-hover)', 
            boxShadow: 'var(--shadow-border)',
            borderRadius: '8px' 
          }}>
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Check size={16} /> เฉลยและคำอธิบาย
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              {renderTextWithMath(q.explain)}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="btn btn-outline" 
          onClick={prevQuestion}
          disabled={currentQ === 0}
          style={{ visibility: currentQ === 0 ? 'hidden' : 'visible' }}
        >
          <ChevronLeft size={16} />
          ก่อนหน้า
        </button>
        <button 
          className="btn btn-primary" 
          onClick={nextQuestion}
        >
          {currentQ < subject.questions.length - 1 ? 'ข้อถัดไป' : 'ดูผลคะแนน'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
