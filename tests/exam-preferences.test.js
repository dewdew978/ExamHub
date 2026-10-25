import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let server;
let Exam;
let ExamIntro;
let storage;
const subject = {
  id: 'preferences-fixture', name: 'Preferences exam',
  questions: [
    { q: 'First $x^2$', choices: ['Choice $x$', 'Other'], answer: 0, explain: 'Explain $x$' },
    { q: 'Second question', choices: ['No', 'Yes'], answer: 1, explain: 'Second explanation' },
    { q: 'Third question', choices: ['Yes', 'No'], answer: 0, explain: 'Third explanation' },
  ],
};
const renderExam = (props = {}) => renderToStaticMarkup(createElement(Exam, {
  subject, onBack() {}, onComplete() {}, ...props,
}));

before(async () => {
  // The package is UMD; expose its real CommonJS export to Vite's SSR loader.
  const katexInterop = {
    name: 'test-katex-interop',
    enforce: 'pre',
    resolveId(id) { if (id === 'react-katex') return '\0test-katex'; },
    load(id) {
      if (id === '\0test-katex') return `import { createRequire } from 'node:module';
        export const InlineMath = createRequire(${JSON.stringify(import.meta.url)})('react-katex').InlineMath;`;
    },
  };
  server = await createServer({ configFile: false, plugins: [react(), katexInterop],
    optimizeDeps: { noDiscovery: true, include: [] },
    ssr: { noExternal: ['react-katex'] },
    server: { middlewareMode: true }, appType: 'custom' });
  Exam = (await server.ssrLoadModule('/src/components/Exam.jsx')).default;
  ExamIntro = (await server.ssrLoadModule('/src/components/ExamIntro.jsx')).default;
});
after(async () => { await server?.close(); delete globalThis.localStorage; });
beforeEach(() => {
  storage = new Map();
  globalThis.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key),
  };
});

test('default preferences keep the timer, formulas, and original question order', () => {
  const html = renderExam();
  assert.match(html, /03:00/);
  assert.match(html, /class="katex"/);
  assert.match(html, /First /);
  assert.doesNotMatch(html, /Second question/);
});

test('turning formulas off shows the raw question and choices', () => {
  storage.set('examhub_pref_math', 'false');
  const html = renderExam();
  assert.match(html, /First \$x\^2\$/);
  assert.match(html, /Choice \$x\$/);
  assert.doesNotMatch(html, /class="katex"/);
});

test('turning formulas off also shows the raw explanation for an answered question', () => {
  storage.set('examhub_pref_math', 'false');
  const html = renderExam({ initialProgress: {
    subjectId: subject.id, currentQ: 0, answers: [0, null, null], timeLeft: 90,
  } });
  assert.match(html, /Explain \$x\$/);
  assert.doesNotMatch(html, /class="katex"/);
});

test('turning the timer off removes the countdown, pause control, and automatic-submit notice', () => {
  storage.set('examhub_pref_timer', 'false');
  const html = renderExam();
  assert.doesNotMatch(html, /03:00|พักสอบชั่วคราว|เมื่อเวลาหมดจะทำการส่งข้อสอบอัตโนมัติ/);
  assert.match(html, /ไม่จำกัดเวลา/);
});

test('exam instructions describe untimed practice when the timer is off', () => {
  storage.set('examhub_pref_timer', 'false');
  const html = renderToStaticMarkup(createElement(ExamIntro, { subject }));
  assert.match(html, /ไม่จำกัดเวลา/);
  assert.doesNotMatch(html, /ตัวจับเวลาจะเริ่มเดิน|เฉลี่ยข้อละ 1 นาที/);
});

test('shuffle changes the displayed question without mutating the source exam', t => {
  storage.set('examhub_pref_shuffle', 'true');
  t.mock.method(Math, 'random', () => 0);
  const html = renderExam();
  assert.match(html, /Second question/);
  assert.doesNotMatch(html, /First /);
  assert.equal(subject.questions[0].q, 'First $x^2$');
});

test('resuming restores the saved order and answer even when shuffle is now off', () => {
  const html = renderExam({ initialProgress: {
    subjectId: subject.id, questionOrder: [2, 0, 1], currentQ: 2,
    answers: [null, null, 1], bookmarks: [false, false, true], timeLeft: 42,
  } });
  assert.match(html, /Second question/);
  assert.match(html, /Second explanation/);
  assert.match(html, /00:42/);
  assert.match(html, /ติดดาวแล้ว/);
});

test('legacy progress keeps its original order when shuffle is enabled later', t => {
  storage.set('examhub_pref_shuffle', 'true');
  t.mock.method(Math, 'random', () => 0);
  const html = renderExam({ initialProgress: {
    subjectId: subject.id, currentQ: 1, answers: [0, 1, null], timeLeft: 90,
  } });
  assert.match(html, /Second question/);
  assert.match(html, /Second explanation/);
});

test('invalid saved orders cannot duplicate or drop exam questions', () => {
  for (const questionOrder of [[0, 0, 1], [0, 1, 3], [0, 1], [0, 1, 1.5]]) {
    const html = renderExam({ initialProgress: {
      subjectId: subject.id, questionOrder, currentQ: 1,
      answers: [null, 1, null], timeLeft: 90,
    } });
    assert.match(html, /Second question/);
    assert.match(html, /Second explanation/);
  }
});

test('blocked browser storage falls back to default exam preferences', () => {
  globalThis.localStorage.getItem = () => { throw new Error('Storage blocked'); };
  const html = renderExam();
  assert.match(html, /03:00/);
  assert.match(html, /class="katex"/);
  assert.match(html, /First /);
});
