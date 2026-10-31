export const CHOICE_ORDER_VERSION = 1;

export function resolveChoiceOrderVersion(initialProgress, isRetry = false) {
  if (isRetry || !initialProgress) return CHOICE_ORDER_VERSION;
  return initialProgress.choiceOrderVersion === CHOICE_ORDER_VERSION
    ? CHOICE_ORDER_VERSION
    : null;
}

export function balanceQuestionChoices(questions, enabled = true) {
  if (!Array.isArray(questions)) return [];
  if (!enabled) return [...questions];

  return questions.map((question, sourceIndex) => {
    const choices = question?.choices;
    const answer = question?.answer;
    if (!Array.isArray(choices) || choices.length === 0 ||
        !Number.isInteger(answer) || answer < 0 || answer >= choices.length) {
      return question;
    }

    const targetAnswer = sourceIndex % choices.length;
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
