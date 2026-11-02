import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EXAM_REFERENCES } from '../src/data/examReferences.js';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const readJson = async file => JSON.parse(await readFile(file, 'utf8'));

function uniqueRows(rows) {
  const ids = new Set();
  for (const row of rows) {
    if (ids.has(row.id)) throw new Error(`Duplicate exam ID: ${row.id}`);
    ids.add(row.id);
  }
}

export function prepareExam(source, metadata = {}, reference = {}) {
  const merged = { ...reference, ...source, ...metadata };
  if (!merged.id || typeof merged.id !== 'string' || !merged.name || typeof merged.name !== 'string') {
    throw new Error('Each exam needs a string id and name');
  }
  if (!Array.isArray(source.questions) || !source.questions.length) throw new Error(`${merged.id}: missing questions`);
  source.questions.forEach((question, index) => {
    const label = `${merged.id} question ${index + 1}`;
    if (typeof question.q !== 'string' || !question.q.trim() || !Array.isArray(question.choices) || question.choices.length < 2 || question.choices.some(choice => typeof choice !== 'string')) {
      throw new Error(`${label}: invalid question or choices`);
    }
    const answers = Array.isArray(question.answer) ? question.answer : [question.answer];
    if (!answers.length || new Set(answers).size !== answers.length || answers.some(answer => !Number.isInteger(answer) || answer < 0 || answer >= question.choices.length)) {
      throw new Error(`${label}: invalid answer indices`);
    }
    if (question.explain !== undefined && typeof question.explain !== 'string') throw new Error(`${label}: invalid explanation`);
  });
  return {
    id: merged.id,
    category: merged.category ?? 'General', name: merged.name,
    icon: merged.icon ?? '', color: merged.color ?? '#0070f3', iconBg: merged.iconBg ?? 'rgba(0,112,243,0.15)',
    desc: merged.desc ?? '', year: merged.year ?? 3, type: merged.type ?? 'Midterm',
    primarySource: merged.primarySource ?? null, organization: merged.organization ?? null,
    curatedBy: merged.curatedBy ?? null, references: merged.references ?? [],
    adminOnly: source.adminOnly === true || metadata.adminOnly === true,
    requiresAuth: source.requiresAuth === true || metadata.requiresAuth === true,
    questionCount: source.questions.length,
    questions: structuredClone(source.questions),
  };
}

export async function readLocalExams(root = projectRoot) {
  const [catalog, practiceCatalog, academyCatalog, practice] = await Promise.all([
    readJson(path.join(root, 'src/data/index.json')),
    readJson(path.join(root, 'src/data/catalogs/admin-practice.json')),
    readJson(path.join(root, 'src/data/catalogs/admin-academy.json')),
    readJson(path.join(root, 'server/data/aws-practice.json')),
  ]);
  uniqueRows([...catalog, ...practiceCatalog, ...academyCatalog]);
  uniqueRows(practice);
  if (practice.length !== practiceCatalog.length || practice.some(source => !practiceCatalog.some(meta => meta.id === source.id))) {
    throw new Error('Practice content and catalog IDs do not match');
  }
  const rows = [];
  for (const meta of catalog) {
    // Catalog IDs must be simple filenames, never arbitrary paths.
    if (!/^[a-zA-Z0-9_-]+$/.test(meta.id)) throw new Error(`Invalid exam ID: ${meta.id}`);
    const source = await readJson(path.join(root, `src/data/${meta.id}.json`));
    if (source.id !== meta.id) throw new Error(`Source ID mismatch: ${meta.id}`);
    rows.push(prepareExam(source, meta, EXAM_REFERENCES[meta.id]));
  }
  for (const meta of academyCatalog) {
    if (!/^[a-zA-Z0-9_-]+$/.test(meta.id)) throw new Error(`Invalid exam ID: ${meta.id}`);
    const source = await readJson(path.join(root, `server/data/${meta.id}.json`));
    if (source.id !== meta.id) throw new Error(`Source ID mismatch: ${meta.id}`);
    rows.push(prepareExam(source, { ...meta, adminOnly: true }, EXAM_REFERENCES[meta.id]));
  }
  for (const meta of practiceCatalog) {
    rows.push(prepareExam(practice.find(source => source.id === meta.id), { ...meta, adminOnly: true }, EXAM_REFERENCES[meta.id]));
  }
  uniqueRows(rows);
  return rows;
}

