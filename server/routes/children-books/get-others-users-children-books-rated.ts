const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserChildrenBooksFiles,
  parseChildrenBooksFromFile,
} = require('../../utils/children-books/children-books-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { UserChildrenBook } from '../../../src/app/models/children-book-model';

type OthersRatedChildrenBookEntry = Pick<UserChildrenBook, 'title' | 'author'> & {
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

router.get('/others-users-children-books-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedChildrenBookEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const childrenBookFiles = getUserChildrenBooksFiles(userId);
        const childrenBooks: UserChildrenBook[] = childrenBookFiles.flatMap((childrenBookFile: string) => {
          const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
          return parseChildrenBooksFromFile(fileContent);
        });
        childrenBooks
          .filter((childrenBook) => (childrenBook.rating ?? 0) >= minRating)
          .forEach((childrenBook) => {
            results.push({
              title: childrenBook.title,
              author: childrenBook.author,
              rating: childrenBook.rating ?? 0,
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
