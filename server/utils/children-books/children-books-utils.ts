const fs = require('fs');
const path = require('path');
const {
  escapeStringForTsDoubleQuote: escapeString,
} = require('../escape-ts-string');
const {
  normalizeString,
  normalizeBoolean,
  normalizeNumber,
  parseStringField,
  parseNumberField,
  parseBooleanField,
} = require('../utils');
const {
  parseReadingFromFile,
  formatReadingTsLine,
} = require('../in-progress-fields');

const USERS_CHILDREN_BOOKS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_CHILDREN_BOOKS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'children-books'
);
const BASE_CHILDREN_BOOKS_API_FILE = path.join(BASE_CHILDREN_BOOKS_DIR, 'base_children_books_api.ts');

import type {
  BaseChildrenBook,
  MandatoryChildrenBookData,
  UserChildrenBook,
} from '../../../src/app/models/children-book-model';

type ChildrenBookUpdatePayload = Partial<UserChildrenBook> & Pick<UserChildrenBook, 'title' | 'author'>;

type ChildrenBookIdentityPayload = {
  matchTitle?: string;
  matchAuthor?: string;
} & Partial<Pick<UserChildrenBook, 'title' | 'author'>>;

type BaseChildrenBookFileUpdatePayload = Partial<BaseChildrenBook> & {
  matchTitle?: string;
  matchAuthor?: string;
};

type ChildrenBookRemovePayload = Pick<MandatoryChildrenBookData, 'title' | 'author'>;

function escapeSingleQuotedTsString(s: string) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatGenreTsArray(genres: string[]) {
  const parts = (genres || []).map((g) => `'${escapeSingleQuotedTsString(g)}'`);
  return `[${parts.join(', ')}]`;
}

function parseGenreField(objectText: string): string[] {
  const m = objectText.match(/genre\s*:\s*\[([\s\S]*?)\]/);
  if (m) {
    const inner = m[1].trim();
    if (!inner) return [];
    const out: string[] = [];
    const re = /'((?:[^'\\]|\\.)*)'/g;
    let x: RegExpExecArray | null;
    while ((x = re.exec(inner)) !== null) {
      out.push(x[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\'));
    }
    return out;
  }
  const legacy = parseStringField(objectText, 'genre');
  if (!legacy) return [];
  return legacy
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);
}

function parseStringArrayField(objectText: string, key: string): string[] {
  const keyIndex = objectText.indexOf(key);
  if (keyIndex === -1) return [];
  const afterKey = objectText.slice(keyIndex + key.length);
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
    const quote = match[1];
    const raw = match[2];
    result.push(
      quote === '"'
        ? raw.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        : raw.replace(/\\'/g, "'").replace(/\\\\/g, '\\')
    );
    match = regex.exec(inner);
  }
  return result;
}

function formatOtherReadDatesTs(dates: string[] | undefined): string {
  if (!Array.isArray(dates) || dates.length === 0) {
    return '[]';
  }
  const parts = dates.map((d) => `"${escapeString(d)}"`);
  return `[${parts.join(', ')}]`;
}

function upsertOtherReadDatesField(objectText: string, dates: string[]) {
  const serialized = formatOtherReadDatesTs(dates);
  const existingRegex = /otherReadDates\s*:\s*\[[\s\S]*?\]/;
  if (existingRegex.test(objectText)) {
    return objectText.replace(existingRegex, `otherReadDates: ${serialized}`);
  }
  const afterLastReadDate = /(lastReadDate\s*:\s*(?:'[^']*'|"[^"]*"),)\n/;
  if (afterLastReadDate.test(objectText)) {
    return objectText.replace(
      afterLastReadDate,
      `$1    otherReadDates: ${serialized},\n`
    );
  }
  return objectText.replace(/\}\s*$/, `    otherReadDates: ${serialized},\n  }`);
}

function normalizeGenre(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === 'string' ? v.trim() : String(v)))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean);
  }
  throw new Error('Invalid genre');
}

function parseChildrenBooksFromFile(content: string): UserChildrenBook[] {
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const childrenBooks: UserChildrenBook[] = [];
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
          childrenBooks.push({
            title,
            author,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            reading,
            readTimes,
            firstReadDate: parseStringField(objectText, 'firstReadDate') ?? '',
            lastReadDate: parseStringField(objectText, 'lastReadDate') ?? '',
            otherReadDates: parseStringArrayField(objectText, 'otherReadDates'),
            owned: parseBooleanField(objectText, 'owned') ?? false,
            borrowed:
              parseStringField(objectText, 'borrowed') ??
              (parseBooleanField(objectText, 'borrowed') ?? false
                ? 'Inconnu'
                : ''),
            loaned:
              parseStringField(objectText, 'loaned') ??
              (parseBooleanField(objectText, 'loaned') ?? false
                ? 'Inconnu'
                : ''),
            readPriority: parseNumberField(objectText, 'readPriority') ?? 1,
            wantToReadAgain:
              parseBooleanField(objectText, 'wantToReadAgain') ?? false,
            ratingComment: parseStringField(objectText, 'ratingComment') ?? '',
          } as UserChildrenBook);
        }
      }
    }
    i += 1;
  }

  return childrenBooks;
}

