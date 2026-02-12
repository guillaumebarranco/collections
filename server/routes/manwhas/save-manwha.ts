const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateManwhaInFile,
  updateManwhaIdentityInFile,
  updateBaseManwhaInFiles,
  getUserManwhasFiles,
  getUserReadlistManwhasFiles,
} = require('../../utils/manwhas/manwhas-utils');
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
      rating: normalizeNumber(input.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(input.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(input.readDate, 'readDate') || '',
      owned: normalizeBoolean(input.owned, 'owned') ?? false,
      readPriority: normalizeNumber(input.readPriority, 'readPriority') ?? 1,
      wantToReadAgain: normalizeBoolean(input.wantToReadAgain, 'wantToReadAgain') ?? false,
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

    let updatedCount = 0;
    if (!entityOnly) {
      const manwhaFiles = [
        ...getUserManwhasFiles(userId),
        ...getUserReadlistManwhasFiles(userId),
      ];
      if (!manwhaFiles.length) {
        res.status(404).json({ error: 'User manwhas not found' });
        return;
      }

      for (const filePath of manwhaFiles) {
        if (updateManwhaInFile(filePath, payload)) {
          updatedCount += 1;
        }
      }

      if (!updatedCount) {
        res.status(404).json({ error: 'Manwha not found' });
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
      baseUpdatedFile = updateBaseManwhaInFiles({
        title,
        author,
        matchTitle: originalTitle || title,
        matchAuthor: originalAuthor || author,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        nbChapters: normalizeNumber(entityPayload.nbChapters, 'nbChapters'),
        isFinished: normalizeBoolean(entityPayload.isFinished, 'isFinished'),
        description: normalizeString(entityPayload.description, 'description') ?? '',
      });

      if (originalTitle || originalAuthor) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchAuthor = originalAuthor || author;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserManwhasFiles(user.username),
              ...getUserReadlistManwhasFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              updateManwhaIdentityInFile(filePath, {
                matchTitle,
                matchAuthor,
                title,
                author,
              });
            });
          } catch (error: any) {
            if (!String(error.message || '').includes('not found')) {
              throw error;
            }
          }
        });
      }
    }

    res.json({ ok: true, updated: updatedCount, baseFile: baseUpdatedFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
