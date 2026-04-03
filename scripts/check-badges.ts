/**
 * Script pour vérifier les badges existants et les attribuer aux utilisateurs
 * qui remplissent les conditions. Met à jour src/app/utils/users/users-badges.ts.
 *
 * À lancer manuellement : npm run check-badges
 *
 * Catalogue canonique : `BADGE_DEFINITIONS` dans `src/app/utils/users/badges.ts`
 * (agrège `src/app/utils/badges/*-badges.ts`). Chaque id du catalogue doit avoir
 * une condition dérivée de `BadgeDefinition.threshold` + `badge-threshold-stat.ts`,
 * sauf les sagas (conditions booléennes dédiées).
 */

import {
  BADGE_DEFINITIONS,
  getBadgeThresholdStatKey,
} from '../src/app/utils/users/badges';
import { countSeriesSeenForBadges } from '../src/app/utils/series.utils';

const path = require('path');
const fs = require('fs');

const USERS_BADGES_PATH = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'utils',
  'users',
  'users-badges.ts'
);

/** Type des stats passées aux conditions de badges. */
type BadgeStats = {
  booksRead: number;
  booksFantasyRead: number;
  booksRomanceRead: number;
  booksScienceFictionRead: number;
  booksPolicierRead: number;
  booksNonfictionRead: number;
  booksAventureRead: number;
  moviesWatched: number;
  moviesRomanceWatched: number;
  moviesScienceFictionWatched: number;
  moviesThrillerWatched: number;
  moviesHorreurWatched: number;
  moviesComedieWatched: number;
  moviesActionWatched: number;
  booksRated: number;
  moviesRated: number;
  gamesRated: number;
  /** Nombre de jeux vidéo auxquels l'utilisateur a joué (dans sa liste). */
  gamesPlayed: number;
  /** Nombre de jeux vidéo terminés (au moins une session avec finishedGame). */
  gamesFinished: number;
  /** Sagas pour lesquelles l'utilisateur a vu tous les films (saga name -> true). */
  sagasFullyWatched: Set<string>;
  /** Mangas lus (liste principale utilisateur). */
  mangasRead: number;
  manwhasRead: number;
  comicsRead: number;
  bdsRead: number;
  /**
   * Séries distinctes hors watchlist avec au moins une saison entièrement visionnée (≥1).
   */
  seriesWatched: number;
};

function buildThresholdBadgeConditions(): Record<
  string,
  (stats: BadgeStats) => boolean
> {
  const out: Record<string, (stats: BadgeStats) => boolean> = {};
  for (const def of BADGE_DEFINITIONS) {
    if (def.threshold === undefined) {
      continue;
    }
    const key = getBadgeThresholdStatKey(def.id);
    if (key === null) {
      throw new Error(
        `[check-badges] Badge ${def.id}: threshold défini mais métrique inconnue (badge-threshold-stat.ts)`
      );
    }
    const t = def.threshold;
    out[def.id] = (s) => (s[key] as number) >= t;
  }
  return out;
}

/** Badges saga : pas de `threshold`, condition sur l’ensemble des films. */
const SAGA_BADGE_CONDITIONS: Record<string, (stats: BadgeStats) => boolean> = {
  'vengeurs-de-la-terre': (s) =>
    s.sagasFullyWatched.has('Marvel Cinematic Universe'),
  'badges-des-trois-sorciers': (s) =>
    s.sagasFullyWatched.has('Wizarding World'),
  'guerrier-de-la-terre-du-milieu': (s) =>
    s.sagasFullyWatched.has('Tolkien'),
  'membre-de-l-ordre': (s) => s.sagasFullyWatched.has('Star Wars'),
};

const BADGE_CONDITIONS: Record<string, (stats: BadgeStats) => boolean> = {
  ...buildThresholdBadgeConditions(),
  ...SAGA_BADGE_CONDITIONS,
};

