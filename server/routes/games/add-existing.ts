const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  appendObjectToArrayFile,
  escapeString,
  parseGamesFromFile,
  getUserGamesFiles,
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
  execFileSync('node', [createUserScript, userId], { stdio: 'ignore' });
}

function formatUserGame(game: any): string {
  return `  {
    title: '${escapeString(game.title)}',
    editor: '${escapeString(game.editor)}',
    rating: 0,
    timesFinished: 1,
    additionnalEstimatedTime: 0,
    platined: false,
  },`;
}

function getUserGamesTargetFile(userId: string): string {
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
    .filter((file: string) => !file.includes('gamelist'));

  const preferred = files.find((file: string) =>
    file.includes(`${userId}_games`)
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

    const files = getUserGamesFiles(userId);
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

    const filePath = getUserGamesTargetFile(userId);
    let updatedContent = fs.readFileSync(filePath, 'utf8');
    for (const game of toAdd) {
      updatedContent = appendObjectToArrayFile(filePath, formatUserGame(game));
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }

    res.json({ ok: true, added: toAdd.length, file: filePath });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
