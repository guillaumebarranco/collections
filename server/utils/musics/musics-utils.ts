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
      !name.endsWith('_albums_notes.ts') &&
      !name.endsWith('_albums_to_listen.ts')
    );
  });
}

function getUserAlbumNotesFile(userId: string): string {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  const filePath = path.join(userDir, `${userId}_albums_notes.ts`);
  if (!fs.existsSync(filePath)) {
    const exportName = `${userId}AlbumNotes`;
    const content = `import { UserAlbumNote } from '../../../../models/music-model';\n\nexport const ${exportName}: UserAlbumNote[] = [];\n`;
    fs.writeFileSync(filePath, content, 'utf8');
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
  const notes = [];
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
          });
        }
      }
    }
    i += 1;
  }

  return notes;
}

function appendObjectToContent(content: string, objectText: string) {
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

function setAlbumNoteField(
  objectText: string,
  key: string,
  value: number | boolean
) {
  const regex = new RegExp(`(${key}\\s*:\\s*)([^,\\n]+)`);
  if (regex.test(objectText)) {
    return objectText.replace(regex, `$1${value}`);
  }
  if (/\n[ \t]*\}$/.test(objectText)) {
    return objectText.replace(
      /,?\n([ \t]*)\}$/,
      `,\n$1  ${key}: ${value},\n$1}`
    );
  }
  return objectText.replace(/\}$/, `, ${key}: ${value} }`);
}

function upsertAlbumNoteInFile(
  content: string,
  payload: {
    artist: string;
    album: string;
    rating?: number;
    favorite?: boolean;
  }
) {
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
        const artist = parseStringField(objectText, 'artist');
        const album = parseStringField(objectText, 'album');
        if (artist === payload.artist && album === payload.album) {
          let updated = objectText;
          if (payload.rating !== undefined) {
            updated = setAlbumNoteField(updated, 'rating', payload.rating);
          }
          if (payload.favorite !== undefined) {
            updated = setAlbumNoteField(updated, 'favorite', payload.favorite);
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

  const objectText = `  {\n    artist: "${escapeString(
    payload.artist
  )}",\n    album: "${escapeString(payload.album)}",\n    rating: ${
    payload.rating ?? 0
  },\n    favorite: ${payload.favorite ?? false},\n  },`;
  return appendObjectToContent(content, objectText);
}

function readAlbumNotes(userId: string) {
  const filePath = path.join(
    USERS_MUSICS_DIR,
    userId,
    'musics',
    `${userId}_albums_notes.ts`
  );
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return parseAlbumNotesFromFile(fs.readFileSync(filePath, 'utf8'));
}

function getUserAlbumsToListenPath(userId: string): string {
  return path.join(
    USERS_MUSICS_DIR,
    userId,
    'musics',
    `${userId}_albums_to_listen.ts`
  );
}

function readAlbumsToListen(userId: string) {
  const filePath = getUserAlbumsToListenPath(userId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return parseAlbumNotesFromFile(fs.readFileSync(filePath, 'utf8')).map(
    (note: { artist: string; album: string }) => ({
      artist: note.artist,
      album: note.album,
    })
  );
}

function writeAlbumsToListen(
  userId: string,
  albums: { artist: string; album: string }[]
) {
  const userDir = path.join(USERS_MUSICS_DIR, userId, 'musics');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  const exportName = `${userId}AlbumsToListen`;
  const objects = albums
    .map(
      (album) =>
        `  {\n    artist: "${escapeString(album.artist)}",\n    album: "${escapeString(
          album.album
        )}",\n  },`
    )
    .join('\n\n');
  const content = `import { UserAlbumToListen } from '../../../../models/music-model';\n\nexport const ${exportName}: UserAlbumToListen[] = [${
    objects ? `\n${objects}\n` : ''
  }];\n`;
  fs.writeFileSync(getUserAlbumsToListenPath(userId), content, 'utf8');
}

function addAlbumsToListen(
  userId: string,
  albums: { artist: string; album: string }[]
) {
  const existing = readAlbumsToListen(userId);
  const seen = new Set(
    existing.map((album: { artist: string; album: string }) =>
      `${album.artist}\u0000${album.album}`
    )
  );
  const next = [...existing];
  for (const album of albums) {
    const key = `${album.artist}\u0000${album.album}`;
    if (seen.has(key)) continue;
    seen.add(key);
    next.push({ artist: album.artist, album: album.album });
  }
  writeAlbumsToListen(userId, next);
  return next;
}

function removeAlbumToListen(userId: string, artist: string, album: string) {
  const existing = readAlbumsToListen(userId);
  const next = existing.filter(
    (item: { artist: string; album: string }) =>
      !(item.artist === artist && item.album === album)
  );
  if (next.length === existing.length) {
    throw new Error('Album not found');
  }
  writeAlbumsToListen(userId, next);
}

function saveAlbumNote(
  userId: string,
  artist: string,
  album: string,
  patch: { rating?: number; favorite?: boolean }
) {
  const filePath = getUserAlbumNotesFile(userId);
  const content = fs.readFileSync(filePath, 'utf8');
  const updated = upsertAlbumNoteInFile(content, { artist, album, ...patch });
  fs.writeFileSync(filePath, updated, 'utf8');
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
  getUserAlbumNotesFile,
  parseAlbumNotesFromFile,
  readAlbumNotes,
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
