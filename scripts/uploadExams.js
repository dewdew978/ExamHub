import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Use secret key for bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadExams() {
  try {
    const indexPath = path.join(__dirname, '../src/data/index.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    console.log(`Found ${indexData.length} exams. Uploading to Supabase...`);

    const { data, error } = await supabase
      .from('exams')
      .upsert(indexData, { onConflict: 'id' });

    if (error) {
      console.error("Error uploading exams:", error.message, error.details);
    } else {
      console.log("Successfully uploaded exams data!");
    }
  } catch (err) {
    console.error("Failed to read or upload data:", err);
  }
}

uploadExams();
