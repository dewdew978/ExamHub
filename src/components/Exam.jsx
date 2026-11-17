import { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowLeft, CheckCircle, XCircle, ChevronRight, ChevronLeft, RotateCcw, Home as HomeIcon, Check, Clock, X, Info, FileText, Pause, Play, LayoutGrid, Bookmark, Flag, Lightbulb, MinusCircle, Target } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import NumberTicker from './NumberTicker';
import { includesChoice, isCorrectAnswer } from '../lib/examAnswers';
import { readExamPreferences, createQuestionOrder } from '../lib/examPreferences';
import { balanceQuestionChoices, resolveChoiceOrderVersion } from '../lib/choiceOrder';

const renderTextWithMath = (text, enabled) => {
  if (!enabled || typeof text !== 'string') return text;
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return <span key={index}>{part}</span>;
  });
};

export default function Exam({ subject: sourceSubject, onBack, onComplete, onReport, initialProgress }) {
  const [preferences, setPreferences] = useState(readExamPreferences);
  const [choiceOrderVersion, setChoiceOrderVersion] = useState(() =>
    resolveChoiceOrderVersion(initialProgress));
  const usesBalancedChoices = choiceOrderVersion !== null;
  const choiceOrderedQuestions = useMemo(() =>
    balanceQuestionChoices(
      sourceSubject.questions,
      usesBalancedChoices && !sourceSubject.adminOnly,
      choiceOrderVersion,
    ),
  [sourceSubject.questions, sourceSubject.adminOnly, usesBalancedChoices, choiceOrderVersion]);
  const [questionOrder, setQuestionOrder] = useState(() =>
    createQuestionOrder(sourceSubject.questions.length, preferences.autoShuffle, initialProgress));
  const subject = useMemo(() => ({
    ...sourceSubject,
    questions: questionOrder.map(index => choiceOrderedQuestions[index]),
  }), [sourceSubject, questionOrder, choiceOrderedQuestions]);
  const { mathRendering, timerEnabled } = preferences;
  const renderText = text => renderTextWithMath(text, mathRendering);
  const [currentQ, setCurrentQ] = useState(() => {
    if (initialProgress?.currentQ !== undefined && initialProgress.currentQ < subject.questions.length) {
      return initialProgress.currentQ;
    }
    return 0;
  });
  const [answers, setAnswers] = useState(() => {
    if (Array.isArray(initialProgress?.answers) && initialProgress.answers.length === subject.questions.length) {
      return initialProgress.answers;
    }
    return Array(subject.questions.length).fill(null);
  });
  const [bookmarks, setBookmarks] = useState(() => {
    if (Array.isArray(initialProgress?.bookmarks) && initialProgress.bookmarks.length === subject.questions.length) {
      return initialProgress.bookmarks;
    }
    return Array(subject.questions.length).fill(false);
  });
  const [showResult, setShowResult] = useState(false);
  const [pendingChoices, setPendingChoices] = useState({});
  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof initialProgress?.timeLeft === 'number' && initialProgress.timeLeft > 0) {
      return initialProgress.timeLeft;
    }
    return subject.questions.length * 60;
  });
  const [showAlert, setShowAlert] = useState(true);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');

  const toggleBookmark = () => {
    const newBookmarks = [...bookmarks];
    newBookmarks[currentQ] = !newBookmarks[currentQ];
    setBookmarks(newBookmarks);
  };

  const answersRef = useRef(answers);
  const currentQRef = useRef(currentQ);
  const bookmarksRef = useRef(bookmarks);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    currentQRef.current = currentQ;
  }, [currentQ]);

  useEffect(() => {
    bookmarksRef.current = bookmarks;
  }, [bookmarks]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const persistProgress = (qIdx, ansList, bmkList, time) => {
    if (showResult || subject.adminOnly) return;
    try {
      const answeredCount = ansList.filter(a => a !== null).length;
      if (answeredCount > 0 || qIdx > 0) {
        const progressData = {
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCategory: subject.category || 'General',
          subjectYear: subject.year || 3,
          subjectType: subject.type || 'Midterm',
          currentQ: qIdx,
          answers: ansList,
          bookmarks: bmkList,
          questionOrder,
          choiceOrderVersion: usesBalancedChoices ? choiceOrderVersion : undefined,
          timerEnabled,
          timeLeft: time,
          totalQuestions: subject.questions.length,
          answeredCount,
          updatedAt: Date.now()
        };
        localStorage.setItem('examhub_in_progress_exam', JSON.stringify(progressData));
      }
    } catch (e) {
      console.warn("Failed to persist progress:", e);
    }
  };

  // Automatically save progress whenever answers, bookmarks, or current question change
  useEffect(() => {
    if (showResult || subject.adminOnly) return;
    try {
      const answeredCount = answers.filter(a => a !== null).length;
      if (answeredCount > 0 || currentQ > 0) {
        const progressData = {
          subjectId: subject.id,
          subjectName: subject.name,
          subjectCategory: subject.category || 'General',
          subjectYear: subject.year || 3,
          subjectType: subject.type || 'Midterm',
          currentQ,
          answers,
          bookmarks,
          questionOrder,
          choiceOrderVersion: usesBalancedChoices ? choiceOrderVersion : undefined,
          timerEnabled,
          timeLeft: timeLeftRef.current,
          totalQuestions: subject.questions.length,
          answeredCount,
          updatedAt: Date.now()
        };
        localStorage.setItem('examhub_in_progress_exam', JSON.stringify(progressData));
      }
    } catch (e) {
      console.warn("Failed to persist progress:", e);
    }
  }, [currentQ, answers, bookmarks, showResult, subject, questionOrder, timerEnabled, usesBalancedChoices, choiceOrderVersion]);

  useEffect(() => {
    if (!timerEnabled || showResult || isPaused) return;
    
    const timer = setInterval(() => {
      const newTime = Math.max(0, timeLeftRef.current - 1);
      timeLeftRef.current = newTime;
      setTimeLeft(newTime);

      // Keep submission outside a state updater: Strict Mode may call updaters twice.
      if (newTime === 0) {
        clearInterval(timer);
        try {
          if (!subject.adminOnly) localStorage.removeItem('examhub_in_progress_exam');
        } catch (e) {
          console.warn(e);
        }
        const currentAnswers = answersRef.current;
        const score = currentAnswers.reduce((sum, ans, idx) => sum + (isCorrectAnswer(ans, subject.questions[idx].answer) ? 1 : 0), 0);
        onComplete(score);
        setShowResult(true);
        return;
      }

      // Periodically sync remaining time to localStorage
      if (newTime % 5 === 0) {
        try {
          const saved = localStorage.getItem('examhub_in_progress_exam');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.subjectId === subject.id) {
              parsed.timeLeft = newTime;
              parsed.updatedAt = Date.now();
              localStorage.setItem('examhub_in_progress_exam', JSON.stringify(parsed));
            }
          }
        } catch (e) {
          console.warn(e);
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerEnabled, showResult, isPaused, subject.questions, subject.id, subject.adminOnly, onComplete]);

  const handleExit = () => {
    if (!showResult) {
      persistProgress(currentQ, answers, bookmarks, timeLeft);
    }
    onBack();
  };

  const q = subject.questions[currentQ];
  const answered = answers[currentQ] !== null;

  const handleSelect = (idx) => {
    if (answered) return;
    if (Array.isArray(q.answer)) {
      setPendingChoices(previous => {
        const selected = previous[currentQ] || [];
        return { ...previous, [currentQ]: selected.includes(idx) ? selected.filter(i => i !== idx) : [...selected, idx] };
      });
      return;
    }
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQ < subject.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      try {
        if (!subject.adminOnly) localStorage.removeItem('examhub_in_progress_exam');
      } catch (e) {
        console.warn(e);
      }
      const score = answers.reduce((sum, ans, idx) => {
        return sum + (isCorrectAnswer(ans, subject.questions[idx].answer) ? 1 : 0);
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

  const restartExam = () => {
    try {
      if (!subject.adminOnly) localStorage.removeItem('examhub_in_progress_exam');
    } catch (e) {
      console.warn(e);
    }
    const nextPreferences = readExamPreferences();
    setPreferences(nextPreferences);
    setChoiceOrderVersion(resolveChoiceOrderVersion(initialProgress, true));
    setQuestionOrder(createQuestionOrder(sourceSubject.questions.length, nextPreferences.autoShuffle));
    setAnswers(Array(subject.questions.length).fill(null));
    setPendingChoices({});
    setBookmarks(Array(subject.questions.length).fill(false));
    setCurrentQ(0);
    setTimeLeft(subject.questions.length * 60);
    setShowAlert(true);
    setIsReviewMode(false);
    setReviewFilter('all');
    setShowResult(false);
  };

  const choiceLetter = (i) => String.fromCharCode(65 + i);

  if (showResult) {
    const total = subject.questions.length;
    const statusOf = (idx) => {
      const ans = answers[idx];
      if (ans === null) return 'skipped';
      return isCorrectAnswer(ans, subject.questions[idx].answer) ? 'right' : 'wrong';
    };

    if (isReviewMode) {
      const counts = { all: total, right: 0, wrong: 0, skipped: 0 };
      subject.questions.forEach((_, i) => { counts[statusOf(i)] += 1; });
      const visible = subject.questions.map((question, idx) => ({ question, idx })).filter(({ idx }) => reviewFilter === 'all' || statusOf(idx) === reviewFilter);

      return (
        <div className="page animate-fade-in" style={{ maxWidth: 860 }}>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIsReviewMode(false)} style={{ marginBottom: '1rem', marginLeft: '-0.5rem' }}>
            <ArrowLeft size={14} /> สรุปผลคะแนน
          </button>
          <div className="page-header">
            <div>
              <div className="page-eyebrow">เฉลยข้อสอบ</div>
              <h1 className="page-title">{subject.name}</h1>
              <p className="page-subtitle">ทบทวนข้อผิดพลาดและอ่านคำอธิบายรายข้อ</p>
            </div>
          </div>

          <div className="tabs" style={{ marginBottom: '1rem' }}>
            {[
              ['all', 'ทั้งหมด'], ['wrong', 'ตอบผิด'], ['skipped', 'ข้าม'], ['right', 'ตอบถูก'],
            ].map(([key, label]) => (
              <button key={key} type="button" className={`tab${reviewFilter === key ? ' active' : ''}`} onClick={() => setReviewFilter(key)}>
                {label} <span className="count">{counts[key]}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="empty-state"><span className="tile"><CheckCircle size={18} /></span><h3>ไม่มีข้อในหมวดนี้</h3></div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {visible.map(({ question, idx }) => {
                const userAnswer = answers[idx];
                const status = statusOf(idx);
                const tone = status === 'right'
                  ? { bg: 'var(--success-soft)', fg: 'var(--success)', label: 'ถูก', Icon: CheckCircle }
                  : status === 'wrong'
                    ? { bg: 'var(--error-soft)', fg: 'var(--error)', label: 'ผิด', Icon: XCircle }
                    : { bg: 'var(--surface-hover)', fg: 'var(--text-muted)', label: 'ข้าม', Icon: MinusCircle };
                return (
                  <div key={idx} className="card stagger-item" style={{ padding: '1rem 1.1rem', '--i': Math.min(visible.findIndex(v => v.idx === idx), 12) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>ข้อ {idx + 1}</span>
                      <span className="badge" style={{ background: tone.bg, color: tone.fg, boxShadow: 'none' }}><tone.Icon size={11} /> {tone.label}</span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '0.85rem', fontWeight: 500 }}>{renderText(question.q)}</h3>

                    <div data-choice-list="review" style={{ display: 'grid', gridAutoRows: '1fr', gap: '0.35rem', marginBottom: '0.85rem' }}>
                      {question.choices.map((choice, cIdx) => {
                        const isSelected = includesChoice(userAnswer, cIdx);
                        const isCorrectChoice = includesChoice(question.answer, cIdx);
                        const state = isCorrectChoice ? 'right' : isSelected ? 'wrong' : 'idle';
                        return (
                          <div key={cIdx} data-choice-option="review" style={{
                            padding: '0.55rem 0.75rem', borderRadius: 8, height: '100%',
                            display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem',
                            background: state === 'right' ? 'var(--success-soft)' : state === 'wrong' ? 'var(--error-soft)' : 'transparent',
                            boxShadow: state === 'idle' ? 'inset 0 0 0 1px var(--border-divider)' : 'none',
                            color: state === 'idle' ? 'var(--text-muted)' : 'var(--text)',
                          }}>
                            <span style={{
                              width: 20, height: 20, borderRadius: 5, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.7rem', fontWeight: 600,
                              background: state === 'right' ? 'var(--success)' : state === 'wrong' ? 'var(--error)' : 'var(--surface-hover)',
                              color: state === 'idle' ? 'var(--text-muted)' : '#fff',
                            }}>
                              {state === 'right' ? <Check size={12} strokeWidth={3} /> : state === 'wrong' ? <X size={12} strokeWidth={3} /> : choiceLetter(cIdx)}
                            </span>
                            <span style={{ lineHeight: 1.45 }}>{renderText(choice)}</span>
                            {isSelected && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>คำตอบของคุณ</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ padding: '0.75rem 0.85rem', background: 'var(--bg-subtle)', boxShadow: 'inset 0 0 0 1px var(--border-divider)', borderRadius: 8, fontSize: '0.8125rem' }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}><Lightbulb size={13} color="var(--warning)" /> คำอธิบาย</div>
                      <div style={{ color: 'var(--text-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{renderText(question.explain)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const score = answers.reduce((sum, ans, idx) => sum + (isCorrectAnswer(ans, subject.questions[idx].answer) ? 1 : 0), 0);
    const pct = Math.round((score / total) * 100);
    const wrong = answers.filter((a, i) => a !== null && !isCorrectAnswer(a, subject.questions[i].answer)).length;
    const skipped = answers.filter(a => a === null).length;
    const verdict = pct >= 80
      ? { label: 'ยอดเยี่ยมมาก!', cls: 'badge-success' }
      : pct >= 50 ? { label: 'ผ่านเกณฑ์', cls: 'badge-info' } : { label: 'พยายามอีกนิดนะ', cls: 'badge-error' };

    return (
      <div className="page animate-fade-in" style={{ maxWidth: 720 }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.75rem 1.5rem 1.5rem', textAlign: 'center' }}>
            <div className="page-eyebrow" style={{ justifyContent: 'center' }}>ผลการสอบ · {subject.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.3rem', lineHeight: 1, margin: '0.75rem 0' }}>
              <NumberTicker value={score} duration={1400} style={{ fontSize: '3.25rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text)' }} />
              <span style={{ fontSize: '1.5rem', color: 'var(--text-subtle)', fontWeight: 500 }}>/{total}</span>
            </div>
            <span className={`badge ${verdict.cls}`} style={{ height: 24, fontSize: '0.78rem', padding: '0 0.6rem' }}>{verdict.label}</span>

            <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', margin: '1.5rem auto 0', maxWidth: 420, background: 'var(--surface-active)' }} aria-hidden="true">
              <span className="grow-x" style={{ width: `${(score / total) * 100}%`, background: 'var(--success)' }} />
              <span className="grow-x" style={{ width: `${(wrong / total) * 100}%`, background: 'var(--error)', animationDelay: '0.15s' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderTop: '1px solid var(--border-divider)' }}>
            {[
              { label: 'ถูก', value: score, color: 'var(--success)', Icon: CheckCircle },
              { label: 'ผิด', value: wrong, color: 'var(--error)', Icon: XCircle },
              { label: 'ข้าม', value: skipped, color: 'var(--text-muted)', Icon: MinusCircle },
              { label: 'เปอร์เซ็นต์', value: pct, suffix: '%', color: 'var(--text)', Icon: Target },
            ].map((s, i) => (
              <div key={s.label} style={{ padding: '0.9rem 0.5rem', textAlign: 'center', borderLeft: i ? '1px solid var(--border-divider)' : 'none' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}><s.Icon size={12} color={s.color} /> {s.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: s.color, marginTop: 2 }}><NumberTicker value={s.value} duration={1200} />{s.suffix}</div>
              </div>
            ))}
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <button type="button" className="btn" onClick={onBack}><HomeIcon size={14} /> กลับคลังข้อสอบ</button>
            <button type="button" className="btn" onClick={restartExam}><RotateCcw size={14} /> ลองใหม่</button>
            <button type="button" className="btn btn-primary" onClick={() => setIsReviewMode(true)}><FileText size={14} /> ดูเฉลย</button>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPct = (answeredCount / subject.questions.length) * 100;

  const navigator = (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>นำทางข้อสอบ</div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{answeredCount}/{subject.questions.length}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: '0.3rem' }}>
        {subject.questions.map((_, idx) => {
          const isCurrent = currentQ === idx;
          const isAnswered = answers[idx] !== null;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => { setCurrentQ(idx); setShowNavigator(false); }}
              aria-label={`ไปข้อที่ ${idx + 1}`}
              className={`nav-cell${isCurrent ? ' is-current' : ''}`}
              style={{
                position: 'relative', height: 30, borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', fontWeight: isCurrent ? 600 : 500, fontVariantNumeric: 'tabular-nums',
                background: isCurrent ? 'var(--accent)' : isAnswered ? 'var(--accent-soft)' : 'var(--surface)',
                color: isCurrent ? '#fff' : isAnswered ? 'var(--accent-text)' : 'var(--text-muted)',
                boxShadow: isCurrent || isAnswered ? 'none' : 'inset 0 0 0 1px var(--border-color)',
              }}
            >
              {idx + 1}
              {bookmarks[idx] && (
                <span style={{ position: 'absolute', top: -4, right: -3, display: 'flex' }}>
                  <Bookmark size={10} fill="var(--warning)" color="var(--warning)" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: 'var(--accent-soft)' }} /> ทำแล้ว</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 9, height: 9, borderRadius: 3, boxShadow: 'inset 0 0 0 1px var(--border-strong)' }} /> ยังไม่ทำ</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Bookmark size={10} fill="var(--warning)" color="var(--warning)" /> ติดดาว</span>
      </div>
    </div>
  );

  return (
    <div className="page animate-fade-in exam-page" style={{ maxWidth: 1120, paddingTop: '1.25rem' }}>
      {isPaused && (
        <div className="modal-backdrop">
          <div className="modal" role="dialog" aria-label="พักการทำข้อสอบ">
            <div className="modal-header">
              <span className="tile tile-accent"><Pause size={16} /></span>
              <div>
                <div className="modal-title">พักการทำข้อสอบ</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>เวลาหยุดชั่วคราวที่ {formatTime(timeLeft)} กลับมาทำต่อได้ทุกเมื่อ</div>
              </div>
            </div>
            <div className="modal-footer" style={{ marginTop: '1rem' }}>
              <button type="button" className="btn" onClick={handleExit}><HomeIcon size={14} /> ออกจากการสอบ</button>
              <button type="button" className="btn btn-primary" onClick={() => setIsPaused(false)}><Play size={14} /> ทำข้อสอบต่อ</button>
            </div>
          </div>
        </div>
      )}

      {/* Exam toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-ghost btn-icon" onClick={handleExit} title="บันทึกและออก" aria-label="บันทึกและออก">
          <ArrowLeft size={16} />
        </button>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, lineHeight: 1.3 }}>{subject.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: 4 }}>
            <div className="progress" style={{ width: 180, height: 4 }}><span style={{ width: `${progressPct}%` }} /></div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ตอบแล้ว {answeredCount}/{subject.questions.length}</span>
          </div>
        </div>
        <button
          type="button"
          className={`btn btn-icon exam-nav-toggle${showNavigator ? ' active' : ''}`}
          onClick={() => setShowNavigator(!showNavigator)}
          title="ดูภาพรวมข้อสอบ"
          aria-label="ดูภาพรวมข้อสอบ"
          style={showNavigator ? { background: 'var(--accent-soft)', color: 'var(--accent-text)' } : undefined}
        >
          <LayoutGrid size={15} />
        </button>
        {timerEnabled && (
          <button type="button" className="btn btn-icon" onClick={() => setIsPaused(true)} title="พักสอบชั่วคราว" aria-label="พักสอบชั่วคราว">
            <Pause size={15} />
          </button>
        )}
        {timerEnabled ? (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', height: 32, padding: '0 0.7rem', borderRadius: 6,
            background: timeLeft < 60 ? 'var(--error-soft)' : 'var(--surface)',
            color: timeLeft < 60 ? 'var(--error)' : 'var(--text)',
            boxShadow: timeLeft < 60 ? 'none' : '0 0 0 1px var(--border-color)',
            fontWeight: 600, fontSize: '0.875rem',
          }}>
            <Clock size={14} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
          </div>
        ) : <span className="badge">ไม่จำกัดเวลา</span>}
      </div>

      <div className="exam-layout">
        <div style={{ minWidth: 0 }}>
          {showNavigator && <div className="card animate-fade-in exam-nav-inline" style={{ padding: '1rem', marginBottom: '1rem' }}>{navigator}</div>}

          {showAlert && (
            <div className="animate-fade-in" style={{
              display: 'flex', gap: '0.6rem', alignItems: 'flex-start', padding: '0.65rem 0.8rem', marginBottom: '1rem',
              borderRadius: 8, background: 'var(--accent-softer)', boxShadow: 'inset 0 0 0 1px var(--accent-soft)',
            }}>
              <Info size={15} color="var(--accent)" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, flex: 1 }}>
                {timerEnabled
                  ? <>ชุดข้อสอบนี้มีเวลาให้ข้อละ 1 นาที (รวม {subject.questions.length} นาที) เมื่อเวลาหมดจะทำการส่งข้อสอบอัตโนมัติ</>
                  : 'ฝึกทำข้อสอบแบบไม่จำกัดเวลา เมื่อทำเสร็จให้กดดูผลคะแนนเพื่อส่งข้อสอบ'}
              </p>
              <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => setShowAlert(false)} aria-label="ปิดคำแนะนำ" style={{ marginTop: -4, marginRight: -4 }}>
                <X size={14} />
              </button>
            </div>
          )}

          <div key={currentQ} className="card question-enter" style={{ padding: '1.25rem 1.25rem 1.35rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem' }}>
              <span className="badge badge-accent">ข้อที่ {currentQ + 1} จาก {subject.questions.length}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem' }}>
                {onReport && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onReport({ subjectId: subject.id, questionNumber: questionOrder[currentQ] + 1, issueType: 'wrong_answer' })}
                    title="รายงานข้อนี้ผิด"
                  >
                    <Flag size={13} /> แจ้งข้อผิด
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={toggleBookmark}
                  style={bookmarks[currentQ] ? { color: 'var(--warning)' } : undefined}
                >
                  <Bookmark size={13} fill={bookmarks[currentQ] ? 'currentColor' : 'none'} />
                  <span>{bookmarks[currentQ] ? 'ติดดาวแล้ว' : 'ติดดาว'}</span>
                </button>
              </div>
            </div>

            <h3 style={{ fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '1.1rem', fontWeight: 500 }}>
              {renderText(q.q)}
            </h3>

            <div data-choice-list="active" style={{ display: 'grid', gridAutoRows: '1fr', gap: '0.45rem' }}>
              {q.choices.map((choice, idx) => {
                const isSelected = includesChoice(answered ? answers[currentQ] : pendingChoices[currentQ], idx);
                const isRight = answered && includesChoice(q.answer, idx);
                const isWrong = answered && isSelected && !isRight;

                let boxShadow = '0 0 0 1px var(--border-color)';
                let bg = 'var(--surface)';
                let color = 'var(--text)';
                if (isRight) { boxShadow = '0 0 0 1px color-mix(in srgb, var(--success) 45%, transparent)'; bg = 'var(--success-soft)'; }
                else if (isWrong) { boxShadow = '0 0 0 1px color-mix(in srgb, var(--error) 45%, transparent)'; bg = 'var(--error-soft)'; }
                else if (answered) { color = 'var(--text-muted)'; }
                else if (isSelected) { boxShadow = '0 0 0 1.5px var(--accent)'; bg = 'var(--accent-softer)'; }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`exam-choice${answered ? ' is-locked' : ''}`}
                    data-choice-option="active"
                    data-result={isRight ? 'right' : isWrong ? 'wrong' : undefined}
                    aria-pressed={isSelected}
                    style={{
                      background: bg, boxShadow, color, cursor: answered ? 'default' : 'pointer',
                      border: 'none', borderRadius: 8, padding: '0.7rem 0.85rem', width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', fontSize: '0.9rem',
                      transition: 'background 0.12s ease, box-shadow 0.12s ease',
                    }}
                    onClick={() => handleSelect(idx)}
                  >
                    <span style={{
                      width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                      background: isRight ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--accent)' : 'var(--surface-hover)',
                      color: (isRight || isWrong || isSelected) ? '#fff' : 'var(--text-muted)',
                      boxShadow: (isRight || isWrong || isSelected) ? 'none' : 'inset 0 0 0 1px var(--border-color)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.75rem',
                    }}>
                      {isRight ? <Check size={14} strokeWidth={3} /> : isWrong ? <X size={14} strokeWidth={3} /> : choiceLetter(idx)}
                    </span>
                    <span style={{ lineHeight: 1.5 }}>{renderText(choice)}</span>
                  </button>
                );
              })}
            </div>

            {Array.isArray(q.answer) && !answered && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                <span>เลือก {q.answer.length} คำตอบ ({pendingChoices[currentQ]?.length || 0}/{q.answer.length})</span>
                <button type="button" className="btn btn-primary"
                  disabled={pendingChoices[currentQ]?.length !== q.answer.length}
                  onClick={() => {
                    setAnswers(previous => previous.map((answer, index) => index === currentQ ? [...pendingChoices[currentQ]] : answer));
                  }}>
                  ยืนยันคำตอบ
                </button>
              </div>
            )}

            {answered && (
              <div className="animate-fade-in" style={{ marginTop: '1.1rem', padding: '0.85rem 0.95rem', background: 'var(--bg-subtle)', boxShadow: 'inset 0 0 0 1px var(--border-divider)', borderRadius: 8 }}>
                <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Lightbulb size={14} color="var(--warning)" /> เฉลยและคำอธิบาย
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                  <span style={{ whiteSpace: 'pre-line' }}>{renderText(q.explain)}</span>
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn"
              onClick={prevQuestion}
              disabled={currentQ === 0}
              style={{ visibility: currentQ === 0 ? 'hidden' : 'visible' }}
            >
              <ChevronLeft size={15} /> ก่อนหน้า
            </button>
            <button type="button" className="btn btn-primary" onClick={nextQuestion}>
              {currentQ < subject.questions.length - 1 ? 'ข้อถัดไป' : 'ดูผลคะแนน'}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <aside className="card exam-nav-side" style={{ padding: '1rem', position: 'sticky', top: 'calc(var(--topbar-h) + 1rem)' }}>
          {navigator}
        </aside>
      </div>

      <style>{`
        .exam-layout { display: grid; grid-template-columns: minmax(0, 1fr) 248px; gap: 1.25rem; align-items: start; }
        .exam-nav-toggle { display: none; }
        .exam-nav-inline { display: none; }
        @media (max-width: 1080px) {
          .exam-layout { grid-template-columns: 1fr; }
          .exam-nav-side { display: none; }
          .exam-nav-toggle { display: inline-flex; }
          .exam-nav-inline { display: block; }
        }
      `}</style>
    </div>
  );
}
