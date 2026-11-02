# Supabase Exam Content Implementation Plan

> **For agentic workers:** Execute the independent frontend adapters in parallel, then integrate and review together. Do not commit unrelated working tree changes.

**Goal:** Store all existing exam metadata, questions, choices, answers and explanations in Supabase, including the seven newly generated public ACA sets, and persist admin edits across devices.

**Architecture:** Extend `public.exams` with `questions jsonb`, `adminOnly boolean`, and `requiresAuth boolean`. Catalog queries select metadata only; individual exams and admin saves use a shared repository. RLS permits public reads of public exams and admin reads/writes of every exam. Existing private exams remain private. Existing JSON remains a migration/export backup, with no runtime fallback to stale bundled content or localStorage question overrides.

**Tech Stack:** React, supabase-js, Postgres JSONB and RLS, node:test.

## Global Constraints

- Preserve IDs, question/choice order, answer indices including multiple answers, explanations, source numbers and reference metadata.
- Admin authorization uses only server-controlled `app_metadata.role`.
- Guests may read public exams; members cannot read or write admin-only content. Admin writes require RLS authorization.
- Do not delete any remote exams or overwrite existing nonempty remote question content during initial import.
- Preserve existing browser drafts for explicit recovery/import; stop treating them as canonical content.
- Never expose secret keys; migration tools use credentials only from the local environment.
- Do not claim the remote migration or deployment is complete without verifying it.

## Shared Interfaces

`src/lib/examRepository.js` exports `loadExamCatalog(client)`, `loadExam(client, id)`, and `saveExam(client, exam)`. Each returns the resolved data or throws an Error. Catalog results contain metadata only. Full exam records include `questions`, `updated_at`, `adminOnly` and `requiresAuth`. Saves validate question shape, compute `questionCount`, and use the supplied `updated_at` as an optimistic concurrency condition for existing rows.

## Tasks

- [ ] Repository tests: metadata-only catalogs, full content load, save validation/counts, error propagation, concurrency conflicts and multi-answer preservation. Run failing tests, implement, rerun.
- [ ] Frontend App: load catalog after resolving session; refresh on authentication changes; use repository for public/private exams; keep existing login gating and private progress protections; refresh catalog after admin saves.
- [ ] AdminDashboard: load/save/create/import questions and references through repository; show success only after confirmed writes; preserve failed edits; replace local reset with database reload; preserve drafts for manual recovery.
- [ ] Migration: additive schema, JSON-array checks, trigger for updated timestamp, grants and RLS read/admin-write policies; mark existing protected IDs private before importing content; prepare non-destructive importer and a standalone SQL setup file.
- [ ] Legacy private API: remove question JSON imports and load content from Supabase after verified admin authorization.
- [ ] Verify all existing and new tests, lint, production build; confirm production assets contain no question JSON chunks; independently review access-control and failed-save behavior.
- [ ] Apply migration and seed through available authenticated connection, verify public/admin visibility and question counts; if DDL access is unavailable, provide exact SQL and finish all unaffected implementation.

## Review Focus

- Public list queries must never transfer full question content.
- A member with editable user metadata claiming admin must never gain write/private read access.
- Failed or stale saves must not report success or discard open edits.
- Anonymous-to-admin and admin-to-anonymous session changes must refresh the catalog.
- Existing remote question content and browser drafts must survive initial import and application upgrade.
