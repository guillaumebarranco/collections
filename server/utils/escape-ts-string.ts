/**
 * Échappe une chaîne pour insertion dans un littéral TypeScript entre guillemets doubles.
 * Utilisé par toutes les routes / utilitaires qui écrivent du code .ts (entités utilisateurs, etc.).
 */
function escapeStringForTsDoubleQuote(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

module.exports = { escapeStringForTsDoubleQuote };
export {};
