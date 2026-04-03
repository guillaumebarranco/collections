const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserMangasFiles,
  parseMangasFromFile,
} = require('../../utils/mangas/mangas-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserManga } from '../../../src/app/models/manga-model';

type OthersRatedMangaEntry = Pick<UserManga, 'title' | 'author'> & {
  rating: number;
  userId: string;
};

const router = express.Router();

function getFollowedUserIdsFromQuery(req: any): string[] {
  const raw = req.query.followedUserIds;
  if (raw == null || typeof raw !== 'string' || !raw.trim()) return [];
  return raw
    .split(',')
    .map((s: string) => normalizeUsername(s.trim()))
    .filter(Boolean);
}

router.get('/others-users-mangas-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedMangaEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const mangaFiles = getUserMangasFiles(userId);
        const mangas: UserManga[] = mangaFiles.flatMap((mangaFile: string) => {
          const fileContent = fs.readFileSync(mangaFile, 'utf8');
          return parseMangasFromFile(fileContent);
        });

        mangas
          .filter((manga) => (manga.rating ?? 0) >= minRating)
          .forEach((manga) => {
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
