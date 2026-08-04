const fs = require('fs');
const path = require('path');
const {
  parseMoviesFromFile,
  updateMovieInFile,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
} = require('../movies/movies-utils');

import type { UserMovieListItem } from '../../../src/app/models/movie-list.model';

const USERS_MOVIES_LISTS_FILE = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users',
  'user-movies-lists.ts'
);

const DEFAULT_ICON = '📋';
const DEFAULT_COLOR = '#6b7280';

/**
 * Parse le littéral d'objet dans user-movies-lists.ts.
 * Accepte le JSON strict (après écriture API) et le style TS/JS
 * (clés non quotées, quotes simples, virgules finales) — sinon
 * JSON.parse échoue, createList écrase le fichier et les listes
 * réapparaissent via enrichissement inList sans icon/color.
 */
function parseUsersMoviesListsLiteral(literal: string): unknown {
  const trimmed = literal.trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fichier édité à la main / format TS : évaluer comme littéral JS.
    return new Function(`"use strict"; return (${trimmed});`)();
  }
}

function normalizeUsersMoviesListsData(
  data: unknown
): Record<string, UserMovieListItem[]> {
  if (typeof data !== 'object' || data === null) return {};
  const out: Record<string, UserMovieListItem[]> = {};
  for (const [uid, lists] of Object.entries(data)) {
    const arr = Array.isArray(lists) ? lists : [];
    out[uid] = arr
      .map((item: any) => {
        if (
          item &&
          typeof item === 'object' &&
          'name' in item &&
          typeof (item as Record<string, any>)['name'] === 'string'
        ) {
          const rec: any = item as Record<string, any>;
          return {
            name: rec.name as string,
            icon: typeof rec.icon === 'string' ? rec.icon : DEFAULT_ICON,
            color: typeof rec.color === 'string' ? rec.color : DEFAULT_COLOR,
          };
        }
        if (typeof item === 'string') {
          return { name: item, icon: DEFAULT_ICON, color: DEFAULT_COLOR };
        }
        return { name: '', icon: DEFAULT_ICON, color: DEFAULT_COLOR };
      })
      .filter((x: { name: string }) => x.name.length > 0);
  }
  return out;
}

function getUsersMoviesLists(): Record<string, UserMovieListItem[]> {
  if (!fs.existsSync(USERS_MOVIES_LISTS_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(USERS_MOVIES_LISTS_FILE, 'utf8');
    const eq = content.indexOf(' = ');
    if (eq === -1) return {};
    const jsonStart = eq + 3;
    const semi = content.lastIndexOf(';');
    const literal = (
      semi > jsonStart
        ? content.slice(jsonStart, semi)
        : content.slice(jsonStart)
    ).trim();
    return normalizeUsersMoviesListsData(parseUsersMoviesListsLiteral(literal));
  } catch (error) {
    console.error(
      '[movies-lists] Impossible de lire user-movies-lists.ts:',
      error
    );
    throw new Error(
      'Impossible de lire les listes de films existantes (parse échoué). Aucune modification n’a été écrite.'
    );
  }
}

function writeUsersMoviesLists(
  data: Record<string, UserMovieListItem[]>
): void {
  const json = JSON.stringify(data, null, 2);
  const content = `/**
 * Listes de films par utilisateur.
 * Chaque liste a name, icon, color. Les films sont associés aux listes via UserMovie.inList (noms de listes).
 * Mis à jour via les API : GET/POST/DELETE /api/users/:userId/movies-lists
 */

import type { UserMovieListItem } from '../../models/movie-list.model';

export const usersMoviesLists: Record<string, UserMovieListItem[]> = ${json};
`;
  fs.writeFileSync(USERS_MOVIES_LISTS_FILE, content, 'utf8');
}

function getListsForUser(userId: string): UserMovieListItem[] {
  const all = getUsersMoviesLists();
  const lists = all[userId];
  return Array.isArray(lists) ? lists : [];
}

function createList(
  userId: string,
  listName: string,
  icon?: string,
  color?: string
): UserMovieListItem[] {
  const trimmed = listName.trim();
  if (!trimmed) {
    throw new Error('Nom de liste vide');
  }
  const data = getUsersMoviesLists();
  let lists = data[userId];
  if (!Array.isArray(lists)) {
    lists = [];
  }
  if (lists.some((item) => item.name === trimmed)) {
    return lists;
  }
  data[userId] = [
    ...lists,
    {
      name: trimmed,
      icon: (icon && icon.trim()) || DEFAULT_ICON,
      color: (color && color.trim()) || DEFAULT_COLOR,
    },
  ];
  writeUsersMoviesLists(data);
  return data[userId];
}

function deleteList(userId: string, listName: string): void {
  const data = getUsersMoviesLists();
  const lists = data[userId];
  if (!Array.isArray(lists)) {
    return;
  }
  data[userId] = lists.filter((item) => item.name !== listName);
  writeUsersMoviesLists(data);

  const movieFiles = [
    ...getUserMoviesFiles(userId),
    ...getUserWatchlistMoviesFiles(userId),
  ];
  for (const filePath of movieFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    const movies = parseMoviesFromFile(content);
    for (const movie of movies) {
      if (Array.isArray(movie.inList) && movie.inList.includes(listName)) {
        const newInList = movie.inList.filter((l: string) => l !== listName);
        content = updateMovieInFile(content, {
          title: movie.title,
          director: movie.director,
          rating: movie.rating ?? 0,
          timesWatched: movie.timesWatched ?? 0,
          firstViewedDate: movie.firstViewedDate ?? '',
          lastViewedDate: movie.lastViewedDate ?? '',
          seenAtCinema: movie.seenAtCinema ?? false,
          owned: movie.owned ?? false,
          wantToSeeAgain: movie.wantToSeeAgain ?? false,
          watchPriority: movie.watchPriority ?? 1,
          ratingComment: movie.ratingComment ?? '',
          inList: newInList,
        });
      }
    }
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

module.exports = {
  getUsersMoviesLists,
  getListsForUser,
  createList,
  deleteList,
  writeUsersMoviesLists,
};

export {};
