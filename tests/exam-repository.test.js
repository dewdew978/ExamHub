import assert from 'node:assert/strict';
import test from 'node:test';
import { createClient } from '@supabase/supabase-js';
import { loadExamCatalog, loadExam, saveExam, toExamRow } from '../src/lib/examRepository.js';

const question = { q: 'เลือกสองข้อ', choices: ['หนึ่ง', 'สอง', 'สาม'], answer: [0, 2], explain: 'เหตุผล', sourceNumber: 3 };
const exam = { id: 'sample', name: 'Sample', year: 3, type: 'Final', questions: [question], updated_at: '2026-11-02T00:00:00Z' };
function fixture(responder) {
  const requests = [];
  const client = createClient('https://database.example.test', 'sb_publishable_test', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: async (url, options) => {
      const request = { url: new URL(url), method: options.method, body: options.body ? JSON.parse(options.body) : null };
      requests.push(request);
      const reply = responder(request);
      return new Response(JSON.stringify(reply.body), { status: reply.status || 200, headers: { 'Content-Type': 'application/json' } });
    } },
  });
  return { client, requests };
}

test('catalog selects metadata only and propagates database errors', async () => {
  const { client, requests } = fixture(() => ({ body: [{ id: 'sample', name: 'Sample' }] }));
  assert.equal((await loadExamCatalog(client))[0].id, 'sample');
  const columns = requests[0].url.searchParams.get('select').split(',');
  assert.ok(columns.includes('adminOnly'));
  assert.equal(columns.includes('questions'), false);
  assert.equal(columns.includes('*'), false);
  const failed = fixture(() => ({ status: 503, body: { message: 'database unavailable' } }));
  await assert.rejects(loadExamCatalog(failed.client), /database unavailable/);
});

test('load reads the requested complete exam and rejects hidden or missing records', async () => {
  const { client, requests } = fixture(() => ({ body: exam }));
  assert.deepEqual((await loadExam(client, 'sample')).questions, [question]);
  assert.equal(requests[0].url.searchParams.get('id'), 'eq.sample');
  const missing = fixture(() => ({ status: 406, body: { code: 'PGRST116', message: 'not found' } }));
  await assert.rejects(loadExam(missing.client, 'missing'), /not found/);
});

test('practice loads reject empty exams while admins can still load an empty draft for editing', async () => {
  const { client } = fixture(() => ({ body: { ...exam, questions: [] } }));
  assert.deepEqual((await loadExam(client, 'sample')).questions, []);
  await assert.rejects(loadExam(client, 'sample', { requireQuestions: true }), /ยังไม่มีคำถาม/);
});

test('rows preserve multi-answer questions and omit UI-only fields and client timestamps', () => {
  const row = toExamRow({ ...exam, questionCount: 99, isCustomModified: true, requiresAuth: false, adminOnly: true });
  assert.equal(row.questionCount, 1);
  assert.deepEqual(row.questions, [question]);
  assert.equal(row.adminOnly, true);
  assert.equal('isCustomModified' in row, false);
  assert.equal('updated_at' in row, false);
  assert.deepEqual(exam.questions[0].answer, [0, 2]);
});

test('invalid or duplicate answer indices are rejected before writing', () => {
  for (const answer of [-1, 3, [0, 0], [], [0, 3], 'A']) {
    assert.throws(() => toExamRow({ ...exam, questions: [{ ...question, answer }] }), /คำตอบ|answer/);
  }
  assert.throws(() => toExamRow({ ...exam, questions: [{ ...question, choices: ['only one'] }] }), /ตัวเลือก|choices/);
});

test('save confirms a timestamp-checked update and rejects stale writes without overwriting', async () => {
  const { client, requests } = fixture(() => ({ body: { ...exam, updated_at: '2026-11-02T00:01:00Z' } }));
  const saved = await saveExam(client, exam);
  assert.equal(saved.updated_at, '2026-11-02T00:01:00Z');
  assert.equal(requests[0].method, 'PATCH');
  assert.equal(requests[0].url.searchParams.get('updated_at'), 'eq.' + exam.updated_at);
  assert.equal(requests[0].body.questionCount, 1);
  const stale = fixture(() => ({ status: 406, body: { code: 'PGRST116', message: 'zero rows' } }));
  await assert.rejects(saveExam(stale.client, exam), /แก้ไข|เปลี่ยน|โหลด|conflict/i);
  assert.equal(stale.requests.length, 1);
});

test('new records use insert and do not overwrite an existing id', async () => {
  const newExam = { ...exam, updated_at: undefined, questions: [] };
  const { client, requests } = fixture(() => ({ body: { ...newExam, updated_at: 'now' } }));
  await saveExam(client, newExam);
  assert.equal(requests[0].method, 'POST');
  assert.equal(requests[0].url.searchParams.has('on_conflict'), false);
  const duplicate = fixture(() => ({ status: 409, body: { code: '23505', message: 'duplicate id' } }));
  await assert.rejects(saveExam(duplicate.client, newExam), /duplicate id/);
});
