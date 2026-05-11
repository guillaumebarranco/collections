const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserComicsFiles,
  parseComicsFromFile,
} = require('../../utils/comics/comics-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserComic } from '../../../src/app/models/comic-model';

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

router.get('/comic-watchers', (req: any, res: any) => {
  try {
    const title = normalizeString(req.query.title, 'title');
    const writer = normalizeString(req.query.writer, 'writer');
    if (!title?.trim() || !writer?.trim()) {
      return res
        .status(400)
        .json({ error: 'Query params title and writer are required' });
    }

    const targetTitle = title.trim();
    const targetWriter = writer.trim();
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
        const files = getUserComicsFiles(rawUserId);
        const comics: UserComic[] = files.flatMap((f: string) =>
          parseComicsFromFile(fs.readFileSync(f, 'utf8'))
        );
        const match = comics.find(
          (c) =>
            c.title === targetTitle &&
            c.writer === targetWriter &&
            (c.readTimes ?? 0) >= 1
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
