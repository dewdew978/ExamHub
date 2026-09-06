import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { EXAM_REFERENCES } from '../src/data/examReferences.js';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY; // Use secret key to bypass RLS

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadExams() {
  try {
    const indexPath = path.join(__dirname, '../src/data/index.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

    console.log(`Found ${indexData.length} exams. Preparing data with references...`);

    const enrichedData = indexData.map(({ requiresAuth: _requiresAuth, ...rest }) => {
      const ref = EXAM_REFERENCES[rest.id] || {};
      return {
        ...rest,
        primarySource: ref.primarySource || null,
        organization: ref.organization || null,
        curatedBy: ref.curatedBy || null,
        references: ref.references || []
      };
    });

    console.log("Uploading to Supabase exams table...");
    const { error } = await supabase
      .from('exams')
      .upsert(enrichedData, { onConflict: 'id' });

    if (error) {
      console.error("Error uploading exams:", error.message, error.details);
      console.log("\n💡 Note: If columns do not exist in Supabase yet, please run 'scripts/add_references_to_exams.sql' in the Supabase SQL editor first!");
    } else {
      console.log("Successfully uploaded exams data with structured references!");
    }
  } catch (err) {
    console.error("Failed to read or upload data:", err);
  }
}

uploadExams();
