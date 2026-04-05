const fs = require('fs');
const path = require('path');
const { escapeStringForTsDoubleQuote: escapeString } = require('../escape-ts-string');

const USERS_SERIES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_SERIES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'series'
);
const BASE_SERIES_API_FILE = path.join(BASE_SERIES_DIR, 'base_series_api.ts');

import type {
  BaseSerie,
  BaseSerieSeasonData,
  MandatorySerieData,
  UserSerie,
  UserSerieFileRow,
  UserSerieSeason,
} from '../../../src/app/models/serie-model';

type SerieUpdatePayload = Partial<UserSerieFileRow> &
  Pick<UserSerie, 'title' | 'director'>;
type SerieIdentityPayload = {
  matchTitle?: string;
  matchDirector?: string;
} & Partial<Pick<UserSerie, 'title' | 'director'>>;
type BaseSerieFileUpdatePayload = Partial<BaseSerie> & {
  matchTitle?: string;
  matchDirector?: string;
};
type SerieRemovePayload = Pick<MandatorySerieData, 'title' | 'director'>;

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
  const regex = new RegExp(
    `["']?${key}["']?\\s*:\\s*(['"])((?:\\\\.|(?!\\1).)*)\\1`
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

function escapeForSingleQuotedTs(s: string) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatSerieGenreArrayTs(arr: string[]) {
  const trimmed = arr.map((s) => String(s).trim()).filter(Boolean);
  if (trimmed.length === 0) {
    return '[]';
  }
  return (
    '[' + trimmed.map((s) => `'${escapeForSingleQuotedTs(s)}'`).join(', ') + ']'
  );
}

function normalizeSerieGenreInput(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    if (!value.trim()) {
      return [];
    }
    return value
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
}

const FROM_ENTITY_TYPES = [
  'book',
  'bd',
  'game',
  'comic',
  'manga',
  'manwha',
  'serie',
];

function parseFromEntityField(objectText: string) {
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

function upsertFromEntityField(
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
      : `fromEntity: { entityType: "${escapeString(
          entityType
        )}", title: "${escapeString(value.title)}", secondEntityKey: "${escapeString(
          value.secondEntityKey
        )}" }`;
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

/** Lit genre: [...] ou ancien genre: 'A, B' dans un littéral d'objet série. */
function parseSerieGenresField(objectText: string): string[] {
  const keyMatch = objectText.match(/\bgenre\s*:\s*/);
  if (!keyMatch || keyMatch.index === undefined) {
    return [];
  }
  let pos = keyMatch.index + keyMatch[0].length;
  while (pos < objectText.length && /\s/.test(objectText[pos])) {
    pos += 1;
  }
  if (pos >= objectText.length) {
    return [];
  }
  if (objectText[pos] === '[') {
    let depth = 0;
    let i = pos;
    while (i < objectText.length) {
      const c = objectText[i];
      if (c === '[') {
        depth += 1;
      } else if (c === ']') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          break;
        }
      }
      i += 1;
    }
    const inner = objectText.slice(pos + 1, i - 1);
    if (!inner.trim()) {
      return [];
    }
    const regex = /(['"])((?:\\.|(?!\1).)*)\1/g;
    const result: string[] = [];
    let match = regex.exec(inner);
    while (match) {
      result.push(unescapeString(match[2], match[1]));
      match = regex.exec(inner);
    }
    return result;
  }
  const legacy = parseStringField(objectText, 'genre');
  if (!legacy?.trim()) {
    return [];
  }
  return legacy
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);
}

function upsertSerieGenreField(objectText: string, value: unknown) {
  if (value === undefined) {
    return objectText;
  }
  const arr = normalizeSerieGenreInput(value);
  const serialized = formatSerieGenreArrayTs(arr);
  const regex = /\bgenre\s*:\s*(\[[\s\S]*?\]|(['"])((?:\\.|(?!\2).)*)\2)/;
  if (regex.test(objectText)) {
    return objectText.replace(regex, `genre: ${serialized}`);
  }
  return objectText.replace(/\}\s*$/, `    genre: ${serialized},\n  }`);
}

function parseNumberField(objectText: string, key: string) {
  const regex = new RegExp(`["']?${key}["']?\\s*:\\s*([^,\\n]+)`);
  const match = objectText.match(regex);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseSeasonsField(objectText: string) {
  const seasonsMatch = objectText.match(
    /["']?seasons["']?\s*:\s*\[([\s\S]*?)\]/
  );
  if (!seasonsMatch) return null;
  const body = seasonsMatch[1];
  const seasons: UserSerieSeason[] = [];
  const entries = body.match(/\{[\s\S]*?\}/g) || [];
  for (const entry of entries) {
    const seasonNumber = parseNumberField(entry, 'seasonNumber') ?? 0;
    const seasonRating = parseNumberField(entry, 'seasonRating') ?? 0;
    const seasonTimesWatched =
      parseNumberField(entry, 'seasonTimesWatched') ?? 0;
    const lastViewedDate = parseStringField(entry, 'lastViewedDate') ?? '';
    seasons.push({
      seasonNumber,
      seasonRating,
      seasonTimesWatched,
      lastViewedDate,
    });
  }
  return seasons;
}

function parseBooleanField(objectText: string, key: string) {
  const regex = new RegExp(`["']?${key}["']?\\s*:\\s*(true|false)`);
  const match = objectText.match(regex);
  if (!match) return null;
  return match[1] === 'true';
}

function parseActors(objectText: string): string[] {
  const regex = /["']?name["']?\s*:\s*(['"])((?:\\.|(?!\1).)*)\1/g;
  const actors: string[] = [];
  let match = regex.exec(objectText);
  while (match) {
    const quote = match[1];
    actors.push(unescapeString(match[2], quote));
    match = regex.exec(objectText);
  }
  return actors;
}

function parseSeasonsDataField(objectText: string) {
  const seasonsDataMatch = objectText.match(
    /["']?seasonsData["']?\s*:\s*\[([\s\S]*?)\]/
  );
  if (!seasonsDataMatch) return null;
  const body = seasonsDataMatch[1];
  const seasonsData: BaseSerieSeasonData[] = [];
  const entries = body.match(/\{[\s\S]*?\}/g) || [];
  for (const entry of entries) {
    const seasonNumber = parseNumberField(entry, 'seasonNumber') ?? 0;
    const nbEpisodes = parseNumberField(entry, 'nbEpisodes') ?? 0;
    const totalLength = parseNumberField(entry, 'totalLength') ?? 0;
    seasonsData.push({ seasonNumber, nbEpisodes, totalLength });
  }
  return seasonsData;
}

/** Index du '[' qui ouvre le tableau littéral (après " = ["), pas celui du type UserSerie[]. */
function getArrayLiteralStartIndex(content: string, startIndex: number) {
  const eqBracket = content.indexOf(' = [', startIndex);
  if (eqBracket >= 0) {
    return eqBracket + ' = ['.length - 1;
  }
  return content.indexOf('[', startIndex);
}

function getArrayBoundsFromIndex(content: string, startIndex: number) {
  const arrayStart = getArrayLiteralStartIndex(content, startIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return null;
  }
  return { arrayStart, arrayEnd };
}

function findSeriesArrayBounds(content: string) {
  const exportIndex = content.indexOf('export const');
  if (exportIndex !== -1) {
    const bounds = getArrayBoundsFromIndex(content, exportIndex);
    if (bounds) return bounds;
  }

  const rawMatch = content.match(/const\s+raw\w*\s*=\s*\[/);
  if (rawMatch && rawMatch.index !== undefined) {
    const bounds = getArrayBoundsFromIndex(content, rawMatch.index);
    if (bounds) return bounds;
  }

  return null;
}

function parseSeriesFromFile(content: string): UserSerieFileRow[] {
  const bounds = findSeriesArrayBounds(content);
  if (!bounds) {
    return [];
  }

  const { arrayStart, arrayEnd } = bounds;

  const series: UserSerieFileRow[] = [];
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
          series.push({
            title,
            director,
            seasons: parseSeasonsField(objectText) ?? [],
            owned: parseBooleanField(objectText, 'owned') ?? false,
            watchPriority: (parseNumberField(objectText, 'watchPriority') ??
              1) as UserSerie['watchPriority'],
            wantToWatchAgain:
              parseBooleanField(objectText, 'wantToWatchAgain') ?? false,
            rating: parseNumberField(objectText, 'rating') ?? 0,
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
          });
        }
      }
    }
    i += 1;
  }

  return series;
}

function parseBaseSeriesFromFile(content: string): MandatorySerieData[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const series: MandatorySerieData[] = [];
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
          series.push({ title, director });
        }
      }
    }
    i += 1;
  }

  return series;
}

function parseBaseSeriesFullFromFile(content: string): BaseSerie[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const arrayStart = content.indexOf('[', exportIndex);
  const arrayEnd = content.indexOf('];', arrayStart);
  if (arrayStart === -1 || arrayEnd === -1) {
    return [];
  }

  const series: BaseSerie[] = [];
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
        if (!title || !director) {
          i += 1;
          continue;
        }

        series.push({
          title,
          director,
          actors: parseActors(objectText).map((name) => ({ name })),
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          endDate: parseStringField(objectText, 'endDate') || '',
          genre: parseSerieGenresField(objectText),
          seasonsData: parseSeasonsDataField(objectText) ?? [],
          description: parseStringField(objectText, 'description') || '',
          countryOrigin: parseStringField(objectText, 'countryOrigin') as BaseSerie['countryOrigin'],
          saga: parseStringField(objectText, 'saga') || '',
          fromEntity: parseFromEntityField(objectText) ?? null,
        } as BaseSerie);
      }
    }
    i += 1;
  }

  return series;
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

