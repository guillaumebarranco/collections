const fs = require('fs');
const path = require('path');

const USERS_GAMES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const BASE_GAMES_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'entities',
  'games'
);
const BASE_GAMES_API_FILE = path.join(BASE_GAMES_DIR, 'base_games_api.ts');

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

function parseSessionsField(objectText: string) {
  const sessionsIndex = objectText.indexOf('sessions:');
  if (sessionsIndex === -1) return undefined;
  const bracketStart = objectText.indexOf('[', sessionsIndex);
  if (bracketStart === -1) return undefined;
  let depth = 0;
  let i = bracketStart;
  const sessions = [];
  while (i < objectText.length) {
    const char = objectText[i];
    if (char === '[') {
      depth += 1;
      i += 1;
      continue;
    }
    if (char === ']') {
      depth -= 1;
      if (depth === 0) break;
      i += 1;
      continue;
    }
    if (depth === 1 && char === '{') {
      const objStart = i;
      let objDepth = 0;
      let j = i;
      while (j < objectText.length) {
        const c = objectText[j];
        if (c === '{') objDepth += 1;
        else if (c === '}') {
          objDepth -= 1;
          if (objDepth === 0) {
            const objText = objectText.slice(objStart, j + 1);
            sessions.push({
              finishedGame: parseBooleanField(objText, 'finishedGame') ?? false,
              finishedGameWithHundredPercent:
                parseBooleanField(objText, 'finishedGameWithHundredPercent') ??
                false,
              platinedGame:
                parseBooleanField(objText, 'platinedGame') ?? false,
              additionnalEstimatedTime:
                parseNumberField(objText, 'additionnalEstimatedTime') ?? 0,
            });
            i = j + 1;
            break;
          }
        }
        j += 1;
      }
      continue;
    }
    i += 1;
  }
  return sessions;
}

function formatSession(session: any) {
  return `{
      finishedGame: ${session.finishedGame ?? false},
      finishedGameWithHundredPercent: ${session.finishedGameWithHundredPercent ?? false},
      platinedGame: ${session.platinedGame ?? false},
      additionnalEstimatedTime: ${session.additionnalEstimatedTime ?? 0},
    }`;
}

function formatSessions(sessions: any[]) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 'sessions: [],';
  return 'sessions: [\n' + sessions.map(formatSession).join(',\n') + '\n    ],';
}

function formatGameObject(game: any) {
  const sessions = Array.isArray(game.sessions) ? game.sessions : [];
  const sessionsPart = formatSessions(sessions);
  return `  {
    title: '${escapeString(game.title)}',
    editor: '${escapeString(game.editor)}',
    rating: ${game.rating ?? 0},
    owned: ${game.owned ?? false},
    gamelistPriority: ${game.gamelistPriority ?? 1},
    wantToPlayAgain: ${game.wantToPlayAgain ?? false},
    ${sessionsPart}
  }`;
}

function parseGamesFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const games: any[] = [];
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
        const editor = parseStringField(objectText, 'editor');
        if (title && editor) {
          const sessions = parseSessionsField(objectText);
          games.push({
            title,
            editor,
            rating: parseNumberField(objectText, 'rating') ?? 0,
            owned: parseBooleanField(objectText, 'owned') ?? false,
            gamelistPriority:
              parseNumberField(objectText, 'gamelistPriority') ?? 1,
            wantToPlayAgain:
              parseBooleanField(objectText, 'wantToPlayAgain') ?? false,
            sessions: Array.isArray(sessions) ? sessions : [],
          });
        }
      }
    }
    i += 1;
  }

  return games;
}

function parseBaseGamesFullFromFile(content: string): any[] {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    return [];
  }

  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    return [];
  }
  const { arrayStart, arrayEnd } = bounds;

  const games: any[] = [];
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
        const editor = parseStringField(objectText, 'editor');
        if (!title || !editor) {
          i += 1;
          continue;
        }

        games.push({
          title,
          editor,
          hero: parseStringField(objectText, 'hero') || '',
          coverUrl: parseStringField(objectText, 'coverUrl') || '',
          releaseDate: parseStringField(objectText, 'releaseDate') || '',
          averageTimeToFinish:
            parseNumberField(objectText, 'averageTimeToFinish') ?? 0,
          platform: parseStringField(objectText, 'platform') || '',
          saga: parseStringField(objectText, 'saga') || '',
          platineTime: parseNumberField(objectText, 'platineTime') ?? 0,
        });
      }
    }
    i += 1;
  }

  return games;
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

function getBaseGamesFiles(): string[] {
  if (!fs.existsSync(BASE_GAMES_DIR)) return [];
  return fs
    .readdirSync(BASE_GAMES_DIR)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(BASE_GAMES_DIR, file));
}

function baseGameExists(title: string, editor: string): boolean {
  const files = getBaseGamesFiles();
  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf8');
    const games = parseBaseGamesFullFromFile(content);
    if (games.some((g: any) => g.title === title && g.editor === editor)) {
      return true;
    }
  }
  return false;
}

