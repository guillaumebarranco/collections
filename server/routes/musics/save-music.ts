const express = require('express');
const fs = require('fs');
const {
  normalizeString,
  updateMusicInFile,
  getUserMusicsFiles,
} = require('../../utils/musics/musics-utils');

const router = express.Router();

router.post('/', (req: any, res: any) => {
  try {
    const input = req.body || {};
    const userId = normalizeString(input.userId, 'userId');
    const title = normalizeString(input.title, 'title');
    const artist = normalizeString(input.artist, 'artist');
    if (!userId || !title || !artist) {
      res.status(400).json({ error: 'Missing userId, title or artist' });
      return;
    }
    if (!Array.isArray(input.quotes)) {
      res.status(400).json({ error: 'Missing quotes' });
      return;
    }

    const quotes = input.quotes
      .filter((quote: unknown) => typeof quote === 'string' && quote.trim())
      .map((quote: string) => quote.trim());

    const musicFiles = getUserMusicsFiles(userId);
    let updatedFile: string | null = null;
    for (const musicFile of musicFiles) {
      const fileContent = fs.readFileSync(musicFile, 'utf8');
      try {
        const updatedContent = updateMusicInFile(fileContent, {
          title,
          artist,
          quotes,
        });
        fs.writeFileSync(musicFile, updatedContent, 'utf8');
        updatedFile = musicFile;
        break;
      } catch (error: any) {
        if (error.message !== 'Music not found') {
          throw error;
        }
      }
    }

    if (!updatedFile) {
      res.status(404).json({ error: 'Music not found' });
      return;
    }

    res.json({ ok: true, title, artist, quotes });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
});

module.exports = router;

export {};
