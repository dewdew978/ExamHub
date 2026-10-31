# Balanced Exam Choices Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make correct-answer positions balanced and choice cards visually uniform across every exam while preserving saved progress.

**Architecture:** A pure choice-order module immutably transforms source questions with a deterministic round-robin target answer position. `Exam.jsx` applies it before question-order mapping, versions new progress, bypasses it for legacy progress, and uses equal-height CSS grid rows for choices.

**Tech Stack:** React 19, JavaScript ES modules, Node test runner, Vite SSR tests

**Spec:** `docs/superpowers/specs/2026-10-31-balanced-exam-choices-design.md`

## Global Constraints

- Preserve question and choice text exactly.
- Never mutate source datasets.
- Progress without `choiceOrderVersion` must retain source choice order.
- New progress uses `choiceOrderVersion: 1`.

## Review Focus

- Questions with two or three choices still receive valid target indexes.
- Empty or malformed choice arrays are returned safely without mutation.
- Question-order shuffling uses original source indexes after choice balancing.
- Legacy progress answers remain aligned with the original choices.
- Review mode and active-question mode use the same transformed answer indexes.

---

### Task 1: Deterministic choice balancing

**Files:**
- Create: `src/lib/choiceOrder.js`
- Create: `tests/choice-order.test.js`

**Interfaces:**
- Produces: `CHOICE_ORDER_VERSION`, `balanceQuestionChoices(questions, enabled = true)`

- [ ] Write failing tests for balanced four-choice distribution, correct-answer preservation, immutability, non-four-choice questions, and disabled legacy behavior.
- [ ] Run `node --test tests/choice-order.test.js` and verify failure because the module is missing.
- [ ] Implement the pure transformer with target index `sourceIndex % choices.length` and a single swap.
- [ ] Run `node --test tests/choice-order.test.js` and verify all tests pass.

### Task 2: Exam integration and progress compatibility

**Files:**
- Modify: `src/components/Exam.jsx`
- Modify: `tests/exam-preferences.test.js`

**Interfaces:**
- Consumes: `CHOICE_ORDER_VERSION`, `balanceQuestionChoices`

- [ ] Add failing SSR tests proving a new attempt displays the balanced answer position and legacy progress retains original answer mapping.
- [ ] Run `node --test tests/exam-preferences.test.js` and verify the new assertions fail.
- [ ] Apply balancing before `questionOrder`, persist `choiceOrderVersion`, and disable balancing for unversioned initial progress.
- [ ] Run the preference tests and verify they pass.

### Task 3: Remove the visual length cue

**Files:**
- Modify: `src/components/Exam.jsx`
- Modify: `tests/exam-preferences.test.js`

**Interfaces:**
- Produces: equal-height choice rows in active and review views.

- [ ] Add a failing render test that checks active choices share grid rows and stretch to the same height.
- [ ] Implement a grid container with auto rows sized equally and stretched buttons; mirror the behavior in review mode.
- [ ] Run the focused tests and verify they pass.

### Task 4: Dataset quality audit and full verification

**Files:**
- Create: `scripts/audit-exam-choices.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run audit:choices`, reporting per-set and aggregate source-position/length metrics.

- [ ] Add a fixture-driven audit test that fails when counts and longest-answer metrics are computed incorrectly.
- [ ] Implement the audit script and expose it through `package.json`.
- [ ] Run `npm run audit:choices`, `npm test`, `npm run lint`, and `npm run build`.
- [ ] Verify the working tree contains only the planned files and review `git diff --check`.
