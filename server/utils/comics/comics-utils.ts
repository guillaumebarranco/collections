const fs = require('fs');
const path = require('path');

const USERS_COMICS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_COMICS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'comics'
);
const BASE_COMICS_API_FILE = path.join(BASE_COMICS_DIR, 'base_comics_api.ts');

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

function parseComicsFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const comics: any[] = [];
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
        const designer = parseStringField(objectText, 'designer');
        if (title && designer) {
          comics.push({
            title,
            designer,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            readTimes: parseNumberField(objectText, 'readTimes') ?? 0,
            readDate: parseStringField(objectText, 'readDate') ?? '',
          });
        }
      }
    }
    i += 1;
  }

  return comics;
}

function parseBaseComicsFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const comics: any[] = [];
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
        const designer = parseStringField(objectText, 'designer');
        if (!title || !designer) {
          i += 1;
          continue;
        }

        comics.push({
          title,
          designer,
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          pages: parseNumberField(objectText, 'pages') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
          nbTomes: parseNumberField(objectText, 'nbTomes') ?? 0,
          isFinished: parseBooleanField(objectText, 'isFinished') ?? false,
          writer: parseStringField(objectText, 'writer') || '',
        });
      }
    }
    i += 1;
  }

  return comics;
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

function getBaseComicsFiles(): string[] {
  if (!fs.existsSync(BASE_COMICS_DIR)) return [];
  return fs
    .readdirSync(BASE_COMICS_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(BASE_COMICS_DIR, file));
}

function baseComicExists(title: string, designer: string): boolean {
  const files = getBaseComicsFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const comics = parseBaseComicsFullFromFile(content);
    if (comics.some((m: any) => m.title === title && m.designer === designer)) {
      return true;
    }
  }
  return false;
}

function updateComicInFile(filePath: string, comicData: any): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const comics = parseComicsFromFile(content);
  const index = comics.findIndex(
    (comic) =>
      comic.title === comicData.title && comic.designer === comicData.designer
  );

  if (index === -1) {
    return false;
  }

  comics[index] = {
    ...comics[index],
    ...comicData,
  };

  const newArrayContent = comics
    .map(
      (comic) => `  {
    title: '${escapeString(comic.title)}',
    designer: '${escapeString(comic.designer)}',
    readDate: '${escapeString(comic.readDate || '')}',
    rating: ${comic.rating ?? 0},
    readTimes: ${comic.readTimes ?? 1},
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

function removeComicFromFile(content: string, payload: any): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const comics = parseComicsFromFile(content);
  const filtered = comics.filter(
    (comic) =>
      comic.title !== payload.title || comic.designer !== payload.designer
  );

  if (filtered.length === comics.length) {
    throw new Error('Comic not found');
  }

  const newArrayContent = filtered
    .map(
      (comic) => `  {
    title: '${escapeString(comic.title)}',
    designer: '${escapeString(comic.designer)}',
    readDate: '${escapeString(comic.readDate || '')}',
    rating: ${comic.rating ?? 0},
    readTimes: ${comic.readTimes ?? 1},
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

function getUserComicsFiles(userId: string): string[] {
  const userDir = path.join(USERS_COMICS_DIR, userId, 'comics');
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

function getUserReadlistComicsFiles(userId: string): string[] {
  const userDir = path.join(USERS_COMICS_DIR, userId, 'comics');
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
  BASE_COMICS_API_FILE,
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseComicsFromFile,
  parseBaseComicsFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  baseComicExists,
  updateComicInFile,
  removeComicFromFile,
  getUserComicsFiles,
  getUserReadlistComicsFiles,
  getBaseComicsFiles,
  BASE_COMICS_DIR,
  USERS_COMICS_DIR,
};

export {};
