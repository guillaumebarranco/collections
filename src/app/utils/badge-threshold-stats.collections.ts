import type { Book } from '../models/book-model';
import type { Movie } from '../models/movie-model';
import type { Game } from '../models/game-model';
import type { Serie } from '../models/serie-model';
import type { Manga } from '../models/manga-model';
import type { Manwha } from '../models/manwha-model';
import type { Comic } from '../models/comic-model';
import type { Bd } from '../models/bd-model';
import type { BadgeThresholdStats } from './users/badges';
import { countSeriesSeenForBadges } from './series.utils';

/**
 * Normalisation des genres pour les compteurs de badges (aligné sur
 * `scripts/check-badges.ts` et l’ancien dashboard).
 */
export function normalizeGenreValueForBadges(genre: unknown): string {
  const raw = Array.isArray(genre) ? genre.join(' ') : String(genre ?? '');
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function countItemsMatchingGenreTokens<T extends { genre?: unknown }>(
  items: readonly T[],
  genreTokens: readonly string[]
): number {
  const normalizedTokens = genreTokens.map((t) =>
    normalizeGenreValueForBadges(t)
  );
  return items.filter((item) => {
    const g = normalizeGenreValueForBadges(item.genre);
    return normalizedTokens.some((t) => g.includes(t));
  }).length;
}

export function itemMatchesGenreTokens(
  item: { genre?: unknown },
  genreTokens: readonly string[]
): boolean {
  const g = normalizeGenreValueForBadges(item.genre);
  const normalizedTokens = genreTokens.map((t) =>
    normalizeGenreValueForBadges(t)
  );
  return normalizedTokens.some((t) => g.includes(t));
}

const SF_TOKENS = [
  'science-fiction',
  'science fiction',
  'scifi',
  'sci fi',
] as const;

/**
 * Métriques badges à seuil, calculées comme `check-badges` : tailles de listes
 * utilisateur + genres normalisés.
 */
export function buildBadgeThresholdStatsFromCollections(params: {
  books: readonly Book[];
  movies: readonly Movie[];
  games: readonly Game[];
  series: readonly Serie[];
  mangas: readonly Manga[];
  manwhas: readonly Manwha[];
  comics: readonly Comic[];
  bds: readonly Bd[];
}): BadgeThresholdStats {
  const gamesFinished = params.games.filter((g) =>
    (g.sessions || []).some((s) => s.finishedGame === true)
  ).length;

  return {
    booksRead: params.books.length,
    booksFantasyRead: countItemsMatchingGenreTokens(params.books, ['fantasy']),
    booksRomanceRead: countItemsMatchingGenreTokens(params.books, ['romance']),
    booksScienceFictionRead: countItemsMatchingGenreTokens(params.books, [
      ...SF_TOKENS,
    ]),
    booksPolicierRead: countItemsMatchingGenreTokens(params.books, [
      'policier',
      'polar',
    ]),
    booksNonfictionRead: countItemsMatchingGenreTokens(params.books, [
      'nonfiction',
      'non fiction',
    ]),
    booksAventureRead: countItemsMatchingGenreTokens(params.books, ['aventure']),
    moviesWatched: params.movies.length,
    moviesRomanceWatched: countItemsMatchingGenreTokens(params.movies, [
      'romance',
    ]),
    moviesScienceFictionWatched: countItemsMatchingGenreTokens(
      params.movies,
      [...SF_TOKENS]
    ),
    moviesThrillerWatched: countItemsMatchingGenreTokens(params.movies, [
      'thriller',
    ]),
    moviesHorreurWatched: countItemsMatchingGenreTokens(params.movies, [
      'horreur',
      'horror',
    ]),
    moviesComedieWatched: countItemsMatchingGenreTokens(params.movies, [
      'comedie',
      'comedy',
    ]),
    moviesActionWatched: countItemsMatchingGenreTokens(params.movies, [
      'action',
    ]),
    gamesPlayed: params.games.length,
    gamesFinished,
    mangasRead: params.mangas.length,
    manwhasRead: params.manwhas.length,
    comicsRead: params.comics.length,
    bdsRead: params.bds.length,
    seriesWatched: countSeriesSeenForBadges(params.series),
  };
}
