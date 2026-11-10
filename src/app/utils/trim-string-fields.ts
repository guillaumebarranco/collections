/** Retire les espaces en début et fin des champs texte indiqués. */
export function trimStringFields<T extends object>(
  source: T,
  fields: readonly (keyof T)[]
): T {
  const next = { ...source };
  for (const field of fields) {
    const value = next[field];
    if (typeof value === 'string') {
      (next as Record<string, unknown>)[field as string] = value.trim();
    }
  }
  return next;
}
