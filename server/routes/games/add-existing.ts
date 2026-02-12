const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  escapeString,
  parseGamesFromFile,
  getUserAllGamesFiles,
} = require('../../utils/games/games-utils');

const router = express.Router();

const usersRootDir = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);
const createUserScript = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'scripts',
  'create-user-files.js'
);

function ensureUserExists(userId: string) {
  const userDir = path.join(usersRootDir, userId);
  if (fs.existsSync(userDir)) {
    return;
  }
  console.log('creation user', userId);
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function formatUserGame(game: any): string {
  return `  {
    title: '${escapeString(game.title)}',
    editor: '${escapeString(game.editor)}',
    rating: 0,
    owned: false,
    gamelistPriority: ${game.gamelistPriority ?? 1},
    wantToPlayAgain: false,
    ratingComment: '',
    sessions: [],
  },`;
}

function formatGamelistGame(game: any): string {
  return `  {
    title: '${escapeString(game.title)}',
    editor: '${escapeString(game.editor)}',
    rating: 0,
    owned: false,
    gamelistPriority: ${game.gamelistPriority ?? 1},
    wantToPlayAgain: false,
    ratingComment: '',
    sessions: [],
  },`;
}

function getUserGamesTargetFile(userId: string, isGamelist: boolean): string {
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
    .filter((file: string) => file.endsWith('.ts') && file !== 'index.ts')
    .filter((file: string) =>
      isGamelist ? file.includes('gamelist') : !file.includes('gamelist')
    );

  const preferred = files.find((file: string) =>
    isGamelist
      ? file.includes(`${userId}_gamelist_games`)
      : file.includes(`${userId}_games`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) {
    throw new Error(`User games file not found: ${userId}`);
  }

  return path.join(userDir, selected);
}

router.post('/add-existing', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    const games = Array.isArray(input.games) ? input.games : [];

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    ensureUserExists(userId);

    const isGamelist = normalizeBoolean(input.gamelist, 'gamelist') ?? false;
    const normalizedGames = games
      .map((game: any) => ({
        title: normalizeString(game.title, 'title'),
        editor: normalizeString(game.editor, 'editor'),
      }))
      .filter((game: any) => game.title && game.editor);

    if (normalizedGames.length === 0) {
      res.status(400).json({ error: 'Missing games' });
      return;
    }

    const files = getUserAllGamesFiles(userId);
    if (!files.length) {
      res.status(404).json({ error: 'User games not found' });
      return;
    }

    const existing = files.flatMap((gameFile: string) => {
      const fileContent = fs.readFileSync(gameFile, 'utf8');
      return parseGamesFromFile(fileContent).map((game: any) => ({
        title: game.title,
        editor: game.editor,
      }));
    });

    const existingSet = new Set(
      existing.map((game: any) => `${game.title}|${game.editor}`)
    );

    const toAdd = normalizedGames.filter(
      (game: any) => !existingSet.has(`${game.title}|${game.editor}`)
    );

    if (!toAdd.length) {
      res.status(409).json({ error: 'Games already exist for user' });
      return;
    }

    const filePath = getUserGamesTargetFile(userId, isGamelist);
    let updatedContent = fs.readFileSync(filePath, 'utf8');
    const formatGame = isGamelist ? formatGamelistGame : formatUserGame;
    for (const game of toAdd) {
      updatedContent = appendObjectToArrayFile(filePath, formatGame(game));
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }

    res.json({ ok: true, added: toAdd.length, file: filePath });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
