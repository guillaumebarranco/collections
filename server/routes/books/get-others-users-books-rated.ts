const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserBooksFiles,
  parseBooksFromFile,
} = require('../../utils/books/books-utils');
const { normalizeUsername } = require('../../utils/users/users-utils');

import type { Book } from '../../../src/app/models/book-model';

type OthersRatedBookEntry = Pick<Book, 'title' | 'author'> & {
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

router.get('/others-users-books-rated', (req: any, res: any) => {
  try {
    const inputUserId = normalizeString(req.query.userId, 'userId');
    const minRating = normalizeNumber(req.query.minRating, 'minRating') ?? 4;
    const followedUserIds = getFollowedUserIdsFromQuery(req);

    const normalizedUserId = inputUserId ? normalizeUsername(inputUserId) : '';
    const otherUsers =
      followedUserIds.length > 0
        ? followedUserIds.filter((id: string) => id !== normalizedUserId)
        : [];

    const results: OthersRatedBookEntry[] = [];
    for (const userId of otherUsers) {
      try {
        const bookFiles = getUserBooksFiles(userId);
        const books: Book[] = bookFiles.flatMap((bookFile: string) => {
          const fileContent = fs.readFileSync(bookFile, 'utf8');
          return parseBooksFromFile(fileContent);
        });

        books
          .filter((book) => (book.rating ?? 0) >= minRating)
          .forEach((book) => {
            results.push({
              title: book.title,
              author: book.author,
              rating: book.rating ?? 0,
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
