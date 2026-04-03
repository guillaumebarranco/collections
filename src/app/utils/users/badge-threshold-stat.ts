import type { BadgeDefinition } from '../../models/badge-model';

/**
 * Métrique utilisée avec {@link BadgeDefinition.threshold} pour check-badges et le dashboard.
 * Les badges « saga » n’ont pas de seuil numérique.
 */
export type BadgeThresholdStatKey =
  | 'booksRead'
  | 'booksFantasyRead'
  | 'booksRomanceRead'
  | 'booksScienceFictionRead'
  | 'booksPolicierRead'
  | 'booksNonfictionRead'
  | 'booksAventureRead'
  | 'moviesWatched'
  | 'moviesRomanceWatched'
  | 'moviesScienceFictionWatched'
  | 'moviesThrillerWatched'
  | 'moviesHorreurWatched'
  | 'moviesComedieWatched'
  | 'moviesActionWatched'
  | 'gamesPlayed'
  | 'gamesFinished'
  | 'mangasRead'
  | 'manwhasRead'
  | 'comicsRead'
  | 'bdsRead'
  | 'seriesWatched';

/** Stats nécessaires pour la progression textuelle des badges à seuil (dashboard). */
export type BadgeThresholdStats = Record<BadgeThresholdStatKey, number>;

export const BADGE_SAGA_IDS = new Set<string>([
  'vengeurs-de-la-terre',
  'badges-des-trois-sorciers',
  'guerrier-de-la-terre-du-milieu',
  'membre-de-l-ordre',
]);

const BOOKS_GENERAL_IDS = new Set([
  'petit-lecteur',
  'graine-lecteur',
  'lecteur-assidu',
  'lecteur-chevronne',
  'lecteur-passionne',
  'lecteur-veteran',
  'rat-bibliotheque',
  'amoureux-lecture',
  'maitre-lecteur',
  'doyen-lecteurs',
]);

const BOOKS_FANTASY_IDS = new Set([
  'sorcelier',
  'demi-dieu',
  'reine-dragons',
  'elu-prophetie',
  'seigneur-fantasy',
]);

const BOOKS_ROMANCE_IDS = new Set([
  'petit-beguin-books',
  'lover-books',
  'ames-soeurs',
  'amour-a-travers-la-mort',
  'icone-romance',
]);

const BOOKS_SCIENCE_FICTION_IDS = new Set([
  'marche-vers-l-inconnu',
  'guerrier-omniscient',
  'explorateur-profondeurs',
  'survivant-invasion',
  'architecte-psychohistoire',
]);

const BOOKS_POLICIER_IDS = new Set([
  'amateur-polars',
  'enqueteur-verite',
  'artiste-evasion',
  'maitre-mystere',
  'genie-deduction',
]);

const BOOKS_NONFICTION_IDS = new Set([
  'lecteur-curieux-nonfiction',
  'chercheur-savoir',
  'precurseur-progres',
  'icone-changement',
  'sage-humanite',
]);

const BOOKS_AVENTURE_IDS = new Set([
  'explorateur',
  'moussaillon-flots',
  'grand-voyageur-livres',
  'ubiquiste-monde',
  'aventurier-legendaire',
]);

const MOVIES_GLOBAL_IDS = new Set([
  'cinephile-herbe',
  'cinephile-amateur',
  'cinephile-passionne',
  'cinephile-devoué',
  'cinephile-inconditionnel',
]);

const MOVIES_ROMANCE_IDS = new Set([
  'amour-jeunesse',
  'un-amour-de-cinema',
  'passion-vacances',
  'grand-amour-movies',
  'amour-eternel-movies',
]);

const MOVIES_SCIENCE_FICTION_IDS = new Set([
  'extraterrestre',
  'machine-du-futur',
  'elu-de-la-matrice',
  'voyageur-temporel',
  'maitre-galaxie',
]);

const MOVIES_THRILLER_IDS = new Set([
  'obsession-psychologique',
  'expert-tension',
  'fondateur-thriller',
  'maitre-suspense',
  'genie-manipulation',
]);