function getBaseSeriesFiles() {
  if (!fs.existsSync(BASE_SERIES_DIR)) {
    throw new Error('Base series directory not found');
  }
  return fs
    .readdirSync(BASE_SERIES_DIR)
    .filter((file: string) => file.endsWith('.ts'))
    .map((file: string) => path.join(BASE_SERIES_DIR, file));
}

function baseSerieExists(title: string, director: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedDirector = director.trim().toLowerCase();
  const baseFiles = getBaseSeriesFiles();
  return baseFiles.some((filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf8');
    return parseBaseSeriesFromFile(content).some(
      (serie) =>
        serie.title?.trim().toLowerCase() === normalizedTitle &&
        serie.director?.trim().toLowerCase() === normalizedDirector
    );
  });
}

function findBaseSerie(title: string, director: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedDirector = director.trim().toLowerCase();
  const baseFiles = getBaseSeriesFiles();
  for (const filePath of baseFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = parseBaseSeriesFullFromFile(content).find(
      (serie) =>
        serie.title?.trim().toLowerCase() === normalizedTitle &&
        serie.director?.trim().toLowerCase() === normalizedDirector
    );
    if (match) return match;
  }
  return null;
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
  value: string | number | boolean | undefined
) {
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

function formatSeasonsData(seasons: BaseSerieSeasonData[]) {
  const lines = seasons.map((season) => {
    const seasonNumber = Number(season?.seasonNumber ?? 0);
    const nbEpisodes = Number(season?.nbEpisodes ?? 0);
    const totalLength = Number(season?.totalLength ?? 0);
    return `      {\n        seasonNumber: ${
      Number.isNaN(seasonNumber) ? 0 : seasonNumber
    },\n        nbEpisodes: ${
      Number.isNaN(nbEpisodes) ? 0 : nbEpisodes
    },\n        totalLength: ${
      Number.isNaN(totalLength) ? 0 : totalLength
    },\n      }`;
  });
  return `seasonsData: [\n${lines.join(',\n')}\n    ]`;
}

function upsertSeasonsDataField(
  objectText: string,
  seasonsData: BaseSerieSeasonData[] | undefined
) {
  if (!Array.isArray(seasonsData)) return objectText;
  const block = formatSeasonsData(seasonsData);
  const regex = /seasonsData\s*:\s*\[[\s\S]*?\]/;
  if (regex.test(objectText)) {
    return objectText.replace(regex, block);
  }
  return objectText.replace(/\}\s*$/, `    ${block},\n  }`);
}

