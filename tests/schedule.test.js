import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

let server;
let Schedule;

before(async () => {
  server = await createServer({
    configFile: false,
    plugins: [react()],
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: { port: 24680 } },
    appType: 'custom',
  });
  Schedule = (await server.ssrLoadModule('/src/components/Schedule.jsx')).default;
});

after(async () => { await server?.close(); });

test('renders the November 2569 final schedule with groups, rooms, and live countdowns', () => {
  const now = new Date('2026-11-01T08:00:00+07:00').getTime();
  const html = renderToStaticMarkup(createElement(Schedule, { now }));

  assert.equal((html.match(/06026211/g) ?? []).length, 2);
  assert.match(html, /กลุ่ม 12 ปฏิบัติ/);
  assert.match(html, /กลุ่ม 11 ทฤษฎี/);
  assert.match(html, /IT - Project Base4 ชั้น 3 - D4/);
  assert.match(html, /พุธ 4 พฤศจิกายน 2569/);
  assert.match(html, /IT - L304 - B6/);
  assert.match(html, /ศุกร์ 6 พฤศจิกายน 2569/);
  assert.match(html, /IT - M 22 - B10/);
  assert.equal((html.match(/06026240/g) ?? []).length, 2);
  assert.equal((html.match(/06026212/g) ?? []).length, 2);
  assert.match(html, /เหลืออีก 1 วันก่อนถึงวันสอบวิชานี้/);
  assert.match(html, /เหลืออีก 3 วันก่อนถึงวันสอบวิชานี้/);
  assert.match(html, /เหลืออีก 5 วันก่อนถึงวันสอบวิชานี้/);
  assert.match(html, /เหลืออีก 8 วันก่อนถึงวันสอบวิชานี้/);
  assert.match(html, /เหลืออีก 10 วันก่อนถึงวันสอบวิชานี้/);
  assert.match(html, />98%<\/span>/);
});
