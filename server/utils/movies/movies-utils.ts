const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

const USERS_MOVIES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_MOVIES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'movies'
);
const BASE_MOVIES_API_FILE = path.join(BASE_MOVIES_DIR, 'base_movies_api.ts');

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

function parseStringArrayField(objectText: string, key: string) {
  const keyIndex = objectText.indexOf(key);
  if (keyIndex === -1) return null;
  const afterKey = objectText.slice(keyIndex + key.length);
  const bracketStart = afterKey.indexOf('[');
  if (bracketStart === -1) return null;
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
  const regex = /(['"])((?:\\\.|(?!\1).)*)\1/g;
  const result: string[] = [];
  let match = regex.exec(inner);
  while (match) {
    const quote = match[1];
    result.push(unescapeString(match[2], quote));
    match = regex.exec(inner);
  }
  return result;
}

const FROM_ENTITY_TYPES = ['book', 'game', 'comic', 'manga', 'manwha', 'serie'];

function parsefromEntityField(objectText: string) {
  const nullMatch = objectText.match(/fromEntity\s*:\s*null/);
  if (nullMatch) return null;
  const objStart = objectText.indexOf('fromEntity');
  if (objStart === -1) return null;
  const braceStart = objectText.indexOf('{', objStart);
  if (braceStart === -1) return null;
  let depth = 1;
  let i = braceStart + 1;
  while (i < objectText.length && depth > 0) {
    const c = objectText[i];
    if (c === '{') depth += 1;
    else if (c === '}') depth -= 1;
    i += 1;
  }
  const inner = objectText.slice(braceStart, i);
  const entityTypeRaw = parseStringField(inner, 'entityType');
  const entityType = FROM_ENTITY_TYPES.includes(entityTypeRaw || '')
    ? entityTypeRaw
    : 'book';
  const title = parseStringField(inner, 'title');
  const secondEntityKey =
    parseStringField(inner, 'secondEntityKey') ??
    parseStringField(inner, 'author');
  if (title != null && secondEntityKey != null)
    return {
      entityType: entityType || 'book',
      title,
      secondEntityKey,
    };
  return null;
}

function parseMoviesFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const movies: any[] = [];
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
        const director = parseStringField(objectText, 'director');
        if (title && director) {
          movies.push({
            title,
            director,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            timesWatched: parseNumberField(objectText, 'timesWatched') ?? 0,
            firstViewedDate:
              parseStringField(objectText, 'firstViewedDate') ?? '',
            lastViewedDate:
              parseStringField(objectText, 'lastViewedDate') ?? '',
            seenAtCinema:
              parseBooleanField(objectText, 'seenAtCinema') ?? false,
            owned: parseBooleanField(objectText, 'owned') ?? false,
            wantToSeeAgain:
              parseBooleanField(objectText, 'wantToSeeAgain') ?? false,
            watchPriority: parseNumberField(objectText, 'watchPriority') ?? 1,
            ratingComment: parseStringField(objectText, 'ratingComment') ?? '',
            inList: parseStringArrayField(objectText, 'inList') ?? [],
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
          });
        }
      }
    }
    i += 1;
  }

  return movies;
}

function parseBaseMoviesFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const movies: any[] = [];
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
        const director = parseStringField(objectText, 'director');
        if (title) {
          movies.push({
            title,
            director,
          });
        }
      }
    }
    i += 1;
  }

  return movies;
}

function parseActors(objectText: string): string[] {
  const regex = /name\s*:\s*(['"])((?:\\.|(?!\1).)*)\1/g;
  const actors: string[] = [];
  let match = regex.exec(objectText);
  while (match) {
    const quote = match[1];
    actors.push(unescapeString(match[2], quote));
    match = regex.exec(objectText);
  }
  return actors;
}

function parseBaseMoviesFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const movies: any[] = [];
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
        if (!title) {
          i += 1;
          continue;
        }

        movies.push({
          title,
          director: parseStringField(objectText, 'director') || '',
          actors: parseActors(objectText).map((name) => ({ name })),
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          length: parseNumberField(objectText, 'length') ?? 0,
          genre: parseStringField(objectText, 'genre') || '',
          saga: parseStringField(objectText, 'saga') || '',
          description: parseStringField(objectText, 'description') || '',
          countryOrigin: parseStringField(objectText, 'countryOrigin') || '',
          fromEntity: parsefromEntityField(objectText) ?? null,
        });
      }
    }
    i += 1;
  }

  return movies;
}

