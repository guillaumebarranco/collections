/**
 * Vérifie les doublons (combo `title + director`) dans les fichiers de films
 * de chaque utilisateur (`src/app/utils/users/<user>/movies/*.ts`).
 *
 * Deux types de doublons sont remontés :
 *   1. Doublons à l'intérieur d'un même fichier.
 *   2. Doublons inter-fichiers d'un même utilisateur lorsque les fichiers
 *      appartiennent à la même "collection logique" :
 *        - Tous les fichiers `*_movies*.ts` ne contenant ni `watchlist`
 *          ni `cinema` (ex: `guillaume_movies_1.ts` + `guillaume_movies_4.ts`)
 *          forment la collection "movies".
 *        - Les fichiers `*_watchlist_*.ts` forment la collection "watchlist".
 *        - Les fichiers `*_cinema_*.ts` forment la collection "cinema".
 *
 * Usage : npm run check-user-movies-dupes
 */

import * as fs from 'fs';
import * as path from 'path';

type MovieEntry = {
  title: string;
  director: string;
  file: string;
};

type Collection = 'movies' | 'watchlist' | 'cinema';

/**
 * Trouve la racine du repo en remontant depuis le cwd jusqu'à trouver un
 * package.json. Cette approche est compatible CommonJS (ts-node) et ESM
 * (exécution directe via `node script.ts` avec Node.js >= 22), contrairement
 * à `__dirname` qui n'existe pas en ESM.
 */
function findRepoRoot(start: string): string {
  let current = path.resolve(start);
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      return current;
    }
    current = path.dirname(current);
  }
  throw new Error(
    `Impossible de trouver la racine du repo (aucun package.json trouvé en remontant depuis "${start}").`
  );
}

const REPO_ROOT = findRepoRoot(process.cwd());
const USERS_ROOT = path.join(REPO_ROOT, 'src', 'app', 'utils', 'users');

function listMovieFiles(usersRoot: string): string[] {
  const files: string[] = [];
  const userDirs = fs.readdirSync(usersRoot, { withFileTypes: true });
  for (const userDir of userDirs) {
    if (!userDir.isDirectory()) continue;
    const moviesDir = path.join(usersRoot, userDir.name, 'movies');
    if (!fs.existsSync(moviesDir)) continue;
    for (const f of fs.readdirSync(moviesDir)) {
      if (f.endsWith('.ts')) {
        files.push(path.join(moviesDir, f));
      }
    }
  }
  return files;
}

/**
 * Extrait les couples `{ title, director }` d'un fichier de films TypeScript.
 * Repose sur la structure régulière des fichiers : un objet par film, avec
 * `title` et `director` présents tous les deux (parfois en single, double ou
 * backtick quotes).
 */
function extractMovies(filePath: string): MovieEntry[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const movies: MovieEntry[] = [];

  const objectBlockRegex = /\{[\s\S]*?\}/g;
  const blocks = content.match(objectBlockRegex) ?? [];

  for (const block of blocks) {
    const titleMatch = block.match(/title\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/);
    const directorMatch = block.match(
      /director\s*:\s*(["'`])((?:\\.|(?!\1).)*)\1/
    );
    if (titleMatch && directorMatch) {
      movies.push({
        title: titleMatch[2],
        director: directorMatch[2],
        file: filePath,
      });
    }
  }
  return movies;
}

function getUserName(filePath: string): string {
  const rel = path.relative(USERS_ROOT, filePath);
  return rel.split(path.sep)[0];
}

function getCollection(filePath: string): Collection {
  const base = path.basename(filePath).toLowerCase();
  if (base.includes('watchlist')) return 'watchlist';
  if (base.includes('cinema')) return 'cinema';
  return 'movies';
}

function makeKey(title: string, director: string): string {
  return `${title.trim().toLowerCase()}|||${director.trim().toLowerCase()}`;
}

type FileDuplicate = {
  user: string;
  file: string;
  title: string;
  director: string;
  count: number;
};

type CrossFileDuplicate = {
  user: string;
  collection: Collection;
  title: string;
  director: string;
  files: string[];
};

function findDuplicatesInFile(
  filePath: string,
  movies: MovieEntry[]
): FileDuplicate[] {
  const counts = new Map<
    string,
    { title: string; director: string; count: number }
  >();
  for (const m of movies) {
    const key = makeKey(m.title, m.director);
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { title: m.title, director: m.director, count: 1 });
    }
  }
  return [...counts.values()]
    .filter((entry) => entry.count > 1)
    .map(({ title, director, count }) => ({
      user: getUserName(filePath),
      file: filePath,
      title,
      director,
      count,
    }));
}

