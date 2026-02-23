/**
 * Script pour vérifier les badges existants et les attribuer aux utilisateurs
 * qui remplissent les conditions. Met à jour src/app/utils/users/users-badges.ts.
 *
 * À lancer manuellement : npm run check-badges
 * Les conditions doivent rester alignées avec les descriptions dans badges.ts.
 */

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

/** Conditions des badges (alignées avec badges.ts). */
const BADGE_CONDITIONS: Record<
  string,
  (stats: {
    booksRead: number;
    booksFantasyRead: number;
    booksRomanceRead: number;
    moviesWatched: number;
    moviesRomanceWatched: number;
    booksRated: number;
    moviesRated: number;
    gamesRated: number;
  }) => boolean
> = {
  // ——— Livres (général)
  'petit-lecteur': (s) => s.booksRead >= 50,
  'graine-lecteur': (s) => s.booksRead >= 100,
  'lecteur-assidu': (s) => s.booksRead >= 150,
  'lecteur-chevronne': (s) => s.booksRead >= 200,
  'lecteur-passionne': (s) => s.booksRead >= 250,
  'lecteur-veteran': (s) => s.booksRead >= 300,
  'maitre-lecteur': (s) => s.booksRead >= 400,
  'doyen-lecteurs': (s) => s.booksRead >= 500,
  // ——— Fantasy (livres) — aligné avec badges.ts (15, 30, 50, 80, 100)
  'eleve-fantasy': (s) => s.booksFantasyRead >= 15,
  'amoureux-fantasy': (s) => s.booksFantasyRead >= 30,
  'chevalier-fantasy': (s) => s.booksFantasyRead >= 50,
  'heros-fantasy': (s) => s.booksFantasyRead >= 80,
  'seigneur-fantasy': (s) => s.booksFantasyRead >= 100,
  // ——— Romance (livres) — aligné avec badges.ts (15, 30, 50, 80, 100)
  'petit-beguin-books': (s) => s.booksRomanceRead >= 15,
  'lover-books': (s) => s.booksRomanceRead >= 30,
  'amoureux-books': (s) => s.booksRomanceRead >= 50,
  'grand-amour-books': (s) => s.booksRomanceRead >= 80,
  'amour-eternel-books': (s) => s.booksRomanceRead >= 100,
  // ——— Films
  'cinephile-herbe': (s) => s.moviesWatched >= 100,
  'cinephile-amateur': (s) => s.moviesWatched >= 300,
  'cinephile-passionne': (s) => s.moviesWatched >= 500,
  'cinephile-devoué': (s) => s.moviesWatched >= 800,
  'cinephile-inconditionnel': (s) => s.moviesWatched >= 1000,
  // ——— Romance (films)
  'petit-beguin-movies': (s) => s.moviesRomanceWatched >= 50,
  'lover-movies': (s) => s.moviesRomanceWatched >= 100,
  'amoureux-movies': (s) => s.moviesRomanceWatched >= 150,
  'grand-amour-movies': (s) => s.moviesRomanceWatched >= 200,
  'amour-eternel-movies': (s) => s.moviesRomanceWatched >= 300,
};

function isRated(rating: unknown): boolean {
  return rating != null && typeof rating === 'number';
}

function bookKey(book: { title: string; author: string }): string {
  return `${book.title}|${book.author}`;
}

function movieKey(movie: { title: string; director: string }): string {
  return `${movie.title}|${movie.director}`;
}

function main(): void {
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

  const userIds = (users as { username: string }[]).map((u) => u.username);
  const badgeIds = Object.keys(BADGE_CONDITIONS);

  const genreByBookKey: Record<string, string> = {};
  for (const b of allBaseBooks) {
    genreByBookKey[bookKey(b)] = b.genre || '';
  }

  const genreByMovieKey: Record<string, string> = {};
  for (const m of allBaseMovies) {
    genreByMovieKey[movieKey(m)] = m.genre || '';
  }

  const next: Record<string, string[]> = {};

  for (const userId of userIds) {
    const books = getLocalBooksByUser(userId);
    const movies = getLocalMoviesByUser(userId);
    const games = getLocalGamesByUser(userId);

    const booksFantasyRead = books.filter(
      (b: { title: string; author: string }) =>
        (genreByBookKey[bookKey(b)] || '').toLowerCase().includes('fantasy')
    ).length;

    const booksRomanceRead = books.filter(
      (b: { title: string; author: string }) =>
        (genreByBookKey[bookKey(b)] || '').toLowerCase().includes('romance')
    ).length;

    const moviesRomanceWatched = movies.filter(
      (m: { title: string; director: string }) =>
        (genreByMovieKey[movieKey(m)] || '').toLowerCase().includes('romance')
    ).length;

    const stats = {
      booksRead: books.length,
      booksFantasyRead,
      booksRomanceRead,
      moviesWatched: movies.length,
      moviesRomanceWatched,
      booksRated: books.filter((b: { rating?: unknown }) => isRated(b.rating)).length,
      moviesRated: movies.filter((m: { rating?: unknown }) => isRated(m.rating)).length,
      gamesRated: games.filter((g: { rating?: unknown }) => isRated(g.rating)).length,
    };

    const earned = badgeIds.filter((id) =>
      BADGE_CONDITIONS[id] ? BADGE_CONDITIONS[id](stats) : false
    );

    let existing: string[] = [];
    if (fs.existsSync(USERS_BADGES_PATH)) {
      try {
        const content = fs.readFileSync(USERS_BADGES_PATH, 'utf8');
        const eq = content.indexOf(' = ');
        if (eq !== -1) {
          const jsonStart = eq + 3;
          const jsonEnd = content.lastIndexOf(';');
          const jsonStr = (jsonEnd > jsonStart ? content.slice(jsonStart, jsonEnd) : content.slice(jsonStart)).trim();
          const data = JSON.parse(jsonStr) as Record<string, string[]>;
          existing = Array.isArray(data[userId]) ? data[userId] : [];
        }
      } catch {
        existing = [];
      }
    }

    const validIds = new Set(badgeIds);
    const merged = [...new Set([...existing, ...earned])]
      .filter((id) => validIds.has(id))
      .sort();
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
