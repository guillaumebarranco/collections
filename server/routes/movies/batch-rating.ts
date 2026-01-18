const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeString,
  updateMovieInFile,
  getUserMoviesFiles,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

router.post('/batch-rating', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const movies = Array.isArray(input.movies) ? input.movies : [];
    if (movies.length === 0) {
      res.status(400).json({ error: 'Missing movies' });
      return;
    }

    const movieFiles = getUserMoviesFiles(userId).filter(
      (filePath: string) => !filePath.includes('watchlist')
    );
    const fileState = new Map(
      movieFiles.map((filePath: string) => [
        filePath,
        { content: fs.readFileSync(filePath, 'utf8'), dirty: false },
      ])
    );

    const missing: { title: string; director: string }[] = [];
    let updatedCount = 0;

    for (const rawMovie of movies) {
      const title = normalizeString(rawMovie?.title, 'title');
      const director = normalizeString(rawMovie?.director, 'director');
      if (!title || !director) {
        res.status(400).json({ error: 'Missing title or director' });
        return;
      }

      const payload = {
        title,
        director,
        rating: normalizeNumber(rawMovie?.rating, 'rating'),
      };

      let updated = false;
      for (const [filePath, state] of fileState.entries()) {
        const stateObject = state as { content: string; dirty: boolean };
        try {
          const nextContent = updateMovieInFile(stateObject.content, payload);
          stateObject.content = nextContent;
          stateObject.dirty = true;
          updated = true;
          updatedCount += 1;
          break;
        } catch (error: any) {
          if (error.message !== 'Movie not found') {
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
