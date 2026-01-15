const express = require('express');
const fs = require('fs');
const {
  normalizeNumber,
  normalizeBoolean,
  normalizeString,
  updateMovieInFile,
  getUserMoviesFiles,
} = require('../../utils/movies/movies-utils');

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
      rating: normalizeNumber(input.rating, 'rating'),
      timesWatched: normalizeNumber(input.timesWatched, 'timesWatched'),
      firstViewedDate: normalizeString(
        input.firstViewedDate,
        'firstViewedDate'
      ),
      lastViewedDate: normalizeString(input.lastViewedDate, 'lastViewedDate'),
      seenAtCinema: normalizeBoolean(input.seenAtCinema, 'seenAtCinema'),
    };

    const movieFiles = getUserMoviesFiles(userId);
    let updatedFile: string | null = null;

    for (const movieFile of movieFiles) {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      try {
        const updatedContent = updateMovieInFile(fileContent, payload);
        fs.writeFileSync(movieFile, updatedContent, 'utf8');
        updatedFile = movieFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Movie not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Movie not found' });
      return;
    }

    res.json({
      ok: true,
      movie: { title: payload.title, director: payload.director },
      file: updatedFile,
    });

    console.log(
      'movie:update',
      JSON.stringify({
        file: updatedFile,
        title: payload.title,
        director: payload.director,
        rating: payload.rating,
        timesWatched: payload.timesWatched,
        firstViewedDate: payload.firstViewedDate,
        lastViewedDate: payload.lastViewedDate,
        seenAtCinema: payload.seenAtCinema,
      })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
