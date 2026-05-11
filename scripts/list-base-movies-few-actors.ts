/**
 * Liste les films de référence (`base_movies_*.ts`) qui ont 3 acteurs ou moins
 * de renseignés.
 *
 * Lit tous les fichiers `src/app/utils/entities/movies/base_movies_*.ts`,
 * parse chaque objet film et compte les éléments du tableau `actors`. Affiche
 * la liste groupée par fichier.
 *
 * Usage : npm run list-base-movies-few-actors
 *   ou  : node scripts/list-base-movies-few-actors.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ACTORS_THRESHOLD = 3;

type MovieEntry = {
  title: string;
  director: string;
  actorsCount: number;
  file: string;
};

/**
 * Trouve la racine du repo en remontant depuis le cwd jusqu'à trouver un
 * package.json. Compatible CommonJS (ts-node) et ESM.
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
const BASE_MOVIES_DIR = path.join(
  REPO_ROOT,
  'src',
  'app',
  'utils',
  'entities',
  'movies'
);

function listBaseMovieFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('base_movies_') && f.endsWith('.ts'))
    .map((f) => path.join(dir, f))
    .sort();
}

/**
 * Découpe le contenu d'un fichier en blocs de films. Chaque film dans les
 * `base_movies_*.ts` est défini comme un objet de l'array racine, indenté à
 * 2 espaces : `^  {` ... `^  },?`. On utilise ce repère pour découper de
 * façon robuste sans implémenter un vrai parser.
 */
function splitMovieBlocks(content: string): string[] {
  const lines = content.split('\n');
  const blocks: string[] = [];
  let current: string[] | null = null;

  for (const line of lines) {
    if (current === null) {
      if (/^ {2}\{\s*$/.test(line)) {
        current = [line];
      }
    } else {
      current.push(line);
      if (/^ {2}\},?\s*$/.test(line)) {
        blocks.push(current.join('\n'));
        current = null;
      }
    }
  }
  return blocks;
}

function readString(block: string, key: 'title' | 'director'): string | null {
  const re = new RegExp(`${key}\\s*:\\s*(["'\`])((?:\\\\.|(?!\\1).)*)\\1`);
  const m = block.match(re);
  return m ? m[2] : null;
}

/**
 * Extrait le contenu du tableau `actors: [ ... ]` au premier niveau du bloc et
 * compte le nombre d'éléments par occurrences de `name:`. Robuste tant que les
 * acteurs sont des objets `{ name: '...' }` simples, ce qui est le cas dans
 * tous les `base_movies_*.ts`.
 */
function countActors(block: string): number {
  const idx = block.indexOf('actors');
  if (idx === -1) return 0;
  const start = block.indexOf('[', idx);
  if (start === -1) return 0;

  let depth = 0;
  let end = -1;
  for (let i = start; i < block.length; i++) {
    const c = block[i];
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) return 0;

  const inner = block.slice(start + 1, end);
  const matches = inner.match(/name\s*:/g);
  return matches ? matches.length : 0;
}

function extractMovies(filePath: string): MovieEntry[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const blocks = splitMovieBlocks(content);
  const movies: MovieEntry[] = [];

  for (const block of blocks) {
    const title = readString(block, 'title');
    const director = readString(block, 'director');
    if (title === null || director === null) continue;
    movies.push({
      title,
      director,
      actorsCount: countActors(block),
      file: filePath,
    });
  }
  return movies;
}

function relPath(p: string): string {
  return path.relative(REPO_ROOT, p).replace(/\\/g, '/');
}

function main(): void {
  const files = listBaseMovieFiles(BASE_MOVIES_DIR);

  const grouped = new Map<string, MovieEntry[]>();
  let totalFew = 0;
  let totalAll = 0;

  for (const filePath of files) {
    const movies = extractMovies(filePath);
    totalAll += movies.length;
    const few = movies.filter((m) => m.actorsCount <= ACTORS_THRESHOLD);
    if (few.length > 0) {
      grouped.set(filePath, few);
      totalFew += few.length;
    }
  }

  console.log(
    `=== Base movies avec ${ACTORS_THRESHOLD} acteur(s) ou moins ===\n`
  );

  if (grouped.size === 0) {
    console.log('Aucun film concerné.');
    return;
  }

  for (const [filePath, movies] of [...grouped.entries()].sort()) {
    console.log(`${relPath(filePath)} (${movies.length})`);
    const sorted = [...movies].sort((a, b) => {
      if (a.actorsCount !== b.actorsCount) {
        return a.actorsCount - b.actorsCount;
      }
      return a.title.localeCompare(b.title, 'fr');
    });
    for (const m of sorted) {
      console.log(
        `  - [${m.actorsCount}] "${m.title}" / ${m.director}`
      );
    }
    console.log('');
  }

  console.log(
    `Total : ${totalFew} film(s) avec ${ACTORS_THRESHOLD} acteur(s) ou moins ` +
      `sur ${totalAll} film(s) analysé(s).`
  );
}

main();
