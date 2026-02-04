const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserComicsFiles,
  parseComicsFromFile,
} = require('../../utils/comics/comics-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-comics-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const users = loadUsers();
    const otherUsers = users
      .map((user: any) => user.username)
      .filter(
        (username: string) => normalizeUsername(username) !== normalizedUserId
      );

    const results: any[] = [];
    for (const userId of otherUsers) {
      try {
        const comicFiles = getUserComicsFiles(userId);
        const comics = comicFiles.flatMap((comicFile: string) => {
          const fileContent = fs.readFileSync(comicFile, 'utf8');
          return parseComicsFromFile(fileContent);
        });

        comics
          .filter((comic: any) => (comic.rating ?? 0) >= minRating)
          .forEach((comic: any) => {
            results.push({
              title: comic.title,
              writer: comic.writer,
              rating: comic.rating ?? 0,
              userId,
            });
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
