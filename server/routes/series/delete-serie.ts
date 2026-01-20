const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  removeSerieFromFile,
  getUserSeriesFiles,
} = require('../../utils/series/series-utils');

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

    const serieFiles = getUserSeriesFiles(userId);
    let updatedFile: string | null = null;

    for (const serieFile of serieFiles) {
      const fileContent = fs.readFileSync(serieFile, 'utf8');
      try {
        const updatedContent = removeSerieFromFile(fileContent, {
          title,
          director,
        });
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

    res.json({
      ok: true,
      serie: { title, director },
      file: updatedFile,
    });

    console.log(
      'serie:delete',
      JSON.stringify({ file: updatedFile, title, director })
    );
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
