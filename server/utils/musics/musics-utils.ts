const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');
const {
  formatQuotesTs,
  normalizeQuotes,
  parseQuotesField,
} = require('../quotes/quotes-utils');

const USERS_MUSICS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_MUSICS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'musics'
);

import type { BaseMusic, UserMusic } from '../../../src/app/models/music-model';

type AlbumRecord = {
  artist: string;
  album: string;
  rating: number;
  favorite: boolean;
  toListen: boolean;
  lastListenedDate: string | null;
};

type MusicUpdatePayload = Partial<
  Pick<UserMusic, 'rating' | 'timesListened' | 'byHeart' | 'favorite' | 'quotes'>
> &
  Pick<UserMusic, 'title' | 'artist'>;

function getArrayBounds(content: string, exportIndex: number) {
  const assignIndex = content.indexOf('=', exportIndex);
  if (assignIndex === -1) return null;
  const arrayStart = content.indexOf('[', assignIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) return null;
  return { arrayStart, arrayEnd };
}


function normalizeNumber(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number for ${field}`);
  }
  return parsed;
}

function normalizeString(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Invalid string for ${field}`);
  }
  return value;
}

function parseStringField(objectText: string, key: string) {
  const regex = new RegExp(
    `${key}\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`
  );
  const match = objectText.match(regex);
  if (!match) return null;
  const quote = match[1];
  return unescapeString(match[2], quote);
}

function parseNullableStringField(objectText: string, key: string) {
  const regex = new RegExp(
    `${key}\\s*:\\s*(null|(['"])((?:\\\\.|(?!\\2).)*)\\2)`
  );
  const match = objectText.match(regex);
  if (!match || match[1] === 'null') return null;
  return unescapeString(match[3], match[2]);
}

function unescapeString(value: string, quote: string) {
  return value
    .replace(new RegExp(`\\\\${quote}`, 'g'), quote)
    .replace(/\\\\/g, '\\');
}

function parseStringArrayField(objectText: string, key: string): string[] {
  const keyMatch = new RegExp(`\\n\\s*${key}\\s*:`).exec(objectText);
  if (!keyMatch || keyMatch.index === undefined) return [];
  const afterKey = objectText.slice(keyMatch.index);
  const bracketStart = afterKey.indexOf('[');
  if (bracketStart === -1) return [];
  let depth = 1;
  let i = bracketStart + 1;
  while (i < afterKey.length && depth > 0) {
    const c = afterKey[i];
    if (c === '[') depth += 1;
    else if (c === ']') depth -= 1;
    i += 1;
  }
  const inner = afterKey.slice(bracketStart + 1, i - 1);
  if (!inner.trim()) return [];
  const regex = /(['"])((?:\\.|(?!\1).)*)\1/g;
  const result: string[] = [];
  let match = regex.exec(inner);
  while (match) {
    result.push(unescapeString(match[2], match[1]));
    match = regex.exec(inner);
  }
  return result;
}

function upsertQuotesField(
  objectText: string,
  quotes: { quoteText: string; lastUpdated: string }[]
) {
  const serialized = `quotes: ${formatQuotesTs(quotes)}`;
  const keyMatch = /\n\s*quotes\s*:/.exec(objectText);
  if (!keyMatch || keyMatch.index === undefined) {
    return objectText.replace(/\n(\s*)\}\s*$/, `\n$1  ${serialized},\n$1}`);
  }
  const keyIndex = keyMatch.index + keyMatch[0].indexOf('quotes');
  const bracketStart = objectText.indexOf('[', keyIndex);
  if (bracketStart === -1) {
    return objectText.replace(/\n(\s*)\}\s*$/, `\n$1  ${serialized},\n$1}`);
  }
  let depth = 0;
  let i = bracketStart;
  let quote: string | null = null;
  while (i < objectText.length) {
    const char = objectText[i];
    if (quote) {
      if (char === '\\') {
        i += 2;
        continue;
      }
      if (char === quote) quote = null;
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      i += 1;
      continue;
    }
    if (char === '[') depth += 1;
    else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        i += 1;
        break;
      }
    }
    i += 1;
  }
  return objectText.slice(0, keyIndex) + serialized + objectText.slice(i);
}