const MOVIES_HORREUR_IDS = new Set([
  'tout-ce-sang',
  'derriere-le-masque',
  'gardien-horreur',
  'terreur-autre-monde',
  'maitre-horreur-movies',
]);

const MOVIES_COMEDIE_IDS = new Set([
  'drole-de-gendarme',
  'espion-blanquette',
  'oh-le-con',
  'sancho-de-cuba',
  'architecte-humour',
]);

const MOVIES_ACTION_IDS = new Set([
  'transporteur',
  'baba-yaga',
  'flic-new-york',
  'veteran',
  'icone-action',
]);

const GAMES_PLAYED_IDS = new Set([
  'joueur-du-dimanche',
  'petit-joueur',
  'gamer',
  'nerd',
  'no-life',
]);

const GAMES_FINISHED_IDS = new Set([
  'joueur-capable',
  'champion-du-joystick',
  'virtuose-de-la-manette',
]);

export function getBadgeThresholdStatKey(
  badgeId: string
): BadgeThresholdStatKey | null {
  if (BADGE_SAGA_IDS.has(badgeId)) {
    return null;
  }
  if (badgeId.startsWith('mangas-')) return 'mangasRead';
  if (badgeId.startsWith('manwhas-')) return 'manwhasRead';
  if (badgeId.startsWith('comics-')) return 'comicsRead';
  if (badgeId.startsWith('bds-')) return 'bdsRead';
  if (badgeId.startsWith('series-')) return 'seriesWatched';
  if (BOOKS_GENERAL_IDS.has(badgeId)) return 'booksRead';
  if (BOOKS_FANTASY_IDS.has(badgeId)) return 'booksFantasyRead';
  if (BOOKS_ROMANCE_IDS.has(badgeId)) return 'booksRomanceRead';
  if (BOOKS_SCIENCE_FICTION_IDS.has(badgeId))
    return 'booksScienceFictionRead';
  if (BOOKS_POLICIER_IDS.has(badgeId)) return 'booksPolicierRead';
  if (BOOKS_NONFICTION_IDS.has(badgeId)) return 'booksNonfictionRead';
  if (BOOKS_AVENTURE_IDS.has(badgeId)) return 'booksAventureRead';
  if (MOVIES_GLOBAL_IDS.has(badgeId)) return 'moviesWatched';
  if (MOVIES_ROMANCE_IDS.has(badgeId)) return 'moviesRomanceWatched';
  if (MOVIES_SCIENCE_FICTION_IDS.has(badgeId))
    return 'moviesScienceFictionWatched';
  if (MOVIES_THRILLER_IDS.has(badgeId)) return 'moviesThrillerWatched';
  if (MOVIES_HORREUR_IDS.has(badgeId)) return 'moviesHorreurWatched';
  if (MOVIES_COMEDIE_IDS.has(badgeId)) return 'moviesComedieWatched';
  if (MOVIES_ACTION_IDS.has(badgeId)) return 'moviesActionWatched';
  if (GAMES_PLAYED_IDS.has(badgeId)) return 'gamesPlayed';
  if (GAMES_FINISHED_IDS.has(badgeId)) return 'gamesFinished';
  return null;
}

/** Vérifie que chaque définition a un `threshold` sauf les sagas, et que l’id est mappé. */
export function assertBadgeDefinitionsMatchThresholdMapping(
  definitions: readonly BadgeDefinition[]
): void {
  for (const def of definitions) {
    if (BADGE_SAGA_IDS.has(def.id)) {
      if (def.threshold !== undefined) {
        throw new Error(
          `[badges] Le badge saga ${def.id} ne doit pas définir threshold`
        );
      }
      continue;
    }
    if (def.threshold === undefined) {
      throw new Error(`[badges] Badge ${def.id}: propriété threshold requise`);
    }
    if (getBadgeThresholdStatKey(def.id) === null) {
      throw new Error(
        `[badges] Badge ${def.id}: aucune métrique pour le seuil (badge-threshold-stat.ts)`
      );
    }
  }
}
