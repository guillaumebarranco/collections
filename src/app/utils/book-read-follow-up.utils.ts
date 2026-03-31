import { BADGE_DEFINITIONS } from './users/badges';
import type { Book } from '../models/book-model';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';

/** Paliers badges « nombre de livres lus » — aligné avec books-badges.ts. */
export const READER_BOOK_TIERS: { id: string; threshold: number }[] = [
  { id: 'petit-lecteur', threshold: 50 },
  { id: 'graine-lecteur', threshold: 100 },
  { id: 'lecteur-assidu', threshold: 150 },
  { id: 'lecteur-chevronne', threshold: 200 },
  { id: 'lecteur-passionne', threshold: 250 },
  { id: 'lecteur-veteran', threshold: 300 },
  { id: 'rat-bibliotheque', threshold: 350 },
  { id: 'amoureux-lecture', threshold: 400 },
  { id: 'maitre-lecteur', threshold: 450 },
  { id: 'doyen-lecteurs', threshold: 500 },
];

/** Paliers badges « livres de romance lus » — aligné avec books-badges.ts. */
export const ROMANCE_BOOK_TIERS: { id: string; threshold: number }[] = [
  { id: 'petit-beguin-books', threshold: 15 },
  { id: 'lover-books', threshold: 30 },
  { id: 'ames-soeurs', threshold: 50 },
  { id: 'amour-a-travers-la-mort', threshold: 80 },
  { id: 'icone-romance', threshold: 100 },
];

function badgeMeta(id: string): { name: string; image: string } {
  const def = BADGE_DEFINITIONS.find((b) => b.id === id);
  return {
    name: def?.name ?? id,
    image: def?.image ?? '/badges/books/Bella_Swan.png',
  };
}

export function countReadBooks(books: Book[]): number {
  return books.filter((b) => (b.readTimes ?? 0) > 0).length;
}

export function isRomanceBookGenre(
  genre: string | string[] | undefined
): boolean {
  if (!genre) return false;
  const parts = Array.isArray(genre) ? genre : [genre];
  return parts.some((p) => {
    const g = p.trim().toLowerCase();
    return g.includes('romance') || g.includes('romantique');
  });
}

export function countRomanceReadBooks(books: Book[]): number {
  return books.filter(
    (b) => (b.readTimes ?? 0) > 0 && isRomanceBookGenre(b.genre)
  ).length;
}

export function getNextReaderProgress(
  totalRead: number
): EntityBadgeProgressRow | null {
  const tier = READER_BOOK_TIERS.find((t) => totalRead < t.threshold);
  if (!tier) {
    const last = READER_BOOK_TIERS[READER_BOOK_TIERS.length - 1];
    const meta = badgeMeta(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current: totalRead,
      target: last.threshold,
      complete: totalRead >= last.threshold,
    };
  }
  const meta = badgeMeta(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current: totalRead,
    target: tier.threshold,
    complete: false,
  };
}

export function getNextRomanceBookProgress(
  romanceRead: number
): EntityBadgeProgressRow | null {
  const tier = ROMANCE_BOOK_TIERS.find((t) => romanceRead < t.threshold);
  if (!tier) {
    const last = ROMANCE_BOOK_TIERS[ROMANCE_BOOK_TIERS.length - 1];
    const meta = badgeMeta(last.id);
    return {
      badgeId: last.id,
      badgeName: meta.name,
      badgeImage: meta.image,
      current: romanceRead,
      target: last.threshold,
      complete: romanceRead >= last.threshold,
    };
  }
  const meta = badgeMeta(tier.id);
  return {
    badgeId: tier.id,
    badgeName: meta.name,
    badgeImage: meta.image,
    current: romanceRead,
    target: tier.threshold,
    complete: false,
  };
}

/** Lignes à afficher après readlist → lu. */
export function buildBookReadFollowUpProgress(
  book: Book,
  allUserBooks: Book[]
): EntityBadgeProgressRow[] {
  const total = countReadBooks(allUserBooks);
  const rows: EntityBadgeProgressRow[] = [];
  const reader = getNextReaderProgress(total);
  if (reader) rows.push(reader);
  if (isRomanceBookGenre(book.genre)) {
    const romanceCount = countRomanceReadBooks(allUserBooks);
    const rom = getNextRomanceBookProgress(romanceCount);
    if (rom) rows.push(rom);
  }
  return rows;
}