function parseNumberField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*([^,\\n]+)`);
  const match = objectText.match(regex);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseBooleanField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(true|false)`);
  const match = objectText.match(regex);
  if (!match) return null;
  return match[1] === 'true';
}

function replaceField(
  objectText: string,
  key: string,
  value: string | number | boolean | null | undefined
) {
  if (value === undefined || value === null) return objectText;

  let next = objectText;
  if (typeof value === 'string') {
    const regex = new RegExp(
      `(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`
    );
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, (_match: string, prefix: string) => {
      const escaped = escapeString(value);
      return `${prefix}"${escaped}"`;
    });
    return next;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    const regex = new RegExp(`(${key}\\s*:\\s*)([^,\\n]+)`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, `$1${value}`);
    return next;
  }

  return next;
}

function parseUserMusicsFromFile(content: string): UserMusic[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const musics: UserMusic[] = [];
  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const title = parseStringField(objectText, 'title');
        const artist = parseStringField(objectText, 'artist');
        if (title && artist) {
          musics.push({
            title,
            artist,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            timesListened: parseNumberField(objectText, 'timesListened') ?? 0,
            byHeart: parseBooleanField(objectText, 'byHeart') ?? false,
            favorite: parseBooleanField(objectText, 'favorite') ?? false,
            quotes: parseQuotesField(objectText),
          } as UserMusic);
        }
      }
    }
    i += 1;
  }

  return musics;
}


function parseBaseMusicsFullFromFile(content: string): BaseMusic[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const musics: BaseMusic[] = [];
  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const title = parseStringField(objectText, 'title');
        const artist = parseStringField(objectText, 'artist');
        if (!title || !artist) {
          i += 1;
          continue;
        }

        musics.push({
          title,
          artist,
          album: parseStringField(objectText, 'album') || 'Unknown',
          albumTrackId: parseNumberField(objectText, 'albumTrackId') ?? 0,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          duration: parseNumberField(objectText, 'duration') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
        } as BaseMusic);
      }
    }
    i += 1;
  }

  return musics;
}

function listTsFilesRecursive(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listTsFilesRecursive(fullPath));
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
        files.push(fullPath);
      }
    }
  }
  return files;
}

function getBaseMusicsFiles(): string[] {
  return listTsFilesRecursive(BASE_MUSICS_DIR);
}

function getUserMusicsFiles(userId: string): string[] {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  return listTsFilesRecursive(userDir).filter((filePath) => {
    const name = path.basename(filePath);
    return (
      !name.endsWith('_albums.ts') &&
      !name.endsWith('_albums_notes.ts') &&
      !name.endsWith('_albums_to_listen.ts')
    );
  });
}

function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

function userAlbumsPath(userId: string, suffix: string): string {
  return path.join(USERS_MUSICS_DIR, userId, 'musics', `${userId}${suffix}`);
}

function getUserAlbumsFile(userId: string): string {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  migrateUserAlbums(userId);
  const filePath = userAlbumsPath(userId, '_albums.ts');
  if (!fs.existsSync(filePath)) {
    writeAlbums(userId, []);
  }
  return filePath;
}

function parseAlbumNotesFromFile(content: string) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;
  const notes: AlbumRecord[] = [];
  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectText = content.slice(objectStart, i + 1);
        const artist = parseStringField(objectText, 'artist');
        const album = parseStringField(objectText, 'album');
        if (artist && album) {
          notes.push({
            artist,
            album,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            favorite: parseBooleanField(objectText, 'favorite') ?? false,
            toListen: parseBooleanField(objectText, 'toListen') ?? false,
            lastListenedDate: parseNullableStringField(
              objectText,
              'lastListenedDate'
            ),
          });
        }
      }
    }
    i += 1;
  }

  return notes;
}

function albumKey(album: { artist: string; album: string }): string {
  return `${album.artist}\u0000${album.album}`;
}

function formatAlbumObject(album: AlbumRecord): string {
  const date = album.lastListenedDate
    ? `"${escapeString(album.lastListenedDate)}"`
    : 'null';
  return `  {\n    artist: "${escapeString(album.artist)}",\n    album: "${escapeString(
    album.album
  )}",\n    rating: ${album.rating},\n    favorite: ${
    album.favorite
  },\n    toListen: ${album.toListen},\n    lastListenedDate: ${date},\n  },`;
}

