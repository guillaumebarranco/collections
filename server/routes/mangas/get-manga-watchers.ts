const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserMangasFiles,
  parseMangasFromFile,
} = require('../../utils/mangas/mangas-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserManga } from '../../../src/app/models/manga-model';

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

router.get('/manga-watchers', (req: any, res: any) => {
  try {
    const title = normalizeString(req.query.title, 'title');
    const author = normalizeString(req.query.author, 'author');
    if (!title?.trim() || !author?.trim()) {
      return res
        .status(400)
        .json({ error: 'Query params title and author are required' });
    }

    const targetTitle = title.trim();
    const targetAuthor = author.trim();
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
        const files = getUserMangasFiles(rawUserId);
        const mangas: UserManga[] = files.flatMap((f: string) =>
          parseMangasFromFile(fs.readFileSync(f, 'utf8'))
        );
        const match = mangas.find(
          (m) =>
            m.title === targetTitle &&
            m.author === targetAuthor &&
            (m.readTimes ?? 0) >= 1
        );
        if (match) {
          results.push({
            userId: normalizeUsername(rawUserId),
            rating: match.rating ?? 0,
            timesWatched: match.readTimes ?? 0,
          });
        }
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
