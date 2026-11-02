import assert from 'node:assert/strict';
import test from 'node:test';

test('private practice handler rejects guests, regular users and forged metadata', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  const exams = [{ id: 'aws_practice_module_01', questions: [{ q: 'private question' }] }];
  for (const [token, user, expected] of [
    [null, null, 401],
    ['expired', null, 401],
    ['member', { app_metadata: {}, user_metadata: { role: 'admin' } }, 403],
  ]) {
    const handler = createAdminPracticeHandler(async () => user, async () => {
      assert.fail('Unauthorized requests must not load exam content');
    });
    const result = await handler({ method: 'GET', headers: token ? { authorization: `Bearer ${token}` } : {}, query: { id: exams[0].id } });
    assert.equal(result.status, expected);
    assert.doesNotMatch(JSON.stringify(result.body), /private question/);
    assert.match(result.headers['Cache-Control'], /no-store/);
  }
});

test('verified admins can load one module and cannot request arbitrary files', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  const exams = [{ id: 'aws_practice_module_01', questions: [{ q: 'private question' }] }];
  const handler = createAdminPracticeHandler(async () => ({ app_metadata: { role: 'admin' } }),
    async id => { assert.doesNotMatch(id, /[./\\]/); return exams.find(exam => exam.id === id); });
  const request = id => ({ method: 'GET', headers: { authorization: 'Bearer verified' }, query: { id } });
  assert.deepEqual((await handler(request(exams[0].id))).body, exams[0]);
  assert.equal((await handler(request('../.env'))).status, 404);
  assert.equal((await handler({ ...request(exams[0].id), method: 'POST' })).status, 405);
});

test('auth service failures fail closed', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  const handler = createAdminPracticeHandler(async () => { throw new Error('unavailable'); }, async () => {
    assert.fail('Failed authentication must not load exam content');
  });
  assert.equal((await handler({ method: 'GET', headers: { authorization: 'Bearer token' }, query: {} })).status, 401);
});

test('private catalog is absent for guests and members but available to admins', async () => {
  const { getVisibleSubjects } = await import('../src/lib/adminPractice.js');
  const publicSubjects = [{ id: 'public' }, { id: 'aws_practice_module_01', adminOnly: true }, { id: 'new_private', adminOnly: true }];
  assert.deepEqual(getVisibleSubjects(publicSubjects, null), [{ id: 'public' }]);
  assert.deepEqual(getVisibleSubjects(publicSubjects, { user_metadata: { role: 'admin' } }), [{ id: 'public' }]);
  assert.deepEqual(getVisibleSubjects(publicSubjects, { app_metadata: { role: 'admin' } }), publicSubjects);
  assert.deepEqual(getVisibleSubjects([], { app_metadata: { role: 'admin' } }), []);
});

test('multi-answer scoring requires the complete set without duplicates', async () => {
  const { isCorrectAnswer, includesChoice } = await import('../src/lib/examAnswers.js');
  assert.equal(isCorrectAnswer([4, 3], [3, 4]), true);
  assert.equal(isCorrectAnswer([3], [3, 4]), false);
  assert.equal(isCorrectAnswer([3, 3], [3, 4]), false);
  assert.equal(isCorrectAnswer(null, [3, 4]), false);
  assert.equal(isCorrectAnswer(2, 2), true);
  assert.equal(includesChoice([3, 4], 4), true);
});

test('legacy private IDs remain protected without replacing remote metadata', async () => {
  const { getVisibleSubjects, isAdminPractice } = await import('../src/lib/adminPractice.js');
  const subjects = [{ id: 'public' }, { id: 'aws_aca_modules_50q', name: 'Remote ACA', questionCount: 51 }, { id: 'aws_acf_modules_71q', name: 'Remote ACF', questionCount: 72 }];
  for (const user of [null, { app_metadata: {} }, { user_metadata: { role: 'admin' } }]) {
    assert.deepEqual(getVisibleSubjects(subjects, user), [{ id: 'public' }]);
  }
  const adminSubjects = getVisibleSubjects(subjects, { app_metadata: { role: 'admin' } });
  for (const [id, count] of [['aws_aca_modules_50q', 51], ['aws_acf_modules_71q', 72]]) {
    assert.equal(isAdminPractice(id), true);
    const matching = adminSubjects.filter(exam => exam.id === id);
    assert.equal(matching.length, 1);
    assert.equal(matching[0].adminOnly, true);
    assert.equal(matching[0].questionCount, count);
    assert.equal(matching[0].name, subjects.find(subject => subject.id === id).name);
  }
  assert.equal(isAdminPractice('new_private', { adminOnly: true }), true);
  assert.equal(isAdminPractice('new_public', { adminOnly: false }), false);
});

