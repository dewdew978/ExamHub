import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Security: Admin role comes only from server-controlled app_metadata, matching the RLS policies
export const checkIsAdmin = (user) => user?.app_metadata?.role === 'admin';
