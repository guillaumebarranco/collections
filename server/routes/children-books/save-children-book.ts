const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  normalizeGenre,
  updateChildrenBookInFile,
  updateChildrenBookIdentityInFile,
  updateBaseChildrenBookInFiles,
  getUserChildrenBooksFiles,
  getUserReadlistChildrenBooksFiles,
} = require('../../utils/children-books/children-books-utils');
const { isAdminUser, loadUsers } = require('../../utils/users/users-utils');

/** Payload passé à updateChildrenBookInFile (champs optionnels seulement si présents dans le body). */
interface SaveChildrenBookUserPayload {
  title: string;
  author: string;
  rating: number | undefined;
  readTimes: number | undefined;
  reading: boolean;
  firstReadDate: string | undefined;
  lastReadDate: string | undefined;
  otherReadDates?: string[];
  owned: boolean | undefined;
  borrowed: string;
  loaned: string;
  readPriority: number | undefined;
  wantToReadAgain: boolean;
  ratingComment: string;
}

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

    const payload: SaveChildrenBookUserPayload = {
      title,
      author,
      rating: normalizeNumber(input.rating, 'rating'),
      readTimes: normalizeNumber(input.readTimes, 'readTimes'),
      reading: normalizeBoolean(input.reading, 'reading') ?? false,
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

    if (Array.isArray(input.otherReadDates)) {
      payload.otherReadDates = input.otherReadDates.filter(
        (d: unknown) => typeof d === 'string' && d.trim()
      );
    }

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
      const childrenBookFiles = [
        ...getUserChildrenBooksFiles(userId),
        ...getUserReadlistChildrenBooksFiles(userId),
      ];
      for (const childrenBookFile of childrenBookFiles) {
        const fileContent = fs.readFileSync(childrenBookFile, 'utf8');
        try {
          const updatedContent = updateChildrenBookInFile(fileContent, payload);
          fs.writeFileSync(childrenBookFile, updatedContent, 'utf8');
          updatedFile = childrenBookFile;
          break;
        } catch (error: any) {
          if (error.message !== 'ChildrenBook not found') {
            throw error;
          }
        }
      }

      if (!updatedFile) {
        res.status(404).json({ error: 'ChildrenBook not found' });
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
      baseUpdatedFile = updateBaseChildrenBookInFiles({
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
        selectDisplayOrder: normalizeNumber(
          entityPayload.selectDisplayOrder,
          'selectDisplayOrder'
        ),
      });

      if (originalTitle || originalAuthor) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchAuthor = originalAuthor || author;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserChildrenBooksFiles(user.username),
              ...getUserReadlistChildrenBooksFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              const fileContent = fs.readFileSync(filePath, 'utf8');
              try {
                const updated = updateChildrenBookIdentityInFile(fileContent, {
                  matchTitle,
                  matchAuthor,
                  title,
                  author,
                });
                fs.writeFileSync(filePath, updated, 'utf8');
              } catch (error: any) {
                if (error.message !== 'ChildrenBook not found') {
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
      childrenBook: { title: payload.title, author: payload.author },
      file: updatedFile,
      baseFile: baseUpdatedFile,
    });

    console.log(
      'children-book:update',
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
