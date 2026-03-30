const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeGenre,
  updateBookInFile,
  updateBookIdentityInFile,
  updateBaseBookInFiles,
  getUserBooksFiles,
  getUserReadlistBooksFiles,
} = require('../../utils/books/books-utils');
const { isAdminUser, loadUsers } = require('../../utils/users/users-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};

    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const title = normalizeString(input.title, 'title');
    const author = normalizeString(input.author, 'author');
    if (!title || !author) {
      res.status(400).json({ error: 'Missing title or author' });
      return;
    }

    const payload = {
      title,
      author,
      rating: normalizeNumber(input.rating, 'rating'),
      readTimes: normalizeNumber(input.readTimes, 'readTimes'),
      firstReadDate: normalizeString(input.firstReadDate, 'firstReadDate'),
      lastReadDate: normalizeString(input.lastReadDate, 'lastReadDate'),
      owned: normalizeBoolean(input.owned, 'owned'),
      borrowed: normalizeString(input.borrowed, 'borrowed') ?? '',
      loaned: normalizeString(input.loaned, 'loaned') ?? '',
      readPriority: normalizeNumber(input.readPriority, 'readPriority'),
      wantToReadAgain:
        normalizeBoolean(input.wantToReadAgain, 'wantToReadAgain') ?? false,
      ratingComment: normalizeString(input.ratingComment, 'ratingComment') ?? '',
    };

    const entityPayload = input.entity || null;
    const entityOnly = Boolean(input.entityOnly);
    if ((entityPayload || entityOnly) && !isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required to edit entity data' });
      return;
    }
    if (entityPayload && !entityOnly) {
      res.status(400).json({
        error: 'Entity updates are only allowed from admin view',
      });
      return;
    }

    let updatedFile: string | null = null;

    if (!entityOnly) {
      const bookFiles = [
        ...getUserBooksFiles(userId),
        ...getUserReadlistBooksFiles(userId),
      ];
      for (const bookFile of bookFiles) {
        const fileContent = fs.readFileSync(bookFile, 'utf8');
        try {
          const updatedContent = updateBookInFile(fileContent, payload);
          fs.writeFileSync(bookFile, updatedContent, 'utf8');
          updatedFile = bookFile;
          break;
        } catch (error: any) {
          if (error.message !== 'Book not found') {
            throw error;
          }
        }
      }

      if (!updatedFile) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      const originalTitle = normalizeString(
        input.originalTitle,
        'originalTitle'
      );
      const originalAuthor = normalizeString(
        input.originalAuthor,
        'originalAuthor'
      );
      baseUpdatedFile = updateBaseBookInFiles({
        title,
        author,
        matchTitle: originalTitle || title,
        matchAuthor: originalAuthor || author,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        pages: normalizeNumber(entityPayload.pages, 'pages'),
        genre:
          entityPayload.genre !== undefined && entityPayload.genre !== null
            ? normalizeGenre(entityPayload.genre)
            : undefined,
        saga: normalizeString(entityPayload.saga, 'saga'),
        sagaOrder: normalizeNumber(entityPayload.sagaOrder, 'sagaOrder'),
        sagaFinished: normalizeBoolean(
          entityPayload.sagaFinished,
          'sagaFinished'
        ),
        releaseDate: normalizeString(entityPayload.releaseDate, 'releaseDate'),
        description: normalizeString(entityPayload.description, 'description') ?? '',
        countryOrigin:
          entityPayload.countryOrigin != null
            ? normalizeString(entityPayload.countryOrigin, 'countryOrigin')
            : '',
      });

      if (originalTitle || originalAuthor) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchAuthor = originalAuthor || author;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserBooksFiles(user.username),
              ...getUserReadlistBooksFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              try {
                const updated = updateBookIdentityInFile(fileContent, {
                  matchTitle,
                  matchAuthor,
                  title,
                  author,
                });
                fs.writeFileSync(filePath, updated, 'utf8');
              } catch (error: any) {
                if (error.message !== 'Book not found') {
                  throw error;
                }
              }
            });
          } catch (error: any) {
            if (!String(error.message || '').includes('not found')) {
              throw error;
            }
          }
        });
      }
    }

    res.json({
      ok: true,
      book: { title: payload.title, author: payload.author },
      file: updatedFile,
      baseFile: baseUpdatedFile,
    });

    console.log(
      'book:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        author: payload.author,
        rating: payload.rating,
        readTimes: payload.readTimes,
        firstReadDate: payload.firstReadDate,
        lastReadDate: payload.lastReadDate,
        owned: payload.owned,
        borrowed: payload.borrowed,
        loaned: payload.loaned,
        readPriority: payload.readPriority,
        wantToReadAgain: payload.wantToReadAgain,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
