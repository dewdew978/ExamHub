import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';

let server;
let origin;
const originalUrl = process.env.SUPABASE_URL;
const originalKey = process.env.SUPABASE_PUBLISHABLE_KEY;
before(async () => {
  // Anonymous requests never call Supabase; keep this test runnable without .env.
  process.env.SUPABASE_URL ||= 'https://example.supabase.co';
  process.env.SUPABASE_PUBLISHABLE_KEY ||= 'test-publishable-key';
  server = await createServer({ logLevel: 'silent', cacheDir: `node_modules/.vite-tests/admin-practice-${process.pid}`,
    server: { host: '127.0.0.1', port: 0, ws: false } });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});
after(async () => {
  await server?.close();
  if (originalUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = originalUrl;
  if (originalKey === undefined) delete process.env.SUPABASE_PUBLISHABLE_KEY;
  else process.env.SUPABASE_PUBLISHABLE_KEY = originalKey;
});

test('local API denies anonymous requests without caching its response', async () => {
  const response = await fetch(`${origin}/api/admin-practice?id=aws_practice_module_01`);
  assert.equal(response.status, 401);
  assert.match(response.headers.get('cache-control'), /no-store/);
  assert.deepEqual(await response.json(), { error: 'Authentication required' });
});

test('Vite refuses direct, raw and absolute-path requests for server-only question data', async () => {
  const absolutePath = new URL('../server/data/aws-practice.json', import.meta.url).pathname.replace(/^\/(\w:)/, '$1');
  for (const path of [
    '/server/data/aws-practice.json',
    '/server/data/aws-practice.json?raw',
    '/server/data/aws-practice.json?import',
    `/@fs/${absolutePath}`,
    `/@fs/${absolutePath}?raw`,
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 403, path);
    assert.doesNotMatch(await response.text(), /sourceNumber|Capital|Invest in more fixed/);
  }
});

test('ACA and ACF cannot be downloaded from old public paths or private server paths', async () => {
  for (const id of ['aws_aca_modules_50q', 'aws_acf_modules_71q']) {
    for (const suffix of ['', '?raw', '?import']) {
      const oldResponse = await fetch(`${origin}/src/data/${id}.json${suffix}`);
      // The SPA fallback may return HTML with status 200 for a removed file.
      const oldBody = await oldResponse.text();
      assert.doesNotMatch(oldBody, /["']questions["']\s*:/);
      const privateResponse = await fetch(`${origin}/server/data/${id}.json${suffix}`);
      assert.equal(privateResponse.status, 403);
    }
    const apiResponse = await fetch(`${origin}/api/admin-practice?id=${id}`);
    assert.equal(apiResponse.status, 401);
  }
});
