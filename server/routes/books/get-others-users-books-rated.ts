const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  getUserBooksFiles,
  parseBooksFromFile,
} = require('../../utils/books/books-utils');
const { loadUsers, normalizeUsername } = require('../../utils/users/users-utils');

const router = express.Router();

router.get('/others-users-books-rated', (req: any, res: any) => {
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
        const bookFiles = getUserBooksFiles(userId);
        const books = bookFiles.flatMap((bookFile: string) => {
          const fileContent = fs.readFileSync(bookFile, 'utf8');
          return parseBooksFromFile(fileContent);
        });

        books
          .filter((book: any) => (book.rating ?? 0) >= minRating)
          .forEach((book: any) => {
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
