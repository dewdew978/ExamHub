// Run on a separate localhost port to keep test storage isolated from the app.
// npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
// Open http://127.0.0.1:5175/tests/browser/preferences.html
// Uses real components; score/report callbacks stay local and never write to the backend.
import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import UserSettings from '../../src/components/UserSettings';
import Exam from '../../src/components/Exam';
import ExamIntro from '../../src/components/ExamIntro';
import '../../src/index.css';
import '../../src/App.css';

const subject = {
  id: 'browser-preferences-fixture', name: 'ทดสอบการตั้งค่า (ข้อมูลจำลอง)',
  questions: [
    { q: 'Q1: สูตรกำลังสอง $x^2$', choices: ['คำตอบ Q1 $x^2$', 'ตัวลวง Q1 $x$'], answer: 0, explain: 'เฉลย Q1: $x^2$' },
    { q: 'Q2: สูตรเศษส่วน $\\frac{1}{2}$', choices: ['ตัวลวง Q2 $2$', 'คำตอบ Q2 $\\frac{1}{2}$'], answer: 1, explain: 'เฉลย Q2: $\\frac{1}{2}$' },
    { q: 'Q3: สูตรรากที่สอง $\\sqrt{9}$', choices: ['คำตอบ Q3 $3$', 'ตัวลวง Q3 $9$'], answer: 0, explain: 'เฉลย Q3: $\\sqrt{9}=3$' },
    { q: 'Q4: สูตรผลรวม $1+2$', choices: ['ตัวลวง Q4 $4$', 'คำตอบ Q4 $3$'], answer: 1, explain: 'เฉลย Q4: $1+2=3$' },
  ],
};
const user = { id: 'local-browser-fixture', email: 'fixture@example.invalid', user_metadata: { nickname: 'Local test' }, app_metadata: {} };
const progressKey = 'examhub_in_progress_exam';

export function Harness() {
  const [view, setView] = useState('settings');
  const [attempt, setAttempt] = useState(0);
  const [progress, setProgress] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [scores, setScores] = useState([]);
  const [report, setReport] = useState(null);
  const onComplete = useCallback(score => setScores(previous => [...previous, score]), []);
  const start = (saved = null) => {
    setProgress(saved);
    setAttempt(previous => previous + 1);
    setView('exam');
  };
  const exit = () => { setSnapshot(JSON.parse(localStorage.getItem(progressKey))); setView('home'); };
  return <main style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
    <h1 style={{ fontSize: 22 }}>EXETIA — ทดสอบการตั้งค่าในเบราว์เซอร์</h1>
    <p>ข้อมูลจำลองบนเครื่อง • ไม่บันทึกคะแนนหรือรายงานไปยังฐานข้อมูล</p>
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
      <button className="btn btn-outline" onClick={() => setView('settings')}>เปิดหน้าตั้งค่า</button>
      <button className="btn btn-outline" onClick={() => setView('intro')}>ดูคำชี้แจง</button>
      <button className="btn btn-outline" onClick={() => { localStorage.removeItem(progressKey); start(); }}>เริ่มรอบใหม่</button>
      <button className="btn btn-outline" onClick={() => start(JSON.parse(localStorage.getItem(progressKey)))}>ทำต่อจากที่บันทึก</button>
      <button className="btn btn-outline" onClick={() => start({ subjectId: subject.id, currentQ: 0, answers: [null, null, null, null], timeLeft: 2 })}>ทดสอบเวลา 2 วินาที</button>
      <button className="btn btn-outline" onClick={() => setSnapshot(JSON.parse(localStorage.getItem(progressKey)))}>ตรวจข้อมูลที่บันทึก</button>
    </nav>
    <p role="status">ส่งคะแนนแล้ว {scores.length} ครั้ง • คะแนน: {scores.join(', ') || 'ยังไม่ส่ง'} • รายงานเลขข้อต้นฉบับ: {report?.questionNumber ?? 'ยังไม่ส่ง'}</p>
    {snapshot && <details open><summary>ความคืบหน้าที่บันทึก</summary><pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(snapshot, null, 2)}</pre></details>}
    {view === 'settings' && <UserSettings user={user} onBack={exit} theme="dark" onToggleTheme={() => {}} />}
    {view === 'intro' && <ExamIntro subject={subject} onBack={exit} onStart={() => start()} onResume={start} />}
    {view === 'exam' && <Exam key={attempt} subject={subject} initialProgress={progress} onBack={exit} onComplete={onComplete} onReport={setReport} />}
    {view === 'home' && <p>ออกจากข้อสอบแล้ว กดทำต่อเพื่อทดสอบการกู้คืนคำตอบ ลำดับข้อ และดาว</p>}
  </main>;
}

createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
