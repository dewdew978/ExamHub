import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, ChevronLeft, RotateCcw, Home as HomeIcon, Check, Clock, X, Info, FileText, Pause, Play, LayoutGrid, Bookmark, AlertTriangle } from 'lucide-react';
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

export default function Exam({ subject, onBack, onComplete, onReport }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(Array(subject.questions.length).fill(null));
  const [bookmarks, setBookmarks] = useState(Array(subject.questions.length).fill(false));
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(subject.questions.length * 60); // 1 min per question
  const [showAlert, setShowAlert] = useState(true);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);

  const toggleBookmark = () => {
    const newBookmarks = [...bookmarks];
    newBookmarks[currentQ] = !newBookmarks[currentQ];
    setBookmarks(newBookmarks);
  };

  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (showResult || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const currentAnswers = answersRef.current;
          const score = currentAnswers.reduce((sum, ans, idx) => sum + (ans === subject.questions[idx].answer ? 1 : 0), 0);
          onComplete(score);
          setShowResult(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showResult, isPaused, subject.questions, onComplete]);

  const q = subject.questions[currentQ];
  const answered = answers[currentQ] !== null;

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (showResult) {
    if (isReviewMode) {
      return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '1.5rem auto', padding: '0 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button 
              className="btn btn-outline"
              onClick={() => setIsReviewMode(false)}
              style={{ width: '32px', height: '32px', padding: 0 }}
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.15rem', marginBottom: '0.125rem', letterSpacing: '-0.3px' }}>เฉลยข้อสอบ: {subject.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>ทบทวนข้อผิดพลาดและดูคำอธิบาย</p>
            </div>
          </div>
  
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {subject.questions.map((q, idx) => {
              const userAnswer = answers[idx];
              const isRight = userAnswer === q.answer;
              const isSkipped = userAnswer === null;
  
              return (
                <div key={idx} className="card" style={{ padding: '1.25rem 1rem', borderRadius: '10px', borderLeft: isRight ? '4px solid var(--success)' : isSkipped ? '4px solid var(--text-muted)' : '4px solid var(--error)' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                      background: isRight ? 'rgba(16, 185, 129, 0.15)' : isSkipped ? 'var(--surface-active)' : 'rgba(238, 0, 0, 0.15)',
                      color: isRight ? 'var(--success)' : isSkipped ? 'var(--text-muted)' : 'var(--error)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.8125rem'
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1rem', fontWeight: 500 }}>
                        {renderTextWithMath(q.q)}
                      </h3>
  
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                        {q.choices.map((choice, cIdx) => {
                          const isSelected = userAnswer === cIdx;
                          const isCorrectChoice = cIdx === q.answer;
                          
                          let bg = 'var(--surface)';
                          let color = 'var(--text)';
                          let boxShadow = 'var(--shadow-border)';
                          let icon = null;
  
                          if (isCorrectChoice) {
                            bg = 'rgba(16, 185, 129, 0.1)';
                            boxShadow = '0px 0px 0px 1px var(--success)';
                            icon = <CheckCircle size={15} color="var(--success)" />;
                          } else if (isSelected && !isCorrectChoice) {
                            bg = 'rgba(238, 0, 0, 0.1)';
                            boxShadow = '0px 0px 0px 1px var(--error)';
                            icon = <XCircle size={15} color="var(--error)" />;
                          } else {
                            color = 'var(--text-muted)';
                          }
  
                          return (
                            <div key={cIdx} style={{
                              padding: '0.6rem 0.8rem', borderRadius: '6px',
                              background: bg, boxShadow: boxShadow, color: color,
                              display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem'
                            }}>
                              <div style={{ width: '18px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                                {icon || <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{String.fromCharCode(65 + cIdx)}</span>}
                              </div>
                              <span style={{ lineHeight: 1.4 }}>{renderTextWithMath(choice)}</span>
                            </div>
                          );
                        })}
                      </div>
  
                      <div style={{ 
                        padding: '0.875rem', background: 'var(--surface-hover)', 
                        borderRadius: '6px', fontSize: '0.8125rem' 
                      }}>
                        <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text)' }}>คำอธิบาย:</div>
                        <div style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{renderTextWithMath(q.explain)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    const total = subject.questions.length;
    const score = answers.reduce((sum, ans, idx) => sum + (ans === subject.questions[idx].answer ? 1 : 0), 0);
    const pct = Math.round((score / total) * 100);
    const wrong = answers.filter((a, i) => a !== null && a !== subject.questions[i].answer).length;
    const skipped = answers.filter(a => a === null).length;

    return (
      <div className="animate-fade-in" style={{ maxWidth: '540px', margin: '2rem auto', padding: '0 0.75rem' }}>
        <div className="card" style={{ padding: '2.5rem 1.5rem', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1px', marginBottom: '0.25rem' }}>
            {score}/{total}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>คะแนนที่คุณทำได้</p>
          
          <div style={{ 
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', 
            padding: '1rem', borderRadius: '8px', boxShadow: 'var(--shadow-border)',
            marginBottom: '2rem', background: 'var(--surface-hover)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{score}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ถูก</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{wrong}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ผิด</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{skipped}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>ข้าม</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)' }}>{pct}%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>เปอร์เซ็นต์</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setIsReviewMode(true)} style={{ padding: '0.55rem 1.15rem' }}>
              <FileText size={15} />
              ดูเฉลย
            </button>
            <button className="btn btn-outline" onClick={() => {
              setAnswers(Array(subject.questions.length).fill(null));
              setCurrentQ(0);
              setTimeLeft(subject.questions.length * 60);
              setShowAlert(true);
              setIsReviewMode(false);
              setShowResult(false);
            }} style={{ padding: '0.55rem 1.15rem' }}>
              <RotateCcw size={15} />
              ลองใหม่
            </button>
            <button className="btn btn-outline" onClick={onBack} style={{ padding: '0.55rem 1.15rem' }}>
              <HomeIcon size={15} />
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0.5rem auto 2.5rem' }}>
      
      {/* Pause Modal Overlay */}
      {isPaused && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="card animate-fade-in" style={{
            padding: '2rem 1.5rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            borderRadius: '14px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(0, 112, 243, 0.1)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <Pause size={24} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              พักการทำข้อสอบ
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              เวลาถูกหยุดชั่วคราวแล้ว คุณสามารถกด "ทำข้อสอบต่อ" เพื่อกลับไปทำข้อสอบได้ทันที
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsPaused(false)}
                style={{ padding: '0.7rem 1.25rem', width: '100%', fontSize: '0.875rem' }}
              >
                <Play size={15} />
                ทำข้อสอบต่อ
              </button>
              <button 
                className="btn btn-outline" 
                onClick={onBack}
                style={{ padding: '0.65rem 1.25rem', width: '100%', fontSize: '0.875rem' }}
              >
                <HomeIcon size={15} />
                ออกจากการสอบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={onBack}
            style={{ width: '32px', height: '32px', padding: 0 }}
            title="กลับหน้าหลัก"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.05rem', margin: 0, letterSpacing: '-0.3px', fontWeight: 600 }}>{subject.name}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button 
            className={`btn ${showNavigator ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setShowNavigator(!showNavigator)}
            style={{ width: '32px', height: '32px', padding: 0 }}
            title="ดูภาพรวมข้อสอบ"
          >
            <LayoutGrid size={15} />
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => setIsPaused(true)}
            style={{ width: '32px', height: '32px', padding: 0 }}
            title="พักสอบชั่วคราว"
          >
            <Pause size={15} />
          </button>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.35rem', 
            background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-hover)', 
            color: timeLeft < 60 ? 'var(--error)' : 'var(--text)',
            padding: '0.35rem 0.65rem', borderRadius: '6px', 
            boxShadow: 'var(--shadow-border)', fontWeight: 600, fontSize: '0.9375rem'
          }}>
            <Clock size={16} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {showNavigator && (
        <div className="card animate-fade-in" style={{ padding: '1rem', marginBottom: '1.25rem', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>นำทางข้อสอบ</h3>
            <div style={{ display: 'flex', gap: '0.625rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--success)' }}></div>
                ทำแล้ว
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--surface)', border: '1px solid var(--border-divider)' }}></div>
                ยังไม่ทำ
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <Bookmark size={11} fill="var(--warning)" color="var(--warning)" />
                ติดดาว
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '0.35rem' }}>
            {subject.questions.map((_, idx) => {
              const isCurrent = currentQ === idx;
              const isAnswered = answers[idx] !== null;
              
              let bg = 'var(--surface)';
              let border = '1px solid var(--border-divider)';
              let color = 'var(--text)';
              
              if (isCurrent) {
                bg = 'var(--accent)';
                border = '1px solid var(--accent)';
                color = 'white';
              } else if (isAnswered) {
                bg = 'rgba(16, 185, 129, 0.1)';
                border = '1px solid var(--success)';
                color = 'var(--success)';
              }

              return (
                <button
                  key={idx}
                  onClick={() => { setCurrentQ(idx); setShowNavigator(false); }}
                  style={{
                    position: 'relative',
                    height: '34px',
                    borderRadius: '6px',
                    background: bg,
                    border: border,
                    color: color,
                    fontWeight: isCurrent ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit'
                  }}
                >
                  {idx + 1}
                  {bookmarks[idx] && (
                    <div style={{ position: 'absolute', top: '-3px', right: '-3px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', borderRadius: '50%', padding: '1px' }}>
                      <Bookmark size={9} fill="var(--warning)" color="var(--warning)" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showAlert && (
        <div className="animate-fade-in" style={{
          background: 'rgba(0, 112, 243, 0.05)',
          border: '1px solid rgba(0, 112, 243, 0.2)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          gap: '0.625rem',
          alignItems: 'flex-start',
          position: 'relative'
        }}>
          <div style={{ color: 'var(--accent)', marginTop: '0.1rem' }}>
            <Info size={16} />
          </div>
          <div style={{ paddingRight: '1.5rem' }}>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>
              ชุดข้อสอบนี้มีเวลาให้ข้อละ 1 นาที (รวม {subject.questions.length} นาที) เมื่อเวลาหมดจะทำการส่งข้อสอบอัตโนมัติ
            </p>
          </div>
          <button 
            onClick={() => setShowAlert(false)}
            style={{
              position: 'absolute',
              top: '0.625rem',
              right: '0.625rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.2rem'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ 
        background: 'var(--border-divider)', height: '4px', borderRadius: '2px', 
        marginBottom: '0.5rem', overflow: 'hidden' 
      }}>
        <div style={{ 
          height: '100%', 
          background: 'var(--text)', 
          width: `${((currentQ + 1) / subject.questions.length) * 100}%`,
          transition: 'width 0.3s ease'
        }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '1.25rem', fontWeight: 500 }}>
        <span>ข้อที่ {currentQ + 1} จาก {subject.questions.length}</span>
      </div>

      <div className="card" style={{ padding: '1.25rem 1rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Question {currentQ + 1}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {onReport && (
              <button 
                type="button"
                onClick={() => onReport({ subjectId: subject.id, questionNumber: currentQ + 1, issueType: 'wrong_answer' })}
                style={{ 
                  background: 'transparent', border: 'none', cursor: 'pointer', 
                  color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500,
                  padding: '0.25rem 0.4rem', borderRadius: '4px'
                }}
                title="รายงานข้อนี้ผิด"
              >
                <AlertTriangle size={14} />
                <span>แจ้งข้อผิด</span>
              </button>
            )}
            <button 
              onClick={toggleBookmark}
              style={{ 
                background: 'transparent', border: 'none', cursor: 'pointer', 
                color: bookmarks[currentQ] ? 'var(--warning)' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 500,
                padding: '0.25rem 0.4rem', borderRadius: '4px'
              }}
            >
              <Bookmark size={14} fill={bookmarks[currentQ] ? 'currentColor' : 'none'} />
              <span>{bookmarks[currentQ] ? 'ติดดาวแล้ว' : 'ติดดาว'}</span>
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '1.25rem', fontWeight: 500 }}>
          {renderTextWithMath(q.q)}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                  padding: '0.75rem 0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  color: color,
                  fontSize: '0.875rem',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
                onClick={() => handleSelect(idx)}
              >
                <div style={{
                  width: '22px', height: '22px', borderRadius: '4px', flexShrink: 0,
                  background: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : 'var(--surface-active)',
                  color: (isRight || isWrong) ? '#fff' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 600, fontSize: '0.75rem'
                }}>
                  {isRight ? <CheckCircle size={14} /> : isWrong ? <XCircle size={14} /> : String.fromCharCode(65 + idx)}
                </div>
                <span style={{ lineHeight: 1.45 }}>{renderTextWithMath(choice)}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="animate-fade-in" style={{ 
            marginTop: '1.25rem', 
            padding: '1rem', 
            background: 'var(--surface-hover)', 
            boxShadow: 'var(--shadow-border)',
            borderRadius: '8px' 
          }}>
            <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Check size={15} /> เฉลยและคำอธิบาย
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.5, margin: 0 }}>
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
