# Admin-only AWS practice modules

The existing AWS Academy Cloud Architecting (ACA) Module 2–6 (50 questions) and Cloud Foundations (ACF) Module 1–8 (71 questions) also use the admin-only catalog and authenticated API. Their live questions are stored in `public.exams` in Supabase; local migration backups live in the Git-ignored `server/data` directory. Their former public bundle files and public index entries are removed. Previous in-progress attempts for private exams are hidden from the Home resume card. Supabase RLS protects private rows, and both the application repository and compatibility API read the database under the caller's identity.

The imported attachment contains questions 1–129 in 12 modules. Its introductory claim of 66 questions is outdated. The import preserves the attachment's question text, correct answers, choice order and explanations; answer-choice prose is translated into Thai while service names and technical terms stay in English. It does not independently fact-check the AWS content.

| Module | Topic | Questions |
| --- | --- | ---: |
| 1 | Cloud Concepts & Billing | 2 |
| 2 | Security, Identity & Governance | 7 |
| 3 | Networking & Content Delivery | 25 |
| 4 | Compute, Containers & Serverless | 9 |
| 5 | Storage & Database Services | 10 |
| 6 | Application Integration & Messaging | 13 |
| 7 | Analytics & Big Data | 10 |
| 8 | High Availability, Scaling & Monitoring | 15 |
| 9 | Disaster Recovery & Business Continuity | 7 |
| 10 | Infrastructure as Code (IaC) & Automation | 10 |
| 11 | AWS Well-Architected Framework & Trusted Advisor | 11 |
| 12 | Caching Strategies | 10 |
| **Total** | | **129** |

Sign in with a Supabase user whose server-controlled `app_metadata.role` is `admin`. Open Year 3 → Cloud Technology Infrastructure → Final, or choose a module from the admin dashboard. Dashboard entries open the practice introduction. The dashboard edits and saves these sets directly in Supabase, with timestamp checks to prevent overwriting concurrent edits.

Local source backups live in `server/data/aws-practice.json`, outside Git and deployment uploads. The live question bank is in Supabase. `/api/admin-practice?id=aws_practice_module_01` requires a Bearer access token, verifies it with Supabase `getUser`, then queries the latest database content using the same user token and returns data only for an admin. Responses use `private, no-store`. Only catalog metadata is bundled with the frontend. Private questions and practice progress are not saved to localStorage, and private scores are not written into the public exam score table.

Deploy the whole project to Vercel so the `api/admin-practice.js` function is deployed together with the Vite site. A static `dist`-only deployment does not include this API. The function uses `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY`, falling back to the existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables. No service-role key is needed by this API. Database setup and import instructions are in [supabase-exam-content.md](supabase-exam-content.md). `npm run dev` serves the same endpoint locally; `vite preview` serves only static assets.

To regenerate from an updated attachment:

```powershell
node scripts/import-aws-practice.mjs 'C:\path\aws_practice_exam_collection (1).md'
```

This updates the server data and the client metadata catalog. The importer applies the exact-source translation dictionaries in `server/data/aws-practice-choice-translations-*.json`, so regeneration retains the Thai choices. New or changed source choices need matching dictionary entries. Do not move complete questions into `src/data` or `public`, which would publish them in client assets.
