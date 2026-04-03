/**
 * Script pour vérifier les badges existants et les attribuer aux utilisateurs
 * qui remplissent les conditions. Met à jour src/app/utils/users/users-badges.ts.
 *
 * À lancer manuellement : npm run check-badges
 * Les conditions doivent rester alignées avec les descriptions dans badges.ts.
 * Pour les livres : les IDs doivent correspondre à `BOOKS_BADGE_DEFINITIONS` dans
 * `src/app/utils/badges/books-badges.ts`.
 * Pour les films : les IDs doivent correspondre à `MOVIES_BADGE_DEFINITIONS` dans
 * `src/app/utils/badges/movies-badges.ts`.
 * Mangas / manwhas / comics / BDs / séries : fichiers `*-badges.ts` dans
 * `src/app/utils/badges/` (paliers volume ou séries vues, sans genre).
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
  /** Séries dans la liste « vues » (hors watchlist). */
  seriesWatched: number;
};

/** Conditions des badges (alignées avec books-badges.ts, movies-badges.ts, games-badges). */
const BADGE_CONDITIONS: Record<string, (stats: BadgeStats) => boolean> = {
  // ——— Livres (général) — books-badges.ts
  'petit-lecteur': (s) => s.booksRead >= 50,
  'graine-lecteur': (s) => s.booksRead >= 100,
  'lecteur-assidu': (s) => s.booksRead >= 150,
  'lecteur-chevronne': (s) => s.booksRead >= 200,
  'lecteur-passionne': (s) => s.booksRead >= 250,
  'lecteur-veteran': (s) => s.booksRead >= 300,
  'rat-bibliotheque': (s) => s.booksRead >= 350,
  'amoureux-lecture': (s) => s.booksRead >= 400,
  'maitre-lecteur': (s) => s.booksRead >= 450,
  'doyen-lecteurs': (s) => s.booksRead >= 500,
  // ——— Fantasy (livres)
  sorcelier: (s) => s.booksFantasyRead >= 15,
  'demi-dieu': (s) => s.booksFantasyRead >= 30,
  'reine-dragons': (s) => s.booksFantasyRead >= 50,
  'elu-prophetie': (s) => s.booksFantasyRead >= 80,
  'seigneur-fantasy': (s) => s.booksFantasyRead >= 100,
  // ——— Romance (livres)
  'petit-beguin-books': (s) => s.booksRomanceRead >= 15,
  'lover-books': (s) => s.booksRomanceRead >= 30,
  'ames-soeurs': (s) => s.booksRomanceRead >= 50,
  'amour-a-travers-la-mort': (s) => s.booksRomanceRead >= 80,
  'icone-romance': (s) => s.booksRomanceRead >= 100,
  // ——— Science-fiction (livres)
  'marche-vers-l-inconnu': (s) => s.booksScienceFictionRead >= 15,
  'guerrier-omniscient': (s) => s.booksScienceFictionRead >= 30,
  'explorateur-profondeurs': (s) => s.booksScienceFictionRead >= 50,
  'survivant-invasion': (s) => s.booksScienceFictionRead >= 80,
  'architecte-psychohistoire': (s) => s.booksScienceFictionRead >= 100,
  // ——— Policier (livres)
  'amateur-polars': (s) => s.booksPolicierRead >= 15,
  'enqueteur-verite': (s) => s.booksPolicierRead >= 30,
  'artiste-evasion': (s) => s.booksPolicierRead >= 50,
  'maitre-mystere': (s) => s.booksPolicierRead >= 80,
  'genie-deduction': (s) => s.booksPolicierRead >= 100,
  // ——— Nonfiction (livres)
  'lecteur-curieux-nonfiction': (s) => s.booksNonfictionRead >= 15,
  'chercheur-savoir': (s) => s.booksNonfictionRead >= 30,
  'precurseur-progres': (s) => s.booksNonfictionRead >= 50,
  'icone-changement': (s) => s.booksNonfictionRead >= 80,
  'sage-humanite': (s) => s.booksNonfictionRead >= 100,
  // ——— Aventure (livres)
  explorateur: (s) => s.booksAventureRead >= 15,
  'moussaillon-flots': (s) => s.booksAventureRead >= 30,
  'grand-voyageur-livres': (s) => s.booksAventureRead >= 50,
  'ubiquiste-monde': (s) => s.booksAventureRead >= 80,
  'aventurier-legendaire': (s) => s.booksAventureRead >= 100,
  // ——— Films
  'cinephile-herbe': (s) => s.moviesWatched >= 100,
  'cinephile-amateur': (s) => s.moviesWatched >= 300,
  'cinephile-passionne': (s) => s.moviesWatched >= 500,
  'cinephile-devoué': (s) => s.moviesWatched >= 800,
  'cinephile-inconditionnel': (s) => s.moviesWatched >= 1000,
  // ——— Romance (films) — movies-badges.ts
  'amour-jeunesse': (s) => s.moviesRomanceWatched >= 50,
  'un-amour-de-cinema': (s) => s.moviesRomanceWatched >= 100,
  'passion-vacances': (s) => s.moviesRomanceWatched >= 150,
  'grand-amour-movies': (s) => s.moviesRomanceWatched >= 200,
  'amour-eternel-movies': (s) => s.moviesRomanceWatched >= 300,
  // ——— Science-fiction (films) — movies-badges.ts
  extraterrestre: (s) => s.moviesScienceFictionWatched >= 50,
  'machine-du-futur': (s) => s.moviesScienceFictionWatched >= 100,
  'elu-de-la-matrice': (s) => s.moviesScienceFictionWatched >= 150,
  'voyageur-temporel': (s) => s.moviesScienceFictionWatched >= 200,
  'maitre-galaxie': (s) => s.moviesScienceFictionWatched >= 300,
  // ——— Thriller (films) — movies-badges.ts
  'obsession-psychologique': (s) => s.moviesThrillerWatched >= 50,
  'expert-tension': (s) => s.moviesThrillerWatched >= 100,
  'fondateur-thriller': (s) => s.moviesThrillerWatched >= 150,
  'maitre-suspense': (s) => s.moviesThrillerWatched >= 200,
  'genie-manipulation': (s) => s.moviesThrillerWatched >= 300,
  // ——— Horreur (films) — movies-badges.ts
  'tout-ce-sang': (s) => s.moviesHorreurWatched >= 50,
  'derriere-le-masque': (s) => s.moviesHorreurWatched >= 100,
  'gardien-horreur': (s) => s.moviesHorreurWatched >= 150,
  'terreur-autre-monde': (s) => s.moviesHorreurWatched >= 200,
  'maitre-horreur-movies': (s) => s.moviesHorreurWatched >= 300,
  // ——— Comédie (films) — movies-badges.ts
  'drole-de-gendarme': (s) => s.moviesComedieWatched >= 50,
  'espion-blanquette': (s) => s.moviesComedieWatched >= 100,
  'oh-le-con': (s) => s.moviesComedieWatched >= 150,
  'sancho-de-cuba': (s) => s.moviesComedieWatched >= 200,
  'architecte-humour': (s) => s.moviesComedieWatched >= 300,
  // ——— Action (films) — movies-badges.ts
  transporteur: (s) => s.moviesActionWatched >= 50,
  'baba-yaga': (s) => s.moviesActionWatched >= 100,
  'flic-new-york': (s) => s.moviesActionWatched >= 150,
  veteran: (s) => s.moviesActionWatched >= 200,
  'icone-action': (s) => s.moviesActionWatched >= 300,
  // ——— Films (sagas) — avoir vu tous les films de la saga
  'vengeurs-de-la-terre': (s) => s.sagasFullyWatched.has('Marvel Cinematic Universe'),
  'badges-des-trois-sorciers': (s) => s.sagasFullyWatched.has('Wizarding World'),
  'guerrier-de-la-terre-du-milieu': (s) => s.sagasFullyWatched.has('Tolkien'),
  'membre-de-l-ordre': (s) => s.sagasFullyWatched.has('Star Wars'),
  // ——— Jeux vidéo (joués)
  'joueur-du-dimanche': (s) => s.gamesPlayed >= 20,
  'petit-joueur': (s) => s.gamesPlayed >= 50,
  'gamer': (s) => s.gamesPlayed >= 100,
  'nerd': (s) => s.gamesPlayed >= 150,
  'no-life': (s) => s.gamesPlayed >= 200,
  // ——— Jeux vidéo (terminés)
  'joueur-capable': (s) => s.gamesFinished >= 50,
  'champion-du-joystick': (s) => s.gamesFinished >= 100,
  'virtuose-de-la-manette': (s) => s.gamesFinished >= 200,
  // ——— Mangas lus — mangas-badges.ts
  'mangas-quinze-lus': (s) => s.mangasRead >= 15,
  'mangas-trente-lus': (s) => s.mangasRead >= 30,
  'mangas-cinquante-lus': (s) => s.mangasRead >= 50,
  'mangas-quatre-vingt-lus': (s) => s.mangasRead >= 80,
  'mangas-cent-lus': (s) => s.mangasRead >= 100,
  // ——— Manwhas lus — manwhas-badges.ts
  'manwhas-quinze-lus': (s) => s.manwhasRead >= 15,
  'manwhas-trente-lus': (s) => s.manwhasRead >= 30,
  'manwhas-cinquante-lus': (s) => s.manwhasRead >= 50,
  'manwhas-quatre-vingt-lus': (s) => s.manwhasRead >= 80,
  'manwhas-cent-lus': (s) => s.manwhasRead >= 100,
  // ——— Comics lus — comics-badges.ts
  'comics-quinze-lus': (s) => s.comicsRead >= 15,
  'comics-trente-lus': (s) => s.comicsRead >= 30,
  'comics-cinquante-lus': (s) => s.comicsRead >= 50,
  'comics-quatre-vingt-lus': (s) => s.comicsRead >= 80,
  'comics-cent-lus': (s) => s.comicsRead >= 100,
  // ——— Bandes dessinées lues — bds-badges.ts
  'bds-quinze-lus': (s) => s.bdsRead >= 15,
  'bds-trente-lus': (s) => s.bdsRead >= 30,
  'bds-cinquante-lus': (s) => s.bdsRead >= 50,
  'bds-quatre-vingt-lus': (s) => s.bdsRead >= 80,
  'bds-cent-lus': (s) => s.bdsRead >= 100,
  // ——— Séries vues — series-badges.ts
  'series-cinq-vues': (s) => s.seriesWatched >= 5,
  'series-dix-vues': (s) => s.seriesWatched >= 10,
  'series-vingt-cinq-vues': (s) => s.seriesWatched >= 25,
  'series-quarante-vues': (s) => s.seriesWatched >= 40,
  'series-soixante-vues': (s) => s.seriesWatched >= 60,
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
  const badgeIds = Object.keys(BADGE_CONDITIONS);

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
      seriesWatched: seriesWatchedList.length,
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
