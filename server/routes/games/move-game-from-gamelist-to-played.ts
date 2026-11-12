const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const {
  normalizeString,
  normalizeBoolean,
  appendObjectToArrayFile,
  parseGamesFromFile,
  formatGameObject,
  getUserGamesFiles,
  removeGameFromFile,
  getUserGamelistFiles,
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
  if (fs.existsSync(userDir)) return;
  const shouldBuild =
    process.env['MAKYA_BUILD'] === 'true' ||
    process.env['NODE_ENV'] === 'production';
  const args = shouldBuild
    ? [createUserScript, userId, '--build']
    : [createUserScript, userId];
  execFileSync('node', args, { stdio: 'ignore' });
}

function findGamelistGame(userId: string, title: string, editor: string) {
  const gamelistFiles = getUserGamelistFiles(userId);
  for (const file of gamelistFiles) {
    const games = parseGamesFromFile(fs.readFileSync(file, 'utf8'));
    const found = games.find((game: any) => game.title === title && game.editor === editor);
    if (found) return found;
  }
  return null;
}

function buildPlayedGame(
  stored: any,
  incoming: any,
  options?: { rating?: number; ratingComment?: string }
) {
  const incomingSessions = Array.isArray(incoming?.sessions) ? incoming.sessions : [];
  const storedSessions = Array.isArray(stored?.sessions) ? stored.sessions : [];
  const sessions = incomingSessions.length > 0 ? incomingSessions : storedSessions;
  const rating = options?.rating != null && !Number.isNaN(options.rating)
    ? options.rating
    : Number(stored?.rating ?? incoming?.rating ?? 0);
  const ratingComment = typeof options?.ratingComment === 'string'
    ? options.ratingComment
    : String(stored?.ratingComment ?? incoming?.ratingComment ?? '');

  return {
    title: stored?.title || incoming?.title,
    editor: stored?.editor || incoming?.editor,
    rating: Number.isNaN(rating) ? 0 : rating,
    owned: stored?.owned ?? incoming?.owned ?? false,
    gamelistPriority: stored?.gamelistPriority ?? incoming?.gamelistPriority ?? 1,
    wantToPlayAgain: stored?.wantToPlayAgain ?? incoming?.wantToPlayAgain ?? false,
    ratingComment,
    borrowed: stored?.borrowed ?? incoming?.borrowed ?? '',
    loaned: stored?.loaned ?? incoming?.loaned ?? '',
    sessions,
  };
}

function getUserGamesTargetFile(userId: string, isGamelist: boolean) {
  const userDir = path.join(usersRootDir, userId, 'games');
  if (!fs.existsSync(userDir)) {
    throw new Error(`User games directory not found: ${userId}`);
  }
  const files = fs
    .readdirSync(userDir)
    .filter((f: string) => f.endsWith('.ts') && f !== 'index.ts')
    .filter((f: string) =>
      isGamelist ? f.includes('gamelist') : !f.includes('gamelist')
    );
  const preferred = files.find((f: string) =>
    isGamelist
      ? f.includes(`${userId}_gamelist_games`)
      : f.includes(`${userId}_games`)
  );
  const selected = preferred || files.sort()[0];
  if (!selected) throw new Error(`User games file not found: ${userId}`);
  return path.join(userDir, selected);
}

router.post('/move-game-from-gamelist-to-played', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }
    ensureUserExists(userId);

    const games = Array.isArray(input.games) ? input.games : [];
    const rating = input.rating != null ? Number(input.rating) : undefined;
    const ratingComment = typeof input.ratingComment === 'string' ? input.ratingComment : undefined;
    const normalized = games
      .map((g: any) => ({
        title: normalizeString(g.title, 'title'),
        editor: normalizeString(g.editor, 'editor'),
        incoming: g,
      }))
      .filter((g: any) => g.title && g.editor);

    if (normalized.length === 0) {
      res.status(400).json({ error: 'Missing games' });
      return;
    }

    const userFiles = getUserGamesFiles(userId);
    const existing = userFiles.flatMap((file: string) => {
      const content = fs.readFileSync(file, 'utf8');
      return parseGamesFromFile(content).map((g: any) => ({ title: g.title, editor: g.editor }));
    });
    const existingSet = new Set(existing.map((g: any) => `${g.title}|${g.editor}`));
    const toAdd = normalized.filter((g: any) => !existingSet.has(`${g.title}|${g.editor}`));

    if (toAdd.length === 0) {
      res.status(409).json({ error: 'Games already exist for user' });
      return;
    }

    const userFile = getUserGamesTargetFile(userId, false);
    let nextContent = fs.readFileSync(userFile, 'utf8');
    const reviewOptions = (rating != null || ratingComment != null) ? { rating, ratingComment } : undefined;
    for (const game of toAdd) {
      const stored = findGamelistGame(userId, game.title, game.editor);
      const played = buildPlayedGame(stored, game.incoming, reviewOptions);
      nextContent = appendObjectToArrayFile(userFile, formatGameObject(played));
      fs.writeFileSync(userFile, nextContent, 'utf8');
    }

    const gamelistFiles = getUserGamelistFiles(userId);
    const title = normalizeString(toAdd[0].title, 'title');
    const editor = normalizeString(toAdd[0].editor, 'editor');
    let updated = false;
    for (const file of gamelistFiles) {
      const content = fs.readFileSync(file, 'utf8');
      try {
        const updatedContent = removeGameFromFile(content, { title, editor });
        fs.writeFileSync(file, updatedContent, 'utf8');
        updated = true;
        break;
      } catch (e: any) {
        if (e.message !== 'Game not found') throw e;
      }
    }
    if (!updated) {
      res.status(404).json({ error: 'Game not found in gamelist' });
      return;
    }

    res.json({ ok: true, added: toAdd.length, file: userFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;
export {};
