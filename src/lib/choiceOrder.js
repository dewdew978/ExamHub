export const CHOICE_ORDER_VERSION = 2;
const LEGACY_BALANCED_VERSION = 1;

export function resolveChoiceOrderVersion(initialProgress, isRetry = false) {
  if (isRetry || !initialProgress) return CHOICE_ORDER_VERSION;
  return [LEGACY_BALANCED_VERSION, CHOICE_ORDER_VERSION].includes(initialProgress.choiceOrderVersion)
    ? initialProgress.choiceOrderVersion
    : null;
}

function hashText(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffle(values, seed) {
  let state = seed || 1;
  const shuffled = [...values];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    const swapIndex = (state >>> 0) % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function createShuffledTargets(questions) {
  const targetByIndex = new Map();
  const groups = new Map();
  for (const [sourceIndex, question] of questions.entries()) {
    const choiceCount = Array.isArray(question?.choices) ? question.choices.length : 0;
    if (!choiceCount || !Number.isInteger(question?.answer) || question.answer < 0 || question.answer >= choiceCount) continue;
    if (!groups.has(choiceCount)) groups.set(choiceCount, []);
    groups.get(choiceCount).push(sourceIndex);
  }

  for (const [choiceCount, sourceIndices] of groups) {
    const groupKey = sourceIndices.map(index => questions[index]?.q || '').join('\u0000');
    const balancedTargets = sourceIndices.map((_, index) => index % choiceCount);
    const targets = shuffle(balancedTargets, hashText(`${choiceCount}|${groupKey}`));
    sourceIndices.forEach((sourceIndex, index) => targetByIndex.set(sourceIndex, targets[index]));
  }
  return targetByIndex;
}

export function balanceQuestionChoices(questions, enabled = true, version = CHOICE_ORDER_VERSION) {
  if (!Array.isArray(questions)) return [];
  if (!enabled) return [...questions];
  const currentTargets = version === LEGACY_BALANCED_VERSION ? null : createShuffledTargets(questions);

  return questions.map((question, sourceIndex) => {
    const choices = question?.choices;
    const answer = question?.answer;
    if (!Array.isArray(choices) || choices.length === 0 ||
        !Number.isInteger(answer) || answer < 0 || answer >= choices.length) {
      return question;
    }

    const targetAnswer = version === LEGACY_BALANCED_VERSION
      ? sourceIndex % choices.length
      : currentTargets.get(sourceIndex);
    const balancedChoices = [...choices];
    [balancedChoices[answer], balancedChoices[targetAnswer]] =
      [balancedChoices[targetAnswer], balancedChoices[answer]];

    return {
      ...question,
      choices: balancedChoices,
      answer: targetAnswer,
    };
  });
}
