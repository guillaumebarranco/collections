const fs = require('fs');
const path = require('path');
const {
  parseMoviesFromFile,
  updateMovieInFile,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
} = require('../movies/movies-utils');

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

function getUsersMoviesLists(): Record<string, Array<{ name: string; icon: string; color: string }>> {
  if (!fs.existsSync(USERS_MOVIES_LISTS_FILE)) {
    return {};
  }
  try {
    const content = fs.readFileSync(USERS_MOVIES_LISTS_FILE, 'utf8');
    const eq = content.indexOf(' = ');
    if (eq === -1) return {};
    const jsonStart = eq + 3;
    const semi = content.lastIndexOf(';');
    const jsonStr = (
      semi > jsonStart ? content.slice(jsonStart, semi) : content.slice(jsonStart)
    ).trim();
    const data = JSON.parse(jsonStr);
    if (typeof data !== 'object' || data === null) return {};
    const out: Record<string, Array<{ name: string; icon: string; color: string }>> = {};
    for (const [uid, lists] of Object.entries(data)) {
      const arr = Array.isArray(lists) ? lists : [];
      out[uid] = arr.map((item: unknown) => {
        if (item && typeof item === 'object' && 'name' in item && typeof (item as any).name === 'string') {
          return {
            name: (item as any).name,
            icon: typeof (item as any).icon === 'string' ? (item as any).icon : DEFAULT_ICON,
            color: typeof (item as any).color === 'string' ? (item as any).color : DEFAULT_COLOR,
          };
        }
        if (typeof item === 'string') {
          return { name: item, icon: DEFAULT_ICON, color: DEFAULT_COLOR };
        }
        return { name: '', icon: DEFAULT_ICON, color: DEFAULT_COLOR };
      }).filter((x: { name: string }) => x.name.length > 0);
    }
    return out;
  } catch {
    return {};
  }
}

function writeUsersMoviesLists(
  data: Record<string, Array<{ name: string; icon: string; color: string }>>
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

function getListsForUser(
  userId: string
): Array<{ name: string; icon: string; color: string }> {
  const all = getUsersMoviesLists();
  const lists = all[userId];
  return Array.isArray(lists) ? lists : [];
}

function createList(
  userId: string,
  listName: string,
  icon?: string,
  color?: string
): Array<{ name: string; icon: string; color: string }> {
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
      if (
        Array.isArray(movie.inList) &&
        movie.inList.includes(listName)
      ) {
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
