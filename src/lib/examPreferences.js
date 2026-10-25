export function readExamPreferences() {
  try {
    return {
      mathRendering: localStorage.getItem('examhub_pref_math') !== 'false',
      timerEnabled: localStorage.getItem('examhub_pref_timer') !== 'false',
      autoShuffle: localStorage.getItem('examhub_pref_shuffle') === 'true',
    };
  } catch {
    return { mathRendering: true, timerEnabled: true, autoShuffle: false };
  }
}

export function createQuestionOrder(count, autoShuffle, initialProgress) {
  const order = Array.from({ length: count }, (_, index) => index);
  if (initialProgress) {
    const saved = initialProgress.questionOrder;
    if (Array.isArray(saved) && saved.length === count &&
        new Set(saved).size === count &&
        saved.every(index => Number.isInteger(index) && index >= 0 && index < count)) {
      return [...saved];
    }
    // Old saves used the source order. Never shuffle their existing answers.
    return order;
  }
  if (autoShuffle) {
    for (let index = count - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [order[index], order[other]] = [order[other], order[index]];
    }
  }
  return order;
}
