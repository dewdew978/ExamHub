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

test('balances correct answers globally without exposing four-question blocks', () => {
  const source = Array.from({ length: 16 }, (_, index) => fourChoiceQuestion(index));

  const balanced = balanceQuestionChoices(source);

  const answerKey = balanced.map(question => question.answer);
  assert.deepEqual(answerKey.reduce((counts, answer) => {
    counts[answer] += 1;
    return counts;
  }, [0, 0, 0, 0]), [4, 4, 4, 4]);
  assert.notDeepEqual(answerKey, Array.from({ length: 16 }, (_, index) => index % 4));
  assert.ok(Array.from({ length: 4 }, (_, block) =>
    new Set(answerKey.slice(block * 4, block * 4 + 4)).size
  ).some(uniqueAnswers => uniqueAnswers < 4));
  assert.deepEqual(balanceQuestionChoices(source), balanced);
  for (let index = 0; index < source.length; index += 1) {
    assert.equal(balanced[index].choices[balanced[index].answer], source[index].choices[source[index].answer]);
  }
  assert.equal(CHOICE_ORDER_VERSION, 2);
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

test('uses a valid deterministic target for questions with different choice counts', () => {
  const source = [
    { q: 'Two', choices: ['wrong', 'right'], answer: 1 },
    { q: 'Three', choices: ['right', 'wrong 1', 'wrong 2'], answer: 0 },
    { q: 'Two again', choices: ['right', 'wrong'], answer: 0 },
  ];

  const balanced = balanceQuestionChoices(source);

  assert.ok(balanced.every(question => question.answer >= 0 && question.answer < question.choices.length));
  assert.deepEqual(balanced.map(question => question.choices[question.answer]), ['right', 'right', 'right']);
});

test('preserves version one ordering for saved in-progress attempts', () => {
  const source = Array.from({ length: 4 }, (_, index) => fourChoiceQuestion(index, 3));
  const legacyBalanced = balanceQuestionChoices(source, true, 1);

  assert.deepEqual(legacyBalanced.map(question => question.answer), [0, 1, 2, 3]);
  assert.equal(resolveChoiceOrderVersion({ choiceOrderVersion: 1 }), 1);
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
  assert.equal(resolveChoiceOrderVersion({ choiceOrderVersion: 2 }), CHOICE_ORDER_VERSION);
});
