import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/components/AdminDashboard.jsx', import.meta.url), 'utf8');

// Exercise the component's event handlers without a DOM or a second React runtime.
function handler(name, bindings) {
  const match = source.match(new RegExp(`  const ${name} = ([\\s\\S]*?\\n  });`));
  assert.ok(match, `Missing ${name} handler`);
  return Function(...Object.keys(bindings), `return (${match[1]});`)(...Object.values(bindings));
}

function saveBindings(saveExam) {
  const updates = [];
  const notices = [];
  let catalogChanges = 0;
  return {
    updates, notices, get catalogChanges() { return catalogChanges; },
    bindings: {
      saveExam, supabase: {}, selectedExamId: 'demo',
      examSaveInFlight: { current: false },
      setSavingExam: () => {}, setExamError: () => {},
      setLoadedExamData: value => updates.push(value),
      showToast: value => notices.push(value),
      onCatalogChange: async () => { catalogChanges += 1; },
    },
  };
}

test('admin saves publish only confirmed database content and block overlapping writes', async () => {
  let resolveSave;
  let writes = 0;
  const state = saveBindings(() => { writes += 1; return new Promise(resolve => { resolveSave = resolve; }); });
  const save = handler('saveExamData', state.bindings);
  const pending = save({ id: 'demo', questions: [] });
  assert.equal(state.updates.length, 0);
  assert.equal(state.notices.length, 0);
  assert.equal(await save({ id: 'demo', questions: [] }), null);
  assert.equal(writes, 1);
  const persisted = { id: 'demo', questions: [], updated_at: 'server-version' };
  resolveSave(persisted);
  assert.deepEqual(await pending, persisted);
  assert.deepEqual(state.updates, [persisted]);
  assert.equal(state.catalogChanges, 1);
});

test('failed admin saves retain loaded content without announcing success', async () => {
  const state = saveBindings(async () => { throw new Error('Conflict: reload first'); });
  const save = handler('saveExamData', state.bindings);
  assert.equal(await save({ id: 'demo', questions: [] }), null);
  assert.equal(state.updates.length, 0);
  assert.equal(state.catalogChanges, 0);
  assert.match(state.notices.join(' '), /Conflict/);
  assert.equal(state.bindings.examSaveInFlight.current, false);
});

test('editing an existing multiple-answer question preserves answer arrays and source metadata', async () => {
  const question = { q: 'Question', choices: ['A', 'B', 'C'], answer: [0, 2], explain: 'Why', sourceNumber: 42 };
  let form;
  handler('openQuestionEditor', {
    examSaveInFlight: { current: false }, loadedExamData: { questions: [question] },
    setEditingQuestionIndex: () => {}, setQuestionFormData: value => { form = value; },
  })(0, question);
  assert.deepEqual(form.answer, [0, 2]);
  let saved;
  let closed = false;
  await handler('handleSaveQuestion', {
    examSaveInFlight: { current: false }, questionFormData: form,
    loadedExamData: { id: 'demo', questions: [question] }, editingQuestionIndex: 0,
    saveExamData: async value => { saved = value; return value; },
    setEditingQuestionIndex: () => { closed = true; }, alert: assert.fail,
  })();
  assert.deepEqual(saved.questions[0].answer, [0, 2]);
  assert.equal(saved.questions[0].sourceNumber, 42);
  assert.equal(closed, true);
});

test('question save errors keep the editor open', async () => {
  let closed = false;
  await handler('handleSaveQuestion', {
    examSaveInFlight: { current: false },
    questionFormData: { q: 'Question', choices: ['A', 'B'], answer: 1, explain: '' },
    loadedExamData: { questions: [] }, editingQuestionIndex: -1,
    saveExamData: async () => null,
    setEditingQuestionIndex: () => { closed = true; }, alert: assert.fail,
  })();
  assert.equal(closed, false);
});

