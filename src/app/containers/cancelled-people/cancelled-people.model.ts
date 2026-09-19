/**
 * Une personne listée sur la page Cancelled People.
 *
 * Champs :
 * - name (requis) : nom affiché
 * - reason (optionnel) : motif (extrême droite, actes criminels, etc.)
 * - sources (optionnel) : liens vers articles / pages de référence
 */
export interface CancelledPerson {
  name: string;
  reason?: string;
  sources?: string[];
}

/**
 * Une catégorie (réalisateurs, acteurs, auteurs, etc.).
 *
 * Pour ajouter des noms : éditer `cancelled-people.data.json`,
 * dans le tableau `people` de la catégorie voulue.
 */
export interface CancelledPeopleCategory {
  id: string;
  label: string;
  people: CancelledPerson[];
}

export interface CancelledPeopleFile {
  sourceUrl?: string;
  categories: CancelledPeopleCategory[];
}
