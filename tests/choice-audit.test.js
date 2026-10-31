import assert from 'node:assert/strict';
import test from 'node:test';
import { auditQuestions } from '../scripts/audit-exam-choices.mjs';

test('counts answer positions and correct-answer length clues from valid questions', () => {
  const questions = [
    { choices: ['long', 'x'], answer: 0 },
    { choices: ['a', 'longer'], answer: 1 },
    { choices: ['equal', 'equal'], answer: 0 },
    { choices: [], answer: 0 },
    { choices: ['A', 'B'], answer: 4 },
  ];

  assert.deepEqual(auditQuestions(questions), {
    total: 3,
    answerCounts: [2, 1, 0, 0],
    correctIsLongest: 3,
    correctIsUniqueLongest: 2,
  });
});
