const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeAnimeFromFile,
  getUserAnimesFiles,
} = require('../../utils/animes/animes-utils');

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

    const animeFiles = getUserAnimesFiles(userId);
    let updatedFile: string | null = null;

    for (const animeFile of animeFiles) {
      const fileContent = fs.readFileSync(animeFile, 'utf8');
      try {
        const updatedContent = removeAnimeFromFile(fileContent, {
          title,
          director,
        });
        fs.writeFileSync(animeFile, updatedContent, 'utf8');
        updatedFile = animeFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Anime not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Anime not found' });
      return;
    }

    res.json({
      ok: true,
      anime: { title, director },
      file: updatedFile,
    });

    console.log(
      'anime:delete',
      JSON.stringify({ file: updatedFile, title, director })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
