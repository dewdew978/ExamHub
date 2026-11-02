# Admin AWS Practice Implementation Plan

**Goal:** Import all 129 questions from the attached document as 12 topic sets visible and accessible only to admins.

**Architecture:** Keep complete questions and answers in server/data, outside Vite's client imports. A Vercel API validates the Supabase access token using getUser and checks server-controlled app_metadata.role. The public client receives metadata only; it adds the catalog for admins. Vite dev serves the same handler locally.

**Tech Stack:** Existing React, Vite, Vercel Node functions and supabase-js. No database changes or new dependencies.

## Tasks

- [x] Add access-control tests covering guests, members, forged user metadata, expired sessions, admin success and invalid IDs. Observe failure before implementation.
- [x] Parse document questions 1–129 into 12 modules, preserving all choices, source numbering, explanations and multiple correct answers. Validate counts.
- [x] Implement authenticated server delivery with private/no-store response headers and client catalog filtering.
- [x] Integrate admin-only start actions into Home and the admin dashboard, and clear private content on logout. Keep private questions and progress out of localStorage.
- [x] Support multiple-answer selection, explicit submission and exact-set grading while retaining single-answer behavior.
- [x] Run full tests (33 passing), lint and production build; inspect dist for private question/explanation leaks.
- [x] Review auth, deployment routing, source fidelity and multi-answer UI; fix findings. Independent review checked all 129 source choice lists and answers. Vite denies server file requests, and private source exams preserve choice letters.

## Review Focus

Verify complete source coverage despite the source introduction claiming 66 questions. Require actual server verification rather than a decoded token or user_metadata. Never include private question data in frontend chunks or service worker caches. Hide private progress/content immediately on logout. Prevent Vercel's SPA fallback from swallowing API requests; document the required deployment and auth environment.
