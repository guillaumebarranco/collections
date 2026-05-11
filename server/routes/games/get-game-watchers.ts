const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserGamesFiles,
  parseGamesFromFile,
} = require('../../utils/games/games-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserGame } from '../../../src/app/models/game-model';

const router = express.Router();

const USERS_DIR = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'src',
  'app',
  'utils',
  'users'
);

function finishedCount(game: UserGame): number {
  return (game.sessions ?? []).filter((s) => s.finishedGame).length;
}

router.get('/game-watchers', (req: any, res: any) => {
  try {
    const title = normalizeString(req.query.title, 'title');
    const editor = normalizeString(req.query.editor, 'editor');
    if (!title?.trim() || !editor?.trim()) {
      return res
        .status(400)
        .json({ error: 'Query params title and editor are required' });
    }

    const targetTitle = title.trim();
    const targetEditor = editor.trim();
    const results: { userId: string; rating: number; timesWatched: number }[] =
      [];

    if (!fs.existsSync(USERS_DIR)) {
      return res.json(results);
    }

    const entries = fs.readdirSync(USERS_DIR, { withFileTypes: true });
    for (const ent of entries) {
      if (!ent.isDirectory()) continue;
      const rawUserId = ent.name;
      try {
        const files = getUserGamesFiles(rawUserId);
        const games: UserGame[] = files.flatMap((f: string) =>
          parseGamesFromFile(fs.readFileSync(f, 'utf8'))
        );
        const match = games.find(
          (g) => g.title === targetTitle && g.editor === targetEditor
        );
        if (!match) continue;
        const n = finishedCount(match);
        if (n <= 0) continue;
        results.push({
          userId: normalizeUsername(rawUserId),
          rating: match.rating ?? 0,
          timesWatched: n,
        });
      } catch (error: any) {
        if (!String(error.message || '').includes('not found')) {
          throw error;
        }
      }
    }

    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
