/**
 * Normalise un texte pour la recherche : NFD, suppression des diacritiques, minuscules.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