function updateGameInFile(filePath: string, gameData: any): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const games = parseGamesFromFile(content);
  const index = games.findIndex(
    (game) => game.title === gameData.title && game.editor === gameData.editor
  );

  if (index === -1) {
    return false;
  }

  games[index] = {
    ...games[index],
    ...gameData,
  };

  const newArrayContent = games.map((game) => formatGameObject(game)).join(',\n');

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

function updateGameIdentityInFile(filePath: string, gameData: any): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const games = parseGamesFromFile(content);
  const matchTitle = gameData.matchTitle ?? gameData.title;
  const matchEditor = gameData.matchEditor ?? gameData.editor;
  const index = games.findIndex(
    (game) => game.title === matchTitle && game.editor === matchEditor
  );

  if (index === -1) {
    return false;
  }

  games[index] = {
    ...games[index],
    title: gameData.title ?? games[index].title,
    editor: gameData.editor ?? games[index].editor,
  };

  const newArrayContent = games.map((game) => formatGameObject(game)).join(',\n');

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

function updateBaseGameInFile(filePath: string, gameData: any): boolean {
  const content = fs.readFileSync(filePath, 'utf8');
  const games = parseBaseGamesFullFromFile(content);
  const matchTitle = gameData.matchTitle ?? gameData.title;
  const matchEditor = gameData.matchEditor ?? gameData.editor;
  const index = games.findIndex(
    (game) => game.title === matchTitle && game.editor === matchEditor
  );

  if (index === -1) {
    return false;
  }

  const existing = games[index];
  const merged = { ...existing };
  for (const key of Object.keys(gameData)) {
    if (key === 'matchTitle' || key === 'matchEditor') continue;
    const value = gameData[key];
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  merged.title = gameData.title ?? existing.title;
  merged.editor = gameData.editor ?? existing.editor;
  games[index] = merged;

  const newArrayContent = games
    .map(
      (game) => `  {
    title: '${escapeString(game.title)}',
    editor: '${escapeString(game.editor)}',
    hero: '${escapeString(game.hero || '')}',
    coverUrl: '${escapeString(game.coverUrl || '')}',
    releaseDate: '${escapeString(game.releaseDate || '')}',
    averageTimeToFinish: ${game.averageTimeToFinish ?? 0},
    averageTimeToHundredPercent: ${game.averageTimeToHundredPercent ?? 0},
    platform: '${escapeString(game.platform || '')}',
    saga: '${escapeString(game.saga || '')}',
    platineTime: ${game.platineTime ?? 0},
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

function updateBaseGameInFiles(payload: any) {
  const baseFiles = getBaseGamesFiles();
  for (const filePath of baseFiles) {
    if (updateBaseGameInFile(filePath, payload)) {
      return filePath;
    }
  }
  return null;
}

function removeGameFromFile(content: string, payload: any): string {
  const exportIndex = content.indexOf('export const');
  if (exportIndex === -1) {
    throw new Error('Array not found');
  }
  const bounds = getArrayBounds(content, exportIndex);
  if (!bounds) {
    throw new Error('Array bounds not found');
  }
  const { arrayStart, arrayEnd } = bounds;

  const games = parseGamesFromFile(content);
  const filtered = games.filter(
    (game) => game.title !== payload.title || game.editor !== payload.editor
  );

  if (filtered.length === games.length) {
    throw new Error('Game not found');
  }

  const newArrayContent = filtered
    .map((game) => formatGameObject(game))
    .join(',\n');

  return (
    content.slice(0, arrayStart + 1) +
    '\n' +
    newArrayContent +
    '\n' +
    content.slice(arrayEnd)
  );
}

function getUserGamesFiles(userId: string): string[] {
  const userDir = path.join(USERS_GAMES_DIR, userId, 'games');
  if (!fs.existsSync(userDir)) return [];

  return fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('gamelist')
    )
    .map((file: string) => path.join(userDir, file));
}

function getUserGamelistFiles(userId: string): string[] {
  const userDir = path.join(USERS_GAMES_DIR, userId, 'games');
  if (!fs.existsSync(userDir)) return [];

  return fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') && file !== 'index.ts' && file.includes('gamelist')
    )
    .map((file: string) => path.join(userDir, file));
}

function getUserAllGamesFiles(userId: string): string[] {
  const userDir = path.join(USERS_GAMES_DIR, userId, 'games');
  if (!fs.existsSync(userDir)) return [];

  return fs
    .readdirSync(userDir)
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .map((file: string) => path.join(userDir, file));
}

module.exports = {
  BASE_GAMES_API_FILE,
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  parseGamesFromFile,
  parseBaseGamesFullFromFile,
  escapeString,
  appendObjectToArrayFile,
  baseGameExists,
  updateGameInFile,
  updateGameIdentityInFile,
  updateBaseGameInFiles,
  removeGameFromFile,
  getUserGamesFiles,
  getUserGamelistFiles,
  getUserAllGamesFiles,
};

export {};
