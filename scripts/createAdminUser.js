import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'adminnaja@examhub.com';
  const password = '361132007';

  console.log(`Creating user: ${email}...`);

  // Try to create user via admin API with email_confirm: true
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username: 'adminnaja',
      role: 'admin'
    }
  });

  if (error) {
    console.error("Error creating user:", error.message);
    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('unique')) {
      console.log("Updating password for existing user...");
      // Find user and update password
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (!listError && usersData?.users) {
        const existing = usersData.users.find(u => u.email === email);
        if (existing) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
            password,
            email_confirm: true
          });
          if (updateError) {
            console.error("Error updating user:", updateError.message);
          } else {
            console.log("Successfully updated password for adminnaja!");
          }
        }
      }
    }
  } else {
    console.log("Successfully created user:", data.user?.id, data.user?.email);
  }
}

createAdmin();
