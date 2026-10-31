# Balanced Exam Choices Design

## Intent

Make answer-position and visual-length guessing unreliable across every exam set while preserving each question's wording, correct answer, explanations, saved progress, and optional question-order shuffle.

## Goals

- New exam attempts distribute correct answers evenly across the available A-D positions.
- The arrangement is deterministic, so reloads and saved progress keep the same choices.
- Legacy in-progress exams keep their original choice order and answer indexes.
- Choice cards within one question have equal height, reducing the visual cue created by a longer correct option without hiding or rewriting technical content.
- Automated tests protect answer mapping, immutability, balance, legacy compatibility, and visual rendering.

## Non-goals

- Do not alter the factual meaning of any choice or explanation.
- Do not randomly reshuffle choices on every render.
- Do not change the existing setting that shuffles question order.

## Approaches

1. **Deterministic runtime balancing plus equal-height choice cards (selected).** Move each correct answer to a target position derived from its source question index, update the answer index, and render choices as equal-height grid rows. This covers current and future datasets without risky bulk rewriting.
2. Randomly shuffle choices for every attempt. Simpler, but saved answers and reload stability require more state and migration logic.
3. Rewrite and reorder all JSON files manually. This can improve individual distractors but is error-prone across 947 questions and does not prevent future datasets from reintroducing the pattern.

## Constraints

- Source question objects and choice arrays remain immutable.
- Four-choice sets differ by at most one correct answer per position; other choice counts follow the same round-robin rule.
- Saved progress records `choiceOrderVersion: 1`; progress without that field is treated as legacy and uses source choice order.
- Existing answers continue to store displayed choice indexes.

## Quality checks

- A data audit reports source answer distribution and length bias for editorial follow-up, but does not fail builds on legacy wording.
- Runtime tests prove displayed answer distribution is balanced even when source data is heavily biased.