function formatSeasons(seasons: UserSerieSeason[]) {
  const lines = seasons.map((season) => {
    const seasonNumber = Number(season?.seasonNumber ?? 0);
    const seasonRating = Number(season?.seasonRating ?? 0);
    const seasonTimesWatched = Number(season?.seasonTimesWatched ?? 0);
    const lastViewedDate = `${season?.lastViewedDate ?? ''}`;
    return `    {
      seasonNumber: ${Number.isNaN(seasonNumber) ? 0 : seasonNumber},
      seasonRating: ${Number.isNaN(seasonRating) ? 0 : seasonRating},
      seasonTimesWatched: ${
        Number.isNaN(seasonTimesWatched) ? 0 : seasonTimesWatched
      },
      lastViewedDate: "${escapeString(lastViewedDate)}",
    }`;
  });
  return `seasons: [\n${lines.join(',\n')}\n  ]`;
}

function replaceSeasonsField(objectText: string, seasons: UserSerieSeason[]) {
  if (!Array.isArray(seasons)) return objectText;
  // Capture seasons: [...] suivi d'une virgule optionnelle
  const regex = /seasons\s*:\s*\[[\s\S]*?\]\s*,?/;
  const replacement = `${formatSeasons(seasons)},`;
  if (regex.test(objectText)) {
    return objectText.replace(regex, replacement);
  }
  return objectText.replace(/\{\s*/, (match) => `${match}${replacement}\n  `);
}

function updateSerieInFile(content: string, payload: SerieUpdatePayload) {
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
          if (payload.seasons) {
            updated = replaceSeasonsField(updated, payload.seasons);
          }
          updated = replaceField(updated, 'owned', payload.owned);
          updated = replaceField(
            updated,
            'watchPriority',
            payload.watchPriority
          );
          updated = replaceField(
            updated,
            'wantToWatchAgain',
            payload.wantToWatchAgain
          );
          updated = upsertField(updated, 'ratingComment', payload.ratingComment ?? '');
          updated = upsertField(
            updated,
            'borrowed',
            payload.borrowed ?? ''
          );
          updated = upsertField(updated, 'loaned', payload.loaned ?? '');

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

  throw new Error('Serie not found');
}

function updateSerieIdentityInFile(content: string, payload: SerieIdentityPayload) {
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

  throw new Error('Serie not found');
}

function updateBaseSerieInFile(content: string, payload: BaseSerieFileUpdatePayload) {
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
          updated = upsertActorsField(
            updated,
            payload.actors === undefined
              ? undefined
              : payload.actors.map((a) =>
                  typeof a === 'string' ? a : a.name
                )
          );
          updated = upsertField(updated, 'coverUrl', payload.coverUrl);
          updated = upsertField(updated, 'releaseDate', payload.releaseDate);
          updated = upsertField(updated, 'endDate', payload.endDate);
          updated = upsertSerieGenreField(updated, payload.genre);
          updated = upsertSeasonsDataField(updated, payload.seasonsData);
          updated = upsertField(updated, 'description', payload.description ?? '');
          updated = upsertField(updated, 'countryOrigin', payload.countryOrigin ?? '');
          updated = upsertField(updated, 'saga', payload.saga ?? '');
          if (Object.prototype.hasOwnProperty.call(payload, 'fromEntity')) {
            updated = upsertFromEntityField(updated, payload.fromEntity);
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

  throw new Error('Serie not found');
}

function updateBaseSerieInFiles(payload: BaseSerieFileUpdatePayload) {
  const baseFiles = getBaseSeriesFiles();
  for (const serieFile of baseFiles) {
    const content = fs.readFileSync(serieFile, 'utf8');
    try {
      const updated = updateBaseSerieInFile(content, payload);
      fs.writeFileSync(serieFile, updated, 'utf8');
      return serieFile;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message !== 'Serie not found') {
        throw error;
      }
    }
  }
  return null;
}

function formatSeasonsIndented(seasons: UserSerieSeason[], indent: string) {
  return formatSeasons(seasons)
    .split('\n')
    .map((line) => `${indent}${line}`)
    .join('\n');
}

function removeSerieFromFile(content: string, payload: SerieRemovePayload) {
  const bounds = findSeriesArrayBounds(content);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const series = parseSeriesFromFile(content);
  const filtered = series.filter(
    (serie) =>
      serie.title !== payload.title || serie.director !== payload.director
  );

  if (filtered.length === series.length) {
    throw new Error('Serie not found');
  }

  const newArrayContent = filtered
    .map((serie) => {
      const seasonsText = `${formatSeasonsIndented(
        serie.seasons ?? [],
        '    '
      )},`;
      return `  {
    title: "${escapeString(serie.title)}",
    director: "${escapeString(serie.director)}",
${seasonsText}
    owned: ${serie.owned ?? false},
    watchPriority: ${serie.watchPriority ?? 1},
    wantToWatchAgain: ${serie.wantToWatchAgain ?? false},
    ratingComment: "${escapeString(serie.ratingComment || '')}",
    borrowed: "${escapeString(serie.borrowed || '')}",
    loaned: "${escapeString(serie.loaned || '')}",
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

function getUserSeriesFiles(userId: string) {
  const userSeriesDir = path.join(USERS_SERIES_DIR, userId, 'series');
  if (!fs.existsSync(userSeriesDir)) {
    throw new Error(`User series directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userSeriesDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('watchlist')
    )
    .map((file: string) => path.join(userSeriesDir, file));
}

function getUserWatchlistSeriesFiles(userId: string) {
  const userSeriesDir = path.join(USERS_SERIES_DIR, userId, 'series');
  if (!fs.existsSync(userSeriesDir)) {
    throw new Error(`User series directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userSeriesDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        file.includes('watchlist')
    )
    .map((file: string) => path.join(userSeriesDir, file));
}

function getUserAllSeriesFiles(userId: string) {
  const userSeriesDir = path.join(USERS_SERIES_DIR, userId, 'series');
  if (!fs.existsSync(userSeriesDir)) {
    throw new Error(`User series directory not found: ${userId}`);
  }

  return fs
    .readdirSync(userSeriesDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(userSeriesDir, file));
}

module.exports = {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeSerieGenreInput,
  formatSerieGenreArrayTs,
  parseSeriesFromFile,
  parseBaseSeriesFromFile,
  parseBaseSeriesFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  getBaseSeriesFiles,
  baseSerieExists,
  findBaseSerie,
  BASE_SERIES_API_FILE,
  updateSerieInFile,
  updateSerieIdentityInFile,
  updateBaseSerieInFiles,
  removeSerieFromFile,
  getUserSeriesFiles,
  getUserWatchlistSeriesFiles,
  getUserAllSeriesFiles,
};

export {};
