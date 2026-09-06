-- ==========================================================
-- EXETIA / ExamHub: Add References & Sources to Exams Table
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. Ensure table exams exists
CREATE TABLE IF NOT EXISTS public.exams (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'General',
  name TEXT NOT NULL,
  icon TEXT DEFAULT '📝',
  color TEXT DEFAULT '#0070f3',
  "iconBg" TEXT DEFAULT 'rgba(0,112,243,0.15)',
  "desc" TEXT DEFAULT '',
  "questionCount" INTEGER DEFAULT 0,
  year INTEGER DEFAULT 3,
  type TEXT DEFAULT 'Midterm',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add columns for bibliographic references & curriculum sources
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS "primarySource" TEXT,
ADD COLUMN IF NOT EXISTS organization TEXT,
ADD COLUMN IF NOT EXISTS "curatedBy" TEXT,
ADD COLUMN IF NOT EXISTS "references" JSONB DEFAULT '[]'::jsonb;

-- Optional snake_case aliases for SQL flexibility
ALTER TABLE public.exams 
ADD COLUMN IF NOT EXISTS primary_source TEXT,
ADD COLUMN IF NOT EXISTS curated_by TEXT;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;

-- 4. Setup RLS policies
DROP POLICY IF EXISTS "Allow public read access to exams" ON public.exams;
DROP POLICY IF EXISTS "Allow admins full access to exams" ON public.exams;

-- Anyone can view exams
CREATE POLICY "Allow public read access to exams"
ON public.exams FOR SELECT
TO public
USING (true);

-- Admins can create, update, and delete exams
CREATE POLICY "Allow admins full access to exams"
ON public.exams FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  OR (auth.jwt() ->> 'email') IN (
    'thewhitedead.office@gmail.com',
    'pawaritdew5@gmail.com',
    'pawaritpansing@gmail.com'
  )
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  OR (auth.jwt() ->> 'email') IN (
    'thewhitedead.office@gmail.com',
    'pawaritdew5@gmail.com',
    'pawaritpansing@gmail.com'
  )
);
