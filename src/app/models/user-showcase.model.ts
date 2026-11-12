import {
  TOP_FIVE_ENTITY_TYPES,
  type TopFiveEntityType,
} from './top-five-model';

/** Nombre d'œuvres phares affichées sur le tableau de bord. */
export const SHOWCASE_SLOT_COUNT = 5;

/** Une œuvre choisie parmi les top 5 des collections. */
export interface UserShowcaseSlot {
  entityType: TopFiveEntityType;
  key: string;
  title: string;
  coverUrl: string;
}

/** Cinq emplacements, `null` si l'emplacement est vide. */
export interface UserShowcase {
  slots: Array<UserShowcaseSlot | null>;
}

const ALLOWED_ENTITY_TYPES = new Set<string>(TOP_FIVE_ENTITY_TYPES);

export function createEmptyUserShowcase(): UserShowcase {
  return {
    slots: Array.from({ length: SHOWCASE_SLOT_COUNT }, () => null),
  };
}

/** Libellés courts des collections, pour la bandeau et le sélecteur. */
export const SHOWCASE_ENTITY_LABELS: Record<TopFiveEntityType, string> = {
  books: 'Livres',
  'children-books': 'Livres pour enfants',
  movies: 'Films',
  series: 'Séries',
  animes: 'Animés',
  games: 'Jeux',
  musics: 'Musiques',
  comics: 'Comics',
  bds: 'BD',
  mangas: 'Mangas',
  manwhas: 'Manwhas',
};

function sanitizeCoverUrl(value: string): string {
  const trimmed = value.trim().slice(0, 500);
  if (!trimmed) return '';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return '';
}

function normalizeSlot(raw: unknown): UserShowcaseSlot | null {
  if (!raw || typeof raw !== 'object') return null;
  const slot = raw as Partial<UserShowcaseSlot>;
  if (!slot.entityType || !ALLOWED_ENTITY_TYPES.has(slot.entityType)) {
    return null;
  }
  if (typeof slot.key !== 'string' || !slot.key.trim()) return null;
  return {
    entityType: slot.entityType,
    key: slot.key.trim().slice(0, 500),
    title: typeof slot.title === 'string' ? slot.title.trim().slice(0, 300) : '',
    coverUrl: sanitizeCoverUrl(
      typeof slot.coverUrl === 'string' ? slot.coverUrl : ''
    ),
  };
}

/** Ramène une réponse API ou un cache local à exactement 5 emplacements. */
export function normalizeUserShowcase(data: unknown): UserShowcase {
  const slotsIn =
    data &&
    typeof data === 'object' &&
    Array.isArray((data as { slots?: unknown }).slots)
      ? (data as { slots: unknown[] }).slots
      : [];
  const slots: Array<UserShowcaseSlot | null> = [];
  for (let i = 0; i < SHOWCASE_SLOT_COUNT; i++) {
    slots.push(normalizeSlot(slotsIn[i]));
  }
  return { slots };
}
