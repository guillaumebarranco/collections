const fs = require('fs');
const path = require('path');

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

function normalizeNumber(value: any, field: string) {
  if (value === undefined || value === null) return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid number for ${field}`);
  }
  return parsed;
}

function normalizeBoolean(value: any, field: string) {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean for ${field}`);
}

function normalizeString(value: any, field: string) {
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

function parseBooksFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const books: any[] = [];
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
            readDate: parseStringField(objectText, 'readDate') ?? '',
          });
        }
      }
    }
    i += 1;
  }

  return books;
}

function parseBaseBooksFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const books: any[] = [];
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

function parseBaseBooksFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const books: any[] = [];
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
          genre: parseStringField(objectText, 'genre') || '',
          saga: parseStringField(objectText, 'saga') || '',
          sagaOrder: parseNumberField(objectText, 'sagaOrder') ?? 0,
          nbTomes: parseNumberField(objectText, 'nbTomes') ?? 0,
          isFinished: parseBooleanField(objectText, 'isFinished') ?? true,
        });
      }
    }
    i += 1;
  }

  return books;
}

function escapeString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function appendObjectToArrayFile(filePath: string, objectText: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const arrayStart = content.indexOf('[', exportIndex);
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
  return fs
    .readdirSync(BASE_BOOKS_DIR)
    .filter((file: string) => file.endsWith('.ts'))
    .map((file: string) => path.join(BASE_BOOKS_DIR, file));
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

function replaceField(objectText: string, key: string, value: any) {
  if (value === undefined) return objectText;
  let next = objectText;
  if (typeof value === 'string') {
    const regex = new RegExp(`(${key}\\s*:\\s*)(['"])((?:\\\\.|(?!\\2).)*)\\2`);
    if (!regex.test(next)) {
      throw new Error(`Field ${key} not found`);
    }
    next = next.replace(regex, (match, prefix, quote) => {
      const escaped = value
        .replace(/\\/g, '\\\\')
        .replace(new RegExp(quote, 'g'), `\\${quote}`);
      return `${prefix}${quote}${escaped}${quote}`;
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

function updateBookInFile(content: string, payload: any) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = content.indexOf('[', exportIndex);
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

        if (title === payload.title && author === payload.author) {
          let updated = objectText;
          updated = replaceField(updated, 'rating', payload.rating);
          updated = replaceField(updated, 'readTimes', payload.readTimes);
          updated = replaceField(updated, 'readDate', payload.readDate);

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

function getUserBooksFiles(userId: string) {
  const userBooksDir = path.join(USERS_BOOKS_DIR, userId, 'books');
  if (!fs.existsSync(userBooksDir)) {
    throw new Error(`User books directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userBooksDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(userBooksDir, file));
}

module.exports = {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseBooksFromFile,
  parseBaseBooksFromFile,
  parseBaseBooksFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  getBaseBooksFiles,
  baseBookExists,
  BASE_BOOKS_API_FILE,
  updateBookInFile,
  getUserBooksFiles,
};

export {};