function writeAlbums(userId: string, albums: AlbumRecord[]) {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  const exportName = `${userId}Albums`;
  const objects = albums.map((album) => formatAlbumObject(album)).join('\n\n');
  const content = `import { UserAlbum } from '../../../../models/music-model';\n\nexport const ${exportName}: UserAlbum[] = [${
    objects ? `\n${objects}\n` : ''
  }];\n`;
  fs.writeFileSync(userAlbumsPath(userId, '_albums.ts'), content, 'utf8');
}

function migrateUserAlbums(userId: string) {
  const albumsPath = userAlbumsPath(userId, '_albums.ts');
  const notesPath = userAlbumsPath(userId, '_albums_notes.ts');
  const listenPath = userAlbumsPath(userId, '_albums_to_listen.ts');
  if (fs.existsSync(albumsPath)) {
    return;
  }
  if (!fs.existsSync(notesPath) && !fs.existsSync(listenPath)) {
    return;
  }
  const notes = fs.existsSync(notesPath)
    ? parseAlbumNotesFromFile(fs.readFileSync(notesPath, 'utf8'))
    : [];
  const listen = fs.existsSync(listenPath)
    ? parseAlbumNotesFromFile(fs.readFileSync(listenPath, 'utf8'))
    : [];
  const byKey = new Map<string, AlbumRecord>();
  for (const note of notes) {
    byKey.set(albumKey(note), { ...note, toListen: false });
  }
  for (const item of listen) {
    const key = albumKey(item);
    const existing = byKey.get(key);
    if (existing) {
      existing.toListen = true;
    } else {
      byKey.set(key, {
        artist: item.artist,
        album: item.album,
        rating: 0,
        favorite: false,
        toListen: true,
        lastListenedDate: null,
      });
    }
  }
  writeAlbums(userId, [...byKey.values()]);
  if (fs.existsSync(notesPath)) fs.unlinkSync(notesPath);
  if (fs.existsSync(listenPath)) fs.unlinkSync(listenPath);
}

