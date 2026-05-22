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

const USERS_BOOKS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_BOOKS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'books'
);
const BASE_BOOKS_API_FILE = path.join(BASE_BOOKS_DIR, 'base_books_api.ts');

import type {
  BaseBook,
  MandatoryBookData,
  UserBook,
} from '../../../src/app/models/book-model';

type BookUpdatePayload = Partial<UserBook> & Pick<UserBook, 'title' | 'author'>;

type BookIdentityPayload = {
  matchTitle?: string;
  matchAuthor?: string;
} & Partial<Pick<UserBook, 'title' | 'author'>>;

type BaseBookFileUpdatePayload = Partial<BaseBook> & {
  matchTitle?: string;
  matchAuthor?: string;
};

type BookRemovePayload = Pick<MandatoryBookData, 'title' | 'author'>;

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

function parseBooksFromFile(content: string): UserBook[] {
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

  const books: UserBook[] = [];
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
          books.push({
            title,
            author,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            readTimes: parseNumberField(objectText, 'readTimes') ?? 0,
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
          } as UserBook);
        }
      }
    }
    i += 1;
  }

  return books;
}

function parseBaseBooksFromFile(content: string): MandatoryBookData[] {
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

  const books: MandatoryBookData[] = [];
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
          books.push({
            title,
            author,
          });
        }
      }
    }
    i += 1;
  }

  return books;
}

function parseBaseBooksFullFromFile(content: string): BaseBook[] {
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

  const books: BaseBook[] = [];
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

        books.push({
          title,
          author,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          pages: parseNumberField(objectText, 'pages') ?? 0,
          genre: parseGenreField(objectText) as BaseBook['genre'],
          saga: parseStringField(objectText, 'saga') || '',
          sagaOrder: parseNumberField(objectText, 'sagaOrder') ?? 0,
          sagaFinished: parseBooleanField(objectText, 'sagaFinished') ?? false,
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          description: parseStringField(objectText, 'description') || '',
          countryOrigin: parseStringField(
            objectText,
            'countryOrigin'
          ) as BaseBook['countryOrigin'],
          selectDisplayOrder:
            parseNumberField(objectText, 'selectDisplayOrder') ?? 0,
        } as BaseBook);
      }
    }
    i += 1;
  }

  return books;
}

/** Index du '[' qui ouvre le tableau littéral (après " = ["), pas celui du type UserBook[]. */
function getArrayLiteralStartIndex(content: string, exportIndex: number) {
  const eqBracket = content.indexOf(' = [', exportIndex);
  if (eqBracket >= 0) {
    return eqBracket + ' = ['.length - 1;
  }
  return content.indexOf('[', exportIndex);
}

/**
 * Corrige une déclaration de tableau mal formée (ex: "UserBook[" au lieu de "UserBook[] = [").
 * Cela peut arriver après un ajout via l'API si la déclaration a été corrompue.
 */
function repairArrayDeclaration(content: string): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) return content;
  const hasCorrectDeclaration = content.indexOf(' = [', exportIndex) >= 0;
  if (hasCorrectDeclaration) return content;
  return content.replace(
    /(export const \w+: (?:UserBook|BaseBook))\[(\s*\n)/,
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

function getBaseBooksFiles() {
  if (!fs.existsSync(BASE_BOOKS_DIR)) {
    throw new Error('Base books directory not found');
  }
  const booksFiles = fs
    .readdirSync(BASE_BOOKS_DIR)
    .filter((file: string) => file.endsWith('.ts'))
    .sort((a: string, b: string) =>
      a.localeCompare(b, 'fr', { sensitivity: 'base', numeric: true })
    )
    .map((file: string) => path.join(BASE_BOOKS_DIR, file));
  return booksFiles;
}

function baseBookExists(title: string, author: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();
  const baseFiles = getBaseBooksFiles();
  return baseFiles.some((filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseBaseBooksFromFile(content).some(
      (book) =>
        book.title?.trim().toLowerCase() === normalizedTitle &&
        book.author?.trim().toLowerCase() === normalizedAuthor
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

function updateBookInFile(content: string, payload: BookUpdatePayload) {
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
          updated = replaceField(updated, 'readTimes', payload.readTimes);
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

  throw new Error('Book not found');
}

function updateBookIdentityInFile(
  content: string,
  payload: BookIdentityPayload
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

  throw new Error('Book not found');
}

function updateBaseBookInFile(
  content: string,
  payload: BaseBookFileUpdatePayload
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

  throw new Error('Book not found');
}

function updateBaseBookInFiles(payload: BaseBookFileUpdatePayload) {
  const baseFiles = getBaseBooksFiles();
  for (const bookFile of baseFiles) {
    const content = fs.readFileSync(bookFile, 'utf8');
    try {
      const updated = updateBaseBookInFile(content, payload);
      fs.writeFileSync(bookFile, updated, 'utf8');
      return bookFile;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message !== 'Book not found') {
        throw error;
      }
    }
  }
  return null;
}

function removeBookFromFile(content: string, payload: BookRemovePayload) {
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

  const books = parseBooksFromFile(content);
  const filtered = books.filter(
    (book) => book.title !== payload.title || book.author !== payload.author
  );

  if (filtered.length === books.length) {
    throw new Error('Book not found');
  }

  const newArrayContent = filtered
    .map(
      (book) => `  {
    title: "${escapeString(book.title)}",
    author: "${escapeString(book.author)}",
    firstReadDate: "${escapeString(book.firstReadDate || '')}",
    lastReadDate: "${escapeString(book.lastReadDate || '')}",
    otherReadDates: ${formatOtherReadDatesTs(book.otherReadDates)},
    rating: ${book.rating ?? 0},
    readTimes: ${book.readTimes ?? 0},
    owned: ${book.owned ?? false},
    borrowed: "${escapeString(book.borrowed ?? '')}",
    loaned: "${escapeString(book.loaned ?? '')}",
    readPriority: ${book.readPriority ?? 1},
    wantToReadAgain: ${book.wantToReadAgain ?? false},
    ratingComment: "${escapeString(book.ratingComment ?? '')}",
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

function getUserBooksFiles(userId: string) {
  const userBooksDir = path.join(USERS_BOOKS_DIR, userId, 'books');
  if (!fs.existsSync(userBooksDir)) {
    throw new Error(`User books directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userBooksDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('readlist')
    )
    .map((file: string) => path.join(userBooksDir, file));
}

function getUserReadlistBooksFiles(userId: string) {
  const userBooksDir = path.join(USERS_BOOKS_DIR, userId, 'books');
  if (!fs.existsSync(userBooksDir)) {
    throw new Error(`User books directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userBooksDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') && file !== 'index.ts' && file.includes('readlist')
    )
    .map((file: string) => path.join(userBooksDir, file));
}

module.exports = {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeGenre,
  formatGenreTsArray,
  formatOtherReadDatesTs,
  parseBooksFromFile,
  parseBaseBooksFromFile,
  parseBaseBooksFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  getBaseBooksFiles,
  baseBookExists,
  BASE_BOOKS_API_FILE,
  updateBookInFile,
  updateBookIdentityInFile,
  updateBaseBookInFiles,
  removeBookFromFile,
  getUserBooksFiles,
  getUserReadlistBooksFiles,
};

export {};