function findCrossFileDuplicates(
  user: string,
  filesByCollection: Map<Collection, MovieEntry[]>
): CrossFileDuplicate[] {
  const duplicates: CrossFileDuplicate[] = [];
  for (const [collection, movies] of filesByCollection.entries()) {
    const filesByKey = new Map<
      string,
      { title: string; director: string; files: Set<string> }
    >();
    for (const m of movies) {
      const key = makeKey(m.title, m.director);
      const entry = filesByKey.get(key);
      if (entry) {
        entry.files.add(m.file);
      } else {
        filesByKey.set(key, {
          title: m.title,
          director: m.director,
          files: new Set([m.file]),
        });
      }
    }
    for (const { title, director, files } of filesByKey.values()) {
      if (files.size > 1) {
        duplicates.push({
          user,
          collection,
          title,
          director,
          files: [...files],
        });
      }
    }
  }
  return duplicates;
}

function relPath(p: string): string {
  return path.relative(REPO_ROOT, p).replace(/\\/g, '/');
}

function main(): void {
  const files = listMovieFiles(USERS_ROOT);

  const fileDupes: FileDuplicate[] = [];
  const moviesByUser = new Map<string, Map<Collection, MovieEntry[]>>();

  for (const filePath of files) {
    const movies = extractMovies(filePath);
    fileDupes.push(...findDuplicatesInFile(filePath, movies));

    const user = getUserName(filePath);
    const collection = getCollection(filePath);
    if (!moviesByUser.has(user)) {
      moviesByUser.set(user, new Map());
    }
    const userMap = moviesByUser.get(user)!;
    if (!userMap.has(collection)) {
      userMap.set(collection, []);
    }
    userMap.get(collection)!.push(...movies);
  }

  const crossFileDupes: CrossFileDuplicate[] = [];
  for (const [user, perCollection] of moviesByUser.entries()) {
    crossFileDupes.push(...findCrossFileDuplicates(user, perCollection));
  }

  console.log('=== Doublons dans un même fichier ===\n');
  if (fileDupes.length === 0) {
    console.log('Aucun doublon intra-fichier trouvé.\n');
  } else {
    const grouped = new Map<string, FileDuplicate[]>();
    for (const d of fileDupes) {
      const key = relPath(d.file);
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(d);
    }
    for (const [file, dupes] of [...grouped.entries()].sort()) {
      console.log(file);
      for (const d of dupes) {
        console.log(`  - "${d.title}" / ${d.director} (x${d.count})`);
      }
    }
    console.log(
      `\n${fileDupes.length} doublon(s) intra-fichier dans ${grouped.size} fichier(s).\n`
    );
  }

  console.log('\n=== Doublons inter-fichiers (même utilisateur, même collection) ===\n');
  const onlyCrossFile = crossFileDupes.filter(
    (d) => !fileDupes.some(
      (fd) =>
        fd.user === d.user &&
        makeKey(fd.title, fd.director) === makeKey(d.title, d.director)
    )
  );
  if (onlyCrossFile.length === 0) {
    console.log('Aucun doublon inter-fichiers trouvé.');
  } else {
    const grouped = new Map<string, CrossFileDuplicate[]>();
    for (const d of onlyCrossFile) {
      const key = `${d.user} / ${d.collection}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(d);
    }
    for (const [bucket, dupes] of [...grouped.entries()].sort()) {
      console.log(bucket);
      for (const d of dupes) {
        console.log(`  - "${d.title}" / ${d.director}`);
        for (const f of d.files) {
          console.log(`      • ${relPath(f)}`);
        }
      }
    }
    console.log(`\n${onlyCrossFile.length} doublon(s) inter-fichiers.`);
  }
}

main();
