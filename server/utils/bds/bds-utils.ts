const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

const USERS_BDS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_BDS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'bds'
);
const BASE_BDS_API_FILE = path.join(BASE_BDS_DIR, 'base_bds_api.ts');

import type {
  BaseBd,
  MandatoryBdData,
  UserBd,
} from '../../../src/app/models/bd-model';

type BdUpdatePayload = Partial<UserBd> & Pick<UserBd, 'title' | 'writer'>;
type BdIdentityPayload = {
  matchTitle?: string;
  matchWriter?: string;
} & Partial<Pick<UserBd, 'title' | 'writer'>>;
type BaseBdFileUpdatePayload = Partial<BaseBd> & {
  matchTitle?: string;
  matchWriter?: string;
};
type BdRemovePayload = Pick<MandatoryBdData, 'title' | 'writer'>;

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

function parseBdsFromFile(content: string): UserBd[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const bds: UserBd[] = [];
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
        const writer = parseStringField(objectText, 'writer');
        if (title && writer) {
          bds.push({
            title,
            writer,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            readTimes: parseNumberField(objectText, 'readTimes') ?? 0,
            readDate: parseStringField(objectText, 'readDate') ?? '',
            owned: parseBooleanField(objectText, 'owned') ?? false,
            readPriority: (parseNumberField(objectText, 'readPriority') ??
              1) as UserBd['readPriority'],
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
          } as UserBd);
        }
      }
    }
    i += 1;
  }

  return bds;
}

function parseBaseBdsFullFromFile(content: string): BaseBd[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const bds: BaseBd[] = [];
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
        const writer = parseStringField(objectText, 'writer');
        if (!title || !writer) {
          i += 1;
          continue;
        }

        bds.push({
          title,
          writer,
          designer: parseStringField(objectText, 'designer') || '',
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          pages: parseNumberField(objectText, 'pages') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
          saga: parseStringField(objectText, 'saga') || '',
          sagaOrder: parseNumberField(objectText, 'sagaOrder') ?? 0,
          description: parseStringField(objectText, 'description') || '',
        } as BaseBd);
      }
    }
    i += 1;
  }

  return bds;
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

function getBaseBdsFiles(): string[] {
  if (!fs.existsSync(BASE_BDS_DIR)) return [];
  return fs
    .readdirSync(BASE_BDS_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(BASE_BDS_DIR, file));
}

function baseBdExists(title: string, writer: string): boolean {
  const files = getBaseBdsFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const bds = parseBaseBdsFullFromFile(content);
    if (bds.some((m) => m.title === title && m.writer === writer)) {
      return true;
    }
  }
  return false;
}

