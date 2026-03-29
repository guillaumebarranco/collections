const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

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

function replaceField(objectText: string, key: string, value: any) {
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

function parseUserMusicsFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const musics: any[] = [];
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
          });
        }
      }
    }
    i += 1;
  }

  return musics;
}


function parseBaseMusicsFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const musics: any[] = [];
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
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          duration: parseNumberField(objectText, 'duration') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
        });
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
  return listTsFilesRecursive(userDir);
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

function updateMusicInFile(content: string, payload: any) {
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
  escapeString,
  appendObjectToArrayFile,
  getUserMusicsTargetFile,
  updateMusicInFile,
};

export {};
