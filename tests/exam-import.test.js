import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { prepareExam, readLocalExams, applyImport, buildSeedSql } from '../scripts/migrate-exam-content.mjs';

const question = { q: 'Choose two', choices: ['A', 'B', 'C'], answer: [2, 0], explain: 'Why', sourceNumber: 42 };
const exam = { id: 'sample', name: 'Example', questions: [question] };

test('preparation retains exact questions, order, answer arrays and references', () => {
  const row = prepareExam(exam, { year: 2, requiresAuth: true }, { organization: 'School', references: [{ title: 'Book' }] });
  assert.deepEqual(row.questions, [question]);
  assert.equal(row.questionCount, 1);
  assert.equal(row.year, 2);
  assert.equal(row.requiresAuth, true);
  assert.equal(row.organization, 'School');
  assert.deepEqual(row.references, [{ title: 'Book' }]);
});

test('invalid answer indices and duplicate answer indices stop import', () => {
  for (const answer of [-1, 3, [], [0, 0]]) {
    assert.throws(() => prepareExam({ ...exam, questions: [{ ...question, answer }] }), /answer/i);
  }
});

test('local import combines public, academy and practice sources without changing content', async () => {
  // Synthetic fixtures keep private migration backups out of the public repository.
  const root = await mkdtemp(path.join(tmpdir(), 'examhub-sources-'));
  try {
    for (const dir of ['src/data/catalogs', 'server/data']) await mkdir(path.join(root, dir), { recursive: true });
    const publicExam = { ...exam, id: 'fixture_public' };
    const academyExam = { ...exam, id: 'aws_aca_modules_50q', adminOnly: true, references: [{ title: 'Fixture reference' }] };
    const practiceExam = { ...exam, id: 'aws_practice_module_01', adminOnly: true };
    const files = {
      'src/data/index.json': [{ id: publicExam.id, name: publicExam.name }],
      'src/data/catalogs/admin-academy.json': [{ id: academyExam.id, name: academyExam.name }],
      'src/data/catalogs/admin-practice.json': [{ id: practiceExam.id, name: practiceExam.name }],
      'src/data/fixture_public.json': publicExam,
      'server/data/aws_aca_modules_50q.json': academyExam,
      'server/data/aws-practice.json': [practiceExam],
    };
    for (const [file, value] of Object.entries(files)) await writeFile(path.join(root, file), JSON.stringify(value));
    const rows = await readLocalExams(root);
    const index = JSON.parse(await readFile(path.join(root, 'src/data/index.json'), 'utf8'));
    const practice = JSON.parse(await readFile(path.join(root, 'server/data/aws-practice.json'), 'utf8'));
    const academy = JSON.parse(await readFile(path.join(root, 'src/data/catalogs/admin-academy.json'), 'utf8'));
    assert.equal(rows.length, index.length + practice.length + academy.length);
    assert.equal(new Set(rows.map(row => row.id)).size, rows.length);
    for (const meta of index) {
      const source = JSON.parse(await readFile(path.join(root, `src/data/${meta.id}.json`), 'utf8'));
      assert.deepEqual(rows.find(row => row.id === meta.id).questions, source.questions);
    }
    for (const source of practice) {
      const row = rows.find(row => row.id === source.id);
      assert.deepEqual(row.questions, source.questions);
      assert.equal(row.adminOnly, true);
    }
    for (const meta of academy) {
      const row = rows.find(row => row.id === meta.id);
      assert.equal(row.adminOnly, true);
      assert.ok(row.references.length > 0);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

// Supabase is an external boundary: retain a small stateful query double so the
// assertions concern imported content, backup ordering and concurrent changes.
function database(initial, { failRead = false, race = false } = {}) {
  const rows = structuredClone(initial);
  let firstWrite = true;
  return { rows, from() {
    const query = { action: 'read', filters: [], from: 0, to: Infinity,
      select() { return this; }, order() { return this; }, range(a, b) { this.from = a; this.to = b; return this; },
      eq(key, value) { this.filters.push(row => key === 'questions' ? JSON.stringify(row[key]) === value : row[key] === value); return this; },
      is(key, value) { this.filters.push(row => row[key] === value); return this; },
      in(key, values) { this.filters.push(row => values.includes(row[key])); return this; },
      update(value) { this.action = 'update'; this.value = value; return this; },
      upsert(value) { this.action = 'insert'; this.value = value; return this; },
      async then(resolve, reject) {
        try {
          if (this.action === 'read') return resolve(failRead ? { error: { message: 'Read denied' } } : { data: rows.slice(this.from, this.to + 1), count: rows.length, error: null });
          if (firstWrite && race) { rows[0].questions = [{ ...question, q: 'Concurrent remote edit' }]; firstWrite = false; }
          if (this.action === 'insert') {
            if (rows.some(row => row.id === this.value.id)) return resolve({ data: [], error: null });
            rows.push(structuredClone(this.value));
            return resolve({ data: [{ id: this.value.id }], error: null });
          }
          const matched = rows.filter(row => this.filters.every(filter => filter(row)));
          matched.forEach(row => Object.assign(row, structuredClone(this.value)));
          return resolve({ data: matched.map(({ id }) => ({ id })), error: null });
        } catch (error) { return reject(error); }
      },
    };
    return query;
  } };
}

async function withBackup(run) {
  const folder = await mkdtemp(path.join(tmpdir(), 'examhub-import-'));
  try { await run(path.join(folder, 'backup.json')); }
  finally { await rm(folder, { recursive: true, force: true }); }
}

test('apply saves complete backup and retains existing remote questions and metadata', async () => withBackup(async backupPath => {
  const existing = { id: 'sample', name: 'Remote name', questions: [{ ...question, q: 'Remote edit' }], adminOnly: true, updated_at: 'old' };
  const db = database([existing]);
  const result = await applyImport(db, [prepareExam(exam), prepareExam({ ...exam, id: 'new' })], { backupPath, pageSize: 1 });
  const backup = JSON.parse(await readFile(backupPath, 'utf8'));
  assert.deepEqual(backup.rows, [existing]);
  assert.deepEqual(db.rows[0], existing);
  assert.deepEqual(db.rows[1].questions, [question]);
  assert.deepEqual(result, { inserted: 1, filled: 0, skipped: 1, conflicted: 0, backedUp: 1 });
}));

test('apply fills an empty remote array without downgrading private flags', async () => withBackup(async backupPath => {
  const db = database([{ id: 'sample', name: 'Remote name', questions: [], adminOnly: true, requiresAuth: true, updated_at: 'old' }]);
  await applyImport(db, [prepareExam(exam)], { backupPath });
  assert.deepEqual(db.rows[0].questions, [question]);
  assert.equal(db.rows[0].adminOnly, true);
  assert.equal(db.rows[0].requiresAuth, true);
  assert.equal(db.rows[0].name, 'Remote name');
}));

test('a concurrent remote edit wins over initial import', async () => withBackup(async backupPath => {
  const db = database([{ id: 'sample', questions: [], updated_at: 'old' }], { race: true });
  const result = await applyImport(db, [prepareExam(exam)], { backupPath });
  assert.equal(db.rows[0].questions[0].q, 'Concurrent remote edit');
  assert.equal(result.conflicted, 1);
}));

test('backup failure or read failure prevents every write', async () => withBackup(async backupPath => {
  const db = database([]);
  await assert.rejects(applyImport(db, [prepareExam(exam)], { backupPath: path.join(backupPath, 'missing', 'backup.json') }));
  assert.deepEqual(db.rows, []);
  await assert.rejects(applyImport(database([], { failRead: true }), [prepareExam(exam)], { backupPath }), /Read denied/);
}));

test('duplicate source IDs are rejected before writes', async () => withBackup(async backupPath => {
  const db = database([]);
  await assert.rejects(applyImport(db, [prepareExam(exam), prepareExam(exam)], { backupPath }), /duplicate/i);
  assert.deepEqual(db.rows, []);
}));

test('SQL seed safely quotes text and uses conditional nonempty-content protection', () => {
  const sql = buildSeedSql([prepareExam({ ...exam, name: "O'Brien \\ notes" })]);
  // Dollar quoting preserves apostrophes and backslashes literally.
  assert.ok(sql.includes("$exam_content$O'Brien \\ notes$exam_content$"));
  assert.ok(sql.includes('ON CONFLICT (id) DO UPDATE'));
  assert.ok(sql.includes("WHERE public.exams.questions = '[]'::jsonb"));
  assert.ok(sql.includes('public.exams."adminOnly" OR EXCLUDED."adminOnly"'));
});

test('SQL seed rejects content that could terminate its dollar-quoted literal', () => {
  assert.throws(() => buildSeedSql([prepareExam({ ...exam,
    name: "$exam_content$); DROP TABLE public.exams; --",
  })]), /reserved SQL dollar-quote tag/);
});
