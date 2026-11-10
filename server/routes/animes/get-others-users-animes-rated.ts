const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserAnimesFiles,
  parseAnimesFromFile,
} = require('../../utils/animes/animes-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserAnimeFileRow } from '../../../src/app/models/anime-model';

type OthersRatedAnimeEntry = Pick<UserAnimeFileRow, 'title' | 'director'> & {
  /** Moyenne des notes par saison (calculée côté API). */
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

router.get('/others-users-animes-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedAnimeEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const animeFiles = getUserAnimesFiles(userId);
        const animes: UserAnimeFileRow[] = animeFiles.flatMap((animeFile: string) => {
          const fileContent = fs.readFileSync(animeFile, 'utf8');
          return parseAnimesFromFile(fileContent);
        });

        animes
          .filter((anime) => {
            // Pour les animés, on prend la note moyenne des saisons
            const seasons = anime.seasons || [];
            if (seasons.length === 0) return false;
            const avgRating =
              seasons.reduce((sum, s) => sum + (s.seasonRating || 0), 0) /
              seasons.length;
            return avgRating >= minRating;
          })
          .forEach((anime) => {
            const seasons = anime.seasons || [];
            const avgRating =
              seasons.length > 0
                ? seasons.reduce((sum, s) => sum + (s.seasonRating || 0), 0) /
                  seasons.length
                : 0;
            results.push({
              title: anime.title,
              director: anime.director,
              rating: avgRating,
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
