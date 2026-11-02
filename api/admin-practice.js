import { createContextClient } from '@supabase/server/core';
import { createAdminPracticeHandler } from '../server/adminPractice.js';

export async function serveAdminPractice(req, res, env) {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(503).json({ error: 'Authentication service is not configured' });
  }
  const contextEnv = { url, publishableKeys: { default: key } };
  const client = createContextClient({ env: contextEnv });
  const handle = createAdminPracticeHandler(async token => {
    const { data, error } = await client.auth.getUser(token);
    return error ? null : data.user;
  }, async (id, token) => {
    // Use the verified caller's identity so RLS still applies to this read.
    const caller = createContextClient({ env: contextEnv, auth: { token } });
    const { data, error } = await caller.from('exams').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  });
  const result = await handle(req);
  for (const [name, value] of Object.entries(result.headers)) res.setHeader(name, value);
  return res.status(result.status).json(result.body);
}

export default function handler(req, res) {
  return serveAdminPractice(req, res, process.env);
}
