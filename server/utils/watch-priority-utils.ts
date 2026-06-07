/** Valeurs valides : 1 (faible), 2 (moyenne), 3 (haute). 0 et valeurs invalides → 1. */
function normalizeWatchPriority(value: unknown): 1 | 2 | 3 | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 1) {
    return 1;
  }
  if (parsed > 3) {
    return 3;
  }
  return Math.trunc(parsed) as 1 | 2 | 3;
}

module.exports = {
  normalizeWatchPriority,
};

export {};