function assertBadgeConditionsMatchCatalog(): void {
  const catalogIds = BADGE_DEFINITIONS.map((b) => b.id);
  const missing = catalogIds.filter((id) => !BADGE_CONDITIONS[id]);
  if (missing.length > 0) {
    console.error(
      '[check-badges] Badges dans BADGE_DEFINITIONS sans condition dans BADGE_CONDITIONS :',
      missing.join(', ')
    );
    process.exit(1);
  }
  const catalogSet = new Set(catalogIds);
  const orphan = Object.keys(BADGE_CONDITIONS).filter((id) => !catalogSet.has(id));
  if (orphan.length > 0) {
    console.warn(
      '[check-badges] Clés dans BADGE_CONDITIONS absentes du catalogue (ignorées) :',
      orphan.join(', ')
    );
  }
}

function isRated(rating: unknown): boolean {
  return rating != null && typeof rating === 'number';
}

function bookKey(book: { title: string; author: string }): string {
  return `${book.title}|${book.author}`;
}

function movieKey(movie: { title: string; director: string }): string {
  return `${movie.title}|${movie.director}`;
}

function normalizeGenreValue(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function countMoviesByGenre(
  movies: Array<{ title: string; director: string }>,
  genreByMovieKey: Record<string, string>,
  genreTokens: string[]
): number {
  const normalizedTokens = genreTokens.map((token) => normalizeGenreValue(token));
  return movies.filter((movie) => {
    const normalizedGenre = normalizeGenreValue(genreByMovieKey[movieKey(movie)] || '');
    return normalizedTokens.some((token) => normalizedGenre.includes(token));
  }).length;
}

function countBooksByGenre(
  books: Array<{ title: string; author: string }>,
  genreByBookKey: Record<string, string>,
  genreTokens: string[]
): number {
  const normalizedTokens = genreTokens.map((token) => normalizeGenreValue(token));
  return books.filter((book) => {
    const normalizedGenre = normalizeGenreValue(genreByBookKey[bookKey(book)] || '');
    return normalizedTokens.some((token) => normalizedGenre.includes(token));
  }).length;
}

function main(): void {
  assertBadgeConditionsMatchCatalog();

  // Import côté app (résolution au runtime)
  const { users } = require('../src/app/utils/users/users');
  const {
    getLocalBooksByUser,
    allBaseBooks,
  } = require('../src/app/facades/books/local-books.facade');
  const {
    getLocalMoviesByUser,
    allBaseMovies,
  } = require('../src/app/facades/movies/local-movies.facade');
  const { getLocalGamesByUser } = require('../src/app/facades/games/local-games.facade');
  const { getLocalMangasByUser } = require('../src/app/facades/mangas/local-mangas.facade');
  const { getLocalManwhasByUser } = require('../src/app/facades/manwhas/local-manwhas.facade');
  const { getLocalComicsByUser } = require('../src/app/facades/comics/local-comics.facade');
  const { getLocalBdsByUser } = require('../src/app/facades/bds/local-bds.facade');
  const { getLocalSeriesByUser } = require('../src/app/facades/series/local-series.facade');

  const userIds = (users as { username: string }[]).map((u) => u.username);
  const badgeIds = BADGE_DEFINITIONS.map((b) => b.id);
  const validBadgeIds = new Set(badgeIds);

  const genreByBookKey: Record<string, string> = {};
  for (const b of allBaseBooks) {
    genreByBookKey[bookKey(b)] = (b.genre || []).join(', ');
  }

  const genreByMovieKey: Record<string, string> = {};
  const sagaToMovieKeys: Record<string, Set<string>> = {};
  for (const m of allBaseMovies) {
    genreByMovieKey[movieKey(m)] = Array.isArray(m.genre)
      ? m.genre.join(', ')
      : String(m.genre ?? '');
    const sagaName = (m.saga || '').trim();
    if (sagaName) {
      if (!sagaToMovieKeys[sagaName]) {
        sagaToMovieKeys[sagaName] = new Set();
      }
      sagaToMovieKeys[sagaName].add(movieKey(m));
    }
  }

  const next: Record<string, string[]> = {};

  for (const userId of userIds) {
    const books = getLocalBooksByUser(userId);
    const movies = getLocalMoviesByUser(userId);
    const games = getLocalGamesByUser(userId);
    const mangas = getLocalMangasByUser(userId);
    const manwhas = getLocalManwhasByUser(userId);
    const comics = getLocalComicsByUser(userId);
    const bds = getLocalBdsByUser(userId);
    const seriesWatchedList = getLocalSeriesByUser(userId);

    const booksFantasyRead = countBooksByGenre(books, genreByBookKey, ['fantasy']);
    const booksRomanceRead = countBooksByGenre(books, genreByBookKey, ['romance']);
    const booksScienceFictionRead = countBooksByGenre(books, genreByBookKey, [
      'science-fiction',
      'science fiction',
      'scifi',
      'sci fi',
    ]);
    const booksPolicierRead = countBooksByGenre(books, genreByBookKey, ['policier', 'polar']);
    const booksNonfictionRead = countBooksByGenre(books, genreByBookKey, [
      'nonfiction',
      'non fiction',
    ]);
    const booksAventureRead = countBooksByGenre(books, genreByBookKey, ['aventure']);

    const moviesRomanceWatched = countMoviesByGenre(movies, genreByMovieKey, ['romance']);
    const moviesScienceFictionWatched = countMoviesByGenre(
      movies,
      genreByMovieKey,
      ['science-fiction', 'science fiction', 'scifi', 'sci fi']
    );
    const moviesThrillerWatched = countMoviesByGenre(movies, genreByMovieKey, ['thriller']);
    const moviesHorreurWatched = countMoviesByGenre(
      movies,
      genreByMovieKey,
      ['horreur', 'horror']
    );
    const moviesComedieWatched = countMoviesByGenre(
      movies,
      genreByMovieKey,
      ['comedie', 'comedy']
    );
    const moviesActionWatched = countMoviesByGenre(movies, genreByMovieKey, ['action']);

    const userMovieKeys = new Set(
      movies.map((m: { title: string; director: string }) => movieKey(m))
    );
    const sagasFullyWatched = new Set<string>();
    for (const [sagaName, keys] of Object.entries(sagaToMovieKeys)) {
      const keyList = [...keys];
      if (keyList.length > 0 && keyList.every((k) => userMovieKeys.has(k))) {
        sagasFullyWatched.add(sagaName);
      }
    }

    const gamesFinished = games.filter(
      (g: { sessions?: Array<{ finishedGame?: boolean }> }) =>
        (g.sessions || []).some((s) => s.finishedGame === true)
    ).length;

    const stats: BadgeStats = {
      booksRead: books.length,
      booksFantasyRead,
      booksRomanceRead,
      booksScienceFictionRead,
      booksPolicierRead,
      booksNonfictionRead,
      booksAventureRead,
      moviesWatched: movies.length,
      moviesRomanceWatched,
      moviesScienceFictionWatched,
      moviesThrillerWatched,
      moviesHorreurWatched,
      moviesComedieWatched,
      moviesActionWatched,
      booksRated: books.filter((b: { rating?: unknown }) => isRated(b.rating)).length,
      moviesRated: movies.filter((m: { rating?: unknown }) => isRated(m.rating)).length,
      gamesRated: games.filter((g: { rating?: unknown }) => isRated(g.rating)).length,
      gamesPlayed: games.length,
      gamesFinished,
      sagasFullyWatched,
      mangasRead: mangas.length,
      manwhasRead: manwhas.length,
      comicsRead: comics.length,
      bdsRead: bds.length,
      seriesWatched: countSeriesSeenForBadges(seriesWatchedList),
    };

    const earned = badgeIds.filter((id) => BADGE_CONDITIONS[id]!(stats));

    // Liste autoritaire : uniquement les badges encore mérités (retire les erreurs d’historique).
    const merged = earned.filter((id) => validBadgeIds.has(id)).sort();
    next[userId] = merged;
  }

  const dir = path.dirname(USERS_BADGES_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tsContent = `/**
 * Badges débloqués par utilisateur.
 * Mis à jour manuellement par le script : npm run check-badges
 */

export const usersBadges: Record<string, string[]> = ${JSON.stringify(next, null, 2)};
`;
  fs.writeFileSync(USERS_BADGES_PATH, tsContent, 'utf8');

  console.log('Badges mis à jour:', USERS_BADGES_PATH);
  Object.entries(next).forEach(([user, ids]) => {
    if (ids.length > 0) {
      console.log(`  ${user}: ${ids.join(', ')}`);
    }
  });
}

main();
