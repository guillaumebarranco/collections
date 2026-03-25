const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  escapeString,
  appendObjectToArrayFile,
  baseGameExists,
  BASE_GAMES_API_FILE,
} = require('../../utils/games/games-utils');

const router = express.Router();

function formatBaseGame(entity: any): string {
  return `  {
    title: '${escapeString(entity.title)}',
    editor: '${escapeString(entity.editor)}',
    hero: '${escapeString(entity.hero || '')}',
    coverUrl: '${escapeString(entity.coverUrl || '')}',
    releaseDate: '${escapeString(entity.releaseDate || '')}',
    averageTimeToFinish: ${entity.averageTimeToFinish ?? 0},
    averageTimeToHundredPercent: ${entity.averageTimeToHundredPercent ?? 0},
    platform: '${escapeString(entity.platform || '')}',
    saga: '${escapeString(entity.saga || '')}',
    platineTime: ${entity.platineTime ?? 0},
    description: '${escapeString(entity.description ?? '')}',
  },`;
}

function formatUserGame(user: any): string {
  const sessions = Array.isArray(user.sessions) ? user.sessions : [];
  const sessionsStr =
    'sessions: [\n' +
    sessions
      .map(
        (s: any) =>
          `      { finishedGame: ${s.finishedGame ?? false}, finishedGameWithHundredPercent: ${s.finishedGameWithHundredPercent ?? false}, platinedGame: ${s.platinedGame ?? false}, additionnalEstimatedTime: ${s.additionnalEstimatedTime ?? 0} }`
      )
      .join(',\n') +
    '\n    ],';
  return `  {
    title: '${escapeString(user.title)}',
    editor: '${escapeString(user.editor)}',
    rating: ${user.rating ?? 0},
    owned: ${user.owned ?? false},
    gamelistPriority: ${user.gamelistPriority ?? 1},
    wantToPlayAgain: ${user.wantToPlayAgain ?? false},
    ratingComment: '${escapeString(user.ratingComment ?? '')}',
    borrowed: '${escapeString(user.borrowed ?? '')}',
    loaned: '${escapeString(user.loaned ?? '')}',
    ${sessionsStr}
  },`;
}

function getUserGamesTargetFile(userId: string) {
  const userDir = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'app',
    'utils',
    'users',
    userId,
    'games'
  );
  if (!fs.existsSync(userDir)) {
    throw new Error(`User games directory not found: ${userId}`);
  }

  const files = fs
    .readdirSync(userDir)
    .filter(
      (file: string) =>
        file.endsWith('.ts') &&
        file !== 'index.ts' &&
        !file.includes('readlist')
    );

  const preferred = files.find((file: string) =>
    file.includes(`${userId}_games`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User games file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const entity = input.entity || {};
    const user = input.user || {};

    const title = normalizeString(entity.title, 'title');
    const editor = normalizeString(entity.editor, 'editor');
    if (!title || !editor) {
      res.status(400).json({ error: 'Missing title or editor' });
      return;
    }

    if (baseGameExists(title, editor)) {
      res.status(409).json({ error: 'Game already exists in entities' });
      return;
    }

    const entityPayload = {
      title,
      editor,
      hero: normalizeString(entity.hero, 'hero') || '',
      coverUrl: normalizeString(entity.coverUrl, 'coverUrl') || '',
      releaseDate: normalizeString(entity.releaseDate, 'releaseDate') || '',
      averageTimeToFinish:
        normalizeNumber(entity.averageTimeToFinish, 'averageTimeToFinish') ?? 0,
      averageTimeToHundredPercent:
        normalizeNumber(entity.averageTimeToHundredPercent, 'averageTimeToHundredPercent') ?? 0,
      platform: normalizeString(entity.platform, 'platform') || '',
      saga: normalizeString(entity.saga, 'saga') || '',
      platineTime: normalizeNumber(entity.platineTime, 'platineTime') ?? 0,
      description: normalizeString(entity.description, 'description') ?? '',
    };

    const sessions = Array.isArray(user.sessions)
      ? user.sessions.map((s: any) => ({
          finishedGame: normalizeBoolean(s.finishedGame, 'finishedGame') ?? false,
          finishedGameWithHundredPercent:
            normalizeBoolean(s.finishedGameWithHundredPercent, 'finishedGameWithHundredPercent') ?? false,
          platinedGame: normalizeBoolean(s.platinedGame, 'platinedGame') ?? false,
          additionnalEstimatedTime:
            normalizeNumber(s.additionnalEstimatedTime, 'additionnalEstimatedTime') ?? 0,
        }))
      : [];
    const userPayload = {
      title,
      editor,
      rating: normalizeNumber(user.rating, 'rating') ?? 0,
      owned: normalizeBoolean(user.owned, 'owned') ?? false,
      gamelistPriority:
        normalizeNumber(user.gamelistPriority, 'gamelistPriority') ?? 1,
      wantToPlayAgain:
        normalizeBoolean(user.wantToPlayAgain, 'wantToPlayAgain') ?? false,
      ratingComment:
        normalizeString(user.ratingComment, 'ratingComment') ?? '',
      borrowed: normalizeString(user.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(user.loaned, 'loaned') ?? '',
      sessions,
    };

    const baseGameContent = appendObjectToArrayFile(
      BASE_GAMES_API_FILE,
      formatBaseGame(entityPayload)
    );
    fs.writeFileSync(BASE_GAMES_API_FILE, baseGameContent, 'utf8');

    const userGamesFile = getUserGamesTargetFile(userId);
    const userGameContent = appendObjectToArrayFile(
      userGamesFile,
      formatUserGame(userPayload)
    );
    fs.writeFileSync(userGamesFile, userGameContent, 'utf8');

    res.json({
      ok: true,
      entityFile: BASE_GAMES_API_FILE,
      userFile: userGamesFile,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
