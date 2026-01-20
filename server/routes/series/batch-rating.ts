const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  updateSerieInFile,
  getUserSeriesFiles,
} = require('../../utils/series/series-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const series = Array.isArray(input.series) ? input.series : [];
    if (series.length === 0) {
      res.status(400).json({ error: 'Missing series' });
      return;
    }

    const serieFiles = getUserSeriesFiles(userId);
    const fileState = new Map(
      serieFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; director: string }[] = [];
    let updatedCount = 0;

    for (const rawSerie of series) {
      const title = normalizeString(rawSerie?.title, 'title');
      const director = normalizeString(rawSerie?.director, 'director');
      if (!title || !director) {
        res.status(400).json({ error: 'Missing title or director' });
        return;
      }

      const payload = {
        title,
        director,
        seasons: Array.isArray(rawSerie?.seasons) ? rawSerie.seasons : undefined,
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateSerieInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Serie not found') {
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
