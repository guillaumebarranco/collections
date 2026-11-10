const express = require('express');
const fs = require('fs');
const {
  normalizeBoolean,
  normalizeString,
  updateAnimeInFile,
  getUserAnimesFiles,
} = require('../../utils/animes/animes-utils');

const router = express.Router();

router.post('/batch-owned', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const animes = Array.isArray(input.animes) ? input.animes : [];
    if (animes.length === 0) {
      res.status(400).json({ error: 'Missing animes' });
      return;
    }

    const animeFiles = getUserAnimesFiles(userId);
    const fileState = new Map(
      animeFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; director: string }[] = [];
    let updatedCount = 0;

    for (const rawAnime of animes) {
      const title = normalizeString(rawAnime?.title, 'title');
      const director = normalizeString(rawAnime?.director, 'director');
      if (!title || !director) {
        res.status(400).json({ error: 'Missing title or director' });
        return;
      }

      const payload = {
        title,
        director,
        owned: normalizeBoolean(rawAnime?.owned, 'owned'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateAnimeInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Anime not found') {
            throw error;
          }
        }
      }

      if (!updated) {
        missing.push({ title, director });
      }
    }

    for (const [filePath, state] of fileState.entries()) {
      const stateObject = state as { content: string; dirty: boolean };
      if (!stateObject.dirty) continue;
      fs.writeFileSync(filePath, stateObject.content, 'utf8');
    }

    res.json({
      ok: true,
      updatedCount,
      missing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
