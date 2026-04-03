const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserBdsFiles,
  parseBdsFromFile,
} = require('../../utils/bds/bds-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserBd } from '../../../src/app/models/bd-model';

type OthersRatedBdEntry = Pick<UserBd, 'title' | 'writer'> & {
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

router.get('/others-users-bds-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedBdEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const bdFiles = getUserBdsFiles(userId);
        const bds: UserBd[] = bdFiles.flatMap((bdFile: string) => {
          const fileContent = fs.readFileSync(bdFile, 'utf8');
          return parseBdsFromFile(fileContent);
        });

        bds
          .filter((bd) => (bd.rating ?? 0) >= minRating)
          .forEach((bd) => {
            results.push({
              title: bd.title,
              writer: bd.writer,
              rating: bd.rating ?? 0,
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