function updateBdInFile(filePath: string, bdData: BdUpdatePayload): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const bds = parseBdsFromFile(content);
  const index = bds.findIndex(
    (bd) => bd.title === bdData.title && bd.writer === bdData.writer
  );

  if (index === -1) {
    return false;
  }

  bds[index] = {
    ...bds[index],
    ...bdData,
  } as UserBd;

  const newArrayContent = bds
    .map(
      (bd) => `  {
    title: "${escapeString(bd.title)}",
    writer: "${escapeString(bd.writer)}",
    readDate: "${escapeString(bd.readDate || '')}",
    rating: ${bd.rating ?? 0},
    readTimes: ${bd.readTimes ?? 1},
    owned: ${bd.owned ?? false},
    readPriority: ${bd.readPriority ?? 1},
    wantToReadAgain: ${bd.wantToReadAgain ?? false},
    ratingComment: "${escapeString(bd.ratingComment || '')}",
    borrowed: "${escapeString(bd.borrowed || '')}",
    loaned: "${escapeString(bd.loaned || '')}",
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

function updateBdIdentityInFile(
  filePath: string,
  bdData: BdIdentityPayload
): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const bds = parseBdsFromFile(content);
  const matchTitle = bdData.matchTitle ?? bdData.title;
  const matchWriter = bdData.matchWriter ?? bdData.writer;
  const index = bds.findIndex(
    (bd) => bd.title === matchTitle && bd.writer === matchWriter
  );

  if (index === -1) {
    return false;
  }

  bds[index] = {
    ...bds[index],
    title: bdData.title ?? bds[index].title,
    writer: bdData.writer ?? bds[index].writer,
  } as UserBd;

  const newArrayContent = bds
    .map(
      (bd) => `  {
    title: "${escapeString(bd.title)}",
    writer: "${escapeString(bd.writer)}",
    readDate: "${escapeString(bd.readDate || '')}",
    rating: ${bd.rating ?? 0},
    readTimes: ${bd.readTimes ?? 1},
    owned: ${bd.owned ?? false},
    readPriority: ${bd.readPriority ?? 1},
    wantToReadAgain: ${bd.wantToReadAgain ?? false},
    ratingComment: "${escapeString(bd.ratingComment || '')}",
    borrowed: "${escapeString(bd.borrowed || '')}",
    loaned: "${escapeString(bd.loaned || '')}",
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

function updateBaseBdInFile(
  filePath: string,
  bdData: BaseBdFileUpdatePayload
): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const bds = parseBaseBdsFullFromFile(content);
  const matchTitle = bdData.matchTitle ?? bdData.title;
  const matchWriter = bdData.matchWriter ?? bdData.writer;
  const index = bds.findIndex(
    (bd) => bd.title === matchTitle && bd.writer === matchWriter
  );

  if (index === -1) {
    return false;
  }

  const existing = bds[index];
  const merged: BaseBd = { ...existing };
  const patch = bdData as Record<string, unknown>;
  for (const key of Object.keys(patch)) {
    if (key === 'matchTitle' || key === 'matchWriter') continue;
    const value = patch[key];
    if (value !== undefined) {
      (merged as unknown as Record<string, unknown>)[key] = value;
    }
  }
  merged.title = bdData.title ?? existing.title;
  merged.writer = bdData.writer ?? existing.writer;
  bds[index] = merged;

  const newArrayContent = bds
    .map(
      (bd) => `  {
    title: "${escapeString(bd.title)}",
    writer: "${escapeString(bd.writer || '')}",
    designer: "${escapeString(bd.designer || '')}",
    coverUrl: "${escapeString(bd.coverUrl || '')}",
    pages: ${bd.pages ?? 0},
    genre: "${escapeString(bd.genre || '')}",
    saga: "${escapeString(bd.saga || '')}",
    sagaOrder: ${bd.sagaOrder ?? 0},
    description: "${escapeString(bd.description || '')}",
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

function updateBaseBdInFiles(payload: BaseBdFileUpdatePayload) {
  const baseFiles = getBaseBdsFiles();
  for (const filePath of baseFiles) {
    if (updateBaseBdInFile(filePath, payload)) {
      return filePath;
    }
  }
  return null;
}

function removeBdFromFile(content: string, payload: BdRemovePayload): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const bds = parseBdsFromFile(content);
  const filtered = bds.filter(
    (bd) => bd.title !== payload.title || bd.writer !== payload.writer
  );

  if (filtered.length === bds.length) {
    throw new Error('Bd not found');
  }

  const newArrayContent = filtered
    .map(
      (bd) => `  {
    title: "${escapeString(bd.title)}",
    writer: "${escapeString(bd.writer)}",
    readDate: "${escapeString(bd.readDate || '')}",
    rating: ${bd.rating ?? 0},
    readTimes: ${bd.readTimes ?? 1},
    owned: ${bd.owned ?? false},
    readPriority: ${bd.readPriority ?? 1},
    wantToReadAgain: ${bd.wantToReadAgain ?? false},
    ratingComment: "${escapeString(bd.ratingComment || '')}",
    borrowed: "${escapeString(bd.borrowed || '')}",
    loaned: "${escapeString(bd.loaned || '')}",
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

function getUserBdsFiles(userId: string): string[] {
  const userDir = path.join(USERS_BDS_DIR, userId, 'bds');
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

function getUserReadlistBdsFiles(userId: string): string[] {
  const userDir = path.join(USERS_BDS_DIR, userId, 'bds');
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
  BASE_BDS_API_FILE,
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseBdsFromFile,
  parseBaseBdsFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  baseBdExists,
  updateBdInFile,
  updateBdIdentityInFile,
  updateBaseBdInFiles,
  removeBdFromFile,
  getUserBdsFiles,
  getUserReadlistBdsFiles,
  getBaseBdsFiles,
  BASE_BDS_DIR,
  USERS_BDS_DIR,
};

export {};
