const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

const USERS_MANWHAS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_MANWHAS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'manwhas'
);
const BASE_MANWHAS_API_FILE = path.join(
  BASE_MANWHAS_DIR,
  'base_manwhas_api.ts'
);

import type {
  BaseManwha,
  MandatoryManwhaData,
  UserManwha,
} from '../../../src/app/models/manwha-model';

type ManwhaUpdatePayload = Partial<UserManwha> &
  Pick<UserManwha, 'title' | 'author'>;
type ManwhaIdentityPayload = {
  matchTitle?: string;
  matchAuthor?: string;
} & Partial<Pick<UserManwha, 'title' | 'author'>>;
type BaseManwhaFileUpdatePayload = Partial<BaseManwha> & {
  matchTitle?: string;
  matchAuthor?: string;
};
type ManwhaRemovePayload = Pick<MandatoryManwhaData, 'title' | 'author'>;

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

function parseManwhasFromFile(content: string): UserManwha[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const manwhas: UserManwha[] = [];
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
          manwhas.push({
            title,
            author,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            readTimes: parseNumberField(objectText, 'readTimes') ?? 0,
            readDate: parseStringField(objectText, 'readDate') ?? '',
            owned: parseBooleanField(objectText, 'owned') ?? false,
            readPriority: (parseNumberField(objectText, 'readPriority') ??
              1) as UserManwha['readPriority'],
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
          } as UserManwha);
        }
      }
    }
    i += 1;
  }

  return manwhas;
}

function parseBaseManwhasFullFromFile(content: string): BaseManwha[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const manwhas: BaseManwha[] = [];
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

        manwhas.push({
          title,
          author,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          genre: parseStringField(objectText, 'genre') || '',
          nbChapters: parseNumberField(objectText, 'nbChapters') ?? 0,
          isFinished: parseBooleanField(objectText, 'isFinished') ?? false,
          description: parseStringField(objectText, 'description') || '',
        } as BaseManwha);
      }
    }
    i += 1;
  }

  return manwhas;
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

function getBaseManwhasFiles(): string[] {
  if (!fs.existsSync(BASE_MANWHAS_DIR)) return [];
  return fs
    .readdirSync(BASE_MANWHAS_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(BASE_MANWHAS_DIR, file));
}

function baseManwhaExists(title: string, author: string): boolean {
  const files = getBaseManwhasFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const manwhas = parseBaseManwhasFullFromFile(content);
    if (manwhas.some((m) => m.title === title && m.author === author)) {
      return true;
    }
  }
  return false;
}