function migrateAllUserAlbums() {
  if (!fs.existsSync(USERS_MUSICS_DIR)) return;
  for (const entry of fs.readdirSync(USERS_MUSICS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const musicsDir = path.join(USERS_MUSICS_DIR, entry.name, 'musics');
    if (!fs.existsSync(musicsDir)) continue;
    getUserAlbumsFile(entry.name);
  }
}

function readAlbums(userId: string) {
  const filePath = getUserAlbumsFile(userId);
  return parseAlbumNotesFromFile(fs.readFileSync(filePath, 'utf8'));
}

/** Lecture seule : ne crée pas le fichier s'il est absent. */
function readAlbumsIfPresent(userId: string) {
  const filePath = userAlbumsPath(userId, '_albums.ts');
  if (!fs.existsSync(filePath)) return [];
  return parseAlbumNotesFromFile(fs.readFileSync(filePath, 'utf8'));
}

function readAlbumNotes(userId: string) {
  return readAlbums(userId);
}

function readAlbumsToListen(userId: string) {
  return readAlbums(userId).filter(
    (album: { toListen: boolean }) => album.toListen
  );
}

function addAlbumsToListen(
  userId: string,
  albums: { artist: string; album: string }[]
) {
  const existing: AlbumRecord[] = readAlbums(userId);
  const byKey = new Map(
    existing.map((album) => [albumKey(album), album] as const)
  );
  for (const album of albums) {
    const key = albumKey(album);
    const current = byKey.get(key);
    if (current) {
      current.toListen = true;
      continue;
    }
    const created = {
      artist: album.artist,
      album: album.album,
      rating: 0,
      favorite: false,
      toListen: true,
      lastListenedDate: null,
    };
    existing.push(created);
    byKey.set(key, created);
  }
  writeAlbums(userId, existing);
  return existing.filter((album) => album.toListen);
}

function removeAlbumToListen(userId: string, artist: string, album: string) {
  const existing: AlbumRecord[] = readAlbums(userId);
  const index = existing.findIndex(
    (item) => item.artist === artist && item.album === album && item.toListen
  );
  if (index === -1) {
    throw new Error('Album not found');
  }
  const current = existing[index];
  if (
    current.rating === 0 &&
    !current.favorite &&
    !current.lastListenedDate
  ) {
    existing.splice(index, 1);
  } else {
    existing[index] = { ...current, toListen: false };
  }
  writeAlbums(userId, existing);
}

function saveAlbumNote(
  userId: string,
  artist: string,
  album: string,
  patch: {
    rating?: number;
    favorite?: boolean;
    markListened?: boolean;
  }
) {
  const existing: AlbumRecord[] = readAlbums(userId);
  const index = existing.findIndex(
    (item) => item.artist === artist && item.album === album
  );
  const current =
    index === -1
      ? {
          artist,
          album,
          rating: 0,
          favorite: false,
          toListen: false,
          lastListenedDate: null as string | null,
        }
      : existing[index];
  const next = {
    ...current,
    ...(patch.rating !== undefined ? { rating: patch.rating } : {}),
    ...(patch.favorite !== undefined ? { favorite: patch.favorite } : {}),
  };
  if (patch.markListened) {
    next.toListen = false;
    next.lastListenedDate = todayIsoDate();
  }
  if (index === -1) {
    existing.push(next);
  } else {
    existing[index] = next;
  }
  writeAlbums(userId, existing);
}


function appendObjectToArrayFile(filePath: string, objectText: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const arrayBody = content.slice(arrayStart + 1, arrayEnd);
  const trimmedBody = arrayBody.trim();
  const hasItems = /{/.test(arrayBody);
  const needsComma = hasItems && !trimmedBody.endsWith(',');

  const insert = (needsComma ? ',' : '') + '\n' + objectText + '\n';
  return (
    content.slice(0, arrayStart + 1) +
    arrayBody +
    insert +
    content.slice(arrayEnd)
  );
}

function updateMusicInFile(content: string, payload: MusicUpdatePayload) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  let i = arrayStart;
  let depth = 0;
  let objectStart = -1;

  while (i < arrayEnd) {
    const char = content[i];
    if (char === '{') {
      if (depth === 0) {
        objectStart = i;
      }
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && objectStart !== -1) {
        const objectEnd = i;
        const objectText = content.slice(objectStart, objectEnd + 1);
        const title = parseStringField(objectText, 'title');
        const artist = parseStringField(objectText, 'artist');

        if (title === payload.title && artist === payload.artist) {
          let updated = objectText;
          updated = replaceField(updated, 'rating', payload.rating);
          updated = replaceField(updated, 'timesListened', payload.timesListened);
          updated = replaceField(updated, 'byHeart', payload.byHeart);
          updated = replaceField(updated, 'favorite', payload.favorite);
          if (Array.isArray(payload.quotes)) {
            updated = upsertQuotesField(updated, normalizeQuotes(payload.quotes));
          }

          return (
            content.slice(0, objectStart) +
            updated +
            content.slice(objectEnd + 1)
          );
        }
      }
    }
    i += 1;
  }

  throw new Error('Music not found');
}

function getUserMusicsTargetFile(userId: string): string {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  const preferred = path.join(userDir, `${userId}_musics.ts`);
  if (!fs.existsSync(preferred)) {
    const exportName = `${userId}Musics`;
    const content = `import { UserMusic } from '../../../../models/music-model';\n\nexport const ${exportName}: UserMusic[] = [];\n`;
    fs.writeFileSync(preferred, content, 'utf8');
  }

  return preferred;
}

module.exports = {
  normalizeNumber,
  normalizeString,
  parseUserMusicsFromFile,
  parseBaseMusicsFullFromFile,
  getBaseMusicsFiles,
  getUserMusicsFiles,
  getUserAlbumsFile,
  migrateAllUserAlbums,
  parseAlbumNotesFromFile,
  readAlbumNotes,
  readAlbumsIfPresent,
  readAlbumsToListen,
  addAlbumsToListen,
  removeAlbumToListen,
  saveAlbumNote,
  escapeString,
  appendObjectToArrayFile,
  getUserMusicsTargetFile,
  updateMusicInFile,
};

export {};
