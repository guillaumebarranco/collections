const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');
const {
  parseReadingFromFile,
  formatReadingTsLine,
} = require('../in-progress-fields');

const USERS_MANGAS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_MANGAS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'mangas'
);
const BASE_MANGAS_API_FILE = path.join(BASE_MANGAS_DIR, 'base_mangas_api.ts');

import type {
  BaseManga,
  MandatoryMangaData,
  UserManga,
} from '../../../src/app/models/manga-model';

type MangaUpdatePayload = Partial<UserManga> & Pick<UserManga, 'title' | 'author'>;
type MangaIdentityPayload = {
  matchTitle?: string;
  matchAuthor?: string;
} & Partial<Pick<UserManga, 'title' | 'author'>>;
type BaseMangaFileUpdatePayload = Partial<BaseManga> & {
  matchTitle?: string;
  matchAuthor?: string;
};
type MangaRemovePayload = Pick<MandatoryMangaData, 'title' | 'author'>;

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

function normalizeBoolean(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean for ${field}`);
}

function normalizeString(value: unknown, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'string') {
    throw new Error(`Invalid string for ${field}`);
  }
  return value;
}

function parseStringField(objectText: string, key: string) {
  const regex = new RegExp(`${key}\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`);
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

function parseMangasFromFile(content: string): UserManga[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const mangas: UserManga[] = [];
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
        const author = parseStringField(objectText, 'author');
        if (title && author) {
          const { readTimes, reading } = parseReadingFromFile(
            parseNumberField(objectText, 'readTimes') ?? 0,
            parseBooleanField(objectText, 'reading')
          );
          mangas.push({
            title,
            author,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            reading,
            readTimes,
            readDate: parseStringField(objectText, 'readDate') ?? '',
            readingScanStartDate:
              parseStringField(objectText, 'readingScanStartDate') ?? '',
            readingScanStopDate:
              parseStringField(objectText, 'readingScanStopDate') ?? '',
            owned: parseBooleanField(objectText, 'owned') ?? false,
            readPriority: (parseNumberField(objectText, 'readPriority') ??
              1) as UserManga['readPriority'],
            wantToReadAgain:
              parseBooleanField(objectText, 'wantToReadAgain') ?? false,
            ratingComment: parseStringField(objectText, 'ratingComment') ?? '',
            borrowed:
              parseStringField(objectText, 'borrowed') ??
              ((parseBooleanField(objectText, 'borrowed') ?? false)
                ? 'Inconnu'
                : ''),
            loaned:
              parseStringField(objectText, 'loaned') ??
              ((parseBooleanField(objectText, 'loaned') ?? false)
                ? 'Inconnu'
                : ''),
          } as UserManga);
        }
      }
    }
    i += 1;
  }

  return mangas;
}

function parseBaseMangasFullFromFile(content: string): BaseManga[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const mangas: BaseManga[] = [];
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
        const author = parseStringField(objectText, 'author');
        if (!title || !author) {
          i += 1;
          continue;
        }

        mangas.push({
          title,
          author,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          genre: parseStringField(objectText, 'genre') as BaseManga['genre'],
          nbTomes: parseNumberField(objectText, 'nbTomes') ?? 0,
          startDate: parseStringField(objectText, 'startDate') || '',
          endDate: parseStringField(objectText, 'endDate') || '',
          saga: parseStringField(objectText, 'saga') || '',
          description: parseStringField(objectText, 'description') || '',
        } as BaseManga);
      }
    }
    i += 1;
  }

  return mangas;
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

function getBaseMangasFiles(): string[] {
  if (!fs.existsSync(BASE_MANGAS_DIR)) return [];
  return fs
    .readdirSync(BASE_MANGAS_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(BASE_MANGAS_DIR, file));
}

function formatUserMangaEntry(manga: UserManga): string {
  return `  {
    title: "${escapeString(manga.title)}",
    author: "${escapeString(manga.author)}",
    readDate: "${escapeString(manga.readDate || '')}",
    readingScanStartDate: "${escapeString(manga.readingScanStartDate || '')}",
    readingScanStopDate: "${escapeString(manga.readingScanStopDate || '')}",
    rating: ${manga.rating ?? 0},
${formatReadingTsLine(manga.reading)}    readTimes: ${manga.readTimes ?? 1},
    owned: ${manga.owned ?? false},
    readPriority: ${manga.readPriority ?? 1},
    wantToReadAgain: ${manga.wantToReadAgain ?? false},
    ratingComment: "${escapeString(manga.ratingComment || '')}",
    borrowed: "${escapeString(manga.borrowed || '')}",
    loaned: "${escapeString(manga.loaned || '')}",
  }`;
}

function baseMangaExists(title: string, author: string): boolean {
  const files = getBaseMangasFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const mangas = parseBaseMangasFullFromFile(content);
    if (mangas.some((m) => m.title === title && m.author === author)) {
      return true;
    }
  }
  return false;
}

function updateMangaInFile(filePath: string, mangaData: MangaUpdatePayload): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const mangas = parseMangasFromFile(content);
  const index = mangas.findIndex(
    (manga) =>
      manga.title === mangaData.title && manga.author === mangaData.author
  );

  if (index === -1) {
    return false;
  }

  mangas[index] = {
    ...mangas[index],
    ...mangaData,
  } as UserManga;

  const newArrayContent = mangas.map((manga) => formatUserMangaEntry(manga)).join(',\n');

  const exportIndex = content.indexOf('export const');
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const newContent =
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd);

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

function updateMangaIdentityInFile(filePath: string, mangaData: MangaIdentityPayload): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const mangas = parseMangasFromFile(content);
  const matchTitle = mangaData.matchTitle ?? mangaData.title;
  const matchAuthor = mangaData.matchAuthor ?? mangaData.author;
  const index = mangas.findIndex(
    (manga) => manga.title === matchTitle && manga.author === matchAuthor
  );

  if (index === -1) {
    return false;
  }

  mangas[index] = {
    ...mangas[index],
    title: mangaData.title ?? mangas[index].title,
    author: mangaData.author ?? mangas[index].author,
  } as UserManga;

  const newArrayContent = mangas.map((manga) => formatUserMangaEntry(manga)).join(',\n');

  const exportIndex = content.indexOf('export const');
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const newContent =
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd);

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

function updateBaseMangaInFile(filePath: string, mangaData: BaseMangaFileUpdatePayload): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const mangas = parseBaseMangasFullFromFile(content);
  const matchTitle = mangaData.matchTitle ?? mangaData.title;
  const matchAuthor = mangaData.matchAuthor ?? mangaData.author;
  const index = mangas.findIndex(
    (manga) => manga.title === matchTitle && manga.author === matchAuthor
  );

  if (index === -1) {
    return false;
  }

  const existing = mangas[index];
  const merged: BaseManga = { ...existing };
  const patch = mangaData as Record<string, unknown>;
  for (const key of Object.keys(patch)) {
    if (key === 'matchTitle' || key === 'matchAuthor') continue;
    const value = patch[key];
    if (value !== undefined) {
      (merged as unknown as Record<string, unknown>)[key] = value;
    }
  }
  merged.title = mangaData.title ?? existing.title;
  merged.author = mangaData.author ?? existing.author;
  mangas[index] = merged;

  const newArrayContent = mangas
    .map(
      (manga) => `  {
    title: "${escapeString(manga.title)}",
    author: "${escapeString(manga.author)}",
    coverUrl: "${escapeString(manga.coverUrl || '')}",
    genre: "${escapeString(manga.genre || '')}",
    nbTomes: ${manga.nbTomes ?? 0},
    startDate: "${escapeString(manga.startDate || '')}",
    endDate: "${escapeString(manga.endDate || '')}",
    saga: "${escapeString(manga.saga || '')}",
    description: "${escapeString(manga.description || '')}",
  }`
    )
    .join(',\n');

  const exportIndex = content.indexOf('export const');
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const newContent =
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd);

  fs.writeFileSync(filePath, newContent, 'utf8');
  return true;
}

function updateBaseMangaInFiles(payload: BaseMangaFileUpdatePayload) {
  const baseFiles = getBaseMangasFiles();
  for (const filePath of baseFiles) {
    if (updateBaseMangaInFile(filePath, payload)) {
      return filePath;
    }
  }
  return null;
}

function removeMangaFromFile(content: string, payload: MangaRemovePayload): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const mangas = parseMangasFromFile(content);
  const filtered = mangas.filter(
    (manga) => manga.title !== payload.title || manga.author !== payload.author
  );

  if (filtered.length === mangas.length) {
    throw new Error('Manga not found');
  }

  const newArrayContent = filtered
    .map((manga) => formatUserMangaEntry(manga))
    .join(',\n');

  return (
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd)
  );
}

function getUserMangasFiles(userId: string): string[] {
  const userDir = path.join(USERS_MANGAS_DIR, userId, 'mangas');
  if (!fs.existsSync(userDir)) return [];

  return fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('readlist')
    )
    .map((file: string) => path.join(userDir, file));
}

function getUserReadlistMangasFiles(userId: string): string[] {
  const userDir = path.join(USERS_MANGAS_DIR, userId, 'mangas');
  if (!fs.existsSync(userDir)) return [];

  return fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') && file !== 'index.ts' && file.includes('readlist')
    )
    .map((file: string) => path.join(userDir, file));
}

module.exports = {
  BASE_MANGAS_API_FILE,
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseMangasFromFile,
  parseBaseMangasFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  baseMangaExists,
  updateMangaInFile,
  updateMangaIdentityInFile,
  updateBaseMangaInFiles,
  removeMangaFromFile,
  getUserMangasFiles,
  getUserReadlistMangasFiles,
  getBaseMangasFiles,
};

export {};