function updateManwhaInFile(
  filePath: string,
  manwhaData: ManwhaUpdatePayload
): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const manwhas = parseManwhasFromFile(content);
  const index = manwhas.findIndex(
    (manwha) =>
      manwha.title === manwhaData.title && manwha.author === manwhaData.author
  );

  if (index === -1) {
    return false;
  }

  manwhas[index] = {
    ...manwhas[index],
    ...manwhaData,
  } as UserManwha;

  const newArrayContent = manwhas
    .map(
      (manwha) => `  {
    title: "${escapeString(manwha.title)}",
    author: "${escapeString(manwha.author)}",
    readDate: "${escapeString(manwha.readDate || '')}",
    rating: ${manwha.rating ?? 0},
    readTimes: ${manwha.readTimes ?? 1},
    owned: ${manwha.owned ?? false},
    readPriority: ${manwha.readPriority ?? 1},
    wantToReadAgain: ${manwha.wantToReadAgain ?? false},
    ratingComment: "${escapeString(manwha.ratingComment || '')}",
    borrowed: "${escapeString(manwha.borrowed || '')}",
    loaned: "${escapeString(manwha.loaned || '')}",
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

function updateManwhaIdentityInFile(
  filePath: string,
  manwhaData: ManwhaIdentityPayload
): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const manwhas = parseManwhasFromFile(content);
  const matchTitle = manwhaData.matchTitle ?? manwhaData.title;
  const matchAuthor = manwhaData.matchAuthor ?? manwhaData.author;
  const index = manwhas.findIndex(
    (manwha) => manwha.title === matchTitle && manwha.author === matchAuthor
  );

  if (index === -1) {
    return false;
  }

  manwhas[index] = {
    ...manwhas[index],
    title: manwhaData.title ?? manwhas[index].title,
    author: manwhaData.author ?? manwhas[index].author,
  } as UserManwha;

  const newArrayContent = manwhas
    .map(
      (manwha) => `  {
    title: "${escapeString(manwha.title)}",
    author: "${escapeString(manwha.author)}",
    readDate: "${escapeString(manwha.readDate || '')}",
    rating: ${manwha.rating ?? 0},
    readTimes: ${manwha.readTimes ?? 1},
    owned: ${manwha.owned ?? false},
    readPriority: ${manwha.readPriority ?? 1},
    wantToReadAgain: ${manwha.wantToReadAgain ?? false},
    ratingComment: "${escapeString(manwha.ratingComment || '')}",
    borrowed: "${escapeString(manwha.borrowed || '')}",
    loaned: "${escapeString(manwha.loaned || '')}",
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

function updateBaseManwhaInFile(
  filePath: string,
  manwhaData: BaseManwhaFileUpdatePayload
): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const manwhas = parseBaseManwhasFullFromFile(content);
  const matchTitle = manwhaData.matchTitle ?? manwhaData.title;
  const matchAuthor = manwhaData.matchAuthor ?? manwhaData.author;
  const index = manwhas.findIndex(
    (manwha) => manwha.title === matchTitle && manwha.author === matchAuthor
  );

  if (index === -1) {
    return false;
  }

  const existing = manwhas[index];
  const merged: BaseManwha = { ...existing };
  const patch = manwhaData as Record<string, unknown>;
  for (const key of Object.keys(patch)) {
    if (key === 'matchTitle' || key === 'matchAuthor') continue;
    const value = patch[key];
    if (value !== undefined) {
      (merged as unknown as Record<string, unknown>)[key] = value;
    }
  }
  merged.title = manwhaData.title ?? existing.title;
  merged.author = manwhaData.author ?? existing.author;
  manwhas[index] = merged;

  const newArrayContent = manwhas
    .map(
      (manwha) => `  {
    title: "${escapeString(manwha.title)}",
    author: "${escapeString(manwha.author)}",
    coverUrl: "${escapeString(manwha.coverUrl || '')}",
    genre: "${escapeString(manwha.genre || '')}",
    nbChapters: ${manwha.nbChapters ?? 0},
    isFinished: ${manwha.isFinished ?? false},
    description: "${escapeString(manwha.description || '')}",
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

function updateBaseManwhaInFiles(payload: BaseManwhaFileUpdatePayload) {
  const baseFiles = getBaseManwhasFiles();
  for (const filePath of baseFiles) {
    if (updateBaseManwhaInFile(filePath, payload)) {
      return filePath;
    }
  }
  return null;
}

function removeManwhaFromFile(
  content: string,
  payload: ManwhaRemovePayload
): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const manwhas = parseManwhasFromFile(content);
  const filtered = manwhas.filter(
    (manwha) =>
      manwha.title !== payload.title || manwha.author !== payload.author
  );

  if (filtered.length === manwhas.length) {
    throw new Error('Manwha not found');
  }

  const newArrayContent = filtered
    .map(
      (manwha) => `  {
    title: "${escapeString(manwha.title)}",
    author: "${escapeString(manwha.author)}",
    readDate: "${escapeString(manwha.readDate || '')}",
    rating: ${manwha.rating ?? 0},
    readTimes: ${manwha.readTimes ?? 1},
    owned: ${manwha.owned ?? false},
    readPriority: ${manwha.readPriority ?? 1},
    wantToReadAgain: ${manwha.wantToReadAgain ?? false},
    ratingComment: "${escapeString(manwha.ratingComment || '')}",
    borrowed: "${escapeString(manwha.borrowed || '')}",
    loaned: "${escapeString(manwha.loaned || '')}",
  }`
    )
    .join(',\n');

  return (
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd)
  );
}

function getUserManwhasFiles(userId: string): string[] {
  const userDir = path.join(USERS_MANWHAS_DIR, userId, 'manwhas');
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

function getUserReadlistManwhasFiles(userId: string): string[] {
  const userDir = path.join(USERS_MANWHAS_DIR, userId, 'manwhas');
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
  BASE_MANWHAS_API_FILE,
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseManwhasFromFile,
  parseBaseManwhasFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  baseManwhaExists,
  updateManwhaInFile,
  updateManwhaIdentityInFile,
  updateBaseManwhaInFiles,
  removeManwhaFromFile,
  getUserManwhasFiles,
  getUserReadlistManwhasFiles,
  getBaseManwhasFiles,
};

export {};