test('ACA and ACF content is served only after server verification of admin role', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  for (const id of ['aws_aca_modules_50q', 'aws_acf_modules_71q']) {
    const exam = { id, adminOnly: true, questions: [{ q: 'Private fixture question' }] };
    for (const [user, expected] of [[null, 401], [{ app_metadata: {} }, 403], [{ app_metadata: { role: 'admin' } }, 200]]) {
      const handler = createAdminPracticeHandler(async () => user, async requestedId => requestedId === id ? exam : null);
      const result = await handler({ method: 'GET', headers: { authorization: 'Bearer verified' }, query: { id } });
      assert.equal(result.status, expected);
      if (expected === 200) assert.equal(result.body.questions.length, 1);
      else assert.equal(result.body.questions, undefined);
    }
  }
});

test('private API reads fresh database content with the verified caller on every request', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  let current = { id: 'aws_practice_module_01', questions: [{ q: 'Before admin edit' }] };
  const handler = createAdminPracticeHandler(async token => {
    assert.equal(token, 'verified');
    return { app_metadata: { role: 'admin' } };
  }, async (id, token) => {
    assert.equal(id, 'aws_practice_module_01');
    assert.equal(token, 'verified');
    return structuredClone(current);
  });
  const request = { method: 'GET', headers: { authorization: 'Bearer verified' }, query: { id: current.id } };
  assert.equal((await handler(request)).body.questions[0].q, 'Before admin edit');
  current = { ...current, questions: [{ q: 'Persisted admin edit' }] };
  assert.equal((await handler(request)).body.questions[0].q, 'Persisted admin edit');
});

test('private API database failures do not return stale content or database details', async () => {
  const { createAdminPracticeHandler } = await import('../server/adminPractice.js');
  const handler = createAdminPracticeHandler(async () => ({ app_metadata: { role: 'admin' } }), async () => {
    throw new Error('internal database details');
  });
  const result = await handler({ method: 'GET', headers: { authorization: 'Bearer verified' }, query: { id: 'aws_practice_module_01' } });
  assert.equal(result.status, 503);
  assert.match(result.headers['Cache-Control'], /no-store/);
  assert.doesNotMatch(JSON.stringify(result.body), /internal database details|questions/);
});

test('API route verifies the user and reads the database using the same user token', async t => {
  const { serveAdminPractice } = await import('../api/admin-practice.js');
  const requests = [];
  const current = { id: 'aws_practice_module_01', questions: [{ q: 'Latest database question' }] };
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const request = { url: new URL(url), authorization: new Headers(options.headers).get('authorization') };
    requests.push(request);
    assert.equal(request.authorization, 'Bearer verified');
    let body;
    if (request.url.pathname === '/auth/v1/user') body = { id: 'admin', app_metadata: { role: 'admin' } };
    else {
      assert.equal(request.url.pathname, '/rest/v1/exams');
      assert.equal(request.url.searchParams.get('id'), 'eq.aws_practice_module_01');
      body = [current];
    }
    return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
  });
  const response = { headers: {}, setHeader(key, value) { this.headers[key] = value; },
    status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; } };
  await serveAdminPractice({ method: 'GET', headers: { authorization: 'Bearer verified' }, query: { id: current.id } },
    response, { SUPABASE_URL: 'https://database.example.test', SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test' });
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, current);
  assert.equal(requests.length, 2);
  assert.match(response.headers['Cache-Control'], /no-store/);
});
