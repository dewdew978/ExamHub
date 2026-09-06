import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Security: Admin role is checked via server-controlled app_metadata or verified admin emails
export const checkIsAdmin = (user) => {
  if (!user) return false;
  const adminEmails = ['thewhitedead.office@gmail.com', 'pawaritdew5@gmail.com', 'pawaritpansing@gmail.com'];
  return user.app_metadata?.role === 'admin' || (user.email && adminEmails.includes(user.email.toLowerCase()));
};
