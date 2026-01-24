const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateBookInFile,
  updateBaseBookInFiles,
  getUserBooksFiles,
} = require('../../utils/books/books-utils');
const { isAdminUser } = require('../../utils/users/users-utils');

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
      readDate: normalizeString(input.readDate, 'readDate'),
      owned: normalizeBoolean(input.owned, 'owned'),
    };

    const entityPayload = input.entity || null;
    if (entityPayload && !isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required to edit entity data' });
      return;
    }

    const bookFiles = getUserBooksFiles(userId);
    let updatedFile: string | null = null;

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

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      baseUpdatedFile = updateBaseBookInFiles({
        title,
        author,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        pages: normalizeNumber(entityPayload.pages, 'pages'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        saga: normalizeString(entityPayload.saga, 'saga'),
        sagaOrder: normalizeNumber(entityPayload.sagaOrder, 'sagaOrder'),
        nbTomes: normalizeNumber(entityPayload.nbTomes, 'nbTomes'),
        isFinished: normalizeBoolean(entityPayload.isFinished, 'isFinished'),
      });
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
        readDate: payload.readDate,
        owned: payload.owned,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
