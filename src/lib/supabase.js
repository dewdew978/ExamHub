import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const ADMIN_EMAILS = [
  'thewhitedead.office@gmail.com',
  ...(import.meta.env.VITE_ADMIN_EMAILS ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : [])
];

export const checkIsAdmin = (user) => {
  if (!user || !user.email) return false;
  const email = user.email.toLowerCase().trim();
  if (ADMIN_EMAILS.includes(email)) return true;
  // Security: Only check app_metadata (controlled by server/service_role), never user_metadata (client-editable)
  if (user.app_metadata?.role === 'admin') {
    return true;
  }
  return false;
};
