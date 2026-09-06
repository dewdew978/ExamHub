-- ==========================================================
-- ExamHub: Supabase SQL Table for Blog & Changelog
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'feature',
  version_tag TEXT,
  author_name TEXT DEFAULT 'ExamHub Team',
  author_avatar TEXT DEFAULT '🚀',
  author_role TEXT DEFAULT 'Core Team',
  cover_url TEXT,
  media_type TEXT DEFAULT 'none',
  source_name TEXT,
  source_url TEXT,
  published BOOLEAN DEFAULT true,
  pinned BOOLEAN DEFAULT false,
  read_time TEXT DEFAULT '3 นาที',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure newly added columns exist in case the table was created earlier
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS source_name TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS source_url TEXT;

-- Index for fast sorting and searching
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Safely drop existing policies if they already exist
DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
DROP POLICY IF EXISTS "Allow admins full access to blogs" ON public.blogs;

-- 1. Anyone (public, anonymous, or logged-in) can read published blogs
CREATE POLICY "Allow public read access to published blogs"
ON public.blogs FOR SELECT
USING (published = true);

-- 2. Authenticated users with admin role can perform all actions
CREATE POLICY "Allow admins full access to blogs"
ON public.blogs FOR ALL
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  OR (auth.jwt() ->> 'email') IN ('thewhitedead.office@gmail.com')
)
WITH CHECK (
  (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  OR (auth.jwt() ->> 'email') IN ('thewhitedead.office@gmail.com')
);
