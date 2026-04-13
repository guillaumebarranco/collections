import type { Book } from '../models/book-model';
import type { BadgeThresholdStatKey } from './users/badges';
import type { EntityBadgeProgressRow } from './entity-badge-progress.types';
import { computeNextTierProgressRow } from './badge-follow-up-tier.utils';
import {
  buildBadgeThresholdStatsFromCollections,
  itemMatchesGenreTokens,
} from './badge-threshold-stats.collections';

const SF_TOKENS = [
  'science-fiction',
  'science fiction',
  'scifi',
  'sci fi',
] as const;

const BOOK_FOLLOW_UP_GENRE_RULES: {
  statKey: BadgeThresholdStatKey;
  tokens: readonly string[];
  unitLabel: string;
}[] = [
  { statKey: 'booksFantasyRead', tokens: ['fantasy'], unitLabel: 'livres fantasy' },
  { statKey: 'booksRomanceRead', tokens: ['romance'], unitLabel: 'livres romance' },
  {
    statKey: 'booksScienceFictionRead',
    tokens: [...SF_TOKENS],
    unitLabel: 'livres de science-fiction',
  },
  {
    statKey: 'booksPolicierRead',
    tokens: ['policier', 'polar'],
    unitLabel: 'livres policiers',
  },
  {
    statKey: 'booksNonfictionRead',
    tokens: ['nonfiction', 'non fiction'],
    unitLabel: 'livres nonfiction',
  },
  {
    statKey: 'booksAventureRead',
    tokens: ['aventure'],
    unitLabel: "livres d'aventure",
  },
];

/** Lignes à afficher après readlist → lu (lecture générale + genres concernés). */
export function buildBookReadFollowUpProgress(
  book: Book,
  allUserBooks: Book[]
): EntityBadgeProgressRow[] {
  const stats = buildBadgeThresholdStatsFromCollections({
    books: allUserBooks,
    movies: [],
    games: [],
    series: [],
    mangas: [],
    manwhas: [],
    comics: [],
    bds: [],
  });

  const rows: EntityBadgeProgressRow[] = [];
  const general = computeNextTierProgressRow(stats.booksRead, 'booksRead');
  if (general) {
    rows.push({ ...general, unitLabel: 'livres' });
  }

  for (const rule of BOOK_FOLLOW_UP_GENRE_RULES) {
    if (!itemMatchesGenreTokens(book, rule.tokens)) {
      continue;
    }
    const row = computeNextTierProgressRow(stats[rule.statKey], rule.statKey);
    if (row) {
      rows.push({ ...row, unitLabel: rule.unitLabel });
    }
  }
  return rows;
}
