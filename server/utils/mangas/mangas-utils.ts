const fs = require('fs');
const path = require('path');

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

function getArrayBounds(content: string, exportIndex: number) {
  const assignIndex = content.indexOf('=', exportIndex);
  if (assignIndex === -1) return null;
  const arrayStart = content.indexOf('[', assignIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) return null;
  return { arrayStart, arrayEnd };
}

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

function parseMangasFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const mangas: any[] = [];
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
          mangas.push({
            title,
            author,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            readTimes: parseNumberField(objectText, 'readTimes') ?? 0,
            readDate: parseStringField(objectText, 'readDate') ?? '',
            owned: parseBooleanField(objectText, 'owned') ?? false,
          });
        }
      }
    }
    i += 1;
  }

  return mangas;
}

function parseBaseMangasFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const mangas: any[] = [];
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
          pages: parseNumberField(objectText, 'pages') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
          nbTomes: parseNumberField(objectText, 'nbTomes') ?? 0,
          isFinished: parseBooleanField(objectText, 'isFinished') ?? false,
        });
      }
    }
    i += 1;
  }

  return mangas;
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

function baseMangaExists(title: string, author: string): boolean {
  const files = getBaseMangasFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const mangas = parseBaseMangasFullFromFile(content);
    if (mangas.some((m: any) => m.title === title && m.author === author)) {
      return true;
    }
  }
  return false;
}

function updateMangaInFile(filePath: string, mangaData: any): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const mangas = parseMangasFromFile(content);
  const index = mangas.findIndex(
    (manga) => manga.title === mangaData.title && manga.author === mangaData.author
  );

  if (index === -1) {
    return false;
  }

  mangas[index] = {
    ...mangas[index],
    ...mangaData,
  };

  const newArrayContent = mangas
    .map(
      (manga) => `  {
    title: '${escapeString(manga.title)}',
    author: '${escapeString(manga.author)}',
    readDate: '${escapeString(manga.readDate || '')}',
    rating: ${manga.rating ?? 0},
    readTimes: ${manga.readTimes ?? 1},
    owned: ${manga.owned ?? false},
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

function removeMangaFromFile(content: string, payload: any): string {
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
    .map(
      (manga) => `  {
    title: '${escapeString(manga.title)}',
    author: '${escapeString(manga.author)}',
    readDate: '${escapeString(manga.readDate || '')}',
    rating: ${manga.rating ?? 0},
    readTimes: ${manga.readTimes ?? 1},
    owned: ${manga.owned ?? false},
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
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        file.includes('readlist')
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
  removeMangaFromFile,
  getUserMangasFiles,
  getUserReadlistMangasFiles,
  getBaseMangasFiles,
};

export {};
