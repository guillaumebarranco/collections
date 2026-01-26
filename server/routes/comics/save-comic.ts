const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateComicInFile,
  updateBaseComicInFiles,
  getUserComicsFiles,
} = require('../../utils/comics/comics-utils');
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
    };

    const entityPayload = input.entity || null;
    if (entityPayload && !isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required to edit entity data' });
      return;
    }

    const comicFiles = getUserComicsFiles(userId);
    if (!comicFiles.length) {
      res.status(404).json({ error: 'User comics not found' });
      return;
    }

    let updatedCount = 0;
    for (const filePath of comicFiles) {
      if (updateComicInFile(filePath, payload)) {
        updatedCount += 1;
      }
    }

    if (!updatedCount) {
      res.status(404).json({ error: 'Comic not found' });
      return;
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      baseUpdatedFile = updateBaseComicInFiles({
        title,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        pages: normalizeNumber(entityPayload.pages, 'pages'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        writer: normalizeString(entityPayload.writer, 'writer'),
      });
    }

    res.json({ ok: true, updated: updatedCount, baseFile: baseUpdatedFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
