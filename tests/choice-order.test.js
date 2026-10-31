import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CHOICE_ORDER_VERSION,
  balanceQuestionChoices,
  resolveChoiceOrderVersion,
} from '../src/lib/choiceOrder.js';

const fourChoiceQuestion = (id, answer = 0) => ({
  q: `Question ${id}`,
  choices: [`${id}-A`, `${id}-B`, `${id}-C`, `${id}-D`],
  answer,
  explain: `Explain ${id}`,
});

test('balances correct answers across A-D without changing which text is correct', () => {
  const source = Array.from({ length: 8 }, (_, index) => fourChoiceQuestion(index));

  const balanced = balanceQuestionChoices(source);

  assert.deepEqual(balanced.map(question => question.answer), [0, 1, 2, 3, 0, 1, 2, 3]);
  for (let index = 0; index < source.length; index += 1) {
    assert.equal(balanced[index].choices[balanced[index].answer], source[index].choices[source[index].answer]);
  }
  assert.equal(CHOICE_ORDER_VERSION, 1);
});

test('does not mutate source questions or their choice arrays', () => {
  const source = [fourChoiceQuestion('immutable', 3), fourChoiceQuestion('second', 2)];
  const snapshot = structuredClone(source);

  const balanced = balanceQuestionChoices(source);

  assert.deepEqual(source, snapshot);
  assert.notEqual(balanced, source);
  assert.notEqual(balanced[0], source[0]);
  assert.notEqual(balanced[0].choices, source[0].choices);
});

test('uses a valid round-robin target for questions with different choice counts', () => {
  const source = [
    { q: 'Two', choices: ['wrong', 'right'], answer: 1 },
    { q: 'Three', choices: ['right', 'wrong 1', 'wrong 2'], answer: 0 },
    { q: 'Two again', choices: ['right', 'wrong'], answer: 0 },
  ];

  const balanced = balanceQuestionChoices(source);

  assert.deepEqual(balanced.map(question => question.answer), [0, 1, 0]);
  assert.deepEqual(balanced.map(question => question.choices[question.answer]), ['right', 'right', 'right']);
});

test('leaves legacy and malformed questions in their original order', () => {
  const valid = fourChoiceQuestion('legacy', 3);
  const malformed = [
    { q: 'No choices', answer: 0 },
    { q: 'Empty choices', choices: [], answer: 0 },
    { q: 'Invalid answer', choices: ['A', 'B'], answer: 4 },
  ];

  assert.deepEqual(balanceQuestionChoices([valid], false), [valid]);
  assert.deepEqual(balanceQuestionChoices(malformed), malformed);
});

test('switches a retried legacy exam to the current balanced choice order', () => {
  const legacyProgress = { answers: [3], currentQ: 0 };

  assert.equal(resolveChoiceOrderVersion(legacyProgress), null);
  assert.equal(resolveChoiceOrderVersion(legacyProgress, true), CHOICE_ORDER_VERSION);
  assert.equal(resolveChoiceOrderVersion(undefined), CHOICE_ORDER_VERSION);
  assert.equal(resolveChoiceOrderVersion({ choiceOrderVersion: 1 }), CHOICE_ORDER_VERSION);
});