function checked(result, action) {
  if (result.error) throw new Error(`${action}: ${result.error.message || 'database request failed'}`);
  return result.data ?? [];
}

export async function backupRemoteExams(client, backupPath, pageSize = 500) {
  if (!backupPath) throw new Error('An explicit --backup path is required before applying');
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 1000) throw new Error('Invalid backup page size');
  const rows = [];
  let expectedCount;
  for (let offset = 0; ; offset += pageSize) {
    const response = await client.from('exams').select('*', { count: 'exact' }).order('id').range(offset, offset + pageSize - 1);
    const page = checked(response, 'Backup read');
    if (typeof response.count !== 'number') throw new Error('Backup did not return an exact row count');
    if (expectedCount !== undefined && response.count !== expectedCount) throw new Error('Remote exam count changed during backup; retry');
    expectedCount = response.count;
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  uniqueRows(rows);
  if (rows.length !== expectedCount) throw new Error('Incomplete backup; no writes performed');
  // Never overwrite an earlier backup; a missing parent directory also aborts.
  await writeFile(backupPath, JSON.stringify({ formatVersion: 1, createdAt: new Date().toISOString(), rows }, null, 2), { flag: 'wx', mode: 0o600 });
  return rows;
}

export async function applyImport(client, rows, { backupPath, pageSize = 500 } = {}) {
  uniqueRows(rows);
  const remote = await backupRemoteExams(client, backupPath, pageSize);
  const existing = new Map(remote.map(row => [row.id, row]));
  const result = { inserted: 0, filled: 0, skipped: 0, conflicted: 0, backedUp: remote.length };
  const privateIds = rows.filter(row => row.adminOnly).map(row => row.id);
  // Apply access restrictions before any content upload, including old rows
  // whose existing nonempty question arrays are deliberately left untouched.
  if (privateIds.length) checked(await client.from('exams').update({ adminOnly: true }).in('id', privateIds), 'Protect private exams');
  for (const row of rows) {
    const old = existing.get(row.id);
    if (!old) {
      const inserted = checked(await client.from('exams').upsert(row, { onConflict: 'id', ignoreDuplicates: true }).select('id'), `Insert ${row.id}`);
      result[inserted.length ? 'inserted' : 'conflicted']++;
      continue;
    }
    if (!Array.isArray(old.questions)) throw new Error(`${row.id}: remote questions is not an array; apply setup SQL first`);
    if (old.questions.length) { result.skipped++; continue; }
    const patch = { questions: row.questions, questionCount: row.questionCount };
    for (const key of ['primarySource', 'organization', 'curatedBy']) if (old[key] == null && row[key] != null) patch[key] = row[key];
    if ((!old.references || old.references.length === 0) && row.references.length) patch.references = row.references;
    if (row.requiresAuth) patch.requiresAuth = true;
    // Private flags were already raised above; omit false values entirely.
    let update = client.from('exams').update(patch).eq('id', row.id).eq('questions', '[]');
    // The private flag update runs the timestamp trigger, so condition on empty
    // questions for private rows; for other rows also protect concurrent metadata.
    if (!row.adminOnly && old.updated_at != null) update = update.eq('updated_at', old.updated_at);
    const filled = checked(await update.select('id'), `Fill ${row.id}`);
    result[filled.length ? 'filled' : 'conflicted']++;
  }
  return result;
}

// Dollar-quoted literals avoid conflicts with apostrophes and backslashes in
// Thai explanations and LaTeX content. The tag is deliberately unusual and
// is rejected if source content ever contains it.
const sqlLiteral = value => {
  const text = String(value);
  const tag = '$exam_content$';
  if (text.includes(tag)) throw new Error('Exam text contains reserved SQL dollar-quote tag');
  return `${tag}${text}${tag}`;
};
const identifier = value => `"${value.replaceAll('"', '""')}"`;