test('admin exam content never reads or mutates legacy browser drafts or bundled JSON', () => {
  assert.doesNotMatch(source, /examhub_custom_exam_|import\(`\.\.\/data\/\$\{examId\}/);
  assert.doesNotMatch(source, /isAdminPractice\(examId\)/);
  assert.match(source, /loadExam\(supabase, examId\)/);
});

test('admin loads private exam content through the repository and ignores stale responses', async () => {
  const requests = [];
  const loaded = [];
  const load = handler('loadExamDetails', {
    examSaveInFlight: { current: false }, examLoadVersion: { current: 0 },
    loadedExamData: null, supabase: {},
    loadExam: (_client, id) => new Promise(resolve => requests.push({ id, resolve })),
    setSelectedExamId: () => {}, setLoadedExamData: value => { if (value) loaded.push(value); },
    setLoadingExam: () => {}, setExamError: () => {}, setQuestionSearchQuery: () => {},
    showToast: assert.fail,
  });
  const older = load('public');
  const newer = load('private');
  const privateExam = { id: 'private', adminOnly: true, questions: [] };
  requests[1].resolve(privateExam);
  await newer;
  requests[0].resolve({ id: 'public', questions: [] });
  await older;
  assert.deepEqual(loaded, [privateExam]);
});

test('JSON imports preserve multiple answers and source metadata and remain open on failed saves', async () => {
  const imported = { q: 'Question', choices: ['A', 'B', 'C'], answer: [0, 2], explain: 'Why', sourceNumber: 17 };
  let candidate;
  let closed = false;
  let cleared = false;
  let error;
  await handler('handleProcessImport', {
    examSaveInFlight: { current: false }, loadedExamData: { id: 'demo', questions: [] },
    importText: JSON.stringify({ questions: [imported] }),
    setImportError: value => { error = value; },
    saveExamData: async value => { candidate = value; return null; },
    setShowImportModal: () => { closed = true; },
    setImportText: () => { cleared = true; }, showToast: assert.fail,
  })();
  assert.deepEqual(candidate.questions, [imported]);
  assert.equal(closed, false);
  assert.equal(cleared, false);
  assert.ok(error);
});

test('reference edits use the full exam version and keep the modal open on write errors', async () => {
  let candidate;
  let closed = false;
  const original = { id: 'demo', updated_at: 'loaded-version', adminOnly: true, questions: [{ q: 'Preserved' }] };
  await handler('handleSaveReferences', {
    examSaveInFlight: { current: false }, loadedExamData: original,
    refFormData: { primarySource: ' New source ', organization: '', curatedBy: '', references: [{ title: 'Title', url: '' }] },
    saveExamData: async value => { candidate = value; return null; },
    setShowRefModal: () => { closed = true; },
  })();
  assert.equal(candidate.updated_at, original.updated_at);
  assert.equal(candidate.adminOnly, true);
  assert.deepEqual(candidate.questions, original.questions);
  assert.equal(candidate.primarySource, 'New source');
  assert.equal(closed, false);
});

test('new exams include empty questions and only close after a confirmed database save', async () => {
  for (const succeeds of [false, true]) {
    let closed = false;
    let selected;
    let candidate;
    await handler('handleCreateExam', {
      examSaveInFlight: { current: false },
      newExamForm: { id: 'New Exam', name: ' Name ', category: 'Category', year: 2, type: 'Final', references: [] },
      saveExamData: async value => { candidate = value; return succeeds ? { ...value, updated_at: 'server-version' } : null; },
      setSelectedExamId: value => { selected = value; }, setShowNewExamModal: () => { closed = true; },
    })({ preventDefault() {} });
    assert.equal(candidate.id, 'new_exam');
    assert.deepEqual(candidate.questions, []);
    assert.equal(candidate.year, 2);
    assert.equal(candidate.type, 'Final');
    assert.equal(closed, succeeds);
    assert.equal(selected, succeeds ? 'new_exam' : undefined);
  }
});
