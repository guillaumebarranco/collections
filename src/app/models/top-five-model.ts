/** Types d'entités pour le Top 5 personnel (alignés avec les collections) */
export type TopFiveEntityType =
  | 'books'
  | 'movies'
  | 'series'
  | 'games'
  | 'musics'
  | 'comics'
  | 'bds'
  | 'mangas'
  | 'manwhas';

/** Pour chaque type d'entité, tableau de 5 clés (index 0 = rang 1, etc.). Clé vide = slot non rempli. */
export type TopFiveByEntity = Record<TopFiveEntityType, string[]>;

export interface UserTopFive {
  [userId: string]: TopFiveByEntity;
}

const ENTITY_TYPES: TopFiveEntityType[] = [
  'books',
  'movies',
  'series',
  'games',
  'musics',
  'comics',
  'bds',
  'mangas',
  'manwhas',
];

function emptySlots(): string[] {
  return ['', '', '', '', ''];
}

/** Retourne un TopFiveByEntity vide (5 slots vides par entité) */
export function createEmptyTopFive(): TopFiveByEntity {
  return ENTITY_TYPES.reduce(
    (acc, type) => {
      acc[type] = emptySlots();
      return acc;
    },
    {} as TopFiveByEntity
  );
}

export const TOP_FIVE_ENTITY_TYPES = ENTITY_TYPES;
