const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  normalizeString,
  getUserChildrenBooksFiles,
  parseChildrenBooksFromFile,
} = require('../../utils/children-books/children-books-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserChildrenBook } from '../../../src/app/models/children-book-model';

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

router.get('/childrenBook-watchers', (req: any, res: any) => {
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
        const files = getUserChildrenBooksFiles(rawUserId);
        const childrenBooks: UserChildrenBook[] = files.flatMap((f: string) =>
          parseChildrenBooksFromFile(fs.readFileSync(f, 'utf8'))
        );
        const match = childrenBooks.find(
          (b) =>
            b.title === targetTitle &&
            b.author === targetAuthor &&
            (b.readTimes ?? 0) >= 1
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
