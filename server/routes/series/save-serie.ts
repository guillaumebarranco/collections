const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateSerieInFile,
  updateBaseSerieInFiles,
  getUserSeriesFiles,
} = require('../../utils/series/series-utils');
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
    const director = normalizeString(input.director, 'director');
    if (!title || !director) {
      res.status(400).json({ error: 'Missing title or director' });
      return;
    }

    const payload = {
      title,
      director,
      seasons: Array.isArray(input.seasons) ? input.seasons : undefined,
      owned: normalizeBoolean(input.owned, 'owned'),
    };

    const entityPayload = input.entity || null;
    if (entityPayload && !isAdminUser(userId)) {
      res.status(403).json({ error: 'Admin required to edit entity data' });
      return;
    }

    const serieFiles = getUserSeriesFiles(userId);
    let updatedFile: string | null = null;

    for (const serieFile of serieFiles) {
      const fileContent = fs.readFileSync(serieFile, 'utf8');
      try {
        const updatedContent = updateSerieInFile(fileContent, payload);
        fs.writeFileSync(serieFile, updatedContent, 'utf8');
        updatedFile = serieFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Serie not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Serie not found' });
      return;
    }

    let baseUpdatedFile: string | null = null;
    if (entityPayload) {
      baseUpdatedFile = updateBaseSerieInFiles({
        title,
        director,
        actors: Array.isArray(entityPayload.actors)
          ? entityPayload.actors
          : undefined,
        coverUrl: normalizeString(entityPayload.coverUrl, 'coverUrl'),
        releaseDate: normalizeString(entityPayload.releaseDate, 'releaseDate'),
        endDate: normalizeString(entityPayload.endDate, 'endDate'),
        genre: normalizeString(entityPayload.genre, 'genre'),
        seasonsData: Array.isArray(entityPayload.seasonsData)
          ? entityPayload.seasonsData
          : undefined,
      });
    }

    res.json({
      ok: true,
      serie: { title: payload.title, director: payload.director },
      file: updatedFile,
      baseFile: baseUpdatedFile,
    });

    console.log(
      'serie:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        director: payload.director,
        owned: payload.owned,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