function parseBaseChildrenBooksFromFile(content: string): MandatoryChildrenBookData[] {
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const childrenBooks: MandatoryChildrenBookData[] = [];
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
          childrenBooks.push({
            title,
            author,
          });
        }
      }
    }
    i += 1;
  }

  return childrenBooks;
}

function parseBaseChildrenBooksFullFromFile(content: string): BaseChildrenBook[] {
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const childrenBooks: BaseChildrenBook[] = [];
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

        childrenBooks.push({
          title,
          author,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          pages: parseNumberField(objectText, 'pages') ?? 0,
          genre: parseGenreField(objectText) as BaseChildrenBook['genre'],
          saga: parseStringField(objectText, 'saga') || '',
          sagaOrder: parseNumberField(objectText, 'sagaOrder') ?? 0,
          sagaFinished: parseBooleanField(objectText, 'sagaFinished') ?? false,
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          description: parseStringField(objectText, 'description') || '',
          countryOrigin: parseStringField(
            objectText,
            'countryOrigin'
          ) as BaseChildrenBook['countryOrigin'],
          selectDisplayOrder:
            parseNumberField(objectText, 'selectDisplayOrder') ?? 0,
        } as BaseChildrenBook);
      }
    }
    i += 1;
  }

  return childrenBooks;
}

/** Index du '[' qui ouvre le tableau littéral (après " = ["), pas celui du type UserChildrenBook[]. */
function getArrayLiteralStartIndex(content: string, exportIndex: number) {
  const eqBracket = content.indexOf(' = [', exportIndex);
  if (eqBracket >= 0) {
    return eqBracket + ' = ['.length - 1;
  }
  return content.indexOf('[', exportIndex);
}

/**
 * Corrige une déclaration de tableau mal formée (ex: "UserChildrenBook[" au lieu de "UserChildrenBook[] = [").
 * Cela peut arriver après un ajout via l'API si la déclaration a été corrompue.
 */
function repairArrayDeclaration(content: string): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) return content;
  const hasCorrectDeclaration = content.indexOf(' = [', exportIndex) >= 0;
  if (hasCorrectDeclaration) return content;
  return content.replace(
    /(export const \w+: (?:UserChildrenBook|BaseChildrenBook))\[(\s*\n)/,
    '$1[] = [$2'
  );
}

