export const includesChoice = (answer, index) => Array.isArray(answer) ? answer.includes(index) : answer === index;

export function isCorrectAnswer(actual, expected) {
  if (!Array.isArray(expected)) return actual === expected;
  return Array.isArray(actual) && actual.length === expected.length &&
    new Set(actual).size === actual.length && expected.every(index => actual.includes(index));
}
