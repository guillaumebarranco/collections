const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeMovieFromFile,
  getUserMoviesFiles,
} = require('../../utils/movies/movies-utils');

const router = express.Router();

router.post('/delete', (req: any, res: any) => {
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

    const movieFiles = getUserMoviesFiles(userId);
    let updatedFile: string | null = null;

    for (const movieFile of movieFiles) {
      const fileContent = fs.readFileSync(movieFile, 'utf8');
      try {
        const updatedContent = removeMovieFromFile(fileContent, {
          title,
          director,
        });
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
      movie: { title, director },
      file: updatedFile,
    });

    console.log(
      'movie:delete',
      JSON.stringify({ file: updatedFile, title, director })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
