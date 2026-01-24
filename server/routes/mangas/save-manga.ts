const express = require('express');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateMangaInFile,
  updateBaseMangaInFiles,
  getUserMangasFiles,
} = require('../../utils/mangas/mangas-utils');
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

    const mangaFiles = getUserMangasFiles(userId);
    if (!mangaFiles.length) {
      res.status(404).json({ error: 'User mangas not found' });
      return;
    }

    let updatedCount = 0;
    for (const filePath of mangaFiles) {
      if (updateMangaInFile(filePath, payload)) {
        updatedCount += 1;
      }
    }

    if (!updatedCount) {
      res.status(404).json({ error: 'Manga not found' });
      return;
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      baseUpdatedFile = updateBaseMangaInFiles({
        title,
        author,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        pages: normalizeNumber(entityPayload.pages, 'pages'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        nbTomes: normalizeNumber(entityPayload.nbTomes, 'nbTomes'),
        isFinished: normalizeBoolean(entityPayload.isFinished, 'isFinished'),
      });
    }

    res.json({ ok: true, updated: updatedCount, baseFile: baseUpdatedFile });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
