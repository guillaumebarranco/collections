const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateBdInFile,
  updateBdIdentityInFile,
  updateBaseBdInFiles,
  getUserBdsFiles,
  getUserReadlistBdsFiles,
} = require('../../utils/bds/bds-utils');
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
    const writer = normalizeString(input.writer, 'writer');
    if (!title || !writer) {
      res.status(400).json({ error: 'Missing title or writer' });
      return;
    }

    const payload = {
      title,
      writer,
      rating: normalizeNumber(input.rating, 'rating') ?? 0,
      readTimes: normalizeNumber(input.readTimes, 'readTimes') ?? 1,
      readDate: normalizeString(input.readDate, 'readDate') || '',
      owned: normalizeBoolean(input.owned, 'owned') ?? false,
      readPriority: normalizeNumber(input.readPriority, 'readPriority') ?? 1,
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
      const bdFiles = [
        ...getUserBdsFiles(userId),
        ...getUserReadlistBdsFiles(userId),
      ];
      if (!bdFiles.length) {
        res.status(404).json({ error: 'User bds not found' });
        return;
      }

      for (const filePath of bdFiles) {
        if (updateBdInFile(filePath, payload)) {
          updatedCount += 1;
        }
      }

      if (!updatedCount) {
        res.status(404).json({ error: 'Bd not found' });
        return;
      }
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      const originalTitle = normalizeString(
        input.originalTitle,
        'originalTitle'
      );
      const originalWriter = normalizeString(
        input.originalWriter,
        'originalWriter'
      );
      baseUpdatedFile = updateBaseBdInFiles({
        title,
        writer,
        matchTitle: originalTitle || title,
        matchWriter: originalWriter || writer,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        pages: normalizeNumber(entityPayload.pages, 'pages'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        nbTomes: normalizeNumber(entityPayload.nbTomes, 'nbTomes'),
        isFinished: normalizeBoolean(entityPayload.isFinished, 'isFinished'),
        designer: normalizeString(entityPayload.designer, 'designer'),
      });

      if (originalTitle || originalWriter) {
        const users = loadUsers();
        const matchTitle = originalTitle || title;
        const matchWriter = originalWriter || writer;
        users.forEach((user: any) => {
          try {
            const files = [
              ...getUserBdsFiles(user.username),
              ...getUserReadlistBdsFiles(user.username),
            ];
            files.forEach((filePath: string) => {
              updateBdIdentityInFile(filePath, {
                matchTitle,
                matchWriter,
                title,
                writer,
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
