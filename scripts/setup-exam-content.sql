-- Standalone, repeatable setup for Supabase SQL Editor. No exam content is deleted.
-- Use migrate-exam-content.mjs --export-sql for setup + seed + recovery snapshot.
BEGIN;

CREATE TABLE IF NOT EXISTS public.exams (
  id text PRIMARY KEY,
  category text NOT NULL DEFAULT 'General',
  name text NOT NULL,
  icon text DEFAULT '',
  color text DEFAULT '#0070f3',
  "iconBg" text DEFAULT 'rgba(0,112,243,0.15)',
  "desc" text DEFAULT '',
  "questionCount" integer DEFAULT 0,
  year integer DEFAULT 3,
  type text DEFAULT 'Midterm',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.exams
  ADD COLUMN IF NOT EXISTS "primarySource" text,
  ADD COLUMN IF NOT EXISTS organization text,
  ADD COLUMN IF NOT EXISTS "curatedBy" text,
  ADD COLUMN IF NOT EXISTS "references" jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS "adminOnly" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "requiresAuth" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Also finish a partially applied earlier schema without discarding any array.
UPDATE public.exams SET questions = '[]'::jsonb WHERE questions IS NULL;
UPDATE public.exams SET "adminOnly" = false WHERE "adminOnly" IS NULL;
UPDATE public.exams SET "requiresAuth" = false WHERE "requiresAuth" IS NULL;
ALTER TABLE public.exams
  ALTER COLUMN questions SET DEFAULT '[]'::jsonb,
  ALTER COLUMN questions SET NOT NULL,
  ALTER COLUMN "adminOnly" SET DEFAULT false,
  ALTER COLUMN "adminOnly" SET NOT NULL,
  ALTER COLUMN "requiresAuth" SET DEFAULT false,
  ALTER COLUMN "requiresAuth" SET NOT NULL;

DO $constraint$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.exams'::regclass AND conname = 'exams_questions_array'
  ) THEN
    ALTER TABLE public.exams ADD CONSTRAINT exams_questions_array
      CHECK (jsonb_typeof(questions) = 'array');
  END IF;
END $constraint$;

CREATE OR REPLACE FUNCTION public.set_exam_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $trigger$
BEGIN
  NEW.updated_at = clock_timestamp();
  RETURN NEW;
END;
$trigger$;
REVOKE ALL ON FUNCTION public.set_exam_content_updated_at() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS exams_content_updated_at ON public.exams;
CREATE TRIGGER exams_content_updated_at
BEFORE UPDATE ON public.exams
FOR EACH ROW EXECUTE FUNCTION public.set_exam_content_updated_at();

-- Protect known private rows before importing their question arrays.
-- These IDs are the academy catalog and the complete admin-practice catalog.
UPDATE public.exams SET "adminOnly" = true
WHERE id IN (
  'aws_aca_modules_50q', 'aws_acf_modules_71q',
  'aws_practice_module_01', 'aws_practice_module_02',
  'aws_practice_module_03', 'aws_practice_module_04',
  'aws_practice_module_05', 'aws_practice_module_06',
  'aws_practice_module_07', 'aws_practice_module_08',
  'aws_practice_module_09', 'aws_practice_module_10',
  'aws_practice_module_11', 'aws_practice_module_12'
);

ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- Permissive policies combine with OR. Remove every policy on exams only,
-- including the legacy public-read and FOR ALL policies, before replacing them.
DO $policies$
DECLARE p record;
BEGIN
  FOR p IN SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'exams'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.exams', p.policyname);
  END LOOP;
END $policies$;

CREATE POLICY exams_public_read ON public.exams FOR SELECT TO anon, authenticated
  USING (NOT "adminOnly" OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY exams_admin_insert ON public.exams FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY exams_admin_update ON public.exams FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
CREATE POLICY exams_admin_delete ON public.exams FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- requiresAuth keeps its existing meaning: catalog-visible, login-gated start
-- in the app. Only adminOnly is a confidentiality boundary enforced by RLS.
REVOKE ALL ON public.exams FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.exams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exams TO authenticated;
GRANT ALL ON public.exams TO service_role;

NOTIFY pgrst, 'reload schema';
COMMIT;
