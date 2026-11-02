# Supabase exam content

`public.exams` stores metadata and the complete `questions` JSON array. The
importer preserves choice order, numeric or multiple-answer indices,
explanations, source numbers and reference metadata. JSON files remain an export
and migration backup; the application reads Supabase.

Private source files under `server/data/` and generated exports are local-only,
excluded from Git and deployment uploads. Restore those files from the operator's
private backup before running an import on a fresh checkout. Automated tests use
synthetic private fixtures and do not require the private question bank.

## Setup and import

1. Run `node scripts/migrate-exam-content.mjs` to validate and list all local
   public, academy and practice exams. This default dry run does not load `.env`
   or connect to Supabase.
2. Back up the existing table, then execute `scripts/setup-exam-content.sql` in
   the project's Supabase SQL Editor. It adds columns and a timestamp trigger,
   replaces policies on `exams` only, and protects known private IDs before any
   content is uploaded. The Supabase CLI was unavailable while preparing this
   standalone file; it has not been recorded as a CLI migration.
3. Set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` in the local environment or `.env`.
   Keep the secret key on the machine running the importer. Run:

   ```sh
   node scripts/migrate-exam-content.mjs --apply --backup /absolute/private/path/exams-before-import.json
   ```

   The backup directory must exist and the backup file must be new. The tool
   paginates through the entire remote table and writes the complete JSON backup
   before its first write. Read or backup errors abort the import. It inserts
   missing IDs, fills empty question arrays, skips existing nonempty arrays and
   never deletes rows. Conditional writes preserve concurrent question edits;
   conflicts are counted separately. Existing names and private flags remain.
   Run again with a new backup path after reviewing any partial failure.

If only SQL Editor access is available, generate a single script instead:

```sh
node scripts/migrate-exam-content.mjs --export-sql /absolute/private/path/exams-setup-and-seed.sql
```

This reads no credentials and makes no connection. Execute that generated file
in SQL Editor. The transaction first snapshots the existing table in a uniquely
named table under `exam_import_backups`, revokes public/member schema and table
access, then applies setup and conditional seed statements. A failure rolls back
the whole transaction. Keep the backup schema out of the Data API exposed
schemas. The printed backup table name identifies the recovery snapshot. The
generated SQL includes private question content; store it privately.

## Access and verification

Guests and members can select rows with `adminOnly = false`. Admins can read and
write all rows, authorized solely by server-controlled `app_metadata.role`.
`requiresAuth` preserves the existing catalog and login-gated start behavior; it
is not a content confidentiality flag. Use `adminOnly` for confidential content.
Catalog requests select metadata only; exam requests fetch the question array.

After applying, verify counts in SQL Editor:

```sql
select id, "adminOnly", "questionCount", jsonb_array_length(questions) as stored_questions
from public.exams order by id;
```

Verify guest/member requests cannot retrieve private IDs or write any rows,
admins can read/save, and an attempted member `user_metadata.role = admin` does
not grant access. Refresh JWTs after changing `app_metadata`. Run Supabase
database advisors and record the SQL in the project's migration history when
CLI access is restored. Preparing the scripts alone does not verify a live
migration.

## Recovery

Keep local backups outside Git and restrict them to the operator: they contain
all private questions. To recover, inspect the JSON backup's `rows` or the SQL
snapshot, compare the affected IDs and restore only intended records through an
admin connection. The importer never automatically restores over newer edits.

Browser drafts in localStorage are retained for explicit recovery. They are not
silently uploaded or used as canonical content after the upgrade. Export or
copy an old draft, compare it with the current database exam, then import/save it
through the admin editor deliberately.
