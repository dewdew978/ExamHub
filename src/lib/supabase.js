import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Security: Admin role is securely checked via server-controlled app_metadata
// (user_metadata is client-editable, but app_metadata can only be set via Supabase Admin/SQL)
export const checkIsAdmin = (user) => {
  if (!user) return false;
  return user.app_metadata?.role === 'admin';
};