function appendObjectToArrayFile(filePath: string, objectText: string) {
  const content = fs.readFileSync(filePath, 'utf8');
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

function getBaseMoviesFiles() {
  if (!fs.existsSync(BASE_MOVIES_DIR)) {
    throw new Error('Base movies directory not found');
  }
  return fs
    .readdirSync(BASE_MOVIES_DIR)
    .filter((file: string) => file.endsWith('.ts'))
    .map((file: string) => path.join(BASE_MOVIES_DIR, file));
}

function baseMovieExists(title: string) {
  const normalized = title.trim().toLowerCase();
  const baseFiles = getBaseMoviesFiles();
  return baseFiles.some((filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseBaseMoviesFromFile(content).some(
      (movie) => movie.title?.trim().toLowerCase() === normalized
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

function upsertInListField(objectText: string, arr: string[]) {
  const serialized =
    arr.length === 0
      ? '[]'
      : '[' + arr.map((s) => '"' + escapeString(s) + '"').join(', ') + ']';
  const existingRegex = /inList\s*:\s*\[[\s\S]*?\]/;
  if (existingRegex.test(objectText)) {
    return objectText.replace(existingRegex, `inList: ${serialized}`);
  }
  return objectText.replace(/\}\s*$/, `    inList: ${serialized},\n  }`);
}

function upsertField(objectText: string, key: string, value: any) {
  if (value === undefined) return objectText;
  let next = objectText;
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

function formatActors(actors: string[]) {
  const items = actors.map(
    (name) => `      {\n        name: "${escapeString(name)}",\n      }`
  );
  return `actors: [\n${items.join(',\n')}\n    ]`;
}

function upsertActorsField(objectText: string, actors: string[] | undefined) {
  if (!actors) return objectText;
  const normalized = actors.filter((name) => name.trim().length > 0);
  const block = formatActors(normalized);
  const regex = /actors\s*:\s*\[[\s\S]*?\]/;
  if (regex.test(objectText)) {
    return objectText.replace(regex, block);
  }
  return objectText.replace(/\}\s*$/, `    ${block},\n  }`);
}

function upsertfromEntityField(
  objectText: string,
  value:
    | { entityType: string; title: string; secondEntityKey: string }
    | null
    | undefined
) {
  if (value === undefined) return objectText;
  const entityType =
    value !== null && FROM_ENTITY_TYPES.includes(value.entityType)
      ? value.entityType
      : 'book';
  const fromEntityBlock =
    value === null
      ? 'fromEntity: null'
      : `fromEntity: { entityType: "${entityType}", title: "${escapeString(
          value.title
        )}", secondEntityKey: "${escapeString(value.secondEntityKey)}" }`;
  const existingNull = /fromEntity\s*:\s*null/;
  const existingObj = /fromEntity\s*:\s*\{[\s\S]*?\}/;
  if (existingNull.test(objectText)) {
    return objectText.replace(existingNull, fromEntityBlock);
  }
  if (existingObj.test(objectText)) {
    return objectText.replace(existingObj, fromEntityBlock);
  }
  return objectText.replace(/\}\s*$/, `    ${fromEntityBlock},\n  }`);
}

function updateMovieInFile(content: string, payload: any) {
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
        const director = parseStringField(objectText, 'director');

        if (title === payload.title && director === payload.director) {
          let updated = objectText;
          updated = replaceField(updated, 'rating', payload.rating);
          updated = replaceField(updated, 'timesWatched', payload.timesWatched);
          updated = replaceField(
            updated,
            'firstViewedDate',
            payload.firstViewedDate
          );
          updated = replaceField(
            updated,
            'lastViewedDate',
            payload.lastViewedDate
          );
          updated = replaceField(updated, 'seenAtCinema', payload.seenAtCinema);
          updated = replaceField(updated, 'owned', payload.owned);
          updated = replaceField(
            updated,
            'wantToSeeAgain',
            payload.wantToSeeAgain
          );
          updated = replaceField(
            updated,
            'watchPriority',
            payload.watchPriority
          );
          // Ne mettre à jour ces champs que si le payload les fournit (évite d’effacer
          // prêt/emprunt, commentaires et listes lors d’updates partiels, ex. POST /movies/batch-rating).
          if (payload.ratingComment !== undefined) {
            updated = upsertField(
              updated,
              'ratingComment',
              payload.ratingComment ?? ''
            );
          }
          if (payload.inList !== undefined) {
            updated = upsertInListField(
              updated,
              Array.isArray(payload.inList) ? payload.inList : []
            );
          }
          if (payload.borrowed !== undefined) {
            updated = upsertField(updated, 'borrowed', payload.borrowed ?? '');
          }
          if (payload.loaned !== undefined) {
            updated = upsertField(updated, 'loaned', payload.loaned ?? '');
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

  throw new Error('Movie not found');
}

function updateMovieIdentityInFile(content: string, payload: any) {
  const matchTitle = payload.matchTitle ?? payload.title;
  const matchDirector = payload.matchDirector ?? payload.director;
  if (!matchTitle || !matchDirector) {
    throw new Error('Missing match title or director');
  }

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
        const director = parseStringField(objectText, 'director');

        if (title === matchTitle && director === matchDirector) {
          let updated = objectText;
          if (payload.title && payload.title !== title) {
            updated = replaceField(updated, 'title', payload.title);
          }
          if (payload.director && payload.director !== director) {
            updated = replaceField(updated, 'director', payload.director);
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

  throw new Error('Movie not found');
}

function updateBaseMovieInFile(content: string, payload: any) {
  const matchTitle = payload.matchTitle ?? payload.title;
  const matchDirector = payload.matchDirector ?? payload.director;
  if (!matchTitle || !matchDirector) {
    throw new Error('Missing match title or director');
  }
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
        const director = parseStringField(objectText, 'director');

        if (title === matchTitle && director === matchDirector) {
          let updated = objectText;
          if (payload.title && payload.title !== title) {
            updated = replaceField(updated, 'title', payload.title);
          }
          if (payload.director && payload.director !== director) {
            updated = replaceField(updated, 'director', payload.director);
          }
          updated = upsertActorsField(updated, payload.actors);
          updated = upsertField(updated, 'coverUrl', payload.coverUrl);
          updated = upsertField(updated, 'releaseDate', payload.releaseDate);
          updated = upsertField(updated, 'length', payload.length);
          updated = upsertField(updated, 'genre', payload.genre);
          updated = upsertField(updated, 'saga', payload.saga);
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
          updated = upsertfromEntityField(updated, payload.fromEntity);

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

  throw new Error('Movie not found');
}

function updateBaseMovieInFiles(payload: any) {
  const baseFiles = getBaseMoviesFiles();
  for (const movieFile of baseFiles) {
    const content = fs.readFileSync(movieFile, 'utf8');
    try {
      const updated = updateBaseMovieInFile(content, payload);
      fs.writeFileSync(movieFile, updated, 'utf8');
      return movieFile;
    } catch (error: any) {
      if (error.message !== 'Movie not found') {
        throw error;
      }
    }
  }
  return null;
}

/** Index du '[' qui ouvre le tableau littéral (après " = ["), pas celui du type UserMovie[]. */
function getArrayLiteralStartIndex(content: string, exportIndex: number) {
  const eqBracket = content.indexOf(' = [', exportIndex);
  if (eqBracket >= 0) {
    return eqBracket + ' = ['.length - 1;
  }
  return content.indexOf('[', exportIndex);
}

function removeMovieFromFile(content: string, payload: any) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }

  const arrayStart = getArrayLiteralStartIndex(content, exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    throw new Error('Array bounds not found');
  }

  const movies = parseMoviesFromFile(content);
  const filtered = movies.filter(
    (movie) =>
      movie.title !== payload.title || movie.director !== payload.director
  );

  if (filtered.length === movies.length) {
    throw new Error('Movie not found');
  }

  const newArrayContent = filtered
    .map((movie: any) => {
      const inList =
        Array.isArray(movie.inList) && movie.inList.length > 0
          ? '[' +
            movie.inList
              .map((s: any) => '"' + escapeString(s) + '"')
              .join(', ') +
            ']'
          : '[]';
      return `  {
    title: "${escapeString(movie.title)}",
    director: "${escapeString(movie.director)}",
    rating: ${movie.rating ?? 0},
    timesWatched: ${movie.timesWatched ?? 0},
    firstViewedDate: "${escapeString(movie.firstViewedDate || '')}",
    lastViewedDate: "${escapeString(movie.lastViewedDate || '')}",
    seenAtCinema: ${movie.seenAtCinema ?? false},
    owned: ${movie.owned ?? false},
    wantToSeeAgain: ${movie.wantToSeeAgain ?? false},
    watchPriority: ${movie.watchPriority ?? 1},
    ratingComment: "${escapeString(movie.ratingComment || '')}",
    borrowed: "${escapeString(movie.borrowed || '')}",
    loaned: "${escapeString(movie.loaned || '')}",
    inList: ${inList},
  }`;
    })
    .join(',\n');

  return (
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd)
  );
}

function getUserMoviesFiles(userId: string) {
  const userMoviesDir = path.join(USERS_MOVIES_DIR, userId, 'movies');
  if (!fs.existsSync(userMoviesDir)) {
    throw new Error(`User movies directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userMoviesDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('watchlist')
    )
    .map((file: string) => path.join(userMoviesDir, file));
}

function getUserWatchlistMoviesFiles(userId: string) {
  const userMoviesDir = path.join(USERS_MOVIES_DIR, userId, 'movies');
  if (!fs.existsSync(userMoviesDir)) {
    throw new Error(`User movies directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userMoviesDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        file.includes('watchlist')
    )
    .map((file: string) => path.join(userMoviesDir, file));
}

function getUserAllMoviesFiles(userId: string) {
  const userMoviesDir = path.join(USERS_MOVIES_DIR, userId, 'movies');
  if (!fs.existsSync(userMoviesDir)) {
    throw new Error(`User movies directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userMoviesDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(userMoviesDir, file));
}

module.exports = {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseMoviesFromFile,
  parseBaseMoviesFromFile,
  parseBaseMoviesFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  getBaseMoviesFiles,
  baseMovieExists,
  BASE_MOVIES_API_FILE,
  updateMovieInFile,
  updateMovieIdentityInFile,
  updateBaseMovieInFiles,
  removeMovieFromFile,
  getUserMoviesFiles,
  getUserWatchlistMoviesFiles,
  getUserAllMoviesFiles,
};

export {};