function appendObjectToArrayFile(filePath: string, objectText: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

  const arrayBody = content.slice(arrayStart + 1, arrayEnd);
  const trimmedBody = arrayBody.trim();
  const hasItems = /{/.test(arrayBody);
  const needsComma = hasItems && !trimmedBody.endsWith(',');

  const insert = (needsComma ? ',' : '') + '\n' + objectText + '\n';

  return content.slice(0, arrayEnd) + insert + content.slice(arrayEnd);
}

function getBaseChildrenBooksFiles() {
  if (!fs.existsSync(BASE_CHILDREN_BOOKS_DIR)) {
    throw new Error('Base children-books directory not found');
  }
  const childrenBooksFiles = fs
    .readdirSync(BASE_CHILDREN_BOOKS_DIR)
    .filter((file: string) => file.endsWith('.ts'))
    .sort((a: string, b: string) =>
      a.localeCompare(b, 'fr', { sensitivity: 'base', numeric: true })
    )
    .map((file: string) => path.join(BASE_CHILDREN_BOOKS_DIR, file));
  return childrenBooksFiles;
}

function baseChildrenBookExists(title: string, author: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();
  const baseFiles = getBaseChildrenBooksFiles();
  return baseFiles.some((filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseBaseChildrenBooksFromFile(content).some(
      (childrenBook) =>
        childrenBook.title?.trim().toLowerCase() === normalizedTitle &&
        childrenBook.author?.trim().toLowerCase() === normalizedAuthor
    );
  });
}

function replaceField(
  objectText: string,
  key: string,
  value: string | number | boolean | undefined
) {
  if (value === undefined) return objectText;
  let next = objectText;
  if (typeof value === 'string') {
    const regex = new RegExp(`(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, (match, prefix) => {
      const escaped = escapeString(value);
      return `${prefix}"${escaped}"`;
    });
    return next;
  }

  if (typeof value === 'boolean') {
    const regex = new RegExp(`(${key}\\s*:\\s*)(true|false)`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, `$1${value}`);
    return next;
  }

  if (typeof value === 'number') {
    const regex = new RegExp(`(${key}\\s*:\\s*)([^,\\n]+)`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, `$1${value}`);
    return next;
  }

  return next;
}

function upsertField(
  objectText: string,
  key: string,
  value: string | number | boolean | string[] | undefined
) {
  if (value === undefined) return objectText;
  let next = objectText;
  if (key === 'genre' && Array.isArray(value)) {
    const formatted = formatGenreTsArray(value);
    const regexArray = new RegExp(`${key}\\s*:\\s*\\[[^\\]]*\\]`);
    if (regexArray.test(next)) {
      return next.replace(regexArray, `${key}: ${formatted}`);
    }
    const regexStr = new RegExp(
      `(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`
    );
    if (regexStr.test(next)) {
      return next.replace(regexStr, `$1${formatted}`);
    }
    return next.replace(/\}\s*$/, `    ${key}: ${formatted},\n  }`);
  }
  if (typeof value === 'string') {
    const regex = new RegExp(`(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`);
    if (regex.test(next)) {
      return replaceField(next, key, value);
    }
    const escaped = escapeString(value);
    return next.replace(/\}\s*$/, `    ${key}: "${escaped}",\n  }`);
  }
  if (typeof value === 'boolean' || typeof value === 'number') {
    const regex = new RegExp(`(${key}\\s*:\\s*)([^,\\n]+)`);
    if (regex.test(next)) {
      return replaceField(next, key, value);
    }
    return next.replace(/\}\s*$/, `    ${key}: ${value},\n  }`);
  }
  return next;
}

function updateChildrenBookInFile(content: string, payload: ChildrenBookUpdatePayload) {
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  if (arrayStart === -1) {
    throw new Error('Array bounds not found');
  }
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

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

        if (title === payload.title && author === payload.author) {
          let updated = objectText;
          updated = replaceField(updated, 'rating', payload.rating);
          if (payload.readTimes !== undefined) {
            updated = replaceField(updated, 'readTimes', payload.readTimes);
          }
          if (payload.reading !== undefined) {
            updated = replaceField(updated, 'reading', payload.reading);
          }
          updated = replaceField(
            updated,
            'firstReadDate',
            payload.firstReadDate
          );
          updated = replaceField(updated, 'lastReadDate', payload.lastReadDate);
          if (payload.otherReadDates !== undefined) {
            updated = upsertOtherReadDatesField(
              updated,
              Array.isArray(payload.otherReadDates) ? payload.otherReadDates : []
            );
          }
          updated = replaceField(updated, 'owned', payload.owned);
          updated = upsertField(updated, 'borrowed', payload.borrowed);
          updated = upsertField(updated, 'loaned', payload.loaned);
          updated = replaceField(updated, 'readPriority', payload.readPriority);
          updated = replaceField(
            updated,
            'wantToReadAgain',
            payload.wantToReadAgain
          );
          updated = upsertField(
            updated,
            'ratingComment',
            payload.ratingComment ?? ''
          );

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

  throw new Error('ChildrenBook not found');
}

function updateChildrenBookIdentityInFile(
  content: string,
  payload: ChildrenBookIdentityPayload
) {
  content = repairArrayDeclaration(content);
  const matchTitle = payload.matchTitle ?? payload.title;
  const matchAuthor = payload.matchAuthor ?? payload.author;
  if (!matchTitle || !matchAuthor) {
    throw new Error('Missing match title or author');
  }

  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

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

        if (title === matchTitle && author === matchAuthor) {
          let updated = objectText;
          if (payload.title && payload.title !== title) {
            updated = replaceField(updated, 'title', payload.title);
          }
          if (payload.author && payload.author !== author) {
            updated = replaceField(updated, 'author', payload.author);
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

  throw new Error('ChildrenBook not found');
}

function updateBaseChildrenBookInFile(
  content: string,
  payload: BaseChildrenBookFileUpdatePayload
) {
  content = repairArrayDeclaration(content);
  const matchTitle = payload.matchTitle ?? payload.title;
  const matchAuthor = payload.matchAuthor ?? payload.author;
  if (!matchTitle || !matchAuthor) {
    throw new Error('Missing match title or author');
  }
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

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

        if (title === matchTitle && author === matchAuthor) {
          let updated = objectText;
          if (payload.title && payload.title !== title) {
            updated = replaceField(updated, 'title', payload.title);
          }
          if (payload.author && payload.author !== author) {
            updated = replaceField(updated, 'author', payload.author);
          }
          updated = upsertField(updated, 'coverUrl', payload.coverUrl);
          updated = upsertField(updated, 'pages', payload.pages);
          updated = upsertField(updated, 'genre', payload.genre);
          updated = upsertField(updated, 'saga', payload.saga);
          updated = upsertField(updated, 'sagaOrder', payload.sagaOrder);
          updated = upsertField(updated, 'sagaFinished', payload.sagaFinished);
          updated = upsertField(updated, 'releaseDate', payload.releaseDate);
          updated = upsertField(
            updated,
            'description',
            payload.description ?? ''
          );
          updated = upsertField(
            updated,
            'countryOrigin',
            payload.countryOrigin ?? ''
          );
          if (payload.selectDisplayOrder !== undefined) {
            updated = upsertField(
              updated,
              'selectDisplayOrder',
              payload.selectDisplayOrder
            );
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

  throw new Error('ChildrenBook not found');
}

function updateBaseChildrenBookInFiles(payload: BaseChildrenBookFileUpdatePayload) {
  const baseFiles = getBaseChildrenBooksFiles();
  for (const childrenBookFile of baseFiles) {
    const content = fs.readFileSync(childrenBookFile, 'utf8');
    try {
      const updated = updateBaseChildrenBookInFile(content, payload);
      fs.writeFileSync(childrenBookFile, updated, 'utf8');
      return childrenBookFile;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message !== 'ChildrenBook not found') {
        throw error;
      }
    }
  }
  return null;
}

function removeChildrenBookFromFile(content: string, payload: ChildrenBookRemovePayload) {
  content = repairArrayDeclaration(content);
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

  const childrenBooks = parseChildrenBooksFromFile(content);
  const filtered = childrenBooks.filter(
    (childrenBook) => childrenBook.title !== payload.title || childrenBook.author !== payload.author
  );

  if (filtered.length === childrenBooks.length) {
    throw new Error('ChildrenBook not found');
  }

  const newArrayContent = filtered
    .map(
      (childrenBook) => `  {
    title: "${escapeString(childrenBook.title)}",
    author: "${escapeString(childrenBook.author)}",
    firstReadDate: "${escapeString(childrenBook.firstReadDate || '')}",
    lastReadDate: "${escapeString(childrenBook.lastReadDate || '')}",
    otherReadDates: ${formatOtherReadDatesTs(childrenBook.otherReadDates)},
    rating: ${childrenBook.rating ?? 0},
${formatReadingTsLine(childrenBook.reading)}    readTimes: ${childrenBook.readTimes ?? 0},
    owned: ${childrenBook.owned ?? false},
    borrowed: "${escapeString(childrenBook.borrowed ?? '')}",
    loaned: "${escapeString(childrenBook.loaned ?? '')}",
    readPriority: ${childrenBook.readPriority ?? 1},
    wantToReadAgain: ${childrenBook.wantToReadAgain ?? false},
    ratingComment: "${escapeString(childrenBook.ratingComment ?? '')}",
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

function getUserChildrenBooksFiles(userId: string) {
  const userChildrenBooksDir = path.join(USERS_CHILDREN_BOOKS_DIR, userId, 'children-books');
  if (!fs.existsSync(userChildrenBooksDir)) {
    throw new Error(`User children-books directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userChildrenBooksDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('readlist')
    )
    .map((file: string) => path.join(userChildrenBooksDir, file));
}

function getUserReadlistChildrenBooksFiles(userId: string) {
  const userChildrenBooksDir = path.join(USERS_CHILDREN_BOOKS_DIR, userId, 'children-books');
  if (!fs.existsSync(userChildrenBooksDir)) {
    throw new Error(`User children-books directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userChildrenBooksDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') && file !== 'index.ts' && file.includes('readlist')
    )
    .map((file: string) => path.join(userChildrenBooksDir, file));
}

module.exports = {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeGenre,
  formatGenreTsArray,
  formatOtherReadDatesTs,
  parseChildrenBooksFromFile,
  parseBaseChildrenBooksFromFile,
  parseBaseChildrenBooksFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  getBaseChildrenBooksFiles,
  baseChildrenBookExists,
  BASE_CHILDREN_BOOKS_API_FILE,
  updateChildrenBookInFile,
  updateChildrenBookIdentityInFile,
  updateBaseChildrenBookInFiles,
  removeChildrenBookFromFile,
  getUserChildrenBooksFiles,
  getUserReadlistChildrenBooksFiles,
};

export {};
