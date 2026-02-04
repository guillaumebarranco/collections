const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserMangasFiles,
  parseMangasFromFile,
} = require('../../utils/mangas/mangas-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-mangas-rated', (req: any, res: any) => {
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
        const mangaFiles = getUserMangasFiles(userId);
        const mangas = mangaFiles.flatMap((mangaFile: string) => {
          const fileContent = fs.readFileSync(mangaFile, 'utf8');
          return parseMangasFromFile(fileContent);
        });

        mangas
          .filter((manga: any) => (manga.rating ?? 0) >= minRating)
          .forEach((manga: any) => {
            results.push({
              title: manga.title,
              author: manga.author,
              rating: manga.rating ?? 0,
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
