// Publish (insert or update) a blog post JSON into the Supabase `blogs` table.
// Usage: node scripts/publish-blog.mjs src/data/blog-ui-redesign.json
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/publish-blog.mjs <path-to-post.json>');
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // secret key bypasses RLS
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const post = JSON.parse(fs.readFileSync(file, 'utf8'));
const now = new Date().toISOString();
const row = { ...post, updated_at: now, created_at: post.created_at || now };

const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
const { data, error } = await supabase.from('blogs').upsert(row, { onConflict: 'id' }).select('id, slug, title, published_at').single();

if (error) {
  console.error('Publish failed:', error.message);
  process.exit(1);
}
console.log('Published:', data);