export function buildSeedSql(rows) {
  uniqueRows(rows);
  const privateIds = rows.filter(row => row.adminOnly).map(row => sqlLiteral(row.id));
  const statements = privateIds.length ? [`UPDATE public.exams SET "adminOnly" = true WHERE id IN (${privateIds.join(', ')});`] : [];
  for (const row of rows) {
    const keys = Object.keys(row);
    const values = keys.map(key => {
      const value = row[key];
      if (value === null) return 'NULL';
      if (typeof value === 'boolean' || typeof value === 'number') return String(value);
      return sqlLiteral(typeof value === 'object' ? JSON.stringify(value) : value) + (typeof value === 'object' ? '::jsonb' : '');
    });
    statements.push(`INSERT INTO public.exams (${keys.map(identifier).join(', ')})\nVALUES (${values.join(', ')})\nON CONFLICT (id) DO UPDATE SET\n  questions = EXCLUDED.questions,\n  "questionCount" = EXCLUDED."questionCount",\n  "adminOnly" = public.exams."adminOnly" OR EXCLUDED."adminOnly",\n  "requiresAuth" = public.exams."requiresAuth" OR EXCLUDED."requiresAuth",\n  "primarySource" = COALESCE(public.exams."primarySource", EXCLUDED."primarySource"),\n  organization = COALESCE(public.exams.organization, EXCLUDED.organization),\n  "curatedBy" = COALESCE(public.exams."curatedBy", EXCLUDED."curatedBy"),\n  "references" = CASE WHEN public.exams."references" IS NULL OR public.exams."references" = '[]'::jsonb THEN EXCLUDED."references" ELSE public.exams."references" END\nWHERE public.exams.questions = '[]'::jsonb;`);
  }
  return statements.join('\n\n');
}

export async function exportSql(rows, outputPath, root = projectRoot) {
  const setup = await readFile(path.join(root, 'scripts/setup-exam-content.sql'), 'utf8');
  const suffix = new Date().toISOString().replaceAll(/[^0-9]/g, '');
  const backupTable = `exams_${suffix}`;
  const backup = `\n-- SQL Editor recovery snapshot: restricted schema, never exposed through public.\nCREATE SCHEMA IF NOT EXISTS exam_import_backups;\nREVOKE ALL ON SCHEMA exam_import_backups FROM PUBLIC, anon, authenticated;\nDO $backup$ BEGIN\n  IF to_regclass('public.exams') IS NOT NULL THEN\n    CREATE TABLE exam_import_backups.${backupTable} AS TABLE public.exams;\n    REVOKE ALL ON exam_import_backups.${backupTable} FROM PUBLIC, anon, authenticated;\n  END IF;\nEND $backup$;\n`;
  const sql = setup.replace(/BEGIN;/, `BEGIN;\n${backup}`).replace(/COMMIT;\s*$/i, `${buildSeedSql(rows)}\n\nCOMMIT;\n`);
  await writeFile(outputPath, sql, { flag: 'wx', mode: 0o600 });
  return backupTable;
}

async function main(args) {
  const apply = args.includes('--apply');
  const valueFor = flag => {
    const index = args.indexOf(flag);
    if (index === -1) return undefined;
    if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${flag} requires a file path`);
    return path.resolve(args[index + 1]);
  };
  const backupPath = valueFor('--backup');
  const sqlPath = valueFor('--export-sql');
  const known = new Set(['--apply', '--backup', '--export-sql']);
  for (let index = 0; index < args.length; index++) {
    if (!known.has(args[index])) throw new Error(`Unknown argument: ${args[index]}`);
    if (args[index] === '--backup' || args[index] === '--export-sql') index++;
  }
  if (apply && sqlPath) throw new Error('Use either --apply or --export-sql');
  const rows = await readLocalExams();
  for (const row of rows) console.log(`${row.id}: ${row.questionCount} questions (${row.adminOnly ? 'admin' : 'public'})`);
  console.log(`${rows.length} exams, ${rows.reduce((sum, row) => sum + row.questionCount, 0)} questions. ${apply ? 'Applying import.' : 'Dry run: no database access.'}`);
  if (sqlPath) {
    const backupTable = await exportSql(rows, sqlPath);
    console.log(`SQL saved to ${sqlPath}. On execution, existing rows are backed up to exam_import_backups.${backupTable}.`);
  }
  if (!apply) return;
  if (!backupPath) throw new Error('--apply requires --backup <new-file-path>');
  // Credentials are loaded only for an explicitly requested live import.
  const { default: dotenv } = await import('dotenv');
  dotenv.config({ quiet: true });
  const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: key } = process.env;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY');
  const { createClient } = await import('@supabase/supabase-js');
  const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  console.log(JSON.stringify(await applyImport(client, rows, { backupPath })));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => {
    let message = error.message || 'Import failed';
    if (process.env.SUPABASE_SECRET_KEY) message = message.replaceAll(process.env.SUPABASE_SECRET_KEY, '[redacted]');
    console.error(message);
    process.exitCode = 1;
  });
}
