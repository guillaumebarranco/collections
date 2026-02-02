export const normalizeQuizzText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const matchesQuizzEntityTitle = (
  entityTitle: string,
  quizzEntityTitle: string
): boolean =>
  (() => {
    const normalizedEntity = normalizeQuizzText(entityTitle);
    const normalizedQuizz = normalizeQuizzText(quizzEntityTitle);
    if (normalizedEntity === normalizedQuizz) return true;
    return (
      normalizedEntity.includes(normalizedQuizz) ||
      normalizedQuizz.includes(normalizedEntity)
    );
  })();
